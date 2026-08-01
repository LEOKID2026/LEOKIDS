/**
 * Parent utterance normalization for Global (EN/ES).
 * Hebrew-specific typo collapse removed — Global does not process Hebrew as a product path.
 */

const INVISIBLE_CHARS = /[\uFEFF\u200B-\u200D\u2060\u2061\u2062\u2063]/g;
const WEIRD_SPACES = /[\s\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]+/g;

/**
 * @param {unknown} raw
 * @returns {string}
 */
export function normalizeFreeformParentUtterance(raw) {
  return String(raw ?? "")
    .replace(INVISIBLE_CHARS, "")
    .replace(WEIRD_SPACES, " ")
    .trim();
}

/**
 * Fold for matcher lookup (lowercase).
 * @param {unknown} raw
 * @returns {string}
 */
export function foldUtteranceForMatch(raw) {
  return normalizeFreeformParentUtterance(raw).toLowerCase();
}

/** @deprecated Legacy *He names — prefer normalizeFreeformParentUtterance / foldUtteranceForMatch */
export const normalizeFreeformParentUtteranceHe = normalizeFreeformParentUtterance;
/** @deprecated */
export const foldUtteranceForHeMatch = foldUtteranceForMatch;
/** @deprecated */
export const normalizeParentUtteranceHe = normalizeFreeformParentUtterance;
/** @deprecated */
export const normalizeParentUtterance = normalizeFreeformParentUtterance;
