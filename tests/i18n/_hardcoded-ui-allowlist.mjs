/**
 * Documented runtime allowlist entries for authorized technical exceptions.
 * These are NOT source-directory exclusions (locales/ and content-packs/ are
 * excluded from scan roots entirely and never produce findings).
 *
 * @typedef {{ file: string, line?: number, pattern?: string, reason: string }} HardcodedUiAllowEntry
 */

/** @type {HardcodedUiAllowEntry[]} */
export const HARDCODED_UI_ALLOWLIST = [
  {
    file: "components/Layout.js",
    pattern: "LEO KIDS",
    reason: "Brand wordmark in site header logo text",
  },
  {
    file: "components/Layout.js",
    pattern: "LEO KIDS logo",
    reason: "Logo alt text brand name",
  },
  {
    file: "lib/i18n/locale-registry.js",
    reason: "Locale registry display names are source metadata, not runtime UI copy",
  },
  {
    file: "lib/launch-readiness/compute-launch-row.js",
    reason: "Internal launch-readiness audit notes for ops tooling, not parent/student UI",
  },
  {
    file: "lib/student-client/student-api-legacy-errors.js",
    reason: "Legacy student API error protocol tokens; UI resolves via interface locale keys",
  },
];

/** Source directories intentionally excluded from runtime scan roots. */
export const EXCLUDED_SOURCE_DIRECTORIES = Object.freeze([
  "locales/",
  "content-packs/",
  "docs/",
  "tests/",
  "scripts/",
  "tmp/",
]);

/**
 * @param {string} relPosix
 * @param {HardcodedUiAllowEntry} entry
 */
export function allowlistMatches(relPosix, entry) {
  const file = String(entry.file || "").replace(/\\/g, "/");
  if (file.endsWith("/")) {
    return relPosix.startsWith(file);
  }
  if (relPosix !== file && !relPosix.startsWith(`${file}/`)) {
    return false;
  }
  if (entry.pattern && entry.line) {
    return false;
  }
  return true;
}

/**
 * @param {string} relPosix
 * @param {number} line
 * @param {string} text
 */
export function isAllowlistedFinding(relPosix, line, text) {
  for (const entry of HARDCODED_UI_ALLOWLIST) {
    if (!allowlistMatches(relPosix, entry)) continue;
    if (entry.line && entry.line !== line) continue;
    if (entry.pattern && !String(text || "").includes(entry.pattern)) continue;
    return true;
  }
  return false;
}

/**
 * @param {import("../../scripts/i18n/hardcoded-ui-core.mjs").HardcodedFinding[]} findings
 */
export function countAllowlistedFindings(findings) {
  return findings.filter((f) => isAllowlistedFinding(f.file, f.line, f.text)).length;
}
