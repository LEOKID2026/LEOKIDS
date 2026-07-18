/** @typedef {{ code?: string|null, message?: string|null, error?: string|null }} GuestResumeFailurePayload */

export const GUEST_RESUME_MESSAGE_KEYS = Object.freeze({
  guest_already_linked: "ui.guest.resume.alreadyLinked",
  guest_resume_invalid: "ui.guest.resume.invalid",
});

export const GUEST_NEW_AFTER_FAILED_RESUME_CONFIRM_KEY = "ui.guest.resume.newAfterFailedConfirm";

/**
 * @param {GuestResumeFailurePayload | null | undefined} payload
 * @returns {{ code: string, messageKey: string } | null}
 */
export function guestResumeFailureBannerFromPayload(payload) {
  const code = String(payload?.code || "").trim();
  if (!code) return null;

  const messageKey = GUEST_RESUME_MESSAGE_KEYS[code];
  if (messageKey) {
    return { code, messageKey };
  }

  const serverText = String(payload?.message || payload?.error || "").trim();
  if (serverText) {
    return { code, messageKey: "ui.guest.errors.featureLocked" };
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
