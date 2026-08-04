import fs from "node:fs";
import path from "node:path";

function walk(d, a = []) {
  if (!fs.existsSync(d)) return a;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (/\.(json|md|js)$/.test(p)) a.push(p);
  }
  return a;
}

const EN =
  /\b(Enter de |login \/ sign up|Unread messages|Put your finger|I'm on |Purchase failed|Go naar|Messages van|Selecteered|Failed naar|Open dit page|Listen naar|Pick a topic|teaching staff|Dear ouder|Welcome to|Please |Try again|Click here|How do I|What is |What are |Today we |Simple explanation|Let's practice|On the next page|Try it yourself|Understand de |Step \d+:|Kids world|sign up)\b/i;

const hits = [];
const roots = [
  ...walk("locales/nl-NL"),
  ...walk("content-packs/nl-NL"),
  ...walk("docs/learning-book/nl-NL"),
  "data/science-questions-nl-NL-overlay.js",
];

for (const f of roots) {
  const rel = f.replace(/\\/g, "/");
  if (rel.includes("/english/") || rel.includes("english-page")) continue;
  if (!fs.existsSync(f)) continue;
  const lines = fs.readFileSync(f, "utf8").split(/\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!EN.test(line)) continue;
    if (/doNotTranslate|A–Z|Hello, Thank you/.test(line)) continue;
    hits.push(`${rel}:${i + 1} | ${line.trim().slice(0, 140)}`);
  }
}

console.log(JSON.stringify({ hits: hits.length, sample: hits.slice(0, 80) }, null, 2));
