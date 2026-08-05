/**
 * Phase 6: free-form Hebrew robustness — paraphrase clusters, equivalence, noisy phrasing,
 * recommendation/action boundaries, scope near-miss, parent-facing render QA.
 * Run: npm run test:parent-copilot-phase6
 */
import assert from "node:assert/strict";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const { STAGE_A_PARAPHRASE_CLUSTERS } = await import(
  pathToFileURL(join(ROOT, "tests/fixtures/parent-copilot-stage-a-paraphrase-bank.mjs")).href
);
const { interpretFreeformStageA, CANONICAL_PARENT_INTENTS } = await import(
  pathToFileURL(join(ROOT, "utils/parent-copilot/stage-a-freeform-interpretation.js")).href
);
const { resolveScope } = await import(pathToFileURL(join(ROOT, "utils/parent-copilot/scope-resolver.js")).href);
const { buildTruthPacketV1 } = await import(pathToFileURL(join(ROOT, "utils/parent-copilot/truth-packet-v1.js")).href);
const { planConversation } = await import(pathToFileURL(join(ROOT, "utils/parent-copilot/conversation-planner.js")).href);
const { normalizeFreeformParentUtterance } = await import(
  pathToFileURL(join(ROOT, "utils/parent-copilot/utterance-normalize.js")).href
);
const parentCopilot = (await import(pathToFileURL(join(ROOT, "utils/parent-copilot/index.js")).href)).default;
const sessionMemory = (await import(pathToFileURL(join(ROOT, "utils/parent-copilot/session-memory.js")).href)).default;
const { assertParentFacingHtmlHasNoLeaks } = await import(
  pathToFileURL(join(ROOT, "tests/fixtures/parent-copilot-parent-facing-surface-qa.mjs")).href
);
const { normalizeExecutiveSummary } = await import(pathToFileURL(join(ROOT, "utils/parent-report-payload-normalize.js")).href);
const { syntheticPayload: syntheticPayloadForRender } = await import(
  pathToFileURL(join(ROOT, "scripts/parent-copilot-test-fixtures.mjs")).href
);
const detailedSurface = await import(pathToFileURL(join(ROOT, "components/parent-report-detailed-surface.jsx")).href);
const { ExecutiveSummarySection } = detailedSurface;
const ParentCopilotShell = (await import(pathToFileURL(join(ROOT, "components/parent-copilot/parent-copilot-shell.jsx")).href))
  .default;

const PHASE6_INTENTS = [
  "explain_report",
  "what_is_most_important",
  "what_to_do_today",
  "what_to_do_this_week",
  "why_not_advance",
  "what_is_going_well",
  "what_is_still_difficult",
  "how_to_tell_child",
  "question_for_teacher",
  "is_intervention_needed",
  "strength_vs_weakness_summary",
  "clarify_term",
];

for (const intent of PHASE6_INTENTS) {
  assert.ok(CANONICAL_PARENT_INTENTS.includes(intent), `canonical list must include ${intent}`);
  const phrases = STAGE_A_PARAPHRASE_CLUSTERS[intent];
  assert.ok(Array.isArray(phrases) && phrases.length >= 8, `${intent}: need >=8 Hebrew paraphrases`);
  for (const p of phrases) {
    const r = interpretFreeformStageA(p, null);
    assert.equal(r.canonicalIntent, intent, `paraphrase → ${intent}: "${p.slice(0, 48)}…" got ${r.canonicalIntent}`);
  }
}

/** Same shape as product-behavior ineligible topic truth for planner equivalence. */
function payloadIneligibleTopic() {
  const narrative = {
    contractVersion: "v1",
    topicKey: "t1",
    subjectId: "math",
    wordingEnvelope: "WE2",
    hedgeLevel: "light",
    allowedTone: "parent_professional_warm",
    forbiddenPhrases: [],
    requiredHedges: [" "],
    allowedSections: ["summary", "finding", "recommendation", "limitations"],
    recommendationIntensityCap: "RI0",
    textSlots: {
      observation: "  6 .",
      interpretation: "    .",
      action: "   .",
      uncertainty: "        .",
    },
  };
  const tr = {
    topicRowKey: "t1",
    displayName: "",
    questions: 6,
    accuracy: 70,
    contractsV1: {
      narrative,
      decision: { contractVersion: "v1", topicKey: "t1", subjectId: "math", decisionTier: 1, cannotConcludeYet: true },
      readiness: { contractVersion: "v1", topicKey: "t1", subjectId: "math", readiness: "insufficient" },
      confidence: { contractVersion: "v1", topicKey: "t1", subjectId: "math", confidenceBand: "low" },
      recommendation: {
        contractVersion: "v1",
        topicKey: "t1",
        subjectId: "math",
        eligible: false,
        intensity: "RI0",
        family: "none",
        anchorEvidenceIds: [],
        rationaleCodes: [],
        forbiddenBecause: [],
      },
      evidence: { contractVersion: "v1", topicKey: "t1", subjectId: "math" },
    },
  };
  return { version: 2, subjectProfiles: [{ subject: "math", topicRecommendations: [tr] }] };
}

