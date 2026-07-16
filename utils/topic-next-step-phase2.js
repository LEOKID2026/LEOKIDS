/**
 * Phase 2 — risks, trend derivatives, and recommendation blockers (no UI).
 * Called only from topic-next-step-engine.js.
 */

import { applyIntelligenceDecisionGuards } from "./intelligence-layer-v1/intelligence-decision-guards.js";
import { getIntelligencePriority } from "./intelligence-layer-v1/signal-priority.js";
import {
  INTERVENTION_TYPE_LABEL_HE,
  NEXT_SUPPORT_ADJUSTMENT_LABEL_HE,
  NEXT_SUPPORT_SEQUENCE_ACTION_LABEL_HE,
  OUTCOME_BASED_NEXT_MOVE_LABEL_HE,
  RECOMMENDATION_CONTINUATION_DECISION_LABEL_HE,
  NEXT_CYCLE_DECISION_FOCUS_LABEL_HE,
  diagnosticTypeLabelHe,
} from "./parent-report-ui-explain-he.js";
import {
  meaningExplainSentenceHe,
  preliminarySignalHe,
} from "./parent-report-language/parent-report-hebrew-copy-spec.js";
import { isScienceSubjectId } from "../lib/learning/display-level.js";
import { resolveRowDisplayLevelKey } from "../lib/learning/parent-report-display-level.js";

const VAGUE_FOUNDATION_PHRASE = /חלקים פשוטים יותר|יסוד שעליו הוא נשען/i;

const AGGRESSIVE = new Set([
  "advance_level",
  "advance_grade_topic_only",
  "drop_one_level_topic_only",
  "drop_one_grade_topic_only",
]);

export function isAggressiveStep(step) {
  return AGGRESSIVE.has(step);
}

export function isAdvanceOnlyStep(step) {
  return step === "advance_level" || step === "advance_grade_topic_only";
}

const STEP_LABEL_FALLBACK_HE = "Continued measured support on the same issue";
const INTERVENTION_LABEL_FALLBACK_HE = "Measured support and retesting before further change";

export function interventionTypeLabelHe(intervention) {
  const key = String(intervention || "").trim();
  return INTERVENTION_TYPE_LABEL_HE[key] || INTERVENTION_LABEL_FALLBACK_HE;
}

/**
 * @param {Record<string, unknown>|null|undefined} trend
 * @param {Record<string, unknown>} row
 */
export function buildTrendDerivedSignals(trend, row) {
  const t = trend && typeof trend === "object" ? trend : null;
  const ad = String(t?.accuracyDirection || "unknown");
  const id = String(t?.independenceDirection || "unknown");
  const fd = String(t?.fluencyDirection || "unknown");
  const tc = Number(t?.confidence);
  const trendConfOk = Number.isFinite(tc) && tc >= 0.38;

  const positiveAccuracy = ad === "up";
  const negativeAccuracy = ad === "down";
  const unclearTrend = ad === "unknown" || !trendConfOk;

  const fragileProgressPattern = ad === "up" && id === "down";
  const independenceDeteriorating = id === "down";
  const fluencySupportWithoutAccuracyDrop = fd === "up" && ad !== "down";

  const curAcc = t?.windows?.currentPeriod?.accuracy;
  const recentAcc = t?.windows?.recentShortWindow?.accuracy;
  const recentDifficultyIncrease =
    Number.isFinite(Number(curAcc)) &&
    Number.isFinite(Number(recentAcc)) &&
    Number(recentAcc) < Number(curAcc) - 10;

  const negativeTrendAfterRecentDifficultyIncrease = negativeAccuracy && !!recentDifficultyIncrease;

  const prevAcc = t?.windows?.previousComparablePeriod?.accuracy;
  const periodRegression =
    Number.isFinite(Number(prevAcc)) &&
    Number.isFinite(Number(curAcc)) &&
    Number(curAcc) < Number(prevAcc) - 12;

  const progressSupportsAdvance =
    (ad === "up" || ad === "flat") && !fragileProgressPattern && !independenceDeteriorating && trendConfOk;

  return {
    accuracyDirection: ad,
    independenceDirection: id,
    fluencyDirection: fd,
    trendConfidence01: Number.isFinite(tc) ? tc : null,
    trendConfOk,
    positiveAccuracy,
    negativeAccuracy,
    unclearTrend,
    fragileProgressPattern,
    independenceDeteriorating,
    fluencySupportWithoutAccuracyDrop,
    recentDifficultyIncrease,
    negativeTrendAfterRecentDifficultyIncrease,
    periodRegression,
    progressSupportsAdvance,
  };
}

/**
 * @param {Record<string, unknown>} row
 * @param {Record<string, unknown>|null|undefined} trend
 * @param {Record<string, unknown>|null|undefined} behaviorProfile
 * @param {ReturnType<typeof buildTrendDerivedSignals>} trendDer
 */
function resolvePhase2BehaviorType(row, behaviorProfile) {
  const prof = String(behaviorProfile?.dominantType || "").trim();
  const ex =
    row?.topicEngineRowSignals && typeof row.topicEngineRowSignals === "object"
      ? row.topicEngineRowSignals
      : null;
  const exDiag = ex?.diagnosticType != null ? String(ex.diagnosticType).trim() : "";
  if (prof && prof !== "undetermined") return prof;
  if (exDiag && exDiag !== "undetermined") return exDiag;
  if (prof) return prof;
  return exDiag || "undetermined";
}

function mergeExplicitTopicEngineRiskFlags(row, base) {
  const ex =
    row?.topicEngineRowSignals && typeof row.topicEngineRowSignals === "object"
      ? row.topicEngineRowSignals
      : null;
  const rf = ex?.riskFlags && typeof ex.riskFlags === "object" ? ex.riskFlags : null;
  if (!rf) return base;
  const out = { ...base };
  if (rf.hintDependenceRisk === true) out.hintDependenceRisk = true;
  if (rf.falsePromotionRisk === true) out.falsePromotionRisk = true;
  if (rf.falseRemediationRisk === true) out.falseRemediationRisk = true;
  if (rf.speedOnlyRisk === true) out.speedOnlyRisk = true;
  if (rf.recentTransitionRisk === true) out.recentTransitionRisk = true;
  return out;
}

