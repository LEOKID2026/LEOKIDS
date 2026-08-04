/**
 * Repair locales/it-IT/worksheets.json keys damaged by blind worksheet→scheda replace.
 * Rebuilds from EN key set + current Italian values where recoverable.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EN = path.join(ROOT, "locales/en/worksheets.json");
const IT = path.join(ROOT, "locales/it-IT/worksheets.json");

const en = JSON.parse(fs.readFileSync(EN, "utf8"));
const broken = JSON.parse(fs.readFileSync(IT, "utf8"));

/** Map damaged keys → canonical EN keys */
const KEY_REPAIR = {
  "noAnswersInscheda didattica": "noAnswersInWorksheet",
  createscheda: null,
  "createscheda didattica": "createWorksheet",
  "scheda didatticaTypeField": "worksheetTypeField",
  "scheda didatticaTypeQuestions": "worksheetTypeQuestions",
  "scheda didatticaTypeWriting": "worksheetTypeWriting",
  "scheda didatticaTypeAll": "worksheetTypeAll",
  "writingCreatescheda didattica": "writingCreateWorksheet",
  "coloringCreatescheda didattica": "coloringCreateWorksheet",
};

/** @type {Record<string, string>} */
const out = {};
for (const key of Object.keys(en)) {
  if (typeof broken[key] === "string") {
    out[key] = broken[key];
  } else {
    // find repaired source
    const damaged = Object.entries(KEY_REPAIR).find(([, canon]) => canon === key);
    if (damaged && typeof broken[damaged[0]] === "string") {
      out[key] = broken[damaged[0]];
    } else {
      // fallback: leave EN temporarily (will be overwritten by authority below)
      out[key] = en[key];
    }
  }
}

// Authority Italian values for key chrome
const AUTH = {
  hubTitle: "Schede didattiche stampabili",
  hubSubtitle:
    "Scegli una scheda già pronta, creane una personalizzata o ricevi consigli del sistema basati sulla pratica di tuo figlio.",
  hubIntro:
    "Ogni scheda didattica si apre in anteprima prima della stampa. Per comodità è disponibile un fascicolo di soluzioni opzionale.",
  tabReady: "Pronte da stampare",
  tabGenerator: "Crea una scheda didattica",
  print: "Stampa",
  preview: "Anteprima",
  answerKey: "Soluzioni",
  answerKeySeparate: "Soluzioni separate — create solo se le richiedi",
  noAnswersInWorksheet: "Nessuna risposta nella pagina della scheda didattica",
  subjectMath: "Matematica",
  subjectGeometry: "Geometria",
  subjectEnglish: "Inglese",
  subjectField: "Materia",
  subjectFilterAll: "Tutte le materie",
  gradeField: "Classe",
  selectGrade: "Classe",
  includeAnswers: "Includere le soluzioni",
  createWorksheet: "Crea una scheda didattica",
  viewAndPrint: "Visualizza e stampa",
  readyTitle: "Schede pronte da stampare",
  createTitle: "Crea una nuova scheda didattica",
  createHint: "Scegli materia, classe, argomento e livello, quindi crea una scheda pronta da stampare.",
  previewTitle: "Anteprima della scheda didattica",
  documentTitle: "Scheda didattica",
  answerKeyTitle: "Soluzioni",
  worksheetTypeField: "Tipo di scheda",
  worksheetTypeQuestions: "Schede di esercizi",
  worksheetTypeWriting: "Schede di scrittura",
  worksheetTypeAll: "Tutti i tipi",
  writingCreateWorksheet: "Crea una scheda di scrittura",
  coloringCreateWorksheet: "Crea una scheda da colorare",
  tabReadyHint: "30 schede · 12 domande",
  publicReadyTitle: "Schede pronte per classe",
  publicReadyHint:
    "30 schede pronte da stampare: filtra, visualizza in anteprima, stampa e controlla con le soluzioni.",
  seoAnswerKeyTitle: "Soluzioni · Leo Kids",
};

Object.assign(out, AUTH);

// Sanitize values that still say foglio
for (const [k, v] of Object.entries(out)) {
  if (typeof v !== "string") continue;
  out[k] = v
    .replace(/fogli di lavoro/gi, "schede didattiche")
    .replace(/foglio di lavoro/gi, "scheda didattica")
    .replace(/foglio di calcolo/gi, "scheda didattica")
    .replace(/\bvoto\b/gi, (m, offset, s) => {
      // keep if clearly mark context; UI chrome already set to Classe
      return m;
    });
}

fs.writeFileSync(IT, JSON.stringify(out, null, 2) + "\n", "utf8");
console.log("Repaired worksheets.json keys", Object.keys(out).length);
