/**
 * Student-facing English completion summary for classroom activities.
 */

/**
 * @param {{ correctCount?: number|null, questionCount?: number|null }} stats
 */
export function formatStudentActivityCompletionSummaryHe(stats = {}) {
  const correct = Number(stats.correctCount) || 0;
  const total = Number(stats.questionCount) || 0;
  if (!total) {
    return correct > 0 ? `You got ${correct} questions correct` : "You finished the activity";
  }
  return `You got ${correct} of ${total} questions correct`;
}

/**
 * @param {{ correctCount?: number|null, questionCount?: number|null }} stats
 */
export function formatStudentActivityScoreChipHe(stats = {}) {
  const correct = Number(stats.correctCount) || 0;
  const total = Number(stats.questionCount) || 0;
  if (!total) {
    return `${correct} questions`;
  }
  return `${correct}/${total} questions`;
}