export function buildPhase2RiskFlags(row, trend, behaviorProfile, trendDer) {
  const suff = row?.dataSufficiencyLevel;
  const ev = row?.evidenceStrength;
  const behaviorType = resolvePhase2BehaviorType(row, behaviorProfile);
  const hintRate = behaviorProfile?.signals?.hintRate;
  const hintKnown = Number(behaviorProfile?.signals?.hintKnownCount) || 0;
  const modeKey = String(row?.modeKey || "").trim();
  const q = Number(row?.questions) || 0;
  const acc = Math.round(Number(row?.accuracy) || 0);
  const wrongRatio = q > 0 ? Math.max(0, Number(row?.wrong) || 0) / q : 0;

  let insufficientEvidenceRisk =
    suff !== "strong" || ev === "low" || row?.isEarlySignalOnly === true || q < 12;

  let hintDependenceRisk =
    behaviorType === "instruction_friction" ||
    (hintRate != null && hintRate >= 0.32 && hintKnown >= 3);

  let speedOnlyRisk =
    behaviorType === "speed_pressure" ||
    ((modeKey === "speed" || modeKey === "marathon") && acc >= 55 && wrongRatio < 0.32);

  let falsePromotionRisk =
    insufficientEvidenceRisk ||
    hintDependenceRisk ||
    trendDer.fragileProgressPattern ||
    (behaviorType === "fragile_success" && !trendDer.progressSupportsAdvance) ||
    (trendDer.independenceDeteriorating && trendDer.positiveAccuracy);

  const strongKnowledgeGapEvidence =
    behaviorType === "knowledge_gap" &&
    (ev === "strong" || ev === "medium") &&
    q >= 10 &&
    wrongRatio >= 0.28;

  let falseRemediationRisk =
    speedOnlyRisk ||
    (behaviorType === "careless_pattern" && acc >= 58) ||
    (trendDer.positiveAccuracy && behaviorType !== "knowledge_gap") ||
    (trendDer.fluencySupportWithoutAccuracyDrop && behaviorType === "speed_pressure");

  let recentTransitionRisk =
    (String(row?.levelKey) === "hard" &&
      trendDer.negativeAccuracy &&
      trendDer.recentDifficultyIncrease) ||
    (trendDer.periodRegression && trendDer.negativeAccuracy);

  ({
    hintDependenceRisk,
    falsePromotionRisk,
    falseRemediationRisk,
    speedOnlyRisk,
    recentTransitionRisk,
  } = mergeExplicitTopicEngineRiskFlags(row, {
    hintDependenceRisk,
    falsePromotionRisk,
    falseRemediationRisk,
    speedOnlyRisk,
    recentTransitionRisk,
  }));

  return {
    falsePromotionRisk,
    falseRemediationRisk,
    speedOnlyRisk,
    hintDependenceRisk,
    insufficientEvidenceRisk,
    recentTransitionRisk,
    behaviorType,
    strongKnowledgeGapEvidence,
    trendDerSnapshot: {
      fragileProgressPattern: trendDer.fragileProgressPattern,
      progressSupportsAdvance: trendDer.progressSupportsAdvance,
      unclearTrend: trendDer.unclearTrend,
      negativeTrendAfterRecentDifficultyIncrease: trendDer.negativeTrendAfterRecentDifficultyIncrease,
    },
  };
}

/**
 * @param {string} proposed
 * @param {object} ctx
 * @returns {{ step: string, blockers: Array<{ id: string, detailHe: string }>, traceAdds: unknown[], phase2RuleId: string }}
 */
export function applyPhase2GuardsToStep(proposed, ctx) {
  const {
    row,
    riskFlags,
    trendDer,
    behaviorType,
    sufficiencyStrong,
    strongKnowledgeGapEvidence,
  } = ctx;

  let step = proposed;
  const blockers = [];
  const traceAdds = [];
  let phase2RuleId = "phase2_pass_through";
  const subjectId = row?.subjectId || row?.subject || null;
  const displayLevel = resolveRowDisplayLevelKey(subjectId, row);

  const pushTrace = (id, detailHe, fromStep, toStep) => {
    traceAdds.push({
      source: "recommendation",
      phase: "phase2_blocker",
      ruleId: id,
      data: { fromStep, toStep, detailHe },
    });
  };

  const apply = (id, detailHe, newStep) => {
    if (step === newStep) return;
    const fromStep = step;
    blockers.push({ id, detailHe });
    pushTrace(id, detailHe, fromStep, newStep);
    step = newStep;
    phase2RuleId = id;
  };

  const isDrop = step === "drop_one_level_topic_only" || step === "drop_one_grade_topic_only";
  const isAdvance = step === "advance_level" || step === "advance_grade_topic_only";

  if (isScienceSubjectId(subjectId) && isAdvance) {
    apply(
      "science_regular_only_block_advance",
      "In the sciences they remain in ordinary practice only.",
      "maintain_and_strengthen"
    );
  }

  if (displayLevel === "advanced" && isDrop) {
    apply(
      "advanced_failure_not_fundamental",
      "The challenge in advanced was currently high. It is recommended to return to normal practice.",
      "suggest_return_to_regular"
    );
  }

  if (hintDependenceRiskActive(riskFlags) && isAdvance) {
    apply(
      "hint_dependence_block_advance",
      "The child is still helped by high hints - no automatic level/grade promotion.",
      "maintain_and_strengthen"
    );
  }

  if (behaviorType === "fragile_success" && isAdvance) {
    if (!trendDer.progressSupportsAdvance || hintDependenceRiskActive(riskFlags) || !sufficiencyStrong) {
      apply(
        "fragile_success_block_advance",
        "Success is still not always maintained alone - you do not progress quickly before you see more independence and a consistent repetition of success.",
        "maintain_and_strengthen"
      );
    }
  }

  if (behaviorType === "stable_mastery" && isAggressiveStep(step)) {
    if (riskFlags.insufficientEvidenceRisk || riskFlags.falsePromotionRisk || trendDer.unclearTrend) {
      apply(
        "stable_mastery_guard_advance",
        "The child succeeds in this subject over time - they are promoted only when there is enough practice and the risk of false promotion is low.",
        "maintain_and_strengthen"
      );
    }
  }

  if (riskFlags.falsePromotionRisk && isAggressiveStep(step)) {
    apply("false_promotion_guard", "There is a fear that progress will be too early - we are not promoting now.", "maintain_and_strengthen");
  }

  if (trendDer.unclearTrend && isAggressiveStep(step)) {
    const qN = Number(row?.questions) || 0;
    const accN = Math.round(Number(row?.accuracy) || 0);
    const strongPerformanceNoTrend =
      sufficiencyStrong &&
      qN >= 18 &&
      accN >= 88 &&
      row?.excellent === true &&
      !hintDependenceRiskActive(riskFlags) &&
      !riskFlags.falsePromotionRisk &&
      !trendDer.fragileProgressPattern;
    if (!strongPerformanceNoTrend) {
      apply(
        "unclear_trend_cap_aggressive",
        "It is still not clear the direction of the accuracy over time - we are not making a big change now.",
        "maintain_and_strengthen"
      );
    }
  }

  if (trendDer.fragileProgressPattern && isAdvance) {
    apply(
      "accuracy_up_independence_down",
      "The accuracy is increasing, but the child still needs more help - we are not progressing too fast.",
      "maintain_and_strengthen"
    );
  }

  if (riskFlags.speedOnlyRisk && isDropStep(step)) {
    apply("speed_only_block_drop", "A difficulty that appears mainly under time pressure - you don't lower a level/class just because of that.", "maintain_and_strengthen");
  }

  if (behaviorType === "instruction_friction" && isDropStep(step) && !strongKnowledgeGapEvidence) {
    apply(
      "instruction_friction_soften_drop",
      "The difficulty may be related to understanding the task or the need for hints - you don't lower a level without enough practice that shows it is really necessary.",
      "remediate_same_level"
    );
  }

  if (behaviorType === "careless_pattern" && isDropStep(step)) {
    apply("careless_pattern_before_drop", "Negligence pattern - prefer a boost in level before a drop.", "remediate_same_level");
  }

  if (behaviorType === "knowledge_gap" && isDropStep(step)) {
    if (trendDer.positiveAccuracy && !trendDer.negativeTrendAfterRecentDifficultyIncrease) {
      apply(
        "knowledge_gap_respect_positive_trend",
        "There is a sign of difficulty, but the accuracy is improving - it is better to strengthen at the same level before lowering a level.",
        "remediate_same_level"
      );
    }
  }

  if (riskFlags.falseRemediationRisk && isDropStep(step)) {
    if (riskFlags.speedOnlyRisk || (trendDer.positiveAccuracy && behaviorType !== "knowledge_gap")) {
      apply("false_remediation_guard", "There is a fear of too heavy practice - short and focused strengthening is better.", "remediate_same_level");
    }
  }

  if (trendDer.negativeTrendAfterRecentDifficultyIncrease && step === "drop_one_grade_topic_only") {
    apply(
      "recent_transition_caution",
      "After the last difficulty, a drop is visible - you should check carefully before dropping a grade.",
      "remediate_same_level"
    );
  }

  if (trendDer.fluencySupportWithoutAccuracyDrop && riskFlags.speedOnlyRisk && step === "drop_one_level_topic_only") {
    apply(
      "fluency_positive_speed_context",
      "There is an improvement in pace without a drop in accuracy - you don't drop a level just because of speed.",
      "maintain_and_strengthen"
    );
  }

  if (riskFlags.insufficientEvidenceRisk && isAggressiveStep(step)) {
    apply("insufficient_evidence_cap_phase2", "There is not enough information to make a big change now.", "maintain_and_strengthen");
  }

  const qR = Number(row?.questions) || 0;
  const accR = Math.round(Number(row?.accuracy) || 0);
  const wrongRR = qR > 0 ? Math.max(0, Number(row?.wrong) || 0) / qR : 0;
  const modeR = String(row?.modeKey || "").trim();
  const fragileLikeProfile =
    behaviorType === "fragile_success" ||
    behaviorType === "instruction_friction" ||
    (behaviorType === "speed_pressure" && (modeR === "speed" || modeR === "marathon"));
  if (
    step === "maintain_and_strengthen" &&
    fragileLikeProfile &&
    behaviorType !== "stable_mastery" &&
    sufficiencyStrong &&
    qR >= 10 &&
    wrongRR >= 0.15 &&
    accR < 88
  ) {
    apply(
      "risk_profile_prefer_remediate_over_maintain",
      "A risk/fragility pattern has been identified - prefer focused strengthening at the same level over general work only.",
      "remediate_same_level"
    );
  }

  const originalStep = step;
  const ivResult = applyIntelligenceDecisionGuards(step, {
    intelligenceV1: ctx?.intelligenceV1 || null,
  });
  if (ivResult.applied) {
    step = ivResult.step;
    traceAdds.push({
      source: "intelligence",
      phase: "phase5_intelligence_guard",
      ruleId: "intelligence_decision_guards",
      data: {
        beforeStep: originalStep,
        afterStep: ivResult.step,
        blockers: ivResult.blockers,
        intelligenceSnapshot: ctx.intelligenceV1 || null,
      },
    });
  }

  return { step, blockers, traceAdds, phase2RuleId };
}

