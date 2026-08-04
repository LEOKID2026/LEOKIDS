/**
 * Merge en-NNN.json + de-NNN.json batch pairs into _de-DE-sentence-cache.json
 * Then rebuild science overlay via finish-de-DE-layer.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BATCH = path.join(__dirname, "_de-DE-science-batches");
const OUT = path.join(__dirname, "_de-DE-sentence-cache.json");

const cache = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const ens = fs.readdirSync(BATCH).filter((f) => f.startsWith("en-") && f.endsWith(".json")).sort();
let pairs = 0;
let missing = 0;
for (const enFile of ens) {
  const deFile = enFile.replace(/^en-/, "de-");
  const dePath = path.join(BATCH, deFile);
  if (!fs.existsSync(dePath)) {
    missing++;
    continue;
  }
  const en = JSON.parse(fs.readFileSync(path.join(BATCH, enFile), "utf8"));
  const de = JSON.parse(fs.readFileSync(dePath, "utf8"));
  if (en.length !== de.length) {
    throw new Error(`Length mismatch ${enFile}: en=${en.length} de=${de.length}`);
  }
  for (let i = 0; i < en.length; i++) {
    cache[en[i]] = de[i];
    pairs++;
  }
}
fs.writeFileSync(OUT, JSON.stringify(cache), "utf8");
console.log(`cache entries=${Object.keys(cache).length} pairsApplied=${pairs} missingBatches=${missing}`);
