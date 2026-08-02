import { localizeMathQuestionDeDe } from "./math.js";
import { localizeGeometryQuestionDeDe } from "./geometry.js";

/**
 * Apply German (Germany) (de-DE) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyDeDeDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionDeDe(question);
    case "geometry":
      return localizeGeometryQuestionDeDe(question);
    default:
      return question;
  }
}

export { localizeMathQuestionDeDe, localizeGeometryQuestionDeDe };
export { rebuildMathStemDeDe } from "./math.js";
export { rebuildGeometryStemDeDe } from "./geometry.js";
