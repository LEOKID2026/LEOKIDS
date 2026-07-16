import { useEffect, useState } from "react";
import { isCapacitorNative, isPwaInstalledStandalone } from "../lib/pwa/pwa-install-prompt";
import {
  PARENT_PWA_INSTALL_PATH,
  STUDENT_PWA_INSTALL_PATH,
  TEACHER_PWA_INSTALL_PATH,
} from "../lib/pwa/pwa-install-mode";
import { useI18n, useT } from "../lib/i18n/I18nProvider.jsx";

export default function InstallAppChoiceButton({ className = "", buttonClassName = "" }) {
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const { direction, locale } = useI18n();
  const t = useT();

  useEffect(() => {
    if (!showChoiceModal) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [showChoiceModal]);

  if (isCapacitorNative() || isPwaInstalledStandalone()) {
    return null;
  }

  const defaultButtonClass =
    "inline-flex h-10 w-48 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 px-4 text-sm font-bold text-blue-800 shadow-md transition-all hover:from-yellow-400 hover:via-yellow-500 hover:to-yellow-600 hover:shadow-lg";

  return (
    <div className={className || "mt-6"}>
      <button
        onClick={() => setShowChoiceModal(true)}
        type="button"
        className={buttonClassName || defaultButtonClass}
      >
        <span>{t("ui.installApp.button")}</span>
      </button>

      {showChoiceModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-app-choice-title"
          onClick={() => setShowChoiceModal(false)}
        >
          <div
            className="relative w-full max-w-md rounded-xl border border-white/20 bg-black/85 p-5 text-start shadow-2xl"
            dir={direction}
            lang={locale}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h3 id="install-app-choice-title" className="text-lg font-bold text-white">
                {t("ui.installApp.chooseTitle")}
              </h3>
              <button
                type="button"
                onClick={() => setShowChoiceModal(false)}
                className="shrink-0 rounded-lg border border-white/20 px-2.5 py-1 text-sm font-semibold text-white/80"
                aria-label={t("common.close")}
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowChoiceModal(false);
                  window.location.href = STUDENT_PWA_INSTALL_PATH;
                }}
                className="flex w-full flex-col items-start gap-1 rounded-xl border border-amber-400/30 px-4 py-3 text-start"
              >
                <span className="text-base font-bold text-amber-200">{t("ui.installApp.kids")}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowChoiceModal(false);
                  window.location.href = PARENT_PWA_INSTALL_PATH;
                }}
                className="flex w-full flex-col items-start gap-1 rounded-xl border border-teal-400/30 px-4 py-3 text-start"
              >
                <span className="text-base font-bold text-teal-200">{t("ui.installApp.parents")}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowChoiceModal(false);
                  window.location.href = TEACHER_PWA_INSTALL_PATH;
                }}
                className="flex w-full flex-col items-start gap-1 rounded-xl border border-indigo-400/30 px-4 py-3 text-start"
              >
                <span className="text-base font-bold text-indigo-200">{t("ui.installApp.teachers")}</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
