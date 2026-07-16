#!/usr/bin/env node
/**
 * Validate locales/en/*.json parse + required namespaces exist.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../..");
const localeDir = path.join(root, "locales", "en");

const REQUIRED = [
  "common",
  "ui",
  "auth",
  "learning",
  "reports",
  "emails",
  "seo",
  "legal",
  "worksheets",
  "games",
  "validation",
];

let failed = false;

if (!fs.existsSync(localeDir)) {
  console.error(`[i18n] missing directory: ${localeDir}`);
  process.exit(1);
}

for (const ns of REQUIRED) {
  const file = path.join(localeDir, `${ns}.json`);
  if (!fs.existsSync(file)) {
    console.error(`[i18n] missing namespace file: ${ns}.json`);
    failed = true;
    continue;
  }
  try {
    const raw = fs.readFileSync(file, "utf8");
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      console.error(`[i18n] ${ns}.json must be a JSON object`);
      failed = true;
    }
  } catch (e) {
    console.error(`[i18n] invalid JSON in ${ns}.json:`, e.message);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`[i18n] locale bundles OK (${REQUIRED.length} namespaces)`);
