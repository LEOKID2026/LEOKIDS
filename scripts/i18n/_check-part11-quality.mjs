import fs from "node:fs";
const m = JSON.parse(fs.readFileSync("scripts/i18n/_de-DE-book-residue-parts/part-11-de-map.json", "utf8"));
const k = "Important: here we don't practice remainders or long division — only simple fair sharing.";
console.log("MAP", m[k]);
const residue = JSON.parse(fs.readFileSync("scripts/i18n/_de-DE-book-residue-map.json", "utf8"));
console.log("RES", residue[k]);
let bad = 0;
const samples = [];
const re =
  /\b(the|and|with|that|which|because|here we|don't|practice|only|simple|Today|In practice|When you|There are|Example|Important|A square|A rectangle)\b/;
for (const [en, de] of Object.entries(m)) {
  if (re.test(de)) {
    bad++;
    if (samples.length < 10) samples.push({ en: en.slice(0, 70), de: de.slice(0, 100) });
  }
}
console.log({ bad, samples });
