/**
 * Linguistic + safety audit for content-packs/id-ID/learning
 */
import fs from "fs";
import path from "path";

const EN_ROOT = "content-packs/en/learning";
const ID_ROOT = "content-packs/id-ID/learning";
const ART = "artifacts/id-ID-phase4d";

function walkFiles(dir, base = "") {
  let out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = (base ? `${base}/${ent.name}` : ent.name).replace(/\\/g, "/");
    if (ent.isDirectory()) out = out.concat(walkFiles(path.join(dir, ent.name), rel));
    else if (ent.name.endsWith(".json")) out.push(rel);
  }
  return out.sort();
}

const TECH_FIELD_KEYS = new Set([
  "id", "subjectId", "topicId", "skillId", "patternId", "diagnosticId", "gradeId",
  "questionKind", "suggestedQuestionType", "kind", "type", "code", "key", "slug",
  "href", "path", "src", "version", "minWrong", "minDistinctPatternFamilies",
  "minDistinctDays", "threshold", "weight", "generatedAt", "bannedConclusionPhrases",
]);

function isTechValue(s, fieldKey) {
  if (TECH_FIELD_KEYS.has(fieldKey)) return true;
  if (!s || !String(s).trim()) return true;
  if (/^[A-Z]-\d+$/.test(s)) return true;
  if (/^g[1-6]$/.test(s)) return true;
  if (/^(math|english|geometry|science|reading)$/.test(s)) return true;
  if (/^[a-z][a-z0-9_]{2,}$/.test(s) && !/\s/.test(s)) return true;
  if (/^https?:/.test(s) || s.startsWith("/")) return true;
  if (/=>|===|!==|\.length|\.dueAt|responseTimeMs|setAnimationStep|typeof |npm run |x-engine-review-token|MistakeEventV1|Asia\/Jerusalem|evidenceTrace/.test(s)) {
    return true;
  }
  if (/^\d+(\.\d+)?\s?(cm|m|mm|km|°)$/i.test(String(s).trim())) return true;
  if (/^[A-Za-z]\.[A-Za-z]+$/.test(s)) return true;
  if (/^Number\([a-zA-Z0-9_.]+\)$/.test(s)) return true;
  if (/\$\{M\(/.test(s) || /volume:\s*\$\{/i.test(s)) return true;
  if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return true;
  if (/╫/.test(s)) return true;
  if (/^[\d\s+\-×x*/÷=<>().,°%½¼¾√πa²b²c²{}m0m1]+$/i.test(s) && /\d|×|÷|π|°|√/.test(s)) return true;
  return false;
}

function isIntentionalEn(s, file) {
  if (/learning-content-en__english/.test(file)) {
    if (/we use (am|is|are)\./i.test(s) || /^With (I|he|she|it|you)/i.test(s)) return true;
  }
  if (s === "past/present" || s === "false friend" || s === "he/she/it") return true;
  if (/fast-diagnostic-probes|taxonomy\/english\.content/.test(file)) {
    if (/^(Simple past|Present continuous|Future|Perfect tenses)(\b| \()/i.test(s)) return true;
    if (/\(am\/is\/are|\(will \/ going to|\(have\/had \+|\(can\/must\/should\)/i.test(s)) return true;
    if (/Kata kerja bantu \(can\/must\/should\)/.test(s)) return true;
  }
  return false;
}

function isBrand(s) {
  return /^(Leo Kids|LEO KIDS|Leo|Pythagoras|Pythagorean theorem|π)$/i.test(String(s).trim());
}

function isLikelyEnglishProse(s) {
  if (!/[A-Za-z]{4,}/.test(s)) return false;
  if (/Kata kerja bantu \(can\/must\/should\)/.test(s)) return false;
  if (isIntentionalEn(s, "")) return false;
  return /\b(the|and|with|from|that|this|what|which|before|after|should|would|could|practice|grade|student|teacher|choose|select|compute|formula)\b/i.test(s);
}

function isValidLoanIdentical(s) {
  return /^(Area|Volume|Perimeter|Ratio|Scale|Axis|Idea|Rule|Mixed|moderate|Math|Cube|Cone|Body|Rotation|Reflection|Translation|Grammar|Phonics|Vocabulary|Writing|Visual)$/i.test(s)
    || /^(Online|Offline|Timer|Badge|Level|Marathon)$/i.test(s)
    || /^Volume: \{m0\}\.$/.test(s);
}

const files = walkFiles(ID_ROOT);
const unexplained = [];
const siswa = [];
const gradeEn = [];
const fase = [];
const registerAdultKamu = [];
const identical = { intentional: [], brand: [], tech: [], formula: [], loan: [], finding: [] };
const idMutations = [];

function collect(v, fieldKey, file, enNode) {
  if (typeof v === "string") {
    const enVal = typeof enNode === "string" ? enNode : undefined;
    if (enVal !== undefined && v === enVal) {
      if (isIntentionalEn(v, file)) identical.intentional.push({ file, s: v.slice(0, 80) });
      else if (isBrand(v)) identical.brand.push({ file, s: v });
      else if (isTechValue(v, fieldKey)) identical.tech.push({ file, s: v.slice(0, 80) });
      else if (isValidLoanIdentical(v)) identical.loan.push({ file, s: v });
      else if (/^[\d\s+\-×x*/÷=<>().,°%½¼¾√πa²b²c²{}m0m1]+$/i.test(v)) identical.formula.push({ file, s: v });
      else identical.finding.push({ file, fieldKey, s: v.slice(0, 120) });
    }
    if (!isTechValue(v, fieldKey) && !isIntentionalEn(v, file) && !isBrand(v) && isLikelyEnglishProse(v)) {
      const hasIdMarkers =
        /\b(yang|dan|dengan|untuk|adalah|pada|dari|atau|serta|sebuah|sebagai|Kelas|murid|latihan|penjumlahan|pengurangan|perkalian|pembagian|persegi|segitiga|lingkaran)\b/i.test(v);
      if (!hasIdMarkers && /[A-Za-z]{5,}/.test(v) && /\s/.test(v) && v.length > 25) {
        unexplained.push({ file, fieldKey, s: v.slice(0, 140) });
      }
    }
    if (/\bsiswa\b|\bpeserta didik\b/i.test(v)) siswa.push({ file, s: v.slice(0, 100) });
    if (/\bGrade\s*[1-6]\b|\bgrades?\s+[1-6]\b/i.test(v)) gradeEn.push({ file, s: v.slice(0, 100) });
    if (/\bFase [ABC]\b/.test(v)) fase.push({ file, s: v.slice(0, 100) });
    // adult/parent-facing only (topic-next-step is student practice guidance → kamu OK)
    if (/learning-patterns-copy|ParentCurriculum|parent-facing|parent-narrative|diagnostic-engine-v2-defaults/i.test(file)) {
      if (/\bkamu\b/i.test(v)) registerAdultKamu.push({ file, s: v.slice(0, 100) });
    }
    return;
  }
  if (Array.isArray(v)) {
    v.forEach((x, i) => collect(x, fieldKey, file, Array.isArray(enNode) ? enNode[i] : undefined));
    return;
  }
  if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) {
      if (["id", "subjectId"].includes(k) && enNode && typeof enNode === "object" && !Array.isArray(enNode)) {
        if (enNode[k] !== x) idMutations.push({ file, k, en: enNode[k], id: x });
      }
      collect(x, k, file, enNode && typeof enNode === "object" && !Array.isArray(enNode) ? enNode[k] : undefined);
    }
  }
}

for (const rel of files) {
  const id = JSON.parse(fs.readFileSync(path.join(ID_ROOT, rel), "utf8"));
  const en = JSON.parse(fs.readFileSync(path.join(EN_ROOT, rel), "utf8"));
  collect(id, "", rel, en);
}

const structureDiffs = [];
for (const rel of files.filter((f) => f.includes(".structure.json"))) {
  const en = JSON.parse(fs.readFileSync(path.join(EN_ROOT, rel), "utf8"));
  const id = JSON.parse(fs.readFileSync(path.join(ID_ROOT, rel), "utf8"));
  if (JSON.stringify(en) !== JSON.stringify(id)) structureDiffs.push(rel);
}

const report = {
  unexplainedEnglish: unexplained.length,
  unexplainedSample: unexplained.slice(0, 30),
  siswaDefects: siswa.length,
  gradeDefects: gradeEn.length,
  faseLeak: fase.length,
  registerAdultKamu: registerAdultKamu.length,
  registerSample: registerAdultKamu.slice(0, 20),
  identical: {
    intentional: identical.intentional.length,
    brand: identical.brand.length,
    tech: identical.tech.length,
    formula: identical.formula.length,
    loan: identical.loan.length,
    finding: identical.finding.length,
    findingSample: identical.finding.slice(0, 40),
  },
  idMutations: idMutations.length,
  structureDiffs,
};

fs.writeFileSync(path.join(ART, "linguistic-audit.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
const pass =
  report.unexplainedEnglish === 0 &&
  report.siswaDefects === 0 &&
  report.gradeDefects === 0 &&
  report.faseLeak === 0 &&
  report.registerAdultKamu === 0 &&
  report.identical.finding === 0 &&
  report.idMutations === 0 &&
  report.structureDiffs.length === 0;
process.exit(pass ? 0 : 1);
