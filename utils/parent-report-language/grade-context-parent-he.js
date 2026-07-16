/**
 * Parent-facing grade-context labels and copy (display only).
 * Consumes pre-computed gradeRelation — never computes grades.
 */

/** @param {string|null|undefined} gradeRelation */
export function gradeContextShortLabelHe(gradeRelation) {
  const rel = String(gradeRelation || "").trim();
  if (rel === "higher") return "Advanced practice";
  if (rel === "lower") return "Prior foundations";
  return "";
}

/**
 * @param {{ gradeRelation?: string|null, isStrength?: boolean, needsSupport?: boolean }} args
 */
export function gradeContextExplanationHe(args) {
  const rel = String(args?.gradeRelation || "").trim();
  const isStrength = args?.isStrength === true;
  const needsSupport = args?.needsSupport === true;

  if (rel === "higher") {
    if (isStrength) return "The child is handling advanced material well.";
    if (needsSupport) {
      return "This is advanced material above the registered grade, so it's worth progressing through it gradually.";
    }
    return "This is advanced material above the registered grade, so it's worth progressing through it gradually.";
  }

  if (rel === "lower") {
    if (isStrength) return "Prior foundations look stable.";
    if (needsSupport) return "It's worth reviewing foundations from earlier grades.";
    return "This practice was done below the registered grade - it's worth reading the result as a foundation snapshot.";
  }

  return "";
}

/**
 * @param {{ gradeRelation?: string|null, isStrength?: boolean, needsSupport?: boolean }} args
 */
export function gradeContextActionHe(args) {
  const rel = String(args?.gradeRelation || "").trim();
  const isStrength = args?.isStrength === true;

  if (rel === "higher") {
    return isStrength
      ? "It's fine to continue gradually, after making sure the registered grade's material is stable."
      : "It's fine to continue gradually, after making sure the registered grade's material is stable.";
  }

  if (rel === "lower") {
    return "Practice a few short questions on prior foundations before moving forward.";
  }

  return "";
}

/**
 * @param {string|null|undefined} gradeRelation
 * @param {number} accuracy
 */
export function gradeContextNeedsSupport(gradeRelation, accuracy) {
  const rel = String(gradeRelation || "").trim();
  const acc = Number(accuracy) || 0;
  if (rel === "higher" || rel === "lower") return acc < 72;
  return acc < 55;
}

/**
 * @param {string|null|undefined} gradeRelation
 * @param {number} accuracy
 * @param {number} questions
 */
export function gradeContextIsStrength(gradeRelation, accuracy, questions) {
  const rel = String(gradeRelation || "").trim();
  const acc = Number(accuracy) || 0;
  const q = Number(questions) || 0;
  if (rel === "higher") return acc >= 78 && q >= 8;
  if (rel === "lower") return acc >= 85 && q >= 10;
  return acc >= 90 && q >= 10;
}

/**
 * Map base tier to grade-aware tier for parent display.
 * @param {string} baseTier
 * @param {string|null|undefined} gradeRelation
 * @param {number} questions
 */
export function resolveGradeAwareParentTopicTier(baseTier, gradeRelation, questions) {
  const rel = String(gradeRelation || "").trim();
  const q = Number(questions) || 0;
  if (q <= 0) return baseTier;
  if (rel === "higher") {
    if (baseTier === "low_evidence" && q < 12) return baseTier;
    return "advanced_practice";
  }
  if (rel === "lower") {
    if (baseTier === "low_evidence" && q < 12) return baseTier;
    return "foundation_practice";
  }
  return baseTier;
}

/**
 * @param {string|null|undefined} gradeRelation
 * @param {string} labelHe
 */
export function resolveGradeAwareRecommendationStepLabelHe(gradeRelation, labelHe) {
  const rel = String(gradeRelation || "").trim();
  const raw = String(labelHe || "").trim();
  if (!rel || rel === "same" || rel === "unknown") return raw;
  if (rel === "higher") return gradeContextShortLabelHe(rel);
  if (rel === "lower") return gradeContextShortLabelHe(rel);
  return raw;
}

/**
 * Returns true when standard strengthen/gap copy must not be shown.
 * @param {string|null|undefined} gradeRelation
 */
export function suppressRegisteredGradeStrengthenCopy(gradeRelation) {
  const rel = String(gradeRelation || "").trim();
  return rel === "higher" || rel === "lower";
}
