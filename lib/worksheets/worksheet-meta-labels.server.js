/**
 * Worksheet meta labels — Global English (legacy *He names kept for payload shape).
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

export function worksheetGradeLabelHe(subjectId, gradeKey) {
  return worksheetGradeLabelEn(subjectId, gradeKey);
}

export function worksheetTopicLabelHe(subjectId, topicKey) {
  return worksheetTopicLabelEn(subjectId, topicKey);
}

export function worksheetLevelLabelHe(subjectId, levelKey) {
  return worksheetLevelLabelEn(subjectId, levelKey);
}

export function worksheetSubjectLabelHe(subjectId) {
  return worksheetSubjectLabelEn(subjectId);
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
 * }} params
 * @returns {import("./worksheet-question-types.js").WorksheetPayloadMeta}
 */
export function buildWorksheetPayloadMeta(params) {
  return buildWorksheetPayloadMetaEn(params);
}
