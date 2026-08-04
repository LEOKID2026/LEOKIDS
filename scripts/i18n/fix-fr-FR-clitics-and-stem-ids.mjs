/**
 * Final clitic cleanup + restore English field IDs in stem rebuilders.
 * Run: node scripts/i18n/fix-fr-FR-clitics-and-stem-ids.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, out);
    else if (pred(ent.name, p)) out.push(p);
  }
  return out;
}

function fix(s) {
  return String(s)
    .replace(/pour tu entraîner/gi, "pour t’entraîner")
    .replace(/\bpour tu\b/g, "pour te")
    .replace(/faites-tu aider/gi, "fais-toi aider")
    .replace(/peut tu aider/gi, "peut t’aider")
    .replace(/peut tu\b/g, "peut te")
    .replace(/Que peut te aider/g, "Qu’est-ce qui peut t’aider")
    .replace(/un adulte peut te aider/gi, "un adulte peut t’aider")
    .replace(/Cela peut te aider/g, "Cela peut t’aider")
    .replace(/peut te aider/g, "peut t’aider")
    .replace(/t’ aider/g, "t’aider")
    .replace(/Choisis une ligne ou une colonne pour te entraîner/g, "Choisis une ligne ou une colonne pour t’entraîner")
    .replace(/pour te entraîner/gi, "pour t’entraîner")
    .replace(/\bà tu\b/gi, "à te")
    .replace(/\bIl tu\b/g, "Il te");
}

function fixNode(n) {
  if (typeof n === "string") return fix(n);
  if (Array.isArray(n)) return n.map(fixNode);
  if (n && typeof n === "object") {
    const o = {};
    for (const [k, v] of Object.entries(n)) o[k] = fixNode(v);
    return o;
  }
  return n;
}

let changed = 0;
const files = [
  ...walk(path.join(ROOT, "locales/fr-FR"), (n) => n.endsWith(".json")),
  ...walk(path.join(ROOT, "content-packs/fr-FR"), (n) => n.endsWith(".json")),
  path.join(ROOT, "data/science-questions-fr-FR-overlay.js"),
  ...walk(path.join(ROOT, "docs/learning-book/fr-FR"), (n) => n.endsWith(".md")),
  ...walk(path.join(ROOT, "data/help-center/fr-FR"), (n) => n.endsWith(".js")),
];

for (const f of files) {
  const raw = fs.readFileSync(f, "utf8");
  let next;
  if (f.endsWith(".json")) next = `${JSON.stringify(fixNode(JSON.parse(raw)), null, 2)}\n`;
  else next = fix(raw);
  if (next !== raw) {
    fs.writeFileSync(f, next, "utf8");
    changed += 1;
  }
}
console.log("content changed", changed);

for (const rel of ["utils/learning-content-fr-FR/math.js", "utils/learning-content-fr-FR/geometry.js"]) {
  const f = path.join(ROOT, rel);
  let t = fs.readFileSync(f, "utf8");
  const before = t;
  t = t
    .replace(/"Réponses acceptées"/g, '"acceptedAnswers"')
    .replace(/exerciceTexte/g, "exerciseText")
    .replace(/QuestionÉtiquette/g, "questionLabel")
    .replace(/\/\/ Réponses\/options:/g, "// Answers/options:");
  if (t !== before) {
    fs.writeFileSync(f, t, "utf8");
    console.log("stem ids fixed", rel);
  }
}

const bad = [];
for (const f of files) {
  const t = fs.readFileSync(f, "utf8");
  if (/\b(à|pour) tu\b/i.test(t) || /peut tu\b/i.test(t) || /faites-tu aider/i.test(t)) {
    bad.push(path.relative(ROOT, f));
  }
}
console.log("residual bad", bad.length, bad);

// geometry area wording: disk vs circle — keep cercle for perimeter/radius relation; aire of filled region can say disque when area
const geoPath = path.join(ROOT, "utils/learning-content-fr-FR/geometry.js");
let geo = fs.readFileSync(geoPath, "utf8");
geo = geo.replace(
  /Un cercle de rayon \$\{radius\}\. Quelle est l’aire \? \(π = 3\.14\)/,
  "Un disque de rayon ${radius}. Quelle est son aire ? (π = 3.14)",
);
fs.writeFileSync(geoPath, geo, "utf8");
console.log("geometry disque/aire wording updated");
