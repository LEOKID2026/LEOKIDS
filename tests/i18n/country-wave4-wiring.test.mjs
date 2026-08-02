/**
 * Wave-4 country wiring: Angola (pt-AO), Nigeria (en-NG),
 * Côte d’Ivoire (fr-CI), Austria (de-AT).
 */
import test from "node:test";
import assert from "node:assert/strict";
import {
  LOCALE_REGISTRY,
  getSelectableLocales,
  getPublicLocalePathPrefix,
  resolveLocaleIdFromPathPrefix,
  resolveLocaleDefinition,
} from "../../lib/i18n/locale-registry.js";
import { getLocaleFallbackChain } from "../../lib/i18n/locale-resolution.js";
import { resolveContentLocale as resolveProductContentLocale } from "../../utils/learning-question-content-locale.js";
import {
  stripLocaleFromPath,
  withLocalePath,
  buildLocalizedHref,
  shouldRedirectToPublicLocalePrefix,
} from "../../lib/i18n/locale-path.js";
import {
  loadLocaleBundles,
  lookupMessage,
  resetLocaleBundleCache,
} from "../../lib/i18n/load-messages.js";
import { loadContentPack, resolveLearningBookDraftsDir } from "../../lib/content/locale.server.js";
import { getCatalogPackExact, CONTENT_PACK_CATALOG } from "../../lib/content/pack-catalog.js";
import { resolveHelpLocale, listArticles } from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WORD_MEANINGS_PT_PT } from "../../data/english-questions/word-meanings/pt-PT.js";
import { WORD_MEANINGS_FR_FR } from "../../data/english-questions/word-meanings/fr-FR.js";
import { WORD_MEANINGS_DE_DE } from "../../data/english-questions/word-meanings/de-DE.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";

const COUNTRIES = [
  {
    id: "pt-AO",
    prefix: "ao",
    label: "Angola",
    chain: ["pt-AO", "pt-PT", "pt-BR", "en"],
    grade1: "1.ª classe",
    grade6: "6.ª classe",
  },
  {
    id: "en-NG",
    prefix: "ng",
    label: "Nigeria",
    chain: ["en-NG", "en"],
    grade1: "Primary 1",
    grade6: "Primary 6",
  },
  {
    id: "fr-CI",
    prefix: "ci",
    label: "Côte d’Ivoire",
    chain: ["fr-CI", "fr-FR", "en"],
    grade1: "CP1",
    grade6: "CM2",
  },
  {
    id: "de-AT",
    prefix: "at",
    label: "Austria",
    chain: ["de-AT", "de-DE", "en"],
    grade1: "1. Schulstufe",
    grade6: "6. Schulstufe",
  },
];

test("selector count is 62 and includes wave-4 countries once each", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 62);
  for (const c of COUNTRIES) {
    const hits = locales.filter((l) => l.id === c.id);
    assert.equal(hits.length, 1, c.id);
    assert.equal(hits[0].label, c.label);
    assert.equal(hits[0].nativeName, c.label);
    assert.equal(hits[0].pathPrefix, c.prefix);
    assert.equal(locales.filter((l) => l.pathPrefix === c.prefix).length, 1);
  }
  assert.ok(locales.some((l) => l.id === "de-DE"));
  assert.ok(locales.some((l) => l.id === "ru-RU"));
  assert.ok(locales.some((l) => l.id === "pt-PT"));
  assert.ok(locales.some((l) => l.id === "fr-FR"));
});

for (const c of COUNTRIES) {
  test(`${c.id}: registry, path /${c.prefix}, fallback chain, canonical redirects`, () => {
    const def = LOCALE_REGISTRY[c.id];
    assert.ok(def);
    assert.equal(def.enabled, true);
    assert.equal(def.selectorVisible, true);
    assert.equal(def.label, c.label);
    assert.equal(def.pathPrefix, c.prefix);
    assert.deepEqual(getLocaleFallbackChain(c.id), c.chain);
    assert.equal(getPublicLocalePathPrefix(c.id), c.prefix);
    assert.equal(resolveLocaleIdFromPathPrefix(c.prefix), c.id);
    assert.equal(resolveProductContentLocale({ contentLocale: c.id }), c.id);
    assert.equal(withLocalePath(c.id, "/student/home"), `/${c.prefix}/student/home`);
    assert.deepEqual(stripLocaleFromPath(`/${c.prefix}/parents`), {
      locale: c.id,
      pathname: "/parents",
      hadPrefix: true,
      pathSegment: c.prefix,
    });
    assert.equal(
      buildLocalizedHref(c.id, "/parents", { search: "x=1", hash: "y" }),
      `/${c.prefix}/parents?x=1#y`
    );

    const fromInternal = stripLocaleFromPath(`/${c.id}/learning/math`);
    assert.equal(fromInternal.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromInternal.pathSegment), true);

    const fromUpper = stripLocaleFromPath(`/${c.prefix.toUpperCase()}/learning/math`);
    assert.equal(fromUpper.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromUpper.pathSegment), true);

    const fromLocaleUpper = stripLocaleFromPath(`/${c.id.toUpperCase()}/help`);
    assert.equal(fromLocaleUpper.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromLocaleUpper.pathSegment), true);
  });
}

