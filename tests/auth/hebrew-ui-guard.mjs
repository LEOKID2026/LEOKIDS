#!/usr/bin/env node
/**
 * Guard: GLOBAL product must not ship Hebrew companion modules (.he.js) in lib/admin/auth/teacher paths.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const HEBREW = /[\u0590-\u05FF]/;

const REMOVED_HE_MODULES = [
  "lib/admin-portal/admin-ui.he.js",
  "lib/admin-portal/admin-analytics-labels.he.js",
  "lib/admin-portal/admin-rewards-ui.he.js",
  "lib/admin-portal/admin-video-builder-ui.he.js",
  "lib/teacher-portal/teacher-ui.he.js",
  "lib/auth/parent-google-oauth.client.he.js",
  "lib/auth/auth-reset.he.js",
  "lib/auth/auth-password.he.js",
  "lib/auth/auth-registration.he.js",
  "lib/auth/auth-registration-request.server.he.js",
];

const ENGLISH_MODULE_PAIRS = [
  ["lib/admin-portal/admin-ui.js", "lib/admin-portal/admin-ui.he.js"],
  ["lib/admin-portal/admin-analytics-labels.js", "lib/admin-portal/admin-analytics-labels.he.js"],
  ["lib/admin-portal/admin-rewards-ui.js", "lib/admin-portal/admin-rewards-ui.he.js"],
  ["lib/admin-portal/admin-video-builder-ui.js", "lib/admin-portal/admin-video-builder-ui.he.js"],
  ["lib/teacher-portal/teacher-ui.js", "lib/teacher-portal/teacher-ui.he.js"],
  ["lib/auth/auth-reset.js", "lib/auth/auth-reset.he.js"],
  ["lib/auth/auth-registration.js", "lib/auth/auth-registration.he.js"],
  ["lib/auth/auth-password.js", "lib/auth/auth-password.he.js"],
  ["lib/auth/parent-google-oauth.client.js", "lib/auth/parent-google-oauth.client.he.js"],
  ["lib/auth/auth-registration-request.server.js", "lib/auth/auth-registration-request.server.he.js"],
];

const IMPORT_SCAN_DIRS = ["components/admin", "pages/admin", "lib/admin-portal", "lib/auth", "lib/teacher-portal"];

const results = [];

function record(id, ok, detail) {
  results.push({ id, ok, detail });
  console.log(`[${ok ? "PASS" : "FAIL"}] ${id}: ${detail}`);
}

async function readFile(rel) {
  try {
    return await fs.readFile(path.join(ROOT, rel), "utf8");
  } catch {
    return null;
  }
}

async function fileExists(rel) {
  try {
    await fs.access(path.join(ROOT, rel));
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await fs.readdir(path.join(ROOT, dir), { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    const rel = path.join(dir, ent.name).replace(/\\/g, "/");
    if (ent.isDirectory()) await walk(rel, out);
    else if (/\.(js|jsx|mjs|ts|tsx)$/.test(ent.name)) out.push(rel);
  }
  return out;
}

async function main() {
  for (const rel of REMOVED_HE_MODULES) {
    const exists = await fileExists(rel);
    record(`no_he_module_${path.basename(rel)}`, !exists, exists ? "still present" : "removed");
  }

  for (const [en, he] of ENGLISH_MODULE_PAIRS) {
    const enExists = await fileExists(en);
    const heExists = await fileExists(he);
    record(
      `english_module_${path.basename(en)}`,
      enExists && !heExists,
      `${enExists ? "ok" : "missing en"} / he=${heExists}`
    );
    const enSrc = await readFile(en);
    record(
      `english_module_no_hebrew_${path.basename(en)}`,
      enSrc != null && !HEBREW.test(enSrc),
      enSrc == null ? "missing" : HEBREW.test(enSrc) ? "Hebrew in English module" : "ok"
    );
  }

  for (const dir of IMPORT_SCAN_DIRS) {
    const files = await walk(dir);
    for (const rel of files) {
      const src = await readFile(rel);
      if (!src) continue;
      if (/from\s+["'][^"']*\.he\.js["']/.test(src) || /import\s*\([^)]*\.he\.js/.test(src)) {
        record(`no_he_import_${rel}`, false, "imports .he.js");
      }
    }
  }

  const forgotPage = await readFile("pages/auth/forgot-password.js");
  const resetPage = await readFile("pages/auth/reset-password.js");
  record(
    "auth_reset_pages_no_he_import",
    !forgotPage?.includes(".he.js") && !resetPage?.includes(".he.js"),
    "auth pages avoid .he.js"
  );

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\nZero-Hebrew module guard: ${results.length - failed}/${results.length} pass`);
  if (failed) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
