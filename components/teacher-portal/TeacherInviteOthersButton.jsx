import { useState } from "react";
import CopyConfirmPopup from "../ui/CopyConfirmPopup.jsx";
import { useT } from "../../lib/i18n/I18nProvider.jsx";
import { buildTeacherReferralInviteMessage } from "../../lib/site/public-site-origin.client.js";
import {
  COPY_INVITE_ERROR_MESSAGE_KEY,
  COPY_INVITE_SUCCESS_MESSAGE_KEY,
  copyTextToClipboard,
} from "../../lib/ui/copy-confirm-message.js";

/** Teacher dashboard — copy invite message + centered popup (same flow as parent dashboard). */
export default function TeacherInviteOthersButton({ bright = false }) {
  const t = useT();
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsError, setPopupIsError] = useState(false);

  const handleClick = async () => {
    const ok = await copyTextToClipboard(buildTeacherReferralInviteMessage(t));
    if (ok) {
      setPopupIsError(false);
      setPopupMessage(t(COPY_INVITE_SUCCESS_MESSAGE_KEY));
    } else {
      setPopupIsError(true);
      setPopupMessage(t(COPY_INVITE_ERROR_MESSAGE_KEY));
    }
    setPopupOpen(true);
  };

  return (
    <>
      <div className="flex flex-col items-center pt-2 md:pt-3">
        <button
          type="button"
          onClick={() => void handleClick()}
          className="inline-flex w-full max-w-sm items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-violet-600 to-amber-500 px-6 py-3.5 text-base font-bold text-white shadow-md shadow-indigo-900/30 transition hover:from-indigo-600 hover:via-violet-700 hover:to-amber-600 md:w-auto md:px-5 md:py-2.5 md:text-sm"
          data-testid="teacher-invite-others-btn"
        >
          {t("auth.teacherInviteOthers")}
        </button>
      </div>

      <CopyConfirmPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        message={popupMessage}
        isError={popupIsError}
        bright={bright}
        autoCloseMs={3000}
        zIndexClass="z-[170]"
        testId="teacher-invite-others-popup"
      />
    </>
  );
}
