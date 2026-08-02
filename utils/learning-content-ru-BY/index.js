/**
 * Belarus Russian (ru-BY) learning display layer.
 * Sparse money post-process over ru-RU rebuilders (белорусский рубль / Br / BYN / копейка).
 *
 * Shared wiring required in utils/learning-content-en/index.js (main agent):
 *   import { applyRuByDisplayLayer } from "../learning-content-ru-BY/index.js";
 *   In the math/geometry fallback chain, before ru-RU:
 *     if (loc === "ru-BY") return applyRuByDisplayLayer(question, subject);
 *
 * Optional (if stem picker is used directly):
 *   lib/learning/render-question-stem.js — resolveStemLocale / pickMathRebuilder
 *   should prefer ru-BY money rebuilder before falling back to ru-RU.
 */
import { localizeMathQuestionRuBy } from "./math.js";
import { localizeGeometryQuestionRuBy } from "./geometry.js";

/**
 * Apply Belarus Russian (ru-BY) display layer for Math/Geometry.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyRuByDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionRuBy(question);
    case "geometry":
      return localizeGeometryQuestionRuBy(question);
    default:
      return question;
  }
}

export {
  localizeMathQuestionRuBy,
  rebuildMathStemRuBy,
  rebuildMoneyStemRuBy,
  bynRubleWord,
  bynRubleFullPhrase,
  bynKopeckWord,
  CURRENCY_RU_BY,
} from "./math.js";
export {
  localizeGeometryQuestionRuBy,
  rebuildGeometryStemRuBy,
} from "./geometry.js";
