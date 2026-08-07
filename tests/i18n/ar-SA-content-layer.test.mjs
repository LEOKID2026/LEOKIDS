/**
 * ar-SA (Saudi Arabia) sparse content-layer checks vs ar-001.
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
const LOCALE = "ar-SA";
const AUTHORITY = "ar-001";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const CROSS_COUNTRY_RE =
  /مصر|المصرية|الإمارات|الامارات|دبي|أبوظبي|الأردن|الاردن|عمّان|عمان(?!ية)|الكويت|قطر|البحرين|جنيه|درهم/;
const DIGIT_GRADE_RE = /الصف [1-6](?!\d)/;
const TALMEEDH_RE = /تلميذ/;
const FORBIDDEN_EN_UI_RE =
  /\b(Grade|Student login|Parent login|Worksheet|Dashboard|Settings|Cancel|Save|Continue|Back|Next|Loading)\b/;

/** Academic school-year درجة patterns (not score / angle / temperature / متدرجة). */
const ACADEMIC_DARAJAH_RES = [
  /اختر الدرجة/,
  /تغيير الدرجة/,
  /حسب الدرجة/,
  /مع الدرجة(?! الحرارة)/,
  /فوق الدرجة/,
  /أو الدرجة/,
  /اسم أو الدرجة/,
  /درجة أخرى/,
  /درجة أقل/,
  /درجة طفلك/,
  /تحديث درجتك/,
  /درجتك/,
  /اختر درجة(?! الحرارة)/,
  /رفع درجة/,
  /"درجة"/,
  /الكتابة حسب الدرجة/,
  /والمحتوى والدرجة/,
  /المحتوى والدرجة/,
  /متطابقة مع الدرجة/,
];

/** Physical class-group mislabeled as semester/term. */
const SEMESTERISH_CLASS_GROUP_RE = /الفصل الدراسي/;

/**
 * Product chrome name for parent Copilot in Arabic Master (ar-001 ui.json).
 * Latin "Copilot" is not the approved Arabic UI token.
 */
const COPILOT_AR_PRODUCT_NAME = "مساعد الطيار";
const LATIN_COPILOT_RE = /\bCopilot\b/;

/**
 * @param {unknown} obj
 * @param {string[]} out
 */
function collectAllStrings(obj, out = []) {
  if (typeof obj === "string") {
    out.push(obj);
    return out;
  }
  if (Array.isArray(obj)) {
    for (const item of obj) collectAllStrings(item, out);
    return out;
  }
  if (obj && typeof obj === "object") {
    for (const v of Object.values(obj)) collectAllStrings(v, out);
  }
  return out;
}

/**
 * @param {string} text
 */
function hasAcademicDarajah(text) {
  return ACADEMIC_DARAJAH_RES.some((re) => re.test(text));
}

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

test("ar-SA locale namespaces parse and stay sparse vs ar-001", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", AUTHORITY);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("auth.json"));
  assert.ok(files.includes("school.json"), "school has sparse physical-class wording override");

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
  /** @type {string[]} */
  const hebrewHits = [];
  /** @type {string[]} */
  const crossHits = [];
  /** @type {string[]} */
  const digitGradeHits = [];
  /** @type {string[]} */
  const talmeedhHits = [];
  let overrideCount = 0;

  for (const file of files) {
    const country = JSON.parse(fs.readFileSync(path.join(countryDir, file), "utf8"));
    const basePath = path.join(baseDir, file);
    assert.ok(fs.existsSync(basePath), `missing ar-001 authority ${file}`);
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(file);
    overrideCount += leaves.size;
    const blob = JSON.stringify(country);
    if (HEBREW_RE.test(blob)) hebrewHits.push(file);
    if (CROSS_COUNTRY_RE.test(blob)) crossHits.push(file);
    if (DIGIT_GRADE_RE.test(blob)) digitGradeHits.push(file);
    if (TALMEEDH_RE.test(blob)) talmeedhHits.push(file);
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
  assert.deepEqual(hebrewHits, []);
  assert.deepEqual(crossHits, []);
  assert.deepEqual(digitGradeHits, []);
  assert.deepEqual(talmeedhHits, []);
  assert.ok(overrideCount > 0);
});

