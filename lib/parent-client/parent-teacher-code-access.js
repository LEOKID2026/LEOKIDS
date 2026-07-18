const LOGIN_API = `/api/${"guardian"}/login`;
const ME_API = `/api/${"guardian"}/me`;

/**
 * @param {string} loginUsername
 * @param {string} pin
 * @param {string} [studentId]
 */
export async function postParentTeacherCodeLogin(loginUsername, pin, studentId) {
  const body = { loginUsername, pin };
  if (studentId) body.studentId = studentId;

  const res = await fetch(LOGIN_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "same-origin",
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, body: json };
}

/** @returns {Promise<number>} HTTP status from session probe */
export async function fetchParentTeacherCodeSessionStatus() {
  const res = await fetch(ME_API, { credentials: "same-origin", cache: "no-store" });
  return res.status;
}

export function parentTeacherCodeReportPath() {
  return "/parent/child-report";
}

/** Full document navigation after login (avoids client-side 404 on stale mobile/PWA bundles). */
export function redirectAfterParentTeacherCodeLogin() {
  if (typeof window === "undefined") return;
  window.location.assign(parentTeacherCodeReportPath());
}

/**
 * @param {Record<string, unknown>|undefined} body
 * @param {"login" | "invite"} [context]
 * @returns {{ errorCode: string, messageKey: string, parameters: Record<string, string|number> }}
 */
export function mapGuardianAccessErrorPayload(body, context = "login") {
  const code = body?.error?.code;
  if (code === "guardian_multiple_students") {
    return {
      errorCode: "guardian_multiple_students",
      messageKey: "auth.guardian.selectChild",
      parameters: {},
    };
  }
  if (
    code === "access_expired" ||
    code === "access_revoked" ||
    code === "session_revoked"
  ) {
    return {
      errorCode: String(code),
      messageKey: "auth.guardian.accessExpired",
      parameters: {},
    };
  }
  if (code === "invitation_invalid") {
    return {
      errorCode: "invitation_invalid",
      messageKey:
        context === "invite" ? "auth.guardian.inviteInvalid" : "auth.guardian.accessExpired",
      parameters: {},
    };
  }
  if (context === "invite") {
    return {
      errorCode: "invite_failed",
      messageKey: "auth.guardian.inviteInvalid",
      parameters: {},
    };
  }
  return {
    errorCode: "invalid_credentials",
    messageKey: "auth.guardian.invalidCredentials",
    parameters: {},
  };
}

/**
 * @param {Record<string, unknown>|undefined} body
 * @param {"login" | "invite"} [context]
 * @returns {string}
 */
export function mapGuardianAccessErrorKey(body, context = "login") {
  return mapGuardianAccessErrorPayload(body, context).messageKey;
}

/**
 * @param {Record<string, unknown>|undefined} body
 * @returns {string}
 */
export function mapParentTeacherCodeLoginError(body) {
  return mapGuardianAccessErrorKey(body, "login");
}

/**
 * @param {Record<string, unknown>|undefined} body
 * @returns {{ studentId: string, studentFullNameMasked: string }[]}
 */
export function parseGuardianMultipleStudents(body) {
  const list = body?.data?.students;
  if (!Array.isArray(list)) return [];
  return list
    .filter((s) => s && typeof s.studentId === "string")
    .map((s) => ({
      studentId: s.studentId,
      studentFullNameMasked: String(s.studentFullNameMasked || "").trim(),
    }));
}
