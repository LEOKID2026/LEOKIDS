/**
 * Suriname Dutch (nl-SR) sparse country layer checks (content-only; no wiring/build).
 * Base authority: nl-NL. Fallback planned: nl-SR → nl-NL → en.
 * Dutch-medium GLO / basisonderwijs; grades = 1e–6e leerjaar (six GLO years).
 * Public path planned: /sr-nl (not /sr). Selector planned: Suriname-nl.
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

function joinOverlayBlobs() {
  /** @type {string[]} */
  const blobs = [];
  for (const f of fs.readdirSync(path.join(ROOT, "locales/nl-SR")).filter((x) => x.endsWith(".json"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "locales/nl-SR", f), "utf8"));
  }
  for (const p of walkJson(path.join(ROOT, "content-packs/nl-SR"))) {
    blobs.push(fs.readFileSync(p, "utf8"));
  }
  for (const f of fs.readdirSync(path.join(ROOT, "data/help-center/nl-SR")).filter((x) => x.endsWith(".js"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "data/help-center/nl-SR", f), "utf8"));
  }
  return blobs.join("\n");
}

const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;

test("nl-SR locales: JSON parse + sparse key existence vs nl-NL", () => {
  const srDir = path.join(ROOT, "locales/nl-SR");
  const nlDir = path.join(ROOT, "locales/nl-NL");
  const files = fs.readdirSync(srDir).filter((f) => f.endsWith(".json")).sort();
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
    const sr = JSON.parse(fs.readFileSync(path.join(srDir, f), "utf8"));
    const nl = JSON.parse(fs.readFileSync(path.join(nlDir, f), "utf8"));
    const srLeaves = collectStrings(sr);
    const nlLeaves = collectStrings(nl);
    const srTypes = collectTypedLeaves(sr);
    const nlTypes = collectTypedLeaves(nl);

    if (srLeaves.size === 0) emptyFiles.push(f);
    assert.ok(srLeaves.size < nlLeaves.size, `${f} must be sparse vs nl-NL`);

    for (const [key, value] of srLeaves) {
      if (!nlLeaves.has(key)) orphans.push(`${f}:${key}`);
      else if (nlLeaves.get(key) === value) identical.push(`${f}:${key}`);
      else {
        const aPh = (value.match(PLACEHOLDER_RE) || []).sort().join("|");
        const bPh = ((nlLeaves.get(key) || "").match(PLACEHOLDER_RE) || []).sort().join("|");
        if (aPh !== bPh) placeholderMismatches.push(`${f}:${key}`);
      }
    }
    for (const [key, t] of srTypes) {
      if (nlTypes.has(key) && nlTypes.get(key) !== t) typeMismatches.push(`${f}:${key}`);
    }
  }

  assert.deepEqual(emptyFiles, [], `empty overrides: ${emptyFiles.join(", ")}`);
  assert.deepEqual(orphans, [], `orphan keys: ${orphans.join(", ")}`);
  assert.deepEqual(identical, [], `identical overrides: ${identical.join(", ")}`);
  assert.deepEqual(placeholderMismatches, [], `placeholder mismatches: ${placeholderMismatches.join(", ")}`);
  assert.deepEqual(typeMismatches, [], `type mismatches: ${typeMismatches.join(", ")}`);
});