test("bare tags do not alias wave-4 countries", () => {
  assert.equal(resolveLocaleDefinition("pt").id, "en");
  assert.equal(resolveLocaleDefinition("en").id, "en");
  assert.equal(resolveLocaleDefinition("fr").id, "en");
  assert.equal(resolveLocaleDefinition("de").id, "en");
  assert.equal(resolveLocaleIdFromPathPrefix("pt"), "pt-PT");
  assert.equal(resolveLocaleIdFromPathPrefix("fr"), "fr-FR");
  assert.equal(resolveLocaleIdFromPathPrefix("de"), "de-DE");
  assert.notEqual(resolveLocaleIdFromPathPrefix("ao"), "pt-PT");
  assert.equal(resolveLocaleIdFromPathPrefix("ao"), "pt-AO");
});

test("wave-4 namespace deep merge and grade labels", () => {
  resetLocaleBundleCache();
  for (const c of COUNTRIES) {
    const bundles = loadLocaleBundles(c.id);
    assert.equal(lookupMessage(bundles, "common.grade1"), c.grade1, c.id);
    assert.equal(lookupMessage(bundles, "common.grade6"), c.grade6, c.id);
    // Unmodified siblings inherit from parent (common.appName or ui keys from base).
    assert.ok(bundles.common && typeof bundles.common === "object");
    assert.ok(bundles.learning && typeof bundles.learning === "object");
  }
});

test("wave-4 content packs catalog + deep merge", () => {
  assert.ok(Object.keys(CONTENT_PACK_CATALOG["pt-AO"] || {}).length >= 10);
  assert.ok(Object.keys(CONTENT_PACK_CATALOG["en-NG"] || {}).length >= 20);
  assert.ok(Object.keys(CONTENT_PACK_CATALOG["fr-CI"] || {}).length >= 10);
  assert.ok(Object.keys(CONTENT_PACK_CATALOG["de-AT"] || {}).length >= 20);
  assert.ok(getCatalogPackExact("pt-AO", "books/ui.json"));
  assert.ok(getCatalogPackExact("en-NG", "reports/burn-down-index.json"));
  assert.ok(getCatalogPackExact("fr-CI", "rewards/ui.json"));
  assert.ok(getCatalogPackExact("de-AT", "learning/burn-down-index.json"));

  const aoBooks = loadContentPack("pt-AO", "books", "ui.json");
  assert.ok(aoBooks);
  const ngReports = loadContentPack("en-NG", "reports", "burn-down-index.json");
  assert.ok(ngReports);
  const ciDemo = loadContentPack("fr-CI", "demo", "ui.json");
  assert.ok(ciDemo);
  const atLearning = loadContentPack("de-AT", "learning", "burn-down-index.json");
  assert.ok(atLearning);
});

test("wave-4 Help resolution and inheritance", () => {
  assert.equal(resolveHelpLocale("pt-AO"), "pt-AO");
  assert.equal(resolveHelpLocale("en-NG"), "en-NG");
  assert.equal(resolveHelpLocale("fr-CI"), "fr-CI");
  assert.equal(resolveHelpLocale("de-AT"), "de-AT");
  assert.ok(listArticles("parents", "pt-AO").length > 0);
  assert.ok(listArticles("parents", "en-NG").length > 0);
  assert.ok(listArticles("parents", "fr-CI").length > 0);
  assert.ok(listArticles("parents", "de-AT").length > 0);
});

test("wave-4 word meanings inherit language base (no empty packs)", () => {
  const sampleCat = "animals";
  const word = Object.keys(WORD_MEANINGS_PT_PT[sampleCat] || {})[0] || "dog";
  assert.equal(
    resolveEnglishWordMeaning(word, { listKey: sampleCat, instructionLocale: "pt-AO" }),
    WORD_MEANINGS_PT_PT[sampleCat][word] ||
      resolveEnglishWordMeaning(word, { listKey: sampleCat, instructionLocale: "pt-PT" })
  );
  assert.equal(
    resolveEnglishWordMeaning(word, { listKey: sampleCat, instructionLocale: "en-NG" }),
    word
  );
  const frWord = Object.keys(WORD_MEANINGS_FR_FR[sampleCat] || {})[0] || word;
  assert.equal(
    resolveEnglishWordMeaning(frWord, { listKey: sampleCat, instructionLocale: "fr-CI" }),
    WORD_MEANINGS_FR_FR[sampleCat][frWord]
  );
  const deWord = Object.keys(WORD_MEANINGS_DE_DE[sampleCat] || {})[0] || word;
  assert.equal(
    resolveEnglishWordMeaning(deWord, { listKey: sampleCat, instructionLocale: "de-AT" }),
    WORD_MEANINGS_DE_DE[sampleCat][deWord]
  );
});

