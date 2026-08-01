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
import commonEs419 from "../../locales/es-419/common.json" with { type: "json" };
import uiEs419 from "../../locales/es-419/ui.json" with { type: "json" };
import authEs419 from "../../locales/es-419/auth.json" with { type: "json" };
import validationEs419 from "../../locales/es-419/validation.json" with { type: "json" };
import learningEs419 from "../../locales/es-419/learning.json" with { type: "json" };
import reportsEs419 from "../../locales/es-419/reports.json" with { type: "json" };
import worksheetsEs419 from "../../locales/es-419/worksheets.json" with { type: "json" };
import gamesEs419 from "../../locales/es-419/games.json" with { type: "json" };
import emailsEs419 from "../../locales/es-419/emails.json" with { type: "json" };
import seoEs419 from "../../locales/es-419/seo.json" with { type: "json" };
import legalEs419 from "../../locales/es-419/legal.json" with { type: "json" };
import teacherEs419 from "../../locales/es-419/teacher.json" with { type: "json" };
import schoolEs419 from "../../locales/es-419/school.json" with { type: "json" };
import platformEs419 from "../../locales/es-419/platform.json" with { type: "json" };
import copilotEs419 from "../../locales/es-419/copilot.json" with { type: "json" };
import commonEsMx from "../../locales/es-MX/common.json" with { type: "json" };
import uiEsMx from "../../locales/es-MX/ui.json" with { type: "json" };
import learningEsMx from "../../locales/es-MX/learning.json" with { type: "json" };
import worksheetsEsMx from "../../locales/es-MX/worksheets.json" with { type: "json" };
import commonEsCo from "../../locales/es-CO/common.json" with { type: "json" };
import uiEsCo from "../../locales/es-CO/ui.json" with { type: "json" };
import learningEsCo from "../../locales/es-CO/learning.json" with { type: "json" };
import worksheetsEsCo from "../../locales/es-CO/worksheets.json" with { type: "json" };
import seoEsCo from "../../locales/es-CO/seo.json" with { type: "json" };
import teacherEsCo from "../../locales/es-CO/teacher.json" with { type: "json" };
import commonEsAr from "../../locales/es-AR/common.json" with { type: "json" };
import uiEsAr from "../../locales/es-AR/ui.json" with { type: "json" };
import learningEsAr from "../../locales/es-AR/learning.json" with { type: "json" };
import worksheetsEsAr from "../../locales/es-AR/worksheets.json" with { type: "json" };
import authEsAr from "../../locales/es-AR/auth.json" with { type: "json" };
import validationEsAr from "../../locales/es-AR/validation.json" with { type: "json" };
import reportsEsAr from "../../locales/es-AR/reports.json" with { type: "json" };
import emailsEsAr from "../../locales/es-AR/emails.json" with { type: "json" };
import seoEsAr from "../../locales/es-AR/seo.json" with { type: "json" };
import gamesEsAr from "../../locales/es-AR/games.json" with { type: "json" };
import copilotEsAr from "../../locales/es-AR/copilot.json" with { type: "json" };
import commonEsPe from "../../locales/es-PE/common.json" with { type: "json" };
import uiEsPe from "../../locales/es-PE/ui.json" with { type: "json" };
import learningEsPe from "../../locales/es-PE/learning.json" with { type: "json" };
import worksheetsEsPe from "../../locales/es-PE/worksheets.json" with { type: "json" };
import seoEsPe from "../../locales/es-PE/seo.json" with { type: "json" };
import { DEFAULT_LOCALE, FALLBACK_LOCALE, resolveLocaleDefinition } from "./locale-registry.js";
import { getLocaleFallbackChain } from "./locale-resolution.js";
import { deepMergeJson } from "./deep-merge.js";

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
  "es-419": Object.freeze({
    common: commonEs419,
    ui: uiEs419,
    auth: authEs419,
    validation: validationEs419,
    learning: learningEs419,
    reports: reportsEs419,
    worksheets: worksheetsEs419,
    games: gamesEs419,
    emails: emailsEs419,
    seo: seoEs419,
    legal: legalEs419,
    teacher: teacherEs419,
    school: schoolEs419,
    platform: platformEs419,
    copilot: copilotEs419,
  }),
  "es-MX": Object.freeze({
    common: commonEsMx,
    ui: uiEsMx,
    learning: learningEsMx,
    worksheets: worksheetsEsMx,
  }),
  "es-CO": Object.freeze({
    common: commonEsCo,
    ui: uiEsCo,
    learning: learningEsCo,
    worksheets: worksheetsEsCo,
    seo: seoEsCo,
    teacher: teacherEsCo,
  }),
  "es-AR": Object.freeze({
    common: commonEsAr,
    ui: uiEsAr,
    learning: learningEsAr,
    worksheets: worksheetsEsAr,
    auth: authEsAr,
    validation: validationEsAr,
    reports: reportsEsAr,
    emails: emailsEsAr,
    seo: seoEsAr,
    games: gamesEsAr,
    copilot: copilotEsAr,
  }),
  "es-PE": Object.freeze({
    common: commonEsPe,
    ui: uiEsPe,
    learning: learningEsPe,
    worksheets: worksheetsEsPe,
    seo: seoEsPe,
  }),
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
        merged[ns] = /** @type {Record<string, unknown>} */ (
          deepMergeJson(merged[ns], bundle[ns])
        );
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
