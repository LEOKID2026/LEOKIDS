/**
 * Qatar (ar-QA) sparse country overlay checks vs Arabic Master (ar-001).
 * Intended chain: ar-QA → ar-001 → en. No registry wiring / build / full suite.
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
const LOCALE = "ar-QA";
const AUTHORITY = "ar-001";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;

/** Other-country leakage — avoid substring hits (قطر ⊂ القطر / القطرية = diameter/diagonal). */
const CROSS_COUNTRY_RE =
  /المغرب|تونس|(?<![\u0600-\u06FF])مصر(?![\u0600-\u06FF])|السعودية|المملكة العربية|الجزائر|العراق|الإمارات|الامارات|دبي|الكويت|البحرين|الأردن|جنيه|درهم|السنة\s*(?:الأولى|1)\s*ابتدائي|السنة\s*1\s*متوسط|(?<![\u0600-\u06FF])قسم(?![\u0600-\u06FF])|CP1|CM2/i;

const DIGIT_GRADE_RE = /الصف [1-6](?!\d)/;
const TALMEEDH_RE = /تلميذ/;
const FORBIDDEN_EN_UI_RE =
  /\b(Grade|Student login|Parent login|Worksheet|Dashboard|Settings|Cancel|Save|Continue|Back|Next|Loading)\b/;

/** False claim: grades 1–6 = المرحلة التأسيسية */
const FALSE_FOUNDATIONAL_RE =
  /المرحلة التأسيسية.{0,40}(?:الصفوف?\s*)?(?:من\s*)?(?:الصف\s*)?الأول.{0,20}(?:إلى|حتى|-).{0,10}السادس|الصفوف?\s*(?:من\s*)?الأول(?:\s*(?:إلى|حتى|-)\s*السادس).{0,40}المرحلة التأسيسية|(?:grades?\s*)?1\s*[-–]\s*6.{0,30}التأسيسية/i;

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

const SEMESTERISH_CLASS_GROUP_RE = /الفصل الدراسي/;
const LATIN_COPILOT_RE = /\bCopilot\b/;
const COPILOT_AR_PRODUCT_NAME = "مساعد الطيار";

const QA_GRADES_SHORT = [
  "الصف الأول",
  "الصف الثاني",
  "الصف الثالث",
  "الصف الرابع",
  "الصف الخامس",
  "الصف السادس",
];

const QA_GRADES_FORMAL = [
  "الصف الأول الابتدائي",
  "الصف الثاني الابتدائي",
  "الصف الثالث الابتدائي",
  "الصف الرابع الابتدائي",
  "الصف الخامس الابتدائي",
  "الصف السادس الابتدائي",
];

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

/** @param {string} text */
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

/**
 * @param {unknown} base
 * @param {unknown} overlay
 */
function mergeOverlay(base, overlay) {
  if (overlay == null) return structuredClone(base);
  if (typeof overlay !== "object" || Array.isArray(overlay)) return structuredClone(overlay);
  const out = structuredClone(base);
  for (const [k, v] of Object.entries(/** @type {Record<string, unknown>} */ (overlay))) {
    const cur = /** @type {Record<string, unknown>} */ (out)[k];
    if (
      v &&
      typeof v === "object" &&
      !Array.isArray(v) &&
      cur &&
      typeof cur === "object" &&
      !Array.isArray(cur)
    ) {
      /** @type {Record<string, unknown>} */ (out)[k] = /** @type {any} */ (mergeOverlay(cur, v));
    } else {
      /** @type {Record<string, unknown>} */ (out)[k] = structuredClone(v);
    }
  }
  return out;
}

/**
 * Physical-class-group فصل (exclude disconnect / separate / science mixture / semester).
 * @param {string} s
 */
