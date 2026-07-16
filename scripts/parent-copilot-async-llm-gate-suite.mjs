import assert from "node:assert/strict";
import parentCopilot from "../utils/parent-copilot/index.js";
import guardrail from "../utils/parent-copilot/guardrail-validator.js";
/** Default import: tsx’s linker omits some named exports from this ESM file; behavior unchanged. */
import rolloutGates from "../utils/parent-copilot/rollout-gates.js";

const { getLlmGateDecision } = rolloutGates;

function setEnv(name, value) {
  if (value == null) delete process.env[name];
  else process.env[name] = String(value);
}

function resetLlmEnv() {
  for (const k of [
    "PARENT_COPILOT_FORCE_DETERMINISTIC",
    "PARENT_COPILOT_LLM_ENABLED",
    "PARENT_COPILOT_LLM_EXPERIMENT",
    "PARENT_COPILOT_LLM_API_KEY",
    "PARENT_COPILOT_LLM_TIMEOUT_MS",
    "GEMINI_API_KEY",
    "PARENT_COPILOT_LLM_MODEL",
  ]) {
    delete process.env[k];
  }
}

function syntheticPayload({ eligible = true } = {}) {
  const recommendation = eligible
    ? {
        contractVersion: "v1",
        topicKey: "t1",
        subjectId: "math",
        eligible: true,
        intensity: "RI2",
        family: "general_practice",
        anchorEvidenceIds: ["ev1"],
        forbiddenBecause: [],
      }
    : {
        contractVersion: "v1",
        topicKey: "t1",
        subjectId: "math",
        eligible: false,
        intensity: "RI0",
        family: null,
        anchorEvidenceIds: [],
        forbiddenBecause: ["cannot_conclude_yet"],
      };
  const tr = {
    topicRowKey: "t1",
    displayName: "Fractions",
    questions: 12,
    accuracy: 75,
    contractsV1: {
      evidence: { contractVersion: "v1", topicKey: "t1", subjectId: "math" },
      decision: {
        contractVersion: "v1",
        topicKey: "t1",
        subjectId: "math",
        decisionTier: eligible ? 2 : 0,
        cannotConcludeYet: !eligible,
      },
      readiness: {
        contractVersion: "v1",
        topicKey: "t1",
        subjectId: "math",
        readiness: eligible ? "emerging" : "insufficient",
      },
      confidence: {
        contractVersion: "v1",
        topicKey: "t1",
        subjectId: "math",
        confidenceBand: eligible ? "medium" : "low",
      },
      recommendation,
      narrative: {
        contractVersion: "v1",
        topicKey: "t1",
        subjectId: "math",
        wordingEnvelope: eligible ? "WE2" : "WE0",
        hedgeLevel: eligible ? "light" : "mandatory",
        allowedTone: "parent_professional_warm",
        forbiddenPhrases: ["completely certain"],
        requiredHedges: ["right now"],
        allowedSections: ["summary", "finding", "recommendation", "limitations"],
        recommendationIntensityCap: eligible ? "RI2" : "RI0",
        textSlots: {
          observation: "Right now, 12 questions in Fractions were observed with about 75% accuracy.",
          interpretation: "Right now, there is a reasonable practice direction, but further confirmation is still needed.",
          action: eligible ? "Right now, focused practice and a short independence check are recommended." : null,
          uncertainty: "Right now, it is worth continuing to monitor and verify the direction in the next round.",
        },
      },
    },
  };
  return {
    version: 2,
    subjectProfiles: [{ subject: "math", topicRecommendations: [tr] }],
    executiveSummary: { majorTrendsHe: ["First line for the period"] },
  };
}

async function runAsyncWith(payload, utterance, sessionId) {
  const out = await parentCopilot.runParentCopilotTurnAsync({
    audience: "parent",
    payload,
    utterance,
    sessionId,
    selectedContextRef: null,
  });
  assert.ok(guardrail.validateParentCopilotResponseV1(out).ok);
  return out;
}

const originalFetch = globalThis.fetch;

