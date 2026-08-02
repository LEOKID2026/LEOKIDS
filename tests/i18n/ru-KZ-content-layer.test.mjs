/**
 * ru-KZ (Kazakhstan Russian-medium) sparse content-layer checks.
 * No registry wiring, build, or full suite.
 *
 * Grade labels match ru-RU (1–6 класс) and are inherited, not duplicated.
 * This layer does not replace Kazakh-medium education and does not wire /kz.
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
const LOCALE = "ru-KZ";
const BASE = "ru-RU";
const HEBREW_RE = /[\u0590-\u05FF]/
const PLACEHOLDER_RE = /\{[a-zA-Z0-9_|,# ]+\}|\{\{[^}]+\}\}/g;
/** Kazakh-specific Cyrillic letters — must not appear in Russian-medium chrome. */
const KAZAKH_LETTER_RE = /[ӘәҒғҚқҢңӨөҰұҮүҺһІі]/
const KAZAKH_REPLACEMENT_RE =
  /единственн\w*\s+язык|заменяет казах|вместо казах|весь Казахстан|всех школ Казахстана|государственн\w*\s+язык\w*\s+русск/i;
const RUBLE_RE = /рубл|\u20BD/;
const KOPECK_RE = /копеек|копейк/;
const RUSSIAN_CURRENCY_LEAK_RE = /рубл|\u20BD|копеек|копейк/;
const CURRENCY_NAME = "тенге";
const CURRENCY_SYMBOL = "₸";
const CURRENCY_CODE = "KZT";
const MINOR_UNIT = "тиын";
const KZ_GRADES = ["1 класс", "2 класс", "3 класс", "4 класс", "5 класс", "6 класс"];
const KZ_BANDS = {
  g12: "1–2 классы",
  g34: "3–4 классы",
  g56: "5–6 классы",
};

/** Paths outside the ru-KZ content agent allow-list that must stay untouched. */
const FORBIDDEN_TOUCH_GLOBS = [
  "locales/ru-RU",
  "locales/en",
  "content-packs/ru-RU",
  "content-packs/en",
  "data/help-center/index.js",
  "data/help-center/ru-RU",
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

/** @returns {string} */
function allOverlayText() {
  const chunks = [];
  for (const rel of listJsonRel(path.join(ROOT, "locales", LOCALE))) {
    chunks.push(fs.readFileSync(path.join(ROOT, "locales", LOCALE, rel), "utf8"));
  }
  for (const rel of listJsonRel(path.join(ROOT, "content-packs", LOCALE))) {
    chunks.push(fs.readFileSync(path.join(ROOT, "content-packs", LOCALE, rel), "utf8"));
  }
  const helpDir = path.join(ROOT, "data/help-center", LOCALE);
  if (fs.existsSync(helpDir)) {
    for (const name of fs.readdirSync(helpDir)) {
      if (name.endsWith(".js")) {
        chunks.push(fs.readFileSync(path.join(helpDir, name), "utf8"));
      }
    }
  }
  return chunks.join("\n");
}

test("ru-KZ locale namespaces parse and stay sparse vs ru-RU", () => {
  const countryDir = path.join(ROOT, "locales", LOCALE);
  const baseDir = path.join(ROOT, "locales", BASE);
  assert.ok(fs.existsSync(countryDir));
  const files = fs.readdirSync(countryDir).filter((f) => f.endsWith(".json")).sort();
  assert.ok(files.includes("seo.json"));
  assert.ok(files.includes("school.json"));
  assert.ok(files.includes("ui.json"));
  assert.ok(files.includes("validation.json"));
  assert.ok(files.includes("teacher.json"));

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
    assert.equal(KAZAKH_LETTER_RE.test(blob), false, `Kazakh-letter leak in ${file}`);
    assert.equal(KAZAKH_REPLACEMENT_RE.test(blob), false, `Kazakh-replacement claim in ${file}`);
    assert.equal(RUBLE_RE.test(blob), false, `ruble leak in ${file}`);
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

test("ru-KZ grade mapping inherits 1–6 класс from ru-RU (no identical grade dumps)", () => {
  const commonOverlayPath = path.join(ROOT, "locales", LOCALE, "common.json");
  assert.equal(fs.existsSync(commonOverlayPath), false, "grade labels must inherit, not dump");

  const commonBase = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", BASE, "common.json"), "utf8")
  );
  assert.deepEqual(
    [
      commonBase.grade1,
      commonBase.grade2,
      commonBase.grade3,
      commonBase.grade4,
      commonBase.grade5,
      commonBase.grade6,
    ],
    KZ_GRADES
  );
  assert.equal(commonBase.gradeLabel, "{grade} класс");

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
    KZ_GRADES
  );

  const rewardsBase = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content-packs", BASE, "rewards/ui.json"), "utf8")
  );
  assert.deepEqual(rewardsBase.gradeBands, KZ_BANDS);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "rewards/ui.json")), false);

  const seo = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "seo.json"), "utf8"));
  assert.match(seo.learningDescription, /1–6 классы/);
  assert.match(seo.homeTitle, /русскоязычного обучения в Казахстане/);
  assert.doesNotMatch(seo.homeTitle, /единственн|всех школ/i);

  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.match(school.portal?.classesSubtitle || "", /1–6 классы/);
  assert.match(school.portal?.classesSubtitle || "", /год обучения/);
});

