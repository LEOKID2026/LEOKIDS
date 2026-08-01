/**
 * Resolve content locale for learning-book SSR from the incoming request.
 * Uses interface locale (URL / cookie / Accept-Language). Does not force English
 * subject → en, so es-419 English-book chrome MD can load when UI is es-419.
 */

import {
  resolveContentLocale,
  resolveInterfaceLocale,
} from "../i18n/locale-resolution.js";

/**
 * @param {{
 *   req?: { headers?: Record<string, string|string[]|undefined> },
 *   resolvedUrl?: string,
 *   asPath?: string,
 *   pathname?: string,
 *   query?: Record<string, string|string[]|undefined>,
 * }} ctx
 * @returns {string}
 */
export function resolveBookRequestContentLocale(ctx = {}) {
  const req = ctx.req;
  const cookieHeader = req?.headers?.cookie;
  const acceptLanguage = req?.headers?.["accept-language"];

  const interfaceLocale = resolveInterfaceLocale({
    asPath: ctx.resolvedUrl || ctx.asPath || ctx.pathname || "/",
    pathname: ctx.pathname,
    query: ctx.query,
    cookieHeader: typeof cookieHeader === "string" ? cookieHeader : undefined,
    acceptLanguage:
      typeof acceptLanguage === "string" ? acceptLanguage : undefined,
  });

  return resolveContentLocale({ interfaceLocale });
}
