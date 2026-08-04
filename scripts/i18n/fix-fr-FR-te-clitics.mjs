/**
 * Fix object-clitic corruption: mechanical vous→tu left "à tu + infinitive"
 * and "tu aide/aident" instead of te/t’.
 *
 * Run: node scripts/i18n/fix-fr-FR-te-clitics.mjs
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

function fix(text) {
  let out = String(text);
  const pairs = [
    [/à tu entraîner/gi, "à t’entraîner"],
    [/à tu souvenir/gi, "à te souvenir"],
    [/à tu sentir/gi, "à te sentir"],
    [/à tu tenir/gi, "à te tenir"],
    [/à tu rafraîchir/gi, "à te rafraîchir"],
    [/à tu protéger/gi, "à te protéger"],
    [/à tu comparer/gi, "à te comparer"],
    [/à tu et aux/gi, "à toi et aux"],
    [/à tu et\b/gi, "à toi et"],
    [/,\s*à tu\b/gi, ", à toi"],
    [/\bà tu\b/g, "à te"],
    [/\bÀ tu\b/g, "À te"],
    // object clitics before vowel-initial verbs
    [/\btu aident\b/g, "t’aident"],
    [/\btu aide\b/g, "t’aide"],
    [/\btu aimes\b/g, "t’aimes"],
    [/\btu permettent\b/g, "te permettent"],
    [/\btu permet\b/g, "te permet"],
    [/\bTu aident\b/g, "T’aident"],
    [/\bTu aide\b/g, "T’aide"],
    // cleanup double spaces / nbsp before !
    [/t’ entraîner/g, "t’entraîner"],
    [/à te  /g, "à te "],
  ];
  for (const [re, rep] of pairs) out = out.replace(re, rep);
  return out;
}

function processFile(file) {
  const raw = fs.readFileSync(file, "utf8");
  if (file.endsWith(".json")) {
    const obj = JSON.parse(raw);
    const walkNode = (n) => {
      if (typeof n === "string") return fix(n);
      if (Array.isArray(n)) return n.map(walkNode);
      if (n && typeof n === "object") {
        const o = {};
        for (const [k, v] of Object.entries(n)) o[k] = walkNode(v);
        return o;
      }
      return n;
    };
    const next = `${JSON.stringify(walkNode(obj), null, 2)}\n`;
    if (next !== raw) {
      fs.writeFileSync(file, next, "utf8");
      return true;
    }
    return false;
  }
  const next = fix(raw);
  if (next !== raw) {
    fs.writeFileSync(file, next, "utf8");
    return true;
  }
  return false;
}

const targets = [
  ...walk(path.join(ROOT, "locales/fr-FR"), (n) => n.endsWith(".json")),
  ...walk(path.join(ROOT, "content-packs/fr-FR"), (n) => n.endsWith(".json")),
  path.join(ROOT, "data/science-questions-fr-FR-overlay.js"),
  ...walk(path.join(ROOT, "data/help-center/fr-FR"), (n) => n.endsWith(".js")),
  ...walk(path.join(ROOT, "utils/learning-content-fr-FR"), (n) => n.endsWith(".js")),
  ...walk(path.join(ROOT, "docs/learning-book/fr-FR"), (n) => n.endsWith(".md")),
];

let n = 0;
for (const f of targets) if (fs.existsSync(f) && processFile(f)) n += 1;
console.log("changed", n);

// verify residual
const bad = [];
for (const f of targets) {
  if (!fs.existsSync(f)) continue;
  const t = fs.readFileSync(f, "utf8");
  if (/\bà tu\b/i.test(t) || /\btu (aide|aident|permettent|entraîner|souvenir|sentir)\b/i.test(t)) {
    bad.push(path.relative(ROOT, f));
  }
}
console.log("residual bad files", bad.length, bad.slice(0, 20));
