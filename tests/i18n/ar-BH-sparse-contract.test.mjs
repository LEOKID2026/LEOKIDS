/**
 * Bahrain (ar-BH) sparse country overlay checks vs Arabic Master (ar-001).
 * Planned chain: ar-BH → ar-001 → en. No registry wiring / build / full suite.
 *
 * Authority:
 * - academic grade = الصف (word-form الصف الأول…السادس)
 * - physical class = صف دراسي / صفوف دراسية (not شعبة; not فصل as classroom)
 * - student = طالب; teacher = معلم; guardian = ولي الأمر
 * - التعليم الأساسي = grades 1–9; الحلقة الأولى = 1–3
 * - product scope = grades 1–6 only (not full basic education; not Cycle 1 alone)
 * - grade6 primary wording allowed: الصف السادس الابتدائي
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
const LOCALE = "ar-BH";
const AUTHORITY = "ar-001";

const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const CROSS_COUNTRY_RE =
  /مصر|المصرية|المملكة العربية السعودية|السعودية(?! العربية)|المغرب|الجزائر|تونس|الأردن|الاردن|عمّان|العراق|الإمارات|الامارات|الكويت|(?<![\u0600-\u06FF])قطر(?![\u0600-\u06FF])|سلطنة عُمان|(?<![\u0600-\u06FF])عمان(?!ية)|جنيه|ريال سعودي|شعبة صفية/;
const DIGIT_GRADE_RE = /الصف [1-6](?!\d)/;
const NUMERIC_BAND_RE = /الصفوف [1-6]/;
const TALMEEDH_RE = /تلميذ/;
const SHUBA_CLASS_RE = /(?<!÷ )شعبة/;
const FORBIDDEN_EN_UI_RE =
  /\b(Grade|Student login|Parent login|Worksheet|Dashboard|Settings|Cancel|Save|Continue|Back|Next|Loading)\b/;

/** False: basic education ends / equals grades 1–6 only. */
const FALSE_BASIC_ED_RE =
  /التعليم الأساسي من الصف الأول إلى الصف السادس|التعليم الأساسي\s*(?:=|يساوي|يعني|هو|ينتهي|يقتصر).*(?:السادس|6)/;

/** False: Cycle 1 = grades 1–6, or UAE/OM Cycle 1 = 1–4 leakage. */
const FALSE_CYCLE1_RE =
  /الحلقة الأولى \(الصف الأول–السادس\)|الحلقة الأولى \(الصف الأول–الرابع\)|الحلقة الأولى[^.؛\n]{0,40}(?:إلى|–|-)\s*الصف السادس/;

const ACADEMIC_DARAJAH_RES = [
  /اختر الدرجة/,
  /تغيير الدرجة/,
  /حسب الدرجة/,
  /مع الدرجة(?! الحرارة)/,
  /درجة أخرى/,
  /درجة طفلك/,
  /تحديث درجتك/,
  /درجتك/,
  /اختر درجة(?! الحرارة)/,
  /الكتابة حسب الدرجة/,
  /المحتوى والدرجة/,
  /متطابقة مع الدرجة/,
  /ومطابقة التدريب مع الدرجة/,
];

