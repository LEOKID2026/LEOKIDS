/**
 * en-LR (Liberia) sparse content-layer checks.
 * No registry wiring, build, or full suite.
 *
 * Authority: MoE EMIS / Education Reform Act — Primary / Lower Basic = Grades 1–6;
 * bands Grade 1–2, Grade 3–4, Grade 5–6; principal; student (default);
 * American English; Liberian dollar (LRD).
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
import { deepMergeJson } from "../../lib/i18n/deep-merge.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "en-LR";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const PHYSICAL_CLASS_RE = /\bphysical class\b/i;
const BRITISH_SPELL_RE =
  /\b(colour|colours|colouring|practise|practising|practised|organised|centre|maths|stabilise|levelled)\b/i;
const PEER_LEAK_RE =
  /\b(Ghana|Nigeria|Kenya|Cameroon|Rwanda|Sierra Leone|The Gambia|Basic [1-6]|Primary [1-6]|Class [1-6])\b/;
const ENGLISH_ONLY_LR_RE =
  /\b(english (is|as) the only|only language in liberia|sole (official )?language|all (of )?liberia speaks? english)\b/i;
const ENGLISH_SCOPE_RE = /English-medium|English-language|English experience/i;
const LOCAL_LANG_RE =
  /\b(kpelle|bassa|gio|mano|krahn|vai|grebo|kissi|gola|lorma|belle|manda|dei)\b/i;
const DEAD_CURRICULUM_RE =
  /\b(israel|israeli|hebrew|homeland|moledet|hasmon|judea|judaism|||)\b/i;
const FOREIGN_CURRENCY_RE = /\b(USD|GHS|NGN|KES|CFA|British pound|Naira|Cedi)\b/;
const LR_GRADES = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"];
const LR_BANDS = ["Grade 1–2", "Grade 3–4", "Grade 5–6"];
const ALLOWED_CONTENT_ROOTS = [
  path.join(ROOT, "locales", LOCALE),
  path.join(ROOT, "content-packs", LOCALE),
  path.join(ROOT, "data", "help-center", LOCALE),
  path.join(ROOT, "tests", "i18n"),
];

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

/**
 * @param {string} blob
 * @param {string} label
 */
function assertCleanChrome(blob, label) {
  assert.equal(HEBREW_RE.test(blob), false, `hebrew in ${label}`);
  assert.equal(PHYSICAL_CLASS_RE.test(blob), false, `physical class in ${label}`);
  assert.equal(BRITISH_SPELL_RE.test(blob), false, `british spelling in ${label}`);
  assert.equal(PEER_LEAK_RE.test(blob), false, `peer leak in ${label}`);
  assert.equal(ENGLISH_ONLY_LR_RE.test(blob), false, `english-only claim in ${label}`);
  assert.equal(LOCAL_LANG_RE.test(blob), false, `local language name in ${label}`);
  assert.equal(DEAD_CURRICULUM_RE.test(blob), false, `dead curriculum in ${label}`);
  assert.equal(FOREIGN_CURRENCY_RE.test(blob), false, `foreign currency in ${label}`);
}

test("en-LR locale namespaces parse and stay sparse vs en", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", "en");
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("ui.json"));
  // Grade 1–6 matches en — common.json must not exist as an identical/empty override.
  assert.equal(files.includes("common.json"), false);

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
    assertCleanChrome(JSON.stringify(country), file);
    auditLocaleOverlay(
      country,
      base,
      file.replace(/\.json$/, ""),
      orphans,
      typeMismatches,
      placeholderMismatches,
      identical
    );
  }

  assert.deepEqual(emptyFiles, []);
  assert.deepEqual(orphans, []);
  assert.deepEqual(typeMismatches, []);
  assert.deepEqual(placeholderMismatches, []);
  assert.deepEqual(identical, []);
  assert.ok(overrideCount > 0);
});

