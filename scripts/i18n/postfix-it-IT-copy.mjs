/**
 * Post-fix Italian (Italy) authority terminology across it-IT content trees.
 * Run after generators: node scripts/i18n/postfix-it-IT-copy.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const TREES = [
  "locales/it-IT",
  "content-packs/it-IT",
  "data/help-center/it-IT",
  "docs/learning-book/it-IT",
  "utils/learning-content-it-IT",
];

/** Longer / more specific patterns first. */
const FIXES = [
  [/fogli di calcolo/gi, "schede didattiche"],
  [/foglio di calcolo/gi, "scheda didattica"],
  [/fogli di lavoro stampabili/gi, "Schede didattiche stampabili"],
  [/fogli di lavoro pronti per la stampa/gi, "Schede pronte da stampare"],
  [/fogli di lavoro pronti/gi, "schede pronte da stampare"],
  [/fogli di lavoro/gi, "schede didattiche"],
  [/foglio di lavoro/gi, "scheda didattica"],
  [/fogli pronti/gi, "schede pronte"],
  [/un foglio già pronto/gi, "una scheda già pronta"],
  [/un foglio pronto/gi, "una scheda pronta"],
  [/un foglio di/gi, "una scheda di"],
  [/un foglio /gi, "una scheda "],
  [/Nessun foglio /g, "Nessuna scheda "],
  [/nessun foglio /gi, "nessuna scheda "],
  [/del foglio /gi, "della scheda "],
  [/il foglio /gi, "la scheda "],
  [/I fogli /g, "Le schede "],
  [/i fogli /g, "le schede "],
  [/Tipo di foglio/g, "Tipo di scheda"],
  [/Fogli di domande/g, "Schede di domande"],
  [/Fogli per scrivere/g, "Schede di scrittura"],
  [/foglio di pratica di scrittura/gi, "scheda di esercizi di scrittura"],
  [/foglio di scrittura/gi, "scheda di scrittura"],
  [/foglio di esercizi/gi, "scheda di esercizi"],
  [/worksheet/gi, "scheda didattica"],
  [/worksheets/gi, "schede didattiche"],
  [/\bla soluzioni\b/gi, "le soluzioni"],
  [/\buna soluzioni\b/gi, "le soluzioni"],
  [/\bLa soluzioni\b/g, "Le soluzioni"],
  [/\bIncludere la soluzioni\b/g, "Includere le soluzioni"],
  [/answer key/gi, "soluzioni"],
  [/\bGrade 1\b/g, "1ª primaria"],
  [/\bGrade 2\b/g, "2ª primaria"],
  [/\bGrade 3\b/g, "3ª primaria"],
  [/\bGrade 4\b/g, "4ª primaria"],
  [/\bGrade 5\b/g, "5ª primaria"],
  [/\bGrade 6\b/g, "1ª secondaria"],
  [/\bYear 1\b/g, "1ª primaria"],
  [/\bYear 2\b/g, "2ª primaria"],
  [/\bYear 3\b/g, "3ª primaria"],
  [/\bYear 4\b/g, "4ª primaria"],
  [/\bYear 5\b/g, "5ª primaria"],
  [/\bYear 6\b/g, "1ª secondaria"],
  [/\b6ª primaria\b/gi, "1ª secondaria"],
  [/\b6º anno\b/gi, "1ª secondaria"],
  [/\bdollari\b/gi, "euro"],
  [/\bdollaro\b/gi, "euro"],
  [/\bdollars\b/gi, "euro"],
  [/\bdollar\b/gi, "euro"],
  [/\bnatal\b/gi, "telefono"],
  [/\bnatel\b/gi, "telefono"],
  [/Leo Bambini/g, "Leo Kids"],
  [/Leo Ragazzi/g, "Leo Kids"],
  // Avoid "voto" where school year/class was meant in UI chrome (not English learning glosses)
  [/"gradeField":\s*"Voto"/g, '"gradeField": "Classe"'],
  [/"selectGrade":\s*"Voto"/g, '"selectGrade": "Classe"'],
  [/Scegli materia, voto,/gi, "Scegli materia, classe,"],
  [/materia, voto, argomento/gi, "materia, classe, argomento"],
  [/subject, grade, and topic/gi, "materia, classe e argomento"],
];

function listFiles(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(p) {
    for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (/\.(json|js|mjs|md)$/.test(ent.name)) out.push(full);
    }
  })(dir);
  return out;
}

