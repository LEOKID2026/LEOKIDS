/**
 * Parent-context metadata feature flags (default OFF — IL parity).
 */

/**
 * @returns {boolean}
 */
export function isDiagnosticMetadataSubskillEnabled() {
  return process.env.DIAGNOSTIC_METADATA_SUBSKILL_ENABLED === "true";
}

/**
 * @returns {boolean}
 */
export function isDiagnosticMetadataParentGatingEnabled() {
  return process.env.DIAGNOSTIC_METADATA_PARENT_GATING_ENABLED === "true";
}

/**
 * Both flags must be true for active metadata-informed parent gating.
 * @returns {boolean}
 */
export function isActiveMetadataParentGatingEnabled() {
  return (
    isDiagnosticMetadataSubskillEnabled() && isDiagnosticMetadataParentGatingEnabled()
  );
}

/**
 * @returns {boolean}
 */
export function isDiagnosticMetadataParentPromotionEnabled() {
  return process.env.DIAGNOSTIC_METADATA_PARENT_PROMOTION_ENABLED === "true";
}

/**
 * All three flags must be true for active metadata-informed parent promotion.
 * @returns {boolean}
 */
export function isActiveMetadataParentPromotionEnabled() {
  return (
    isDiagnosticMetadataSubskillEnabled() &&
    isDiagnosticMetadataParentGatingEnabled() &&
    isDiagnosticMetadataParentPromotionEnabled()
  );
}
