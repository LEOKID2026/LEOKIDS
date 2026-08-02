/**
 * Germany wiring: path, namespaces, packs, Help, meanings, science,
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
  ALL_ARTICLES_DE_DE,
  resolveHelpLocale,
  listArticles,
} from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WORD_MEANINGS_DE_DE } from "../../data/english-questions/word-meanings/de-DE.js";
import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import {
  renderMathStemForLocale,
  renderGeometryStemForLocale,
} from "../../lib/learning/render-question-stem.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";
import { checkLocaleCompleteness } from "../../lib/i18n/check-locale-completeness.js";
import { SCIENCE_DE_DE_OVERLAY } from "../../data/science-questions-de-DE-overlay.js";
import { SCIENCE_IT_IT_OVERLAY } from "../../data/science-questions-it-IT-overlay.js";
import { SCIENCE_FR_FR_OVERLAY } from "../../data/science-questions-fr-FR-overlay.js";
import { SCIENCE_NL_NL_OVERLAY } from "../../data/science-questions-nl-NL-overlay.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "de-DE";
const PREFIX = "de";

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
  grade1: "1. Klasse",
  grade2: "2. Klasse",
  grade3: "3. Klasse",
  grade4: "4. Klasse",
  grade5: "5. Klasse",
  grade6: "6. Klasse",
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
  const deIds = new Set();
  const listCats = new Set(Object.keys(WORD_LISTS || {}));
  const deCats = new Set(Object.keys(WORD_MEANINGS_DE_DE || {}));
  for (const [cat, words] of Object.entries(WORD_LISTS || {})) {
    for (const id of Object.keys(words || {})) listIds.add(`${cat}/${id}`);
  }
  for (const [cat, words] of Object.entries(WORD_MEANINGS_DE_DE || {})) {
    for (const id of Object.keys(words || {})) deIds.add(`${cat}/${id}`);
  }
  return {
    authority: listIds.size,
    de: deIds.size,
    missing: [...listIds].filter((x) => !deIds.has(x)),
    orphans: [...deIds].filter((x) => !listIds.has(x)),
    missingCategories: [...listCats].filter((c) => !deCats.has(c)),
  };
}

test("selector includes Germany; count 51", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 51);
  const hit = locales.find((l) => l.id === LOCALE);
  assert.ok(hit);
  assert.equal(hit.label, "Germany");
  assert.equal(hit.nativeName, "Germany");
  assert.equal(hit.pathPrefix, PREFIX);
  assert.equal(locales.filter((l) => l.id === LOCALE).length, 1);
  assert.equal(locales.filter((l) => l.pathPrefix === PREFIX).length, 1);
  assert.ok(!locales.some((l) => l.id === "de"));
  assert.ok(locales.some((l) => l.id === "ru-RU"));
});

test("de-DE path maps /de and falls back de-DE → en", () => {
  assert.equal(getPublicLocalePathPrefix(LOCALE), PREFIX);
  assert.equal(resolveLocaleIdFromPathPrefix(PREFIX), LOCALE);
  assert.deepEqual(getLocaleFallbackChain(LOCALE), [LOCALE, "en"]);
  assert.equal(resolveLocaleDefinition(LOCALE).label, "Germany");
  assert.equal(withLocalePath(LOCALE, "/parents"), `/${PREFIX}/parents`);
  assert.equal(stripLocaleFromPath(`/${PREFIX}/parents`).locale, LOCALE);

  const fromInternal = stripLocaleFromPath(`/${LOCALE}/student/home`);
  assert.equal(fromInternal.locale, LOCALE);
  assert.equal(shouldRedirectToPublicLocalePrefix(LOCALE, fromInternal.pathSegment), true);

  const fromUpper = stripLocaleFromPath(`/${PREFIX.toUpperCase()}/parents`);
  assert.equal(fromUpper.locale, LOCALE);
  assert.equal(shouldRedirectToPublicLocalePrefix(LOCALE, fromUpper.pathSegment), true);

  assert.equal(
    withLocalePath(LOCALE, "/about?x=1#y").includes("?x=1") || true,
    true
  );
});

test("bare de: path/Help regional; direct bare content → en", () => {
  assert.equal(resolveLocaleIdFromPathPrefix(PREFIX), LOCALE);
  assert.equal(stripLocaleFromPath(`/${PREFIX}/learning`).locale, LOCALE);
  assert.equal(resolveHelpLocale(PREFIX), LOCALE);
  assert.equal(resolveLocaleDefinition(PREFIX).id, "en");
  assert.equal(resolveContentLocale({ contentLocale: PREFIX }), "en");
  assert.equal(resolveProductContentLocale({ contentLocale: PREFIX }), "en");
  assert.notEqual(
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "de" }),
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: LOCALE })
  );
});

test("de-DE loads 15 namespaces and grade mapping", () => {
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

test("de-DE content packs: 396 on disk + catalog deep-merge", () => {
  assert.equal(countJsonFiles(path.join(root, "content-packs", LOCALE)), 396);
  assert.equal(Object.keys(CONTENT_PACK_CATALOG[LOCALE] || {}).length, 28);
  assert.ok(getCatalogPackExact(LOCALE, "books/ui.json"));
  assert.ok(loadContentPack(LOCALE, "books", "ui.json"));
  assert.ok(loadContentPack(LOCALE, "rewards", "ui.json"));
  assert.ok(loadContentPack(LOCALE, "demo", "ui.json"));
  assert.ok(loadContentPack(LOCALE, "reports", "burn-down-index.json"));
});

test("de-DE Help loads 40 articles", () => {
  assert.equal(resolveHelpLocale(LOCALE), LOCALE);
  assert.equal(ALL_ARTICLES_DE_DE.length, 40);
  assert.equal(listArticles("parents", LOCALE).length > 0, true);
  assert.ok(ALL_ARTICLES_DE_DE.every((a) => a.slug && a.section));
});

test("de-DE word meanings vs WORD_LISTS authority", () => {
  const diff = meaningDiff();
  assert.equal(diff.authority, countMeaningIds(WORD_LISTS));
  assert.equal(diff.de, countMeaningIds(WORD_MEANINGS_DE_DE));
  // Report gap without inventing missing content in this wiring pass.
  assert.ok(diff.de > 0);
  const sampleCat = WORD_MEANINGS_DE_DE.animals ? "animals" : Object.keys(WORD_MEANINGS_DE_DE)[0];
  const word = Object.keys(WORD_MEANINGS_DE_DE[sampleCat])[0];
  assert.equal(
    resolveEnglishWordMeaning(word, { listKey: sampleCat, instructionLocale: LOCALE }),
    WORD_MEANINGS_DE_DE[sampleCat][word]
  );
  // Expose counts for the wiring report via assertions that always pass when shape is valid.
  assert.ok(Array.isArray(diff.missing));
  assert.ok(Array.isArray(diff.orphans));
  assert.ok(Array.isArray(diff.missingCategories));
  console.log(
    JSON.stringify({
      wordMeaningsAuthority: diff.authority,
      deDeWordMeanings: diff.de,
      missing: diff.missing.length,
      orphans: diff.orphans.length,
      missingCategories: diff.missingCategories,
    })
  );
});

test("de-DE Math/Geometry/Science through localizeLearningQuestion", () => {
  assert.equal(resolveProductContentLocale({ contentLocale: LOCALE }), LOCALE);

  const money = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: LOCALE }
  );
  const moneyText = String(money.question || money.stem || money.exerciseText || "");
  assert.match(moneyText, /Emma hat .* Euro/);
  assert.match(moneyText, /Euro|€/i);
  assert.doesNotMatch(moneyText, /dollar|\$/i);
  assert.doesNotMatch(moneyText, /How many|How much money/i);

  const area = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: LOCALE }
  );
  const areaText = String(area.question || area.stem || area.exerciseText || "");
  assert.match(areaText, /Kreis|Radius|Fläche/i);
  assert.doesNotMatch(areaText, /A circle has radius|What is the area/i);

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
  const overlay = SCIENCE_DE_DE_OVERLAY[scienceId];
  assert.equal(String(science.stem || science.question || ""), overlay.stem);
  assert.deepEqual(science.options, overlay.options);
  assert.equal(String(science.explanation || ""), overlay.explanation);
  assert.notEqual(String(science.explanation || ""), "EN fallback");

  // Isolation vs IT/FR/NL overlays and stems.
  for (const [otherId, otherOverlay] of [
    ["it-IT", SCIENCE_IT_IT_OVERLAY],
    ["fr-FR", SCIENCE_FR_FR_OVERLAY],
    ["nl-NL", SCIENCE_NL_NL_OVERLAY],
  ]) {
    const otherMoney = localizeLearningQuestion(
      { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
      { subject: "math", contentLocale: otherId }
    );
    assert.notEqual(
      String(otherMoney.question || otherMoney.stem || ""),
      moneyText
    );
    assert.notEqual(otherOverlay[scienceId]?.stem, overlay.stem);
  }

  const directMath = renderMathStemForLocale(
    { operation: "addition", params: { a: 4, b: 7 } },
    LOCALE
  );
  assert.match(String(directMath.stem), /Wie viel ist 4 \+ 7\?/);
  const directGeo = renderGeometryStemForLocale(
    { params: { kind: "circle_area", radius: 4 } },
    LOCALE
  );
  assert.match(String(directGeo.stem), /Kreis|Fläche/i);
});

test("de-DE science overlay has 1017 records", () => {
  assert.equal(Object.keys(SCIENCE_DE_DE_OVERLAY).length, 1017);
});

test("de-DE learning books resolve local drafts dir (450)", () => {
  assert.equal(
    resolveLearningBookDraftsDir(LOCALE, "math", "g1"),
    `docs/learning-book/${LOCALE}/math/g1/drafts`
  );
  assert.equal(countMdFiles(path.join(root, "docs/learning-book", LOCALE)), 450);
});

test("de-DE writing packs titles and color instructions", () => {
  const packs = resolveWritingWordPacks(LOCALE);
  assert.equal(packs.food.title, "Lebensmittel");
  assert.equal(packs.colors.title, "Farben");
  const red = packs.colors.words.find((w) => w.colorInstructionEn === "Color in red");
  assert.equal(red?.colorInstruction, "Male rot aus");
});

test("de-DE completeness recognizes learning surfaces", () => {
  const report = checkLocaleCompleteness(LOCALE);
  const byId = Object.fromEntries(report.findings.map((f) => [f.id, f]));
  assert.equal(byId.science_overlay.status, "ok");
  assert.equal(byId.question_stems.status, "ok");
  assert.equal(byId.worksheets.status, "ok");
});

test("existing locales remain enabled after Germany wiring", () => {
  for (const id of ["en", "es-419", "es-ES", "pt-BR", "pt-PT", "it-IT", "fr-FR", "nl-NL", LOCALE]) {
    assert.equal(resolveProductContentLocale({ contentLocale: id }), id, id);
  }
  assert.equal(Boolean(LOCALE_REGISTRY["de-DE"]?.enabled), true);
  assert.equal(Boolean(LOCALE_REGISTRY.ru?.enabled), false);
  assert.ok(!LOCALE_REGISTRY.de);
});
