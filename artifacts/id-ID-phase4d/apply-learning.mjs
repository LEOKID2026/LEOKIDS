/**
 * Apply Indonesian translations to content-packs/en/learning → id-ID/learning.
 * Display leaves only; keys, IDs, technical values, intentional English retained.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const EN_ROOT = path.join(ROOT, "content-packs/en/learning");
const OUT_ROOT = path.join(ROOT, "content-packs/id-ID/learning");
const ART = path.join(ROOT, "artifacts/id-ID-phase4d");

const TECH_FIELD_KEYS = new Set([
  "id",
  "subjectId",
  "topicId",
  "skillId",
  "patternId",
  "diagnosticId",
  "gradeId",
  "questionKind",
  "suggestedQuestionType",
  "kind",
  "type",
  "code",
  "key",
  "slug",
  "href",
  "path",
  "src",
  "version",
  "minWrong",
  "minDistinctPatternFamilies",
  "minDistinctDays",
  "threshold",
  "weight",
]);

function walkFiles(dir, base = "") {
  let out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = (base ? `${base}/${ent.name}` : ent.name).replace(/\\/g, "/");
    if (ent.isDirectory()) out = out.concat(walkFiles(path.join(dir, ent.name), rel));
    else if (ent.name.endsWith(".json")) out.push(rel);
  }
  return out.sort();
}

function isTechnicalValue(s, fieldKey) {
  if (typeof s !== "string") return true;
  if (TECH_FIELD_KEYS.has(fieldKey)) return true;
  if (!s.trim()) return true;
  if (/^\{[a-zA-Z0-9_]+\}$/.test(s)) return true;
  if (/\{[a-zA-Z0-9_]+\}/.test(s) && !/[A-Za-z]{4,}/.test(s.replace(/\{[^}]+\}/g, ""))) return true;
  if (/^[A-Z]-\d+$/.test(s)) return true;
  if (/^g[1-6]$/.test(s)) return true;
  if (/^(math|english|geometry|science|reading)$/.test(s)) return true;
  if (/^[a-z][a-z0-9_]{2,}$/.test(s) && !/\s/.test(s)) return true;
  if (/^https?:/.test(s) || s.startsWith("/")) return true;
  if (/^[\d\s+\-×x*/÷=<>().,°%½¼¾√πa²b²c²]+$/i.test(s) && /\d|×|÷|π|°|√/.test(s)) return true;
  if (/^[A-Z0-9_]{2,}$/.test(s) && s.length <= 24) return true;
  if (/=>|===|!==|\.length|\.dueAt|responseTimeMs|setAnimationStep|typeof |npm run |x-engine-review-token|MistakeEventV1|Asia\/Jerusalem|evidenceTrace/.test(s)) {
    return true;
  }
  if (/^\d+(\.\d+)?\s?(cm|m|mm|km|°)$/i.test(s.trim())) return true;
  if (/^[A-Za-z]\.[A-Za-z]+$/.test(s)) return true;
  return false;
}

function isIntentionalEnglishLearning(s, filePath) {
  if (/utils__learning-content-en__english/.test(filePath) || /learning-content-en__english/.test(filePath)) {
    if (/we use (am|is|are)\./i.test(s)) return true;
    if (/^With (I|he|she|it|you)/i.test(s)) return true;
  }
  if (s === "past/present" || s === "false friend") return true;
  return false;
}

function isBrandOrProper(s) {
  return /^(Leo Kids|LEO KIDS|Leo|Pythagoras|Pythagorean theorem)$/i.test(s.trim());
}

function isFormulaLeaf(s) {
  // mostly symbols / formula-like with little prose
  const stripped = s.replace(/\{[a-zA-Z0-9_]+\}/g, "X");
  if (/^[a-z]+:\s*.*[×÷=√π²³°]/.test(s) && s.length < 80) return false; // still translate labels like "square: area ="
  if (/^[\d\s+\-×x*/÷=<>().,°%½¼¾√πa²b²c²{}m0m1]+$/i.test(s)) return true;
  return false;
}

