/**
 * ru-KG (Kyrgyzstan Russian-medium) sparse content-layer checks.
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
import { deepMergeJson } from "../../lib/i18n/deep-merge.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "ru-KG";
const BASE = "ru-RU";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
/** Kyrgyz must not be presented as Russian chrome in this layer. */
const KYRGYZ_LEAK_RE =
  /\b(кыргызский язык|кыргыз тили|кыргызча|Кыргыз тили|Kirghiz language)\b/i;
/** Must not claim Russian represents all of Kyrgyzstan. */
const SOLE_LANGUAGE_RE =
  /единственн\w* язык\w* (?:в )?Кыргызстан|только на русском|Russian is the (?:only|sole) language|вся страна говорит по-русски|единственный язык страны(?![\s.,;:—-]*[^.]*не )/i;
const RUSSIAN_CURRENCY_LEAK_RE = /рубл|\u20BD|копеек|копейк/;
const FOREIGN_CURRENCY_LEAK_RE =
  /\b(тенге|тиын|₸|KZT|белорусск\w* рубл|BYN|сум\b|so['ʼ]?m|UZS|Ўзбек)\b/i;
const KLASSNAYA_GRUPPA_RE = /классн\w* групп/i;
const GRADE_LABELS = ["1 класс", "2 класс", "3 класс", "4 класс", "5 класс", "6 класс"];
const GRADE_BANDS = {
  g12: "1–2 классы",
  g34: "3–4 классы",
  g56: "5–6 классы",
};
const STUDENT_GROUP_TERM = "учебная группа";

/**
 * @returns {string}
 */
function allOverlayText() {
  const chunks = [];
  for (const rel of listJsonRel(path.join(ROOT, "locales", LOCALE))) {
    chunks.push(fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"));
  }
  for (const rel of listJsonRel(path.join(ROOT, "content-packs", LOCALE))) {
    chunks.push(fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8"));
  }
  for (const file of fs.readdirSync(path.join(ROOT, "data/help-center", LOCALE))) {
    if (file.endsWith(".js")) {
      chunks.push(fs.readFileSync(path.join(ROOT, "data/help-center", LOCALE, file), "utf8"));
    }
  }
  return chunks.join("\n");
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
 * @param {string} blob
 */
function assertNoSoleLanguageClaim(blob) {
  assert.doesNotMatch(blob, /единственный язык/i);
  assert.doesNotMatch(blob, /только русский язык в Кыргызстан/i);
  assert.doesNotMatch(blob, /Russian (?:is|as) the (?:only|sole) language/i);
  assert.doesNotMatch(blob, /вся страна говорит по-русски/i);
  assert.doesNotMatch(blob, /все школы Кыргызстана говорят по-русски/i);
}

test("ru-KG locale namespaces parse and stay sparse vs ru-RU", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", BASE);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("teacher.json"));
  assert.ok(files.includes("ui.json"));
  assert.ok(files.includes("platform.json"));
  assert.ok(files.includes("validation.json"));
  assert.equal(files.includes("common.json"), false, "grades inherit from ru-RU — no identical common overlay");

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
    assert.ok(fs.existsSync(basePath), `missing ${BASE} authority ${file}`);
    const base = JSON.parse(fs.readFileSync(basePath, "utf8"));
    const leaves = collectStringLeaves(country);
    if (leaves.size === 0) emptyFiles.push(file);
    overrideCount += leaves.size;
    const blob = JSON.stringify(country);
    assert.equal(HEBREW_RE.test(blob), false, file);
    assert.equal(KYRGYZ_LEAK_RE.test(blob), false, `Kyrgyz-as-Russian leak in ${file}`);
    assertNoSoleLanguageClaim(blob);
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

test("ru-KG grade mapping inherits 1–6 класс and bands from ru-RU", () => {
  const baseCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "common.json"), "utf8"));
  const countryCommonPath = path.join(ROOT, "locales", LOCALE, "common.json");
  const countryCommon = fs.existsSync(countryCommonPath)
    ? JSON.parse(fs.readFileSync(countryCommonPath, "utf8"))
    : {};
  const merged = deepMergeJson(baseCommon, countryCommon);
  assert.deepEqual(
    [merged.grade1, merged.grade2, merged.grade3, merged.grade4, merged.grade5, merged.grade6],
    GRADE_LABELS
  );
  assert.equal(merged.gradeLabel, "{grade} класс");

  const rewardsBase = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", BASE, "rewards/ui.json"), "utf8")
  );
  const rewardsCountryPath = path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json");
  assert.equal(fs.existsSync(rewardsCountryPath), false, "identical gradeBands must not be copied");
  assert.deepEqual(rewardsBase.gradeBands, GRADE_BANDS);

  const learningBase = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", BASE, "learning.json"), "utf8")
  );
  assert.deepEqual(
    [
      learningBase.master?.grades?.g1,
      learningBase.master?.grades?.g2,
      learningBase.master?.grades?.g3,
      learningBase.master?.grades?.g4,
      learningBase.master?.grades?.g5,
      learningBase.master?.grades?.g6,
    ],
    GRADE_LABELS
  );
});

test("ru-KG класс (grade year) vs учебная группа (student group) — consistent wording", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal?.choosePhysicalClass, "Выберите учебную группу");
  assert.equal(school.portal?.classLabel, "Учебная группа");
  assert.equal(school.portal?.colClass, "Учебная группа");
  assert.equal(school.portal?.createStudentClass, "Учебная группа (название группы в школе)");
  assert.equal(school.communication?.detailsFieldClass, "Учебная группа");
  assert.equal(school.communication?.detailsFieldGrade, undefined, "grade label inherits Класс from ru-RU");
  assert.match(school.portal?.classesSubtitle || "", /класс \(год обучения\)/);
  assert.match(school.portal?.classesSubtitle || "", /учебную группу/);
  assert.doesNotMatch(school.portal?.classLabel || "", /^Класс$/);
  assert.doesNotMatch(JSON.stringify(school), KLASSNAYA_GRUPPA_RE);

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  assert.equal(teacher.dashboard?.createClassButton, "Создать учебную группу");
  assert.match(teacher.fallback?.classSuffix || "", /Учебная группа/);
  assert.doesNotMatch(JSON.stringify(teacher), KLASSNAYA_GRUPPA_RE);

  const validation = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8")
  );
  assert.match(validation.api?.physical_class_not_found || "", /учебная группа/);

  const baseSchool = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "school.json"), "utf8"));
  assert.equal(baseSchool.portal?.choosePhysicalClass, "Выберите классную группу");
  const mergedSchool = deepMergeJson(baseSchool, school);
  assert.equal(mergedSchool.portal?.choosePhysicalClass, "Выберите учебную группу");
  assert.equal(mergedSchool.portal?.chooseGrade, "Выберите класс");
  assert.equal(mergedSchool.portal?.createStudentGrade, "Класс");
  assert.equal(mergedSchool.portal?.colGrade, "Класс");
  assert.equal(mergedSchool.portal?.classLabel, "Учебная группа");
  assert.equal(mergedSchool.communication?.detailsFieldGrade, "Класс");
  assert.equal(mergedSchool.communication?.detailsFieldClass, "Учебная группа");

  const overlayBlob = allOverlayText();
  assert.doesNotMatch(overlayBlob, KLASSNAYA_GRUPPA_RE);
  assert.match(overlayBlob, new RegExp(STUDENT_GROUP_TERM, "i"));
});

