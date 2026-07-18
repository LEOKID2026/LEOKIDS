import { NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  LOCALE_REQUEST_HEADER,
  resolveLocaleDefinition,
} from "./lib/i18n/locale-registry.js";
import {
  isLocaleRoutingExcluded,
  shouldRedirectPrefixedDefaultLocale,
  stripLocaleFromPath,
} from "./lib/i18n/locale-path.js";
import { setLocaleCookieOnResponse } from "./lib/i18n/locale-cookie.js";

function withInterfaceLocaleRequestHeaders(request, localeId) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_REQUEST_HEADER, localeId);
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

  if (parsed.locale) {
    const def = resolveLocaleDefinition(parsed.locale);
    if (!def.enabled) {
      const url = request.nextUrl.clone();
      url.pathname = parsed.pathname;
      return NextResponse.redirect(url, 302);
    }

    const url = request.nextUrl.clone();
    url.pathname = parsed.pathname;
    const response = NextResponse.rewrite(url, {
      request: {
        headers: withInterfaceLocaleRequestHeaders(request, def.id),
      },
    });
    setLocaleCookieOnResponse(response, def.id);
    return response;
  }

  const cookieLocale = request.cookies.get("lk_global_locale")?.value;
  const resolved = resolveLocaleDefinition(cookieLocale || DEFAULT_LOCALE);
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
