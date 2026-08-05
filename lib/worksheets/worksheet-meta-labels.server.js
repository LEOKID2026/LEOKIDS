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

export function worksheetGradeLabel(subjectId, gradeKey, locale = "en") {
  return worksheetGradeLabelEn(subjectId, gradeKey, locale);
}

export function worksheetTopicLabel(subjectId, topicKey, locale = "en") {
  return worksheetTopicLabelEn(subjectId, topicKey, locale);
}

export function worksheetLevelLabel(subjectId, levelKey, locale = "en") {
  return worksheetLevelLabelEn(subjectId, levelKey, locale);
}

export function worksheetSubjectLabel(subjectId, locale = "en") {
  return worksheetSubjectLabelEn(subjectId, locale);
}

/**
 * @param {{
 *   subjectId: WorksheetSubjectId,
 *   gradeKey: string,
 *   topicKey: string,
 *   levelKey: string,
 *   inkSave?: boolean,
 *   title?: string,
 *   mathPracticeFormat?: string,
 *   interfaceLocale?: string,
 * }} params
 * @returns {import("./worksheet-question-types.js").WorksheetPayloadMeta}
 */
export function buildWorksheetPayloadMeta(params) {
  return buildWorksheetPayloadMetaEn(params);
}
