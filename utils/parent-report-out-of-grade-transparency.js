/**
 * Raw practice rows outside the student's registered grade - transparency only, no conclusions.
 */

import { subjectLabelHe } from "../lib/teacher-portal/teacher-ui.js";
import {
  isCoreParentReportRow,
  resolveParentReportRowGradeRelation,
  resolveRegisteredGradeKeyFromReport,
} from "./parent-report-core-grade-filter.js";
import {
  formatParentReportActivityDisplayLabelHe,
  formatParentReportGradeHe,
} from "./parent-report-language/parent-report-display-labels.js";
import { parseCanonicalTopicFromRowKey } from "./parent-report-output-integrity/row-identity-v1.js";

const SUBJECT_TOPIC_MAPS = [
  { subjectId: "math", mapKey: "mathOperations" },
  { subjectId: "geometry", mapKey: "geometryTopics" },
  { subjectId: "english", mapKey: "englishTopics" },
  { subjectId: "science", mapKey: "scienceTopics" },
  { subjectId: "history", mapKey: "historySubtopics" },
  { subjectId: "hebrew", mapKey: "hebrewTopics" },
  { subjectId: "moledet-geography", mapKey: "moledetGeographyTopics" },
];

/**
 * @param {string|null|undefined} iso
 */
function formatActivityDateHe(iso) {
  if (!iso) return "Unavailable";
  try {
    const d = new Date(String(iso));
    if (Number.isNaN(d.getTime())) return "Unavailable";
    return d.toLocaleDateString("en-US");
  } catch {
    return "Unavailable";
  }
}

/**
 * @param {Record<string, unknown>} data
 * @param {string} topicRowKey
 */
function topicLabelFromMapRow(data, topicRowKey) {
  const fromRow =
    String(data.narrativeTopicLabelHe || data.cleanTopicLabelHe || data.displayName || "").trim();
  if (fromRow) return fromRow;
  const parsed = parseCanonicalTopicFromRowKey(topicRowKey);
  return String(parsed.canonicalTopicKey || topicRowKey).replace(/^[^_]+_/, "");
}

/**
 * @param {unknown} baseReport
 * @returns {object|null}
 */
export function buildOutOfGradePracticeTransparency(baseReport) {
  if (!baseReport || typeof baseReport !== "object") return null;
  const registeredGradeKey = resolveRegisteredGradeKeyFromReport(baseReport);
  if (!registeredGradeKey) return null;

  /** @type {Array<Record<string, unknown>>} */
  const advancedPractice = [];
  /** @type {Array<Record<string, unknown>>} */
  const foundationPractice = [];

  for (const { subjectId, mapKey } of SUBJECT_TOPIC_MAPS) {
    const map = baseReport[mapKey];
    if (!map || typeof map !== "object") continue;

    for (const [topicRowKey, raw] of Object.entries(map)) {
      if (!raw || typeof raw !== "object") continue;
      const data = /** @type {Record<string, unknown>} */ (raw);
      const q = Number(data.questions) || 0;
      if (q <= 0) continue;

      const parsed = parseCanonicalTopicFromRowKey(topicRowKey);
      const contentGradeKey =
        data.contentGradeKey ?? data.gradeKey ?? parsed.contentGradeKey ?? null;
      const row = {
        ...data,
        contentGradeKey,
        gradeKey: data.gradeKey ?? contentGradeKey,
        questions: q,
        topicRowKey,
        subjectId,
      };

      if (isCoreParentReportRow(row, registeredGradeKey)) continue;

      const gradeRelation = resolveParentReportRowGradeRelation(row, registeredGradeKey);
      if (gradeRelation !== "higher" && gradeRelation !== "lower") continue;

      const item = {
        topicRowKey,
        subjectId,
        subjectLabelHe: subjectLabelHe(subjectId) || subjectId,
        topicLabelHe: topicLabelFromMapRow(data, topicRowKey),
        gradeLabelHe: formatParentReportGradeHe(contentGradeKey) || "-",
        gradeRelation,
        questions: q,
        accuracy: Math.round(Number(data.accuracy) || 0),
        timeMinutes: Math.round(Number(data.timeMinutes) || 0),
        lastActivityAtHe: formatActivityDateHe(
          data.latestActivityAt || data.lastAnswerAt || data.lastSessionAt || null,
        ),
        sourceLabelHe: formatParentReportActivityDisplayLabelHe(data) || "Practice",
      };

      if (gradeRelation === "higher") advancedPractice.push(item);
      else foundationPractice.push(item);
    }
  }

  const sortRows = (a, b) => {
    const qDiff = (Number(b.questions) || 0) - (Number(a.questions) || 0);
    if (qDiff !== 0) return qDiff;
    return String(a.topicLabelHe || "").localeCompare(String(b.topicLabelHe || ""), "en");
  };
  advancedPractice.sort(sortRows);
  foundationPractice.sort(sortRows);

  if (!advancedPractice.length && !foundationPractice.length) return null;

  return {
    titleHe: "Practice outside registered grade",
    registeredGradeKey,
    advancedPractice,
    foundationPractice,
  };
}
