/**
 * Classify working tree for Arabic Master closure commit.
 * Writes artifacts/i18n/_closure-stage-buckets.json + include list.
 */
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();

function sh(cmd) {
  return execSync(cmd, { encoding: "utf8", cwd: ROOT }).trim();
}

const modified = [
  ...sh("git diff --name-only").split(/\r?\n/),
  ...sh("git diff --name-only --cached").split(/\r?\n/),
].filter(Boolean);

const untracked = sh("git ls-files --others --exclude-standard").split(/\r?\n/).filter(Boolean);

function classify(f) {
  f = f.replace(/\\/g, "/");
  if (
    f.startsWith(".tmp-") ||
    f.startsWith("tmp-") ||
    f.includes("/tmp-") ||
    f.startsWith(".next/") ||
    f.startsWith("node_modules/") ||
    f.startsWith("android/build/") ||
    f === "_w4_audit.json" ||
    /^artifacts\/i18n\/memory-diag-/.test(f) ||
    /^artifacts\/i18n\/memory-ready/.test(f) ||
    f === "artifacts/i18n/tmp-memory-ready-diagnose.mjs" ||
    /^artifacts\/language-switcher-hud\//.test(f) ||
    /_mt-cache-ar-001/.test(f) ||
    f === "artifacts/i18n/ar-001-brand-warnings-raw.json" ||
    f === "artifacts/i18n/_closure-stage-buckets.json" ||
    f === "artifacts/i18n/_closure-stage-include.txt" ||
    f.endsWith(".log")
  ) {
    return "D";
  }

  if (
    f.startsWith("tests/e2e/ar-001") ||
    f.startsWith("tests/e2e/helpers/ar-001") ||
    f.startsWith("tests/unit/ar-001") ||
    f === "tests/fixtures/agent4-surface-selectors.mjs" ||
    f.startsWith("scripts/i18n/") ||
    f.startsWith("artifacts/i18n/ar-001-") ||
    f.startsWith(".cursor/plans/arabic") ||
    f.startsWith(".cursor/plans/ar-001")
  ) {
    return "C";
  }

  if (f.startsWith("content-packs/en/") || f.startsWith("locales/en/")) return "B";

  if (
    f.startsWith("content-packs/ar-001/") ||
    f.startsWith("locales/ar-001/") ||
    f.startsWith("data/help-center/") ||
    f.startsWith("data/marketing/") ||
    f.startsWith("components/") ||
    f.startsWith("lib/") ||
    f.startsWith("pages/") ||
    f.startsWith("utils/") ||
    f.startsWith("hooks/") ||
    f.startsWith("styles/") ||
    f.startsWith("public/") ||
    f.startsWith("middleware") ||
    f.startsWith("next.config") ||
    /i18n|locale|rtl|LanguageSwitcher|burn-down/i.test(f)
  ) {
    return "A";
  }

  if (
    f.startsWith("docs/reports/") ||
    f.startsWith("scripts/port/") ||
    f === "playwright.parent-demo.config.ts" ||
    f === "tests/e2e/parent-portal-demo-acceptance.spec.ts"
  ) {
    return "E";
  }

  return "E";
}

const buckets = { A: [], B: [], C: [], D: [], E: [] };
const all = [...new Set([...modified, ...untracked].map((f) => f.replace(/\\/g, "/")))];
for (const f of all) {
  if (!f || !existsSync(join(ROOT, f))) continue;
  buckets[classify(f)].push(f);
}
for (const k of Object.keys(buckets)) buckets[k].sort();

const include = [...buckets.A, ...buckets.B, ...buckets.C];
mkdirSync(join(ROOT, "artifacts/i18n"), { recursive: true });
const out = {
  counts: Object.fromEntries(Object.entries(buckets).map(([k, v]) => [k, v.length])),
  unclassified: 0,
  includeCount: include.length,
  E: buckets.E,
  D_count: buckets.D.length,
  D_prefixes: (() => {
    const m = {};
    for (const f of buckets.D) {
      const p = f.split("/")[0];
      m[p] = (m[p] || 0) + 1;
    }
    return m;
  })(),
};
writeFileSync(join(ROOT, "artifacts/i18n/_closure-stage-buckets.json"), JSON.stringify(out, null, 2) + "\n");
writeFileSync(join(ROOT, "artifacts/i18n/_closure-stage-include.txt"), include.join("\n") + "\n");

console.log(JSON.stringify(out.counts, null, 2));
console.log("include=", include.length);
console.log("D=", buckets.D.length);
console.log("E unrelated (" + buckets.E.length + "):");
for (const f of buckets.E) console.log(" ", f);
