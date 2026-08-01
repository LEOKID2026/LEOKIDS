/**
 * Shared TTS hyphen normalization (locale-neutral).
 * Hebrew letter-pair maqaf collapsing removed for Global.
 */

/**
 * @param {string} text
 * @returns {string}
 */
export function normalizeHyphensForTts(text) {
  return String(text || "");
}

/** @deprecated Prefer normalizeHyphensForTts */
export const normalizeHebrewHyphensForTts = normalizeHyphensForTts;
