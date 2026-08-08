/**
 * Phase 4A validation — disk/schema/key parity + linguistic checks for books.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const EN_ROOT = path.join(ROOT, "content-packs", "en", "books");
const ID_ROOT = path.join(ROOT, "content-packs", "id-ID", "books");

const KEEP_KEY = new Set(["skillId", "learningPageId", "pageType", "learningLanguage", "doNotTranslateFields"]);
const PLACEHOLDER_RE = /\{[a-zA-Z_][a-zA-Z0-9_]*\}/g;

function walkJson(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkJson(p, acc);
    else if (ent.name.endsWith(".json")) acc.push(p);
  }
  return acc;
}

function relOf(root, p) {
  return path.relative(root, p).split(path.sep).join("/");
}

function collectLeaves(node, prefix, out) {
  if (node === null || typeof node !== "object" || Array.isArray(node)) {
    out.set(prefix, node);
    return;
  }
  const keys = Object.keys(node);
  if (!keys.length) {
    out.set(prefix, node);
    return;
  }
  for (const k of keys) collectLeaves(node[k], prefix ? `${prefix}.${k}` : k, out);
}

function phSig(s) {
  if (typeof s !== "string") return "";
  return [...(s.match(PLACEHOLDER_RE) || [])].sort().join(",");
}

function subjectOf(rel) {
  if (rel.includes("page-title-leaves/math.")) return "math";
  if (rel.includes("page-title-leaves/geometry.")) return "geometry";
  if (rel.includes("page-title-leaves/science.")) return "science";
  if (rel.includes("page-title-leaves/english.")) return "english";
  if (rel === "english-page-skills.json") return "english";
  if (rel === "ui.json" || rel === "registry-titles.json") return "shared";
  return "other";
}

/** Heuristic unexplained English UI on non-English subjects */
function looksUnexplainedEnglish(s) {
  if (typeof s !== "string") return false;
  if (!/[A-Za-z]{4,}/.test(s)) return false;
  // allow placeholders-only, numbers, short labels already Indonesian mixed
  if (/^(Kelas|Matematika|Geometri|IPA|Bahasa|Latihan|Halaman|Tutup|Daftar|Kembali|Persegi|Segitiga|Volume|Luas|Keliling)/.test(s))
    return false;
  // Latin letters with English function words
  return /\b(the|and|with|from|into|your|this|that|Grade|Close|Back to|Word Problems|Adding|Subtracting|Area of|Volume of|Perimeter of)\b/i.test(
    s
  );
}

const enFiles = walkJson(EN_ROOT).map((p) => relOf(EN_ROOT, p)).sort();
const idFiles = walkJson(ID_ROOT).map((p) => relOf(ID_ROOT, p)).sort();

const missingFiles = enFiles.filter((f) => !idFiles.includes(f));
const extraFiles = idFiles.filter((f) => !enFiles.includes(f));

let enLeaves = 0;
let idLeaves = 0;
/** @type {string[]} */
const missingKeys = [];
/** @type {string[]} */
const extraKeys = [];
/** @type {string[]} */
const emptyLeaves = [];
/** @type {string[]} */
const schemaDefects = [];
/** @type {string[]} */
const placeholderMismatches = [];
/** @type {string[]} */
const logicDefects = [];
/** @type {string[]} */
const gradeDefects = [];
/** @type {string[]} */
const unexplainedEnglish = [];
/** @type {string[]} */
const englishExceptionDefects = [];

let translatedLeaves = 0;
let intentionalEnglishLeaves = 0;

const bySubject = { math: 0, geometry: 0, science: 0, english: 0, shared: 0, other: 0 };

