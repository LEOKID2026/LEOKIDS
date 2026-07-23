import { globalBurnDownCopy } from "../lib/i18n/global-burn-down-copy.js";
import "../styles/globals.css";
import "../styles/worksheet-print.css";
import "../styles/worksheet-writing-print.css";
import "../styles/worksheet-writing-print-portrait.css";
import "../styles/worksheet-writing-print-landscape.css";
import "../styles/worksheet-coloring-print.css";
import "../styles/worksheet-coloring-upload-print.css";
import "../styles/worksheet-coloring-upload.css";
import "../styles/worksheet-hub.css";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/next";
import OfflineIndicator from "../components/OfflineIndicator";
import StudentAccessGate from "../components/student/StudentAccessGate";
import DevServiceWorkerCleanup from "../components/dev/DevServiceWorkerCleanup";
import DevPrototypeAdminGate from "../components/admin/DevPrototypeAdminGate";
import { useIOSViewportFix } from "../hooks/useIOSViewportFix";
import { initPwaInstallPromptCapture } from "../lib/pwa/pwa-install-prompt";
import { initParentPwaInstallPromptCapture } from "../lib/pwa/pwa-parent-install-prompt";
import { initTeacherPwaInstallPromptCapture } from "../lib/pwa/pwa-teacher-install-prompt";
import { resolvePwaManifestHref, resolvePwaPortal } from "../lib/pwa/resolve-pwa-manifest";
import { StudentThemeProvider } from "../contexts/StudentThemeContext.jsx";
import GameAudioProvider from "../lib/game-audio/GameAudioProvider.jsx";
import BrowserThemeColorSync from "../components/BrowserThemeColorSync.jsx";
import CookieConsentManager from "../components/consent/CookieConsentManager.jsx";
import { GOOGLE_CONSENT_BOOTSTRAP_SCRIPT } from "../lib/consent/google-consent-mode.client.js";
import { isStudentProtectedRoute, isDemoAccessibleRoute } from "../lib/student-ui/student-protected-routes.client.js";
import DemoAccessGate from "../components/demo/DemoAccessGate.jsx";
import ParentDemoSessionChrome from "../components/demo/ParentDemoSessionChrome.jsx";
import ParentDemoParentRouteGuard from "../components/demo/ParentDemoParentRouteGuard.jsx";
import { hasDemoSession } from "../lib/demo/demo-mode.client.js";
import { hasParentDemoSession } from "../lib/demo/parent-demo-mode.client.js";
import {
  isParentDemoAccessibleRoute,
  isParentDemoGateRoute,
} from "../lib/demo/parent-demo-routes.client.js";
import {
  BROWSER_THEME_COLOR_BRIGHT,
  BROWSER_THEME_COLOR_BOOTSTRAP_SCRIPT,
} from "../lib/student-ui/browser-theme-color.client.js";
import AppLocaleShell from "../components/i18n/AppLocaleShell.jsx";
import {
  resolveLocaleDefinition,
} from "../lib/i18n/locale-registry.js";
import { resolveInterfaceLocale } from "../lib/i18n/locale-resolution.js";
import { readRequestInterfaceLocale } from "../lib/i18n/read-request-interface-locale.server.js";

const UUID_PATH_SEGMENT_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const LEO_NUMBER_PATH_SEGMENT_RE = /^\d{8}$/;

/**
 * Privacy filter for Vercel Web Analytics pageviews only.
 * Strips query/hash, drops OAuth/token routes, redacts id-like path segments.
 * Never attaches custom events or user PII.
 */
