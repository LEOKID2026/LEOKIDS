/**
 * Closure scanner for it-IT content layer.
 * Scans user-facing values (JSON string values / markdown prose).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, pred, out);
    else if (pred(e.name, p)) out.push(p);
  }
  return out;
}
function rel(p) {
  return path.relative(ROOT, p).replace(/\\/g, "/");
}

const CHECKS = {
  HE: /[\u0590-\u05FF]/,
  ES: /\b(cuál|dónde|también|órgano|estudiante|hoja de|seleccionar grado|práctica|respuesta correcta|puedes|inténtalo|quieres|cargando|próximamente|proximamente|navegacion|practiquemos|resolvamos|revisemos|diviertanse|turnense)\b/i,
  FR: /\b(télécharger|fichier|élève|cliquez)\b/i,
  DE: /\b(Schüler|Arbeitsblatt|Unterricht)\b/,
  NL: /\b(leerling|werkblad)\b/i,
  RU: /[а-яА-Я]{4,}/,
  SWISS: /\b(natel|vignette autostradale)\b/i,
  STUDENTE: /\bstudente\b/i,
  G6A: /\b6ª primaria\b/i,
  CLASSE6: /\bClasse\s*6\b|\bclasse\s*6\b/,
  GRADE_N: /\bGrade\s*[1-6]\b/,
  YEAR_N: /\bYear\s*[1-6]\b/,
  FOGLIO: /\bfoglio di calcolo\b/i,
  EN_CHROME:
    /(^|[\n#>*|\-])\s*(What are we learning\?|Simple explanation|Try it yourself|Source references|Content scope|Today we're going to learn|Let's solve together|Common mistake|Answer key|Worksheets?\b|Choose grade|All grades|Try again|Click here)\b/im,
  EN_INSTR:
    /(^|[\n.!?])\s*(Please|Click|Select a|Choose a|How many|What is the|Fill in the|Write the|Continue to|Your child|Parent report)\b/m,
};

function collectJsonStrings(node, key, out = []) {
  if (typeof node === "string") {
    out.push({ key, value: node });
  } else if (Array.isArray(node)) {
    node.forEach((v) => collectJsonStrings(v, key, out));
  } else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) collectJsonStrings(v, k, out);
  }
  return out;
}

const TREES = [
  ["locales", "locales/it-IT", (n) => n.endsWith(".json")],
  ["packs", "content-packs/it-IT", (n) => n.endsWith(".json")],
  ["books", "docs/learning-book/it-IT", (n) => n.endsWith(".md")],
  ["help", "data/help-center/it-IT", (n) => /\.(js|mjs)$/.test(n)],
  ["math", "utils/learning-content-it-IT", (n) => n.endsWith(".js")],
];

const filesExtra = [
  "data/science-questions-it-IT-overlay.js",
  "data/english-questions/word-meanings/it-IT.js",
];

const report = {};

function scanText(t, file, bucket, opts = {}) {
  const isEnglishBook = /docs\/learning-book\/it-IT\/english\//.test(rel(file));
  const lines = String(t).split(/\r?\n/);
  for (const [name, re] of Object.entries(CHECKS)) {
    if (opts.skipEnInEnglishBooks && isEnglishBook && (name === "EN_CHROME" || name === "EN_INSTR")) {
      // English learning targets may keep EN instructional lexemes; still flag HE/ES/etc.
      continue;
    }
    if (name === "GRADE_N" || name === "YEAR_N") {
      // allow title_english metadata rows (English authority title)
      const hit = lines.some(
        (l) => re.test(l) && !/\btitle_english\b/i.test(l) && !/\|\s*\*\*title_english\*\*/i.test(l),
      );
      if (!hit) continue;
    } else if (!re.test(t)) {
      continue;
    }
    bucket[name] = (bucket[name] || 0) + 1;
    bucket.samples[name] ||= [];
    if (bucket.samples[name].length < 5) bucket.samples[name].push(rel(file));
  }
  if (CHECKS.HE.test(t)) {
    const heLines = lines.filter((l) => CHECKS.HE.test(l));
    bucket.heLines = (bucket.heLines || 0) + heLines.length;
    bucket.heSamples ||= [];
    for (const l of heLines.slice(0, 2)) {
      if (bucket.heSamples.length < 6) bucket.heSamples.push(`${rel(file)} :: ${l.slice(0, 120)}`);
    }
  }
}

function scanFile(file, bucket) {
  const t = fs.readFileSync(file, "utf8");
  if (file.endsWith(".json")) {
    try {
      const strings = collectJsonStrings(JSON.parse(t), "");
      const joined = strings.map((s) => s.value).join("\n");
      scanText(joined, file, bucket, { skipEnInEnglishBooks: false });
      return;
    } catch {
      // fall through
    }
  }
  scanText(t, file, bucket, { skipEnInEnglishBooks: true });
}

for (const [name, dir, pred] of TREES) {
  const bucket = { samples: {} };
  for (const f of walk(path.join(ROOT, dir), pred)) scanFile(f, bucket);
  report[name] = bucket;
}
for (const f of filesExtra) {
  const bucket = { samples: {} };
  scanFile(path.join(ROOT, f), bucket);
  report[path.basename(f)] = bucket;
}

let booksEnChrome = 0;
let booksHe = 0;
let booksMostlyEnglish = 0;
const bookFiles = walk(path.join(ROOT, "docs/learning-book/it-IT"), (n) => n.endsWith(".md"));
for (const f of bookFiles) {
  const t = fs.readFileSync(f, "utf8");
  const isEnglishBook = /\/english\//.test(rel(f));
  if (!isEnglishBook && CHECKS.EN_CHROME.test(t)) booksEnChrome += 1;
  if (CHECKS.HE.test(t)) booksHe += 1;
  if (!isEnglishBook) {
    const enHits = (t.match(/\b(the|and|with|that|this|from|into|about|because|which|when|what|how)\b/gi) || [])
      .length;
    if (enHits >= 25) booksMostlyEnglish += 1;
  }
}

const common = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/it-IT/common.json"), "utf8"));

console.log(
  JSON.stringify(
    {
      summary: {
        booksEnChrome,
        booksHe,
        booksMostlyEnglish,
        bookCount: bookFiles.length,
        gradeLabel: common.gradeLabel,
        grade6: common.grade6,
      },
      report,
    },
    null,
    2,
  ),
);
