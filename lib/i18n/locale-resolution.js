/**
 * Central locale resolution — interface, content, report locales with priority chain.
 *
 * Interface precedence (product contract):
 * 1. Persisted authenticated profile preference (when provided)
 * 2. Persisted browser cookie (last explicit / guest choice)
 * 3. Explicit locale URL / ?locale= (first use only — when no saved preference)
 * 4. Optional detected market locale (initialization only; caller-supplied)
 * 5. English default
 *
 * Accept-Language is NOT used for product interface defaults (browser language is
 * not a substitute for country/market detection). Opt-in via allowAcceptLanguage
 * remains for non-product callers that need it.
 */

import { readLocaleCookie } from "./locale-cookie.js";
import {
  DEFAULT_LOCALE,
  FALLBACK_LOCALE,
  resolveLocaleDefinition,
  LOCALE_REGISTRY,
} from "./locale-registry.js";
import { stripLocaleFromPath } from "./locale-path.js";
import { normalizeLocaleId } from "./locale-normalize.js";

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
 *   detectedMarketLocale?: string|null,
 *   allowAcceptLanguage?: boolean,
 * }} ResolveLocaleOptions
 */

/**
 * Accept a stored preference only when it maps to a real enabled registry locale.
 * Unknown tags that normalize to English (e.g. `he`) must fall through the chain.
 * @param {string|null|undefined} raw
 * @returns {string|null}
 */
function resolveStoredLocalePreference(raw) {
  if (raw == null) return null;
  const input = String(raw).trim();
  if (!input) return null;
  const normalized = normalizeLocaleId(input);
  if (!LOCALE_REGISTRY[normalized]?.enabled) return null;

  const lower = input.toLowerCase().replace(/_/g, "-");
  if (normalized === DEFAULT_LOCALE) {
    if (lower !== "en" && lower !== "en-us") {
      const exact = Object.keys(LOCALE_REGISTRY).some((id) => id.toLowerCase() === lower);
      const alias = Object.values(LOCALE_REGISTRY).some(
        (d) =>
          d.enabled &&
          Array.isArray(d.aliases) &&
          d.aliases.some((a) => String(a).toLowerCase() === lower)
      );
      if (!exact && !alias) return null;
    }
  }

  return resolveLocaleDefinition(normalized).id;
}

/**
 * Resolve interface locale (UI).
 * @param {ResolveLocaleOptions} [opts]
 */
export function resolveInterfaceLocale(opts = {}) {
  const profile = resolveStoredLocalePreference(opts.profileInterfaceLocale);
  if (profile) return profile;

  if (opts.preferCookie !== false && opts.cookieHeader) {
    const cookieLocale = readLocaleCookie(opts.cookieHeader);
    const fromCookie = resolveStoredLocalePreference(cookieLocale);
    if (fromCookie) return fromCookie;
  }

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

  if (opts.detectedMarketLocale) {
    const fromMarket = resolveStoredLocalePreference(opts.detectedMarketLocale);
    if (fromMarket) return fromMarket;
  }

  // Initialization-only opt-in; not part of the default product chain.
  if (opts.allowAcceptLanguage && !opts.hasExplicitUserChoice && opts.acceptLanguage) {
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
    // Unregistered / unknown locales (including he*) → en via registry
    return resolveLocaleDefinition(explicit).id;
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
 * Registry-driven fallback chain: walk each locale's `fallbackLocale` until
 * the default. Produces multi-hop country chains such as:
 * pt-AO → pt-PT → pt-BR → en, fr-CI → fr-FR → en, de-AT → de-DE → en.
 *
 * @param {string|null|undefined} localeId
 */
export function getLocaleFallbackChain(localeId) {
  /** @type {string[]} */
  const chain = [];
  const seen = new Set();
  let current = resolveLocaleDefinition(localeId).id;
  while (current && !seen.has(current)) {
    seen.add(current);
    chain.push(current);
    const def = LOCALE_REGISTRY[current];
    const nextRaw = def?.fallbackLocale;
    if (!nextRaw || nextRaw === current) break;
    current = resolveLocaleDefinition(nextRaw).id;
  }
  if (!chain.includes(DEFAULT_LOCALE)) chain.push(DEFAULT_LOCALE);
  return chain;
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
    const fromTag = resolveStoredLocalePreference(tag);
    if (fromTag) return fromTag;
  }
  return null;
}