function isPhysicalClassFasl(s) {
  if (
    /فصل ولي الأمر|منفصل|المنفصلة|فصل الموضوع|فصل المخاليط|مفصل|عبارات الفصول|الفصل الدراسي/.test(s)
  ) {
    return false;
  }
  return (
    /الفصل|فصول|فصلاً|فصلًا|للفصل|بالفصل|للفصول|الفصول|في الفصل|إلى الفصل|اسم الفصل|تقرير الفصل|مواد الفصل|أطفال الفصل|أنشطة الفصل|معلم الفصل|إدارة الفصل|إنشاء فصل|أضف فصلا|هذا الفصل|لهذا الفصل|متوسط الفصل|تنقّل الفصل/.test(
      s
    ) || /(?:^|[^\u0600-\u06FF])فصل(?:$|[^\u0600-\u06FF])/.test(s)
  );
}

const RECOMMENDATION_DIGIT_GRADE_RE =
  /للصفوف\s*(?:من\s*)?[1-6]|الصفوف\s*(?:من\s*)?[1-6]|الصف\s+[1-6](?!\d)/;

test("ar-QA locale JSON parse + sparse contract vs ar-001", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", AUTHORITY);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  for (const required of [
    "common.json",
    "learning.json",
    "worksheets.json",
    "seo.json",
    "auth.json",
    "school.json",
    "teacher.json",
    "platform.json",
    "validation.json",
    "copilot.json",
    "ui.json",
  ]) {
    assert.ok(files.includes(required), `missing ${required}`);
  }

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
  /** @type {string[]} */
  const forbiddenEnHits = [];
  /** @type {string[]} */
  const academicDarajahHits = [];
  let overrideCount = 0;

  for (const file of files) {
    const country = JSON.parse(fs.readFileSync(path.join(countryDir, file), "utf8"));
    const basePath = path.join(baseDir, file);
    assert.ok(fs.existsSync(basePath), `missing ar-001 authority ${file}`);
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(file);
    overrideCount += leaves.size;
    for (const [key, value] of leaves) {
      if (HEBREW_RE.test(value)) hebrewHits.push(`${file}:${key}`);
      if (CROSS_COUNTRY_RE.test(value)) crossHits.push(`${file}:${key}:${value.match(CROSS_COUNTRY_RE)?.[0]}`);
      if (DIGIT_GRADE_RE.test(value)) digitGradeHits.push(`${file}:${key}`);
      if (TALMEEDH_RE.test(value)) talmeedhHits.push(`${file}:${key}`);
      if (FORBIDDEN_EN_UI_RE.test(value) && !FORBIDDEN_EN_UI_RE.test(String(collectStringLeaves(base).get(key) || ""))) {
        forbiddenEnHits.push(`${file}:${key}`);
      }
      if (hasAcademicDarajah(value)) academicDarajahHits.push(`${file}:${key}`);
      if (FALSE_FOUNDATIONAL_RE.test(value)) {
        assert.fail(`false foundational claim ${file}:${key}: ${value}`);
      }
    }
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
  assert.deepEqual(forbiddenEnHits, []);
  assert.deepEqual(academicDarajahHits, []);
  assert.ok(overrideCount > 0);
});

test("ar-QA grade mapping short UI + formal ابتدائي + primary stage", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    QA_GRADES_SHORT
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
    QA_GRADES_SHORT
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
    QA_GRADES_SHORT
  );

  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.equal(auth.studentLoginTitle, "تسجيل دخول الطالب");
  assert.equal(auth.studentName, "اسم الطالب");

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /قطر/);
  assert.match(seo.homeTitle, /لمرحلة الابتدائية|المرحلة الابتدائية/);
  assert.match(seo.homeTitle, /لصف الأول إلى الصف السادس|الصف الأول إلى الصف السادس/);
  assert.doesNotMatch(seo.homeTitle, FALSE_FOUNDATIONAL_RE);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.home?.ctaKids, "أنا طالب");
  assert.equal(ui.home?.ctaTeachers, "أنا معلم");
  assert.match(ui.home?.subhead || "", /قطر/);
  assert.match(ui.home?.subhead || "", /لمرحلة الابتدائية|المرحلة الابتدائية/);
  assert.match(ui.public?.about?.intro1 || "", /الصف الأول الابتدائي إلى الصف السادس الابتدائي/);
  assert.match(ui.public?.about?.intro1 || "", /لمرحلة الابتدائية|المرحلة الابتدائية/);
  assert.doesNotMatch(ui.public?.about?.intro1 || "", FALSE_FOUNDATIONAL_RE);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, TALMEEDH_RE);
  assert.doesNotMatch(allLocaleText, DIGIT_GRADE_RE);
  assert.doesNotMatch(allLocaleText, CROSS_COUNTRY_RE);
  assert.doesNotMatch(allLocaleText, HEBREW_RE);
  assert.doesNotMatch(allLocaleText, SEMESTERISH_CLASS_GROUP_RE);
  assert.doesNotMatch(allLocaleText, LATIN_COPILOT_RE);
  assert.doesNotMatch(allLocaleText, FALSE_FOUNDATIONAL_RE);
  assert.match(allLocaleText, /الطالب/);
  assert.match(allLocaleText, /الصف الأول/);
  assert.match(allLocaleText, /تحديث صفك/);
  assert.match(allLocaleText, /ولي الأمر/);
  assert.match(allLocaleText, /الشعبة/);
  assert.match(allLocaleText, new RegExp(COPILOT_AR_PRODUCT_NAME));
});