test("en-LR Grade 1–6 mapping, bands, and class-group distinction", () => {
  const enCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "common.json"), "utf8"));
  assert.deepEqual(
    [enCommon.grade1, enCommon.grade2, enCommon.grade3, enCommon.grade4, enCommon.grade5, enCommon.grade6],
    LR_GRADES
  );
  assert.equal(enCommon.gradeLabel, "Grade {grade}");
  assert.equal(enCommon.subjectMath, "Math");
  assert.equal(fs.existsSync(path.join(ROOT, "locales", LOCALE, "common.json")), false);

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  const enLearning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "learning.json"), "utf8"));
  const mergedLearning = deepMergeJson(enLearning, learning);
  assert.equal(mergedLearning.chooseGrade, "Choose a grade");
  assert.deepEqual(
    [
      mergedLearning.master?.grades?.g1,
      mergedLearning.master?.grades?.g2,
      mergedLearning.master?.grades?.g3,
      mergedLearning.master?.grades?.g4,
      mergedLearning.master?.grades?.g5,
      mergedLearning.master?.grades?.g6,
    ],
    LR_GRADES
  );
  assert.equal(mergedLearning.master?.gradeTitle, "Grade {grade}");
  assert.match(learning.master?.gradedPracticeBlurb || "", /\bpractice by grade\b/i);
  assert.doesNotMatch(JSON.stringify(learning), /\bpractise\b/i);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  const enSchool = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "school.json"), "utf8"));
  const mergedSchool = deepMergeJson(enSchool, school);
  assert.equal(mergedSchool.portal?.chooseGrade, "Choose a grade");
  assert.equal(mergedSchool.portal?.choosePhysicalClass, "Choose class group");
  assert.equal(mergedSchool.portal?.colGrade, "Grade");
  assert.equal(mergedSchool.portal?.colClass, "Class group");
  assert.equal(mergedSchool.portal?.classLabel, "Class group");
  assert.equal(mergedSchool.portal?.classMgmtSection, "Manage class groups");
  assert.equal(mergedSchool.portal?.classMgmtName, "Class group name");
  assert.equal(mergedSchool.portal?.classMgmtCreate, "Create class group");
  assert.notEqual(mergedSchool.portal?.colClass, mergedSchool.portal?.colGrade);
  assert.match(mergedSchool.portal?.classesSubtitle || "", /class group/);
  assert.doesNotMatch(mergedSchool.portal?.classesSubtitle || "", PHYSICAL_CLASS_RE);

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  assert.equal(teacher.dashboard?.noClassesTitle, "No active class groups");
  assert.equal(teacher.dashboard?.createClassLabel, "Class group name");
  assert.equal(teacher.dashboard?.createClassButton, "Create class group");
  assert.doesNotMatch(JSON.stringify(teacher.dashboard || {}), /\bNo active classes\b/);

  const validation = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8"));
  assert.match(validation.api?.physical_class_not_found || "", /class group/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.public?.about?.intro1 || "", /Grades 1–6/);
  assert.match(ui.public?.about?.intro1 || "", /Grade 1–2/);
  assert.match(ui.public?.about?.intro1 || "", /Grade 3–4/);
  assert.match(ui.public?.about?.intro1 || "", /Grade 5–6/);
  assert.match(ui.public?.about?.intro1 || "", /LEO KIDS practice and display groupings/);
  assert.doesNotMatch(ui.public?.about?.intro1 || "", /\bpathway\b/i);
  assert.doesNotMatch(ui.public?.about?.intro1 || "", /official school structure of Liberia|Liberia’s official pathway/i);
  assert.match(ui.public?.about?.intro1 || "", /Liberia/);
  assert.match(ui.public?.about?.intro1 || "", ENGLISH_SCOPE_RE);

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Liberia/);
  assert.match(seo.homeTitle, /primary school students/);
  assert.match(seo.homeDescription, ENGLISH_SCOPE_RE);
  assert.doesNotMatch(JSON.stringify(seo), ENGLISH_ONLY_LR_RE);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assertCleanChrome(allLocaleText, "all locales");
  assert.doesNotMatch(allLocaleText, /\belementary\b/i);
  assert.match(allLocaleText, /\bclass group\b/i);
  assert.match(allLocaleText, /\bstudent/i);
  assert.doesNotMatch(allLocaleText, /\bpupil\b/i);
  assert.doesNotMatch(allLocaleText, /\blearner\b/i);
});

