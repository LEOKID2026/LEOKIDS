/**
 * Locale-aware SEO helpers — canonical, hreflang, og:locale.
 */

import { CANONICAL_PUBLIC_SITE_ORIGIN } from "../site/canonical-public-site-origin.js";
import {
  ACTIVE_LOCALE_IDS,
  DEFAULT_LOCALE,
  resolveLocaleDefinition,
} from "../i18n/locale-registry.js";
import { buildLocalizedHref, canonicalizeLocalizedPath, withLocalePath } from "../i18n/locale-path.js";

/**
 * @param {string} canonicalPath internal path without locale prefix
 * @param {string|null|undefined} localeId
 */
export function buildCanonicalUrl(canonicalPath, localeId = DEFAULT_LOCALE) {
  const path = withLocalePath(localeId, canonicalizeLocalizedPath(canonicalPath));
  const origin = CANONICAL_PUBLIC_SITE_ORIGIN.replace(/\/$/, "");
  return `${origin}${path}`;
}

/**
 * Build hreflang alternates for enabled locales only.
 * @param {string} canonicalPath
 * @param {string[]} [enabledLocales]
 */
export function buildHreflangAlternates(canonicalPath, enabledLocales = ACTIVE_LOCALE_IDS) {
  const path = canonicalizeLocalizedPath(canonicalPath);
  /** @type {{ locale: string, href: string }[]} */
  const alternates = enabledLocales.map((loc) => ({
    locale: resolveLocaleDefinition(loc).ogLocale.replace("_", "-"),
    href: buildCanonicalUrl(path, loc),
  }));
  alternates.push({
    locale: "x-default",
    href: buildCanonicalUrl(path, DEFAULT_LOCALE),
  });
  return alternates;
}

/**
 * @param {string|null|undefined} localeId
 */
export function resolveOgLocale(localeId) {
  return resolveLocaleDefinition(localeId).ogLocale;
}

/**
 * @param {string|null|undefined} localeId
 * @param {string} pathname
 */
export function buildLocalizedPageUrl(localeId, pathname) {
  return buildLocalizedHref(localeId, pathname);
}
