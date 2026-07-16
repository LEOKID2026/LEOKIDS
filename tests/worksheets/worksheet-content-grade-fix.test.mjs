/**
 * Worksheet content grade fix — Global EN product (no Hebrew cases).
 * Run: node --test tests/worksheets/worksheet-content-grade-fix.test.mjs
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  listWorksheetMathForcedKinds,
  isMathKindAllowedForGrade,
  pickWorksheetMathForcedKind,
} from "../../lib/worksheets/worksheet-math-kind-allowlist.js";
import { checkMathQuestionBounds } from "../../lib/worksheets/worksheet-math-content-bounds.server.js";
import { guardWorksheetQuestion } from "../../lib/worksheets/worksheet-content-guard.server.js";
import { selectMathWorksheetQuestions } from "../../lib/worksheets/worksheet-math-selector.server.js";
import { selectGeometryWorksheetQuestions } from "../../lib/worksheets/worksheet-geometry-selector.server.js";
import { selectEnglishWorksheetQuestions } from "../../lib/worksheets/worksheet-english-selector.server.js";
import { analyzePageUniformity } from "../../lib/worksheets/worksheet-page-consistency.server.js";
import { worksheetQuestionFingerprint } from "../../lib/worksheets/worksheet-question-fingerprint.server.js";
import { READY_WORKSHEET_CATALOG } from "../../lib/worksheets/worksheet-ready-catalog.js";

const HEBREW_RE = /[\u0590-\u05FF]/;

function assertNoHebrew(questions, label) {
  for (const q of questions) {
    const blob = [
      q.question,
      q.prompt,
      q.questionLabel,
      q.exerciseText,
      q.correctAnswer,
      ...(Array.isArray(q.answers) ? q.answers : []),
    ].join("\n");
    assert.equal(HEBREW_RE.test(blob), false, `${label}: Hebrew in ${blob.slice(0, 120)}`);
  }
}

describe("worksheet-content-grade-fix", () => {
  test("g5 horizontal_add_sub forced kinds exclude g1-only kinds", () => {
    const kinds = listWorksheetMathForcedKinds({
      formatId: "horizontal_add_sub",
      gradeKey: "g5",
      topicKey: "addition",
    });
    assert.ok(!kinds.includes("add_tens_only"));
    assert.ok(!kinds.includes("add_second_decade"));
    assert.ok(kinds.includes("add_two") || kinds.includes("add_three"));
  });

  test("g1 horizontal_add_sub excludes add_three", () => {
    const kinds = listWorksheetMathForcedKinds({
      formatId: "horizontal_add_sub",
      gradeKey: "g1",
      topicKey: "addition",
    });
    assert.ok(!kinds.includes("add_three"));
    assert.ok(kinds.includes("add_tens_only") || kinds.includes("add_second_decade"));
  });

  test("pickWorksheetMathForcedKind rotates only allowed kinds", () => {
    for (let i = 0; i < 20; i += 1) {
      const kind = pickWorksheetMathForcedKind("horizontal_add_sub", i, "g5", "addition");
      assert.ok(isMathKindAllowedForGrade(kind, "g5"));
    }
  });

  test("g5 addition seed=5 has no second-decade/tens-only easy items", () => {
    const { questions } = selectMathWorksheetQuestions({
      gradeKey: "g5",
      topicKey: "addition",
      levelKey: "medium",
      count: 12,
      seed: 5,
      mathPracticeFormat: "horizontal_add_sub",
    });
    assert.equal(questions.length, 12);
    for (const q of questions) {
      const kind = String(q.params?.kind || "");
      assert.ok(kind !== "add_tens_only", kind);
      assert.ok(kind !== "add_second_decade", kind);
    }
    const texts = questions.map((q) => String(q.question || ""));
    assert.ok(!texts.some((t) => /17\s*\+\s*1/.test(t)));
    assert.ok(!texts.some((t) => /10\s*\+\s*50/.test(t)));
    assertNoHebrew(questions, "g5 addition");
  });

  test("g5 addition page avoids extreme spread", () => {
    const { questions } = selectMathWorksheetQuestions({
      gradeKey: "g5",
      topicKey: "addition",
      levelKey: "medium",
      count: 12,
      seed: 5,
      mathPracticeFormat: "horizontal_add_sub",
    });
    const uni = analyzePageUniformity(questions, { subjectId: "math", topicKey: "addition" });
    assert.equal(uni.spreadExtreme, false, `ratio=${uni.ratio}`);
  });

  test("g1 addition horizontal excludes add_three", () => {
    const { questions } = selectMathWorksheetQuestions({
      gradeKey: "g1",
      topicKey: "addition",
      levelKey: "medium",
      count: 12,
      seed: 42,
      mathPracticeFormat: "horizontal_add_sub",
    });
    assert.ok(questions.every((q) => q.params?.kind !== "add_three"));
    assertNoHebrew(questions, "g1 addition");
  });

  test("numeric bounds flag too-easy g5 addition", () => {
    const bounds = checkMathQuestionBounds(
      { question: "17 + 1 = __", params: { kind: "add_two", a: 17, b: 1 }, a: 17, b: 1 },
      { gradeKey: "g5", topicKey: "addition", sourceDifficulty: "easy" }
    );
    assert.equal(bounds.ok, false);
  });

  test("fingerprint prevents duplicates", () => {
    const { questions } = selectMathWorksheetQuestions({
      gradeKey: "g5",
      topicKey: "addition",
      levelKey: "medium",
      count: 12,
      seed: 5,
      mathPracticeFormat: "horizontal_add_sub",
    });
    const fps = new Set(questions.map((q) => worksheetQuestionFingerprint(q, "math")));
    assert.equal(fps.size, 12);
  });

  test("guard rejects disallowed kind and silent fallback", () => {
    const bad = {
      question: "17 + 1 = __",
      correctAnswer: "18",
      subject: "math",
      topic: "addition",
      operation: "addition",
      gradeLevel: "g5",
      params: { kind: "add_second_decade", a: 17, b: 1 },
      a: 17,
      b: 1,
    };
    const result = guardWorksheetQuestion(bad, {
      subjectId: "math",
      gradeKey: "g5",
      topicKey: "addition",
      levelKey: "medium",
      sourceDifficulty: "medium",
      displayLevel: "regular",
      mathPracticeFormat: "horizontal_add_sub",
      seenFingerprints: new Set(),
      existingQuestions: [],
    });
    assert.equal(result.ok, false);
    assert.equal(result.reason, "KIND_NOT_ALLOWED_FOR_GRADE");

    const fallback = {
      ...bad,
      params: { kind: "add_two", a: 6000, b: 7000, gradeFallbackFromTopic: "g3" },
      question: "6000 + 7000 = __",
      correctAnswer: "13000",
      a: 6000,
      b: 7000,
    };
    const fb = guardWorksheetQuestion(fallback, {
      subjectId: "math",
      gradeKey: "g5",
      topicKey: "addition",
      levelKey: "medium",
      sourceDifficulty: "medium",
      displayLevel: "regular",
      mathPracticeFormat: "horizontal_add_sub",
      seenFingerprints: new Set(),
      existingQuestions: [],
    });
    assert.equal(fb.ok, false);
    assert.equal(fb.reason, "FALLBACK_POOL");
  });

  test("g6 writing passes counts 8/12/20", () => {
    for (const count of [8, 12, 20]) {
      const { questions } = selectEnglishWorksheetQuestions({
        gradeKey: "g6",
        topicKey: "writing",
        levelKey: "medium",
        count,
        seed: 42,
      });
      assert.equal(questions.length, count, `writing ${count}`);
      assertNoHebrew(questions, `writing ${count}`);
      for (const q of questions) {
        assert.ok(String(q.correctAnswer || "").trim());
      }
    }
  });

  test("g6 sentences passes count 20", () => {
    const { questions } = selectEnglishWorksheetQuestions({
      gradeKey: "g6",
      topicKey: "sentences",
      levelKey: "medium",
      count: 20,
      seed: 42,
    });
    assert.equal(questions.length, 20);
    assertNoHebrew(questions, "sentences 20");
    const fps = new Set(questions.map((q) => worksheetQuestionFingerprint(q, "english")));
    assert.equal(fps.size, 20);
  });

  test("geometry parallel_perpendicular hard passes g3/g4/g5 count=12", () => {
    for (const gradeKey of ["g3", "g4", "g5"]) {
      const { questions } = selectGeometryWorksheetQuestions({
        gradeKey,
        topicKey: "parallel_perpendicular",
        levelKey: "hard",
        count: 12,
        seed: 42,
      });
      assert.equal(questions.length, 12, gradeKey);
      assertNoHebrew(questions, `geometry ${gradeKey}`);
      for (const q of questions) {
        assert.ok(String(q.correctAnswer || "").trim(), `${gradeKey} missing answer`);
        assert.ok(String(q.question || "").trim(), `${gradeKey} missing stem`);
      }
    }
  });

  test("ready catalog entries still generate without Hebrew", () => {
    for (const entry of READY_WORKSHEET_CATALOG) {
      const subjectId = entry.subjectId;
      let questions;
      if (subjectId === "math") {
        ({ questions } = selectMathWorksheetQuestions({
          gradeKey: entry.gradeKey,
          topicKey: entry.topicKey,
          levelKey: entry.levelKey,
          count: entry.count,
          seed: 42,
          mathPracticeFormat: entry.mathPracticeFormat,
        }));
      } else if (subjectId === "geometry") {
        ({ questions } = selectGeometryWorksheetQuestions({
          gradeKey: entry.gradeKey,
          topicKey: entry.topicKey,
          levelKey: entry.levelKey,
          count: entry.count,
          seed: 42,
        }));
      } else if (subjectId === "english") {
        ({ questions } = selectEnglishWorksheetQuestions({
          gradeKey: entry.gradeKey,
          topicKey: entry.topicKey,
          levelKey: entry.levelKey,
          count: entry.count,
          seed: 42,
        }));
      } else {
        continue;
      }
      assert.ok(questions?.length >= entry.count, entry.id);
      assertNoHebrew(questions, entry.id);
    }
  });
});