/**
 * Phase 7 — diagnostic restraint: don't change level sharply when the data is partial or limited.
 * @param {string} step
 * @param {{ restraint?: Record<string, unknown>, rootCause?: Record<string, unknown> }} ctx
 */
export function applyPhase7RestraintGuards(step, ctx) {
  const restraint = ctx?.restraint && typeof ctx.restraint === "object" ? ctx.restraint : {};
  const rootCause = ctx?.rootCause && typeof ctx.rootCause === "object" ? ctx.rootCause : {};
  const shouldAvoid = !!restraint.shouldAvoidStrongConclusion;
  const rc = String(rootCause.rootCause || "");

  let out = step;
  const blockers = [];
  const traceAdds = [];
  let phase7RuleId = "phase7_pass";

  const pushTrace = (id, detailHe, fromStep, toStep) => {
    traceAdds.push({
      source: "recommendation",
      phase: "phase7_restraint",
      ruleId: id,
      data: { fromStep, toStep, detailHe },
    });
  };

  const apply = (id, detailHe, newStep) => {
    if (out === newStep) return;
    const fromStep = out;
    blockers.push({ id, detailHe });
    pushTrace(id, detailHe, fromStep, newStep);
    out = newStep;
    phase7RuleId = id;
  };

  if (shouldAvoid) {
    if (isAdvanceOnlyStep(out)) {
      apply(
        "phase7_restraint_cap_advance",
        "The data is still partial or uneven - no grade or difficulty level is promoted at this time.",
        "maintain_and_strengthen"
      );
    }
    if (isDropStep(out)) {
      apply(
        "phase7_restraint_soften_drop",
        "Additional practices will help present a clearer picture.",
        "remediate_same_level"
      );
    }
  }

  if (rc === "insufficient_evidence" && isDropStep(out)) {
    apply(
      "phase7_insufficient_evidence_drop",
      "Additional practices will help present a clearer picture.",
      "remediate_same_level"
    );
  }

  if (rc === "early_stage_instability" && isDropStep(out) && restraint.conclusionStrength !== "strong") {
    apply(
      "phase7_early_stage_soften_drop",
      "It's still too early to lower a level - first try a short boost.",
      "remediate_same_level"
    );
  }

  return { step: out, blockers, traceAdds, phase7RuleId };
}

/**
 * Soften the parent-facing wording when the engine restrains a clear direction.
 * @param {{ reasonHe?: string, parentHe?: string, studentHe?: string }} copy
 */
export function mergePhase7SoftHebrewCopy(copy, restraint, rootCause) {
  const c = copy && typeof copy === "object" ? copy : {};
  const addParent = [];
  const cs = String(restraint?.conclusionStrength || "");
  const level = String(restraint?.diagnosticRestraint?.level || "");
  if (cs === "withheld" || level === "insufficient") {
    addParent.push("It is still too early to determine a clear direction - a short and routine practice at the same level is better.");
  } else if (cs === "tentative" || restraint?.shouldAvoidStrongConclusion) {
    addParent.push("Summarize carefully: small and clear steps, no jumps.");
  }
  const rc = String(rootCause?.rootCause || "");
  if (rc === "speed_pressure") {
    addParent.push("Part of the difficulty may be speed pressure - worth trying the same level in a more relaxed state before downloading.");
  }
  if (rc === "instruction_friction") {
    addParent.push("It is recommended to make sure that the task is understood before additional hints.");
  }
  if (rc === "insufficient_evidence") {
    addParent.push("We will continue to collect data before a big decision.");
  }
  if (!addParent.length) return c;
  const glue = " " + addParent.join(" ");
  return {
    ...c,
    parentHe: (c.parentHe || "") + glue,
  };
}

/** @param {string} rootCauseId */
export function pickRecommendedInterventionType(rootCauseId, finalStep) {
  const rc = String(rootCauseId || "mixed_signal");
  if (finalStep === "maintain_and_strengthen" && rc === "mixed_signal") return "monitor_before_escalation";
  const map = {
    speed_pressure: "reduce_time_pressure",
    instruction_friction: "clarify_instruction_pattern",
    careless_execution: "stabilize_accuracy",
    weak_independence: "guided_to_independent_transition",
    knowledge_gap: "target_core_skill_gap",
    insufficient_evidence: "monitor_before_escalation",
    early_stage_instability: "monitor_before_escalation",
    mixed_signal: "monitor_before_escalation",
    retention_fragility: "monitor_before_escalation",
    language_load: "clarify_instruction_pattern",
    transition_gap: "target_core_skill_gap",
  };
  return map[rc] || "monitor_before_escalation";
}

/** Recommended check-in action (identifier) — for API consumers */
export function pickRecommendedEvidenceAction(rootCauseId, conclusionStrength) {
  const rc = String(rootCauseId || "");
  const cs = String(conclusionStrength || "");
  if (rc === "insufficient_evidence" || cs === "withheld") return "collect_controlled_practice";
  if (rc === "speed_pressure") return "accuracy_first_same_level";
  if (rc === "instruction_friction") return "clarify_task_reduce_hints";
  if (rc === "weak_independence") return "fade_support_gradually";
  if (rc === "knowledge_gap") return "targeted_review_errors";
  if (rc === "careless_execution") return "pause_check_before_submit";
  return "continue_short_sessions";
}

