/**
 * V2 detailed-report — locale-aware parent-facing copy (params in, strings out).
 * Legacy export names retain `He` suffix for call-site compatibility.
 */

import { createReportTranslator } from "../../lib/reports/report-locale.js";
import { confidenceLevelParentSummaryHe } from "./confidence-parent-he.js";

const DEFAULT_REPORT_LOCALE = "en";

/**
 * @param {string|null|undefined} locale
 */
function reportT(locale) {
  return createReportTranslator(locale || DEFAULT_REPORT_LOCALE).t;
}

/**
 * @param {string[]} topFocusAreasHe
 * @param {string|null|undefined} [reportLocale]
 */
export function executiveV2HomeFocusHe(topFocusAreasHe, reportLocale = DEFAULT_REPORT_LOCALE) {
  const t = reportT(reportLocale);
  const areas = Array.isArray(topFocusAreasHe) ? topFocusAreasHe.filter(Boolean) : [];
  if (!areas.length) {
    return t("reports.v2.executive.homeFocusEmpty");
  }
  return t("reports.v2.executive.homeFocusWithAreas", {
    areas: areas.slice(0, 2).join(" · "),
  });
}

/**
 * @param {{ units: number, diagnosed: number, uncertain: number, stable: number }} p
 * @param {string|null|undefined} [reportLocale]
 * @returns {string[]}
 */
export function executiveV2MajorTrendsLinesHe(p, reportLocale = DEFAULT_REPORT_LOCALE) {
  const t = reportT(reportLocale);
  const units = Math.max(0, Number(p.units) || 0);
  const diagnosed = Math.max(0, Number(p.diagnosed) || 0);
  const uncertain = Math.max(0, Number(p.uncertain) || 0);
  const stable = Math.max(0, Number(p.stable) || 0);
  const actionable = Math.max(diagnosed, stable);
  if (units === 0) {
    return [
      t("reports.v2.executive.majorTrendsNoUnitsLine1"),
      t("reports.v2.executive.majorTrendsNoUnitsLine2"),
    ];
  }
  if (units === 1 && stable > 0 && diagnosed === 0) {
    return [
      t("reports.v2.executive.majorTrendsOneStableLine1"),
      t("reports.v2.executive.majorTrendsOneStableLine2"),
    ];
  }
  const line2 =
    stable === 0 && units >= 4
      ? t("reports.v2.executive.majorTrendsManyUnitsLine2")
      : t("reports.v2.executive.majorTrendsDefaultLine2", {
          stable,
          actionable,
          uncertain,
        });
  return [t("reports.v2.executive.majorTrendsUnitsLine1", { units }), line2];
}

/** @param {boolean} hasUncertain @param {string|null|undefined} [reportLocale] */
export function executiveV2MixedSignalNoticeHe(hasUncertain, reportLocale = DEFAULT_REPORT_LOCALE) {
  if (!hasUncertain) return "";
  return reportT(reportLocale)("reports.v2.executive.mixedSignalNotice");
}

/**
 * @param {number} diagnosed
 * @param {number} units
 * @param {number} stable
 * @param {string|null|undefined} [reportLocale]
 */
export function executiveV2OverallConfidenceHe(
  diagnosed,
  units,
  stable = 0,
  reportLocale = DEFAULT_REPORT_LOCALE
) {
  const t = reportT(reportLocale);
  const d = Math.max(0, Number(diagnosed) || 0);
  const u = Math.max(0, Number(units) || 0);
  const s = Math.max(0, Number(stable) || 0);
  const actionable = Math.max(d, s);
  if (u === 0) {
    return t("reports.v2.executive.overallConfidenceNoUnits");
  }
  if (u === 1 && actionable === 0) {
    return t("reports.v2.executive.overallConfidenceOneUnit");
  }
  return t("reports.v2.executive.overallConfidenceDefault", { actionable, units: u });
}

/**
 * @param {number} stable
 * @param {number} diagnosed
 * @param {string|null|undefined} [reportLocale]
 */
export function executiveV2EvidenceBalanceHe(stable, diagnosed, reportLocale = DEFAULT_REPORT_LOCALE) {
  const t = reportT(reportLocale);
  const s = Math.max(0, Number(stable) || 0);
  const diag = Math.max(0, Number(diagnosed) || 0);
  const rest = Math.max(0, diag - s);
  return t("reports.v2.executive.evidenceBalance", { stable: s, rest });
}

/**
 * @param {{ p4Length: number, uncertainLength: number }} p
 * @param {string|null|undefined} [reportLocale]
 */
