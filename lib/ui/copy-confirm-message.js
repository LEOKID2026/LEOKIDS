export const COPY_INVITE_SUCCESS_MESSAGE_HE =
  "Message copied! Paste it into WhatsApp, email, or any messaging app.";

export const COPY_INVITE_ERROR_MESSAGE_HE = "We could not copy the message. Please try again.";

export const COPY_INVITE_SUCCESS_MESSAGE = COPY_INVITE_SUCCESS_MESSAGE_HE;
export const COPY_INVITE_ERROR_MESSAGE = COPY_INVITE_ERROR_MESSAGE_HE;

export const COPY_LEO_NUMBER_SUCCESS_MESSAGE_HE =
  "Leo Number copied! Paste it into WhatsApp, email, or any messaging app.";

export const COPY_LEO_NUMBER_ERROR_MESSAGE_HE = "We could not copy the Leo Number. Please try again.";

/** @param {string} text @returns {Promise<boolean>} */
export async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
