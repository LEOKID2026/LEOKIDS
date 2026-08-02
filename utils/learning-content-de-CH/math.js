/**
 * Switzerland (de-CH) Math display — de-DE stems + Swiss Standard German spelling.
 */
import { localizeMathQuestionDeDe, rebuildMathStemDeDe } from "../learning-content-de-DE/math.js";
import { applySwissStandardGermanSpelling, toSwissStandardGermanSpelling } from "./swiss-spelling.js";

/**
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildMathStemDeCh(question) {
  const stem = rebuildMathStemDeDe(question);
  if (stem == null) return null;
  return toSwissStandardGermanSpelling(stem);
}

/**
 * @param {Record<string, unknown>} question
 */
export function localizeMathQuestionDeCh(question) {
  const localized = localizeMathQuestionDeDe(question);
  return applySwissStandardGermanSpelling(localized);
}
