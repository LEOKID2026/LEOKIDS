#!/usr/bin/env node
/**
 * Repository-wide zero-Hebrew / zero-Israel-residue gate for LEO-KIDS-GLOBAL.
 * Scans all first-party sources (not CERTIFIED_FILES-only).
 *
 * Fails on:
 * 1. Literal Hebrew Unicode in first-party files
 * 2. Active product API field names ending He / _he (excluding narrow validator allow-lines)
 * 3. Forbidden Israel-only card keys inside content-packs catalogs
 * 4. Hebrew locale / he-IL fallback registration in locale-registry
 * 5. Remaining *.he.js / *.he.json companions
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const HE = /[\u0590-\u05FF\uFB1D-\uFB4F]/;
const SKIP_DIR = new Set([
  ".git",
  "node_modules",
  ".next",
  "coverage",
  ".turbo",
  "dist",
  "build",
  ".vercel",
  "playwright-report",
  "test-results",
  "tmp",
  "exports",
  "artifacts",
]);
const EXT = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".json",
  ".md",
  ".mdx",
  ".yml",
  ".yaml",
  ".sql",
  ".html",
  ".css",
  ".scss",
  ".txt",
  ".csv",
  ".webmanifest",
  ".mdc",
]);

const FORBIDDEN_CARD_KEYS = [
  "achievement_hebrew_star",
  "achievement_moledet_explorer",
  "event_hanukkah",
  "event_independence_day",
  "event_purim",
  "event_rosh_hashana",
  "event_shavuot",
  "event_sukkot",
  "event_lag_baomer",
  "event_passover",
  "event_tu_bishvat",
];

/** Exact relative paths allowed to contain HE detection regex source only (escaped preferred). */
const VALIDATOR_PATH_ALLOW = new Set([
  "scripts/i18n/check-zero-hebrew-repository.mjs",
  "scripts/i18n/zero-hebrew-first-party.mjs",
  "scripts/i18n/check-hebrew-runtime-scan.mjs",
  "scripts/i18n/strip-hebrew-from-migrations.mjs",
  "lib/rewards/reward-card-global-display.js",
  "lib/rewards/global-card-scope.js",
]);

function walk(dir, out = []) {
  let ents;
  try {
    ents = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of ents) {
    if (SKIP_DIR.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out);
    else if (ent.isFile()) {
      const ext = path.extname(ent.name).toLowerCase();
      if (EXT.has(ext) || ent.name.endsWith(".mdc")) out.push(full);
    }
  }
  return out;
}

function toPosix(abs) {
  return path.relative(ROOT, abs).split(path.sep).join("/");
}

const failures = [];

for (const abs of walk(ROOT)) {
  const rel = toPosix(abs);
  if (/\.he\.(js|jsx|ts|tsx|mjs|cjs|json)$/i.test(rel)) {
    failures.push({ type: "he_companion", file: rel });
    continue;
  }
  let text;
  try {
    text = fs.readFileSync(abs, "utf8");
  } catch {
    continue;
  }
  if (HE.test(text)) {
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      if (!HE.test(lines[i])) continue;
      // Narrow allow: only validator detection mechanism lines inside allowlisted files
      if (
        VALIDATOR_PATH_ALLOW.has(rel) &&
        (/HEBREW|\\u0590|\\u05FF|\\uFB1D|\\uFB4F|hasHebrew|isHebrew/.test(lines[i]) ||
          /\[\\u0590/.test(lines[i]))
      ) {
        continue;
      }
      failures.push({
        type: "hebrew_unicode",
        file: rel,
        line: i + 1,
        sample: lines[i].trim().slice(0, 120),
      });
    }
  }

  if (rel.startsWith("content-packs/") && rel.endsWith("card-catalog.json")) {
    for (const key of FORBIDDEN_CARD_KEYS) {
      if (text.includes(`"${key}"`)) {
        failures.push({ type: "israel_card_key", file: rel, key });
      }
    }
  }
}

// Locale registry must not register Hebrew
const registryPath = path.join(ROOT, "lib/i18n/locale-registry.js");
if (fs.existsSync(registryPath)) {
  const reg = fs.readFileSync(registryPath, "utf8");
  if (/\bid\s*:\s*["']he["']/.test(reg) || /["']he-IL["']/.test(reg) || /["']iw-IL["']/.test(reg)) {
    failures.push({ type: "hebrew_locale_registry", file: "lib/i18n/locale-registry.js" });
  }
}

// Active product path must not import deleted Israel resolver / HE requirement builder
const productGlobs = ["lib/rewards", "pages/api/demo/cards", "pages/api/student/rewards", "components/student"];
for (const abs of walk(ROOT)) {
  const rel = toPosix(abs);
  if (!productGlobs.some((p) => rel.startsWith(p))) continue;
  if (!/\.(js|jsx|mjs)$/.test(rel)) continue;
  const text = fs.readFileSync(abs, "utf8");
  if (/resolveIsraelCardCopy|buildCardRequirementHe|card-requirement-he\.server/.test(text)) {
    failures.push({ type: "hebrew_resolver_residue", file: rel });
  }
  // API payload field names
  if (/requirementHe|lockMessageHe|descriptionHe|nameHe|seriesNameHe/.test(text)) {
    // allow comments mentioning ban?
    const lines = text.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!/requirementHe|lockMessageHe|descriptionHe|nameHe|seriesNameHe/.test(line)) continue;
      if (/\/\/|\/\*|\*|ban|forbid|must not|never|removed|doesNotMatch|assert\./i.test(line)) continue;
      failures.push({ type: "he_field_identifier", file: rel, line: i + 1, sample: line.trim().slice(0, 120) });
    }
  }
}

if (failures.length) {
  console.error("ZERO_HEBREW_GATE_FAIL", failures.length);
  console.error(JSON.stringify(failures.slice(0, 80), null, 2));
  if (failures.length > 80) console.error(`... +${failures.length - 80} more`);
  process.exit(1);
}

console.log("ZERO_HEBREW_GATE_OK");
process.exit(0);