const pInel = payloadIneligibleTopic();
const topicScope = { scopeType: "topic", scopeId: "t1", scopeLabel: "", scopeClass: "recommendation" };

const EQUIVALENCE_CLUSTERS = [
  {
    name: "explain_report",
    phrases: ["  ?", "  ?", "  ?", "     ?"],
  },
  {
    name: "what_to_do_this_week",
    phrases: ["  ?", "  ?", "    ?", "     ?"],
  },
  {
    name: "why_not_advance",
    phrases: ["  ?", "     ?", "  ?", "   ?"],
  },
  {
    name: "strength_vs_weakness_summary",
    phrases: ["   ?", "    ?", "     ?", "    "],
  },
  {
    name: "how_to_tell_child",
    phrases: ["    ?", "    ?", "   ?", "    ?"],
  },
  {
    name: "question_for_teacher",
    phrases: ["   ?", "     ?", "   ?", "    ?"],
  },
  {
    name: "is_intervention_needed",
    phrases: ["  ?", "    ?", "   ?", "     ?"],
  },
  {
    name: "clarify_term",
    phrases: ["  ?", "    ", "   ?", "    "],
  },
];

for (const cluster of EQUIVALENCE_CLUSTERS) {
  const parsed = cluster.phrases.map((u) => interpretFreeformStageA(u, null));
  const intents = new Set(parsed.map((p) => p.canonicalIntent));
  const scopeClasses = new Set(parsed.map((p) => p.scopeClass));
  const basePlan = planConversation(
    parsed[0].canonicalIntent,
    buildTruthPacketV1(pInel, { ...topicScope, scopeClass: parsed[0].scopeClass }),
    { continuityRepeat: false, turnOrdinal: 0, scopeType: "topic" },
  ).blockPlan.join("|");
  const sameStructure = parsed.every((p) => {
    const blockPlan = planConversation(
      p.canonicalIntent,
      buildTruthPacketV1(pInel, { ...topicScope, scopeClass: p.scopeClass }),
      { continuityRepeat: false, turnOrdinal: 0, scopeType: "topic" },
    ).blockPlan.join("|");
    return blockPlan === basePlan;
  });
  assert.equal(intents.size, 1, `${cluster.name}: one intent, got ${[...intents].join(",")}`);
  assert.equal(scopeClasses.size, 1, `${cluster.name}: one scopeClass, got ${[...scopeClasses].join(",")}`);
  assert.ok(sameStructure, `${cluster.name}: materially equivalent planner block order`);
}

const NOISY_CASES = [
  { raw: "          ? ", expect: "what_to_do_this_week" },
  { raw: "  ??", expect: "what_to_do_today" },
  { raw: " ?", expect: "what_to_do_today" },
  { raw: "      ", expect: "what_to_do_today" },
  { raw: "  ?", expect: "why_not_advance" },
  { raw: "???  ???", expect: "clarify_term" },
  { raw: "   …", expect: "question_for_teacher" },
];

for (const { raw, expect } of NOISY_CASES) {
  const r = interpretFreeformStageA(raw, null);
  assert.equal(
    r.canonicalIntent,
    expect,
    `noisy "${raw}" → expected ${expect}, got ${r.canonicalIntent}`,
  );
  const norm = normalizeFreeformParentUtterance(raw);
  const sr = resolveScope({
    payload: pInel,
    utterance: norm,
    selectedContextRef: { scopeType: "topic", scopeId: "t1", subjectId: "math" },
    stageA: r,
  });
  assert.equal(sr.resolutionStatus, "resolved", `noisy scope: "${raw.slice(0, 32)}"`);
}

