import { useEffect, useMemo, useState } from "react";
import {
  initParentPwaInstallPromptCapture,
  isParentPwaInstalledStandalone,
  subscribeParentAppInstalled,
  useParentPwaInstallPromptAvailable,
  usePromptParentPwaInstall,
  wasParentAppInstalledEventFired,
  wasParentInstallPromptConsumed,
} from "../../lib/pwa/pwa-parent-install-prompt";
import { isCapacitorNative } from "../../lib/pwa/pwa-install-prompt";
import { logPwaInstallDiagnostics, logPwaInstallEvent } from "../../lib/pwa/pwa-install-debug";
import { getPwaInstallPageTheme } from "../../lib/pwa/pwa-install-page-theme.client.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/** Parent install page — explicit button only. Success only on appinstalled or standalone parent PWA. */
export default function ParentPwaInstallLauncher({ isBright = false }) {
  const t = useT();
  const T = useMemo(() => getPwaInstallPageTheme("parent", isBright).launcher, [isBright]);
  const hasNativePrompt = useParentPwaInstallPromptAvailable();
  const promptInstall = usePromptParentPwaInstall();
  const [runningStandalone, setRunningStandalone] = useState(false);
  const [installConfirmed, setInstallConfirmed] = useState(false);
  const [promptAccepted, setPromptAccepted] = useState(false);
  const [installUnavailable, setInstallUnavailable] = useState(false);
  const [unavailableReason, setUnavailableReason] = useState("");

  useEffect(() => {
    initParentPwaInstallPromptCapture();
    setRunningStandalone(isParentPwaInstalledStandalone());
    void logPwaInstallDiagnostics("parent");
    logPwaInstallEvent("parent:page-ready", {
      promptAvailable: Boolean(hasNativePrompt),
    });

    return subscribeParentAppInstalled(() => {
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

    logPwaInstallEvent("parent:install-click", {
      promptAvailable: hasNativePrompt,
      promptConsumed: wasParentInstallPromptConsumed(),
    });

    if (!hasNativePrompt) {
      if (wasParentInstallPromptConsumed()) {
        setUnavailableReason("consumed");
      } else {
        setUnavailableReason("no-prompt");
      }
      setInstallUnavailable(true);
      void logPwaInstallDiagnostics("parent");
      return;
    }

    try {
      const { outcome } = await promptInstall();
      logPwaInstallEvent("parent:after-prompt", {
        outcome,
        appinstalledFired: wasParentAppInstalledEventFired(),
      });

      if (outcome === "accepted") {
        if (wasParentAppInstalledEventFired() || isParentPwaInstalledStandalone()) {
          setInstallConfirmed(true);
        } else {
          setPromptAccepted(true);
        }
        void logPwaInstallDiagnostics("parent");
        return;
      }
    } catch (error) {
      console.error("[PWA parent] install prompt failed:", error);
      setUnavailableReason("error");
      setInstallUnavailable(true);
      void logPwaInstallDiagnostics("parent");
    }
  };

  if (isCapacitorNative()) {
    return <p className={T.nativeMsg}>{t("ui.pwa.nativeOnlyBrowser")}</p>;
  }

  if (runningStandalone || installConfirmed) {
    return <p className={T.successMsg}>{t("ui.pwa.installedParent")}</p>;
  }

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-4">
      <button type="button" onClick={handleInstallClick} className={T.installBtn}>
        {t("ui.pwa.installBtnParent")}
      </button>

      {promptAccepted ? <p className={T.infoMsg}>{t("ui.pwa.promptAcceptedParent")}</p> : null}

      {installUnavailable ? (
        <p className={T.warnMsg}>
          {unavailableReason === "consumed"
            ? t("ui.pwa.unavailableConsumed")
            : unavailableReason === "error"
              ? t("ui.pwa.unavailableError")
              : t("ui.pwa.unavailableNoPromptParent")}
        </p>
      ) : null}
    </div>
  );
}
