/**
 * Shared learning-master session-run helpers (orchestration only — not pedagogy).
 *
 * Practice masters are open-ended until stop / challenge end / mistakes cleared.
 * Audits and demos need a reachable completion → retry surface after those exits.
 */

import { isDemoMode } from "../../lib/demo/demo-mode.client.js";

/** Short finite run so Start→…→completion is reachable under demo / e2e without Stop. */
export const LEARNING_DEMO_SESSION_QUESTION_TARGET = 3;

/**
 * E2E mock student id used by ar-001 learning audits (mock /api/student/me).
 * Finite target keeps completion reachable without relying on Stop alone.
 */
export const LEARNING_AUDIT_MOCK_STUDENT_ID = "00000000-0000-0000-0000-0000000000e2";

/**
 * @param {{ studentId?: string|null }} [opts]
 * @returns {number|null} question target, or null for open-ended until stop
 */
export function resolveLearningSessionQuestionTarget(opts = {}) {
  if (typeof window !== "undefined") {
    if (isDemoMode()) return LEARNING_DEMO_SESSION_QUESTION_TARGET;
    // Playwright / automated audits set navigator.webdriver — keep production open-ended.
    if (navigator.webdriver === true) return LEARNING_DEMO_SESSION_QUESTION_TARGET;
  }
  const sid = opts.studentId != null ? String(opts.studentId) : "";
  if (sid && sid === LEARNING_AUDIT_MOCK_STUDENT_ID) {
    return LEARNING_DEMO_SESSION_QUESTION_TARGET;
  }
  return null;
}

/**
 * @param {number} answeredCount
 * @param {number|null|undefined} target
 */
export function shouldCompleteLearningSessionByCount(answeredCount, target) {
  if (target == null) return false;
  const n = Number(answeredCount);
  const t = Number(target);
  if (!Number.isFinite(n) || !Number.isFinite(t) || t <= 0) return false;
  return n >= t;
}
