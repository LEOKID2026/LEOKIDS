/**
 * Locale-aware URL path helpers — single source of truth for routing.
 */

import { DEFAULT_LOCALE, LOCALE_REGISTRY, resolveLocaleDefinition } from "./locale-registry.js";
import { normalizeLocaleId } from "./locale-normalize.js";

const LOCALE_SEGMENT_RE = /^\/([a-z]{2}(?:-[A-Za-z]{2,4})?)(?=\/|$)/;

/**
 * @typedef {{ locale: string|null, pathname: string, hadPrefix: boolean }} LocalePathParse
 */

/**
 * Extract locale prefix from pathname. Hebrew /he is never treated as a locale.
 * @param {string} pathname
 * @returns {LocalePathParse}
 */
export function stripLocaleFromPath(pathname) {
  const p = String(pathname || "/");
  const m = p.match(LOCALE_SEGMENT_RE);
  if (!m) {
    return { locale: null, pathname: p || "/", hadPrefix: false };
  }
  const candidate = normalizeLocaleId(m[1]);
  if (candidate === "he" || !LOCALE_REGISTRY[candidate]) {
    return { locale: null, pathname: p || "/", hadPrefix: false };
  }
  const rest = p.slice(m[0].length) || "/";
  return {
    locale: candidate,
    pathname: rest.startsWith("/") ? rest : `/${rest}`,
    hadPrefix: true,
  };
}

/** @deprecated use stripLocaleFromPath */
export function stripLocalePrefix(pathname) {
  const r = stripLocaleFromPath(pathname);
  return { locale: r.locale, pathname: r.pathname };
}

/**
 * @param {string|null|undefined} pathname
 * @returns {string|null}
 */
export function getLocaleFromPath(pathname) {
  return stripLocaleFromPath(pathname).locale;
}

/**
 * @param {string|null|undefined} pathname
 * @returns {boolean}
 */
export function isLocalizedPath(pathname) {
  return stripLocaleFromPath(pathname).hadPrefix;
}

/**
 * Add locale prefix for non-default locales.
 * @param {string|null|undefined} localeId
 * @param {string} pathname absolute app path without locale prefix
 */
export function withLocalePath(localeId, pathname) {
  const path = canonicalizeLocalizedPath(pathname);
  const id = normalizeLocaleId(localeId);
  if (!id || id === DEFAULT_LOCALE) return path;
  if (id === "he" || !LOCALE_REGISTRY[id]) return path;
  if (path === "/") return `/${id}`;
  return `/${id}${path}`;
}

/** @deprecated use withLocalePath */
export function withLocalePrefix(localeId, pathname) {
  return withLocalePath(localeId, pathname);
}

/**
 * Normalize internal pathname (no locale prefix, no trailing slash except root).
 * @param {string|null|undefined} pathname
 */
export function canonicalizeLocalizedPath(pathname) {
  if (!pathname || pathname === "/") return "/";
  let p = String(pathname);
  if (!p.startsWith("/")) p = `/${p}`;
  const stripped = stripLocaleFromPath(p);
  p = stripped.pathname;
  if (p.endsWith("/") && p.length > 1) p = p.slice(0, -1);
  return p;
}

/**
 * Build full localized href preserving query + hash.
 * @param {string|null|undefined} localeId
 * @param {string} pathname
 * @param {{ search?: string, hash?: string }} [opts]
 */
export function buildLocalizedHref(localeId, pathname, opts = {}) {
  const base = withLocalePath(localeId, pathname);
  const search = opts.search ? (opts.search.startsWith("?") ? opts.search : `?${opts.search}`) : "";
  const hash = opts.hash ? (opts.hash.startsWith("#") ? opts.hash : `#${opts.hash}`) : "";
  return `${base}${search}${hash}`;
}

/**
 * Paths that must never receive locale rewrite in middleware.
 * @param {string} pathname
 */
export function isLocaleRoutingExcluded(pathname) {
  const p = String(pathname || "");
  if (
    p.startsWith("/_next") ||
    p.startsWith("/api/") ||
    p.startsWith("/static/") ||
    p === "/favicon.ico" ||
    p === "/robots.txt" ||
    p === "/sitemap.xml"
  ) {
    return true;
  }
  if (/\.(svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot|mp3|wav|webmanifest|json|js|css)$/i.test(p)) {
    return true;
  }
  if (p === "/sw.js" || p.endsWith("/sw.js")) return true;
  if (p.includes(".webmanifest")) return true;
  return false;
}

/**
 * Whether locale prefix should redirect (e.g. /en → unprefixed).
 * @param {string|null|undefined} localeId
 */
export function shouldRedirectPrefixedDefaultLocale(localeId) {
  const id = normalizeLocaleId(localeId);
  return id === DEFAULT_LOCALE;
}

/**
 * @param {string|null|undefined} localeId
 */
export function isLocaleRoutable(localeId) {
  const def = resolveLocaleDefinition(localeId);
  return def.status === "enabled" || def.status === "preview" || def.status === "development";
}
