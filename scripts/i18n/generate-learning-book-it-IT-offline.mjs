/**
 * Offline learning-book/it-IT from English authority.
 * Uses curated EN→IT educational phrases + existing MT cache (no network).
 * English-subject pages: translate chrome only; keep backtick/code targets.
 *
 * Run: node scripts/i18n/generate-learning-book-it-IT-offline.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { applyItalianAuthorityPostfix } from "./offline-es-to-it-IT.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EN = path.join(ROOT, "docs/learning-book/en");
const OUT = path.join(ROOT, "docs/learning-book/it-IT");
const CACHE_PATH = path.join(__dirname, "_mt-cache-it-IT-learning-book.json");
const LAYER_CACHE = path.join(__dirname, "_mt-cache-it-IT.json");

/** Curated educational EN→IT phrases (longer first). */
const EN_IT_PHRASES = [
  ["Today we're going to learn to add two numbers.", "Oggi impariamo ad addizionare due numeri."],
  ["Today we're going to learn", "Oggi impariamo"],
  ["Today we are going to learn", "Oggi impariamo"],
  ["What are we learning?", "Cosa stiamo imparando?"],
  ["Simple explanation", "Spiegazione semplice"],
  ["Visual / concrete example", "Esempio visuale / concreto"],
  ["Let's solve together", "Risolviamo insieme"],
  ["Try it yourself", "Prova tu"],
  ["Common mistake — watch out!", "Errore comune — attenzione!"],
  ["Common mistake", "Errore comune"],
  ["Source references:", "Riferimenti alle fonti:"],
  ["Content scope:", "Ambito del contenuto:"],
  ["Try to solve it on your own.", "Prova a risolverlo da solo."],
  ["On the next page we'll check the steps and the answer together.", "Nella pagina successiva controlleremo insieme i passaggi e la risposta."],
  ["Addition is when you put two groups together to make one bigger group.", "L'addizione è quando unisci due gruppi per formarne uno più grande."],
  ["When you add — you put two amounts together.", "Quando addizioni — unisci due quantità."],
  ['+ means "and more".', '+ significa "e ancora".'],
  ['= means "that\'s the total".', '= significa "questo è il totale".'],
  ["Four and three more — together that's seven.", "Quattro e ancora tre — insieme fanno sette."],
  ["For example:", "Per esempio:"],
  ["together that's", "insieme fanno"],
  ["Let's break it into easy steps.", "Dividiamolo in passaggi semplici."],
  ["First we add", "Prima addizioniamo"],
  ["Still need to add", "Dobbiamo ancora aggiungere"],
  ["Start at", "Parti da"],
  ["Add 11 —", "Aggiungi 11 —"],
  ["up to", "fino a"],
  ["How many", "Quanti"],
  ["What is", "Quanto fa"],
  ["Write the", "Scrivi"],
  ["Fill in", "Completa"],
  ["Choose", "Scegli"],
  ["Select", "Seleziona"],
  ["Continue", "Continua"],
  ["Practice", "Esercitati"],
  ["Worksheet", "Scheda didattica"],
  ["Worksheets", "Schede didattiche"],
  ["Answer key", "Soluzioni"],
  ["Preview", "Anteprima"],
  ["Print", "Stampa"],
  ["Grade 1", "1ª primaria"],
  ["Grade 2", "2ª primaria"],
  ["Grade 3", "3ª primaria"],
  ["Grade 4", "4ª primaria"],
  ["Grade 5", "5ª primaria"],
  ["Grade 6", "1ª secondaria"],
  ["number line", "retta dei numeri"],
  ["even number", "numero pari"],
  ["odd number", "numero dispari"],
  ["fraction", "frazione"],
  ["fractions", "frazioni"],
  ["percentage", "percentuale"],
  ["percentages", "percentuali"],
  ["decimal", "decimale"],
  ["decimals", "decimali"],
  ["perimeter", "perimetro"],
  ["circle", "cerchio"],
  ["circumference", "circonferenza"],
  ["radius", "raggio"],
  ["diameter", "diametro"],
  ["square", "quadrato"],
  ["rectangle", "rettangolo"],
  ["triangle", "triangolo"],
  ["right angle", "angolo retto"],
  ["angle", "angolo"],
  ["dollars", "euro"],
  ["dollar", "euro"],
  ["Adding Two Numbers", "Addizionare due numeri"],
  ["Adding two numbers", "Addizionare due numeri"],
  ["No vertical addition, no carrying, no adding three numbers.", "Niente addizione in colonna, niente riporto, niente somma di tre numeri."],
  ["sum up to", "somma fino a"],
  ["Metadata", "Metadati"],
  ["Field", "Campo"],
  ["Value", "Valore"],
  ["marbles", "biglie"],
  ["So:", "Quindi:"],
  ["to add two numbers", "ad addizionare due numeri"],
  ["to add", "ad addizionare"],
  ["and more", "e ancora"],
  ["that's the total", "questo è il totale"],
  ["seven", "sette"],
  ["Four and three", "Quattro e tre"],
];

function loadJson(p) {
  if (!fs.existsSync(p)) return {};
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return {};
  }
}

