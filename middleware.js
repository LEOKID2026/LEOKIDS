import { NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  LOCALE_REQUEST_HEADER,
  resolveLocaleDefinition,
} from "./lib/i18n/locale-registry.js";
import {
  isLocaleRoutingExcluded,
  shouldRedirectPrefixedDefaultLocale,
  shouldRedirectToPublicLocalePrefix,
  stripLocaleFromPath,
  withLocalePath,
} from "./lib/i18n/locale-path.js";
import { setLocaleCookieOnResponse } from "./lib/i18n/locale-cookie.js";

/**
 * Forward interface locale on the rewritten/next request.
 * Next.js Pages `_document` reliably sees Cookie + x-lk-interface-locale for `next()`,
 * but rewrite can drop custom headers — so we also inject the locale cookie onto the
 * request Cookie header for the same request (response Set-Cookie alone is too late).
 *
 * @param {import('next/server').NextRequest} request
 * @param {string} localeId
 * @param {{ fromLocalePrefix?: boolean }} [opts]
 */
function withInterfaceLocaleRequestHeaders(request, localeId, opts = {}) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_REQUEST_HEADER, localeId);

  const existing = requestHeaders.get("cookie") || "";
  const parts = existing
    .split(";")
    .map((p) => p.trim())
    .filter((p) => p && !p.toLowerCase().startsWith(`${LOCALE_COOKIE_NAME.toLowerCase()}=`));
  parts.push(`${LOCALE_COOKIE_NAME}=${encodeURIComponent(localeId)}`);
  requestHeaders.set("cookie", parts.join("; "));

  // Prevent cookie→prefix redirect from looping when this request is the internal
  // rewrite target of /{locale}/path → /path.
  if (opts.fromLocalePrefix) {
    requestHeaders.set("x-lk-locale-prefix-rewrite", "1");
  }

  return requestHeaders;
}

/**
 * Global middleware:
 * 1. Strip legacy `.he` suffix (Israeli archive paths)
 * 2. Locale prefix routing — rewrite non-default locales, redirect /en/*
 */
export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (isLocaleRoutingExcluded(pathname)) {
    return NextResponse.next();
  }

  const heMatch = pathname.match(/^(.+)\.he(\/.*)?$/);
  if (heMatch) {
    const target = `${heMatch[1]}${heMatch[2] || ""}` || "/";
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 308);
  }

  if (pathname === "/sw.he.js") {
    return new NextResponse("Not Found", { status: 404 });
  }

  const parsed = stripLocaleFromPath(pathname);

  if (parsed.locale && shouldRedirectPrefixedDefaultLocale(parsed.locale)) {
    const url = request.nextUrl.clone();
    url.pathname = parsed.pathname;
    return NextResponse.redirect(url, 308);
  }

  // Never expose internal ids like /es-MX — canonicalize to public /mx.
  if (
    parsed.locale &&
    parsed.hadPrefix &&
    shouldRedirectToPublicLocalePrefix(parsed.locale, parsed.pathSegment)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePath(parsed.locale, parsed.pathname);
    return NextResponse.redirect(url, 308);
  }

  if (parsed.locale) {
    const def = resolveLocaleDefinition(parsed.locale);
    if (!def.enabled) {
      const url = request.nextUrl.clone();
      url.pathname = parsed.pathname;
      return NextResponse.redirect(url, 302);
    }

    // Saved browser preference wins over a mismatched URL prefix (last explicit
    // choice / guest cookie). URL locale is adopted only when no preference exists
    // or it already matches — never let a stale/shared prefix overwrite the cookie.
    const cookieRaw = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    if (cookieRaw) {
      const preferred = resolveLocaleDefinition(cookieRaw);
      if (preferred.enabled && preferred.id !== def.id) {
        const url = request.nextUrl.clone();
        url.pathname = withLocalePath(preferred.id, parsed.pathname);
        if (url.pathname !== pathname) {
          return NextResponse.redirect(url, 307);
        }
      }
    }

    const url = request.nextUrl.clone();
    url.pathname = parsed.pathname;
    const response = NextResponse.rewrite(url, {
      request: {
        headers: withInterfaceLocaleRequestHeaders(request, def.id, { fromLocalePrefix: true }),
      },
    });
    setLocaleCookieOnResponse(response, def.id);
    return response;
  }

  // Client data requests must not be redirected — only document navigations.
  if (pathname.startsWith("/_next")) {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
    const resolved = resolveLocaleDefinition(cookieLocale || DEFAULT_LOCALE);
    return NextResponse.next({
      request: {
        headers: withInterfaceLocaleRequestHeaders(request, resolved.id),
      },
    });
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE_NAME)?.value;
  const resolved = resolveLocaleDefinition(cookieLocale || DEFAULT_LOCALE);

  // Internal rewrite of /{locale}/path already landed on the bare path — do not
  // bounce back to the prefixed URL (that creates a redirect loop).
  if (request.headers.get("x-lk-locale-prefix-rewrite") === "1") {
    return NextResponse.next({
      request: {
        headers: withInterfaceLocaleRequestHeaders(request, resolved.id),
      },
    });
  }

  // Keep an explicit non-default locale choice in the URL (e.g. cookie es-419 + /parents
  // → /es-419/parents). Soft client Links often omit the prefix; this restores it on
  // full document requests without forcing a prefix for English.
  if (
    resolved.id !== DEFAULT_LOCALE &&
    resolved.enabled &&
    !pathname.startsWith("/admin")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = withLocalePath(resolved.id, pathname);
    if (url.pathname !== pathname) {
      return NextResponse.redirect(url, 307);
    }
  }

  const response = NextResponse.next({
    request: {
      headers: withInterfaceLocaleRequestHeaders(request, resolved.id),
    },
  });
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot|mp3|wav|webmanifest|json)$).*)",
  ],
};
