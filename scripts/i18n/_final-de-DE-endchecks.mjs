/**
 * Targeted de-DE content-layer end checks (no build / no wiring).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const report = { ok: true, checks: [] };

function fail(name, detail) {
  report.ok = false;
  report.checks.push({ name, ok: false, detail });
}
function pass(name, detail) {
  report.checks.push({ name, ok: true, detail });
}

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(dir === p ? dir : p, pred, out);
    else if (pred(ent.name, p)) out.push(p);
  }
  return out;
}
function walkAll(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkAll(p, pred, out);
    else if (pred(ent.name, p)) out.push(p);
  }
  return out;
}

// 1) Parse locales JSON
const localeFiles = fs.readdirSync(path.join(ROOT, "locales/de-DE")).filter((f) => f.endsWith(".json"));
if (localeFiles.length !== 15) fail("namespaces-count", localeFiles.length);
else pass("namespaces-count", 15);
for (const f of localeFiles) {
  try {
    JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE", f), "utf8"));
  } catch (e) {
    fail("locale-parse", f + ": " + e.message);
  }
}
pass("locale-parse", localeFiles.length);

// 2) Namespace key parity vs en
const enDir = path.join(ROOT, "locales/en");
let keyMismatches = 0;
function keys(obj, prefix = "") {
  const out = [];
  for (const [k, v] of Object.entries(obj || {})) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) out.push(...keys(v, p));
    else out.push(p);
  }
  return out;
}
for (const f of localeFiles) {
  const en = JSON.parse(fs.readFileSync(path.join(enDir, f), "utf8"));
  const de = JSON.parse(fs.readFileSync(path.join(ROOT, "locales/de-DE", f), "utf8"));
  const ek = new Set(keys(en));
  const dk = new Set(keys(de));
  for (const k of ek) if (!dk.has(k)) keyMismatches++;
  for (const k of dk) if (!ek.has(k)) keyMismatches++;
}
if (keyMismatches) fail("namespace-key-parity", keyMismatches);
else pass("namespace-key-parity", 0);

// 3) Content packs parity
const enPacks = walkAll(path.join(ROOT, "content-packs/en"), (n) => n.endsWith(".json"));
const dePacks = walkAll(path.join(ROOT, "content-packs/de-DE"), (n) => n.endsWith(".json"));
const enRel = new Set(enPacks.map((p) => path.relative(path.join(ROOT, "content-packs/en"), p).replace(/\\/g, "/")));
const deRel = new Set(dePacks.map((p) => path.relative(path.join(ROOT, "content-packs/de-DE"), p).replace(/\\/g, "/")));
let packParity = 0;
for (const r of enRel) if (!deRel.has(r)) packParity++;
for (const r of deRel) if (!enRel.has(r)) packParity++;
if (dePacks.length !== 396 || packParity) fail("content-pack-parity", { files: dePacks.length, packParity });
else pass("content-pack-parity", 396);

let packParseFail = 0;
for (const p of dePacks) {
  try {
    JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    packParseFail++;
  }
}
if (packParseFail) fail("content-pack-parse", packParseFail);
else pass("content-pack-parse", 0);

// 4) Science ID + option-count parity
const { SCIENCE_QUESTIONS } = await import(pathToFileURL(path.join(ROOT, "data/science-questions.js")).href);
const { SCIENCE_DE_DE_OVERLAY } = await import(
  pathToFileURL(path.join(ROOT, "data/science-questions-de-DE-overlay.js")).href
);
const enIds = Object.keys(SCIENCE_QUESTIONS || {});
const deIds = Object.keys(SCIENCE_DE_DE_OVERLAY || {});
let sciMissing = 0;
let optMismatch = 0;
let answerTouched = 0;
for (const id of enIds) {
  const en = SCIENCE_QUESTIONS[id];
  const de = SCIENCE_DE_DE_OVERLAY[id];
  if (!de) {
    sciMissing++;
    continue;
  }
  if ((en.options || []).length !== (de.options || []).length) optMismatch++;
  if ("correctIndex" in de || "answer" in de || "params" in de || "diagnostics" in de) answerTouched++;
}
if (enIds.length !== 1017 || deIds.length !== 1017 || sciMissing || optMismatch || answerTouched) {
  fail("science-parity", { en: enIds.length, de: deIds.length, sciMissing, optMismatch, answerTouched });
} else pass("science-parity", 1017);

// Science English leakage (non-educational)
const SCI_EN =
  /\b(Today we|Let's |Look at|Which of the following|Select the|Choose the|Click|What is the correct|Write the|Read the)\b/i;
let sciLeak = 0;
for (const q of Object.values(SCIENCE_DE_DE_OVERLAY)) {
  for (const field of ["stem", "explanation", ...(q.options || [])]) {
    if (SCI_EN.test(String(field))) sciLeak++;
  }
}
if (sciLeak) fail("science-en-leak", sciLeak);
else pass("science-en-leak", 0);

// 5) Learning book path parity
const enBooks = walkAll(path.join(ROOT, "docs/learning-book/en"), (n) => n.endsWith(".md"));
const deBooks = walkAll(path.join(ROOT, "docs/learning-book/de-DE"), (n) => n.endsWith(".md"));
const enB = new Set(enBooks.map((p) => path.relative(path.join(ROOT, "docs/learning-book/en"), p).replace(/\\/g, "/")));
const deB = new Set(deBooks.map((p) => path.relative(path.join(ROOT, "docs/learning-book/de-DE"), p).replace(/\\/g, "/")));
let bookParity = 0;
for (const r of enB) if (!deB.has(r)) bookParity++;
for (const r of deB) if (!enB.has(r)) bookParity++;
if (deBooks.length !== 450 || bookParity) fail("learning-book-parity", { files: deBooks.length, bookParity });
else pass("learning-book-parity", 450);

// 6) Help slug parity
const enHelp = walkAll(path.join(ROOT, "data/help-center/en"), (n) => n.endsWith(".md"));
const deHelp = walkAll(path.join(ROOT, "data/help-center/de-DE"), (n) => n.endsWith(".md"));
const enH = new Set(enHelp.map((p) => path.relative(path.join(ROOT, "data/help-center/en"), p).replace(/\\/g, "/")));
const deH = new Set(deHelp.map((p) => path.relative(path.join(ROOT, "data/help-center/de-DE"), p).replace(/\\/g, "/")));
let helpParity = 0;
for (const r of enH) if (!deH.has(r)) helpParity++;
for (const r of deH) if (!enH.has(r)) helpParity++;
if (deHelp.length !== 40 || helpParity) fail("help-slug-parity", { files: deHelp.length, helpParity });
else pass("help-slug-parity", 40);

// 7) Word meanings ID parity
const enWM = require(path.join(ROOT, "data/english-questions/word-meanings/en.js"));
const deWM = require(path.join(ROOT, "data/english-questions/word-meanings/de-DE.js"));
const enW = enWM.WORD_MEANINGS || enWM.default || enWM;
const deW = deWM.WORD_MEANINGS || deWM.default || deWM;
const enWIds = new Set((Array.isArray(enW) ? enW : Object.values(enW)).map((x) => x.id || x.wordId || x.key).filter(Boolean));
const deWIds = new Set((Array.isArray(deW) ? deW : Object.values(deW)).map((x) => x.id || x.wordId || x.key).filter(Boolean));
// fallback: if objects keyed by id
const enKeys = Array.isArray(enW) ? [...enWIds] : Object.keys(enW);
const deKeys = Array.isArray(deW) ? [...deWIds] : Object.keys(deW);
let wmMissing = 0;
for (const k of enKeys) if (!deKeys.includes(k) && !deWIds.has(k)) wmMissing++;
if (wmMissing) fail("word-meaning-parity", { en: enKeys.length, de: deKeys.length, wmMissing });
else pass("word-meaning-parity", { en: enKeys.length, de: deKeys.length });

// 8) Terminology / Grade / Student / Grade across de-DE content (non-english books)
let studentHits = 0;
let gradeHits = 0;
let atCh = 0;
const AT = /\b(Jänner|Spital|Velo|parkieren|Billett|Trottinett|Primarschule|Matura)\b/;
for (const f of deBooks) {
  const rel = path.relative(path.join(ROOT, "docs/learning-book/de-DE"), f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  const t = fs.readFileSync(f, "utf8");
  if (/\bStudents?\b/.test(t)) studentHits++;
  if (/\bGrade\s*[1-6]\b/.test(t)) gradeHits++;
  if (AT.test(t)) atCh++;
}
for (const f of localeFiles) {
  const t = fs.readFileSync(path.join(ROOT, "locales/de-DE", f), "utf8");
  if (/\bStudents?\b/.test(t)) studentHits++;
  if (/\bGrade\s*[1-6]\b/.test(t)) gradeHits++;
  if (AT.test(t)) atCh++;
}
if (studentHits || gradeHits || atCh) fail("term-scan", { studentHits, gradeHits, atCh });
else pass("term-scan", { studentHits: 0, gradeHits: 0, atCh: 0 });

// 9) Math / Geometry modules load + sample strings
const math = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-de-DE/math.js")).href);
const geo = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-de-DE/geometry.js")).href);
const idx = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-de-DE/index.js")).href);
const mathText = JSON.stringify(math);
const geoText = JSON.stringify(geo);
const must = ["Mathematik", "Geometrie", "Addition", "Subtraktion", "Multiplikation", "Division", "Fläche", "Umfang"];
const missingTerms = must.filter((t) => !mathText.includes(t) && !geoText.includes(t) && !JSON.stringify(idx).includes(t));
const badMoney = /\$\d|shekel|dollar/i.test(mathText);
const badDec = /\b\d+\.\d{2}\b/.test(mathText) && !/,\d{2}/.test(mathText); // soft check
if (missingTerms.length || badMoney) fail("math-geometry", { missingTerms, badMoney });
else pass("math-geometry", { missingTerms: 0, badMoney: false, softDecimalNote: badDec });

// 10) Writing requirements present, word-packs.locale.js untouched expectation
const wr = path.join(ROOT, "data/help-center/de-DE/writing-pack-requirements.md");
if (!fs.existsSync(wr)) fail("writing-requirements", "missing");
else pass("writing-requirements", "present");

// 11) Hybrid student still 0
spawnSyncNote();
function spawnSyncNote() {
  // already collected externally; read artifact
  const h = JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/i18n/_de-DE-book-hybrid-student.json"), "utf8"));
  if (Array.isArray(h) && h.length === 0) pass("hybrid-student", 0);
  else fail("hybrid-student", Array.isArray(h) ? h.length : h);
}

fs.writeFileSync(path.join(ROOT, "scripts/i18n/_de-DE-final-endchecks.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(report.ok ? 0 : 1);
