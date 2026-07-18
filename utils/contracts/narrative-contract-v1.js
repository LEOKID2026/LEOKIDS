/**
 * Phase 4 (approved scope): NarrativeContract only.
 * Deterministic gate-to-text binding for parent-facing wording.
 */

import { pickVariant } from "../parent-report-language/variants.js";
import {
  buildSkillDetailLimitationUncertaintyHe,
  hasTopicLevelEvidence,
  TOPIC_EVIDENCE_THRESHOLDS,
} from "../parent-report-topic-evidence.js";
import {
  resolveEngineDecisionUncertaintyText,
} from "../learning-pattern-decision/build-parent-report-engine-decision-contract.js";
import {
  EDC_DECISION_FIELD,
  ED_CLEAR_TOPIC_GAP,
  ES_STRONG,
  readEngineDecisionCode,
  readTopicEngineContract,
} from "../learning-pattern-decision/engine-decision-codes.js";

export const NARRATIVE_CONTRACT_VERSION = "v1";

export const WORDING_ENVELOPES = Object.freeze(["WE0", "WE1", "WE2", "WE3", "WE4"]);
export const HEDGE_LEVELS = Object.freeze(["none", "light", "mandatory"]);
export const ALLOWED_SECTIONS = Object.freeze(["summary", "finding", "recommendation", "limitations"]);
export const RECOMMENDATION_INTENSITY = Object.freeze(["RI0", "RI1", "RI2", "RI3"]);

const RI_RANK = { RI0: 0, RI1: 1, RI2: 2, RI3: 3 };
const ENVELOPE_CAP = { WE0: "RI0", WE1: "RI1", WE2: "RI1", WE3: "RI2", WE4: "RI3" };
const ENVELOPE_HEDGE = { WE0: "mandatory", WE1: "mandatory", WE2: "light", WE3: "light", WE4: "none" };

const REQUIRED_HEDGES_BY_LEVEL = {
  none: [],
  light: ["right now", "worth continuing to watch"],
  mandatory: ["at this stage", "still too early to determine"],
};

const FORBIDDEN_PHRASES = Object.freeze([
  "completely certain",
  "with full certainty",
  "without any doubt at all",
  "unequivocally",
]);

function normalizeTopicKey(v) {
  const s = String(v ?? "").trim();
  return s || "__unknown_topic__";
}

function normalizeSubjectId(v) {
  const s = String(v ?? "").trim();
  return s || "__unknown_subject__";
}

function normalizeDisplayName(v) {
  const s = String(v ?? "").trim();
  return s || "this topic";
}

function normalizeReadiness(value) {
  const r = String(value || "").trim().toLowerCase();
  if (r === "ready") return "ready";
  if (r === "forming" || r === "partial" || r === "moderate") return "forming";
  // "emerging" and "unstable" are valid readiness states (READINESS_STATES enum) that must
  // not silently collapse to "insufficient" — they represent partial but non-zero readiness.
  if (r === "emerging" || r === "unstable") return "forming";
  return "insufficient";
}

function normalizeConfidenceBand(value) {
  const c = String(value || "").trim().toLowerCase();
  if (c === "high") return "high";
  if (c === "medium" || c === "moderate") return "medium";
  return "low";
}

function normalizeDecisionTier(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.max(0, Math.min(4, Math.round(n)));
}

function normalizeRecommendationIntensity(value) {
  const key = String(value || "").trim().toUpperCase();
  if (RECOMMENDATION_INTENSITY.includes(key)) return key;
  if (key === "LIGHT") return "RI1";
  if (key === "FOCUSED") return "RI2";
  if (key === "TARGETED") return "RI3";
  return "RI0";
}

function deriveCannotConcludeYet(input) {
  if (input?.cannotConcludeYet === true) return true;
  if (input?.suppressAggressiveStep === true) return true;
  if (input?.contractsV1?.decision?.cannotConcludeYet === true) return true;
  const forbidden = Array.isArray(input?.contractsV1?.recommendation?.forbiddenBecause)
    ? input.contractsV1.recommendation.forbiddenBecause
    : [];
  return forbidden.includes("cannot_conclude_yet");
}

