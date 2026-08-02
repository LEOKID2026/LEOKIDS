/**
 * Wave-7 country wiring: India-en (en-IN), Ghana (en-GH),
 * Senegal (fr-SN), DR Congo (fr-CD).
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
import { WORD_MEANINGS_FR_FR } from "../../data/english-questions/word-meanings/fr-FR.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";
import { reportPackCopyForLocale } from "../../lib/reports/report-pack-copy.js";

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
    id: "en-IN",
    prefix: "in-en",
    label: "India-en",
    chain: ["en-IN", "en"],
    grade1: "Class 1",
    grade6: "Class 6",
    namespaces: 12,
    packs: 40,
  },
  {
    id: "en-GH",
    prefix: "gh",
    label: "Ghana",
    chain: ["en-GH", "en"],
    grade1: "Basic 1",
    grade6: "Basic 6",
    namespaces: 12,
    packs: 40,
  },
  {
    id: "fr-SN",
    prefix: "sn",
    label: "Senegal",
    chain: ["fr-SN", "fr-FR", "en"],
    grade1: "CI",
    grade6: "CM2",
    namespaces: 8,
    packs: 17,
  },
  {
    id: "fr-CD",
    prefix: "cd",
    label: "DR Congo",
    chain: ["fr-CD", "fr-FR", "en"],
    grade1: "1re primaire",
    grade6: "6e primaire",
    namespaces: 8,
    packs: 17,
  },
];

test("selector count is 69 and includes wave-7 countries once each", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 69);
  for (const c of COUNTRIES) {
    const hits = locales.filter((l) => l.id === c.id);
    assert.equal(hits.length, 1, c.id);
    assert.equal(hits[0].label, c.label);
    assert.equal(hits[0].nativeName, c.label);
    assert.equal(hits[0].pathPrefix, c.prefix);
  }
  assert.equal(locales.filter((l) => l.label === "India").length, 0);
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

test("India /in does not guess English; /in-en is authority", () => {
  assert.equal(resolveLocaleIdFromPathPrefix("in-en"), "en-IN");
  assert.equal(resolveLocaleIdFromPathPrefix("in"), null);
  assert.notEqual(stripLocaleFromPath("/in/parents").locale, "en-IN");
  assert.equal(stripLocaleFromPath("/in-en/parents").locale, "en-IN");
});

test("wave-7 countries stay isolated from siblings", () => {
  assert.notEqual(getLocaleFallbackChain("en-IN")[0], "en-GH");
  assert.notEqual(getLocaleFallbackChain("en-GH")[0], "en-IN");
  assert.notEqual(getLocaleFallbackChain("fr-SN")[1], "fr-CD");
  assert.notEqual(getLocaleFallbackChain("fr-CD")[1], "fr-SN");
  assert.notEqual(getLocaleFallbackChain("fr-SN")[1], "fr-CI");
  assert.notEqual(getLocaleFallbackChain("fr-CD")[1], "fr-CI");
  assert.equal(resolveLocaleIdFromPathPrefix("gh"), "en-GH");
  assert.equal(resolveLocaleIdFromPathPrefix("sn"), "fr-SN");
  assert.equal(resolveLocaleIdFromPathPrefix("cd"), "fr-CD");
});

test("bare tags do not alias wave-7 countries", () => {
  assert.equal(resolveLocaleDefinition("en").id, "en");
  assert.equal(resolveLocaleDefinition("fr").id, "en");
  assert.equal(resolveLocaleIdFromPathPrefix("fr"), "fr-FR");
  assert.notEqual(resolveLocaleIdFromPathPrefix("en"), "en-IN");
  assert.notEqual(resolveLocaleIdFromPathPrefix("en"), "en-GH");
  assert.notEqual(resolveLocaleIdFromPathPrefix("fr"), "fr-SN");
  assert.notEqual(resolveLocaleIdFromPathPrefix("fr"), "fr-CD");
});

test("wave-7 namespace deep merge and grade labels", () => {
  resetLocaleBundleCache();
  const expectedNs = {
    "en-IN": [
      "auth",
      "common",
      "copilot",
      "learning",
      "platform",
      "reports",
      "school",
      "seo",
      "teacher",
      "ui",
      "validation",
      "worksheets",
    ],
    "en-GH": [
      "auth",
      "common",
      "copilot",
      "learning",
      "platform",
      "reports",
      "school",
      "seo",
      "teacher",
      "ui",
      "validation",
      "worksheets",
    ],
    "fr-SN": [
      "auth",
      "common",
      "learning",
      "school",
      "seo",
      "ui",
      "validation",
      "worksheets",
    ],
    "fr-CD": [
      "auth",
      "common",
      "learning",
      "school",
      "seo",
      "ui",
      "validation",
      "worksheets",
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
        fs.existsSync(path.join(ROOT, "locales", c.id, `${ns}.json`)),
        `${c.id}/${ns}.json`
      );
    }
  }
});

test("wave-7 content packs catalog disk parity", () => {
  for (const c of COUNTRIES) {
    const disk = walkJson(path.join(ROOT, "content-packs", c.id)).map((p) =>
      p.replace(/\\/g, "/").split(`content-packs/${c.id}/`)[1]
    );
    const catalogKeys = Object.keys(CONTENT_PACK_CATALOG[c.id] || {}).sort();
    assert.equal(disk.length, c.packs, `${c.id} disk count`);
    assert.equal(catalogKeys.length, c.packs, `${c.id} catalog count`);
    assert.deepEqual(catalogKeys, disk.sort());
    assert.ok(getCatalogPackExact(c.id, "demo/ui.json") || getCatalogPackExact(c.id, "books/ui.json"));
    assert.ok(loadContentPack(c.id, "reports", "burn-down-index.json") || loadContentPack(c.id, "books", "ui.json"));
  }
});

test("wave-7 Help resolution and inheritance", () => {
  assert.equal(resolveHelpLocale("en-IN"), "en-IN");
  assert.equal(resolveHelpLocale("en-GH"), "en-GH");
  assert.equal(resolveHelpLocale("fr-SN"), "fr-SN");
  assert.equal(resolveHelpLocale("fr-CD"), "fr-CD");
  for (const section of ["parents", "students", "subjects", "parent-report"]) {
    for (const id of ["en-IN", "en-GH", "fr-SN", "fr-CD"]) {
      assert.ok(listArticles(section, id).length > 0, `${id} ${section}`);
    }
  }
});

test("wave-7 word meanings inherit language base", () => {
  const sampleCat = "animals";
  const word = "dog";
  assert.equal(
    resolveEnglishWordMeaning(word, { listKey: sampleCat, instructionLocale: "en-IN" }),
    word
  );
  assert.equal(
    resolveEnglishWordMeaning(word, { listKey: sampleCat, instructionLocale: "en-GH" }),
    word
  );
  const frWord = Object.keys(WORD_MEANINGS_FR_FR[sampleCat] || {})[0] || word;
  assert.equal(
    resolveEnglishWordMeaning(frWord, { listKey: sampleCat, instructionLocale: "fr-SN" }),
    WORD_MEANINGS_FR_FR[sampleCat][frWord]
  );
  assert.equal(
    resolveEnglishWordMeaning(frWord, { listKey: sampleCat, instructionLocale: "fr-CD" }),
    WORD_MEANINGS_FR_FR[sampleCat][frWord]
  );
});

test("wave-7 Math/Geometry/Science through localizeLearningQuestion", () => {
  const inMath = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "en-IN" }
  );
  const enMath = localizeLearningQuestion(
    { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
    { subject: "math", contentLocale: "en" }
  );
  assert.equal(
    String(inMath.question || inMath.stem || ""),
    String(enMath.question || enMath.stem || "")
  );

  const snGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "fr-SN" }
  );
  const frGeo = localizeLearningQuestion(
    { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
    { subject: "geometry", contentLocale: "fr-FR" }
  );
  assert.equal(
    String(snGeo.question || snGeo.stem || ""),
    String(frGeo.question || frGeo.stem || "")
  );
  assert.match(String(snGeo.question || snGeo.stem || ""), /cercle|rayon|aire/i);

  const cdSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "fr-CD" }
  );
  const frSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "fr-FR" }
  );
  assert.equal(
    String(cdSci.stem || cdSci.question || ""),
    String(frSci.stem || frSci.question || "")
  );

  const ghSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "en-GH" }
  );
  const enSci = localizeLearningQuestion(
    { id: "body_1", subject: "science", options: ["a", "b", "c", "d"], explanation: "EN" },
    { subject: "science", contentLocale: "en" }
  );
  assert.equal(
    String(ghSci.stem || ghSci.question || ""),
    String(enSci.stem || enSci.question || "")
  );
});

test("wave-7 learning books fall back to language base dirs", () => {
  assert.equal(
    resolveLearningBookDraftsDir("en-IN", "math", "g1"),
    "docs/learning-book/en/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("en-GH", "math", "g1"),
    "docs/learning-book/en/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("fr-SN", "math", "g1"),
    "docs/learning-book/fr-FR/math/g1/drafts"
  );
  assert.equal(
    resolveLearningBookDraftsDir("fr-CD", "math", "g1"),
    "docs/learning-book/fr-FR/math/g1/drafts"
  );
});

test("wave-7 writing packs inherit language base titles", () => {
  const inPack = resolveWritingWordPacks("en-IN");
  const en = resolveWritingWordPacks("en");
  assert.equal(inPack.colors.title, en.colors.title);
  const sn = resolveWritingWordPacks("fr-SN");
  const fr = resolveWritingWordPacks("fr-FR");
  assert.equal(sn.animals.title, fr.animals.title);
  const cd = resolveWritingWordPacks("fr-CD");
  assert.equal(cd.animals.title, fr.animals.title);
});

test("wave-7 report-pack merge grade samples", () => {
  resetLocaleBundleCache();
  assert.equal(
    reportPackCopyForLocale("en-IN", "components__parent-report-detailed-surface", "grade"),
    "Class"
  );
  assert.equal(
    reportPackCopyForLocale("en-GH", "components__parent-report-detailed-surface", "grade"),
    "Basic level"
  );
  assert.equal(
    reportPackCopyForLocale("fr-SN", "components__parent-report-detailed-surface", "grade"),
    "Niveau"
  );
  assert.equal(
    reportPackCopyForLocale("fr-CD", "components__parent-report-detailed-surface", "grade"),
    "Année"
  );
});

test("existing base locales remain enabled after wave-7 wiring", () => {
  for (const id of [
    "en",
    "fr-FR",
    "fr-CI",
    "fr-CA",
    "fr-BE",
    "nl-BE",
    "it-CH",
    "de-CH",
    "en-KE",
    "en-NG",
  ]) {
    assert.equal(resolveProductContentLocale({ contentLocale: id }), id, id);
  }
});
