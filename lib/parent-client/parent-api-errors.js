/**
 * Stable error codes and message keys for parent dashboard and report shell surfaces.
 * Display layer resolves keys via interface locale (`t(messageKey, parameters)`).
 *
 * Phase 9B-2: code-first only. Raw English API prose is never the preferred display path.
 */

import {
  extractApiErrorCode,
  normalizeApiErrorCode,
} from "../api/resolve-api-error-message.js";

export const PARENT_DASHBOARD_CREATE_SUCCESS_KEY = "ui.parent.createChildSuccess";
export const PARENT_DASHBOARD_UPDATE_SUCCESS_KEY = "ui.parent.updateChildSuccess";

const SNAKE_CODE_RE = /^[a-z][a-z0-9_]*$/i;

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function looksLikeMachineCode(value) {
  const raw = String(value ?? "").trim();
  if (!raw || !SNAKE_CODE_RE.test(raw)) return false;
  return raw.includes("_") || raw.length >= 3;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function looksLikeMessageKey(value) {
  const raw = String(value ?? "").trim();
  return (
    raw.startsWith("ui.parent.") ||
    raw.startsWith("parent.") ||
    raw.startsWith("validation.api.") ||
    raw.startsWith("validation.")
  );
}

/**
 * Parent-owned message keys for known codes (prefer Parent UI; reuse validation.api when exact).
 * @type {Record<string, string>}
 */
const CODE_TO_MESSAGE_KEY = {
  guest_not_eligible: "ui.parent.errors.guestNotEligible",
  grade_required: "ui.parent.gradeRequired",
  not_a_parent: "ui.parent.errors.notParent",
  student_not_found: "ui.parent.errors.childNotFound",
  reports_disabled: "ui.parent.errors.reportsDisabled",
  invalid_date_params: "ui.parent.errors.invalidDateRange",
  unauthorized: "ui.parent.errors.signInAgain",
  not_authenticated: "ui.parent.errors.signInAgain",
  forbidden: "ui.parent.errors.reportForbidden",
  not_authorized: "ui.parent.errors.actionForbidden",
  method_not_allowed: "validation.api.method_not_allowed",
  internal_error: "validation.api.internal_error",
  unexpected_server_error: "validation.api.unexpected_server_error",
  server_error: "validation.api.server_error",
  validation_failed: "validation.api.validation_failed",
  student_id_required: "validation.api.student_id_required",
  missing_student_id: "validation.api.missing_student_id",
  student_not_linked: "validation.api.student_not_linked",
  student_product_mismatch: "validation.api.student_product_mismatch",
  rate_limited: "validation.api.rate_limited",
  db_schema_not_ready: "validation.api.db_schema_not_ready",
  product_schema_not_ready: "validation.api.db_schema_not_ready",
  account_deactivated: "validation.api.account_deactivated",
  subject_mismatch: "validation.api.subject_mismatch",
  update_failed: "validation.api.update_failed",
  db_error: "validation.api.db_error",

  // Access code / PIN (Parent-specific; MAIN may later map into validation.api)
  username_taken: "parent.credentialsSaveFailed",
  invalid_pin: "parent.newPinFourDigits",
  invalid_username: "parent.invalidUsername",
  access_code_create_failed: "parent.credentialsSaveFailed",
  username_check_failed: "parent.credentialsSaveFailed",
  access_code_revoke_failed: "parent.credentialsSaveFailed",
  student_inactive: "validation.api.student_inactive",

  // Create / update / delete
  create_student_failed: "ui.parent.errors.createChildFailed",
  update_student_failed: "ui.parent.errors.updateChildFailed",
  update_student_grade_failed: "ui.parent.errors.updateChildFailed",
  load_created_student_failed: "ui.parent.errors.createChildFailed",
  child_limit_reached: "validation.api.child_limit_reached",
  full_name_required: "validation.api.full_name_required",
  full_name_too_long: "validation.api.full_name_too_long",
  grade_level_too_long: "validation.api.grade_level_too_long",
  no_fields_to_update: "validation.api.no_fields_to_update",
  delete_student_failed: "parent.deleteFailed",
  delete_student_timeout: "parent.deleteFailed",
  delete_student_dependency_failed: "parent.deleteFailed",
  delete_student_fk_blocked: "parent.deleteFailed",
  student_not_owned: "validation.api.student_not_owned",

  // Guest link
  guest_link_failed: "parent.guestLinkFailed",
  invalid_leo_number: "parent.guestLeoEightDigits",

  // Permissions
  invalid_subject: "validation.api.invalid_subject",
  no_valid_fields: "validation.api.no_valid_fields",
  subject_catalog_incomplete: "validation.api.subject_catalog_incomplete",
  permissions_schema_not_ready: "validation.api.db_schema_not_ready",

  // Reports / coin history
  coin_history_load_failed: "validation.api.coin_history_load_failed",
  report_load_failed: "ui.parent.errors.reportLoadFailed",
};

/**
 * @param {string} code
 * @param {string} fallbackKey
 * @returns {{ errorCode: string, messageKey: string, parameters: Record<string, string|number> }}
 */
function mappedOrFallback(code, fallbackKey) {
  const normalized = normalizeApiErrorCode(code);
  if (normalized && CODE_TO_MESSAGE_KEY[normalized]) {
    return {
      errorCode: normalized,
      messageKey: CODE_TO_MESSAGE_KEY[normalized],
      parameters: {},
    };
  }
  if (normalized && looksLikeMachineCode(normalized)) {
    // Unknown stable code → Parent-localized generic (MAIN may add validation.api later)
    return {
      errorCode: normalized,
      messageKey: fallbackKey,
      parameters: {},
    };
  }
  return {
    errorCode: normalized || "generic_failed",
    messageKey: fallbackKey,
    parameters: {},
  };
}

/**
 * Resolve a Parent API failure payload to a display message key (never raw English).
 *
 * @param {{
 *   status?: number,
 *   code?: string|null,
 *   errorCode?: string|null,
 *   error?: string|null,
 *   message?: string|null,
 * }|null|undefined} payload
 * @param {"load_students"|"create_student"|"update_student"|"credentials"|"pin_reset"|"delete_student"|"guest_link"|"panel_load"|"panel_save"|"report"|"generic"} [context]
 * @returns {{ errorCode: string, messageKey: string, parameters: Record<string, string|number> }}
 */
export function mapParentApiFailurePayload(payload, context = "generic") {
  const status = Number(payload?.status) || 0;
  const extracted =
    extractApiErrorCode(payload) ||
    (looksLikeMachineCode(payload?.error) ? normalizeApiErrorCode(payload.error) : "") ||
    (looksLikeMachineCode(payload?.message) ? normalizeApiErrorCode(payload.message) : "");

  if (context === "report") {
    return mapParentReportLoadErrorPayload(status, extracted || payload?.code, null, {});
  }
  if (context === "panel_load") {
    return mapParentPanelApiErrorPayload(extracted || payload?.error, "load");
  }
  if (context === "panel_save") {
    return mapParentPanelApiErrorPayload(extracted || payload?.error, "save");
  }
  if (context === "credentials" || context === "pin_reset") {
    const fallback =
      context === "pin_reset" ? "parent.pinChangeFailed" : "parent.credentialsSaveFailed";
    if (extracted) return mappedOrFallback(extracted, fallback);
    if (status === 401) {
      return { errorCode: "unauthorized", messageKey: "ui.parent.errors.signInAgain", parameters: {} };
    }
    if (status === 403) {
      return { errorCode: "forbidden", messageKey: "ui.parent.errors.actionForbidden", parameters: {} };
    }
    return { errorCode: "access_code_create_failed", messageKey: fallback, parameters: {} };
  }
  if (context === "delete_student") {
    if (extracted) return mappedOrFallback(extracted, "parent.deleteFailed");
    return { errorCode: "delete_student_failed", messageKey: "parent.deleteFailed", parameters: {} };
  }
  if (context === "guest_link") {
    if (extracted) return mappedOrFallback(extracted, "parent.guestLinkFailed");
    if (status === 429) {
      return { errorCode: "rate_limited", messageKey: "validation.api.rate_limited", parameters: {} };
    }
    return { errorCode: "guest_link_failed", messageKey: "parent.guestLinkFailed", parameters: {} };
  }

  const dashContext =
    context === "load_students" || context === "create_student" || context === "update_student"
      ? context
      : "generic";
  return mapParentDashboardApiErrorPayload(status, extracted || payload?.code, null, dashContext);
}

/**
 * @param {{
 *   status?: number,
 *   code?: string|null,
 *   errorCode?: string|null,
 *   error?: string|null,
 *   message?: string|null,
 * }|null|undefined} payload
 * @param {"load_students"|"create_student"|"update_student"|"credentials"|"pin_reset"|"delete_student"|"guest_link"|"panel_load"|"panel_save"|"report"|"generic"} [context]
 * @param {(key: string, params?: Record<string, string|number>) => string} t
 * @returns {string}
 */
export function resolveParentApiErrorDisplay(payload, context, t) {
  const mapped = mapParentApiFailurePayload(
    { ...(payload || {}), status: payload?.status },
    context
  );
  if (typeof t !== "function") return mapped.messageKey;
  return t(mapped.messageKey, mapped.parameters);
}

/**
 * @param {number} status
 * @param {string|null|undefined} code
 * @param {string|null|undefined} rawError
 * @param {{ isTeacher?: boolean }} [opts]
 * @returns {{ errorCode: string, messageKey: string, parameters: Record<string, string|number> }}
 */
export function mapParentReportLoadErrorPayload(status, code, rawError, opts = {}) {
  const normalizedCode =
    normalizeApiErrorCode(code) ||
    (looksLikeMachineCode(rawError) ? normalizeApiErrorCode(rawError) : "");

  if (normalizedCode && CODE_TO_MESSAGE_KEY[normalizedCode]) {
    return {
      errorCode: normalizedCode,
      messageKey: CODE_TO_MESSAGE_KEY[normalizedCode],
      parameters: {},
    };
  }
  if (normalizedCode && looksLikeMachineCode(normalizedCode)) {
    return {
      errorCode: normalizedCode,
      messageKey: "ui.parent.errors.reportLoadFailed",
      parameters: {},
    };
  }

  if (status === 401) {
    return {
      errorCode: "unauthorized",
      messageKey: opts.isTeacher
        ? "ui.parent.errors.signInAgainTeacher"
        : "ui.parent.errors.signInAgainParent",
      parameters: {},
    };
  }
  if (status === 403 || status === 404) {
    return {
      errorCode: normalizedCode || "forbidden",
      messageKey: "ui.parent.errors.reportForbidden",
      parameters: {},
    };
  }
  if (status === 400) {
    return {
      errorCode: "invalid_date_params",
      messageKey: CODE_TO_MESSAGE_KEY.invalid_date_params,
      parameters: {},
    };
  }

  // Non-Latin provider copy only (already localized scripts) — never Latin/English prose.
  const raw = String(rawError || "").trim();
  if (raw && !/[A-Za-z]{4,}/.test(raw)) {
    return {
      errorCode: normalizedCode || "provider_message",
      messageKey: "ui.parent.errors.rawMessage",
      parameters: { message: raw },
    };
  }

  return {
    errorCode: normalizedCode || "report_load_failed",
    messageKey: "ui.parent.errors.reportLoadFailed",
    parameters: {},
  };
}

/**
 * @param {number} status
 * @param {string|null|undefined} code
 * @param {string|null|undefined} rawError
 * @param {{ isTeacher?: boolean }} [opts]
 * @returns {string}
 */
export function mapParentReportLoadError(status, code, rawError, opts = {}) {
  return mapParentReportLoadErrorPayload(status, code, rawError, opts).messageKey;
}

/**
 * @param {number} status
 * @param {string|null|undefined} code
 * @param {string|null|undefined} rawError
 * @param {"load_students"|"create_student"|"update_student"|"generic"} context
 * @returns {{ errorCode: string, messageKey: string, parameters: Record<string, string|number> }}
 */
export function mapParentDashboardApiErrorPayload(
  status,
  code,
  rawError,
  context = "generic"
) {
  const normalizedCode =
    normalizeApiErrorCode(code) ||
    (looksLikeMachineCode(rawError) ? normalizeApiErrorCode(rawError) : "");

  if (normalizedCode && CODE_TO_MESSAGE_KEY[normalizedCode]) {
    return {
      errorCode: normalizedCode,
      messageKey: CODE_TO_MESSAGE_KEY[normalizedCode],
      parameters: {},
    };
  }
  if (normalizedCode && looksLikeMachineCode(normalizedCode)) {
    const fallback =
      context === "load_students"
        ? "ui.parent.errors.loadChildrenFailed"
        : context === "create_student"
          ? "ui.parent.errors.createChildFailed"
          : context === "update_student"
            ? "ui.parent.errors.updateChildFailed"
            : "ui.parent.errors.genericFailed";
    return {
      errorCode: normalizedCode,
      messageKey: fallback,
      parameters: {},
    };
  }

  if (status === 401) {
    return {
      errorCode: "unauthorized",
      messageKey: "ui.parent.errors.signInAgain",
      parameters: {},
    };
  }
  if (status === 403) {
    return {
      errorCode: normalizedCode || "forbidden",
      messageKey: "ui.parent.errors.actionForbidden",
      parameters: {},
    };
  }

  // Intentionally ignore Latin/English rawError — never passthrough via rawMessage.
  if (context === "load_students") {
    return {
      errorCode: "load_students_failed",
      messageKey: "ui.parent.errors.loadChildrenFailed",
      parameters: {},
    };
  }
  if (context === "create_student") {
    return {
      errorCode: "create_student_failed",
      messageKey: "ui.parent.errors.createChildFailed",
      parameters: {},
    };
  }
  if (context === "update_student") {
    return {
      errorCode: "update_student_failed",
      messageKey: "ui.parent.errors.updateChildFailed",
      parameters: {},
    };
  }
  return {
    errorCode: normalizedCode || "generic_failed",
    messageKey: "ui.parent.errors.genericFailed",
    parameters: {},
  };
}

/**
 * @param {number} status
 * @param {string|null|undefined} code
 * @param {string|null|undefined} rawError
 * @param {"load_students"|"create_student"|"update_student"|"generic"} context
 * @returns {string}
 */
export function mapParentDashboardApiError(status, code, rawError, context = "generic") {
  return mapParentDashboardApiErrorPayload(status, code, rawError, context).messageKey;
}

/** @deprecated use PARENT_DASHBOARD_CREATE_SUCCESS_KEY with t() */
export function parentDashboardCreateSuccessHe() {
  return PARENT_DASHBOARD_CREATE_SUCCESS_KEY;
}

/** @deprecated use PARENT_DASHBOARD_UPDATE_SUCCESS_KEY with t() */
export function parentDashboardUpdateSuccessHe() {
  return PARENT_DASHBOARD_UPDATE_SUCCESS_KEY;
}

/**
 * @param {unknown} raw
 * @param {"load"|"save"|"generic"} context
 * @returns {{ errorCode: string, messageKey: string, parameters: Record<string, string|number> }}
 */
export function mapParentPanelApiErrorPayload(raw, context = "generic") {
  const s = String(raw || "").trim();

  if (looksLikeMessageKey(s)) {
    return {
      errorCode: "panel_message_key",
      messageKey: s,
      parameters: {},
    };
  }

  const code = looksLikeMachineCode(s) ? normalizeApiErrorCode(s) : "";
  if (code && CODE_TO_MESSAGE_KEY[code]) {
    return {
      errorCode: code,
      messageKey: CODE_TO_MESSAGE_KEY[code],
      parameters: {},
    };
  }
  if (code) {
    const fallback =
      context === "load"
        ? "ui.parent.errors.panelLoadFailed"
        : context === "save"
          ? "ui.parent.errors.panelSaveFailed"
          : "ui.parent.errors.genericFailed";
    return {
      errorCode: code,
      messageKey: fallback,
      parameters: {},
    };
  }

  // Non-Latin only — never Latin/English API prose.
  if (s && !/[A-Za-z]{4,}/.test(s)) {
    return {
      errorCode: "provider_message",
      messageKey: "ui.parent.errors.rawMessage",
      parameters: { message: s },
    };
  }

  if (context === "load") {
    return {
      errorCode: "panel_load_failed",
      messageKey: "ui.parent.errors.panelLoadFailed",
      parameters: {},
    };
  }
  if (context === "save") {
    return {
      errorCode: "panel_save_failed",
      messageKey: "ui.parent.errors.panelSaveFailed",
      parameters: {},
    };
  }
  return {
    errorCode: "panel_generic_failed",
    messageKey: "ui.parent.errors.genericFailed",
    parameters: {},
  };
}

/**
 * @param {unknown} raw
 * @param {"load"|"save"|"generic"} context
 * @returns {string}
 */
export function mapParentPanelApiError(raw, context = "generic") {
  return mapParentPanelApiErrorPayload(raw, context).messageKey;
}
