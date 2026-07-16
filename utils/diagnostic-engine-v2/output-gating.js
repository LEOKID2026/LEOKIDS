/**
 * שערי פלט — stage1 §11 (מימוש כללי לפי ביטחון + עדיפות + ראיות).
 * Volume strengthens evidenceStrength labels — never silences pattern visibility (LPD layer).
 */
import { buildDecisionReadinessContractsBundleV1 } from "../contracts/decision-readiness-contract-v1.js";
import { resolveEvidenceStrength } from "../evidence-strength-policy.js";

/**
 * @param {object} p
 * @param {import("./confidence-policy.js").ConfidenceLevel} p.confidence
 * @param {import("./priority-policy.js").PriorityLevel} p.priority
 * @param {boolean} p.recurrenceFull
 * @param {boolean} p.counterEvidenceStrong
 * @param {boolean} p.hasTaxonomyMatch
 * @param {boolean} p.narrowSample
 * @param {boolean} [p.weakEvidence]
 * @param {boolean} [p.hintInvalidates]
 * @param {number} [p.questions]
 * @param {number} [p.accuracy]
 * @param {number} [p.wrong]
 * @param {boolean} [p.needsPractice]
 * @param {boolean} [p.stableMasteryTag]
 * @param {number} [p.wrongCountForRules]
 * @param {string} [p.subjectId]
 * @param {string} [p.topicKey]
 * @param {object} [p.contractsV1]
 */
