/**
 * Parent-context metadata feature flags (enabled by default on global product).
 */

function envEnabled(name, defaultWhenUnset = true) {
  const raw = process.env[name];
  if (raw == null || String(raw).trim() === "") return defaultWhenUnset;
  const v = String(raw).trim().toLowerCase();
  if (v === "0" || v === "false" || v === "no" || v === "off") return false;
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/**
 * @returns {boolean}
 */
export function isDiagnosticMetadataSubskillEnabled() {
  return envEnabled("DIAGNOSTIC_METADATA_SUBSKILL_ENABLED", true);
}

/**
 * @returns {boolean}
 */
export function isDiagnosticMetadataParentGatingEnabled() {
  return envEnabled("DIAGNOSTIC_METADATA_PARENT_GATING_ENABLED", true);
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