try {
  // A) Default OFF in practice: gate disabled, async still deterministic, zero fetch calls.
  resetLlmEnv();
  assert.equal(getLlmGateDecision().enabled, false, "default env must keep LLM disabled");
  let asyncGateFetchCalls = 0;
  globalThis.fetch = async () => {
    asyncGateFetchCalls += 1;
    throw new Error("fetch must not run when LLM rollout gate is disabled");
  };
  const a = await runAsyncWith(syntheticPayload({ eligible: true }), "What is most important to practice this week?", "llm-gate-a");
  assert.equal(asyncGateFetchCalls, 0, "no network when gate disables LLM");
  assert.notEqual(a?.telemetry?.generationPath, "llm_grounded", "gate off must not use LLM-grounded path");
  if (a?.telemetry?.llmAttempt != null) {
    assert.equal(a?.telemetry?.llmAttempt?.ok, false);
    assert.equal(a?.telemetry?.llmAttempt?.reason, "llm_disabled_by_rollout_gate");
  }
  globalThis.fetch = originalFetch;

  // B) Kill-switch beats all.
  let calledB = false;
  setEnv("PARENT_COPILOT_LLM_ENABLED", "true");
  setEnv("PARENT_COPILOT_LLM_EXPERIMENT", "true");
  setEnv("PARENT_COPILOT_FORCE_DETERMINISTIC", "true");
  setEnv("PARENT_COPILOT_LLM_API_KEY", "x");
  globalThis.fetch = async () => {
    calledB = true;
    throw new Error("fetch must not be called when force deterministic is true");
  };
  const b = await runAsyncWith(syntheticPayload({ eligible: true }), "What is most important to practice this week?", "llm-gate-b");
  assert.equal(calledB, false);
  assert.notEqual(b?.telemetry?.generationPath, "llm_grounded");
  if (b?.telemetry?.llmAttempt != null) {
    assert.equal(b?.telemetry?.llmAttempt?.ok, false);
    assert.equal(b?.telemetry?.llmAttempt?.reason, "llm_disabled_by_rollout_gate");
  }

  // C) Explicit experiment flag is required (LLM remains OFF in practice by default).
  setEnv("PARENT_COPILOT_FORCE_DETERMINISTIC", "false");
  setEnv("PARENT_COPILOT_LLM_EXPERIMENT", null);
  let calledC = false;
  globalThis.fetch = async () => {
    calledC = true;
    throw new Error("fetch must not be called without explicit experiment flag");
  };
  const c = await runAsyncWith(syntheticPayload({ eligible: true }), "What is most important to practice this week?", "llm-gate-c");
  assert.equal(calledC, false);
  assert.notEqual(c?.telemetry?.generationPath, "llm_grounded");
  const cLlm = c?.telemetry?.llmAttempt ?? c?.telemetry?.trace?.branchOutcomes?.llmAttempt;
  if (cLlm != null) {
    assert.equal(cLlm.ok, false);
    assert.equal(cLlm.reason, "llm_disabled_by_rollout_gate");
    if (Array.isArray(cLlm.gateReasonCodes)) {
      assert.ok(cLlm.gateReasonCodes.includes("llm_experiment_flag_missing"));
    }
  }

  // D) Enabled path, invalid JSON response (explain-report utterance — avoids intent_composer early exit).
  setEnv("PARENT_COPILOT_LLM_EXPERIMENT", "true");
  setEnv("PARENT_COPILOT_FORCE_DETERMINISTIC", "false");
  setEnv("PARENT_COPILOT_LLM_ENABLED", "true");
  setEnv("PARENT_COPILOT_LLM_API_KEY", "test-key");
  setEnv("PARENT_COPILOT_LLM_PROVIDER", "openai");
  const llmPathUtterance = "Explain what appears in the report as you would to a parent.";
  let calledD = 0;
  globalThis.fetch = async () => {
    calledD += 1;
    return {
      ok: true,
      async json() {
        return { output_text: "not-json" };
      },
    };
  };
  const d = await runAsyncWith(syntheticPayload({ eligible: true }), llmPathUtterance, "llm-gate-d");
  assert.equal(calledD > 0, true);
  assert.equal(d?.telemetry?.llmAttempt?.ok, false);
  assert.equal(d?.telemetry?.llmAttempt?.reason, "invalid_json_output");

  // E) Enabled path, invalid block shape.
  globalThis.fetch = async () => ({
    ok: true,
    async json() {
      return {
        output_text: JSON.stringify({
          answerBlocks: [
            { type: "bad_type", textHe: "Right now, this is the first text." },
            { type: "meaning", textHe: "Right now, this is the second text." },
          ],
        }),
      };
    },
  });
  const e = await runAsyncWith(syntheticPayload({ eligible: true }), llmPathUtterance, "llm-gate-e");
  assert.equal(e?.telemetry?.llmAttempt?.ok, false);
  assert.equal(e?.telemetry?.llmAttempt?.reason, "llm_invalid_block_shape");

  // F) Ineligible recommendation + stray next_step: next_step is stripped; observation-only remainder fails length.
  globalThis.fetch = async () => ({
    ok: true,
    async json() {
      return {
        output_text: JSON.stringify({
          answerBlocks: [
            { type: "observation", textHe: "Right now, this is what appears in the report." },
            { type: "next_step", textHe: "Right now, moving forward immediately is recommended." },
          ],
        }),
      };
    },
  });
  const f = await runAsyncWith(syntheticPayload({ eligible: false }), "What is most important to practice this week?", "llm-gate-f");
  assert.equal(f?.telemetry?.llmAttempt?.ok, false);
  assert.equal(f?.telemetry?.llmAttempt?.reason, "llm_answer_too_short");

  // G) Enabled path, valid output accepted (what_is_most_important needs practical cues + length — see guardrail).
  globalThis.fetch = async () => ({
    ok: true,
    async json() {
      return {
        output_text: JSON.stringify({
          answerBlocks: [
            {
              type: "observation",
              textHe:
                "Right now, this week it is worth focusing mainly on Fractions and Geometry according to the report; the picture is relatively clear for those two areas.",
            },
            {
              type: "meaning",
              textHe:
                "Right now, Fractions could use more practice on conversions; Geometry has a practice direction but still needs stabilization. Practice for about 10 minutes, three times a week, with 5-8 short questions each time.",
            },
          ],
        }),
      };
    },
  });
  const g = await runAsyncWith(syntheticPayload({ eligible: true }), llmPathUtterance, "llm-gate-g");
  assert.equal(g?.telemetry?.generationPath, "llm_grounded");
  assert.equal(g?.telemetry?.llmAttempt?.ok, true);

  // H) Launch template (.env.production): LLM_ENABLED without LLM_EXPERIMENT → gate OFF (deterministic launch).
  resetLlmEnv();
  setEnv("PARENT_COPILOT_ROLLOUT_STAGE", "full");
  setEnv("PARENT_COPILOT_LLM_ENABLED", "true");
  setEnv("PARENT_COPILOT_FORCE_DETERMINISTIC", "false");
  const prodGate = getLlmGateDecision();
  assert.equal(prodGate.enabled, false, "production template must not enable LLM without EXPERIMENT");
  assert.ok(prodGate.reasonCodes.includes("llm_experiment_flag_missing"));
} finally {
  resetLlmEnv();
  globalThis.fetch = originalFetch;
}

console.log("parent-copilot-async-llm-gate-suite: OK");