test("ru-KZ класс (school year) vs учебная группа (student group)", () => {
  const school = JSON.parse(fs.readFileSync(path.join(ROOT, "locales", LOCALE, "school.json"), "utf8"));
  assert.equal(school.portal?.choosePhysicalClass, "Выберите учебную группу");
  assert.equal(school.portal?.colClass, "Учебная группа");
  assert.equal(school.portal?.assignCurrentClass, "Текущая учебная группа");
  assert.equal(school.portal?.classMgmtSection, "Управление учебными группами");
  assert.match(school.portal?.classesSubtitle || "", /учебную группу/);
  assert.match(school.portal?.classesSubtitle || "", /класс \(год обучения/);
  assert.equal(school.communication?.audienceClassParents, "Родители учебной группы");
  assert.equal(school.communication?.audienceGradeParents, "Родители класса (года обучения)");

  // Grade-year chrome stays on класс via inheritance (not overridden as учебная группа).
  const schoolMerged = deepMergeJson(
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "school.json"), "utf8")),
    school
  );
  assert.equal(schoolMerged.portal?.chooseGrade, "Выберите класс");
  assert.equal(schoolMerged.portal?.createStudentGrade, "Класс");
  assert.equal(schoolMerged.portal?.classMgmtGrade, "Класс");
  assert.equal(schoolMerged.portal?.assignCurrentGrade, "Текущий класс");
  assert.equal(schoolMerged.portal?.colGrade, "Класс");
  assert.notEqual(schoolMerged.portal?.assignCurrentClass, schoolMerged.portal?.assignCurrentGrade);

  const teacher = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "teacher.json"), "utf8")
  );
  assert.equal(teacher.dashboard?.createClassLabel, "Название учебной группы");
  assert.doesNotMatch(teacher.dashboard?.createClassPlaceholder || "", /3 класс —/);

  const validation = JSON.parse(
    fs.readFileSync(path.join(ROOT, "locales", LOCALE, "validation.json"), "utf8")
  );
  assert.match(validation.api?.physical_class_not_found || "", /учебная группа/);
});

test("ru-KZ currency terminology тенге / ₸ / KZT (no ruble in overlays)", () => {
  assert.equal(CURRENCY_NAME, "тенге");
  assert.equal(CURRENCY_SYMBOL, "₸");
  assert.equal(CURRENCY_CODE, "KZT");
  assert.equal(MINOR_UNIT, "тиын");
  const blob = allOverlayText();
  assert.match(blob, /тенге/);
  assert.match(blob, /₸/);
  assert.match(blob, /KZT/);
  assert.match(blob, /тиын/);
  assert.doesNotMatch(blob, RUBLE_RE);
  assert.doesNotMatch(blob, KOPECK_RE);
});

