/**
 * en-IN (India) sparse content-layer checks.
 * No registry wiring, build, or full suite.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assessNearFullCopy,
  auditBurnDownIndexOverlay,
  collectStringLeaves,
  isBurnDownIndexPath,
  resolveAuthorityPackPath,
} from "../../lib/i18n/country-overlay-sparse-contract.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "en-IN";
const HEBREW_RE = /[\u0590-\u05FF]/
const LOCAL_LANG_RE =
  /\b(hindi|hinglish|tamil|telugu|bengali|marathi|gujarati|kannada|malayalam|punjabi|urdu|sanskrit)\b/i;
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const GRADE_LABEL_RE = /\bGrade [1-6]\b/;
const NIGERIA_PRIMARY_RE = /\bPrimary [1-6]\b/;
const UNSAFE_PRIMARY_BAND_RE =
  /\bPrimary 1–6\b|\bsix primary grades\b|\bClasses 1–6 of primary school\b/i;

/**
 * @param {string} dir
 * @returns {string[]}
 */
function listJsonRel(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  /** @param {string} d @param {string} rel */
  function walk(d, rel = "") {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const r = rel ? `${rel}/${ent.name}` : ent.name;
      const abs = path.join(d, ent.name);
      if (ent.isDirectory()) walk(abs, r);
      else if (ent.name.endsWith(".json")) out.push(r.replace(/\\/g, "/"));
    }
  }
  walk(dir);
  return out.sort();
}

/**
 * @param {unknown} a
 * @param {unknown} b
 * @param {string} keyPath
 * @param {string[]} orphans
 * @param {string[]} typeMismatches
 * @param {string[]} placeholderMismatches
 * @param {string[]} identical
 */
function auditLocaleOverlay(a, b, keyPath, orphans, typeMismatches, placeholderMismatches, identical) {
  if (a == null) return;
  if (typeof a !== typeof b && !(a && typeof a === "object" && b && typeof b === "object")) {
    if (b === undefined) orphans.push(keyPath);
    else typeMismatches.push(keyPath);
    return;
  }
  if (typeof a === "string") {
    if (typeof b !== "string") {
      typeMismatches.push(keyPath);
      return;
    }
    if (a === b) identical.push(keyPath);
    const pa = (a.match(PLACEHOLDER_RE) || []).slice().sort().join("|");
    const pb = (b.match(PLACEHOLDER_RE) || []).slice().sort().join("|");
    if (pa !== pb) placeholderMismatches.push(keyPath);
    return;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      typeMismatches.push(keyPath);
      return;
    }
    for (let i = 0; i < a.length; i += 1) {
      auditLocaleOverlay(
        a[i],
        b[i],
        `${keyPath}[${i}]`,
        orphans,
        typeMismatches,
        placeholderMismatches,
        identical
      );
    }
    return;
  }
  if (a && typeof a === "object") {
    if (!b || typeof b !== "object" || Array.isArray(b)) {
      if (b === undefined) orphans.push(keyPath);
      else typeMismatches.push(keyPath);
      return;
    }
    for (const [k, v] of Object.entries(a)) {
      const next = keyPath ? `${keyPath}.${k}` : k;
      if (!(k in /** @type {Record<string, unknown>} */ (b))) orphans.push(next);
      else {
        auditLocaleOverlay(
          v,
          /** @type {Record<string, unknown>} */ (b)[k],
          next,
          orphans,
          typeMismatches,
          placeholderMismatches,
          identical
        );
      }
    }
  }
}

test("en-IN locale namespaces parse and stay sparse vs en", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", "en");
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("seo.json"));

  /** @type {string[]} */
  const orphans = [];
  /** @type {string[]} */
  const typeMismatches = [];
  /** @type {string[]} */
  const placeholderMismatches = [];
  /** @type {string[]} */
  const identical = [];
  /** @type {string[]} */
  const emptyFiles = [];
  let overrideCount = 0;

  for (const file of files) {
    const country = JSON.parse(fs.readFileSync(path.join(countryDir, file), "utf8"));
    const basePath = path.join(baseDir, file);
    assert.ok(fs.existsSync(basePath), `missing en authority ${file}`);
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(file);
    overrideCount += leaves.size;
    const blob = JSON.stringify(country);
    assert.equal(HEBREW_RE.test(blob), false, file);
    assert.equal(LOCAL_LANG_RE.test(blob), false, file);
    auditLocaleOverlay(country, base, file.replace(/\.json$/, ""), orphans, typeMismatches, placeholderMismatches, identical);
  }

  assert.deepEqual(emptyFiles, []);
  assert.deepEqual(orphans, []);
  assert.deepEqual(typeMismatches, []);
  assert.deepEqual(placeholderMismatches, []);
  assert.deepEqual(identical, []);
  assert.ok(overrideCount > 0);
});

