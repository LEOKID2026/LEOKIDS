/**
 * Locale-aware live practice feedback — no answer leak in wrong-state messages.
 * @param {(key: string, vars?: Record<string, unknown>) => string} t
 */

export function livePracticeCorrect(t) {
  return t("learning.master.feedback.correct");
}

export function livePracticeWrong(t) {
  return t("learning.master.feedback.wrong");
}

export function livePracticeGameOver(t) {
  return t("learning.master.feedback.gameOver");
}

/** Learning mode only — may show the correct answer after a wrong attempt. */
export function formatLearningWrongFeedback(t, correctAnswerDisplay) {
  return t("learning.master.feedback.wrongWithAnswer", { answer: correctAnswerDisplay });
}

export function livePracticeTimeUp(t) {
  return t("learning.master.feedback.timeUp");
}

export function livePracticeTimeUpGameOver(t) {
  return t("learning.master.feedback.timeUpGameOver");
}

export function livePracticeExcellent(t) {
  return t("learning.master.feedback.excellent");
}
