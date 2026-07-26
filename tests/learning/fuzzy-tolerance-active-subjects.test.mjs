import { test } from "node:test";
import assert from "node:assert/strict";

import { classifyStructuralAddSubError } from "../../lib/learning/fuzzy-tolerance.js";
import { classifyStructuralMulDivError } from "../../lib/learning/fuzzy-tolerance-muldiv.js";
import { classifyCoreOpsAnswer } from "../../lib/learning/fuzzy-tolerance-core-ops.js";
import { classifyGeometryAnswer } from "../../lib/learning/fuzzy-tolerance-geometry.js";
import { classifyFractionAnswer } from "../../lib/learning/fuzzy-tolerance-fractions.js";
import { classifyEnglishAnswer } from "../../lib/learning/fuzzy-tolerance-english.js";
import { classifyScienceAnswer } from "../../lib/learning/fuzzy-tolerance-science.js";
import { classifyAnswerEvidence } from "../../lib/learning/classifiers/index.js";

// Focused smoke tests for the ported active-subject fuzzy-tolerance modules
// (math, geometry, english, science). These verify the ported modules run
// end-to-end without throwing and emit a real hit for genuine near-miss
// errors, without asserting the full LIOSH TEP catalogue.

test("classifyStructuralAddSubError proves a forgotten-carry near miss on addition", () => {
  const hit = classifyStructuralAddSubError({
    kind: "add_two",
    a: 299,
    b: 1,
    userAnswer: 299,
    expectedAnswer: 300,
  });
  assert.ok(hit, "expected a structural add/sub hit");
  assert.equal(typeof hit.tag, "string");
  assert.ok(hit.tag.length > 0);
});

test("classifyStructuralAddSubError returns null for a random far-off wrong answer", () => {
  const hit = classifyStructuralAddSubError({
    kind: "add_two",
    a: 12,
    b: 5,
    userAnswer: 999,
    expectedAnswer: 17,
  });
  assert.equal(hit, null);
});

test("classifyStructuralMulDivError proves a near miss on multiplication", () => {
  const hit = classifyStructuralMulDivError({
    kind: "mul",
    a: 6,
    b: 7,
    userAnswer: 41,
    expectedAnswer: 42,
  });
  assert.ok(hit, "expected a structural mul/div hit");
  assert.equal(typeof hit.tag, "string");
});

test("classifyCoreOpsAnswer proves a rounding-direction error", () => {
  const hit = classifyCoreOpsAnswer({
    kind: "round",
    n: 47,
    toWhat: 10,
    userAnswer: 40,
    expectedAnswer: 50,
  });
  assert.ok(hit, "expected a rounding-direction hit");
  assert.equal(hit.tag, "rounding_direction_error");
});

test("classifyGeometryAnswer proves a near miss on rectangle area", () => {
  const hit = classifyGeometryAnswer({
    kind: "rect_area",
    a: 5,
    b: 4,
    userAnswer: 19,
    expectedAnswer: 20,
  });
  assert.ok(hit, "expected a geometry near-miss hit");
  assert.equal(typeof hit.tag, "string");
});

test("classifyFractionAnswer returns null for a non-fraction kind (no false positives)", () => {
  const hit = classifyFractionAnswer({
    kind: "add_two",
    userAnswer: 5,
    expectedAnswer: 6,
  });
  assert.equal(hit, null);
});

test("classifyEnglishAnswer proves a one-letter spelling slip", () => {
  const hit = classifyEnglishAnswer({
    userAnswer: "cot",
    expectedAnswer: "cat",
  });
  assert.ok(hit, "expected an English spelling hit");
  assert.equal(hit.tag, "spelling_error");
  assert.ok(hit.evidenceType);
});

test("classifyScienceAnswer proves a one-letter concept-spelling slip when spelling gate is set", () => {
  const hit = classifyScienceAnswer({
    checkSpelling: true,
    userAnswer: "atoms",
    expectedAnswer: "atom",
  });
  assert.ok(hit, "expected a science spelling hit");
  assert.equal(hit.tag, "concept_confusion");
});

test("classifyScienceAnswer returns null without the spelling gate (0 FP on plain typed text)", () => {
  const hit = classifyScienceAnswer({
    userAnswer: "atoms",
    expectedAnswer: "atom",
  });
  assert.equal(hit, null);
});

test("classifyAnswerEvidence wires the geometry fuzzy fallback end-to-end", () => {
  const evidence = classifyAnswerEvidence({
    subject: "geometry",
    topic: "area",
    question: { kind: "rect_area", params: { a: 5, b: 4 }, correctAnswer: 20 },
    userAnswer: 19,
    expectedAnswer: 20,
    isCorrect: false,
  });
  assert.ok(evidence, "expected classifyAnswerEvidence to produce evidence");
  assert.equal(typeof evidence.detectedMisconception, "string");
  assert.ok(evidence.detectedMisconception.length > 0);
});

test("classifyAnswerEvidence wires the math structural fallback end-to-end", () => {
  const evidence = classifyAnswerEvidence({
    subject: "math",
    topic: "addition",
    question: { kind: "add_two", params: { a: 299, b: 1 }, correctAnswer: 300 },
    userAnswer: 299,
    expectedAnswer: 300,
    isCorrect: false,
  });
  assert.ok(evidence, "expected classifyAnswerEvidence to produce evidence");
  assert.equal(typeof evidence.detectedMisconception, "string");
  assert.ok(evidence.detectedMisconception.length > 0);
});

test("classifyAnswerEvidence does not throw for english/science subjects with no match", () => {
  assert.doesNotThrow(() => {
    classifyAnswerEvidence({
      subject: "english",
      question: { kind: "spelling", params: {}, correctAnswer: "hello" },
      userAnswer: "goodbye",
      expectedAnswer: "hello",
      isCorrect: false,
    });
  });
  assert.doesNotThrow(() => {
    classifyAnswerEvidence({
      subject: "science",
      question: { kind: "typed", params: {}, correctAnswer: "gravity" },
      userAnswer: "friction",
      expectedAnswer: "gravity",
      isCorrect: false,
    });
  });
});