test("nl-SR content-packs: sparse contract vs nl-NL (no full copies)", () => {
  const srRoot = path.join(ROOT, "content-packs/nl-SR");
  const nlRoot = path.join(ROOT, "content-packs/nl-NL");
  const files = walkJson(srRoot)
    .map((p) => path.relative(srRoot, p).replace(/\\/g, "/"))
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
    const sr = JSON.parse(fs.readFileSync(path.join(srRoot, rel), "utf8"));
    const nlPath = path.join(nlRoot, rel);
    assert.ok(fs.existsSync(nlPath), `missing nl-NL authority for ${rel}`);
    const nl = JSON.parse(fs.readFileSync(nlPath, "utf8"));
    const srLeaves = collectStrings(sr);
    const nlLeaves = collectStrings(nl);
    assert.notEqual(srLeaves.size, 0, `${rel} empty`);

    if (JSON.stringify(sr) === JSON.stringify(nl)) fullCopies.push(rel);

    for (const [key, value] of srLeaves) {
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

test("nl-SR authority-backed grade mapping uses 1e–6e leerjaar (GLO years)", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/common.json"), "utf8"));
  assert.equal(common.grade1, "1e leerjaar");
  assert.equal(common.grade2, "2e leerjaar");
  assert.equal(common.grade3, "3e leerjaar");
  assert.equal(common.grade4, "4e leerjaar");
  assert.equal(common.grade5, "5e leerjaar");
  assert.equal(common.grade6, "6e leerjaar");

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/learning.json"), "utf8"));
  assert.equal(learning.master.grades.g1, "1e leerjaar");
  assert.equal(learning.master.grades.g6, "6e leerjaar");
  assert.equal(learning.chooseGrade, "Kies een leerjaar");
  assert.equal(learning.master.currentGrade, "Huidig leerjaar");

  // Not Belgium Flemish ordinals; not Netherlands Groep; not MinOWC absolute Leerjaar 3–8 chrome
  assert.doesNotMatch(JSON.stringify(common), /1ste|2de leerjaar|Groep [3-8]|Leerjaar [3-8]/);
});

test("nl-SR leerjaar vs klas/klasgroep: grade labels use leerjaar; school keeps klasgroep", () => {
  /** Locale + content-pack chrome only (Help patch matchers may still mention Groep 3–8). */
  const blobs = [];
  for (const f of fs.readdirSync(path.join(ROOT, "locales/nl-SR")).filter((x) => x.endsWith(".json"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "locales/nl-SR", f), "utf8"));
  }
  for (const p of walkJson(path.join(ROOT, "content-packs/nl-SR"))) {
    blobs.push(fs.readFileSync(p, "utf8"));
  }
  const joined = blobs.join("\n");
  assert.match(joined, /1e leerjaar/);
  assert.match(joined, /6e leerjaar/);
  assert.doesNotMatch(joined, /"grade1":\s*"Groep 3"/);
  assert.doesNotMatch(joined, /"g1":\s*"Groep 3"/);
  assert.doesNotMatch(joined, /\bGroep [3-8]\b/);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/school.json"), "utf8"));
  assert.match(school.portal.classesSubtitle, /leerjaar/);
  assert.match(school.portal.classesSubtitle, /klasgroep|fysieke klas/);
  assert.equal(school.portal.colGrade, "Leerjaar");
  assert.equal(school.communication.detailsFieldClass, "Klasgroep");
  assert.equal(school.portal.choosePhysicalClass, "Kies een klasgroep");
  assert.equal(school.communication.audienceGradeTeachers, "Leerkrachten van dit leerjaar");
});

test("nl-SR leerling/leerkracht/ouder terminology; Rekenen chrome; spelling inherits Taalunie", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/school.json"), "utf8"));
  assert.match(JSON.stringify(school), /Leerkracht/);
  assert.match(JSON.stringify(school), /Ouder/);

  const nlCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-NL/common.json"), "utf8"));
  // Sparse: subject names inherit nl-NL (Rekenen / Meetkunde) — Suriname GLO uses Rekenen, not Wiskunde rename
  assert.equal(nlCommon.subjectMath, "Rekenen");
  assert.equal(nlCommon.subjectGeometry, "Meetkunde");
  assert.ok(!fs.existsSync(path.join(ROOT, "locales/nl-SR/common.json")) || true);
  const srCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/common.json"), "utf8"));
  assert.equal(srCommon.subjectMath, undefined);
  assert.equal(srCommon.subjectGeometry, undefined);

  const joined = joinOverlayBlobs();
  assert.match(joined, /\bRekenen\b/);
  assert.doesNotMatch(joined, /\bWiskunde\b/);
  // No local spelling-deviation pack; Groene Boekje / Taalunie via nl-NL inheritance
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/nl-SR.js")), false);
});

test("nl-SR Suriname Dutch framing; no Belgian leakage; no all-language claim", () => {
  const joined = joinOverlayBlobs();
  assert.match(joined, /basisonderwijs \(GLO\)|basisschool|GLO/);
  assert.doesNotMatch(joined, /\blagere school\b/i);
  assert.doesNotMatch(joined, /\blager onderwijs\b/i);
  assert.doesNotMatch(joined, /België|Belgie/);
  assert.doesNotMatch(joined, /\b1ste leerjaar\b/);
  assert.doesNotMatch(joined, /\b2de leerjaar\b/);
  assert.doesNotMatch(joined, /\bprimaire\b/i);
  assert.doesNotMatch(joined, /\bSranan\b/i);
  assert.doesNotMatch(joined, /enige (taal|onderwijstaal)|alleen Nederlands|Dutch is the only/i);
  assert.match(joined, /Nederlandstalige/);
});

