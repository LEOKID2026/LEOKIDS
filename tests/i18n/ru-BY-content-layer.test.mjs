/**
 * ru-BY (Belarus Russian-medium) sparse content-layer checks.
 * Base authority: ru-RU. No registry wiring, build, or full suite.
 *
 * Scope: Russian-medium schools/tracks in Belarus — not a Belarusian layer,
 * and not a claim that Russian represents all of Belarus.
 * Planned public path /by-ru (not /by) is wiring-only and out of scope here.
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
const LOCALE = "ru-BY";
const BASE = "ru-RU";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
const BY_GRADES = ["1 класс", "2 класс", "3 класс", "4 класс", "5 класс", "6 класс"];
const BY_BANDS = ["1–2 классы", "3–4 классы", "5–6 классы"];
/** Must not claim Russian is the sole / national language of Belarus. */
const RUSSIAN_REPRESENTS_ALL_BY_RE =
  /единственн\w*\s+язык\w*\s+(в\s+)?Беларус|весь\s+Беларус\w*\s+говор|государственн\w*\s+язык\w*\s*[—\-–]\s*русск|Russian\s+is\s+the\s+only\s+language\s+of\s+Belarus|для\s+всех\s+школ\w*\s+Беларус/i;
/** Belarusian national language must not be smuggled in as Russian chrome. */
const BELARUSIAN_AS_RUSSIAN_RE =
  /\b(навучэнец|школьнік|беларуская\s+мова|пачатковая\s+школа|вучань)\b/i;
/** RF currency markers that must not appear in ru-BY chrome overlays. */
const RF_CURRENCY_CHROME_RE = /₽|\bRUB\b|(?<!белорусский\s)рубл/i;
/** RF currency markers that must not appear in ru-BY money stems / runtime display. */
const RF_CURRENCY_RUNTIME_RE = /₽|\bRUB\b|российск\w*\s+рубл/i;
/** Ambiguous / RF-style ruble wording — child stems must use Br, never bare руб. */
const AMBIGUOUS_RUBLE_RE = /\bруб\.|\bрублей\b|\bрубля\b|\bрублю\b|\bрубль\b/i;
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
  path.join(ROOT, "utils", "learning-content-ru-BY"),
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

test("ru-BY locale namespaces parse and stay sparse vs ru-RU", () => {
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
    assert.equal(RUSSIAN_REPRESENTS_ALL_BY_RE.test(blob), false, file);
    assert.equal(BELARUSIAN_AS_RUSSIAN_RE.test(blob), false, file);
    assert.equal(RF_CURRENCY_CHROME_RE.test(blob), false, file);
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

test("ru-BY grade mapping inherits 1–6 класс from ru-RU; bands inherit", () => {
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
    BY_GRADES
  );
  assert.equal(baseCommon.gradeLabel, "{grade} класс");

  const countryCommonPath = path.join(ROOT, "locales", LOCALE, "common.json");
  assert.equal(fs.existsSync(countryCommonPath), false, "identical grade labels must inherit");

  const baseRewards = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", BASE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(
    [baseRewards.gradeBands?.g12, baseRewards.gradeBands?.g34, baseRewards.gradeBands?.g56],
    BY_BANDS
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

test("ru-BY distinguishes класс (year) from учебная группа (student group)", () => {
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

  const classesPack = JSON.parse(
    fs.readFileSync(
      path.join(ROOT, "content-packs", LOCALE, "global-burn-down/pages__school__classes__index.json"),
      "utf8"
    )
  );
  assert.match(classesPack.copy?.no_classes_in_this_grade || "", /класс[ае]? \(год[еу] обучения\)/);
  assert.match(classesPack.copy?.no_classes_in_this_grade || "", /учебных групп/);
});

test("ru-BY SEO/UI frames Russian-medium Belarus without national-language claim", () => {
  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.homeTitle, /русскоязычн/);
  assert.match(seo.homeTitle, /Беларус/);
  assert.match(seo.homeTitle, /1–6 классы/);
  assert.doesNotMatch(seo.homeTitle, RUSSIAN_REPRESENTS_ALL_BY_RE);
  assert.match(seo.homeDescription, /русскоязычн/);

  const ui = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "ui.json"), "utf8"));
  assert.match(ui.home?.subhead || "", /русскоязычн/);
  assert.match(ui.home?.subhead || "", /Беларус/);

  const allLocaleText = listJsonRel(path.join(ROOT, "locales", LOCALE))
    .map((rel) => fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"))
    .join("\n");
  assert.doesNotMatch(allLocaleText, RUSSIAN_REPRESENTS_ALL_BY_RE);
  assert.doesNotMatch(allLocaleText, BELARUSIAN_AS_RUSSIAN_RE);
  assert.doesNotMatch(allLocaleText, RF_CURRENCY_CHROME_RE);
  assert.doesNotMatch(allLocaleText, /\b\/by\b(?!-ru)/);
});