test("ru-KZ content packs sparse contract vs ru-RU", () => {
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
  const kazakhLetterHits = [];
  /** @type {string[]} */
  const replacementHits = [];
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
        if (KAZAKH_LETTER_RE.test(value)) kazakhLetterHits.push(`${rel}:${key}`);
        if (KAZAKH_REPLACEMENT_RE.test(value)) replacementHits.push(`${rel}:${key}`);
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
      if (typeof value === "string" && KAZAKH_LETTER_RE.test(value)) {
        kazakhLetterHits.push(`${rel}:${key}`);
      }
      if (typeof value === "string" && KAZAKH_REPLACEMENT_RE.test(value)) {
        replacementHits.push(`${rel}:${key}`);
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
  assert.deepEqual(kazakhLetterHits, [], "Kazakh-letter leakage");
  assert.deepEqual(replacementHits, [], "Kazakh replacement claims");
  assert.deepEqual(rubleHits, [], "ruble leakage");
});

test("ru-KZ help overlays parse; Russian-medium; no Kazakh replacement", async () => {
  const help = await import(`../../data/help-center/ru-KZ/index.js?t=${Date.now()}`);
  const parentsBase = await import("../../data/help-center/ru-RU/parents.js");
  assert.equal(
    help.ALL_ARTICLES_RU_KZ.length,
    parentsBase.PARENT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/students.js")).STUDENT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/parent-report.js")).PARENT_REPORT_ARTICLES.length +
      (await import("../../data/help-center/ru-RU/subjects.js")).SUBJECT_ARTICLES.length
  );
  const parentSlugs = new Set(parentsBase.PARENT_ARTICLES.map((a) => a.slug));
  for (const a of help.BY_SECTION_RU_KZ.parents) {
    assert.ok(parentSlugs.has(a.slug), a.slug);
  }

  const welcome = help.BY_SECTION_RU_KZ.parents.find((a) => a.slug === "welcome-and-overview");
  assert.match(JSON.stringify(welcome), /русским языком обучения в Казахстане/);
  assert.match(JSON.stringify(welcome), /1–6 классы/);
  assert.match(JSON.stringify(welcome), /казахский язык обучения остаётся отдельным/);
  assert.doesNotMatch(JSON.stringify(welcome), KAZAKH_REPLACEMENT_RE);
  assert.doesNotMatch(JSON.stringify(welcome), KAZAKH_LETTER_RE);

  const addStudents = help.BY_SECTION_RU_KZ.parents.find((a) => a.slug === "add-students");
  assert.match(addStudents.summary, /класс \(год обучения\)/);
  assert.match(JSON.stringify(addStudents), /1 класс — 6 класс/);

  const choose = help.BY_SECTION_RU_KZ.students.find((a) => a.slug === "choose-subject-and-grade");
  assert.match(JSON.stringify(choose), /году обучения/);

  const math = help.BY_SECTION_RU_KZ.subjects.find((a) => a.slug === "math");
  assert.match(JSON.stringify(math), /тенге/);
  assert.match(JSON.stringify(math), /₸/);
  assert.match(JSON.stringify(math), /KZT/);
  assert.match(JSON.stringify(math), /тиын/);
  assert.match(JSON.stringify(math), /1–6 классы/);
  assert.doesNotMatch(JSON.stringify(math), RUSSIAN_CURRENCY_LEAK_RE);

  const english = help.BY_SECTION_RU_KZ.subjects.find((a) => a.slug === "english");
  assert.match(JSON.stringify(english), /остаются на английском|на английском/);
});

