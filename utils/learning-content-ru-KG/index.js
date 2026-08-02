import { localizeMathQuestionRuKg } from "./math.js";
import { localizeGeometryQuestionRuKg } from "./geometry.js";

/**
 * Apply Kyrgyzstan Russian-medium (ru-KG) display layer for subjects with rebuilders.
 * Shared resolver wiring still required to call this for locale ru-KG at runtime.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyRuKgDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionRuKg(question);
    case "geometry":
      return localizeGeometryQuestionRuKg(question);
    default:
      return question;
  }
}

export {
  localizeMathQuestionRuKg,
  rebuildMathStemRuKg,
  rebuildMoneyStemRuKg,
  somWord,
  somDativeWord,
  tyiynWord,
  applyKgCurrencyWording,
  CURRENCY_RU_KG,
} from "./math.js";
export {
  localizeGeometryQuestionRuKg,
  rebuildGeometryStemRuKg,
  GEOMETRY_TERMS_RU_KG,
} from "./geometry.js";
