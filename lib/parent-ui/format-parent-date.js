/**
 * English date formatting for parent-facing report surfaces.
 * Locale-aware via format-locale (default en — identical Global output).
 */

import { formatLocaleDate, formatLocaleDateTime } from "../i18n/format-locale.js";
import { DEFAULT_LOCALE } from "../i18n/locale-registry.js";

/**
 * @param {string|number|Date|null|undefined} iso
 * @param {string|null|undefined} [localeId]
 */
export function formatParentDate(iso, localeId = DEFAULT_LOCALE) {
  return formatLocaleDate(iso, localeId);
}

/**
 * @param {string|number|Date|null|undefined} iso
 * @param {string|null|undefined} [localeId]
 */
export function formatParentDateTime(iso, localeId = DEFAULT_LOCALE) {
  return formatLocaleDateTime(iso, localeId);
}