function deriveRecommendationEligibility(input) {
  const rec = input?.contractsV1?.recommendation;
  if (rec && typeof rec === "object") return !!rec.eligible;
  return false;
}

function deriveEnvelope(input) {
  const q = Math.max(
    0,
    Math.round(Number(input?.questions ?? input?.q ?? input?.contractsV1?.evidence?.questionCount) || 0),
  );
  const acc = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        Number(input?.accuracy ?? input?.contractsV1?.evidence?.accuracyPct ?? input?.contractsV1?.evidence?.accuracy) ||
          0,
      ),
    ),
  );
  const readiness = normalizeReadiness(input?.contractsV1?.readiness?.readiness);
  const confidenceBand = normalizeConfidenceBand(input?.contractsV1?.confidence?.confidenceBand);
  const decisionTier = normalizeDecisionTier(input?.contractsV1?.decision?.decisionTier);
  const cannotConcludeYet = deriveCannotConcludeYet(input);
  const eligible = deriveRecommendationEligibility(input);
  const recIntensity = normalizeRecommendationIntensity(input?.contractsV1?.recommendation?.intensity);

  if (q >= TOPIC_EVIDENCE_THRESHOLDS.minQuestionsHighVolume && !cannotConcludeYet) {
    if (acc <= 54) return "WE1";
    if (acc < 75) return "WE2";
    if (eligible && readiness === "ready" && confidenceBand === "high" && RI_RANK[recIntensity] >= 2 && acc >= 78) {
      return "WE4";
    }
    if (confidenceBand === "high" && decisionTier >= 2 && acc >= 70) return "WE3";
    return "WE2";
  }
  if (
    q >= TOPIC_EVIDENCE_THRESHOLDS.minQuestionsModerate &&
    hasTopicLevelEvidence(q) &&
    !cannotConcludeYet &&
    readiness !== "insufficient"
  ) {
    if (cannotConcludeYet) return "WE1";
    if (confidenceBand === "low") return "WE2";
    if (acc <= 54) return "WE1";
    if (acc < 75) return "WE2";
    if (eligible && readiness === "ready" && confidenceBand === "high" && acc >= 78) return "WE4";
    return "WE3";
  }

  if (cannotConcludeYet || readiness === "insufficient" || confidenceBand === "low") return "WE0";
  if (readiness === "forming" || decisionTier <= 1) return "WE1";
  if (decisionTier <= 2 || confidenceBand === "medium") return "WE2";
  if (eligible && readiness === "ready" && confidenceBand === "high" && RI_RANK[recIntensity] >= 2) return "WE4";
  return "WE3";
}

function buildObservationSlot(displayName, q, acc, seed) {
  if (q <= 0) {
    return pickVariant(seed, [
      `In ${displayName} there's still too little practice in the selected period to know how it's really going.`,
      `In ${displayName} we're only seeing a few attempts so far - that's okay; we'll add a bit more and come back to it.`,
      `In ${displayName} there's still little practice in the selected period, so we're keeping a cautious wording.`,
    ]);
  }
  return pickVariant(seed, [
    `In ${displayName} in the selected period there are ${q} questions, with about ${acc}% accuracy.`,
    `In ${displayName}, ${q} questions were collected this period, with accuracy around ${acc}%.`,
    `In ${displayName}, ${q} questions were collected this period, with average accuracy of about ${acc}%.`,
  ]);
}

