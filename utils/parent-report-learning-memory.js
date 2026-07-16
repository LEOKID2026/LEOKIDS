/**
 * Phase 9 — זיכרון למידה לאורך זמן ברמת שורה (v1).
 */

import { LEARNING_STAGE_LABEL_HE } from "./parent-report-ui-explain-he.js";

/**
 * @param {object} ctx
 * @param {Record<string, unknown>} ctx.trendDer
 * @param {string} ctx.behaviorType
 * @param {Record<string, boolean>} ctx.riskFlags
 * @param {number} ctx.q
 * @param {number} ctx.accuracy
 * @param {number} ctx.wrongRatio
 * @param {string} ctx.conclusionStrength
 * @param {string} [ctx.diagnosticRestraintLevel]
 * @param {Record<string, unknown>|null} [ctx.trend]
 */
export function buildLearningMemoryPhase9(ctx) {
  const td = ctx?.trendDer && typeof ctx.trendDer === "object" ? ctx.trendDer : {};
  const q = Number(ctx?.q) || 0;
  const acc = Math.round(Number(ctx?.accuracy) || 0);
  const wr = Math.max(0, Math.min(1, Number(ctx?.wrongRatio) || 0));
  const cs = String(ctx?.conclusionStrength || "");
  const level = String(ctx?.diagnosticRestraintLevel || "");
  const behaviorType = String(ctx?.behaviorType || "");
  const rf = ctx?.riskFlags && typeof ctx.riskFlags === "object" ? ctx.riskFlags : {};
  const trendOk = !!td.trendConfOk;
  const negAcc = !!td.negativeAccuracy;
  const negTrendRecent = !!td.negativeTrendAfterRecentDifficultyIncrease;
  const periodReg = !!td.periodRegression;
  const fragileProg = !!td.fragileProgressPattern;
  const indepDown = !!td.independenceDeteriorating;
  const posAcc = !!td.positiveAccuracy;
  const indepUp = String(td.independenceDirection || "") === "up";

  let learningStage = "insufficient_longitudinal_evidence";
  let retentionRisk = "unknown";
  let stabilizationState = "unknown";
  let transferReadiness = "not_ready";
  let independenceProgress = "unknown";
  /** @type {string[]} */
  const memEvidence = [];

  if (q < 8 || !trendOk || cs === "withheld" || level === "insufficient") {
    learningStage = "insufficient_longitudinal_evidence";
    retentionRisk = "unknown";
    stabilizationState = "unknown";
    transferReadiness = "not_ready";
    independenceProgress = q < 8 ? "not_visible" : "unknown";
    memEvidence.push("There is not yet enough timeline or trend confidence for a stability summary.");
  } else if (negAcc && (negTrendRecent || periodReg) && q >= 14) {
    learningStage = "regression_signal";
    retentionRisk = "high";
    stabilizationState = "unstable";
    transferReadiness = "not_ready";
    independenceProgress = indepDown ? "limited" : "unknown";
    memEvidence.push("Negative accuracy trend with a decline signal - don't jump ahead.");
  } else if (fragileProg || (behaviorType === "fragile_success" && indepDown && posAcc)) {
    learningStage = "fragile_retention";
    retentionRisk = "moderate";
    stabilizationState = "unstable";
    transferReadiness = "limited";
    independenceProgress = "limited";
    memEvidence.push("Partial success that isn't held independently - moderate retention risk.");
  } else if (behaviorType === "stable_mastery" && acc >= 82 && q >= 16 && !indepDown && !rf.hintDependenceRisk) {
    learningStage = "stable_control";
    retentionRisk = "low";
    stabilizationState = "stable";
    transferReadiness = indepUp || String(td.independenceDirection || "") === "flat" ? "emerging" : "limited";
    independenceProgress = indepUp ? "improving" : "stable";
    memEvidence.push("Relatively high accuracy with stability - control looks like it is settling.");
  } else if (posAcc && indepUp && acc >= 78 && q >= 18 && !rf.hintDependenceRisk) {
    learningStage = "transfer_emerging";
    retentionRisk = "low";
    stabilizationState = "forming";
    transferReadiness = "emerging";
    independenceProgress = "improving";
    memEvidence.push("Positive trend in independence and accuracy - starting to transfer to harder conditions.");
  } else if (q < 14 || cs === "tentative") {
    learningStage = "early_acquisition";
    retentionRisk = wr > 0.25 ? "moderate" : "low";
    stabilizationState = "unstable";
    transferReadiness = "not_ready";
    independenceProgress = "not_visible";
    memEvidence.push("Not enough longer experience in the range yet to talk about full stability - that's okay.");
  } else if (acc >= 70 && acc < 82 && !negAcc) {
    learningStage = "partial_stabilization";
    retentionRisk = fragileProg || rf.hintDependenceRisk ? "moderate" : "low";
    stabilizationState = "forming";
    transferReadiness = rf.hintDependenceRisk ? "not_ready" : "limited";
    independenceProgress = indepDown ? "limited" : indepUp ? "improving" : "stable";
    memEvidence.push("Solid moderate accuracy - partial stability without confirmation of full transfer.");
  } else {
    learningStage = "partial_stabilization";
    retentionRisk = "moderate";
    stabilizationState = "forming";
    transferReadiness = "limited";
    independenceProgress = indepDown ? "limited" : "stable";
    memEvidence.push("Middle-of-the-road picture - keep watching before changing conditions.");
  }

  // Positive trend alone cannot be stable_control — already gated above with behavior + q + indep
  if (learningStage === "stable_control" && (q < 16 || acc < 82)) {
    learningStage = "partial_stabilization";
    transferReadiness = "limited";
    memEvidence.push("Lowering maturity level: volume/accuracy are not enough for «stable control».");
  }

  if (rf.hintDependenceRisk && transferReadiness === "ready") {
    transferReadiness = "limited";
    memEvidence.push("Hint dependence - not ready for full transfer.");
  }

  const learningStageLabelHe =
    LEARNING_STAGE_LABEL_HE[learningStage] || LEARNING_STAGE_LABEL_HE.insufficient_longitudinal_evidence;

  const memoryNarrativeHe = `${learningStageLabelHe}. Retention: ${
    retentionRisk === "high"
      ? "Address review and accuracy before expanding."
      : retentionRisk === "moderate"
        ? "Monitor before changing level."
        : "A steady pace is fine."
  }`;

  const learningMemory = {
    version: 1,
    learningStage,
    retentionRisk,
    stabilizationState,
    transferReadiness,
    independenceProgress,
  };

  return {
    learningMemory,
    learningStage,
    learningStageLabelHe,
    retentionRisk,
    stabilizationState,
    transferReadiness,
    independenceProgress,
    memoryNarrativeHe,
    learningMemoryEvidence: memEvidence,
  };
}
