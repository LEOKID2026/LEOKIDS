/**
 * Generate locales/it-IT + content-packs/it-IT from English sources.
 *
 * Uses curated Italian glossary + exact overrides as authority.
 * Optional network MT (gtx tl=it) fills remaining strings, then Italian post-fixes run.
 * Set IT_IT_OFFLINE=1 to skip network and leave untranslated strings as EN
 * (parity structure still written; run again online to fill).
 *
 * Run: node scripts/i18n/generate-it-IT-layer.mjs
 * Optional: --force  --dry  --namespaces-only  --packs-only
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ITALIAN_ITALY_GLOSSARY,
  FORBIDDEN_IT_IT_PATTERNS,
} from "../../lib/i18n/italian-italy-glossary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_mt-cache-it-IT.json");
const REPORT_PATH = path.join(__dirname, "_it-IT-layer-report.json");

const FORCE = process.argv.includes("--force");
const DRY = process.argv.includes("--dry");
const NAMESPACES_ONLY = process.argv.includes("--namespaces-only");
const PACKS_ONLY = process.argv.includes("--packs-only");
const OFFLINE = process.env.IT_IT_OFFLINE === "1" || process.argv.includes("--offline");

const DOMAINS = [
  "learning",
  "reports",
  "games",
  "books",
  "rewards",
  "global-burn-down",
  "demo",
];

const SKIP_VALUE_KEYS = new Set([
  "id",
  "ids",
  "skillId",
  "pageType",
  "learningPageId",
  "learningLanguage",
  "gameId",
  "subjectId",
  "topicId",
  "slug",
  "href",
  "src",
  "path",
  "route",
  "url",
  "icon",
  "image",
  "imageSrc",
  "asset",
  "assetPath",
  "font",
  "ttf",
  "locale",
  "localeId",
  "contentLocale",
  "enum",
  "key",
  "code",
  "type",
  "kind",
  "status",
  "severity",
  "version",
  "sha",
  "hash",
  "color",
  "bg",
  "background",
  "className",
  "component",
  "file",
  "filename",
  "ext",
  "mime",
  "doNotTranslateFields",
]);

const EXACT_OVERRIDES = {
  Math: "Matematica",
  Geometry: "Geometria",
  English: "Inglese",
  Hebrew: "Ebraico",
  Science: "Scienze",
  Geography: "Geografia",
  History: "Storia",
  Strength: "Punto di forza",
  "Area to strengthen": "Area da rafforzare",
  "Worth strengthening": "Area da rafforzare",
  "Parent report": "Report per i genitori",
  "Learning pattern": "Schema di apprendimento",
  Progress: "Progresso",
  Improvement: "Miglioramento",
  Practice: "Esercitazione",
  Start: "Inizia",
  Continue: "Continua",
  "Try again": "Riprova",
  Check: "Controlla",
  Next: "Avanti",
  Back: "Indietro",
  Play: "Gioca",
  Finish: "Termina",
  Loading: "Caricamento…",
  "Loading...": "Caricamento…",
  Save: "Salva",
  Cancel: "Annulla",
  Delete: "Elimina",
  Close: "Chiudi",
  Hint: "Suggerimento",
  Addition: "Addizione",
  Subtraction: "Sottrazione",
  Multiplication: "Moltiplicazione",
  Division: "Divisione",
  Fractions: "Frazioni",
  Percentages: "Percentuali",
  Sequences: "Sequenze",
  Decimals: "Decimali",
  Rounding: "Arrotondamento",
  Equations: "Equazioni",
  Patterns: "Schemi",
  Vocabulary: "Vocabolario",
  Grammar: "Grammatica",
  Phonics: "Fonetica",
  Writing: "Scrittura",
  Reading: "Lettura",
  "Reading comprehension": "Comprensione del testo",
  Shapes: "Figure",
  "Basic shapes": "Figure di base",
  Area: "Area",
  Perimeter: "Perimetro",
  Volume: "Volume",
  Angles: "Angoli",
  Triangles: "Triangoli",
  Circles: "Cerchi",
  Symmetry: "Simmetria",
  Coordinates: "Coordinate",
  Animals: "Animali",
  Plants: "Piante",
  Materials: "Materiali",
  "Mixed practice": "Esercitazione mista",
  "Word problems": "Problemi di parole",
  "Place value": "Valore posizionale",
  "Number sense": "Senso numerico",
  "Grade 1": "1ª primaria",
  "Grade 2": "2ª primaria",
  "Grade 3": "3ª primaria",
  "Grade 4": "4ª primaria",
  "Grade 5": "5ª primaria",
  "Grade 6": "1ª secondaria",
  "Grade {grade}": "{grade}ª primaria",
  "Grades 1–2": "1ª–2ª primaria",
  "Grades 3–4": "3ª–4ª primaria",
  "Grades 5–6": "5ª primaria–1ª secondaria",
  Grade: "Classe",
  "All grades": "Tutte le classi",
  "Choose grade": "Scegli la classe",
  "Select grade": "Scegli la classe",
  "Current grade": "Classe attuale",
  "Invalid grade": "Classe non valida",
  "Invalid grade. Please choose another grade.": "Classe non valida. Scegli un'altra classe.",
  "That grade is not valid.": "Questa classe non è valida.",
  "Allow child to pick grade on learning pages":
    "Consenti al bambino di scegliere la classe nelle pagine di apprendimento",
  Worksheet: "Scheda didattica",
  Worksheets: "Schede didattiche",
  "Create worksheet": "Crea una scheda didattica",
  "Ready worksheets": "Schede pronte da stampare",
  Preview: "Anteprima",
  Print: "Stampa",
  "Answer key": "Soluzioni",
  Regular: "Comune",
  Special: "Speciale",
  Rare: "Rara",
  Gold: "Oro",
  "Surprise box": "Scatola a sorpresa",
  Locked: "Bloccata",
  "My cards": "Le mie carte",
  "My collection": "La mia collezione",
  "Card shop": "Negozio di carte",
  "All cards": "Tutte le carte",
  Series: "Serie",
  Buy: "Compra",
  "Sell duplicate": "Vendi duplicato",
  "Open box": "Apri la scatola",
  "Table of contents": "Indice",
  "Coming soon": "Prossimamente",
  "Previous page": "Pagina precedente",
  "Next page": "Pagina successiva",
  "Previous topic": "Argomento precedente",
  "Next topic": "Argomento successivo",
  "Let's practice now": "Esercitiamoci ora",
  "Practice with questions": "Esercitati con le domande",
  "Book reading": "Lettura del libro",
  Parent: "Genitore",
  Parents: "Genitori",
  Student: "Alunno",
  Students: "Alunni",
  Teacher: "Insegnante",
  Teachers: "Insegnanti",
  School: "Scuola",
  Answers: "Risposte",
  Answer: "Risposta",
  File: "File",
  Video: "Video",
  Phone: "Telefono",
  Computer: "Computer",
  Laptop: "Portatile",
  Yes: "Sì",
  No: "No",
  Click: "Clicca",
  Choose: "Scegli",
  Select: "Seleziona",
  "Leo Kids": "Leo Kids",
  Home: "Home",
  Help: "Aiuto",
  Settings: "Impostazioni",
  "Log out": "Esci",
  "Log in": "Accedi",
  Search: "Cerca",
  More: "Altro",
  OK: "OK",
  "Start learning": "Inizia a imparare",
  "Learning that feels like play": "Imparare che sembra un gioco",
  "Something went wrong. Please try again.": "Qualcosa è andato storto. Riprova.",
  "Page not found": "Pagina non trovata",
  "You do not have access to this page.": "Non hai accesso a questa pagina.",
  "No data yet": "Nessun dato ancora",
  "Data unavailable right now": "Dati non disponibili al momento",
  Cumulative: "Cumulativo",
  "For the current month": "Per il mese corrente",
  "Cumulative from all sessions": "Cumulativo da tutte le sessioni",
  "From completed sessions": "Da sessioni completate",
  "From all sessions with duration": "Da tutte le sessioni con durata",
  "Credited learning time — questions, books, and parent activities":
    "Tempo di apprendimento accreditato — domande, libri e attività dei genitori",
  dollar: "euro",
  dollars: "euro",
  Dollar: "Euro",
  Dollars: "Euro",
};

const POST_PHRASE_FIXES = [
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
  [/\b1º ano\b/gi, "1ª primaria"],
  [/\b2º ano\b/gi, "2ª primaria"],
  [/\b3º ano\b/gi, "3ª primaria"],
  [/\b4º ano\b/gi, "4ª primaria"],
  [/\b5º ano\b/gi, "5ª primaria"],
  [/\b6º ano\b/gi, "1ª secondaria"],
  [/foglio di calcolo/gi, "scheda didattica"],
  [/fogli di calcolo/gi, "schede didattiche"],
  [/worksheet/gi, "scheda didattica"],
  [/worksheets/gi, "schede didattiche"],
  [/\bdollari\b/gi, "euro"],
  [/\bdollaro\b/gi, "euro"],
  [/\bdollars\b/gi, "euro"],
  [/\bdollar\b/gi, "euro"],
  [/\$(\d+)/g, "€ $1"],
  [/\bnatal\b/gi, "telefono"],
  [/\bnatel\b/gi, "telefono"],
  [/answer key/gi, "soluzioni"],
  [/chiave di risposta/gi, "soluzioni"],
  [/chiave delle risposte/gi, "soluzioni"],
];

function looksNonTranslate(s) {
  if (s == null) return true;
  const str = String(s);
  if (!str.trim()) return true;
  if (/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(str)) return true;
  if (/^https?:\/\//i.test(str) || str.startsWith("mailto:")) return true;
  if (/^\{[a-zA-Z0-9_]+\}$/.test(str)) return true;
  if (/^\d+(\.\d+)?%?$/.test(str)) return true;
  if (/^[A-Z0-9_]{2,}$/.test(str) && str.length <= 48) return true;
  if (/[\u0590-\u05FF]/.test(str) && !/[A-Za-z]/.test(str)) return true;
  if (!/\s/.test(str)) {
    if (/^[a-z0-9]+([_/.-][a-z0-9]+)+$/i.test(str)) return true;
    if (/^[a-z]+[A-Z][a-zA-Z0-9]*$/.test(str)) return true;
    if (/^\/[a-z0-9/_\[\]-]+$/i.test(str)) return true;
    if (/\.(png|jpe?g|gif|webp|svg|ttf|woff2?|json|js|css|mp3|wav|pdf)$/i.test(str)) return true;
  }
  return false;
}

function protectPlaceholders(s) {
  /** @type {string[]} */
  const ph = [];
  const out = String(s).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
    ph.push(name);
    return `⟦${ph.length - 1}⟧`;
  });
  return { text: out, ph };
}