for (const rel of enFiles) {
  bySubject[subjectOf(rel)] = (bySubject[subjectOf(rel)] || 0) + 1;
  const en = JSON.parse(fs.readFileSync(path.join(EN_ROOT, rel), "utf8"));
  const idPath = path.join(ID_ROOT, rel);
  if (!fs.existsSync(idPath)) continue;
  const id = JSON.parse(fs.readFileSync(idPath, "utf8"));

  const em = new Map();
  const im = new Map();
  collectLeaves(en, "", em);
  collectLeaves(id, "", im);
  enLeaves += em.size;
  idLeaves += im.size;

  for (const k of em.keys()) if (!im.has(k)) missingKeys.push(`${rel}:${k}`);
  for (const k of im.keys()) if (!em.has(k)) extraKeys.push(`${rel}:${k}`);

  for (const [k, ev] of em) {
    const iv = im.get(k);
    const leaf = k.split(".").pop() || "";

    if (typeof iv === "string" && iv.trim() === "" && typeof ev === "string" && ev.trim() !== "") {
      emptyLeaves.push(`${rel}:${k}`);
    }
    if (typeof ev === "string" && typeof iv === "string" && phSig(ev) !== phSig(iv)) {
      placeholderMismatches.push(`${rel}:${k}`);
    }

    // Logic / identity fields must be identical
    if (KEEP_KEY.has(leaf) || /\.skillId$|\.pageType$|\.learningLanguage$/.test(k)) {
      if (JSON.stringify(ev) !== JSON.stringify(iv)) logicDefects.push(`${rel}:${k}`);
    }

    // doNotTranslate description must remain English-identical
    if (rel === "english-page-skills.json" && /\.description$/.test(k)) {
      if (ev !== iv) englishExceptionDefects.push(`${rel}:${k} description altered`);
      else intentionalEnglishLeaves++;
    } else if (typeof ev === "string" && typeof iv === "string") {
      if (ev === iv && /[A-Za-z]{3,}/.test(ev) && ev.trim() !== "") {
        // retained English
        intentionalEnglishLeaves++;
      } else if (ev !== iv) {
        translatedLeaves++;
      }
    }

    // Grade terminology on Indonesian side
    if (typeof iv === "string") {
      if (/\bFase [ABC]\b/.test(iv)) gradeDefects.push(`${rel}:${k} uses Fase`);
      if (/\bGrade [1-6]\b/.test(iv) && !rel.includes("english") && rel !== "english-page-skills.json") {
        // non-english surfaces should not keep Grade N in product labels
        gradeDefects.push(`${rel}:${k} retains Grade`);
      }
      // english-page-skills titles may keep Grade only if fully retained learning string — already fixed
      if (/\bGrade [1-6]\b/.test(iv) && (rel.startsWith("page-title-leaves/math.") || rel.startsWith("page-title-leaves/geometry.") || rel.startsWith("page-title-leaves/science.") || rel === "ui.json" || (rel === "registry-titles.json" && !k.includes("english.")))) {
        gradeDefects.push(`${rel}:${k} Grade on non-English`);
      }
    }

    // Unexplained English on non-English subject page titles / shared chrome
    const subj = subjectOf(rel);
    if (
      typeof iv === "string" &&
      typeof ev === "string" &&
      (subj === "math" || subj === "geometry" || subj === "science" || rel === "ui.json")
    ) {
      if (iv === ev && looksUnexplainedEnglish(iv)) {
        unexplainedEnglish.push(`${rel}:${k}=${JSON.stringify(iv)}`);
      }
    }
  }

  // schema: top-level key set
  const ek = Object.keys(en).sort().join(",");
  const ik = Object.keys(id).sort().join(",");
  if (ek !== ik) schemaDefects.push(`${rel} top-level keys differ`);
}

const report = {
  englishFiles: enFiles.length,
  indonesianFiles: idFiles.length,
  missingFiles,
  extraFiles,
  enLeaves,
  idLeaves,
  missingKeys: missingKeys.length,
  extraKeys: extraKeys.length,
  emptyLeaves: emptyLeaves.length,
  schemaDefects: schemaDefects.length,
  placeholderMismatches: placeholderMismatches.length,
  logicDefects: logicDefects.length,
  gradeDefects: gradeDefects.length,
  englishExceptionDefects: englishExceptionDefects.length,
  unexplainedEnglish: unexplainedEnglish.length,
  bySubject,
  translatedLeaves,
  intentionalEnglishLeaves,
  sampleUnexplained: unexplainedEnglish.slice(0, 30),
  sampleGrade: gradeDefects.slice(0, 20),
  sampleMissingKeys: missingKeys.slice(0, 20),
};

fs.writeFileSync(path.join(__dirname, "validate-report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));

const pass =
  missingFiles.length === 0 &&
  extraFiles.length === 0 &&
  missingKeys.length === 0 &&
  extraKeys.length === 0 &&
  emptyLeaves.length === 0 &&
  schemaDefects.length === 0 &&
  placeholderMismatches.length === 0 &&
  logicDefects.length === 0 &&
  gradeDefects.length === 0 &&
  englishExceptionDefects.length === 0 &&
  unexplainedEnglish.length === 0 &&
  enFiles.length === idFiles.length &&
  enLeaves === idLeaves;

process.exitCode = pass ? 0 : 1;
console.log(pass ? "VALIDATION PASS" : "VALIDATION FAIL");
