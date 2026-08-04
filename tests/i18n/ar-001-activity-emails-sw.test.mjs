/**
 * Unit checks for ar-001 activity burn-down + emails namespace parity.
 */
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  bindGlobalBurnDownLocale,
  globalBurnDownCopy,
} from "../../lib/i18n/global-burn-down-copy.js";
import {
  formatStudentActivityCompletionSummaryHe,
} from "../../lib/classroom-activities/student-activity-result-labels.client.js";
import { bindPlatformDisplayLocale, activityModeLabelHe } from "../../lib/platform-ui/display-labels.js";

const ROOT = process.cwd();

function walkKeys(obj, prefix = "", out = []) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return out;
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) walkKeys(v, key, out);
    else out.push(key);
  }
  return out;
}

test("activity burn-down Arabic done + correct keys", () => {
  bindGlobalBurnDownLocale("ar-001");
  assert.match(globalBurnDownCopy("pages__student__activity__[activityId]", "correct"), /[\u0600-\u06FF]/);
  assert.match(globalBurnDownCopy("pages__student__activity__[activityId]", "done_title_activity"), /[\u0600-\u06FF]/);
  assert.match(
    formatStudentActivityCompletionSummaryHe(3, 5),
    /[\u0600-\u06FF]/
  );
});

test("platform activity mode labels bind Arabic", () => {
  bindPlatformDisplayLocale("ar-001");
  assert.match(activityModeLabelHe("quiz"), /[\u0600-\u06FF]/);
});

test("emails namespace key parity en vs ar-001", () => {
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/en/emails.json"), "utf8"));
  const ar = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/ar-001/emails.json"), "utf8"));
  const enKeys = walkKeys(en).sort();
  const arKeys = new Set(walkKeys(ar));
  const missing = enKeys.filter((k) => !arKeys.has(k));
  assert.equal(missing.length, 0, missing.slice(0, 10).join(", "));
  // Sample Arabic subject
  const sample = JSON.stringify(ar);
  assert.match(sample, /[\u0600-\u06FF]/);
});

test("sw.js includes ar-001 offline fallback", () => {
  const sw = fs.readFileSync(path.join(ROOT, "public/sw.js"), "utf8");
  assert.match(sw, /ar-001/);
  assert.match(sw, /offlineFallbackPath/);
  assert.match(sw, /\/ar-001\/offline/);
});
