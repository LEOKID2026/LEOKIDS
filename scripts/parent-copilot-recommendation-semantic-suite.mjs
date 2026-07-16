/**
 * Semantic answer-first path for recommendation / next-step English questions.
 */
import assert from "node:assert/strict";
import parentCopilot from "../utils/parent-copilot/index.js";
import guardrail from "../utils/parent-copilot/guardrail-validator.js";

function baseTopicRow(overrides = {}) {
  const narrative = {
    contractVersion: "v1",
    topicKey: "t1",
    subjectId: "math",
    wordingEnvelope: "WE2",
    hedgeLevel: "light",
    allowedTone: "parent_professional_warm",
    forbiddenPhrases: ["completely certain"],
    requiredHedges: ["right now"],
    allowedSections: ["summary", "finding", "recommendation", "limitations"],
    recommendationIntensityCap: "RI2",
    textSlots: {
      observation: "In Fractions, 12 questions were observed with about 75% accuracy.",
      interpretation: "There is a reasonable practice direction, but further confirmation is still needed before drawing a clear conclusion.",
      action: "Focused practice and a short independence check are recommended before moving forward.",
      uncertainty: "Right now, it is worth continuing to monitor and verify the direction in the next round.",
    },
  };
  return {
    topicRowKey: "t1",
    displayName: "Fractions",
    questions: 12,
    accuracy: 75,
    contractsV1: {
      narrative,
      decision: { contractVersion: "v1", topicKey: "t1", subjectId: "math", decisionTier: 2, cannotConcludeYet: false },
      readiness: { contractVersion: "v1", topicKey: "t1", subjectId: "math", readiness: "emerging" },
      confidence: { contractVersion: "v1", topicKey: "t1", subjectId: "math", confidenceBand: "medium" },
      recommendation: {
        contractVersion: "v1",
        topicKey: "t1",
        subjectId: "math",
        eligible: true,
        intensity: "RI2",
        family: "general_practice",
        anchorEvidenceIds: ["ev1"],
        rationaleCodes: [],
        forbiddenBecause: [],
      },
      evidence: { contractVersion: "v1", topicKey: "t1", subjectId: "math" },
      ...overrides.contractsV1,
    },
  };
}

const eligiblePayload = {
  version: 2,
  subjectProfiles: [{ subject: "math", topicRecommendations: [baseTopicRow()] }],
  executiveSummary: { majorTrendsHe: [] },
};

const ineligiblePayload = {
  version: 2,
  subjectProfiles: [
    {
      subject: "math",
      topicRecommendations: [
        baseTopicRow({
          contractsV1: {
            decision: { contractVersion: "v1", topicKey: "t1", subjectId: "math", decisionTier: 0, cannotConcludeYet: true },
            readiness: { contractVersion: "v1", topicKey: "t1", subjectId: "math", readiness: "insufficient" },
            confidence: { contractVersion: "v1", topicKey: "t1", subjectId: "math", confidenceBand: "low" },
            recommendation: {
              contractVersion: "v1",
              topicKey: "t1",
              subjectId: "math",
              eligible: false,
              intensity: "RI0",
              family: null,
              anchorEvidenceIds: [],
              forbiddenBecause: ["cannot_conclude_yet"],
            },
            narrative: {
              contractVersion: "v1",
              topicKey: "t1",
              subjectId: "math",
              wordingEnvelope: "WE0",
              hedgeLevel: "mandatory",
              allowedTone: "parent_professional_warm",
              forbiddenPhrases: ["completely certain"],
              requiredHedges: ["right now", "at this stage"],
              allowedSections: ["summary", "finding", "limitations"],
              recommendationIntensityCap: "RI0",
              textSlots: {
                observation: "There is not enough practice yet.",
                interpretation: "At this stage, a consistent direction cannot be determined.",
                action: null,
                uncertainty: "Right now, it is still too early to decide, so continue careful monitoring.",
              },
            },
          },
        }),
      ],
    },
  ],
  executiveSummary: { majorTrendsHe: [] },
};

const questions = [
  "What are the next recommendations?",
  "What should I do right now?",
  "What should we do this week?",
  "What is the next step?",
  "What should we focus on right now?",
  "What is most important right now?",
];

for (const q of questions) {
  const r = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: eligiblePayload,
    utterance: q,
    sessionId: `rec-eligible-${q.slice(0, 12)}`,
    selectedContextRef: null,
  });
  assert.equal(r.resolutionStatus, "resolved");
  assert.ok(guardrail.validateParentCopilotResponseV1(r).ok);
  assert.equal(r.suggestedFollowUp, null);
  const body = r.answerBlocks.map((b) => b.textHe).join(" ");
  assert.ok(
    /focused practice|short.*practice|recommend(?:ed|ation)|start.*activity/i.test(body),
    `${q} must lead with concrete recommendation text from contracts (topic or executive aggregate)`,
  );
  assert.ok(!/^(from a parent'?s perspective|as a parent|according to the report):?\s*$/im.test(r.answerBlocks[0]?.textHe || ""), `${q} must not be coaching-first`);
}

for (const q of questions) {
  const r = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: ineligiblePayload,
    utterance: q,
    sessionId: `rec-ineligible-${q.slice(0, 12)}`,
    selectedContextRef: null,
  });
  assert.equal(r.resolutionStatus, "resolved");
  assert.ok(guardrail.validateParentCopilotResponseV1(r).ok);
  assert.equal(r.suggestedFollowUp, null);
  const body = r.answerBlocks.map((b) => b.textHe).join(" ");
  assert.ok(
    /too early|cannot (?:yet )?determine|not enough practice|clear direction.*not|picture is not yet closed/i.test(
      body,
    ),
    `${q} must state insufficiency in parent-facing language when contract blocks concrete recommendation`,
  );
  assert.ok(!/\bRI0\b|\bRI1\b|\bRI2\b|\bRI3\b/.test(body), `${q} must not expose intensity codes in parent copy`);
  assert.ok(
    !/recommendation contract|not marked as available|no action line|\bprofession\b/i.test(body),
    `${q} must not use internal/contract insufficiency wording`,
  );
}

console.log("parent-copilot-recommendation-semantic-suite: OK");
