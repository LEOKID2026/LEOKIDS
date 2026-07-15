/**
 * History subject removed — copilot history lock helpers are no-ops.
 */

/**
 * @returns {{ locked: false }}
 */
export function detectHistoryCopilotLock() {
  return { locked: false };
}

/**
 * @returns {boolean}
 */
export function isHistoryZeroDataScope() {
  return false;
}

/**
 * @returns {null}
 */
export function composeHistoryZeroDataAnswerDraft() {
  return null;
}
