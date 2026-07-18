/**
 * Legacy English `error` tokens returned by student APIs until all routes expose errorCode.
 * Protocol values only — display text is resolved via interface locale in UI.
 */
export const STUDENT_API_LEGACY_ERROR = Object.freeze({
  SESSION_EXPIRED: "Student session expired",
  SERVER: "Server error",
});

/**
 * @param {unknown} raw
 * @param {(key: string, params?: Record<string, unknown>) => string} t
 */
export function resolveStudentApiErrorMessage(raw, t) {
  const s = String(raw || "").trim();
  if (!s) return t("ui.student.errors.loadFailed");
  if (s === STUDENT_API_LEGACY_ERROR.SESSION_EXPIRED) {
    return t("ui.student.errors.sessionExpired");
  }
  if (s === STUDENT_API_LEGACY_ERROR.SERVER) {
    return t("ui.student.errors.serverError");
  }
  if (/[A-Za-z]{4,}/.test(s)) return s;
  return t("ui.student.errors.loadFailed");
}
