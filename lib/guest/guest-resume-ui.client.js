/** @typedef {{ code?: string|null, message?: string|null, error?: string|null }} GuestResumeFailurePayload */

export const GUEST_RESUME_LINKED_MESSAGE_HE =
  "This guest number is already linked to a parent. Sign in with your username and code, or ask your parent for login details.";

export const GUEST_RESUME_INVALID_MESSAGE_HE =
  "We could not restore guest mode on this device. Starting as a new guest will create a new Leo number and previous progress will not carry over.";

export const GUEST_NEW_AFTER_FAILED_RESUME_CONFIRM_HE =
  "We could not restore your previous guest session. Starting as a new guest will create a new Leo number and previous progress will not carry over. Continue?";

/**
 * @param {GuestResumeFailurePayload | null | undefined} payload
 * @returns {{ code: string, messageHe: string } | null}
 */
export function guestResumeFailureBannerFromPayload(payload) {
  const code = String(payload?.code || "").trim();
  if (!code) return null;
  const serverText = String(payload?.message || payload?.error || "").trim();
  if (code === "guest_already_linked") {
    return {
      code,
      messageHe: serverText || GUEST_RESUME_LINKED_MESSAGE_HE,
    };
  }
  if (code === "guest_resume_invalid") {
    return {
      code,
      messageHe: serverText || GUEST_RESUME_INVALID_MESSAGE_HE,
    };
  }
  if (serverText) {
    return { code, messageHe: serverText };
  }
  return null;
}

/**
 * Linked guests cannot start a new guest session from this device.
 * @param {string | null | undefined} code
 */
export function shouldBlockGuestStartAfterResumeFailure(code) {
  return code === "guest_already_linked";
}

/**
 * Before creating a fresh guest after a failed resume, confirm with the child.
 * @param {string | null | undefined} code
 */
export function shouldConfirmNewGuestAfterResumeFailure(code) {
  return code === "guest_resume_invalid";
}