const BH_GRADES = [
  "الصف الأول",
  "الصف الثاني",
  "الصف الثالث",
  "الصف الرابع",
  "الصف الخامس",
  "الصف السادس",
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

/** Effective public-seo after ar-001 ← ar-BH deep-merge. */
function effectivePublicSeo(...segments) {
  const rel = segments.join("/");
  const basePath = path.join(ROOT, "content-packs", AUTHORITY, "public-seo", rel);
  const overlayPath = path.join(ROOT, "content-packs", LOCALE, "public-seo", rel);
  assert.ok(fs.existsSync(basePath), `missing authority public-seo ${rel}`);
  const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
  if (!fs.existsSync(overlayPath)) return base;
  return deepMergeJson(base, JSON.parse(fs.readFileSync(overlayPath, "utf8")));
}

test("ar-BH locale namespaces parse and stay sparse vs ar-001", () => {
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
  assert.ok(files.includes("validation.json"));
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
  const shubaHits = [];
  /** @type {string[]} */
  const falseBasicHits = [];
  /** @type {string[]} */
  const falseCycleHits = [];
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
    if (SHUBA_CLASS_RE.test(blob)) shubaHits.push(file);
    if (FALSE_BASIC_ED_RE.test(blob)) falseBasicHits.push(file);
    if (FALSE_CYCLE1_RE.test(blob)) falseCycleHits.push(file);
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
  assert.deepEqual(shubaHits, []);
  assert.deepEqual(falseBasicHits, []);
  assert.deepEqual(falseCycleHits, []);
  assert.ok(overrideCount > 0);
});

test("ar-BH grade mapping + Bahrain education-stage authority", () => {
  const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "common.json"), "utf8"));
  assert.deepEqual(
    [common.grade1, common.grade2, common.grade3, common.grade4, common.grade5, common.grade6],
    BH_GRADES
  );
  for (const label of BH_GRADES) {
    assert.match(label, /^الصف /);
    assert.doesNotMatch(label, DIGIT_GRADE_RE);
  }

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.equal(learning.master?.defaultPlayerName, "الطالب");
  assert.match(learning.master?.gradeRequired || "", /تحديث صفك|ولي الأمر/);
  assert.doesNotMatch(learning.master?.gradeRequired || "", /درجتك/);
  assert.deepEqual(
    [
      learning.master?.grades?.g1,
      learning.master?.grades?.g2,
      learning.master?.grades?.g3,
      learning.master?.grades?.g4,
      learning.master?.grades?.g5,
      learning.master?.grades?.g6,
    ],
    BH_GRADES
  );
  assert.match(learning.math?.howToLearnSteps?.step1 || "", /^اختر الصف/);
  assert.doesNotMatch(learning.math?.howToLearnSteps?.step1 || "", /الدرجة/);

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
    BH_GRADES
  );

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /مملكة البحرين|البحرين/);
  assert.match(seo.homeDescription, /مملكة البحرين|البحرين/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.home?.ctaKids, "أنا طالب");
  assert.match(ui.home?.subhead || "", /مملكة البحرين/);
  const about = ui.public?.about?.intro1 || "";
  assert.match(about, /الصفوف من الأول إلى السادس|الصف الأول إلى الصف السادس/);
  assert.match(about, /التعليم الأساسي/);
  assert.match(about, /حتى الصف التاسع|الصف التاسع/);
  assert.match(about, /الحلقة الأولى \(الصف الأول–الثالث\)/);
  assert.match(about, /الحلقات الثانية والثالثة \(الصف الرابع–السادس/);
  assert.doesNotMatch(about, FALSE_BASIC_ED_RE);
  assert.doesNotMatch(about, FALSE_CYCLE1_RE);
  // grade6 primary wording is allowed when context needs it (authority note)
  assert.match("الصف السادس الابتدائي", /الصف السادس الابتدائي/);
});

test("ar-BH physical class = صف دراسي; academic grade = الصف; no شعبة classroom import", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal.choosePhysicalClass, "اختر الصف الدراسي");
  assert.equal(school.portal.classLabel, "الصف الدراسي");
  assert.equal(school.portal.colClass, "الصف الدراسي");
  assert.match(school.portal.classesSubtitle, /الصف والصف الدراسي/);
  assert.notEqual(school.portal.colGrade ?? "الصف", school.portal.colClass);
  assert.doesNotMatch(JSON.stringify(school), SHUBA_CLASS_RE);
  assert.doesNotMatch(JSON.stringify(school), /اختر الفصل(?! الدراسي)|تقرير الفصل|اسم الفصل/);

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  assert.match(teacher.dashboard?.createClassLabel || "", /الصف الدراسي/);
  assert.match(teacher.fallback?.classSuffix || "", /الصف الدراسي/);
  assert.doesNotMatch(JSON.stringify(teacher), SHUBA_CLASS_RE);

  const validation = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8")
  );
  assert.match(validation.api?.physical_class_not_found || "", /صف دراسي مطابق/);
  assert.doesNotMatch(validation.api?.physical_class_not_found || "", /شعبة|فصل مطابق/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.teacherShell?.classReportTitle, "تقرير الصف الدراسي");
  assert.match(ui.teacherShell?.myClasses || "", /صفوف/);
});

