/**
 * Final polish for docs/learning-book/nl-NL from current files + EN authority for residue.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const DIR = path.join(ROOT, "docs/learning-book/nl-NL");

function walk(d, files = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, files);
    else if (e.name.endsWith(".md")) files.push(p);
  }
  return files;
}

const LINE_FIX = [
  [/Add (\d+) — ([\d, …]+) up to (\d+)\./g, "Tel $1 op — $2 tot $3."],
  [/\bup to\b/gi, "tot"],
  [/\bLook at\b/g, "Kijk naar"],
  [/\bLook at a sticker:\b/g, "Kijk naar een sticker:"],
  [/\bLook at the last digit!\b/g, "Kijk naar het laatste cijfer!"],
  [/\bLook at the digits:\b/g, "Kijk naar de cijfers:"],
  [/\bLook at the tens digit:\b/g, "Kijk naar het tientallen-cijfer:"],
  [/\bLet's find\b/g, "Laten we vinden"],
  [/\bRead the vraag:\b/g, "Lees de vraag:"],
  [/\bWrite the dividend,\b/g, "Schrijf het deeltal,"],
  [/\bWrite the first\b/g, "Schrijf de eerste"],
  [/\bdivide groep door groep\b/gi, "deel groep voor groep"],
  [/\bleft to right\b/gi, "van links naar rechts"],
  [/\bround down\b/gi, "naar beneden afronden"],
  [/\bmultiples van\b/gi, "veelvouden van"],
  [/\bhoe veel zijn left\b/gi, "hoeveel er overblijven"],
  [/\bthere zijn two parts\b/gi, "er zijn twee delen"],
  [/\bit asks hoe veel together\b/gi, "er wordt gevraagd hoeveel samen"],
  [/\bin totaal\b/g, "in totaal"],
  [/\bsamen van spring\b/g, "samen of spring"],
  [/\bvan spring naar\b/g, "of spring naar"],
  [/\bAdding Two Getallen\b/g, "Twee getallen optellen"],
  [/\bTwo Getallen\b/g, "Twee getallen"],
  [/\bGetallen\b/g, "getallen"],
  [/  —  /g, "Engels — Groep 3"],
  [/  —  /g, "Engels — Groep 4"],
  [/  —  /g, "Engels — Groep 5"],
  [/  —  /g, "Engels — Groep 6"],
  [/  —  /g, "Engels — Groep 7"],
  [/  —  /g, "Engels — Groep 8"],
  [/ /g, "Rekenen-boek"],
  [/ /g, "Meetkunde-boek"],
  [/ /g, "Natuur-en-techniekboek"],
  [/ [']/g, "Groep 3"],
  [/ [']/g, "Groep 4"],
  [/ [']/g, "Groep 5"],
  [/ [']/g, "Groep 6"],
  [/ [']/g, "Groep 7"],
  [/ [']/g, "Groep 8"],
  [/\*\*\*\*/g, "**Engels**"],
  [/\*\*\*\*/g, "**Rekenen**"],
  [/\*\*\*\*/g, "**Meetkunde**"],
  [/\*\*\*\*/g, "**Natuur en techniek**"],
  [/ /g, "woordenschat"],
  [/ /g, "Kleuren in het Engels"],
  [/ 0–10 /g, "Getallen 0–10 in het Engels"],
  [/ /g, "Familie in het Engels"],
  [/ /g, "Dieren in het Engels"],
  [/ /g, "Gevoelens in het Engels"],
  [/ /g, "Werkwoorden in het Engels"],
  [/  /g, "School in het Engels"],
  [//g, "grammatica"],
  [//g, "schrijven"],
  [//g, "lezen"],
  [/\bChild-facing subject:\b/g, "Vak voor het kind:"],
  [/\bBook title:\b/g, "Boektitel:"],
  [/\bBatch A —\b/g, "Batch A —"],
  [/\bWiskunde\b/g, "Rekenen"],
  [/\bwetenschap\b/gi, "natuur en techniek"],
];

const GRADE_IN_TITLE = [
  [/Grade 1/g, "Groep 3"],
  [/Grade 2/g, "Groep 4"],
  [/Grade 3/g, "Groep 5"],
  [/Grade 4/g, "Groep 6"],
  [/Grade 5/g, "Groep 7"],
  [/Grade 6/g, "Groep 8"],
];

let changed = 0;
for (const file of walk(DIR)) {
  let text = fs.readFileSync(file, "utf8");
  const before = text;
  for (const [re, rep] of LINE_FIX) text = text.replace(re, rep);
  // Map Grade in all display lines including title_english
  text = text
    .split(/\n/)
    .map((line) => {
      let l = line;
      if (/\bGrade\s*[1-6]\b/.test(l)) {
        for (const [re, rep] of GRADE_IN_TITLE) l = l.replace(re, rep);
      }
      return l;
    })
    .join("\n");
  // strip residual Hebrew
  if (/[\u0590-\u05FF]/.test(text)) {
    text = text.replace(/[\u0590-\u05FF]+/g, "");
    text = text.replace(/[ \t]{2,}/g, " ");
  }
  if (text !== before) {
    fs.writeFileSync(file, text, "utf8");
    changed++;
  }
}
console.log({ changed, total: walk(DIR).length });
