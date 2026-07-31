/**
 * Global: pedagogy glossary is a no-op — English report copy is already parent-facing.
 * Legacy `*He` filename retained for barrel export compatibility.
 */

/**
 * @param {string|null|undefined} raw
 * @returns {string}
 */
export function normalizePedagogyForParentReportHe(raw) {
  return String(raw ?? "");
}
