/**
 * Wave-6 country wiring: Belgium-nl (nl-BE), Belgium-fr (fr-BE),
 * Switzerland-fr (fr-CH), Switzerland-it (it-CH).
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
import { resolveHelpLocale, listArticles, getArticle } from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WORD_MEANINGS_NL_NL } from "../../data/english-questions/word-meanings/nl-NL.js";
import { WORD_MEANINGS_FR_FR } from "../../data/english-questions/word-meanings/fr-FR.js";
import { WORD_MEANINGS_IT_IT } from "../../data/english-questions/word-meanings/it-IT.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";
import { reportPackCopyForLocale } from "../../lib/reports/report-pack-copy.js";

const COUNTRIES = [
  {
    id: "nl-BE",
    prefix: "be-nl",
    label: "Belgium-nl",
    chain: ["nl-BE", "nl-NL", "en"],
    grade1: "1ste leerjaar",
    grade6: "6de leerjaar",
    namespaces: 8,
  },
  {
    id: "fr-BE",
    prefix: "be-fr",
    label: "Belgium-fr",
    chain: ["fr-BE", "fr-FR", "en"],
    grade1: "1re primaire",
    grade6: "6e primaire",
    namespaces: 8,
  },
  {
    id: "fr-CH",
    prefix: "ch-fr",
    label: "Switzerland-fr",
    chain: ["fr-CH", "fr-FR", "en"],
    grade1: "3P",
    grade6: "8P",
    namespaces: 8,
  },
  {
    id: "it-CH",
    prefix: "ch-it",
    label: "Switzerland-it",
    chain: ["it-CH", "it-IT", "en"],
    grade1: "1ª elementare",
    grade6: "1ª media",
    namespaces: 8,
  },
];

test("selector count is 55 and includes wave-6 countries once each", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 55);
  for (const c of COUNTRIES) {
    const hits = locales.filter((l) => l.id === c.id);
    assert.equal(hits.length, 1, c.id);
    assert.equal(hits[0].label, c.label);
    assert.equal(hits[0].nativeName, c.label);
    assert.equal(hits[0].pathPrefix, c.prefix);
    assert.equal(locales.filter((l) => l.pathPrefix === c.prefix).length, 1);
  }
  assert.equal(locales.filter((l) => l.label === "Belgium").length, 0);
  assert.equal(locales.filter((l) => l.label === "Switzerland").length, 0);
  const ids = locales.map((l) => l.id);
  assert.equal(new Set(ids).size, ids.length);
  const prefixes = locales.map((l) => l.pathPrefix);
  assert.equal(new Set(prefixes).size, prefixes.length);
  const labels = locales.map((l) => l.label);
  assert.equal(new Set(labels).size, labels.length);
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

test("Belgium dual-language paths stay isolated", () => {
  assert.equal(resolveLocaleIdFromPathPrefix("be-nl"), "nl-BE");
  assert.equal(resolveLocaleIdFromPathPrefix("be-fr"), "fr-BE");
  assert.equal(stripLocaleFromPath("/be-nl/parents").locale, "nl-BE");
  assert.equal(stripLocaleFromPath("/be-fr/parents").locale, "fr-BE");
  assert.notEqual(withLocalePath("nl-BE", "/parents"), "/be-fr/parents");
  assert.notEqual(withLocalePath("fr-BE", "/parents"), "/be-nl/parents");
  assert.notEqual(getLocaleFallbackChain("nl-BE")[1], "fr-BE");
  assert.notEqual(getLocaleFallbackChain("fr-BE")[1], "nl-BE");
});

test("Switzerland triple-language paths stay isolated", () => {
  assert.equal(resolveLocaleIdFromPathPrefix("ch-de"), "de-CH");
  assert.equal(resolveLocaleIdFromPathPrefix("ch-fr"), "fr-CH");
  assert.equal(resolveLocaleIdFromPathPrefix("ch-it"), "it-CH");
  assert.equal(stripLocaleFromPath("/ch-de/parents").locale, "de-CH");
  assert.equal(stripLocaleFromPath("/ch-fr/parents").locale, "fr-CH");
  assert.equal(stripLocaleFromPath("/ch-it/parents").locale, "it-CH");
  assert.equal(LOCALE_REGISTRY["de-CH"].pathPrefix, "ch-de");
  assert.equal(LOCALE_REGISTRY["de-CH"].label, "Switzerland-de");
  assert.notEqual(getLocaleFallbackChain("fr-CH")[1], "de-CH");
  assert.notEqual(getLocaleFallbackChain("fr-CH")[1], "it-CH");
  assert.notEqual(getLocaleFallbackChain("it-CH")[1], "de-CH");
  assert.notEqual(getLocaleFallbackChain("it-CH")[1], "fr-CH");
});

test("bare tags do not alias wave-6 countries", () => {
  assert.equal(resolveLocaleDefinition("nl").id, "en");
  assert.equal(resolveLocaleDefinition("fr").id, "en");
  assert.equal(resolveLocaleDefinition("it").id, "en");
  assert.equal(resolveLocaleIdFromPathPrefix("nl"), "nl-NL");
  assert.equal(resolveLocaleIdFromPathPrefix("fr"), "fr-FR");
  assert.equal(resolveLocaleIdFromPathPrefix("it"), "it-IT");
  assert.equal(resolveLocaleIdFromPathPrefix("be"), null);
  assert.equal(resolveLocaleIdFromPathPrefix("ch"), null);
  assert.notEqual(resolveLocaleIdFromPathPrefix("nl"), "nl-BE");
  assert.notEqual(resolveLocaleIdFromPathPrefix("fr"), "fr-BE");
  assert.notEqual(resolveLocaleIdFromPathPrefix("fr"), "fr-CH");
  assert.notEqual(resolveLocaleIdFromPathPrefix("it"), "it-CH");
});

test("wave-6 namespace deep merge and grade labels", async () => {
  resetLocaleBundleCache();
  const fs = await import("node:fs");
  const path = await import("node:path");
  const expectedNs = {
    "nl-BE": [
      "common",
      "learning",
      "school",
      "seo",
      "ui",
      "worksheets",
      "validation",
      "reports",
    ],
    "fr-BE": [
      "auth",
      "common",
      "learning",
      "school",
      "seo",
      "ui",
      "validation",
      "worksheets",
    ],
    "fr-CH": [
      "common",
      "learning",
      "worksheets",
      "school",
      "seo",
      "ui",
      "validation",
      "auth",
    ],
    "it-CH": [
      "common",
      "learning",
      "worksheets",
      "seo",
      "school",
      "ui",
      "auth",
      "validation",
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
  }
  assert.equal(lookupMessage(loadLocaleBundles("nl-BE"), "worksheets.gradeField"), "Leerjaar");
  assert.equal(
    lookupMessage(loadLocaleBundles("nl-BE"), "worksheets.gradeFilterAll"),
    "Alle leerjaren"
  );
  assert.equal(lookupMessage(loadLocaleBundles("fr-BE"), "worksheets.gradeField"), "Année");
  assert.equal(
    lookupMessage(loadLocaleBundles("fr-BE"), "worksheets.gradeFilterAll"),
    "Toutes les années du primaire"
  );
  assert.equal(lookupMessage(loadLocaleBundles("fr-CH"), "worksheets.gradeField"), "Année");
  assert.equal(
    lookupMessage(loadLocaleBundles("fr-CH"), "worksheets.gradeFilterAll"),
    "Toutes les années"
  );
  assert.match(lookupMessage(loadLocaleBundles("it-CH"), "worksheets.createHint"), /classe/i);
});

test("wave-6 content packs catalog + deep merge", () => {
  assert.equal(Object.keys(CONTENT_PACK_CATALOG["nl-BE"] || {}).length, 23);
  assert.equal(Object.keys(CONTENT_PACK_CATALOG["fr-BE"] || {}).length, 17);
  assert.equal(Object.keys(CONTENT_PACK_CATALOG["fr-CH"] || {}).length, 17);
  assert.equal(Object.keys(CONTENT_PACK_CATALOG["it-CH"] || {}).length, 16);
  assert.ok(getCatalogPackExact("nl-BE", "books/ui.json"));
  assert.ok(getCatalogPackExact("fr-BE", "reports/burn-down-index.json"));
  assert.ok(getCatalogPackExact("fr-CH", "demo/ui.json"));
  assert.ok(getCatalogPackExact("it-CH", "rewards/ui.json"));
  assert.ok(loadContentPack("nl-BE", "demo", "ui.json"));
  assert.ok(loadContentPack("fr-BE", "books", "ui.json"));
  assert.ok(loadContentPack("fr-CH", "reports", "burn-down-index.json"));
  assert.ok(loadContentPack("it-CH", "reports", "burn-down-index.json"));
});

test("wave-6 Help resolution and inheritance", () => {
  assert.equal(resolveHelpLocale("nl-BE"), "nl-BE");
  assert.equal(resolveHelpLocale("fr-BE"), "fr-BE");
  assert.equal(resolveHelpLocale("fr-CH"), "fr-CH");
  assert.equal(resolveHelpLocale("it-CH"), "it-CH");
  assert.equal(resolveHelpLocale("nl"), "nl-NL");
  assert.equal(resolveHelpLocale("fr"), "fr-FR");
  assert.equal(resolveHelpLocale("it"), "it-IT");
  for (const section of ["parents", "students", "subjects", "parent-report"]) {
    assert.ok(listArticles(section, "nl-BE").length > 0, `nl-BE ${section}`);
    assert.ok(listArticles(section, "fr-BE").length > 0, `fr-BE ${section}`);
    assert.ok(listArticles(section, "fr-CH").length > 0, `fr-CH ${section}`);
    assert.ok(listArticles(section, "it-CH").length > 0, `it-CH ${section}`);
  }
  const nlParents = listArticles("parents", "nl-BE");
  const nlBase = listArticles("parents", "nl-NL");
  assert.equal(nlParents.length, nlBase.length);
  assert.ok(getArticle("parents", nlParents[0].slug, "nl-BE"));
});

test("wave-6 word meanings inherit language base (no empty packs)", () => {
  const sampleCat = "animals";
  const nlWord = Object.keys(WORD_MEANINGS_NL_NL[sampleCat] || {})[0] || "dog";
  assert.equal(
    resolveEnglishWordMeaning(nlWord, { listKey: sampleCat, instructionLocale: "nl-BE" }),
    WORD_MEANINGS_NL_NL[sampleCat][nlWord]
  );
  const frWord = Object.keys(WORD_MEANINGS_FR_FR[sampleCat] || {})[0] || nlWord;
  assert.equal(
    resolveEnglishWordMeaning(frWord, { listKey: sampleCat, instructionLocale: "fr-BE" }),
    WORD_MEANINGS_FR_FR[sampleCat][frWord]
  );
  assert.equal(
    resolveEnglishWordMeaning(frWord, { listKey: sampleCat, instructionLocale: "fr-CH" }),
    WORD_MEANINGS_FR_FR[sampleCat][frWord]
  );
  const itWord = Object.keys(WORD_MEANINGS_IT_IT[sampleCat] || {})[0] || nlWord;
  assert.equal(
    resolveEnglishWordMeaning(itWord, { listKey: sampleCat, instructionLocale: "it-CH" }),
    WORD_MEANINGS_IT_IT[sampleCat][itWord]
  );
  // No cross-language sibling meanings.
  assert.notEqual(
    resolveEnglishWordMeaning(frWord, { listKey: sampleCat, instructionLocale: "fr-CH" }),
    resolveEnglishWordMeaning(frWord, { listKey: sampleCat, instructionLocale: "de-CH" })
  );
});

test("wave-6 Math/Geometry/Science through localizeLearningQuestion", () => {
  const beNlGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "nl-BE" }
  );
  const nlGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "nl-NL" }
  );
  assert.equal(
    String(beNlGeo.question || beNlGeo.stem || ""),
    String(nlGeo.question || nlGeo.stem || "")
  );

  const beFrGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "fr-BE" }
  );
  const frGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "fr-FR" }
  );
  assert.equal(
    String(beFrGeo.question || beFrGeo.stem || ""),
    String(frGeo.question || frGeo.stem || "")
  );
  assert.match(String(beFrGeo.question || beFrGeo.stem || ""), /cercle|rayon|aire/i);

  const chFrGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "fr-CH" }
  );
  assert.equal(
    String(chFrGeo.question || chFrGeo.stem || ""),
    String(frGeo.question || frGeo.stem || "")
  );

  const chItGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "it-CH" }
  );
  const itGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "it-IT" }
  );
  assert.equal(
    String(chItGeo.question || chItGeo.stem || ""),
    String(itGeo.question || itGeo.stem || "")
  );

  const beNlSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "nl-BE" }
  );
  const nlSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "nl-NL" }
  );
  assert.equal(
    String(beNlSci.stem || beNlSci.question || ""),
    String(nlSci.stem || nlSci.question || "")
  );

  const chFrSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "fr-CH" }
  );
  const frSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "fr-FR" }
  );
  assert.equal(
    String(chFrSci.stem || chFrSci.question || ""),
    String(frSci.stem || frSci.question || "")
  );

  const chItSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "it-CH" }
  );
  const itSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "it-IT" }
  );
  assert.equal(
    String(chItSci.stem || chItSci.question || ""),
    String(itSci.stem || itSci.question || "")
  );
});

test("wave-6 learning books fall back to language base dirs", () => {
  assert.equal(
    resolveLearningBookDraftsDir("nl-BE", "math", "g1"),
    "docs/learning-book/nl-NL/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("fr-BE", "math", "g1"),
    "docs/learning-book/fr-FR/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("fr-CH", "math", "g1"),
    "docs/learning-book/fr-FR/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("it-CH", "math", "g1"),
    "docs/learning-book/it-IT/math/g1/drafts"
  );
});

test("wave-6 writing packs inherit language base titles", () => {
  const beNl = resolveWritingWordPacks("nl-BE");
  const nl = resolveWritingWordPacks("nl-NL");
  assert.equal(beNl.colors.title, nl.colors.title);
  const beFr = resolveWritingWordPacks("fr-BE");
  const fr = resolveWritingWordPacks("fr-FR");
  assert.equal(beFr.animals.title, fr.animals.title);
  const chFr = resolveWritingWordPacks("fr-CH");
  assert.equal(chFr.animals.title, fr.animals.title);
  const chIt = resolveWritingWordPacks("it-CH");
  const it = resolveWritingWordPacks("it-IT");
  assert.equal(chIt.food.title, it.food.title);
});

test("wave-6 report-pack merge samples", () => {
  assert.equal(
    reportPackCopyForLocale("nl-BE", "components__parent-report-detailed-surface", "grade"),
    "Leerjaar"
  );
  assert.equal(
    reportPackCopyForLocale("fr-BE", "components__parent-report-detailed-surface", "grade"),
    "Année"
  );
  assert.equal(
    reportPackCopyForLocale("fr-CH", "components__parent-report-detailed-surface", "grade"),
    "Année"
  );
  assert.equal(
    reportPackCopyForLocale("it-CH", "components__parent-report-detailed-surface", "grade"),
    "Classe"
  );
});

test("existing base locales remain enabled after wave-6 wiring", () => {
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
    "fr-CA",
    "pt-AO",
    "pt-MZ",
    "fr-CI",
    "de-AT",
    "de-CH",
    "en-NG",
    "en-KE",
  ]) {
    assert.equal(resolveProductContentLocale({ contentLocale: id }), id, id);
  }
});
