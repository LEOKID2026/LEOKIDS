/**
 * Fix mechanical tu/vous corruption from over-aggressive CHILD_TU_FIXES.
 * Run: node scripts/i18n/fix-fr-FR-tuvous-corruption.mjs
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

/** Fix string with surface tone. */
function fixText(text, tone) {
  let out = String(text);
  // Broken "vous" → "tu" residues
  out = out
    .replace(/\bà tu entraîner\b/gi, tone === "adult" ? "à vous entraîner" : "à t’entraîner")
    .replace(/\bà tu\b/g, tone === "adult" ? "à vous" : "à te")
    .replace(/\bÀ tu\b/g, tone === "adult" ? "À vous" : "À te")
    .replace(/\bIl tu\b/g, tone === "adult" ? "Il vous" : "Il te")
    .replace(/\bil tu\b/g, tone === "adult" ? "il vous" : "il te")
    .replace(/\bElle tu\b/g, tone === "adult" ? "Elle vous" : "Elle te")
    .replace(/\belle tu\b/g, tone === "adult" ? "elle vous" : "elle te")
    .replace(/\bpourrons tu\b/g, tone === "adult" ? "pourrons vous" : "pourrons te")
    .replace(/\bNous tu\b/g, tone === "adult" ? "Nous vous" : "Nous te")
    .replace(/\bnous tu\b/g, tone === "adult" ? "nous vous" : "nous te")
    .replace(/\bContinue à te\b/g, "Continue à t’")
    .replace(/\bcontinue à te\b/g, "continue à t’")
    .replace(/Continue à t’ entraîner/g, "Continue à t’entraîner")
    .replace(/continue à t’ entraîner/g, "continue à t’entraîner")
    .replace(/\bParent fort\b/g, "Point fort")
    .replace(/\bparent fort\b/g, "point fort")
    .replace(/Parent du message/g, "Message au parent")
    .replace(/A quoi\b/g, "À quoi")
    .replace(/a quoi\b/g, "à quoi");
  return out;
}

function transformJson(node, tone) {
  if (typeof node === "string") return fixText(node, tone);
  if (Array.isArray(node)) return node.map((x) => transformJson(x, tone));
  if (node && typeof node === "object") {
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = transformJson(v, tone);
    return out;
  }
  return node;
}

function processJson(file, tone) {
  const raw = fs.readFileSync(file, "utf8");
  const next = `${JSON.stringify(transformJson(JSON.parse(raw), tone), null, 2)}\n`;
  if (next !== raw) {
    fs.writeFileSync(file, next, "utf8");
    return true;
  }
  return false;
}

function processText(file, tone) {
  const raw = fs.readFileSync(file, "utf8");
  const next = fixText(raw, tone);
  if (next !== raw) {
    fs.writeFileSync(file, next, "utf8");
    return true;
  }
  return false;
}

let changed = 0;

// locales
for (const f of walk(path.join(ROOT, "locales/fr-FR"), (n) => n.endsWith(".json"))) {
  const base = path.basename(f);
  const tone = /^(learning|games)\.json$/.test(base)
    ? "child"
    : /^(school|teacher|reports|auth|emails|legal|platform|copilot|validation|worksheets)\.json$/.test(base)
      ? "adult"
      : "adult";
  if (processJson(f, tone)) changed += 1;
}

// packs
for (const f of walk(path.join(ROOT, "content-packs/fr-FR"), (n) => n.endsWith(".json"))) {
  const tone = /[\\/](learning|games)[\\/]/.test(f) ? "child" : /[\\/]reports[\\/]/.test(f) ? "adult" : "child";
  if (processJson(f, tone)) changed += 1;
}

// science / help / stems / books
if (processText(path.join(ROOT, "data/science-questions-fr-FR-overlay.js"), "child")) changed += 1;
for (const f of walk(path.join(ROOT, "data/help-center/fr-FR"), (n) => n.endsWith(".js"))) {
  const tone = /students\.js$/.test(f) ? "child" : "adult";
  if (processText(f, tone)) changed += 1;
}
for (const f of walk(path.join(ROOT, "utils/learning-content-fr-FR"), (n) => n.endsWith(".js"))) {
  if (processText(f, "child")) changed += 1;
}
for (const f of walk(path.join(ROOT, "docs/learning-book/fr-FR"), (n) => n.endsWith(".md"))) {
  if (processText(f, "child")) changed += 1;
}

// common.json adult consistency (parent chrome)
const commonPath = path.join(ROOT, "locales/fr-FR/common.json");
const common = JSON.parse(fs.readFileSync(commonPath, "utf8"));
common.startLearning = "Commencer à apprendre";
common.retry = "Réessayer";
common.errorGeneric = "Une erreur s’est produite. Veuillez réessayer.";
common.accessDenied = "Vous n’avez pas accès à cette page.";
fs.writeFileSync(commonPath, `${JSON.stringify(common, null, 2)}\n`, "utf8");
changed += 1;

console.log("Files changed:", changed);
