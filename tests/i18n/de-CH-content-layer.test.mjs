/**
 * Switzerland (de-CH) sparse country layer checks (content-only; no wiring/build).
 * Base authority: de-DE. Fallback planned: de-CH → de-DE → en.
 * Swiss Standard German (ss, not ß); Primarschule; grades remain 1.–6. Klasse.
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
const EN_UI_RE =
  /\b(Demo mode|Exit demo|Play time|Try the|Loading |Could not|Purchase|Buy|My cards|You have it|Not enough|Welcome to|Available in|Network error|sign-up|view only)\b/i;

test("de-CH locales: JSON parse + sparse key existence vs de-DE", () => {
  const chDir = path.join(ROOT, "locales/de-CH");
  const deDir = path.join(ROOT, "locales/de-DE");
  const files = fs.readdirSync(chDir).filter((f) => f.endsWith(".json")).sort();
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
    const ch = JSON.parse(fs.readFileSync(path.join(chDir, f), "utf8"));
    const de = JSON.parse(fs.readFileSync(path.join(deDir, f), "utf8"));
    const chLeaves = collectStrings(ch);
    const deLeaves = collectStrings(de);
    const chTypes = collectTypedLeaves(ch);
    const deTypes = collectTypedLeaves(de);

    if (chLeaves.size === 0) emptyFiles.push(f);
    assert.ok(chLeaves.size < deLeaves.size, `${f} must be sparse vs de-DE`);

    for (const [key, value] of chLeaves) {
      if (!deLeaves.has(key)) orphans.push(`${f}:${key}`);
      else if (deLeaves.get(key) === value) identical.push(`${f}:${key}`);
      else {
        const aPh = (value.match(PLACEHOLDER_RE) || []).sort().join("|");
        const bPh = ((deLeaves.get(key) || "").match(PLACEHOLDER_RE) || []).sort().join("|");
        if (aPh !== bPh) placeholderMismatches.push(`${f}:${key}`);
      }
    }
    for (const [key, t] of chTypes) {
      if (deTypes.has(key) && deTypes.get(key) !== t) typeMismatches.push(`${f}:${key}`);
    }
  }

  assert.deepEqual(emptyFiles, [], `empty overrides: ${emptyFiles.join(", ")}`);
  assert.deepEqual(orphans, [], `orphan keys: ${orphans.join(", ")}`);
  assert.deepEqual(identical, [], `identical overrides: ${identical.join(", ")}`);
  assert.deepEqual(placeholderMismatches, [], `placeholder mismatches: ${placeholderMismatches.join(", ")}`);
  assert.deepEqual(typeMismatches, [], `type mismatches: ${typeMismatches.join(", ")}`);
});

test("de-CH content-packs: sparse contract vs de-DE (no full copies)", () => {
  const chRoot = path.join(ROOT, "content-packs/de-CH");
  const deRoot = path.join(ROOT, "content-packs/de-DE");
  const files = walkJson(chRoot)
    .map((p) => path.relative(chRoot, p).replace(/\\/g, "/"))
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
    const ch = JSON.parse(fs.readFileSync(path.join(chRoot, rel), "utf8"));
    const dePath = path.join(deRoot, rel);
    assert.ok(fs.existsSync(dePath), `missing de-DE authority for ${rel}`);
    const de = JSON.parse(fs.readFileSync(dePath, "utf8"));
    const chLeaves = collectStrings(ch);
    const deLeaves = collectStrings(de);
    assert.notEqual(chLeaves.size, 0, `${rel} empty`);

    if (JSON.stringify(ch) === JSON.stringify(de)) fullCopies.push(rel);

    for (const [key, value] of chLeaves) {
      if (!deLeaves.has(key)) orphans.push(`${rel}:${key}`);
      else if (deLeaves.get(key) === value) identical.push(`${rel}:${key}`);
      else overrideCount += 1;
    }
  }

  assert.deepEqual(fullCopies, [], `full-copy files: ${fullCopies.join(", ")}`);
  assert.deepEqual(orphans, [], `orphan keys: ${orphans.slice(0, 20).join(", ")}`);
  assert.deepEqual(identical, [], `identical overrides: ${identical.slice(0, 20).join(", ")}`);
  assert.ok(overrideCount > 0);
});

test("de-CH grade mapping inherits 1.–6. Klasse from de-DE (no Schulstufe)", () => {
  const deCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/common.json"), "utf8"));
  assert.equal(deCommon.grade1, "1. Klasse");
  assert.equal(deCommon.grade6, "6. Klasse");
  assert.equal(deCommon.gradeLabel, "{grade}. Klasse");

  // Sparse CH must not re-declare identical grade keys
  const chCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-CH/common.json"), "utf8"));
  assert.equal(chCommon.grade1, undefined);
  assert.equal(chCommon.grade6, undefined);

  const merged = deepMerge(deCommon, chCommon);
  assert.equal(merged.grade1, "1. Klasse");
  assert.equal(merged.grade2, "2. Klasse");
  assert.equal(merged.grade3, "3. Klasse");
  assert.equal(merged.grade4, "4. Klasse");
  assert.equal(merged.grade5, "5. Klasse");
  assert.equal(merged.grade6, "6. Klasse");

  const deLearning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/learning.json"), "utf8"));
  const chLearning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-CH/learning.json"), "utf8"));
  const learning = deepMerge(deLearning, chLearning);
  assert.equal(learning.master.grades.g1, "1. Klasse");
  assert.equal(learning.master.grades.g6, "6. Klasse");
  assert.equal(learning.chooseGrade, "Klasse wählen");
});

test("de-CH Primarschule terminology; no Grundschule/Schulstufe/Volksschule leakage", () => {
  const blobs = [];
  for (const f of fs.readdirSync(path.join(ROOT, "locales/de-CH")).filter((x) => x.endsWith(".json"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "locales/de-CH", f), "utf8"));
  }
  for (const p of walkJson(path.join(ROOT, "content-packs/de-CH"))) {
    blobs.push(fs.readFileSync(p, "utf8"));
  }
  const joined = blobs.join("\n");
  assert.match(joined, /Primarschulkinder/);
  assert.match(joined, /Primarstufe/);
  assert.doesNotMatch(joined, /\bGrundschule/);
  assert.doesNotMatch(joined, /Grundschulkinder/);
  assert.doesNotMatch(joined, /\bSchulstufe\b/);
  assert.doesNotMatch(joined, /Volksschule/);
  assert.doesNotMatch(joined, /"grade1":\s*"1\. Schulstufe"/);
  assert.doesNotMatch(joined, /"g1":\s*"1\. Schulstufe"/);
});

test("de-CH authored JSON overlays contain no ß", () => {
  /** @type {string[]} */
  const hits = [];
  for (const f of fs.readdirSync(path.join(ROOT, "locales/de-CH")).filter((x) => x.endsWith(".json"))) {
    const c = fs.readFileSync(path.join(ROOT, "locales/de-CH", f), "utf8");
    if (c.includes("ß")) hits.push(`locales/de-CH/${f}`);
  }
  for (const p of walkJson(path.join(ROOT, "content-packs/de-CH"))) {
    const c = fs.readFileSync(p, "utf8");
    if (c.includes("ß")) hits.push(path.relative(ROOT, p).replace(/\\/g, "/"));
  }
  assert.deepEqual(hits, [], `ß in overlays: ${hits.join(", ")}`);
});

