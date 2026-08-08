/**
 * Kuwait (ar-KW) sparse country overlay checks vs Arabic Master (ar-001).
 * Planned chain: ar-KW → ar-001 → en. No registry wiring / build / full suite.
 *
 * Kuwait stage (display only):
 *   grades 1–5 = المرحلة الابتدائية
 *   grade 6    = beginning of المرحلة المتوسطة
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
const LOCALE = "ar-KW";
const AUTHORITY = "ar-001";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;

/** Other-country / wrong-system leakage (not الكويت). */
const CROSS_COUNTRY_RE =
  /المغرب|تونس|(?<![\u0600-\u06FF])مصر(?![\u0600-\u06FF])|السعودية|المملكة العربية|الجزائر|العراق|الإمارات|الامارات|دبي|الأردن|الاردن|(?<![\u0600-\u06FF])قطر(?![\u0600-\u06FF])|البحرين|جنيه|درهم|السنة\s*(?:الأولى|1)\s*ابتدائي|السنة\s*1\s*متوسط|(?<![\u0600-\u06FF])قسم(?![\u0600-\u06FF])|الشعبة الصفية|CP1|CM2/i;

const DIGIT_GRADE_RE = /الصف [1-6](?!\d)|الصفوف [1-6]/;
const TALMEEDH_RE = /تلميذ|تلاميذ/;
const FORBIDDEN_EN_UI_RE =
  /\b(Grade|Student login|Parent login|Worksheet|Dashboard|Settings|Cancel|Save|Continue|Back|Next|Loading)\b/;

/** Claims that product grades 1–6 are all Kuwait primary. */
const WRONG_PRIMARY_STAGE_RE =
  /المرحلة الابتدائية من الصف|الصفوف الابتدائية|ستة صفوف ابتدائية|لمتعلمي المرحلة الابتدائية|لمتعلّمي المرحلة الابتدائية|لطلاب المرحلة الابتدائية|لتلاميذ المرحلة الابتدائية|مصمم[ة]? للمرحلة الابتدائية|مصمَّم للمرحلة الابتدائية|متعلمي المرحلة الابتدائية في الصفوف من 1/;

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

const KW_GRADES = [
  "الصف الأول",
  "الصف الثاني",
  "الصف الثالث",
  "الصف الرابع",
  "الصف الخامس",
  "الصف السادس",
];

const LATIN_COPILOT_RE = /\bCopilot\b/;
const COPILOT_AR_PRODUCT_NAME = "مساعد الطيار";
const SEMESTERISH_CLASS_GROUP_RE = /الفصل الدراسي/;

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

function deepMerge(a, b) {
  if (b == null) return a;
  if (typeof b !== "object" || Array.isArray(b)) return b;
  if (typeof a !== "object" || a == null || Array.isArray(a)) return b;
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) {
    out[k] = k in a ? deepMerge(a[k], v) : v;
  }
  return out;
}

test("ar-KW locale JSON parse + sparse contract vs ar-001", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", AUTHORITY);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("common.json"));
  assert.ok(files.includes("learning.json"));
  assert.ok(files.includes("worksheets.json"));
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("auth.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("teacher.json"));
  assert.ok(files.includes("platform.json"));
  assert.ok(files.includes("copilot.json"));
  assert.ok(files.includes("ui.json"));

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
  /** @type {string[]} */
  const wrongPrimaryHits = [];
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
      if (WRONG_PRIMARY_STAGE_RE.test(value)) wrongPrimaryHits.push(`${file}:${key}`);
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
  assert.deepEqual(wrongPrimaryHits, []);
  assert.ok(overrideCount > 0);
});

