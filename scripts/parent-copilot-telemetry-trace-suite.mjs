import assert from "node:assert/strict";
import parentCopilot from "../utils/parent-copilot/index.js";
import telemetryStore from "../utils/parent-copilot/telemetry-store.js";

function makePayload({ forceFallback = false } = {}) {
  const observation = forceFallback
    ? "In Fractions, 12 questions were observed with about 75% accuracy."
    : "Right now, 12 questions in Fractions were observed with about 75% accuracy.";
  const interpretation = forceFallback
    ? "There is a reasonable practice direction, but further confirmation is still needed before drawing a clear conclusion."
    : "Right now, there is a reasonable practice direction, but further confirmation is still needed before drawing a clear conclusion.";
  const action = forceFallback
    ? "Focused practice and a short independence check are recommended before moving forward."
    : "Right now, focused practice and a short independence check are recommended before moving forward.";
  const uncertainty = forceFallback
    ? "It is worth continuing to monitor and verify the direction in the next round."
    : "Right now, it is worth continuing to monitor and verify the direction in the next round.";

  return {
    version: 2,
    subjectProfiles: [
      {
        subject: "math",
        topicRecommendations: [
          {
            topicRowKey: "t1",
            displayName: "Fractions",
            questions: 12,
            accuracy: 75,
            contractsV1: {
              evidence: { contractVersion: "v1", topicKey: "t1", subjectId: "math" },
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
                forbiddenBecause: [],
              },
              narrative: {
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
                textSlots: { observation, interpretation, action, uncertainty },
              },
            },
          },
        ],
      },
    ],
    executiveSummary: { majorTrendsHe: ["First line for the period"] },
  };
}

telemetryStore.resetTurnTelemetryTraceStoreForTests();

const resolved = parentCopilot.runParentCopilotTurn({
  audience: "parent",
  payload: makePayload({ forceFallback: false }),
  utterance: "What is the meaning for Fractions?",
  sessionId: "telemetry-resolved",
});
assert.equal(resolved.resolutionStatus, "resolved");
assert.ok(resolved.telemetry?.traceId);

const clarification = parentCopilot.runParentCopilotTurn({
  audience: "parent",
  payload: null,
  utterance: "What is happening here?",
  sessionId: "telemetry-clarification",
});
assert.equal(clarification.resolutionStatus, "clarification_required");
assert.ok(clarification.telemetry?.traceId);

const fallback = parentCopilot.runParentCopilotTurn({
  audience: "parent",
  payload: makePayload({ forceFallback: true }),
  utterance: "What is the meaning for Fractions?",
  sessionId: "telemetry-fallback",
});
assert.equal(fallback.resolutionStatus, "resolved");
assert.equal(fallback.fallbackUsed, true);

const snapshot = telemetryStore.readTurnTelemetryTraceStore();
assert.equal(snapshot.schemaVersion, "v1");
assert.ok(Array.isArray(snapshot.events));
assert.ok(snapshot.events.length >= 3);

const fallbackEvent = snapshot.events.find((e) => e.sessionId === "telemetry-fallback");
assert.ok(fallbackEvent);
assert.equal(typeof fallbackEvent.scopeReason, "string");
assert.equal(typeof fallbackEvent.generationPath, "string");
assert.equal(fallbackEvent.fallbackUsed, true);
assert.ok(Array.isArray(fallbackEvent.fallbackReasonCodes));
assert.ok(fallbackEvent.fallbackReasonCodes.length >= 1);

const clarificationEvent = snapshot.events.find((e) => e.sessionId === "telemetry-clarification");
assert.ok(clarificationEvent);
assert.equal(clarificationEvent.resolutionStatus, "clarification_required");
assert.equal(clarificationEvent.scopeReason, "missing_payload");

telemetryStore.resetTurnTelemetryTraceStoreForTests();
for (let i = 1; i <= 11; i++) {
  telemetryStore.appendTurnTelemetryTrace(
    {
      schemaVersion: "v1",
      traceId: `trace-b${i}`,
      sessionId: `b${i}`,
      resolutionStatus: "resolved",
      intent: "understand_meaning",
      intentReason: "test_fixture",
      scopeReason: "test_fixture",
      generationPath: "deterministic",
      fallbackUsed: false,
      validatorStatus: "pass",
      timestampMs: Date.now() + i,
    },
    { maxEntries: 10 },
  );
}
const bounded = telemetryStore.readTurnTelemetryTraceStore();
assert.equal(bounded.events.length, 10);
assert.deepEqual(
  bounded.events.map((e) => e.sessionId),
  ["b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "b10", "b11"],
);

console.log("parent-copilot-telemetry-trace-suite: OK");
