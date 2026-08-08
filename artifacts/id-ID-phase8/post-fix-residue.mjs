/**
 * Post-fix salad/residue lines in generated id-ID books.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ID = path.join(ROOT, "docs/learning-book/id-ID");
const FIX = JSON.parse(fs.readFileSync(path.join(ROOT, "artifacts/id-ID-phase8/maps/residue-fix.json"), "utf8"));

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

let filesTouched = 0;
let replacements = 0;
for (const f of walk(ID)) {
  let text = fs.readFileSync(f, "utf8");
  let changed = false;
  for (const [bad, good] of Object.entries(FIX)) {
    if (text.includes(bad)) {
      text = text.split(bad).join(good);
      replacements += 1;
      changed = true;
    }
  }
  // contraction leftovers
  const before = text;
  text = text
    .replace(/\bYou've\b/g, "Kamu sudah")
    .replace(/\byou've\b/g, "kamu sudah")
    .replace(/\bWe've\b/g, "Kita sudah")
    .replace(/\bwe've\b/g, "kita sudah")
    .replace(/\bfollowingnyas\b/g, "berikutnya")
    .replace(/\bberikutnyas\b/g, "berikutnya");
  if (text !== before) changed = true;
  if (changed) {
    fs.writeFileSync(f, text, "utf8");
    filesTouched += 1;
  }
}
console.log(JSON.stringify({ filesTouched, replacements }, null, 2));
