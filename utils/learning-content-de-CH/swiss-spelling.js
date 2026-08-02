/**
 * Swiss Standard German spelling helpers for de-CH learning display.
 * Converts public ß → ss on user-facing German strings only.
 * Does not touch IDs, params, answers, options, diagnostics, or English targets.
 */

const DISPLAY_TEXT_KEYS = [
  "question",
  "exerciseText",
  "questionLabel",
  "stem",
  "explanation",
  "feedback",
  "hint",
  "theoryHelp",
];

/**
 * @param {string} value
 * @returns {string}
 */
export function toSwissStandardGermanSpelling(value) {
  return String(value ?? "").replace(/ß/g, "ss");
}

/**
 * Apply Swiss ss spelling to display text fields of a localized question.
 * Leaves answers / options / acceptedAnswers / params / ids unchanged.
 *
 * @param {Record<string, unknown>} question
 * @returns {Record<string, unknown>}
 */
export function applySwissStandardGermanSpelling(question) {
  if (!question || typeof question !== "object") return question;
  /** @type {Record<string, unknown>} */
  const out = { ...question };
  for (const key of DISPLAY_TEXT_KEYS) {
    if (typeof out[key] === "string" && out[key].includes("ß")) {
      out[key] = toSwissStandardGermanSpelling(/** @type {string} */ (out[key]));
    }
  }
  if (Array.isArray(out.theoryLines)) {
    out.theoryLines = out.theoryLines.map((item) =>
      typeof item === "string" && item.includes("ß") ? toSwissStandardGermanSpelling(item) : item
    );
  }
  return out;
}
