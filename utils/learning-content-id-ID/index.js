import { localizeMathQuestionIdId } from "./math.js";
import { localizeGeometryQuestionIdId } from "./geometry.js";

/**
 * Apply Indonesian (id-ID) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyIdIdDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionIdId(question);
    case "geometry":
      return localizeGeometryQuestionIdId(question);
    default:
      return question;
  }
}

export { localizeMathQuestionIdId, localizeGeometryQuestionIdId };
export { rebuildMathStemIdId } from "./math.js";
export { rebuildGeometryStemIdId } from "./geometry.js";
