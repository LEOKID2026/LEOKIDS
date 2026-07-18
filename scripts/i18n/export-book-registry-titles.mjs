/**
 * Extract batch/book titles from learning-book *-registry.js → content-packs/en/books/registry-titles.json
 * Run: node scripts/i18n/export-book-registry-titles.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const libDir = path.join(root, "lib/learning-book");
const outPath = path.join(root, "content-packs/en/books/registry-titles.json");

/** @type {Record<string, Record<string, Record<string, { title: string }>>>} */
const pack = { batches: {}, meta: {} };

const registryFiles = fs
  .readdirSync(libDir)
  .filter((f) => /^(math|geometry|english|science)-g[1-6]-registry\.js$/.test(f));

for (const file of registryFiles) {
  const src = fs.readFileSync(path.join(libDir, file), "utf8");
  const m = file.match(/^(math|geometry|english|science)-g([1-6])-registry\.js$/);
  if (!m) continue;
  const subject = m[1];
  const grade = `g${m[2]}`;
  const bookKey = `${subject}.${grade}`;

  if (!pack.batches[bookKey]) pack.batches[bookKey] = {};

  const batchRe =
    /\{\s*\n\s*id:\s*"([^"]+)"[\s\S]*?title:\s*"((?:\\.|[^"\\])*)"[\s\S]*?titleHe:\s*"((?:\\.|[^"\\])*)"/g;
  let bm;
  while ((bm = batchRe.exec(src))) {
    const batchId = bm[1];
    const title = bm[2].replace(/\\"/g, '"');
    pack.batches[bookKey][batchId] = { title };
  }

  const metaRe = /bookTitle:\s*"((?:\\.|[^"\\])*)"/;
  const metaM = src.match(metaRe);
  if (metaM) {
    pack.meta[bookKey] = { bookTitle: metaM[1].replace(/\\"/g, '"') };
  }
}

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(pack, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath} (${Object.keys(pack.batches).length} books)`);