test("en-IN grade terminology Class 1–6 and Indian English wording", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"]
  );
  assert.equal(common.gradeLabel, "Class {grade}");
  assert.equal(common.subjectMath, "Maths");

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.equal(learning.chooseGrade, "Choose a class");
  assert.equal(learning.master?.gradeTitle, "Class {grade}");
  assert.deepEqual(
    [
      learning.master?.grades?.g1,
      learning.master?.grades?.g2,
      learning.master?.grades?.g3,
      learning.master?.grades?.g4,
      learning.master?.grades?.g5,
      learning.master?.grades?.g6,
    ],
    ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"]
  );
  assert.match(learning.math.howToLearnBlurb, /\bpractise\b/);
  assert.doesNotMatch(learning.math.howToLearnBlurb, /\bpractice maths\b/);

  const worksheets = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"), "utf8"));
  assert.equal(worksheets.gradeFilterAll, "All classes");
  assert.equal(worksheets.selectGrade, "Class");
  assert.match(worksheets.createTypeColoring, /Colouring/);

  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.equal(auth.registration?.teacher?.phoneLabel, "Mobile number");
  assert.equal(auth.registration?.intent?.school_representative, undefined, "principal inherits from en");
  assert.equal(auth.registration?.subjects?.math, "Maths");

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Classes 1–6/);
  assert.match(seo.homeTitle, /India/);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal.choosePhysicalClass, "Choose a section");
  assert.equal(school.portal.createStudentClass, "Section");
  assert.equal(school.portal.assignCurrentClass, "Assigned section");
  assert.equal(school.portal.assignCurrentGrade, "Current class");
  assert.equal(school.portal.colGrade, "Class");
  assert.equal(school.portal.colClass, "Section");
  assert.equal(school.portal.classLabel, "Section");
  assert.equal(school.portal.viewClass, "View section");
  assert.equal(school.portal.classMgmtSection, "Manage sections");
  assert.equal(school.portal.classMgmtAdd, "Add section");
  assert.equal(school.portal.classMgmtName, "Section name");
  assert.equal(school.portal.classMgmtCreate, "Create section");
  assert.equal(school.portal.classMgmtListTitle, "Sections at school");
  assert.equal(school.portal.quickClasses, "Manage sections");
  assert.equal(school.portal.navClasses, "Sections");
  assert.equal(school.communication.detailsFieldGrade, "Class");
  assert.equal(school.communication.detailsFieldClass, "Section");
  assert.doesNotMatch(JSON.stringify(school), /physical class/i);
  // Group chrome must not collapse back to bare "Class" labels.
  assert.notEqual(school.portal.colClass, "Class");
  assert.notEqual(school.portal.classLabel, "Class");
  assert.notEqual(school.portal.viewClass, "Class");
  assert.doesNotMatch(school.portal.classMgmtSection, /\bManage classes\b/);
  assert.doesNotMatch(school.portal.classMgmtName, /\bClass name\b/);
  assert.doesNotMatch(school.portal.classMgmtCreate, /\bCreate class\b/);
  assert.doesNotMatch(school.portal.classMgmtAdd, /\bAdd class\b/);
  // Year-level Class 1–6 chrome stays Class.
  assert.match(school.portal.classesSubtitle, /class level/);
  assert.equal(school.portal.createStudentGrade, "Class");
  assert.equal(school.portal.classMgmtGrade, "Class");

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, GRADE_LABEL_RE);
  assert.doesNotMatch(allLocaleText, NIGERIA_PRIMARY_RE);
  assert.doesNotMatch(allLocaleText, UNSAFE_PRIMARY_BAND_RE);
  assert.doesNotMatch(allLocaleText, /\belementary\b/i);
  assert.doesNotMatch(allLocaleText, /\bphysical class\b/i);
  assert.doesNotMatch(allLocaleText, LOCAL_LANG_RE);
  assert.doesNotMatch(allLocaleText, /\bLearner login\b/);
  assert.match(allLocaleText, /\bHelp centre\b/);
  assert.match(allLocaleText, /\bcolour/i);
  assert.match(allLocaleText, /\bpractising\b/);
  assert.match(allLocaleText, /\bClass 1\b/);
  assert.match(allLocaleText, /\bsection\b/i);
  assert.match(allLocaleText, /primary and upper-primary/);
});

