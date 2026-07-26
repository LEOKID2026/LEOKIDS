import { test } from "node:test";
import assert from "node:assert/strict";

import {
  resolveEnglishTopicStatus,
  parentTopicDisplayChromeEn,
  parentTopicDisplayChromeFromRow,
} from "../../utils/parent-report-surface/parent-topic-display-chrome.js";
import {
  parentFacingErrorPatternLabel,
  parentFacingErrorPatternMeaning,
} from "../../utils/learning-pattern-decision/parent-facing-error-pattern.js";
import { PROVEN_FACTUAL_PARENT_LABEL_EN } from "../../utils/learning-pattern-decision/parent-facing-error-pattern-factual.js";
import { buildFactualObservations } from "../../utils/learning-pattern-decision/build-factual-observations.js";
import { applyLearningPatternDecisionToUnitsAndRows } from "../../utils/learning-pattern-decision/apply-learning-pattern-decision.js";
import { learningPatternDecisionsMatch } from "../../utils/learning-pattern-decision/compare-short-detailed-findings.js";

const HEBREW_RE = /[\u0590-\u05FF]/;

// ── Topic status matrix (product policy) ──────────────────────────────────

test("resolveEnglishTopicStatus: <5 questions is always insufficient_data, regardless of accuracy", () => {
  assert.equal(resolveEnglishTopicStatus({ questions: 0, accuracy: 100 }), "insufficient_data");
  assert.equal(resolveEnglishTopicStatus({ questions: 4, accuracy: 100 }), "insufficient_data");
  assert.equal(resolveEnglishTopicStatus({ questions: 4, accuracy: 0 }), "insufficient_data");
});

test("resolveEnglishTopicStatus: 5-9 questions matrix", () => {
  assert.equal(resolveEnglishTopicStatus({ questions: 5, accuracy: 70 }), "early_direction_only");
  assert.equal(resolveEnglishTopicStatus({ questions: 9, accuracy: 100 }), "early_direction_only");
  assert.equal(resolveEnglishTopicStatus({ questions: 6, accuracy: 69 }), "topic_needs_strengthening");
  assert.equal(resolveEnglishTopicStatus({ questions: 6, accuracy: 50 }), "topic_needs_strengthening");
  assert.equal(resolveEnglishTopicStatus({ questions: 7, accuracy: 49 }), "clear_topic_gap");
  assert.equal(resolveEnglishTopicStatus({ questions: 7, accuracy: 0 }), "clear_topic_gap");
});

test("resolveEnglishTopicStatus: >=10 questions matrix", () => {
  assert.equal(resolveEnglishTopicStatus({ questions: 10, accuracy: 90 }), "mastery_stable");
  assert.equal(resolveEnglishTopicStatus({ questions: 40, accuracy: 100 }), "mastery_stable");
  assert.equal(resolveEnglishTopicStatus({ questions: 10, accuracy: 89 }), "partial_stable");
  assert.equal(resolveEnglishTopicStatus({ questions: 10, accuracy: 70 }), "partial_stable");
  assert.equal(resolveEnglishTopicStatus({ questions: 10, accuracy: 69 }), "topic_needs_strengthening");
  assert.equal(resolveEnglishTopicStatus({ questions: 10, accuracy: 50 }), "topic_needs_strengthening");
  assert.equal(resolveEnglishTopicStatus({ questions: 10, accuracy: 49 }), "clear_topic_gap");
  assert.equal(resolveEnglishTopicStatus({ questions: 10, accuracy: 0 }), "clear_topic_gap");
});

test("parentTopicDisplayChromeEn: insufficient_data never claims mastery/excellent", () => {
  const chrome = parentTopicDisplayChromeEn("insufficient_data");
  assert.equal(chrome.excellent, false);
  assert.doesNotMatch(chrome.badgeTextEn, /excellent|good/i);
  assert.equal(chrome.insufficientData, true);
});

test("parentTopicDisplayChromeEn: reuses existing theme tones (ok/warn/risk/neutral/sky)", () => {
  const tones = [
    parentTopicDisplayChromeEn("mastery_stable").tone,
    parentTopicDisplayChromeEn("partial_stable").tone,
    parentTopicDisplayChromeEn("topic_needs_strengthening").tone,
    parentTopicDisplayChromeEn("clear_topic_gap").tone,
    parentTopicDisplayChromeEn("early_direction_only").tone,
    parentTopicDisplayChromeEn("insufficient_data").tone,
  ];
  for (const tone of tones) {
    assert.ok(["ok", "warn", "risk", "neutral", "sky"].includes(tone), `unexpected tone: ${tone}`);
  }
});