function buildInterpretationSlot(envelope, cannotConcludeYet, seed, q = 0, acc = 0) {
  if (cannotConcludeYet || envelope === "WE0") {
    return pickVariant(seed, [
      "It's still too early to set a clear direction here - we'll keep watching the practice.",
      "It's too early to write a final summary; we'll add a bit more practice and see how it holds.",
      "There still isn't enough data to set a clear direction - we'll move slowly and carefully.",
    ]);
  }
  if (envelope === "WE1") {
    const qWeak = Math.max(0, Math.round(Number(q) || 0));
    const accWeak = Math.max(0, Math.min(100, Math.round(Number(acc) || 0)));
    if (qWeak >= 8 && accWeak <= 54) {
      return pickVariant(seed, [
        "There's enough practice here to see a pattern, but accuracy is still relatively low - this calls for focused reinforcement.",
        "Enough questions were collected for an initial picture, but the results still point to difficulty - focused reinforcement is worth it before marking the topic as stable.",
        "The data shows activity this period, but accuracy is low - we're keeping a cautious wording and focused practice.",
      ]);
    }
    return pickVariant(seed, [
      "We're starting to see early signs of a direction, but a bit more practice is still needed before settling on one direction.",
      "Sounds like there's a good start here, but it's still better to reinforce a bit more before setting a clear direction.",
      "This is only an initial picture, and it's still too early for a sharp summary.",
    ]);
  }
  if (envelope === "WE2") {
    return pickVariant(seed, [
      "There's a sensible direction here, and we'd prefer to see it repeat once more before firming up the direction.",
      "The report looks like it's moving in a good direction, and it's worth making sure this isn't a one-time case.",
      "The direction is relatively positive; we're keeping short, clear reinforcement before calling the topic stable.",
    ]);
  }
  if (envelope === "WE3") {
    return pickVariant(seed, [
      "The direction looks stable over the period - it's enough to continue with routine practice.",
      "Performance looks relatively well maintained for this period, and we'll keep gently watching.",
      "There's relatively good stability in the results; we'll keep encouraging and checking now and then that it holds.",
    ]);
  }
  // Grammar/claims fix: the two removed variants asserted attention/fatigue/pressure
  // with zero corresponding evidence input in this contract
  // (no attention, fatigue, or pressure signal is computed anywhere above). Kept only
  // the WE4 variant whose claim (stability over time) is actually backed by the q/acc
  // evidence gate that produced this envelope.
  return pickVariant(seed, [
    "There's a relatively strong direction here; we'll keep the same pace and make sure the success keeps repeating over time.",
    "There's relatively good stability in the results; we'll keep checking now and then that it holds going forward.",
    "The report points to relatively stable performance this period, and we'll keep watching occasionally to make sure it holds.",
  ]);
}

function buildActionSlot(capIntensity, eligible, seed) {
  if (!eligible || capIntensity === "RI0") return null;
  if (capIntensity === "RI1") {
    return pickVariant(seed, [
      "Short, focused practice at the same level is worth it, then check whether it's really worth changing something.",
      "Do one more short, clear repetition at the current level, before trying a small step forward.",
      "It's worth continuing to practice at the same difficulty level, then checking again whether it's a good time to advance.",
    ]);
  }
  if (capIntensity === "RI2") {
    return pickVariant(seed, [
      "Focused reinforcement is worth it, then a short attempt without guidance in the middle, before raising the difficulty level.",
      "Let's practice with focus and then check a few short questions independently, before advancing.",
      "Add short reinforcement, check brief independence, and only then check for progress.",
    ]);
  }
  return pickVariant(seed, [
    "A measured step forward can be considered, limited to this specific topic only.",
    "A small, controlled step forward can be considered, limited to this topic only.",
    "A careful, limited step forward can be taken, only for this topic.",
  ]);
}

function buildUncertaintySlot(hedgeLevel, seed, questionCount = 0) {
  const q = Math.max(0, Math.floor(Number(questionCount) || 0));
  if (q >= 50) return null;
  if (q >= 20 && hedgeLevel === "mandatory") return null;
  if (hedgeLevel === "mandatory") {
    return pickVariant(seed, [
      "It's still too early to draw any final conclusion here; we'll continue with regular short practice and check again later.",
      "It's still too early to set a direction - it's worth collecting more practice data and checking again.",
      "At this stage it's still too early to set a final direction; we'll keep collecting more practice data before deciding.",
    ]);
  }
  if (hedgeLevel === "light") {
    return pickVariant(seed, [
      "Right now it's worth continuing to practice and paying attention, and checking again after a bit more.",
      "It's worth checking again after a bit more short practice, to make sure the direction holds before firming it up.",
      "We'll do a bit more short practice and come back to this - with an open mind and no rush.",
    ]);
  }
  return null;
}