test("ru-KG currency terminology сом / KGS / тыйын in chrome; no рубль as KG currency", () => {
  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeDescription, /сом/);
  assert.match(seo.homeDescription, /KGS/);
  assert.doesNotMatch(seo.homeDescription, RUSSIAN_CURRENCY_LEAK_RE);
  assert.doesNotMatch(seo.homeDescription, /\bRUB\b/);

  const blob = allOverlayText();
  assert.match(blob, /сом/);
  assert.match(blob, /KGS/);
  assert.match(blob, /тыйын/);
  assert.doesNotMatch(blob, RUSSIAN_CURRENCY_LEAK_RE);
  assert.doesNotMatch(blob, FOREIGN_CURRENCY_LEAK_RE);
});

test("ru-KG SEO/UI frame Russian-medium Kyrgyzstan without sole-language claim", () => {
  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /Кыргызстан/);
  assert.match(seo.homeTitle, /русским языком обучения/);
  assert.match(seo.learningDescription, /Кыргызстан/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.public?.about?.intro1 || "", /Кыргызстан/);
  assert.match(ui.public?.about?.intro1 || "", /русским языком обучения/);

  const blob = `${JSON.stringify(seo)}\n${JSON.stringify(ui)}`;
  assertNoSoleLanguageClaim(blob);
  assert.doesNotMatch(blob, KYRGYZ_LEAK_RE);
  assert.doesNotMatch(blob, /\/kg(?!-ru)/);
});

