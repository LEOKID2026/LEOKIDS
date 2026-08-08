/**
 * Indonesian Master Phase 7 — native learning runtime integration.
 * Provenance is verified by executing/selecting the id-ID display layer, not string equality alone.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import { localizeScienceQuestionForLocale } from "../../utils/learning-content-en/science.js";
import {
  renderMathStemForLocale,
  renderGeometryStemForLocale,
} from "../../lib/learning/render-question-stem.js";
import { rebuildMathStemIdId } from "../../utils/learning-content-id-ID/math.js";
import { rebuildGeometryStemIdId } from "../../utils/learning-content-id-ID/geometry.js";
import { rebuildMathStemEn } from "../../utils/learning-content-en/math.js";
import { SCIENCE_ID_ID_OVERLAY } from "../../data/science-questions-id-ID-overlay.js";
import { SCIENCE_EN_OVERLAY } from "../../data/science-questions-en-overlay.js";
import { SCIENCE_QUESTIONS } from "../../data/science-questions.js";
import { computeScienceLocalizationCoverage } from "../../lib/learning/science-localization-coverage.js";
import { checkLocaleCompleteness } from "../../lib/i18n/check-locale-completeness.js";
import { hasNativeQuestionDisplayLocale } from "../../lib/learning/question-content-locale.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";
import { resolveReadyWritingTitle } from "../../data/writing/ready-title.locale.js";
import { resolveWritingSentenceCue } from "../../data/english-questions/writing-sentence-cues-locale.js";
import { WRITING_SENTENCE_CUES_ID_ID } from "../../data/english-questions/writing-sentence-cues/id-ID.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { WORD_MEANINGS_ID_ID } from "../../data/english-questions/word-meanings/id-ID.js";
import { buildWritingCatalogItems } from "../../lib/writing/writing-catalog.server.js";
import { resolveContentLocale } from "../../lib/content/locale.js";
import { CONTENT_PACK_CATALOG, getCatalogPackExact } from "../../lib/content/pack-catalog.js";
import { resolveRegisteredContentPack } from "../../lib/content/resolve-registered-pack.js";

const LOCALE = "id-ID";
const ROOT = process.cwd();

function extractKinds(src) {
  const s = new Set();
  for (const m of src.matchAll(/kind === "([^"]+)"/g)) s.add(m[1]);
  for (const m of src.matchAll(/kind\.includes\("([^"]+)"\)/g)) s.add(m[1]);
  for (const m of src.matchAll(/kind\.startsWith\("([^"]+)"\)/g)) s.add(m[1]);
  return [...s].sort();
}

function extractDisplayTemplates(src) {
  /** @type {string[]} */
  const out = [];
  for (const m of src.matchAll(/`([^`\\]|\\.)*`/gs)) {
    out.push(m[0].slice(1, -1));
  }
  for (const m of src.matchAll(/return "([^"\\]|\\.)*"/g)) {
    const inner = m[0].slice('return "'.length, -1);
    if (/[A-Za-zÀ-ÿ]{3,}/.test(inner)) out.push(inner);
  }
  return out;
}

test("Phase7 Math/Geometry: runtime selects id-ID display layer (provenance)", () => {
  const mathQ = {
    subject: "math",
    params: { kind: "wp_simple_add", a: 3, b: 4 },
    correctAnswer: 7,
  };
  const idDirect = rebuildMathStemIdId(mathQ);
  const viaLocalize = localizeLearningQuestion(mathQ, { subject: "math", contentLocale: LOCALE });
  const viaRender = renderMathStemForLocale(mathQ, LOCALE);
  assert.ok(idDirect && String(idDirect).length > 0);
  assert.equal(String(viaLocalize.question || viaLocalize.stem), String(idDirect));
  assert.equal(viaRender.stem, String(idDirect));
  assert.notEqual(viaRender.stem, rebuildMathStemEn(mathQ));
  assert.equal(viaLocalize.correctAnswer, 7);
  assert.deepEqual(viaLocalize.params, mathQ.params);

  const geoQ = {
    subject: "geometry",
    params: { kind: "square_area", side: 5 },
    correctAnswer: 25,
  };
  const geoDirect = rebuildGeometryStemIdId(geoQ);
  const geoLoc = localizeLearningQuestion(geoQ, { subject: "geometry", contentLocale: LOCALE });
  const geoRender = renderGeometryStemForLocale(geoQ, LOCALE);
  assert.equal(String(geoLoc.question || geoLoc.stem), String(geoDirect));
  assert.equal(geoRender.stem, String(geoDirect));
  assert.equal(geoLoc.correctAnswer, 25);
});

test("Phase7 Math/Geometry: kind/template counts", () => {
  const idMath = fs.readFileSync(path.join(ROOT, "utils/learning-content-id-ID/math.js"), "utf8");
  const idGeo = fs.readFileSync(path.join(ROOT, "utils/learning-content-id-ID/geometry.js"), "utf8");
  const enMath = fs.readFileSync(path.join(ROOT, "utils/learning-content-en/math.js"), "utf8");
  const enGeo = fs.readFileSync(path.join(ROOT, "utils/learning-content-en/geometry.js"), "utf8");
  assert.equal(extractKinds(idMath).length, 75);
  assert.deepEqual(extractKinds(idMath), extractKinds(enMath));
  assert.equal(extractKinds(idGeo).length, 9);
  assert.deepEqual(extractKinds(idGeo), extractKinds(enGeo));
  assert.equal(extractDisplayTemplates(idMath).length, 128);
  assert.equal(extractDisplayTemplates(idGeo).length, 8);
});

test("Phase7 Science: overlay runtime + coverage + logic drift 0", () => {
  const cov = computeScienceLocalizationCoverage(undefined, SCIENCE_ID_ID_OVERLAY);
  assert.equal(cov.totalQuestions, 1017);
  assert.equal(cov.contractComplete, true);
  assert.equal(Object.keys(SCIENCE_ID_ID_OVERLAY).length, 1017);

  const bankIds = new Set(SCIENCE_QUESTIONS.map((q) => q.id));
  const overlayIds = new Set(Object.keys(SCIENCE_ID_ID_OVERLAY));
  assert.equal([...bankIds].filter((id) => !overlayIds.has(id)).length, 0);
  assert.equal([...overlayIds].filter((id) => !bankIds.has(id)).length, 0);

  const sample = SCIENCE_QUESTIONS.find((q) => q.id === "animals_1") || SCIENCE_QUESTIONS[0];
  const localized = localizeScienceQuestionForLocale(sample, LOCALE);
  const enOverlay = SCIENCE_EN_OVERLAY[sample.id];
  const idOverlay = SCIENCE_ID_ID_OVERLAY[sample.id];
  assert.equal(localized.id, sample.id);
  assert.equal(localized.correctIndex, sample.correctIndex);
  assert.deepEqual(localized.params ?? null, sample.params ?? null);
  assert.equal(localized.stem, idOverlay.stem);
  assert.notEqual(localized.stem, enOverlay?.stem);

  const completeness = checkLocaleCompleteness(LOCALE);
  const sci = completeness.findings.find((f) => f.id === "science_overlay");
  assert.equal(sci?.status, "ok");
  assert.match(sci.detail, /contractComplete=true/);
});

test("Phase7 native question-display registry: unchanged (stale flagship list)", () => {
  // Existing contract lists only en/es-419/pt-BR and is unused elsewhere.
  // Runtime selection is via learning-content-en/index.js — do not expand this helper alone.
  assert.equal(hasNativeQuestionDisplayLocale("en"), true);
  assert.equal(hasNativeQuestionDisplayLocale("pt-BR"), true);
  assert.equal(hasNativeQuestionDisplayLocale(LOCALE), false);
});

test("Phase7 Writing: packs/titles/cues resolve id-ID; learning targets EN", () => {
  const packs = resolveWritingWordPacks(LOCALE);
  assert.equal(Object.keys(packs).length, 12);
  assert.equal(packs.colors.title, "Warna");
  assert.equal(packs.animals.title, "Hewan");
  const colorEn = packs.colors.words.map((w) => w.colorInstructionEn || w.colorInstruction).filter(Boolean);
  assert.ok(colorEn.length >= 8);
  for (const w of packs.colors.words) {
    if (w.colorInstructionEn) {
      assert.notEqual(w.colorInstruction, w.colorInstructionEn);
    }
  }
  assert.equal(packs.animals.words[0].text, "cat");

  const catalog = buildWritingCatalogItems(LOCALE);
  assert.equal(catalog.length, 179);
  let missingTitles = 0;
  for (const item of catalog) {
    const enTitle = item.titleEn || item.title;
    const resolved = resolveReadyWritingTitle(enTitle, LOCALE);
    if (!resolved || !String(resolved).trim()) missingTitles += 1;
  }
  assert.equal(missingTitles, 0);
  assert.match(resolveReadyWritingTitle("Trace — A", LOCALE), /Telusuri — A/);
  assert.match(resolveReadyWritingTitle("Group A–E", LOCALE), /Kelompok/);

  const cueKeys = Object.keys(WRITING_SENTENCE_CUES_ID_ID);
  assert.equal(cueKeys.length, 119);
  let missingCues = 0;
  for (const key of cueKeys) {
    const cue = resolveWritingSentenceCue(key, "FALLBACK_EN", { instructionLocale: LOCALE });
    if (cue === "FALLBACK_EN" || cue === key) missingCues += 1;
    assert.equal(key.includes(" "), true); // English sentence key retained as lookup id
  }
  assert.equal(missingCues, 0);
});

test("Phase7 Word Meanings: 745/745 runtime id-ID; sense-specific", () => {
  let pairs = 0;
  let missing = 0;
  let empty = 0;
  let enFallback = 0;
  for (const [listKey, map] of Object.entries(WORD_LISTS)) {
    for (const lemma of Object.keys(map)) {
      pairs += 1;
      const meaning = resolveEnglishWordMeaning(lemma, {
        listKey,
        instructionLocale: LOCALE,
      });
      const expected = WORD_MEANINGS_ID_ID[listKey]?.[lemma];
      if (expected == null) missing += 1;
      else if (!String(expected).trim()) empty += 1;
      else if (meaning !== expected) {
        // If resolver returns English lemma, that is EN definition fallback.
        if (meaning === lemma) enFallback += 1;
        else missing += 1;
      }
    }
  }
  assert.equal(pairs, 745);
  assert.equal(missing, 0);
  assert.equal(empty, 0);
  assert.equal(enFallback, 0);
  assert.equal(resolveEnglishWordMeaning("orange", { listKey: "colors", instructionLocale: LOCALE }), "oranye");
  assert.equal(resolveEnglishWordMeaning("orange", { listKey: "food", instructionLocale: LOCALE }), "jeruk");
  assert.equal(resolveEnglishWordMeaning("cold", { listKey: "weather", instructionLocale: LOCALE }), "dingin");
  assert.equal(resolveEnglishWordMeaning("cold", { listKey: "health", instructionLocale: LOCALE }), "pilek");
  assert.equal(resolveEnglishWordMeaning("mouse", { listKey: "animals", instructionLocale: LOCALE }), "tikus");
  assert.match(
    resolveEnglishWordMeaning("mouse", { listKey: "technology", instructionLocale: LOCALE }),
    /mouse/i
  );
});

test("Phase7 English subject: learning content stays en under id-ID interface", () => {
  assert.equal(resolveContentLocale({ subject: "english", interfaceLocale: LOCALE }), "en");
  assert.equal(resolveContentLocale({ subject: "math", interfaceLocale: LOCALE }), LOCALE);
  assert.equal(resolveContentLocale({ subject: "science", interfaceLocale: LOCALE }), LOCALE);
});

test("Phase7 Phase5 pack provenance regression (catalog roots)", () => {
  const roots = [
    "books/ui.json",
    "games/burn-down-index.json",
    "rewards/ui.json",
    "demo/ui.json",
    "global-burn-down/burn-down-index.json",
    "learning/burn-down-index.json",
    "reports/burn-down-index.json",
  ];
  for (const rel of roots) {
    const idPack = getCatalogPackExact(LOCALE, rel);
    assert.ok(idPack, rel);
    const resolved = resolveRegisteredContentPack(LOCALE, ...rel.split("/"));
    assert.equal(JSON.stringify(resolved), JSON.stringify(idPack));
  }
  assert.equal(
    Object.keys(CONTENT_PACK_CATALOG[LOCALE] || {}).filter((k) => !k.startsWith("public-seo/")).length,
    28
  );
});