test("de-CH du/Sie consistency on child vs adult surfaces", () => {
  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-CH/learning.json"), "utf8"));
  const childBlob = JSON.stringify(learning);
  assert.doesNotMatch(childBlob, /\bwählen Sie\b/);
  assert.doesNotMatch(childBlob, /\bSie\b/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-CH/ui.json"), "utf8"));
  if (ui.parent) {
    const parentBlob = JSON.stringify(ui.parent);
    assert.doesNotMatch(parentBlob, /\bdu\b/);
    assert.doesNotMatch(parentBlob, /\bwähle\b/);
  }

  const worksheets = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-CH/worksheets.json"), "utf8"));
  const wsBlob = JSON.stringify(worksheets);
  assert.match(wsBlob, /Wählen Sie|wählen Sie|Sie /);
  assert.doesNotMatch(wsBlob, /\bwähle\b/);
  assert.doesNotMatch(wsBlob, /\bdu\b/);
});

test("de-CH Help overlays apply Primarschule + Klasse; Swiss spelling in patched text", async () => {
  const { BY_SECTION_DE_CH, ALL_ARTICLES_DE_CH } = await import("../../data/help-center/de-CH/index.js");
  assert.ok(ALL_ARTICLES_DE_CH.length > 10);
  const welcome = BY_SECTION_DE_CH.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeText = welcome.blocks.find(
    (b) => b.kind === "paragraph" && /Primarschulkinder/.test(b.text || "")
  ).text;
  assert.match(welcomeText, /Primarschulkinder von der 1\. bis zur 6\. Klasse/);
  assert.doesNotMatch(welcomeText, /Grundschul/);
  assert.doesNotMatch(welcomeText, /Schulstufe/);
  assert.doesNotMatch(welcomeText, /ß/);

  const add = BY_SECTION_DE_CH.parents.find((a) => a.slug === "add-students");
  const list = add.blocks.find((b) => b.kind === "list");
  assert.deepEqual(list.items, [
    "1. Klasse",
    "2. Klasse",
    "3. Klasse",
    "4. Klasse",
    "5. Klasse",
    "6. Klasse",
  ]);

  const choose = BY_SECTION_DE_CH.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.equal(choose.title, "Ein Fach und eine Klasse wählen");
  assert.match(JSON.stringify(choose), /\bWähle\b/);
  assert.doesNotMatch(JSON.stringify(choose), /\bWählen Sie\b/);

  const tips = BY_SECTION_DE_CH.students.find((a) => a.slug === "tips-for-good-practice");
  assert.match(tips.summary, /Regelmässigkeit/);
  assert.doesNotMatch(JSON.stringify(tips), /ß/);
});

test("de-CH does not ship word-meanings, science overlay, or learning-book copies", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/de-CH.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-de-CH-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/de-CH")), false);
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-de-CH/index.js")));
});