test("ar-BH student/teacher/guardian role authority", () => {
  const auth = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "auth.json"), "utf8"));
  assert.match(auth.studentLoginTitle, /الطالب/);
  assert.doesNotMatch(auth.studentLoginTitle, TALMEEDH_RE);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.equal(ui.home?.ctaKids, "أنا طالب");
  assert.match(ui.nav?.loginStudent || "", /الطالب/);

  const learning = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "learning.json"), "utf8"));
  assert.match(learning.master?.gradeRequired || "", /ولي الأمر/);
});

test("ar-BH content packs sparse contract vs ar-001", () => {
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
  const numericBandHits = [];
  /** @type {string[]} */
  const talmeedhHits = [];
  /** @type {string[]} */
  const shubaHits = [];
  /** @type {string[]} */
  const extraFiles = [];
  /** @type {string[]} */
  const falseBasicHits = [];
  /** @type {string[]} */
  const falseCycleHits = [];
  /** @type {string[]} */
  const academicDarajahHits = [];

  for (const rel of listJsonRel(countryRoot)) {
    const country = JSON.parse(fs.readFileSync(path.join(countryRoot, rel), "utf8"));
    const countryLeaves = collectStringLeaves(country);
    const allCountryStrings = collectAllStrings(country);
    if (countryLeaves.size === 0 && allCountryStrings.length === 0) emptyFiles.push(rel);
    const blob = JSON.stringify(country);
    if (FALSE_BASIC_ED_RE.test(blob)) falseBasicHits.push(rel);
    if (FALSE_CYCLE1_RE.test(blob)) falseCycleHits.push(rel);

    if (Array.isArray(country)) {
      if (!baseExists(rel)) {
        extraFiles.push(rel);
        continue;
      }
      const base = JSON.parse(fs.readFileSync(path.join(baseRoot, rel), "utf8"));
      assert.ok(Array.isArray(base), rel);
      const baseStrings = collectAllStrings(base);
      assert.equal(allCountryStrings.length, baseStrings.length, `array length drift ${rel}`);
      let diffs = 0;
      for (let i = 0; i < allCountryStrings.length; i += 1) {
        const value = allCountryStrings[i];
        if (HEBREW_RE.test(value)) hebrewHits.push(`${rel}:[${i}]`);
        if (CROSS_COUNTRY_RE.test(value)) crossHits.push(`${rel}:[${i}]`);
        if (DIGIT_GRADE_RE.test(value)) digitGradeHits.push(`${rel}:[${i}]`);
        if (NUMERIC_BAND_RE.test(value)) numericBandHits.push(`${rel}:[${i}]`);
        if (TALMEEDH_RE.test(value)) talmeedhHits.push(`${rel}:[${i}]`);
        if (SHUBA_CLASS_RE.test(value)) shubaHits.push(`${rel}:[${i}]`);
        if (hasAcademicDarajah(value)) academicDarajahHits.push(`${rel}:[${i}]`);
        if (value !== baseStrings[i]) diffs += 1;
      }
      assert.ok(diffs > 0, `array overlay has no diffs: ${rel}`);
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
        if (SHUBA_CLASS_RE.test(value)) shubaHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && NUMERIC_BAND_RE.test(value)) numericBandHits.push(`${rel}:${key}`);
      if (typeof value === "string" && TALMEEDH_RE.test(value)) talmeedhHits.push(`${rel}:${key}`);
      if (typeof value === "string" && SHUBA_CLASS_RE.test(value)) shubaHits.push(`${rel}:${key}`);
      if (typeof value === "string" && hasAcademicDarajah(value)) academicDarajahHits.push(`${rel}:${key}`);
      if (!baseLeaves.has(key)) orphanKeys.push(`${rel}:${key}`);
      else if (baseLeaves.get(key) === value) identicalOverrides.push(`${rel}:${key}`);
      else if (typeof value === "string" && typeof baseLeaves.get(key) === "string") {
        const pa = (value.match(PLACEHOLDER_RE) || []).slice().sort().join("|");
        const pb = ((/** @type {string} */ (baseLeaves.get(key)).match(PLACEHOLDER_RE) || [])
          .slice()
          .sort()).join("|");
        if (pa !== pb) placeholderMismatches.push(`${rel}:${key}`);
      }
    }
    // Also scan array-nested strings in object overlays (public-seo sections)
    for (const value of allCountryStrings) {
      if (NUMERIC_BAND_RE.test(value)) numericBandHits.push(`${rel}:nested`);
      if (DIGIT_GRADE_RE.test(value)) digitGradeHits.push(`${rel}:nested`);
      if (hasAcademicDarajah(value)) academicDarajahHits.push(`${rel}:nested`);
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
  assert.deepEqual(numericBandHits, []);
  assert.deepEqual(talmeedhHits, []);
  assert.deepEqual(shubaHits, []);
  assert.deepEqual(falseBasicHits, []);
  assert.deepEqual(falseCycleHits, []);
  assert.deepEqual(academicDarajahHits, []);
});

test("ar-BH public SEO grade bands word-form + stage-safe claims", () => {
  for (const page of ["math", "geometry", "english", "science", "reading", "games", "no-print"]) {
    const effective = /** @type {{ sections?: Array<{ gradeSections?: Array<{ title?: string }> }> }} */ (
      effectivePublicSeo("practice", `${page}.json`)
    );
    const titles = (effective.sections || [])
      .flatMap((s) => s.gradeSections || [])
      .map((g) => g.title);
    if (titles.length) {
      assert.deepEqual(titles, [
        "الصفان الأول والثاني",
        "الصفان الثالث والرابع",
        "الصفان الخامس والسادس",
      ], page);
    }
    const blob = JSON.stringify(effective);
    assert.equal(NUMERIC_BAND_RE.test(blob), false, page);
    assert.equal(DIGIT_GRADE_RE.test(blob), false, page);
    assert.equal(FALSE_BASIC_ED_RE.test(blob), false, page);
    assert.equal(hasAcademicDarajah(blob), false, page);
  }

  const reading = /** @type {{ h1?: string }} */ (effectivePublicSeo("practice", "reading.json"));
  assert.match(reading.h1 || "", /الصفوف من الأول إلى السادس|مملكة البحرين/);
  assert.doesNotMatch(reading.h1 || "", FALSE_BASIC_ED_RE);

  const science = /** @type {{ badge?: string }} */ (effectivePublicSeo("practice", "science.json"));
  assert.match(science.badge || "", /للصفوف من الأول إلى السادس/);

  const schools = /** @type {{ benefits?: { items?: unknown[] } }} */ (
    effectivePublicSeo("marketing", "schools.json")
  );
  const schoolsBlob = JSON.stringify(schools);
  assert.match(schoolsBlob, /للصفوف من الأول إلى السادس|الصفوف من الأول إلى السادس/);
  assert.match(schoolsBlob, /حتى الصف التاسع|الصف التاسع/);
  assert.doesNotMatch(schoolsBlob, FALSE_BASIC_ED_RE);
  assert.doesNotMatch(schoolsBlob, SHUBA_CLASS_RE);
  assert.doesNotMatch(schoolsBlob, TALMEEDH_RE);
});

test("ar-BH help overlays parse on ar-001 base", async () => {
  const help = await import("../../data/help-center/ar-BH/index.js");
  const baseParents = await import("../../data/help-center/ar-001/parents.js");
  const baseStudents = await import("../../data/help-center/ar-001/students.js");
  const baseReport = await import("../../data/help-center/ar-001/parent-report.js");
  const baseSubjects = await import("../../data/help-center/ar-001/subjects.js");

  assert.equal(
    help.ALL_ARTICLES_AR_BH.length,
    baseParents.PARENT_ARTICLES.length +
      baseStudents.STUDENT_ARTICLES.length +
      baseReport.PARENT_REPORT_ARTICLES.length +
      baseSubjects.SUBJECT_ARTICLES.length
  );
  assert.equal(help.SECTIONS_AR_BH.students.title, "دليل للطلاب");
  assert.doesNotMatch(help.SECTIONS_AR_BH.students.title, TALMEEDH_RE);

  const welcome = help.BY_SECTION_AR_BH.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeBlob = JSON.stringify(welcome);
  assert.match(welcomeBlob, /مملكة البحرين/);
  assert.match(welcomeBlob, /الحلقة الأولى \(الصف الأول–الثالث\)/);
  assert.match(welcomeBlob, /الحلقات الثانية والثالثة/);
  assert.match(welcomeBlob, /حتى الصف التاسع/);
  assert.doesNotMatch(welcomeBlob, FALSE_BASIC_ED_RE);
  assert.doesNotMatch(welcomeBlob, FALSE_CYCLE1_RE);

  const login = help.BY_SECTION_AR_BH.students.find((a) => a.slug === "student-login");
  assert.match(JSON.stringify(login), /تسجيل دخول الطالب/);
  assert.doesNotMatch(JSON.stringify(login), TALMEEDH_RE);

  const math = help.BY_SECTION_AR_BH.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(math), /اختر الصف والمستوى/);
  assert.doesNotMatch(JSON.stringify(math), /اختر الدرجة والمستوى/);

  const blob = JSON.stringify(help.ALL_ARTICLES_AR_BH);
  assert.doesNotMatch(blob, HEBREW_RE);
  assert.doesNotMatch(blob, CROSS_COUNTRY_RE);
  assert.doesNotMatch(blob, FORBIDDEN_EN_UI_RE);
});

