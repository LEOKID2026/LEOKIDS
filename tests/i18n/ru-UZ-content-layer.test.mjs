/**
 * ru-UZ (Uzbekistan Russian-medium) sparse content-layer checks.
 * Base authority: ru-RU. No registry wiring, build, or full suite.
 *
 * Scope: Russian-medium schools/tracks in Uzbekistan — not a national Uzbek layer,
 * and not a claim that Russian represents all of Uzbekistan.
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
const LOCALE = "ru-UZ";
const BASE = "ru-RU";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const UZ_GRADES = ["1 класс", "2 класс", "3 класс", "4 класс", "5 класс", "6 класс"];
const UZ_BANDS = ["1–2 классы", "3–4 классы", "5–6 классы"];
/** Must not claim Russian is the sole / national language of Uzbekistan. */
const RUSSIAN_REPRESENTS_ALL_UZ_RE =
  /единственн\w*\s+язык\w*\s+(в\s+)?Узбекистан|весь\s+Узбекистан\s+говор|государственн\w*\s+язык\w*\s*[—\-–]\s*русск|Russian\s+is\s+the\s+only\s+language\s+of\s+Uzbekistan|для\s+всех\s+школ\w*\s+Узбекистан/i;
/** Uzbek national language must not be smuggled in as Russian chrome. */
const UZBEK_AS_RUSSIAN_RE =
  /\b(oʻzbek|o'zbek|ўзбек|sinflar|boshlangʻich|boshlang'ich)\b/i;
const RUBLE_RE = /рубл|₽|\bRUB\b/i;
const KOPECK_RE = /копейк|копеек/i;
/** Other RU-country currency chrome must not leak into Uzbekistan-ru. */
const CROSS_COUNTRY_CURRENCY_RE =
  /\bтенге\b|\bтиын\b|\bтиына\b|\bтиынов\b|\bсом\b|\bтыйын\b|белорусский\s+рубл|₸|\bKZT\b|\bKGS\b|\bBYN\b/i;
const MONEY_KINDS = [
  "wp_pocket_money",
  "wp_pocket_money_g2",
  "wp_coins",
  "wp_coins_spent",
  "wp_kopecks",
  "wp_coins_kopecks",
  "wp_shop_discount",
  "wp_multi_step",
  "wp_multi_step_g6",
];
const ALLOWED_ROOTS = [
  path.join(ROOT, "locales", LOCALE),
  path.join(ROOT, "content-packs", LOCALE),
  path.join(ROOT, "data", "help-center", LOCALE),
  path.join(ROOT, "utils", "learning-content-ru-UZ"),
  path.join(ROOT, "tests", "i18n"),
];
const OTHER_RU_COUNTRY_LOCALES = ["ru-KZ", "ru-KG", "ru-BY"];

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
 * @param {string} dir
 * @returns {string}
 */
function readAllTextUnder(dir) {
  if (!fs.existsSync(dir)) return "";
  /** @type {string[]} */
  const parts = [];
  /** @param {string} d */
  function walk(d) {
    for (const ent of fs.readdirSync(d, { withFileTypes: true })) {
      const abs = path.join(d, ent.name);
      if (ent.isDirectory()) walk(abs);
      else if (/\.(json|js|mjs)$/.test(ent.name)) {
        parts.push(fs.readFileSync(abs, "utf8"));
      }
    }
  }
  walk(dir);
  return parts.join("\n");
}

