/**
 * Conversational reply classification for Global — English matchers only.
 * Hebrew phrase banks removed from Global product.
 */

/**
 * @param {string} text
 * @returns {string|null}
 */
export function classifyShortParentReplyClass(text) {
  const t = String(text || "")
    .trim()
    .toLowerCase();
  if (!t) return null;
  if (/^(yes|yeah|yep|ok|okay|sure|thanks|thank you)\.?$/.test(t)) return "ack";
  if (/^(no|nope|not really)\.?$/.test(t)) return "negate";
  if (/^(what|why|how|when|where)\b/.test(t) || t.endsWith("?")) return "question";
  return null;
}

/** @deprecated Name debt — prefer classifyShortParentReplyClass */
export const classifyShortParentReplyClassHe = classifyShortParentReplyClass;
/** @deprecated Name debt */
export const classifyConversationalReplyHe = classifyShortParentReplyClass;
/** @deprecated Name debt */
export const classifyConversationalReply = classifyShortParentReplyClass;
