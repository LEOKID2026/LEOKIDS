import { localizeMathQuestionNlNl } from "./math.js";
import { localizeGeometryQuestionNlNl } from "./geometry.js";

/**
 * Apply Dutch (Netherlands) (nl-NL) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyNlNlDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionNlNl(question);
    case "geometry":
      return localizeGeometryQuestionNlNl(question);
    default:
      return question;
  }
}

export { localizeMathQuestionNlNl, localizeGeometryQuestionNlNl };
export { rebuildMathStemNlNl } from "./math.js";
export { rebuildGeometryStemNlNl } from "./geometry.js";