test("de-CH auth runtime: Swiss ss on google.signInFailed; no public ß in auth overlay", () => {
  const de = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/auth.json"), "utf8"));
  const ch = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-CH/auth.json"), "utf8"));
  const merged = deepMerge(de, ch);
  assert.match(merged.google.signInFailed, /abschliessen/);
  assert.doesNotMatch(merged.google.signInFailed, /abschließen|ß/);
  assert.match(merged.google.signInFailed, /Versuchen Sie|melden Sie/);
  const chLeaves = collectStrings(ch);
  for (const [key, value] of chLeaves) {
    assert.notEqual(value, deLeavesGet(de, key), `identical auth override ${key}`);
    assert.doesNotMatch(value, /ß/);
  }
  const mergedLeaves = collectStrings(merged);
  /** @type {string[]} */
  const ssHits = [];
  for (const [key, value] of mergedLeaves) {
    if (value.includes("ß")) ssHits.push(`${key}=${value}`);
  }
  assert.deepEqual(ssHits, [], `auth merged ß: ${ssHits.join(" | ")}`);
});

test("de-CH legal runtime: ss + adult Sie/Ihr; no du on legal surface", () => {
  const de = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/legal.json"), "utf8"));
  const ch = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-CH/legal.json"), "utf8"));
  const merged = deepMerge(de, ch);
  assert.match(merged.cookieBannerBody, /ausschliesslich/);
  assert.match(merged.cookieBannerBody, /mit Ihrer Einwilligung/);
  assert.doesNotMatch(merged.cookieBannerBody, /ausschließlich|deiner Einwilligung|ß/);
  assert.equal(merged.cookieClose, "Schliessen");
  assert.doesNotMatch(JSON.stringify(ch), /\bdu\b|\bdeiner\b|ß/);
  const mergedLeaves = collectStrings(merged);
  /** @type {string[]} */
  const ssHits = [];
  for (const [key, value] of mergedLeaves) {
    if (value.includes("ß")) ssHits.push(`${key}=${value}`);
  }
  assert.deepEqual(ssHits, [], `legal merged ß: ${ssHits.join(" | ")}`);
});