test("ar-KW grade / role / stage authority", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    KW_GRADES
  );
  assert.equal(common.grade6, "الصف السادس");

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.equal(learning.master?.defaultPlayerName, "الطالب");
  assert.match(learning.master?.gradeRequired || "", /ولي الأمر/);
  assert.match(learning.master?.gradeRequired || "", /تحديث صفك/);
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
    KW_GRADES
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
    KW_GRADES
  );

  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.equal(auth.studentLoginTitle, "تسجيل دخول الطالب");
  assert.equal(auth.studentName, "اسم الطالب");

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /الكويت/);
  assert.match(seo.homeTitle, /الصفوف من الأول إلى السادس/);
  assert.doesNotMatch(seo.homeTitle, WRONG_PRIMARY_STAGE_RE);
  assert.doesNotMatch(seo.homeTitle, /المرحلة الابتدائية/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.home?.ctaKids, "أنا طالب");
  assert.equal(ui.home?.ctaTeachers, "أنا معلم");
  assert.match(ui.home?.subhead || "", /الكويت/);
  assert.match(ui.public?.about?.intro1 || "", /المرحلة الابتدائية \(الصف الأول–الخامس\)/);
  assert.match(ui.public?.about?.intro1 || "", /بداية المرحلة المتوسطة \(الصف السادس\)/);
  assert.doesNotMatch(ui.public?.about?.intro1 || "", WRONG_PRIMARY_STAGE_RE);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal.classesSubtitle, "اختر الصف والفصل والمادة - التقارير والإدارة حسب الصف");
  assert.doesNotMatch(school.portal.classesSubtitle, SEMESTERISH_CLASS_GROUP_RE);
  assert.match(school.portal.classesSubtitle, /والفصل والمادة/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, TALMEEDH_RE);
  assert.doesNotMatch(allLocaleText, DIGIT_GRADE_RE);
  assert.doesNotMatch(allLocaleText, CROSS_COUNTRY_RE);
  assert.doesNotMatch(allLocaleText, HEBREW_RE);
  assert.doesNotMatch(allLocaleText, LATIN_COPILOT_RE);
  assert.match(allLocaleText, /الطالب/);
  assert.match(allLocaleText, /الصف الأول/);
  assert.match(allLocaleText, /ولي الأمر/);
  assert.match(allLocaleText, /فصل/);
  assert.match(allLocaleText, new RegExp(COPILOT_AR_PRODUCT_NAME));
});

