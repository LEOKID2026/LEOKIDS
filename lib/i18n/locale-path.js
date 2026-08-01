/**
 * Locale-aware URL path helpers — single source of truth for routing.
 */

import {
  DEFAULT_LOCALE,
  LOCALE_REGISTRY,
  getPublicLocalePathPrefix,
  resolveLocaleDefinition,
  resolveLocaleIdFromPathPrefix,
} from "./locale-registry.js";
import { normalizeLocaleId } from "./locale-normalize.js";

/**
 * Public locale segment: BCP 47 (en, es-419, en-GB) or country path prefixes.
 * `{2,3}` allows England's public prefix `/eng` while unregistered 3-letter
 * segments (e.g. `/api`) fail resolveRegisteredPathLocale and are left intact.
 */
const LOCALE_SEGMENT_RE = /^\/([a-z]{2,3}(?:-(?:[A-Za-z]{2,4}|[0-9]{3}))?)(?=\/|$)/i;

/**
 * Resolve a URL path segment to a registered locale id only.
 * Unregistered tags (including legacy Hebrew codes) must NOT collapse to `en` and strip.
 * @param {string} segment
 * @returns {string|null}
 */
function resolveRegisteredPathLocale(segment) {
  const raw = String(segment || "").trim();
  if (!raw) return null;
  const lower = raw.toLowerCase().replace(/_/g, "-");

  // Country public prefixes: /mx → es-MX (lowercase only in public URLs).
  const fromCountryPrefix = resolveLocaleIdFromPathPrefix(lower);
  if (fromCountryPrefix) return fromCountryPrefix;

  for (const id of Object.keys(LOCALE_REGISTRY)) {
    if (id.toLowerCase() === lower) return id;
  }

  for (const def of Object.values(LOCALE_REGISTRY)) {
    if (
      Array.isArray(def.aliases) &&
      def.aliases.some((a) => String(a || "").toLowerCase().replace(/_/g, "-") === lower)
    ) {
      return def.id;
    }
  }

  // Known path aliases that map to registry ids (must stay explicit — no unregistered→en).
  // en-GB / en-AU are registered country locales (public /eng, /au) — not aliases of en.
  if (lower === "en-us" || lower === "en-ca") return "en";
  if (lower === "en-xa") return "en-XA";
  if (lower === "ar-xb") return "ar-XB";
  if (lower === "es-la") return "es-419";

  return null;
}

/**
 * @typedef {{ locale: string|null, pathname: string, hadPrefix: boolean, pathSegment: string|null }} LocalePathParse
 */

/**
 * Extract locale prefix from pathname. Unregistered segments are not locales.
 * @param {string} pathname
 * @returns {LocalePathParse}
 */
