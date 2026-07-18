/**
 * Rebuild *-registry.js from git HEAD with titleKey + bookTitleKey (no inline titles).
 * Run: node scripts/i18n/rewrite-book-registries-from-head.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const libDir = path.join(root, "lib/learning-book");
const titlesPath = path.join(root, "content-packs/en/books/registry-titles.json");
const titles = JSON.parse(fs.readFileSync(titlesPath, "utf8"));

const registryFiles = fs
  .readdirSync(libDir)
  .filter((f) => /^(math|geometry|english|science)-g[1-6]-registry\.js$/.test(f));

/** @param {string} rel */
function gitHead(rel) {
  try {
    return execSync(`git show HEAD:${rel}`, { cwd: root, encoding: "utf8" });
  } catch {
    return null;
  }
}

for (const file of registryFiles) {
  const rel = `lib/learning-book/${file}`;
  const head = gitHead(rel);
  if (!head) continue;

  const m = file.match(/^(math|geometry|english|science)-g([1-6])-registry\.js$/);
  if (!m) continue;
  const bookKey = `${m[1]}.g${m[2]}`;

  let src = head
    .replace(
      /@typedef \{\{ id: string, titleHe: string, pages: string\[\] \}\}/g,
      "@typedef {{ id: string, titleKey: string, pages: string[] }}",
    )
    .replace(/title:\s*"((?:\\.|[^"\\])*)",\s*titleHe:\s*"((?:\\.|[^"\\])*)"/g, (_a, t) => {
      void t;
      return `titleKey: "__BATCH__"`;
    })
    .replace(/"titleHe":\s*"((?:\\.|[^"\\])*)",?\s*\n/g, `"titleKey": "__BATCH__",\n`)
    .replace(/bookTitle:\s*"((?:\\.|[^"\\])*)",\s*bookTitleHe:\s*"((?:\\.|[^"\\])*)"/g, `bookTitleKey: "${bookKey}.bookTitle"`);

  src = src.replace(/id:\s*"([^"]+)"[\s\S]*?titleKey:\s*"__BATCH__"/g, (block, batchId) =>
    block.replace('"__BATCH__"', `"${bookKey}.${batchId}"`).replace("'__BATCH__'", `"${bookKey}.${batchId}"`),
  );

  src = src.replace(/"id":\s*"([^"]+)"[\s\S]*?"titleKey":\s*"__BATCH__"/g, (block, batchId) =>
    block.replace('"__BATCH__"', `"${bookKey}.${batchId}"`),
  );

  // Ensure pack has batch titles from HEAD where missing
  if (!titles.batches[bookKey]) titles.batches[bookKey] = {};
  const batchTitleRe = /id:\s*"([^"]+)"[\s\S]*?title:\s*"((?:\\.|[^"\\])*)"/g;
  let bm;
  while ((bm = batchTitleRe.exec(head))) {
    const batchId = bm[1];
    const title = bm[2].replace(/\\"/g, '"');
    if (!titles.batches[bookKey][batchId]) titles.batches[bookKey][batchId] = { title };
    else if (!titles.batches[bookKey][batchId].title) titles.batches[bookKey][batchId].title = title;
  }

  fs.writeFileSync(path.join(libDir, file), src, "utf8");
}

fs.writeFileSync(titlesPath, `${JSON.stringify(titles, null, 2)}\n`, "utf8");
console.log(`rewrite-book-registries-from-head: ${registryFiles.length} files`);
