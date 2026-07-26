/**
 * Locale-aware calendar helpers for the global product.
 *
 * Policy:
 * 1. If a valid IANA timezone is provided for the user/context — use it.
 * 2. Otherwise use UTC.
 * 3. Demo and production share this resolver.
 * 4. Never hard-code Asia/Jerusalem.
 * 5. Never infer timezone from UI language alone.
 */

export const DEFAULT_CALENDAR_TIMEZONE = "UTC";

/**
 * @param {unknown} timeZone
 * @returns {boolean}
 */
export function isValidIanaTimeZone(timeZone) {
  const tz = String(timeZone || "").trim();
  if (!tz) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz }).format(new Date());
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {unknown} [explicitTimeZone]
 * @returns {string} IANA timezone (never empty)
 */
export function resolveCalendarTimeZone(explicitTimeZone) {
  if (isValidIanaTimeZone(explicitTimeZone)) {
    return String(explicitTimeZone).trim();
  }
  return DEFAULT_CALENDAR_TIMEZONE;
}

/**
 * @param {string} timeZone
 * @param {Date} referenceDate
 */
function parseOffsetMs(timeZone, referenceDate) {
  const offsetPart =
    new Intl.DateTimeFormat("en", {
      timeZone,
      timeZoneName: "shortOffset",
    })
      .formatToParts(referenceDate)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT+0";

  const m = offsetPart.match(/GMT([+-])(\d+)(?::(\d+))?/);
  const sign = m?.[1] === "-" ? -1 : 1;
  const offsetHours = m ? Number(m[2]) : 0;
  const offsetMinutes = m?.[3] ? Number(m[3]) : 0;
  return sign * (offsetHours * 60 + offsetMinutes) * 60_000;
}

/**
 * Calendar date "YYYY-MM-DD" in the resolved timezone.
 * @param {Date} [referenceDate]
 * @param {unknown} [explicitTimeZone]
 */
export function getCalendarDateString(referenceDate = new Date(), explicitTimeZone) {
  const tz = resolveCalendarTimeZone(explicitTimeZone);
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz }).format(referenceDate);
}

/**
 * UTC instant of local midnight for a calendar date in the resolved timezone.
 * @param {string} dateStr YYYY-MM-DD
 * @param {unknown} [explicitTimeZone]
 */
export function getMidnightUtcForDate(dateStr, explicitTimeZone) {
  const tz = resolveCalendarTimeZone(explicitTimeZone);
  const day = String(dateStr || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    throw new Error("invalid_calendar_date");
  }
  const ref = new Date(`${day}T12:00:00Z`);
  const offsetMs = parseOffsetMs(tz, ref);
  return new Date(new Date(`${day}T00:00:00Z`).getTime() - offsetMs);
}

/**
 * UTC instant of today's midnight in the resolved timezone.
 * @param {Date} [referenceDate]
 * @param {unknown} [explicitTimeZone]
 */
export function getTodayMidnightUtc(referenceDate = new Date(), explicitTimeZone) {
  return getMidnightUtcForDate(getCalendarDateString(referenceDate, explicitTimeZone), explicitTimeZone);
}

/**
 * @param {Date} [referenceDate]
 * @param {unknown} [explicitTimeZone]
 * @returns {{ startIso: string, endIso: string, ym: string, timeZone: string }}
 */
export function getMonthBounds(referenceDate = new Date(), explicitTimeZone) {
  const tz = resolveCalendarTimeZone(explicitTimeZone);
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(referenceDate);

  const year = parts.find((p) => p.type === "year")?.value ?? "1970";
  const month = parts.find((p) => p.type === "month")?.value ?? "01";
  const ym = `${year}-${month}`;
  const firstDay = `${year}-${month}-01`;

  const monthNum = parseInt(month, 10);
  const nextYear = monthNum === 12 ? String(parseInt(year, 10) + 1) : year;
  const nextMonth = monthNum === 12 ? "01" : String(monthNum + 1).padStart(2, "0");
  const nextFirstDay = `${nextYear}-${nextMonth}-01`;

  return {
    startIso: getMidnightUtcForDate(firstDay, tz).toISOString(),
    endIso: getMidnightUtcForDate(nextFirstDay, tz).toISOString(),
    ym,
    timeZone: tz,
  };
}