test("ru-KG content packs sparse contract vs ru-RU", () => {
  const countryRoot = path.join(ROOT, "content-packs", LOCALE);
  const baseRoot = path.join(ROOT, "content-packs", BASE);
  const baseExists = (rel) => fs.existsSync(path.join(baseRoot, rel));

  /** @type {string[]} */
  const identicalOverrides = [];
  /** @type {string[]} */
  const orphanKeys = [];
  /** @type {string[]} */
  const placeholderMismatches = [];
  /** @type {string[]} */
  const typeMismatches = [];
  /** @type {string[]} */
  const nearFullCopies = [];
  /** @type {string[]} */
  const emptyFiles = [];
  /** @type {string[]} */
  const hebrewHits = [];
  /** @type {string[]} */
  const kyrgyzHits = [];
  /** @type {string[]} */
  const soleLanguageHits = [];
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
        if (KYRGYZ_LEAK_RE.test(value)) kyrgyzHits.push(`${rel}:${key}`);
        if (SOLE_LANGUAGE_RE.test(value)) soleLanguageHits.push(`${rel}:${key}`);
      }
      for (const key of indexAudit.identicalOverrides) identicalOverrides.push(`${rel}:${key}`);
      for (const key of indexAudit.orphanKeys) orphanKeys.push(`${rel}:${key}`);
      for (const key of indexAudit.placeholderMismatches) {
        placeholderMismatches.push(`${rel}:${key}`);
      }
      for (const key of indexAudit.typeMismatches) typeMismatches.push(`${rel}:${key}`);
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
      if (typeof value === "string" && KYRGYZ_LEAK_RE.test(value)) kyrgyzHits.push(`${rel}:${key}`);
      if (typeof value === "string" && SOLE_LANGUAGE_RE.test(value)) {
        soleLanguageHits.push(`${rel}:${key}`);
      }
      if (!baseLeaves.has(key)) orphanKeys.push(`${rel}:${key}`);
      else if (baseLeaves.get(key) === value) identicalOverrides.push(`${rel}:${key}`);
      else {
        const pa = ((value.match(PLACEHOLDER_RE) || []).slice().sort()).join("|");
        const pb = (((baseLeaves.get(key) || "").match(PLACEHOLDER_RE) || []).slice().sort()).join(
          "|"
        );
        if (pa !== pb) placeholderMismatches.push(`${rel}:${key}`);
      }
    }
    const assessment = assessNearFullCopy(countryLeaves, baseLeaves);
    if (assessment.isNearFullCopy) nearFullCopies.push(rel);
  }

  assert.deepEqual(emptyFiles, [], "empty overrides");
  assert.deepEqual(extraFiles, [], "files without ru-RU authority");
  assert.deepEqual(orphanKeys, [], "orphan keys");
  assert.deepEqual(identicalOverrides, [], "identical overrides");
  assert.deepEqual(placeholderMismatches, [], "placeholder mismatches");
  assert.deepEqual(typeMismatches, [], "type mismatches");
  assert.deepEqual(nearFullCopies, [], "near-full / full-copy files");
  assert.deepEqual(hebrewHits, []);
  assert.deepEqual(kyrgyzHits, [], "Kyrgyz-as-Russian leakage");
  assert.deepEqual(soleLanguageHits, [], "sole-language claim");

  const classes = JSON.parse(
    fs.readFileSync(path.join(countryRoot, "global-burn-down/pages__school__classes__index.json"), "utf8")
  );
  assert.match(classes.copy?.no_classes_in_this_grade || "", /учебных групп/);
  assert.match(classes.copy?.no_classes_in_this_grade || "", /этом классе/);

  const students = JSON.parse(
    fs.readFileSync(path.join(countryRoot, "global-burn-down/pages__school__students__index.json"), "utf8")
  );
  assert.match(students.copy?.no_children_found_in_this_class || "", /учебной группе/);

  const teacherDash = JSON.parse(
    fs.readFileSync(
      path.join(countryRoot, "global-burn-down/components__teacher-portal__TeacherDashboardClient.json"),
      "utf8"
    )
  );
  assert.equal(teacherDash.copy?.manage_class, "Управление учебной группой");
});

