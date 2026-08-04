import fs from "node:fs";
import path from "node:path";
import { SCIENCE_NL_NL_OVERLAY } from "../../data/science-questions-nl-NL-overlay.js";
import { SCIENCE_EN_OVERLAY } from "../../data/science-questions-en-overlay.js";
import { WORD_MEANINGS_NL_NL } from "../../data/english-questions/word-meanings/nl-NL.js";
import { ALL_ARTICLES_NL_NL } from "../../data/help-center/nl-NL/index.js";
import { rebuildMathStemNlNl } from "../../utils/learning-content-nl-NL/math.js";
import { rebuildGeometryStemNlNl } from "../../utils/learning-content-nl-NL/geometry.js";

function walkDir(d, acc = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walkDir(p, acc);
    else acc.push(p);
  }
  return acc;
}

const patterns = {
  GradeDisplay: /\bGrade\s*[1-6]\b/,
  Wiskunde: /\bWiskunde\b/,
  spreadsheet: /\bspreadsheet\b/i,
  Flemish: /\b(goesting|hesp|plezant|amai|\bgij\b)\b/i,
  HE: /[\u0590-\u05FF]/,
  EN_chrome: /\b(Create worksheet|Answer key|All grades|Select a grade)\b/,
};

function scanFiles(files) {
  const hits = Object.fromEntries(Object.keys(patterns).map((k) => [k, 0]));
  const samples = {};
  for (const f of files) {
    const t = fs.readFileSync(f, "utf8");
    for (const [k, re] of Object.entries(patterns)) {
      if (re.test(t)) {
        hits[k]++;
        if (!samples[k]) {
          const m = t.match(re);
          samples[k] = { file: f, match: m?.[0] };
        }
      }
    }
  }
  return { hits, samples };
}

const localeFiles = walkDir("locales/nl-NL").filter((f) => f.endsWith(".json"));
const packFiles = walkDir("content-packs/nl-NL").filter((f) => f.endsWith(".json"));
const bookFiles = walkDir("docs/learning-book/nl-NL").filter((f) => f.endsWith(".md"));
const enBooks = walkDir("docs/learning-book/en").filter((f) => f.endsWith(".md"));
const helpFiles = walkDir("data/help-center/nl-NL").filter((f) => f.endsWith(".js"));

let wmCount = 0;
for (const cat of Object.values(WORD_MEANINGS_NL_NL)) {
  if (cat && typeof cat === "object") wmCount += Object.keys(cat).length;
}

const enIds = Object.keys(SCIENCE_EN_OVERLAY);
const nlIds = Object.keys(SCIENCE_NL_NL_OVERLAY);
let optMismatch = 0;
let correctIndexAdded = 0;
for (const id of enIds) {
  const e = SCIENCE_EN_OVERLAY[id];
  const n = SCIENCE_NL_NL_OVERLAY[id];
  if (!n) continue;
  if ((e.options || []).length !== (n.options || []).length) optMismatch++;
  if (e.correctIndex == null && n.correctIndex != null) correctIndexAdded++;
}

const helpBlob = JSON.stringify(ALL_ARTICLES_NL_NL);
const mathStem = rebuildMathStemNlNl?.({ type: "addition", a: 2, b: 3 }) ?? null;
let geoStem = null;
try {
  geoStem = rebuildGeometryStemNlNl?.({ type: "shape_name", shape: "triangle" }) ?? null;
} catch {
  geoStem = "err";
}

const common = JSON.parse(fs.readFileSync("locales/nl-NL/common.json", "utf8"));
const worksheets = JSON.parse(fs.readFileSync("locales/nl-NL/worksheets.json", "utf8"));

console.log(
  JSON.stringify(
    {
      namespaces: fs.readdirSync("locales/nl-NL").filter((f) => f.endsWith(".json")).length,
      packs: packFiles.length,
      books: { nl: bookFiles.length, en: enBooks.length, gradeDisplayHits: scanFiles(bookFiles).hits.GradeDisplay },
      science: {
        en: enIds.length,
        nl: nlIds.length,
        missing: enIds.filter((i) => !SCIENCE_NL_NL_OVERLAY[i]).length,
        optMismatch,
        correctIndexAdded,
      },
      wordMeanings: wmCount,
      help: {
        articles: ALL_ARTICLES_NL_NL.length,
        corrupt: (helpBlob.match(/eeenr|reenpport|Weent |peenge|neeneenr/g) || []).length,
        sampleTitle: ALL_ARTICLES_NL_NL[0]?.title,
        sampleSummary: ALL_ARTICLES_NL_NL[0]?.summary,
      },
      localeScan: scanFiles(localeFiles),
      packScan: scanFiles(packFiles),
      helpScan: scanFiles(helpFiles),
      gradesSample: {
        g1: common?.grades?.grade1 || common?.grade?.grade1 || common?.["grades.grade1"],
        keys: Object.keys(common).slice(0, 30),
      },
      worksheetsSample: {
        create: worksheets?.createWorksheet || worksheets?.create || worksheets?.["createWorksheet"],
        keys: Object.keys(worksheets).slice(0, 40),
      },
      rebuilders: { mathStem, geoStem },
    },
    null,
    2,
  ),
);
