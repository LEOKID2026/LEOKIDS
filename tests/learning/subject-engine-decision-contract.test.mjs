import assert from "node:assert/strict";
import { buildParentReportEngineDecisionContract } from "../../utils/learning-pattern-decision/build-parent-report-engine-decision-contract.js";
import {
  buildSubjectEngineDecisionContract,
  buildSubjectEngineDecisionContractFromTopicMap,
  resolveSubjectSummaryTextFromEngineContract,
} from "../../utils/learning-pattern-decision/build-subject-engine-decision-contract.js";
import { buildSubjectParentLetter } from "../../utils/detailed-report-parent-letter.js";
import { summarizeV2UnitsForSubjectForTests } from "../../utils/parent-report-v2.js";
import { RENDER_SOURCE_SUBJECT_ENGINE } from "../../utils/learning-pattern-decision/engine-decision-codes.js";

function topicRowFromContract(input) {
  const contract = buildParentReportEngineDecisionContract(input);
  return {
    topicRowKey: input.topicRowKey,
    displayName: input.topicName,
    questions: contract.questions,
    correct: contract.correct,
    wrong: contract.wrong,
    accuracy: contract.accuracy,
    engineDecisionContract: contract,
    parentVisibleFinding: contract.parentSafeFinding,
    learningPatternDecision: {
      templateId: "LPD_TOPIC_GAP",
      engineDecisionContract: contract,
      parentVisibleFinding: contract.parentSafeFinding,
    },
  };
}

