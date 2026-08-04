/**
 * Merge authored residue part-NN-de.json into _de-DE-book-residue-map.json and rebuild books.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PARTS = path.join(__dirname, "_de-DE-book-residue-parts");
const MAP_PATH = path.join(__dirname, "_de-DE-book-residue-map.json");

const map = fs.existsSync(MAP_PATH) ? JSON.parse(fs.readFileSync(MAP_PATH, "utf8")) : {};
let added = 0;
for (const f of fs.readdirSync(PARTS).filter((x) => /^part-\d+\.json$/.test(x)).sort()) {
  const n = f.match(/part-(\d+)/)[1];
  const deFile = path.join(PARTS, `part-${n}-de.json`);
  if (!fs.existsSync(deFile)) {
    console.log("missing", deFile);
    continue;
  }
  const en = JSON.parse(fs.readFileSync(path.join(PARTS, f), "utf8"));
  const de = JSON.parse(fs.readFileSync(deFile, "utf8"));
  if (en.length !== de.length) throw new Error(`len mismatch part-${n}: ${en.length} vs ${de.length}`);
  en.forEach((e, i) => {
    map[e] = de[i];
    added++;
  });
  console.log("merged part", n, en.length);
}
fs.writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
console.log({ mapSize: Object.keys(map).length, added });

const r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], {
  cwd: path.resolve(__dirname, "../.."),
  stdio: "inherit",
});
process.exit(r.status ?? 1);
