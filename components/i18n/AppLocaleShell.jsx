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
import { useStudentSessionLocale } from "../../hooks/useStudentSessionLocale.js";

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

function isStudentLocaleRoute(pathname) {
  const p = String(pathname || "");
  return p.startsWith("/student/") || p.startsWith("/learning/");
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
  // Parent/teacher take precedence when paths overlap; student covers remaining student/learning UI.
  const isStudentRoute = !isParentRoute && !isTeacherRoute && isStudentLocaleRoute(pathname);

  const parentLocale = useParentMembershipLocale({ enabled: isParentRoute });
  const teacherLocale = useTeacherProfileLocale({ enabled: isTeacherRoute });
  const studentLocale = useStudentSessionLocale({ enabled: isStudentRoute });

  const profileInterfaceLocale = isParentRoute
    ? parentLocale.membershipInterfaceLanguage
    : isTeacherRoute
      ? teacherLocale.preferredLanguage
      : isStudentRoute
        ? studentLocale.interfaceLanguage
        : pageProps?.membershipInterfaceLanguage;

  const preferredReportLanguage = isParentRoute
    ? parentLocale.preferredReportLanguage
    : pageProps?.preferredReportLanguage;

  const onLocaleChange = isParentRoute
    ? parentLocale.onLocaleChange
    : isTeacherRoute
      ? teacherLocale.onLocaleChange
      : isStudentRoute
        ? studentLocale.onLocaleChange
        : pageProps?.onLocaleChange;

  const locale = useMemo(() => {
    // On the client, resolve from live URL + cookie + profile. Do not trust
    // pageProps.interfaceLocale alone — client getInitialProps often lacks req
    // cookies and would force English after a bare-path navigation.
    if (typeof document !== "undefined") {
      const hasCookie = /(?:^|;\s*)lk_global_locale=/.test(document.cookie || "");
      return resolveInterfaceLocale({
        asPath: typeof window !== "undefined" ? window.location.pathname : router.asPath,
        pathname: router.pathname,
        query: router.query,
        cookieHeader: document.cookie,
        profileInterfaceLocale,
        hasExplicitUserChoice: Boolean(profileInterfaceLocale) || hasCookie,
      });
    }
    if (pageProps?.interfaceLocale) {
      return resolveLocaleDefinition(pageProps.interfaceLocale).id;
    }
    if (pageProps?.locale) return resolveLocaleDefinition(pageProps.locale).id;
    return resolveInterfaceLocale({
      asPath: router.asPath,
      pathname: router.pathname,
      query: router.query,
      profileInterfaceLocale,
      hasExplicitUserChoice: Boolean(profileInterfaceLocale),
    });
  }, [
    pageProps?.interfaceLocale,
    pageProps?.locale,
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
    document.documentElement.setAttribute("data-locale", locale);
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
