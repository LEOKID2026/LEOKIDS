import { resolveContentLocale, mapQuestionTextFields } from "../learning-question-content-locale.js";
import { localizeMathQuestionEn } from "./math.js";
import { localizeGeometryQuestionEn } from "./geometry.js";
import { localizeEnglishQuestionEn } from "./english.js";
import { localizeScienceQuestionEn, localizeScienceQuestionForLocale } from "./science.js";
import { applyEs419DisplayLayer } from "../learning-content-es419/index.js";

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
 * - Unregistered content locales (including he*) use the English display layer
 *   (never leave raw Hebrew stems for student display).
 * - `es-419` uses native math/geometry stem rebuilders; science uses locale overlay;
 *   English subject keeps learning stems in EN and may localize instruction chrome.
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
  const contentLocale = resolveContentLocale(opts);
  const subject = String(opts.subject || question.subject || "").toLowerCase();

  if (subject === "science") {
    return localizeScienceQuestionForLocale(question, contentLocale);
  }

  if (subject === "english") {
    return localizeEnglishQuestionEn(question, {
      instructionLocale: opts.instructionLocale,
      interfaceLocale: opts.interfaceLocale,
    });
  }

  if (contentLocale === "es-419" && (subject === "math" || subject === "geometry")) {
    return applyEs419DisplayLayer(question, subject);
  }

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