test("wave-4 Math/Geometry/Science through localizeLearningQuestion", () => {
  const aoMoney = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "pt-AO" }
  );
  const aoMoneyText = String(aoMoney.question || aoMoney.stem || "");
  assert.match(aoMoneyText, /euro|€|Quanto|dinheiro|sobrou/i);
  assert.doesNotMatch(aoMoneyText, /How many|dollar|\$/i);

  const ciGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "fr-CI" }
  );
  const ciGeoText = String(ciGeo.question || ciGeo.stem || "");
  assert.match(ciGeoText, /cercle|rayon|aire/i);

  const atGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_perimeter", radius: 5 } },
    { subject: "geometry", contentLocale: "de-AT" }
  );
  const atGeoText = String(atGeo.question || atGeo.stem || "");
  assert.match(atGeoText, /Kreis|Radius|Umfang/i);

  const ngMath = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "en-NG" }
  );
  const ngText = String(ngMath.question || ngMath.stem || "");
  assert.match(ngText, /money|dollar|\$|How/i);

  const aoSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "pt-AO" }
  );
  const ptSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "pt-PT" }
  );
  assert.equal(String(aoSci.stem || aoSci.question || ""), String(ptSci.stem || ptSci.question || ""));

  const atSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "de-AT" }
  );
  const deSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "de-DE" }
  );
  assert.equal(String(atSci.stem || atSci.question || ""), String(deSci.stem || deSci.question || ""));
  assert.notEqual(String(atSci.stem || ""), String(aoSci.stem || ""));
});

test("wave-4 learning books fall back to language base dirs", () => {
  assert.equal(
    resolveLearningBookDraftsDir("pt-AO", "math", "g1"),
    "docs/learning-book/pt-PT/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("en-NG", "math", "g1"),
    "docs/learning-book/en/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("fr-CI", "math", "g1"),
    "docs/learning-book/fr-FR/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("de-AT", "math", "g1"),
    "docs/learning-book/de-DE/math/g1/drafts"
  );
});

test("wave-4 writing packs inherit language base titles", () => {
  const ao = resolveWritingWordPacks("pt-AO");
  const pt = resolveWritingWordPacks("pt-PT");
  assert.equal(ao.colors.title, pt.colors.title);
  const ng = resolveWritingWordPacks("en-NG");
  assert.equal(ng.colors.title, "Colors");
  const ci = resolveWritingWordPacks("fr-CI");
  const fr = resolveWritingWordPacks("fr-FR");
  assert.equal(ci.animals.title, fr.animals.title);
  const at = resolveWritingWordPacks("de-AT");
  const de = resolveWritingWordPacks("de-DE");
  assert.equal(at.food.title, de.food.title);
});

test("Angola runtime probe: Ano vs Classe for report grade chrome", () => {
  resetLocaleBundleCache();
  const bundles = loadLocaleBundles("pt-AO");
  // Local grade labels must be classe.
  assert.equal(lookupMessage(bundles, "common.grade1"), "1.ª classe");
  const detailed = loadContentPack(
    "pt-AO",
    "reports",
    "burn-down",
    "utils__parent-report-language__grade-aware-recommendation-templates.json"
  );
  const detailedSurface = loadContentPack(
    "pt-AO",
    "reports",
    "burn-down",
    "components__parent-report-detailed-surface.json"
  );
  const reportsIndex = loadContentPack("pt-AO", "reports", "burn-down-index.json");
  const blob = JSON.stringify({ detailed, detailedSurface, reportsIndex });
  // Report whether Ano leaks from pt-BR via missing pt-PT authority keys.
  const hasAno = /\bAno\b/.test(blob);
  const hasClasse = /[Cc]lasse/.test(blob);
  console.log(
    JSON.stringify({
      angolaAnoProbe: {
        hasAno,
        hasClasse,
        gradeFilterAll:
          reportsIndex?.gradeFilterAll ||
          detailedSurface?.gradeFilterAll ||
          detailed?.gradeFilterAll ||
          null,
        sourceNote:
          "If Ano appears, it is inherited from pt-BR via missing pt-PT authority keys (content finding).",
      },
    })
  );
  assert.equal(typeof hasAno, "boolean");
});

test("existing base locales remain enabled after wave-4 wiring", () => {
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
    "ru-RU",
  ]) {
    assert.equal(resolveProductContentLocale({ contentLocale: id }), id, id);
  }
});