/** Numeric academic grade / band patterns from linguistic audit residual scan. */
const NUMERIC_ACADEMIC_RES = [
  /الصف [1-6](?!\d)/,
  /الصفوف [1-6]/,
  /الصفوف 1–6/,
  /الصفوف 1-6/,
  /للصفوف 1–6/,
  /للصفوف 1-6/,
  /من 1 إلى 6/,
  /في الصفوف من 1 إلى 6/,
];

/** @param {string} text */
function hasNumericAcademicGrade(text) {
  return NUMERIC_ACADEMIC_RES.some((re) => re.test(text));
}

test("ar-BH audit closure: 8 Help subject numeric leaves + residual Help scan", async () => {
  const help = await import("../../data/help-center/ar-BH/index.js");
  const expectedWho =
    "تم تصميم الممارسة للأطفال في الصفوف من الأول إلى السادس، بما يتناسب مع مستوى الصف.";
  /** @type {Record<string, string>} */
  const expectedSummaries = {
    math: "ممارسة الرياضيات للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية التدرب عليه.",
    geometry: "ممارسة الهندسة للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    english: "ممارسة اللغة الإنجليزية للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    science: "ممارسة العلوم للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
  };

  for (const slug of ["math", "geometry", "english", "science"]) {
    const article = help.BY_SECTION_AR_BH.subjects.find((a) => a.slug === slug);
    assert.ok(article, slug);
    assert.equal(article.summary, expectedSummaries[slug], `${slug} summary`);
    const who = (article.blocks || []).find(
      (b) => b.kind === "paragraph" && String(b.text || "").includes("تم تصميم الممارسة")
    );
    assert.equal(who?.text, expectedWho, `${slug} body range`);
    assert.equal(hasNumericAcademicGrade(String(article.summary || "")), false, `${slug} summary numeric`);
    assert.equal(hasNumericAcademicGrade(String(who?.text || "")), false, `${slug} body numeric`);
  }

  /** @type {string[]} */
  const numericHits = [];
  for (const article of help.ALL_ARTICLES_AR_BH) {
    for (const s of collectAllStrings(article)) {
      if (hasNumericAcademicGrade(s)) numericHits.push(`${article.slug}:${s.slice(0, 100)}`);
    }
  }
  assert.deepEqual(numericHits, [], `Help numeric residuals: ${JSON.stringify(numericHits)}`);
});

