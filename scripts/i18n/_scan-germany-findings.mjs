import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DE = path.join(ROOT, "docs/learning-book/de-DE");

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

const MASH =
  /\b(to add|to subtract|to multiply|to divide|Steps für|Steps for|Hundreds \+|ones:|carry |Coin Values|wie viel ist Left|Left\?|number line|What is|How many|Write the|Read the|Today we will learn to |Today we're going to learn to |with remainder|no remainder|full boxes|missing number|place value|times table|word problem)\b/i;
const HE = /[\u0590-\u05FF]/;
const BROKEN =
  /\b(lernening|lernenING|tiauf|Reproductiauf|Observatiauf|Divisiauf|comparisauf|Whbei|foder|modere|befodere|Additiauf|foundatiauf|fodermula|woderds|predatoder|lernening-book|Geometrie_GRADE)\b/;

const mash = [];
const heb = [];
const broken = [];

for (const f of walk(DE)) {
  const rel = path.relative(DE, f).replace(/\\/g, "/");
  const english = rel.startsWith("english/");
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((l, i) => {
    // Ignore English source-title metadata and path/code references (not student-facing prose).
    const metaOnly = /\*\*title_english\*\*|learning_page_id|skill_id|`[^`]+`/.test(l) && /^\s*[|\-*]/.test(l);
    if (!english && MASH.test(l) && !metaOnly && !/\|\s*\*\*title_english\*\*/i.test(l)) {
      mash.push({ rel, i: i + 1, l: l.slice(0, 140) });
    }
    if (HE.test(l)) heb.push({ rel, i: i + 1, l: l.slice(0, 140) });
    if (BROKEN.test(l)) broken.push({ rel, i: i + 1, l: l.slice(0, 140) });
  });
}

const mashFiles = [...new Set(mash.map((x) => x.rel))];
const hebFiles = [...new Set(heb.map((x) => x.rel))];
const hebNonEn = heb.filter((x) => !x.rel.startsWith("english/"));
const hebNonEnFiles = [...new Set(hebNonEn.map((x) => x.rel))];

fs.writeFileSync(
  path.join(ROOT, "scripts/i18n/_germany-findings-scan.json"),
  JSON.stringify({ mash: mash.length, mashFiles, mashSamples: mash.slice(0, 40), hebTotal: heb.length, hebNonEn: hebNonEn.length, hebNonEnFiles, hebSamples: hebNonEn.slice(0, 40), broken: broken.length, brokenFiles: [...new Set(broken.map((x)=>x.rel))], brokenSamples: broken.slice(0, 40) }, null, 2)
);
console.log(JSON.stringify({ mash: mash.length, mashFiles: mashFiles.length, mashFilesList: mashFiles, hebNonEn: hebNonEn.length, hebNonEnFiles: hebNonEnFiles.length, hebNonEnFilesList: hebNonEnFiles, broken: broken.length, brokenFiles: [...new Set(broken.map((x)=>x.rel))].length }, null, 2));