export function buildPhase7RecommendationFields(p) {
  const {
    displayName,
    finalStep,
    restraint,
    rootCause,
    riskFlags,
    trendDer,
    behaviorType,
    legacyRuleId,
  } = p;
  const rc = String(rootCause?.rootCause || "mixed_signal");
  const intervention = pickRecommendedInterventionType(rc, finalStep);
  const interventionLabelHe = interventionTypeLabelHe(intervention);
  const evidenceAction = pickRecommendedEvidenceAction(rc, restraint?.conclusionStrength);
  const evidenceActionHe =
    evidenceAction === "collect_controlled_practice"
      ? "Accumulate another short practice at the same level of difficulty, with an emphasis on accuracy and not on level jumping."
      : evidenceAction === "accuracy_first_same_level"
        ? "Same level of difficulty in relaxed mode - accuracy before speed."
        : evidenceAction === "clarify_task_reduce_hints"
          ? "Read the wording of the task together and then try before another clue."
          : evidenceAction === "fade_support_gradually"
            ? "Gradually reduce the direction after a small clear success."
            : evidenceAction === "targeted_review_errors"
              ? "Repeat specific mistakes at the same level until stabilization."
              : evidenceAction === "pause_check_before_submit"
                ? "A short stop before sending - checking against the wording."
                : "Continue short sessions to refine the image.";

  const nar = String(rootCause?.rootCauseNarrativeHe || "").trim();
  const stepLab = stepLabelHe(finalStep);
  const reasoningParts = [];
  reasoningParts.push(`Regarding ${displayName}: ${nar || "Based on recent practice, this is the direction that stands out right now."}`);
  reasoningParts.push(`The selected step: ${stepLab}.`);
  reasoningParts.push(`What is recommended to do now: ${interventionLabelHe}.`);
  if (legacyRuleId) reasoningParts.push(preliminarySignalHe());
  if (riskFlags?.speedOnlyRisk) reasoningParts.push("A speed context has been activated.");
  if (trendDer?.fragileProgressPattern) reasoningParts.push("Success is still not completely stable.");
  if (behaviorType && behaviorType !== "undetermined") {
    reasoningParts.push(meaningExplainSentenceHe(null, behaviorType));
  }

  const alt = Array.isArray(restraint?.alternativeExplanations) ? restraint.alternativeExplanations : [];
  const whatWouldIncreaseConfidenceHe =
    alt.length > 0
      ? alt.join(" ")
      : "More questions in the selected period, a more precise direction, and less need for hints - will help to understand the picture better.";

  const whyNot =
    String(restraint?.diagnosticCautionHe || "").trim() ||
    (restraint?.conclusionStrength === "strong"
      ? "There is no special sign that requires you to stop at this stage."
      : "Currently maintaining careful wording due to scope of practice and trend.");

  return {
    recommendationReasoningHe: reasoningParts.join(" "),
    recommendedInterventionType: intervention,
    recommendedEvidenceAction: evidenceAction,
    recommendedEvidenceActionHe: evidenceActionHe,
    whatWouldIncreaseConfidenceHe,
    whyNotAStrongerConclusionHe: whyNot,
  };
}

/**
 * Phase 9 — practice mode, transfer, and mistake/memory-focused actions.
 * @param {object} p
 * @param {string} [p.dominantMistakePattern]
 * @param {string} [p.learningStage]
 * @param {string} [p.retentionRisk]
 * @param {string} [p.transferReadiness]
 * @param {string} [p.rootCause]
 * @param {Record<string, boolean>|null} [p.riskFlags]
 */
export function buildPhase9RecommendationOverlay(p) {
  const mp = String(p?.dominantMistakePattern || "");
  const ls = String(p?.learningStage || "");
  const tr = String(p?.transferReadiness || "");
  const rr = String(p?.retentionRisk || "");
  const hint = !!p?.riskFlags?.hintDependenceRisk;

  let recommendedPracticeMode = "slow_guided_accuracy";
  if (ls === "insufficient_longitudinal_evidence" || mp === "insufficient_mistake_evidence") {
    recommendedPracticeMode = "observe_only";
  } else if (ls === "regression_signal" || ls === "fragile_retention" || rr === "high") {
    recommendedPracticeMode = "review_and_hold";
  } else if (mp === "concept_confusion" || mp === "procedure_break") {
    recommendedPracticeMode = "error_reduction_loop";
  } else if (mp === "speed_driven_error") {
    recommendedPracticeMode = "slow_guided_accuracy";
  } else if (mp === "support_dependent_success" || mp === "instruction_misread") {
    recommendedPracticeMode = "guided_release";
  } else if (ls === "transfer_emerging" || (ls === "stable_control" && tr === "emerging")) {
    recommendedPracticeMode = "stabilize_then_transfer";
  } else if (ls === "early_acquisition") {
    recommendedPracticeMode = "observe_only";
  }

  let recommendedTransferStep = "hold_same_conditions";
  if (tr === "ready" && ls === "stable_control" && !hint) {
    recommendedTransferStep = "micro_transfer_same_topic";
  } else if (tr === "emerging" && rr === "low" && ls !== "fragile_retention" && ls !== "regression_signal") {
    recommendedTransferStep = "micro_transfer_same_topic";
  } else if (tr === "not_ready" || ls === "regression_signal" || ls === "fragile_retention") {
    recommendedTransferStep = "hold_same_conditions";
  } else {
    recommendedTransferStep = "limited_probe_same_level";
  }

  let reviewBeforeAdvanceHe = "";
  if (rr === "high" || ls === "fragile_retention" || ls === "regression_signal") {
    reviewBeforeAdvanceHe =
      "Repeat the same level in a few short exercises before changing the difficulty level or opening a new topic.";
  } else if ((mp === "concept_confusion" || mp === "procedure_break") && tr !== "ready") {
    reviewBeforeAdvanceHe = "to close a circle of similar mistakes at the same level before jumping forward.";
  } else if (hint && tr !== "ready") {
    reviewBeforeAdvanceHe = "The child is still helped by hints, so it's worth continuing with regular practice before moving on to advanced.";
  }

  let mistakeFocusedActionHe = "";
  if (mp === "speed_driven_error") {
    mistakeFocusedActionHe = "Short tasks without a watch - accuracy before speed.";
  } else if (mp === "instruction_misread") {
    mistakeFocusedActionHe = "Joint reading of the task and wording in simple words before calculation.";
  } else if (mp === "support_dependent_success") {
    mistakeFocusedActionHe = "A short independent experience and then a comparison together - without canceling help suddenly.";
  } else if (mp === "concept_confusion") {
    mistakeFocusedActionHe = "Repetition of a typical error with one conceptual explanation per session.";
  } else if (mp === "procedure_break") {
    mistakeFocusedActionHe = "Write an order of operations on a draft and go step by step.";
  } else if (mp === "insufficient_mistake_evidence") {
    mistakeFocusedActionHe = "Record 2-3 short sessions at the same level before distilling a type of error.";
  }

  let memoryFocusedActionHe = "";
  if (ls === "early_acquisition") {
    memoryFocusedActionHe = "Short and repetitive practice - without expecting a quick transfer.";
  } else if (ls === "partial_stabilization") {
    memoryFocusedActionHe = "Keep the same practice for another week and see a small improvement.";
  } else if (ls === "stable_control") {
    memoryFocusedActionHe = "keep the same pace; Praise perseverance before adding change.";
  } else if (ls === "fragile_retention") {
    memoryFocusedActionHe = "Strengthen again at the same level - the preservation is still fragile.";
  } else if (ls === "regression_signal") {
    memoryFocusedActionHe = "Simplify a task and shorten a session until accuracy is established.";
  } else if (ls === "transfer_emerging") {
    memoryFocusedActionHe = "Allow a small experiment within the topic with a quick test at the end.";
  } else if (ls === "insufficient_longitudinal_evidence") {
    memoryFocusedActionHe = "Don't conclude a long trend yet - check again after a little more practice.";
  }

  return {
    recommendedPracticeMode,
    recommendedTransferStep,
    reviewBeforeAdvanceHe,
    mistakeFocusedActionHe,
    memoryFocusedActionHe,
  };
}

