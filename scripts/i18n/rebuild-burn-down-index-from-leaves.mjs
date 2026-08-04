/**
 * Rebuild burn-down-index.json from leaf *.json packs in a pack directory.
 * Usage: node scripts/i18n/rebuild-burn-down-index-from-leaves.mjs <relative-pack-dir>
 * Example: node scripts/i18n/rebuild-burn-down-index-from-leaves.mjs content-packs/ar-001/global-burn-down
 */
import fs from "node:fs";
import path from "node:path";

const rel = process.argv[2];
if (!rel) {
  console.error("Usage: node scripts/i18n/rebuild-burn-down-index-from-leaves.mjs <pack-dir>");
  process.exit(1);
}
const packDir = path.resolve(rel);
const indexPath = path.join(packDir, "burn-down-index.json");
/** @type {Record<string, Record<string, string>>} */
const index = {};
for (const name of fs.readdirSync(packDir)) {
  if (!name.endsWith(".json") || name === "burn-down-index.json") continue;
  const slug = name.replace(/\.json$/, "");
  const raw = JSON.parse(fs.readFileSync(path.join(packDir, name), "utf8"));
  const copy = raw.copy && typeof raw.copy === "object" ? raw.copy : raw;
  if (copy && typeof copy === "object" && !Array.isArray(copy)) {
    index[slug] = copy;
  }
}
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
console.log(rel, Object.keys(index).length, "packs");
