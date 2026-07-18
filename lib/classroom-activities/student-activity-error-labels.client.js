import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
/**
 * Student-facing English labels for classroom activity API errors.
 * Internal codes stay English in APIs — children must never see raw snake_case keys.
 */

/** @type {Record<string, string>} */
export const STUDENT_ACTIVITY_ERROR_LABEL_HE = {
  activity_not_available: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "this_activity_is_not_available_right_now"),
  activity_not_found: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "activity_not_found"),
  activity_not_started: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "this_activity_has_not_started_yet"),
  activity_not_accepting_answers: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "answers_cannot_be_submitted_for_this_activity_right_now"),
  activity_closed: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "this_activity_is_closed"),
  activity_expired: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "time_is_up_for_this_activity"),
  invalid_activity: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "could_not_open_this_activity_right_now"),
  not_found: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "not_found"),
  unauthorized: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "please_sign_in"),
  not_authenticated: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "please_sign_in"),
  forbidden: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "you_do_not_have_permission_to_open_this_activity"),
  not_assigned: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "this_activity_is_not_assigned_to_you"),
  student_not_assigned: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "this_activity_is_not_assigned_to_you"),
  student_not_in_activity: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "this_activity_is_not_assigned_to_you"),
  missing_student: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "could_not_identify_the_account"),
  validation_failed: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "could_not_complete_that_action_right_now"),
  already_submitted: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "you_already_submitted_this_activity"),
  question_already_answered: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "you_already_answered_this_question"),
  question_not_broadcast: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "waiting_for_the_teacher"),
  answer_not_required: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "no_answer_submission_needed"),
  db_schema_not_ready: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "the_system_is_updating_try_again_later"),
  internal_error: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "something_went_wrong_please_try_again"),
  unexpected_error: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "something_went_wrong_please_try_again"),
  server_error: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "server_error_please_try_again"),
  method_not_allowed: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "action_not_supported"),
  question_missing: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "could_not_load_the_question_right_now"),
  question_missing_answer: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "could_not_submit_an_answer_right_now"),
};

/** @type {Record<string, string>} */
const STUDENT_ACTIVITY_ENGLISH_LITERAL_HE = {
  not_authenticated: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "please_sign_in"),
  server_error: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "server_error_please_try_again"),
  method_not_allowed: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "action_not_supported"),
  questionindex_required: globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "could_not_submit_an_answer_right_now"),
};

const INTERNAL_CODE_PATTERN = /^[a-z][a-z0-9_]*$/;

/**
 * @param {unknown} value
 */
function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

/**
 * @param {unknown} value
 */
export function isInternalLookingStudentActivityErrorCode(value) {
  const key = normalizeKey(value);
  return Boolean(key && INTERNAL_CODE_PATTERN.test(key));
}

/**
 * @param {unknown} codeOrMessage
 * @param {string} [fallback]
 */
export function formatStudentActivityErrorHe(
  codeOrMessage,
  fallback = globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "could_not_open_this_activity_right_now")
) {
  const raw = String(codeOrMessage ?? "").trim();
  if (!raw) return fallback;

  const key = normalizeKey(raw);
  if (STUDENT_ACTIVITY_ERROR_LABEL_HE[key]) {
    return STUDENT_ACTIVITY_ERROR_LABEL_HE[key];
  }
  if (STUDENT_ACTIVITY_ENGLISH_LITERAL_HE[key]) {
    return STUDENT_ACTIVITY_ENGLISH_LITERAL_HE[key];
  }

  // Do not surface leftover Hebrew API text to Global students.
  if (/[\u0590-\u05FF]/.test(raw)) {
    return fallback;
  }

  if (isInternalLookingStudentActivityErrorCode(key)) {
    return fallback;
  }

  if (/^[a-z0-9_.\s-]+$/i.test(raw)) {
    return fallback;
  }

  return raw;
}

/**
 * @param {{ error?: unknown, code?: unknown, message?: unknown }|string|null|undefined} payload
 * @param {string} [fallback]
 */
export function resolveStudentActivityApiErrorHe(
  payload,
  fallback = globalBurnDownCopy("lib__classroom-activities__student-activity-error-labels.client", "could_not_open_this_activity_right_now")
) {
  if (typeof payload === "string") {
    return formatStudentActivityErrorHe(payload, fallback);
  }
  if (!payload || typeof payload !== "object") {
    return fallback;
  }

  const candidates = [payload.error, payload.code, payload.message].filter(
    (value) => value != null && String(value).trim()
  );

  for (const candidate of candidates) {
    const key = normalizeKey(candidate);
    if (STUDENT_ACTIVITY_ERROR_LABEL_HE[key]) {
      return STUDENT_ACTIVITY_ERROR_LABEL_HE[key];
    }
    if (STUDENT_ACTIVITY_ENGLISH_LITERAL_HE[key]) {
      return STUDENT_ACTIVITY_ENGLISH_LITERAL_HE[key];
    }
    if (/[\u0590-\u05FF]/.test(String(candidate))) {
      return fallback;
    }
  }

  for (const candidate of candidates) {
    if (isInternalLookingStudentActivityErrorCode(candidate)) {
      return fallback;
    }
  }

  return fallback;
}
