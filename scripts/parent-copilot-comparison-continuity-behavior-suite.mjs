/**
 * Behavior-class checks: comparison-first answers, practical continuity, accepted follow-ups, follow-up gating, no executive dumps on short continuation.
 * Run: npm run test:parent-copilot-comparison-continuity-behavior
 */
import assert from "node:assert/strict";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const { syntheticPayload } = await import(pathToFileURL(join(ROOT, "scripts/parent-copilot-test-fixtures.mjs")).href);
const { buildTruthPacketV1 } = await import(pathToFileURL(join(ROOT, "utils/parent-copilot/truth-packet-v1.js")).href);
const { tryBuildParentShortFollowupDraft } = await import(
  pathToFileURL(join(ROOT, "utils/parent-copilot/short-followup-composer.js")).href,
);
const parentMod = await import(pathToFileURL(join(ROOT, "utils/parent-copilot/index.js")).href);
const runParentCopilotTurn = parentMod.default?.runParentCopilotTurn ?? parentMod.runParentCopilotTurn;

const HEDGE_LEAD = /^right now/i;
const METRIC_EXPLANATION_LEAD = /^(according to the average|average accuracy|the periodic report counted|about\s*\d+\s*%?\s*questions)/i;
const EXEC_INVENTORY_MARKERS = /the following professions appear|anchored sources|questions across all subjects/i;

function payloadStableExecutiveBothReady() {
  const row = (subject, key, acc, q) => ({
    topicRowKey: key,
    displayName: subject === "math" ? "Math" : "English",
    questions: q,
    accuracy: acc,
    contractsV1: {
      evidence: { contractVersion: "v1", topicKey: key, subjectId: subject },
      decision: { contractVersion: "v1", topicKey: key, subjectId: subject, cannotConcludeYet: false, decisionTier: 2 },
      readiness: { contractVersion: "v1", topicKey: key, subjectId: subject, readiness: "ready" },
      confidence: { contractVersion: "v1", topicKey: key, subjectId: subject, confidenceBand: "high" },
      recommendation: {
        contractVersion: "v1",
        topicKey: key,
        subjectId: subject,
        eligible: true,
        intensity: "RI2",
        family: "general_practice",
        anchorEvidenceIds: ["e"],
        forbiddenBecause: [],
      },
      narrative: {
        contractVersion: "v1",
        topicKey: key,
        subjectId: subject,
        wordingEnvelope: "WE2",
        hedgeLevel: "light",
        allowedTone: "parent_professional_warm",
        forbiddenPhrases: [],
        requiredHedges: ["right now"],
        allowedSections: ["summary", "finding", "recommendation", "limitations"],
        recommendationIntensityCap: "RI2",
        textSlots: {
          observation: `Stable documentation in the subject with ${q} questions and about ${acc}% accuracy.`,
          interpretation: "The fit to the period goals shown in the report looks orderly and consistent.",
          action: "Continue short, measured practice along the same line.",
          uncertainty: "Continue routine monitoring according to the period schedule.",
        },
      },
    },
  });
  return {
    version: 2,
    subjectProfiles: [
      { subject: "math", topicRecommendations: [row("math", "m1", 82, 12)] },
      { subject: "english", topicRecommendations: [row("english", "e1", 90, 10)] },
    ],
    executiveSummary: { majorTrendsHe: ["First general line in the period", "Second general line in the period"] },
  };
}

function firstObservationHe(res) {
  const obs = (res.answerBlocks || []).find((b) => b.type === "observation");
  return String(obs?.textHe || "").trim();
}

const payloadAgg = syntheticPayload({ eligible: true });

