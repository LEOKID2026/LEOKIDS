/**
 * Daily window helpers for coloring upload AI quotas.
 * Uses locale-calendar (explicit IANA timezone or UTC).
 */

import {
  getCalendarDateString,
  getMidnightUtcForDate,
} from "../learning-supabase/locale-calendar.server.js";

export const COLORING_UPLOAD_AI_USER_DAILY_LIMIT = 10;
export const COLORING_UPLOAD_AI_GLOBAL_DAILY_LIMIT = 200;

/**
 * @param {Date} [now]
 * @param {unknown} [explicitTimeZone]
 * @returns {string} YYYY-MM-DD
 */
export function getIsraelUsageDateKey(now = new Date(), explicitTimeZone) {
  return getCalendarDateString(now, explicitTimeZone);
}

/**
 * Next local midnight as ISO string.
 * @param {Date} [now]
 * @param {unknown} [explicitTimeZone]
 */
export function getIsraelNextMidnightResetAt(now = new Date(), explicitTimeZone) {
  const dateKey = getIsraelUsageDateKey(now, explicitTimeZone);
  const [year, month, day] = dateKey.split("-").map(Number);
  const nextYmd = new Date(Date.UTC(year, month - 1, day + 1))
    .toISOString()
    .slice(0, 10);
  return getMidnightUtcForDate(nextYmd, explicitTimeZone).toISOString();
}

/**
 * @param {number} used
 * @param {number} limit
 */
export function coloringUploadRemaining(used, limit) {
  return Math.max(0, limit - used);
}
