import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { I18nProvider } from "../../lib/i18n/I18nProvider.jsx";
import {
  resolveDirection,
  resolveLocaleDefinition,
} from "../../lib/i18n/locale-registry.js";
import { resolveInterfaceLocale } from "../../lib/i18n/locale-resolution.js";
import { useParentMembershipLocale } from "../../hooks/useParentMembershipLocale.js";
import { useTeacherProfileLocale } from "../../hooks/useTeacherProfileLocale.js";

function isParentMembershipLocaleRoute(pathname) {
  const p = String(pathname || "");
  return (
    p.startsWith("/parent/") ||
    p.startsWith("/learning/parent-report") ||
    p === "/learning/parent-report-detailed"
  );
}

function isTeacherProfileLocaleRoute(pathname) {
  const p = String(pathname || "");
  return p.startsWith("/teacher/") || p.startsWith("/school/");
}

/**
 * Runtime locale shell: merges URL/cookie/profile sources and wires persistence hooks.
 * @param {{ pageProps: Record<string, unknown>, children: React.ReactNode }} props
 */
export default function AppLocaleShell({ pageProps, children }) {
  const router = useRouter();
  const pathname = router.pathname || "";

  const isParentRoute = isParentMembershipLocaleRoute(pathname);
  const isTeacherRoute = isTeacherProfileLocaleRoute(pathname);

  const parentLocale = useParentMembershipLocale({ enabled: isParentRoute });
  const teacherLocale = useTeacherProfileLocale({ enabled: isTeacherRoute });

  const profileInterfaceLocale = isParentRoute
    ? parentLocale.membershipInterfaceLanguage
    : isTeacherRoute
      ? teacherLocale.preferredLanguage
      : pageProps?.membershipInterfaceLanguage;

  const preferredReportLanguage = isParentRoute
    ? parentLocale.preferredReportLanguage
    : pageProps?.preferredReportLanguage;

  const onLocaleChange = isParentRoute
    ? parentLocale.onLocaleChange
    : isTeacherRoute
      ? teacherLocale.onLocaleChange
      : pageProps?.onLocaleChange;

  const locale = useMemo(() => {
    if (pageProps?.interfaceLocale) {
      return resolveLocaleDefinition(pageProps.interfaceLocale).id;
    }
    if (pageProps?.locale) return resolveLocaleDefinition(pageProps.locale).id;
    if (typeof document !== "undefined") {
      return resolveInterfaceLocale({
        asPath: router.asPath,
        pathname: router.pathname,
        query: router.query,
        cookieHeader: document.cookie,
        profileInterfaceLocale,
        hasExplicitUserChoice: Boolean(profileInterfaceLocale),
      });
    }
    return resolveInterfaceLocale({
      asPath: router.asPath,
      pathname: router.pathname,
      query: router.query,
      profileInterfaceLocale,
      acceptLanguage: pageProps?.acceptLanguage,
      hasExplicitUserChoice: Boolean(profileInterfaceLocale),
    });
  }, [
    pageProps?.interfaceLocale,
    pageProps?.locale,
    pageProps?.acceptLanguage,
    profileInterfaceLocale,
    router.asPath,
    router.pathname,
    router.query,
  ]);

  const direction = resolveDirection(locale);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return (
    <I18nProvider
      locale={locale}
      reportLocale={preferredReportLanguage}
      onLocaleChange={onLocaleChange}
    >
      {children}
    </I18nProvider>
  );
}
