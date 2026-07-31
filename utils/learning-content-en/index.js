import { resolveContentLocale, mapQuestionTextFields } from "../learning-question-content-locale.js";
import { localizeMathQuestionEn } from "./math.js";
import { localizeGeometryQuestionEn } from "./geometry.js";
import { localizeEnglishQuestionEn } from "./english.js";
import { localizeScienceQuestionEn } from "./science.js";

/**
 * Apply the Global English display layer (HE→EN maps / overlays).
 * Used for `en` and as fallback when a future locale has no native bank yet.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 * @param {{ instructionLocale?: string|null, interfaceLocale?: string|null }} [opts]
 */
function applyEnglishDisplayLayer(question, subject, opts = {}) {
  switch (subject) {
    case "math":
      return localizeMathQuestionEn(question);
    case "geometry":
      return localizeGeometryQuestionEn(question);
    case "english":
      return localizeEnglishQuestionEn(question, {
        instructionLocale: opts.instructionLocale,
        interfaceLocale: opts.interfaceLocale,
      });
    case "science":
      return localizeScienceQuestionEn(question);
    default:
      return question;
  }
}

/**
 * Localize a generated/bank question for student display.
 * - Shared logic/ids/params/diagnostics are untouched (mapQuestionTextFields only remaps text).
 * - Hebrew IL authored content is left as-is.
 * - All other content locales use the English display layer until a native locale pack exists
 *   (fallback-to-en — identical Global English output for `en`).
 *
 * English subject: learning stems/options stay English; instruction fields accept
 * `instructionLocale` / `interfaceLocale` for future translated chrome around the lesson.
 *
 * @param {Record<string, unknown>} question
 * @param {{
 *   subject?: string,
 *   contentLocale?: string,
 *   interfaceLocale?: string|null,
 *   instructionLocale?: string|null,
 * }} [opts]
 */
export function localizeLearningQuestion(question, opts = {}) {
  if (!question) return question;
  const locale = resolveContentLocale(opts);
  if (locale === "he" || locale === "he-IL") return question;

  const subject = String(opts.subject || question.subject || "").toLowerCase();
  // English subject learning content is always resolved as en via resolveContentLocale({ subject }).
  return applyEnglishDisplayLayer(question, subject, {
    instructionLocale: opts.instructionLocale,
    interfaceLocale: opts.interfaceLocale,
  });
}

export {
  localizeMathQuestionEn,
  localizeGeometryQuestionEn,
  localizeEnglishQuestionEn,
  localizeScienceQuestionEn,
  mapQuestionTextFields,
  resolveContentLocale,
};
