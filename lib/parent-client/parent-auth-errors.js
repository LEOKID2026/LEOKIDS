/**
 * Maps Supabase/auth provider errors to safe English messages for parent UI.
 */

/** @type {Record<string, string>} */
const EXACT_MESSAGES = {
  "Invalid login credentials":
    "Incorrect login details. Check your email and password and try again.",
  "Email not confirmed":
    "Please confirm your email address before signing in. Check your inbox.",
  "User already registered":
    "This email is already registered. Try signing in instead.",
  "Password should be at least 6 characters":
    "Password must be at least 6 characters.",
  "Signup requires a valid password":
    "Enter a valid password (at least 6 characters).",
  "Unable to validate email address: invalid format":
    "That email address is not valid. Check it and try again.",
  "Signups not allowed for this instance":
    "Sign-up is not available right now. Please try again later.",
  "Email rate limit exceeded":
    "Too many attempts. Wait a few minutes and try again.",
  "For security purposes, you can only request this after":
    "Too many attempts. Wait a few minutes and try again.",
};

/** @type {Array<[RegExp, string]>} */
const PARTIAL_PATTERNS = [
  [/invalid login credentials/i, EXACT_MESSAGES["Invalid login credentials"]],
  [/email not confirmed/i, EXACT_MESSAGES["Email not confirmed"]],
  [/user already registered/i, EXACT_MESSAGES["User already registered"]],
  [/password should be at least/i, EXACT_MESSAGES["Password should be at least 6 characters"]],
  [/invalid format/i, EXACT_MESSAGES["Unable to validate email address: invalid format"]],
  [/rate limit/i, EXACT_MESSAGES["Email rate limit exceeded"]],
  [/network/i, "Connection problem. Check your internet and try again."],
  [/fetch failed/i, "Connection problem. Check your internet and try again."],
];

/**
 * @param {{ message?: string } | string | null | undefined} error
 * @param {'login' | 'signup'} [context]
 * @returns {string}
 */
export function mapParentAuthError(error, context = "login") {
  if (!error) {
    return context === "signup"
      ? "Sign-up failed. Please try again."
      : "Sign-in failed. Please try again.";
  }

  const raw = String(typeof error === "string" ? error : error.message || "").trim();
  if (!raw) {
    return context === "signup"
      ? "Sign-up failed. Please try again."
      : "Sign-in failed. Please try again.";
  }

  if (EXACT_MESSAGES[raw]) return EXACT_MESSAGES[raw];

  for (const [pattern, message] of PARTIAL_PATTERNS) {
    if (pattern.test(raw)) return message;
  }

  return context === "signup"
    ? "Sign-up failed. Please try again or contact support."
    : "Sign-in failed. Please try again or contact support.";
}

export default mapParentAuthError;
