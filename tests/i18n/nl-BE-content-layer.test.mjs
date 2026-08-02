/**
 * Belgium Dutch (nl-BE) sparse country layer checks (content-only; no wiring/build).
 * Base authority: nl-NL. Fallback planned: nl-BE → nl-NL → en.
 * Flemish Standard Dutch; grades = 1ste–6de leerjaar; lagere school / lager onderwijs.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();

function walkJson(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

/** @param {unknown} node @param {string} prefix @param {Map<string, string>} map */
function collectStrings(node, prefix = "", map = new Map()) {
  if (typeof node === "string") {
    map.set(prefix, node);
    return map;
  }
  if (Array.isArray(node)) {
    node.forEach((v, i) => collectStrings(v, prefix ? `${prefix}.${i}` : String(i), map));
    return map;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      collectStrings(v, prefix ? `${prefix}.${k}` : k, map);
    }
  }
  return map;
}

/** @param {unknown} node @param {string} prefix @param {Map<string, string>} map */
function collectTypedLeaves(node, prefix = "", map = new Map()) {
  if (node === null || typeof node === "boolean" || typeof node === "number" || typeof node === "string") {
    map.set(prefix, typeof node);
    return map;
  }
  if (Array.isArray(node)) {
    map.set(prefix, "array");
    node.forEach((v, i) => collectTypedLeaves(v, `${prefix}.${i}`, map));
    return map;
  }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      collectTypedLeaves(v, prefix ? `${prefix}.${k}` : k, map);
    }
  }
  return map;
}