// Load dict parts
const dict = {};
for (const name of fs.readdirSync(ART).filter((n) => /^dict-\d+\.json$/.test(n)).sort()) {
  Object.assign(dict, JSON.parse(fs.readFileSync(path.join(ART, name), "utf8")));
}
// optional merged
if (fs.existsSync(path.join(ART, "learning-dict.json"))) {
  Object.assign(dict, JSON.parse(fs.readFileSync(path.join(ART, "learning-dict.json"), "utf8")));
}

const stats = {
  translated: 0,
  retainedTech: 0,
  retainedIntentional: 0,
  retainedBrand: 0,
  retainedFormula: 0,
  identicalLoan: 0,
  missing: [],
  placeholderMismatch: [],
};

function placeholders(s) {
  return (String(s).match(/\{[a-zA-Z0-9_]+\}/g) || []).sort();
}

function translateLeaf(s, fieldKey, filePath) {
  if (isTechnicalValue(s, fieldKey)) {
    stats.retainedTech++;
    return s;
  }
  if (isIntentionalEnglishLearning(s, filePath)) {
    stats.retainedIntentional++;
    return s;
  }
  if (isBrandOrProper(s)) {
    stats.retainedBrand++;
    return s;
  }
  if (isFormulaLeaf(s)) {
    stats.retainedFormula++;
    return s;
  }
  if (Object.prototype.hasOwnProperty.call(dict, s)) {
    const out = dict[s];
    const pe = placeholders(s);
    const po = placeholders(out);
    if (pe.join() !== po.join()) {
      stats.placeholderMismatch.push({ s, out });
    }
    if (out === s) stats.identicalLoan++;
    else stats.translated++;
    return out;
  }
  stats.missing.push({ s: s.slice(0, 160), filePath, fieldKey });
  return s;
}

function walkTranslate(v, fieldKey, filePath) {
  if (typeof v === "string") return translateLeaf(v, fieldKey, filePath);
  if (Array.isArray(v)) return v.map((x) => walkTranslate(x, fieldKey, filePath));
  if (v && typeof v === "object") {
    const out = {};
    for (const [k, x] of Object.entries(v)) {
      out[k] = walkTranslate(x, k, filePath);
    }
    return out;
  }
  return v;
}

function deepEqualShape(a, b) {
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((x, i) => deepEqualShape(x, b[i]));
  }
  if (typeof a === "object") {
    const ak = Object.keys(a).sort();
    const bk = Object.keys(b).sort();
    if (ak.join() !== bk.join()) return false;
    return ak.every((k) => deepEqualShape(a[k], b[k]));
  }
  return true; // values may differ
}

const files = walkFiles(EN_ROOT);
const schemaDefects = [];
for (const rel of files) {
  const en = JSON.parse(fs.readFileSync(path.join(EN_ROOT, rel), "utf8"));
  const id = walkTranslate(en, "", rel);
  if (!deepEqualShape(en, id)) schemaDefects.push(rel);
  const outPath = path.join(OUT_ROOT, rel);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(id, null, 2)}\n`);
}

const report = {
  filesWritten: files.length,
  dictSize: Object.keys(dict).length,
  stats: {
    ...stats,
    missingCount: stats.missing.length,
    missingSample: stats.missing.slice(0, 40),
    placeholderMismatchCount: stats.placeholderMismatch.length,
  },
  schemaDefects,
};

fs.writeFileSync(path.join(ART, "apply-report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({
  filesWritten: report.filesWritten,
  dictSize: report.dictSize,
  translated: stats.translated,
  missing: stats.missing.length,
  placeholderMismatch: stats.placeholderMismatch.length,
  schemaDefects: schemaDefects.length,
}, null, 2));

if (stats.missing.length || stats.placeholderMismatch.length || schemaDefects.length) {
  process.exitCode = 1;
}
