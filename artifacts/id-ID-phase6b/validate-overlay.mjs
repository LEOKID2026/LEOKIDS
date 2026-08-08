/**
 * Validate id-ID Science overlay vs EN overlay / bank — logic fields untouched.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { computeScienceLocalizationCoverage } from "../../lib/learning/science-localization-coverage.js";
import { SCIENCE_QUESTIONS } from "../../data/science-questions.js";

const ROOT = process.cwd();
const ART = path.join(ROOT, "artifacts/id-ID-phase6b");

function placeholders(s) {
  const simple = [...String(s).matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
  const mustache = [...String(s).matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
  return [...new Set([...simple, ...mustache])].sort();
}

const SCIENTIFIC_OK =
  /°C|°F|\bcm\b|\bmm\b|\bm\b|\bkg\b|\bg\b|\bml\b|\bL\b|H₂O|O₂|CO₂|H2O|O2|CO2|N₂|NaCl|pH|DNA|UV|\bSun\b|\bEarth\b|\bMoon\b|Mars|Venus|Jupiter|Saturn|Neptune|Uranus|Mercury|Asteroid|Leo|LEO/;

function looksUnexplainedEnglish(s) {
  if (typeof s !== "string" || !s.trim()) return false;
  if (SCIENTIFIC_OK.test(s) && !/\b(the|and|which|what|where|why|how|does|have|with|from|that|this|are|is|to)\b/i.test(s)) {
    return false;
  }
  // Identical short labels that are same in ID (Gas, Metal, etc.) may be intentional
  if (/^(Gas|Metal|Solid|Liquid|Blue|Cotton|Aluminum|Three|Fish|Bird|Dog|Cat|Chicken|Snake|Rabbit|Ears|Eyes|Nose|Tongue|Leaves|Roots|Flowers|Fruits)$/i.test(s)) {
    return false; // often identical loan/common words — counted separately
  }
  return /\b(the|and|which|what|where|why|how|does|have|with|from|that|this|are|is|Which|What|Where|Why|How)\b/.test(s);
}

const enMod = await import(pathToFileURL(path.resolve("data/science-questions-en-overlay.js")).href);
const idMod = await import(pathToFileURL(path.resolve("data/science-questions-id-ID-overlay.js")).href);
const en = enMod.SCIENCE_EN_OVERLAY;
const id = idMod.SCIENCE_ID_ID_OVERLAY;

const enIds = Object.keys(en).sort();
const idIds = Object.keys(id).sort();
const missing = enIds.filter((x) => !id[x]);
const orphan = idIds.filter((x) => !en[x]);

let empty = 0;
let ph = 0;
let schema = 0;
let unexplained = [];
let intentionalIdentical = [];
let translatedLeaves = 0;
let scienceTerm = [];
let gradeTerm = [];
let registerTerm = [];

function walkCompare(enVal, idVal, where) {
  if (Array.isArray(enVal)) {
    if (!Array.isArray(idVal) || idVal.length !== enVal.length) {
      schema += 1;
      return;
    }
    enVal.forEach((v, i) => walkCompare(v, idVal[i], `${where}[${i}]`));
    return;
  }
  if (typeof enVal === "string") {
    if (typeof idVal !== "string" || !String(idVal).trim()) {
      empty += 1;
      return;
    }
    if (JSON.stringify(placeholders(enVal)) !== JSON.stringify(placeholders(idVal))) ph += 1;
    if (idVal === enVal) {
      intentionalIdentical.push(where);
      if (looksUnexplainedEnglish(idVal)) unexplained.push(`${where}: ${idVal.slice(0, 100)}`);
    } else {
      translatedLeaves += 1;
      if (/\b(IPAS|Fase\s*[ABC]|siswa|peserta didik|\bAnda\b|Grade\s*[1-6])\b/i.test(idVal)) {
        if (/IPAS|Science\b/i.test(idVal) && !/Sains/i.test(idVal)) scienceTerm.push(`${where}: ${idVal}`);
        if (/Fase\s*[ABC]|Grade\s*[1-6]/i.test(idVal)) gradeTerm.push(`${where}: ${idVal}`);
        if (/siswa|peserta didik|\bAnda\b/.test(idVal)) registerTerm.push(`${where}: ${idVal}`);
      }
    }
  }
}

for (const qid of enIds) {
  if (!id[qid]) continue;
  const e = en[qid];
  const d = id[qid];
  for (const f of ["stem", "explanation", "hint", "feedback", "question"]) {
    if (e[f] != null) walkCompare(e[f], d[f], `${qid}.${f}`);
  }
  if (e.options) walkCompare(e.options, d.options, `${qid}.options`);
  if (e.theoryLines) walkCompare(e.theoryLines, d.theoryLines, `${qid}.theoryLines`);
}

// Logic safety vs bank: overlay must not invent correctIndex/params
let logicTouched = 0;
for (const qid of idIds) {
  const row = id[qid];
  if (row.correctIndex != null || row.correctAnswer != null || row.params != null || row.questionKinds != null) {
    logicTouched += 1;
  }
}

const coverage = computeScienceLocalizationCoverage(SCIENCE_QUESTIONS, id);

const report = {
  enItems: enIds.length,
  idItems: idIds.length,
  missing: missing.length,
  orphan: orphan.length,
  empty,
  placeholderMismatches: ph,
  schemaDefects: schema,
  translatedLeaves,
  intentionalIdentical: intentionalIdentical.length,
  unexplainedEnglish: unexplained.length,
  unexplainedSample: unexplained.slice(0, 40),
  scienceTermDefects: scienceTerm.length,
  gradeTermDefects: gradeTerm.length,
  registerDefects: registerTerm.length,
  overlayLogicFieldsPresent: logicTouched,
  coverage: {
    contractComplete: coverage.contractComplete,
    total: coverage.total,
    overlayHit: coverage.overlayHit,
    overlayMiss: coverage.overlayMiss,
    incompleteOverlayIds: coverage.incompleteOverlayIds?.length || 0,
  },
  bankCount: SCIENCE_QUESTIONS.length,
};

fs.writeFileSync(path.join(ART, "validate-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (
  missing.length ||
  orphan.length ||
  empty ||
  ph ||
  schema ||
  unexplained.length ||
  logicTouched ||
  !coverage.contractComplete
) {
  process.exitCode = 1;
}
