import { localizeMathQuestionRuRu } from "./math.js";
import { localizeGeometryQuestionRuRu } from "./geometry.js";

/**
 * Apply Russian (ru-RU) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyRuRuDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionRuRu(question);
    case "geometry":
      return localizeGeometryQuestionRuRu(question);
    default:
      return question;
  }
}

export { localizeMathQuestionRuRu, localizeGeometryQuestionRuRu };
export { rebuildMathStemRuRu, rubleWord, kopeckWord, MATH_TERMS_RU_RU } from "./math.js";
export { rebuildGeometryStemRuRu, GEOMETRY_TERMS_RU_RU } from "./geometry.js";