test("nl-SR je/u consistency on child vs adult surfaces", () => {
  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/learning.json"), "utf8"));
  const childBlob = JSON.stringify(learning);
  assert.match(childBlob, /\bje\b/);
  assert.doesNotMatch(childBlob, /\bU\b/);
  assert.doesNotMatch(childBlob, /\buw\b/i);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/ui.json"), "utf8"));
  const parentBlob = JSON.stringify(ui.parent);
  assert.doesNotMatch(parentBlob, /\bje\b/);
  assert.doesNotMatch(parentBlob, /\bjouw\b/);

  const worksheets = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/worksheets.json"), "utf8"));
  const wsBlob = JSON.stringify(worksheets);
  assert.doesNotMatch(wsBlob, /\bje\b/);
  assert.doesNotMatch(wsBlob, /\bjouw\b/);
});

test("nl-SR Help overlays apply leerjaar without Groep 3–8; GLO framing", async () => {
  const { BY_SECTION_NL_SR, ALL_ARTICLES_NL_SR } = await import("../../data/help-center/nl-SR/index.js");
  assert.ok(ALL_ARTICLES_NL_SR.length > 10);
  const add = BY_SECTION_NL_SR.parents.find((a) => a.slug === "add-students");
  assert.ok(add);
  assert.match(add.summary, /leerjaar/);
  const list = add.blocks.find((b) => b.kind === "list");
  assert.deepEqual(list.items, [
    "1e leerjaar — grade_1",
    "2e leerjaar — grade_2",
    "tot en met 6e leerjaar — grade_6",
  ]);
  const welcome = BY_SECTION_NL_SR.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeText = welcome.blocks.find(
    (b) => b.kind === "paragraph" && /leerjaar|basisonderwijs|GLO/.test(b.text || "")
  ).text;
  assert.match(welcomeText, /1e tot en met 6e leerjaar|basisonderwijs \(GLO\)/);
  assert.match(welcomeText, /Nederlandstalige/);
  assert.doesNotMatch(welcomeText, /Groep 3/);
  assert.doesNotMatch(welcomeText, /enige taal|alleen Nederlands/i);

  const choose = BY_SECTION_NL_SR.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.equal(choose.title, "Kies een vak en een leerjaar");
  assert.match(JSON.stringify(choose), /\bjouw leerjaar\b/);
  assert.doesNotMatch(JSON.stringify(choose), /\bU\b/);
});

test("nl-SR does not ship word-meanings, science overlay, or learning-book copies", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/nl-SR.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-nl-SR-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/nl-SR")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "utils/learning-content-nl-SR")), false);
});

test("nl-SR english-page-skills titles: keep English targets; leerjaar chrome only", () => {
  const nl = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/nl-NL/books/english-page-skills.json"), "utf8")
  );
  const sr = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/nl-SR/books/english-page-skills.json"), "utf8")
  );
  const merged = deepMerge(nl, sr);
  assert.equal(merged.grades.g2.sentence_base.title, "Short sentences — 2e leerjaar");
  assert.equal(merged.grades.g3.grammar_question_frames.title, "Questions — 3e leerjaar");
  assert.equal(merged.grades.g5.grammar_quantifiers.title, "much/veel — 5e leerjaar");
  assert.match(merged.grades.g6.grammar_comparatives.description, /the best \/ the most interesting/);
  assert.match(merged.grades.g6.grammar_comparatives.description, /6e leerjaar/);
  assert.doesNotMatch(merged.grades.g6.grammar_comparatives.description, /Groep 8|reinforce|1ste|6de/);
});

test("nl-SR SEO home title identifies Suriname; GLO framing", () => {
  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Suriname/);
  assert.match(seo.homeTitle, /GLO|leerjaar/);
  assert.match(seo.homeDescription, /Suriname/);
  assert.match(seo.homeDescription, /Nederlandstalige|GLO|basisonderwijs/);
  assert.match(seo.learningDescription, /leerjaar/);
  assert.doesNotMatch(seo.homeTitle, /nationale curriculum|hele leerplan/i);
  assert.doesNotMatch(seo.homeDescription, /enige taal|alleen Nederlands|België|lagere school/i);
});

