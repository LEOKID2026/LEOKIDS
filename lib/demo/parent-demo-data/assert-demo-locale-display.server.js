const HEBREW_CHAR_RE = /[\u0590-\u05FF]/;

/**
 * Scan parent-facing demo strings for forbidden Hebrew characters (global guard).
 * @param {unknown} payload
 * @returns {{ ok: boolean, issues: string[] }}
 */
export function assertDemoPayloadLocaleDisplay(payload) {
  /** @type {string[]} */
  const issues = [];
  const pf = payload?.parentFacing;
  if (pf && typeof pf === "object") {
    for (const key of ["insights", "homeRecommendations"]) {
      const arr = pf[key];
      if (!Array.isArray(arr)) continue;
      for (const line of arr) {
        const s = String(line || "");
        if (HEBREW_CHAR_RE.test(s)) issues.push(`${key}:hebrew_leak`);
      }
    }
  }

  const activities = payload?.parentAssignedActivitiesInPeriod;
  if (Array.isArray(activities)) {
    for (const row of activities) {
      const title = String(row?.title || "");
      if (HEBREW_CHAR_RE.test(title)) issues.push("activity:title_hebrew");
    }
  }

  return { ok: issues.length === 0, issues };
}

/**
 * @param {unknown} payload
 */
export function enforceDemoPayloadLocaleDisplay(payload) {
  const check = assertDemoPayloadLocaleDisplay(payload);
  if (!check.ok && process.env.NODE_ENV !== "production") {
    console.warn("[parent-demo] locale display check:", check.issues.slice(0, 5));
  }
  return payload;
}
