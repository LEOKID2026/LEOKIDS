/**
 * Enriched ready catalog rows — shared shape for parent and public APIs.
 * @module lib/worksheets/worksheet-public-catalog.server
 */

import { READY_WORKSHEET_CATALOG } from "./worksheet-ready-catalog.js";
import {
  worksheetGradeLabelEn,
  worksheetLevelLabelEn,
  worksheetSubjectLabelEn,
  worksheetTopicLabelEn,
} from "./worksheet-meta-labels-en.server.js";
import { mathPracticeFormatTitleEn } from "./worksheet-math-practice-format.js";

/**
 * @returns {Array<Record<string, unknown>>}
 */
export function buildReadyWorksheetCatalogItems() {
  return READY_WORKSHEET_CATALOG.map((entry) => ({
    slug: entry.slug,
    subjectId: entry.subjectId,
    subjectHe: worksheetSubjectLabelEn(entry.subjectId),
    gradeKey: entry.gradeKey,
    gradeHe: worksheetGradeLabelEn(entry.subjectId, entry.gradeKey),
    topicKey: entry.topicKey,
    topicHe:
      (entry.mathPracticeFormat
        ? mathPracticeFormatTitleEn(
            entry.mathPracticeFormat,
            entry.topicKey,
            entry.gradeKey
          )
        : worksheetTopicLabelEn(entry.subjectId, entry.topicKey)),
    levelKey: entry.levelKey,
    levelHe: worksheetLevelLabelEn(entry.subjectId, entry.levelKey),
    count: entry.count,
    inkSave: entry.inkSave === true,
  }));
}
