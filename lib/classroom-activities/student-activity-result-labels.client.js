/**
 * Student-facing completion summary for classroom activities (locale-aware burn-down).
 */

import { globalBurnDownCopy } from "../i18n/global-burn-down-copy.js";

const SLUG = "lib__classroom-activities__student-activity-result-labels.client";

/**
 * @param {string} template
 * @param {Record<string, string|number>} vars
 */
function fill(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) =>
    vars[key] == null ? "" : String(vars[key])
  );
}

/**
 * Accepts either (statsObject) or (correctCount, questionCount) for call-site compatibility.
 * @param {{ correctCount?: number|null, questionCount?: number|null }|number|null|undefined} statsOrCorrect
 * @param {number|null|undefined} [questionCountArg]
 */
export function formatStudentActivityCompletionSummaryHe(statsOrCorrect = {}, questionCountArg) {
  let correct;
  let total;
  if (typeof statsOrCorrect === "number" || statsOrCorrect == null) {
    correct = Number(statsOrCorrect) || 0;
    total = Number(questionCountArg) || 0;
  } else {
    correct = Number(statsOrCorrect.correctCount) || 0;
    total = Number(statsOrCorrect.questionCount) || 0;
  }
  if (!total) {
    return correct > 0
      ? fill(globalBurnDownCopy(SLUG, "summary_got"), { correct })
      : globalBurnDownCopy(SLUG, "summary_finished");
  }
  return fill(globalBurnDownCopy(SLUG, "summary_got_of"), { correct, total });
}

/**
 * @param {{ correctCount?: number|null, questionCount?: number|null }|number|null|undefined} statsOrCorrect
 * @param {number|null|undefined} [questionCountArg]
 */
export function formatStudentActivityScoreChipHe(statsOrCorrect = {}, questionCountArg) {
  let correct;
  let total;
  if (typeof statsOrCorrect === "number" || statsOrCorrect == null) {
    correct = Number(statsOrCorrect) || 0;
    total = Number(questionCountArg) || 0;
  } else {
    correct = Number(statsOrCorrect.correctCount) || 0;
    total = Number(statsOrCorrect.questionCount) || 0;
  }
  if (!total) {
    return fill(globalBurnDownCopy(SLUG, "score_chip"), { correct });
  }
  return fill(globalBurnDownCopy(SLUG, "score_chip_of"), { correct, total });
}