test("ru-KZ Math money display layer uses тенге/тиын; no рубль/копейка leakage", async () => {
  const {
    applyRuKzDisplayLayer,
    rebuildMathStemRuKz,
    rebuildMoneyStemRuKz,
    tengeWord,
    tiynWord,
    CURRENCY_RU_KZ,
  } = await import("../../utils/learning-content-ru-KZ/index.js");
  const { rebuildMathStemRuRu, rubleWord, kopeckWord } = await import(
    "../../utils/learning-content-ru-RU/math.js"
  );

  assert.equal(CURRENCY_RU_KZ.name, "тенге");
  assert.equal(CURRENCY_RU_KZ.symbol, "₸");
  assert.equal(CURRENCY_RU_KZ.code, "KZT");
  assert.equal(CURRENCY_RU_KZ.minorName, "тиын");

  // Indeclinable тенге after cardinals.
  assert.equal(tengeWord(1), "тенге");
  assert.equal(tengeWord(2), "тенге");
  assert.equal(tengeWord(5), "тенге");
  assert.equal(tengeWord(11), "тенге");
  assert.equal(tengeWord(21), "тенге");
  assert.equal(tengeWord(22), "тенге");

  // тиын count forms.
  assert.equal(tiynWord(1), "тиын");
  assert.equal(tiynWord(2), "тиына");
  assert.equal(tiynWord(3), "тиына");
  assert.equal(tiynWord(4), "тиына");
  assert.equal(tiynWord(5), "тиынов");
  assert.equal(tiynWord(11), "тиынов");
  assert.equal(tiynWord(12), "тиынов");
  assert.equal(tiynWord(21), "тиын");
  assert.equal(tiynWord(22), "тиына");
  assert.equal(tiynWord(25), "тиынов");

  const pocket = {
    id: "q_wp_pocket_money_demo",
    subject: "math",
    params: { kind: "wp_pocket_money", money: 10, toy: 3 },
    correctAnswer: 7,
    answers: [7],
  };
  const pocketStem = rebuildMathStemRuKz(pocket);
  assert.equal(
    pocketStem,
    "У Эммы 10 тенге. Она покупает перекус за 3 тенге. Сколько денег осталось?"
  );
  assert.doesNotMatch(pocketStem, RUSSIAN_CURRENCY_LEAK_RE);
  assert.match(rebuildMathStemRuRu(pocket), /рубл/);

  const coinsStem = rebuildMathStemRuKz({
    params: { kind: "wp_coins", coins1: 4, coins2: 3 },
  });
  assert.equal(
    coinsStem,
    "У Лео 4 монет по 1 тенге и 3 монет по 2 тенге. Сколько денег у него всего?"
  );
  assert.doesNotMatch(coinsStem, RUSSIAN_CURRENCY_LEAK_RE);

  const kopecksStem = rebuildMathStemRuKz({
    params: { kind: "wp_kopecks", rubles: 2, kopecks: 5 },
  });
  assert.equal(kopecksStem, "У Лео 2 тенге и 5 тиынов. Сколько это всего в тиынах?");
  assert.doesNotMatch(kopecksStem, RUSSIAN_CURRENCY_LEAK_RE);
  assert.match(rebuildMathStemRuRu({ params: { kind: "wp_kopecks", rubles: 2, kopecks: 5 } }), /копейк/);

  const discountStem = rebuildMathStemRuKz({
    params: { kind: "wp_shop_discount", price: 200, discPerc: 25 },
  });
  assert.equal(
    discountStem,
    "Футболка стоит 200 тенге со скидкой 25%. Сколько нужно заплатить после скидки?"
  );
  assert.doesNotMatch(discountStem, RUSSIAN_CURRENCY_LEAK_RE);

  const spentStem = rebuildMathStemRuKz({
    params: { kind: "wp_coins_spent", total: 15, spent: 6 },
  });
  assert.match(spentStem, /15 тенге/);
  assert.match(spentStem, /6 тенге/);
  assert.doesNotMatch(spentStem, RUSSIAN_CURRENCY_LEAK_RE);

  const multiStem = rebuildMathStemRuKz({
    params: { kind: "wp_multi_step", money: 50, a: 2, b: 3, price: 5 },
  });
  assert.match(multiStem, /50 тенге/);
  assert.match(multiStem, /5 тенге/);
  assert.doesNotMatch(multiStem, RUSSIAN_CURRENCY_LEAK_RE);

  // Non-money stems still come from ru-RU (sparse — not a full copy module).
  assert.equal(
    rebuildMoneyStemRuKz({ params: { kind: "wp_simple_add", a: 2, b: 3 } }),
    null
  );
  assert.equal(
    rebuildMathStemRuKz({ params: { kind: "wp_simple_add", a: 2, b: 3 } }),
    rebuildMathStemRuRu({ params: { kind: "wp_simple_add", a: 2, b: 3 } })
  );

  const localized = applyRuKzDisplayLayer(
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
  assert.match(String(localized.question), /10 тенге/);
  assert.match(String(localized.exerciseText), /3 тенге/);
  assert.doesNotMatch(String(localized.question), RUSSIAN_CURRENCY_LEAK_RE);
  assert.doesNotMatch(String(localized.exerciseText), RUSSIAN_CURRENCY_LEAK_RE);

  // ru-RU helpers unchanged.
  assert.equal(rubleWord(1), "рубль");
  assert.equal(kopeckWord(1), "копейка");
});

test("ru-KZ Help and runtime money terminology agree", async () => {
  const help = await import(`../../data/help-center/ru-KZ/index.js?t=${Date.now() + 1}`);
  const { rebuildMathStemRuKz, CURRENCY_RU_KZ } = await import(
    "../../utils/learning-content-ru-KZ/index.js"
  );
  const math = help.BY_SECTION_RU_KZ.subjects.find((a) => a.slug === "math");
  const helpBlob = JSON.stringify(math);
  assert.match(helpBlob, new RegExp(CURRENCY_RU_KZ.name));
  assert.match(helpBlob, new RegExp(CURRENCY_RU_KZ.symbol));
  assert.match(helpBlob, new RegExp(CURRENCY_RU_KZ.code));
  assert.match(helpBlob, new RegExp(CURRENCY_RU_KZ.minorName));

  const stem = rebuildMathStemRuKz({
    params: { kind: "wp_pocket_money", money: 10, toy: 3 },
  });
  assert.match(stem, /тенге/);
  assert.doesNotMatch(stem, RUSSIAN_CURRENCY_LEAK_RE);
  assert.match(helpBlob, /тенге/);
  assert.doesNotMatch(helpBlob, RUSSIAN_CURRENCY_LEAK_RE);
});

test("ru-KZ ships sparse money display layer; other heavy overlays inherit", () => {
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-KZ/index.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-KZ/math.js")));
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-KZ/geometry.js")));

  const meaningPath = path.join(ROOT, "data/english-questions/word-meanings", `${LOCALE}.js`);
  assert.equal(fs.existsSync(meaningPath), false);
  assert.equal(fs.existsSync(path.join(ROOT, "data/science-questions-ru-KZ-overlay.js")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "docs/learning-book/ru-KZ")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "books")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "demo")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "games")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "learning")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "reports")), false);
  assert.equal(fs.existsSync(path.join(ROOT, "content-packs", LOCALE, "rewards")), false);

  const enSkills = path.join(ROOT, "content-packs", BASE, "books/english-page-skills.json");
  assert.ok(fs.existsSync(enSkills));
  const skills = JSON.parse(fs.readFileSync(enSkills, "utf8"));
  const blob = JSON.stringify(skills);
  assert.match(blob, /the best|phonics|grammar|spelling|vocabulary/i);
});

