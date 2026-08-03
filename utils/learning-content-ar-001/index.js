import { localizeMathQuestionAr001 } from "./math.js";
import { localizeGeometryQuestionAr001 } from "./geometry.js";

/**
 * Apply Modern Standard Arabic (ar-001) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyAr001DisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionAr001(question);
    case "geometry":
      return localizeGeometryQuestionAr001(question);
    default:
      return question;
  }
}

export { localizeMathQuestionAr001, localizeGeometryQuestionAr001 };
export { rebuildMathStemAr001 } from "./math.js";
export { rebuildGeometryStemAr001 } from "./geometry.js";