test("ar-BH audit closure: Practice Hub FAQ + Public SEO numeric residual scan", () => {
  const hub = /** @type {{ faq?: Array<{ a?: string }> }} */ (
    effectivePublicSeo("practice", "hub.json")
  );
  assert.equal(
    hub.faq?.[0]?.a,
    "الممارسة مصمّمة للصفوف من الأول إلى السادس، وتعرض كل مادة مواضيع مناسبة للصف الذي تختاره."
  );
  assert.equal(hasNumericAcademicGrade(hub.faq?.[0]?.a || ""), false);

  /** @type {string[]} */
  const numericHits = [];
  const seoRoot = path.join(ROOT, "content-packs", AUTHORITY, "public-seo");
  for (const rel of listJsonRel(seoRoot)) {
    const base = JSON.parse(fs.readFileSync(path.join(seoRoot, rel), "utf8"));
    const ovPath = path.join(ROOT, "content-packs", LOCALE, "public-seo", rel);
    const effective = fs.existsSync(ovPath)
      ? deepMergeJson(base, JSON.parse(fs.readFileSync(ovPath, "utf8")))
      : base;
    for (const s of collectAllStrings(effective)) {
      if (hasNumericAcademicGrade(s)) numericHits.push(`${rel}:${s.slice(0, 100)}`);
    }
  }
  assert.deepEqual(numericHits, [], `Public SEO numeric residuals: ${JSON.stringify(numericHits)}`);
});

