/**
 * Number/word spacing helper (Global).
 * Former Hebrew letter↔digit spacing removed — identity for product runtime.
 */

/**
 * @param {string|null|undefined} text
 * @returns {string}
 */
export function normalizeHebrewWordNumberSpacing(text) {
  if (text == null || typeof text !== "string") return "";
  return text;
}

/** @deprecated alias */
export const normalizeWordNumberSpacing = normalizeHebrewWordNumberSpacing;
