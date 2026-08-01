/**
 * Writing Packs es-419 — load, parity, meanings, stems, no Hebrew/vos.
 * Run: node --test tests/writing/writing-packs-es419.test.mjs
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { ENGLISH_WORD_PACKS } from "../../data/writing/word-packs.en.js";
import { resolveWritingWordPacks } from "../../data/writing/word-packs.locale.js";
import { resolveEnglishWordMeaning } from "../../data/english-questions/word-meanings-locale.js";
import { WRITING_SENTENCE_CUES_ES_419 } from "../../data/english-questions/writing-sentence-cues/es-419.js";
import { resolveReadyWritingTitle } from "../../data/writing/ready-title.locale.js";
import {
  englishWritingItemFromPoolRow,
  listEnglishWorksheetWritingPool,
} from "../../lib/worksheets/worksheet-english-writing-pool.server.js";
import { localizeEnglishQuestionEn } from "../../utils/learning-content-en/english.js";
import {
  generateReadyWritingBySlug,
  generateWritingForParent,
} from "../../lib/writing/writing-generate.server.js";
import { buildWritingCatalogItems } from "../../lib/writing/writing-catalog.server.js";

const HEBREW_RE = /[\u0590-\u05FF]/;
const VOS_RE = /\bvos\b|\bvosotros\b/i;

test("resolveWritingWordPacks(es-419) localizes titles and color instructions", () => {
  const packs = resolveWritingWordPacks("es-419");
  assert.equal(Object.keys(packs).length, 12);
  assert.equal(packs.colors.title, "Colores");
  assert.equal(packs.animals.title, "Animales");
  assert.equal(packs.colors.words[0].text, "red");
  assert.equal(packs.colors.words[0].colorInstruction, "Colorea de rojo");
  assert.ok(!HEBREW_RE.test(JSON.stringify(packs)));
});

test("all writing word IDs resolve Spanish meanings", () => {
  const words = new Set();
  for (const pack of Object.values(ENGLISH_WORD_PACKS)) {
    for (const w of pack.words) words.add(w.text);
  }
  assert.equal(words.size, 95);
  const missing = [];
  for (const w of words) {
    const meaning = resolveEnglishWordMeaning(w, { instructionLocale: "es-419" });
    if (!meaning) missing.push(w);
  }
  assert.deepEqual(missing, []);
});

test("writing sentence cues cover the English pool with LatAm Spanish", () => {
  const seen = new Map();
  for (const grade of ["g1", "g2", "g3", "g4", "g5", "g6"]) {
    for (const row of listEnglishWorksheetWritingPool(grade)) {
      if (row.subtype === "word") continue;
      seen.set(row.en, row);
    }
  }
  assert.equal(seen.size, 119);
  assert.equal(Object.keys(WRITING_SENTENCE_CUES_ES_419).length, 119);
  const missing = [...seen.keys()].filter((en) => !WRITING_SENTENCE_CUES_ES_419[en]);
  assert.deepEqual(missing, []);
  for (const cue of Object.values(WRITING_SENTENCE_CUES_ES_419)) {
    assert.ok(String(cue).trim());
    assert.ok(!HEBREW_RE.test(cue));
    assert.ok(!VOS_RE.test(cue));
  }
});

test("English writing stems follow instructionLocale; answers stay English", () => {
  const wordRow = listEnglishWorksheetWritingPool("g2").find((r) => r.subtype === "word");
  const sentenceRow = listEnglishWorksheetWritingPool("g6").find((r) => r.subtype !== "word");
  assert.ok(wordRow && sentenceRow);

  const wordEs = localizeEnglishQuestionEn(englishWritingItemFromPoolRow(wordRow, "g2", "regular"), {
    instructionLocale: "es-419",
  });
  const sentenceEs = localizeEnglishQuestionEn(
    englishWritingItemFromPoolRow(sentenceRow, "g6", "regular"),
    { instructionLocale: "es-419" }
  );

  assert.match(String(wordEs.question), /Escribe/);
  assert.equal(wordEs.correctAnswer, wordRow.en);
  assert.match(String(sentenceEs.question), /Escribe en inglés/);
  assert.equal(sentenceEs.correctAnswer, sentenceRow.en);
  assert.ok(!HEBREW_RE.test(String(wordEs.question)));
  assert.ok(!HEBREW_RE.test(String(sentenceEs.question)));
});

test("writing generate + ready payload use es-419 chrome", () => {
  const generated = generateWritingForParent({
    worksheetType: "writing",
    writingCategory: "english_words",
    wordPackId: "colors",
    tracingMode: "trace",
    interfaceLocale: "es-419",
    contentLocale: "es-419",
    lineCount: 4,
    itemsPerLine: 2,
    seed: 7,
  });
  assert.equal(generated.ok, true);
  const instruction = generated.worksheetPayload.pages[0].blocks.find(
    (b) => b.blockType === "instruction"
  );
  assert.equal(instruction?.textHe, "Traza el ejemplo y escribe");
  assert.ok(!HEBREW_RE.test(JSON.stringify(generated.worksheetPayload)));

  const ready = generateReadyWritingBySlug("writing-en-words-colors-trace", {
    contentLocale: "es-419",
    interfaceLocale: "es-419",
  });
  assert.equal(ready.ok, true);
  assert.equal(ready.worksheetPayload.meta.titleHe, "Palabras — Colores (Traza)");
});

test("ready writing catalog titles localize with no EN chrome leftovers", () => {
  const items = buildWritingCatalogItems("es-419");
  assert.equal(items.length, 179);
  const englishChrome = items.filter((item) =>
    /^(Trace|Number|Words|Group|Horizontal|Vertical|Alphabet|Pre-writing)\b/.test(
      String(item.titleHe || "")
    )
  );
  assert.deepEqual(
    englishChrome.map((i) => i.titleHe),
    []
  );
  for (const item of items) {
    assert.ok(String(item.titleHe || "").trim());
    assert.ok(!HEBREW_RE.test(String(item.titleHe)));
    assert.ok(!VOS_RE.test(String(item.titleHe)));
  }
  assert.equal(resolveReadyWritingTitle("Trace — A", "es-419"), "Traza — A");
  assert.equal(resolveReadyWritingTitle("Number 5", "es-419"), "Número 5");
});
