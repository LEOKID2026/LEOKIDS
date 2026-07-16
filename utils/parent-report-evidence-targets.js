/**
 * Phase 13 — יעדי ראיה לסבב הבא (שפה הורית, מבוסס שורש קושי ומצב ראיות).
 */

import {
  TARGET_EVIDENCE_TYPE_LABEL_HE,
  TARGET_OBSERVATION_WINDOW_LABEL_HE,
} from "./parent-report-ui-explain-he.js";

/**
 * @param {object} ctx
 */
export function buildEvidenceTargetsPhase13(ctx) {
  const root = String(ctx?.rootCause || "");
  const fs = String(ctx?.freshnessState || "");
  const cf = String(ctx?.conclusionFreshness || "");
  const mem = String(ctx?.recommendationMemoryState || "");
  const match = String(ctx?.expectedVsObservedMatch || "");
  const rti = String(ctx?.responseToIntervention || "");
  const mrec = String(ctx?.mistakeRecurrenceLevel || "");
  const ls = String(ctx?.learningStage || "");
  const weakMem = mem === "no_memory" || mem === "light_memory";
  const stale = fs === "stale" || cf === "expired" || cf === "low";

  let targetEvidenceType = "mixed_target";
  if (stale) targetEvidenceType = "fresh_data_needed";
  else if (weakMem) targetEvidenceType = "response_confirmation";
  else if (root === "speed_pressure") targetEvidenceType = "accuracy_confirmation";
  else if (root === "weak_independence") targetEvidenceType = "independence_confirmation";
  else if (ls === "fragile_retention" || ls === "regression_signal") targetEvidenceType = "retention_confirmation";
  else if (mrec === "persistent" || mrec === "repeating") targetEvidenceType = "mistake_reduction_confirmation";
  else if (match === "not_enough_evidence") targetEvidenceType = "response_confirmation";
  else if (rti === "not_enough_evidence") targetEvidenceType = "fresh_data_needed";
  else targetEvidenceType = "accuracy_confirmation";

  let targetObservationWindow = "next_short_cycle";
  if (stale || targetEvidenceType === "fresh_data_needed") targetObservationWindow = "needs_fresh_baseline";
  else if (weakMem || match === "not_enough_evidence") targetObservationWindow = "next_two_cycles";
  else if (ls === "fragile_retention") targetObservationWindow = "next_two_cycles";
  else targetObservationWindow = "next_short_cycle";

  const targetEvidenceTypeLabelHe =
    TARGET_EVIDENCE_TYPE_LABEL_HE[targetEvidenceType] || TARGET_EVIDENCE_TYPE_LABEL_HE.mixed_target;
  const targetObservationWindowLabelHe =
    TARGET_OBSERVATION_WINDOW_LABEL_HE[targetObservationWindow] || TARGET_OBSERVATION_WINDOW_LABEL_HE.unknown;

  const targetSuccessSignalHe =
    targetEvidenceType === "independence_confirmation"
      ? "A short success at the end of the task without guidance in the middle - even if not perfect."
      : targetEvidenceType === "accuracy_confirmation"
        ? "Two short sessions with similar accuracy when the pace is calm."
        : targetEvidenceType === "retention_confirmation"
          ? "A correct solution after a short break or the next day - without immediately returning to a hint."
          : targetEvidenceType === "mistake_reduction_confirmation"
            ? "Fewer mistakes of the same «pattern» at the same difficulty level."
            : targetEvidenceType === "fresh_data_needed"
              ? "One fresh practice round with a short note at the end - what changed."
              : "A short session with the same direction - and see if the child responds consistently.";

  const targetFailureSignalHe =
    "If the exact same mistake type repeats with no change - stop and narrow the goal.";

  const targetIndependenceSignalHe = "Fewer mid-task stops when the instructions are clear.";

  const targetStabilitySignalHe = "The same difficulty level with similar results across two consecutive sessions.";

  const targetFreshnessNeedHe = stale
    ? "Prefer a recent practice date and don't rely only on what was seen a while ago."
    : "It's enough to follow two short sessions before a major change.";

  const displayName = String(ctx?.displayName || "the topic").trim();
  const evidenceTargetNarrativeHe = `On «${displayName}»: ${targetEvidenceTypeLabelHe} · ${targetObservationWindowLabelHe}.`;

  const evidenceTargets = {
    version: 1,
    targetEvidenceType,
    targetObservationWindow,
  };

  return {
    evidenceTargets,
    targetEvidenceType,
    targetEvidenceTypeLabelHe,
    targetObservationWindow,
    targetObservationWindowLabelHe,
    targetSuccessSignalHe,
    targetFailureSignalHe,
    targetIndependenceSignalHe,
    targetStabilitySignalHe,
    targetFreshnessNeedHe,
    evidenceTargetNarrativeHe,
  };
}
