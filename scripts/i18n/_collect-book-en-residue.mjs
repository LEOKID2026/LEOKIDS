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

const PAT =
  /\b(Today |Let's |Look at|Write the|Read the|Try it|Here —|Why\?|Unit:|Substitute:|A square|A rectangle|A triangle|We will |In each row|when you|for example a|On the next page|When you |Fill it|What do we|What are we asked|Scientific explanation|Steps:|with side |with sides |go around|add them up|all four|are equal|each other|the difference|already know|earlier grades|bigger numbers|quarter turn|rotation of)\b/i;

const uniq = new Map();
let files = 0;
for (const f of walk("docs/learning-book/nl-NL")) {
  if (f.includes(`${path.sep}english${path.sep}`)) continue;
  const rel = path.relative("docs/learning-book/nl-NL", f);
  const enPath = path.join("docs/learning-book/en", rel);
  if (!fs.existsSync(enPath)) continue;
  const nlLines = fs.readFileSync(f, "utf8").split(/\n/);
  const enLines = fs.readFileSync(enPath, "utf8").split(/\n/);
  let hit = false;
  for (let i = 0; i < nlLines.length; i++) {
    const nl = nlLines[i];
    if (/^\|\s*\*\*/.test(nl) || nl.includes("title_english") || nl.trim().startsWith("```") || nl.trim().startsWith(":::")) continue;
    if (!PAT.test(nl)) continue;
    hit = true;
    const en = (enLines[i] || "").trim();
    if (en && /[A-Za-z]{3,}/.test(en)) uniq.set(en, (uniq.get(en) || 0) + 1);
  }
  if (hit) files++;
}
const arr = [...uniq.entries()].sort((a, b) => b[1] - a[1]);
fs.writeFileSync("scripts/i18n/_book-residue-en.json", JSON.stringify(arr.map(([en, n]) => ({ en, n })), null, 2));
console.log({ files, uniqueEnLines: arr.length });
console.log(arr.slice(0, 50).map(([e, n]) => `${n}\t${e.slice(0, 110)}`).join("\n"));