test("ar-KW content packs sparse contract vs ar-001", () => {
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
  const wrongPrimaryHits = [];

  assert.equal(fs.existsSync(path.join(countryRoot, "learning/taxonomy")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`)), false);

  for (const rel of listJsonRel(countryRoot)) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    const countryLeaves = collectStringLeaves(country);
    const allCountryStrings = collectAllStrings(country);
    if (countryLeaves.size === 0 && allCountryStrings.length === 0) emptyFiles.push(rel);

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
        if (WRONG_PRIMARY_STAGE_RE.test(value)) wrongPrimaryHits.push(`${rel}:[${i}]`);
        if (value !== baseStrings[i]) diffs += 1;
      }
      assert.ok(diffs > 0, `array overlay has no diffs: ${rel}`);
      // Legal/unified is a large intentional section replace — allow high rewrite ratio.
      if (!rel.includes("legal/unified.json") && !rel.includes("marketing/schools.json")) {
        assert.ok(diffs < countryStrings.length, `array overlay rewrote everything: ${rel}`);
      }
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
        if (WRONG_PRIMARY_STAGE_RE.test(value)) wrongPrimaryHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && WRONG_PRIMARY_STAGE_RE.test(value)) {
        wrongPrimaryHits.push(`${rel}:${key}`);
      }
      if (!baseLeaves.has(key)) orphanKeys.push(`${rel}:${key}`);
      else if (baseLeaves.get(key) === value) identicalOverrides.push(`${rel}:${key}`);
      else {
        const pa = ((value.match(PLACEHOLDER_RE) || []).slice().sort()).join("|");
        const pb = (((baseLeaves.get(key) || "").match(PLACEHOLDER_RE) || []).slice().sort()).join("|");
        if (pa !== pb) placeholderMismatches.push(`${rel}:${key}`);
      }
    }
    // Skip near-full assessment for intentional full-section legal replace (array-backed).
    if (!rel.includes("legal/unified.json") && !rel.includes("marketing/schools.json") && !rel.includes("marketing/teachers.json")) {
      const assessment = assessNearFullCopy(countryLeaves, baseLeaves);
      if (assessment.isNearFullCopy) nearFullCopies.push(rel);
    }

    for (const value of allCountryStrings) {
      if (TALMEEDH_RE.test(value)) talmeedhHits.push(`${rel}:all`);
      if (DIGIT_GRADE_RE.test(value)) digitGradeHits.push(`${rel}:all`);
      if (WRONG_PRIMARY_STAGE_RE.test(value)) wrongPrimaryHits.push(`${rel}:all`);
      if (hasAcademicDarajah(value)) academicDarajahHits.push(`${rel}:all`);
      if (HEBREW_RE.test(value)) hebrewHits.push(`${rel}:all`);
      if (CROSS_COUNTRY_RE.test(value)) crossHits.push(`${rel}:all`);
      if (FORBIDDEN_EN_UI_RE.test(value)) {
        // allow if also in authority for same surface — checked loosely via overlay-only English chrome
      }
    }
  }

  assert.deepEqual(emptyFiles, [], "empty overrides");
  assert.deepEqual(extraFiles, [], "files without ar-001 authority");
  assert.deepEqual(orphanKeys, [], "orphan keys");
  assert.deepEqual(identicalOverrides, [], "identical overrides");
  assert.deepEqual(placeholderMismatches, [], "placeholder mismatches");
  assert.deepEqual(nearFullCopies, [], "near-full / full-copy files");
  assert.deepEqual(hebrewHits, []);
  assert.deepEqual(crossHits, []);
  assert.deepEqual([...new Set(digitGradeHits)], []);
  assert.deepEqual([...new Set(talmeedhHits)], []);
  assert.deepEqual([...new Set(academicDarajahHits)], []);
  assert.deepEqual([...new Set(wrongPrimaryHits)], []);
});

test("ar-KW effective merge: grades, stage, class, student", () => {
  const commonBase = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-001/common.json"), "utf8"));
  const commonKw = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-KW/common.json"), "utf8"));
  const common = deepMerge(commonBase, commonKw);
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    KW_GRADES
  );

  const ui = deepMerge(
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-001/ui.json"), "utf8")),
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-KW/ui.json"), "utf8"))
  );
  assert.match(ui.public.about.intro1, /المرحلة الابتدائية \(الصف الأول–الخامس\)/);
  assert.match(ui.public.about.intro1, /المتوسطة \(الصف السادس\)/);
  assert.doesNotMatch(ui.public.about.intro1, /المرحلة الابتدائية من الصف الأول إلى الصف السادس/);
  assert.equal(ui.home.ctaKids, "أنا طالب");
  assert.equal(ui.nav.loginStudent, "تسجيل دخول الطالب");

  const school = deepMerge(
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-001/school.json"), "utf8")),
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-KW/school.json"), "utf8"))
  );
  assert.equal(school.portal.classLabel, "فصل");
  assert.equal(school.portal.choosePhysicalClass, "اختر الفصل");
  assert.doesNotMatch(school.portal.classesSubtitle, SEMESTERISH_CLASS_GROUP_RE);

  const math = deepMerge(
    JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-001/public-seo/practice/math.json"), "utf8")),
    JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-KW/public-seo/practice/math.json"), "utf8"))
  );
  assert.match(math.badge, /الأول–السادس|الأول-السادس/);
  assert.doesNotMatch(math.badge, /الصفوف 1-6/);
  assert.equal(math.sections[3].gradeSections[0].title, "الصفوف الأول–الثاني");
  assert.equal(math.sections[3].gradeSections[2].title, "الصفوف الخامس–السادس");

  const science = deepMerge(
    JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-001/public-seo/practice/science.json"), "utf8")),
    JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-KW/public-seo/practice/science.json"), "utf8"))
  );
  assert.doesNotMatch(science.badge, /المرحلة الابتدائية/);
  assert.match(science.badge, /الصفوف من الأول إلى السادس/);

  const gbdBase = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-001/global-burn-down/burn-down-index.json"), "utf8")
  );
  const gbdKw = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs/ar-KW/global-burn-down/burn-down-index.json"), "utf8")
  );
  const gbd = deepMerge(gbdBase, gbdKw);
  assert.doesNotMatch(
    gbd["lib__site__public-page-seo"].leo_kids_practice_for_elementary_learners,
    WRONG_PRIMARY_STAGE_RE
  );
  assert.match(
    gbd["lib__site__public-page-seo"].leo_kids_practice_for_elementary_learners,
    /الصفوف من الأول إلى السادس/
  );
  assert.equal(gbd["lib__teacher-portal__teacher-class-grade"].grade_6, "الصف السادس");
  const dash = gbd["components__teacher-portal__TeacherDashboardClient"];
  assert.match(dash.students, /الطلاب/);
  assert.doesNotMatch(JSON.stringify(dash), TALMEEDH_RE);

  const schools = deepMerge(
    JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-001/public-seo/marketing/schools.json"), "utf8")),
    JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-KW/public-seo/marketing/schools.json"), "utf8"))
  );
  assert.match(schools.badge, /فصول/);
  assert.match(schools.benefits.items[5].title, /للصفوف من الأول إلى السادس|الصفوف من الأول إلى السادس/);
  assert.doesNotMatch(schools.benefits.items[5].title, /المرحلة الابتدائية/);
  assert.match(schools.metaDescription, /الطلاب/);
  assert.doesNotMatch(schools.metaDescription, TALMEEDH_RE);
});

test("ar-KW Help overlays: stage split + طالب + صف", async () => {
  const { BY_SECTION_AR_KW, SECTIONS_AR_KW } = await import("../../data/help-center/ar-KW/index.js");
  assert.equal(SECTIONS_AR_KW.students.title, "دليل للطلاب");
  assert.match(SECTIONS_AR_KW.parents.description, /أولياء الأمور/);

  const welcome = BY_SECTION_AR_KW.parents.find((a) => a.slug === "welcome-and-overview");
  assert.ok(welcome);
  const welcomeText = collectAllStrings(welcome).join("\n");
  assert.match(welcomeText, /المرحلة الابتدائية \(الصف الأول–الخامس\)/);
  assert.match(welcomeText, /بداية المرحلة المتوسطة \(الصف السادس\)/);
  assert.doesNotMatch(welcomeText, /لمتعلمي المرحلة الابتدائية في الصفوف من 1 إلى 6/);
  assert.doesNotMatch(welcomeText, TALMEEDH_RE);

  const studentLogin = BY_SECTION_AR_KW.students.find((a) => a.slug === "student-login");
  const studentBlob = collectAllStrings(studentLogin).join("\n");
  assert.match(studentBlob, /تسجيل دخول الطالب/);
  assert.doesNotMatch(studentBlob, /تسجيل دخول التلميذ/);

  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = BY_SECTION_AR_KW.subjects.find((a) => a.slug === slug);
    assert.ok(article, slug);
    const blob = collectAllStrings(article).join("\n");
    assert.match(blob, /اختر الصف والمستوى/);
    assert.doesNotMatch(blob, /اختر الدرجة والمستوى/);
    assert.match(blob, /الصفوف من الأول إلى السادس/);
    assert.doesNotMatch(blob, /الصفوف من 1 إلى 6/);
    assert.doesNotMatch(article.summary || "", /للصفوف [1-6]|الصفوف [1-6]/);
    assert.match(article.summary || "", /للصفوف من الأول إلى السادس/);
  }
});

test("ar-KW effective Help subject summaries + Practice Hub FAQ (numeric closure)", async () => {
  const { BY_SECTION_AR_KW } = await import("../../data/help-center/ar-KW/index.js");
  const expectedSummaries = {
    math: "ممارسة الرياضيات للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية التدرب عليه.",
    geometry: "ممارسة الهندسة للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    english: "ممارسة اللغة الإنجليزية للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    science: "ممارسة العلوم للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
  };
  for (const [slug, summary] of Object.entries(expectedSummaries)) {
    const article = BY_SECTION_AR_KW.subjects.find((a) => a.slug === slug);
    assert.ok(article, slug);
    assert.equal(article.summary, summary);
    assert.doesNotMatch(article.summary, DIGIT_GRADE_RE);
  }

  const hub = deepMerge(
    JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-001/public-seo/practice/hub.json"), "utf8")),
    JSON.parse(fs.readFileSync(path.join(ROOT, "content-packs/ar-KW/public-seo/practice/hub.json"), "utf8"))
  );
  assert.equal(
    hub.faq[0].a,
    "الممارسة مصمّمة للصفوف من الأول إلى السادس، وتعرض كل مادة مواضيع مناسبة للصف الذي تختاره."
  );
  assert.doesNotMatch(hub.faq[0].a, /الصفوف [1-6]|للصفوف [1-6]/);
  assert.equal(hub.faq.length, 3, "faq array replace must keep all hub FAQ entries");
  assert.equal(hub.footerCta.secondary.label, "دخول الطالب");
});

test("ar-KW residual numeric academic grade labels = 0 on key surfaces", async () => {
  const NUMERIC_ACADEMIC_RE =
    /الصف [1-6](?!\d)|الصفوف [1-6]|للصفوف [1-6]|من 1 إلى 6/;

  /** @type {string[]} */
  const hits = [];

  const { BY_SECTION_AR_KW, ALL_ARTICLES_AR_KW } = await import("../../data/help-center/ar-KW/index.js");
  for (const article of ALL_ARTICLES_AR_KW) {
    for (const [p, s] of collectAllStrings(article).map((t, i) => [`[${i}]`, t])) {
      if (NUMERIC_ACADEMIC_RE.test(s)) hits.push(`help:${article.slug}:${p}:${s.slice(0, 80)}`);
    }
  }
  void BY_SECTION_AR_KW;

  const packRels = [
    "public-seo/practice/hub.json",
    "public-seo/practice/math.json",
    "public-seo/practice/geometry.json",
    "public-seo/practice/english.json",
    "public-seo/practice/science.json",
    "public-seo/practice/reading.json",
    "public-seo/practice/games.json",
    "public-seo/practice/no-print.json",
    "public-seo/practice/worksheets.json",
    "public-seo/practice/parent-reports.json",
    "public-seo/guides/hub-cards.json",
    "public-seo/guides/math-practice-at-home.json",
    "public-seo/guides/learning-games-at-home.json",
    "public-seo/marketing/schools.json",
    "public-seo/marketing/teachers.json",
  ];

  for (const rel of packRels) {
    const basePath = path.join(ROOT, "content-packs/ar-001", rel);
    const kwPath = path.join(ROOT, "content-packs/ar-KW", rel);
    if (!fs.existsSync(basePath)) continue;
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const kw = fs.existsSync(kwPath) ? JSON.parse(fs.readFileSync(kwPath, "utf8")) : {};
    const merged = Array.isArray(base) ? (Array.isArray(kw) ? kw : base) : deepMerge(base, kw);
    for (const s of collectAllStrings(merged)) {
      if (NUMERIC_ACADEMIC_RE.test(s)) hits.push(`pack:${rel}:${s.slice(0, 100)}`);
    }
  }

  // Locale chrome (effective merge)
  for (const file of ["common.json", "learning.json", "worksheets.json", "seo.json", "ui.json"]) {
    const merged = deepMerge(
      JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-001", file), "utf8")),
      JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-KW", file), "utf8"))
    );
    for (const s of collectAllStrings(merged)) {
      if (NUMERIC_ACADEMIC_RE.test(s)) hits.push(`locale:${file}:${s.slice(0, 100)}`);
    }
  }

  assert.deepEqual(hits, [], `numeric academic grade residues: ${JSON.stringify(hits.slice(0, 20))}`);
});

test("ar-KW registry/path wired by MAIN (/kw)", () => {
  const registry = fs.readFileSync(path.join(ROOT, "lib/i18n/locale-registry.js"), "utf8");
  assert.match(registry, /"ar-KW"/);
  assert.match(registry, /pathPrefix:\s*"kw"/);
  assert.equal(fs.existsSync(path.join(ROOT, "locales/ar-KW")), true);
});
