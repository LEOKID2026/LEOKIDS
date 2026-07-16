/**
 * Student-facing English labels for classroom activity API errors.
 * Internal codes stay English in APIs — children must never see raw snake_case keys.
 */

/** @type {Record<string, string>} */
export const STUDENT_ACTIVITY_ERROR_LABEL_HE = {
  activity_not_available: "This activity is not available right now",
  activity_not_found: "Activity not found",
  activity_not_started: "This activity has not started yet",
  activity_not_accepting_answers: "Answers cannot be submitted for this activity right now",
  activity_closed: "This activity is closed",
  activity_expired: "Time is up for this activity",
  invalid_activity: "Could not open this activity right now",
  not_found: "Not found",
  unauthorized: "Please sign in",
  not_authenticated: "Please sign in",
  forbidden: "You do not have permission to open this activity",
  not_assigned: "This activity is not assigned to you",
  student_not_assigned: "This activity is not assigned to you",
  student_not_in_activity: "This activity is not assigned to you",
  missing_student: "Could not identify the account",
  validation_failed: "Could not complete that action right now",
  already_submitted: "You already submitted this activity",
  question_already_answered: "You already answered this question",
  question_not_broadcast: "Waiting for the teacher…",
  answer_not_required: "No answer submission needed",
  db_schema_not_ready: "The system is updating — try again later",
  internal_error: "Something went wrong — please try again",
  unexpected_error: "Something went wrong — please try again",
  server_error: "Server error — please try again",
  method_not_allowed: "Action not supported",
  question_missing: "Could not load the question right now",
  question_missing_answer: "Could not submit an answer right now",
};

/** @type {Record<string, string>} */
const STUDENT_ACTIVITY_ENGLISH_LITERAL_HE = {
  not_authenticated: "Please sign in",
  server_error: "Server error — please try again",
  method_not_allowed: "Action not supported",
  questionindex_required: "Could not submit an answer right now",
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
  fallback = "Could not open this activity right now"
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
  fallback = "Could not open this activity right now"
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