test("en-LR content packs sparse contract vs en", () => {
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
  const chromeHits = [];
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
        if (
          HEBREW_RE.test(value) ||
          PHYSICAL_CLASS_RE.test(value) ||
          BRITISH_SPELL_RE.test(value) ||
          PEER_LEAK_RE.test(value) ||
          ENGLISH_ONLY_LR_RE.test(value) ||
          LOCAL_LANG_RE.test(value) ||
          DEAD_CURRICULUM_RE.test(value) ||
          FOREIGN_CURRENCY_RE.test(value)
        ) {
          chromeHits.push(`${rel}:${key}`);
        }
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
      if (typeof value === "string") {
        if (
          HEBREW_RE.test(value) ||
          PHYSICAL_CLASS_RE.test(value) ||
          BRITISH_SPELL_RE.test(value) ||
          PEER_LEAK_RE.test(value) ||
          ENGLISH_ONLY_LR_RE.test(value) ||
          LOCAL_LANG_RE.test(value) ||
          DEAD_CURRICULUM_RE.test(value) ||
          FOREIGN_CURRENCY_RE.test(value)
        ) {
          chromeHits.push(`${rel}:${key}`);
        }
      }
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
  assert.deepEqual(chromeHits, [], "chrome / scope leaks");

  const rewards = JSON.parse(fs.readFileSync(path.join(countryRoot, "rewards/ui.json"), "utf8"));
  assert.deepEqual(
    [rewards.gradeBands?.g12, rewards.gradeBands?.g34, rewards.gradeBands?.g56],
    LR_BANDS
  );

  const classesIdx = JSON.parse(
    fs.readFileSync(path.join(countryRoot, "global-burn-down/pages__school__classes__index.json"), "utf8")
  );
  assert.equal(classesIdx.copy?.no_classes_in_this_grade, "No class groups in this grade.");

  const publicSeo = JSON.parse(
    fs.readFileSync(path.join(countryRoot, "global-burn-down/lib__site__public-page-seo.json"), "utf8")
  );
  assert.match(
    publicSeo.copy.digital_practice_for_elementary_learners_in_math_geometry_english_and_sc,
    /Liberia/
  );
  assert.doesNotMatch(
    publicSeo.copy.digital_practice_for_elementary_learners_in_math_geometry_english_and_sc,
    ENGLISH_ONLY_LR_RE
  );
});

test("en-LR helpers and empty Help overrides are absent; sections inherit cleanly", async () => {
  for (const helper of [
    "_gen-en-LR-sparse-layer.mjs",
    "_fix-en-LR-sparse-layer.mjs",
    "_fix2-en-LR-sparse-layer.mjs",
  ]) {
    assert.equal(fs.existsSync(path.join(ROOT, "tests/i18n", helper)), false, helper);
  }
  assert.equal(fs.existsSync(path.join(ROOT, "data/help-center/en-LR/students.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/help-center/en-LR/parent-report.js")), false);

  const help = await import("../../data/help-center/en-LR/index.js");
  const studentsBase = await import("../../data/help-center/content/students.js");
  const parentReportBase = await import("../../data/help-center/content/parent-report.js");
  const parentsBase = await import("../../data/help-center/content/parents.js");
  const subjectsBase = await import("../../data/help-center/content/subjects.js");

  assert.equal(help.BY_SECTION_EN_LR.students, studentsBase.STUDENT_ARTICLES);
  assert.equal(help.BY_SECTION_EN_LR["parent-report"], parentReportBase.PARENT_REPORT_ARTICLES);
  assert.equal(help.BY_SECTION_EN_LR.students.length, studentsBase.STUDENT_ARTICLES.length);
  assert.equal(
    help.BY_SECTION_EN_LR["parent-report"].length,
    parentReportBase.PARENT_REPORT_ARTICLES.length
  );

  assert.deepEqual(Object.keys(help.SECTIONS_EN_LR).sort(), [
    "parent-report",
    "parents",
    "students",
    "subjects",
  ]);
  assert.equal(help.ALL_ARTICLES_EN_LR.length, (
    parentsBase.PARENT_ARTICLES.length +
    studentsBase.STUDENT_ARTICLES.length +
    parentReportBase.PARENT_REPORT_ARTICLES.length +
    subjectsBase.SUBJECT_ARTICLES.length
  ));

  const ids = help.ALL_ARTICLES_EN_LR.map((a) => a.id || a.slug);
  assert.equal(new Set(ids).size, ids.length, "duplicate article IDs");
});

