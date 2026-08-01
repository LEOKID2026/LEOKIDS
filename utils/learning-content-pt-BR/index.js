import { localizeMathQuestionPtBr } from "./math.js";
import { localizeGeometryQuestionPtBr } from "./geometry.js";

/**
 * Apply Portuguese Brazil (pt-BR) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyPtBrDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionPtBr(question);
    case "geometry":
      return localizeGeometryQuestionPtBr(question);
    default:
      return question;
  }
}

export { localizeMathQuestionPtBr, localizeGeometryQuestionPtBr };
export { rebuildMathStemPtBr } from "./math.js";
export { rebuildGeometryStemPtBr } from "./geometry.js";