export function applyOutputGating(p) {
  const {
    confidence,
    priority,
    recurrenceFull,
    counterEvidenceStrong,
    hasTaxonomyMatch,
    narrowSample,
    weakEvidence = false,
    hintInvalidates = false,
    questions = 0,
    accuracy = 0,
    wrong = 0,
    needsPractice = false,
    stableMasteryTag = false,
    wrongCountForRules = 0,
    subjectId = "__unknown_subject__",
    topicKey = "__unknown_topic__",
    contractsV1 = null,
  } = p;

  const q = Math.max(0, Number(questions) || 0);
  const accRaw = Number(accuracy);
  const accNum = Number.isFinite(accRaw) ? accRaw : 0;
  const w = Math.max(0, Number(wrong) || 0);
  const wrongRatio = q > 0 ? w / q : 0;

  const positiveAuthorityEligible =
    !!stableMasteryTag ||
    (q >= 10 && accNum >= 90 && wrongRatio <= 0.2 && !needsPractice);

  /** @type {"none" | "good" | "very_good" | "excellent"} */
  let positiveAuthorityLevel = "none";
  if (positiveAuthorityEligible) {
    if (q >= 20 && accNum >= 95 && wrongRatio <= 0.05) {
      positiveAuthorityLevel = "excellent";
    } else if (q >= 20 && accNum >= 90 && wrongRatio <= 0.15) {
      positiveAuthorityLevel = "very_good";
    } else {
      positiveAuthorityLevel = "good";
    }
  }

  const hardDeny =
    confidence === "contradictory" ||
    counterEvidenceStrong ||
    weakEvidence ||
    confidence === "insufficient_data" ||
    (hintInvalidates && confidence === "early_signal_only");

  /**
   * @deprecated Read-only backward-compat mirror. NO code may use this for decisioning.
   * Derive from canonicalState.actionState instead.
   */
  const positiveConclusionAllowed = positiveAuthorityEligible && !hardDeny;
  const _deprecated_positiveConclusionAllowed = positiveConclusionAllowed;

  const confStr = String(confidence || "");
  const additiveCautionAllowed =
    positiveConclusionAllowed &&
    (recurrenceFull || wrongCountForRules >= 2 || confStr === "moderate");

  /** @type {string[]} */
  const positiveAuthorityReasonCodes = [];
  if (!positiveAuthorityEligible) positiveAuthorityReasonCodes.push("below_positive_eligibility_floor");
  if (confidence === "contradictory") positiveAuthorityReasonCodes.push("contradictory");
  if (counterEvidenceStrong) positiveAuthorityReasonCodes.push("counter_evidence_strong");
  if (weakEvidence) positiveAuthorityReasonCodes.push("weak_evidence");
  if (confidence === "insufficient_data") positiveAuthorityReasonCodes.push("insufficient_data");
  if (hintInvalidates && confidence === "early_signal_only") {
    positiveAuthorityReasonCodes.push("early_signal_invalidated");
  }

  const reasons = /** @type {string[]} */ ([]);

  const base = () => ({
    diagnosisAllowed: false,
    confidenceOnly: false,
    probeOnly: false,
    interventionAllowed: false,
    cannotConcludeYet: hardDeny,
    humanReviewRecommended: priority === "P4",
    reasons,
    positiveAuthorityEligible,
    positiveAuthorityLevel,
    positiveConclusionAllowed,
    _deprecated_positiveConclusionAllowed,
    additiveCautionAllowed,
    positiveAuthorityReasonCodes,
  });

  const buildContractsBundle = (cannotConcludeFlag) => {
    const lpdStrength = resolveEvidenceStrength(q);
    const contractStrength =
      lpdStrength === "strong"
        ? "strong"
        : lpdStrength === "supported" || lpdStrength === "emerging"
          ? "medium"
          : "low";
    return buildDecisionReadinessContractsBundleV1({
      contractsV1,
      subjectId,
      topicKey,
      q,
      evidenceStrength: weakEvidence ? "low" : contractStrength,
      dataSufficiencyLevel:
        confidence === "insufficient_data" || q < 4 ? "low" : q < 12 ? "medium" : "strong",
      conclusionStrength: cannotConcludeFlag
        ? "withheld"
        : confidence === "high"
          ? "strong"
          : confidence === "moderate"
            ? "moderate"
            : "tentative",
      cannotConcludeYet: !!cannotConcludeFlag,
      weak: !!weakEvidence || narrowSample,
      internalGateReadinessBand:
        confidence === "high" ? "high" : confidence === "moderate" ? "moderate" : "insufficient",
      gateState: cannotConcludeFlag ? "gates_not_ready" : "continue_gate_active",
      dev2ConfidenceLevel: confidence,
      confidence,
    });
  };

  if (hardDeny) {
    const out = base();
    out.cannotConcludeYet = true;
    if (confidence === "contradictory" || counterEvidenceStrong) {
      out.probeOnly = true;
      reasons.push("Contradictory evidence or strong counter-evidence");
    } else if (weakEvidence) {
      out.confidenceOnly = true;
      out.probeOnly = true;
      reasons.push("Weak evidence: relying on cumulative counts without enough event sequence");
    } else if (confidence === "insufficient_data") {
      out.confidenceOnly = true;
      out.probeOnly = true;
      reasons.push("Insufficient data per confidence policy");
    } else if (hintInvalidates && confidence === "early_signal_only") {
      out.probeOnly = true;
      out.confidenceOnly = true;
      reasons.push("Early signal only - short more practice or follow-up before a clear direction");
    }
    out.contractsV1 = buildContractsBundle(true);
    return out;
  }

  const out = base();
  out.cannotConcludeYet = false;

  if (!hasTaxonomyMatch) {
    out.probeOnly = true;
    reasons.push("No sufficient taxonomy match for the cluster");
    out.contractsV1 = buildContractsBundle(false);
    return out;
  }

  if (confidence === "early_signal_only") {
    out.probeOnly = true;
    out.confidenceOnly = true;
    reasons.push("Early signal only - short more practice or follow-up before a clear direction");
  }

  if (confidence === "low") {
    out.probeOnly = true;
    out.confidenceOnly = true;
    reasons.push("Low confidence - gather more practice before a full diagnosis");
  }

  if (confidence === "moderate") {
    out.diagnosisAllowed = true;
    if (narrowSample || !recurrenceFull) {
      out.confidenceOnly = true;
      reasons.push("Narrow sample or partial recurrence - conditional diagnosis only");
    }
    if (recurrenceFull && !narrowSample) {
      out.confidenceOnly = false;
    }
  }

  if (confidence === "high" && recurrenceFull) {
    out.diagnosisAllowed = true;
    out.confidenceOnly = false;
  }

  if (confidence === "moderate" || confidence === "high") {
    if (priority === "P2" || priority === "P3" || priority === "P4") {
      if (recurrenceFull && !counterEvidenceStrong && confidence === "high") {
        out.interventionAllowed = true;
        reasons.push("High confidence and priority support an intervention direction");
      } else if (recurrenceFull && confidence === "moderate" && (priority === "P3" || priority === "P4")) {
        out.interventionAllowed = true;
        reasons.push("Moderate confidence and high priority - focused intervention");
      }
    }
  }

  if (priority === "P4") {
    out.humanReviewRecommended = true;
    reasons.push("P4: adult/teacher review recommended per the document");
  }

  if (!out.diagnosisAllowed && !out.cannotConcludeYet) {
    out.diagnosisAllowed = confidence === "moderate" || confidence === "high";
  }

  out.contractsV1 = buildContractsBundle(false);
  return out;
}