test("en-IN content packs sparse contract vs en", () => {
  const countryRoot = path.join(ROOT, "content-packs", LOCALE);
  const baseRoot = path.join(ROOT, "content-packs", "en");
  const baseExists = (rel) => fs.existsSync(path.join(baseRoot, rel));

  /** @type {string[]} */
  const identicalOverrides = [];
  /** @type {string[]} */
  const orphanKeys = [];
  /** @type {string[]} */
  const placeholderMismatches = [];
  /** @type {string[]} */
  const nearFullCopies = [];
  /** @type {string[]} */
  const emptyFiles = [];
  /** @type {string[]} */
  const hebrewHits = [];
  /** @type {string[]} */
  const localLangHits = [];
  /** @type {string[]} */
  const gradeHits = [];
  /** @type {string[]} */
  const nigeriaPrimaryHits = [];
  /** @type {string[]} */
  const unsafePrimaryHits = [];
  /** @type {string[]} */
  const extraFiles = [];

  for (const rel of listJsonRel(countryRoot)) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    const countryLeaves = collectStringLeaves(country);
    if (countryLeaves.size === 0) emptyFiles.push(rel);

    if (isBurnDownIndexPath(rel)) {
      const domain = rel.split("/")[0];
      const baseRel = `${domain}/burn-down-index.json`;
      if (!baseExists(baseRel)) {
        extraFiles.push(rel);
        continue;
      }
      const base = JSON.parse(fs.readFileSync(path.join(baseRoot, baseRel), "utf8"));
      const indexAudit = auditBurnDownIndexOverlay(country, base, { countryRoot, domain });
      for (const [key, value] of indexAudit.countryLeaves) {
        if (HEBREW_RE.test(value)) hebrewHits.push(`${rel}:${key}`);
        if (LOCAL_LANG_RE.test(value)) localLangHits.push(`${rel}:${key}`);
        if (GRADE_LABEL_RE.test(value)) gradeHits.push(`${rel}:${key}`);
        if (NIGERIA_PRIMARY_RE.test(value)) nigeriaPrimaryHits.push(`${rel}:${key}`);
        if (UNSAFE_PRIMARY_BAND_RE.test(value)) unsafePrimaryHits.push(`${rel}:${key}`);
      }
      for (const key of indexAudit.identicalOverrides) identicalOverrides.push(`${rel}:${key}`);
      for (const key of indexAudit.orphanKeys) orphanKeys.push(`${rel}:${key}`);
      for (const key of indexAudit.placeholderMismatches) placeholderMismatches.push(`${rel}:${key}`);
      continue;
    }

    const authority = resolveAuthorityPackPath(rel, baseExists);
    if (authority.kind === "missing" || !authority.baseRel) {
      extraFiles.push(rel);
      continue;
    }
    const base = JSON.parse(fs.readFileSync(path.join(baseRoot, authority.baseRel), "utf8"));
    const baseLeaves = collectStringLeaves(base);
    for (const [key, value] of countryLeaves) {
      if (typeof value === "string" && HEBREW_RE.test(value)) hebrewHits.push(`${rel}:${key}`);
      if (typeof value === "string" && LOCAL_LANG_RE.test(value)) localLangHits.push(`${rel}:${key}`);
      if (typeof value === "string" && GRADE_LABEL_RE.test(value)) gradeHits.push(`${rel}:${key}`);
      if (typeof value === "string" && NIGERIA_PRIMARY_RE.test(value)) nigeriaPrimaryHits.push(`${rel}:${key}`);
      if (typeof value === "string" && UNSAFE_PRIMARY_BAND_RE.test(value)) unsafePrimaryHits.push(`${rel}:${key}`);
      if (!baseLeaves.has(key)) orphanKeys.push(`${rel}:${key}`);
      else if (baseLeaves.get(key) === value) identicalOverrides.push(`${rel}:${key}`);
      else {
        const pa = ((value.match(PLACEHOLDER_RE) || []).slice().sort()).join("|");
        const pb = (((baseLeaves.get(key) || "").match(PLACEHOLDER_RE) || []).slice().sort()).join("|");
        if (pa !== pb) placeholderMismatches.push(`${rel}:${key}`);
      }
    }
    const assessment = assessNearFullCopy(countryLeaves, baseLeaves);
    if (assessment.isNearFullCopy) nearFullCopies.push(rel);
  }

  assert.deepEqual(emptyFiles, [], "empty overrides");
  assert.deepEqual(extraFiles, [], "files without en authority");
  assert.deepEqual(orphanKeys, [], "orphan keys");
  assert.deepEqual(identicalOverrides, [], "identical overrides");
  assert.deepEqual(placeholderMismatches, [], "placeholder mismatches");
  assert.deepEqual(nearFullCopies, [], "near-full / full-copy files");
  assert.deepEqual(hebrewHits, []);
  assert.deepEqual(localLangHits, []);
  assert.deepEqual(gradeHits, []);
  assert.deepEqual(nigeriaPrimaryHits, []);
  assert.deepEqual(unsafePrimaryHits, []);

  const demo = JSON.parse(fs.readFileSync(path.join(countryRoot, "demo/ui.json"), "utf8"));
  assert.equal(demo.bar?.changeGrade, "Change class");
  assert.equal(demo.grades?.g1, "Class 1");
  assert.equal(demo.subjects?.math, "Maths");

  const rewards = JSON.parse(fs.readFileSync(path.join(countryRoot, "rewards/ui.json"), "utf8"));
  assert.deepEqual(
    [rewards.gradeBands?.g12, rewards.gradeBands?.g34, rewards.gradeBands?.g56],
    ["Class 1–2", "Class 3–4", "Class 5–6"]
  );
});

