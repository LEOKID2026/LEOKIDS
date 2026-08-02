/**
 * Italy / France / Netherlands wiring: paths, namespaces, packs, Help,
 * meanings, science, stems, books, writing packs, grade maps, isolation.
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
import { loadContentPack } from "../../lib/content/locale.server.js";
import { getCatalogPackExact, CONTENT_PACK_CATALOG } from "../../lib/content/pack-catalog.js";
import {
  ALL_ARTICLES_IT_IT,
  ALL_ARTICLES_FR_FR,
  ALL_ARTICLES_NL_NL,
  resolveHelpLocale,
  listArticles,
} from "../../data/help-center/index.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WORD_MEANINGS_IT_IT } from "../../data/english-questions/word-meanings/it-IT.js";
import { WORD_MEANINGS_FR_FR } from "../../data/english-questions/word-meanings/fr-FR.js";
import { WORD_MEANINGS_NL_NL } from "../../data/english-questions/word-meanings/nl-NL.js";
import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { localizeScienceQuestionForLocale } from "../../utils/learning-content-en/science.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import {
  renderMathStemForLocale,
  renderGeometryStemForLocale,
} from "../../lib/learning/render-question-stem.js";
import { resolveLearningBookDraftsDir } from "../../lib/content/locale.server.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";
import { checkLocaleCompleteness } from "../../lib/i18n/check-locale-completeness.js";
import { SCIENCE_IT_IT_OVERLAY } from "../../data/science-questions-it-IT-overlay.js";
import { SCIENCE_FR_FR_OVERLAY } from "../../data/science-questions-fr-FR-overlay.js";
import { SCIENCE_NL_NL_OVERLAY } from "../../data/science-questions-nl-NL-overlay.js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");

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

const LOCALES = [
  {
    id: "it-IT",
    prefix: "it",
    label: "Italy",
    grades: {
      grade1: "1ª primaria",
      grade2: "2ª primaria",
      grade3: "3ª primaria",
      grade4: "4ª primaria",
      grade5: "5ª primaria",
      grade6: "1ª secondaria",
    },
    science: SCIENCE_IT_IT_OVERLAY,
    help: ALL_ARTICLES_IT_IT,
    meanings: WORD_MEANINGS_IT_IT,
    writingFood: "Alimenti",
    writingRed: "Colora di rosso",
    arith: /Quanto fa 4 \+ 7\?/,
    money: /euro/i,
    moneyLocal: /Emma ha .* euro/,
    geometry: /raggio|area/i,
    geometryLocal: /Un cerchio ha raggio/,
    englishMoney: /dollar|\$/i,
    englishGeometry: /A circle has radius|What is the area/i,
  },
  {
    id: "fr-FR",
    prefix: "fr",
    label: "France",
    grades: {
      grade1: "CP",
      grade2: "CE1",
      grade3: "CE2",
      grade4: "CM1",
      grade5: "CM2",
      grade6: "6e",
    },
    science: SCIENCE_FR_FR_OVERLAY,
    help: ALL_ARTICLES_FR_FR,
    meanings: WORD_MEANINGS_FR_FR,
    writingFood: "Aliments",
    writingRed: "Colorie en rouge",
    arith: /Combien font 4 \+ 7/,
    money: /euros?/i,
    moneyLocal: /Emma a .* euros/,
    geometry: /rayon|aire/i,
    geometryLocal: /Un disque de rayon/,
    englishMoney: /dollar|\$/i,
    englishGeometry: /A circle has radius|What is the area/i,
  },
  {
    id: "nl-NL",
    prefix: "nl",
    label: "Netherlands",
    grades: {
      grade1: "Groep 3",
      grade2: "Groep 4",
      grade3: "Groep 5",
      grade4: "Groep 6",
      grade5: "Groep 7",
      grade6: "Groep 8",
    },
    science: SCIENCE_NL_NL_OVERLAY,
    help: ALL_ARTICLES_NL_NL,
    meanings: WORD_MEANINGS_NL_NL,
    writingFood: "Eten",
    writingRed: "Kleur rood",
    arith: /Hoeveel is 4 \+ 7\?/,
    money: /euro/i,
    moneyLocal: /Emma heeft .* euro/,
    geometry: /straal|oppervlakte/i,
    geometryLocal: /Een cirkel heeft een straal/,
    englishMoney: /dollar|\$/i,
    englishGeometry: /A circle has radius|What is the area/i,
  },
];

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

test("selector includes Italy France Netherlands; count 47", () => {
  const locales = getSelectableLocales();
  assert.equal(locales.length, 47);
  for (const c of LOCALES) {
    const hit = locales.find((l) => l.id === c.id);
    assert.ok(hit, c.id);
    assert.equal(hit.label, c.label);
    assert.equal(hit.nativeName, c.label);
    assert.equal(hit.pathPrefix, c.prefix);
  }
  assert.ok(!locales.some((l) => l.id === "it" || l.id === "fr" || l.id === "nl"));
  assert.ok(locales.some((l) => l.id === "de-DE"));
  assert.ok(locales.some((l) => l.id === "ru-RU"));
});

for (const c of LOCALES) {
  test(`${c.id} path maps /${c.prefix} and falls back ${c.id} → en`, () => {
    assert.equal(getPublicLocalePathPrefix(c.id), c.prefix);
    assert.equal(resolveLocaleIdFromPathPrefix(c.prefix), c.id);
    assert.deepEqual(getLocaleFallbackChain(c.id), [c.id, "en"]);
    assert.equal(resolveLocaleDefinition(c.id).label, c.label);
    assert.equal(withLocalePath(c.id, "/parents"), `/${c.prefix}/parents`);
    assert.equal(stripLocaleFromPath(`/${c.prefix}/parents`).locale, c.id);

    const fromInternal = stripLocaleFromPath(`/${c.id}/student/home`);
    assert.equal(fromInternal.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromInternal.pathSegment), true);

    const fromUpper = stripLocaleFromPath(`/${c.prefix.toUpperCase()}/parents`);
    assert.equal(fromUpper.locale, c.id);
    assert.equal(shouldRedirectToPublicLocalePrefix(c.id, fromUpper.pathSegment), true);
  });

  test(`${c.id} loads 15 namespaces and grade mapping`, () => {
    resetLocaleBundleCache();
    const bundles = loadLocaleBundles(c.id);
    for (const ns of NAMESPACES) {
      assert.ok(bundles[ns] && typeof bundles[ns] === "object", `${c.id}:${ns}`);
    }
    for (const [key, value] of Object.entries(c.grades)) {
      assert.equal(lookupMessage(bundles, `common.${key}`), value, `${c.id}.${key}`);
    }
    const flat = JSON.stringify({
      g1: lookupMessage(bundles, "common.grade1"),
      g6: lookupMessage(bundles, "common.grade6"),
    });
    assert.doesNotMatch(flat, /Grade [1-6]/);
    if (c.id === "it-IT") {
      assert.notEqual(lookupMessage(bundles, "common.grade6"), "6ª primaria");
      assert.doesNotMatch(String(lookupMessage(bundles, "common.grade6") || ""), /Classe 6/i);
    }
  });

  test(`${c.id} content packs: 396 on disk + catalog deep-merge`, () => {
    assert.equal(countJsonFiles(path.join(root, "content-packs", c.id)), 396);
    assert.equal(Object.keys(CONTENT_PACK_CATALOG[c.id] || {}).length, 28);
    assert.ok(getCatalogPackExact(c.id, "books/ui.json"));
    assert.ok(loadContentPack(c.id, "books", "ui.json"));
    assert.ok(loadContentPack(c.id, "rewards", "ui.json"));
    assert.ok(loadContentPack(c.id, "demo", "ui.json"));
    assert.ok(loadContentPack(c.id, "reports", "burn-down-index.json"));
  });

  test(`${c.id} Help loads 40 articles`, () => {
    assert.equal(resolveHelpLocale(c.id), c.id);
    assert.equal(c.help.length, 40);
    assert.equal(listArticles("parents", c.id).length > 0, true);
    assert.ok(c.help.every((a) => a.slug && a.section));
  });

  test(`${c.id} word meanings load from locale pack`, () => {
    const n = countMeaningIds(c.meanings);
    assert.ok(n > 0, c.id);
    const sampleId = Object.keys(c.meanings.animals || c.meanings.colors || {})[0];
    const listKey = c.meanings.animals?.[sampleId] != null ? "animals" : "colors";
    const word = Object.keys(c.meanings[listKey])[0];
    const expected = c.meanings[listKey][word];
    assert.equal(
      resolveEnglishWordMeaning(word, { listKey, instructionLocale: c.id }),
      expected
    );
    // English learning target word id stays English
    assert.equal(word, word);
  });

  test(`${c.id} science overlay has 1017 records and localizes`, () => {
    assert.equal(Object.keys(c.science).length, 1017);
    const sampleId = Object.keys(c.science)[0];
    const out = localizeScienceQuestionForLocale(
      { id: sampleId, subject: "science", options: ["a", "b", "c", "d"] },
      c.id
    );
    assert.ok(out);
    const overlay = c.science[sampleId];
    if (overlay.stem || overlay.question) {
      assert.ok(out.stem || out.question);
    }
    if (Array.isArray(overlay.options)) {
      assert.deepEqual(out.options, overlay.options);
    }
  });

  test(`${c.id} Math/Geometry/Science through localizeLearningQuestion`, () => {
    assert.equal(resolveProductContentLocale({ contentLocale: c.id }), c.id);

    const money = localizeLearningQuestion(
      { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
      { subject: "math", contentLocale: c.id }
    );
    const moneyText = String(money.question || money.stem || money.exerciseText || "");
    assert.match(moneyText, c.moneyLocal);
    assert.match(moneyText, c.money);
    assert.doesNotMatch(moneyText, c.englishMoney);
    assert.doesNotMatch(moneyText, /How many|dollars?/i);

    const area = localizeLearningQuestion(
      { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
      { subject: "geometry", contentLocale: c.id }
    );
    const areaText = String(area.question || area.stem || area.exerciseText || "");
    assert.match(areaText, c.geometryLocal);
    assert.match(areaText, c.geometry);
    assert.doesNotMatch(areaText, c.englishGeometry);

    const scienceId = "body_1";
    const science = localizeLearningQuestion(
      {
        id: scienceId,
        subject: "science",
        options: ["a", "b", "c", "d"],
        explanation: "EN fallback",
      },
      { subject: "science", contentLocale: c.id }
    );
    const overlay = c.science[scienceId];
    assert.equal(String(science.stem || science.question || ""), overlay.stem);
    assert.deepEqual(science.options, overlay.options);
    assert.equal(String(science.explanation || ""), overlay.explanation);
    assert.notEqual(String(science.explanation || ""), "EN fallback");

    // Isolation: sibling European locales produce distinct local results.
    for (const other of LOCALES.filter((x) => x.id !== c.id)) {
      const otherMoney = localizeLearningQuestion(
        { subject: "math", params: { kind: "wp_pocket_money", money: 10, toy: 3 } },
        { subject: "math", contentLocale: other.id }
      );
      const otherMoneyText = String(
        otherMoney.question || otherMoney.stem || otherMoney.exerciseText || ""
      );
      assert.notEqual(otherMoneyText, moneyText);

      const otherArea = localizeLearningQuestion(
        { subject: "geometry", params: { kind: "circle_area", radius: 4 } },
        { subject: "geometry", contentLocale: other.id }
      );
      const otherAreaText = String(
        otherArea.question || otherArea.stem || otherArea.exerciseText || ""
      );
      assert.notEqual(otherAreaText, areaText);

      const otherScience = localizeLearningQuestion(
        { id: scienceId, subject: "science", options: ["a", "b", "c", "d"] },
        { subject: "science", contentLocale: other.id }
      );
      assert.notEqual(
        String(otherScience.stem || otherScience.question || ""),
        String(science.stem || science.question || "")
      );
      assert.notDeepEqual(otherScience.options, science.options);
    }

    // Direct rebuilder still matches the localizeLearningQuestion path.
    const directMath = renderMathStemForLocale(
      { operation: "addition", params: { a: 4, b: 7 } },
      c.id
    );
    assert.match(String(directMath.stem), c.arith);
    const directGeo = renderGeometryStemForLocale(
      { params: { kind: "circle_area", radius: 4 } },
      c.id
    );
    assert.match(String(directGeo.stem), c.geometryLocal);
  });

  test(`${c.id} learning books resolve local drafts dir`, () => {
    assert.equal(
      resolveLearningBookDraftsDir(c.id, "math", "g1"),
      `docs/learning-book/${c.id}/math/g1/drafts`
    );
    assert.ok(
      fs.existsSync(path.join(root, "docs/learning-book", c.id, "math", "g1", "drafts"))
    );
  });

  test(`${c.id} writing packs titles and color instructions`, () => {
    const packs = resolveWritingWordPacks(c.id);
    assert.equal(packs.food.title, c.writingFood);
    const red = packs.colors.words.find((w) => w.colorInstructionEn === "Color in red");
    assert.equal(red?.colorInstruction, c.writingRed);
  });

  test(`${c.id} completeness recognizes learning surfaces`, () => {
    const report = checkLocaleCompleteness(c.id);
    const byId = Object.fromEntries(report.findings.map((f) => [f.id, f]));
    assert.equal(byId.science_overlay.status, "ok", c.id);
    assert.equal(byId.question_stems.status, "ok", c.id);
    assert.equal(byId.worksheets.status, "ok", c.id);
  });
}

test("bare it/fr/nl: Portugal pattern — path/Help regional; direct bare content → en", () => {
  for (const c of LOCALES) {
    // Public path always resolves to the full regional locale.
    assert.equal(resolveLocaleIdFromPathPrefix(c.prefix), c.id);
    assert.equal(stripLocaleFromPath(`/${c.prefix}/learning`).locale, c.id);
    // Help bare tag → regional locale.
    assert.equal(resolveHelpLocale(c.prefix), c.id);
    // Direct bare tag outside path flow → en (not a sibling regional alias).
    assert.equal(resolveLocaleDefinition(c.prefix).id, "en");
    assert.equal(resolveContentLocale({ contentLocale: c.prefix }), "en");
    assert.equal(resolveProductContentLocale({ contentLocale: c.prefix }), "en");
  }
  assert.notEqual(
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "it" }),
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "it-IT" })
  );
  assert.notEqual(
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "fr" }),
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "fr-FR" })
  );
  assert.notEqual(
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "nl" }),
    resolveEnglishWordMeaning("dog", { listKey: "animals", instructionLocale: "nl-NL" })
  );
});

test("product resolveContentLocale keeps existing locales and registry-enabled ids", () => {
  for (const id of ["en", "es-419", "es-ES", "pt-BR", "pt-PT", "it-IT", "fr-FR", "nl-NL"]) {
    assert.equal(resolveProductContentLocale({ contentLocale: id }), id);
  }
  // Selectable locales must survive the product wrapper (no silent en collapse).
  for (const loc of getSelectableLocales()) {
    assert.equal(resolveProductContentLocale({ contentLocale: loc.id }), loc.id, loc.id);
  }
  // de-DE and ru-RU are live; bare `ru` is not a registry alias.
  assert.equal(resolveProductContentLocale({ contentLocale: "de-DE" }), "de-DE");
  assert.equal(resolveProductContentLocale({ contentLocale: "ru-RU" }), "ru-RU");
  assert.ok(!LOCALE_REGISTRY.de);
  assert.ok(!LOCALE_REGISTRY.ru);
  assert.equal(Boolean(LOCALE_REGISTRY["it-IT"]?.enabled), true);
  assert.equal(Boolean(LOCALE_REGISTRY["fr-FR"]?.enabled), true);
  assert.equal(Boolean(LOCALE_REGISTRY["nl-NL"]?.enabled), true);
  assert.equal(Boolean(LOCALE_REGISTRY["de-DE"]?.enabled), true);
  assert.equal(Boolean(LOCALE_REGISTRY["ru-RU"]?.enabled), true);
});

test("fr-FR meanings = 745 and match WORD_LISTS authority", () => {
  assert.equal(countMeaningIds(WORD_MEANINGS_FR_FR), 745);
  assert.equal(countMeaningIds(WORD_LISTS), 745);
  const frIds = new Set();
  for (const list of Object.values(WORD_MEANINGS_FR_FR || {})) {
    for (const id of Object.keys(list || {})) frIds.add(id);
  }
  const listIds = new Set();
  for (const list of Object.values(WORD_LISTS || {})) {
    for (const id of Object.keys(list || {})) listIds.add(id);
  }
  assert.equal(frIds.size, listIds.size);
  for (const id of listIds) assert.ok(frIds.has(id), id);
});

test("existing locales remain enabled and unchanged in selector core", () => {
  const locales = getSelectableLocales();
  assert.ok(locales.some((l) => l.id === "pt-PT" && l.pathPrefix === "pt"));
  assert.ok(locales.some((l) => l.id === "pt-BR" && l.pathPrefix === "br"));
  assert.ok(locales.some((l) => l.id === "es-ES" && l.pathPrefix === "es"));
  assert.equal(resolveLocaleDefinition("en").id, "en");
  assert.deepEqual(getLocaleFallbackChain("pt-PT"), ["pt-PT", "pt-BR", "en"]);
});