export function executiveV2CautionNoteHe(p, reportLocale = DEFAULT_REPORT_LOCALE) {
  const t = reportT(reportLocale);
  const p4 = Math.max(0, Number(p.p4Length) || 0);
  const u = Math.max(0, Number(p.uncertainLength) || 0);
  if (p4 > 0) return t("reports.v2.executive.cautionP4");
  if (u > 0) return t("reports.v2.executive.cautionUncertain");
  return "";
}

/** @param {number} unitsLength @param {string|null|undefined} [reportLocale] */
export function executiveV2ReportReadinessHe(unitsLength, reportLocale = DEFAULT_REPORT_LOCALE) {
  const t = reportT(reportLocale);
  const n = Math.max(0, Number(unitsLength) || 0);
  return n >= 8
    ? t("reports.v2.executive.reportReadinessFull")
    : t("reports.v2.executive.reportReadinessLimited");
}

export function homePlanV2EmptyFallbackHe(reportLocale = DEFAULT_REPORT_LOCALE) {
  return reportT(reportLocale)("reports.v2.executive.homePlanEmpty");
}

export function nextPeriodGoalsV2EmptyFallbackHe(reportLocale = DEFAULT_REPORT_LOCALE) {
  return reportT(reportLocale)("reports.v2.executive.nextPeriodGoalsEmpty");
}

/**
 * @param {{ unitsLength: number, highPriorityCount: number, contradictoryCount: number, strengthenTopicCount?: number }} p
 * @param {string|null|undefined} [reportLocale]
 * @returns {string[]}
 */
export function crossSubjectV2BulletsHe(p, reportLocale = DEFAULT_REPORT_LOCALE) {
  const t = reportT(reportLocale);
  const units = Math.max(0, Number(p.unitsLength) || 0);
  const hi = Math.max(0, Number(p.highPriorityCount) || 0);
  const strengthenCount = Math.max(0, Number(p.strengthenTopicCount) || 0);
  const c = Math.max(0, Number(p.contradictoryCount) || 0);
  /** @type {string[]} */
  const bullets = [];
  if (units > 0) {
    bullets.push(t("reports.v2.executive.crossSubjectUnits", { units }));
  }
  if (hi > 0) {
    bullets.push(t("reports.v2.executive.crossSubjectHighPriority", { count: hi }));
  } else if (strengthenCount > 0) {
    bullets.push(t("reports.v2.executive.crossSubjectStrengthen"));
  }
  if (c > 0) {
    bullets.push(t("reports.v2.executive.crossSubjectContradictory", { count: c }));
  }
  return bullets;
}

export function crossSubjectV2DataQualityNoteHe(unitsLength, reportLocale = DEFAULT_REPORT_LOCALE) {
  const t = reportT(reportLocale);
  const n = Math.max(0, Number(unitsLength) || 0);
  return n < 8 ? t("reports.v2.executive.crossSubjectDataQualityLow") : null;
}

export function subjectV2TrendNarrativeHighPriorityHe(reportLocale = DEFAULT_REPORT_LOCALE) {
  return reportT(reportLocale)("reports.v2.executive.subjectTrendHighPriority");
}

export function subjectV2TrendNarrativeStableHe(reportLocale = DEFAULT_REPORT_LOCALE) {
  return reportT(reportLocale)("reports.v2.executive.subjectTrendStable");
}

export function subjectV2RecalibrationNeedYesHe(reportLocale = DEFAULT_REPORT_LOCALE) {
  return reportT(reportLocale)("reports.v2.executive.subjectRecalibrationYes");
}

/** Canonical "no recalibration" — keep in sync with `SubjectPhase3Insights` visibility filter */
export const SUBJECT_V2_RECALIBRATION_NEED_NO_HE = reportT(DEFAULT_REPORT_LOCALE)(
  "reports.v2.executive.subjectRecalibrationNo"
);

export function subjectV2RecalibrationNeedNoHe(reportLocale = DEFAULT_REPORT_LOCALE) {
  return reportT(reportLocale)("reports.v2.executive.subjectRecalibrationNo");
}

/** When output gating blocks a firm conclusion */
export function topicRecommendationV2CautionGatedHe(reportLocale = DEFAULT_REPORT_LOCALE) {
  return reportT(reportLocale)("reports.v2.executive.topicRecommendationCautionGated");
}

/**
 * @param {string|null|undefined} confidenceLevel
 * @param {string|null|undefined} [reportLocale]
 */
export function subjectV2ConfidenceSummaryHe(confidenceLevel, reportLocale = DEFAULT_REPORT_LOCALE) {
  void reportLocale;
  return confidenceLevelParentSummaryHe(confidenceLevel);
}