test("ar-QA grade/class-group distinction: الصف ≠ الشعبة", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal.classesSubtitle, "اختر الصف والشعبة والمادة - التقارير والإدارة حسب الصف");
  assert.equal(school.portal.choosePhysicalClass, "اختر الشعبة");
  assert.equal(school.portal.classLabel, "شعبة");
  assert.equal(school.portal.colClass, "شعبة");
  assert.doesNotMatch(school.portal.choosePhysicalClass, /^اختر الصف$/);
  assert.doesNotMatch(school.portal.classesSubtitle, SEMESTERISH_CLASS_GROUP_RE);
  assert.match(school.portal.classesSubtitle, /والشعبة والمادة/);
  assert.equal(school.communication.detailsFieldClass, "شعبة");
  assert.equal(school.communication.audienceClassParents, "أولياء أمور الشعبة");

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  assert.equal(teacher.fallback.classSuffix, "الشعبة {label}");
  assert.equal(teacher.dashboard.createClassButton, "إنشاء شعبة");
  assert.equal(teacher.assignmentTypes.classroom_activity, "نشاط الشعبة");

  const validation = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8")
  );
  assert.match(validation.api.physical_class_not_found, /شعبة/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.teacherShell.myClasses, "شعبي");
  assert.equal(ui.teacherShell.classReportTitle, "تقرير الشعبة");
});

