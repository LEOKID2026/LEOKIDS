import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const dir = path.join(root, "lib/learning-book");

for (const file of fs.readdirSync(dir)) {
  if (!/^load-(math|geometry)-g[1-6]-pages\.js$/.test(file)) continue;
  const abs = path.join(dir, file);
  let source = fs.readFileSync(abs, "utf8");
  if (!source.includes("titleHe: batch.titleHe")) continue;

  const batchesMatch = source.match(/return ([A-Z0-9_]+BOOK_BATCHES)\.map/);
  if (!batchesMatch) {
    console.error(`skip ${file}: no BATCHES symbol`);
    continue;
  }
  const batchesVar = batchesMatch[1];

  if (!source.includes("build-book-toc-entries")) {
    source = source.replace(
      'from "./parse-learning-page-markdown";',
      'from "./parse-learning-page-markdown";\nimport { buildBookTocEntries } from "./build-book-toc-entries.js";',
    );
  }

  source = source.replace(
    /return [A-Z0-9_]+BOOK_BATCHES\.map\(\(batch\) => \(\{[\s\S]*?\}\)\);/,
    `return buildBookTocEntries(${batchesVar}, byId);`,
  );

  fs.writeFileSync(abs, source);
  console.log("updated", file);
}
