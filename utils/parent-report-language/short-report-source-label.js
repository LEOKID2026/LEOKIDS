import { reportPackCopy } from "../../lib/reports/report-pack-copy.js";

/**
 * Short parent report — how we describe diagnostic data source (no engine jargon).
 * @param {string} source raw `report.diagnosticPrimarySource`
 */
export function diagnosticPrimarySourceParentLabelHe(source) {
  const slug = "utils__parent-report-language__short-report-source-label";
  const s = String(source || "").trim();
  if (s === "diagnosticEngineV2") {
    return reportPackCopy(slug, "insights_based_on_questions_practiced");
  }
  if (s === "legacy_patternDiagnostics_fallback") {
    return reportPackCopy(slug, "legacy_version_caution");
  }
  return reportPackCopy(slug, "not_enough_data_for_clear_insight");
}
