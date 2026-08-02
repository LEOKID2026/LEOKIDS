/**
 * Italian (Italy) glossary — translation SSOT for it-IT.
 * Italy / standard Italian; children use tu; avoid Swiss-Italian regionalisms.
 */

/** @type {Record<string, { preferred: string, notes?: string }>} */
export const ITALIAN_ITALY_GLOSSARY = Object.freeze({
  Grade: { preferred: "Classe" },
  grade: { preferred: "classe" },
  Grades: { preferred: "Classi" },
  grades: { preferred: "classi" },
  "Grade 1": { preferred: "1ª primaria" },
  "Grade 2": { preferred: "2ª primaria" },
  "Grade 3": { preferred: "3ª primaria" },
  "Grade 4": { preferred: "4ª primaria" },
  "Grade 5": { preferred: "5ª primaria" },
  "Grade 6": { preferred: "1ª secondaria" },
  "All grades": { preferred: "Tutte le classi" },
  "Choose grade": { preferred: "Scegli la classe" },
  "Select grade": { preferred: "Scegli la classe" },
  "Activities by grade": { preferred: "Attività per classe" },
  Worksheet: { preferred: "Scheda didattica" },
  Worksheets: { preferred: "Schede didattiche" },
  worksheet: { preferred: "scheda didattica" },
  "exercise worksheet": { preferred: "scheda di esercizi" },
  "answer key": { preferred: "soluzioni" },
  Preview: { preferred: "Anteprima" },
  preview: { preferred: "anteprima" },
  Print: { preferred: "Stampa" },
  print: { preferred: "stampa" },
  Parent: { preferred: "Genitore" },
  Parents: { preferred: "Genitori" },
  parent: { preferred: "genitore" },
  "parent or guardian": { preferred: "genitore o tutore" },
  Student: { preferred: "Alunno" },
  Students: { preferred: "Alunni" },
  student: { preferred: "alunno" },
  Teacher: { preferred: "Insegnante" },
  Teachers: { preferred: "Insegnanti" },
  teacher: { preferred: "insegnante" },
  School: { preferred: "Scuola" },
  school: { preferred: "scuola" },
  Math: { preferred: "Matematica" },
  Geometry: { preferred: "Geometria" },
  English: { preferred: "Inglese" },
  Hebrew: { preferred: "Ebraico" },
  Science: { preferred: "Scienze" },
  Geography: { preferred: "Geografia" },
  History: { preferred: "Storia" },
  Practice: { preferred: "Esercitazione" },
  Report: { preferred: "Report" },
  "Parent report": { preferred: "Report per i genitori" },
  Hint: { preferred: "Suggerimento" },
  Loading: { preferred: "Caricamento…" },
  "Loading...": { preferred: "Caricamento…" },
  Save: { preferred: "Salva" },
  Cancel: { preferred: "Annulla" },
  Delete: { preferred: "Elimina" },
  Close: { preferred: "Chiudi" },
  Start: { preferred: "Inizia" },
  Continue: { preferred: "Continua" },
  "Try again": { preferred: "Riprova" },
  Next: { preferred: "Avanti" },
  Back: { preferred: "Indietro" },
  Play: { preferred: "Gioca" },
  Finish: { preferred: "Termina" },
  Check: { preferred: "Controlla" },
  Click: { preferred: "Clicca" },
  Choose: { preferred: "Scegli" },
  Select: { preferred: "Seleziona" },
  Answers: { preferred: "Risposte" },
  Answer: { preferred: "Risposta" },
  dollar: { preferred: "euro" },
  dollars: { preferred: "euro" },
  Dollar: { preferred: "Euro" },
  Dollars: { preferred: "Euro" },
  "Leo Kids": { preferred: "Leo Kids" },
});

/** Patterns that must not appear in it-IT product copy. */
export const FORBIDDEN_IT_IT_PATTERNS = Object.freeze([
  { re: /\bfoglio di calcolo\b/i, label: "foglio di calcolo→scheda didattica" },
  { re: /\bGrade\s*[1-6]\b/, label: "Grade N" },
  { re: /\bYear\s*[1-6]\b/, label: "Year N" },
  { re: /\b6ª primaria\b/i, label: "6ª primaria→1ª secondaria" },
  { re: /\bnatel\b/i, label: "Swiss natel" },
  { re: /\bvignette autostradale\b/i, label: "Swiss vignette phrasing" },
]);

export const IT_IT_LOCALE_ID = "it-IT";

/** Short grade display labels (UI). */
export const IT_IT_GRADE_SHORT = Object.freeze({
  grade1: "1ª primaria",
  grade2: "2ª primaria",
  grade3: "3ª primaria",
  grade4: "4ª primaria",
  grade5: "5ª primaria",
  grade6: "1ª secondaria",
});

/** Full grade display labels (when space allows). */
export const IT_IT_GRADE_FULL = Object.freeze({
  grade1: "1ª classe della scuola primaria",
  grade2: "2ª classe della scuola primaria",
  grade3: "3ª classe della scuola primaria",
  grade4: "4ª classe della scuola primaria",
  grade5: "5ª classe della scuola primaria",
  grade6: "1ª classe della scuola secondaria di primo grado",
});
