/**
 * Split contentMathGeoSci need lines into translation batch files.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)));
const { buckets } = JSON.parse(fs.readFileSync(path.join(OUT, "need-buckets.json"), "utf8"));
const dir = path.join(OUT, "mgs-batches");
fs.rmSync(dir, { recursive: true, force: true });
fs.mkdirSync(dir, { recursive: true });

const SIZE = 400;
const lines = buckets.contentMathGeoSci;
for (let i = 0; i < lines.length; i += SIZE) {
  const idx = Math.floor(i / SIZE);
  const slice = lines.slice(i, i + SIZE);
  fs.writeFileSync(path.join(dir, `batch-${String(idx).padStart(2, "0")}.json`), JSON.stringify(slice, null, 2));
}
fs.writeFileSync(
  path.join(OUT, "mgs-batch-meta.json"),
  JSON.stringify({ total: lines.length, batches: Math.ceil(lines.length / SIZE), size: SIZE }, null, 2)
);
console.log({ total: lines.length, batches: Math.ceil(lines.length / SIZE) });
