/**
 * English user-facing labels for writing worksheet validation errors.
 * @module lib/writing/writing-error-labels.en
 */

/** @type {Record<string, string>} */
export const WRITING_ERROR_LABELS_EN = {
  INVALID_HEBREW_CHARACTERS: "Please use Hebrew letters only",
  INVALID_ENGLISH_CHARACTERS: "Please use English letters only",
  INVALID_LETTER_CASE: "The selected letter case is not valid",
  INVALID_NUMBER_RANGE: "The number range is not valid",
  INVALID_NUMBER_MODE: "The selected number practice type is not valid",
  INVALID_PREWRITING_PATH: "The selected line type is not valid",
  INVALID_WORD_PACK: "The selected word pack is not valid",
  INVALID_CUSTOM_WORDS: "Please enter valid words",
  INVALID_HEBREW_WORDS: "Please enter Hebrew words only",
  INVALID_ENGLISH_WORDS: "Please enter English words only",
  INVALID_CUSTOM_TEXT: "Please enter valid text",
  INVALID_CUSTOM_TEXT_KIND: "The selected text type is not valid",
  CUSTOM_TEXT_TOO_LONG: "The text is too long",
  ADDRESS_BLOCKED: "Addresses cannot be used in personal text",
  PHONE_BLOCKED: "Phone numbers cannot be used in personal text",
  BIDI_OVERRIDE_BLOCKED: "The text contains unsupported characters",
  CONTROL_CHAR_BLOCKED: "The text contains unsupported characters",
  INVALID_BODY: "The request is not valid",
  BODY_TOO_LARGE: "The request is too large",
  INVALID_WRITING_CATEGORY: "The writing category is not valid",
  PUBLIC_DEMO_CONTENT_NOT_ALLOWED: "This content is not available in the demo",
  no_printable_pages: "Could not create a printable page from the current selection",
};

/**
 * @param {string | undefined | null} code
 * @returns {string}
 */
export function writingErrorLabelEn(code) {
  const key = String(code || "").trim();
  return WRITING_ERROR_LABELS_EN[key] || "";
}
