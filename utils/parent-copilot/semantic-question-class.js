/**
 * Answer-first semantic routing: aggregate / comparison-style parent questions
 * (parent utterances). Does not read contracts — pattern only.
 */

/**
 * @param {string} utterance
 * @returns {
 *   "strongest_subject"|"weakest_subject"|"hardest_subject"|"subject_listing"|"period_highlight"|
 *   "comparison"|"most_practice"|"least_data"|"improved"|"needs_attention"|"still_unclear"|"most_stable"|
 *   "recommendation_action"|"clarify_reexplain"|"advance_or_hold_question"|"vague_summary_question"|"none"
 * }
 */
export function detectAggregateQuestionClass(utterance) {
  const t = String(utterance || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

  if (t.length < 3) return "none";

  if (
    /(?!)/u.test(t) ||
    /(?!)/u.test(t)
  ) {
    return "none";
  }

  if (
    /(?!)/u.test(t) ||
    /(?!)/u.test(t) ||
    /(?!)/u.test(t) ||
    /(?!)/u.test(t) ||
    /(?!)/u.test(t) ||
    /(?!)/u.test(t) ||
    /(?!)/u.test(t) ||
    /(?!)/u.test(t) ||
    /(?!)/u.test(t)
  ) {
    return "needs_attention";
  }

  if (
    /(?!)/u.test(t)
  ) {
    return "still_unclear";
  }

  if (
    /(?!)/u.test(t) ||
    /(?!)/u.test(t) ||
    /(?!)/u.test(t) ||
    /(?!)/u.test(t)
  ) {
    return "vague_summary_question";
  }

  if (
    /(?!)/.test(t) ||
    /\bi\s+(?:did\s+not|didn'?t|don'?t)\s+understand\b/.test(t) ||
    /\bplease\s+explain\b/.test(t) ||
    /\bexplain\s+(?:it\s+)?(?:simply|in\s+simple\s+terms)\b/.test(t) ||
    /\bwhat\s+does\s+(?:that|this)\s+mean\b/.test(t) ||
    /\bwhy\s*\??$/.test(t)
  ) {
    return "clarify_reexplain";
  }

  if (
    /(?!)/.test(t) ||
    /\b(?:should\s+(?:we|i)\s+(?:move\s+forward|wait)|wait\s+or\s+continue|continue\s+or\s+wait|advance\s+or\s+hold)\b/.test(
      t,
    ) ||
    /\bis\s+it\s+worth\s+moving\s+forward\b/.test(t) ||
    /\bworth\s+(?:it\s+to\s+)?(?:move\s+forward|advance)\b/.test(t)
  ) {
    return "advance_or_hold_question";
  }

  if (
    /(?!)/.test(t) ||
    /(?!)/.test(t) ||
    /(?!)/.test(t) ||
    /(?!)/.test(t) ||
    (/(?!)/u.test(t) && /(?!)/u.test(t)) ||
    /(?!)/.test(t) ||
    /(?!)/.test(t) ||
    /(?!)/.test(t) ||
    /\bwhat\s+should\s+(?:we|i)\s+do\s+(?:right\s+now|today|this\s+week)\b/.test(t) ||
    /\bwhat\s+(?:should\s+(?:we|i)\s+)?(?:do|practice)\s+this\s+week\b/.test(t) ||
    /\bwhat\s+is\s+(?:the\s+)?next\s+step\b/.test(t) ||
    /\bwhat\s+are\s+(?:the\s+)?next\s+recommendations?\b/.test(t) ||
    /\bwhat\s+(?:should\s+(?:we|i)\s+)?focus\s+on\s+(?:right\s+now|today|now|this\s+week)\b/.test(t) ||
    /\bwhat\s+is\s+(?:the\s+)?most\s+important(?:\s+(?:thing|to\s+practice))?(?:\s+(?:right\s+now|today|now|this\s+week))?\b/.test(
      t,
    )
  ) {
    return "recommendation_action";
  }

  const hasSubjectWord = /(?!)/.test(t);
  const hasMore = /(?!)/.test(t);

  if (
    (/(?!)/.test(t) && /(?!)/.test(t)) ||
    (/(?!)/.test(t) && /(?!)/.test(t)) ||
    (/\b(?:what|which)\b.*\b(?:stands?\s+out|most\s+noticeable|most\s+important|highlight)\b/.test(t) &&
      /\b(?:period|report|learning)\b/.test(t))
  ) {
    return "period_highlight";
  }
  if (/(?!)/.test(t) && (t.includes("report") || t.includes("learning"))) {
    return "period_highlight";
  }

  if (hasMore && hasSubjectWord) return "subject_listing";
  if (hasMore && /(?!)/.test(t)) return "subject_listing";

  if (/(?!)/.test(t)) {
    return "most_practice";
  }
  if (/(?!)/.test(t)) {
    return "least_data";
  }
  if (/(?!)/.test(t)) return "improved";
  if (/(?!)/.test(t)) return "needs_attention";
  if (/(?!)/.test(t)) return "still_unclear";
  if (/(?!)/.test(t) && (hasSubjectWord || t.includes("subject"))) {
    return "most_stable";
  }

  if (
    (/(?!)/.test(t) && hasSubjectWord) ||
    /(?!)/.test(t) ||
    /\b(?:which|what)\s+subject\b.*\b(?:hardest|most\s+difficult|most\s+challenging)\b/.test(t) ||
    /\b(?:hardest|most\s+difficult|most\s+challenging)\s+subject\b/.test(t) ||
    /\bsubject\b.*\b(?:is\s+the\s+)?(?:hardest|most\s+difficult|most\s+challenging)\b/.test(t)
  ) {
    return "hardest_subject";
  }

  if (
    (/(?!)/.test(t) && hasSubjectWord) ||
    /(?!)/.test(t) ||
    /\b(?:which|what)\s+subject\b.*\b(?:weakest|lowest|lowest\s+accuracy)\b/.test(t) ||
    /\b(?:weakest|lowest)\s+subject\b/.test(t) ||
    /\bsubject\b.*\b(?:is\s+the\s+)?(?:weakest|lowest)\b/.test(t)
  ) {
    return "weakest_subject";
  }

  if (
    (/(?!)/.test(t) && hasSubjectWord) ||
    (/(?!)/.test(t) && (hasSubjectWord || t.includes("subject"))) ||
    /(?!)/.test(t) ||
    /\b(?:which|what)\s+subject\b.*\b(?:strongest|best|highest|going\s+well)\b/.test(t) ||
    /\b(?:strongest|best|highest)\s+subject\b/.test(t) ||
    /\bsubject\b.*\b(?:is\s+the\s+)?(?:strongest|best|highest|going\s+well)\b/.test(t)
  ) {
    return "strongest_subject";
  }

  if (
    /(?!)/.test(t) ||
    /(?!)/.test(t) ||
    /(?!)/u.test(
      t,
    ) ||
    /\b(?:compare|compared|versus|vs\.?|between)\b.*\b(?:subject|math|arithmetic|english|geometry|science|history|hebrew)\b/.test(t)
  ) {
    return "comparison";
  }

  return "none";
}

/** Aggregate classes that bind to executive scope even when a topic name appears in the utterance. */
export const EXECUTIVE_AGGREGATE_SCOPE_CLASSES = new Set([
  "period_highlight",
  "strongest_subject",
  "weakest_subject",
  "hardest_subject",
  "subject_listing",
  "comparison",
  "most_practice",
  "least_data",
  "improved",
  "needs_attention",
  "still_unclear",
  "most_stable",
]);

/** Semantic answer-first classes that must not be pre-empted by intent_composer. */
export const INTENT_COMPOSER_DEFER_CLASSES = new Set([
  "recommendation_action",
  "clarify_reexplain",
  "advance_or_hold_question",
  ...EXECUTIVE_AGGREGATE_SCOPE_CLASSES,
]);

/**
 * @param {string} questionClass
 */
export function shouldDeferIntentComposer(questionClass) {
  return INTENT_COMPOSER_DEFER_CLASSES.has(String(questionClass || ""));
}

export default { detectAggregateQuestionClass, shouldDeferIntentComposer, EXECUTIVE_AGGREGATE_SCOPE_CLASSES, INTENT_COMPOSER_DEFER_CLASSES };
