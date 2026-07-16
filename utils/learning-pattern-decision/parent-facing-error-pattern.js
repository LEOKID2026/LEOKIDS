/**
 * Parent-facing English for internal error/pattern keys — never show raw snake_case to parents.
 * English sibling of parent-facing-error-pattern-he.js.
 */

/** Section heading for topic-card home actions (product copy). */
export const PARENT_TOPIC_HOME_ACTION_HEADING = "What to try together";

export const PARENT_ERROR_PATTERN_LABEL = Object.freeze({
  procedural_error: "the child picks a solving method that does not fit the question",
  procedure_break: "confusion about the order of steps in solving",
  calculation_error: "the mistake comes from a calculation or order of operations",
  conceptual_error: "there seems to be a foundational mix-up with the material",
  conceptual_misunderstanding: "there seems to be a foundational mix-up with the material",
  strategy_gap: "the child does not always pick the strategy that fits the question",
  prerequisite_gap: "a small foundational skill may be worth reinforcing before moving on",
  reading_comprehension_issue: "the difficulty may be related to understanding the question or text",
  vocabulary_gap: "missing words or terms may be making the question harder to solve",
  phonics_gap: "the difficulty may be related to reading and decoding letters",
  inference_gap: "the difficulty may be related to drawing conclusions from the information",
  speed_pressure: "some mistakes appear related to working quickly",
  careless_or_attention: "small slips appear that repeat when working quickly",
  guessing_or_unstable: "answers look less consistent, and sometimes seem like guesses",
  careless_error: "small slips appear that repeat when working quickly",
  careless_pattern: "small slips appear that repeat when working quickly",
  operation_selection_error: "the child does not always choose the right operation for the question",
  place_value_error: "there may be some confusion with the place value of digits",
  fraction_concept_error: "there may be a foundational mix-up with fractions",
  word_problem_reading: "the difficulty may be related to understanding how the question is worded",
  instruction_misread: "some mistakes appear related to misreading the instructions",
  support_dependent_success: "success mostly happens with guidance or hints",
  recurring_weakness: "some mistakes repeat in the same type of activity",
  speed_driven_error: "some mistakes happened while working quickly",
});

export const PARENT_ERROR_PATTERN_MEANING = Object.freeze({
  procedural_error:
    "The difficulty seems to be in choosing a solving method: the child knows part of the material, but does not always pick the right step for the question.",
  procedure_break:
    "There seems to be confusion about the order of steps, so it helps to walk through the method together, step by step.",
  calculation_error:
    "The difficulty tends to repeat at the calculation step or order of operations, so it helps to break the problem into smaller steps.",
  conceptual_error:
    "There seems to be a foundational mix-up with the material, not just a one-time calculation slip.",
  conceptual_misunderstanding:
    "There seems to be a foundational mix-up with the material, not just a one-time calculation slip.",
  strategy_gap:
    "The difficulty seems to be in choosing a solving method, not necessarily a lack of knowledge.",
  prerequisite_gap:
    "A small foundational skill may be worth reinforcing before moving on to harder topics.",
  reading_comprehension_issue:
    "The difficulty may be related to understanding the question or text, not just calculation or recall.",
  vocabulary_gap:
    "Missing words or terms may be making it harder for the child to understand what is being asked.",
  speed_pressure:
    "Some mistakes appear related to speed - it helps to work through the question at a calmer pace.",
  careless_or_attention:
    "The material appears partly familiar, but small slips repeat when working quickly.",
  guessing_or_unstable:
    "Answers look less consistent, so it helps to check the solving method together, not just the result.",
});

/**
 * @param {string|null|undefined} label
 */
export function isTechnicalPatternKey(label) {
  const raw = String(label || "").trim();
  if (!raw) return false;
  if (/^(pf|k|to|st|ct):/i.test(raw)) return true;
  if (/^default_[a-z0-9_]+$/i.test(raw)) return true;
  return /^[a-z][a-z0-9_]*$/i.test(raw) && !PARENT_ERROR_PATTERN_LABEL[raw.toLowerCase()];
}

/**
 * @param {string|null|undefined} label
 */
export function parentFacingErrorPatternLabel(label) {
  const key = String(label || "").trim().toLowerCase();
  if (!key) return "";
  return PARENT_ERROR_PATTERN_LABEL[key] || "";
}

/**
 * @param {string|null|undefined} label
 */
export function parentFacingErrorPatternMeaning(label) {
  const key = String(label || "").trim().toLowerCase();
  if (!key) return "";
  if (PARENT_ERROR_PATTERN_MEANING[key]) return PARENT_ERROR_PATTERN_MEANING[key];
  const short = parentFacingErrorPatternLabel(label);
  if (short) return `The difficulty seems related to the fact that ${short}.`;
  return "";
}

/**
 * @param {string|null|undefined} label
 */
export function resolveParentFacingPatternLabel(label) {
  const raw = String(label || "").trim();
  if (!raw) return "";
  const mapped = parentFacingErrorPatternLabel(raw);
  if (mapped) return mapped;
  if (isTechnicalPatternKey(raw)) return "";
  return raw;
}

/**
 * @param {string|null|undefined} text
 */
export function stripParentTopicSectionPrefix(text) {
  return String(text || "")
    .replace(/^what this means:\s*/i, "")
    .replace(/^what to try at home:\s*/i, "")
    .replace(/^what to try together:\s*/i, "")
    .replace(/^the recurring mistake:\s*/i, "")
    .trim();
}
