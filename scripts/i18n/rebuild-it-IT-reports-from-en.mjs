/**
 * Rebuild it-IT report copy from EN authority — natural Italy Italian.
 * Offline. Keys/structure unchanged.
 */
import fs from "node:fs";
import path from "node:path";
import { applyItalianAuthorityPostfix } from "./offline-es-to-it-IT.mjs";

const ROOT = process.cwd();

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".json")) out.push(p);
  }
  return out;
}

/** Longer first */
const PH = [
  [
    "This week, focus on grade 3–4 mixed Hebrew vocabulary and expressions through sentence context and explanation.",
    "Questa settimana, concentrati sul vocabolario e sulle espressioni ebraiche miste della 3ª–4ª primaria attraverso il contesto della frase e la spiegazione.",
  ],
  [
    "This week, focus on grade 3-4 mixed Hebrew vocabulary and expressions through sentence context and explanation.",
    "Questa settimana, concentrati sul vocabolario e sulle espressioni ebraiche miste della 3ª–4ª primaria attraverso il contesto della frase e la spiegazione.",
  ],
  [
    "This week, focus on grade 3–4 Hebrew writing: short clear answer, direct response to the question, one supporting detail, and rereading for clarity.",
    "Questa settimana, concentrati sulla scrittura in ebraico della 3ª–4ª primaria: risposta breve e chiara, risposta diretta alla domanda, un dettaglio di supporto e rilettura per maggiore chiarezza.",
  ],
  [
    "This week, focus on grade 3-4 Hebrew writing: short clear answer, direct response to the question, one supporting detail, and rereading for clarity.",
    "Questa settimana, concentrati sulla scrittura in ebraico della 3ª–4ª primaria: risposta breve e chiara, risposta diretta alla domanda, un dettaglio di supporto e rilettura per maggiore chiarezza.",
  ],
  [
    "This week, focus on grade 3–4 Hebrew sentence structure: identify the doer/action and how sentence parts connect.",
    "Questa settimana, concentrati sulla struttura della frase in ebraico della 3ª–4ª primaria: individua chi compie l'azione e come si collegano le parti della frase.",
  ],
  [
    "This week, focus on grade 3-4 Hebrew sentence structure: identify the doer/action and how sentence parts connect.",
    "Questa settimana, concentrati sulla struttura della frase in ebraico della 3ª–4ª primaria: individua chi compie l'azione e come si collegano le parti della frase.",
  ],
  [
    "This week, focus on grade 3–4 developed Hebrew writing: main idea, explanation, example, and keeping sentences connected.",
    "Questa settimana, concentrati sulla scrittura sviluppata in ebraico della 3ª–4ª primaria: idea principale, spiegazione, esempio e frasi collegate.",
  ],
  [
    "This week, focus on grade 3-4 developed Hebrew writing: main idea, explanation, example, and keeping sentences connected.",
    "Questa settimana, concentrati sulla scrittura sviluppata in ebraico della 3ª–4ª primaria: idea principale, spiegazione, esempio e frasi collegate.",
  ],
  [
    "This week, focus on grade 3–4 English sentence structure: basic word order, subject/action, and meaning completion.",
    "Questa settimana, concentrati sulla struttura della frase in inglese della 3ª–4ª primaria: ordine base delle parole, soggetto/azione e completamento del significato.",
  ],
  [
    "This week, focus on grade 3-4 English sentence structure: basic word order, subject/action, and meaning completion.",
    "Questa settimana, concentrati sulla struttura della frase in inglese della 3ª–4ª primaria: ordine base delle parole, soggetto/azione e completamento del significato.",
  ],
  [
    "After each exercise, ask your child to explain how they got the answer.",
    "Dopo ogni esercizio, chiedi a tuo figlio di spiegare come ha ottenuto la risposta.",
  ],
  ["It helps to practice", "È utile esercitarsi su"],
  ["This week, focus on", "Questa settimana, concentrati su"],
  ["grade 3–4", "3ª–4ª primaria"],
  ["grade 3-4", "3ª–4ª primaria"],
  ["Grade 6 ", "1ª secondaria "],
  ["grade 6 ", "1ª secondaria "],
  ["Grade 6", "1ª secondaria"],
  ["grade 6", "1ª secondaria"],
  ["Hasmonaean timeline sequencing", "la sequenza della linea temporale asmonea"],
  ["Rome/Judea timeline sequencing", "la sequenza della linea temporale Roma/Giudea"],
  ["mixed timeline sequencing", "la sequenza di linee temporali miste"],
  ["historical concepts and source terminology", "i concetti storici e la terminologia delle fonti"],
  ["mixed historical concept identification", "l'identificazione di concetti storici misti"],
  ["Hellenism/Judaism cause-effect", "la causa-effetto ellenismo/giudaismo"],
  ["Hasmonaean cause-effect", "la causa-effetto asmonea"],
  ["Rome/Judea cause-effect", "la causa-effetto Roma/Giudea"],
  ["mixed cause-effect", "la causa-effetto mista"],
  ["Athens/Sparta comparison", "il confronto Atene/Sparta"],
  ["mixed historical comparison", "il confronto storico misto"],
  ["Hellenism figures and roles", "le figure e i ruoli dell'ellenismo"],
  ["Rome/Judea figures and roles", "le figure e i ruoli di Roma/Giudea"],
  ["mixed figures and roles", "le figure e i ruoli misti"],
  ["classical Greece governance", "il governo della Grecia classica"],
  ["Hasmonaean governance", "il governo asmoneo"],
  ["Roman/Judean governance", "il governo romano/giudaico"],
  ["mixed governance institutions", "le istituzioni di governo miste"],
  ["Greek culture and legacy", "la cultura e il lascito greci"],
  ["Roman culture and legacy", "la cultura e il lascito romani"],
  ["mixed culture and heritage", "la cultura e il patrimonio misti"],
  ["simple historical source reading", "la lettura di fonti storiche semplici"],
  ["mixed source comprehension", "la comprensione di fonti miste"],
  ["past-present link in Rome/Judea period", "il collegamento passato-presente nel periodo Roma/Giudea"],
  ["mixed past-present link", "il collegamento passato-presente misto"],
  ["mixed Hebrew vocabulary and expressions through sentence context and explanation.", "il vocabolario e le espressioni ebraiche miste attraverso il contesto della frase e la spiegazione."],
  ["Hebrew writing: short clear answer, direct response to the question, one supporting detail, and rereading for clarity.", "la scrittura in ebraico: risposta breve e chiara, risposta diretta alla domanda, un dettaglio di supporto e rilettura per maggiore chiarezza."],
  ["Hebrew sentence structure: identify the doer/action and how sentence parts connect.", "la struttura della frase in ebraico: individua chi compie l'azione e come si collegano le parti della frase."],
  ["developed Hebrew writing: main idea, explanation, example, and keeping sentences connected.", "la scrittura sviluppata in ebraico: idea principale, spiegazione, esempio e frasi collegate."],
  ["English sentence structure: basic word order, subject/action, and meaning completion.", "la struttura della frase in inglese: ordine base delle parole, soggetto/azione e completamento del significato."],
];

