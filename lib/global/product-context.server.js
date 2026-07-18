import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
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
    message: globalBurnDownCopy("lib__global__product-context.server", "this_student_does_not_belong_to_leo_kids_global"),
  },
  student_not_found: {
    ok: false,
    error: "student_not_found",
    message: globalBurnDownCopy("lib__global__product-context.server", "student_not_found_for_this_parent_on_leo_kids_global"),
  },
  schema_not_ready: {
    ok: false,
    error: "product_schema_not_ready",
    message: globalBurnDownCopy("lib__global__product-context.server", "product_isolation_schema_is_not_ready_apply_sql_global_product_isolation"),
  },
});
