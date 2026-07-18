export const COPY_INVITE_SUCCESS_MESSAGE_KEY = "auth.copy.inviteSuccess";
export const COPY_INVITE_ERROR_MESSAGE_KEY = "auth.copy.inviteError";
export const COPY_LEO_NUMBER_SUCCESS_MESSAGE_KEY = "auth.copy.leoNumberSuccess";
export const COPY_LEO_NUMBER_ERROR_MESSAGE_KEY = "auth.copy.leoNumberError";

/** @deprecated use COPY_INVITE_SUCCESS_MESSAGE_KEY with t() */
export const COPY_INVITE_SUCCESS_MESSAGE_HE = COPY_INVITE_SUCCESS_MESSAGE_KEY;
/** @deprecated use COPY_INVITE_ERROR_MESSAGE_KEY with t() */
export const COPY_INVITE_ERROR_MESSAGE_HE = COPY_INVITE_ERROR_MESSAGE_KEY;
/** @deprecated use COPY_INVITE_SUCCESS_MESSAGE_KEY with t() */
export const COPY_INVITE_SUCCESS_MESSAGE = COPY_INVITE_SUCCESS_MESSAGE_KEY;
/** @deprecated use COPY_INVITE_ERROR_MESSAGE_KEY with t() */
export const COPY_INVITE_ERROR_MESSAGE = COPY_INVITE_ERROR_MESSAGE_KEY;
/** @deprecated use COPY_LEO_NUMBER_SUCCESS_MESSAGE_KEY with t() */
export const COPY_LEO_NUMBER_SUCCESS_MESSAGE_HE = COPY_LEO_NUMBER_SUCCESS_MESSAGE_KEY;
/** @deprecated use COPY_LEO_NUMBER_ERROR_MESSAGE_KEY with t() */
export const COPY_LEO_NUMBER_ERROR_MESSAGE_HE = COPY_LEO_NUMBER_ERROR_MESSAGE_KEY;

/** @param {string} text @returns {Promise<boolean>} */
export async function copyTextToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