function restorePlaceholders(s, ph) {
  return String(s).replace(/⟦\s*(\d+)\s*⟧/g, (_, i) => `{${ph[Number(i)]}}`);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyGlossaryHints(text) {
  let out = text;
  for (const [enTerm, entry] of Object.entries(ITALIAN_ITALY_GLOSSARY)) {
    if (!entry?.preferred) continue;
    if (!/[A-Za-z]/.test(enTerm)) continue;
    if (enTerm.length < 3) continue;
    const re = new RegExp(`\\b${escapeRegExp(enTerm)}\\b`, "g");
    out = out.replace(re, entry.preferred);
  }
  for (const [re, rep] of POST_PHRASE_FIXES) {
    out = out.replace(re, rep);
  }
  // Protect brand
  out = out.replace(/Leo Kids/g, "Leo Kids");
  return out;
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), "utf8");
}

async function mtTranslate(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=it&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

async function translateString(en, cache) {
  if (looksNonTranslate(en)) return { value: en, source: "skip" };
  if (Object.prototype.hasOwnProperty.call(EXACT_OVERRIDES, en)) {
    return { value: EXACT_OVERRIDES[en], source: "override" };
  }
  if (!FORCE && cache[en]) {
    return { value: applyGlossaryHints(cache[en]), source: "cache" };
  }
  if (OFFLINE) {
    return { value: applyGlossaryHints(en), source: "offline" };
  }

  const { text, ph } = protectPlaceholders(en);
  let translated;
  try {
    translated = await mtTranslate(text);
  } catch (err) {
    console.warn("MT fail:", en.slice(0, 60), err.message);
    return { value: en, source: "mt-fail" };
  }
  translated = restorePlaceholders(translated, ph);
  translated = applyGlossaryHints(translated);

  const enPh = [...en.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  const itPh = [...translated.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((m) => m[1]).sort().join(",");
  if (enPh !== itPh) {
    console.warn("placeholder mismatch, keeping EN:", en.slice(0, 80));
    return { value: en, source: "ph-mismatch" };
  }

  cache[en] = translated;
  return { value: translated, source: "mt" };
}

function listJsonFiles(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  (function walk(p) {
    for (const ent of fs.readdirSync(p, { withFileTypes: true })) {
      const full = path.join(p, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (ent.name.endsWith(".json")) out.push(full);
    }
  })(dir);
  return out;
}

async function transformValue(value, key, cache, stats) {
  if (typeof value === "string") {
    if (SKIP_VALUE_KEYS.has(key)) {
      stats.skipped += 1;
      return value;
    }
    const { value: out, source } = await translateString(value, cache);
    stats[source] = (stats[source] || 0) + 1;
    return out;
  }
  if (Array.isArray(value)) {
    const arr = [];
    for (const item of value) arr.push(await transformValue(item, key, cache, stats));
    return arr;
  }
  if (value && typeof value === "object") {
    /** @type {Record<string, unknown>} */
    const obj = {};
    for (const [k, v] of Object.entries(value)) {
      obj[k] = await transformValue(v, k, cache, stats);
    }
    return obj;
  }
  return value;
}

async function processJsonFile(srcPath, destPath, cache, stats) {
  const raw = JSON.parse(fs.readFileSync(srcPath, "utf8"));
  const out = await transformValue(raw, "", cache, stats);
  if (!DRY) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  }
}

async function main() {
  const cache = loadCache();
  const stats = { skipped: 0 };
  const report = { namespaces: [], packs: [], forbiddenHits: [] };

  if (!PACKS_ONLY) {
    const srcDir = path.join(ROOT, "locales/en");
    const destDir = path.join(ROOT, "locales/it-IT");
    for (const file of fs.readdirSync(srcDir).filter((f) => f.endsWith(".json"))) {
      const src = path.join(srcDir, file);
      const dest = path.join(destDir, file);
      console.log("namespace", file);
      await processJsonFile(src, dest, cache, stats);
      report.namespaces.push(file);
      // Hard authority for grade keys in common.json
      if (file === "common.json" && !DRY) {
        const common = JSON.parse(fs.readFileSync(dest, "utf8"));
        common.gradeLabel = "{grade}ª primaria";
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
        fs.writeFileSync(dest, JSON.stringify(common, null, 2) + "\n", "utf8");
      }
      saveCache(cache);
    }
  }

  if (!NAMESPACES_ONLY) {
    for (const domain of DOMAINS) {
      const srcDir = path.join(ROOT, "content-packs/en", domain);
      const destDir = path.join(ROOT, "content-packs/it-IT", domain);
      if (!fs.existsSync(srcDir)) continue;
      const files = listJsonFiles(srcDir);
      console.log("pack domain", domain, files.length);
      for (const src of files) {
        const rel = path.relative(srcDir, src);
        const dest = path.join(destDir, rel);
        await processJsonFile(src, dest, cache, stats);
        report.packs.push(`${domain}/${rel.replace(/\\/g, "/")}`);
        if (report.packs.length % 25 === 0) saveCache(cache);
      }
      saveCache(cache);
    }
  }

  // Scan forbidden patterns
  const trees = ["locales/it-IT", "content-packs/it-IT"];
  for (const tree of trees) {
    const dir = path.join(ROOT, tree);
    if (!fs.existsSync(dir)) continue;
    for (const file of listJsonFiles(dir)) {
      const text = fs.readFileSync(file, "utf8");
      for (const { re, label } of FORBIDDEN_IT_IT_PATTERNS) {
        if (re.test(text)) {
          report.forbiddenHits.push({ file: path.relative(ROOT, file), label });
        }
      }
    }
  }

  saveCache(cache);
  fs.writeFileSync(REPORT_PATH, JSON.stringify({ stats, report }, null, 2), "utf8");
  console.log("Done", stats);
  console.log("Forbidden hits", report.forbiddenHits.length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
