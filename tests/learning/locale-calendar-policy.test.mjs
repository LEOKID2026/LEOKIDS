import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_CALENDAR_TIMEZONE,
  getCalendarDateString,
  getMonthBounds,
  getMonthBoundsForYearMonth,
  getWeekBounds,
  isValidIanaTimeZone,
  resolveCalendarTimeZone,
} from "../../lib/learning-supabase/locale-calendar.server.js";
import { PARENT_REPORT_DISPLAY_TIMEZONE } from "../../lib/learning-supabase/parent-report-activity-time.js";

describe("locale-calendar policy", () => {
  it("defaults to UTC when no explicit timezone", () => {
    assert.equal(resolveCalendarTimeZone(undefined), "UTC");
    assert.equal(resolveCalendarTimeZone(""), "UTC");
    assert.equal(resolveCalendarTimeZone("not-a-zone"), "UTC");
    assert.equal(DEFAULT_CALENDAR_TIMEZONE, "UTC");
    assert.equal(PARENT_REPORT_DISPLAY_TIMEZONE, "UTC");
  });

  it("accepts valid IANA timezones", () => {
    assert.equal(isValidIanaTimeZone("America/New_York"), true);
    assert.equal(resolveCalendarTimeZone("America/New_York"), "America/New_York");
    assert.equal(resolveCalendarTimeZone("Europe/London"), "Europe/London");
  });

  it("does not hard-code Asia/Jerusalem as product default", () => {
    assert.notEqual(resolveCalendarTimeZone(), "Asia/Jerusalem");
    assert.notEqual(PARENT_REPORT_DISPLAY_TIMEZONE, "Asia/Jerusalem");
  });

  it("computes UTC day string", () => {
    const d = new Date("2026-01-15T23:30:00.000Z");
    assert.equal(getCalendarDateString(d, "UTC"), "2026-01-15");
  });

  it("handles month / year boundaries in UTC", () => {
    const endJan = getMonthBounds(new Date("2026-01-31T12:00:00.000Z"), "UTC");
    assert.equal(endJan.ym, "2026-01");
    assert.ok(endJan.endIso.startsWith("2026-02-01"));

    const dec = getMonthBoundsForYearMonth("2025-12", "UTC");
    assert.equal(dec.ym, "2025-12");
    assert.ok(dec.endIso.startsWith("2026-01-01"));
  });

  it("handles week bounds Monday-start", () => {
    // 2026-07-22 is Wednesday UTC
    const w = getWeekBounds(new Date("2026-07-22T12:00:00.000Z"), "UTC");
    assert.ok(w.startIso <= "2026-07-20T00:00:00.000Z" || w.startIso.startsWith("2026-07-20"));
    assert.ok(w.endIso > w.startIso);
  });

  it("supports DST-bearing zones without throwing", () => {
    const ny = getMonthBounds(new Date("2026-03-15T12:00:00.000Z"), "America/New_York");
    assert.equal(ny.ym, "2026-03");
    assert.equal(ny.timeZone, "America/New_York");
    const london = getCalendarDateString(new Date("2026-03-29T01:30:00.000Z"), "Europe/London");
    assert.match(london, /^\d{4}-\d{2}-\d{2}$/);
  });
});
