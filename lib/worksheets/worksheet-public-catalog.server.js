/**
 * Enriched ready catalog rows — questions + writing (305 metadata).
 * @module lib/worksheets/worksheet-public-catalog.server
 */

import { READY_WORKSHEET_CATALOG } from "./worksheet-ready-catalog.js";
import { buildWritingCatalogItems } from "../writing/writing-catalog.server.js";
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
export function buildQuestionCatalogItems() {
  return READY_WORKSHEET_CATALOG.map((entry) => ({
    worksheetType: "questions",
    slug: entry.slug,
    subjectId: entry.subjectId,
    subjectHe: worksheetSubjectLabelEn(entry.subjectId),
    gradeKey: entry.gradeKey,
    gradeHe: worksheetGradeLabelEn(entry.subjectId, entry.gradeKey),
    topicKey: entry.topicKey,
    topicHe:
      entry.titleHe ||
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
    publicAccess: true,
    locked: false,
  }));
}

/**
 * Unified catalog — question + writing items.
 * @returns {Array<Record<string, unknown>>}
 */
export function buildUnifiedWorksheetCatalogItems() {
  return [...buildQuestionCatalogItems(), ...buildWritingCatalogItems()];
}

/** Question-only catalog — backward compatible with existing tests. */
export function buildReadyWorksheetCatalogItems() {
  return buildQuestionCatalogItems();
}