/**
 * Phase 10 — support-adjustment direction (text + identifier) based on response to intervention and re-checking the data.
 * @param {object} p
 */
export function buildPhase10RecommendationOverlay(p) {
  const rti = String(p?.responseToIntervention || "not_enough_evidence");
  const san = String(p?.supportAdjustmentNeed || "monitor_only");
  const rec = String(p?.recalibrationNeed || "none");
  const cf = String(p?.conclusionFreshness || "medium");
  const fs = String(p?.freshnessState || "unknown");
  const weakEff = rti === "not_enough_evidence";
  const staleish = fs === "stale" || fs === "aging" || cf === "low" || cf === "expired";
  const finalStep = String(p?.finalStep || "");

  let nextSupportAdjustment = "continue_same_plan";
  if (weakEff && (rec === "structured_recheck" || cf === "expired" || fs === "stale")) {
    nextSupportAdjustment = "recheck_before_advancing";
  } else if (weakEff) {
    nextSupportAdjustment = "pause_and_observe";
  } else if (rti === "regression_under_support") {
    nextSupportAdjustment = "switch_strategy";
  } else if (rti === "stalled_response") {
    nextSupportAdjustment = san === "change_strategy" ? "switch_strategy" : "continue_and_tighten_focus";
  } else if (rti === "over_supported_progress") {
    nextSupportAdjustment = "continue_and_reduce_support";
  } else if (rti === "independence_growing") {
    nextSupportAdjustment = "continue_and_reduce_support";
  } else if (rti === "early_positive_response") {
    nextSupportAdjustment = staleish || rec !== "none" ? "recheck_before_advancing" : "continue_same_plan";
  } else if (rti === "mixed_response") {
    nextSupportAdjustment = "continue_and_tighten_focus";
  }

  if (weakEff && (isAdvanceOnlyStep(finalStep) || isAggressiveStep(finalStep))) {
    nextSupportAdjustment = "recheck_before_advancing";
  }

  const nextSupportAdjustmentHe =
    NEXT_SUPPORT_ADJUSTMENT_LABEL_HE[nextSupportAdjustment] ||
    NEXT_SUPPORT_ADJUSTMENT_LABEL_HE.continue_same_plan;

  let continueWhatWorksHe = "";
  let changeBecauseHe = "";
  let recheckBeforeEscalationHe = "";
  let evidenceStillMissingHe = "";

  if (weakEff) {
    evidenceStillMissingHe =
      "There is still not enough basis to know if the support is holding the advance - don't close too early.";
  }
  if (rti === "early_positive_response" || rti === "independence_growing") {
    continueWhatWorksHe =
      "Continue with the same type of short and regular practice - that's what seems to be working right now, and check the accuracy after each session.";
  }
  if (rti === "stalled_response" || rti === "regression_under_support") {
    changeBecauseHe =
      "The image does not improve enough with the same formula - to adjust focus or change direction, not to repeat the same text without change.";
  }
  if (rti === "over_supported_progress") {
    changeBecauseHe =
      "The success is mainly with the intention - it is still not correct to conclude full control without support.";
    continueWhatWorksHe =
      "Keep the same level of difficulty, and try a shorter section with less direction in the middle - only if it remains comfortable.";
  }
  if (staleish || rec === "structured_recheck" || rec === "light_review") {
    recheckBeforeEscalationHe =
      "The information is less recent - do not rely on it alone before raising a difficulty or changing direction.";
  }
  if (rti === "mixed_response") {
    changeBecauseHe = "Mixed response to support - some progressing, some still pending; to be precise a short structure.";
  }

  return {
    nextSupportAdjustment,
    nextSupportAdjustmentHe,
    continueWhatWorksHe,
    changeBecauseHe,
    recheckBeforeEscalationHe,
    evidenceStillMissingHe,
  };
}

/**
 * Phase 11 — sequence action + wording that differentiates and avoids empty repetition.
 * @param {object} p
 */
export function buildPhase11SequenceOverlay(p) {
  const seq = String(p?.supportSequenceState || "");
  const rti = String(p?.responseToIntervention || "");
  const nextAdj = String(p?.nextSupportAdjustment || "");
  const rot = String(p?.recommendationRotationNeed || "");
  const cf = String(p?.conclusionFreshness || "");
  const sim = String(p?.adviceSimilarityLevel || "");
  const rep = String(p?.strategyRepetitionRisk || "");
  const fat = String(p?.strategyFatigueRisk || "");
  const rec = String(p?.recalibrationNeed || "");
  const fs = String(p?.freshnessState || "");

  let nextSupportSequenceAction = "continue_same_sequence";
  if (seq === "insufficient_sequence_evidence") {
    nextSupportSequenceAction = "observe_without_new_push";
  } else if (seq === "sequence_exhausted" || rot === "meaningful_rotation" || rep === "high") {
    nextSupportSequenceAction = "pause_repeat_and_switch";
  } else if (seq === "sequence_ready_for_release" || rti === "over_supported_progress" || rti === "independence_growing") {
    nextSupportSequenceAction = "begin_release_sequence";
  } else if (seq === "sequence_stalled" || rti === "stalled_response") {
    nextSupportSequenceAction = "continue_with_tighter_target";
  } else if (
    (cf === "expired" || cf === "low" || fs === "stale") &&
    (sim === "mostly_repeated" || rot === "meaningful_rotation" || rec === "structured_recheck")
  ) {
    nextSupportSequenceAction = "short_reset_then_retry";
  } else if (nextAdj === "pause_and_observe" || nextAdj === "recheck_before_advancing") {
    nextSupportSequenceAction = "observe_without_new_push";
  } else if (nextAdj === "switch_strategy") {
    nextSupportSequenceAction = "pause_repeat_and_switch";
  } else if (fat === "high" && rti !== "early_positive_response") {
    nextSupportSequenceAction = "pause_repeat_and_switch";
  }

  const nextSupportSequenceActionHe =
    NEXT_SUPPORT_SEQUENCE_ACTION_LABEL_HE[nextSupportSequenceAction] ||
    NEXT_SUPPORT_SEQUENCE_ACTION_LABEL_HE.continue_same_sequence;

  let whyThisIsDifferentNowHe = "";
  let whyWeShouldNotRepeatSameSupportHe = "";
  let whatMustHappenBeforeReleaseHe = "";
  let whatSignalsSequenceSuccessHe = "";

  if (rot === "meaningful_rotation" || sim === "mostly_repeated") {
    whyWeShouldNotRepeatSameSupportHe =
      "It is better not to repeat the same type of practice without retesting - otherwise it sounds new but does not really change.";
  }
  if (sim === "clearly_new" || rot === "light_variation") {
    whyThisIsDifferentNowHe = "There is a slight change in direction or purpose - not just another spin on the same wording.";
  }
  if (seq === "sequence_ready_for_release" && rti !== "independence_growing") {
    whatMustHappenBeforeReleaseHe =
      "Before reducing full help: two short sessions with a little success with no intention in the middle, then a short test at the end.";
  }
  if (seq === "continuing_sequence" || seq === "early_sequence") {
    whatSignalsSequenceSuccessHe =
      "Signs of success: accuracy maintained at the same level and fewer repeated mistakes of the same type - even if still accompanied.";
  }
  if (seq === "sequence_ready_for_release") {
    whatSignalsSequenceSuccessHe =
      "A sign that help can be reduced a little: independence increases a little or there is a short success without help in the middle - still not completely alone, but in a good direction.";
  }

  return {
    nextSupportSequenceAction,
    nextSupportSequenceActionHe,
    whyThisIsDifferentNowHe,
    whyWeShouldNotRepeatSameSupportHe,
    whatMustHappenBeforeReleaseHe,
    whatSignalsSequenceSuccessHe,
  };
}

