/**
 * Offline closure pass for it-IT content layer.
 * No network / no API agents.
 *
 * Run: node scripts/i18n/finalize-it-IT-closure.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { applyItalianAuthorityPostfix } from "./offline-es-to-it-IT.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

function loadJson(p, fallback = {}) {
  if (!fs.existsSync(p)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return fallback;
  }
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

function protect(s) {
  /** @type {string[]} */
  const ph = [];
  let out = String(s).replace(/```[\s\S]*?```/g, (b) => {
    ph.push(b);
    return `⟦B${ph.length - 1}⟧`;
  });
  out = out.replace(/`([^`]+)`/g, (_, c) => {
    ph.push(c);
    return `⟦C${ph.length - 1}⟧`;
  });
  out = out.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, n) => {
    ph.push(n);
    return `⟦P${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}
function restore(s, ph) {
  return String(s)
    .replace(/⟦B(\d+)⟧/g, (_, i) => ph[Number(i)])
    .replace(/⟦C(\d+)⟧/g, (_, i) => `\`${ph[Number(i)]}\``)
    .replace(/⟦P(\d+)⟧/g, (_, i) => `{${ph[Number(i)]}}`);
}

/** Longer first */
const EN_IT = [
  ["What are we learning?", "Cosa stiamo imparando?"],
  ["Simple explanation", "Spiegazione semplice"],
  ["Visual / concrete example", "Esempio visuale / concreto"],
  ["Let's solve together", "Risolviamo insieme"],
  ["Try it yourself", "Prova tu"],
  ["Common mistake — watch out!", "Errore comune — attenzione!"],
  ["Common mistake", "Errore comune"],
  ["Let's check together", "Controlliamo insieme"],
  ["Let's practice!", "Esercitiamoci!"],
  ["Source references:", "Riferimenti alle fonti:"],
  ["Content scope:", "Ambito del contenuto:"],
  ["Metadata", "Metadati"],
  ["Field", "Campo"],
  ["Value", "Valore"],
  ["Today we're going to learn", "Oggi impariamo"],
  ["Today we are going to learn", "Oggi impariamo"],
  ["Today we will learn", "Oggi impariamo"],
  ["Try to solve it on your own.", "Prova a risolverlo da solo."],
  ["On the next page we'll check the steps and the answer together.", "Nella pagina successiva controlleremo insieme i passaggi e la risposta."],
  ["Addition is when you put two groups together to make one bigger group.", "L'addizione è quando unisci due gruppi per formarne uno più grande."],
  ["When you add — you put two amounts together.", "Quando addizioni — unisci due quantità."],
  ['+ means "and more".', '+ significa "e ancora".'],
  ['= means "that\'s the total".', '= significa "questo è il totale".'],
  ["For example:", "Per esempio:"],
  ["Main examples:", "Esempi principali:"],
  ["Let's break it into easy steps.", "Dividiamolo in passaggi semplici."],
  ["First we add", "Prima addizioniamo"],
  ["Still need to add", "Dobbiamo ancora aggiungere"],
  ["Start at", "Parti da"],
  ["How many", "Quanti"],
  ["How much", "Quanto"],
  ["What is", "Quanto fa / Che cos'è"],
  ["Write the", "Scrivi"],
  ["Fill in", "Completa"],
  ["A fraction is written like this:", "Una frazione si scrive così:"],
  ["The denominator — how many equal parts there are in all.", "Il denominatore — quante parti uguali ci sono in tutto."],
  ["The numerator — how many parts we take.", "Il numeratore — quante parti prendiamo."],
  ["numbers that show a part of a whole", "numeri che mostrano una parte di un intero"],
  ["When we split something into equal parts, each part like that is a fraction.", "Quando dividiamo qualcosa in parti uguali, ciascuna di queste parti è una frazione."],
  ["equal parts", "parti uguali"],
  ["We take", "Prendiamo"],
  ["We colored", "Abbiamo colorato"],
  ["of them", "di esse"],
  ["of the cake is colored", "della torta è colorata"],
  ["out of", "su"],
  ["a half", "una metà"],
  ["a third", "un terzo"],
  ["a quarter", "un quarto"],
  ["chocolate bar", "tavoletta di cioccolato"],
  ["Answer key", "Soluzioni"],
  ["Worksheet", "Scheda didattica"],
  ["Worksheets", "Schede didattiche"],
  ["Choose grade", "Scegli la classe"],
  ["Select grade", "Scegli la classe"],
  ["All grades", "Tutte le classi"],
  ["Try again", "Riprova"],
  ["Grade 1", "1ª primaria"],
  ["Grade 2", "2ª primaria"],
  ["Grade 3", "3ª primaria"],
  ["Grade 4", "4ª primaria"],
  ["Grade 5", "5ª primaria"],
  ["Grade 6", "1ª secondaria"],
  ["Year 1", "1ª primaria"],
  ["Year 2", "2ª primaria"],
  ["Year 3", "3ª primaria"],
  ["Year 4", "4ª primaria"],
  ["Year 5", "5ª primaria"],
  ["Year 6", "1ª secondaria"],
  ["Current Status", "Stato attuale"],
  ["Draft content", "Contenuto in bozza"],
  ["Not owner-approved", "Non approvato dal proprietario"],
  ["No runtime wired", "Nessun runtime collegato"],
  ["Book title:", "Titolo del libro:"],
  ["Child-facing subject:", "Materia rivolta ai bambini:"],
  ["Internal IDs:", "ID interni:"],
  ["Naming", "Denominazione"],
  ["Folder:", "Cartella:"],
  ["Status:", "Stato:"],
  ["Date:", "Data:"],
  ["English Learning Book — Drafts", "Libro di Inglese — Bozze"],
  ["Learning Book — Drafts", "Libro di apprendimento — Bozze"],
  ["numerator / denominator", "numeratore / denominatore"],
  ["numerator", "numeratore"],
  ["denominator", "denominatore"],
  ["fraction", "frazione"],
  ["fractions", "frazioni"],
  ["number line", "retta dei numeri"],
  ["even number", "numero pari"],
  ["odd number", "numero dispari"],
  ["perimeter", "perimetro"],
  ["circumference", "circonferenza"],
  ["radius", "raggio"],
  ["diameter", "diametro"],
  ["right angle", "angolo retto"],
  ["square", "quadrato"],
  ["rectangle", "rettangolo"],
  ["triangle", "triangolo"],
  ["circle", "cerchio"],
  ["addition", "addizione"],
  ["subtraction", "sottrazione"],
  ["multiplication", "moltiplicazione"],
  ["division", "divisione"],
  ["percentage", "percentuale"],
  ["percentages", "percentuali"],
  ["decimal", "decimale"],
  ["decimals", "decimali"],
  ["dollars", "euro"],
  ["dollar", "euro"],
  ["student", "alunno"],
  ["students", "alunni"],
  ["teacher", "insegnante"],
  ["parent", "genitore"],
  ["parents", "genitori"],
];

