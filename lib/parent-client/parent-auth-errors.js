/**
 * Maps Supabase/auth provider errors to stable message keys for parent UI.
 * Display layer resolves keys via interface locale (`t(messageKey, parameters)`).
 */

/** @type {Record<string, string>} */
const EXACT_MESSAGE_KEYS = {
  "Invalid login credentials": "auth.errors.invalidLoginCredentials",
  "Email not confirmed": "auth.errors.emailNotConfirmed",
  "User already registered": "auth.errors.userAlreadyRegistered",
  "Password should be at least 6 characters": "auth.errors.passwordTooShortProvider",
  "Signup requires a valid password": "auth.errors.signupPasswordRequired",
  "Unable to validate email address: invalid format": "auth.errors.invalidEmailFormat",
  "Signups not allowed for this instance": "auth.errors.signupsDisabled",
  "Email rate limit exceeded": "auth.errors.rateLimitExceeded",
  "For security purposes, you can only request this after": "auth.errors.rateLimitExceeded",
};

/** @type {Array<[RegExp, string]>} */
const PARTIAL_PATTERNS = [
  [/invalid login credentials/i, EXACT_MESSAGE_KEYS["Invalid login credentials"]],
  [/email not confirmed/i, EXACT_MESSAGE_KEYS["Email not confirmed"]],
  [/user already registered/i, EXACT_MESSAGE_KEYS["User already registered"]],
  [/password should be at least/i, EXACT_MESSAGE_KEYS["Password should be at least 6 characters"]],
  [/invalid format/i, EXACT_MESSAGE_KEYS["Unable to validate email address: invalid format"]],
  [/rate limit/i, EXACT_MESSAGE_KEYS["Email rate limit exceeded"]],
  [/network/i, "auth.errors.connectionProblem"],
  [/fetch failed/i, "auth.errors.connectionProblem"],
];

/**
 * @param {{ message?: string } | string | null | undefined} error
 * @param {'login' | 'signup'} [context]
 * @returns {{ errorCode: string, messageKey: string, parameters: Record<string, string|number> }}
 */
export function mapParentAuthErrorPayload(error, context = "login") {
  const fallback =
    context === "signup"
      ? {
          errorCode: "signup_failed",
          messageKey: "auth.errors.signUpFailed",
          parameters: {},
        }
      : {
          errorCode: "signin_failed",
          messageKey: "auth.errors.signInFailed",
          parameters: {},
        };

  if (!error) return fallback;

  const raw = String(typeof error === "string" ? error : error.message || "").trim();
  if (!raw) return fallback;

  if (EXACT_MESSAGE_KEYS[raw]) {
    return {
      errorCode: "provider_error",
      messageKey: EXACT_MESSAGE_KEYS[raw],
      parameters: {},
    };
  }

  for (const [pattern, messageKey] of PARTIAL_PATTERNS) {
    if (pattern.test(raw)) {
      return { errorCode: "provider_error", messageKey, parameters: {} };
    }
  }

  return context === "signup"
    ? {
        errorCode: "signup_failed",
        messageKey: "auth.errors.signUpFailedSupport",
        parameters: {},
      }
    : {
        errorCode: "signin_failed",
        messageKey: "auth.errors.signInFailedSupport",
        parameters: {},
      };
}

/**
 * @param {{ message?: string } | string | null | undefined} error
 * @param {'login' | 'signup'} [context]
 * @returns {string}
 */
export function mapParentAuthError(error, context = "login") {
  return mapParentAuthErrorPayload(error, context).messageKey;
}

export default mapParentAuthError;
