import fs from "node:fs";
import path from "node:path";

const EN =
  /\b(Leaderboard|Welcome to|Loading|Click here|Try again|Answer key|Create worksheet|Creating |All grades|Wiskunde|Grade [1-6]|How do I|What is|student login|teacher login)\b/;

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".json")) a.push(p);
  }
  return a;
}

let hits = 0;
const samples = [];
for (const f of walk("content-packs/nl-NL")) {
  const t = fs.readFileSync(f, "utf8");
  if (EN.test(t)) {
    hits++;
    if (samples.length < 15) samples.push(f);
  }
}
console.log({ packFilesWithEnChrome: hits, samples });
