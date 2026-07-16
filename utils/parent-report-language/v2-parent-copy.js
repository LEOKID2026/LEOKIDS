/**
 * V2 detailed-report — parent-facing copy only (params in, strings out).
 * No business rules: callers pass counts/flags already computed.
 */

import { confidenceLevelParentSummaryHe } from "./confidence-parent-he.js";

/**
 * @param {string[]} topFocusAreasHe
 */
export function executiveV2HomeFocusHe(topFocusAreasHe) {
  const areas = Array.isArray(topFocusAreasHe) ? topFocusAreasHe.filter(Boolean) : [];
  if (!areas.length) {
    return "There's no clear focus yet - this week it helps to practice a little in a few topics and see what stays stable.";
  }
  return `Focus first on: ${areas.slice(0, 2).join(" · ")}`;
}

/**
 * @param {{ units: number, diagnosed: number, uncertain: number, stable: number }} p
 * @returns {string[]}
 */
export function executiveV2MajorTrendsLinesHe(p) {
  const units = Math.max(0, Number(p.units) || 0);
  const diagnosed = Math.max(0, Number(p.diagnosed) || 0);
  const uncertain = Math.max(0, Number(p.uncertain) || 0);
  const stable = Math.max(0, Number(p.stable) || 0);
  const actionable = Math.max(diagnosed, stable);
  if (units === 0) {
    return [
      "Not enough topics have been gathered yet in the selected period to compare between them.",
      "Short, consistent practice will add a picture that can be relied on.",
    ];
  }
  if (units === 1 && stable > 0 && diagnosed === 0) {
    return [
      "One topic was reviewed in the selected period.",
      "The direction there is positive and consistent; before expanding to more topics, it's better to stabilize this one with a bit more practice.",
    ];
  }
  const line2 =
    stable === 0 && units >= 4
      ? `When relatively many topics are reviewed at once, strong stability doesn't always show up right away in the same way across all of them - that's normal; it helps to keep practicing to stabilize what looks recurring.`
      : `Topics holding up well: ${stable} out of what was reviewed. ${actionable} topics have a basis for a focused conversation at home. ${uncertain} topics still don't have a clear picture.`;
  return [`${units} topics were reviewed in the selected period.`, line2];
}

/** @param {boolean} hasUncertain */
export function executiveV2MixedSignalNoticeHe(hasUncertain) {
  if (!hasUncertain) return "";
  return "Results in a few topics are still not stable - a bit more practice will help before settling on a clear direction.";
}

/**
 * @param {number} diagnosed
 * @param {number} units
 * @param {number} stable
 */
export function executiveV2OverallConfidenceHe(diagnosed, units, stable = 0) {
  const d = Math.max(0, Number(diagnosed) || 0);
  const u = Math.max(0, Number(units) || 0);
  const s = Math.max(0, Number(stable) || 0);
  const actionable = Math.max(d, s);
  if (u === 0) {
    return "Overall view: there still aren't enough topics in the selected period to build a clear picture for home.";
  }
  if (u === 1 && actionable === 0) {
    return "Overall view: only one topic was reviewed in the selected period right now - keeping to careful wording while we gather more practice.";
  }
  return `Overall view: ${actionable} out of ${u} topics reviewed have an initial basis for a focused conversation at home.`;
}

/**
 * @param {number} stable
 * @param {number} diagnosed
 */
export function executiveV2EvidenceBalanceHe(stable, diagnosed) {
  const s = Math.max(0, Number(stable) || 0);
  const diag = Math.max(0, Number(diagnosed) || 0);
  const rest = Math.max(0, diag - s);
  return `Points that continue to hold up well: ${s}; topics worth reinforcing or learning more about before settling on a clear direction: ${rest}.`;
}

/**
 * @param {{ p4Length: number, uncertainLength: number }} p
 */
export function executiveV2CautionNoteHe(p) {
  const p4 = Math.max(0, Number(p.p4Length) || 0);
  const u = Math.max(0, Number(p.uncertainLength) || 0);
  if (p4 > 0) return "There are topics worth watching this week - the teacher can be shown what's in the report so you can choose a short learning step together for the coming week.";
  if (u > 0) return "There's still no clear direction for some topics - a bit more practice will clarify the picture.";
  return "";
}

/** @param {number} unitsLength */
export function executiveV2ReportReadinessHe(unitsLength) {
  const n = Math.max(0, Number(unitsLength) || 0);
  return n >= 8
    ? "There's enough practice in the selected period to carefully discuss a general direction at home."
    : "Practice in the selected period is still limited - it helps to read the summary closely and keep gathering more practice.";
}

export function homePlanV2EmptyFallbackHe() {
  return "There's no single clear home action right now - short, focused practice this week would help clarify the direction.";
}

export function nextPeriodGoalsV2EmptyFallbackHe() {
  return "Goal for the coming week: more consistent, relaxed practice, and then a clear progress goal can be set.";
}

/**
 * @param {{ unitsLength: number, highPriorityCount: number, contradictoryCount: number }} p
 * @returns {string[]}
 */
export function crossSubjectV2BulletsHe(p) {
  const units = Math.max(0, Number(p.unitsLength) || 0);
  const hi = Math.max(0, Number(p.highPriorityCount) || 0);
  const strengthenCount = Math.max(0, Number(p.strengthenTopicCount) || 0);
  const c = Math.max(0, Number(p.contradictoryCount) || 0);
  /** @type {string[]} */
  const bullets = [];
  if (units > 0) {
    bullets.push(`Looking at all subjects together: ${units} topics in the selected period.`);
  }
  if (hi > 0) {
    bullets.push(`${hi} topics worth following closely this week.`);
  } else if (strengthenCount > 0) {
    bullets.push("There are a few topics worth reinforcing in the coming period.");
  }
  if (c > 0) {
    bullets.push(
      `Results in ${c} topics are still not consistent - a bit more short practice will help show whether it holds or stabilizes.`
    );
  }
  return bullets;
}

export function crossSubjectV2DataQualityNoteHe(unitsLength) {
  const n = Math.max(0, Number(unitsLength) || 0);
  return n < 8 ? "The number of topics reviewed is relatively low - the picture will get clearer as more practice accumulates." : null;
}

export function subjectV2TrendNarrativeHighPriorityHe() {
  return "There are topics worth paying attention to this week.";
}

export function subjectV2TrendNarrativeStableHe() {
  return "The patterns in the selected period have held up relatively well over time.";
}

export function subjectV2RecalibrationNeedYesHe() {
  return "Before changing direction or difficulty level - one more short round of practice.";
}

/** Canonical "no recalibration" — keep in sync with `SubjectPhase3Insights` visibility filter */
export const SUBJECT_V2_RECALIBRATION_NEED_NO_HE = "No need to change the direction to focus on right now.";

export function subjectV2RecalibrationNeedNoHe() {
  return SUBJECT_V2_RECALIBRATION_NEED_NO_HE;
}

/** When output gating blocks a firm conclusion */
export function topicRecommendationV2CautionGatedHe() {
  return "A strong direction hasn't been set for this topic yet - first, a bit more focused practice on this topic.";
}

/**
 * @param {string|null|undefined} confidenceLevel
 */
export function subjectV2ConfidenceSummaryHe(confidenceLevel) {
  return confidenceLevelParentSummaryHe(confidenceLevel);
}