/**
 * @param {object} input
 */
export function buildNarrativeContractV1(input) {
  const topicKey = normalizeTopicKey(input?.topicKey || input?.topicRowKey);
  const subjectId = normalizeSubjectId(input?.subjectId);
  const displayName = normalizeDisplayName(input?.displayName);
  const qRaw = Math.max(0, Number(input?.questions ?? input?.q) || 0);
  const accRaw = Math.max(0, Math.min(100, Math.round(Number(input?.accuracy) || 0)));
  const ev =
    input?.contractsV1?.evidence && typeof input.contractsV1.evidence === "object"
      ? input.contractsV1.evidence
      : null;
  const qFromEv =
    ev && Number.isFinite(Number(ev.questionCount)) ? Math.max(0, Math.round(Number(ev.questionCount))) : null;
  const accFromEv =
    ev && Number.isFinite(Number(ev.accuracyPct))
      ? Math.max(0, Math.min(100, Math.round(Number(ev.accuracyPct))))
      : null;
  const q = qFromEv != null ? qFromEv : qRaw;
  const acc = accFromEv != null ? accFromEv : accRaw;
  const envelope = deriveEnvelope(input);
  const hedgeLevel = ENVELOPE_HEDGE[envelope] || "mandatory";
  const cannotConcludeYet = deriveCannotConcludeYet(input);
  const recommendationEligible = deriveRecommendationEligibility(input);
  const existingIntensity = normalizeRecommendationIntensity(input?.contractsV1?.recommendation?.intensity);
  const capIntensity = ENVELOPE_CAP[envelope] || "RI0";
  const cappedIntensity = RI_RANK[existingIntensity] > RI_RANK[capIntensity] ? capIntensity : existingIntensity;
  const baseSeed = `${topicKey}|${subjectId}|${displayName}|${envelope}|${q}|${acc}|${cappedIntensity}|${hedgeLevel}`;
  const hasSubskillMetadata = !!(
    input?.hasSubskillMetadata ||
    input?.skillDetailAvailable ||
    input?.contractsV1?.evidence?.skillBreakdownAvailable
  );
  let uncertainty = buildUncertaintySlot(hedgeLevel, `${baseSeed}:unc`, q);
  const topicEngineContract = readTopicEngineContract(input);
  const decisionCode =
    readEngineDecisionCode(topicEngineContract) ||
    (input && typeof input === "object" ? String(input[EDC_DECISION_FIELD] || "") : "");
  const evidenceStrength = String(
    input?.evidenceStrength || topicEngineContract?.evidenceStrength || "",
  );
  if (q >= 20 || evidenceStrength === ES_STRONG || decisionCode === ED_CLEAR_TOPIC_GAP) {
    const resolved = resolveEngineDecisionUncertaintyText(q, evidenceStrength, decisionCode);
    if (resolved) uncertainty = resolved;
  }
  if (!String(uncertainty || "").trim() && hasTopicLevelEvidence(q) && !hasSubskillMetadata) {
    const skillDetailNote = buildSkillDetailLimitationUncertaintyHe(false);
    if (skillDetailNote) {
      uncertainty = uncertainty && hedgeLevel !== "mandatory" ? `${uncertainty} ${skillDetailNote}` : skillDetailNote;
    }
  }
  if (q >= 50 && uncertainty && /עדיין מוקדם|כדאי לעקוב|מעט נתונים|too early|worth (?:watching|continuing)|little data/u.test(uncertainty)) {
    uncertainty = resolveEngineDecisionUncertaintyText(q, evidenceStrength, decisionCode);
  }

  return {
    contractVersion: NARRATIVE_CONTRACT_VERSION,
    topicKey,
    subjectId,
    wordingEnvelope: envelope,
    hedgeLevel,
    allowedTone: "parent_professional_warm",
    forbiddenPhrases: [...FORBIDDEN_PHRASES],
    requiredHedges: [...(REQUIRED_HEDGES_BY_LEVEL[hedgeLevel] || [])],
    allowedSections: [...ALLOWED_SECTIONS],
    recommendationIntensityCap: capIntensity,
    textSlots: {
      observation: buildObservationSlot(displayName, q, acc, `${baseSeed}:obs`),
      interpretation: buildInterpretationSlot(envelope, cannotConcludeYet, `${baseSeed}:int`, q, acc),
      // WE0 and WE1 must never carry an action slot — the contract invariant.
      action: (envelope === "WE0" || envelope === "WE1")
        ? null
        : buildActionSlot(cappedIntensity, recommendationEligible, `${baseSeed}:act`),
      uncertainty,
    },
  };
}

