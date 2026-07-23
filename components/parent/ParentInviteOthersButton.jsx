import { useState } from "react";
import CopyConfirmPopup from "../ui/CopyConfirmPopup.jsx";
import { useT } from "../../lib/i18n/I18nProvider.jsx";
import { buildParentReferralInviteMessage } from "../../lib/site/public-site-origin.client.js";
import {
  COPY_INVITE_ERROR_MESSAGE_KEY,
  COPY_INVITE_SUCCESS_MESSAGE_KEY,
  copyTextToClipboard,
} from "../../lib/ui/copy-confirm-message.js";
import { assertParentDemoReadOnly } from "../../lib/demo/parent-demo-readonly.client.js";

/**
 * Share invite — copy message + centered popup confirmation.
 * @param {{ bright?: boolean, label?: string, className?: string, inline?: boolean }} props
 */
export default function ParentInviteOthersButton({
  bright = false,
  labelKey = "auth.parentInviteOthers",
  className,
  inline = false,
}) {
  const t = useT();
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsError, setPopupIsError] = useState(false);

  const handleClick = async () => {
    const readOnly = assertParentDemoReadOnly("share");
    if (!readOnly.allowed) {
      setPopupIsError(true);
      setPopupMessage(readOnly.message);
      setPopupOpen(true);
      return;
    }
    const ok = await copyTextToClipboard(buildParentReferralInviteMessage(t));
    if (ok) {
      setPopupIsError(false);
      setPopupMessage(t(COPY_INVITE_SUCCESS_MESSAGE_KEY));
    } else {
      setPopupIsError(true);
      setPopupMessage(t(COPY_INVITE_ERROR_MESSAGE_KEY));
    }
    setPopupOpen(true);
  };

  const defaultBtnClass = bright
    ? "inline-flex w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-r from-sky-500 via-sky-600 to-teal-600 px-6 py-3.5 text-base font-bold text-white shadow-md shadow-sky-200/50 transition hover:from-sky-600 hover:via-sky-700 hover:to-teal-700 md:w-auto md:px-5 md:py-2.5 md:text-sm"
    : "inline-flex w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 px-6 py-3.5 text-base font-bold text-black shadow-md shadow-amber-900/30 transition hover:from-amber-300 hover:via-amber-400 hover:to-yellow-400 md:w-auto md:px-5 md:py-2.5 md:text-sm";
  const btnClass = className || defaultBtnClass;

  const button = (
    <button
      type="button"
      onClick={() => void handleClick()}
      className={btnClass}
      data-testid="parent-invite-others-btn"
    >
      {t(labelKey)}
    </button>
  );

  return (
    <>
      {inline ? button : <div className="flex justify-center">{button}</div>}

      <CopyConfirmPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        message={popupMessage}
        isError={popupIsError}
        bright={bright}
        autoCloseMs={3000}
        zIndexClass="z-[170]"
        testId="parent-invite-others-popup"
      />
    </>
  );
}
