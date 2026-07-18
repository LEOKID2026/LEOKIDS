/**
 * Batch replace registry inline titles with titleKey references.
 * Run: node scripts/i18n/batch-migrate-books-registries.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const libDir = path.join(root, "lib/learning-book");
const titlesPath = path.join(root, "content-packs/en/books/registry-titles.json");
const titles = JSON.parse(fs.readFileSync(titlesPath, "utf8"));

const registryFiles = fs
  .readdirSync(libDir)
  .filter((f) => /^(math|geometry|english|science)-g[1-6]-registry\.js$/.test(f));

let changed = 0;

for (const file of registryFiles) {
  const filePath = path.join(libDir, file);
  let src = fs.readFileSync(filePath, "utf8");
  const m = file.match(/^(math|geometry|english|science)-g([1-6])-registry\.js$/);
  if (!m) continue;
  const bookKey = `${m[1]}.g${m[2]}`;

  src = src.replace(
    /title:\s*"((?:\\.|[^"\\])*)",\s*titleHe:\s*"((?:\\.|[^"\\])*)"/g,
    (_all, _title, _titleHe, offset) => {
      const before = src.slice(0, offset);
      const idMatch = before.match(/id:\s*"([^"]+)"[^]*$/);
      const batchId = idMatch?.[1] || "unknown";
      return `titleKey: "${bookKey}.${batchId}"`;
    },
  );

  src = src.replace(
    /bookTitle:\s*"((?:\\.|[^"\\])*)",\s*bookTitleHe:\s*"((?:\\.|[^"\\])*)"/g,
    `bookTitleKey: "${bookKey}.bookTitle"`,
  );

  src = src.replace(
    /@typedef \{\{ id: string, titleHe: string, pages: string\[\] \}\}/g,
    "@typedef {{ id: string, titleKey: string, pages: string[] }}",
  );

  fs.writeFileSync(filePath, src, "utf8");
  changed += 1;
}

console.log(`batch-migrate-books-registries: updated ${changed} registry files`);
