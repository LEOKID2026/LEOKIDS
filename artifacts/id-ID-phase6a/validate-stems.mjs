/**
 * Phase 6A inventory + parity validation for id-ID math/geometry stems.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = __dirname;

function extractKinds(src) {
  const s = new Set();
  for (const m of src.matchAll(/kind === "([^"]+)"/g)) s.add(m[1]);
  for (const m of src.matchAll(/kind\.includes\("([^"]+)"\)/g)) s.add(m[1]);
  for (const m of src.matchAll(/kind\.startsWith\("([^"]+)"\)/g)) s.add(m[1]);
  return [...s].sort();
}

function extractTemplateExprs(src) {
  /** @type {string[]} */
  const exprs = [];
  for (const m of src.matchAll(/\$\{([^}]+)\}/g)) exprs.push(m[1].trim());
  return exprs;
}

function extractDisplayTemplates(src) {
  /** @type {string[]} */
  const out = [];
  for (const m of src.matchAll(/`([^`\\]|\\.)*`/gs)) {
    out.push(m[0].slice(1, -1));
  }
  for (const m of src.matchAll(/return "([^"\\]|\\.)*"/g)) {
    const inner = m[0].slice('return "'.length, -1);
    if (/[A-Za-zÀ-ÿ]{3,}/.test(inner)) out.push(inner);
  }
  return out;
}

function looksEnglishProse(s) {
  const t = String(s)
    .replace(/\$\{[^}]+\}/g, " ")
    .replace(/[0-9π×÷+\-−–—/=<>%.,:;!?()[\]|_]+/g, " ")
    .replace(/\b(cm|km|km\/h|GCD|FPB|Leo|Emma|Noa|Yuval|dolar)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length < 8) return false;
  // English function words that should not appear in ID stems
  return /\b(the|and|with|what|how many|how much|fill in|compare|round|prime|composite|solve|there are|each|which)\b/i.test(
    t
  );
}

const enMath = fs.readFileSync(path.join(ROOT, "utils/learning-content-en/math.js"), "utf8");
const idMath = fs.readFileSync(path.join(ROOT, "utils/learning-content-id-ID/math.js"), "utf8");
const enGeo = fs.readFileSync(path.join(ROOT, "utils/learning-content-en/geometry.js"), "utf8");
const idGeo = fs.readFileSync(path.join(ROOT, "utils/learning-content-id-ID/geometry.js"), "utf8");
const idIndex = fs.readFileSync(path.join(ROOT, "utils/learning-content-id-ID/index.js"), "utf8");

const enMathKinds = extractKinds(enMath);
const idMathKinds = extractKinds(idMath);
const enGeoKinds = extractKinds(enGeo);
const idGeoKinds = extractKinds(idGeo);

const mathMissing = enMathKinds.filter((k) => !idMathKinds.includes(k));
const mathOrphan = idMathKinds.filter((k) => !enMathKinds.includes(k));
const geoMissing = enGeoKinds.filter((k) => !idGeoKinds.includes(k));
const geoOrphan = idGeoKinds.filter((k) => !enGeoKinds.includes(k));

const enMathExprs = extractTemplateExprs(enMath).sort();
const idMathExprs = extractTemplateExprs(idMath)
  .map((e) => e.replace(/OP_SYMBOL_ID/g, "OP_SYMBOL_EN").replace(/WEEKDAYS_ID/g, "WEEKDAYS_EN").replace(/OBJECTS_ID/g, "OBJECTS_EN"))
  .sort();
// Compare multisets of param expressions loosely: count of ${p....} style
function paramExprBag(exprs) {
  return exprs
    .filter((e) => /\bp\.|params\.|BLANK|q0|raw|af|bf|a\b|b\b|n\b|num\b|div\b|d\b|ml\b|rl\b|sc\b|c\b|pl\b|stem|opRaw|OP_SYMBOL/.test(e))
    .sort()
    .join("\n");
}
const enParamBag = paramExprBag(extractTemplateExprs(enMath));
const idParamBag = paramExprBag(
  extractTemplateExprs(idMath).map((e) =>
    e
      .replace(/OP_SYMBOL_ID/g, "OP_SYMBOL_EN")
      .replace(/WEEKDAYS_ID/g, "WEEKDAYS_EN")
      .replace(/OBJECTS_ID/g, "OBJECTS_EN")
  )
);
// Placeholder mismatch: count of ${} in corresponding rebuild functions should be equal
const enMathPhCount = extractTemplateExprs(enMath).length;
const idMathPhCount = extractTemplateExprs(idMath).length;
const enGeoPhCount = extractTemplateExprs(enGeo).length;
const idGeoPhCount = extractTemplateExprs(idGeo).length;

const idMathTemplates = extractDisplayTemplates(idMath);
const idGeoTemplates = extractDisplayTemplates(idGeo);
const unexplained = [];
for (const t of [...idMathTemplates, ...idGeoTemplates]) {
  if (looksEnglishProse(t)) unexplained.push(t.slice(0, 160));
}

const gradeDefects = [];
const blob = idMath + "\n" + idGeo;
if (/\bFase [ABC]\b/.test(blob)) gradeDefects.push("Fase terminology");
if (/\bGrade [1-6]\b/.test(blob)) gradeDefects.push("Grade N in id-ID stems");

const siswaDefects = [];
if (/\bsiswa\b/i.test(blob)) siswaDefects.push("siswa");
if (/peserta didik/i.test(blob)) siswaDefects.push("peserta didik");

// Runtime smoke: import modules and rebuild sample stems
const mathMod = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-id-ID/math.js")).href);
const geoMod = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-id-ID/geometry.js")).href);
const indexMod = await import(pathToFileURL(path.join(ROOT, "utils/learning-content-id-ID/index.js")).href);

const samples = [
  {
    subject: "math",
    q: { params: { kind: "wp_simple_add", a: 3, b: 4 }, gradeKey: "g1" },
  },
  {
    subject: "math",
    q: { params: { kind: "ns_even_odd", n: 8 }, gradeKey: "g2" },
  },
  {
    subject: "math",
    q: { params: { kind: "frac_half", whole: 10 }, gradeKey: "g2" },
  },
  {
    subject: "geometry",
    q: { params: { kind: "square_area", side: 5 }, gradeKey: "g3" },
  },
  {
    subject: "geometry",
    q: { params: { kind: "circle_area", radius: 3 }, gradeKey: "g6" },
  },
];

const sampleResults = samples.map(({ subject, q }) => {
  const out = indexMod.applyIdIdDisplayLayer({ ...q, subject }, subject);
  return {
    subject,
    kind: q.params.kind,
    stem: out.question,
    paramsEqual: JSON.stringify(out.params) === JSON.stringify(q.params),
  };
});

// Count translatable display templates (EN)
const enMathDisplay = extractDisplayTemplates(enMath).filter((t) => /[A-Za-z]{3,}/.test(t));
const enGeoDisplay = extractDisplayTemplates(enGeo).filter((t) => /[A-Za-z]{3,}/.test(t));

const report = {
  englishAuthority: [
    "utils/learning-content-en/math.js",
    "utils/learning-content-en/geometry.js",
    "content-packs/en/learning/geometry-content.json (labels; EN pack — id-ID embeds maps in geometry.js)",
  ],
  indonesianTarget: [
    "utils/learning-content-id-ID/math.js",
    "utils/learning-content-id-ID/geometry.js",
    "utils/learning-content-id-ID/index.js",
  ],
  mathKindsEn: enMathKinds.length,
  mathKindsId: idMathKinds.length,
  mathMissing,
  mathOrphan,
  geoKindsEn: enGeoKinds.length,
  geoKindsId: idGeoKinds.length,
  geoMissing,
  geoOrphan,
  enMathPhCount,
  idMathPhCount,
  enGeoPhCount,
  idGeoPhCount,
  placeholderCountDeltaMath: idMathPhCount - enMathPhCount,
  placeholderCountDeltaGeo: idGeoPhCount - enGeoPhCount,
  paramExprBagEqual: enParamBag === idParamBag,
  enMathDisplayTemplates: enMathDisplay.length,
  enGeoDisplayTemplates: enGeoDisplay.length,
  totalEnDisplayTemplates: enMathDisplay.length + enGeoDisplay.length,
  idMathDisplayTemplates: idMathTemplates.length,
  idGeoDisplayTemplates: idGeoTemplates.length,
  unexplainedEnglishProse: unexplained.length,
  unexplainedSample: unexplained.slice(0, 25),
  gradeDefects,
  siswaDefects,
  hasApplyIdId: /applyIdIdDisplayLayer/.test(idIndex),
  sampleResults,
  exports: {
    math: Object.keys(mathMod).sort(),
    geo: Object.keys(geoMod).sort(),
    index: Object.keys(indexMod).sort(),
  },
};

const pass =
  mathMissing.length === 0 &&
  mathOrphan.length === 0 &&
  geoMissing.length === 0 &&
  geoOrphan.length === 0 &&
  unexplained.length === 0 &&
  gradeDefects.length === 0 &&
  siswaDefects.length === 0 &&
  sampleResults.every((r) => r.paramsEqual && r.stem && !looksEnglishProse(r.stem)) &&
  report.hasApplyIdId;

fs.writeFileSync(path.join(OUT, "validate-report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
console.log(pass ? "VALIDATION PASS" : "VALIDATION FAIL");
process.exitCode = pass ? 0 : 1;