function vercelAnalyticsBeforeSend(event) {
  if (!event || typeof event.url !== "string") return null;

  let url;
  try {
    url = new URL(event.url);
  } catch {
    return null;
  }

  const pathname = String(url.pathname || "").toLowerCase();
  const pathSegments = pathname.split("/").filter(Boolean);
  const isOauthCallbackPath =
    pathname.includes("google-callback") ||
    pathname.includes("/oauth") ||
    pathname.endsWith("/auth/callback") ||
    pathname.includes("/auth/callback/");
  const pathHasTokenOrCode = pathSegments.some(
    (seg) => seg === "token" || seg === "code" || seg.startsWith("token.") || seg.startsWith("code."),
  );
  if (isOauthCallbackPath || pathHasTokenOrCode) {
    return null;
  }

  url.search = "";
  url.hash = "";
  url.pathname = url.pathname
    .split("/")
    .map((segment) => {
      if (!segment) return segment;
      if (UUID_PATH_SEGMENT_RE.test(segment)) return "[id]";
      if (LEO_NUMBER_PATH_SEGMENT_RE.test(segment)) return "[leo]";
      if (segment.includes("@")) return "[redacted]";
      return segment;
    })
    .join("/");

  return {
    ...event,
    url: url.toString(),
  };
}

if (typeof window !== "undefined") {
  initParentPwaInstallPromptCapture();
  initTeacherPwaInstallPromptCapture();
  if (window.location.pathname === "/student/install-app" || window.location.pathname === "/kids") {
    initPwaInstallPromptCapture();
  }

  // One-time cleanup of temporary PWA diagnosis keys written during debugging.
  try { localStorage.removeItem("offline_game_err_log"); } catch {}
}

