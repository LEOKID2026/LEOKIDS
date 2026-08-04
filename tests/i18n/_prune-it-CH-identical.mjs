/**
 * LOCAL prune: remove it-CH leaves identical to corrected it-IT.
 * Preserves Ticino grade/terminology diffs. Does not modify it-IT.
 * Run: node tests/i18n/_prune-it-CH-identical.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LOCALE = "it-CH";
const BASE = "it-IT";

function collectLeaves(obj, prefix = "", map = new Map()) {
  if (typeof obj === "string") {
    map.set(prefix || "(root)", obj);
    return map;
  }
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    for (const [k, v] of Object.entries(obj)) {
      collectLeaves(v, prefix ? `${prefix}.${k}` : k, map);
    }
  }
  return map;
}

/** @param {unknown} obj @param {unknown} base */
function pruneIdentical(obj, base) {
  if (typeof obj === "string") {
    return obj === base ? undefined : obj;
  }
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return obj;
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    const bv = base && typeof base === "object" ? /** @type {any} */ (base)[k] : undefined;
    if (typeof v === "string") {
      if (v !== bv) out[k] = v;
      continue;
    }
    if (v && typeof v === "object" && !Array.isArray(v)) {
      const nested = pruneIdentical(v, bv);
      if (nested && typeof nested === "object" && Object.keys(/** @type {object} */ (nested)).length) {
        out[k] = nested;
      }
    } else if (v !== bv) {
      out[k] = v;
    }
  }
  return out;
}

function isEmpty(obj) {
  if (obj == null) return true;
  if (typeof obj !== "object") return false;
  return Object.keys(obj).length === 0;
}

/** @type {{ file: string, before: number, after: number, removed: number, deleted: boolean }[]} */
const report = [];
let removedTotal = 0;

const targets = [
  "demo/ui.json",
  "rewards/ui.json",
  "books/ui.json",
  "reports/burn-down/components__parent-report-detailed-surface.json",
  "reports/burn-down/utils__parent-report-language__parent-report-display-labels.json",
  "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json",
];

for (const rel of targets) {
  const chPath = path.join(ROOT, "content-packs", LOCALE, rel);
  const itPath = path.join(ROOT, "content-packs", BASE, rel);
  if (!fs.existsSync(chPath)) {
    console.log("skip missing", rel);
    continue;
  }
  const ch = JSON.parse(fs.readFileSync(chPath, "utf8"));
  const it = JSON.parse(fs.readFileSync(itPath, "utf8"));
  const before = collectLeaves(ch).size;
  const pruned = pruneIdentical(ch, it);
  const after = collectLeaves(pruned).size;
  const removed = before - after;
  removedTotal += removed;

  if (isEmpty(pruned)) {
    fs.unlinkSync(chPath);
    report.push({ file: `content-packs/${LOCALE}/${rel}`, before, after: 0, removed, deleted: true });
    console.log("DELETED", rel, `(-${removed})`);
  } else {
    fs.writeFileSync(chPath, `${JSON.stringify(pruned, null, 2)}\n`, "utf8");
    report.push({ file: `content-packs/${LOCALE}/${rel}`, before, after, removed, deleted: false });
    console.log("pruned", rel, `${before} → ${after} (-${removed})`);
  }
}

// locales/common.json
{
  const chPath = path.join(ROOT, "locales", LOCALE, "common.json");
  const itPath = path.join(ROOT, "locales", BASE, "common.json");
  const ch = JSON.parse(fs.readFileSync(chPath, "utf8"));
  const it = JSON.parse(fs.readFileSync(itPath, "utf8"));
  const before = collectLeaves(ch).size;
  const pruned = pruneIdentical(ch, it);
  const after = collectLeaves(pruned).size;
  removedTotal += before - after;
  if (isEmpty(pruned)) {
    fs.unlinkSync(chPath);
    report.push({
      file: `locales/${LOCALE}/common.json`,
      before,
      after: 0,
      removed: before,
      deleted: true,
    });
    console.log("DELETED locales/common.json");
  } else {
    fs.writeFileSync(chPath, `${JSON.stringify(pruned, null, 2)}\n`, "utf8");
    report.push({
      file: `locales/${LOCALE}/common.json`,
      before,
      after,
      removed: before - after,
      deleted: false,
    });
    console.log("pruned locales/common.json", `${before} → ${after}`);
  }
}

// Rebuild burn-down-index from remaining report leaves only
{
  const indexPath = path.join(ROOT, "content-packs", LOCALE, "reports/burn-down-index.json");
  /** @type {Record<string, unknown>} */
  const index = {};
  const leafMap = [
    [
      "utils__parent-report-language__grade-aware-recommendation-templates",
      "reports/burn-down/utils__parent-report-language__grade-aware-recommendation-templates.json",
    ],
    [
      "utils__parent-report-language__parent-report-display-labels",
      "reports/burn-down/utils__parent-report-language__parent-report-display-labels.json",
    ],
    [
      "components__parent-report-detailed-surface",
      "reports/burn-down/components__parent-report-detailed-surface.json",
    ],
  ];
  for (const [slug, rel] of leafMap) {
    const abs = path.join(ROOT, "content-packs", LOCALE, rel);
    if (!fs.existsSync(abs)) continue;
    const pack = JSON.parse(fs.readFileSync(abs, "utf8"));
    const copy = pack.copy || pack;
    if (copy && typeof copy === "object" && Object.keys(copy).length) {
      index[slug] = copy;
    }
  }
  if (Object.keys(index).length === 0) {
    // keep empty index? better write minimal or delete
    if (fs.existsSync(indexPath)) fs.unlinkSync(indexPath);
    console.log("DELETED reports/burn-down-index.json (no remaining report overlays)");
  } else {
    fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
    console.log(
      "rewrote burn-down-index.json slugs:",
      Object.keys(index),
      "leaves",
      collectLeaves(index).size
    );
  }
}

// Verify no identical remain on pruned targets
/** @type {string[]} */
const stillIdentical = [];
for (const rel of [...targets, null].filter(Boolean)) {
  const chPath = path.join(ROOT, "content-packs", LOCALE, /** @type {string} */ (rel));
  const itPath = path.join(ROOT, "content-packs", BASE, /** @type {string} */ (rel));
  if (!fs.existsSync(chPath)) continue;
  const chLeaves = collectLeaves(JSON.parse(fs.readFileSync(chPath, "utf8")));
  const itLeaves = collectLeaves(JSON.parse(fs.readFileSync(itPath, "utf8")));
  for (const [k, v] of chLeaves) {
    if (itLeaves.get(k) === v) stillIdentical.push(`${rel}:${k}`);
  }
}
{
  const chPath = path.join(ROOT, "locales", LOCALE, "common.json");
  if (fs.existsSync(chPath)) {
    const chLeaves = collectLeaves(JSON.parse(fs.readFileSync(chPath, "utf8")));
    const itLeaves = collectLeaves(
      JSON.parse(fs.readFileSync(path.join(ROOT, "locales", BASE, "common.json"), "utf8"))
    );
    for (const [k, v] of chLeaves) {
      if (itLeaves.get(k) === v) stillIdentical.push(`locales/common.json:${k}`);
    }
  }
}

console.log("\n=== prune summary ===");
console.log(JSON.stringify(report, null, 2));
console.log("removedTotal", removedTotal);
console.log("stillIdentical", stillIdentical.length, stillIdentical.slice(0, 20));
