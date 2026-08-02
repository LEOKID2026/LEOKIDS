import { resolveContentLocale, mapQuestionTextFields } from "../learning-question-content-locale.js";
import { localizeMathQuestionEn } from "./math.js";
import { localizeGeometryQuestionEn } from "./geometry.js";
import { localizeEnglishQuestionEn } from "./english.js";
import { localizeScienceQuestionEn, localizeScienceQuestionForLocale } from "./science.js";
import { applyEs419DisplayLayer } from "../learning-content-es419/index.js";
import { applyPtBrDisplayLayer } from "../learning-content-pt-BR/index.js";
import { applyPtPtDisplayLayer } from "../learning-content-pt-PT/index.js";
import { applyItItDisplayLayer } from "../learning-content-it-IT/index.js";
import { applyFrFrDisplayLayer } from "../learning-content-fr-FR/index.js";
import { applyNlNlDisplayLayer } from "../learning-content-nl-NL/index.js";

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
 * - Native math/geometry stem rebuilders for es-419 / pt-BR / pt-PT / it-IT / fr-FR / nl-NL;
 *   science uses locale overlay; English subject keeps learning stems in EN.
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

  if (contentLocale === "pt-BR" && (subject === "math" || subject === "geometry")) {
    return applyPtBrDisplayLayer(question, subject);
  }

  if (contentLocale === "pt-PT" && (subject === "math" || subject === "geometry")) {
    return applyPtPtDisplayLayer(question, subject);
  }

  if (contentLocale === "it-IT" && (subject === "math" || subject === "geometry")) {
    return applyItItDisplayLayer(question, subject);
  }

  if (contentLocale === "fr-FR" && (subject === "math" || subject === "geometry")) {
    return applyFrFrDisplayLayer(question, subject);
  }

  if (contentLocale === "nl-NL" && (subject === "math" || subject === "geometry")) {
    return applyNlNlDisplayLayer(question, subject);
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