export function stripLocaleFromPath(pathname) {
  const p = String(pathname || "/");
  const m = p.match(LOCALE_SEGMENT_RE);
  if (!m) {
    return { locale: null, pathname: p || "/", hadPrefix: false, pathSegment: null };
  }
  const candidate = resolveRegisteredPathLocale(m[1]);
  if (!candidate || !LOCALE_REGISTRY[candidate]) {
    return { locale: null, pathname: p || "/", hadPrefix: false, pathSegment: null };
  }
  const rest = p.slice(m[0].length) || "/";
  return {
    locale: candidate,
    pathname: rest.startsWith("/") ? rest : `/${rest}`,
    hadPrefix: true,
    pathSegment: m[1],
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
 * Add locale prefix for non-default locales (public pathPrefix when set).
 * @param {string|null|undefined} localeId
 * @param {string} pathname absolute app path without locale prefix
 */
export function withLocalePath(localeId, pathname) {
  const path = canonicalizeLocalizedPath(pathname);
  const id = normalizeLocaleId(localeId);
  if (!id || id === DEFAULT_LOCALE) return path;
  if (!LOCALE_REGISTRY[id]) return path;
  const prefix = getPublicLocalePathPrefix(id);
  if (!prefix) return path;
  if (path === "/") return `/${prefix}`;
  return `/${prefix}${path}`;
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
 * Localize an internal app href for the active locale.
 * Leaves external, hash-only, admin, and routing-excluded targets unchanged.
 * @param {string|null|undefined} localeId
 * @param {string|import('url').UrlObject} href
 * @returns {string|import('url').UrlObject}
 */
export function localizeHref(localeId, href) {
  if (href == null) return href;
  if (typeof href !== "string") {
    if (typeof href === "object" && href.pathname) {
      const path = localizeHref(localeId, href.pathname);
      if (typeof path !== "string") return href;
      return { ...href, pathname: path };
    }
    return href;
  }

  const raw = href.trim();
  if (!raw) return raw;
  if (
    raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("//") ||
    raw.startsWith("mailto:") ||
    raw.startsWith("tel:") ||
    raw.startsWith("blob:") ||
    raw.startsWith("data:")
  ) {
    return raw;
  }
  if (raw.startsWith("#")) return raw;

  let pathname = raw;
  let search = "";
  let hash = "";
  const hashIdx = pathname.indexOf("#");
  if (hashIdx >= 0) {
    hash = pathname.slice(hashIdx);
    pathname = pathname.slice(0, hashIdx);
  }
  const qIdx = pathname.indexOf("?");
  if (qIdx >= 0) {
    search = pathname.slice(qIdx + 1);
    pathname = pathname.slice(0, qIdx);
  }

  if (!pathname.startsWith("/")) return raw;
  if (pathname.startsWith("/admin")) return raw;
  if (isLocaleRoutingExcluded(pathname)) return raw;

  return buildLocalizedHref(localeId, pathname, {
    search: search || undefined,
    hash: hash || undefined,
  });
}

/**
 * When a client route URL dropped the active non-default locale prefix, return the
 * corrected href; otherwise null (no navigation needed).
 * @param {string|null|undefined} localeId
 * @param {string} url
 * @returns {string|null}
 */
export function ensureLocalePrefixedUrl(localeId, url) {
  const id = normalizeLocaleId(localeId);
  if (!id || id === DEFAULT_LOCALE) return null;
  if (!LOCALE_REGISTRY[id]) return null;
  if (typeof url !== "string" || !url) return null;

  const hashIdx = url.indexOf("#");
  const withoutHash = hashIdx >= 0 ? url.slice(0, hashIdx) : url;
  const hash = hashIdx >= 0 ? url.slice(hashIdx) : "";
  const qIdx = withoutHash.indexOf("?");
  const pathname = qIdx >= 0 ? withoutHash.slice(0, qIdx) : withoutHash;
  const search = qIdx >= 0 ? withoutHash.slice(qIdx + 1) : "";

  if (!pathname.startsWith("/")) return null;
  if (pathname.startsWith("/admin") || pathname.startsWith("/_next") || pathname.startsWith("/api/")) {
    return null;
  }
  if (isLocaleRoutingExcluded(pathname)) return null;

  const parsed = stripLocaleFromPath(pathname);
  if (parsed.hadPrefix) return null;

  const next = buildLocalizedHref(id, parsed.pathname, {
    search: search || undefined,
    hash: hash || undefined,
  });
  return next === url ? null : next;
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

/**
 * True when the URL used an internal locale id (e.g. /es-MX) instead of the
 * public path prefix (/mx). Callers should 308 to the public form.
 * @param {string|null|undefined} localeId
 * @param {string|null|undefined} pathSegment
 */
export function shouldRedirectToPublicLocalePrefix(localeId, pathSegment) {
  const wanted = getPublicLocalePathPrefix(localeId);
  if (!wanted || !pathSegment) return false;
  // Enforce canonical public form (lowercase /mx, never /MX or /es-MX).
  return String(pathSegment) !== String(wanted);
}