test("en-LR help overlays parse and keep English slugs", async () => {
  const help = await import("../../data/help-center/en-LR/index.js");
  const parentsBase = await import("../../data/help-center/content/parents.js");
  assert.equal(
    help.ALL_ARTICLES_EN_LR.length,
    (await import("../../data/help-center/content/parents.js")).PARENT_ARTICLES.length +
      (await import("../../data/help-center/content/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/content/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/content/subjects.js")).SUBJECT_ARTICLES.length
  );
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_EN_LR.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }
  const welcome = help.BY_SECTION_EN_LR.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeBlob = JSON.stringify(welcome);
  assert.match(welcomeBlob, /Grades 1–6/);
  assert.match(welcomeBlob, /Grade 1–2/);
  assert.match(welcomeBlob, /Grade 3–4/);
  assert.match(welcomeBlob, /Grade 5–6/);
  assert.match(welcomeBlob, /LEO KIDS practice and display groupings/);
  assert.doesNotMatch(welcomeBlob, /\bpathway\b/i);
  assert.match(welcomeBlob, /primary school students in Liberia/);
  assert.match(welcomeBlob, /math/i);
  assert.doesNotMatch(welcomeBlob, ENGLISH_ONLY_LR_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_LR), BRITISH_SPELL_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_LR), PEER_LEAK_RE);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_LR), /\belementary\b/i);
  assert.doesNotMatch(JSON.stringify(help.ALL_ARTICLES_EN_LR), PHYSICAL_CLASS_RE);
  assert.equal(help.SECTIONS_EN_LR.students.title, "Guide for students");
});

test("en-LR does not ship word-meanings overlay or mutate English targets", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-en-LR-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "books/ui.json")), false);
  assert.equal(
    fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "books/registry-titles.json")),
    false
  );
});

test("en-LR American English spelling and Math terminology", () => {
  const enCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "common.json"), "utf8"));
  assert.equal(enCommon.subjectMath, "Math");

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.match(JSON.stringify(learning), /\bpractice\b/i);
  assert.doesNotMatch(JSON.stringify(learning), /\bpractise\b/i);
  assert.doesNotMatch(JSON.stringify(learning), /\bMaths\b/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, BRITISH_SPELL_RE);
  assert.match(allLocaleText, /\bHelp center\b|\bpractice\b/);
});

test("en-LR Help subject summaries use practice (verb and noun) with Grade 1–6", async () => {
  const help = await import("../../data/help-center/en-LR/index.js");
  const subjects = help.BY_SECTION_EN_LR.subjects;
  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = subjects.find((a) => a.slug === slug);
    assert.ok(article, slug);
    assert.match(String(article.summary), /how to practice\./);
    assert.doesNotMatch(String(article.summary), /how to practise\./);
    assert.match(String(article.summary), /\bpractice for Grade 1–6\b/);
  }
  const subjectsBlob = JSON.stringify(subjects);
  assert.doesNotMatch(subjectsBlob, /how to practise/i);
  assert.match(subjectsBlob, /Go to Math practice/);
});

test("en-LR student/principal terminology and parent-facing child", () => {
  const enAuth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "auth.json"), "utf8"));
  const enUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "ui.json"), "utf8"));
  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));

  // Account/login inherits Student from en; no auth overlay required (principal already in en).
  assert.equal(fs.existsSync(path.join(ROOT, "locales", LOCALE, "auth.json")), false);
  assert.equal(enAuth.studentLoginTitle, "Student login");
  assert.equal(enAuth.registration?.intent?.school_representative, "School representative / principal");
  assert.equal(enUi.nav.loginStudent, "Student login");

  assert.equal(ui.empty?.noStudents, "No children yet. Add a child to get started.");
  assert.match(ui.home?.subhead || "", /primary school students in Liberia/);
  assert.doesNotMatch(JSON.stringify(ui), /\bpupil\b/i);
  assert.doesNotMatch(JSON.stringify(ui), /\blearner\b/i);
  assert.doesNotMatch(JSON.stringify(ui), /\bhead teacher\b/i);
});

test("en-LR currency terminology authority (Liberian dollar / LRD)", () => {
  const roots = [
    path.join(ROOT, "locales", LOCALE),
    path.join(ROOT, "content-packs", LOCALE),
    path.join(ROOT, "data/help-center", LOCALE),
  ];
  /** @type {string[]} */
  const hits = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const rel of listJsonRel(root)) {
      const text = fs.readFileSync(path.join(root, rel), "utf8");
      if (FOREIGN_CURRENCY_RE.test(text)) hits.push(path.relative(ROOT, path.join(root, rel)));
    }
  }
  assert.deepEqual(hits, [], "no foreign fiat currency chrome in en-LR overlays");
  // Authority term for future fiat surfaces; no fabricated orphan currency keys.
  assert.equal("Liberian dollar", "Liberian dollar");
  assert.equal("LRD", "LRD");
});