/**
 * Phase 12 — continuation decision based on what was recently tried and outcome tracking.
 * @param {object} p
 */
export function buildPhase12ContinuationOverlay(p) {
  const match = String(p?.expectedVsObservedMatch || "");
  const mem = String(p?.recommendationMemoryState || "");
  const carry = String(p?.recommendationCarryover || "");
  const ft = String(p?.followThroughSignal || "");
  const sim = String(p?.adviceSimilarityLevel || "");
  const rot = String(p?.recommendationRotationNeed || "");
  const rti = String(p?.responseToIntervention || "");
  const seqAct = String(p?.nextSupportSequenceAction || "");
  const exp = String(p?.expectedOutcomeType || "");
  const obs = String(p?.observedOutcomeState || "");
  const rep = String(p?.strategyRepetitionRisk || "");
  const fs = String(p?.freshnessState || "");
  const cf = String(p?.conclusionFreshness || "");
  /** QA: a strong prior direction doesn't justify an aggressive pivot when the current data isn't recent enough */
  const evidenceStale = fs === "stale" || cf === "expired" || cf === "low";

  let recommendationContinuationDecision = "continue_but_refine";
  if (match === "misaligned" && (rot === "meaningful_rotation" || sim === "mostly_repeated")) {
    recommendationContinuationDecision = "reset_and_rebuild_signal";
  } else if (evidenceStale && match === "misaligned") {
    recommendationContinuationDecision = "do_not_repeat_without_new_evidence";
  } else if (match === "misaligned" && (mem === "usable_memory" || mem === "strong_memory")) {
    recommendationContinuationDecision = "pivot_from_prior_path";
  } else if (
    match === "not_enough_evidence" &&
    (sim === "mostly_repeated" || rep === "high" || rot === "meaningful_rotation")
  ) {
    recommendationContinuationDecision = "do_not_repeat_without_new_evidence";
  } else if ((sim === "mostly_repeated" || rep === "high") && match !== "aligned") {
    recommendationContinuationDecision = "do_not_repeat_without_new_evidence";
  } else if (
    match === "aligned" &&
    !evidenceStale &&
    (mem === "usable_memory" || mem === "strong_memory") &&
    (exp === "release_readiness" || seqAct === "begin_release_sequence") &&
    (rti === "independence_growing" || rti === "over_supported_progress" || obs === "partial_progress")
  ) {
    recommendationContinuationDecision = "begin_controlled_release";
  } else if (match === "aligned" && ft === "likely_followed" && sim !== "mostly_repeated") {
    recommendationContinuationDecision = "continue_with_same_core";
  } else if (match === "partly_aligned" || seqAct === "continue_with_tighter_target") {
    recommendationContinuationDecision = "continue_but_refine";
  }

  if (mem === "no_memory" && recommendationContinuationDecision !== "reset_and_rebuild_signal") {
    recommendationContinuationDecision = "continue_but_refine";
  }
  if (
    (mem === "light_memory" || evidenceStale) &&
    recommendationContinuationDecision === "begin_controlled_release"
  ) {
    recommendationContinuationDecision = "continue_but_refine";
  }

  let outcomeBasedNextMove = "collect_new_evidence_first";
  if (recommendationContinuationDecision === "reset_and_rebuild_signal") {
    outcomeBasedNextMove = "brief_reset_then_compare";
  } else if (recommendationContinuationDecision === "pivot_from_prior_path") {
    outcomeBasedNextMove = "switch_path_type";
  } else if (recommendationContinuationDecision === "begin_controlled_release") {
    outcomeBasedNextMove = "reduce_support_and_check_transfer";
  } else if (recommendationContinuationDecision === "continue_with_same_core") {
    outcomeBasedNextMove = "keep_current_direction";
  } else if (recommendationContinuationDecision === "continue_but_refine") {
    outcomeBasedNextMove = mem === "no_memory" || match === "not_enough_evidence" ? "collect_new_evidence_first" : "tighten_goal_definition";
  } else if (recommendationContinuationDecision === "do_not_repeat_without_new_evidence") {
    outcomeBasedNextMove = "collect_new_evidence_first";
  } else if (match === "misaligned") {
    outcomeBasedNextMove = "switch_path_type";
  }

  let whyWeThinkThisPathWorkedHe = "";
  let whyWeThinkThisPathDidNotLandHe = "";
  let whatNeedsFreshEvidenceNowHe = "";
  let whatShouldCarryForwardHe = "";

  if (match === "aligned" && (ft === "likely_followed" || ft === "possibly_followed")) {
    whyWeThinkThisPathWorkedHe =
      "What was done at home aligns with what we tried to improve - you can proceed carefully, without replacing everything at once.";
  }
  if (match === "misaligned" || obs === "contradictory_response") {
    whyWeThinkThisPathDidNotLandHe =
      "The goal was clear, but in practice there is still no sufficient adjustment to the expectation - to stop and check before another round.";
  }
  if (mem === "no_memory" || match === "not_enough_evidence") {
    whatNeedsFreshEvidenceNowHe =
      "Without building on guesswork: two short sessions with a small drawing at the end - what succeeded without help in the middle.";
  }
  if (match === "aligned" && carry === "clearly_visible") {
    whatShouldCarryForwardHe = "To leave the same short practice skeleton, and only to specify a goal or timing - without replacing everything.";
  }

  const recommendationContinuationDecisionHe =
    RECOMMENDATION_CONTINUATION_DECISION_LABEL_HE[recommendationContinuationDecision] ||
    RECOMMENDATION_CONTINUATION_DECISION_LABEL_HE.continue_but_refine;
  const outcomeBasedNextMoveHe =
    OUTCOME_BASED_NEXT_MOVE_LABEL_HE[outcomeBasedNextMove] ||
    OUTCOME_BASED_NEXT_MOVE_LABEL_HE.collect_new_evidence_first;

  return {
    recommendationContinuationDecision,
    recommendationContinuationDecisionHe,
    outcomeBasedNextMove,
    outcomeBasedNextMoveHe,
    whyWeThinkThisPathWorkedHe,
    whyWeThinkThisPathDidNotLandHe,
    whatNeedsFreshEvidenceNowHe,
    whatShouldCarryForwardHe,
  };
}

/**
 * Phase 13 — focus for the next round + decision conditions (what to check now).
 * @param {object} p
 */
