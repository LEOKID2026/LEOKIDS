import { resolveContentLocale, mapQuestionTextFields } from "../learning-question-content-locale.js";
import { localizeMathQuestionEn } from "./math.js";
import { localizeGeometryQuestionEn } from "./geometry.js";
import { localizeEnglishQuestionEn } from "./english.js";
import { localizeScienceQuestionEn } from "./science.js";

/**
 * Localize a generated/bank question for student display.
 * @param {Record<string, unknown>} question
 * @param {{ subject?: string, contentLocale?: string }} [opts]
 */
export function localizeLearningQuestion(question, opts = {}) {
  const locale = resolveContentLocale(opts);
  if (locale !== "en" || !question) return question;
  const subject = String(opts.subject || question.subject || "").toLowerCase();
  switch (subject) {
    case "math":
      return localizeMathQuestionEn(question);
    case "geometry":
      return localizeGeometryQuestionEn(question);
    case "english":
      return localizeEnglishQuestionEn(question);
    case "science":
      return localizeScienceQuestionEn(question);
    default:
      return question;
  }
}

export {
  localizeMathQuestionEn,
  localizeGeometryQuestionEn,
  localizeEnglishQuestionEn,
  localizeScienceQuestionEn,
  mapQuestionTextFields,
  resolveContentLocale,
};