test("de-CH Help subjects tip uses gleichmässigen on callout blocks", async () => {
  const { BY_SECTION_DE_CH } = await import("../../data/help-center/de-CH/index.js");
  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = BY_SECTION_DE_CH.subjects.find((a) => a.slug === slug);
    assert.ok(article, slug);
    const tip = article.blocks.find((b) => b.kind === "callout" && /Tempo/.test(b.text || ""));
    assert.ok(tip, `${slug} tip`);
    assert.match(tip.text, /gleichmässigen Tempo/);
    assert.doesNotMatch(tip.text, /gleichmäßigen|ß/);
  }
});

test("de-CH Math/Geometry display layer uses Swiss gross/ss (direct helper)", async () => {
  const {
    applyDeChDisplayLayer,
    rebuildGeometryStemDeCh,
    rebuildMathStemDeCh,
  } = await import("../../utils/learning-content-de-CH/index.js");
  const { rebuildGeometryStemDeDe } = await import("../../utils/learning-content-de-DE/geometry.js");

  assert.equal(
    rebuildGeometryStemDeCh({ params: { kind: "circle_perimeter", radius: 5 } }),
    "Ein Kreis mit Radius 5. Wie gross ist der Umfang des Kreises? (π = 3,14)"
  );
  assert.equal(
    rebuildGeometryStemDeCh({ params: { kind: "circle_area", radius: 4 } }),
    "Ein Kreis mit Radius 4. Wie gross ist die Fläche? (π = 3,14)"
  );
  assert.equal(
    rebuildGeometryStemDeCh({
      params: { kind: "rectangle_area", length: 6, width: 3 },
    }),
    "Wie gross ist die Fläche des Rechtecks mit Länge 6 und Breite 3?"
  );

  const deStem = rebuildGeometryStemDeDe({ params: { kind: "circle_perimeter", radius: 5 } });
  assert.match(deStem, /groß/);
  assert.doesNotMatch(
    rebuildGeometryStemDeCh({ params: { kind: "circle_perimeter", radius: 5 } }),
    /ß/
  );

  const sweets = rebuildMathStemDeCh({
    params: { kind: "wp_coins_spent", total: 5, spent: 2 },
  });
  assert.ok(sweets);
  assert.match(sweets, /Süssigkeiten/);
  assert.doesNotMatch(sweets, /Süßigkeiten|ß/);

  const geoQ = applyDeChDisplayLayer(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 }, options: ["12", "50"], answer: 50 },
    "geometry"
  );
  assert.match(String(geoQ.question), /Wie gross ist die Fläche/);
  assert.doesNotMatch(String(geoQ.question), /ß/);
  assert.deepEqual(geoQ.options, ["12", "50"]);
  assert.equal(geoQ.params.kind, "circle_area");

  const heisst = rebuildMathStemDeCh({
    params: { kind: "frac_half_reverse", whole: 10 },
  });
  assert.ok(heisst);
  assert.match(heisst, /heisst/);
  assert.doesNotMatch(heisst, /heißt|ß/);
});

