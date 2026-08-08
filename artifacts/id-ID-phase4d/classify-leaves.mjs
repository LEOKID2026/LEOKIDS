/**
 * Phase 4D — classify EN learning pack leaves and emit translation worklists.
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const EN = path.join(ROOT, "content-packs/en/learning");
const ART = path.join(ROOT, "artifacts/id-ID-phase4d");
fs.mkdirSync(ART, { recursive: true });

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
  if (/^[a-z][a-z0-9_]{2,}$/.test(s) && !/\s/.test(s)) return true; // snake_case IDs
  if (/^https?:/.test(s) || s.startsWith("/")) return true;
  if (/^[\d\s+\-×x*/÷=<>().,°%½¼¾√πa²b²c²]+$/i.test(s) && /\d|×|÷|π|°|√/.test(s)) return true;
  if (/^[A-Z0-9_]{2,}$/.test(s) && s.length <= 24) return true;
  // leaked code / technical tokens in copy packs
  if (/=>|===|!==|\.length|\.dueAt|responseTimeMs|setAnimationStep|typeof |npm run |x-engine-review-token|MistakeEventV1|Asia\/Jerusalem|evidenceTrace/.test(s)) {
    return true;
  }
  if (/^\d+(\.\d+)?\s?(cm|m|mm|km|°)$/i.test(s.trim())) return true;
  if (/^[A-Za-z]\.[A-Za-z]+$/.test(s)) return true; // s.ms
  return false;
}

/** English-learning teaching sentences that must stay EN */
function isIntentionalEnglishLearning(s, filePath, fieldPath) {
  if (/utils__learning-content-en__english/.test(filePath) || /learning-content-en__english/.test(fieldPath)) {
    if (/we use (am|is|are)\./i.test(s)) return true;
    if (/^With (I|he|she|it|you)/i.test(s)) return true;
  }
  if (s === "past/present" || s === "false friend") return true;
  if (/^yesterday\/now$/i.test(s)) return true;
  return false;
}

function isBrandOrProper(s) {
  return /^(Leo Kids|LEO KIDS|Leo|Pythagoras|Pythagorean theorem|π)$/i.test(s.trim());
}

const files = walkFiles(EN);
const unique = new Map();

function visit(v, fieldKey, file, pathStr) {
  if (typeof v === "string") {
    const tech = isTechnicalValue(v, fieldKey);
    const intentional = isIntentionalEnglishLearning(v, file, pathStr);
    const brand = isBrandOrProper(v);
    const entry = unique.get(v) || {
      count: 0,
      tech: false,
      intentional: false,
      brand: false,
      samples: [],
    };
    entry.count++;
    entry.tech = entry.tech || tech;
    entry.intentional = entry.intentional || intentional;
    entry.brand = entry.brand || brand;
    if (entry.samples.length < 2) entry.samples.push(`${file}::${pathStr}`);
    unique.set(v, entry);
    return;
  }
  if (Array.isArray(v)) {
    v.forEach((x, i) => visit(x, fieldKey, file, `${pathStr}[${i}]`));
    return;
  }
  if (v && typeof v === "object") {
    for (const [k, x] of Object.entries(v)) {
      visit(x, k, file, pathStr ? `${pathStr}.${k}` : k);
    }
  }
}

for (const rel of files) {
  const j = JSON.parse(fs.readFileSync(path.join(EN, rel), "utf8"));
  visit(j, "", rel, "");
}

const all = [...unique.entries()].map(([s, m]) => ({ s, ...m }));
const toTranslate = all.filter((x) => !x.tech && !x.intentional && !x.brand);
const retain = all.filter((x) => x.tech || x.intentional || x.brand);

fs.writeFileSync(path.join(ART, "en-file-list.json"), JSON.stringify(files, null, 2));
fs.writeFileSync(path.join(ART, "classify-summary.json"), JSON.stringify({
  files: files.length,
  uniqueLeaves: all.length,
  toTranslate: toTranslate.length,
  retainTechOrIntentional: retain.length,
  structureFiles: files.filter((f) => f.includes(".structure.json")),
}, null, 2));
fs.writeFileSync(
  path.join(ART, "to-translate.json"),
  JSON.stringify(toTranslate.map((x) => ({ s: x.s, count: x.count, samples: x.samples })), null, 2)
);
fs.writeFileSync(
  path.join(ART, "retain.json"),
  JSON.stringify(retain.map((x) => ({ s: x.s, tech: x.tech, intentional: x.intentional, brand: x.brand })), null, 2)
);

console.log({
  files: files.length,
  unique: all.length,
  toTranslate: toTranslate.length,
  retain: retain.length,
});
