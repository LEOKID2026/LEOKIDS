/**
 * Switzerland (de-CH) Geometry display — de-DE stems + Swiss Standard German spelling.
 */
import {
  localizeGeometryQuestionDeDe,
  rebuildGeometryStemDeDe,
} from "../learning-content-de-DE/geometry.js";
import { applySwissStandardGermanSpelling, toSwissStandardGermanSpelling } from "./swiss-spelling.js";

/**
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildGeometryStemDeCh(question) {
  const stem = rebuildGeometryStemDeDe(question);
  if (stem == null) return null;
  return toSwissStandardGermanSpelling(stem);
}

/**
 * @param {Record<string, unknown>} question
 */
export function localizeGeometryQuestionDeCh(question) {
  const localized = localizeGeometryQuestionDeDe(question);
  return applySwissStandardGermanSpelling(localized);
}