test("de-CH focused public ß scan on merged runtime surfaces = 0", async () => {
  const namespaces = [
    "auth",
    "legal",
    "common",
    "validation",
    "reports",
    "worksheets",
    "school",
    "ui",
    "learning",
    "seo",
    "games",
    "copilot",
  ];
  /** @type {string[]} */
  const hits = [];
  for (const ns of namespaces) {
    const dePath = path.join(ROOT, "locales/de-DE", `${ns}.json`);
    const chPath = path.join(ROOT, "locales/de-CH", `${ns}.json`);
    if (!fs.existsSync(dePath)) continue;
    const de = JSON.parse(fs.readFileSync(dePath, "utf8"));
    const ch = fs.existsSync(chPath) ? JSON.parse(fs.readFileSync(chPath, "utf8")) : {};
    const merged = deepMerge(de, ch);
    for (const [key, value] of collectStrings(merged)) {
      if (value.includes("ß")) hits.push(`locale:${ns}:${key}`);
    }
  }
  for (const area of ["demo", "rewards", "books"]) {
    for (const abs of walkJson(path.join(ROOT, "content-packs/de-DE", area))) {
      const rel = path.relative(path.join(ROOT, "content-packs/de-DE"), abs).replace(/\\/g, "/");
      const de = JSON.parse(fs.readFileSync(abs, "utf8"));
      const chPath = path.join(ROOT, "content-packs/de-CH", rel);
      const ch = fs.existsSync(chPath) ? JSON.parse(fs.readFileSync(chPath, "utf8")) : {};
      const merged = deepMerge(de, ch);
      for (const [key, value] of collectStrings(merged)) {
        if (value.includes("ß")) hits.push(`pack:${rel}:${key}`);
      }
    }
  }
  const { BY_SECTION_DE_CH } = await import("../../data/help-center/de-CH/index.js");
  function walkHelp(node, prefix) {
    if (typeof node === "string") {
      if (node.includes("ß")) hits.push(`help:${prefix}`);
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((v, i) => walkHelp(v, `${prefix}[${i}]`));
      return;
    }
    if (node && typeof node === "object") {
      for (const [k, v] of Object.entries(node)) walkHelp(v, prefix ? `${prefix}.${k}` : k);
    }
  }
  for (const [sec, arts] of Object.entries(BY_SECTION_DE_CH)) {
    for (const a of arts) walkHelp(a, `${sec}:${a.slug}`);
  }
  assert.deepEqual(hits, [], `public ß hits: ${hits.join(", ")}`);
});

test("regression: de-DE keeps Germany ß spelling; de-CH grades stay Klasse", () => {
  const deAuth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/auth.json"), "utf8"));
  assert.match(deAuth.google.signInFailed, /abschließen/);
  const deLegal = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/legal.json"), "utf8"));
  assert.match(deLegal.cookieBannerBody, /ausschließlich/);
  assert.match(deLegal.cookieBannerBody, /deiner Einwilligung/);
  const deCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE/common.json"), "utf8"));
  assert.equal(deCommon.grade1, "1. Klasse");
  assert.equal(deCommon.close, "Schließen");
  const chCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-CH/common.json"), "utf8"));
  assert.equal(chCommon.grade1, undefined);
  assert.equal(deepMerge(deCommon, chCommon).grade1, "1. Klasse");
});

/** @param {unknown} obj @param {string} dotted */
function deLeavesGet(obj, dotted) {
  const parts = dotted.split(".");
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = /** @type {Record<string, unknown>} */ (cur)[p];
  }
  return cur;
}

test("de-CH no forced Swiss dialect regionalisms", () => {
  const blobs = [];
  for (const f of fs.readdirSync(path.join(ROOT, "locales/de-CH")).filter((x) => x.endsWith(".json"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "locales/de-CH", f), "utf8"));
  }
  for (const p of walkJson(path.join(ROOT, "content-packs/de-CH"))) {
    blobs.push(fs.readFileSync(p, "utf8"));
  }
  for (const f of fs.readdirSync(path.join(ROOT, "data/help-center/de-CH")).filter((x) => x.endsWith(".js"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "data/help-center/de-CH", f), "utf8"));
  }
  const joined = blobs.join("\n");
  assert.doesNotMatch(joined, /\bVelo\b/);
  assert.doesNotMatch(joined, /\bZnüni\b/);
  assert.doesNotMatch(joined, /\bZvieri\b/);
  assert.doesNotMatch(joined, /\bparkieren\b/i);
});

