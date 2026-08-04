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
  /\b(What |There |A shape|A solid|A three|A dice|A quarter|A floor|A balk|A square|A rectangle|A triangle|A cube|We move|We get|We turn|We will|Today |Let's |Look |Write |Read |Try |Here |Why\?|On the |When you|In practice|Check the|Fill it|two rails|Train tracks|Cylinder|Pyramid|Cone|Sphere|Cube,|rectangle|square\?|diagonal|volume|faces|edges|vertices|length and width|not flat|mirror|swap places|sort triangles|calculate the|does a |does it |does een|is a shape|is longer|pair of sides|Approved Hebrew|Content scope|Inhoudsbereik:.*identification|Nu ken je de rectangle|Nu weet je hoe je calculate)\b/i;

const uniq = new Map();
let badFiles = 0;
for (const f of walk("docs/learning-book/nl-NL")) {
  if (f.includes(`${path.sep}english${path.sep}`)) continue;
  if (f.includes(`${path.sep}README.md`)) continue;
  const nlLines = fs.readFileSync(f, "utf8").split(/\n/);
  const rel = path.relative("docs/learning-book/nl-NL", f);
  const enPath = path.join("docs/learning-book/en", rel);
  if (!fs.existsSync(enPath)) continue;
  const enLines = fs.readFileSync(enPath, "utf8").split(/\n/);
  let hit = false;
  for (let i = 0; i < nlLines.length; i++) {
    const nl = nlLines[i];
    if (!BAD.test(nl)) continue;
    if (nl.includes("title_english") || nl.trim().startsWith("```")) continue;
    hit = true;
    const en = (enLines[i] || "").trim();
    if (en) uniq.set(en, (uniq.get(en) || 0) + 1);
    else uniq.set(nl.trim(), (uniq.get(nl.trim()) || 0) + 1);
  }
  if (hit) badFiles++;
}

const arr = [...uniq.entries()].sort((a, b) => b[1] - a[1]);
fs.writeFileSync(
  "scripts/i18n/_nl-NL-book-hard-en.json",
  JSON.stringify(
    arr.map(([en, n]) => ({ en, n })),
    null,
    2
  )
);
console.log({ badFiles, unique: arr.length });
console.log(arr.slice(0, 100).map(([e, n]) => `${n}\t${e.slice(0, 120)}`).join("\n"));