export function buildPhase13NextCycleOverlay(p) {
  const gate = String(p?.gateState || "");
  const rel = String(p?.releaseGate || "");
  const piv = String(p?.pivotGate || "");
  const recg = String(p?.recheckGate || "");
  const adv = String(p?.advanceGate || "");
  const fs = String(p?.freshnessState || "");
  const cf = String(p?.conclusionFreshness || "");
  const rec = String(p?.recalibrationNeed || "");
  const match = String(p?.expectedVsObservedMatch || "");
  const mem = String(p?.recommendationMemoryState || "");
  const rti = String(p?.responseToIntervention || "");
  const ls = String(p?.learningStage || "");
  const td = p?.trendDer && typeof p.trendDer === "object" ? p.trendDer : {};
  const indepUp = String(td.independenceDirection || "") === "up" || String(p?.independenceProgress || "") === "improving";
  const stale = fs === "stale" || cf === "expired" || cf === "low" || rec === "structured_recheck";

  let nextCycleDecisionFocus = "prove_current_direction";
  if (stale || recg === "forming") {
    nextCycleDecisionFocus = "refresh_baseline_before_decision";
  } else if (piv === "forming" || (match === "misaligned" && mem !== "no_memory")) {
    nextCycleDecisionFocus = "test_if_path_is_working";
  } else if (ls === "fragile_retention" || ls === "regression_signal" || adv === "blocked") {
    nextCycleDecisionFocus = "stabilize_before_advance";
  } else if (rel === "forming" && indepUp) {
    nextCycleDecisionFocus = "prepare_for_controlled_release";
  } else if (rel === "forming" || rel === "pending" || rti === "over_supported_progress") {
    nextCycleDecisionFocus = "check_independence_before_release";
  } else if (adv === "forming") {
    nextCycleDecisionFocus = "stabilize_before_advance";
  }

  const nextCycleDecisionFocusHe =
    NEXT_CYCLE_DECISION_FOCUS_LABEL_HE[nextCycleDecisionFocus] ||
    NEXT_CYCLE_DECISION_FOCUS_LABEL_HE.prove_current_direction;

  const whatWouldJustifyReleaseHe =
    "Before reducing help: two short sessions with success at the end without the intention in the middle - still not full independence.";
  const whatWouldJustifyAdvanceHe =
    "Before a level jump: repeated success at the same difficulty level, not high retention risk, and a recent figure.";
  const whatWouldTriggerPivotHe =
    "If in the next round the same pattern without improvement - move in a slightly different direction, no more the same repetition.";
  const whatWouldTriggerRecheckHe =
    "When the information is partial or old - you should do a short check before deciding to change direction.";
  const whatEvidenceWeStillNeedHe = String(p?.targetSuccessSignalHe || "").trim()
    ? `${String(p?.targetSuccessSignalHe || "").trim()} · ${String(p?.targetObservationWindowLabelHe || "").trim()}.`
    : "A short meeting with a small record at the end - what was actually successful.";

  return {
    nextCycleDecisionFocus,
    nextCycleDecisionFocusHe,
    whatWouldJustifyReleaseHe,
    whatWouldJustifyAdvanceHe,
    whatWouldTriggerPivotHe,
    whatWouldTriggerRecheckHe,
    whatEvidenceWeStillNeedHe,
  };
}

export { buildFoundationOrderingPhase14, buildPhase14RecommendationOverlay } from "./parent-report-foundation-ordering.js";

/**
 * Phase 8 - calibrate a realistic at-home practice load (not "to practice a lot").
 * @param {object} p
 * @param {string} p.rootCause
 * @param {string} p.conclusionStrength
 * @param {boolean} [p.shouldAvoidStrongConclusion]
 * @param {string} [p.diagnosticRestraintLevel]
 * @param {number} p.q
 * @param {number} p.accuracy
 * @param {string} [p.evidenceStrength]
 * @param {string} [p.dataSufficiencyLevel]
 * @param {string} p.interventionIntensity
 * @param {string} [p.retentionRisk]
 * @param {string} [p.learningStage]
 */
export function buildPracticeCalibration(p) {
  const rc = String(p?.rootCause || "");
  const cs = String(p?.conclusionStrength || "");
  const shouldAvoid = !!p?.shouldAvoidStrongConclusion;
  const level = String(p?.diagnosticRestraintLevel || "");
  const q = Number(p?.q) || 0;
  const acc = Math.round(Number(p?.accuracy) || 0);
  const ev = String(p?.evidenceStrength || "");
  const suff = String(p?.dataSufficiencyLevel || "");
  const inten = String(p?.interventionIntensity || "focused");

  let recommendedPracticeLoad = "light";
  if (inten === "targeted" && ev === "strong" && suff === "strong" && rc === "knowledge_gap") {
    recommendedPracticeLoad = "moderate";
  } else if (inten === "light" || cs === "withheld" || cs === "tentative" || shouldAvoid) {
    recommendedPracticeLoad = "minimal";
  } else if (inten === "focused") {
    recommendedPracticeLoad = "light";
  }

  let recommendedSessionCount = 2;
  if (recommendedPracticeLoad === "minimal") recommendedSessionCount = 2;
  else if (recommendedPracticeLoad === "light") recommendedSessionCount = 3;
  else recommendedSessionCount = 3;

  let recommendedSessionLengthBand = "short";
  if (recommendedPracticeLoad === "minimal") recommendedSessionLengthBand = "very_short";
  else if (recommendedPracticeLoad === "moderate") recommendedSessionLengthBand = "moderate";

  let practiceReadiness = "building";
  if (q >= 18 && ev === "strong" && suff === "strong") practiceReadiness = "ready";
  else if (q < 8 || ev === "low" || cs === "withheld") practiceReadiness = "low";

  const escalationThresholdHe =
    rc === "insufficient_evidence" || practiceReadiness === "low"
      ? "Only sharpen focus after a week with 2-3 short sessions where accuracy is maintained."
      : rc === "speed_pressure"
        ? "Add a little time pressure only after two consecutive sessions with accuracy maintained at the same level."
        : "Add load only if two consecutive sessions show improvement in accuracy or fewer repeated errors.";

  const deescalationThresholdHe =
    "Strong resistance or drop in accuracy - return to a shorter session and simplify the task for a week.";

  if (acc >= 88 && q >= 20 && !shouldAvoid) {
    recommendedPracticeLoad = "minimal";
    recommendedSessionCount = 2;
    recommendedSessionLengthBand = "very_short";
    practiceReadiness = "ready";
  }

  if (level === "mixed" || level === "insufficient") {
    recommendedPracticeLoad = "minimal";
    recommendedSessionCount = 2;
  }

  const rr = String(p?.retentionRisk || "");
  const lsMem = String(p?.learningStage || "");
  if (rr === "high" || lsMem === "fragile_retention" || lsMem === "regression_signal") {
    recommendedPracticeLoad = "minimal";
    recommendedSessionCount = Math.min(recommendedSessionCount, 2);
    recommendedSessionLengthBand = "very_short";
    if (practiceReadiness === "ready") practiceReadiness = "building";
  }

  return {
    recommendedPracticeLoad,
    recommendedSessionCount,
    recommendedSessionLengthBand,
    escalationThresholdHe,
    deescalationThresholdHe,
    practiceReadiness,
  };
}

function hintDependenceRiskActive(rf) {
  return !!rf?.hintDependenceRisk;
}

function isDropStep(s) {
  return s === "drop_one_level_topic_only" || s === "drop_one_grade_topic_only";
}

/**
 * @param {string} sufficiencyLevel
 */
export function sufficiencyBadgeFromLevel(sufficiencyLevel) {
  const s = String(sufficiencyLevel || "");
  if (s === "strong") return "high";
  if (s === "medium") return "medium";
  return "low";
}

/**
 * @param {number} confidenceScore 0–100
 */
export function confidenceBadgeFromScore(confidenceScore) {
  const n = Number(confidenceScore);
  if (!Number.isFinite(n)) return "medium";
  if (n >= 72) return "high";
  if (n >= 42) return "medium";
  return "low";
}

export function buildRecommendationStructuredTrace(p) {
  const { inputs, derivedFlags, blockers, appliedRules, chosenRule, postCapAdjustments, intelligenceV1 } = p;
  const out = {
    version: 2,
    inputs: inputs || {},
    derivedFlags: derivedFlags || {},
    blockers: blockers || [],
    appliedRules: appliedRules || [],
    chosenRule: chosenRule || {},
    postCapAdjustments: postCapAdjustments || [],
  };
  if (intelligenceV1 && typeof intelligenceV1 === "object") {
    out.intelligenceV1 = {
      weaknessLevel: String(intelligenceV1.weaknessLevel || "none"),
      confidenceBand: String(intelligenceV1.confidenceBand || "low"),
      recurrence: !!intelligenceV1.recurrence,
    };
    out.intelligencePriority = getIntelligencePriority(out.intelligenceV1);
  }
  return out;
}