const WORD_IT = {
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
  those: "quei",
  is: "è",
  are: "sono",
  was: "era",
  were: "erano",
  be: "essere",
  been: "stato",
  have: "avere",
  has: "ha",
  had: "aveva",
  do: "fare",
  does: "fa",
  did: "ha fatto",
  will: "",
  can: "può",
  could: "poteva",
  should: "dovrebbe",
  would: "vorrebbe",
  we: "noi",
  you: "tu",
  they: "loro",
  he: "lui",
  she: "lei",
  it: "esso",
  our: "nostro",
  your: "tuo",
  their: "loro",
  his: "suo",
  her: "sua",
  its: "suo",
  not: "non",
  no: "no",
  yes: "sì",
  when: "quando",
  where: "dove",
  what: "cosa",
  which: "quale",
  who: "chi",
  how: "come",
  why: "perché",
  because: "perché",
  if: "se",
  then: "allora",
  also: "anche",
  only: "solo",
  each: "ogni",
  all: "tutti",
  some: "alcuni",
  many: "molti",
  more: "più",
  less: "meno",
  most: "la maggior parte",
  same: "stesso",
  different: "diverso",
  equal: "uguale",
  part: "parte",
  parts: "parti",
  whole: "intero",
  half: "metà",
  third: "terzo",
  quarter: "quarto",
  number: "numero",
  numbers: "numeri",
  group: "gruppo",
  groups: "gruppi",
  total: "totale",
  answer: "risposta",
  answers: "risposte",
  step: "passaggio",
  steps: "passaggi",
  example: "esempio",
  examples: "esempi",
  learn: "imparare",
  learning: "apprendimento",
  practice: "esercitazione",
  solve: "risolvere",
  check: "controllare",
  choose: "scegliere",
  select: "selezionare",
  write: "scrivere",
  read: "leggere",
  draw: "disegnare",
  count: "contare",
  add: "addizionare",
  subtract: "sottrarre",
  multiply: "moltiplicare",
  divide: "dividere",
  compare: "confrontare",
  measure: "misurare",
  find: "trovare",
  show: "mostrare",
  take: "prendere",
  put: "mettere",
  make: "fare",
  split: "dividere",
  color: "colorare",
  coloured: "colorato",
  colored: "colorato",
  cake: "torta",
  pizza: "pizza",
  shape: "figura",
  shapes: "figure",
  side: "lato",
  sides: "lati",
  angle: "angolo",
  angles: "angoli",
  area: "area",
  length: "lunghezza",
  width: "larghezza",
  height: "altezza",
  body: "corpo",
  animal: "animale",
  animals: "animali",
  plant: "pianta",
  plants: "piante",
  water: "acqua",
  air: "aria",
  light: "luce",
  heat: "calore",
  force: "forza",
  energy: "energia",
  material: "materiale",
  materials: "materiali",
  experiment: "esperimento",
  observe: "osservare",
  explain: "spiegare",
  remember: "ricordare",
  mistake: "errore",
  careful: "attento",
  together: "insieme",
  again: "di nuovo",
  now: "ora",
  first: "prima",
  next: "poi",
  last: "ultimo",
  before: "prima",
  after: "dopo",
  between: "tra",
  without: "senza",
  about: "su",
  like: "come",
  such: "tale",
  there: "lì",
  here: "qui",
  one: "uno",
  two: "due",
  three: "tre",
  four: "quattro",
  five: "cinque",
  six: "sei",
  seven: "sette",
  eight: "otto",
  nine: "nove",
  ten: "dieci",
  paper: "carta",
  sheet: "foglio",
  scissors: "forbici",
  metal: "metallo",
  wood: "legno",
  pencil: "matita",
  burn: "bruciare",
  fold: "piegare",
  letter: "lettera",
};

