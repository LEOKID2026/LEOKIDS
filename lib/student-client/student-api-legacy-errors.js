/**
 * Legacy English `error` tokens returned by student APIs until all routes expose errorCode.
 * Protocol values only — display text is resolved via interface locale in UI.
 *
 * Semantics (Phase 9B-3):
 *   known stable code/token → localized Student copy
 *   unknown API failure → localized generic Student fallback
 *   raw English message → never preferred
 */
export const STUDENT_API_LEGACY_ERROR = Object.freeze({
  SESSION_EXPIRED: "Student session expired",
  SERVER: "Server error",
  TEMPORARY: "A temporary error occurred. Please try again later.",
  NOT_AUTHENTICATED: "Not authenticated",
  METHOD_NOT_ALLOWED: "Method not allowed",
  INVALID_CREDENTIALS: "Incorrect username or PIN",
});

const SNAKE_CODE_RE = /^[a-z][a-z0-9_]*$/i;

/** @type {Readonly<Record<string, string>>} */
const CODE_MESSAGE_KEYS = Object.freeze({
  session_expired: "ui.student.errors.sessionExpired",
  not_authenticated: "ui.student.errors.sessionExpired",
  unauthorized: "ui.student.errors.sessionExpired",
  server_error: "ui.student.errors.serverError",
  unexpected_server_error: "ui.student.errors.serverError",
  internal_error: "ui.student.errors.serverError",
  method_not_allowed: "ui.student.errors.loadFailed",
  start_failed: "ui.student.errors.loadFailed",
  finish_failed: "ui.student.errors.loadFailed",
  missing_session: "ui.student.errors.loadFailed",
  network_error: "auth.networkError",
  invalid_game: "ui.student.errors.loadFailed",
  invalid_difficulty: "ui.student.errors.loadFailed",
  invalid_game_category: "ui.student.errors.loadFailed",
  invalid_game_data: "ui.student.errors.loadFailed",
  missing_game_id: "ui.student.errors.loadFailed",
  game_session_mismatch: "ui.student.errors.loadFailed",
  invalid_category: "ui.student.errors.loadFailed",
  bad_request: "ui.student.errors.loadFailed",
  forbidden: "ui.student.errors.loadFailed",
  not_found: "ui.student.errors.loadFailed",
  db_error: "ui.student.errors.serverError",
  unavailable: "ui.student.errors.loadFailed",
  insufficient_funds: "games.apiInsufficientFunds",
  invalid_credentials: "auth.invalidStudentCredentials",
  guest_resume_failed: "auth.guestUnavailable",
  guest_mode_disabled: "auth.guestUnavailable",
  guest_create_failed: "auth.guestUnavailable",
  missing_resume_token: "auth.guestUnavailable",
});

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
 * @returns {string}
 */
function normalizeCode(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

/**
 * Map known legacy English protocol strings to stable codes.
 * @param {string} raw
 * @returns {string}
 */
function legacyProseToCode(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  if (s === STUDENT_API_LEGACY_ERROR.SESSION_EXPIRED) return "session_expired";
  if (s === STUDENT_API_LEGACY_ERROR.SERVER) return "server_error";
  if (s === STUDENT_API_LEGACY_ERROR.TEMPORARY) return "unexpected_server_error";
  if (s === STUDENT_API_LEGACY_ERROR.NOT_AUTHENTICATED) return "not_authenticated";
  if (s === STUDENT_API_LEGACY_ERROR.METHOD_NOT_ALLOWED) return "method_not_allowed";
  if (s === STUDENT_API_LEGACY_ERROR.INVALID_CREDENTIALS) return "invalid_credentials";
  return "";
}

/**
 * Extract a stable Student/Arcade error code from common payload shapes.
 * Raw English prose yields "" (caller must use localized fallback).
 *
 * @param {unknown} raw
 * @returns {string}
 */
export function extractStudentApiErrorCode(raw) {
  if (raw == null) return "";

  if (typeof raw === "string") {
    const legacy = legacyProseToCode(raw);
    if (legacy) return legacy;
    if (looksLikeMachineCode(raw)) return normalizeCode(raw);
    return "";
  }

  if (typeof raw !== "object") return "";

  const obj = /** @type {{ code?: unknown, errorCode?: unknown, error?: unknown, message?: unknown }} */ (
    raw
  );

  const direct =
    (typeof obj.errorCode === "string" && looksLikeMachineCode(obj.errorCode)
      ? normalizeCode(obj.errorCode)
      : "") ||
    (typeof obj.code === "string" && looksLikeMachineCode(obj.code) ? normalizeCode(obj.code) : "") ||
    (typeof obj.error === "string" && looksLikeMachineCode(obj.error)
      ? normalizeCode(obj.error)
      : "");
  if (direct) return direct;

  if (typeof obj.error === "string") {
    const fromError = extractStudentApiErrorCode(obj.error);
    if (fromError) return fromError;
  }
  if (typeof obj.message === "string") {
    const fromMessage = extractStudentApiErrorCode(obj.message);
    if (fromMessage) return fromMessage;
  }
  return "";
}

/**
 * @param {unknown} raw
 * @param {(key: string, params?: Record<string, unknown>) => string} t
 * @returns {string}
 */
export function resolveStudentApiErrorMessage(raw, t) {
  const fallback = t("ui.student.errors.loadFailed");
  if (raw == null || raw === "") return fallback;

  const code = extractStudentApiErrorCode(raw);
  if (code) {
    const key = CODE_MESSAGE_KEYS[code];
    if (key) {
      const localized = t(key);
      if (typeof localized === "string" && localized.trim() && localized !== key) {
        return localized;
      }
    }
    // Known/unknown machine code without a dedicated Student key → generic fallback.
    return fallback;
  }

  // Raw English (or any non-code) prose must never be preferred.
  return fallback;
}
