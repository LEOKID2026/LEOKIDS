/**
 * Offline residue cleanup for it-IT learning books (HE + Grade N outside title_english).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BOOK_ROOT = path.join(ROOT, "docs/learning-book/it-IT");

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".md")) out.push(p);
  }
  return out;
}

const HE_MAP = [
  [/ספר אנגלית — כיתה א׳/g, "Libro di Inglese — 1ª primaria"],
  [/ספר אנגלית — כיתה ב׳/g, "Libro di Inglese — 2ª primaria"],
  [/היכרות/g, "introduzione"],
  [/משפטים קצרים/g, "Frasi brevi"],
  [/בסיס/g, "base"],
  [/מספרים עד 20/g, "Numeri fino a 20"],
  [/צבעים באנגלית/g, "Colori in inglese"],
  [/מספרים 0–10 באנגלית/g, "Numeri 0–10 in inglese"],
  [/משפחה באנגלית/g, "Famiglia in inglese"],
  [/חיות באנגלית/g, "Animali in inglese"],
  [/רגשות באנגלית/g, "Emozioni in inglese"],
  [/פעלים באנגלית/g, "Azioni in inglese"],
  [/בית ספר באנגלית/g, "Scuola in inglese"],
  [/אוצר מילים/g, "Vocabolario"],
  [/כיתה א׳/g, "1ª primaria"],
  [/כיתה ב׳/g, "2ª primaria"],
  [/כיתה ג׳/g, "3ª primaria"],
  [/כיתה ד׳/g, "4ª primaria"],
  [/כיתה ה׳/g, "5ª primaria"],
  [/כיתה ו׳/g, "1ª secondaria"],
];

const PROSE = [
  [/\bKeep for Grade 1 draft:\b/g, "Mantieni per bozza 1ª primaria:"],
  [/\bchild-friendly, draft content only \(not final owner-approved product copy\)/g, "contenuto bozza per bambini (non copia prodotto approvata)"],
  [/\bAccepted per continued draft use\b/g, "Accettato per uso bozza continuato"],
  [/\bDraft use:\b/g, "Uso bozza:"],
  [/\bDraft solo\b/g, "Solo bozza"],
  [/\bnothing moved a review\/approved\/active\b/g, "niente spostato a review/approved/active"],
  [/\bOwner Decisions \(Recorded\)/g, "Decisioni del proprietario (registrate)"],
  [/\bHebrew explanations; English examples on own lines\b/g, "Spiegazioni in italiano; esempi in inglese su righe separate"],
  [/\bHebrew titles\b/g, "titoli legacy"],
  [/\bBatch UN Hebrew titles\b/g, "Batch UN titoli legacy"],
  [/\bBatch B Hebrew titles\b/g, "Batch B titoli legacy"],
  [/\bBatch C Hebrew titles\b/g, "Batch C titoli legacy"],
  [/\bBatch D Hebrew titles\b/g, "Batch D titoli legacy"],
  [/\bCurrent Status\b/g, "Stato attuale"],
  [/\bNaming\b/g, "Denominazione"],
  [/\bBook title:\b/g, "Titolo del libro:"],
  [/\bChild-facing subject:\b/g, "Materia per il bambino:"],
  [/\bContent rules\b/g, "Regole di contenuto"],
  [/\bRegenerate review pack\b/g, "Rigenera il pacchetto di revisione"],
  [/\bExplicit stop rule\b/g, "Regola di stop esplicita"],
  [/\bNot created\b/g, "Non creato"],
  [/\bDraft markdown pages\b/g, "Pagine markdown in bozza"],
  [/\bReview pack\b/g, "Pacchetto di revisione"],
  [/\bContent verification\b/g, "Verifica del contenuto"],
  [/\bDraft manifest \(scripts only\)\b/g, "Manifest bozza (solo script)"],
  [/\bRuntime \/ registry \/ routes\b/g, "Runtime / registro / route"],
  [/\bCurriculum plan\b/g, "Piano curricolare"],
  [/\bNo code\. No UI\. No SQL\. No commit\/push\/deploy\.\b/g, "Niente codice. Niente UI. Niente SQL. Niente commit/push/deploy."],
  [/\bContenuto in bozza solo\.\b/g, "Solo contenuto in bozza."],
  [/\bcomplete \(Batches\b/g, "complete (Batch"],
  [/\bdraft pages complete\b/g, "pagine bozza complete"],
  [/\bAll batches authored\b/g, "Tutti i batch redatti"],
  [/\bTutti batches authored\b/g, "Tutti i batch redatti"],
];

let changed = 0;
for (const f of walk(BOOK_ROOT)) {
  const raw = fs.readFileSync(f, "utf8");
  let out = raw;
  for (const [re, it] of HE_MAP) out = out.replace(re, it);
  out = out.replace(/[\u0590-\u05FF]+/g, "");
  out = out
    .split(/\n/)
    .map((line) => {
      if (/title_english/i.test(line)) return line;
      let l = line;
      for (const [re, it] of PROSE) l = l.replace(re, it);
      l = l
        .replace(/\bGrade 1\b/g, "1ª primaria")
        .replace(/\bGrade 2\b/g, "2ª primaria")
        .replace(/\bGrade 3\b/g, "3ª primaria")
        .replace(/\bGrade 4\b/g, "4ª primaria")
        .replace(/\bGrade 5\b/g, "5ª primaria")
        .replace(/\bGrade 6\b/g, "1ª secondaria")
        .replace(/\bYear 1\b/g, "1ª primaria")
        .replace(/\bYear 2\b/g, "2ª primaria")
        .replace(/\bYear 3\b/g, "3ª primaria")
        .replace(/\bYear 4\b/g, "4ª primaria")
        .replace(/\bYear 5\b/g, "5ª primaria")
        .replace(/\bYear 6\b/g, "1ª secondaria");
      return l;
    })
    .join("\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/ \|/g, " |");
  if (out !== raw) {
    fs.writeFileSync(f, out, "utf8");
    changed += 1;
  }
}
console.log("books residue cleaned", changed);
