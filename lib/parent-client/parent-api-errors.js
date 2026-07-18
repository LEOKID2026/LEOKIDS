/**
 * Stable error codes and message keys for parent dashboard and report shell surfaces.
 * Display layer resolves keys via interface locale (`t(messageKey, parameters)`).
 */

export const PARENT_DASHBOARD_CREATE_SUCCESS_KEY = "ui.parent.createChildSuccess";
export const PARENT_DASHBOARD_UPDATE_SUCCESS_KEY = "ui.parent.updateChildSuccess";

/** @type {Record<string, string>} */
const CODE_TO_MESSAGE_KEY = {
  guest_not_eligible: "ui.parent.errors.guestNotEligible",
  grade_required: "ui.parent.gradeRequired",
  not_a_parent: "ui.parent.errors.notParent",
  student_not_found: "ui.parent.errors.childNotFound",
  reports_disabled: "ui.parent.errors.reportsDisabled",
  invalid_date_params: "ui.parent.errors.invalidDateRange",
  unauthorized: "ui.parent.errors.signInAgain",
  forbidden: "ui.parent.errors.reportForbidden",
};

/**
 * @param {number} status
 * @param {string|null|undefined} code
 * @param {string|null|undefined} rawError
 * @param {{ isTeacher?: boolean }} [opts]
 * @returns {{ errorCode: string, messageKey: string, parameters: Record<string, string|number> }}
 */
export function mapParentReportLoadErrorPayload(status, code, rawError, opts = {}) {
  const normalizedCode = String(code || "").trim();
  if (normalizedCode && CODE_TO_MESSAGE_KEY[normalizedCode]) {
    return {
      errorCode: normalizedCode,
      messageKey: CODE_TO_MESSAGE_KEY[normalizedCode],
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
  const normalizedCode = String(code || "").trim();
  if (normalizedCode && CODE_TO_MESSAGE_KEY[normalizedCode]) {
    return {
      errorCode: normalizedCode,
      messageKey: CODE_TO_MESSAGE_KEY[normalizedCode],
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

  const raw = String(rawError || "").trim();
  if (raw && /[A-Za-z]{4,}/.test(raw)) {
    return {
      errorCode: normalizedCode || "provider_error",
      messageKey: "ui.parent.errors.rawMessage",
      parameters: { message: raw },
    };
  }
  if (raw) {
    return {
      errorCode: normalizedCode || "provider_message",
      messageKey: "ui.parent.errors.rawMessage",
      parameters: { message: raw },
    };
  }

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
  if (s && /[A-Za-z]{4,}/.test(s)) {
    return {
      errorCode: "provider_error",
      messageKey: "ui.parent.errors.rawMessage",
      parameters: { message: s },
    };
  }
  if (s) {
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