const WORD = {
  the: "",
  a: "un",
  an: "un",
  and: "e",
  or: "o",
  of: "di",
  to: "a",
  in: "in",
  on: "su",
  for: "per",
  with: "con",
  from: "da",
  into: "in",
  that: "che",
  this: "questo",
  these: "questi",
  is: "è",
  are: "sono",
  be: "essere",
  have: "avere",
  has: "ha",
  can: "può",
  we: "noi",
  you: "tu",
  they: "loro",
  your: "tuo",
  their: "loro",
  not: "non",
  when: "quando",
  where: "dove",
  what: "cosa",
  which: "quale",
  how: "come",
  why: "perché",
  because: "perché",
  if: "se",
  then: "allora",
  also: "anche",
  only: "solo",
  each: "ogni",
  all: "tutti",
  more: "più",
  after: "dopo",
  before: "prima",
  between: "tra",
  without: "senza",
  about: "su",
  through: "attraverso",
  child: "figlio",
  ask: "chiedi a",
  explain: "spiegare",
  got: "ha ottenuto",
  answer: "risposta",
  answers: "risposte",
  practice: "esercitarsi",
  focus: "concentrati",
  week: "settimana",
  helps: "aiuta",
  exercise: "esercizio",
  topic: "argomento",
  topics: "argomenti",
  subject: "materia",
  subjects: "materie",
  report: "report",
  progress: "progresso",
  accuracy: "precisione",
  evidence: "prove",
  recommendation: "raccomandazione",
  recommendations: "raccomandazioni",
  strength: "punto di forza",
  strengths: "punti di forza",
  improvement: "miglioramento",
  improvements: "miglioramenti",
  challenge: "sfida",
  challenges: "sfide",
  summary: "riepilogo",
  detailed: "dettagliato",
  overview: "panoramica",
  need: "necessita",
  needs: "necessita",
  stable: "stabile",
  strong: "solido",
  thin: "limitate",
  clear: "chiaro",
  short: "breve",
  main: "principale",
  idea: "idea",
  example: "esempio",
  meaning: "significato",
  word: "parola",
  words: "parole",
  order: "ordine",
  basic: "base",
  mixed: "misto",
  simple: "semplice",
  historical: "storico",
  source: "fonte",
  sources: "fonti",
  reading: "lettura",
  comparison: "confronto",
  culture: "cultura",
  legacy: "lascito",
  heritage: "patrimonio",
  governance: "governo",
  institutions: "istituzioni",
  figures: "figure",
  roles: "ruoli",
  link: "collegamento",
  past: "passato",
  present: "presente",
  period: "periodo",
  timeline: "linea temporale",
  sequencing: "sequenza",
  identification: "identificazione",
  concepts: "concetti",
  terminology: "terminologia",
  hebrew: "ebraico",
  english: "inglese",
  writing: "scrittura",
  sentence: "frase",
  structure: "struttura",
  vocabulary: "vocabolario",
  expressions: "espressioni",
  context: "contesto",
  explanation: "spiegazione",
  detail: "dettaglio",
  supporting: "di supporto",
  rereading: "rilettura",
  clarity: "chiarezza",
  direct: "diretta",
  response: "risposta",
  question: "domanda",
  keeping: "mantenendo",
  sentences: "frasi",
  connected: "collegate",
  completion: "completamento",
  subject: "soggetto",
  action: "azione",
  identify: "individua",
  doer: "chi agisce",
  parts: "parti",
  connect: "collegare",
  developed: "sviluppata",
  one: "un",
  two: "due",
  three: "tre",
  four: "quattro",
  five: "cinque",
  six: "sei",
};

