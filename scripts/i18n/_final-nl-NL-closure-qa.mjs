/**
 * Targeted closure QA for nl-NL content layer (no other locales).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

function walk(d, pred, a = []) {
  if (!fs.existsSync(d)) return a;
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, pred, a);
    else if (pred(p)) a.push(p);
  }
  return a;
}

const report = {};

// --- parse locales ---
const localeFiles = walk("locales/nl-NL", (p) => p.endsWith(".json"));
let localeParseOk = 0;
for (const f of localeFiles) {
  JSON.parse(fs.readFileSync(f, "utf8"));
  localeParseOk++;
}
report.namespaces = { files: localeFiles.length, parseOk: localeParseOk };

// --- packs ---
const packFiles = walk("content-packs/nl-NL", (p) => p.endsWith(".json"));
let packParseOk = 0;
for (const f of packFiles) {
  JSON.parse(fs.readFileSync(f, "utf8"));
  packParseOk++;
}
report.contentPacks = { files: packFiles.length, parseOk: packParseOk };

// --- help ---
const helpFiles = walk("data/help-center/nl-NL", (p) => p.endsWith(".md") && !p.endsWith("writing-pack-requirements.md"));
report.helpArticles = { mdFiles: helpFiles.length };

// --- books ---
const bookFiles = walk("docs/learning-book/nl-NL", (p) => p.endsWith(".md"));
const enBooks = walk("docs/learning-book/en", (p) => p.endsWith(".md"));
const bookRel = new Set(bookFiles.map((f) => path.relative("docs/learning-book/nl-NL", f).replace(/\\/g, "/")));
const enRel = new Set(enBooks.map((f) => path.relative("docs/learning-book/en", f).replace(/\\/g, "/")));
report.learningBooks = {
  nl: bookFiles.length,
  en: enBooks.length,
  pathParity: [...enRel].every((r) => bookRel.has(r)) && bookRel.size === enRel.size,
};

// --- science ---
const { SCIENCE_EN_OVERLAY: EN } = await import(pathToFileURL(path.resolve("data/science-questions-en-overlay.js")).href);
const { SCIENCE_NL_NL_OVERLAY: NL } = await import(pathToFileURL(path.resolve("data/science-questions-nl-NL-overlay.js")).href + "?t=" + Date.now());
const enIds = Object.keys(EN);
const nlIds = Object.keys(NL);
let optMismatch = 0;
let scienceEnLeak = 0;
const CLEAR =
  /\b(What is|What are|What do|Which |How many|How do|If your|Today we|the |and |with |from |because |survive|breathe|People|It |To filter|Use a|Blood is|Kidneys clean|Pollination helps|Lifestyle choices)\b/;
const samples = [];
for (const id of enIds) {
  const n = NL[id];
  if (!n) {
    scienceEnLeak++;
    continue;
  }
  if ((n.options || []).length !== (EN[id].options || []).length) optMismatch++;
  for (const s of [n.stem, n.explanation, ...(n.options || []), ...(n.theoryLines || [])]) {
    if (CLEAR.test(String(s || ""))) {
      scienceEnLeak++;
      if (samples.length < 10) samples.push({ id, s: String(s).slice(0, 100) });
      break;
    }
  }
}
report.science = {
  enIds: enIds.length,
  nlIds: nlIds.length,
  idParity: enIds.length === nlIds.length && enIds.every((id) => NL[id]),
  optionCountParity: optMismatch === 0,
  instructionalEnLeakRecords: scienceEnLeak,
  samples,
};

// --- word meanings ---
const { WORD_MEANINGS_NL_NL } = await import(pathToFileURL(path.resolve("data/english-questions/word-meanings/nl-NL.js")).href);
let wmCount = 0;
for (const cat of Object.values(WORD_MEANINGS_NL_NL || {})) {
  if (cat && typeof cat === "object") wmCount += Object.keys(cat).length;
}
report.wordMeanings = {
  entries: wmCount,
  sofa: WORD_MEANINGS_NL_NL?.furniture?.sofa || WORD_MEANINGS_NL_NL?.home?.sofa,
  bank: WORD_MEANINGS_NL_NL?.community?.bank || WORD_MEANINGS_NL_NL?.places?.bank,
};

// find bank/sofa keys more carefully
function findGloss(obj, key, path = []) {
  if (!obj || typeof obj !== "object") return null;
  if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === "string") return { path: path.join("."), value: obj[key] };
  for (const [k, v] of Object.entries(obj)) {
    const hit = findGloss(v, key, [...path, k]);
    if (hit) return hit;
  }
  return null;
}
report.wordMeanings.sofaHit = findGloss(WORD_MEANINGS_NL_NL, "sofa");
report.wordMeanings.bankHit = findGloss(WORD_MEANINGS_NL_NL, "bank");

// --- books EN leakage ---
const BOOK_EN =
  /\b(Today we will|Today we'll|Today we zal|What are we learning\?|Try it yourself|Simple explanation|Let's practice|Let's solve|Common mistake|On the next page we will|Write the first|Look at the)\b/;
let bookLeak = 0;
for (const f of bookFiles) {
  if (f.includes(`${path.sep}english${path.sep}`)) continue;
  if (BOOK_EN.test(fs.readFileSync(f, "utf8"))) bookLeak++;
}
report.booksEnInstrLeakFiles = bookLeak;

// Grade / Wiskunde / Science authority
let gradeHits = 0;
let wiskHits = 0;
let scienceNameHits = 0;
for (const f of [...localeFiles, ...packFiles, ...bookFiles, ...helpFiles]) {
  const t = fs.readFileSync(f, "utf8");
  if (/\bWiskunde\b/.test(t)) wiskHits++;
  // Grade display outside IDs
  const lines = t.split(/\n/).filter((l) => !/\*\*(learning_page_id|skill_id|title_english)\*\*/.test(l));
  if (lines.some((l) => /\bGrade\s*[1-6]\b/.test(l))) gradeHits++;
}
for (const f of localeFiles) {
  const t = fs.readFileSync(f, "utf8");
  if (/Natuur en techniek/.test(t)) scienceNameHits++;
}
report.terminology = { wiskundeFiles: wiskHits, gradeDisplayFiles: gradeHits, scienceAuthorityLocaleMentions: scienceNameHits };

// je/u mix in same sentence (rough)
const MIX = /\b(je|jij|jouw)\b.*\b(u|uw)\b|\b(u|uw)\b.*\b(je|jij|jouw)\b/i;
let mixHits = 0;
const mixSamples = [];
for (const f of [...localeFiles, ...packFiles]) {
  for (const line of fs.readFileSync(f, "utf8").split(/\n/)) {
    if (MIX.test(line)) {
      mixHits++;
      if (mixSamples.length < 8) mixSamples.push({ f, line: line.slice(0, 120) });
    }
  }
}
report.jeUmix = { hits: mixHits, mixSamples };

// Math/Geometry modules load
const mathMod = await import(pathToFileURL(path.resolve("utils/learning-content-nl-NL/math.js")).href + "?t=" + Date.now());
const geoMod = await import(pathToFileURL(path.resolve("utils/learning-content-nl-NL/geometry.js")).href + "?t=" + Date.now());
report.mathGeo = {
  mathExports: Object.keys(mathMod).slice(0, 20),
  geoExports: Object.keys(geoMod).slice(0, 20),
  hasWiskunde: JSON.stringify(mathMod).includes("Wiskunde") || JSON.stringify(geoMod).includes("Wiskunde"),
};

fs.writeFileSync("scripts/i18n/_nl-NL-closure-qa.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
