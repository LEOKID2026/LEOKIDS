import { localizeMathQuestionFrFr } from "./math.js";
import { localizeGeometryQuestionFrFr } from "./geometry.js";

/**
 * Apply French France (fr-FR) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyFrFrDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionFrFr(question);
    case "geometry":
      return localizeGeometryQuestionFrFr(question);
    default:
      return question;
  }
}

export { localizeMathQuestionFrFr, localizeGeometryQuestionFrFr };
export { rebuildMathStemFrFr } from "./math.js";
export { rebuildGeometryStemFrFr } from "./geometry.js";
