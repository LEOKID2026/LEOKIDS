/**
 * Short parent report — how we describe diagnostic data source (no engine jargon).
 * @param {string} source raw `report.diagnosticPrimarySource`
 */
export function diagnosticPrimarySourceParentLabelHe(source) {
  const s = String(source || "").trim();
  if (s === "diagnosticEngineV2") {
    return "Insights based on the questions practiced in the selected period.";
  }
  if (s === "legacy_patternDiagnostics_fallback") {
    return "Some of this information comes from an earlier version of the report - it's worth treating it with caution.";
  }
  return "There still isn't enough data for a clear insight - it's worth continuing to practice and checking again.";
}
