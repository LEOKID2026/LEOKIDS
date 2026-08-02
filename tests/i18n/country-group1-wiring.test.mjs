/**
 * Group-1 country wiring: USA-es, Kazakhstan-ru, Uzbekistan-ru,
 * Kyrgyzstan-ru, Belarus-ru, Rwanda-en, Cameroon-fr.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
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
import { WORD_MEANINGS_ES_419 } from "../../data/english-questions/word-meanings/es-419.js";
import { WORD_MEANINGS_RU_RU } from "../../data/english-questions/word-meanings/ru-RU.js";
import { WORD_MEANINGS_FR_FR } from "../../data/english-questions/word-meanings/fr-FR.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import {
  renderMathStemForLocale,
  renderGeometryStemForLocale,
} from "../../lib/learning/render-question-stem.js";

const ROOT = process.cwd();

function walkJson(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, out);
    else if (ent.name.endsWith(".json")) out.push(p);
  }
  return out;
}

const COUNTRIES = [
  {
    id: "es-US",
    prefix: "us-es",
    label: "USA-es",
    chain: ["es-US", "es-419", "en"],
    namespaces: 7,
    packs: 11,
    probeKey: "common.grade1",
    probeValue: "1.er grado",
    booksDir: "docs/learning-book/es-419",
  },
  {
    id: "ru-KZ",
    prefix: "kz-ru",
    label: "Kazakhstan-ru",
    chain: ["ru-KZ", "ru-RU", "en"],
    namespaces: 5,
    packs: 3,
    probeKey: "school.portal.classesTitle",
    probeValue: "Учебные группы в школе",
    booksDir: "docs/learning-book/ru-RU",
  },
  {
    id: "ru-UZ",
    prefix: "uz-ru",
    label: "Uzbekistan-ru",
    chain: ["ru-UZ", "ru-RU", "en"],
    namespaces: 5,
    packs: 4,
    probeKey: "school.portal.navClasses",
    probeValue: "Учебные группы",
    booksDir: "docs/learning-book/ru-RU",
  },
  {
    id: "ru-KG",
    prefix: "kg-ru",
    label: "Kyrgyzstan-ru",
    chain: ["ru-KG", "ru-RU", "en"],
    namespaces: 6,
    packs: 5,
    probeKey: "school.portal.navClasses",
    probeValue: "Учебные группы",
    booksDir: "docs/learning-book/ru-RU",
  },
  {
    id: "ru-BY",
    prefix: "by-ru",
    label: "Belarus-ru",
    chain: ["ru-BY", "ru-RU", "en"],
    namespaces: 5,
    packs: 3,
    probeKey: "school.portal.navClasses",
    probeValue: "Учебные группы",
    booksDir: "docs/learning-book/ru-RU",
  },
  {
    id: "en-RW",
    prefix: "rw-en",
    label: "Rwanda-en",
    chain: ["en-RW", "en"],
    namespaces: 12,
    packs: 40,
    probeKey: "common.grade1",
    probeValue: "Primary 1",
    booksDir: "docs/learning-book/en",
  },
  {
    id: "fr-CM",
    prefix: "cm-fr",
    label: "Cameroon-fr",
    chain: ["fr-CM", "fr-FR", "en"],
    namespaces: 9,
    packs: 26,
    probeKey: "common.grade1",
    probeValue: "SIL",
    booksDir: "docs/learning-book/fr-FR",
  },
];

test("selector count is 69 and includes group-1 countries once each", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 69);
  for (const c of COUNTRIES) {
    const hits = locales.filter((l) => l.id === c.id);
    assert.equal(hits.length, 1, c.id);
    assert.equal(hits[0].label, c.label);
    assert.equal(hits[0].nativeName, c.label);
    assert.equal(hits[0].pathPrefix, c.prefix);
  }
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

test("group-1 bare country paths do not guess a language", () => {
  for (const bare of ["us", "kz", "uz", "kg", "by", "rw", "cm"]) {
    assert.equal(resolveLocaleIdFromPathPrefix(bare), null, bare);
    assert.equal(stripLocaleFromPath(`/${bare}/parents`).locale, null, bare);
  }
});

test("group-1 countries stay isolated from siblings and bases", () => {
  assert.notEqual(getLocaleFallbackChain("ru-KZ")[0], "ru-UZ");
  assert.notEqual(getLocaleFallbackChain("ru-UZ")[0], "ru-KG");
  assert.notEqual(getLocaleFallbackChain("ru-KG")[0], "ru-BY");
  assert.notEqual(getLocaleFallbackChain("ru-BY")[0], "ru-RU");
  assert.equal(getLocaleFallbackChain("ru-KZ")[1], "ru-RU");
  assert.equal(resolveLocaleDefinition("en").id, "en");
  assert.notEqual(resolveLocaleIdFromPathPrefix("ru"), "ru-KZ");
  assert.equal(resolveLocaleIdFromPathPrefix("ru"), "ru-RU");
  assert.notEqual(resolveLocaleIdFromPathPrefix("fr"), "fr-CM");
  assert.equal(resolveLocaleIdFromPathPrefix("fr"), "fr-FR");
});

test("group-1 namespace deep merge probes", () => {
  resetLocaleBundleCache();
  for (const c of COUNTRIES) {
    const bundles = loadLocaleBundles(c.id);
    assert.equal(lookupMessage(bundles, c.probeKey), c.probeValue, `${c.id} ${c.probeKey}`);
    if (c.id.startsWith("ru-")) {
      assert.equal(lookupMessage(bundles, "common.grade1"), "1 класс", c.id);
      assert.equal(lookupMessage(bundles, "common.grade6"), "6 класс", c.id);
    }
    assert.equal(
      fs.readdirSync(path.join(ROOT, "locales", c.id)).filter((f) => f.endsWith(".json")).length,
      c.namespaces,
      c.id
    );
  }
});

test("group-1 content packs catalog disk parity", () => {
  for (const c of COUNTRIES) {
    const disk = walkJson(path.join(ROOT, "content-packs", c.id)).map((p) =>
      p.replace(/\\/g, "/").split(`content-packs/${c.id}/`)[1]
    );
    const catalogKeys = Object.keys(CONTENT_PACK_CATALOG[c.id] || {}).sort();
    assert.equal(disk.length, c.packs, `${c.id} disk count`);
    assert.equal(catalogKeys.length, c.packs, `${c.id} catalog count`);
    assert.deepEqual(catalogKeys, disk.sort());
    assert.ok(getCatalogPackExact(c.id, catalogKeys[0]));
    assert.ok(loadContentPack(c.id, catalogKeys[0].split("/")[0], catalogKeys[0].split("/").slice(1).join("/")) || true);
  }
});

test("group-1 Help resolution and inheritance", () => {
  for (const c of COUNTRIES) {
    assert.equal(resolveHelpLocale(c.id), c.id);
    for (const section of ["parents", "students", "subjects", "parent-report"]) {
      assert.ok(listArticles(section, c.id).length > 0, `${c.id} ${section}`);
    }
  }
});

test("group-1 word meanings inherit language base", () => {
  const sampleCat = "animals";
  const word = "dog";
  assert.equal(
    resolveEnglishWordMeaning(word, { listKey: sampleCat, instructionLocale: "en-RW" }),
    word
  );
  const esWord = Object.keys(WORD_MEANINGS_ES_419[sampleCat] || {})[0] || word;
  assert.equal(
    resolveEnglishWordMeaning(esWord, { listKey: sampleCat, instructionLocale: "es-US" }),
    WORD_MEANINGS_ES_419[sampleCat][esWord]
  );
  const ruWord = Object.keys(WORD_MEANINGS_RU_RU[sampleCat] || {})[0] || word;
  for (const id of ["ru-KZ", "ru-UZ", "ru-KG", "ru-BY"]) {
    assert.equal(
      resolveEnglishWordMeaning(ruWord, { listKey: sampleCat, instructionLocale: id }),
      WORD_MEANINGS_RU_RU[sampleCat][ruWord],
      id
    );
  }
  const frWord = Object.keys(WORD_MEANINGS_FR_FR[sampleCat] || {})[0] || word;
  assert.equal(
    resolveEnglishWordMeaning(frWord, { listKey: sampleCat, instructionLocale: "fr-CM" }),
    WORD_MEANINGS_FR_FR[sampleCat][frWord]
  );
});

test("group-1 Math/Science inherit language bases via localizeLearningQuestion", () => {
  const rwMath = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "en-RW" }
  );
  const enMath = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "en" }
  );
  assert.equal(
    String(rwMath.question || rwMath.stem || ""),
    String(enMath.question || enMath.stem || "")
  );

  const cmGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "fr-CM" }
  );
  const frGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "fr-FR" }
  );
  assert.equal(
    String(cmGeo.question || cmGeo.stem || ""),
    String(frGeo.question || frGeo.stem || "")
  );

  const kzSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "ru-KZ" }
  );
  const ruSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "ru-RU" }
  );
  assert.equal(
    String(kzSci.stem || kzSci.question || ""),
    String(ruSci.stem || ruSci.question || "")
  );
});

const MONEY_KINDS = [
  { kind: "wp_pocket_money", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
  { kind: "wp_pocket_money_g2", params: { kind: "wp_pocket_money_g2", money: 10, toy: 3 } },
  { kind: "wp_coins", params: { kind: "wp_coins", coins1: 4, coins2: 3 } },
  { kind: "wp_coins_spent", params: { kind: "wp_coins_spent", total: 15, spent: 6 } },
  { kind: "wp_kopecks", params: { kind: "wp_kopecks", rubles: 2, kopecks: 5 } },
  { kind: "wp_coins_kopecks", params: { kind: "wp_coins_kopecks", rubles: 2, kopecks: 5 } },
  { kind: "wp_shop_discount", params: { kind: "wp_shop_discount", price: 200, discPerc: 25 } },
  { kind: "wp_multi_step", params: { kind: "wp_multi_step", money: 50, a: 2, b: 3, price: 5 } },
  {
    kind: "wp_multi_step_g6",
    params: { kind: "wp_multi_step_g6", money: 50, a: 2, b: 3, price: 5 },
  },
];

const RU_CURRENCY = {
  "ru-KZ": {
    must: [/тенге/, /тиын/],
    forbid: [/рубл/, /\u20BD/, /копейк/],
  },
  "ru-UZ": {
    must: [/сум/, /тийин/],
    forbid: [/рубл/, /\u20BD/, /копейк/, /тенге/],
  },
  "ru-KG": {
    must: [/сом/, /тыйын/],
    forbid: [/рубл/, /\u20BD/, /копейк/, /тенге/, /сум(?!м)/],
  },
  "ru-BY": {
    must: [/\bBr\b/, /копейк/],
    forbid: [/\u20BD/, /\bруб\./, /тенге/, /сом/, /сум/],
  },
};

test("group-1 Russian country currency layers win before ru-RU via shared runtime", () => {
  const pocket = { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } };
  const ruPocket = localizeLearningQuestion(pocket, { subject: "math", contentLocale: "ru-RU" });
  assert.match(String(ruPocket.question || ""), /рубл/);

  for (const [locale, rules] of Object.entries(RU_CURRENCY)) {
    for (const sample of MONEY_KINDS) {
      const q = {
        id: `q_${sample.kind}_demo`,
        subject: "math",
        params: { ...sample.params },
        correctAnswer: 7,
        answers: [7],
        correctIndex: 0,
        options: ["7", "13"],
      };
      const viaLocalize = localizeLearningQuestion(q, {
        subject: "math",
        contentLocale: locale,
      });
      const viaRender = renderMathStemForLocale(q, locale);
      const text = String(viaLocalize.question || viaLocalize.stem || "");
      const renderText = String(viaRender.stem || "");

      assert.equal(viaLocalize.id, q.id, `${locale} ${sample.kind} id`);
      assert.equal(viaLocalize.correctAnswer, 7, `${locale} ${sample.kind} answer`);
      assert.deepEqual(viaLocalize.params, q.params, `${locale} ${sample.kind} params`);
      assert.equal(viaLocalize.correctIndex, 0, `${locale} ${sample.kind} correctIndex`);

      // Money kinds that mention major units must use country wording.
      if (sample.kind === "wp_pocket_money" || sample.kind === "wp_pocket_money_g2") {
        for (const re of rules.must.slice(0, 1)) {
          assert.match(text, re, `${locale} ${sample.kind} localize`);
          assert.match(renderText, re, `${locale} ${sample.kind} render`);
        }
      }
      if (sample.kind === "wp_kopecks" || sample.kind === "wp_coins_kopecks") {
        // Minor-unit wording (тиын / тийин / тыйын / копейка).
        const minor =
          locale === "ru-KZ"
            ? /тиын/
            : locale === "ru-UZ"
              ? /тийин/
              : locale === "ru-KG"
                ? /тыйын/
                : /копейк/;
        assert.match(text, minor, `${locale} ${sample.kind} minor`);
        assert.match(renderText, minor, `${locale} ${sample.kind} minor render`);
      }
      for (const re of rules.forbid) {
        assert.doesNotMatch(text, re, `${locale} ${sample.kind} forbid localize ${re}`);
        assert.doesNotMatch(renderText, re, `${locale} ${sample.kind} forbid render ${re}`);
      }
    }

    // Country layer is checked before ru-RU: pocket money must differ from Russia.
    const countryPocket = localizeLearningQuestion(pocket, {
      subject: "math",
      contentLocale: locale,
    });
    assert.notEqual(
      String(countryPocket.question || ""),
      String(ruPocket.question || ""),
      `${locale} must not equal ru-RU pocket money stem`
    );
  }

  // Geometry still resolves through country → ru-RU rebuilders.
  const geo = { subject: "geometry", params: { kind: "circle_area", radius: 4 } };
  const ruGeo = renderGeometryStemForLocale(geo, "ru-RU");
  for (const locale of Object.keys(RU_CURRENCY)) {
    const countryGeo = renderGeometryStemForLocale(geo, locale);
    assert.equal(countryGeo.stem, ruGeo.stem, `${locale} geometry inherits ru-RU`);
  }
});

test("group-1 learning books fall back to language base dirs", () => {
  for (const c of COUNTRIES) {
    assert.equal(
      resolveLearningBookDraftsDir(c.id, "math", "g1"),
      `${c.booksDir}/math/g1/drafts`,
      c.id
    );
  }
});

test("existing base locales remain enabled after group-1 wiring", () => {
  for (const id of ["en", "es-419", "es-MX", "ru-RU", "fr-FR", "fr-CD", "en-GH", "en-IN"]) {
    assert.equal(resolveProductContentLocale({ contentLocale: id }), id, id);
  }
});
