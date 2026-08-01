import { resolveContentLocale } from "../learning-question-content-locale.js";
import { localizeMathQuestionEs419 } from "./math.js";
import { localizeGeometryQuestionEs419 } from "./geometry.js";

/**
 * Apply LatAm Spanish (es-419) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyEs419DisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionEs419(question);
    case "geometry":
      return localizeGeometryQuestionEs419(question);
    default:
      return question;
  }
}

export { localizeMathQuestionEs419, localizeGeometryQuestionEs419, resolveContentLocale };