test("de-CH demo merged chrome uses Swiss spelling where overridden", () => {
  const de = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/de-DE/demo/ui.json"), "utf8"));
  const ch = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/de-CH/demo/ui.json"), "utf8"));
  const merged = deepMerge(de, ch);
  assert.match(merged.parentPortal.readOnlyShare, /ausserhalb/);
  assert.doesNotMatch(merged.parentPortal.readOnlyShare, /außerhalb|ß/);
  const leaves = collectStrings(merged);
  /** @type {string[]} */
  const englishHits = [];
  for (const [key, value] of leaves) {
    if (EN_UI_RE.test(value)) englishHits.push(`${key}=${value}`);
  }
  assert.deepEqual(englishHits, [], `demo English chrome: ${englishHits.join(" | ")}`);
});

test("de-CH rewards merged chrome has Swiss ss spelling on overridden keys", () => {
  const de = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/de-DE/rewards/ui.json"), "utf8"));
  const ch = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/de-CH/rewards/ui.json"), "utf8"));
  const merged = deepMerge(de, ch);
  assert.equal(merged.series["sport-fun"], "Sport & Spass");
  assert.match(merged.previewModal.close, /Schliessen/);
  assert.doesNotMatch(JSON.stringify(ch), /ß/);
});

test("de-CH english-page-skills titles: no mash, keep Klasse + English targets", () => {
  const de = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/de-DE/books/english-page-skills.json"), "utf8")
  );
  const ch = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/de-CH/books/english-page-skills.json"), "utf8")
  );
  const merged = deepMerge(de, ch);
  assert.equal(merged.grades.g2.vocab_school.title, "Schule — Gegenstände im Satz");
  assert.equal(merged.grades.g4.vocab_school.title, de.grades.g4.vocab_school.title);
  assert.equal(merged.grades.g3.grammar_question_frames.title, "Fragen — 3. Klasse");
  assert.equal(merged.grades.g5.grammar_quantifiers.title, "much/many — 5. Klasse");
  assert.equal(merged.grades.g2.grammar_be.title, "am / is / are — üben");
  assert.match(merged.grades.g6.grammar_comparatives.description, /the best \/ the most interesting/);
  assert.doesNotMatch(merged.grades.g6.grammar_comparatives.description, /reinforce/);
  assert.match(merged.grades.g6.grammar_comparatives.description, /6\. Klasse/);

  const titles = [];
  function walkTitles(node, prefix = "") {
    if (!node || typeof node !== "object") return;
    for (const [k, v] of Object.entries(node)) {
      const p = prefix ? `${prefix}.${k}` : k;
      if ((k === "title" || k === "description") && typeof v === "string") titles.push([p, v]);
      else if (v && typeof v === "object") walkTitles(v, p);
    }
  }
  walkTitles(ch.grades);
  /** @type {string[]} */
  const mash = [];
  for (const [p, v] of titles) {
    if (
      /menschlicher Körper|in Englisch|Schülerinnen und Schüler, read|Schulstufe reinforce|Klasse reinforce|\breinforce\b/.test(
        v
      )
    ) {
      mash.push(`${p}=${v}`);
    }
  }
  assert.deepEqual(mash, [], `skill title mash: ${mash.join(" | ")}`);
});

test("de-CH SEO uses Primarschule framing", () => {
  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-CH/seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Primarschulkinder/);
  assert.match(seo.homeDescription, /Primarstufe/);
  assert.doesNotMatch(seo.homeTitle, /Grundschul/);
});

test("regression: de-DE and de-AT trees untouched by de-CH worktree edits", () => {
  const status = execFileSync("git", ["status", "--porcelain", "--", "locales/de-DE", "locales/de-AT", "content-packs/de-DE", "content-packs/de-AT", "data/help-center/de-DE", "data/help-center/de-AT"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
  assert.equal(status, "", `unexpected de-DE/de-AT changes:\n${status}`);
});
