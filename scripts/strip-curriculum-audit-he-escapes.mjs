/**
 * Remove Hebrew \u05xx escapes from curriculum-audit sources (Global: no Israeli curriculum text).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "utils/curriculum-audit");
const ESC = /\\u05[0-9A-Fa-f]{2}/gi;

let n = 0;
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith(".js")) continue;
  const p = path.join(DIR, f);
  let t = fs.readFileSync(p, "utf8");
  if (!ESC.test(t)) continue;
  ESC.lastIndex = 0;
  t = t
    .replace(ESC, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/"\s*"/g, '""');
  fs.writeFileSync(p, t);
  n++;
  console.log("cleaned", f);
}
console.log("files", n);
