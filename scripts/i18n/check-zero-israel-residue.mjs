#!/usr/bin/env node
/**
 * ZERO_ISRAEL_RESIDUE gate for LEO-KIDS-GLOBAL (active product paths).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const SCAN_ROOTS = [
  "lib",
  "pages",
  "components",
  "content-packs",
  "supabase/migrations",
  "data/coloring",
  "data/subject-permissions",
  "scripts/i18n",
  "tests/rewards",
  "tests/i18n",
];

const SKIP_DIR = new Set([
  ".git",
  "node_modules",
  ".next",
  "coverage",
  "dist",
  "build",
  "tmp",
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
  ".sql",
]);

/** Forbidden identifier / catalog tokens (not bare English holiday words in prose). */
const FORBIDDEN_RES =
  /\b(?:israeli-holidays|moledet_geography|moledet-geography|achievement_hebrew_star|achievement_moledet_explorer|event_hanukkah|event_independence_day|event_purim|event_rosh_hashana|event_shavuot|event_sukkot|event_lag_baomer|event_passover|event_tu_bishvat|hebrew_star|hebrew-subject|hebrew_questions|israel-curriculum|requirementHe|lockMessageHe|descriptionHe|nameHe|seriesNameHe)\b|\(['"]moledet['"]|\bmoledet\b/g;

const VALIDATOR_ALLOW = new Set([
  "scripts/i18n/check-zero-israel-residue.mjs",
  "scripts/i18n/check-zero-hebrew-repository.mjs",
  "scripts/i18n/check-global-card-root-a-gates.mjs",
  "scripts/i18n/crawl-global-cards-zero-hebrew.mjs",
  "scripts/i18n/ui-crawl-student-cards.mjs",
  "scripts/i18n/scan-hebrew-runtime-markers.mjs",
  "scripts/i18n/scan-israeli-subject-ids.mjs",
  "scripts/i18n/_scan-he-gate-hits.mjs",
  "lib/rewards/global-card-scope.js",
  "lib/rewards/canonical-global-card-manifest.js",
  "lib/rewards/reward-pack-copy.js",
  "tests/rewards/global-reward-no-hebrew.test.mjs",
  "tests/i18n/english-report-israeli-residue.test.mjs",
  "tests/i18n/global-product-zero-hebrew-runtime.test.mjs",
  "tests/i18n/global-product-no-hebrew.test.mjs",
  "tests/i18n/global-card-copy-resolver.test.mjs",
  "tests/i18n/germanic-russian-israeli-residue-cleanup.test.mjs",
  "tests/i18n/romance-locales-israeli-residue-cleanup.test.mjs",
  "tests/i18n/english-country-local-residue-cleanup.test.mjs",
  "tests/i18n/english-country-wave3-shared-corrections.test.mjs",
]);

/**
 * Platform Admin (internal Hebrew/RTL) — do not strip or fail Israel/Hebrew residue inside these paths.
 * Exact Admin surface only; public product paths remain fully gated.
 */
const ADMIN_PATH_PREFIXES = [
  "components/admin/",
  "pages/admin/",
  "pages/api/admin/",
  "lib/admin-portal/",
  "lib/admin-server/",
  "tests/admin/",
  "data/admin-video-builder/",
  "docs/admin/",
  "scripts/admin-portal/",
  "tests/auth/admin-",
];

const ADMIN_PATH_EXACT = new Set([
  "lib/rewards/server/admin-card-rules.server.js",
  "lib/rewards/server/diamond-admin.server.js",
  // Shared modules imported only by Admin (public portals use the English .js twins).
  "lib/auth/auth-registration.he.js",
  "lib/teacher-portal/teacher-ui.he.js",
  "scripts/admin-analytics-hebrew-copy-guard.mjs",
  "scripts/admin-video-builder-owner-flow.mjs",
  "scripts/admin-video-builder-archive-old-projects.mjs",
  "scripts/tests/admin-analytics-selftest.mjs",
  "scripts/tests/admin-analytics-web-traffic-selftest.mjs",
  "scripts/tests/verify-school-student-admin-profile-post-sql.mjs",
  "tests/rewards/admin-student-economy-parity.test.mjs",
  "tests/rewards/card-catalog-admin-parity.test.mjs",
  "tests/auth/admin-account-fixes-matrix.mjs",
  "tests/auth/admin-all-accounts-matrix.mjs",
  "tests/auth/admin-lifecycle-matrix.mjs",
  "tests/auth/admin-user-delete-matrix.mjs",
  "__tests__/school/admin-profile.test.js",
]);

function isAdminExemptPath(rel) {
  if (ADMIN_PATH_EXACT.has(rel)) return true;
  for (const prefix of ADMIN_PATH_PREFIXES) {
    if (rel.startsWith(prefix)) return true;
  }
  if (/^scripts\/admin[^/]*\.mjs$/.test(rel)) return true;
  if (/^scripts\/tests\/admin[^/]*\.mjs$/.test(rel)) return true;
  return false;
}

function isValidatorPath(rel) {
  if (VALIDATOR_ALLOW.has(rel)) return true;
  // Locale layer residue tests that assert absence of Israel keys
  if (/^tests\/i18n\/(en|fr|es|pt|de|ru)-[A-Z]{2}-content-layer\.test\.mjs$/.test(rel)) {
    return true;
  }
  if (/israeli-residue|zero-hebrew|no-hebrew|israel-residue/i.test(rel)) return true;
  return false;
}

const HE_COL_ASSIGN =
  /\b(?:name|description|label|text|title|display_name|requirement_text)_he\s*=\s*'((?:''|[^'])+)'/i;

