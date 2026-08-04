/**
 * Worksheet meta labels — Global (legacy *He names kept for payload shape).
 * @module lib/worksheets/worksheet-meta-labels.server
 */

import {
  buildWorksheetPayloadMetaEn,
  worksheetGradeLabelEn,
  worksheetLevelLabelEn,
  worksheetSubjectLabelEn,
  worksheetTopicLabelEn,
} from "./worksheet-meta-labels-en.server.js";

/** @typedef {import("./worksheet-question-types.js").WorksheetSubjectId} WorksheetSubjectId */

export function worksheetGradeLabelHe(subjectId, gradeKey, locale = "en") {
  return worksheetGradeLabelEn(subjectId, gradeKey, locale);
}

export function worksheetTopicLabelHe(subjectId, topicKey, locale = "en") {
  return worksheetTopicLabelEn(subjectId, topicKey, locale);
}

export function worksheetLevelLabelHe(subjectId, levelKey, locale = "en") {
  return worksheetLevelLabelEn(subjectId, levelKey, locale);
}

export function worksheetSubjectLabelHe(subjectId, locale = "en") {
  return worksheetSubjectLabelEn(subjectId, locale);
}

/**
 * @param {{
 *   subjectId: WorksheetSubjectId,
 *   gradeKey: string,
 *   topicKey: string,
 *   levelKey: string,
 *   inkSave?: boolean,
 *   titleHe?: string,
 *   mathPracticeFormat?: string,
 *   interfaceLocale?: string,
 * }} params
 * @returns {import("./worksheet-question-types.js").WorksheetPayloadMeta}
 */
export function buildWorksheetPayloadMeta(params) {
  return buildWorksheetPayloadMetaEn(params);
}
