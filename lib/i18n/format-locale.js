/**
 * Locale-aware display formatting for user-visible dates/numbers.
 * Uses registry intlLocale — never hardcode en-US/he-IL for Global UI.
 */

import {
  formatDate,
  formatNumber,
  formatPercent,
  formatCurrency,
} from "./message-format.js";
import { resolveLocaleDefinition, DEFAULT_LOCALE } from "./locale-registry.js";

/**
 * @param {string|null|undefined} [localeId]
 */
export function resolveFormattingLocale(localeId) {
  return resolveLocaleDefinition(localeId || DEFAULT_LOCALE).id;
}

/**
 * @param {string|number|Date|null|undefined} value
 * @param {string|null|undefined} [localeId]
 * @param {Intl.DateTimeFormatOptions} [opts]
 */
export function formatLocaleDate(value, localeId, opts) {
  if (value == null || value === "") return "—";
  const formatted = formatDate(value, resolveFormattingLocale(localeId), opts || { dateStyle: "medium" });
  return formatted || "—";
}

/**
 * @param {string|number|Date|null|undefined} value
 * @param {string|null|undefined} [localeId]
 * @param {Intl.DateTimeFormatOptions} [opts]
 */
export function formatLocaleDateTime(value, localeId, opts) {
  if (value == null || value === "") return "—";
  const formatted = formatDate(
    value,
    resolveFormattingLocale(localeId),
    opts || { dateStyle: "medium", timeStyle: "short" },
  );
  return formatted || "—";
}

/**
 * @param {number} value
 * @param {string|null|undefined} [localeId]
 * @param {Intl.NumberFormatOptions} [opts]
 */
export function formatLocaleNumber(value, localeId, opts) {
  return formatNumber(value, resolveFormattingLocale(localeId), opts);
}

/**
 * @param {number} value
 * @param {string|null|undefined} [localeId]
 * @param {Intl.NumberFormatOptions} [opts]
 */
export function formatLocalePercent(value, localeId, opts) {
  return formatPercent(value, resolveFormattingLocale(localeId), opts);
}

/**
 * @param {number} value
 * @param {string} currency
 * @param {string|null|undefined} [localeId]
 */
export function formatLocaleCurrency(value, currency, localeId) {
  return formatCurrency(value, resolveFormattingLocale(localeId), currency || "USD");
}

/**
 * Grade label for display (US-style Grade N). Future locales override via UI messages.
 * @param {string|null|undefined} gradeKey g1–g6
 * @param {string|null|undefined} [localeId]
 */
export function formatLocaleGradeLabel(gradeKey, localeId = DEFAULT_LOCALE) {
  const n = parseInt(String(gradeKey || "").replace(/\D/g, ""), 10);
  if (!(n >= 1 && n <= 6)) return String(gradeKey || "");
  void localeId;
  return `Grade ${n}`;
}
