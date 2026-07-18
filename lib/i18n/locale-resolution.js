/**
 * Central locale resolution — interface, content, report locales with priority chain.
 */

import { readLocaleCookie } from "./locale-cookie.js";
import {
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  resolveLocaleDefinition,
  LOCALE_REGISTRY,
} from "./locale-registry.js";
import { stripLocaleFromPath } from "./locale-path.js";
import { normalizeLocaleId, buildLocaleFallbackChain } from "./locale-normalize.js";

/**
 * @typedef {{
 *   asPath?: string,
 *   pathname?: string,
 *   query?: Record<string, string|string[]|undefined>,
 *   cookieHeader?: string,
 *   acceptLanguage?: string,
 *   profileInterfaceLocale?: string|null,
 *   profileReportLocale?: string|null,
 *   preferCookie?: boolean,
 *   hasExplicitUserChoice?: boolean,
 * }} ResolveLocaleOptions
 */

/**
 * Resolve interface locale (UI).
 * Priority: URL → profile → cookie → Accept-Language (first visit) → default
 * @param {ResolveLocaleOptions} [opts]
 */
export function resolveInterfaceLocale(opts = {}) {
  const path = String(opts.asPath || opts.pathname || "/");
  const stripped = stripLocaleFromPath(path.split("?")[0] || "/");

  if (stripped.locale) {
    const def = resolveLocaleDefinition(stripped.locale);
    if (def.enabled) return def.id;
  }

  if (opts.query?.locale) {
    const q = Array.isArray(opts.query.locale) ? opts.query.locale[0] : opts.query.locale;
    const def = resolveLocaleDefinition(q);
    if (def.enabled) return def.id;
  }

  const profile = opts.profileInterfaceLocale
    ? normalizeLocaleId(opts.profileInterfaceLocale)
    : null;
  if (profile && LOCALE_REGISTRY[profile]?.enabled) {
    return resolveLocaleDefinition(profile).id;
  }

  if (opts.preferCookie !== false && opts.cookieHeader) {
    const cookieLocale = readLocaleCookie(opts.cookieHeader);
    if (cookieLocale) {
      const def = resolveLocaleDefinition(cookieLocale);
      if (def.enabled) return def.id;
    }
  }

  if (!opts.hasExplicitUserChoice && opts.acceptLanguage) {
    const fromBrowser = pickBrowserLocale(opts.acceptLanguage);
    if (fromBrowser) return fromBrowser;
  }

  return FALLBACK_LOCALE;
}

/** @deprecated use resolveInterfaceLocale */
export function resolveRequestLocale(opts = {}) {
  return resolveInterfaceLocale(opts);
}

/**
 * Resolve learning content locale (may differ from UI).
 * @param {{
 *   contentLocale?: string|null,
 *   interfaceLocale?: string|null,
 *   subject?: string|null,
 *   market?: string|null,
 *   curriculum?: string|null,
 * }} [opts]
 */
export function resolveContentLocale(opts = {}) {
  const explicit = opts.contentLocale ? normalizeLocaleId(opts.contentLocale) : null;
  if (explicit) {
    if (explicit === "he" || explicit === "he-IL") return "he";
    return explicit;
  }

  const subject = String(opts.subject || "").toLowerCase();
  if (subject === "english") {
    return "en";
  }

  const ui = opts.interfaceLocale ? resolveLocaleDefinition(opts.interfaceLocale).id : DEFAULT_LOCALE;
  return ui === "en-XA" || ui === "ar-XB" ? DEFAULT_LOCALE : ui;
}

/**
 * Resolve parent report / communication locale.
 * @param {{
 *   reportLocale?: string|null,
 *   preferredReportLanguage?: string|null,
 *   interfaceLocale?: string|null,
 * }} [opts]
 */
export function resolveReportLocale(opts = {}) {
  const explicit = opts.reportLocale || opts.preferredReportLanguage;
  if (explicit) {
    const def = resolveLocaleDefinition(explicit);
    if (def.enabled) return def.id;
  }
  return resolveInterfaceLocale({
    profileInterfaceLocale: opts.interfaceLocale,
    preferCookie: false,
  });
}

/**
 * @param {string|null|undefined} localeId
 */
export function getLocaleFallbackChain(localeId) {
  const def = resolveLocaleDefinition(localeId);
  return buildLocaleFallbackChain(def.id, {
    configuredFallback: def.fallbackLocale || FALLBACK_LOCALE,
    defaultLocale: DEFAULT_LOCALE,
  });
}

/**
 * @param {string} acceptLanguage
 * @returns {string|null}
 */
function pickBrowserLocale(acceptLanguage) {
  const parts = String(acceptLanguage || "")
    .split(",")
    .map((p) => p.trim().split(";")[0])
    .filter(Boolean);
  for (const tag of parts) {
    const def = resolveLocaleDefinition(tag);
    if (def.enabled && def.status === "enabled") return def.id;
  }
  return null;
}
