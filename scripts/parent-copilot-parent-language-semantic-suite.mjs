/**
 * Parent-facing copy for insufficiency (A), clarify/re-explain (B), advance-or-hold (C).
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

function assertNoInternalJargon(body, label) {
  assert.ok(!/\bRI0\b|\bRI1\b|\bRI2\b|\bRI3\b/.test(body), `${label}: no RI codes in parent copy`);
  assert.ok(!/recommendation contract|not marked as available|no action line|\bprofession\b/i.test(body), `${label}: no contract insufficiency jargon`);
}

const recQs = ["What are the next recommendations?", "What should I do right now?", "What is most important right now?"];
for (const q of recQs) {
  const r = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: ineligiblePayload,
    utterance: q,
    sessionId: `plang-rec-${q.slice(0, 10)}`,
    selectedContextRef: null,
  });
  assert.equal(r.resolutionStatus, "resolved");
  assert.ok(guardrail.validateParentCopilotResponseV1(r).ok);
  const body = r.answerBlocks.map((b) => b.textHe).join(" ");
  assertNoInternalJargon(body, q);
}

const rStrong = parentCopilot.runParentCopilotTurn({
  audience: "parent",
  payload: eligiblePayload,
  utterance: "Which subject is strongest?",
  sessionId: "plang-strongest-one-subject",
  selectedContextRef: null,
});
assert.equal(rStrong.resolutionStatus, "resolved");
assert.ok(guardrail.validateParentCopilotResponseV1(rStrong).ok);
const strongBody = rStrong.answerBlocks.map((b) => b.textHe).join(" ");
assert.ok(/one subject|without comparison|math|fractions/i.test(strongBody), "single-subject strongest uses warm parent explanation");
assert.ok(!/we do not rank subjects against each other/i.test(strongBody), "single-subject strongest must not use dry multi-subject-only boilerplate");

const clarifyQs = ["I did not understand. Please explain.", "Explain simply.", "What does this mean?", "Why?"];
for (const q of clarifyQs) {
  const r = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: eligiblePayload,
    utterance: q,
    sessionId: `plang-clarify-${q}`,
    selectedContextRef: null,
  });
  assert.equal(r.resolutionStatus, "resolved");
  assert.ok(guardrail.validateParentCopilotResponseV1(r).ok);
  const body = r.answerBlocks.map((b) => b.textHe).join(" ");
  assert.ok(/in simple words|simply put|plain language/i.test(body), `${q}: clarify path uses plain-language framing`);
  assert.ok(
    /report.*(?:12|questions)|accuracy|reasonable practice direction|fractions|12\s+questions/i.test(body),
    `${q}: must anchor to narrative slots (executive or topic), not empty boilerplate`,
  );
}

const advanceQs = ["Should we move forward or wait?", "Is it worth moving forward?", "Should we wait or continue?"];
for (const q of advanceQs) {
  const rHold = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: ineligiblePayload,
    utterance: q,
    sessionId: `plang-adv-hold-${q}`,
    selectedContextRef: null,
  });
  assert.equal(rHold.resolutionStatus, "resolved");
  assert.ok(guardrail.validateParentCopilotResponseV1(rHold).ok);
  const bHold = rHold.answerBlocks.map((b) => b.textHe).join(" ");
  assert.ok(/wait|hold off|not push/i.test(bHold), `${q} ineligible: bounded hold-first answer`);

  const rGo = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload: eligiblePayload,
    utterance: q,
    sessionId: `plang-adv-go-${q}`,
    selectedContextRef: null,
  });
  assert.equal(rGo.resolutionStatus, "resolved");
  assert.ok(guardrail.validateParentCopilotResponseV1(rGo).ok);
  const bGo = rGo.answerBlocks.map((b) => b.textHe).join(" ");
  assert.ok(/move forward|carefully|small steps/i.test(bGo), `${q} eligible: bounded advance-with-care answer`);
}

console.log("parent-copilot-parent-language-semantic-suite: OK");
