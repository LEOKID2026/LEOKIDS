/**
 * Locale-aware English word meanings (Global: never Hebrew).
 * Run: node --test tests/learning/english-word-meanings-locale.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";

import { WORD_LISTS } from "../../data/english-questions/word-lists.js";
import { WORD_MEANINGS_ES_419 } from "../../data/english-questions/word-meanings/es-419.js";
import {
  resolveEnglishWordMeaning,
  getLocalizedWordList,
  getLocalizedWordEntries,
  remapStoredMeaningToInstructionLocale,
} from "../../data/english-questions/word-meanings-locale.js";

const HEBREW_CHAR_RE = /[\u0590-\u05FF]/;

test("es-419 dog meaning is Spanish", () => {
  assert.equal(
    resolveEnglishWordMeaning("dog", {
      listKey: "animals",
      instructionLocale: "es-419",
    }),
    "perro"
  );
  assert.equal(WORD_MEANINGS_ES_419.animals.dog, "perro");
});

test("he instruction falls back to English like any unknown locale", () => {
  assert.equal(
    resolveEnglishWordMeaning("dog", {
      listKey: "animals",
      instructionLocale: "he",
    }),
    "dog"
  );
  assert.equal(
    resolveEnglishWordMeaning("dog", {
      listKey: "animals",
      instructionLocale: "he-IL",
    }),
    "dog"
  );
  assert.equal(WORD_LISTS.animals.dog, "dog");
  assert.equal(HEBREW_CHAR_RE.test(WORD_LISTS.animals.dog), false);
});

test("en instruction returns English word, never Hebrew", () => {
  const meaning = resolveEnglishWordMeaning("dog", {
    listKey: "animals",
    instructionLocale: "en",
  });
  assert.equal(meaning, "dog");
  assert.equal(HEBREW_CHAR_RE.test(meaning), false);
});

test("es-419 localized list never contains Hebrew characters", () => {
  for (const listKey of Object.keys(WORD_LISTS)) {
    const localized = getLocalizedWordList(listKey, "es-419");
    for (const [enWord, meaning] of Object.entries(localized)) {
      assert.equal(
        HEBREW_CHAR_RE.test(meaning),
        false,
        `${listKey}.${enWord} leaked Hebrew: ${meaning}`
      );
    }
  }
});

test("WORD_MEANINGS_ES_419 has parity with all WORD_LISTS keys", () => {
  let expected = 0;
  let actual = 0;
  const missing = [];

  for (const [listKey, list] of Object.entries(WORD_LISTS)) {
    assert.ok(
      WORD_MEANINGS_ES_419[listKey],
      `missing category ${listKey} in es-419 pack`
    );
    for (const enWord of Object.keys(list)) {
      expected += 1;
      if (WORD_MEANINGS_ES_419[listKey][enWord] == null) {
        missing.push(`${listKey}.${enWord}`);
      } else {
        actual += 1;
      }
    }
  }

  assert.deepEqual(missing, []);
  assert.equal(actual, expected);
  assert.ok(expected >= 745, `expected WORD_LISTS growth preserved (got ${expected})`);
});

test("unknown locale falls back to English word", () => {
  assert.equal(
    resolveEnglishWordMeaning("cat", {
      listKey: "animals",
      instructionLocale: "xx-ZZ",
    }),
    "cat"
  );
});

test("getLocalizedWordEntries and remap", () => {
  const entries = getLocalizedWordEntries(["animals"], "es-419");
  assert.equal(entries.dog, "perro");
  assert.equal(
    remapStoredMeaningToInstructionLocale("", {
      listKey: "animals",
      enWordHint: "dog",
      instructionLocale: "es-419",
    }),
    "perro"
  );
  assert.equal(
    remapStoredMeaningToInstructionLocale("dog", {
      listKey: "animals",
      instructionLocale: "en",
    }),
    "dog"
  );
});