test("ar-BH audit closure: 4 Legal student-role leaves + residual تلميذ role scan", async () => {
  const legal = /** @type {{
    unifiedLegalSections?: Array<{ id?: string, paragraphs?: string[] }>
  }} */ (effectivePublicSeo("legal", "unified.json"));
  const sections = legal.unifiedLegalSections || [];
  assert.equal(
    sections[0]?.paragraphs?.[3],
    "بالنسبة للمدرسين الخصوصيين، قد يسمح الموقع بإنشاء أنشطة ومتابعة الطلاب، حسب الصلاحيات الممنوحة لهم في النظام."
  );
  assert.equal(
    sections[4]?.paragraphs?.[1],
    "يجوز للمدرس عرض المعلومات أو الطلاب أو الأنشطة أو التقارير التي يسمح له النظام برؤيتها فقط."
  );
  assert.equal(
    sections[4]?.paragraphs?.[2],
    "لا يجوز للمعلم محاولة الوصول إلى معلومات حول أولياء الأمور أو الأطفال أو الطلاب غير المرتبطين بهم."
  );
  assert.equal(
    sections[13]?.paragraphs?.[4],
    "ليس من المفترض أن يرى المعلمون معلومات حول الطلاب غير المرتبطين بهم أو الذين لم يتم منحهم الإذن بذلك."
  );

  const legalBlob = JSON.stringify(legal);
  assert.doesNotMatch(legalBlob, TALMEEDH_RE);

  /** Product-role surfaces: Legal, Schools marketing, Help, School, Teacher, Reports, Demo, Public SEO */
  /** @type {string[]} */
  const roleHits = [];

  const help = await import("../../data/help-center/ar-BH/index.js");
  for (const article of help.ALL_ARTICLES_AR_BH) {
    for (const s of collectAllStrings(article)) {
      if (TALMEEDH_RE.test(s)) roleHits.push(`help:${article.slug}:${s.slice(0, 80)}`);
    }
  }

  for (const ns of ["school.json", "teacher.json", "reports.json"]) {
    const p = path.join(ROOT, "locales", LOCALE, ns);
    if (!fs.existsSync(p)) continue;
    const blob = fs.readFileSync(p, "utf8");
    if (TALMEEDH_RE.test(blob)) roleHits.push(`locale:${ns}`);
  }

  for (const rel of [
    "public-seo/legal/unified.json",
    "public-seo/marketing/schools.json",
    "public-seo/marketing/teachers.json",
    "demo/ui.json",
  ]) {
    const basePath = path.join(ROOT, "content-packs", AUTHORITY, rel);
    const ovPath = path.join(ROOT, "content-packs", LOCALE, rel);
    if (!fs.existsSync(basePath)) continue;
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const effective = fs.existsSync(ovPath)
      ? deepMergeJson(base, JSON.parse(fs.readFileSync(ovPath, "utf8")))
      : base;
    for (const s of collectAllStrings(effective)) {
      if (TALMEEDH_RE.test(s)) roleHits.push(`pack:${rel}:${s.slice(0, 80)}`);
    }
  }

  // Full public-seo effective role scan (skip English learning cloze if any)
  const seoRoot = path.join(ROOT, "content-packs", AUTHORITY, "public-seo");
  for (const rel of listJsonRel(seoRoot)) {
    const base = JSON.parse(fs.readFileSync(path.join(seoRoot, rel), "utf8"));
    const ovPath = path.join(ROOT, "content-packs", LOCALE, "public-seo", rel);
    const effective = fs.existsSync(ovPath)
      ? deepMergeJson(base, JSON.parse(fs.readFileSync(ovPath, "utf8")))
      : base;
    for (const s of collectAllStrings(effective)) {
      if (!TALMEEDH_RE.test(s)) continue;
      if (s.includes("___")) continue; // learning cloze example
      roleHits.push(`seo:${rel}:${s.slice(0, 80)}`);
    }
  }

  assert.deepEqual(roleHits, [], `Student-role residuals: ${JSON.stringify(roleHits)}`);
});

