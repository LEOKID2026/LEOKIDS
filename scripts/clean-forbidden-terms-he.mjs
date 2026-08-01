/**
 * Drop Hebrew-containing forbidden-term string literals; keep EN terms.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const p = path.join(ROOT, "utils/parent-report-language/forbidden-terms.js");
const HE = /[\u0590-\u05FF]/;
const HE_G = /[\u0590-\u05FF]/g;

const lines = fs.readFileSync(p, "utf8").split("\n");
const out = [];
for (const line of lines) {
  const trimmed = line.trim();
  const m = trimmed.match(/^"((?:\\.|[^"\\])*)"\s*,?\s*(\/\*.*\*\/\s*)?$/);
  if (m && HE.test(m[1])) continue;
  out.push(line.replace(HE_G, "").replace(/\s+$/, ""));
}
let text = out.join("\n");
text = text.replace(
  /\/\*\*[\s\S]*?Parent report[\s\S]*?\*\//,
  `/**
 * Parent report — forbidden substrings in parent-facing text (screen/PDF).
 * Used by selftest; can be imported by future snapshot guards.
 */`
);
fs.writeFileSync(p, text);
console.log("forbidden HE left:", HE.test(fs.readFileSync(p, "utf8")));
