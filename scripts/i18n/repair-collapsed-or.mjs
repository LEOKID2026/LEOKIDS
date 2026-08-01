/**
 * Repair accidental || → | collapse from purge-product-he-escapes.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SCAN = ["data", "utils", "lib", "pages", "components", "hooks", "content-packs", "locales"];
const SKIP = new Set(["node_modules", ".next", "exports", "docs", "curriculum-oracle", "language-review"]);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(js|mjs|cjs|jsx|ts|tsx)$/i.test(ent.name)) out.push(p);
  }
  return out;
}

let files = 0;
let replacements = 0;
for (const root of SCAN) {
  for (const abs of walk(path.join(ROOT, root))) {
    const t = fs.readFileSync(abs, "utf8");
    if (!t.includes(" | ")) continue;
    const next = t.split(" | ").join(" || ");
    if (next === t) continue;
    const count = (t.match(/ \| /g) || []).length;
    fs.writeFileSync(abs, next, "utf8");
    files++;
    replacements += count;
  }
}
console.log(JSON.stringify({ files, replacements }, null, 2));