test("ru-UZ locale namespaces parse and stay sparse vs ru-RU", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", BASE);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("ui.json"));
  assert.ok(files.includes("teacher.json"));
  assert.ok(files.includes("validation.json"));
  // Grade labels identical to ru-RU — must not ship identical overrides.
  assert.equal(files.includes("common.json"), false);
  assert.equal(files.includes("learning.json"), false);
  assert.equal(files.includes("worksheets.json"), false);

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
    assert.equal(RUSSIAN_REPRESENTS_ALL_UZ_RE.test(blob), false, file);
    assert.equal(UZBEK_AS_RUSSIAN_RE.test(blob), false, file);
    assert.equal(RUBLE_RE.test(blob), false, file);
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

test("ru-UZ grade mapping inherits 1–6 класс from ru-RU; bands inherit", () => {
  const baseCommon = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "common.json"), "utf8"));
  assert.deepEqual(
    [
      baseCommon.grade1,
      baseCommon.grade2,
      baseCommon.grade3,
      baseCommon.grade4,
      baseCommon.grade5,
      baseCommon.grade6,
    ],
    UZ_GRADES
  );
  assert.equal(baseCommon.gradeLabel, "{grade} класс");

  const countryCommonPath = path.join(ROOT, "locales", LOCALE, "common.json");
  assert.equal(fs.existsSync(countryCommonPath), false, "identical grade labels must inherit");

  const baseRewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", BASE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(
    [baseRewards.gradeBands?.g12, baseRewards.gradeBands?.g34, baseRewards.gradeBands?.g56],
    UZ_BANDS
  );
  assert.equal(
    fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json")),
    false,
    "identical grade bands must inherit"
  );

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  // Year-of-study chrome stays inherited as «класс» — not overridden with identical strings.
  assert.equal(school.portal?.chooseGrade, undefined);
  assert.equal(school.portal?.colGrade, undefined);
  assert.equal(school.portal?.createStudentGrade, undefined);
  assert.equal(school.portal?.classMgmtGrade, undefined);
  assert.equal(school.portal?.assignCurrentGrade, undefined);
});

test("ru-UZ distinguishes класс (year) from учебная группа (student group)", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.match(school.portal?.classesSubtitle || "", /класс \(год обучения\)/);
  assert.match(school.portal?.classesSubtitle || "", /учебную группу/);
  assert.equal(school.portal?.choosePhysicalClass, "Выберите учебную группу");
  assert.equal(school.portal?.colClass, "Учебная группа");
  assert.equal(school.portal?.classLabel, "Учебная группа");
  assert.equal(school.portal?.createStudentClass, "Учебная группа");
  assert.equal(school.portal?.assignCurrentClass, "Текущая учебная группа");
  assert.equal(school.portal?.classMgmtSection, "Управление учебными группами");
  assert.equal(school.communication?.detailsFieldClass, "Учебная группа");
  assert.notEqual(school.portal?.colClass, "Класс");
  assert.notEqual(school.portal?.assignCurrentClass, "Текущий класс");

  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  assert.match(teacher.dashboard?.createClassLabel || "", /учебной группы/);
  assert.match(teacher.dashboard?.createClassButton || "", /учебную группу/);
  assert.equal(
    teacher.dashboard?.noClassesHint,
    "Создайте новую учебную группу ниже, затем добавьте детей через «Управление учебной группой» на карточке группы."
  );
  assert.doesNotMatch(teacher.dashboard?.noClassesHint || "", /Управление классом/);
  assert.match(teacher.dashboard?.noClassesHint || "", /учебной группой/);

  const classesPack = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/pages__school__classes__index.json"),
      "utf8"
    )
  );
  assert.match(classesPack.copy?.no_classes_in_this_grade || "", /класс[ае]? \(год[еу] обучения\)/);
  assert.match(classesPack.copy?.no_classes_in_this_grade || "", /учебных групп/);

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
  assert.equal(dash.copy?.manage_class, "Управление учебной группой");
  assert.equal(dash.copy?.classes, "Учебные группы");
  assert.equal(dash.copy?.class_report, "Отчёт по учебной группе");
  assert.match(dash.copy?.remove_this_student_from_the_class || "", /учебной группы/);
  assert.doesNotMatch(JSON.stringify(dash), /Управление классом/);
});

