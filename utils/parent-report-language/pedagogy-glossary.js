/**
 * Pedagogy wording cleanup for parent-facing surfaces (Global EN).
 * Display-only; does not change engine logic.
 */

/**
 * @param {string|null|undefined} raw
 * @returns {string}
 */
export function normalizePedagogyForParentReport(raw) {
  let s = String(raw ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!s) return "";

  // Longer phrases first.
  const pairs = [
    [/addition\s+with\s*\/\s*without\s+carrying/gi, "addition with and without regrouping"],
    [/with\s*\/\s*without\s+carrying/gi, "with and without regrouping"],
    [/carrying\s+with\s+intermediates/gi, "regrouping with intermediate steps"],
    [/carrying\s+algorithm/gi, "a clear way to add with regrouping"],
    [/without\s+a\s+carrying\s+foundation/gi, "without a regrouping foundation"],
    [/only\s+end\s+digits\s+without\s+a\s+carrying\s+foundation/gi, "only the end digits without a regrouping foundation"],
    [/correct\s+when\s+there\s+is\s+no\s+carrying/gi, "correct when there is no regrouping"],
    [/when\s+there\s+is\s+no\s+carrying/gi, "when there is no regrouping"],
    [/without\s+carrying/gi, "without regrouping"],
  ];
  for (const [re, rep] of pairs) {
    s = s.replace(re, rep);
  }

  if (/^carrying$/i.test(s)) {
    return "regrouping (in addition)";
  }

  return s.trim();
}

/** @deprecated Prefer normalizePedagogyForParentReport */
export const normalizePedagogyForParentReportHe = normalizePedagogyForParentReport;
