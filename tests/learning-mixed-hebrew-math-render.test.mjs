import assert from "node:assert/strict";
import test from "node:test";
import {
  parseStepExplanationThreeLines,
  splitLearningMixedHebrewMathRuns,
} from "../utils/learning-mixed-rtl-math-render.js";

test("parses addition step into three separate lines", () => {
  const blocks = parseStepExplanationThreeLines(
    "\u05DE\u05D7\u05D1\u05E8\u05D9\u05DD \u05D0\u05EA \u05E1\u05E4\u05E8\u05EA \u05D4\u05DE\u05D0\u05D5\u05EA: 1 + 8 = 9. \u05DB\u05D5\u05EA\u05D1\u05D9\u05DD 9 \u05D1\u05E2\u05DE\u05D5\u05D3\u05EA \u05D4\u05DE\u05D0\u05D5\u05EA."
  );
  assert.deepEqual(blocks, {
    instruction: "\u05DE\u05D7\u05D1\u05E8\u05D9\u05DD \u05D0\u05EA \u05E1\u05E4\u05E8\u05EA \u05D4\u05DE\u05D0\u05D5\u05EA:",
    equation: "1 + 8 = 9",
    explanation: "\u05DB\u05D5\u05EA\u05D1\u05D9\u05DD 9 \u05D1\u05E2\u05DE\u05D5\u05D3\u05EA \u05D4\u05DE\u05D0\u05D5\u05EA.",
  });
});

test("parses carry addition step", () => {
  const blocks = parseStepExplanationThreeLines(
    "\u05DE\u05D7\u05D1\u05E8\u05D9\u05DD \u05D0\u05EA \u05E1\u05E4\u05E8\u05EA \u05D4\u05E2\u05E9\u05E8\u05D5\u05EA: 4 + 5 + 1 = 10. \u05DB\u05D5\u05EA\u05D1\u05D9\u05DD 0 \u05D1\u05E2\u05DE\u05D5\u05D3\u05EA \u05D4\u05E2\u05E9\u05E8\u05D5\u05EA \u05D5\u05DE\u05E2\u05D1\u05D9\u05E8\u05D9\u05DD 1 \u05DC\u05E2\u05DE\u05D5\u05D3\u05D4 \u05D4\u05D1\u05D0\u05D4."
  );
  assert.equal(blocks?.equation, "4 + 5 + 1 = 10");
  assert.equal(blocks?.instruction, "\u05DE\u05D7\u05D1\u05E8\u05D9\u05DD \u05D0\u05EA \u05E1\u05E4\u05E8\u05EA \u05D4\u05E2\u05E9\u05E8\u05D5\u05EA:");
  assert.match(blocks?.explanation || "", /^\u05DB\u05D5\u05EA\u05D1\u05D9\u05DD 0/);
});

test("parses alternate column-addition wording", () => {
  const blocks = parseStepExplanationThreeLines(
    "\u05DE\u05D7\u05D1\u05E8\u05D9\u05DD \u05D1\u05E2\u05DE\u05D5\u05D3\u05EA \u05D4\u05DE\u05D0\u05D5\u05EA: 6 + 2 = 8. \u05DB\u05D5\u05EA\u05D1\u05D9\u05DD 8 \u05D1\u05E2\u05DE\u05D5\u05D3\u05EA \u05D4\u05DE\u05D0\u05D5\u05EA."
  );
  assert.equal(blocks?.equation, "6 + 2 = 8");
  assert.equal(blocks?.explanation, "\u05DB\u05D5\u05EA\u05D1\u05D9\u05DD 8 \u05D1\u05E2\u05DE\u05D5\u05D3\u05EA \u05D4\u05DE\u05D0\u05D5\u05EA.");
});

test("parses subtraction step with \u05D5\u05DB\u05D5\u05EA\u05D1\u05D9\u05DD connector", () => {
  const blocks = parseStepExplanationThreeLines(
    "\u05DB\u05E2\u05EA \u05DE\u05D7\u05E9\u05D1\u05D9\u05DD \u05D1\u05E2\u05DE\u05D5\u05D3\u05EA \u05D4\u05D0\u05D7\u05D3\u05D5\u05EA: 5 - 3 = 2 \u05D5\u05DB\u05D5\u05EA\u05D1\u05D9\u05DD 2 \u05D1\u05E2\u05DE\u05D5\u05D3\u05D4 \u05D6\u05D5."
  );
  assert.equal(blocks?.equation, "5 - 3 = 2");
  assert.equal(blocks?.explanation, "\u05DB\u05D5\u05EA\u05D1\u05D9\u05DD 2 \u05D1\u05E2\u05DE\u05D5\u05D3\u05D4 \u05D6\u05D5.");
});

test("inline fallback still keeps full equation before Hebrew explanation", () => {
  const runs = splitLearningMixedHebrewMathRuns(
    "6 + 2 = 8. \u05DB\u05D5\u05EA\u05D1\u05D9\u05DD 8 \u05D1\u05E2\u05DE\u05D5\u05D3\u05EA \u05D4\u05DE\u05D0\u05D5\u05EA."
  );
  assert.equal(runs[0].type, "math");
  assert.equal(runs[0].value, "6 + 2 = 8");
});
