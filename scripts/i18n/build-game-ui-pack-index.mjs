/**
 * Build merged client-safe UI pack index from content-packs/en/games/*.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packDir = path.join(root, "content-packs/en/games");
const indexPath = path.join(packDir, "ui-pack-index.json");

/** @type {Record<string, unknown>} */
const index = {};

for (const name of fs.readdirSync(packDir)) {
  if (!name.endsWith(".json")) continue;
  if (name === "burn-down-index.json" || name === "ui-pack-index.json") continue;
  const abs = path.join(packDir, name);
  if (!fs.statSync(abs).isFile()) continue;
  const pack = JSON.parse(fs.readFileSync(abs, "utf8"));
  const gameId = String(pack.gameId || name.replace(/\.json$/, ""));
  index[gameId] = pack;
}

fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
console.log(`built ui-pack-index: ${Object.keys(index).length} games`);