/** Internal dev tools — admin-only via DevPrototypeAdminGate in render. */
function pathnameIsInternalDevRoute(pathname) {
  const p = pathname || "";
  return (
    p.startsWith("/dev/") ||
    p.startsWith("/learning/dev/") ||
    p === "/learning/dev-student-simulator" ||
    p === "/learning/dev-db-report-preview"
  );
}

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useIOSViewportFix();

  useEffect(() => {
    initParentPwaInstallPromptCapture();
    initTeacherPwaInstallPromptCapture();
    if (router.pathname === "/student/install-app" || router.pathname === "/kids") {
      initPwaInstallPromptCapture();
    }
  }, [router.pathname]);

  const swRegisteredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return undefined;
    }

    // ×‘×¤×™×ª×•×—: ×¨××” DevServiceWorkerCleanup â€” ×œ× ×¨×•×©×ž×™× SW; ×ž× ×§×™× ×¨×™×©×•×ž×™× ×• Cache Storage.
    if (process.env.NODE_ENV === "development") {
      return undefined;
    }

    const isCapacitorNative =
      typeof window !== "undefined" &&
      window.Capacitor?.isNativePlatform?.();

    // Capacitor APK WebView: skip SW so deploys load fresh /_next/static (no cache-first).
    // Browser/PWA keep normal offline SW registration below.
    if (isCapacitorNative) {
      let cancelled = false;

      (async () => {
        try {
          const regs = await navigator.serviceWorker.getRegistrations();
          await Promise.all(regs.map((r) => r.unregister()));

          if (cancelled || !("caches" in window)) return;
          const keys = await caches.keys();
          await Promise.all(keys.map((key) => caches.delete(key)));
        } catch (e) {
          console.warn("[SW] Capacitor native cleanup:", e);
        }
      })();

      swRegisteredRef.current = true;
      return () => {
        cancelled = true;
      };
    }

    if (swRegisteredRef.current) {
      return undefined;
    }

    const pathname = window.location.pathname || "";
    const isParentRoute = pathname.startsWith("/parent/");
    const isStudentRoute = pathname.startsWith("/student/");
    const isTeacherRoute = pathname.startsWith("/teacher/");

    const registerSW = () => {
      swRegisteredRef.current = true;
      if (isParentRoute) {
        navigator.serviceWorker
          .register("/parent/sw.js", { scope: "/parent/" })
          .then((registration) => {
            console.log("[SW parent] Registered:", registration.scope);
          })
          .catch((registrationError) => {
            console.error("[SW parent] Registration failed:", registrationError);
          });
        return;
      }

      if (isStudentRoute) {
        navigator.serviceWorker
          .register("/student/sw.js", { scope: "/student/" })
          .then((registration) => {
            console.log("[SW student] Registered:", registration.scope);
          })
          .catch((registrationError) => {
            console.error("[SW student] Registration failed:", registrationError);
          });
        return;
      }

      if (isTeacherRoute) {
        navigator.serviceWorker
          .register("/teacher/sw.js", { scope: "/teacher/" })
          .then((registration) => {
            console.log("[SW teacher] Registered:", registration.scope);
          })
          .catch((registrationError) => {
            console.error("[SW teacher] Registration failed:", registrationError);
          });
        return;
      }

        navigator.serviceWorker
          .register("/sw.js", { scope: "/" })
          .then((registration) => {
            console.log("[SW] Registered successfully:", registration.scope);
            
            // Pre-cache ×“×¤×™× ×—×©×•×‘×™× ××—×¨×™ ×©×”×“×£ × ×˜×¢×Ÿ (×¨×§ ×‘×ž×¦×‘ online)
            if (registration.active && navigator.onLine) {
              // ×”×ž×ª×™×Ÿ ×©×”×“×£ × ×˜×¢×Ÿ ×œ×’×ž×¨×™ ×œ×¤× ×™ pre-caching
              setTimeout(() => {
                const essentialPages = [
                  '/',
                  '/game',
                  '/learning',
                ];
                registration.active.postMessage({
                  type: 'PRE_CACHE_PAGES',
                  pages: essentialPages
                });
                console.log('[App] Sent pre-cache request for essential pages');
              }, 3000);
            }
            
            // Pre-cache ×”×“×£ ×”× ×•×›×—×™
            if (registration.active && navigator.onLine) {
              setTimeout(() => {
                const currentPath = window.location.pathname;
                if (currentPath && currentPath !== '/') {
                  registration.active.postMessage({
                    type: 'PRE_CACHE_PAGES',
                    pages: [currentPath]
                  });
                }
              }, 4000);
            }
            
            // ×‘×“×™×§×” ×œ×¢×“×›×•× ×™× ×›×œ ×©×¢×”
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000);
            
            // ×˜×™×¤×•×œ ×‘×¢×“×›×•× ×™×
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Service Worker ×—×“×© ×–×ž×™×Ÿ - ××¤×©×¨ ×œ×”×¦×™×¢ ×¨×¢× ×•×Ÿ (×œ× ××•×˜×•×ž×˜×™)
                  console.log("[SW] New service worker available");
                }
              });
            });
          })
          .catch((registrationError) => {
            console.error("[SW] Registration failed:", registrationError);
          });
    };

    if (document.readyState === "complete") {
      registerSW();
      return;
    }

    window.addEventListener("load", registerSW);
    return () => window.removeEventListener("load", registerSW);
  }, []);

  const pathname = router.pathname || "";
  const shouldGate = isStudentProtectedRoute(pathname);
  const shouldParentDemoGate = isParentDemoGateRoute(pathname);
  const [gateKind, setGateKind] = useState(() => (shouldGate ? "student" : "none"));
  const [parentGateKind, setParentGateKind] = useState("none");
  const [parentDemoSessionActive, setParentDemoSessionActive] = useState(false);

  useEffect(() => {
    if (!shouldGate) {
      setGateKind("none");
    } else if (hasDemoSession() && isDemoAccessibleRoute(pathname)) {
      setGateKind("demo");
    } else {
      setGateKind("student");
    }
  }, [pathname, shouldGate]);

  useEffect(() => {
    if (!shouldParentDemoGate) {
      setParentGateKind("none");
      return;
    }
    if (hasParentDemoSession() && isParentDemoAccessibleRoute(pathname)) {
      setParentGateKind("parentDemo");
    } else if (hasParentDemoSession()) {
      setParentGateKind("parentDemoRedirect");
    } else {
      setParentGateKind("none");
    }
  }, [pathname, shouldParentDemoGate]);

  useEffect(() => {
    setParentDemoSessionActive(hasParentDemoSession());
  }, [pathname]);

  const isInternalDevRoute = pathnameIsInternalDevRoute(pathname);
  const pwaPortal = resolvePwaPortal(pathname);
  const manifestHref = resolvePwaManifestHref(pathname);
  const isStudentPwaInstallMode = pwaPortal === "student";
  const isParentPwaInstallMode = pwaPortal === "parent";
  const isTeacherPwaInstallMode = pwaPortal === "teacher";

  return (
    <>
      {process.env.NODE_ENV !== "production" ? <DevServiceWorkerCleanup /> : null}
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta
          name="description"
          content={globalBurnDownCopy("lib__site__public-page-seo", "leo_kids_learning_games_and_progress_tracking_for_kids")}
        />
        {isStudentPwaInstallMode ? (
          <>
            <meta name="theme-color" content={BROWSER_THEME_COLOR_BRIGHT} />
            <meta name="apple-mobile-web-app-title" content="LEO KIDS" />
            <meta name="msapplication-TileColor" content={BROWSER_THEME_COLOR_BRIGHT} />
            <meta name="msapplication-TileImage" content="/icons/child/mstile-150x150.png" />
          </>
        ) : isParentPwaInstallMode ? (
          <>
            <meta name="theme-color" content="#0d9488" />
            <meta name="apple-mobile-web-app-title" content="P LEO KIDS" />
            <meta name="msapplication-TileColor" content="#0d9488" />
            <meta name="msapplication-TileImage" content="/icons/parent/mstile-150x150.png" />
          </>
        ) : isTeacherPwaInstallMode ? (
          <>
            <meta name="theme-color" content="#4338ca" />
            <meta name="apple-mobile-web-app-title" content="T LEO KIDS" />
            <meta name="msapplication-TileColor" content="#4338ca" />
            <meta name="msapplication-TileImage" content="/icons/teacher/mstile-150x150.png" />
          </>
        ) : (
          <>
            <meta name="theme-color" content={BROWSER_THEME_COLOR_BRIGHT} />
            <meta name="apple-mobile-web-app-title" content="LEO KIDS" />
            <meta name="msapplication-TileColor" content={BROWSER_THEME_COLOR_BRIGHT} />
          </>
        )}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script dangerouslySetInnerHTML={{ __html: BROWSER_THEME_COLOR_BOOTSTRAP_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: GOOGLE_CONSENT_BOOTSTRAP_SCRIPT }} />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {isStudentPwaInstallMode ? (
          <>
            <link rel="icon" href="/icons/child/favicon.ico" sizes="any" />
            <link rel="icon" type="image/png" sizes="48x48" href="/icons/child/favicon-48x48.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/icons/child/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/child/favicon-16x16.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/icons/child/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="192x192" href="/icons/child/android-chrome-192x192.png" />
            <link rel="icon" type="image/png" sizes="512x512" href="/icons/child/android-chrome-512x512.png" />
          </>
        ) : isParentPwaInstallMode ? (
          <>
            <link rel="icon" href="/icons/parent/favicon.ico" sizes="any" />
            <link rel="icon" type="image/png" sizes="48x48" href="/icons/parent/favicon-48x48.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/icons/parent/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/parent/favicon-16x16.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/icons/parent/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="192x192" href="/icons/parent/android-chrome-192x192.png" />
            <link rel="icon" type="image/png" sizes="512x512" href="/icons/parent/android-chrome-512x512.png" />
          </>
        ) : isTeacherPwaInstallMode ? (
          <>
            <link rel="icon" href="/icons/teacher/favicon.ico" sizes="any" />
            <link rel="icon" type="image/png" sizes="48x48" href="/icons/teacher/favicon-48x48.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/icons/teacher/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/teacher/favicon-16x16.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/icons/teacher/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="192x192" href="/icons/teacher/android-chrome-192x192.png" />
            <link rel="icon" type="image/png" sizes="512x512" href="/icons/teacher/android-chrome-512x512.png" />
          </>
        ) : (
          <>
            <link rel="icon" href="/icons/child/favicon.ico" sizes="any" />
            <link rel="icon" type="image/png" sizes="48x48" href="/icons/child/favicon-48x48.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/icons/child/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/icons/child/favicon-16x16.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/icons/child/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="192x192" href="/icons/child/android-chrome-192x192.png" />
            <link rel="icon" type="image/png" sizes="512x512" href="/icons/child/android-chrome-512x512.png" />
          </>
        )}

        {manifestHref ? (
          <link key="app-manifest" rel="manifest" href={manifestHref} />
        ) : null}
        
        <title>{globalBurnDownCopy("pages___app", "default_document_title")}</title>
      </Head>
      <AppLocaleShell pageProps={pageProps}>
      <OfflineIndicator />
      <CookieConsentManager />
      <StudentThemeProvider>
        <GameAudioProvider>
        <BrowserThemeColorSync />
        {(() => {
          const pageTree = isInternalDevRoute ? (
            <DevPrototypeAdminGate>
              <Component {...pageProps} />
            </DevPrototypeAdminGate>
          ) : parentGateKind === "parentDemo" || parentGateKind === "parentDemoRedirect" ? (
            <ParentDemoParentRouteGuard>
              <Component {...pageProps} />
            </ParentDemoParentRouteGuard>
          ) : gateKind === "demo" ? (
            <DemoAccessGate>
              <Component {...pageProps} />
            </DemoAccessGate>
          ) : gateKind === "student" ? (
            <StudentAccessGate>
              <Component {...pageProps} />
            </StudentAccessGate>
          ) : (
            <Component {...pageProps} />
          );

          return parentDemoSessionActive ? (
            <ParentDemoSessionChrome>{pageTree}</ParentDemoSessionChrome>
          ) : (
            pageTree
          );
        })()}
        </GameAudioProvider>
      </StudentThemeProvider>
      </AppLocaleShell>
      <Analytics beforeSend={vercelAnalyticsBeforeSend} />
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const { ctx, App: NextApp } = appContext;
  /** @type {{ pageProps?: Record<string, unknown> }} */
  let appProps = { pageProps: {} };
  if (NextApp && typeof NextApp.getInitialProps === "function") {
    appProps = await NextApp.getInitialProps(appContext);
  }
  if (!appProps.pageProps) appProps.pageProps = {};

  const req = ctx.req;
  const headerLocale = readRequestInterfaceLocale(req, ctx.asPath || ctx.pathname || "/");
  const cookieHeader = req?.headers?.cookie;
  const acceptLanguage = req?.headers?.["accept-language"];

  const interfaceLocale = resolveInterfaceLocale({
    asPath: ctx.asPath || ctx.pathname || "/",
    pathname: ctx.pathname,
    query: ctx.query,
    cookieHeader: typeof cookieHeader === "string" ? cookieHeader : undefined,
    acceptLanguage: typeof acceptLanguage === "string" ? acceptLanguage : undefined,
    profileInterfaceLocale: appProps.pageProps?.membershipInterfaceLanguage,
    hasExplicitUserChoice: Boolean(appProps.pageProps?.membershipInterfaceLanguage),
  });

  if (typeof headerLocale === "string" && headerLocale) {
    appProps.pageProps = {
      ...appProps.pageProps,
      interfaceLocale: resolveLocaleDefinition(headerLocale).id,
    };
  } else {
    appProps.pageProps = {
      ...appProps.pageProps,
      interfaceLocale,
    };
  }

  if (acceptLanguage) {
    appProps.pageProps = {
      ...appProps.pageProps,
      acceptLanguage,
    };
  }

  return appProps;
};
