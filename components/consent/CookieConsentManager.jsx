import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  acceptAllConsent,
  rejectAllConsent,
  saveConsentChoice,
  readStoredConsent,
} from "../../lib/consent/consent-storage.client.js";
import { shouldDeferCookieConsentBanner } from "../../lib/consent/consent-banner-policy.client.js";
import { applyGoogleConsentFromStorage } from "../../lib/consent/google-consent-mode.client.js";
import { maybeLoadGoogleAdsScripts } from "../../lib/consent/google-ads-loader.client.js";
import { useConsentState } from "../../hooks/useConsentState.js";
import { useI18n, useT } from "../../lib/i18n/I18nProvider.jsx";

function syncConsentSideEffects() {
  applyGoogleConsentFromStorage();
  maybeLoadGoogleAdsScripts();
}

/**
 * @param {{ onSaved?: () => void; initialAds?: boolean; initialAnalytics?: boolean }} props
 */
function CookieConsentPreferencesPanel({ onSaved, initialAds = false, initialAnalytics = false }) {
  const { direction, locale } = useI18n();
  const t = useT();
  const [ads, setAds] = useState(initialAds);
  const [analytics, setAnalytics] = useState(initialAnalytics);

  useEffect(() => {
    setAds(initialAds);
    setAnalytics(initialAnalytics);
  }, [initialAds, initialAnalytics]);

  const persistCustom = () => {
    saveConsentChoice({
      choice: "custom",
      ads,
      analytics,
      source: "preferences",
    });
    syncConsentSideEffects();
    onSaved?.();
  };

  return (
    <div
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-lg text-start space-y-4"
      dir={direction}
      lang={locale}
      role="dialog"
      aria-labelledby="consent-preferences-title"
    >
      <h2 id="consent-preferences-title" className="text-base font-bold text-slate-900">
        {t("legal.cookiePrefsTitle")}
      </h2>
      <p className="text-sm text-slate-600 leading-relaxed">{t("legal.cookiePrefsBody")}</p>
      <label className="flex items-start justify-between gap-3 text-sm text-slate-800">
        <span>
          <span className="font-semibold block">{t("legal.cookieAdsLabel")}</span>
          <span className="text-slate-500 text-xs">{t("legal.cookieAdsHelp")}</span>
        </span>
        <input
          type="checkbox"
          checked={ads}
          onChange={(e) => setAds(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0"
        />
      </label>
      <label className="flex items-start justify-between gap-3 text-sm text-slate-800">
        <span>
          <span className="font-semibold block">{t("legal.cookieAnalyticsLabel")}</span>
          <span className="text-slate-500 text-xs">{t("legal.cookieAnalyticsHelp")}</span>
        </span>
        <input
          type="checkbox"
          checked={analytics}
          onChange={(e) => setAnalytics(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0"
        />
      </label>
      <div className="flex flex-wrap gap-2 justify-end">
        <button
          type="button"
          onClick={persistCustom}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
        >
          {t("legal.cookieSavePrefs")}
        </button>
      </div>
    </div>
  );
}

export default function CookieConsentManager() {
  const router = useRouter();
  const { direction, locale } = useI18n();
  const t = useT();
  const { ready, decided } = useConsentState();
  const [showPreferences, setShowPreferences] = useState(false);
  const [prefsOnlyOpen, setPrefsOnlyOpen] = useState(false);

  const legalLinks = [
    { href: "/privacy", label: t("legal.privacyLink") },
    { href: "/legal", label: t("legal.legalHubLink") },
    { href: "/data-deletion", label: t("legal.dataDeletionLink") },
  ];

  const pathname = router.pathname || "";
  const deferred = shouldDeferCookieConsentBanner(pathname);
  const showBanner = ready && !decided && !deferred;

  useEffect(() => {
    const onOpenPrefs = () => {
      setPrefsOnlyOpen(true);
      setShowPreferences(true);
    };
    window.addEventListener("leokids:open-consent-preferences", onOpenPrefs);
    return () => window.removeEventListener("leokids:open-consent-preferences", onOpenPrefs);
  }, []);

  useEffect(() => {
    if (!ready) return;
    syncConsentSideEffects();
  }, [ready, decided]);

  useEffect(() => {
    if (!showBanner) {
      document.body.classList.remove("leokids-consent-banner-open");
      return undefined;
    }
    document.body.classList.add("leokids-consent-banner-open");
    return () => document.body.classList.remove("leokids-consent-banner-open");
  }, [showBanner]);

  const stored = readStoredConsent();
  const initialAds = stored?.ads === true;
  const initialAnalytics = stored?.analytics === true;

  const closePreferences = () => {
    setShowPreferences(false);
    setPrefsOnlyOpen(false);
  };

  const handleAccept = () => {
    acceptAllConsent("banner");
    syncConsentSideEffects();
    setShowPreferences(false);
  };

  const handleReject = () => {
    rejectAllConsent("banner");
    syncConsentSideEffects();
    setShowPreferences(false);
  };

  if (prefsOnlyOpen && !showBanner) {
    return (
      <div
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/40"
        dir={direction}
        lang={locale}
      >
        <div className="w-full max-w-md pointer-events-auto">
          <CookieConsentPreferencesPanel
            initialAds={initialAds}
            initialAnalytics={initialAnalytics}
            onSaved={closePreferences}
          />
          <button
            type="button"
            className="mt-2 w-full text-center text-sm text-white/90 underline"
            onClick={closePreferences}
          >
            {t("legal.cookieClose")}
          </button>
        </div>
      </div>
    );
  }

  if (!showBanner) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[55] pointer-events-none"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      dir={direction}
      lang={locale}
    >
      <div className="pointer-events-auto mx-auto max-w-3xl px-3 pb-3">
        {showPreferences ? (
          <CookieConsentPreferencesPanel
            initialAds={initialAds}
            initialAnalytics={initialAnalytics}
            onSaved={() => setShowPreferences(false)}
          />
        ) : (
          <aside
            role="dialog"
            aria-labelledby="cookie-consent-title"
            className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur shadow-xl p-4 text-start space-y-3"
          >
            <h2 id="cookie-consent-title" className="text-sm font-bold text-slate-900">
              {t("legal.cookieBannerTitle")}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{t("legal.cookieBannerBody")}</p>
            <p className="text-[11px] text-slate-500">
              {legalLinks.map((link, i) => (
                <span key={link.href}>
                  {i > 0 ? " · " : null}
                  <Link href={link.href} className="underline hover:text-slate-700">
                    {link.label}
                  </Link>
                </span>
              ))}
            </p>
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                type="button"
                onClick={handleReject}
                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
              >
                {t("legal.cookieReject")}
              </button>
              <button
                type="button"
                onClick={() => setShowPreferences(true)}
                className="px-3 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50"
              >
                {t("legal.cookieManage")}
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700"
              >
                {t("legal.cookieAccept")}
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
