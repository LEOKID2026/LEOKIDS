import fs from "node:fs";
import path from "node:path";

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

const BAD =
  /\b(What |There |Today |Let's |Try it|On the |In practice|How many|How much|How do|A solid|A shape|A square|A rectangle|We move|Check |Always |missing number|rectangular prism|mirror image|Content scope|calculate the|does it |does she |does he |Asked\?|altogether|change did|paid or|was paid|Missing Number|we asked|we need to|Noa |Yaël |shekels|division that|familiar pair|colored\?|big numbers)\b/i;

const uniq = new Map();
for (const f of walk("docs/learning-book/nl-NL")) {
  if (f.includes(`${path.sep}english${path.sep}`) || f.endsWith("README.md")) continue;
  const nlLines = fs.readFileSync(f, "utf8").split(/\n/);
  const rel = path.relative("docs/learning-book/nl-NL", f);
  const enPath = path.join("docs/learning-book/en", rel);
  const enLines = fs.existsSync(enPath) ? fs.readFileSync(enPath, "utf8").split(/\n/) : [];
  for (let i = 0; i < nlLines.length; i++) {
    const nl = nlLines[i];
    if (nl.includes("title_english") || nl.trim().startsWith("```")) continue;
    if (!BAD.test(nl)) continue;
    const en = (enLines[i] || nl).trim();
    if (en) uniq.set(en, (uniq.get(en) || 0) + 1);
  }
}
const arr = [...uniq.entries()].sort((a, b) => b[1] - a[1]);
fs.writeFileSync(
  "scripts/i18n/_nl-NL-book-still-en2.txt",
  arr.map(([e]) => e).join("\n")
);
console.log({ unique: arr.length });
console.log(arr.map(([e, n]) => `${n}\t${e.slice(0, 120)}`).join("\n"));
