/**
 * Fix registry files: set titleKey to {subject}.{grade}.{batchId} from batch id field.
 * Run: node scripts/i18n/fix-book-registry-title-keys.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const libDir = path.join(root, "lib/learning-book");

const registryFiles = fs
  .readdirSync(libDir)
  .filter((f) => /^(math|geometry|english|science)-g[1-6]-registry\.js$/.test(f));

for (const file of registryFiles) {
  const filePath = path.join(libDir, file);
  let src = fs.readFileSync(filePath, "utf8");
  const m = file.match(/^(math|geometry|english|science)-g([1-6])-registry\.js$/);
  if (!m) continue;
  const bookKey = `${m[1]}.g${m[2]}`;

  src = src.replace(
    /(\{\s*\n\s*id:\s*"([^"]+)",\s*\n\s*)titleKey:\s*"[^"]+"/g,
    (_all, prefix, batchId) => `${prefix}titleKey: "${bookKey}.${batchId}"`,
  );

  src = src.replace(
    /"titleHe":\s*"[^"]*",\s*\n/g,
    "",
  );

  fs.writeFileSync(filePath, src, "utf8");
}

console.log(`fix-book-registry-title-keys: updated ${registryFiles.length} files`);