function deepMerge(base, overlay) {
  if (Array.isArray(overlay)) return overlay.slice();
  if (!overlay || typeof overlay !== "object") return overlay;
  const out = base && typeof base === "object" && !Array.isArray(base) ? { ...base } : {};
  for (const [k, v] of Object.entries(overlay)) {
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      out[k] &&
      typeof out[k] === "object" &&
      !Array.isArray(out[k])
    ) {
      out[k] = deepMerge(out[k], v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;

test("nl-BE locales: JSON parse + sparse key existence vs nl-NL", () => {
  const beDir = path.join(ROOT, "locales/nl-BE");
  const nlDir = path.join(ROOT, "locales/nl-NL");
  const files = fs.readdirSync(beDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.length > 0);
  /** @type {string[]} */
  const orphans = [];
  /** @type {string[]} */
  const identical = [];
  /** @type {string[]} */
  const placeholderMismatches = [];
  /** @type {string[]} */
  const typeMismatches = [];
  /** @type {string[]} */
  const emptyFiles = [];

  for (const f of files) {
    const be = JSON.parse(fs.readFileSync(path.join(beDir, f), "utf8"));
    const nl = JSON.parse(fs.readFileSync(path.join(nlDir, f), "utf8"));
    const beLeaves = collectStrings(be);
    const nlLeaves = collectStrings(nl);
    const beTypes = collectTypedLeaves(be);
    const nlTypes = collectTypedLeaves(nl);

    if (beLeaves.size === 0) emptyFiles.push(f);
    assert.ok(beLeaves.size < nlLeaves.size, `${f} must be sparse vs nl-NL`);

    for (const [key, value] of beLeaves) {
      if (!nlLeaves.has(key)) orphans.push(`${f}:${key}`);
      else if (nlLeaves.get(key) === value) identical.push(`${f}:${key}`);
      else {
        const aPh = (value.match(PLACEHOLDER_RE) || []).sort().join("|");
        const bPh = ((nlLeaves.get(key) || "").match(PLACEHOLDER_RE) || []).sort().join("|");
        if (aPh !== bPh) placeholderMismatches.push(`${f}:${key}`);
      }
    }
    for (const [key, t] of beTypes) {
      if (nlTypes.has(key) && nlTypes.get(key) !== t) typeMismatches.push(`${f}:${key}`);
    }
  }

  assert.deepEqual(emptyFiles, [], `empty overrides: ${emptyFiles.join(", ")}`);
  assert.deepEqual(orphans, [], `orphan keys: ${orphans.join(", ")}`);
  assert.deepEqual(identical, [], `identical overrides: ${identical.join(", ")}`);
  assert.deepEqual(placeholderMismatches, [], `placeholder mismatches: ${placeholderMismatches.join(", ")}`);
  assert.deepEqual(typeMismatches, [], `type mismatches: ${typeMismatches.join(", ")}`);
});

test("nl-BE content-packs: sparse contract vs nl-NL (no full copies)", () => {
  const beRoot = path.join(ROOT, "content-packs/nl-BE");
  const nlRoot = path.join(ROOT, "content-packs/nl-NL");
  const files = walkJson(beRoot)
    .map((p) => path.relative(beRoot, p).replace(/\\/g, "/"))
    .sort();
  assert.ok(files.length > 0);

  /** @type {string[]} */
  const orphans = [];
  /** @type {string[]} */
  const identical = [];
  /** @type {string[]} */
  const fullCopies = [];
  let overrideCount = 0;

  for (const rel of files) {
    const be = JSON.parse(fs.readFileSync(path.join(beRoot, rel), "utf8"));
    const nlPath = path.join(nlRoot, rel);
    assert.ok(fs.existsSync(nlPath), `missing nl-NL authority for ${rel}`);
    const nl = JSON.parse(fs.readFileSync(nlPath, "utf8"));
    const beLeaves = collectStrings(be);
    const nlLeaves = collectStrings(nl);
    assert.notEqual(beLeaves.size, 0, `${rel} empty`);

    if (JSON.stringify(be) === JSON.stringify(nl)) fullCopies.push(rel);

    for (const [key, value] of beLeaves) {
      if (!nlLeaves.has(key)) orphans.push(`${rel}:${key}`);
      else if (nlLeaves.get(key) === value) identical.push(`${rel}:${key}`);
      else overrideCount += 1;
    }
  }

  assert.deepEqual(fullCopies, [], `full-copy files: ${fullCopies.join(", ")}`);
  assert.deepEqual(orphans, [], `orphan keys: ${orphans.slice(0, 20).join(", ")}`);
  assert.deepEqual(identical, [], `identical overrides: ${identical.slice(0, 20).join(", ")}`);
  assert.ok(overrideCount > 0);
});

test("nl-BE grade mapping uses 1ste–6de leerjaar", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-BE/common.json"), "utf8"));
  assert.equal(common.grade1, "1ste leerjaar");
  assert.equal(common.grade2, "2de leerjaar");
  assert.equal(common.grade3, "3de leerjaar");
  assert.equal(common.grade4, "4de leerjaar");
  assert.equal(common.grade5, "5de leerjaar");
  assert.equal(common.grade6, "6de leerjaar");

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-BE/learning.json"), "utf8"));
  assert.equal(learning.master.grades.g1, "1ste leerjaar");
  assert.equal(learning.master.grades.g6, "6de leerjaar");
  assert.equal(learning.chooseGrade, "Kies een leerjaar");
  assert.equal(learning.master.currentGrade, "Huidig leerjaar");
});

test("nl-BE leerjaar vs klas: grade labels use leerjaar; school keeps klasgroep for physical class", () => {
  const blobs = [];
  for (const f of fs.readdirSync(path.join(ROOT, "locales/nl-BE")).filter((x) => x.endsWith(".json"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "locales/nl-BE", f), "utf8"));
  }
  for (const p of walkJson(path.join(ROOT, "content-packs/nl-BE"))) {
    blobs.push(fs.readFileSync(p, "utf8"));
  }
  const joined = blobs.join("\n");
  assert.match(joined, /1ste leerjaar/);
  assert.match(joined, /6de leerjaar/);
  assert.doesNotMatch(joined, /"grade1":\s*"Groep 3"/);
  assert.doesNotMatch(joined, /"g1":\s*"Groep 3"/);
  assert.doesNotMatch(joined, /\bGroep [3-8]\b/);
  assert.doesNotMatch(joined, /\bbasisschool\b/i);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-BE/school.json"), "utf8"));
  assert.match(school.portal.classesSubtitle, /leerjaar/);
  assert.match(school.portal.classesSubtitle, /klasgroep|fysieke klas/);
  assert.equal(school.portal.colGrade, "Leerjaar");
  assert.equal(school.communication.detailsFieldClass, "Klasgroep");
  assert.equal(school.portal.choosePhysicalClass, "Kies een klasgroep");
});

test("nl-BE Belgian Dutch school framing; no French leakage in overlays", () => {
  const blobs = [];
  for (const f of fs.readdirSync(path.join(ROOT, "locales/nl-BE")).filter((x) => x.endsWith(".json"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "locales/nl-BE", f), "utf8"));
  }
  for (const p of walkJson(path.join(ROOT, "content-packs/nl-BE"))) {
    blobs.push(fs.readFileSync(p, "utf8"));
  }
  for (const f of fs.readdirSync(path.join(ROOT, "data/help-center/nl-BE")).filter((x) => x.endsWith(".js"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "data/help-center/nl-BE", f), "utf8"));
  }
  const joined = blobs.join("\n");
  assert.match(joined, /lagere school|lager onderwijs/);
  assert.doesNotMatch(joined, /\bprimaire\b/i);
  assert.doesNotMatch(joined, /\bannée\b/i);
  assert.doesNotMatch(joined, /\bChoisis\b/);
  assert.doesNotMatch(joined, /\bélèves\b/i);
});

