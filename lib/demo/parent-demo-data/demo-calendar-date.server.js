/**
 * Calendar helpers for global parent demo data.
 * Shares the production locale-calendar resolver (UTC default).
 */

import { getCalendarDateString } from "../../learning-supabase/locale-calendar.server.js";

/**
 * @param {Date} [now]
 * @param {unknown} [explicitTimeZone]
 * @returns {string} YYYY-MM-DD
 */
export function todayYmdUtc(now = new Date(), explicitTimeZone) {
  return getCalendarDateString(now, explicitTimeZone);
}

/**
 * @param {string} ymd
 * @returns {boolean}
 */
export function isValidYmd(ymd) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(ymd || ""));
}

/**
 * @param {string} a
 * @param {string} b
 * @returns {number}
 */
export function compareYmd(a, b) {
  return String(a).localeCompare(String(b));
}

/**
 * @param {string} fromYmd
 * @param {string} toYmd
 * @returns {string[]}
 */
export function iterateYmdInclusive(fromYmd, toYmd) {
  if (!isValidYmd(fromYmd) || !isValidYmd(toYmd)) return [];
  if (compareYmd(fromYmd, toYmd) > 0) return [];
  const out = [];
  const cur = new Date(`${fromYmd}T12:00:00.000Z`);
  const end = new Date(`${toYmd}T12:00:00.000Z`);
  while (cur.getTime() <= end.getTime()) {
    out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

/**
 * @param {string} ymd
 * @returns {number} 0=Sun … 6=Sat (UTC calendar day)
 */
export function utcWeekdayIndex(ymd) {
  return new Date(`${ymd}T12:00:00.000Z`).getUTCDay();
}

export function isUtcWeekend(ymd) {
  const wd = utcWeekdayIndex(ymd);
  return wd === 0 || wd === 6;
}

/**
 * ISO timestamp for a deterministic hour on a UTC calendar day.
 * @param {string} ymd
 * @param {number} hourUtc 0-23
 * @param {number} minuteUtc 0-59
 */
export function ymdToUtcIso(ymd, hourUtc = 10, minuteUtc = 0) {
  const hh = String(hourUtc).padStart(2, "0");
  const mm = String(minuteUtc).padStart(2, "0");
  return `${ymd}T${hh}:${mm}:00.000Z`;
}

/**
 * @param {string} ymd
 * @returns {Date}
 */
export function ymdToUtcDate(ymd) {
  return new Date(`${ymd}T00:00:00.000Z`);
}
