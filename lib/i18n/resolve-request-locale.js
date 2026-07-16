import {
  FALLBACK_LOCALE,
  LOCALE_COOKIE_NAME,
  resolveLocaleDefinition,
  stripLocalePrefix,
} from "./locale-registry.js";

/**
 * Resolve locale from Next.js router / cookies / Accept-Language.
 * @param {{
 *   asPath?: string,
 *   pathname?: string,
 *   query?: Record<string, string|string[]>,
 *   cookieHeader?: string,
 *   preferCookie?: boolean,
 * }} [opts]
 */
export function resolveRequestLocale(opts = {}) {
  const path = String(opts.asPath || opts.pathname || "/");
  const stripped = stripLocalePrefix(path.split("?")[0] || "/");
  if (stripped.locale && stripped.locale !== FALLBACK_LOCALE) {
    return resolveLocaleDefinition(stripped.locale).id;
  }

  if (opts.query?.locale) {
    const q = Array.isArray(opts.query.locale) ? opts.query.locale[0] : opts.query.locale;
    return resolveLocaleDefinition(q).id;
  }

  if (opts.preferCookie !== false && opts.cookieHeader) {
    const cookieLocale = parseCookie(opts.cookieHeader, LOCALE_COOKIE_NAME);
    if (cookieLocale) return resolveLocaleDefinition(cookieLocale).id;
  }

  return FALLBACK_LOCALE;
}

/**
 * @param {string} cookieHeader
 * @param {string} name
 */
function parseCookie(cookieHeader, name) {
  const parts = String(cookieHeader || "").split(";");
  for (const part of parts) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("=") || "");
  }
  return null;
}