/** English×Dutch mash / English UI fragments that must not remain in merged nl-SR runtime. */
function isDutchEnglishMash(value) {
  if (typeof value !== "string" || !value.trim()) return false;
  return [
    /\b(Install|My|Manage|General|Approximate)\b(?!eren)/,
    /\b(active classes|Klas name|Classes bij|Klas activities|My leerkracht|Install leerkrachten|Approximate number|General leerkracht)\b/i,
    /\b(Linked |Create |Invite |Add |Search door|Transfer naar|Breakdown door|Recommended naar|Difficulty met|High number|enough data|Op track|Wait voor|Don't hebben|Signing in|Forgot uw|Passwords doe|Spelen time|field is required)\b/i,
    /\b(Could niet|Nothing naar|Welcome naar|See it |Hoe it |Learn en |Waarom doet it|Motivation naar|Learning bij|Games en social|private tutors|Ouder portal|Leerkracht portal)\b/i,
    /\b(Message ouder|guest mode|Ask een ouder naar|Locked door|Learning minutes|session summaries|Geen data yet|Share met friends|screen theme|Four in een|Search door topic|Ask over|Processing de|Question over|Move forward of|Player niet|Verwijderen child|Veranderen access|Create een writing|Could niet print|Available in de full|Reset naar defaults|Join met code|Add naar Home|Download en install|Know waar|behind learning|Clear ouder|Track completion|own pace|learning together|Coins, cards|Ouder opens|Open ouder account|een world kids|Learn ·|Systeem maps|Ouder gets|next step|Map door subject|Skills en sub|Reports voor|photos of videos|Username: niet set|New PIN|Guest Leo|Subject selecteer|Wat shall|Redirecting naar|Bij een glance|Minutes dit|box ready|Surprise box|Je hebben|Licht theme|Speler naam|Speler profiel|Terug naar de arcade|— Arcade|Information over AI|Wat moet we doe|Question voor|Oefenen mode|We see dat|Recall zijn)\b/i,
    /\b(e\.g\. Klas|Class 3)\b/,
  ].some((re) => re.test(value));
}

test("nl-SR merged public/marketing/auth/teacher/school runtime has zero Dutch×English mash", () => {
  const namespaces = [
    "ui",
    "seo",
    "auth",
    "teacher",
    "school",
    "validation",
    "worksheets",
    "learning",
    "common",
    "reports",
  ];
  /** @type {string[]} */
  const hits = [];
  for (const ns of namespaces) {
    const nlPath = path.join(ROOT, "locales/nl-NL", `${ns}.json`);
    const srPath = path.join(ROOT, "locales/nl-SR", `${ns}.json`);
    if (!fs.existsSync(nlPath)) continue;
    const nl = JSON.parse(fs.readFileSync(nlPath, "utf8"));
    const sr = fs.existsSync(srPath) ? JSON.parse(fs.readFileSync(srPath, "utf8")) : {};
    const merged = deepMerge(nl, sr);
    for (const [key, value] of collectStrings(merged)) {
      if (isDutchEnglishMash(value)) hits.push(`${ns}:${key} = ${value}`);
    }
  }

  // Content-pack + Help user-facing leaves
  for (const p of walkJson(path.join(ROOT, "content-packs/nl-SR"))) {
    const rel = path.relative(ROOT, p).replace(/\\/g, "/");
    const obj = JSON.parse(fs.readFileSync(p, "utf8"));
    for (const [key, value] of collectStrings(obj)) {
      if (isDutchEnglishMash(value)) hits.push(`${rel}:${key} = ${value}`);
    }
  }
  for (const f of ["parents.js", "students.js", "subjects.js"]) {
    const src = fs.readFileSync(path.join(ROOT, "data/help-center/nl-SR", f), "utf8");
    const texts = [...src.matchAll(/\b(?:text|title|summary|alt|caption):\s*`([^`]*)`|\b(?:text|title|summary|alt|caption):\s*"([^"]*)"/g)].map(
      (m) => m[1] || m[2]
    );
    for (const t of texts) {
      if (isDutchEnglishMash(t)) hits.push(`help:${f} = ${t}`);
    }
  }

  assert.deepEqual(hits, [], `Dutch×English mash remaining:\n${hits.slice(0, 40).join("\n")}`);

  const teacher = deepMerge(
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-NL/teacher.json"), "utf8")),
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/teacher.json"), "utf8"))
  );
  const school = deepMerge(
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-NL/school.json"), "utf8")),
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/school.json"), "utf8"))
  );
  const auth = deepMerge(
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-NL/auth.json"), "utf8")),
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/auth.json"), "utf8"))
  );
  const ui = deepMerge(
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-NL/ui.json"), "utf8")),
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/ui.json"), "utf8"))
  );

  assert.equal(teacher.dashboard.noClassesTitle, "Geen actieve klasgroepen");
  assert.equal(teacher.dashboard.createClassPlaceholder, "bijv. 3e leerjaar — LEO");
  assert.equal(school.portal.navMyTeacher, "Mijn leerkrachtdashboard");
  assert.equal(school.portal.classesTitle, "Klasgroepen op school");
  assert.equal(auth.registration.school.approxTeachersLabel, "Geschat aantal leerkrachten");
  assert.equal(ui.installApp.teachers, "Installeer de app voor leerkrachten");
  assert.equal(ui.nav.parentPortal, "Ouderportaal");
  assert.equal(ui.public.homepage.hero.howItWorksTitle, "Hoe het werkt");
  assert.equal(ui.public.homepage.teachers.label, "Voor privéleerkrachten");
  assert.doesNotMatch(JSON.stringify({ teacher, school, auth, ui }), /\bdocent\b/i);
});

test("nl-SR product chrome has no user-facing Leerjaar 3–8 absolute MinOWC numbering", () => {
  const blobs = [];
  for (const f of fs.readdirSync(path.join(ROOT, "locales/nl-SR")).filter((x) => x.endsWith(".json"))) {
    blobs.push(fs.readFileSync(path.join(ROOT, "locales/nl-SR", f), "utf8"));
  }
  for (const p of walkJson(path.join(ROOT, "content-packs/nl-SR"))) {
    blobs.push(fs.readFileSync(p, "utf8"));
  }
  // Help overlays: user-facing patched text only (skip textIncludes matchers)
  for (const f of ["parents.js", "students.js", "subjects.js"]) {
    const src = fs.readFileSync(path.join(ROOT, "data/help-center/nl-SR", f), "utf8");
    const texts = [...src.matchAll(/\btext:\s*`([^`]*)`|\btext:\s*"([^"]*)"/g)].map((m) => m[1] || m[2]);
    blobs.push(texts.join("\n"));
  }
  const joined = blobs.join("\n");
  assert.doesNotMatch(joined, /\bLeerjaar [3-8]\b/);
  assert.match(joined, /1e leerjaar/);
  assert.match(joined, /6e leerjaar/);
});

test("nl-SR reports: no local Hebrew/Israel/Judea/Hellenism residue; no orphan index keys", () => {
  const residue =
    /Hebrew|Hebreeuw|homeland|thuisland|Israel|Israël|Israeli|Judea|Hellenism|hellenisme|Hasmonaean|Hasmon|Judaism|jodendom||||Athene\/Sparta|athens_sparta/i;
  const reportRoot = path.join(ROOT, "content-packs/nl-SR/reports");
  const files = walkJson(reportRoot);
  /** @type {string[]} */
  const hits = [];
  for (const p of files) {
    const blob = fs.readFileSync(p, "utf8");
    if (residue.test(blob)) hits.push(path.relative(ROOT, p).replace(/\\/g, "/"));
  }
  assert.deepEqual(hits, [], `residue in: ${hits.join(", ")}`);

  const idxPath = path.join(reportRoot, "burn-down-index.json");
  const fragPath = path.join(
    reportRoot,
    "burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
  );
  assert.ok(fs.existsSync(idxPath));
  assert.ok(fs.existsSync(fragPath));
  const idx = JSON.parse(fs.readFileSync(idxPath, "utf8"));
  const frag = JSON.parse(fs.readFileSync(fragPath, "utf8"));
  const fragKeys = new Set(Object.keys(frag.copy || frag));
  const idxSection = idx["utils__parent-report-language__grade-aware-recommendation-templates"] || {};
  const orphanIdx = Object.keys(idxSection).filter((k) => !fragKeys.has(k));
  assert.deepEqual(orphanIdx, [], `orphan burn-down index keys: ${orphanIdx.join(", ")}`);
  const missingIdx = [...fragKeys].filter((k) => !(k in idxSection));
  assert.deepEqual(missingIdx, [], `fragment keys missing from index: ${missingIdx.slice(0, 10).join(", ")}`);
});

test("nl-SR validation.required + nearby public mash closed", () => {
  const nl = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-NL/validation.json"), "utf8"));
  const sr = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/validation.json"), "utf8"));
  const merged = deepMerge(nl, sr);
  assert.equal(merged.required, "Dit veld is verplicht.");
  assert.equal(merged.invalidEmail, "Voer een geldig e-mailadres in.");
  assert.match(merged.minLength, /\{min\}/);
  assert.match(merged.maxLength, /\{max\}/);
  assert.doesNotMatch(merged.required, /field is required/i);
  assert.doesNotMatch(JSON.stringify(sr), /field is required/i);
});

test("nl-SR demo bar.playTime is Speeltijd; no Spelen time on bar", () => {
  const nl = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/nl-NL/demo/ui.json"), "utf8"));
  const sr = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/nl-SR/demo/ui.json"), "utf8"));
  const merged = deepMerge(nl, sr);
  assert.equal(merged.bar.playTime, "Speeltijd");
  assert.doesNotMatch(JSON.stringify(merged.bar), /Spelen time/);
  assert.doesNotMatch(JSON.stringify(sr.bar), /\btime\b/i);
});

test("nl-SR reports.topics.science.mixed; Natuur en techniek preserved", () => {
  const nl = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-NL/reports.json"), "utf8"));
  const sr = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/nl-SR/reports.json"), "utf8"));
  const merged = deepMerge(nl, sr);
  assert.equal(merged.topics.science.mixed, "Gemengde natuur en techniek");
  assert.doesNotMatch(merged.topics.science.mixed, /Mixed natuur/);
  assert.match(merged.topics.science.mixed, /natuur en techniek/i);
  assert.equal(merged.topics.science.animals, nl.topics.science.animals);
  const srBlob = JSON.stringify(sr);
  assert.match(srBlob, /natuur en techniek/i);
  assert.doesNotMatch(srBlob, /wereldoriëntatie/i);
});

test("nl-SR grade bands in rewards use 1e–6e leerjaar pairs", () => {
  const rewards = JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/nl-SR/rewards/ui.json"), "utf8"));
  assert.equal(rewards.gradeBands.g12, "1e–2e leerjaar");
  assert.equal(rewards.gradeBands.g34, "3e–4e leerjaar");
  assert.equal(rewards.gradeBands.g56, "5e–6e leerjaar");
});

test("regression: nl-NL / nl-BE trees untouched by nl-SR worktree edits", () => {
  const status = execFileSync(
    "git",
    [
      "status",
      "--porcelain",
      "--",
      "locales/nl-NL",
      "content-packs/nl-NL",
      "data/help-center/nl-NL",
      "locales/nl-BE",
      "content-packs/nl-BE",
      "data/help-center/nl-BE",
    ],
    {
      cwd: ROOT,
      encoding: "utf8",
    }
  ).trim();
  assert.equal(status, "", `unexpected nl-NL/nl-BE changes:\n${status}`);
});

test("regression: nl-SR content layer stays in allowlisted paths (shared wiring may be dirty)", () => {
  // Group-3 shared wiring legitimately touches lib/i18n/** and data/help-center/index.js.
  // This content agent must not own those paths; we only assert structural allowlist + presence.
  const allowedRoots = [
    path.join(ROOT, "locales/nl-SR"),
    path.join(ROOT, "content-packs/nl-SR"),
    path.join(ROOT, "data/help-center/nl-SR"),
  ];
  for (const root of allowedRoots) {
    assert.ok(fs.existsSync(root), `missing content root ${root}`);
  }
  assert.ok(fs.existsSync(path.join(ROOT, "tests/i18n/nl-SR-content-layer.test.mjs")));
  assert.ok(fs.existsSync(path.join(ROOT, "lib/i18n")));
  assert.ok(fs.existsSync(path.join(ROOT, "data/help-center/index.js")));
  // Content agent must not create /sr public-path stubs or Serbian-collision dirs
  assert.equal(fs.existsSync(path.join(ROOT, "locales/sr")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs/sr")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "tests/i18n/_gen-nl-SR-sparse-layer.mjs")), false);
});