function narrativeBlock(actionState, cap, hasAction) {
  return {
    contractVersion: "v1",
    topicKey: "t1",
    subjectId: "math",
    wordingEnvelope: "WE2",
    hedgeLevel: "light",
    allowedTone: "parent_professional_warm",
    forbiddenPhrases: [],
    requiredHedges: [" "],
    allowedSections: ["summary", "finding", "recommendation", "limitations"],
    recommendationIntensityCap: cap,
    textSlots: {
      observation: "    10 .",
      interpretation: "      .",
      action: hasAction ? "     ." : null,
      uncertainty: "    .",
    },
  };
}

function payloadWithCanonicalActionState(actionState) {
  const allowed = ["diagnose_only", "intervene", "maintain", "expand_cautiously"].includes(actionState);
  const cap =
    actionState === "intervene"
      ? "RI3"
      : actionState === "diagnose_only"
        ? "RI2"
        : actionState === "maintain" || actionState === "expand_cautiously"
          ? "RI1"
          : "RI0";
  const readiness =
    actionState === "maintain" || actionState === "expand_cautiously"
      ? "ready"
      : actionState === "diagnose_only"
        ? "emerging"
        : "insufficient";
  const confidenceLevel =
    actionState === "withhold" ? "contradictory" : actionState === "probe_only" || actionState === "diagnose_only" ? "low" : "high";
  const cannotConclude = actionState === "withhold";
  return {
    version: 2,
    subjectProfiles: [
      {
        subject: "math",
        topicRecommendations: [
          {
            topicRowKey: "t1",
            displayName: "",
            questions: 10,
            accuracy: 72,
            canonicalState: {
              topicStateId: `ph6::${actionState}`,
              stateHash: `ph6hash::${actionState}`,
              assessment: {
                readiness,
                confidenceLevel,
                cannotConcludeYet: cannotConclude,
                decisionTier: 1,
              },
              recommendation: { allowed, intensityCap: cap, family: actionState, reasonCodes: [] },
            },
            contractsV1: {
              evidence: { contractVersion: "v1", topicKey: "t1", subjectId: "math" },
              narrative: narrativeBlock(actionState, cap, allowed),
              decision: { contractVersion: "v1", topicKey: "t1", subjectId: "math", cannotConcludeYet: cannotConclude },
              readiness: { contractVersion: "v1", topicKey: "t1", subjectId: "math", readiness: "emerging" },
              confidence: { contractVersion: "v1", topicKey: "t1", subjectId: "math", confidenceBand: "medium" },
              recommendation: {
                contractVersion: "v1",
                topicKey: "t1",
                subjectId: "math",
                eligible: allowed,
                intensity: cap,
                family: actionState,
                anchorEvidenceIds: [],
                forbiddenBecause: [],
              },
            },
          },
        ],
      },
    ],
    executiveSummary: { majorTrendsHe: ["  "] },
  };
}

for (const st of ["withhold", "probe_only", "diagnose_only", "intervene", "maintain", "expand_cautiously"]) {
  const payload = payloadWithCanonicalActionState(st);
  sessionMemory.resetParentCopilotSessionForTests(`ph6-bound-${st}`);
  const r = parentCopilot.runParentCopilotTurn({
    audience: "parent",
    payload,
    utterance: "  ?",
    sessionId: `ph6-bound-${st}`,
    selectedContextRef: { scopeType: "topic", scopeId: "t1", subjectId: "math" },
  });
  assert.equal(r.resolutionStatus, "resolved", `boundary ${st}: resolved`);
  const body = (r.answerBlocks || []).map((b) => b.textHe).join(" ");
  assert.ok(!/\b(withhold|probe_only|diagnose_only|intervene|maintain|expand_cautiously)\b/i.test(body), `boundary ${st}: no raw actionState enum`);
  if (st === "withhold" || st === "probe_only") {
    assert.ok(
      !(r.answerBlocks || []).some((b) => b.type === "next_step"),
      `boundary ${st}: must not emit next_step when recommendation not allowed`,
    );
  }
}

