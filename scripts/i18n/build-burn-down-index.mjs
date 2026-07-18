/**
 * Merge per-file burn-down packs into one client-safe JSON index.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packDir = path.join(root, "content-packs/en/learning/burn-down");
const outPath = path.join(root, "content-packs/en/learning/burn-down-index.json");

/** @type {Record<string, Record<string, string>>} */
const index = {};

for (const name of fs.readdirSync(packDir)) {
  if (!name.endsWith(".json")) continue;
  const slug = name.replace(/\.json$/, "");
  const raw = JSON.parse(fs.readFileSync(path.join(packDir, name), "utf8"));
  index[slug] = raw.copy || {};
}

fs.writeFileSync(outPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
console.log("burn-down-index", Object.keys(index).length, "packs");