// 1) Comparative families: direct answer first (no hedge lead on observation), not metric-explanation-first.
const comparativeUtterances = [
  "Which subject is strongest in the report right now?",
  "Which subject is weakest according to the report?",
  "What stands out most this period according to the report?",
  "Where is the most reinforcement needed according to the report?",
];
for (const utt of comparativeUtterances) {
  const res = runParentCopilotTurn({
    audience: "parent",
    payload: payloadAgg,
    utterance: utt,
    sessionId: `cmp-${utt.slice(0, 12)}`,
    selectedContextRef: null,
  });
  assert.equal(res.resolutionStatus, "resolved", utt);
  const lead = firstObservationHe(res);
  assert.ok(lead.length >= 8, utt);
  assert.ok(!HEDGE_LEAD.test(lead), `hedge-first observation: ${utt}`);
  assert.ok(!METRIC_EXPLANATION_LEAD.test(lead), `metric-explanation-first: ${utt}`);
}

// 2) Practical follow-up after comparison stays on thread (continuity hook), not a bare generic reopen.
const sessionPractical = "cmp-practical-thread";
const r1 = runParentCopilotTurn({
  audience: "parent",
  payload: payloadAgg,
  utterance: "Which subject is strongest in the report?",
  sessionId: sessionPractical,
  selectedContextRef: null,
});
assert.equal(r1.resolutionStatus, "resolved");
const r2 = runParentCopilotTurn({
  audience: "parent",
  payload: payloadAgg,
  utterance: "So what should we do with this in practice in the coming week?",
  sessionId: sessionPractical,
  selectedContextRef: null,
});
assert.equal(r2.resolutionStatus, "resolved");
const joined2 = (r2.answerBlocks || []).map((b) => b.textHe).join(" ");
assert.ok(/continuing from the comparison/i.test(joined2), `practical follow-up should carry comparison continuity hook: ${joined2}`);
assert.ok(!EXEC_INVENTORY_MARKERS.test(joined2), "practical follow-up should not reopen executive inventory");

// 3) Accepted follow-up: offered family avoid_now + affirmation executes that path (hook + avoid-now intent).
const pTopic = syntheticPayload({ eligible: false });
const shortDraft = tryBuildParentShortFollowupDraft({
  utteranceStr: "yes",
  conv: {
    lastOfferedFollowupFamily: "avoid_now",
    priorScopes: ["topic:t1"],
    lastScopeLabelHe: "Fractions",
    lastPlannerIntent: "what_is_still_difficult",
    priorIntents: ["what_is_still_difficult"],
  },
  payload: pTopic,
});
assert.ok(shortDraft, "short follow-up draft");
assert.ok(shortDraft.answerBlocks.some((b) => /continu|follow-up|next/i.test(String(b.textHe || ""))), "acceptance executes offered family");
assert.equal(shortDraft.plannerIntent, "what_not_to_do_now");

// 4) Follow-up gating: stable executive packet must not advertise avoid_now / advance_or_hold when fully ready + RI2.
const pClean = payloadStableExecutiveBothReady();
const tpClean = buildTruthPacketV1(pClean, {
  scopeType: "executive",
  scopeId: "executive",
  scopeLabel: "the report for the selected period",
  interpretationScope: "executive",
  scopeClass: "executive",
  canonicalIntent: "explain_report",
});
assert.ok(tpClean);
assert.ok(!tpClean.allowedFollowupFamilies.includes("avoid_now"), "avoid_now must not be offered without grounded partial-risk");
assert.ok(!tpClean.allowedFollowupFamilies.includes("advance_or_hold"), "advance_or_hold must not be offered on trivially-ready surface");

// 5) Short continuation (brief_continue) must not dump long executive subject lists.
const resBrief = runParentCopilotTurn({
  audience: "parent",
  payload: pTopic,
  utterance: "continue briefly",
  sessionId: "cmp-brief-continue",
  selectedContextRef: { scopeType: "topic", scopeId: "t1", subjectId: "math" },
});
if (resBrief.resolutionStatus === "resolved") {
  const j = (resBrief.answerBlocks || []).map((b) => b.textHe).join(" ");
  assert.ok(!EXEC_INVENTORY_MARKERS.test(j), "brief continuation must not reopen executive inventory");
}

console.log("parent-copilot-comparison-continuity-behavior-suite: OK");