test("ar-SA grade mapping الصف الأول–السادس and طالب terminology", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"]
  );

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.equal(learning.master?.defaultPlayerName, "الطالب");
  assert.equal(
    learning.master?.gradeRequired,
    "يرجى اختيار الصف قبل التدريب. اطلب من ولي الأمر تحديث صفك."
  );
  assert.doesNotMatch(learning.master?.gradeRequired || "", /درجتك|درجة/);
  assert.deepEqual(
    [
      learning.master?.grades?.g1,
      learning.master?.grades?.g2,
      learning.master?.grades?.g3,
      learning.master?.grades?.g4,
      learning.master?.grades?.g5,
      learning.master?.grades?.g6,
    ],
    ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"]
  );
  assert.match(learning.math.howToLearnSteps.step1, /اختر الصف/);
  assert.doesNotMatch(learning.math.howToLearnSteps.step1, /اختر الدرجة/);

  const worksheets = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "worksheets.json"), "utf8")
  );
  assert.deepEqual(
    [
      worksheets.gradeG1,
      worksheets.gradeG2,
      worksheets.gradeG3,
      worksheets.gradeG4,
      worksheets.gradeG5,
      worksheets.gradeG6,
    ],
    ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"]
  );

  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.equal(auth.studentLoginTitle, "تسجيل دخول الطالب");
  assert.equal(auth.studentName, "اسم الطالب");

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /المملكة العربية السعودية/);
  assert.match(seo.homeDescription, /المملكة العربية السعودية/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.home?.ctaKids, "أنا طالب");
  assert.match(ui.home?.subhead || "", /المملكة العربية السعودية/);
  assert.match(ui.public?.about?.intro1 || "", /الصف الأول إلى الصف السادس/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, TALMEEDH_RE);
  assert.doesNotMatch(allLocaleText, DIGIT_GRADE_RE);
  assert.doesNotMatch(allLocaleText, CROSS_COUNTRY_RE);
  assert.doesNotMatch(allLocaleText, HEBREW_RE);
  assert.doesNotMatch(allLocaleText, SEMESTERISH_CLASS_GROUP_RE);
  assert.doesNotMatch(allLocaleText, LATIN_COPILOT_RE);
  assert.match(allLocaleText, /الطالب/);
  assert.match(allLocaleText, /الصف الأول/);
  assert.match(allLocaleText, /تحديث صفك/);
});

test("ar-SA grade/class-group distinction: الصف ≠ الفصل; no الفصل الدراسي for physical group", () => {
  const baseSchool = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", AUTHORITY, "school.json"), "utf8"));
  assert.equal(baseSchool.portal.colGrade, "الصف");
  assert.equal(baseSchool.portal.colClass, "فصل");
  assert.equal(baseSchool.portal.chooseGrade, "اختر الصف");
  assert.equal(baseSchool.portal.choosePhysicalClass, "اختر الفصل");
  assert.equal(baseSchool.portal.classLabel, "فصل");
  assert.doesNotMatch(baseSchool.portal.choosePhysicalClass, /^اختر الصف$/);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(
    school.portal.classesSubtitle,
    "اختر الصف والفصل والمادة - التقارير والإدارة حسب الصف"
  );
  assert.doesNotMatch(school.portal.classesSubtitle, SEMESTERISH_CLASS_GROUP_RE);
  assert.match(school.portal.classesSubtitle, /والفصل والمادة/);
});