test("parentTopicDisplayChromeFromRow: derives status from row metrics and never leaks Hebrew or 'unknown'", () => {
  const row = { questions: 3, accuracy: 20 };
  const chrome = parentTopicDisplayChromeFromRow(row);
  assert.equal(chrome.topicStatus, "insufficient_data");
  assert.doesNotMatch(chrome.badgeTextEn, HEBREW_RE);
  assert.notEqual(chrome.badgeTextEn.toLowerCase(), "unknown");
});

// ── Factual label preference in parent-facing-error-pattern.js ────────────

test("parentFacingErrorPatternLabel prefers the factual EN label for an approved/proven tag", () => {
  const label = parentFacingErrorPatternLabel("place_value_error");
  assert.equal(label, PROVEN_FACTUAL_PARENT_LABEL_EN.place_value_error);
  assert.doesNotMatch(label, /may be|confusion/i);
});

test("parentFacingErrorPatternMeaning avoids hedgy wording for a proven tag", () => {
  const meaning = parentFacingErrorPatternMeaning("place_value_error");
  assert.doesNotMatch(meaning, /may be|foundational mix-up/i);
  assert.match(meaning, new RegExp(PROVEN_FACTUAL_PARENT_LABEL_EN.place_value_error.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("parentFacingErrorPatternLabel keeps the interpretive wording for non-proven pattern-family keys", () => {
  const label = parentFacingErrorPatternLabel("conceptual_error");
  assert.match(label, /foundational mix-up/i);
});

test("parentFacingErrorPatternLabel resolves other approved factual tags not in the legacy map", () => {
  const label = parentFacingErrorPatternLabel("calculation_off_by_one");
  assert.equal(label, PROVEN_FACTUAL_PARENT_LABEL_EN.calculation_off_by_one);
});

test("no factual label anywhere in the approved map is Hebrew or literally 'unknown'", () => {
  for (const [tag, label] of Object.entries(PROVEN_FACTUAL_PARENT_LABEL_EN)) {
    assert.doesNotMatch(String(label), HEBREW_RE, `Hebrew leaked in label for ${tag}`);
    assert.notEqual(String(label).trim().toLowerCase(), "unknown", `'unknown' leaked for ${tag}`);
  }
});

// ── Short/detailed parity for factualObservations ─────────────────────────

test("learningPatternDecisionsMatch treats identical factualObservations as matching", () => {
  const obs = buildFactualObservations({
    wrongEvents: [
      { isCorrect: false, patternKey: "mt:place_value_error", sessionId: "s1", timestampMs: 1000 },
      { isCorrect: false, patternKey: "mt:place_value_error", sessionId: "s1", timestampMs: 2000 },
    ],
    totalQuestions: 10,
    totalErrors: 2,
  });
  const shortLpd = { topicStatus: "topic_needs_strengthening", factualObservations: obs };
  const detailedLpd = { topicStatus: "topic_needs_strengthening", factualObservations: obs.map((o) => ({ ...o })) };
  assert.equal(learningPatternDecisionsMatch(shortLpd, detailedLpd), true);
});

test("learningPatternDecisionsMatch flags a mismatch when factualObservations differ", () => {
  const shortLpd = {
    topicStatus: "topic_needs_strengthening",
    factualObservations: [{ canonicalKey: "place_value_error", label: "a place value slip", count: 3, recurrenceLevel: "repeated" }],
  };
  const detailedLpd = {
    topicStatus: "topic_needs_strengthening",
    factualObservations: [],
  };
  assert.equal(learningPatternDecisionsMatch(shortLpd, detailedLpd), false);
});

// ── applyLearningPatternDecisionToUnitsAndRows wires topicDisplayChrome + factualObservations ──

test("applyLearningPatternDecisionToUnitsAndRows attaches topicDisplayChrome + factualObservations to practiced rows", () => {
  const maps = {
    math: {
      "add_two::grade:1": { questions: 12, correct: 11, wrong: 1, accuracy: 92 },
    },
  };
  applyLearningPatternDecisionToUnitsAndRows({ diagnosticEngineV2: null, maps });
  const row = maps.math["add_two::grade:1"];
  assert.ok(row.topicDisplayChrome, "expected topicDisplayChrome to be attached");
  assert.equal(typeof row.topicDisplayChrome.topicStatus, "string");
  assert.ok(Array.isArray(row.factualObservations));
  assert.doesNotMatch(row.topicDisplayChrome.badgeTextEn, HEBREW_RE);
});

test("applyLearningPatternDecisionToUnitsAndRows never omits factualObservations for thin-evidence rows", () => {
  const maps = {
    math: {
      "add_two::grade:1": { questions: 2, correct: 1, wrong: 1, accuracy: 50 },
    },
  };
  applyLearningPatternDecisionToUnitsAndRows({ diagnosticEngineV2: null, maps });
  const row = maps.math["add_two::grade:1"];
  assert.equal(row.topicDisplayChrome.topicStatus, "insufficient_data");
  assert.ok(Array.isArray(row.factualObservations), "factualObservations array must still be present under insufficient_data");
});
