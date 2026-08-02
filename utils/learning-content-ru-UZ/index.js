/**
 * Uzbekistan Russian-medium (ru-UZ) learning display layer.
 * Sparse money post-process over ru-RU rebuilders (сум / тийин / UZS).
 *
 * Shared wiring required in utils/learning-content-en/index.js (main agent):
 *   import { applyRuUzDisplayLayer } from "../learning-content-ru-UZ/index.js";
 *   In the math/geometry fallback chain, before ru-RU:
 *     if (loc === "ru-UZ") return applyRuUzDisplayLayer(question, subject);
 *
 * Optional (if stem picker is used directly):
 *   lib/learning/render-question-stem.js — resolveStemLocale / pickMathRebuilder
 *   should prefer ru-UZ money rebuilder before falling back to ru-RU.
 */
import { localizeMathQuestionRuUz } from "./math.js";
import { localizeGeometryQuestionRuUz } from "./geometry.js";

/**
 * Apply Uzbekistan Russian (ru-UZ) display layer for Math/Geometry.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyRuUzDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionRuUz(question);
    case "geometry":
      return localizeGeometryQuestionRuUz(question);
    default:
      return question;
  }
}

export {
  localizeMathQuestionRuUz,
  rebuildMathStemRuUz,
  rebuildMoneyStemRuUz,
  sumWord,
  tiyinWord,
  CURRENCY_RU_UZ,
} from "./math.js";
export {
  localizeGeometryQuestionRuUz,
  rebuildGeometryStemRuUz,
} from "./geometry.js";