test("nl-BE je/u consistency on child vs adult surfaces", () => {
  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-BE/learning.json"), "utf8"));
  const childBlob = JSON.stringify(learning);
  assert.match(childBlob, /\bje\b/);
  assert.doesNotMatch(childBlob, /\bU\b/);
  assert.doesNotMatch(childBlob, /\buw\b/i);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-BE/ui.json"), "utf8"));
  const parentBlob = JSON.stringify(ui.parent);
  assert.doesNotMatch(parentBlob, /\bje\b/);
  assert.doesNotMatch(parentBlob, /\bjouw\b/);

  const worksheets = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-BE/worksheets.json"), "utf8"));
  const wsBlob = JSON.stringify(worksheets);
  assert.doesNotMatch(wsBlob, /\bje\b/);
  assert.doesNotMatch(wsBlob, /\bjouw\b/);
});

test("nl-BE Help overlays apply leerjaar without Groep 3–8 / basisschool", async () => {
  const { BY_SECTION_NL_BE, ALL_ARTICLES_NL_BE } = await import("../../data/help-center/nl-BE/index.js");
  assert.ok(ALL_ARTICLES_NL_BE.length > 10);
  const add = BY_SECTION_NL_BE.parents.find((a) => a.slug === "add-students");
  assert.ok(add);
  assert.match(add.summary, /leerjaar/);
  const list = add.blocks.find((b) => b.kind === "list");
  assert.deepEqual(list.items, [
    "1ste leerjaar — grade_1",
    "2de leerjaar — grade_2",
    "tot en met 6de leerjaar — grade_6",
  ]);
  const welcome = BY_SECTION_NL_BE.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeText = welcome.blocks.find(
    (b) => b.kind === "paragraph" && /leerjaar|lagere school/.test(b.text || "")
  ).text;
  assert.match(welcomeText, /1ste tot en met 6de leerjaar|lagere school/);
  assert.doesNotMatch(welcomeText, /Groep 3/);
  assert.doesNotMatch(welcomeText, /basisschool/);

  const choose = BY_SECTION_NL_BE.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.equal(choose.title, "Kies een vak en een leerjaar");
  assert.match(JSON.stringify(choose), /\bjouw leerjaar\b/);
  assert.doesNotMatch(JSON.stringify(choose), /\bU\b/);
});

test("nl-BE does not ship word-meanings, science overlay, or learning-book copies", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/nl-BE.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-nl-BE-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/nl-BE")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "utils/learning-content-nl-BE")), false);
});

