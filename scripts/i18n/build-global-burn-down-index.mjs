import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packDir = path.join(root, "content-packs/en/global-burn-down");
const indexPath = path.join(packDir, "burn-down-index.json");

/** @type {Record<string, Record<string, string>>} */
const index = {};
if (fs.existsSync(packDir)) {
  for (const name of fs.readdirSync(packDir)) {
    if (!name.endsWith(".json") || name === "burn-down-index.json") continue;
    const slug = name.replace(/\.json$/, "");
    const raw = JSON.parse(fs.readFileSync(path.join(packDir, name), "utf8"));
    index[slug] = raw.copy || {};
  }
}
fs.mkdirSync(packDir, { recursive: true });
fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
console.log("global burn-down index", Object.keys(index).length, "packs");
