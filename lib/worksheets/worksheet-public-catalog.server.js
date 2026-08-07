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
 * @param {string} [locale]
 * @returns {Array<Record<string, unknown>>}
 */
export function buildQuestionCatalogItems(locale = "en") {
  const interfaceLocale = locale || "en";
  return READY_WORKSHEET_CATALOG.map((entry) => ({
    worksheetType: "questions",
    slug: entry.slug,
    subjectId: entry.subjectId,
    subject: worksheetSubjectLabelEn(entry.subjectId, interfaceLocale),
    gradeKey: entry.gradeKey,
    grade: worksheetGradeLabelEn(entry.subjectId, entry.gradeKey, interfaceLocale),
    topicKey: entry.topicKey,
    topic:
      entry.title ||
      (entry.mathPracticeFormat
        ? mathPracticeFormatTitleEn(
            entry.mathPracticeFormat,
            entry.topicKey,
            entry.gradeKey,
            interfaceLocale
          )
        : worksheetTopicLabelEn(entry.subjectId, entry.topicKey, interfaceLocale)),
    levelKey: entry.levelKey,
    level: worksheetLevelLabelEn(entry.subjectId, entry.levelKey, interfaceLocale),
    count: entry.count,
    inkSave: entry.inkSave === true,
    publicAccess: true,
    locked: false,
  }));
}

/**
 * Unified catalog — question + writing items.
 * @param {string} [locale]
 * @returns {Array<Record<string, unknown>>}
 */
export function buildUnifiedWorksheetCatalogItems(locale = "en") {
  return [...buildQuestionCatalogItems(locale), ...buildWritingCatalogItems(locale)];
}

/** Question-only catalog — backward compatible with existing tests. */
export function buildReadyWorksheetCatalogItems(locale = "en") {
  return buildQuestionCatalogItems(locale);
}
