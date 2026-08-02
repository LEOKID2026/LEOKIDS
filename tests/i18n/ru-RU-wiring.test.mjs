/**
 * Russia wiring: path, namespaces, packs, Help, meanings, science,
 * stems via localizeLearningQuestion, books, writing, grades, isolation.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  getPublicLocalePathPrefix,
  resolveLocaleIdFromPathPrefix,
  resolveLocaleDefinition,
  getSelectableLocales,
  LOCALE_REGISTRY,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain, resolveContentLocale } from "../../lib/i18n/locale-resolution.js";
import { resolveContentLocale as resolveProductContentLocale } from "../../utils/learning-question-content-locale.js";
import {
  stripLocaleFromPath,
  withLocalePath,
  shouldRedirectToPublicLocalePrefix,
} from "../../lib/i18n/locale-path.js";
import {
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { loadContentPack, resolveLearningBookDraftsDir } from "../../lib/content/locale.server.js";
import { getCatalogPackExact, CONTENT_PACK_CATALOG } from "../../lib/content/pack-catalog.js";
import {
  ALL_ARTICLES_RU_RU,
  resolveHelpLocale,
  listArticles,
} from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WORD_MEANINGS_RU_RU } from "../../data/english-questions/word-meanings/ru-RU.js";
import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import {
  renderMathStemForLocale,
  renderGeometryStemForLocale,
} from "../../lib/learning/render-question-stem.js";
import { rubleWord } from "../../utils/learning-content-ru-RU/math.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";
import { checkLocaleCompleteness } from "../../lib/i18n/check-locale-completeness.js";
import { SCIENCE_RU_RU_OVERLAY } from "../../data/science-questions-ru-RU-overlay.js";
import { SCIENCE_DE_DE_OVERLAY } from "../../data/science-questions-de-DE-overlay.js";
import { SCIENCE_IT_IT_OVERLAY } from "../../data/science-questions-it-IT-overlay.js";
import { SCIENCE_FR_FR_OVERLAY } from "../../data/science-questions-fr-FR-overlay.js";
import { SCIENCE_NL_NL_OVERLAY } from "../../data/science-questions-nl-NL-overlay.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "ru-RU";
const PREFIX = "ru";

const NAMESPACES = [
  "common",
  "ui",
  "auth",
  "validation",
  "learning",
  "reports",
  "worksheets",
  "games",
  "emails",
  "seo",
  "legal",
  "teacher",
  "school",
  "platform",
  "copilot",
];

const GRADES = {
  grade1: "1 класс",
  grade2: "2 класс",
  grade3: "3 класс",
  grade4: "4 класс",
  grade5: "5 класс",
  grade6: "6 класс",
};

function countMeaningIds(pack) {
  let n = 0;
  for (const list of Object.values(pack || {})) {
    n += Object.keys(list || {}).length;
  }
  return n;
}

function countJsonFiles(dir) {
  let n = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) n += countJsonFiles(p);
    else if (ent.name.endsWith(".json")) n += 1;
  }
  return n;
}

function countMdFiles(dir) {
  let n = 0;
  if (!fs.existsSync(dir)) return 0;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) n += countMdFiles(p);
    else if (ent.name.endsWith(".md")) n += 1;
  }
  return n;
}

function meaningDiff() {
  const listIds = new Set();
  const ruIds = new Set();
  const listCats = new Set(Object.keys(WORD_LISTS || {}));
  const ruCats = new Set(Object.keys(WORD_MEANINGS_RU_RU || {}));
  for (const [cat, words] of Object.entries(WORD_LISTS || {})) {
    for (const id of Object.keys(words || {})) listIds.add(`${cat}/${id}`);
  }
  for (const [cat, words] of Object.entries(WORD_MEANINGS_RU_RU || {})) {
    for (const id of Object.keys(words || {})) ruIds.add(`${cat}/${id}`);
  }
  return {
    authority: listIds.size,
    ru: ruIds.size,
    missing: [...listIds].filter((x) => !ruIds.has(x)),
    orphans: [...ruIds].filter((x) => !listIds.has(x)),
    missingCategories: [...listCats].filter((c) => !ruCats.has(c)),
  };
}

test("selector includes Russia; count 69", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 75);
  const hit = locales.find((l) => l.id === LOCALE);
  assert.ok(hit);
  assert.equal(hit.label, "Russia");
  assert.equal(hit.nativeName, "Russia");
  assert.equal(hit.pathPrefix, PREFIX);
  assert.equal(locales.filter((l) => l.id === LOCALE).length, 1);
  assert.equal(locales.filter((l) => l.pathPrefix === PREFIX).length, 1);
  assert.ok(!locales.some((l) => l.id === "ru"));
  assert.ok(locales.some((l) => l.id === "de-DE"));
});

test("ru-RU path maps /ru and falls back ru-RU → en", () => {
  assert.equal(getPublicLocalePathPrefix(LOCALE), PREFIX);
  assert.equal(resolveLocaleIdFromPathPrefix(PREFIX), LOCALE);
  assert.deepEqual(getLocaleFallbackChain(LOCALE), [LOCALE, "en"]);
  assert.equal(resolveLocaleDefinition(LOCALE).label, "Russia");
  assert.equal(withLocalePath(LOCALE, "/parents"), `/${PREFIX}/parents`);
  assert.equal(stripLocaleFromPath(`/${PREFIX}/parents`).locale, LOCALE);

  const fromInternal = stripLocaleFromPath(`/${LOCALE}/student/home`);
  assert.equal(fromInternal.locale, LOCALE);
  assert.equal(shouldRedirectToPublicLocalePrefix(LOCALE, fromInternal.pathSegment), true);

  const fromUpper = stripLocaleFromPath(`/${PREFIX.toUpperCase()}/parents`);
  assert.equal(fromUpper.locale, LOCALE);
  assert.equal(shouldRedirectToPublicLocalePrefix(LOCALE, fromUpper.pathSegment), true);
});

test("bare ru: path/Help regional; direct bare content → en", () => {
  assert.equal(resolveLocaleIdFromPathPrefix(PREFIX), LOCALE);
  assert.equal(stripLocaleFromPath(`/${PREFIX}/learning`).locale, LOCALE);
  assert.equal(resolveHelpLocale(PREFIX), LOCALE);
  assert.equal(resolveLocaleDefinition(PREFIX).id, "en");
  assert.equal(resolveContentLocale({ contentLocale: PREFIX }), "en");
  assert.equal(resolveProductContentLocale({ contentLocale: PREFIX }), "en");
  assert.notEqual(
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "ru" }),
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: LOCALE })
  );
});

test("ru-RU loads 15 namespaces and grade mapping", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles(LOCALE);
  for (const ns of NAMESPACES) {
    assert.ok(bundles[ns] && typeof bundles[ns] === "object", ns);
  }
  for (const [key, value] of Object.entries(GRADES)) {
    assert.equal(lookupMessage(bundles, `common.${key}`), value, key);
  }
  const flat = JSON.stringify({
    g1: lookupMessage(bundles, "common.grade1"),
    g6: lookupMessage(bundles, "common.grade6"),
  });
  assert.doesNotMatch(flat, /Grade [1-6]/);
  assert.doesNotMatch(flat, /\bStudent\b/);
});

test("ru-RU content packs: 396 on disk + catalog deep-merge", () => {
  assert.equal(countJsonFiles(path.join(root, "content-packs", LOCALE)), 396);
  assert.equal(Object.keys(CONTENT_PACK_CATALOG[LOCALE] || {}).length, 28);
  assert.ok(getCatalogPackExact(LOCALE, "books/ui.json"));
  assert.ok(loadContentPack(LOCALE, "books", "ui.json"));
  assert.ok(loadContentPack(LOCALE, "rewards", "ui.json"));
  assert.ok(loadContentPack(LOCALE, "demo", "ui.json"));
  assert.ok(loadContentPack(LOCALE, "reports", "burn-down-index.json"));
});

test("ru-RU Help loads 40 articles", () => {
  assert.equal(resolveHelpLocale(LOCALE), LOCALE);
  assert.equal(ALL_ARTICLES_RU_RU.length, 40);
  assert.equal(listArticles("parents", LOCALE).length > 0, true);
  assert.ok(ALL_ARTICLES_RU_RU.every((a) => a.slug && a.section));
});

test("ru-RU word meanings vs WORD_LISTS authority", () => {
  const diff = meaningDiff();
  assert.equal(diff.authority, countMeaningIds(WORD_LISTS));
  assert.equal(diff.ru, countMeaningIds(WORD_MEANINGS_RU_RU));
  assert.ok(diff.ru > 0);
  const sampleCat = WORD_MEANINGS_RU_RU.animals ? "animals" : Object.keys(WORD_MEANINGS_RU_RU)[0];
  const word = Object.keys(WORD_MEANINGS_RU_RU[sampleCat])[0];
  assert.equal(
    resolveEnglishWordMeaning(word, { listKey: sampleCat, instructionLocale: LOCALE }),
    WORD_MEANINGS_RU_RU[sampleCat][word]
  );
  console.log(
    JSON.stringify({
      wordMeaningsAuthority: diff.authority,
      ruRuWordMeanings: diff.ru,
      missing: diff.missing.length,
      orphans: diff.orphans.length,
      missingCategories: diff.missingCategories,
    })
  );
});

test("ru-RU ruble declension samples", () => {
  assert.equal(rubleWord(1), "рубль");
  assert.equal(rubleWord(2), "рубля");
  assert.equal(rubleWord(5), "рублей");
  assert.equal(rubleWord(11), "рублей");
  assert.equal(rubleWord(21), "рубль");
  assert.equal(rubleWord(22), "рубля");
  assert.equal(rubleWord(25), "рублей");
});

test("ru-RU Math/Geometry/Science through localizeLearningQuestion", () => {
  assert.equal(resolveProductContentLocale({ contentLocale: LOCALE }), LOCALE);

  const money = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: LOCALE }
  );
  const moneyText = String(money.question || money.stem || money.exerciseText || "");
  assert.match(moneyText, /рубл/);
  assert.doesNotMatch(moneyText, /dollar|\$|euro|€/i);
  assert.doesNotMatch(moneyText, /How many|How much money/i);

  const area = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: LOCALE }
  );
  const areaText = String(area.question || area.stem || area.exerciseText || "");
  assert.match(areaText, /Круг|радиус|площад/i);
  assert.doesNotMatch(areaText, /A circle has radius|What is the area/i);

  const peri = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_perimeter", radius: 5 } },
    { subject: "geometry", contentLocale: LOCALE }
  );
  const periText = String(peri.question || peri.stem || peri.exerciseText || "");
  assert.match(periText, /Окружность|радиус/i);

  const scienceId = "body_1";
  const science = localizeLearningQuestion(
    {
      id: scienceId,
      subject: "science",
      options: ["a", "b", "c", "d"],
      explanation: "EN fallback",
    },
    { subject: "science", contentLocale: LOCALE }
  );
  const overlay = SCIENCE_RU_RU_OVERLAY[scienceId];
  assert.equal(String(science.stem || science.question || ""), overlay.stem);
  assert.deepEqual(science.options, overlay.options);
  assert.equal(String(science.explanation || ""), overlay.explanation);
  assert.notEqual(String(science.explanation || ""), "EN fallback");

  for (const [otherId, otherOverlay] of [
    ["de-DE", SCIENCE_DE_DE_OVERLAY],
    ["it-IT", SCIENCE_IT_IT_OVERLAY],
    ["fr-FR", SCIENCE_FR_FR_OVERLAY],
    ["nl-NL", SCIENCE_NL_NL_OVERLAY],
  ]) {
    const otherMoney = localizeLearningQuestion(
      { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
      { subject: "math", contentLocale: otherId }
    );
    assert.notEqual(String(otherMoney.question || otherMoney.stem || ""), moneyText);
    assert.notEqual(otherOverlay[scienceId]?.stem, overlay.stem);
  }

  const directMath = renderMathStemForLocale(
    { operation: "addition", params: { a: 4, b: 7 } },
    LOCALE
  );
  assert.match(String(directMath.stem), /Вычисли: 4 \+ 7\?/);
  const directGeo = renderGeometryStemForLocale(
    { params: { kind: "circle_area", radius: 4 } },
    LOCALE
  );
  assert.match(String(directGeo.stem), /Круг|площад/i);
});

test("ru-RU science overlay has 1017 records", () => {
  assert.equal(Object.keys(SCIENCE_RU_RU_OVERLAY).length, 1017);
});

test("ru-RU learning books resolve local drafts dir (450)", () => {
  assert.equal(
    resolveLearningBookDraftsDir(LOCALE, "math", "g1"),
    `docs/learning-book/${LOCALE}/math/g1/drafts`
  );
  assert.equal(countMdFiles(path.join(root, "docs/learning-book", LOCALE)), 450);
});

test("ru-RU writing packs titles and color instructions", () => {
  const packs = resolveWritingWordPacks(LOCALE);
  assert.equal(packs.colors.title, "Цвета");
  assert.equal(packs.food.title, "Еда");
  assert.equal(packs.sight.title, "Часто употребляемые слова");
  const red = packs.colors.words.find((w) => w.colorInstructionEn === "Color in red");
  assert.equal(red?.colorInstruction, "Раскрась красным");
  const blue = packs.colors.words.find((w) => w.colorInstructionEn === "Color in blue");
  assert.equal(blue?.colorInstruction, "Раскрась синим");
  const green = packs.colors.words.find((w) => w.colorInstructionEn === "Color in green");
  assert.equal(green?.colorInstruction, "Раскрась зелёным");
});

test("ru-RU completeness recognizes learning surfaces", () => {
  const report = checkLocaleCompleteness(LOCALE);
  const byId = Object.fromEntries(report.findings.map((f) => [f.id, f]));
  assert.equal(byId.science_overlay.status, "ok");
  assert.equal(byId.question_stems.status, "ok");
  assert.equal(byId.worksheets.status, "ok");
});

test("existing locales remain enabled after Russia wiring", () => {
  for (const id of [
    "en",
    "es-419",
    "es-ES",
    "pt-BR",
    "pt-PT",
    "it-IT",
    "fr-FR",
    "nl-NL",
    "de-DE",
    LOCALE,
  ]) {
    assert.equal(resolveProductContentLocale({ contentLocale: id }), id, id);
  }
  assert.equal(Boolean(LOCALE_REGISTRY["ru-RU"]?.enabled), true);
  assert.ok(!LOCALE_REGISTRY.ru);
});