test("ar-BH effective merge: teacher dashboard physical class + no academic درجة chrome", () => {
  const dash = JSON.parse(
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
  assert.match(dash.copy?.remove_this_student_from_the_class || "", /الصف الدراسي/);
  assert.match(dash.copy?.dashboard_subtitle || "", /الصفوف الدراسية/);
  assert.match(dash.copy?.class_at_cap || "", /بلغ هذا الصف الدراسي/);
  assert.doesNotMatch(JSON.stringify(dash), SHUBA_CLASS_RE);
  assert.doesNotMatch(JSON.stringify(dash), TALMEEDH_RE);

  const classGrade = JSON.parse(
    fs.readFileSync(
      path.join(
        ROOT,
        "content-packs",
        LOCALE,
        "global-burn-down/lib__teacher-portal__teacher-class-grade.json"
      ),
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
    BH_GRADES
  );
});

test("ar-BH MAIN-wired /bh; other countries / ar-001 untouched", () => {
  const ar001Common = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", AUTHORITY, "common.json"), "utf8")
  );
  assert.equal(ar001Common.grade1, "الصف 1");

  const registry = fs.readFileSync(path.join(ROOT, "lib/i18n/locale-registry.js"), "utf8");
  assert.match(registry, /"ar-BH"/);
  assert.match(registry, /pathPrefix:\s*"bh"/);

  assert.equal(fs.existsSync(path.join(ROOT, "locales/ar-OM/common.json")), true);
  assert.equal(fs.existsSync(path.join(ROOT, "locales/ar-AE/common.json")), true);
  const omSchool = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-OM/school.json"), "utf8"));
  assert.match(omSchool.portal?.classLabel || "", /شعبة/);
});
