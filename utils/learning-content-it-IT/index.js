import { localizeMathQuestionItIt } from "./math.js";
import { localizeGeometryQuestionItIt } from "./geometry.js";

/**
 * Apply Italian (Italy) (it-IT) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyItItDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionItIt(question);
    case "geometry":
      return localizeGeometryQuestionItIt(question);
    default:
      return question;
  }
}

export { localizeMathQuestionItIt, localizeGeometryQuestionItIt };
export { rebuildMathStemItIt } from "./math.js";
export { rebuildGeometryStemItIt } from "./geometry.js";