function matchCase(sample, replacement) {
  if (!sample || !replacement) return replacement;
  if (sample === sample.toUpperCase()) return replacement.toUpperCase();
  if (sample[0] === sample[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function translateEnglishProse(text, caches = []) {
  const raw = String(text ?? "");
  if (!raw.trim()) return raw;
  if (raw.includes("\n")) {
    return raw
      .split(/(\n)/)
      .map((part) => (part === "\n" ? part : translateEnglishProse(part, caches)))
      .join("");
  }
  for (const cache of caches) {
    if (cache[raw]) return applyItalianAuthorityPostfix(cache[raw]);
  }
  const guarded = protect(raw);
  let out = guarded.text;
  for (const [en, it] of EN_IT) {
    if (out.includes(en)) out = out.split(en).join(it);
  }
  // word pass for leftover English tokens
  out = out.replace(/\b[A-Za-z']+\b/g, (w) => {
    const low = w.toLowerCase();
    if (WORD_IT[low] != null) {
      const rep = WORD_IT[low];
      if (!rep) return "";
      return matchCase(w, rep);
    }
    return w;
  });
  out = out.replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1");
  // preserve leading/trailing spaces from original line
  const lead = (raw.match(/^\s*/) || [""])[0];
  const trail = (raw.match(/\s*$/) || [""])[0];
  out = lead + out.trim() + trail;
  out = restore(out, guarded.ph);
  return applyItalianAuthorityPostfix(out);
}

function isProtectedMetaLine(line) {
  return /\|\s*\*\*(learning_page_id|skill_id|subject|grade|age_band|page_type|approval_status|title_english)\*\*/i.test(
    line,
  );
}

function translateBookMarkdown(md, caches, { englishSubject }) {
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const yaml = fm ? fm[1] : null;
  const body = fm ? fm[2] : md;

  const outBody = body
    .split(/(```[\s\S]*?```)/g)
    .map((part) => {
      if (part.startsWith("```")) return part;
      return part
        .split(/(\n)/)
        .map((line) => {
          if (line === "\n") return line;
          if (isProtectedMetaLine(line)) return line;
          if (/^\|\s*[-:| ]+\s*$/.test(line)) return line;
          if (englishSubject) {
            // translate chrome / Hebrew / Italianize labels; keep heavy English example lines with many backticks
            if ((line.match(/`/g) || []).length >= 2 && !/Book title|Child-facing|Status|Naming|Batch|Current Status|Folder|Date||||/.test(line)) {
              return line;
            }
            // always clear Hebrew
            if (/[\u0590-\u05FF]/.test(line)) return translateHebrewLine(line);
            if (
              /^#{1,6}\s/.test(line) ||
              /\b(What are we learning|Simple explanation|Try it yourself|Common mistake|Metadata|Content scope|Source references|Current Status|Naming|Book title|Child-facing|Draft content|Status:|Date:|Folder:)\b/i.test(
                line,
              ) ||
              /\b(Grade\s*[1-6]|Year\s*[1-6])\b/.test(line)
            ) {
              return translateEnglishProse(line, caches);
            }
            // README tables with Hebrew titles
            if (/[\u0590-\u05FF]/.test(line) || /\|\s*`[^`]+`\s*\|/.test(line)) {
              return translateHebrewLine(translateEnglishProse(line, caches));
            }
            return line;
          }
          if (/[\u0590-\u05FF]/.test(line)) return translateHebrewLine(line);
          return translateEnglishProse(line, caches);
        })
        .join("");
    })
    .join("");

  if (!yaml) return outBody;
  return `---\n${yaml}\n---\n${outBody}`;
}

function translateHebrewLine(line) {
  let out = line;
  const map = [
    [/English book — Grade 1/g, "Libro di Inglese — 1ª primaria"],
    [/English book — Grade 2/g, "Libro di Inglese — 2ª primaria"],
    [/English book — Grade 3/g, "Libro di Inglese — 3ª primaria"],
    [/English book — Grade 4/g, "Libro di Inglese — 4ª primaria"],
    [/English book — Grade 5/g, "Libro di Inglese — 5ª primaria"],
    [/English book — Grade 6/g, "Libro di Inglese — 1ª secondaria"],
    [/Math book — Grade 1/g, "Libro di Matematica — 1ª primaria"],
    [/Math book — Grade 2/g, "Libro di Matematica — 2ª primaria"],
    [/Math book — Grade 3/g, "Libro di Matematica — 3ª primaria"],
    [/Math book — Grade 4/g, "Libro di Matematica — 4ª primaria"],
    [/Math book — Grade 5/g, "Libro di Matematica — 5ª primaria"],
    [/Math book — Grade 6/g, "Libro di Matematica — 1ª secondaria"],
    [/Geometry book — Grade 1/g, "Libro di Geometria — 1ª primaria"],
    [/Geometry book — Grade 2/g, "Libro di Geometria — 2ª primaria"],
    [/Geometry book — Grade 3/g, "Libro di Geometria — 3ª primaria"],
    [/Geometry book — Grade 4/g, "Libro di Geometria — 4ª primaria"],
    [/Geometry book — Grade 5/g, "Libro di Geometria — 5ª primaria"],
    [/Geometry book — Grade 6/g, "Libro di Geometria — 1ª secondaria"],
    [/Science book — Grade 1/g, "Libro di Scienze — 1ª primaria"],
    [/Science book — Grade 2/g, "Libro di Scienze — 2ª primaria"],
    [/Science book — Grade 3/g, "Libro di Scienze — 3ª primaria"],
    [/Science book — Grade 4/g, "Libro di Scienze — 4ª primaria"],
    [/Science book — Grade 5/g, "Libro di Scienze — 5ª primaria"],
    [/Science book — Grade 6/g, "Libro di Scienze — 1ª secondaria"],
    [/\bEnglish\b/g, "Inglese"],
    [/\bMath\b/g, "Matematica"],
    [/\bGeometry\b/g, "Geometria"],
    [/\bScience\b/g, "Scienze"],
    [/Vocabulary/g, "Vocabolario"],
    [/Colors in English/g, "Colori in inglese"],
    [/Numbers 0–10 in English/g, "Numeri 0–10 in inglese"],
    [/Numbers up to 20/g, "Numeri fino a 20"],
    [/Family in English/g, "Famiglia in inglese"],
    [/Animals in English/g, "Animali in inglese"],
    [/Feelings in English/g, "Emozioni in inglese"],
    [/Verbs in English/g, "Azioni in inglese"],
    [/School in English/g, "Scuola in inglese"],
    [/Introduction/g, "introduzione"],
    [/Short sentences/g, "Frasi brevi"],
    [/Basics/g, "base"],
    [/Class translation/g, "Traduzione in classe"],
    [/Grade 1/g, "1ª primaria"],
    [/Grade 2/g, "2ª primaria"],
    [/Grade 3/g, "3ª primaria"],
    [/Grade 4/g, "4ª primaria"],
    [/Grade 5/g, "5ª primaria"],
    [/Grade 6/g, "1ª secondaria"],
  ];
  for (const [re, it] of map) out = out.replace(re, it);
  // strip any remaining Hebrew letters / niqqud leftovers
  out = out.replace(/[\u0590-\u05FF]+/g, "").replace(/\s{2,}/g, " ").replace(/\s+\|/g, " |");
  return out;
}

function mapJsonStrings(node, key, fn) {
  if (typeof node === "string") return fn(node, key);
  if (Array.isArray(node)) return node.map((x, i) => mapJsonStrings(x, key, fn));
  if (node && typeof node === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = mapJsonStrings(v, k, fn);
    return out;
  }
  return node;
}

const SKIP_KEYS = new Set([
  "id",
  "ids",
  "slug",
  "href",
  "src",
  "path",
  "route",
  "url",
  "key",
  "code",
  "type",
  "kind",
  "locale",
  "namespace",
  "skillId",
  "pageType",
  "learningPageId",
  "gameId",
  "subjectId",
  "topicId",
]);

function authorityLocaleString(s, key) {
  let out = String(s);
  const reps = [
    [/\bstudente\b/gi, "alunno"],
    [/\bstudenti\b/gi, "alunni"],
    [/\bScegli un voto\b/g, "Scegli la classe"],
    [/\bvoto\b/g, (m, off, str) => {
      // keep if clearly mark/score context near "precisione" etc; school year -> classe
      const ctx = str.slice(Math.max(0, off - 30), off + 30).toLowerCase();
      if (/scegli|classe|anno|grade|scuola/.test(ctx)) return "classe";
      return m;
    }],
    [/\bGrade 1\b/g, "1ª primaria"],
    [/\bGrade 2\b/g, "2ª primaria"],
    [/\bGrade 3\b/g, "3ª primaria"],
    [/\bGrade 4\b/g, "4ª primaria"],
    [/\bGrade 5\b/g, "5ª primaria"],
    [/\bGrade 6\b/g, "1ª secondaria"],
    [/\b6ª primaria\b/gi, "1ª secondaria"],
    [/\bClasse\s*6\b/g, "1ª secondaria"],
    [/\bclasse\s*6\b/g, "1ª secondaria"],
    [/\bAccesso studente\b/g, "Accesso alunno"],
    [/\bAccesso dello studente\b/g, "Accesso dell'alunno"],
    [/\bSono uno studente\b/g, "Sono un alunno"],
    [/\bnessuno studente\b/gi, "nessun alunno"],
    [/\bcome studente\b/gi, "come alunno"],
    [/\bdello studente\b/gi, "dell'alunno"],
    [/\bdella studente\b/gi, "dell'alunna"],
    [/\bNome dello studente\b/g, "Nome dell'alunno"],
    [/\bReport dello studente\b/g, "Report dell'alunno"],
    [/\bproprietà dello studente\b/gi, "appartenenza dell'alunno"],
    [/\bquestion\b/g, "domanda"],
    [/\bquestions\b/g, "domande"],
    [/hoja de carta/gi, "foglio di carta"],
    [/hoja de unas tijeras/gi, "lama di un paio di forbici"],
    [/hoja de/gi, "foglio di"],
    [/Doblar una hoja/gi, "Piegare un foglio"],
    [/sujetapapeles/gi, "fermagli"],
    [/unas tijeras/gi, "un paio di forbici"],
    [/Quemar carta/gi, "Bruciare carta"],
    [/lapiz de legno/gi, "matita di legno"],
    [/foglio di calcolo/gi, "scheda didattica"],
  ];
  for (const [re, rep] of reps) out = out.replace(re, rep);
  if (key === "gradeLabel") out = "{grade}"; // grade already localized short label
  if (key === "chooseGrade") out = "Scegli la classe";
  return applyItalianAuthorityPostfix(out);
}

function fixLocales() {
  const dir = path.join(ROOT, "locales/it-IT");
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json"))) {
    const p = path.join(dir, f);
    const obj = JSON.parse(fs.readFileSync(p, "utf8"));
    const out = mapJsonStrings(obj, "", (s, key) => {
      if (SKIP_KEYS.has(key)) return s;
      return authorityLocaleString(s, key);
    });
    if (f === "common.json") {
      out.gradeLabel = "{grade}";
      out.grade1 = "1ª primaria";
      out.grade2 = "2ª primaria";
      out.grade3 = "3ª primaria";
      out.grade4 = "4ª primaria";
      out.grade5 = "5ª primaria";
      out.grade6 = "1ª secondaria";
      out.brandName = "Leo Kids";
      out.subjectMath = "Matematica";
      out.subjectGeometry = "Geometria";
      out.subjectEnglish = "Inglese";
      out.subjectScience = "Scienze";
    }
    if (f === "learning.json") {
      out.chooseGrade = "Scegli la classe";
      if (typeof out.questionsAnswered === "string") {
        out.questionsAnswered = "{count, plural, one {# domanda} other {# domande}}";
      }
    }
    fs.writeFileSync(p, JSON.stringify(out, null, 2) + "\n", "utf8");
  }
  console.log("locales fixed");
}

function fixPacks() {
  const files = walk(path.join(ROOT, "content-packs/it-IT"), (n) => n.endsWith(".json"));
  let n = 0;
  for (const f of files) {
    const obj = JSON.parse(fs.readFileSync(f, "utf8"));
    const out = mapJsonStrings(obj, "", (s, key) => {
      if (SKIP_KEYS.has(key)) return s;
      let v = authorityLocaleString(s, key);
      // translate residual English chrome in packs via phrase table
      for (const [en, it] of EN_IT) {
        if (v.includes(en)) v = v.split(en).join(it);
      }
      return v;
    });
    fs.writeFileSync(f, JSON.stringify(out, null, 2) + "\n", "utf8");
    n += 1;
  }
  console.log("packs fixed", n);
}

async function fixScience() {
  const enMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
  const itPath = path.join(ROOT, "data/science-questions-it-IT-overlay.js");
  const cache = loadJson(path.join(__dirname, "_mt-cache-it-IT-science.json"));
  const en = enMod.SCIENCE_EN_OVERLAY;
  // load current IT if present
  let current = {};
  if (fs.existsSync(itPath)) {
    current = (await import(pathToFileURL(itPath).href + `?t=${Date.now()}`)).SCIENCE_IT_IT_OVERLAY;
  }

  function polish(str, enStr) {
    if (cache[enStr]) return authorityLocaleString(cache[enStr], "");
    let s = String(str ?? "");
    // if still looks Spanish-heavy, rebuild lightly from EN words
    if (/\b(hoja|tijeras|sujeta|quemar|doblar|lapiz)\b/i.test(s) && enStr) {
      s = translateEnglishProse(enStr, [cache]);
    }
    s = authorityLocaleString(s, "");
    return s;
  }

  /** @type {Record<string, unknown>} */
  const out = {};
  for (const id of Object.keys(en)) {
    const enQ = en[id];
    const itQ = current[id] || {};
    /** @type {Record<string, unknown>} */
    const row = {};
    for (const [k, ev] of Object.entries(enQ)) {
      const iv = itQ[k];
      if (typeof ev === "string") row[k] = polish(iv ?? ev, ev);
      else if (Array.isArray(ev)) {
        row[k] = ev.map((item, i) =>
          typeof item === "string"
            ? polish(Array.isArray(iv) ? iv[i] : item, item)
            : item,
        );
      } else row[k] = iv ?? ev;
    }
    out[id] = row;
  }
  const body =
    `/** Italian (Italy) science overlay — closed linguistic pass (offline). */\n` +
    `export const SCIENCE_IT_IT_OVERLAY = ${JSON.stringify(out, null, 2)};\n`;
  fs.writeFileSync(itPath, body, "utf8");
  console.log("science polished", Object.keys(out).length);
}

function fixBooks() {
  const caches = [
    loadJson(path.join(__dirname, "_mt-cache-it-IT-learning-book.json")),
    loadJson(path.join(__dirname, "_mt-cache-it-IT.json")),
  ];
  const enRoot = path.join(ROOT, "docs/learning-book/en");
  const outRoot = path.join(ROOT, "docs/learning-book/it-IT");
  const files = walk(enRoot, (n) => n.endsWith(".md"));
  let n = 0;
  for (const enFile of files) {
    const rel = path.relative(enRoot, enFile);
    const dest = path.join(outRoot, rel);
    const md = fs.readFileSync(enFile, "utf8");
    const englishSubject = rel.replace(/\\/g, "/").startsWith("english/");
    const out = translateBookMarkdown(md, caches, { englishSubject });
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, out, "utf8");
    n += 1;
    if (n % 50 === 0) console.log("books", n, "/", files.length);
  }
  console.log("books rewritten", n);
}

function fixHelp() {
  const dir = path.join(ROOT, "data/help-center/it-IT");
  for (const f of walk(dir, (n) => n.endsWith(".js"))) {
    let t = fs.readFileSync(f, "utf8");
    // Only polish quoted string literals — never touch identifiers/slugs/paths keys.
    t = t.replace(/(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g, (full, q, body) => {
      // keep screenshot/import path segments stable
      if (/^\/help-center\//.test(body) || /^\.\//.test(body) || body.startsWith("./")) return full;
      let s = authorityLocaleString(body, "");
      for (const [en, it] of EN_IT) {
        if (s.includes(en)) s = s.split(en).join(it);
      }
      // restore English section slugs if word-map damaged them inside strings
      s = s
        .replace(/\bgenitores\b/g, "parents")
        .replace(/\balunnos\b/g, "students")
        .replace(/\bgenitore-report\b/g, "parent-report");
      return q + s + q;
    });
    fs.writeFileSync(f, t, "utf8");
  }
  console.log("help polished");
}

function fixMeanings() {
  // ensure authority Italian for polysemy; strip any Hebrew if present
  const p = path.join(ROOT, "data/english-questions/word-meanings/it-IT.js");
  let t = fs.readFileSync(p, "utf8");
  if (/[\u0590-\u05FF]/.test(t)) {
    t = t.replace(/[\u0590-\u05FF]+/g, "");
    fs.writeFileSync(p, t, "utf8");
  }
  console.log("meanings checked");
}

function fixMathGeoCommentsOnly() {
  // ensure no dollar / Spanish in rebuilders already Italian — quick authority sweep
  for (const f of ["math.js", "geometry.js", "index.js"]) {
    const p = path.join(ROOT, "utils/learning-content-it-IT", f);
    let t = fs.readFileSync(p, "utf8");
    const before = t;
    t = t.replace(/\bdollars?\b/gi, "euro");
    t = t.replace(/\bstudente\b/gi, "alunno");
    if (t !== before) fs.writeFileSync(p, t, "utf8");
  }
  console.log("math/geo checked");
}

async function main() {
  fixLocales();
  fixPacks();
  await fixScience();
  fixBooks();
  fixHelp();
  fixMeanings();
  fixMathGeoCommentsOnly();
  // worksheets authority again
  const wsPath = path.join(ROOT, "locales/it-IT/worksheets.json");
  if (fs.existsSync(wsPath)) {
    const ws = JSON.parse(fs.readFileSync(wsPath, "utf8"));
    ws.hubTitle = "Schede didattiche stampabili";
    ws.tabGenerator = "Crea una scheda didattica";
    ws.createWorksheet = "Crea una scheda didattica";
    ws.answerKey = "Soluzioni";
    ws.preview = "Anteprima";
    ws.print = "Stampa";
    ws.gradeField = "Classe";
    ws.selectGrade = "Classe";
    ws.chooseGrade = ws.chooseGrade || "Scegli la classe";
    fs.writeFileSync(wsPath, JSON.stringify(ws, null, 2) + "\n", "utf8");
  }
  console.log("DONE finalize-it-IT-closure");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