test("ar-SA content packs sparse contract vs ar-001", () => {
  const countryRoot = path.join(ROOT, "content-packs", LOCALE);
  const baseRoot = path.join(ROOT, "content-packs", AUTHORITY);
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
  const crossHits = [];
  /** @type {string[]} */
  const digitGradeHits = [];
  /** @type {string[]} */
  const talmeedhHits = [];
  /** @type {string[]} */
  const extraFiles = [];

  assert.equal(fs.existsSync(path.join(countryRoot, "learning/taxonomy")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`)), false);

  for (const rel of listJsonRel(countryRoot)) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    const countryLeaves = collectStringLeaves(country);
    const allCountryStrings = collectAllStrings(country);
    if (countryLeaves.size === 0 && allCountryStrings.length === 0) emptyFiles.push(rel);

    // Array-root atomic overlays (e.g. hub-cards): require ≥1 differing string; sibling identicals allowed.
    if (Array.isArray(country)) {
      if (!baseExists(rel)) {
        extraFiles.push(rel);
        continue;
      }
      const base = JSON.parse(fs.readFileSync(path.join(baseRoot, rel), "utf8"));
      assert.ok(Array.isArray(base), rel);
      const baseStrings = collectAllStrings(base);
      const countryStrings = allCountryStrings;
      assert.equal(countryStrings.length, baseStrings.length, `array length drift ${rel}`);
      let diffs = 0;
      for (let i = 0; i < countryStrings.length; i += 1) {
        const value = countryStrings[i];
        if (HEBREW_RE.test(value)) hebrewHits.push(`${rel}:[${i}]`);
        if (CROSS_COUNTRY_RE.test(value)) crossHits.push(`${rel}:[${i}]`);
        if (DIGIT_GRADE_RE.test(value)) digitGradeHits.push(`${rel}:[${i}]`);
        if (TALMEEDH_RE.test(value)) talmeedhHits.push(`${rel}:[${i}]`);
        if (value !== baseStrings[i]) diffs += 1;
      }
      assert.ok(diffs > 0, `array overlay has no diffs: ${rel}`);
      assert.ok(diffs < countryStrings.length, `array overlay rewrote everything: ${rel}`);
      continue;
    }

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
        if (CROSS_COUNTRY_RE.test(value)) crossHits.push(`${rel}:${key}`);
        if (DIGIT_GRADE_RE.test(value)) digitGradeHits.push(`${rel}:${key}`);
        if (TALMEEDH_RE.test(value)) talmeedhHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && CROSS_COUNTRY_RE.test(value)) crossHits.push(`${rel}:${key}`);
      if (typeof value === "string" && DIGIT_GRADE_RE.test(value)) digitGradeHits.push(`${rel}:${key}`);
      if (typeof value === "string" && TALMEEDH_RE.test(value)) talmeedhHits.push(`${rel}:${key}`);
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
  assert.deepEqual(extraFiles, [], "files without ar-001 authority");
  assert.deepEqual(orphanKeys, [], "orphan keys");
  assert.deepEqual(identicalOverrides, [], "identical overrides");
  assert.deepEqual(placeholderMismatches, [], "placeholder mismatches");
  assert.deepEqual(nearFullCopies, [], "near-full / full-copy files");
  assert.deepEqual(hebrewHits, []);
  assert.deepEqual(crossHits, []);
  assert.deepEqual(digitGradeHits, []);
  assert.deepEqual(talmeedhHits, []);

  const demo = JSON.parse(fs.readFileSync(path.join(countryRoot, "demo/ui.json"), "utf8"));
  assert.deepEqual(
    [demo.grades?.g1, demo.grades?.g2, demo.grades?.g3, demo.grades?.g4, demo.grades?.g5, demo.grades?.g6],
    ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"]
  );
  assert.match(demo.enter?.activeSessionNote || "", /تغيير الصف/);

  const classGrade = JSON.parse(
    fs.readFileSync(
      path.join(countryRoot, "global-burn-down/lib__teacher-portal__teacher-class-grade.json"),
      "utf8"
    )
  );
  assert.deepEqual(
    [
      classGrade.copy.grade_1,
      classGrade.copy.grade_2,
      classGrade.copy.grade_3,
      classGrade.copy.grade_4,
      classGrade.copy.grade_5,
      classGrade.copy.grade_6,
    ],
    ["الصف الأول", "الصف الثاني", "الصف الثالث", "الصف الرابع", "الصف الخامس", "الصف السادس"]
  );
});

test("ar-SA help overlays parse on ar-001 base and keep slugs", async () => {
  const help = await import("../../data/help-center/ar-SA/index.js");
  const baseParents = await import("../../data/help-center/ar-001/parents.js");
  const baseStudents = await import("../../data/help-center/ar-001/students.js");
  const baseReport = await import("../../data/help-center/ar-001/parent-report.js");
  const baseSubjects = await import("../../data/help-center/ar-001/subjects.js");

  assert.equal(
    help.ALL_ARTICLES_AR_SA.length,
    baseParents.PARENT_ARTICLES.length +
      baseStudents.STUDENT_ARTICLES.length +
      baseReport.PARENT_REPORT_ARTICLES.length +
      baseSubjects.SUBJECT_ARTICLES.length
  );
  assert.equal(help.SECTIONS_AR_SA.students.title, "دليل للطلاب");
  assert.doesNotMatch(help.SECTIONS_AR_SA.students.title, TALMEEDH_RE);

  const parentSlugs = new Set(baseParents.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_AR_SA.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }

  const welcome = help.BY_SECTION_AR_SA.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /المملكة العربية السعودية/);
  assert.match(JSON.stringify(welcome), /الصف الأول إلى الصف السادس/);

  const login = help.BY_SECTION_AR_SA.students.find((a) => a.slug === "student-login");
  assert.match(JSON.stringify(login), /تسجيل دخول الطالب/);
  assert.doesNotMatch(JSON.stringify(login), TALMEEDH_RE);

  const blob = JSON.stringify(help.ALL_ARTICLES_AR_SA);
  assert.doesNotMatch(blob, HEBREW_RE);
  assert.doesNotMatch(blob, CROSS_COUNTRY_RE);
});

test("ar-SA does not ship word-meanings overlay; English learning IDs preserved", () => {
  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);

  const skills = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "books/english-page-skills.json"), "utf8")
  );
  assert.ok(!("words" in skills));
  assert.ok(!("phonics" in skills));
  assert.equal(skills.grades?.g3?.grammar_question_frames?.title, "الأسئلة - تعزيز الصف الثالث");
  assert.match(skills.grades?.g4?.vocab_school?.title || "", /الطلاب/);
});

test("ar-SA other locales and shared runtime untouched", () => {
  assert.equal(fs.existsSync(path.join(ROOT, "locales", AUTHORITY, "common.json")), true);
  const ar001Common = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", AUTHORITY, "common.json"), "utf8")
  );
  assert.equal(ar001Common.grade1, "الصف 1");
  assert.equal(ar001Common.grade1 !== "الصف الأول", true);

  // Forbidden English chrome should not appear as standalone UI in ar-SA overlays.
  const localeBlob = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(localeBlob, FORBIDDEN_EN_UI_RE);
  assert.doesNotMatch(localeBlob, LATIN_COPILOT_RE);
});

test("ar-SA Copilot chrome uses Arabic Master product name مساعد الطيار", () => {
  // Authority: ar-001 ui.json names the feature مساعد الطيار الرئيسي (not Latin Copilot).
  const ar001Ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", AUTHORITY, "ui.json"), "utf8"));
  assert.match(ar001Ui.localeSettings?.description || "", /مساعد الطيار/);
  assert.match(ar001Ui.localeSettings?.reportHint || "", /مساعد الطيار/);

  const copilot = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "copilot.json"), "utf8"));
  const rebuild =
    copilot.answers["lib_parent-copilot_copilot-turn-payload"].server
      .could_not_verify_student_ownership_for_copilot_rebuild;
  assert.match(rebuild, new RegExp(COPILOT_AR_PRODUCT_NAME));
  assert.doesNotMatch(rebuild, LATIN_COPILOT_RE);
  assert.equal(
    rebuild,
    "تعذر التحقق من ملكية الطالب لإعادة بناء مساعد الطيار"
  );
});

test("ar-SA academic-grade surfaces use الصف not درجة; score/angle درجة may remain inherited", async () => {
  /** @type {string[]} */
  const academicHits = [];

  for (const rel of listJsonRel(path.join(ROOT, "locales", LOCALE))) {
    const blob = fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8");
    if (hasAcademicDarajah(blob)) academicHits.push(`locales/${rel}`);
  }
  for (const rel of listJsonRel(path.join(ROOT, "content-packs", LOCALE))) {
    const blob = fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8");
    if (hasAcademicDarajah(blob)) academicHits.push(`content-packs/${rel}`);
  }

  const help = await import("../../data/help-center/ar-SA/index.js");
  const helpBlob = JSON.stringify({
    sections: help.SECTIONS_AR_SA,
    articles: help.ALL_ARTICLES_AR_SA,
  });
  if (hasAcademicDarajah(helpBlob)) academicHits.push("data/help-center/ar-SA");

  assert.deepEqual(academicHits, [], `academic درجة remaining: ${JSON.stringify(academicHits)}`);

  // Explicit corrected surfaces
  const copilot = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "copilot.json"), "utf8"));
  assert.match(
    copilot.answers.utils_parent_copilot_intent_answer_composers
      ?.according_to_the_report_there_is_still_insufficient_evidence_for ||
      copilot.answers["utils_parent-copilot_intent-answer-composers"]
        .according_to_the_report_there_is_still_insufficient_evidence_for,
    /فوق الصف المذكور/
  );

  const diag = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "learning/diagnostic-labels.json"), "utf8")
  );
  assert.equal(diag.snippets.grade, "الصف");

  const hub = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/guides/hub-cards.json"), "utf8")
  );
  assert.match(hub[0].blurb, /مع الصف/);
  assert.doesNotMatch(hub[0].blurb, /مع الدرجة/);

  const mathSeo = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/practice/math.json"), "utf8")
  );
  assert.match(JSON.stringify(mathSeo.faq), /المحتوى والصف/);
  assert.doesNotMatch(JSON.stringify(mathSeo.faq), /المحتوى والدرجة/);

  const engSeo = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/practice/english.json"), "utf8")
  );
  assert.match(JSON.stringify(engSeo.sections), /حسب الصف/);
  assert.doesNotMatch(JSON.stringify(engSeo.sections), /حسب الدرجة/);

  const readingSeo = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/practice/reading.json"), "utf8")
  );
  assert.match(JSON.stringify(readingSeo), /اختر صفًا/);
  assert.match(JSON.stringify(readingSeo.faq), /مع الصف/);
  assert.doesNotMatch(JSON.stringify(readingSeo), /درجة/);

  // Inherited score/angle semantics must stay درجة (not forced to الصف)
  const ar001Learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", AUTHORITY, "learning.json"), "utf8"));
  assert.equal(ar001Learning.master.peakScore, "درجة الذروة");
  assert.equal(ar001Learning.geometry.reference.terms.right_angle.desc, "90 درجة");
  assert.match(ar001Learning.master.gradeRequired, /درجتك/);

  const saLearning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.match(saLearning.master.gradeRequired, /تحديث صفك/);
  assert.doesNotMatch(saLearning.master.gradeRequired, /درجتك/);

  const progressFaq = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", AUTHORITY, "public-seo/guides/parent-progress-tracking.json"),
      "utf8"
    )
  );
  assert.match(progressFaq.faq[0].q, /الدرجة المنخفضة/);
  assert.equal(
    fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/guides/parent-progress-tracking.json")),
    false,
    "score-sense الدرجة المنخفضة stays inherited"
  );

  assert.equal(help.SECTIONS_AR_SA.students.title, "دليل للطلاب");
  const edit = help.BY_SECTION_AR_SA.parents.find((a) => a.slug === "edit-or-delete-student");
  assert.match(edit.summary, /أو الصف/);
  assert.doesNotMatch(edit.summary, /الدرجة/);
  const mathHelp = help.BY_SECTION_AR_SA.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(mathHelp), /اختر الصف والمستوى/);
  assert.doesNotMatch(JSON.stringify(mathHelp), /اختر الدرجة والمستوى/);
});