const dualPayload = {
  version: 2,
  subjectProfiles: [
    {
      subject: "math",
      topicRecommendations: [
        {
          topicRowKey: "tA",
          displayName: " ",
          questions: 5,
          accuracy: 70,
          contractsV1: {
            narrative: {
              contractVersion: "v1",
              topicKey: "tA",
              subjectId: "math",
              wordingEnvelope: "WE2",
              hedgeLevel: "light",
              allowedTone: "parent_professional_warm",
              forbiddenPhrases: [],
              requiredHedges: [" "],
              allowedSections: ["summary", "finding"],
              recommendationIntensityCap: "RI1",
              textSlots: { observation: "  .", interpretation: " .", action: null, uncertainty: " ." },
            },
            decision: { contractVersion: "v1", topicKey: "tA", subjectId: "math", decisionTier: 1, cannotConcludeYet: false },
            readiness: { contractVersion: "v1", topicKey: "tA", subjectId: "math", readiness: "emerging" },
            confidence: { contractVersion: "v1", topicKey: "tA", subjectId: "math", confidenceBand: "medium" },
            recommendation: {
              contractVersion: "v1",
              topicKey: "tA",
              subjectId: "math",
              eligible: true,
              intensity: "RI1",
              family: "general_practice",
              anchorEvidenceIds: ["e1"],
              rationaleCodes: [],
              forbiddenBecause: [],
            },
            evidence: { contractVersion: "v1", topicKey: "tA", subjectId: "math" },
          },
        },
        {
          topicRowKey: "tB",
          displayName: " ",
          questions: 6,
          accuracy: 72,
          contractsV1: {
            narrative: {
              contractVersion: "v1",
              topicKey: "tB",
              subjectId: "math",
              wordingEnvelope: "WE2",
              hedgeLevel: "light",
              allowedTone: "parent_professional_warm",
              forbiddenPhrases: [],
              requiredHedges: [" "],
              allowedSections: ["summary", "finding"],
              recommendationIntensityCap: "RI1",
              textSlots: { observation: "  .", interpretation: "  .", action: null, uncertainty: " ." },
            },
            decision: { contractVersion: "v1", topicKey: "tB", subjectId: "math", decisionTier: 1, cannotConcludeYet: false },
            readiness: { contractVersion: "v1", topicKey: "tB", subjectId: "math", readiness: "emerging" },
            confidence: { contractVersion: "v1", topicKey: "tB", subjectId: "math", confidenceBand: "medium" },
            recommendation: {
              contractVersion: "v1",
              topicKey: "tB",
              subjectId: "math",
              eligible: true,
              intensity: "RI1",
              family: "general_practice",
              anchorEvidenceIds: ["e2"],
              rationaleCodes: [],
              forbiddenBecause: [],
            },
            evidence: { contractVersion: "v1", topicKey: "tB", subjectId: "math" },
          },
        },
      ],
    },
  ],
  executiveSummary: { majorTrendsHe: [""] },
};
const amb = resolveScope({
  payload: dualPayload,
  utterance: "     ?",
  selectedContextRef: null,
});
assert.equal(amb.resolutionStatus, "clarification_required");

const subVsTopic = resolveScope({
  payload: pInel,
  utterance: "    ?",
  selectedContextRef: null,
});
assert.ok(
  subVsTopic.resolutionStatus === "resolved" || subVsTopic.resolutionStatus === "clarification_required",
  "subject vs topic phrasing should resolve or clarify (no crash)",
);

const sparse = syntheticPayloadForRender();

function ParentDetailedPageParentFacingChunk({ payload }) {
  return h(
    "div",
    { className: "max-w-4xl mx-auto w-full min-w-0", dir: "rtl" },
    h(
      "div",
      { className: "no-pdf rounded-lg border border-cyan-500/20 bg-cyan-950/15 px-3 py-2" },
      h(ParentCopilotShell, { payload }),
    ),
    h(
      "section",
      { className: "pr-detailed-section" },
      h("h2", { className: "pr-detailed-section-title" }, " "),
      h(ExecutiveSummarySection, { es: normalizeExecutiveSummary(payload), compact: false }),
    ),
  );
}

const detailedHtml = renderToStaticMarkup(h(ParentDetailedPageParentFacingChunk, { payload: sparse }));
assertParentFacingHtmlHasNoLeaks(detailedHtml, "phase6 parent detailed + copilot chunk SSR");

const copilotHtml = renderToStaticMarkup(h(ParentCopilotShell, { payload: sparse }));
assertParentFacingHtmlHasNoLeaks(copilotHtml, "phase6 parent copilot panel SSR");

const mobileHtml = renderToStaticMarkup(h("div", { style: { width: "390px" } }, h(ParentCopilotShell, { payload: sparse })));
assertParentFacingHtmlHasNoLeaks(mobileHtml, "phase6 mobile copilot SSR");
assert.ok(mobileHtml.length > 40, "mobile snapshot should render non-trivial shell markup");

console.log("parent-copilot-phase6-hebrew-robustness-suite: PASS");
