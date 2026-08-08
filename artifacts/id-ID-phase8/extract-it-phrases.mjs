/**
 * Extract English phrases from it-IT finalize script for id-ID adaptation.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const src = fs.readFileSync(path.join(ROOT, "scripts/i18n/finalize-it-IT-closure.mjs"), "utf8");
const m = src.match(/const EN_IT = \[([\s\S]*?)\];/);
if (!m) {
  console.error("EN_IT not found");
  process.exit(1);
}
const enPhrases = [];
const re = /\["((?:\\.|[^"\\])*)"/g;
let match;
const block = m[1];
// pair extractor
const pairRe = /\[\s*"((?:\\.|[^"\\])*)"\s*,\s*"((?:\\.|[^"\\])*)"\s*\]/g;
while ((match = pairRe.exec(block))) {
  const en = match[1].replace(/\\"/g, '"').replace(/\\n/g, "\n").replace(/\\\\/g, "\\");
  enPhrases.push(en);
}
fs.writeFileSync(
  path.join(ROOT, "artifacts/id-ID-phase8/it-en-phrases.json"),
  JSON.stringify(enPhrases, null, 2)
);
console.log({ phrases: enPhrases.length, sample: enPhrases.slice(0, 20) });
