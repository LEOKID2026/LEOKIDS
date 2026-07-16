/**
 * Parent-facing insight phrasing that turns ALREADY-COMPUTED facts
 * (gradeRelation, evidenceScope, evidenceSource) into actionable Hebrew meaning.
 *
 * This module ONLY phrases existing data. It never computes scores, accuracy,
 * grade relation, or evidence thresholds — it consumes them.
 *
 *   gradeRelation:  "lower" | "same" | "higher" | "unknown"
 *   evidenceScope:  "prerequisite_foundation" | "registered_grade_primary" | "enrichment_stretch" | "unknown_scope"
 *   evidenceSource: "self_practice" | "parent_assigned_activity" | "learning_book" | "classroom_assigned_activity"
 */

/** Gentle "where did this evidence come from" phrase. Empty string when not meaningful. */
const EVIDENCE_SOURCE_PHRASE_HE = Object.freeze({
  // Parent-assigned provenance is internal only — never shown as a separate parent-report label.
  parent_assigned_activity: "",
  self_practice: "in independent practice",
  learning_book: "after working in the book",
  classroom_assigned_activity: "in a classroom activity",
});

/**
 * @param {string|null|undefined} source
 * @returns {string} phrase like "בפעילות שנשלחה מההורה" or "" when unknown.
 */
export function evidenceSourcePhraseHe(source) {
  const key = String(source || "").trim();
  return EVIDENCE_SOURCE_PHRASE_HE[key] || "";
}

/**
 * Normalize relation → scope when caller only has gradeRelation.
 * @param {string|null|undefined} gradeRelation
 */
export function evidenceScopeFromRelation(gradeRelation) {
  const rel = String(gradeRelation || "").trim();
  if (rel === "same") return "registered_grade_primary";
  if (rel === "lower") return "prerequisite_foundation";
  if (rel === "higher") return "enrichment_stretch";
  return "unknown_scope";
}

/**
 * One actionable sentence that explains what the grade scope MEANS for this topic,
 * given whether the child is succeeding (strength) or struggling (needs support).
 *
 * Returns "" when there is nothing meaningful to add (e.g. unknown relation).
 *
 * @param {{
 *   gradeRelation?: string|null;
 *   evidenceScope?: string|null;
 *   isStrength?: boolean;       // succeeding with enough evidence
 *   needsSupport?: boolean;     // struggling / weak
 *   topicName?: string|null;
 * }} args
 * @returns {string}
 */
export function gradeScopeMeaningHe(args) {
  const rel = String(args?.gradeRelation || "").trim();
  const scope = String(args?.evidenceScope || "").trim() || evidenceScopeFromRelation(rel);
  const isStrength = args?.isStrength === true;
  const needsSupport = args?.needsSupport === true;

  if (scope === "prerequisite_foundation" || rel === "lower") {
    if (needsSupport) {
      return "This practice was done below the registered grade, so difficulty here may point to a need to reinforce the topic's foundations before moving on to grade-level work.";
    }
    if (isStrength) {
      return "This practice was done below the registered grade, and the success here points to a stable foundation - it's fine to move on to grade-level practice.";
    }
    return "This practice was done below the registered grade, so it's worth reading the result as a foundation snapshot rather than grade-level performance.";
  }

  if (scope === "enrichment_stretch" || rel === "higher") {
    if (isStrength) {
      return "The child also succeeded above grade level on this topic - it's worth considering raising the difficulty or moving to a more advanced topic.";
    }
    if (needsSupport) {
      return "This practice was done above the registered grade level, so difficulty here is more expected and doesn't necessarily point to a gap in grade-level content.";
    }
    return "This practice was done above the registered grade level - it's worth reading this separately from grade-level performance.";
  }

  if (scope === "registered_grade_primary" || rel === "same") {
    if (isStrength) {
      return "There's good mastery at grade level on this topic; it's fine to progress gradually - raise the difficulty a bit or move to the next topic.";
    }
  }

  return "";
}

/**
 * Optional "you may be over-investing in a topic the child already masters" insight.
 * Caller decides WHEN to use it (e.g. strong + substantial repeated practice).
 * @param {string|null|undefined} topicName
 * @returns {string}
 */
export function masteryReallocationHe(topicName) {
  const name = String(topicName || "").trim();
  return name
    ? `It looks like there's mastery of ${name}; it's worth considering directing some practice time to another topic that deserves more attention.`
    : "It looks like there's mastery of this topic; it's worth considering directing some practice time to another topic that deserves more attention.";
}

export default {
  evidenceSourcePhraseHe,
  evidenceScopeFromRelation,
  gradeScopeMeaningHe,
  masteryReallocationHe,
};
