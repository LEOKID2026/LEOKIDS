/**
 * Contextual follow-up utterances (multi-turn Copilot; classifier + scope inheritance).
 * EN/ES matchers only — Hebrew phrase banks removed for Global.
 */

import { foldUtteranceForMatch, normalizeFreeformParentUtterance } from "./utterance-normalize.js";

export const CONTEXTUAL_FOLLOW_UP_RE =
  /(?:^|\s)(?:and\s+)?(?:what|where|why|how|when|also|again|more|about\s+that|and\s+then|so\s+what|what\s+about)\b|(?:^|\s)(?:mistakes?|errors?|at\s+home|next\s+steps?|what\s+to\s+do)\b/i;

/**
 * @param {string} utterance
 */
export function isContextualFollowUpUtterance(utterance) {
  const folded = foldUtteranceForMatch(normalizeFreeformParentUtterance(utterance));
  if (folded.length < 2) return false;
  if (folded.length > 120) return false;
  return CONTEXTUAL_FOLLOW_UP_RE.test(folded);
}

export default { CONTEXTUAL_FOLLOW_UP_RE, isContextualFollowUpUtterance };