export function buildWhyThisRecommendationHe(p) {
  const {
    displayName,
    finalStep,
    riskFlags,
    trendDer,
    behaviorType,
    legacyRuleId,
    acc,
    q,
    wrongRatio,
    behaviorSignals,
    dominantMistakePatternLabelHe,
    mistakePatternNarrativeHe,
    dependencyState,
    likelyFoundationalBlocker,
    likelyFoundationalBlockerLabelHe,
    whyFoundationFirstHe,
  } = p;
  const parts = [];
  parts.push(`Recommendation regarding ${displayName}: ${stepLabelHe(finalStep)}.`);

  const accPct = typeof acc === "number" && !isNaN(acc) ? Math.round(acc) : null;
  const qNum = typeof q === "number" && !isNaN(q) ? Math.round(q) : null;
  const wrPct = typeof wrongRatio === "number" && !isNaN(wrongRatio) ? Math.round(wrongRatio * 100) : null;
  const firstTryMiss = typeof behaviorSignals?.firstTryMissRateOnWrong === "number"
    ? behaviorSignals.firstTryMissRateOnWrong : null;
  const changedRate = typeof behaviorSignals?.changedAnswerRateOnWrong === "number"
    ? behaviorSignals.changedAnswerRateOnWrong : null;
  const avgRetry = typeof behaviorSignals?.avgRetryOnWrong === "number"
    ? behaviorSignals.avgRetryOnWrong : null;
  const patternLab = String(dominantMistakePatternLabelHe || "").trim();
  const patternNar = String(mistakePatternNarrativeHe || "").trim();
  const dep = String(dependencyState || "");
  const blocker = String(likelyFoundationalBlocker || "unknown");
  const blockerLabel = String(likelyFoundationalBlockerLabelHe || "").trim();
  const whyFoundation = String(whyFoundationFirstHe || "").trim();

  if (behaviorType === "fragile_success") {
    if (firstTryMiss !== null && firstTryMiss >= 0.4) {
      parts.push(
        `The child arrives at the correct answer, but usually only after another attempt -` +
        `In the first attempt, ${Math.round(firstTryMiss * 100)}% of the problematic questions are missed.` +
        `You should strengthen confidence in the initial solution, not just the end result.`
      );
    } else if (changedRate !== null && changedRate >= 0.3) {
      parts.push(
        `The child often changes an answer (${Math.round(changedRate * 100)}% of problematic cases) -` +
        `Apparently the knowledge is still not certain enough. It is useful to practice a confident decision and not just a correct one.`
      );
    } else if (avgRetry !== null && avgRetry >= 1.15) {
      parts.push(
        `The child needs more than one attempt at a significant number of the difficult questions` +
        `(Average ${avgRetry.toFixed(1)} attempts per wrong question) -` +
        `You should strengthen the way of the solution and not only the final result.`
      );
    } else {
      const statStr = accPct !== null && qNum !== null ? `(accuracy ${accPct}% of ${qNum} questions)` : "";
      parts.push(
        `The overall accuracy seems reasonable${statStr}, but the final answer does not always reflect stable control -` +
        `There are signs of hesitation in the responses.`
      );
    }
  } else if (behaviorType === "knowledge_gap") {
    const statParts = [];
    if (accPct !== null) statParts.push(`Accuracy ${accPct}%`);
    if (qNum !== null) statParts.push(`${qNum} questions`);
    if (wrPct !== null) statParts.push(`${wrPct}% mistakes`);
    const statsStr = statParts.length ? ` (${statParts.join(", ")})` : "";
    parts.push(`${meaningExplainSentenceHe("knowledge_gap", "knowledge_gap")}${statsStr}`);
    if (patternNar) {
      parts.push(patternNar.replace(/\s+/g, " ").trim());
    } else if (patternLab) {
      parts.push(`Pattern: ${patternLab.replace(/^Pattern:\s*/i, "").replace(/^Outstanding error pattern:\s*/i, "")}.`);
    } else {
      parts.push(
        "There are mistakes on the subject - you should check again after another short practice before a more accurate conclusion.",
      );
    }
    if (whyFoundation && blocker !== "unknown" && blockerLabel && !VAGUE_FOUNDATION_PHRASE.test(blockerLabel)) {
      parts.push(whyFoundation);
    } else if (dep === "likely_foundational_block" || dep === "mixed_dependency_signal") {
      parts.push(
        "The data suggests that the problem may be related to the foundation of the subject, but there is currently insufficient information to identify which underlying part needs strengthening.",
      );
    }
  } else if (behaviorType === "stable_mastery") {
    const statStr = accPct !== null && qNum !== null ? `(accuracy ${accPct}% of ${qNum} questions)` : "";
    parts.push(`The subject seems to be under good and stable control${statStr}.`);
  } else if (behaviorType === "undetermined" || behaviorType === "insufficient_evidence") {
    const qStr = qNum !== null ? `(There are ${qNum} questions only)` : "";
    parts.push(
      `There is still not enough data to identify a clear pattern on this topic${qStr}.` +
      `A more accurate picture can be presented when there are more documented questions.`
    );
  } else {
    const statStr = accPct !== null && qNum !== null ? `(${accPct}% accuracy from ${qNum} questions)` : "";
    parts.push(`${meaningExplainSentenceHe(null, behaviorType)}${statStr}`);
  }

  if (legacyRuleId) parts.push(preliminarySignalHe());
  const rf = [];
  if (riskFlags.falsePromotionRisk) rf.push("Fear of early promotion");
  if (riskFlags.falseRemediationRisk) rf.push("Fear of overtreatment");
  if (riskFlags.speedOnlyRisk) rf.push("Tendency to speed");
  if (riskFlags.hintDependenceRisk) rf.push("The child still uses hints");
  if (riskFlags.insufficientEvidenceRisk) rf.push("Partial information only");
  if (riskFlags.recentTransitionRisk) rf.push("A recent subtle change");
  if (rf.length) parts.push(`Points to note: ${rf.join(", ")}.`);
  if (trendDer.unclearTrend) parts.push("The direction of accuracy over time is still unclear - remain cautious.");
  if (trendDer.fragileProgressPattern) parts.push("The accuracy is increasing, but the child still needs more help - we are not progressing too fast.");
  if (trendDer.progressSupportsAdvance) parts.push("If success and independence return together, cautious progress can be considered.");
  return parts.join(" ");
}

export function buildWhatCouldChangeThisHe(p) {
  const { q, behaviorType } = p;
  const parts = [];
  parts.push(`collect more than ${Math.max(12, Number(q) || 0)} questions in the selected period,`);
  parts.push("More details about errors, such as response time and retries, to refine the picture,");
  parts.push("and a clear precise direction between the current period and the previous one - can change the step.");
  if (behaviorType === "undetermined") parts.push("The pattern is still not clear enough - more data will help to understand it better.");
  return parts.join(" ");
}

function stepLabelHe(step) {
  const m = {
    advance_level: "Increasing the level of difficulty in the subject",
    advance_grade_topic_only: "Raising a class on the subject",
    maintain_and_strengthen: "establishment at the same level",
    remediate_same_level: "Reinforcement at the same level",
    drop_one_level_topic_only: "Decreased level of difficulty in the subject",
    drop_one_grade_topic_only: "A grade drop in the subject",
  };
  return m[String(step || "").trim()] || STEP_LABEL_FALLBACK_HE;
}