// OMER math — fractions + multiplication aggregate
{
  const fractions = topicRowFromContract({
    subjectId: "math",
    topicRowKey: "fractions::grade:g5",
    topicName: "",
    row: { questions: 206, correct: 108, wrong: 98, accuracy: 52, displayName: "" },
    unit: {
      subjectId: "math",
      topicRowKey: "fractions::grade:g5",
      displayName: "",
      taxonomy: { patternHe: "   ", subskillHe: " " },
      diagnosis: { allowed: true, lineHe: "   " },
      classification: { state: "classified", primaryTag: "numerator_only_compare" },
      patternEvidence: { allowed: true, evidenceCount: 98 },
      canonicalState: {
        actionState: "intervene",
        recommendation: { allowed: true, intensityCap: "RI2", family: "intervene" },
      },
      evidenceTrace: [{ type: "volume", value: { questions: 206, correct: 108, wrong: 98, accuracy: 52 } }],
    },
  });

  const multiplication = topicRowFromContract({
    subjectId: "math",
    topicRowKey: "multiplication::grade:g5",
    topicName: "",
    row: { questions: 32, correct: 22, wrong: 10, accuracy: 69, displayName: "" },
    unit: {
      subjectId: "math",
      topicRowKey: "multiplication::grade:g5",
      displayName: "",
      taxonomy: { patternHe: "  ", subskillHe: "" },
      diagnosis: { allowed: true, lineHe: "  " },
      classification: { state: "classified", primaryTag: "multiplication_fact_error" },
      patternEvidence: { allowed: true, evidenceCount: 10 },
      canonicalState: {
        actionState: "intervene",
        recommendation: { allowed: true, intensityCap: "RI2", family: "intervene" },
      },
      evidenceTrace: [{ type: "volume", value: { questions: 32, correct: 22, wrong: 10, accuracy: 69 } }],
    },
  });

  const contract = buildSubjectEngineDecisionContract("math", [fractions, multiplication], {
    subjectLabelKey: "math",
  });

  assert.equal(contract.blockedLegacySummary, true);
  assert.ok(
    contract.subjectDecision === "multiple_topic_gaps" ||
      contract.subjectDecision === "focused_strengthening_needed",
  );
  assert.equal(contract.recommendedSubjectAction, "remediate_priority_topics_same_level");
  assert.equal(contract.priorityTopics.length, 2);
  assert.equal(contract.priorityTopics[0].topicKey, "fractions::grade:g5");
  assert.equal(contract.priorityTopics[1].topicKey, "multiplication::grade:g5");
  assert.match(String(contract.priorityTopics[0].detectedPattern), /    |   /);
  assert.match(String(contract.priorityTopics[1].detectedPattern), /   |  /);
  assert.ok(
    contract.strongestDetectedPatterns.some((p) => / /.test(String(p))) &&
      contract.strongestDetectedPatterns.some((p) => /|/.test(String(p))),
  );
  assert.equal(contract.totalQuestions, 238);
  assert.ok(contract.weightedAccuracy > 0 && contract.weightedAccuracy < 100);

  const summary = resolveSubjectSummaryTextFromEngineContract(contract, { subjectLabel: "" });
  assert.ok(summary && summary.length > 0);
  assert.match(summary, /topics stand out as needing reinforcement/i);
  assert.match(summary, //);
  assert.match(summary, /    |   /);

  const sp = {
    subject: "math",
    subjectLabel: "",
    subjectEngineDecisionContract: contract,
    topicRecommendations: [fractions, multiplication],
    topWeaknesses: [],
    subjectDiagnosticRestraintHe: null,
    confidenceSummaryHe: null,
  };
  const letter = buildSubjectParentLetter(sp);
  assert.equal(letter.renderSource, "subjectEngineDecisionContract");
  assert.ok(String(letter.opening || "").length > 0);
}

// Aaa7 math — single clear_topic_gap on addition
{
  const addition = topicRowFromContract({
    subjectId: "math",
    topicRowKey: "addition::grade:g1",
    topicName: "",
    row: { questions: 10, correct: 2, wrong: 8, accuracy: 20, displayName: "" },
    unit: {
      canonicalState: {
        actionState: "probe_only",
        recommendation: { allowed: false, intensityCap: "RI0", family: "probe_only" },
      },
      evidenceTrace: [{ type: "volume", value: { questions: 10, correct: 2, wrong: 8, accuracy: 20 } }],
    },
  });

  const contract = buildSubjectEngineDecisionContract("math", [addition], { subjectLabelKey: "math" });

  assert.equal(addition.engineDecisionContract.engineDecision, "clear_topic_gap");
  assert.equal(
    addition.engineDecisionContract.actionDecisionContract.action,
    "give_probe_questions",
  );
  assert.equal(addition.engineDecisionContract.recommendedAction, "maintain_current_path");
  assert.equal(contract.subjectDecision, "insufficient_subject_data");
  assert.equal(contract.priorityTopics.length, 1);
  assert.equal(contract.priorityTopics[0].engineDecision, "clear_topic_gap");
  assert.equal(contract.recommendedSubjectAction, "insufficient_data_withhold");
}

// short report subject summary — contract wiring from topic map
{
  const fractions = topicRowFromContract({
    subjectId: "math",
    topicRowKey: "fractions::grade:g5",
    topicName: "",
    row: { questions: 206, correct: 108, wrong: 98, accuracy: 52, displayName: "" },
    unit: {
      subjectId: "math",
      topicRowKey: "fractions::grade:g5",
      displayName: "",
      taxonomy: { patternHe: "   ", subskillHe: " " },
      diagnosis: { allowed: true, lineHe: "   " },
      classification: { state: "classified", primaryTag: "numerator_only_compare" },
      patternEvidence: { allowed: true, evidenceCount: 98 },
      canonicalState: {
        actionState: "intervene",
        recommendation: { allowed: true, intensityCap: "RI2", family: "intervene" },
      },
      evidenceTrace: [{ type: "volume", value: { questions: 206, correct: 108, wrong: 98, accuracy: 52 } }],
      priority: { level: "P4" },
    },
  });

  const multiplication = topicRowFromContract({
    subjectId: "math",
    topicRowKey: "multiplication::grade:g5",
    topicName: "",
    row: { questions: 32, correct: 22, wrong: 10, accuracy: 69, displayName: "" },
    unit: {
      subjectId: "math",
      topicRowKey: "multiplication::grade:g5",
      displayName: "",
      taxonomy: { patternHe: "  ", subskillHe: " " },
      diagnosis: { allowed: true, lineHe: "  " },
      classification: { state: "classified", primaryTag: "multiplication_fact_error" },
      patternEvidence: { allowed: true, evidenceCount: 10 },
      canonicalState: {
        actionState: "intervene",
        recommendation: { allowed: true, intensityCap: "RI2", family: "intervene" },
      },
      evidenceTrace: [{ type: "volume", value: { questions: 32, correct: 22, wrong: 10, accuracy: 69 } }],
      priority: { level: "P3" },
    },
  });

  const topicMap = {
    "fractions::grade:g5": {
      questions: 206,
      correct: 108,
      wrong: 98,
      accuracy: 52,
      displayName: "",
      engineDecisionContract: fractions.engineDecisionContract,
      learningPatternDecision: fractions.learningPatternDecision,
    },
    "multiplication::grade:g5": {
      questions: 32,
      correct: 22,
      wrong: 10,
      accuracy: 69,
      displayName: "",
      engineDecisionContract: multiplication.engineDecisionContract,
      learningPatternDecision: multiplication.learningPatternDecision,
    },
  };

  const contract = buildSubjectEngineDecisionContractFromTopicMap("math", topicMap, {
    subjectLabelKey: "math",
  });
  assert.equal(contract.subjectDecision, "multiple_topic_gaps");
  assert.equal(contract.recommendedSubjectAction, "remediate_priority_topics_same_level");

  const shortSubject = summarizeV2UnitsForSubjectForTests(
    [
      {
        subjectId: "math",
        topicRowKey: "fractions::grade:g5",
        displayName: "",
        diagnosis: { allowed: true },
        canonicalState: {
          actionState: "intervene",
          recommendation: { allowed: true, intensityCap: "RI2", family: "intervene" },
        },
        evidenceTrace: [{ type: "volume", value: { questions: 206, correct: 108, wrong: 98, accuracy: 52 } }],
        priority: { level: "P4" },
      },
      {
        subjectId: "math",
        topicRowKey: "multiplication::grade:g5",
        displayName: "",
        diagnosis: { allowed: true },
        canonicalState: {
          actionState: "intervene",
          recommendation: { allowed: true, intensityCap: "RI2", family: "intervene" },
        },
        evidenceTrace: [{ type: "volume", value: { questions: 32, correct: 22, wrong: 10, accuracy: 69 } }],
        priority: { level: "P3" },
      },
    ],
    {
      subjectId: "math",
      topicMap,
      subjectReportQuestions: 238,
      subjectLabel: "",
    },
  );

  assert.equal(shortSubject.subjectSummaryRenderSource, RENDER_SOURCE_SUBJECT_ENGINE);
  assert.equal(shortSubject.subjectSummaryDecisionCode, "multiple_topic_gaps");
  assert.equal(shortSubject.summaryHe, resolveSubjectSummaryTextFromEngineContract(contract, { subjectLabel: "" }));
  assert.match(shortSubject.summaryHe, /topics stand out as needing reinforcement/i);
}

// insufficient subject data — decision code only, no legacy block
{
  const contract = buildSubjectEngineDecisionContract("math", [], { subjectLabelKey: "math" });
  assert.equal(contract.subjectDecision, "insufficient_subject_data");
  assert.equal(contract.blockedLegacySummary, false);
  assert.equal(contract.recommendedSubjectAction, "insufficient_data_withhold");
  assert.equal(resolveSubjectSummaryTextFromEngineContract(contract), null);
}

console.log("subject-engine-decision-contract.test.mjs - all passed");
