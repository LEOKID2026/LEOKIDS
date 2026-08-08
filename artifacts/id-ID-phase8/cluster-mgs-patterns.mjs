/**
 * Cluster MGS lines by structural patterns for template translation.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const { buckets } = JSON.parse(fs.readFileSync(path.join(OUT, "need-buckets.json"), "utf8"));
const lines = buckets.contentMathGeoSci;

function normalize(s) {
  return s
    .replace(/\d[\d,]*(?:\.\d+)?/g, "#")
    .replace(/[A-Z]{2,}/g, "VAR")
    .replace(/\b[A-Z][a-z]+\b/g, "Name");
}

const clusters = new Map();
for (const en of lines) {
  const key = normalize(en);
  if (!clusters.has(key)) clusters.set(key, []);
  clusters.get(key).push(en);
}

const ranked = [...clusters.entries()]
  .map(([pat, examples]) => ({ pat, n: examples.length, ex: examples[0] }))
  .sort((a, b) => b.n - a.n);

fs.writeFileSync(
  path.join(OUT, "mgs-patterns.json"),
  JSON.stringify({ uniquePatterns: ranked.length, top100: ranked.slice(0, 100) }, null, 2)
);

const coveredByTop = ranked.slice(0, 200).reduce((s, x) => s + x.n, 0);
const singleton = ranked.filter((x) => x.n === 1).length;
console.log({
  lines: lines.length,
  patterns: ranked.length,
  singletonPatterns: singleton,
  coveredByTop200: coveredByTop,
  top20: ranked.slice(0, 20).map((x) => ({ n: x.n, ex: x.ex.slice(0, 90) })),
});
