import { localizeMathQuestionPtPt } from "./math.js";
import { localizeGeometryQuestionPtPt } from "./geometry.js";

/**
 * Apply Portuguese (Portugal) (pt-PT) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyPtPtDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionPtPt(question);
    case "geometry":
      return localizeGeometryQuestionPtPt(question);
    default:
      return question;
  }
}

export { localizeMathQuestionPtPt, localizeGeometryQuestionPtPt };
export { rebuildMathStemPtPt } from "./math.js";
export { rebuildGeometryStemPtPt } from "./geometry.js";
