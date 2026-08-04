import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DE = path.join(ROOT, "docs/learning-book/de-DE");

const MASH =
  /\b(Lernening|Knowing solids|Volumenn|Wie much|colored|calculations|prepares du|parts of a|of a Quader|of a Kugel|of a Zylinder|of a Kegel|Properties of a|Beispiel: two|for Volumen|cake ist|solids prepares|Knowing |Times Table|Steps für|to add|to multiply|to subtract|carry to|is left|number line|Coin Values|Reproductiauf|Observatiauf|Divisiauf|tiauf|lernening)\b/i;

const HE = /[\u0590-\u05FF]/;

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

const mash = [];
const heb = [];
for (const f of walk(DE)) {
  const rel = path.relative(DE, f).replace(/\\/g, "/");
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((l, i) => {
    if (HE.test(l)) heb.push({ rel, i: i + 1, l: l.slice(0, 140) });
    if (rel.startsWith("english/")) return;
    if (/\|\s*\*\*title_english\*\*/i.test(l)) return;
    if (MASH.test(l)) mash.push({ rel, i: i + 1, l: l.slice(0, 160) });
  });
}

const mashFiles = [...new Set(mash.map((x) => x.rel))];
console.log(
  JSON.stringify(
    {
      mash: mash.length,
      mashFiles,
      mashSamples: mash,
      heb: heb.length,
      hebFiles: [...new Set(heb.map((x) => x.rel))],
      hebSamples: heb,
    },
    null,
    2
  )
);
