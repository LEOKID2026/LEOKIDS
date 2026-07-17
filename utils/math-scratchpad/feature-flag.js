/**
 * Client-safe feature flag for math scratchpad MVP (Phase 2).
 */

/**
 * @param {boolean} [override] — explicit override for tests
 */
export function isMathScratchpadV1Enabled(override) {
  if (override === true) return true;
  if (override === false) return false;
  if (typeof process !== "undefined" && process.env) {
    const raw = process.env.NEXT_PUBLIC_MATH_SCRATCHPAD_V1;
    if (raw == null || String(raw).trim() === "") return true;
    return String(raw).trim().toLowerCase() === "true";
  }
  return true;
}
