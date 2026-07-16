import { useEffect, useMemo, useState } from "react";
import {
  initPwaInstallPromptCapture,
  isStudentPwaInstalledStandalone,
  subscribeStudentAppInstalled,
  usePwaInstallPromptAvailable,
  usePromptPwaInstall,
  wasStudentAppInstalledEventFired,
  wasStudentInstallPromptConsumed,
} from "../../lib/pwa/pwa-install-prompt";
import { isCapacitorNative } from "../../lib/pwa/pwa-install-prompt";
import { logPwaInstallDiagnostics, logPwaInstallEvent } from "../../lib/pwa/pwa-install-debug";
import { getPwaInstallPageTheme } from "../../lib/pwa/pwa-install-page-theme.client.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/** Student install page — explicit button; success only on appinstalled or standalone student PWA. */
export default function StudentPwaInstallLauncher({ isBright = false }) {
  const t = useT();
  const T = useMemo(() => getPwaInstallPageTheme("student", isBright).launcher, [isBright]);
  const hasNativePrompt = usePwaInstallPromptAvailable();
  const promptInstall = usePromptPwaInstall();
  const [runningStandalone, setRunningStandalone] = useState(false);
  const [installConfirmed, setInstallConfirmed] = useState(false);
  const [promptAccepted, setPromptAccepted] = useState(false);
  const [installUnavailable, setInstallUnavailable] = useState(false);
  const [unavailableReason, setUnavailableReason] = useState("");

  useEffect(() => {
    initPwaInstallPromptCapture();
    setRunningStandalone(isStudentPwaInstalledStandalone());
    void logPwaInstallDiagnostics("student");
    logPwaInstallEvent("student:page-ready", {
      promptAvailable: Boolean(hasNativePrompt),
    });

    return subscribeStudentAppInstalled(() => {
      setInstallConfirmed(true);
      setPromptAccepted(false);
      setInstallUnavailable(false);
      setUnavailableReason("");
    });
  }, [hasNativePrompt]);

  const handleInstallClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setInstallUnavailable(false);
    setUnavailableReason("");
    setPromptAccepted(false);

    logPwaInstallEvent("student:install-click", {
      promptAvailable: hasNativePrompt,
      promptConsumed: wasStudentInstallPromptConsumed(),
    });

    if (!hasNativePrompt) {
      if (wasStudentInstallPromptConsumed()) {
        setUnavailableReason("consumed");
      } else {
        setUnavailableReason("no-prompt");
      }
      setInstallUnavailable(true);
      void logPwaInstallDiagnostics("student");
      return;
    }

    try {
      const { outcome } = await promptInstall();
      logPwaInstallEvent("student:after-prompt", {
        outcome,
        appinstalledFired: wasStudentAppInstalledEventFired(),
      });

      if (outcome === "accepted") {
        if (wasStudentAppInstalledEventFired() || isStudentPwaInstalledStandalone()) {
          setInstallConfirmed(true);
        } else {
          setPromptAccepted(true);
        }
        void logPwaInstallDiagnostics("student");
      }
    } catch (error) {
      console.error("[PWA student] install prompt failed:", error);
      setUnavailableReason("error");
      setInstallUnavailable(true);
      void logPwaInstallDiagnostics("student");
    }
  };

  if (isCapacitorNative()) {
    return <p className={T.nativeMsg}>{t("ui.pwa.nativeOnlyBrowser")}</p>;
  }

  if (runningStandalone || installConfirmed) {
    return <p className={T.successMsg}>{t("ui.pwa.installedStudent")}</p>;
  }

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <button type="button" onClick={handleInstallClick} className={T.installBtn}>
        {t("ui.pwa.installBtnStudent")}
      </button>

      {promptAccepted ? <p className={T.infoMsg}>{t("ui.pwa.promptAcceptedStudent")}</p> : null}

      {installUnavailable ? (
        <p className={T.warnMsg}>
          {unavailableReason === "consumed"
            ? t("ui.pwa.unavailableConsumed")
            : unavailableReason === "error"
              ? t("ui.pwa.unavailableError")
              : t("ui.pwa.unavailableNoPromptStudent")}
        </p>
      ) : null}
    </div>
  );
}
