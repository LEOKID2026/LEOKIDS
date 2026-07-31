/**
 * Learning question / bank locale contract.
 * Shared IDs + logic stay on the question object; display text is resolved by content locale
 * with ordered fallback to English (no per-language component forks).
 */

import { resolveContentLocale, getContentFallbackChain } from "../content/locale.js";
import { localizeLearningQuestion } from "../../utils/learning-content-en/index.js";
import { localizeScienceBankForLocale } from "../../utils/learning-content-en/science.js";

/**
 * Resolve the content locale used for learning stems / options.
 * English subject always forces learning content to `en`.
 * @param {{
 *   contentLocale?: string|null,
 *   interfaceLocale?: string|null,
 *   subject?: string|null,
 * }} [opts]
 */
export function resolveLearningQuestionContentLocale(opts = {}) {
  return resolveContentLocale(opts);
}

/**
 * Resolve locale for instructions / hints / explanations / parent-facing wording.
 * May differ from learning content locale (English subject exception).
 * @param {{
 *   instructionLocale?: string|null,
 *   interfaceLocale?: string|null,
 *   contentLocale?: string|null,
 *   subject?: string|null,
 * }} [opts]
 */
export function resolveLearningInstructionLocale(opts = {}) {
  if (opts.instructionLocale) {
    return resolveContentLocale({ contentLocale: opts.instructionLocale });
  }
  if (opts.interfaceLocale) {
    return resolveContentLocale({
      contentLocale: null,
      interfaceLocale: opts.interfaceLocale,
    });
  }
  return resolveContentLocale({ contentLocale: opts.contentLocale });
}

/**
 * Whether a content locale has a native question display layer beyond English fallback.
 * Today only `en` (and Hebrew IL leave-as-authored) are special-cased in localizers.
 * @param {string} contentLocale
 */
export function hasNativeQuestionDisplayLocale(contentLocale) {
  const id = resolveContentLocale({ contentLocale });
  return id === "en" || id === "he" || id === "he-IL";
}

/**
 * Localize one question for student display via content-locale fallback chain.
 * @param {Record<string, unknown>|null|undefined} question
 * @param {{
 *   subject?: string|null,
 *   contentLocale?: string|null,
 *   interfaceLocale?: string|null,
 *   instructionLocale?: string|null,
 * }} [opts]
 */
export function localizeQuestionForContentLocale(question, opts = {}) {
  if (!question) return question;
  const contentLocale = resolveLearningQuestionContentLocale(opts);
  const instructionLocale = resolveLearningInstructionLocale(opts);
  return localizeLearningQuestion(question, {
    subject: opts.subject || question.subject,
    contentLocale,
    interfaceLocale: opts.interfaceLocale,
    instructionLocale,
  });
}

/**
 * Localize a static science bank for a content locale (stable ids preserved).
 * @param {unknown[]} rows
 * @param {string|null|undefined} [contentLocale]
 */
export function localizeScienceQuestionsForContentLocale(rows, contentLocale) {
  const locale = resolveLearningQuestionContentLocale({
    contentLocale,
    subject: "science",
  });
  return localizeScienceBankForLocale(rows, locale);
}

/**
 * @param {string|null|undefined} contentLocale
 */
export function getLearningContentFallbackChain(contentLocale) {
  return getContentFallbackChain(contentLocale);
}

export { localizeLearningQuestion };
