import fs from "node:fs";
import path from "node:path";

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

const uniq = new Set();
for (const f of walk("docs/learning-book/en")) {
  for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || !/[A-Za-z]/.test(t) || t.length < 8) continue;
    if (/^[-`|*0-9½⅓¼¾\[\]#=]/.test(t) && !/^#+ /.test(t) && !/^[A-Za-z]/.test(t)) continue;
    uniq.add(t);
  }
}
console.log("unique EN lines", uniq.size);

let residual = 0;
const samples = [];
const phrase =
  /\b(Today we|When we|A fraction|The denominator|How much|We take|equal parts|in all|Source references|Content scope|What are we learning)\b/;
for (const f of walk("docs/learning-book/it-IT")) {
  if (f.includes(`${path.sep}english${path.sep}`)) continue;
  const t = fs.readFileSync(f, "utf8");
  if (phrase.test(t)) {
    residual += 1;
    if (samples.length < 8) samples.push(path.relative(process.cwd(), f));
  }
}
console.log({ residualNonEnglishSubjectFiles: residual, samples });

// dump unique lines for translator seed (first 200)
const arr = [...uniq].sort((a, b) => b.length - a.length);
fs.writeFileSync(
  "scripts/i18n/_it-IT-book-unique-en-lines.json",
  JSON.stringify(arr.slice(0, 400), null, 0),
);
console.log("wrote top 400 unique lines sample");
