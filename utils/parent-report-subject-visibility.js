/**
 * Parent-report visibility: subjects with zero practice in the selected period must not render.
 * Practice evidence = answered questions only (time-only sessions do not count).
 */

export const PARENT_REPORT_PERIOD_EMPTY_STATE_HE =
  "There isn't enough practice yet in the selected period to show a report.";

/**
 * @param {number|string|null|undefined} questions
 * @param {number|string|null|undefined} timeMinutes
 */
export function subjectHasParentReportPracticeEvidence(questions, timeMinutes) {
  void timeMinutes;
  return (Number(questions) || 0) > 0;
}

/**
 * @param {Record<string, unknown>|null|undefined} sp
 */
export function subjectProfileHasPracticeEvidence(sp) {
  return subjectHasParentReportPracticeEvidence(sp?.subjectQuestionCount, sp?.subjectTimeMinutes);
}

/**
 * @param {Array<Record<string, unknown>>|null|undefined} rows
 */
export function filterSubjectOverviewRowsWithEvidence(rows) {
  return (Array.isArray(rows) ? rows : []).filter((row) =>
    subjectHasParentReportPracticeEvidence(row?.questions, row?.minutes ?? row?.timeMinutes)
  );
}

/**
 * @param {Array<Record<string, unknown>>|null|undefined} rows
 */
export function filterSubjectCoverageWithEvidence(rows) {
  return (Array.isArray(rows) ? rows : []).filter((row) =>
    subjectHasParentReportPracticeEvidence(row?.questionCount ?? row?.questions, row?.timeMinutes)
  );
}
