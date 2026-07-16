/**
 * Server-only product identity for LEO-KIDS-GLOBAL.
 * Never accept product_id from request body, query, cookies, or localStorage.
 */

export const PRODUCT_IL = "leokids_il";
export const PRODUCT_GLOBAL = "leokids_global";

/** @typedef {"leokids_il" | "leokids_global"} LeoProductId */

/**
 * Fixed product for this deployment. Always leokids_global on the Global site.
 * @returns {LeoProductId}
 */
export function getServerProductId() {
  return PRODUCT_GLOBAL;
}

/**
 * Reject client-supplied product claims. Returns the server product only.
 * @param {unknown} [_clientClaim]
 * @returns {LeoProductId}
 */
export function resolveTrustedProductId(_clientClaim) {
  return getServerProductId();
}

/**
 * @param {unknown} value
 * @returns {value is LeoProductId}
 */
export function isLeoProductId(value) {
  return value === PRODUCT_IL || value === PRODUCT_GLOBAL;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
export function isGlobalProductId(value) {
  return value === PRODUCT_GLOBAL;
}

/**
 * English error payloads for Global APIs (no messageHe).
 */
export const PRODUCT_ERRORS = Object.freeze({
  membership_required: {
    ok: false,
    error: "product_membership_required",
    message: "A LEO KIDS Global membership is required for this account.",
  },
  student_wrong_product: {
    ok: false,
    error: "student_wrong_product",
    message: "This student does not belong to LEO KIDS Global.",
  },
  student_not_found: {
    ok: false,
    error: "student_not_found",
    message: "Student not found for this parent on LEO KIDS Global.",
  },
  schema_not_ready: {
    ok: false,
    error: "product_schema_not_ready",
    message: "Product isolation schema is not ready. Apply sql/global-product-isolation before enabling writes.",
  },
});