/**
 * @param {unknown} contract
 */
export function validateNarrativeContractV1(contract) {
  const c = contract && typeof contract === "object" ? contract : {};
  const errors = [];
  if (c.contractVersion !== NARRATIVE_CONTRACT_VERSION) errors.push("contractVersion must be v1");
  if (!String(c.topicKey || "").trim()) errors.push("topicKey is required");
  if (!String(c.subjectId || "").trim()) errors.push("subjectId is required");
  if (!WORDING_ENVELOPES.includes(String(c.wordingEnvelope || ""))) errors.push("wordingEnvelope invalid");
  if (!HEDGE_LEVELS.includes(String(c.hedgeLevel || ""))) errors.push("hedgeLevel invalid");
  if (c.allowedTone !== "parent_professional_warm") errors.push("allowedTone invalid");
  if (!Array.isArray(c.forbiddenPhrases)) errors.push("forbiddenPhrases must be array");
  if (!Array.isArray(c.requiredHedges)) errors.push("requiredHedges must be array");
  if (!Array.isArray(c.allowedSections)) errors.push("allowedSections must be array");
  if (!RECOMMENDATION_INTENSITY.includes(String(c.recommendationIntensityCap || ""))) {
    errors.push("recommendationIntensityCap invalid");
  }
  if (!c.textSlots || typeof c.textSlots !== "object") errors.push("textSlots must be object");
  if (!String(c?.textSlots?.observation || "").trim()) errors.push("textSlots.observation required");
  if (!String(c?.textSlots?.interpretation || "").trim()) errors.push("textSlots.interpretation required");
  if (String(c.hedgeLevel || "") === "mandatory" && !String(c?.textSlots?.uncertainty || "").trim()) {
    errors.push("mandatory hedge requires textSlots.uncertainty");
  }
  if (String(c.recommendationIntensityCap || "") === "RI0" && c?.textSlots?.action) {
    errors.push("RI0 cap forbids action text");
  }
  if ((String(c.wordingEnvelope || "") === "WE0" || String(c.wordingEnvelope || "") === "WE1") && c?.textSlots?.action != null && c?.textSlots?.action !== "") {
    errors.push("WE0/WE1 must not carry action slot");
  }
  return { ok: errors.length === 0, errors };
}

/**
 * @param {"summary"|"finding"|"recommendation"|"limitations"} section
 * @param {any} narrativeContract
 */
export function narrativeSectionTextHe(section, narrativeContract) {
  const c = narrativeContract && typeof narrativeContract === "object" ? narrativeContract : null;
  if (!c || !c.textSlots) return "";
  if (section === "summary") return String(c.textSlots.observation || "").trim();
  if (section === "finding") return String(c.textSlots.interpretation || "").trim();
  if (section === "recommendation") return String(c.textSlots.action || "").trim();
  if (section === "limitations") return String(c.textSlots.uncertainty || "").trim();
  return "";
}

/**
 * @param {object} rec
 * @param {object} narrativeContract
 * @param {{ ok: boolean, errors: string[] }} [validation]
 */
export function applyNarrativeContractToRecord(rec, narrativeContract, validation = null) {
  const existingContracts =
    rec?.contractsV1 && typeof rec.contractsV1 === "object" ? rec.contractsV1 : {};
  const v =
    validation && typeof validation === "object"
      ? { ok: !!validation.ok, errors: Array.isArray(validation.errors) ? validation.errors : [] }
      : { ok: true, errors: [] };
  return {
    ...rec,
    contractsV1: {
      ...existingContracts,
      narrative: narrativeContract,
      narrativeValidation: v,
    },
  };
}