test("nl-BE english-page-skills titles: keep English targets; leerjaar chrome only", () => {
  const nl = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/nl-NL/books/english-page-skills.json"), "utf8")
  );
  const be = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/nl-BE/books/english-page-skills.json"), "utf8")
  );
  const merged = deepMerge(nl, be);
  assert.equal(merged.grades.g2.sentence_base.title, "Short sentences — 2de leerjaar");
  assert.equal(merged.grades.g3.grammar_question_frames.title, "Questions — 3de leerjaar");
  assert.equal(merged.grades.g5.grammar_quantifiers.title, "much/veel — 5de leerjaar");
  assert.match(merged.grades.g6.grammar_comparatives.description, /the best \/ the most interesting/);
  assert.match(merged.grades.g6.grammar_comparatives.description, /6de leerjaar/);
  assert.doesNotMatch(merged.grades.g6.grammar_comparatives.description, /Groep 8|reinforce/);
});

test("nl-BE SEO uses lagere school framing", () => {
  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-BE/seo.json"), "utf8"));
  assert.match(seo.homeTitle, /lagere school/);
  assert.match(seo.homeDescription, /lager onderwijs|België/);
  assert.match(seo.learningDescription, /leerjaar/);
  assert.doesNotMatch(seo.homeTitle, /basisschool/);
});

test("nl-BE validation.required + nearby public mash closed", () => {
  const nl = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-NL/validation.json"), "utf8"));
  const be = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-BE/validation.json"), "utf8"));
  const merged = deepMerge(nl, be);
  assert.equal(merged.required, "Dit veld is verplicht.");
  assert.equal(merged.invalidEmail, "Voer een geldig e-mailadres in.");
  assert.match(merged.minLength, /\{min\}/);
  assert.match(merged.maxLength, /\{max\}/);
  assert.doesNotMatch(merged.required, /field is required/i);
  assert.doesNotMatch(JSON.stringify(be), /field is required/i);
});

test("nl-BE demo bar.playTime is Speeltijd; no Spelen time on bar", () => {
  const nl = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/nl-NL/demo/ui.json"), "utf8"));
  const be = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/nl-BE/demo/ui.json"), "utf8"));
  const merged = deepMerge(nl, be);
  assert.equal(merged.bar.playTime, "Speeltijd");
  assert.doesNotMatch(JSON.stringify(merged.bar), /Spelen time/);
  assert.doesNotMatch(JSON.stringify(be.bar), /\btime\b/i);
});

test("nl-BE reports.topics.science.mixed; Natuur en techniek preserved", () => {
  const nl = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-NL/reports.json"), "utf8"));
  const be = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-BE/reports.json"), "utf8"));
  const merged = deepMerge(nl, be);
  assert.equal(merged.topics.science.mixed, "Gemengde natuur en techniek");
  assert.doesNotMatch(merged.topics.science.mixed, /Mixed natuur/);
  assert.match(merged.topics.science.mixed, /natuur en techniek/i);
  // Subject authority must remain available via nl-NL merge on other science topic labels
  assert.equal(merged.topics.science.animals, nl.topics.science.animals);
  const beBlob = JSON.stringify(be);
  assert.match(beBlob, /natuur en techniek/i);
  assert.doesNotMatch(beBlob, /wereldoriëntatie/i);
});

test("regression: nl-NL tree untouched by nl-BE worktree edits", () => {
  const status = execFileSync(
    "git",
    ["status", "--porcelain", "--", "locales/nl-NL", "content-packs/nl-NL", "data/help-center/nl-NL"],
    {
      cwd: ROOT,
      encoding: "utf8",
    }
  ).trim();
  assert.equal(status, "", `unexpected nl-NL changes:\n${status}`);
});

test("regression: nl-BE agent did not modify tracked fr-BE files", () => {
  // Parallel fr-BE authoring may leave untracked ?? paths; forbid modified/deleted tracked files only.
  const status = execFileSync(
    "git",
    ["status", "--porcelain", "--", "locales/fr-BE", "content-packs/fr-BE", "data/help-center/fr-BE"],
    {
      cwd: ROOT,
      encoding: "utf8",
    }
  ).trim();
  const modified = status
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l && !l.startsWith("??"));
  assert.deepEqual(modified, [], `unexpected fr-BE modifications:\n${modified.join("\n")}`);
});
