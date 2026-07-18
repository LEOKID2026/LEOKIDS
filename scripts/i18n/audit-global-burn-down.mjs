/**
 * Audit global-burn-down content packs + runtime consumers.
 * Run: node scripts/i18n/audit-global-burn-down.mjs [--write-report]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packDir = path.join(root, "content-packs/en/global-burn-down");
const indexPath = path.join(packDir, "burn-down-index.json");
const reportPath = path.join(root, "tmp/i18n/global-burn-down-audit.json");
const helperPath = path.join(root, "lib/i18n/global-burn-down-copy.js");

/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const warnings = [];

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

function walkJsFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      walkJsFiles(abs, out);
      continue;
    }
    if (/\.(js|jsx|mjs|cjs|ts|tsx)$/.test(ent.name)) out.push(abs);
  }
  return out;
}

function collectGlobalBurnDownCalls() {
  /** @type {Array<{ file: string, slug: string, key: string, line: number }>} */
  const calls = [];
  const re = /globalBurnDownCopy\s*\(\s*["'`]([^"'`]+)["'`]\s*,\s*["'`]([^"'`]+)["'`]/g;
  for (const abs of walkJsFiles(root)) {
    const rel = path.relative(root, abs).replace(/\\/g, "/");
    if (rel.startsWith("scripts/i18n/audit-global-burn-down.mjs")) continue;
    const src = fs.readFileSync(abs, "utf8");
    if (!src.includes("globalBurnDownCopy")) continue;
    let m;
    while ((m = re.exec(src))) {
      const line = src.slice(0, m.index).split("\n").length;
      calls.push({ file: rel, slug: m[1], key: m[2], line });
    }
  }
  return calls;
}

function sampleOwnersFromIndex(index) {
  const slugs = Object.keys(index || {});
  const byPrefix = new Map();
  for (const slug of slugs) {
    const owner = slug.split("__")[0] || slug;
    if (!byPrefix.has(owner)) byPrefix.set(owner, []);
    byPrefix.get(owner).push(slug);
  }
  /** @type {Record<string, string[]>} */
  const samples = {};
  for (const [owner, list] of byPrefix) {
    samples[owner] = list.slice(0, 3);
  }
  return samples;
}

const index = readJson(indexPath, "burn-down-index.json");
if (index) {
  const slugs = Object.keys(index);
  if (slugs.length === 0) errors.push("burn-down-index.json is empty");

  /** @type {Set<string>} */
  const compositeKeys = new Set();

  for (const slug of slugs) {
    const pack = index[slug];
    if (!pack || typeof pack !== "object") {
      errors.push(`${slug}: index entry must be an object`);
      continue;
    }
    for (const [key, val] of Object.entries(pack)) {
      const composite = `${slug}::${key}`;
      if (compositeKeys.has(composite)) errors.push(`duplicate composite key: ${composite}`);
      compositeKeys.add(composite);

      if (typeof val !== "string") {
        errors.push(`${slug}/${key}: non-string value`);
        continue;
      }
      if (!val.trim()) errors.push(`${slug}/${key}: empty string value`);
      if (val === key) warnings.push(`${slug}/${key}: value equals key (possible placeholder)`);
      if (/<script/i.test(val)) errors.push(`${slug}/${key}: unsafe HTML`);
      if (/[\u0590-\u05FF]/.test(val)) {
        warnings.push(`${slug}/${key}: Hebrew characters in en global-burn-down pack`);
      }
      if (/\{[a-zA-Z_]+\s*,\s*plural/.test(val) && !/\bother\s*\{/.test(val)) {
        errors.push(`${slug}/${key}: ICU plural missing other arm`);
      }
    }
  }

  const orphanFiles = fs.existsSync(packDir)
    ? fs.readdirSync(packDir).filter((f) => f.endsWith(".json") && f !== "burn-down-index.json")
    : [];
  if (orphanFiles.length > 0) {
    warnings.push(`standalone pack files present but index is monolithic: ${orphanFiles.join(", ")}`);
  }
}

if (!fs.existsSync(helperPath)) {
  errors.push("missing lib/i18n/global-burn-down-copy.js");
} else {
  const helperSrc = fs.readFileSync(helperPath, "utf8");
  if (!helperSrc.includes("globalBurnDownIndex")) {
    errors.push("global-burn-down-copy.js does not import burn-down-index.json");
  }
  if (/return\s+String\(key\s*\|\|\s*["'`]["'`]\)/.test(helperSrc)) {
    warnings.push("globalBurnDownCopy falls back to raw key when missing — verify no missing keys");
  }
}

const calls = collectGlobalBurnDownCalls();
for (const call of calls) {
  const pack = index?.[call.slug];
  const val = pack?.[call.key];
  if (!pack) errors.push(`consumer references missing slug ${call.slug} (${call.file}:${call.line})`);
  else if (!(call.key in pack)) {
    errors.push(`consumer references missing key ${call.slug}/${call.key} (${call.file}:${call.line})`);
  } else if (typeof val !== "string" || !val.trim()) {
    errors.push(`consumer resolves to empty copy ${call.slug}/${call.key} (${call.file}:${call.line})`);
  }
}

/** Spot-check pseudo locale transform on sample pack string */
let pseudoSampleOk = true;
try {
  const { applyPseudoLong } = await import(
    pathToFileURL(path.join(root, "lib/i18n/message-format.js")).href
  );
  const sampleSlug = Object.keys(index || {})[0];
  const sampleKey = sampleSlug ? Object.keys(index[sampleSlug] || {})[0] : null;
  if (sampleSlug && sampleKey) {
    const en = index[sampleSlug][sampleKey];
    const xa = applyPseudoLong(en);
    if (xa === en) {
      warnings.push(`pseudo en-XA did not transform sample ${sampleSlug}/${sampleKey}`);
      pseudoSampleOk = false;
    }
  }
} catch (err) {
  warnings.push(`pseudo locale spot-check skipped: ${err?.message || err}`);
  pseudoSampleOk = false;
}

const result = {
  executedAt: new Date().toISOString(),
  status: errors.length === 0 ? "PASS" : "FAIL",
  indexSlugCount: index ? Object.keys(index).length : 0,
  consumerCallCount: calls.length,
  errorCount: errors.length,
  warningCount: warnings.length,
  errors,
  warnings: warnings.slice(0, 50),
  ownerSamples: index ? sampleOwnersFromIndex(index) : {},
  pseudoLocaleSampleOk: pseudoSampleOk,
};

if (process.argv.includes("--write-report") || true) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2), "utf8");
}

console.log(`audit-global-burn-down: ${result.status} (${errors.length} errors, ${warnings.length} warnings)`);
if (errors.length) {
  for (const e of errors.slice(0, 20)) console.error("  ERROR:", e);
  process.exitCode = 2;
}
