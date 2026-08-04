import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
/**
 * Student-facing labels for classroom activity API errors (locale-aware burn-down at call time).
 * Internal codes stay English in APIs — children must never see raw snake_case keys.
 */

const SLUG = "lib__classroom-activities__student-activity-error-labels.client";

/** @type {Record<string, string>} code → burn-down key */
const ERROR_COPY_KEYS = {
  activity_not_available: "this_activity_is_not_available_right_now",
  activity_not_found: "activity_not_found",
  activity_not_started: "this_activity_has_not_started_yet",
  activity_not_accepting_answers: "answers_cannot_be_submitted_for_this_activity_right_now",
  activity_closed: "this_activity_is_closed",
  activity_expired: "time_is_up_for_this_activity",
  invalid_activity: "could_not_open_this_activity_right_now",
  not_found: "not_found",
  unauthorized: "please_sign_in",
  not_authenticated: "please_sign_in",
  forbidden: "you_do_not_have_permission_to_open_this_activity",
  not_assigned: "this_activity_is_not_assigned_to_you",
  student_not_assigned: "this_activity_is_not_assigned_to_you",
  student_not_in_activity: "this_activity_is_not_assigned_to_you",
  missing_student: "could_not_identify_the_account",
  validation_failed: "could_not_complete_that_action_right_now",
  already_submitted: "you_already_submitted_this_activity",
  question_already_answered: "you_already_answered_this_question",
  question_not_broadcast: "waiting_for_the_teacher",
  answer_not_required: "no_answer_submission_needed",
  db_schema_not_ready: "the_system_is_updating_try_again_later",
  internal_error: "something_went_wrong_please_try_again",
  unexpected_error: "something_went_wrong_please_try_again",
  server_error: "server_error_please_try_again",
  method_not_allowed: "action_not_supported",
  question_missing: "could_not_load_the_question_right_now",
  question_missing_answer: "could_not_submit_an_answer_right_now",
  questionindex_required: "could_not_submit_an_answer_right_now",
};

/**
 * Lazy map for callers that still read `STUDENT_ACTIVITY_ERROR_LABEL_HE[code]`.
 * Resolves against the active burn-down locale on each property access.
 */
export const STUDENT_ACTIVITY_ERROR_LABEL_HE = new Proxy(
  {},
  {
    get(_target, prop) {
      if (typeof prop !== "string") return undefined;
      const copyKey = ERROR_COPY_KEYS[prop];
      return copyKey ? globalBurnDownCopy(SLUG, copyKey) : undefined;
    },
    has(_target, prop) {
      return typeof prop === "string" && Object.prototype.hasOwnProperty.call(ERROR_COPY_KEYS, prop);
    },
    ownKeys() {
      return Object.keys(ERROR_COPY_KEYS);
    },
    getOwnPropertyDescriptor(_target, prop) {
      if (typeof prop !== "string" || !ERROR_COPY_KEYS[prop]) return undefined;
      return { configurable: true, enumerable: true, value: globalBurnDownCopy(SLUG, ERROR_COPY_KEYS[prop]) };
    },
  }
);

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
 * @param {string} key
 */
function labelForKey(key) {
  const copyKey = ERROR_COPY_KEYS[key];
  return copyKey ? globalBurnDownCopy(SLUG, copyKey) : null;
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
  fallback = globalBurnDownCopy(SLUG, "could_not_open_this_activity_right_now")
) {
  const raw = String(codeOrMessage ?? "").trim();
  if (!raw) return fallback;

  const key = normalizeKey(raw);
  const mapped = labelForKey(key);
  if (mapped) return mapped;

  // Do not surface leftover Hebrew API text to Global students.
  if (/(?!)/.test(raw)) {
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
  fallback = globalBurnDownCopy(SLUG, "could_not_open_this_activity_right_now")
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
    const mapped = labelForKey(key);
    if (mapped) return mapped;
    if (/(?!)/.test(String(candidate))) {
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
