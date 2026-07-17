/**
 * Global worksheets LTR direction, English stems, and print column order.
 * Run: node --test tests/worksheets/worksheet-global-ltr-direction.test.mjs
 */

import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildWorksheetPayload,
  buildAnswerKeyPayload,
  worksheetPayloadToPreviewHtml,
  answerKeyPayloadToPreviewHtml,
} from "../../lib/worksheets/worksheet-payload-build.server.js";
import { toPrintableWorksheetQuestion } from "../../lib/worksheets/worksheet-question-sanitize.server.js";
import { buildMathPrintPageRows } from "../../lib/worksheets/worksheet-print-layout.js";
import { selectMathWorksheetQuestions } from "../../lib/worksheets/worksheet-math-selector.server.js";
import { localizeEnglishQuestionEn } from "../../utils/learning-content-en/english.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRINT_CSS = readFileSync(join(__dirname, "../../styles/worksheet-print.css"), "utf8");
const HUB_CSS = readFileSync(join(__dirname, "../../styles/worksheet-hub.css"), "utf8");

const ENGLISH_META = {
  titleHe: "English worksheet",
  subjectHe: "English",
  gradeHe: "Grade 5",
  topicHe: "Vocabulary",
  levelHe: "Regular",
  inkSave: false,
  subjectId: "english",
};

const MATH_META = {
  titleHe: "Math worksheet",
  subjectHe: "Math",
  gradeHe: "Grade 3",
  topicHe: "Addition",
  levelHe: "Regular",
  inkSave: false,
  subjectId: "math",
};

const WRITING_RAW = {
  question: 'כתוב את המילה "break" באנגלית',
  correctAnswer: "break",
  topic: "writing",
  subject: "english",
  params: {
    type: "word",
    wordEn: "break",
    direction: "cue_to_en",
    patternFamily: "writing_word",
  },
};

const VOCAB_RAW = {
  question: 'מה פירוש המילה "bridge"?',
  answers: ["bridge", "river", "road", "tunnel"],
  correctAnswer: "bridge",
  topic: "vocabulary",
  subject: "english",
  params: {
    direction: "en_to_he",
    word: "bridge",
    translation: "גשר",
    patternFamily: "vocab_translation",
  },
};

function assertNoRtlInActiveCss(css, label) {
  assert.equal(
    /direction\s*:\s*rtl/i.test(css),
    false,
    `${label} must not set direction: rtl`
  );
  assert.equal(
    /flex-direction\s*:\s*row-reverse/i.test(css),
    false,
    `${label} must not use row-reverse`
  );
  assert.equal(
    /flex-direction\s*:\s*column-reverse/i.test(css),
    false,
    `${label} must not use column-reverse`
  );
}

function extractQuestionIndexes(html) {
  const matches = [...html.matchAll(/data-index="(\d+)"/g)].map((m) => Number(m[1]));
  return matches;
}

function extractMathTableRowPairs(html) {
  const rows = [];
  for (const rowMatch of html.matchAll(/<tr>([\s\S]*?)<\/tr>/g)) {
    const indexes = [...rowMatch[1].matchAll(/data-index="(\d+)"/g)].map((m) =>
      Number(m[1])
    );
    if (indexes.length) rows.push(indexes);
  }
  return rows;
}