test("ru-UZ SEO/UI frames Russian-medium Uzbekistan without national-language claim", () => {
  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /русскоязычн/);
  assert.match(seo.homeTitle, /Узбекистан/);
  assert.match(seo.homeTitle, /1–6 классы/);
  assert.doesNotMatch(seo.homeTitle, RUSSIAN_REPRESENTS_ALL_UZ_RE);
  assert.match(seo.homeDescription, /русскоязычн/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.home?.subhead || "", /русскоязычн/);
  assert.match(ui.home?.subhead || "", /Узбекистан/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, RUSSIAN_REPRESENTS_ALL_UZ_RE);
  assert.doesNotMatch(allLocaleText, UZBEK_AS_RUSSIAN_RE);
  assert.doesNotMatch(allLocaleText, RUBLE_RE);
  assert.doesNotMatch(allLocaleText, /\b\/uz\b/);
});

test("ru-UZ currency terminology: сум / UZS / тийин; no ruble/kopeck chrome", () => {
  const chromeBlob = [
    readAllTextUnder(path.join(ROOT, "locales", LOCALE)),
    readAllTextUnder(path.join(ROOT, "content-packs", LOCALE)),
    readAllTextUnder(path.join(ROOT, "data", "help-center", LOCALE)),
  ].join("\n");
  assert.match(chromeBlob, /сум/);
  assert.match(chromeBlob, /UZS/);
  assert.match(chromeBlob, /тийин/);
  assert.doesNotMatch(chromeBlob, RUBLE_RE);
  assert.doesNotMatch(chromeBlob, KOPECK_RE);
  assert.doesNotMatch(chromeBlob, CROSS_COUNTRY_CURRENCY_RE);

  const moneyUtil = fs.readFileSync(
    path.join(ROOT, "utils/learning-content-ru-UZ/math.js"),
    "utf8"
  );
  assert.match(moneyUtil, /export function sumWord/);
  assert.match(moneyUtil, /тийин/);
  assert.match(moneyUtil, /UZS/);
  // Child-facing template literals must not hardcode Russian ruble chrome.
  assert.doesNotMatch(moneyUtil, /`[^`]*рубл[^`]*`/);
  assert.doesNotMatch(moneyUtil, /`[^`]*копейк[^`]*`/);
  assert.doesNotMatch(moneyUtil, /`[^`]*₽[^`]*`/);
});

test("ru-UZ content packs sparse contract vs ru-RU", () => {
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
  const nearFullCopies = [];
  /** @type {string[]} */
  const emptyFiles = [];
  /** @type {string[]} */
  const hebrewHits = [];
  /** @type {string[]} */
  const claimHits = [];
  /** @type {string[]} */
  const uzbekHits = [];
  /** @type {string[]} */
  const rubleHits = [];
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
        if (RUSSIAN_REPRESENTS_ALL_UZ_RE.test(value)) claimHits.push(`${rel}:${key}`);
        if (UZBEK_AS_RUSSIAN_RE.test(value)) uzbekHits.push(`${rel}:${key}`);
        if (RUBLE_RE.test(value)) rubleHits.push(`${rel}:${key}`);
      }
      for (const key of indexAudit.identicalOverrides) identicalOverrides.push(`${rel}:${key}`);
      for (const key of indexAudit.orphanKeys) orphanKeys.push(`${rel}:${key}`);
      for (const key of indexAudit.placeholderMismatches) {
        placeholderMismatches.push(`${rel}:${key}`);
      }
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
      if (typeof value === "string" && RUSSIAN_REPRESENTS_ALL_UZ_RE.test(value)) {
        claimHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && UZBEK_AS_RUSSIAN_RE.test(value)) {
        uzbekHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && RUBLE_RE.test(value)) rubleHits.push(`${rel}:${key}`);
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
  assert.deepEqual(nearFullCopies, [], "near-full / full-copy files");
  assert.deepEqual(hebrewHits, []);
  assert.deepEqual(claimHits, [], "no Russian-represents-all-Uzbekistan claims");
  assert.deepEqual(uzbekHits, [], "no Uzbek-as-Russian leakage");
  assert.deepEqual(rubleHits, [], "no ruble chrome");
});

