/**
 * Namespace loader for locales/{locale}/{ns}.json
 * Real locale loading with fallback chain and dev warnings.
 */

import uiEn from "../../locales/en/ui.json" with { type: "json" };
import learningEn from "../../locales/en/learning.json" with { type: "json" };
import reportsEn from "../../locales/en/reports.json" with { type: "json" };
import emailsEn from "../../locales/en/emails.json" with { type: "json" };
import seoEn from "../../locales/en/seo.json" with { type: "json" };
import legalEn from "../../locales/en/legal.json" with { type: "json" };
import worksheetsEn from "../../locales/en/worksheets.json" with { type: "json" };
import gamesEn from "../../locales/en/games.json" with { type: "json" };
import validationEn from "../../locales/en/validation.json" with { type: "json" };
import commonEn from "../../locales/en/common.json" with { type: "json" };
import authEn from "../../locales/en/auth.json" with { type: "json" };
import teacherEn from "../../locales/en/teacher.json" with { type: "json" };
import schoolEn from "../../locales/en/school.json" with { type: "json" };
import platformEn from "../../locales/en/platform.json" with { type: "json" };
import copilotEn from "../../locales/en/copilot.json" with { type: "json" };
import { DEFAULT_LOCALE, FALLBACK_LOCALE, resolveLocaleDefinition } from "./locale-registry.js";
import { getLocaleFallbackChain } from "./locale-resolution.js";

export const I18N_NAMESPACES = Object.freeze([
  "common",
  "ui",
  "auth",
  "learning",
  "reports",
  "emails",
  "seo",
  "legal",
  "worksheets",
  "games",
  "validation",
  "teacher",
  "school",
  "platform",
  "copilot",
]);

/** @type {Record<string, Record<string, unknown>>} */
const EN_BUNDLE = Object.freeze({
  common: commonEn,
  ui: uiEn,
  auth: authEn,
  learning: learningEn,
  reports: reportsEn,
  emails: emailsEn,
  seo: seoEn,
  legal: legalEn,
  worksheets: worksheetsEn,
  games: gamesEn,
  validation: validationEn,
  teacher: teacherEn,
  school: schoolEn,
  platform: platformEn,
  copilot: copilotEn,
});

/**
 * Bundles keyed by canonical locale id.
 * Pseudo locales inherit from en until dedicated bundles exist.
 * @type {Record<string, Record<string, Record<string, unknown>>>}
 */
const LOCALE_BUNDLES = {
  en: EN_BUNDLE,
  "en-XA": EN_BUNDLE,
  "ar-XB": EN_BUNDLE,
};

/** @type {Map<string, Record<string, Record<string, unknown>>>} */
const bundleCache = new Map();

/** @type {Set<string>} */
const warnedMissingLocales = new Set();

/**
 * @param {string} locale
 * @returns {Record<string, Record<string, unknown>>}
 */
export function loadLocaleBundles(locale) {
  const def = resolveLocaleDefinition(locale);
  const id = def.id;

  if (bundleCache.has(id)) {
    return bundleCache.get(id);
  }

  const chain = getLocaleFallbackChain(id);
  /** @type {Record<string, Record<string, unknown>>} */
  const merged = {};

  for (const ns of I18N_NAMESPACES) {
    merged[ns] = {};
  }

  const sources = [...chain].reverse();
  for (const loc of sources) {
    const bundle = LOCALE_BUNDLES[loc];
    if (!bundle) {
      warnMissingLocaleBundle(loc, id);
      continue;
    }
    for (const ns of I18N_NAMESPACES) {
      if (bundle[ns]) {
        merged[ns] = { ...merged[ns], ...bundle[ns] };
      }
    }
  }

  const frozen = Object.freeze(
    Object.fromEntries(I18N_NAMESPACES.map((ns) => [ns, Object.freeze(merged[ns] || {})]))
  );
  bundleCache.set(id, frozen);
  return frozen;
}

/**
 * @param {string} missingLoc
 * @param {string} requestedLoc
 */
function warnMissingLocaleBundle(missingLoc, requestedLoc) {
  const key = `${requestedLoc}:${missingLoc}`;
  if (warnedMissingLocales.has(key)) return;
  warnedMissingLocales.add(key);
  if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.warn(`[i18n] no bundle for locale "${missingLoc}" while resolving "${requestedLoc}"`);
  }
}

/**
 * Register additional locale bundles at runtime (tests / future locales).
 * @param {string} localeId
 * @param {Record<string, Record<string, unknown>>} bundle
 */
export function registerLocaleBundle(localeId, bundle) {
  LOCALE_BUNDLES[localeId] = bundle;
  bundleCache.delete(localeId);
}

/**
 * @param {Record<string, Record<string, unknown>>} bundles
 * @param {string} key
 * @returns {string|null}
 */
export function lookupMessage(bundles, key) {
  const raw = String(key || "").trim();
  if (!raw) return null;

  const parts = raw.split(".");
  if (parts.length < 2) {
    const v = dig(bundles.common, [raw]);
    return typeof v === "string" ? v : null;
  }

  const ns = parts[0];
  if (bundles[ns]) {
    const v = dig(bundles[ns], parts.slice(1));
    if (typeof v === "string") return v;
  }

  for (const name of I18N_NAMESPACES) {
    const v = dig(bundles[name], parts);
    if (typeof v === "string") return v;
  }
  return null;
}

/**
 * @param {unknown} obj
 * @param {string[]} path
 */
function dig(obj, path) {
  let cur = obj;
  for (const p of path) {
    if (!cur || typeof cur !== "object") return null;
    cur = /** @type {Record<string, unknown>} */ (cur)[p];
  }
  return cur;
}

export function getFallbackBundles() {
  return loadLocaleBundles(FALLBACK_LOCALE);
}

/**
 * Collect missing keys for a locale vs reference locale (default en).
 * @param {string} localeId
 * @param {string} [referenceLocale]
 * @returns {string[]}
 */
export function collectMissingKeys(localeId, referenceLocale = DEFAULT_LOCALE) {
  const ref = loadLocaleBundles(referenceLocale);
  const target = loadLocaleBundles(localeId);
  /** @type {string[]} */
  const missing = [];

  for (const ns of I18N_NAMESPACES) {
    collectLeafKeys(ref[ns] || {}, [ns], target[ns] || {}, missing);
  }
  return missing.sort();
}

/**
 * @param {Record<string, unknown>} refObj
 * @param {string[]} prefix
 * @param {Record<string, unknown>} targetObj
 * @param {string[]} missing
 */
function collectLeafKeys(refObj, prefix, targetObj, missing) {
  for (const [k, v] of Object.entries(refObj)) {
    const path = [...prefix, k];
    if (v && typeof v === "object" && !Array.isArray(v)) {
      collectLeafKeys(
        /** @type {Record<string, unknown>} */ (v),
        path,
        /** @type {Record<string, unknown>} */ (targetObj[k] || {}),
        missing
      );
    } else if (typeof v === "string") {
      const tv = dig(targetObj, [k]);
      if (typeof tv !== "string" || !tv.trim()) {
        missing.push(path.join("."));
      }
    }
  }
}

/**
 * Reset loader cache (tests).
 */
export function resetLocaleBundleCache() {
  bundleCache.clear();
  warnedMissingLocales.clear();
}