function matchCase(sample, replacement) {
  if (!sample || !replacement) return replacement;
  if (sample[0] === sample[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function enToIt(en) {
  let out = String(en ?? "");
  if (!out.trim()) return out;
  for (const [a, b] of PH) {
    if (out.includes(a)) out = out.split(a).join(b);
  }
  // If still mostly English
  if (/\b(This week|It helps|After each|ask your child|grade \d|Grade \d|focus on|timeline|cause-effect)\b/i.test(out)) {
    out = out.replace(/\b[A-Za-z']+\b/g, (w) => {
      const low = w.toLowerCase();
      if (WORD[low] != null) {
        const rep = WORD[low];
        if (!rep) return "";
        return matchCase(w, rep);
      }
      return w;
    });
    out = out.replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
  }
  out = out
    .replace(/\b6ª primaria\b/gi, "1ª secondaria")
    .replace(/\bGrade 6\b/g, "1ª secondaria")
    .replace(/\bgrade 6\b/gi, "1ª secondaria")
    .replace(/\bJudea\b/g, "Giudea")
    .replace(/\bHasmonaean\b/g, "asmonea")
    .replace(/\bHellenism\b/g, "ellenismo")
    .replace(/\bJudaism\b/g, "giudaismo")
    .replace(/\bAthens\b/g, "Atene")
    .replace(/\bSparta\b/g, "Sparta")
    .replace(/\bRome\b/g, "Roma")
    .replace(/\bGreek\b/g, "greco")
    .replace(/\bRoman\b/g, "romano")
    .replace(/\bclassical Greece\b/gi, "Grecia classica");
  // polish awkward "concentrati su la/il/i/l'"
  out = out
    .replace(/concentrati su la /gi, "concentrati sulla ")
    .replace(/concentrati su il /gi, "concentrati sul ")
    .replace(/concentrati su lo /gi, "concentrati sullo ")
    .replace(/concentrati su l'/gi, "concentrati sull'")
    .replace(/concentrati su i /gi, "concentrati sui ")
    .replace(/concentrati su le /gi, "concentrati sulle ")
    .replace(/esercitarsi su la /gi, "esercitarsi sulla ")
    .replace(/esercitarsi su il /gi, "esercitarsi sul ")
    .replace(/esercitarsi su l'/gi, "esercitarsi sull'")
    .replace(/esercitarsi su i /gi, "esercitarsi sui ")
    .replace(/ del 1ª secondaria/g, " della 1ª secondaria")
    .replace(/ de 1ª secondaria/g, " della 1ª secondaria")
    .replace(/ di 1ª secondaria\./g, " della 1ª secondaria.")
    .replace(/\b1ª secondaria \./g, "1ª secondaria.");
  return applyItalianAuthorityPostfix(out);
}

function transform(enNode) {
  if (typeof enNode === "string") return enToIt(enNode);
  if (Array.isArray(enNode)) return enNode.map(transform);
  if (enNode && typeof enNode === "object") {
    const o = {};
    for (const [k, v] of Object.entries(enNode)) o[k] = transform(v);
    return o;
  }
  return enNode;
}

const enRoot = path.join(ROOT, "content-packs/en/reports");
const itRoot = path.join(ROOT, "content-packs/it-IT/reports");
let n = 0;
for (const enFile of walk(enRoot)) {
  const rel = path.relative(enRoot, enFile);
  const itFile = path.join(itRoot, rel);
  const en = JSON.parse(fs.readFileSync(enFile, "utf8"));
  const out = transform(en);
  fs.mkdirSync(path.dirname(itFile), { recursive: true });
  fs.writeFileSync(itFile, JSON.stringify(out, null, 2) + "\n", "utf8");
  n += 1;
}
console.log("reports rebuilt from EN", n);

// quick bad count
const ES =
  /[áíóúñ¿¡]|Questa semana|concéntrese|pidale|Secuenciacion|ejercicio|sexto classe|el vocabulario|las expresiones|de conceptos|de lineas|entre Atenas|helenismo\/judaismo de|concentrati su el |concentrati su la scrittura en/i;
let bad = 0;
for (const f of walk(itRoot)) {
  const t = fs.readFileSync(f, "utf8");
  if (ES.test(t)) bad += 1;
}
console.log({ filesWithEsMarks: bad });