describe("worksheet-global-ltr-direction", () => {
  test("print CSS root is LTR and print media has no RTL flips", () => {
    assert.match(PRINT_CSS, /\.worksheet-root\s*\{[^}]*direction:\s*ltr/s);
    assertNoRtlInActiveCss(PRINT_CSS, "worksheet-print.css");
    const printBlock = PRINT_CSS.slice(PRINT_CSS.indexOf("@media print"));
    assertNoRtlInActiveCss(printBlock, "@media print");
  });

  test("screen preview CSS forces LTR", () => {
    assert.match(HUB_CSS, /\.worksheet-screen-preview\s*\{[^}]*direction:\s*ltr/s);
    assertNoRtlInActiveCss(HUB_CSS, "worksheet-hub.css");
  });

  test("generated worksheet HTML is lang=en dir=ltr without rtl attrs", () => {
    const payload = buildWorksheetPayload([VOCAB_RAW, WRITING_RAW], ENGLISH_META, {
      subjectId: "english",
    });
    const html = worksheetPayloadToPreviewHtml(payload);
    assert.match(html, /<html[^>]*lang="en"[^>]*dir="ltr"/);
    assert.match(html, /<body[^>]*dir="ltr"/);
    assert.equal(html.includes('dir="rtl"'), false);
    assert.equal(/direction:\s*rtl/i.test(html), false);
  });

  test("English writing stem is instruction-first with quoted word", () => {
    const printable = toPrintableWorksheetQuestion(WRITING_RAW, {
      displayIndex: 1,
      subject: "english",
    });
    assert.equal(printable.stemHe, 'Write the English word: "break"');
    assert.equal(printable.stemHe.includes('"break"Write'), false);
  });

  test("English vocabulary stem places quoted word after What does", () => {
    const printable = toPrintableWorksheetQuestion(VOCAB_RAW, {
      displayIndex: 1,
      subject: "english",
    });
    assert.equal(
      printable.stemHe,
      'What does "bridge" mean? Choose the best English match.'
    );
    assert.equal(printable.stemHe.includes('"bridge"What'), false);
  });

  test("localizeEnglishQuestionEn rebuilds both writing and vocabulary stems", () => {
    const writing = localizeEnglishQuestionEn(WRITING_RAW);
    const vocab = localizeEnglishQuestionEn(VOCAB_RAW);
    assert.equal(writing.question, 'Write the English word: "break"');
    assert.equal(
      vocab.question,
      'What does "bridge" mean? Choose the best English match.'
    );
  });

  test("HTML labels use Options:/Answer:/Name:/Date: without leading colon", () => {
    const payload = buildWorksheetPayload([VOCAB_RAW], ENGLISH_META, {
      subjectId: "english",
    });
    const html = worksheetPayloadToPreviewHtml(payload);
    assert.match(html, />Options:</);
    assert.match(html, /Name:\s*_/);
    assert.match(html, /Date:\s*_/);
    assert.match(html, /Question\s*<span class="worksheet-question-number">1<\/span>/);
    assert.equal(html.includes(":Options"), false);
    assert.equal(html.includes(":Answer"), false);
    assert.equal(html.includes(":Name"), false);
    assert.equal(html.includes(":Date"), false);
    assert.match(html, /A\.<\/span>/);
    assert.match(html, /B\.<\/span>/);
    assert.match(html, /C\.<\/span>/);
    assert.match(html, /D\.<\/span>/);
  });

  test("math print DOM order is 1 left then 2 right for count 8 and 20", () => {
    for (const count of [8, 20]) {
      const { questions } = selectMathWorksheetQuestions({
        gradeKey: "g3",
        topicKey: "addition",
        levelKey: "medium",
        count,
        seed: 4242 + count,
        mathPracticeFormat: "horizontal_add_sub",
      });
      assert.equal(questions.length, count);
      const payload = buildWorksheetPayload(questions, MATH_META, {
        subjectId: "math",
        mathPracticeFormat: "horizontal_add_sub",
        gradeKey: "g3",
        topicKey: "addition",
      });
      assert.equal(payload.questions.length, count);
      const html = worksheetPayloadToPreviewHtml(payload);
      const indexes = extractQuestionIndexes(html);
      assert.deepEqual(
        indexes,
        Array.from({ length: count }, (_, i) => i + 1),
        `count=${count} data-index order`
      );
      const pairs = extractMathTableRowPairs(html);
      assert.ok(pairs.length >= 2, `count=${count} has math table rows`);
      assert.deepEqual(pairs[0], [1, 2], `count=${count} first row LTR`);
      assert.deepEqual(pairs[1], [3, 4], `count=${count} second row LTR`);

      const rows = buildMathPrintPageRows(payload.questions.slice(0, 4));
      assert.equal(rows[0][0].displayIndex, 1);
      assert.equal(rows[0][1].displayIndex, 2);
      assert.equal(rows[1][0].displayIndex, 3);
      assert.equal(rows[1][1].displayIndex, 4);

      assert.match(html, /dir="ltr"/);
      assert.ok(
        /[\d]+\s*[+\-×÷]\s*[\d]+/.test(html) || html.includes("worksheet-math-ltr"),
        `count=${count} keeps math LTR markers`
      );
    }
  });

  test("screen preview payload and print HTML share the same question order", () => {
    const { questions } = selectMathWorksheetQuestions({
      gradeKey: "g3",
      topicKey: "addition",
      levelKey: "medium",
      count: 8,
      seed: 9090,
      mathPracticeFormat: "horizontal_add_sub",
    });
    const payload = buildWorksheetPayload(questions, MATH_META, {
      subjectId: "math",
      mathPracticeFormat: "horizontal_add_sub",
      gradeKey: "g3",
      topicKey: "addition",
    });
    const htmlIndexes = extractQuestionIndexes(worksheetPayloadToPreviewHtml(payload));
    const modelIndexes = payload.questions.map((q) => q.displayIndex);
    assert.deepEqual(htmlIndexes, modelIndexes);
    assert.deepEqual(modelIndexes, [1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test("answer key stays 1..N with Answer N labels and LTR html", () => {
    const raw = [VOCAB_RAW, WRITING_RAW].map((q, i) => ({ ...q, _i: i }));
    const answerKey = buildAnswerKeyPayload(raw, ENGLISH_META, { subjectId: "english" });
    assert.deepEqual(
      answerKey.answers.map((a) => a.displayIndex),
      [1, 2]
    );
    const html = answerKeyPayloadToPreviewHtml(answerKey);
    assert.match(html, /<html[^>]*lang="en"[^>]*dir="ltr"/);
    assert.match(html, /Answer\s*<span class="worksheet-question-number">1<\/span>/);
    assert.match(html, /Answer\s*<span class="worksheet-question-number">2<\/span>/);
    assert.equal(html.includes('dir="rtl"'), false);
  });
});
