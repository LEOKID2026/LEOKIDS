/**
 * Build maps/*.json from parallel id-lines-XX.txt files (one ID line per EN batch line).
 * Usage: node artifacts/id-ID-phase8/build-maps-from-id-lines.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const batchDir = path.join(HERE, "mgs-batches");
const idDir = path.join(HERE, "id-lines");
const mapDir = path.join(HERE, "maps");
fs.mkdirSync(mapDir, { recursive: true });

let built = 0;
let errors = [];
for (const f of fs.readdirSync(batchDir).filter((x) => x.startsWith("batch-")).sort()) {
  const idx = f.replace("batch-", "").replace(".json", "");
  const idFile = path.join(idDir, `id-${idx}.txt`);
  if (!fs.existsSync(idFile)) continue;
  const en = JSON.parse(fs.readFileSync(path.join(batchDir, f), "utf8"));
  const idLines = fs.readFileSync(idFile, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/);
  // allow trailing empty
  while (idLines.length && idLines[idLines.length - 1] === "") idLines.pop();
  if (idLines.length !== en.length) {
    errors.push({ batch: f, en: en.length, id: idLines.length });
    continue;
  }
  /** @type {Record<string,string>} */
  const map = {};
  for (let i = 0; i < en.length; i++) map[en[i]] = idLines[i];
  fs.writeFileSync(path.join(mapDir, `mgs-${idx}.json`), JSON.stringify(map));
  built += 1;
}
console.log(JSON.stringify({ built, errors }, null, 2));
