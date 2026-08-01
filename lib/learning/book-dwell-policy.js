/**
 * Book / open-learning dwell —   10   .
 * Idle   (10     → ).
 */

import {
  creditOpenLearningMs,
  LEARNING_IDLE_FREEZE_MS,
} from "./learning-time-credit-policy.js";

export const VIEW_THRESHOLD_MS = 2_000;
export const PAGE_READ_THRESHOLD_MS = 10_000;
/** @deprecated    —     */
export const PAGE_CREDIT_CAP_MS = null;
/** Sanity    (3 ),   10 */
export const SESSION_CREDIT_CAP_MS = 10_800_000;

export { LEARNING_IDLE_FREEZE_MS };

/**
 * @param {number} ms
 */
export function clampNonNegativeMs(ms) {
  const n = Math.floor(Number(ms));
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

/**
 * @param {number} visibleDwellMs
 */
export function isSectionViewed(visibleDwellMs) {
  return clampNonNegativeMs(visibleDwellMs) >= VIEW_THRESHOLD_MS;
}

/**
 * @param {number} visibleDwellMs
 */
export function isPageRead(visibleDwellMs) {
  return clampNonNegativeMs(visibleDwellMs) >= PAGE_READ_THRESHOLD_MS;
}

/**
 *   10  —  clamp + sanity.
 * @param {number} visibleDwellMs
 */
export function applyPageCreditCap(visibleDwellMs) {
  return creditOpenLearningMs(visibleDwellMs);
}

/**
 * @param {number} creditedPageTotalMs
 */
export function applySessionCreditCap(creditedPageTotalMs) {
  return Math.min(clampNonNegativeMs(creditedPageTotalMs), SESSION_CREDIT_CAP_MS);
}

/**
 * @param {number} rawDwellMs
 * @param {number} hiddenTabMs
 */
export function computeVisibleDwellMs(rawDwellMs, hiddenTabMs) {
  return Math.max(0, clampNonNegativeMs(rawDwellMs) - clampNonNegativeMs(hiddenTabMs));
}

/**
 * Visible dwell without page 10-cap. Idle freeze must be applied by the tracker
 * via createLearningIdleController when there is no learning interaction.
 * @param {number} rawDwellMs
 * @param {number} hiddenTabMs
 * @param {{ idleCreditedMs?: number|null }} [opts]
 */
export function computePageCreditedDwellMs(rawDwellMs, hiddenTabMs, opts = {}) {
  const visible = computeVisibleDwellMs(rawDwellMs, hiddenTabMs);
  if (opts.idleCreditedMs != null && Number.isFinite(Number(opts.idleCreditedMs))) {
    return creditOpenLearningMs(Math.min(visible, Math.floor(Number(opts.idleCreditedMs))));
  }
  return applyPageCreditCap(visible);
}

/**
 * @param {number} creditedDwellMs
 */
export function computeBookReadingMinutes(creditedDwellMs) {
  return Number((clampNonNegativeMs(creditedDwellMs) / 60_000).toFixed(2));
}

export function isLearningBookTrackingEnabledServer() {
  return process.env.LEARNING_BOOK_TRACKING_ENABLED !== "false";
}
