/**
 * Wave-5 country wiring: Canada-fr (fr-CA), Mozambique (pt-MZ),
 * Kenya (en-KE), Switzerland-de (de-CH).
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
import { reportPackCopyForLocale } from "../../lib/reports/report-pack-copy.js";

const COUNTRIES = [
  {
    id: "fr-CA",
    prefix: "ca-fr",
    label: "Canada-fr",
    chain: ["fr-CA", "fr-FR", "en"],
    grade1: "1re année",
    grade6: "6e année",
    namespaces: 8,
  },
  {
    id: "pt-MZ",
    prefix: "mz",
    label: "Mozambique",
    chain: ["pt-MZ", "pt-PT", "pt-BR", "en"],
    grade1: "1.ª classe",
    grade6: "6.ª classe",
    namespaces: 9,
  },
  {
    id: "en-KE",
    prefix: "ke",
    label: "Kenya",
    chain: ["en-KE", "en"],
    grade1: "Grade 1",
    grade6: "Grade 6",
    namespaces: 12,
  },
  {
    id: "de-CH",
    prefix: "ch-de",
    label: "Switzerland-de",
    chain: ["de-CH", "de-DE", "en"],
    grade1: "1. Klasse",
    grade6: "6. Klasse",
    namespaces: 11,
  },
];

test("selector count is 51 and includes wave-5 countries once each", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 51);
  for (const c of COUNTRIES) {
    const hits = locales.filter((l) => l.id === c.id);
    assert.equal(hits.length, 1, c.id);
    assert.equal(hits[0].label, c.label);
    assert.equal(hits[0].nativeName, c.label);
    assert.equal(hits[0].pathPrefix, c.prefix);
    assert.equal(locales.filter((l) => l.pathPrefix === c.prefix).length, 1);
  }
  const caEn = locales.find((l) => l.id === "en-CA");
  assert.ok(caEn);
  assert.equal(caEn.label, "Canada-en");
  assert.equal(caEn.pathPrefix, "ca");
  const caFr = locales.find((l) => l.id === "fr-CA");
  assert.ok(caFr);
  assert.equal(caFr.label, "Canada-fr");
  assert.equal(caFr.pathPrefix, "ca-fr");
  assert.equal(locales.filter((l) => l.label === "Canada").length, 0);
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

test("Canada dual-language paths stay isolated", () => {
  assert.equal(resolveLocaleIdFromPathPrefix("ca"), "en-CA");
  assert.equal(resolveLocaleIdFromPathPrefix("ca-fr"), "fr-CA");
  assert.equal(stripLocaleFromPath("/ca/parents").locale, "en-CA");
  assert.equal(stripLocaleFromPath("/ca-fr/parents").locale, "fr-CA");
  assert.notEqual(withLocalePath("fr-CA", "/parents"), "/ca/parents");
  assert.notEqual(withLocalePath("en-CA", "/parents"), "/ca-fr/parents");
});

test("bare tags do not alias wave-5 countries", () => {
  assert.equal(resolveLocaleDefinition("fr").id, "en");
  assert.equal(resolveLocaleDefinition("pt").id, "en");
  assert.equal(resolveLocaleDefinition("en").id, "en");
  assert.equal(resolveLocaleDefinition("de").id, "en");
  assert.equal(resolveLocaleIdFromPathPrefix("fr"), "fr-FR");
  assert.equal(resolveLocaleIdFromPathPrefix("pt"), "pt-PT");
  assert.equal(resolveLocaleIdFromPathPrefix("de"), "de-DE");
  assert.notEqual(resolveLocaleIdFromPathPrefix("ca"), "fr-CA");
  assert.notEqual(resolveLocaleIdFromPathPrefix("ch"), "de-CH");
  assert.equal(resolveLocaleIdFromPathPrefix("mz"), "pt-MZ");
  assert.equal(resolveLocaleIdFromPathPrefix("ke"), "en-KE");
  assert.equal(resolveLocaleIdFromPathPrefix("ch-de"), "de-CH");
});

test("wave-5 namespace deep merge and grade labels", async () => {
  resetLocaleBundleCache();
  const fs = await import("node:fs");
  const path = await import("node:path");
  const expectedNs = {
    "fr-CA": [
      "common",
      "learning",
      "worksheets",
      "seo",
      "school",
      "ui",
      "auth",
      "validation",
    ],
    "pt-MZ": [
      "common",
      "learning",
      "ui",
      "worksheets",
      "school",
      "validation",
      "seo",
      "auth",
      "reports",
    ],
    "en-KE": [
      "common",
      "learning",
      "worksheets",
      "school",
      "seo",
      "auth",
      "ui",
      "reports",
      "teacher",
      "platform",
      "validation",
      "copilot",
    ],
    "de-CH": [
      "common",
      "ui",
      "seo",
      "learning",
      "worksheets",
      "school",
      "reports",
      "games",
      "copilot",
      "auth",
      "legal",
    ],
  };
  for (const c of COUNTRIES) {
    const bundles = loadLocaleBundles(c.id);
    assert.equal(lookupMessage(bundles, "common.grade1"), c.grade1, c.id);
    assert.equal(lookupMessage(bundles, "common.grade6"), c.grade6, c.id);
    const nsFiles = expectedNs[c.id];
    assert.equal(nsFiles.length, c.namespaces, c.id);
    for (const ns of nsFiles) {
      assert.ok(
        fs.existsSync(path.join(process.cwd(), "locales", c.id, `${ns}.json`)),
        `${c.id}/${ns}.json`
      );
    }
    assert.ok(bundles.common && typeof bundles.common === "object");
    assert.ok(bundles.learning && typeof bundles.learning === "object");
  }
  // Leaf overrides win; unmodified siblings inherit.
  const ke = loadLocaleBundles("en-KE");
  assert.equal(lookupMessage(ke, "common.subjectMath"), "Maths");
  const ch = loadLocaleBundles("de-CH");
  assert.equal(lookupMessage(ch, "common.close"), "Schliessen");
});

test("wave-5 content packs catalog + deep merge", () => {
  assert.ok(Object.keys(CONTENT_PACK_CATALOG["fr-CA"] || {}).length >= 10);
  assert.ok(Object.keys(CONTENT_PACK_CATALOG["pt-MZ"] || {}).length >= 15);
  assert.ok(Object.keys(CONTENT_PACK_CATALOG["en-KE"] || {}).length >= 10);
  assert.ok(Object.keys(CONTENT_PACK_CATALOG["de-CH"] || {}).length >= 10);
  assert.ok(getCatalogPackExact("fr-CA", "books/ui.json"));
  assert.ok(getCatalogPackExact("pt-MZ", "reports/burn-down-index.json"));
  assert.ok(getCatalogPackExact("en-KE", "demo/ui.json"));
  assert.ok(getCatalogPackExact("de-CH", "rewards/ui.json"));

  assert.ok(loadContentPack("fr-CA", "demo", "ui.json"));
  assert.ok(loadContentPack("pt-MZ", "books", "ui.json"));
  assert.ok(loadContentPack("en-KE", "reports", "burn-down-index.json"));
  assert.ok(loadContentPack("de-CH", "learning", "diagnostic-labels.json"));
});

test("wave-5 Help resolution and inheritance", () => {
  assert.equal(resolveHelpLocale("fr-CA"), "fr-CA");
  assert.equal(resolveHelpLocale("pt-MZ"), "pt-MZ");
  assert.equal(resolveHelpLocale("en-KE"), "en-KE");
  assert.equal(resolveHelpLocale("de-CH"), "de-CH");
  assert.ok(listArticles("parents", "fr-CA").length > 0);
  assert.ok(listArticles("parents", "pt-MZ").length > 0);
  assert.ok(listArticles("parents", "en-KE").length > 0);
  assert.ok(listArticles("parents", "de-CH").length > 0);
});

test("wave-5 word meanings inherit language base (no empty packs)", () => {
  const sampleCat = "animals";
  const word = Object.keys(WORD_MEANINGS_PT_PT[sampleCat] || {})[0] || "dog";
  assert.equal(
    resolveEnglishWordMeaning(word, { listKey: sampleCat, instructionLocale: "pt-MZ" }),
    WORD_MEANINGS_PT_PT[sampleCat][word] ||
      resolveEnglishWordMeaning(word, { listKey: sampleCat, instructionLocale: "pt-PT" })
  );
  assert.equal(
    resolveEnglishWordMeaning(word, { listKey: sampleCat, instructionLocale: "en-KE" }),
    word
  );
  const frWord = Object.keys(WORD_MEANINGS_FR_FR[sampleCat] || {})[0] || word;
  assert.equal(
    resolveEnglishWordMeaning(frWord, { listKey: sampleCat, instructionLocale: "fr-CA" }),
    WORD_MEANINGS_FR_FR[sampleCat][frWord]
  );
  const deWord = Object.keys(WORD_MEANINGS_DE_DE[sampleCat] || {})[0] || word;
  assert.equal(
    resolveEnglishWordMeaning(deWord, { listKey: sampleCat, instructionLocale: "de-CH" }),
    WORD_MEANINGS_DE_DE[sampleCat][deWord]
  );
});

test("wave-5 Math/Geometry/Science through localizeLearningQuestion", () => {
  const mzMoney = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "pt-MZ" }
  );
  const mzMoneyText = String(mzMoney.question || mzMoney.stem || "");
  assert.match(mzMoneyText, /euro|€|Quanto|dinheiro|sobrou/i);

  const caGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "fr-CA" }
  );
  const caGeoText = String(caGeo.question || caGeo.stem || "");
  assert.match(caGeoText, /cercle|rayon|aire/i);

  const chGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_perimeter", radius: 5 } },
    { subject: "geometry", contentLocale: "de-CH" }
  );
  const chGeoText = String(chGeo.question || chGeo.stem || "");
  assert.match(chGeoText, /Kreis|Radius|Umfang/i);
  assert.match(chGeoText, /Wie gross/i);
  assert.doesNotMatch(chGeoText, /ß|groß/i);

  const deGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_perimeter", radius: 5 } },
    { subject: "geometry", contentLocale: "de-DE" }
  );
  const deGeoText = String(deGeo.question || deGeo.stem || "");
  assert.match(deGeoText, /groß|Umfang/i);
  assert.notEqual(chGeoText, deGeoText);

  const keMath = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "en-KE" }
  );
  const keText = String(keMath.question || keMath.stem || "");
  assert.match(keText, /money|dollar|\$|How/i);

  const mzSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "pt-MZ" }
  );
  const ptSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "pt-PT" }
  );
  assert.equal(String(mzSci.stem || mzSci.question || ""), String(ptSci.stem || ptSci.question || ""));

  const chSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "de-CH" }
  );
  const deSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "de-DE" }
  );
  assert.equal(String(chSci.stem || chSci.question || ""), String(deSci.stem || deSci.question || ""));
});

test("wave-5 learning books fall back to language base dirs", () => {
  assert.equal(
    resolveLearningBookDraftsDir("fr-CA", "math", "g1"),
    "docs/learning-book/fr-FR/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("pt-MZ", "math", "g1"),
    "docs/learning-book/pt-PT/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("en-KE", "math", "g1"),
    "docs/learning-book/en/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("de-CH", "math", "g1"),
    "docs/learning-book/de-DE/math/g1/drafts"
  );
});

test("wave-5 writing packs inherit language base titles", () => {
  const mz = resolveWritingWordPacks("pt-MZ");
  const pt = resolveWritingWordPacks("pt-PT");
  assert.equal(mz.colors.title, pt.colors.title);
  const ke = resolveWritingWordPacks("en-KE");
  assert.equal(ke.colors.title, "Colors");
  const ca = resolveWritingWordPacks("fr-CA");
  const fr = resolveWritingWordPacks("fr-FR");
  assert.equal(ca.animals.title, fr.animals.title);
  const ch = resolveWritingWordPacks("de-CH");
  const de = resolveWritingWordPacks("de-DE");
  assert.equal(ch.food.title, de.food.title);
});

test("wave-5 report-pack merge samples", () => {
  const mzGrade = reportPackCopyForLocale(
    "pt-MZ",
    "components__parent-report-detailed-surface",
    "grade"
  );
  assert.equal(mzGrade, "Classe");

  const keGrade = reportPackCopyForLocale(
    "en-KE",
    "components__parent-report-detailed-surface",
    "grade"
  );
  assert.equal(keGrade, "Grade");
  assert.doesNotMatch(String(keGrade), /Primary class/i);

  const caGrade = reportPackCopyForLocale(
    "fr-CA",
    "components__parent-report-detailed-surface",
    "grade"
  );
  assert.equal(caGrade, "Année");

  const chGrade = reportPackCopyForLocale(
    "de-CH",
    "components__parent-report-detailed-surface",
    "grade"
  );
  assert.equal(chGrade, "Klasse");
  assert.doesNotMatch(String(chGrade), /Schulstufe/i);
});

test("existing base locales remain enabled after wave-5 wiring", () => {
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
    "en-CA",
    "pt-AO",
    "fr-CI",
    "de-AT",
    "en-NG",
  ]) {
    assert.equal(resolveProductContentLocale({ contentLocale: id }), id, id);
  }
});