function applyFixes(text) {
  let out = text;
  for (const [re, rep] of FIXES) {
    // Never rewrite JSON/JS object keys that embed "worksheet"
    if (String(re) === "/worksheet/gi" || String(re) === "/worksheets/gi") continue;
    out = out.replace(re, rep);
  }
  // Value-safe worksheet wording (avoid touching identifiers)
  out = out.replace(/(["'`])([^"'`]*?)\1/g, (full, q, inner) => {
    let s = inner
      .replace(/\bworksheets\b/gi, "schede didattiche")
      .replace(/\bworksheet\b/gi, "scheda didattica");
    return q + s + q;
  });
  return out;
}

function applyFixesJsonValues(obj) {
  if (typeof obj === "string") {
    let s = obj;
    for (const [re, rep] of FIXES) s = s.replace(re, rep);
    return s;
  }
  if (Array.isArray(obj)) return obj.map(applyFixesJsonValues);
  if (obj && typeof obj === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = applyFixesJsonValues(v);
    return out;
  }
  return obj;
}

let changed = 0;
for (const tree of TREES) {
  const dir = path.join(ROOT, tree);
  for (const file of listFiles(dir)) {
    const before = fs.readFileSync(file, "utf8");
    let after;
    if (file.endsWith(".json")) {
      try {
        after = JSON.stringify(applyFixesJsonValues(JSON.parse(before)), null, 2) + "\n";
      } catch {
        after = applyFixes(before);
      }
    } else {
      after = applyFixes(before);
    }
    if (after !== before) {
      fs.writeFileSync(file, after, "utf8");
      changed += 1;
    }
  }
}

// Hard authority patches on worksheets + common
const wsPath = path.join(ROOT, "locales/it-IT/worksheets.json");
if (fs.existsSync(wsPath)) {
  const ws = JSON.parse(fs.readFileSync(wsPath, "utf8"));
  ws.hubTitle = "Schede didattiche stampabili";
  ws.hubSubtitle =
    "Scegli una scheda già pronta, creane una personalizzata o ricevi consigli del sistema basati sulla pratica di tuo figlio.";
  ws.hubIntro =
    "Ogni scheda didattica si apre in anteprima prima della stampa. Per comodità è disponibile un fascicolo di soluzioni opzionale.";
  ws.tabReady = "Pronte da stampare";
  ws.tabGenerator = "Crea una scheda didattica";
  ws.print = "Stampa";
  ws.preview = "Anteprima";
  ws.answerKey = "Soluzioni";
  ws.answerKeySeparate = "Soluzioni separate — create solo se le richiedi";
  ws.noAnswersInWorksheet = "Nessuna risposta nella pagina della scheda didattica";
  ws.subjectMath = "Matematica";
  ws.subjectGeometry = "Geometria";
  ws.subjectEnglish = "Inglese";
  ws.gradeField = "Classe";
  ws.includeAnswers = "Includere le soluzioni";
  ws.createWorksheet = "Crea una scheda didattica";
  ws.viewAndPrint = "Visualizza e stampa";
  ws.readyTitle = "Schede pronte da stampare";
  ws.createTitle = "Crea una nuova scheda didattica";
  ws.createHint = "Scegli materia, classe, argomento e livello, quindi crea una scheda pronta da stampare.";
  ws.previewTitle = "Anteprima della scheda didattica";
  ws.documentTitle = "Scheda didattica";
  ws.answerKeyTitle = "Soluzioni";
  ws.selectGrade = "Classe";
  ws.worksheetTypeField = "Tipo di scheda";
  ws.worksheetTypeQuestions = "Schede di esercizi";
  ws.worksheetTypeWriting = "Schede di scrittura";
  if (ws.seoAnswerKeyTitle) ws.seoAnswerKeyTitle = "Soluzioni · Leo Kids";
  if (ws.publicReadyTitle) ws.publicReadyTitle = "Schede pronte per classe";
  if (ws.publicReadyHint)
    ws.publicReadyHint = "30 schede pronte da stampare: filtra, visualizza in anteprima, stampa e controlla con le soluzioni.";
  fs.writeFileSync(wsPath, JSON.stringify(ws, null, 2) + "\n", "utf8");
  changed += 1;
}

const commonPath = path.join(ROOT, "locales/it-IT/common.json");
if (fs.existsSync(commonPath)) {
  const common = JSON.parse(fs.readFileSync(commonPath, "utf8"));
  common.gradeLabel = "Classe {grade}";
  common.grade1 = "1ª primaria";
  common.grade2 = "2ª primaria";
  common.grade3 = "3ª primaria";
  common.grade4 = "4ª primaria";
  common.grade5 = "5ª primaria";
  common.grade6 = "1ª secondaria";
  common.brandName = "Leo Kids";
  common.subjectMath = "Matematica";
  common.subjectGeometry = "Geometria";
  common.subjectEnglish = "Inglese";
  common.subjectScience = "Scienze";
  fs.writeFileSync(commonPath, JSON.stringify(common, null, 2) + "\n", "utf8");
}

console.log("postfix-it-IT-copy: files touched", changed);
