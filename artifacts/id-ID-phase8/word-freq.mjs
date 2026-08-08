/**
 * Build vocabulary inventory from lines still needing translation.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const meta = JSON.parse(fs.readFileSync(path.join(OUT, "dict-chunk-meta.json"), "utf8"));
const words = new Map();
const STOP = new Set();

for (const { file } of meta.chunkMeta) {
  const arr = JSON.parse(fs.readFileSync(path.join(OUT, "dict-chunks", file), "utf8"));
  for (const en of arr) {
    for (const w of String(en).match(/[A-Za-z']+/g) || []) {
      if (w.length < 2) continue;
      const low = w.toLowerCase();
      words.set(low, (words.get(low) || 0) + 1);
    }
  }
}

const ranked = [...words.entries()].sort((a, b) => b[1] - a[1]);
fs.writeFileSync(path.join(OUT, "word-freq.json"), JSON.stringify(ranked.map(([w, n]) => ({ w, n })), null, 2));
console.log({ uniqueWords: ranked.length, top40: ranked.slice(0, 40) });
