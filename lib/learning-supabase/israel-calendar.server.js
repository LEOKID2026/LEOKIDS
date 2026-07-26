/**
 * Compatibility facade for legacy import paths.
 *
 * Global product policy: calendar math uses locale-calendar.server.js
 * (explicit IANA timezone when provided, otherwise UTC).
 * Asia/Jerusalem is no longer the product default.
 *
 * Prefer importing from `./locale-calendar.server.js` in new code.
 */

import {
  getCalendarDateString,
  getMidnightUtcForDate,
  getMonthBounds,
  getMonthBoundsForYearMonth,
  getPreviousYearMonth,
  getTodayMidnightUtc,
  isFirstCalendarDay,
  isInCurrentMonth,
  resolveCalendarTimeZone,
} from "./locale-calendar.server.js";

/**
 * @deprecated Use getCalendarDateString from locale-calendar.server.js
 * @param {Date} [referenceDate]
 * @param {unknown} [explicitTimeZone]
 */
export function getIsraelDateString(referenceDate = new Date(), explicitTimeZone) {
  return getCalendarDateString(referenceDate, explicitTimeZone);
}

/**
 * @deprecated Use getMidnightUtcForDate from locale-calendar.server.js
 * @param {string} dateStr
 * @param {unknown} [explicitTimeZone]
 */
export function getIsraelMidnightUtc(dateStr, explicitTimeZone) {
  return getMidnightUtcForDate(dateStr, explicitTimeZone);
}

/**
 * @deprecated Use getTodayMidnightUtc from locale-calendar.server.js
 * @param {Date} [referenceDate]
 * @param {unknown} [explicitTimeZone]
 */
export function getTodayIsraelMidnightUtc(referenceDate = new Date(), explicitTimeZone) {
  return getTodayMidnightUtc(referenceDate, explicitTimeZone);
}

/**
 * @deprecated Use getMonthBounds from locale-calendar.server.js
 * @param {Date} [referenceDate]
 * @param {unknown} [explicitTimeZone]
 */
export function getIsraelMonthBounds(referenceDate = new Date(), explicitTimeZone) {
  const b = getMonthBounds(referenceDate, explicitTimeZone);
  return { startIso: b.startIso, endIso: b.endIso, ym: b.ym };
}

/**
 * @deprecated Use isInCurrentMonth from locale-calendar.server.js
 */
export function isInCurrentIsraelMonth(isoTimestamp, referenceDate = new Date(), explicitTimeZone) {
  return isInCurrentMonth(isoTimestamp, referenceDate, explicitTimeZone);
}

/**
 * @deprecated Use getPreviousYearMonth from locale-calendar.server.js
 */
export function getPreviousIsraelYearMonth(referenceDate = new Date(), explicitTimeZone) {
  return getPreviousYearMonth(referenceDate, explicitTimeZone);
}

/**
 * @deprecated Use isFirstCalendarDay from locale-calendar.server.js
 */
export function isFirstIsraelCalendarDay(referenceDate = new Date(), explicitTimeZone) {
  return isFirstCalendarDay(referenceDate, explicitTimeZone);
}

/**
 * @deprecated Use getMonthBoundsForYearMonth from locale-calendar.server.js
 */
export function getIsraelMonthBoundsForYearMonth(ym, explicitTimeZone) {
  const b = getMonthBoundsForYearMonth(ym, explicitTimeZone);
  return { startIso: b.startIso, endIso: b.endIso, ym: b.ym };
}

export { resolveCalendarTimeZone };