test("ar-QA content packs sparse contract vs ar-001", () => {
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
  /** @type {string[]} */
  const academicDarajahHits = [];
  /** @type {string[]} */
  const falseFoundationalHits = [];

  assert.equal(fs.existsSync(path.join(countryRoot, "learning/taxonomy")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`)), false);

  for (const rel of listJsonRel(countryRoot)) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    const countryLeaves = collectStringLeaves(country);
    const allCountryStrings = collectAllStrings(country);
    if (countryLeaves.size === 0 && allCountryStrings.length === 0) emptyFiles.push(rel);

    for (const value of allCountryStrings) {
      if (FALSE_FOUNDATIONAL_RE.test(value)) falseFoundationalHits.push(`${rel}:${value.slice(0, 100)}`);
    }

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
        if (hasAcademicDarajah(value)) academicDarajahHits.push(`${rel}:[${i}]`);
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
        if (hasAcademicDarajah(value)) academicDarajahHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && hasAcademicDarajah(value)) academicDarajahHits.push(`${rel}:${key}`);
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
  assert.deepEqual(academicDarajahHits, []);
  assert.deepEqual(falseFoundationalHits, []);

  const gradePack = JSON.parse(
    fs.readFileSync(
      path.join(countryRoot, "global-burn-down/lib__teacher-portal__teacher-class-grade.json"),
      "utf8"
    )
  );
  assert.deepEqual(
    [
      gradePack.copy.grade_1,
      gradePack.copy.grade_2,
      gradePack.copy.grade_3,
      gradePack.copy.grade_4,
      gradePack.copy.grade_5,
      gradePack.copy.grade_6,
    ],
    QA_GRADES_SHORT
  );

  const rewards = JSON.parse(fs.readFileSync(path.join(countryRoot, "rewards/ui.json"), "utf8"));
  assert.equal(rewards.gradeBands.g12, "الصف الأول–الثاني");
  assert.equal(rewards.gradeBands.g34, "الصف الثالث–الرابع");
  assert.equal(rewards.gradeBands.g56, "الصف الخامس–السادس");

  const demo = JSON.parse(fs.readFileSync(path.join(countryRoot, "demo/ui.json"), "utf8"));
  assert.match(demo.enter.activeSessionNote, /تغيير الصف/);
  assert.doesNotMatch(demo.enter.activeSessionNote, /تغيير الدرجة/);

  const schoolsSeo = JSON.parse(
    fs.readFileSync(path.join(countryRoot, "public-seo/marketing/schools.json"), "utf8")
  );
  const primaryBenefit = (schoolsSeo.benefits?.items || []).find((i) =>
    /لمرحلة الابتدائية|المرحلة الابتدائية/.test(i?.title || "")
  );
  assert.ok(primaryBenefit, "schools SEO must claim المرحلة الابتدائية for product grades");
  assert.doesNotMatch(JSON.stringify(schoolsSeo), FALSE_FOUNDATIONAL_RE);
  assert.doesNotMatch(JSON.stringify(schoolsSeo), /التعليم الأساسي/);
  assert.equal(schoolsSeo.infoSections?.[0]?.bullets?.[2], "عرض الطلاب المسجّلين.");
  assert.doesNotMatch(JSON.stringify(schoolsSeo), TALMEEDH_RE);
});

test("ar-QA help-center sparse overlays: طالب + ابتدائي grades + primary stage", async () => {
  const helpRoot = path.join(ROOT, "data/help-center", LOCALE);
  assert.ok(fs.existsSync(path.join(helpRoot, "index.js")));
  assert.ok(fs.existsSync(path.join(helpRoot, "parents.js")));
  assert.ok(fs.existsSync(path.join(helpRoot, "students.js")));
  assert.ok(fs.existsSync(path.join(helpRoot, "subjects.js")));
  assert.ok(fs.existsSync(path.join(helpRoot, "parent-report.js")));
  assert.ok(fs.existsSync(path.join(helpRoot, "merge-overlays.js")));

  const { SECTIONS_AR_QA, BY_SECTION_AR_QA, ALL_ARTICLES_AR_QA } = await import(
    `../../data/help-center/${LOCALE}/index.js`
  );
  assert.equal(SECTIONS_AR_QA.students.title, "دليل للطلاب");
  assert.match(SECTIONS_AR_QA.students.description, /الطلاب|تسجيل/);
  assert.ok(Array.isArray(ALL_ARTICLES_AR_QA));
  assert.ok(ALL_ARTICLES_AR_QA.length > 0);

  const welcome = BY_SECTION_AR_QA.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeBlob = JSON.stringify(welcome);
  assert.match(welcomeBlob, /قطر/);
  assert.match(welcomeBlob, /المرحلة الابتدائية/);
  assert.match(welcomeBlob, /الصف الأول الابتدائي/);
  assert.match(welcomeBlob, /الصف السادس الابتدائي/);
  assert.doesNotMatch(welcomeBlob, FALSE_FOUNDATIONAL_RE);
  assert.doesNotMatch(welcomeBlob, TALMEEDH_RE);

  const addStudents = BY_SECTION_AR_QA.parents.find((a) => a.slug === "add-students");
  const listBlock = (addStudents?.blocks || []).find((b) => Array.isArray(b.items));
  assert.ok(listBlock);
  assert.deepEqual(listBlock.items, QA_GRADES_FORMAL.map((g, i) => `${g} — grade_${i + 1}`));

  const studentLogin = BY_SECTION_AR_QA.students.find((a) => a.slug === "student-login");
  assert.match(JSON.stringify(studentLogin), /تسجيل دخول الطالب/);
  assert.doesNotMatch(JSON.stringify(studentLogin), TALMEEDH_RE);

  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = BY_SECTION_AR_QA.subjects.find((a) => a.slug === slug);
    assert.ok(article, slug);
    assert.match(article.summary || "", /للصفوف من الأول إلى السادس/);
    assert.doesNotMatch(article.summary || "", /للصفوف 1\s*[-–]\s*6|من 1 إلى 6/);
    const who = (article.blocks || []).find(
      (b) => b.kind === "paragraph" && /تم تصميم الممارسة للأطفال/.test(b.text || "")
    );
    assert.ok(who, `${slug} who-paragraph`);
    assert.match(who.text || "", /في الصفوف من الأول إلى السادس/);
    assert.doesNotMatch(who.text || "", /من 1 إلى 6/);
    assert.match(JSON.stringify(article), /اختر الصف والمستوى/);
    assert.doesNotMatch(JSON.stringify(article), /اختر الدرجة والمستوى/);
  }

  const helpBlob = JSON.stringify({ SECTIONS_AR_QA, BY_SECTION_AR_QA });
  assert.doesNotMatch(helpBlob, HEBREW_RE);
  assert.doesNotMatch(helpBlob, CROSS_COUNTRY_RE);
  assert.doesNotMatch(helpBlob, FALSE_FOUNDATIONAL_RE);
  assert.doesNotMatch(helpBlob, /للصفوف 1\s*[-–]\s*6|الصفوف من 1 إلى 6/);
  assert.doesNotMatch(helpBlob, TALMEEDH_RE);
});

test("ar-QA MAIN-wired /qa; no currency; Western digits", () => {
  const registry = fs.readFileSync(path.join(ROOT, "lib/i18n/locale-registry.js"), "utf8");
  assert.equal(/"ar-QA"/.test(registry), true);
  assert.equal(/pathPrefix:\s*"qa"/.test(registry), true);

  const allQa = [
    ...listJsonRel(path.join(ROOT, "locales", LOCALE)).map((r) =>
      fs.readFileSync(path.join(ROOT, "locales", LOCALE, r), "utf8")
    ),
    ...listJsonRel(path.join(ROOT, "content-packs", LOCALE)).map((r) =>
      fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, r), "utf8")
    ),
  ].join("\n");
  assert.doesNotMatch(allQa, /الريال|QAR|ر\.ق/);
  assert.doesNotMatch(allQa, /[\u0660-\u0669]/);
});

test("ar-QA effective resolved copy: تلميذ/فصل/درجة/false-foundational = 0", async () => {
  /** @type {string[]} */
  const talmeedhDefects = [];
  /** @type {string[]} */
  const faslDefects = [];
  /** @type {string[]} */
  const academicDarajahDefects = [];
  /** @type {string[]} */
  const digitBandDefects = [];
  /** @type {string[]} */
  const falseFoundationalDefects = [];

  const localeNamespaces = [
    "common",
    "learning",
    "worksheets",
    "auth",
    "school",
    "teacher",
    "platform",
    "validation",
    "copilot",
    "seo",
    "ui",
  ];
  for (const ns of localeNamespaces) {
    const base = JSON.parse(
      fs.readFileSync(path.join(ROOT, "locales", AUTHORITY, `${ns}.json`), "utf8")
    );
    const overlayPath = path.join(ROOT, "locales", LOCALE, `${ns}.json`);
    const overlay = fs.existsSync(overlayPath)
      ? JSON.parse(fs.readFileSync(overlayPath, "utf8"))
      : {};
    const effective = mergeOverlay(base, overlay);
    for (const [key, value] of collectStringLeaves(effective)) {
      if (TALMEEDH_RE.test(value)) talmeedhDefects.push(`locales/${ns}.json:${key}`);
      if (isPhysicalClassFasl(value)) faslDefects.push(`locales/${ns}.json:${key}`);
      if (hasAcademicDarajah(value)) academicDarajahDefects.push(`locales/${ns}.json:${key}`);
      if (FALSE_FOUNDATIONAL_RE.test(value)) falseFoundationalDefects.push(`locales/${ns}.json:${key}`);
    }
  }

  const baseIdx = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", AUTHORITY, "global-burn-down/burn-down-index.json"),
      "utf8"
    )
  );
  const qaIdx = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/burn-down-index.json"),
      "utf8"
    )
  );
  const effIdx = /** @type {Record<string, Record<string, string>>} */ (mergeOverlay(baseIdx, qaIdx));
  for (const [slug, map] of Object.entries(effIdx)) {
    if (!/teacher|school|student|worksheet|product-context|pages___app|StudentClassroom/i.test(slug)) {
      continue;
    }
    if (/worksheet-english-sentences/.test(slug)) continue;
    for (const [key, value] of Object.entries(map)) {
      if (typeof value !== "string") continue;
      if (TALMEEDH_RE.test(value)) talmeedhDefects.push(`index:${slug}.${key}`);
      if (isPhysicalClassFasl(value)) faslDefects.push(`index:${slug}.${key}`);
      if (hasAcademicDarajah(value)) academicDarajahDefects.push(`index:${slug}.${key}`);
      if (FALSE_FOUNDATIONAL_RE.test(value)) falseFoundationalDefects.push(`index:${slug}.${key}`);
    }
  }

  const baseTemplates = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        AUTHORITY,
        "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
      ),
      "utf8"
    )
  );
  const qaTemplates = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        LOCALE,
        "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json"
      ),
      "utf8"
    )
  );
  const effTemplates = mergeOverlay(baseTemplates, qaTemplates);
  for (const [key, value] of collectStringLeaves(effTemplates)) {
    if (RECOMMENDATION_DIGIT_GRADE_RE.test(value)) digitBandDefects.push(`templates:${key}`);
    if (hasAcademicDarajah(value)) academicDarajahDefects.push(`templates:${key}`);
  }

  const baseNext = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        AUTHORITY,
        "learning/burn-down/utils__topic-next-step-engine.json"
      ),
      "utf8"
    )
  );
  const qaNext = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        LOCALE,
        "learning/burn-down/utils__topic-next-step-engine.json"
      ),
      "utf8"
    )
  );
  const effNext = mergeOverlay(baseNext, qaNext);
  for (const [key, value] of collectStringLeaves(effNext)) {
    if (hasAcademicDarajah(value) || /رفع درجة|درجة أقل/.test(value)) {
      academicDarajahDefects.push(`next-step:${key}`);
    }
  }

  const diagBase = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", AUTHORITY, "learning/diagnostic-labels.json"),
      "utf8"
    )
  );
  const diagQa = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "learning/diagnostic-labels.json"),
      "utf8"
    )
  );
  const effDiag = mergeOverlay(diagBase, diagQa);
  assert.equal(/** @type {any} */ (effDiag).snippets.grade, "الصف");

  const help = await import(`../../data/help-center/${LOCALE}/index.js`);
  const helpBlob = JSON.stringify({
    sections: help.SECTIONS_AR_QA,
    articles: help.ALL_ARTICLES_AR_QA,
  });
  if (TALMEEDH_RE.test(helpBlob)) talmeedhDefects.push("help-center");
  if (hasAcademicDarajah(helpBlob)) academicDarajahDefects.push("help-center");
  if (FALSE_FOUNDATIONAL_RE.test(helpBlob)) falseFoundationalDefects.push("help-center");

  assert.deepEqual(talmeedhDefects, [], `school-role تلميذ defects: ${JSON.stringify(talmeedhDefects)}`);
  assert.deepEqual(faslDefects, [], `physical-class فصل defects: ${JSON.stringify(faslDefects)}`);
  assert.deepEqual(
    academicDarajahDefects,
    [],
    `academic درجة defects: ${JSON.stringify(academicDarajahDefects)}`
  );
  assert.deepEqual(
    digitBandDefects,
    [],
    `recommendation digit-grade defects: ${JSON.stringify(digitBandDefects)}`
  );
  assert.deepEqual(
    falseFoundationalDefects,
    [],
    `false foundational defects: ${JSON.stringify(falseFoundationalDefects)}`
  );

  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.equal(common.grade1, "الصف الأول");
  const addStudents = help.BY_SECTION_AR_QA.parents.find((a) => a.slug === "add-students");
  const listBlock = (addStudents?.blocks || []).find((b) => Array.isArray(b.items));
  assert.equal(listBlock.items[0], "الصف الأول الابتدائي — grade_1");
  assert.notEqual(common.grade1, listBlock.items[0].split(" — ")[0]);
});

test("ar-QA does not modify ar-001 / other locales / shared runtime", () => {
  const forbiddenTouched = [
    "lib/i18n/locale-registry.js",
    "lib/i18n/load-messages.js",
    "lib/content/pack-catalog.js",
    "data/help-center/index.js",
  ];
  for (const rel of forbiddenTouched) {
    assert.ok(fs.existsSync(path.join(ROOT, rel)), `shared file missing: ${rel}`);
  }
  assert.ok(fs.existsSync(path.join(ROOT, "locales/ar-001/common.json")));
  assert.ok(fs.existsSync(path.join(ROOT, "locales/ar-QA/common.json")));
  assert.ok(fs.existsSync(path.join(ROOT, "locales/ar-JO/common.json")));
});

const PUBLIC_SEO_NUMERIC_RE =
  /الصف [1-6](?!\d)|الصفوف\s*1\s*[-–]\s*2|الصفوف\s*3\s*[-–]\s*4|الصفوف\s*5\s*[-–]\s*6|الصفوف\s*1\s*[-–]\s*6|من 1 إلى 6|للصفوف 1\s*[-–]/;

/**
 * @param {string} dir
 * @param {string} [prefix]
 * @returns {string[]}
 */
function listPublicSeoRel(dir, prefix = "") {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${ent.name}` : ent.name;
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...listPublicSeoRel(abs, rel));
    else if (ent.name.endsWith(".json")) out.push(rel.replace(/\\/g, "/"));
  }
  return out.sort();
}

test("ar-QA audit findings closure: Help + Public SEO numeric + student-role = 0", async () => {
  const help = await import(`../../data/help-center/${LOCALE}/index.js`);

  // A — 8 Help subject leaves (summary + who-paragraph × 4)
  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = help.BY_SECTION_AR_QA.subjects.find((a) => a.slug === slug);
    assert.match(article.summary || "", /من الأول إلى السادس/);
    assert.doesNotMatch(article.summary || "", PUBLIC_SEO_NUMERIC_RE);
    const who = (article.blocks || []).find(
      (b) => b.kind === "paragraph" && /تم تصميم الممارسة للأطفال/.test(b.text || "")
    );
    assert.match(who?.text || "", /من الأول إلى السادس/);
    assert.doesNotMatch(who?.text || "", PUBLIC_SEO_NUMERIC_RE);
  }

  // B — Public SEO numeric closures
  const hubBase = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", AUTHORITY, "public-seo/practice/hub.json"), "utf8")
  );
  const hubOv = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/practice/hub.json"), "utf8")
  );
  const hub = mergeOverlay(hubBase, hubOv);
  assert.match(hub.faq[0].a, /للصفوف من الأول إلى السادس/);
  assert.doesNotMatch(hub.faq[0].a, PUBLIC_SEO_NUMERIC_RE);

  const geoBase = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", AUTHORITY, "public-seo/practice/geometry.json"),
      "utf8"
    )
  );
  const geoOv = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/practice/geometry.json"), "utf8")
  );
  const geo = mergeOverlay(geoBase, geoOv);
  assert.equal(geo.badge, "الهندسة للصفوف من الأول إلى السادس");
  const geoBands = geo.sections.find((s) => Array.isArray(s.gradeSections))?.gradeSections || [];
  assert.deepEqual(
    geoBands.map((g) => g.title),
    ["الصفان الأول والثاني", "الصفان الثالث والرابع", "الصفان الخامس والسادس"]
  );

  for (const slug of ["science", "games", "no-print"]) {
    const base = JSON.parse(
      fs.readFileSync(
        path.join(ROOT, "content-packs", AUTHORITY, "public-seo/practice", `${slug}.json`),
        "utf8"
      )
    );
    const ov = JSON.parse(
      fs.readFileSync(
        path.join(ROOT, "content-packs", LOCALE, "public-seo/practice", `${slug}.json`),
        "utf8"
      )
    );
    const eff = mergeOverlay(base, ov);
    const bands = eff.sections.find((s) => Array.isArray(s.gradeSections))?.gradeSections || [];
    assert.deepEqual(
      bands.map((g) => g.title),
      ["الصفوف الأول–الثاني", "الصفوف الثالث–الرابع", "الصفوف الخامس–السادس"],
      slug
    );
    for (const title of bands.map((g) => g.title)) {
      assert.doesNotMatch(title, PUBLIC_SEO_NUMERIC_RE);
    }
  }

  // C — Legal 5 role leaves + schools marketing bullet
  const legalBase = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", AUTHORITY, "public-seo/legal/unified.json"),
      "utf8"
    )
  );
  const legalOv = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, "public-seo/legal/unified.json"), "utf8")
  );
  const legal = mergeOverlay(legalBase, legalOv);
  const intro = legal.unifiedLegalSections.find((s) => s.id === "intro");
  const privateTeachers = legal.unifiedLegalSections.find((s) => s.id === "private-teachers");
  const childrenData = legal.unifiedLegalSections.find((s) => s.id === "children-data");
  assert.match(intro.paragraphs[3], /الطلاب/);
  assert.match(privateTeachers.paragraphs[1], /الطلاب/);
  assert.match(privateTeachers.paragraphs[2], /الطلاب/);
  assert.match(privateTeachers.paragraphs[3], /الطالب/);
  assert.match(childrenData.paragraphs[4], /الطلاب/);
  assert.doesNotMatch(JSON.stringify(legal.unifiedLegalSections), TALMEEDH_RE);

  const schoolsBase = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", AUTHORITY, "public-seo/marketing/schools.json"),
      "utf8"
    )
  );
  const schoolsOv = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "public-seo/marketing/schools.json"),
      "utf8"
    )
  );
  const schools = mergeOverlay(schoolsBase, schoolsOv);
  assert.equal(schools.infoSections[0].bullets[2], "عرض الطلاب المسجّلين.");
  assert.doesNotMatch(schools.infoSections[0].bullets[2], TALMEEDH_RE);

  // D — residual scans across Help + all Public SEO
  /** @type {string[]} */
  const numericHits = [];
  /** @type {string[]} */
  const roleHits = [];
  const helpBlob = JSON.stringify({
    sections: help.SECTIONS_AR_QA,
    articles: help.ALL_ARTICLES_AR_QA,
  });
  if (PUBLIC_SEO_NUMERIC_RE.test(helpBlob)) numericHits.push("help-center");
  if (TALMEEDH_RE.test(helpBlob)) roleHits.push("help-center");

  const baseSeoRoot = path.join(ROOT, "content-packs", AUTHORITY, "public-seo");
  for (const rel of listPublicSeoRel(baseSeoRoot)) {
    const base = JSON.parse(fs.readFileSync(path.join(baseSeoRoot, rel), "utf8"));
    const ovPath = path.join(ROOT, "content-packs", LOCALE, "public-seo", rel);
    const ov = fs.existsSync(ovPath) ? JSON.parse(fs.readFileSync(ovPath, "utf8")) : {};
    const eff = mergeOverlay(base, ov);
    for (const value of collectAllStrings(eff)) {
      if (PUBLIC_SEO_NUMERIC_RE.test(value)) numericHits.push(`${rel}:${value.slice(0, 80)}`);
      if (TALMEEDH_RE.test(value)) roleHits.push(`${rel}:${value.slice(0, 80)}`);
    }
  }

  // Role scan also covers school/teacher/reports/demo locale+pack surfaces already gated;
  // keep public-seo + help as the audit residual surfaces for this closure.
  assert.deepEqual(numericHits, [], `numeric academic grade residuals: ${JSON.stringify(numericHits)}`);
  assert.deepEqual(roleHits, [], `student-role residuals: ${JSON.stringify(roleHits)}`);
});
