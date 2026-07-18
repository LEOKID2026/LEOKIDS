/**
 * Standard API error codes — clients map to validation.* locale keys.
 */

/** @type {Readonly<Record<string, string>>} */
export const API_ERROR_I18N_KEYS = Object.freeze({
  missing_user_id: "validation.missingUserId",
  invalid_grade: "validation.invalidGrade",
  product_membership_suspended: "validation.productMembershipSuspended",
  schema_not_ready: "validation.schemaNotReady",
  unauthorized: "validation.unauthorized",
  forbidden: "validation.forbidden",
  not_found: "validation.notFound",
  invalid_request: "validation.invalidRequest",
});

/**
 * @param {string} errorCode
 * @returns {string|null}
 */
export function mapApiErrorToI18nKey(errorCode) {
  return API_ERROR_I18N_KEYS[String(errorCode || "").trim()] || null;
}

/**
 * @param {string} errorCode
 * @param {Record<string, unknown>} [details]
 */
export function buildApiErrorPayload(errorCode, details = {}) {
  return {
    ok: false,
    errorCode: String(errorCode || "invalid_request"),
    details,
  };
}