test("ru-UZ help overlays parse; welcome frames Russian-medium Uzbekistan", async () => {
  const help = await import(`../../data/help-center/ru-UZ/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/ru-RU/parents.js");
  assert.equal(
    help.ALL_ARTICLES_RU_UZ.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/subjects.js")).SUBJECT_ARTICLES.length
  );
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_RU_UZ.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }
  const welcome = help.BY_SECTION_RU_UZ.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeBlob = JSON.stringify(welcome);
  assert.match(welcomeBlob, /русскоязычн/);
  assert.match(welcomeBlob, /Узбекистан/);
  assert.match(welcomeBlob, /1–6 классы/);
  assert.doesNotMatch(welcomeBlob, /начальной школы с 1 по 6 класс/);
  assert.doesNotMatch(welcomeBlob, RUSSIAN_REPRESENTS_ALL_UZ_RE);

  const addStudents = help.BY_SECTION_RU_UZ.parents.find((a) => a.slug === "add-students");
  assert.match(JSON.stringify(addStudents), /класс \(год обучения: 1–6 класс\)/);

  const mathHelp = help.BY_SECTION_RU_UZ.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(mathHelp), /сум/);
  assert.match(JSON.stringify(mathHelp), /UZS/);
  assert.match(JSON.stringify(mathHelp), /тийин/);
  assert.doesNotMatch(JSON.stringify(mathHelp), RUBLE_RE);
  assert.doesNotMatch(JSON.stringify(mathHelp), KOPECK_RE);

  const helpBlob = JSON.stringify(help.ALL_ARTICLES_RU_UZ);
  assert.doesNotMatch(helpBlob, RUSSIAN_REPRESENTS_ALL_UZ_RE);
  assert.doesNotMatch(helpBlob, UZBEK_AS_RUSSIAN_RE);
  assert.doesNotMatch(helpBlob, RUBLE_RE);
  assert.doesNotMatch(helpBlob, CROSS_COUNTRY_CURRENCY_RE);
});

test("ru-UZ Math money display layer uses сум/тийин; no рубль/копейка leakage", async () => {
  const {
    applyRuUzDisplayLayer,
    rebuildMathStemRuUz,
    rebuildMoneyStemRuUz,
    sumWord,
    tiyinWord,
    CURRENCY_RU_UZ,
  } = await import("../../utils/learning-content-ru-UZ/index.js");
  const { rebuildMathStemRuRu, rubleWord, kopeckWord } = await import(
    "../../utils/learning-content-ru-RU/math.js"
  );

  assert.equal(CURRENCY_RU_UZ.name, "сум");
  assert.equal(CURRENCY_RU_UZ.code, "UZS");
  assert.equal(CURRENCY_RU_UZ.minorName, "тийин");

  assert.equal(sumWord(1), "сум");
  assert.equal(sumWord(2), "сума");
  assert.equal(sumWord(3), "сума");
  assert.equal(sumWord(4), "сума");
  assert.equal(sumWord(5), "сумов");
  assert.equal(sumWord(11), "сумов");
  assert.equal(sumWord(21), "сум");
  assert.equal(sumWord(22), "сума");
  assert.equal(sumWord(25), "сумов");

  assert.equal(tiyinWord(1), "тийин");
  assert.equal(tiyinWord(2), "тийина");
  assert.equal(tiyinWord(5), "тийинов");
  assert.equal(tiyinWord(11), "тийинов");
  assert.equal(tiyinWord(21), "тийин");
  assert.equal(tiyinWord(22), "тийина");

  const pocket = {
    id: "q_wp_pocket_money_demo",
    subject: "math",
    params: { kind: "wp_pocket_money", money: 10, toy: 3 },
    correctAnswer: 7,
    answers: [7],
  };
  const pocketStem = rebuildMathStemRuUz(pocket);
  assert.equal(
    pocketStem,
    "У Эммы 10 сумов. Она покупает перекус за 3 сума. Сколько денег осталось?"
  );
  assert.doesNotMatch(pocketStem, RUBLE_RE);
  assert.doesNotMatch(pocketStem, KOPECK_RE);
  assert.doesNotMatch(pocketStem, CROSS_COUNTRY_CURRENCY_RE);
  assert.match(rebuildMathStemRuRu(pocket), /рубл/);

  const coinsStem = rebuildMathStemRuUz({
    params: { kind: "wp_coins", coins1: 4, coins2: 3 },
  });
  assert.equal(
    coinsStem,
    "У Лео 4 монет по 1 суму и 3 монет по 2 сума. Сколько денег у него всего?"
  );
  assert.doesNotMatch(coinsStem, RUBLE_RE);

  const kopecksStem = rebuildMathStemRuUz({
    params: { kind: "wp_kopecks", rubles: 2, kopecks: 5 },
  });
  assert.equal(kopecksStem, "У Лео 2 сума и 5 тийинов. Сколько это всего в тийинах?");
  assert.doesNotMatch(kopecksStem, RUBLE_RE);
  assert.doesNotMatch(kopecksStem, KOPECK_RE);
  assert.match(rebuildMathStemRuRu({ params: { kind: "wp_kopecks", rubles: 2, kopecks: 5 } }), /копейк/);

  const discountStem = rebuildMathStemRuUz({
    params: { kind: "wp_shop_discount", price: 200, discPerc: 25 },
  });
  assert.equal(
    discountStem,
    "Футболка стоит 200 сумов со скидкой 25%. Сколько нужно заплатить после скидки?"
  );
  assert.doesNotMatch(discountStem, RUBLE_RE);

  const spentStem = rebuildMathStemRuUz({
    params: { kind: "wp_coins_spent", total: 15, spent: 6 },
  });
  assert.match(spentStem, /15 сумов/);
  assert.match(spentStem, /6 сумов/);
  assert.doesNotMatch(spentStem, RUBLE_RE);

  const multiStem = rebuildMathStemRuUz({
    params: { kind: "wp_multi_step", money: 50, a: 2, b: 3, price: 5 },
  });
  assert.match(multiStem, /50 сумов/);
  assert.match(multiStem, /5 сумов/);
  assert.doesNotMatch(multiStem, RUBLE_RE);

  const pocketG2 = rebuildMoneyStemRuUz({
    params: { kind: "wp_pocket_money_g2", money: 8, toy: 2 },
  });
  assert.match(pocketG2, /сум/);
  assert.doesNotMatch(pocketG2, RUBLE_RE);

  const coinsKop = rebuildMoneyStemRuUz({
    params: { kind: "wp_coins_kopecks", rub: 1, kop: 1 },
  });
  assert.equal(coinsKop, "У Лео 1 сум и 1 тийин. Сколько это всего в тийинах?");

  const multiG6 = rebuildMoneyStemRuUz({
    params: { kind: "wp_multi_step_g6", money: 40, a: 1, b: 2, price: 4 },
  });
  assert.match(multiG6, /сум/);
  assert.doesNotMatch(multiG6, RUBLE_RE);

  for (const kind of MONEY_KINDS) {
    const sample =
      kind === "wp_coins"
        ? { params: { kind, coins1: 2, coins2: 1 } }
        : kind === "wp_kopecks" || kind === "wp_coins_kopecks"
          ? { params: { kind, rubles: 1, kopecks: 2 } }
          : kind === "wp_shop_discount"
            ? { params: { kind, price: 100, discPerc: 10 } }
            : kind === "wp_coins_spent"
              ? { params: { kind, total: 9, spent: 4 } }
              : kind.startsWith("wp_multi_step")
                ? { params: { kind, money: 20, a: 1, b: 1, price: 3 } }
                : { params: { kind, money: 10, toy: 3 } };
    const stem = rebuildMoneyStemRuUz(sample);
    assert.ok(stem, `money stem missing for ${kind}`);
    assert.match(stem, /сум|тийин/);
    assert.doesNotMatch(stem, RUBLE_RE);
    assert.doesNotMatch(stem, KOPECK_RE);
    assert.doesNotMatch(stem, CROSS_COUNTRY_CURRENCY_RE);
  }

  assert.equal(
    rebuildMoneyStemRuUz({ params: { kind: "wp_simple_add", a: 2, b: 3 } }),
    null
  );
  assert.equal(
    rebuildMathStemRuUz({ params: { kind: "wp_simple_add", a: 2, b: 3 } }),
    rebuildMathStemRuRu({ params: { kind: "wp_simple_add", a: 2, b: 3 } })
  );

  const localized = applyRuUzDisplayLayer(
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
  assert.match(String(localized.question), /10 сумов/);
  assert.match(String(localized.exerciseText), /3 сума/);
  assert.doesNotMatch(String(localized.question), RUBLE_RE);
  assert.doesNotMatch(String(localized.exerciseText), RUBLE_RE);

  assert.equal(rubleWord(1), "рубль");
  assert.equal(kopeckWord(1), "копейка");
});

test("ru-UZ ships sparse money display layer; other heavy overlays inherit", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-UZ/index.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-UZ/math.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-UZ/geometry.js")));

  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  assert.equal(fs.existsSync(path.join(ROOT, `data/science-questions-${LOCALE}-overlay.js`)), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "books")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "learning")), false);
});

test("ru-UZ grade-year keys still use класс; no student-group leakage into year chrome", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal?.chooseGrade, undefined);
  assert.equal(school.portal?.colGrade, undefined);
  assert.equal(school.portal?.createStudentGrade, undefined);
  assert.equal(school.portal?.assignCurrentGrade, undefined);
  assert.equal(school.portal?.classMgmtGrade, undefined);

  const baseSchool = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "school.json"), "utf8"));
  assert.equal(baseSchool.portal.chooseGrade, "Выберите класс");
  assert.equal(baseSchool.portal.colGrade, "Класс");
  assert.equal(baseSchool.portal.assignCurrentGrade, "Текущий класс");
});

test("ru-UZ layer stays inside allowed content roots; ru-RU and other ru country layers unchanged", () => {
  for (const root of ALLOWED_ROOTS.slice(0, 4)) {
    assert.ok(fs.existsSync(root), root);
  }
  const testFile = path.join(ROOT, "tests", "i18n", "ru-UZ-content-layer.test.mjs");
  assert.ok(fs.existsSync(testFile));

  assert.equal(fs.existsSync(path.join(ROOT, "locales", "uz")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", "uz")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "locales", "uz-UZ")), false);

  const ruRuCommon = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", BASE, "common.json"), "utf8")
  );
  assert.deepEqual(
    [ruRuCommon.grade1, ruRuCommon.grade6],
    ["1 класс", "6 класс"],
    "ru-RU authority must remain the grade source"
  );
  const ruRuMath = fs.readFileSync(path.join(ROOT, "utils/learning-content-ru-RU/math.js"), "utf8");
  assert.match(ruRuMath, /рубль/);
  assert.match(ruRuMath, /копейка/);
  assert.doesNotMatch(ruRuMath, /CURRENCY_RU_UZ|sumWord|tiyinWord|тийин/);
  assert.doesNotMatch(ruRuMath, /1 суму|2 сума|сумов/);

  for (const other of OTHER_RU_COUNTRY_LOCALES) {
    const otherMath = path.join(ROOT, `utils/learning-content-${other}/math.js`);
    if (!fs.existsSync(otherMath)) continue;
    const blob = fs.readFileSync(otherMath, "utf8");
    assert.doesNotMatch(blob, /CURRENCY_RU_UZ|rebuildMoneyStemRuUz|тийин/);
  }
});
