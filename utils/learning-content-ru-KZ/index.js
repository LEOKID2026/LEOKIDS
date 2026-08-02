/**
 * Kazakhstan Russian (ru-KZ) learning display layer.
 * Sparse money post-process over ru-RU rebuilders (тенге / тиын).
 *
 * Shared wiring required in utils/learning-content-en/index.js (main agent):
 *   import { applyRuKzDisplayLayer } from "../learning-content-ru-KZ/index.js";
 *   In the math/geometry fallback chain, before ru-RU:
 *     if (loc === "ru-KZ") return applyRuKzDisplayLayer(question, subject);
 */
import { localizeMathQuestionRuKz } from "./math.js";
import { localizeGeometryQuestionRuKz } from "./geometry.js";

/**
 * Apply Kazakhstan Russian (ru-KZ) display layer for Math/Geometry.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyRuKzDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionRuKz(question);
    case "geometry":
      return localizeGeometryQuestionRuKz(question);
    default:
      return question;
  }
}

export {
  localizeMathQuestionRuKz,
  rebuildMathStemRuKz,
  rebuildMoneyStemRuKz,
  tengeWord,
  tiynWord,
  CURRENCY_RU_KZ,
} from "./math.js";
export {
  localizeGeometryQuestionRuKz,
  rebuildGeometryStemRuKz,
} from "./geometry.js";
