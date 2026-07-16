/**
 * Namespace loader for locales/{locale}/{ns}.json
 * Static JSON imports — compatible with Next.js client + server bundles.
 */

import uiEn from "../../locales/en/ui.json";
import learningEn from "../../locales/en/learning.json";
import reportsEn from "../../locales/en/reports.json";
import emailsEn from "../../locales/en/emails.json";
import seoEn from "../../locales/en/seo.json";
import legalEn from "../../locales/en/legal.json";
import worksheetsEn from "../../locales/en/worksheets.json";
import gamesEn from "../../locales/en/games.json";
import validationEn from "../../locales/en/validation.json";
import commonEn from "../../locales/en/common.json";
import authEn from "../../locales/en/auth.json";
import { FALLBACK_LOCALE } from "./locale-registry.js";

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
]);

/** @type {Record<string, Record<string, unknown>>} */
const EN_BUNDLE = {
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
};

/**
 * @param {string} locale
 * @returns {Record<string, Record<string, unknown>>}
 */
export function loadLocaleBundles(locale) {
  void locale;
  return EN_BUNDLE;
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