/**
 * @param {string} ym YYYY-MM
 * @param {unknown} [explicitTimeZone]
 */
export function getMonthBoundsForYearMonth(ym, explicitTimeZone) {
  const tz = resolveCalendarTimeZone(explicitTimeZone);
  const m = /^(\d{4})-(\d{2})$/.exec(String(ym || "").trim());
  if (!m) throw new Error("invalid_year_month");
  const year = m[1];
  const month = m[2];
  const monthNum = parseInt(month, 10);
  if (monthNum < 1 || monthNum > 12) throw new Error("invalid_year_month");

  const firstDay = `${year}-${month}-01`;
  const nextYear = monthNum === 12 ? String(parseInt(year, 10) + 1) : year;
  const nextMonth = monthNum === 12 ? "01" : String(monthNum + 1).padStart(2, "0");
  const nextFirstDay = `${nextYear}-${nextMonth}-01`;

  return {
    startIso: getMidnightUtcForDate(firstDay, tz).toISOString(),
    endIso: getMidnightUtcForDate(nextFirstDay, tz).toISOString(),
    ym: `${year}-${month}`,
    timeZone: tz,
  };
}

/**
 * Inclusive start / exclusive end of the local calendar week (Monday-start ISO-like).
 * @param {Date} [referenceDate]
 * @param {unknown} [explicitTimeZone]
 */
export function getWeekBounds(referenceDate = new Date(), explicitTimeZone) {
  const tz = resolveCalendarTimeZone(explicitTimeZone);
  const dateStr = getCalendarDateString(referenceDate, tz);
  const noonUtc = new Date(`${dateStr}T12:00:00Z`);
  // weekday in target TZ: 0=Sun..6=Sat via en-US
  const weekdayName = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    weekday: "short",
  }).format(noonUtc);
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const dow = map[weekdayName] ?? 1;
  const daysFromMonday = (dow + 6) % 7; // Mon=0 ... Sun=6
  const mondayMs = getMidnightUtcForDate(dateStr, tz).getTime() - daysFromMonday * 86_400_000;
  const start = new Date(mondayMs);
  const end = new Date(mondayMs + 7 * 86_400_000);
  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
    timeZone: tz,
  };
}

/**
 * @param {string} isoTimestamp
 * @param {Date} [referenceDate]
 * @param {unknown} [explicitTimeZone]
 */
export function isInCurrentMonth(isoTimestamp, referenceDate = new Date(), explicitTimeZone) {
  if (!isoTimestamp) return false;
  const { startIso, endIso } = getMonthBounds(referenceDate, explicitTimeZone);
  const ts = String(isoTimestamp);
  return ts >= startIso && ts < endIso;
}

/**
 * @param {Date} [referenceDate]
 * @param {unknown} [explicitTimeZone]
 */
export function getPreviousYearMonth(referenceDate = new Date(), explicitTimeZone) {
  const { startIso } = getMonthBounds(referenceDate, explicitTimeZone);
  const prevRef = new Date(new Date(startIso).getTime() - 1);
  return getMonthBounds(prevRef, explicitTimeZone).ym;
}

/**
 * @param {Date} [referenceDate]
 * @param {unknown} [explicitTimeZone]
 */
export function isFirstCalendarDay(referenceDate = new Date(), explicitTimeZone) {
  const day = parseInt(getCalendarDateString(referenceDate, explicitTimeZone).slice(8, 10), 10);
  return day === 1;
}

/**
 * Format an instant for display in the resolved timezone.
 * @param {string|number|Date} value
 * @param {unknown} [explicitTimeZone]
 * @param {Intl.DateTimeFormatOptions} [options]
 */
export function formatInstantInTimeZone(value, explicitTimeZone, options = {}) {
  const tz = resolveCalendarTimeZone(explicitTimeZone);
  const d = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...options,
  }).format(d);
}