test("ru-BY teacher.dashboard.noClassesHint uses student-group terminology", () => {
  const teacher = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8"));
  assert.match(teacher.dashboard?.noClassesHint || "", /учебную группу/);
  assert.match(teacher.dashboard?.noClassesHint || "", /Управление учебной группой/);
  assert.doesNotMatch(teacher.dashboard?.noClassesHint || "", /Управление классом/);
  assert.doesNotMatch(teacher.dashboard?.noClassesHint || "", /на карточке класса/);

  // Year-of-study keys still inherit «класс» from ru-RU — not overridden here.
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.match(school.portal?.classesSubtitle || "", /класс \(год обучения\)/);
  assert.equal(school.portal?.createStudentGrade, undefined);
  assert.equal(school.portal?.classMgmtGrade, undefined);

  const overlayBlob = [
    readAllTextUnder(path.join(ROOT, "locales", LOCALE)),
    readAllTextUnder(path.join(ROOT, "content-packs", LOCALE)),
    readAllTextUnder(path.join(ROOT, "data", "help-center", LOCALE)),
  ].join("\n");
  // No remaining student-group chrome that still says bare «Управление классом».
  assert.doesNotMatch(overlayBlob, /Управление классом/);
});

test("ru-BY currency terminology: белорусский рубль / Br / BYN; no RF chrome", async () => {
  const { CURRENCY_RU_BY } = await import(
    `../../utils/learning-content-ru-BY/index.js?currency=${Date.now()}`
  );
  assert.equal(CURRENCY_RU_BY.name, "белорусский рубль");
  assert.equal(CURRENCY_RU_BY.shortName, "Br");
  assert.equal(CURRENCY_RU_BY.symbol, "Br");
  assert.equal(CURRENCY_RU_BY.code, "BYN");
  assert.equal(CURRENCY_RU_BY.minorName, "копейка");

  const chromeBlob = [
    readAllTextUnder(path.join(ROOT, "locales", LOCALE)),
    readAllTextUnder(path.join(ROOT, "content-packs", LOCALE)),
    readAllTextUnder(path.join(ROOT, "data", "help-center", LOCALE)),
  ].join("\n");
  assert.doesNotMatch(chromeBlob, /₽|\bRUB\b/);
  assert.doesNotMatch(chromeBlob, RF_CURRENCY_CHROME_RE);
});

test("ru-BY content packs sparse contract vs ru-RU", () => {
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
  const belarusianHits = [];
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
        if (RUSSIAN_REPRESENTS_ALL_BY_RE.test(value)) claimHits.push(`${rel}:${key}`);
        if (BELARUSIAN_AS_RUSSIAN_RE.test(value)) belarusianHits.push(`${rel}:${key}`);
        if (RF_CURRENCY_CHROME_RE.test(value)) rubleHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && RUSSIAN_REPRESENTS_ALL_BY_RE.test(value)) {
        claimHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && BELARUSIAN_AS_RUSSIAN_RE.test(value)) {
        belarusianHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && RF_CURRENCY_CHROME_RE.test(value)) rubleHits.push(`${rel}:${key}`);
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
  assert.deepEqual(claimHits, [], "no Russian-represents-all-Belarus claims");
  assert.deepEqual(belarusianHits, [], "no Belarusian-as-Russian leakage");
  assert.deepEqual(rubleHits, [], "no Russian ruble chrome");
});