function walk(dir, files = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, files);
    else if (ent.name.endsWith(".md")) files.push(p);
  }
  return files;
}

function protectCode(s) {
  /** @type {string[]} */
  const ph = [];
  let out = String(s).replace(/```[\s\S]*?```/g, (block) => {
    ph.push(block);
    return `⟦B${ph.length - 1}⟧`;
  });
  out = out.replace(/`([^`]+)`/g, (_, code) => {
    ph.push(code);
    return `⟦C${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restoreCode(s, ph) {
  return String(s)
    .replace(/⟦B(\d+)⟧/g, (_, i) => ph[Number(i)])
    .replace(/⟦C(\d+)⟧/g, (_, i) => `\`${ph[Number(i)]}\``);
}

function isProtectedMetaLine(line) {
  return /\|\s*\*\*(learning_page_id|skill_id|subject|grade|age_band|page_type|approval_status|title_english)\*\*/i.test(
    line,
  );
}

function enToItLine(line, caches) {
  const raw = String(line ?? "");
  if (!raw.trim()) return raw;
  if (isProtectedMetaLine(raw)) return raw;
  if (/^\|\s*[-:| ]+\s*\|?\s*$/.test(raw)) return raw;
  if (/\|\s*\*\*Field\*\*/i.test(raw)) {
    return raw.replace("Field", "Campo").replace("Value", "Valore");
  }
  for (const cache of caches) {
    if (cache[raw]) return applyItalianAuthorityPostfix(cache[raw]);
  }
  const guarded = protectCode(raw);
  let out = guarded.text;
  const ph = guarded.ph;
  for (const [en, it] of EN_IT_PHRASES) {
    if (out.includes(en)) out = out.split(en).join(it);
  }
  const words = [
    [/\baddition\b/gi, "addizione"],
    [/\bsubtraction\b/gi, "sottrazione"],
    [/\bmultiplication\b/gi, "moltiplicazione"],
    [/\bdivision\b/gi, "divisione"],
    [/\bexample\b/gi, "esempio"],
    [/\btogether\b/gi, "insieme"],
    [/\blearning\b/gi, "apprendimento"],
    [/\bnumbers\b/gi, "numeri"],
    [/\bnumber\b/gi, "numero"],
    [/\bgroups\b/gi, "gruppi"],
    [/\bgroup\b/gi, "gruppo"],
    [/\btotal\b/gi, "totale"],
    [/\banswers\b/gi, "risposte"],
    [/\banswer\b/gi, "risposta"],
    [/\bsteps\b/gi, "passaggi"],
    [/\bstep\b/gi, "passaggio"],
    [/\bstudents\b/gi, "alunni"],
    [/\bstudent\b/gi, "alunno"],
    [/\bteacher\b/gi, "insegnante"],
    [/\bparents\b/gi, "genitori"],
    [/\bparent\b/gi, "genitore"],
  ];
  for (const [re, rep] of words) out = out.replace(re, rep);
  out = restoreCode(out, ph);
  return applyItalianAuthorityPostfix(out);
}

function enToIt(text, caches) {
  return String(text ?? "")
    .split(/(\n)/)
    .map((part) => (part === "\n" ? part : enToItLine(part, caches)))
    .join("");
}

function convertMarkdown(md, caches, { englishSubject }) {
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  const yaml = fm ? fm[1] : null;
  const body = fm ? fm[2] : md;

  const bodyOut = body
    .split(/(```[\s\S]*?```)/g)
    .map((part) => {
      if (part.startsWith("```")) return part;
      if (englishSubject) {
        // Translate headings/chrome; keep example-heavy lines mostly intact if they are short English targets
        return part
          .split(/(\n)/)
          .map((line) => {
            if (/^#{1,6}\s/.test(line) || /\b(What are we learning|Simple explanation|Try it yourself|Common mistake|Metadata|Content scope|Source references)/i.test(line)) {
              return enToIt(line, caches);
            }
            // Leave lines that are mostly English vocabulary lists / examples with backticks
            if ((line.match(/`/g) || []).length >= 2) return line;
            return enToIt(line, caches);
          })
          .join("");
      }
      return enToIt(part, caches);
    })
    .join("");

  if (!yaml) return bodyOut;
  return `---\n${yaml}\n---\n${bodyOut}`;
}

function main() {
  const bookCache = loadJson(CACHE_PATH);
  const layerCache = loadJson(LAYER_CACHE);
  const caches = [bookCache, layerCache];
  const files = walk(EN);
  console.log("Learning-book files:", files.length);
  let n = 0;
  for (const enFile of files) {
    const rel = path.relative(EN, enFile);
    const dest = path.join(OUT, rel);
    const md = fs.readFileSync(enFile, "utf8");
    const isEnglishSubject = rel.replace(/\\/g, "/").startsWith("english/");
    const out = convertMarkdown(md, caches, { englishSubject: isEnglishSubject });
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, out, "utf8");
    n += 1;
    if (n % 50 === 0) console.log("books", n, "/", files.length);
  }
  console.log("Wrote learning-book/it-IT", n);
}

main();
