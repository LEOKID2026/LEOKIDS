/**
 * Validate report content packs (burn-down index + per-file packs).
 * Run: node scripts/i18n/validate-report-content-packs.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packDir = path.join(root, "content-packs/en/reports/burn-down");
const indexPath = path.join(root, "content-packs/en/reports/burn-down-index.json");
const reportsContractPath = path.join(root, "locales/en/reports.json");

/** @type {string[]} */
const errors = [];

function readJson(abs, label) {
  if (!fs.existsSync(abs)) {
    errors.push(`missing file: ${label}`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch (err) {
    errors.push(`invalid JSON ${label}: ${err.message}`);
    return null;
  }
}

const index = readJson(indexPath, "burn-down-index.json");
const reportsContract = readJson(reportsContractPath, "locales/en/reports.json");

if (index) {
  const packFiles = fs.existsSync(packDir)
    ? fs.readdirSync(packDir).filter((f) => f.endsWith(".json"))
    : [];

  if (packFiles.length < 30) {
    errors.push(`expected at least 30 burn-down pack files, found ${packFiles.length}`);
  }

  /** @type {Set<string>} */
  const allKeys = new Set();

  for (const file of packFiles) {
    const slug = file.replace(/\.json$/, "");
    const packRaw = readJson(path.join(packDir, file), `burn-down/${file}`);
    if (!packRaw || typeof packRaw !== "object") continue;
    const pack =
      packRaw.copy && typeof packRaw.copy === "object" && !Array.isArray(packRaw.copy)
        ? packRaw.copy
        : packRaw;

    for (const [key, val] of Object.entries(pack)) {
      if (key === "copy") continue;
      if (typeof val !== "string" || !val.trim()) {
        errors.push(`${slug}/${key}: empty or non-string value`);
        continue;
      }
      const composite = `${slug}::${key}`;
      if (allKeys.has(composite)) errors.push(`duplicate key across packs: ${composite}`);
      allKeys.add(composite);

      if (/\{[a-zA-Z_]+\s*,\s*plural/.test(val) && !/\bother\s*\{/.test(val)) {
        errors.push(`${slug}/${key}: ICU plural missing other arm`);
      }
      if (/<script/i.test(val)) errors.push(`${slug}/${key}: unsafe HTML`);
    }

    const indexed = index[slug];
    if (!indexed) errors.push(`burn-down-index missing slug: ${slug}`);
    else {
      for (const key of Object.keys(pack)) {
        if (!(key in indexed)) errors.push(`index missing ${slug}/${key}`);
        else if (indexed[key] !== pack[key]) errors.push(`index drift ${slug}/${key}`);
      }
    }
  }

  for (const slug of Object.keys(index)) {
    const packPath = path.join(packDir, `${slug}.json`);
    if (!fs.existsSync(packPath)) errors.push(`orphan index slug without pack file: ${slug}`);
  }
}

if (reportsContract) {
  if (!reportsContract.contract?.types || !reportsContract.topics) {
    errors.push("locales/en/reports.json missing contract.types or topics");
  }
}

if (errors.length) {
  console.error("validate-report-content-packs FAILED");
  for (const e of errors) console.error(" -", e);
  process.exit(1);
}

const keyCount = index ? Object.values(index).reduce((n, p) => n + Object.keys(p).length, 0) : 0;
console.log(`validate-report-content-packs OK (${Object.keys(index || {}).length} packs, ${keyCount} keys)`);