test("ru-BY help overlays parse; welcome frames Russian-medium Belarus", async () => {
  const help = await import(`../../data/help-center/ru-BY/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/ru-RU/parents.js");
  assert.equal(
    help.ALL_ARTICLES_RU_BY.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/subjects.js")).SUBJECT_ARTICLES.length
  );
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_RU_BY.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }
  const welcome = help.BY_SECTION_RU_BY.parents.find((a) => a.slug === "welcome-and-overview");
  const welcomeBlob = JSON.stringify(welcome);
  assert.match(welcomeBlob, /русскоязычн/);
  assert.match(welcomeBlob, /Беларус/);
  assert.match(welcomeBlob, /1–6 классы/);
  assert.doesNotMatch(welcomeBlob, /начальной школы с 1 по 6 класс/);
  assert.doesNotMatch(welcomeBlob, RUSSIAN_REPRESENTS_ALL_BY_RE);

  const addStudents = help.BY_SECTION_RU_BY.parents.find((a) => a.slug === "add-students");
  assert.match(JSON.stringify(addStudents), /класс \(год обучения: 1–6 класс\)/);

  const helpBlob = JSON.stringify(help.ALL_ARTICLES_RU_BY);
  assert.doesNotMatch(helpBlob, RUSSIAN_REPRESENTS_ALL_BY_RE);
  assert.doesNotMatch(helpBlob, BELARUSIAN_AS_RUSSIAN_RE);
  assert.doesNotMatch(helpBlob, /₽|\bRUB\b/);
});

test("ru-BY Math money display layer uses Br/копейка; no ambiguous руб./RF ₽", async () => {
  const {
    applyRuByDisplayLayer,
    rebuildMathStemRuBy,
    rebuildMoneyStemRuBy,
    bynRubleWord,
    bynRubleFullPhrase,
    bynKopeckWord,
    CURRENCY_RU_BY,
  } = await import(`../../utils/learning-content-ru-BY/index.js?t=${Date.now()}`);
  const { rebuildMathStemRuRu, rubleWord, kopeckWord } = await import(
    "../../utils/learning-content-ru-RU/math.js"
  );

  assert.equal(CURRENCY_RU_BY.name, "белорусский рубль");
  assert.equal(CURRENCY_RU_BY.symbol, "Br");
  assert.equal(CURRENCY_RU_BY.code, "BYN");
  assert.equal(CURRENCY_RU_BY.shortName, "Br");
  assert.equal(CURRENCY_RU_BY.minorName, "копейка");

  // Child major unit is indeclinable Br (NBRB Latin symbol for BYN).
  assert.equal(bynRubleWord(1), "Br");
  assert.equal(bynRubleWord(2), "Br");
  assert.equal(bynRubleWord(5), "Br");
  assert.equal(bynRubleWord(11), "Br");
  assert.equal(bynRubleWord(21), "Br");

  // Full-phrase authority forms (not used in child stems; grammar reference).
  assert.equal(bynRubleFullPhrase(1), "белорусский рубль");
  assert.equal(bynRubleFullPhrase(2), "белорусских рубля");
  assert.equal(bynRubleFullPhrase(3), "белорусских рубля");
  assert.equal(bynRubleFullPhrase(4), "белорусских рубля");
  assert.equal(bynRubleFullPhrase(5), "белорусских рублей");
  assert.equal(bynRubleFullPhrase(11), "белорусских рублей");
  assert.equal(bynRubleFullPhrase(21), "белорусский рубль");
  assert.equal(bynRubleFullPhrase(22), "белорусских рубля");

  assert.equal(bynKopeckWord(1), "копейка");
  assert.equal(bynKopeckWord(2), "копейки");
  assert.equal(bynKopeckWord(5), "копеек");
  assert.equal(bynKopeckWord(11), "копеек");
  assert.equal(bynKopeckWord(21), "копейка");

  const pocket = {
    id: "q_wp_pocket_money_demo",
    subject: "math",
    params: { kind: "wp_pocket_money", money: 10, toy: 3 },
    correctAnswer: 7,
    answers: [7],
    diagnostic: { tag: "money_change" },
    tags: ["money"],
    questionKind: "word_problem",
  };
  const pocketStem = rebuildMathStemRuBy(pocket);
  assert.equal(
    pocketStem,
    "У Эммы 10 Br. Она покупает перекус за 3 Br. Сколько денег осталось?"
  );
  assert.match(pocketStem, /\bBr\b/);
  assert.doesNotMatch(pocketStem, AMBIGUOUS_RUBLE_RE);
  assert.doesNotMatch(pocketStem, RF_CURRENCY_RUNTIME_RE);
  assert.match(rebuildMathStemRuRu(pocket), /рубл/);
  assert.notEqual(pocketStem, rebuildMathStemRuRu(pocket));

  const coinsStem = rebuildMathStemRuBy({
    params: { kind: "wp_coins", coins1: 4, coins2: 3 },
  });
  assert.equal(
    coinsStem,
    "У Лео 4 монет по 1 Br и 3 монет по 2 Br. Сколько денег у него всего?"
  );
  assert.match(coinsStem, /по 1 Br/);
  assert.match(coinsStem, /по 2 Br/);
  assert.doesNotMatch(coinsStem, AMBIGUOUS_RUBLE_RE);
  assert.doesNotMatch(coinsStem, RF_CURRENCY_RUNTIME_RE);

  const kopecksStem = rebuildMathStemRuBy({
    params: { kind: "wp_kopecks", rubles: 2, kopecks: 5 },
  });
  assert.equal(kopecksStem, "У Лео 2 Br и 5 копеек. Сколько это всего в копейках?");
  assert.match(kopecksStem, /\bBr\b/);
  assert.match(kopecksStem, /копеек/);
  assert.doesNotMatch(kopecksStem, AMBIGUOUS_RUBLE_RE);
  assert.doesNotMatch(kopecksStem, RF_CURRENCY_RUNTIME_RE);
  assert.match(rebuildMathStemRuRu({ params: { kind: "wp_kopecks", rubles: 2, kopecks: 5 } }), /рубл/);

  const discountStem = rebuildMathStemRuBy({
    params: { kind: "wp_shop_discount", price: 200, discPerc: 25 },
  });
  assert.equal(
    discountStem,
    "Футболка стоит 200 Br со скидкой 25%. Сколько нужно заплатить после скидки?"
  );
  assert.doesNotMatch(discountStem, AMBIGUOUS_RUBLE_RE);
  assert.doesNotMatch(discountStem, RF_CURRENCY_RUNTIME_RE);

  const spentStem = rebuildMathStemRuBy({
    params: { kind: "wp_coins_spent", total: 15, spent: 6 },
  });
  assert.match(spentStem, /15 Br/);
  assert.match(spentStem, /6 Br/);
  assert.doesNotMatch(spentStem, AMBIGUOUS_RUBLE_RE);
  assert.doesNotMatch(spentStem, RF_CURRENCY_RUNTIME_RE);

  const multiStem = rebuildMathStemRuBy({
    params: { kind: "wp_multi_step", money: 50, a: 2, b: 3, price: 5 },
  });
  assert.match(multiStem, /50 Br/);
  assert.match(multiStem, /5 Br/);
  assert.doesNotMatch(multiStem, AMBIGUOUS_RUBLE_RE);
  assert.doesNotMatch(multiStem, RF_CURRENCY_RUNTIME_RE);

  // 1 / 2–4 / 5+ major-unit counts all surface as Br.
  for (const n of [1, 2, 3, 4, 5, 11, 21, 22]) {
    const stem = rebuildMoneyStemRuBy({
      params: { kind: "wp_pocket_money", money: n, toy: 1 },
    });
    assert.match(String(stem), new RegExp(`\\b${n} Br\\b`));
    assert.doesNotMatch(String(stem), AMBIGUOUS_RUBLE_RE);
  }

  for (const kind of MONEY_KINDS) {
    const stem = rebuildMoneyStemRuBy({
      params: {
        kind,
        money: 10,
        toy: 3,
        coins1: 2,
        coins2: 3,
        total: 15,
        spent: 6,
        rubles: 2,
        kopecks: 5,
        price: 20,
        discPerc: 10,
        a: 1,
        b: 2,
      },
    });
    assert.notEqual(stem, null, kind);
    assert.match(String(stem), /\bBr\b/, kind);
    assert.doesNotMatch(String(stem), AMBIGUOUS_RUBLE_RE, kind);
    assert.doesNotMatch(String(stem), RF_CURRENCY_RUNTIME_RE, kind);
    assert.doesNotMatch(String(stem), /\u20BD/, kind);
  }

  // Non-money stems still come from ru-RU (sparse — not a full copy module).
  assert.equal(
    rebuildMoneyStemRuBy({ params: { kind: "wp_simple_add", a: 2, b: 3 } }),
    null
  );
  assert.equal(
    rebuildMathStemRuBy({ params: { kind: "wp_simple_add", a: 2, b: 3 } }),
    rebuildMathStemRuRu({ params: { kind: "wp_simple_add", a: 2, b: 3 } })
  );

  const localized = applyRuByDisplayLayer(
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
  assert.deepEqual(localized.diagnostic, pocket.diagnostic);
  assert.deepEqual(localized.tags, pocket.tags);
  assert.equal(localized.questionKind, pocket.questionKind);
  assert.match(String(localized.question), /10 Br/);
  assert.match(String(localized.exerciseText), /3 Br/);
  assert.doesNotMatch(String(localized.question), AMBIGUOUS_RUBLE_RE);
  assert.doesNotMatch(String(localized.question), RF_CURRENCY_RUNTIME_RE);
  assert.doesNotMatch(String(localized.exerciseText), /\u20BD/);

  // ru-RU helpers unchanged.
  assert.equal(rubleWord(1), "рубль");
  assert.equal(kopeckWord(1), "копейка");
});

test("ru-BY ships sparse money display layer; other heavy overlays inherit", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-BY/index.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-BY/math.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-BY/geometry.js")));

  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  const meaningLegacy = path.join(ROOT, "data/english-questions", `word-meanings-${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningLegacy), false);
  const scienceOverlay = path.join(ROOT, `data/science-questions-${LOCALE}-overlay.js`);
  assert.equal(fs.existsSync(scienceOverlay), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "books")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "learning")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "demo")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "games")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "rewards")), false);
});

