/**
 * English error mappers for parent dashboard and report surfaces.
 */

const PARENT_REPORT_LOAD_FALLBACK = "Could not load the parent report.";

/** @type {Record<string, string>} */
const CODE_TO_MESSAGE = {
  guest_not_eligible: "Not available for guest accounts.",
  grade_required: "Please select a grade.",
  not_a_parent: "This account is not authorized for parent access.",
  student_not_found: "Child not found.",
  reports_disabled: "Parent reports are not available right now.",
  invalid_date_params: "The date range is not valid.",
  unauthorized: "Please sign in again.",
  forbidden: "You do not have access to this child's report.",
};

const ENGLISH_SNIPPET_RE = /[A-Za-z]{4,}/;

/**
 * @param {number} status
 * @param {string|null|undefined} code
 * @param {string|null|undefined} rawError
 * @param {{ isTeacher?: boolean }} [opts]
 */
export function mapParentReportLoadError(status, code, rawError, opts = {}) {
  const normalizedCode = String(code || "").trim();
  if (normalizedCode && CODE_TO_MESSAGE[normalizedCode]) {
    return CODE_TO_MESSAGE[normalizedCode];
  }

  if (status === 401) {
    return opts.isTeacher ? "Please sign in again as a teacher." : "Please sign in again as a parent.";
  }
  if (status === 403 || status === 404) {
    return "You do not have access to this child's report.";
  }
  if (status === 400) {
    return CODE_TO_MESSAGE.invalid_date_params;
  }

  const raw = String(rawError || "").trim();
  if (raw && !ENGLISH_SNIPPET_RE.test(raw)) {
    return raw;
  }

  return PARENT_REPORT_LOAD_FALLBACK;
}

/**
 * @param {number} status
 * @param {string|null|undefined} code
 * @param {string|null|undefined} rawError
 * @param {"load_students"|"create_student"|"update_student"|"generic"} context
 */
export function mapParentDashboardApiError(status, code, rawError, context = "generic") {
  const normalizedCode = String(code || "").trim();
  if (normalizedCode && CODE_TO_MESSAGE[normalizedCode]) {
    return CODE_TO_MESSAGE[normalizedCode];
  }

  if (status === 401) return "Please sign in again.";
  if (status === 403) return "You do not have permission for this action.";

  const raw = String(rawError || "").trim();
  if (raw && ENGLISH_SNIPPET_RE.test(raw)) {
    return raw;
  }
  if (raw) return raw;

  if (context === "load_students") return "Could not load the children list.";
  if (context === "create_student") return "Could not add the child.";
  if (context === "update_student") return "Could not update the child's details.";
  return "Could not complete that action. Please try again.";
}

export function parentDashboardCreateSuccessHe() {
  return "Child added successfully.";
}

export function parentDashboardUpdateSuccessHe() {
  return "Child details saved.";
}

/**
 * @param {unknown} raw
 * @param {"load"|"save"|"generic"} context
 */
export function mapParentPanelApiError(raw, context = "generic") {
  const s = String(raw || "").trim();
  if (s && ENGLISH_SNIPPET_RE.test(s)) return s;
  if (s) return s;
  if (context === "load") return "Could not load the data.";
  if (context === "save") return "Could not save the changes.";
  return "Could not complete that action. Please try again.";
}
