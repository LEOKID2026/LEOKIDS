/**
 * Factual observations + recurrence ladder — English parent-facing contract.
 * Adapted from LIOSH factual-observations-final-closure.test.mjs (English-only, active subjects).
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildFactualObservations,
  resolveFactualRecurrenceLevel,
} from "../../utils/learning-pattern-decision/build-factual-observations.js";
import { buildLearningPatternDecision } from "../../utils/learning-pattern-decision/build-learning-pattern-decision.js";
import {
  PROVEN_FACTUAL_PARENT_LABEL_EN,
  provenFactualParentLabelEn,
} from "../../utils/learning-pattern-decision/parent-facing-error-pattern-factual.js";

function wrong(tag, i = 0, extra = {}) {
  return {
    isCorrect: false,
    subjectId: "math",
    mode: "practice",
    evidenceSource: "self_practice",
    timestamp: 1_700_000_000_000 + i * 1000,
    topicRowKey: "fractions::grade:g6",
    bucketKey: "fractions",
    misconceptionTag: tag,
    ...extra,
  };
}
function correct(i = 0) {
  return {
    isCorrect: true,
    subjectId: "math",
    mode: "practice",
    evidenceSource: "self_practice",
    timestamp: 1_700_000_100_000 + i,
    topicRowKey: "fractions::grade:g6",
    bucketKey: "fractions",
  };
}

function lpdFor({ q, wrongCount, patternCount, tag = "calculation_off_by_one", topicName = "Fractions" }) {
  const events = [];
  for (let i = 0; i < patternCount; i++) events.push(wrong(tag, i));
  for (let i = patternCount; i < wrongCount; i++) events.push(wrong(`other_${i}`, 100 + i));
  for (let i = 0; i < q - wrongCount; i++) events.push(correct(i));
  const accuracy = Math.round(((q - wrongCount) / q) * 100);
  return buildLearningPatternDecision({
    subjectId: "math",
    topicRowKey: "fractions::grade:g6",
    row: {
      bucketKey: "fractions",
      displayName: topicName,
      label: topicName,
      questions: q,
      correct: q - wrongCount,
      wrong: wrongCount,
      accuracy,
    },
    unit: null,
    rawMistakes: events,
  });
}

describe("factual recurrence ladder", () => {
  it("1 occurrence → observed", () => {
    assert.equal(resolveFactualRecurrenceLevel({ count: 1, totalQuestions: 10, totalErrors: 1 }), "observed");
  });
  it("2 occurrences → repeated", () => {
    assert.equal(resolveFactualRecurrenceLevel({ count: 2, totalQuestions: 40, totalErrors: 2 }), "repeated");
  });
  it("3/40 → repeated only (not consistent)", () => {
    assert.equal(resolveFactualRecurrenceLevel({ count: 3, totalQuestions: 40, totalErrors: 3 }), "repeated");
  });
  it("4/12 → consistent", () => {
    assert.equal(resolveFactualRecurrenceLevel({ count: 4, totalQuestions: 12, totalErrors: 4 }), "consistent");
  });
  it("5/10 → strong", () => {
    assert.equal(resolveFactualRecurrenceLevel({ count: 5, totalQuestions: 10, totalErrors: 5 }), "strong");
  });
  it("6/25 → strong", () => {
    assert.equal(resolveFactualRecurrenceLevel({ count: 6, totalQuestions: 25, totalErrors: 6 }), "strong");
  });
  it("4/4 → repeated not consistent (sample size)", () => {
    assert.equal(resolveFactualRecurrenceLevel({ count: 4, totalQuestions: 4, totalErrors: 4 }), "repeated");
  });
  it("3/5 with high ratios → consistent", () => {
    assert.equal(resolveFactualRecurrenceLevel({ count: 3, totalQuestions: 5, totalErrors: 5 }), "consistent");
  });
  it("3/21-like sample: count passes but ratioOfQuestions fails → repeated only", () => {
    assert.equal(resolveFactualRecurrenceLevel({ count: 3, totalQuestions: 40, totalErrors: 5 }), "repeated");
  });
});

describe("factual observations builder — English only", () => {
  it("does not emit labelHe field", () => {
    const obs = buildFactualObservations({
      wrongEvents: [wrong("calculation_off_by_one", 0), wrong("calculation_off_by_one", 1)].map((e) => ({
        ...e,
        isCorrect: false,
      })),
      totalQuestions: 10,
      totalErrors: 2,
    });
    assert.equal(obs.length, 1);
    assert.equal("labelHe" in obs[0], false);
    assert.equal(obs[0].label, provenFactualParentLabelEn("calculation_off_by_one"));
    assert.equal(obs[0].labelKey, obs[0].canonicalKey);
  });

  it("aliases merge: carry_error + regroup_error + column_carry_error → one observation", () => {
    const events = [
      wrong("carry_error", 0),
      wrong("regroup_error", 1),
      wrong("column_carry_error", 2),
      correct(0),
      correct(1),
      correct(2),
      correct(3),
      correct(4),
      correct(5),
      correct(6),
      correct(7),
      correct(8),
    ];
    const obs = buildFactualObservations({
      wrongEvents: events.filter((e) => !e.isCorrect),
      totalQuestions: 12,
      totalErrors: 3,
    });
    assert.equal(obs.length, 1);
    assert.equal(obs[0].canonicalKey, "carry_error");
    assert.equal(obs[0].count, 3);
    assert.equal(obs[0].label, provenFactualParentLabelEn("carry_error"));
    assert.doesNotMatch(obs[0].label, /carry_error|regroup|mt:/);
  });
});

describe("factual observations beside positive accuracy", () => {
  it("20Q 90% 2 identical → mastery + observation", () => {
    const lpd = lpdFor({ q: 20, wrongCount: 2, patternCount: 2 });
    assert.equal(lpd.engineDecisionContract.engineDecision, "mastery_stable");
    assert.equal(lpd.factualObservations.length, 1);
    assert.equal(lpd.factualObservations[0].count, 2);
    assert.equal(lpd.factualObservations[0].recurrenceLevel, "repeated");
    assert.match(lpd.parentVisibleFinding, /strong and stable/i);
    assert.match(lpd.parentVisibleFinding, /the same error appeared in 2 answers: an answer that differed by 1/i);
    assert.equal(lpd.engineDecisionContract.detectedPattern, null);
    assert.equal(lpd.engineDecisionContract.blockPatternClaim, true);
  });

  it("25Q 76% 6 identical → partial (developing) + observation", () => {
    const lpd = lpdFor({ q: 25, wrongCount: 6, patternCount: 6 });
    assert.equal(lpd.engineDecisionContract.engineDecision, "partial_stable");
    assert.equal(lpd.observedPatternLevel, "strong");
    assert.match(lpd.parentVisibleFinding, /developing/i);
    assert.match(lpd.parentVisibleFinding, /The same error appeared in 6 answers: an answer that differed by 1/);
  });

  it("40Q 95% 2 identical → mastery + repeated not strong", () => {
    const lpd = lpdFor({ q: 40, wrongCount: 2, patternCount: 2 });
    assert.equal(lpd.engineDecisionContract.engineDecision, "mastery_stable");
    assert.equal(lpd.factualObservations[0].recurrenceLevel, "repeated");
    assert.notEqual(lpd.observedPatternLevel, "strong");
    assert.match(lpd.parentVisibleFinding, /the same error appeared in 2 answers/i);
  });

  it("25Q 14 wrong 6 off_by_one → clear gap + observation", () => {
    const lpd = lpdFor({ q: 25, wrongCount: 14, patternCount: 6 });
    assert.equal(lpd.engineDecisionContract.engineDecision, "clear_topic_gap");
    assert.match(lpd.parentVisibleFinding, /the same error appeared in 6 answers: an answer that differed by 1/i);
    assert.match(lpd.parentVisibleFinding, /25 questions/);
  });
});

describe("thin volume with observations", () => {
  it("1/1 one observation", () => {
    const lpd = lpdFor({ q: 1, wrongCount: 1, patternCount: 1 });
    assert.equal(lpd.factualObservations[0]?.count, 1);
    assert.equal(lpd.factualObservations[0]?.recurrenceLevel, "observed");
    assert.match(lpd.parentVisibleFinding, /The same error appeared in 1 answer:/);
  });
  it("2/2 same tag → repeated", () => {
    const lpd = lpdFor({ q: 2, wrongCount: 2, patternCount: 2 });
    assert.equal(lpd.factualObservations[0].recurrenceLevel, "repeated");
    assert.match(lpd.parentVisibleFinding, /The same error appeared in 2 answers:/);
  });
  it("4/4 same tag → repeated not consistent", () => {
    const lpd = lpdFor({ q: 4, wrongCount: 4, patternCount: 4 });
    assert.equal(lpd.factualObservations[0].recurrenceLevel, "repeated");
  });
});

describe("engine fields unchanged by factualObservations", () => {
  it("does not set detectedPattern from factual observation", () => {
    const lpd = lpdFor({ q: 25, wrongCount: 14, patternCount: 6 });
    assert.equal(lpd.engineDecisionContract.detectedPattern, null);
    assert.equal(lpd.engineDecisionContract.blockPatternClaim, true);
    assert.ok(Array.isArray(lpd.factualObservations));
    assert.ok(lpd.factualObservations.length >= 1);
    assert.equal(
      lpd.factualObservations.length,
      lpd.engineDecisionContract.factualObservations.length,
    );
  });
});

describe("proven labels coverage — 76 English factual labels", () => {
  it("all proven tags have non-empty, safe English labels", () => {
    const proven = Object.keys(PROVEN_FACTUAL_PARENT_LABEL_EN);
    assert.ok(proven.length >= 76, `expected >=76 got ${proven.length}`);
    for (const tag of proven) {
      const en = provenFactualParentLabelEn(tag);
      assert.ok(en, `missing label for ${tag}`);
      assert.doesNotMatch(en, /confus(ed|ion)|may be|foundational mix-up|unknown/i);
      assert.doesNotMatch(en, /^(mt|pf):/i);
    }
  });
});
