/**
 * Switzerland (de-CH) learning display layer.
 * Sparse Swiss Standard German post-process over de-DE rebuilders.
 *
 * Shared wiring required in utils/learning-content-en/index.js (main agent):
 *   import { applyDeChDisplayLayer } from "../learning-content-de-CH/index.js";
 *   In the math/geometry fallback chain, before de-DE:
 *     if (loc === "de-CH") return applyDeChDisplayLayer(question, subject);
 */
import { localizeMathQuestionDeCh } from "./math.js";
import { localizeGeometryQuestionDeCh } from "./geometry.js";

/**
 * Apply Swiss German (de-CH) display layer for Math/Geometry.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyDeChDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionDeCh(question);
    case "geometry":
      return localizeGeometryQuestionDeCh(question);
    default:
      return question;
  }
}

export { localizeMathQuestionDeCh, rebuildMathStemDeCh } from "./math.js";
export { localizeGeometryQuestionDeCh, rebuildGeometryStemDeCh } from "./geometry.js";
export {
  applySwissStandardGermanSpelling,
  toSwissStandardGermanSpelling,
} from "./swiss-spelling.js";
