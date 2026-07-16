/**
 * Practice-volume + accuracy polarity for Copilot answers (all subjects).
 */

import {
  PARENT_EVIDENCE_VOLUME,
  SUBJECT_VALID_MIN_QUESTIONS,
} from "../parent-report-language/parent-evidence-matrix.js";

export const POLARITY = Object.freeze({
  none: "none",
  thin: "thin",
  support_needed: "support_needed",
  strong: "strong",
});

export const THIN_MAX_QUESTIONS = PARENT_EVIDENCE_VOLUME.PRELIMINARY_MAX;
export const VALID_MIN_QUESTIONS = SUBJECT_VALID_MIN_QUESTIONS;
export const SUPPORT_ACCURACY_MAX = 54;
export const STRONG_ACCURACY_MIN = 75;

/** Must not appear when polarity is support_needed with enough questions. */
export const FORBIDDEN_POSITIVE_WHEN_WEAK_RE =
  /כיוון\s*חזק|נמשיך\s*באותו\s*קצב|ההצלחה\s*חוזרת|יציבות\s*טובה\s*יחסית|ביצוע\s*יציב|מוכנות\s*להתקדמות\s*נוספת/u;

/**
 * @param {number} q
 * @param {number} acc
 */
export function classifyPracticePolarity(q, acc) {
  const questions = Math.max(0, Math.floor(Number(q) || 0));
  const accuracy = Math.max(0, Math.min(100, Math.round(Number(acc) || 0)));
  if (questions === 0) return POLARITY.none;
  if (questions < VALID_MIN_QUESTIONS) return POLARITY.thin;
  if (accuracy <= SUPPORT_ACCURACY_MAX) return POLARITY.support_needed;
  if (accuracy >= STRONG_ACCURACY_MIN) return POLARITY.strong;
  return POLARITY.support_needed;
}

/**
 * @param {number} q
 * @param {number} acc
 */
export function meaningHeForPolarity(displayName, q, acc) {
  const label = String(displayName || "the topic").trim() || "the topic";
  const questions = Math.max(0, Math.floor(Number(q) || 0));
  const accuracy = Math.max(0, Math.min(100, Math.round(Number(acc) || 0)));
  const tier = classifyPracticePolarity(questions, accuracy);
  if (tier === POLARITY.none) {
    return `In ${label} there is still not enough practice in the period range to determine a direction.`;
  }
  if (tier === POLARITY.thin) {
    return `In ${label} there are only ${questions} questions - it is still too early to determine a clear direction.`;
  }
  if (tier === POLARITY.strong) {
    return `In ${label} relatively good stability is seen (${accuracy}% accuracy on ${questions} questions) - you should maintain a routine practice.`;
  }
  return `In ${label} there are ${questions} questions with an accuracy of about ${accuracy}% - this is a situation that requires focused reinforcement, not a sign of strong stability.`;
}

/**
 * @param {string} text
 * @param {number} q
 * @param {number} acc
 */
export function textViolatesPolarityForEvidence(text, q, acc) {
  const tier = classifyPracticePolarity(q, acc);
  if (tier !== POLARITY.support_needed) return false;
  return FORBIDDEN_POSITIVE_WHEN_WEAK_RE.test(String(text || ""));
}

export default {
  POLARITY,
  classifyPracticePolarity,
  meaningHeForPolarity,
  textViolatesPolarityForEvidence,
  FORBIDDEN_POSITIVE_WHEN_WEAK_RE,
};
