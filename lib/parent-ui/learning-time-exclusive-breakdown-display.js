import { burnDownCopy } from "../../lib/learning/burn-down-copy.js";
/**
 * Shared display helpers for learningTimeExclusiveBreakdown (add-only UI).
 * Uses exclusive post-union categories only — never raw overlapping source sums.
 */

const SUBJECT_LABEL_HE = Object.freeze({
  math: "Math",
  geometry: "Geometry",
  english: "English",
  science: "Science",
  history: burnDownCopy("lib__parent-ui__learning-time-exclusive-breakdown-display", "history"),
  hebrew: burnDownCopy("lib__parent-ui__learning-time-exclusive-breakdown-display", "hebrew"),
  moledet: burnDownCopy("lib__parent-ui__learning-time-exclusive-breakdown-display", "social_studies"),
  geography: burnDownCopy("lib__parent-ui__learning-time-exclusive-breakdown-display", "geography"),
  moledet_geography: burnDownCopy("lib__parent-ui__learning-time-exclusive-breakdown-display", "social_studies_geography"),
});

/**
 * @param {unknown} breakdown
 * @returns {null | {
 *   totalMinutes: number,
 *   questionPracticeMinutes: number,
 *   bookReadingMinutes: number,
 *   otherActiveLearningMinutes: number,
 *   analyzedQuestionCount: number,
 *   bySubject: Array<{ subjectKey: string, subjectLabelHe: string, questionPracticeMinutes: number, bookReadingMinutes: number }>
 * }}
 */
export function normalizeLearningTimeExclusiveBreakdown(breakdown) {
  if (!breakdown || typeof breakdown !== "object") return null;
  const totalMinutes = Number(breakdown.totalMinutes);
  const questionPracticeMinutes = Number(breakdown.questionPracticeMinutes);
  const bookReadingMinutes = Number(breakdown.bookReadingMinutes);
  const otherActiveLearningMinutes = Number(breakdown.otherActiveLearningMinutes);
  if (
    !Number.isFinite(totalMinutes) ||
    !Number.isFinite(questionPracticeMinutes) ||
    !Number.isFinite(bookReadingMinutes) ||
    !Number.isFinite(otherActiveLearningMinutes)
  ) {
    return null;
  }
  const analyzedQuestionCount = Math.max(
    0,
    Math.floor(Number(breakdown.analyzedQuestionCount) || 0)
  );
  const bySubjectRaw = Array.isArray(breakdown.bySubject) ? breakdown.bySubject : [];
  const bySubject = [];
  for (const row of bySubjectRaw) {
    if (!row || typeof row !== "object") continue;
    const subjectKey = String(row.subjectKey || "").trim();
    if (!subjectKey) continue;
    const q = Number(row.questionPracticeMinutes) || 0;
    const b = Number(row.bookReadingMinutes) || 0;
    if (q <= 0 && b <= 0) continue;
    bySubject.push({
      subjectKey,
      subjectLabelHe: SUBJECT_LABEL_HE[subjectKey] || subjectKey,
      questionPracticeMinutes: q,
      bookReadingMinutes: b,
    });
  }
  return {
    totalMinutes,
    questionPracticeMinutes,
    bookReadingMinutes,
    otherActiveLearningMinutes,
    analyzedQuestionCount,
    bySubject,
  };
}

/**
 * Same formatter for all surfaces — avoids display delta between rows and total.
 * @param {number} minutes
 */
export function formatExclusiveLearningMinutesHe(minutes) {
  const n = Number(minutes);
  if (!Number.isFinite(n)) return "0";
  const rounded = Math.round(n * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(rounded);
}

/**
 * Approved one-line summary for "What we did during this period".
 * @param {ReturnType<typeof normalizeLearningTimeExclusiveBreakdown>} b
 */
export function formatLearningTimeDivisionLineHe(b) {
  if (!b) return "";
  const x = formatExclusiveLearningMinutesHe(b.questionPracticeMinutes);
  const y = formatExclusiveLearningMinutesHe(b.bookReadingMinutes);
  const z = formatExclusiveLearningMinutesHe(b.otherActiveLearningMinutes);
  return `Learning time breakdown: question practice: ${x} min · book reading: ${y} min · other active learning: ${z} min`;
}