test("ru-BY layer stays inside allowed content roots; no /by path; base ru-RU untouched", () => {
  for (const root of ALLOWED_ROOTS.slice(0, 4)) {
    assert.ok(fs.existsSync(root), root);
  }
  const testFile = path.join(ROOT, "tests", "i18n", "ru-BY-content-layer.test.mjs");
  assert.ok(fs.existsSync(testFile));

  // Guard: this content layer must not create /by public-path artifacts.
  assert.equal(fs.existsSync(path.join(ROOT, "locales", "by")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", "by")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "locales", "be-BY")), false);

  const ruRuCommon = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", BASE, "common.json"), "utf8")
  );
  assert.deepEqual(
    [ruRuCommon.grade1, ruRuCommon.grade6],
    ["1 класс", "6 класс"],
    "ru-RU authority must remain the grade source"
  );
});

test("ru-BY other locales modified = 0 (content layer scope)", () => {
  // Content-layer agent must not create sibling locale trees or edit ru-RU/en/ru-KZ/ru-UZ/ru-KG.
  assert.equal(fs.existsSync(path.join(ROOT, "locales", "by-ru")), false);
  const ruRuSeo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "seo.json"), "utf8"));
  assert.doesNotMatch(ruRuSeo.homeTitle || "", /Беларус/);
  const enSeoPath = path.join(ROOT, "locales", "en", "seo.json");
  if (fs.existsSync(enSeoPath)) {
    const enSeo = JSON.parse(fs.readFileSync(enSeoPath, "utf8"));
    assert.doesNotMatch(enSeo.homeTitle || "", /Belarus/);
  }

  for (const sibling of ["ru-KZ", "ru-UZ", "ru-KG"]) {
    const seoPath = path.join(ROOT, "locales", sibling, "seo.json");
    if (!fs.existsSync(seoPath)) continue;
    const seo = JSON.parse(fs.readFileSync(seoPath, "utf8"));
    assert.doesNotMatch(seo.homeTitle || "", /Беларус/);
  }

  const ruRuMath = fs.readFileSync(path.join(ROOT, "utils/learning-content-ru-RU/math.js"), "utf8");
  assert.match(ruRuMath, /Currency display for Russia/);
  assert.match(ruRuMath, /₽|рубль/);
});
