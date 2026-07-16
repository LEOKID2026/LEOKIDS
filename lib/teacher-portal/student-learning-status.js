/**
 * Shared student learning-status labels and thresholds (teacher + school manager UI).
 * Client-safe — no server imports.
 */

/**
 * @param {Record<string, unknown>|null|undefined} summary
 * @param {string|null|undefined} [guidanceSeverityTier]
 * @returns {{ badge: string, filterKey: string, sortRank: number }}
 */
export function deriveStudentStatusBadgeFromSummary(summary, guidanceSeverityTier = null) {
  const answers = Number(summary?.totalAnswers) || 0;
  const sessions = Number(summary?.totalSessions) || 0;
  const accuracy = summary?.accuracy != null ? Number(summary.accuracy) : null;

  if (answers === 0 && sessions === 0) {
    return { badge: "Low activity", filterKey: "low_activity", sortRank: 4 };
  }

  if (guidanceSeverityTier === "critical") {
    return { badge: "Needs intervention", filterKey: "struggling", sortRank: 5 };
  }
  if (guidanceSeverityTier === "needs_reinforcement") {
    return { badge: "Needs reinforcement", filterKey: "struggling", sortRank: 4 };
  }
  if (guidanceSeverityTier === "monitor") {
    return { badge: "Watch", filterKey: "watch", sortRank: 3 };
  }
  if (guidanceSeverityTier === "on_track") {
    if (accuracy != null && accuracy >= 90) {
      return { badge: "Strong", filterKey: "strong", sortRank: 1 };
    }
    return { badge: "On track", filterKey: "ok", sortRank: 2 };
  }

  if (answers >= 3 && accuracy != null) {
    if (accuracy < 50) return { badge: "Needs intervention", filterKey: "struggling", sortRank: 5 };
    if (accuracy < 65) return { badge: "Needs reinforcement", filterKey: "struggling", sortRank: 4 };
    if (accuracy < 75) return { badge: "Watch", filterKey: "watch", sortRank: 3 };
    if (accuracy >= 90) return { badge: "Strong", filterKey: "strong", sortRank: 1 };
    return { badge: "On track", filterKey: "ok", sortRank: 2 };
  }

  // Separate filterKey from zero-activity so filter chips can distinguish
  // "student has some activity but < 3 answers" from "student has none at all".
  return { badge: "Not enough data", filterKey: "insufficient_data", sortRank: 6 };
}

/**
 * @param {Record<string, unknown>|null|undefined} summary
 * @param {string|null|undefined} [guidanceSeverityTier]
 */
export function deriveStudentLearningStatusLabelHe(summary, guidanceSeverityTier = null) {
  return deriveStudentStatusBadgeFromSummary(summary, guidanceSeverityTier).badge;
}

/**
 * @param {string|null|undefined} tier
 * @param {number|null|undefined} cohortAccuracy
 */
export function classOrCohortLearningStatusLabelHe(tier, cohortAccuracy = null) {
  if (tier === "critical_class") return "Needs intervention";
  if (tier === "class_needs_reinforcement") return "Needs reinforcement";
  if (tier === "class_monitor") return "Watch";
  if (tier === "class_on_track") {
    if (cohortAccuracy != null && Number(cohortAccuracy) >= 90) return "Strong";
    return "On track";
  }
  if (cohortAccuracy != null && Number.isFinite(Number(cohortAccuracy))) {
    return deriveStudentLearningStatusLabelHe({
      totalAnswers: 10,
      accuracy: cohortAccuracy,
    });
  }
  return null;
}
