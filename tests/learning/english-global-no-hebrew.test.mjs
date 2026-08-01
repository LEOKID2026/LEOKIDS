import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { localizeEnglishQuestionEn } from "../../utils/learning-content-en/english.js";
import { getLocalizedWordEntries } from "../../data/english-questions/word-meanings-locale.js";
import { generateQuestion, ENGLISH_LEVELS } from "../../utils/english-question-generator.js";

const HEBREW_RE = /[\u0590-\u05FF]/;

function collectStrings(value, out = []) {
  if (typeof value === "string") {
    out.push(value);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) collectStrings(v, out);
  }
  return out;
}

describe("Global English subject — no Hebrew with instructionLocale", () => {
  test("vocabulary en_to_meaning remaps meanings to Spanish for es-419", () => {
    const raw = {
      question: 'מה פירוש המילה "dog"?',
      topic: "vocabulary",
      correctAnswer: "כלב",
      answers: ["כלב", "חתול", "ציפור", "דג"],
      params: {
        word: "dog",
        translation: "כלב",
          direction: "en_to_meaning",
          listKey: "animals",
          patternFamily: "vocab_translation",
          topic: "vocabulary",
        },
      };
      const out = localizeEnglishQuestionEn(raw, { instructionLocale: "es-419" });
      assert.match(out.question, /dog/);
      assert.match(out.question, /significa|significado/i);
      assert.equal(out.correctAnswer, "perro");
      assert.ok(out.answers.includes("perro"));
      assert.equal(out.params?.direction, "en_to_meaning");
      for (const s of collectStrings(out)) {
        assert.equal(HEBREW_RE.test(s), false, `Hebrew leak: ${s}`);
      }
    });

    test("vocabulary meaning_to_en uses Spanish cue, English answer for es-419", () => {
      const raw = {
        question: 'כתוב את המילה "כלב" באנגלית',
        topic: "vocabulary",
        correctAnswer: "dog",
        answers: ["dog", "cat", "bird", "fish"],
        params: {
          word: "כלב",
          translation: "dog",
          direction: "meaning_to_en",
          listKey: "animals",
          patternFamily: "vocab_recall_en",
          topic: "vocabulary",
        },
      };
      const out = localizeEnglishQuestionEn(raw, { instructionLocale: "es-419" });
      assert.match(out.question, /perro/);
      assert.equal(out.correctAnswer, "dog");
      assert.equal(out.params?.direction, "meaning_to_en");
      for (const s of collectStrings({
        question: out.question,
        correctAnswer: out.correctAnswer,
        answers: out.answers,
      })) {
        assert.equal(HEBREW_RE.test(s), false, `Hebrew leak: ${s}`);
      }
    });

    test("en instructionLocale never surfaces Hebrew in localized vocab", () => {
      const raw = {
        question: 'מה פירוש המילה "red"?',
        topic: "vocabulary",
        correctAnswer: "אדום",
        answers: ["אדום", "כחול", "צהוב", "ירוק"],
        params: {
          word: "red",
          translation: "אדום",
          direction: "en_to_meaning",
          listKey: "colors",
          patternFamily: "vocab_translation",
          topic: "vocabulary",
        },
      };
      const out = localizeEnglishQuestionEn(raw, { instructionLocale: "en" });
      assert.equal(out.correctAnswer, "red");
      for (const s of collectStrings(out)) {
        assert.equal(HEBREW_RE.test(s), false, `Hebrew leak: ${s}`);
      }
    });

    test("word board entries for es-419 are Spanish, never Hebrew", () => {
      const entries = getLocalizedWordEntries(["animals", "colors"], "es-419");
      assert.equal(entries.dog, "perro");
      assert.equal(entries.red, "rojo");
      for (const meaning of Object.values(entries)) {
        assert.equal(HEBREW_RE.test(meaning), false);
      }
    });

    test("word board for he instruction never returns Hebrew (Global)", () => {
      const entries = getLocalizedWordEntries(["animals"], "he");
      assert.equal(entries.dog, "dog");
      for (const meaning of Object.values(entries)) {
        assert.equal(HEBREW_RE.test(meaning), false, `Hebrew leak: ${meaning}`);
      }
    });

    test("generator emits en_to_meaning / meaning_to_en, never en_to_he", () => {
    const level = ENGLISH_LEVELS.easy || { name: "easy" };
    for (let i = 0; i < 12; i += 1) {
      const q = generateQuestion(level, "vocabulary", "g2", null, "easy", {
        instructionLocale: "en",
        interfaceLocale: "en",
        contentLocale: "en",
      });
      const dir = q.params?.direction;
      assert.ok(
        dir === "en_to_meaning" || dir === "meaning_to_en",
        `unexpected direction: ${dir}`
      );
      assert.notEqual(dir, "en_to_he");
      assert.notEqual(dir, "he_to_en");
      assert.ok(q.params?.localizedMeaning != null || q.params?.word);
    }
  });

  test("generator + es-419 instructionLocale produces no Hebrew in student fields", () => {
    const level = ENGLISH_LEVELS.easy || ENGLISH_LEVELS[1] || { name: "easy" };
    for (let i = 0; i < 8; i += 1) {
      const q = generateQuestion(level, "vocabulary", "g2", null, "easy", {
        instructionLocale: "es-419",
        interfaceLocale: "es-419",
        contentLocale: "en",
      });
      const fields = [
        q.question,
        q.questionLabel,
        q.exerciseText,
        q.correctAnswer,
        ...(Array.isArray(q.answers) ? q.answers : []),
        ...(Array.isArray(q.options) ? q.options : []),
      ];
      for (const s of fields) {
        if (typeof s !== "string") continue;
        assert.equal(HEBREW_RE.test(s), false, `Hebrew in generated field: ${s}`);
      }
    }
  });
});
