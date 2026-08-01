/**
 * Pedagogy wording cleanup for parent-facing surfaces (Global EN).
 * Display-only; does not change engine logic.
 */

/**
 * @param {string|null|undefined} raw
 * @returns {string}
 */
export function normalizePedagogyForParentReport(raw) {
  return String(raw ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/** @deprecated Prefer normalizePedagogyForParentReport */
export const normalizePedagogyForParentReportHe = normalizePedagogyForParentReport;
