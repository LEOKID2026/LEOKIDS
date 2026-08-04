/**
 * Focused Italy blocker verification (it-IT content only).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const fails = [];
function fail(msg) {
  fails.push(msg);
  console.log("FAIL:", msg);
}

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, pred, out);
    else if (pred(e.name, p)) out.push(p);
  }
  return out;
}
function strings(o, a = []) {
  if (typeof o === "string") a.push(o);
  else if (Array.isArray(o)) o.forEach((v) => strings(v, a));
  else if (o && typeof o === "object") Object.values(o).forEach((v) => strings(v, a));
  return a;
}
function blobTrees(paths) {
  let b = "";
  for (const p of paths) {
    if (!fs.existsSync(p)) continue;
    if (fs.statSync(p).isDirectory()) {
      for (const f of walk(p, () => true)) b += fs.readFileSync(f, "utf8") + "\n";
    } else b += fs.readFileSync(p, "utf8") + "\n";
  }
  return b;
}

// grades
const common = JSON.parse(fs.readFileSync("locales/it-IT/common.json", "utf8"));
const learning = JSON.parse(fs.readFileSync("locales/it-IT/learning.json", "utf8"));
if (common.grade1 !== "1ª primaria") fail("grade1");
if (common.grade6 !== "1ª secondaria") fail("grade6");
if (common.gradeLabel !== "{grade}") fail("gradeLabel");
function findGradeTitle(n) {
  if (!n || typeof n !== "object") return null;
  if (typeof n.gradeTitle === "string") return n.gradeTitle;
  for (const v of Object.values(n)) {
    const hit = findGradeTitle(v);
    if (hit != null) return hit;
  }
  return null;
}
const gt = findGradeTitle(learning);
if (gt !== "{grade}") fail(`learning.gradeTitle=${gt}`);

const surfaces = blobTrees([
  "locales/it-IT",
  "content-packs/it-IT",
  "data/help-center/it-IT",
  "docs/learning-book/it-IT",
  "data/science-questions-it-IT-overlay.js",
]);
if (/\b6ª primaria\b/i.test(surfaces)) fail("6ª primaria present");
if (/\bClasse\s*6\b/.test(surfaces) || /\bclasse\s*6\b/.test(surfaces)) fail("Classe 6 present");

// voto/grado as school year (heuristic phrases)
const badGradeWords =
  /Seleziona un voto|Scegli un voto|Scegli un grado|aggiornare il tuo voto|Genitori di grado|Adatto per grado|Adatto per voto|scegli un classe|e un classe|selezione del voto/i;
if (badGradeWords.test(surfaces)) fail("voto/grado school-year phrases remain");

// help IDs
const parents = fs.readFileSync("data/help-center/it-IT/parents.js", "utf8");
if (/grado_\d|grade_6|Grado \d/.test(parents)) fail("help internal grade IDs");
if (/dalle classi 1 a 6|dalle classi da 1 a 6|scegli un classe/i.test(parents)) fail("help class wording");

// alunno elision
if (/\bdello alunno\b/i.test(surfaces)) fail("dello alunno");
if (/\bSono uno alunno\b/.test(surfaces)) fail("Sono uno alunno");

// reports Spanish
const reports = blobTrees(["content-packs/it-IT/reports"]);
const reportEs =
  /Questa semana|concéntrese|pidale a su|Secuenciacion|ejercicio|sexto classe|obtuvo la risposta|los classi|vocabulario y las/i;
if (reportEs.test(reports)) fail("report Spanish leakage");

// science EN instructional
const sci = fs.readFileSync("data/science-questions-it-IT-overlay.js", "utf8");
if (/Choose risultato|Noi choose|Strong wind with no moisture/i.test(sci)) fail("science EN leakage");

// placeholders
function ph(s) {
  return [...String(s).matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
}
function walkPh(enN, itN, path = "") {
  if (typeof enN === "string" && typeof itN === "string") {
    if (ph(enN) !== ph(itN)) fail(`placeholder ${path}: en=${ph(enN)} it=${ph(itN)}`);
  } else if (enN && typeof enN === "object" && !Array.isArray(enN) && itN && typeof itN === "object") {
    for (const k of Object.keys(enN)) {
      if (k in itN) walkPh(enN[k], itN[k], path ? `${path}.${k}` : k);
    }
  } else if (Array.isArray(enN) && Array.isArray(itN)) {
    enN.forEach((x, i) => walkPh(x, itN[i], `${path}[${i}]`));
  }
}
for (const f of ["learning.json", "reports.json", "ui.json", "worksheets.json", "common.json"]) {
  const en = JSON.parse(fs.readFileSync(`locales/en/${f}`, "utf8"));
  const it = JSON.parse(fs.readFileSync(`locales/it-IT/${f}`, "utf8"));
  walkPh(en, it, f);
}

// grammar
const ws = JSON.parse(fs.readFileSync("locales/it-IT/worksheets.json", "utf8"));
if (/Nessuna scheda trovato/i.test(JSON.stringify(ws))) fail("Nessuna scheda trovato");
if (/fascicolo di soluzioni opzionale/i.test(JSON.stringify(ws))) fail("fascicolo wording");
const ui = JSON.parse(fs.readFileSync("locales/it-IT/ui.json", "utf8"));
const uiBlob = JSON.stringify(ui);
if (/Gol:/i.test(uiBlob)) fail("Gol: remains");
if (/e un classe/i.test(surfaces)) fail("e un classe");

// meanings
const { WORD_LISTS } = await import(pathToFileURL(path.join(ROOT, "data/english-questions/word-lists.js")).href);
const { WORD_MEANINGS_IT_IT } = await import(
  pathToFileURL(path.join(ROOT, "data/english-questions/word-meanings/it-IT.js")).href + `?t=${Date.now()}`
);
let missing = 0;
let total = 0;
let orphans = 0;
for (const [cat, words] of Object.entries(WORD_LISTS)) {
  for (const id of Object.keys(words)) {
    total += 1;
    if (!WORD_MEANINGS_IT_IT[cat]?.[id]) missing += 1;
  }
}
for (const [cat, words] of Object.entries(WORD_MEANINGS_IT_IT)) {
  for (const id of Object.keys(words)) {
    if (!WORD_LISTS[cat]?.[id]) orphans += 1;
  }
}
if (total !== 745 || missing !== 0 || orphans !== 0) fail(`meanings total=${total} missing=${missing} orphans=${orphans}`);
if (!WORD_MEANINGS_IT_IT.sight) fail("sight category missing");

// science structural
const enSci = (await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href))
  .SCIENCE_EN_OVERLAY;
const itSci = (await import(pathToFileURL(path.join(ROOT, "data/science-questions-it-IT-overlay.js")).href + `?t=${Date.now()}`))
  .SCIENCE_IT_IT_OVERLAY;
let mismatch = 0;
for (const id of Object.keys(enSci)) {
  if (enSci[id].correctIndex !== itSci[id]?.correctIndex) mismatch += 1;
  if ((enSci[id].options || []).length !== (itSci[id]?.options || []).length) mismatch += 1;
}
if (mismatch) fail(`science structural mismatch ${mismatch}`);

console.log(
  JSON.stringify(
    {
      failures: fails.length,
      gradeTitle: gt,
      grade6: common.grade6,
      meanings: { total, missing, orphans },
      scienceIds: Object.keys(itSci).length,
    },
    null,
    2,
  ),
);
if (fails.length) process.exit(1);
console.log("OK Italy blockers closed");