test("ru-KG help overlays parse, preserve slugs, and deny sole-language claim", async () => {
  const help = await import(`../../data/help-center/ru-KG/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/ru-RU/parents.js");
  assert.equal(
    help.ALL_ARTICLES_RU_KG.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/subjects.js")).SUBJECT_ARTICLES.length
  );
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_RU_KG.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }

  const welcome = help.BY_SECTION_RU_KG.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /Кыргызстан/);
  assert.match(JSON.stringify(welcome), /русским языком обучения/);
  assert.match(JSON.stringify(welcome), /не описывает все школы страны/);

  const addStudents = help.BY_SECTION_RU_KG.parents.find((a) => a.slug === "add-students");
  assert.match(addStudents.summary, /класс \(год обучения\)/);

  const choose = help.BY_SECTION_RU_KG.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.match(JSON.stringify(choose), /году обучения/);

  const english = help.BY_SECTION_RU_KG.subjects.find((a) => a.slug === "english");
  assert.match(english.summary, /цели обучения остаются на английском/);
  assert.match(JSON.stringify(english), /остаются на английском/);

  const math = help.BY_SECTION_RU_KG.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(math), /сом/);
  assert.match(JSON.stringify(math), /KGS/);
  assert.match(JSON.stringify(math), /тыйын/);
  assert.doesNotMatch(JSON.stringify(math), RUSSIAN_CURRENCY_LEAK_RE);

  const helpBlob = JSON.stringify(help.ALL_ARTICLES_RU_KG);
  assert.doesNotMatch(helpBlob, KYRGYZ_LEAK_RE);
  assert.doesNotMatch(helpBlob, KLASSNAYA_GRUPPA_RE);
  assertNoSoleLanguageClaim(helpBlob);
});

test("ru-KG Math money display layer uses сом/тыйын; no рубль/копейка leakage", async () => {
  const {
    applyRuKgDisplayLayer,
    rebuildMathStemRuKg,
    rebuildMoneyStemRuKg,
    somWord,
    tyiynWord,
    CURRENCY_RU_KG,
  } = await import("../../utils/learning-content-ru-KG/index.js");
  const { rebuildMathStemRuRu, rubleWord, kopeckWord } = await import(
    "../../utils/learning-content-ru-RU/math.js"
  );

  assert.equal(CURRENCY_RU_KG.name, "сом");
  assert.equal(CURRENCY_RU_KG.code, "KGS");
  assert.equal(CURRENCY_RU_KG.minorName, "тыйын");

  assert.equal(somWord(1), "сом");
  assert.equal(somWord(2), "сома");
  assert.equal(somWord(3), "сома");
  assert.equal(somWord(4), "сома");
  assert.equal(somWord(5), "сомов");
  assert.equal(somWord(11), "сомов");
  assert.equal(somWord(21), "сом");
  assert.equal(somWord(22), "сома");
  assert.equal(somWord(25), "сомов");

  assert.equal(tyiynWord(1), "тыйын");
  assert.equal(tyiynWord(2), "тыйына");
  assert.equal(tyiynWord(5), "тыйынов");
  assert.equal(tyiynWord(11), "тыйынов");
  assert.equal(tyiynWord(21), "тыйын");
  assert.equal(tyiynWord(22), "тыйына");

  const pocket = {
    id: "q_wp_pocket_money_demo",
    subject: "math",
    params: { kind: "wp_pocket_money", money: 10, toy: 3 },
    correctAnswer: 7,
    answers: [7],
  };
  const pocketStem = rebuildMathStemRuKg(pocket);
  assert.equal(
    pocketStem,
    "У Эммы 10 сомов. Она покупает перекус за 3 сома. Сколько денег осталось?"
  );
  assert.doesNotMatch(pocketStem, RUSSIAN_CURRENCY_LEAK_RE);
  assert.match(rebuildMathStemRuRu(pocket), /рубл/);

  const coinsStem = rebuildMathStemRuKg({
    params: { kind: "wp_coins", coins1: 4, coins2: 3 },
  });
  assert.equal(
    coinsStem,
    "У Лео 4 монет по 1 сому и 3 монет по 2 сома. Сколько денег у него всего?"
  );
  assert.doesNotMatch(coinsStem, RUSSIAN_CURRENCY_LEAK_RE);

  const kopecksStem = rebuildMathStemRuKg({
    params: { kind: "wp_kopecks", rubles: 2, kopecks: 5 },
  });
  assert.equal(kopecksStem, "У Лео 2 сома и 5 тыйынов. Сколько это всего в тыйынах?");
  assert.doesNotMatch(kopecksStem, RUSSIAN_CURRENCY_LEAK_RE);
  assert.match(
    rebuildMathStemRuRu({ params: { kind: "wp_kopecks", rubles: 2, kopecks: 5 } }),
    /копейк/
  );

  const discountStem = rebuildMathStemRuKg({
    params: { kind: "wp_shop_discount", price: 200, discPerc: 25 },
  });
  assert.equal(
    discountStem,
    "Футболка стоит 200 сомов со скидкой 25%. Сколько нужно заплатить после скидки?"
  );
  assert.doesNotMatch(discountStem, RUSSIAN_CURRENCY_LEAK_RE);

  const spentStem = rebuildMathStemRuKg({
    params: { kind: "wp_coins_spent", total: 15, spent: 6 },
  });
  assert.match(spentStem, /15 сомов/);
  assert.match(spentStem, /6 сомов/);
  assert.doesNotMatch(spentStem, RUSSIAN_CURRENCY_LEAK_RE);

  const multiStem = rebuildMathStemRuKg({
    params: { kind: "wp_multi_step", money: 50, a: 2, b: 3, price: 5 },
  });
  assert.match(multiStem, /50 сомов/);
  assert.match(multiStem, /5 сомов/);
  assert.doesNotMatch(multiStem, RUSSIAN_CURRENCY_LEAK_RE);

  assert.equal(
    rebuildMoneyStemRuKg({ params: { kind: "wp_simple_add", a: 2, b: 3 } }),
    null
  );
  assert.equal(
    rebuildMathStemRuKg({ params: { kind: "wp_simple_add", a: 2, b: 3 } }),
    rebuildMathStemRuRu({ params: { kind: "wp_simple_add", a: 2, b: 3 } })
  );

  const localized = applyRuKgDisplayLayer(
    {
      ...pocket,
      question: "У Эммы 10 рублей. Она покупает перекус за 3 рубля. Сколько денег осталось?",
      exerciseText: "У Эммы 10 рублей...",
      options: ["7", "13"],
      correctIndex: 0,
    },
    "math"
  );
  assert.equal(localized.id, "q_wp_pocket_money_demo");
  assert.equal(localized.correctAnswer, 7);
  assert.deepEqual(localized.answers, [7]);
  assert.deepEqual(localized.params, pocket.params);
  assert.equal(localized.correctIndex, 0);
  assert.deepEqual(localized.options, ["7", "13"]);
  assert.match(String(localized.question), /10 сомов/);
  assert.match(String(localized.exerciseText), /3 сома/);
  assert.doesNotMatch(String(localized.question), RUSSIAN_CURRENCY_LEAK_RE);
  assert.doesNotMatch(String(localized.exerciseText), RUSSIAN_CURRENCY_LEAK_RE);
  assert.doesNotMatch(String(localized.question), FOREIGN_CURRENCY_LEAK_RE);

  assert.equal(rubleWord(1), "рубль");
  assert.equal(kopeckWord(1), "копейка");
});

test("ru-KG ships sparse money display layer; other heavy overlays inherit", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-KG/index.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-KG/math.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-KG/geometry.js")));

  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-ru-KG-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/ru-KG")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "books")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "learning")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "games")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "rewards")), false);

  const ruMeaning = fs.readFileSync(
    path.join(ROOT, "data/english-questions/word-meanings/ru-RU.js"),
    "utf8"
  );
  assert.match(ruMeaning, /WORD_MEANINGS_RU_RU/);
});

test("ru-KG other locales / ru-RU / shared runtime unmodified by this layer path set", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "locales", BASE, "common.json")));
  assert.ok(fs.existsSync(path.join(ROOT, "locales", "en", "common.json")));
  assert.equal(fs.existsSync(path.join(ROOT, "locales", "ky-KG")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "locales", "kg")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", "ky-KG")), false);
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-KG")));
  assert.equal(fs.existsSync(path.join(ROOT, "locales", LOCALE, "registry.json")), false);

  const ruRuSchool = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", BASE, "school.json"), "utf8")
  );
  assert.equal(ruRuSchool.portal?.choosePhysicalClass, "Выберите классную группу");
});