test("ru-KZ no Kazakh-replacement claim across overlays", () => {
  const blob = allOverlayText();
  assert.doesNotMatch(blob, KAZAKH_LETTER_RE);
  assert.doesNotMatch(blob, KAZAKH_REPLACEMENT_RE);
  assert.doesNotMatch(blob, /\/kz(?!-ru)/);
  assert.match(blob, /русск/);
  assert.match(blob, /Казахстан/);
});

test("ru-KZ other locales / shared runtime not modified by this layer tree", () => {
  // Content-layer agent allow-list: only ru-KZ trees + this test may be authored here.
  for (const rel of FORBIDDEN_TOUCH_GLOBS) {
    assert.ok(fs.existsSync(path.join(ROOT, rel)), `authority path exists: ${rel}`);
  }
  assert.ok(fs.existsSync(path.join(ROOT, "locales", LOCALE)));
  assert.ok(fs.existsSync(path.join(ROOT, "content-packs", LOCALE)));
  assert.ok(fs.existsSync(path.join(ROOT, "data/help-center", LOCALE)));
  assert.ok(fs.existsSync(path.join(ROOT, "tests/i18n/ru-KZ-content-layer.test.mjs")));
  assert.ok(fs.existsSync(path.join(ROOT, "utils/learning-content-ru-KZ")));
  // Public path / selector wiring must not be authored in this layer.
  assert.equal(fs.existsSync(path.join(ROOT, "locales", LOCALE, "registry.json")), false);

  // Sibling Russian country display layers may coexist after group wiring;
  // they must not carry Kazakhstan currency wording.
  for (const sibling of ["ru-UZ", "ru-KG", "ru-BY"]) {
    const siblingMath = path.join(ROOT, "utils", `learning-content-${sibling}`, "math.js");
    if (!fs.existsSync(siblingMath)) continue;
    const blob = fs.readFileSync(siblingMath, "utf8");
    assert.doesNotMatch(blob, /CURRENCY_RU_KZ|tengeWord|тиын/, sibling);
  }

  const ruRuMath = fs.readFileSync(path.join(ROOT, "utils/learning-content-ru-RU/math.js"), "utf8");
  assert.match(ruRuMath, /рубль/);
  assert.match(ruRuMath, /копейка/);
});