test("en-IN help overlays parse and keep English slugs", async () => {
  const help = await import("../../data/help-center/en-IN/index.js");
  const parentsBase = await import("../../data/help-center/content/parents.js");
  assert.equal(help.ALL_ARTICLES_EN_IN.length, (
    (await import("../../data/help-center/content/parents.js")).PARENT_ARTICLES.length +
    (await import("../../data/help-center/content/students.js")).STUDENT_ARTICLES.length +
    (await import("../../data/help-center/content/parent-report.js")).PARENT_REPORT_ARTICLES.length +
    (await import("../../data/help-center/content/subjects.js")).SUBJECT_ARTICLES.length
  ));
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_EN_IN.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }
  const welcome = help.BY_SECTION_EN_IN.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /Classes 1 to 6/);
  assert.match(JSON.stringify(welcome), /primary and upper-primary/);
  assert.match(JSON.stringify(welcome), /maths/i);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_IN), LOCAL_LANG_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_IN), GRADE_LABEL_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_IN), NIGERIA_PRIMARY_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_IN), /\belementary\b/i);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_IN), UNSAFE_PRIMARY_BAND_RE);
});

test("en-IN does not ship word-meanings overlay or mutate English targets", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  const scienceOverlay = path.join(ROOT, "data/science-questions-en-IN-overlay.js");
  assert.equal(fs.existsSync(scienceOverlay), false);
  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.equal(booksUi.subjects?.math, "Maths");
  assert.ok(!("words" in booksUi));
  assert.ok(!("phonics" in booksUi));
});

test("en-IN Mathematics/Maths and British verb-noun spelling on authored surfaces", () => {
  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.equal(learning.subjects.math, "Maths");
  assert.match(learning.math.howToLearnBlurb, /\bpractise\b/);

  const reports = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "reports.json"), "utf8"));
  assert.match(reports.remediateSameLevel, /\bpractising\b/);
  assert.match(reports.v2.executive.majorTrendsManyUnitsLine2, /\bstabilise\b/);

  const booksUi = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json"), "utf8")
  );
  assert.match(booksUi.shell.practiceMath, /\bpractise\b/);
});

test("en-IN Help subject summaries use practise (verb) and keep practice (noun)", async () => {
  const help = await import("../../data/help-center/en-IN/index.js");
  const subjects = help.BY_SECTION_EN_IN.subjects;
  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = subjects.find((a) => a.slug === slug);
    assert.ok(article, slug);
    assert.match(String(article.summary), /how to practise\./);
    assert.doesNotMatch(String(article.summary), /how to practice\./);
    assert.match(String(article.summary), /\bpractice for Classes\b/);
  }
  const subjectsBlob = JSON.stringify(subjects);
  assert.doesNotMatch(subjectsBlob, /how to practice/i);
  assert.match(subjectsBlob, /Go to Maths practice/);
});

test("en-IN account/login keys stay Student; principal inherits from en", () => {
  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  const enAuth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "auth.json"), "utf8"));
  const enUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "ui.json"), "utf8"));

  assert.equal(auth.studentLoginTitle, undefined);
  assert.equal(auth.studentName, undefined);
  assert.equal(ui.nav?.loginStudent, undefined);
  assert.equal(enAuth.studentLoginTitle, "Student login");
  assert.equal(enAuth.registration.intent.school_representative, "School representative / principal");
  assert.equal(enUi.nav.loginStudent, "Student login");
});
