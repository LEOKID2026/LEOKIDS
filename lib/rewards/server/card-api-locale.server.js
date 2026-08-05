/**
 * Resolve interface/content locale for GLOBAL card APIs from the request.
 * Missing locale falls through registry defaults only after cookie/header/query —
 * GLOBAL card copy still requires an explicit resolved contentLocale string.
 */

import { resolveContentLocale, resolveInterfaceLocale } from "../../i18n/locale-resolution.js";
import { readRequestInterfaceLocale } from "../../i18n/read-request-interface-locale.server.js";

/**
 * @param {import("http").IncomingMessage & { query?: Record<string, unknown> }} req
 * @returns {{ interfaceLocale: string, contentLocale: string }}
 */
export function resolveCardApiLocales(req) {
  const fromRequest = readRequestInterfaceLocale(req);
  const queryLocaleRaw = req?.query?.locale ?? req?.query?.contentLocale;
  const queryLocale = Array.isArray(queryLocaleRaw)
    ? String(queryLocaleRaw[0] || "")
    : queryLocaleRaw != null
      ? String(queryLocaleRaw)
      : "";

  const interfaceLocale = resolveInterfaceLocale({
    query: queryLocale ? { locale: queryLocale } : undefined,
    profileInterfaceLocale: fromRequest,
    cookieHeader: typeof req?.headers?.cookie === "string" ? req.headers.cookie : "",
    acceptLanguage:
      typeof req?.headers?.["accept-language"] === "string" ? req.headers["accept-language"] : "",
    preferCookie: true,
  });

  const contentLocale = resolveContentLocale({
    contentLocale: queryLocale || fromRequest || interfaceLocale,
    interfaceLocale,
  });

  if (!contentLocale) {
    throw new Error("card_api_missing_content_locale");
  }

  return { interfaceLocale, contentLocale };
}
