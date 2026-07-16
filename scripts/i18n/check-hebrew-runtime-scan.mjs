#!/usr/bin/env node
/**
 * Scan active source for Hebrew code points outside allowlisted paths.
 * Exemptions shrink over time as surfaces are localized.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");

const HEBREW_RE = /[\u0590-\u05FF]/;
const EXT = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);

/** Paths relative to repo root that may still contain Hebrew during migration. */
const ALLOW_PREFIXES = [
  "docs/",
  "sql/",
  "supabase/",
  "node_modules/",
  ".next/",
  "coverage/",
  "artifacts/",
  "tmp/",
  "scripts/help-center/",
  "scripts/parent-video-pilot/",
  "scripts/student-video-pilot/",
  "scripts/launch-readiness/",
  "tests/e2e/",
  "utils/", // engines / legacy content — migrate gradually
  "lib/parent-report",
  "lib/parent-copilot",
  "lib/learning",
  "content/",
  "data/",
  "public/help/",
];

/** Foundation paths that must stay Hebrew-free (hard fail). */
const FOUNDATION_ROOTS = ["lib/i18n", "lib/global", "lib/site", "locales"];
/** Broader soft-warn scan (migration in progress). */
const STRICT_ROOTS = ["pages", "components", ...FOUNDATION_ROOTS];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".next" || ent.name.startsWith(".")) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (EXT.has(path.extname(ent.name))) out.push(full);
  }
  return out;
}

function isAllowed(relPosix) {
  return ALLOW_PREFIXES.some((p) => relPosix.startsWith(p));
}

const hits = [];
for (const base of STRICT_ROOTS) {
  const abs = path.join(root, base);
  for (const file of walk(abs)) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (isAllowed(rel)) continue;
    const text = fs.readFileSync(file, "utf8");
    if (!HEBREW_RE.test(text)) continue;
    // allow Hebrew only inside comments that mention migration? — still flag for now
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (HEBREW_RE.test(line) && !line.trim().startsWith("//") && !line.includes("*")) {
        hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 120)}`);
      } else if (HEBREW_RE.test(line) && (line.trim().startsWith("//") || line.includes("*"))) {
        // comments ok during migration
      } else if (HEBREW_RE.test(line)) {
        hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 120)}`);
      }
    });
  }
}

// Re-scan more simply: any Hebrew in string literals of STRICT roots not allowed
const strictHits = [];
for (const base of STRICT_ROOTS) {
  for (const file of walk(path.join(root, base))) {
    const rel = path.relative(root, file).split(path.sep).join("/");
    if (isAllowed(rel)) continue;
    if (rel.startsWith("locales/")) continue;
    const text = fs.readFileSync(file, "utf8");
    if (!HEBREW_RE.test(text)) continue;
    strictHits.push(rel);
  }
}

if (strictHits.length) {
  console.error(`[i18n:hebrew] Hebrew found in ${strictHits.length} active file(s):`);
  for (const h of strictHits.slice(0, 80)) console.error(`  - ${h}`);
  if (strictHits.length > 80) console.error(`  … +${strictHits.length - 80} more`);
  // Soft fail during migration: warn but exit 0 until exemption list shrinks via later commits
  // Hard-fail for brand-new foundation files only
  const foundationOnly = [];
  for (const base of FOUNDATION_ROOTS) {
    for (const file of walk(path.join(root, base))) {
      const rel = path.relative(root, file).split(path.sep).join("/");
      if (rel.endsWith(".he.js")) continue; // legacy shim filenames only
      const text = fs.readFileSync(file, "utf8");
      if (HEBREW_RE.test(text)) foundationOnly.push(rel);
    }
  }
  for (const rel of ["pages/_document.js", "pages/_app.js"]) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) continue;
    if (HEBREW_RE.test(fs.readFileSync(abs, "utf8"))) foundationOnly.push(rel);
  }
  if (foundationOnly.length) {
    console.error("[i18n:hebrew] FAIL: foundation files must not contain Hebrew");
    process.exit(1);
  }
  console.warn("[i18n:hebrew] WARN: legacy surfaces still contain Hebrew (migration in progress)");
  process.exit(0);
}

console.log("[i18n:hebrew] OK — no Hebrew in scanned active roots");
