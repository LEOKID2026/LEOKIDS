import { useState } from "react";
import CopyConfirmPopup from "../ui/CopyConfirmPopup.jsx";
import { useStudentTheme } from "../../contexts/StudentThemeContext.jsx";
import { useT } from "../../lib/i18n/I18nProvider.jsx";
import {
  COPY_LEO_NUMBER_ERROR_MESSAGE_KEY,
  COPY_LEO_NUMBER_SUCCESS_MESSAGE_KEY,
  copyTextToClipboard,
} from "../../lib/ui/copy-confirm-message.js";

/** Student home — tap Leo number chip to copy digits only + centered popup. */
export default function StudentCopyLeoNumberChip({
  leoNumber = "",
  label = "",
  className = "",
}) {
  const { isBright } = useStudentTheme();
  const t = useT();
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupIsError, setPopupIsError] = useState(false);

  const handleClick = async () => {
    const num = String(leoNumber || "").trim();
    if (!num) return;

    const ok = await copyTextToClipboard(num);
    if (ok) {
      setPopupIsError(false);
      setPopupMessage(t(COPY_LEO_NUMBER_SUCCESS_MESSAGE_KEY));
    } else {
      setPopupIsError(true);
      setPopupMessage(t(COPY_LEO_NUMBER_ERROR_MESSAGE_KEY));
    }
    setPopupOpen(true);
  };

  if (!label) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => void handleClick()}
        className={className}
        data-testid="student-copy-leo-number-chip"
        aria-label={t("ui.student.copyLeoNumberAria")}
      >
        {label}
      </button>

      <CopyConfirmPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        message={popupMessage}
        isError={popupIsError}
        bright={isBright}
        autoCloseMs={5000}
        testId="student-copy-leo-number-popup"
      />
    </>
  );
}