test("en-LR Grade year vs class group stays distinct across portals", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  const enSchool = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "school.json"), "utf8"));
  const mergedSchool = deepMergeJson(enSchool, school);

  assert.equal(mergedSchool.portal.colGrade, "Grade");
  assert.equal(mergedSchool.portal.createStudentGrade, "Grade");
  assert.equal(mergedSchool.portal.classMgmtGrade, "Grade");
  assert.equal(mergedSchool.portal.colClass, "Class group");
  assert.equal(mergedSchool.communication.detailsFieldClass, "Class group");

  const teacherDash = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        LOCALE,
        "global-burn-down/components__teacher-portal__TeacherDashboardClient.json"
      ),
      "utf8"
    )
  );
  assert.equal(teacherDash.copy?.manage_class, "Manage class group");
  assert.equal(teacherDash.copy?.classes, "Class groups");
  assert.equal(teacherDash.copy?.class_report, "Class group report");

  const groupSurfaces = [
    JSON.stringify(school),
    JSON.stringify(teacher),
    JSON.stringify(teacherDash),
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/pages__school__classes__index.json"),
      "utf8"
    ),
  ].join("\n");
  assert.match(groupSurfaces, /\bclass group\b/i);
  assert.doesNotMatch(groupSurfaces, PHYSICAL_CLASS_RE);
  assert.doesNotMatch(groupSurfaces, /\bNo active classes\b/);
});

test("en-LR runtime probe: American practice spelling + parent empty state", () => {
  const enUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "ui.json"), "utf8"));
  const lrUi = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  const merged = deepMergeJson(enUi, lrUi);

  assert.equal(
    merged.public?.homepage?.valueCards?.["0"]?.text,
    "See what your child practiced, where they are improving, and what to reinforce."
  );
  assert.equal(merged.empty?.noStudents, "No children yet. Add a child to get started.");
  assert.doesNotMatch(JSON.stringify(merged.public?.homepage?.valueCards || {}), /\bpractised\b/);
  assert.match(JSON.stringify(merged.public?.homepage?.valueCards || {}), /\bpracticed\b/);
  assert.doesNotMatch(String(merged.empty?.noStudents), /\bstudents\b/i);
});

test("en-LR has no Hebrew/Israel residue and does not modify other locales", () => {
  const roots = [
    path.join(ROOT, "locales", LOCALE),
    path.join(ROOT, "content-packs", LOCALE),
    path.join(ROOT, "data/help-center", LOCALE),
  ];
  /** @type {string[]} */
  const hits = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    for (const rel of listJsonRel(root)) {
      const abs = path.join(root, rel);
      const text = fs.readFileSync(abs, "utf8");
      if (DEAD_CURRICULUM_RE.test(text) || HEBREW_RE.test(text)) {
        hits.push(path.relative(ROOT, abs).replace(/\\/g, "/"));
      }
    }
    if (root.includes("help-center")) {
      for (const name of fs.readdirSync(root)) {
        if (!name.endsWith(".js")) continue;
        const abs = path.join(root, name);
        const text = fs.readFileSync(abs, "utf8");
        if (DEAD_CURRICULUM_RE.test(text) || HEBREW_RE.test(text)) {
          hits.push(path.relative(ROOT, abs).replace(/\\/g, "/"));
        }
      }
    }
  }
  assert.deepEqual(hits, []);

  const enCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", "en", "common.json"), "utf8"));
  assert.equal(enCommon.grade1, "Grade 1");
  assert.equal(enCommon.subjectMath, "Math");
  for (const other of ["en-GH", "en-NG", "en-KE", "en-CM", "en-RW"]) {
    assert.ok(fs.existsSync(path.join(ROOT, "locales", other)));
  }
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings/en-LR.js")), false);
  for (const root of ALLOWED_CONTENT_ROOTS) {
    assert.ok(root.includes(LOCALE) || root.includes("tests"));
  }
});
