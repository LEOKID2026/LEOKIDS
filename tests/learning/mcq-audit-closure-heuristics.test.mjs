import test from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const root = join(import.meta.dirname, "..", "..");
const href = (rel) => pathToFileURL(join(root, rel)).href;

const { detectMcqObviousAnswerRisks } = await import(
  href("scripts/qa/lib/mcq-obvious-answer-risk.mjs")
);

test("Hebrew negation antonym MCQ is not flagged for hebPrefix format outlier", () => {
  const q = {
    question: "  ?",
    answers: [" ", "", "", ""],
    correctIndex: 0,
  };
  const risks = detectMcqObviousAnswerRisks(q, {
    subject: "moledet_geography",
    stem: q.question,
  }).filter((r) => r.category === "B_format_outlier");
  assert.equal(risks.length, 0);
});

test("Binary true/false Hebrew MCQ is not flagged for format outlier", () => {
  const q = {
    question: "   .    ?",
    answers: ["", " "],
    correctIndex: 1,
  };
  const risks = detectMcqObviousAnswerRisks(q, {
    subject: "science",
    stem: q.question,
  }).filter((r) => r.severity === "WARN" || r.severity === "FAIL");
  assert.equal(risks.length, 0);
});

test("Short Hebrew vocabulary MCQ is not flagged for hebPrefix outlier", () => {
  const q = {
    question: "    ?",
    answers: ["", "", "", ""],
    correctIndex: 0,
  };
  const risks = detectMcqObviousAnswerRisks(q, {
    subject: "science",
    stem: q.question,
  }).filter((r) => r.category === "B_format_outlier");
  assert.equal(risks.length, 0);
});

test("NaN distractor generator artifact is not flagged for numeric plausibility WARN", () => {
  const q = {
    answers: ["1 3/4", "NaN/4", "4/NaN", "NaN/5"],
    correctIndex: 0,
  };
  const risks = detectMcqObviousAnswerRisks(q, {
    subject: "math",
    stem: "Choose the mixed number",
  }).filter((r) => r.category === "E_numeric_plausibility");
  assert.equal(risks.length, 0);
});

test("Hebrew stem substring does not leak when answer is embedded in another word", async () => {
  const { detectStemLeak } = await import(href("lib/learning/question-engine-metadata.js"));
  assert.equal(detectStemLeak("   ?", ""), false);
  assert.equal(detectStemLeak("  ?", ""), false);
});

test("plain MCQ option text is not an option_label_prefix leak", async () => {
  const { detectStemLeak } = await import(href("lib/learning/question-engine-metadata.js"));
  const { mcqCellLabel, mcqCellValue } = await import(href("utils/mcq-option-cell.js"));
  const answers = ["", "", "", ""];
  const correct = "";
  for (let i = 0; i < answers.length; i++) {
    const label = mcqCellLabel(answers[i]);
    const value = String(mcqCellValue(answers[i]) ?? "");
    const isExplicitLabel = label && label !== value;
    if (!isExplicitLabel) {
      assert.equal(detectStemLeak(label, correct), label === correct);
    }
  }
});

test("math expression operand is not a stem leak for evaluate-expression items", async () => {
  const { detectStemLeak } = await import(href("lib/learning/question-engine-metadata.js"));
  assert.equal(detectStemLeak("   23 + 0?", "23"), false);
  assert.equal(detectStemLeak("  50 + __ = 100.   ?", "50"), false);
  assert.equal(detectStemLeak("__ × 473 = 223729", "473"), false);
});

test("factor subject number is not a stem leak", async () => {
  const { detectStemLeak } = await import(href("lib/learning/question-engine-metadata.js"));
  assert.equal(detectStemLeak("     ()  16?", "16"), false);
});

test("true/false stem does not leak multi-word  ", async () => {
  const { detectStemLeak } = await import(href("lib/learning/question-engine-metadata.js"));
  assert.equal(
    detectStemLeak("     .    ?", " "),
    false
  );
});

test("Hebrew reading passage overlap is not a stem leak", async () => {
  const { detectStemLeak } = await import(href("lib/learning/question-engine-metadata.js"));
  assert.equal(
    detectStemLeak(
      ": '      .'   ?",
      "  ( )  "
    ),
    false
  );
});

test("English quantifier grammar cloze is not flagged for article format outlier", () => {
  const q = {
    question: 'Choose the correct option: "We have ___ homework today"',
    answers: ["a few", "much", "many", "little"],
    correctIndex: 0,
  };
  const risks = detectMcqObviousAnswerRisks(q, {
    subject: "english",
    stem: q.question,
  }).filter((r) => r.category === "B_format_outlier");
  assert.equal(risks.length, 0);
});

test("Perpendicular 90° concept MCQ is not flagged for numeric plausibility", () => {
  const q = {
    question: "     -  ?",
    answers: [
      "    90°",
      "  ",
      "   ",
      "   ",
    ],
    correctIndex: 0,
  };
  const risks = detectMcqObviousAnswerRisks(q, {
    subject: "geometry",
    stem: q.question,
  }).filter((r) => r.category === "E_numeric_plausibility");
  assert.equal(risks.length, 0);
});

test("Hebrew odd-one-out colon list is not a stem leak", async () => {
  const { detectStemLeak } = await import(href("lib/learning/question-engine-metadata.js"));
  assert.equal(
    detectStemLeak("    : , , , ?", ""),
    false
  );
});

test("Hebrew G2 read-sentence stem with quoted passage is not a stem leak", async () => {
  const { detectStemLeak } = await import(href("lib/learning/question-engine-metadata.js"));
  assert.equal(
    detectStemLeak("  : '   '", "   "),
    false
  );
});

test("Hebrew quoted reading body after display split is not a stem leak", async () => {
  const { detectStemLeak } = await import(href("lib/learning/question-engine-metadata.js"));
  const { isEquationLikeText } = await import(href("utils/student-question-display.js"));
  const bodyParen = "'  ' ( 28 )";
  const bodyDot = "'  ' ·  28";
  assert.equal(isEquationLikeText(bodyParen), false);
  assert.equal(isEquationLikeText(bodyDot), false);
  assert.equal(detectStemLeak(bodyParen, "  "), false);
  assert.equal(detectStemLeak(bodyDot, "  "), false);
});

test("Hebrew pronoun reference in quoted sentence is not a stem leak", async () => {
  const { detectStemLeak } = await import(href("lib/learning/question-engine-metadata.js"));
  assert.equal(
    detectStemLeak(
      "'       .'    ''?",
      ""
    ),
    false
  );
});

test("Decimal round-to-whole MCQ is not flagged for digit-count outlier", () => {
  const q = {
    answers: ["2.00", "1.99", "2.02", "2.01"],
    correctIndex: 0,
  };
  const risks = detectMcqObviousAnswerRisks(q, {
    subject: "math",
    stem: "Round to the nearest whole number",
  }).filter((r) => r.category === "E_numeric_plausibility");
  assert.equal(risks.length, 0);
});