const HE_RUNTIME_PROP =
  /\b(?:name_he|description_he|label_he|text_he|title_he|display_name_he|requirement_text_he)\b/;

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
      if (EXT.has(ext)) out.push(full);
    }
  }
  return out;
}

function toPosix(abs) {
  return path.relative(ROOT, abs).split(path.sep).join("/");
}

const failures = [];
const files = [];
for (const root of SCAN_ROOTS) {
  const abs = path.join(ROOT, root);
  if (fs.existsSync(abs)) walk(abs, files);
}

for (const abs of files) {
  const rel = toPosix(abs);
  if (isAdminExemptPath(rel)) continue;
  const text = fs.readFileSync(abs, "utf8");
  const lines = text.split(/\r?\n/);
  const isValidator = isValidatorPath(rel);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    FORBIDDEN_RES.lastIndex = 0;
    if (FORBIDDEN_RES.test(line)) {
      if (!isValidator) {
        failures.push({
          type: "israel_token",
          file: rel,
          line: i + 1,
          sample: line.trim().slice(0, 140),
        });
      }
    }

    if (rel.startsWith("supabase/migrations/") && HE_COL_ASSIGN.test(line)) {
      if (!/\btext\s+not null\b|\btext\s+null\b|create table|comment on/i.test(line)) {
        failures.push({
          type: "he_column_seed_write",
          file: rel,
          line: i + 1,
          sample: line.trim().slice(0, 140),
        });
      }
    }

    if (
      (rel.startsWith("lib/") ||
        rel.startsWith("pages/") ||
        rel.startsWith("components/")) &&
      /\.(js|jsx|mjs|ts|tsx)$/.test(rel) &&
      HE_RUNTIME_PROP.test(line)
    ) {
      if (
        /\/\/|\/\*|Never reads|must not|forbid|ban|legacy column|stripLegacy|does not read|_he columns left empty/i.test(
          line
        )
      ) {
        continue;
      }
      // Empty legacy-column writes are allowed (schema NOT NULL); product copy is not.
      if (/_he\s*[:=]\s*["']["']/.test(line)) continue;
      failures.push({
        type: "he_runtime_field",
        file: rel,
        line: i + 1,
        sample: line.trim().slice(0, 140),
      });
    }
  }
}

const migHits = {
  israeliHolidaySeedRows: 0,
  moledetSeedRows: 0,
  hebrewSubjectSeedRows: 0,
  israelOnlyCardSeedRows: 0,
  englishTextIntoHeFields: 0,
};
for (const abs of walk(path.join(ROOT, "supabase/migrations"))) {
  const rel = toPosix(abs);
  if (!rel.endsWith(".sql")) continue;
  const text = fs.readFileSync(abs, "utf8");
  if (text.includes("israeli-holidays")) migHits.israeliHolidaySeedRows++;
  if (/insert into[\s\S]{0,800}'moledet'/i.test(text)) migHits.moledetSeedRows++;
  if (
    /insert into public\.subject_permission_catalog[\s\S]{0,400}'hebrew'/i.test(text)
  ) {
    migHits.hebrewSubjectSeedRows++;
  }
  for (const k of [
    "event_hanukkah",
    "achievement_hebrew_star",
    "achievement_moledet_explorer",
    "event_lag_baomer",
    "event_purim",
    "event_passover",
    "event_rosh_hashana",
    "event_shavuot",
    "event_sukkot",
    "event_independence_day",
    "event_tu_bishvat",
  ]) {
    if (new RegExp(`'${k}'`).test(text)) migHits.israelOnlyCardSeedRows++;
  }
  for (const line of text.split(/\n/)) {
    if (HE_COL_ASSIGN.test(line) && !/\btext\s+(not )?null\b/i.test(line)) {
      migHits.englishTextIntoHeFields++;
    }
  }
}

const reportPath = path.join(
  process.env.TEMP || "/tmp",
  "leo-kids-global-audits",
  "zero-israel-residue-failures.json"
);
try {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify({ failures, migHits }, null, 2));
} catch {
  /* ignore */
}

if (failures.length) {
  console.error("ZERO_ISRAEL_RESIDUE_GATE_FAIL", failures.length);
  console.error(JSON.stringify(failures.slice(0, 40), null, 2));
  if (failures.length > 40) console.error(`... +${failures.length - 40} more (full: ${reportPath})`);
  console.error("fresh_migration_semantic", migHits);
  process.exit(1);
}

if (
  migHits.israeliHolidaySeedRows ||
  migHits.moledetSeedRows ||
  migHits.hebrewSubjectSeedRows ||
  migHits.israelOnlyCardSeedRows ||
  migHits.englishTextIntoHeFields
) {
  console.error("Fresh migration semantic scan = FAIL", migHits);
  process.exit(1);
}

console.log("ZERO_ISRAEL_RESIDUE_GATE_OK");
console.log("Fresh migration semantic scan = OK");
console.log(JSON.stringify(migHits));
process.exit(0);
