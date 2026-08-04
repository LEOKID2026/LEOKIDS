import { burnDownCopy } from "../../lib/learning/burn-down-copy.js";
import {
  isApprovedFactualObservationTag,
  provenFactualParentLabelEn,
} from "./parent-facing-error-pattern-factual.js";
/**
 * Parent-facing copy for internal error/pattern keys — never show raw snake_case to parents.
 *
 * For tags that are approved, evidence-backed factual observations (see
 * parent-facing-error-pattern-factual.js), we prefer the factual label over the
 * hedgy/interpretive wording below ("may be", "confusion", "foundational mix-up") — those
 * softened phrasings are reserved for pattern-family-level keys that are not directly proven.
 */

const SLUG = "utils__learning-pattern-decision__parent-facing-error-pattern";

/** Section heading for topic-card home actions (product copy). */
export const PARENT_TOPIC_HOME_ACTION_HEADING = burnDownCopy(SLUG, "what_to_try_together");

/** @type {readonly string[]} */
const LABEL_KEYS = Object.freeze([
  "procedural_error",
  "procedure_break",
  "calculation_error",
  "conceptual_error",
  "conceptual_misunderstanding",
  "strategy_gap",
  "prerequisite_gap",
  "reading_comprehension_issue",
  "vocabulary_gap",
  "phonics_gap",
  "inference_gap",
  "speed_pressure",
  "careless_or_attention",
  "guessing_or_unstable",
  "careless_error",
  "careless_pattern",
  "operation_selection_error",
  "place_value_error",
  "fraction_concept_error",
  "word_problem_reading",
  "instruction_misread",
  "support_dependent_success",
  "recurring_weakness",
  "speed_driven_error",
]);

/** @type {readonly string[]} */
const MEANING_KEYS = Object.freeze([
  "procedural_error",
  "procedure_break",
  "calculation_error",
  "conceptual_error",
  "conceptual_misunderstanding",
  "strategy_gap",
  "prerequisite_gap",
  "reading_comprehension_issue",
  "vocabulary_gap",
  "speed_pressure",
  "careless_or_attention",
  "guessing_or_unstable",
]);

/**
 * Runtime-resolved parent labels (locale-aware via burnDownCopy).
 * Presence checks use known keys; values resolve at access time.
 * @type {Record<string, string>}
 */
export const PARENT_ERROR_PATTERN_LABEL = new Proxy(
  /** @type {Record<string, string>} */ ({}),
  {
    get(_t, prop) {
      if (typeof prop !== "string") return undefined;
      if (!LABEL_KEYS.includes(prop)) return undefined;
      return burnDownCopy(SLUG, `label_${prop}`);
    },
    has(_t, prop) {
      return typeof prop === "string" && LABEL_KEYS.includes(prop);
    },
    ownKeys() {
      return [...LABEL_KEYS];
    },
    getOwnPropertyDescriptor(_t, prop) {
      if (typeof prop !== "string" || !LABEL_KEYS.includes(prop)) return undefined;
      return { configurable: true, enumerable: true, value: burnDownCopy(SLUG, `label_${prop}`) };
    },
  }
);

/**
 * Runtime-resolved parent meanings (locale-aware via burnDownCopy).
 * @type {Record<string, string>}
 */
export const PARENT_ERROR_PATTERN_MEANING = new Proxy(
  /** @type {Record<string, string>} */ ({}),
  {
    get(_t, prop) {
      if (typeof prop !== "string") return undefined;
      if (!MEANING_KEYS.includes(prop)) return undefined;
      return burnDownCopy(SLUG, `meaning_${prop}`);
    },
    has(_t, prop) {
      return typeof prop === "string" && MEANING_KEYS.includes(prop);
    },
    ownKeys() {
      return [...MEANING_KEYS];
    },
    getOwnPropertyDescriptor(_t, prop) {
      if (typeof prop !== "string" || !MEANING_KEYS.includes(prop)) return undefined;
      return { configurable: true, enumerable: true, value: burnDownCopy(SLUG, `meaning_${prop}`) };
    },
  }
);

/**
 * @param {string|null|undefined} label
 */
export function isTechnicalPatternKey(label) {
  const raw = String(label || "").trim();
  if (!raw) return false;
  if (/^(pf|k|to|st|ct):/i.test(raw)) return true;
  if (/^default_[a-z0-9_]+$/i.test(raw)) return true;
  return /^[a-z][a-z0-9_]*$/i.test(raw) && !LABEL_KEYS.includes(raw.toLowerCase());
}

/** @deprecated Alias kept for existing parent-label imports. */
export const isTechnicalEnglishPatternKey = isTechnicalPatternKey;

/**
 * @param {string|null|undefined} label
 */
export function parentFacingErrorPatternLabel(label) {
  const key = String(label || "").trim().toLowerCase();
  if (!key) return "";
  // Prefer locale pack (including ar-001) over English-only factual phrases.
  const fromPack = burnDownCopy(SLUG, `label_${key}`);
  if (fromPack && fromPack !== `label_${key}`) return fromPack;
  if (isApprovedFactualObservationTag(key)) {
    const factual = provenFactualParentLabelEn(key);
    if (factual) return factual;
  }
  return "";
}

/**
 * @param {string|null|undefined} label
 */
export function parentFacingErrorPatternMeaning(label) {
  const key = String(label || "").trim().toLowerCase();
  if (!key) return "";
  if (isApprovedFactualObservationTag(key)) {
    const factual = provenFactualParentLabelEn(key);
    if (factual) {
      return burnDownCopy(SLUG, "meaning_showed_up_in_practice").replace("{factual}", factual);
    }
  }
  if (PARENT_ERROR_PATTERN_MEANING[key]) return PARENT_ERROR_PATTERN_MEANING[key];
  const short = parentFacingErrorPatternLabel(label);
  if (short) {
    return burnDownCopy(SLUG, "meaning_related_to").replace("{short}", short);
  }
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
