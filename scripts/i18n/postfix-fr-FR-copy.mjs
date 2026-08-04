/**
 * Post-pass France French consistency fixes on generated fr-FR content.
 * JSON/JS: transform string VALUES only (never keys / placeholders names).
 *
 * Run: node scripts/i18n/postfix-fr-FR-copy.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { POST_PHRASE_FIXES, applySurfaceTone } from "./_fr-FR-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

function walk(dir, pred, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, pred, files);
    else if (pred(ent.name, p)) files.push(p);
  }
  return files;
}

function fixString(text, tone) {
  let out = String(text);
  // Protect placeholders
  /** @type {string[]} */
  const ph = [];
  out = out.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, name) => {
    ph.push(name);
    return `⟦${ph.length - 1}⟧`;
  });
  for (const [re, rep] of POST_PHRASE_FIXES) out = out.replace(re, rep);
  if (tone) out = applySurfaceTone(out, tone);
  out = out
    .replace(/Leo Enfants/g, "Leo Kids")
    .replace(/Enfants Lion/g, "Leo Kids")
    .replace(/Lion Kids/g, "Leo Kids")
    .replace(/\bLe Lion\b/g, "Leo")
    .replace(/feuille de calcul/gi, "fiche d’exercices")
    .replace(/feuilles de calcul/gi, "fiches d’exercices")
    .replace(/Mathématiques(?:ématiques)+/g, "Mathématiques")
    .replace(/pour ton commodité/gi, "pour ta commodité")
    .replace(/payez-tu/g, "paies-tu")
    .replace(/ajoutez-tu/g, "ajoutes-tu")
    .replace(/Maison(?=\s*")/g, "Accueil"); // only if leftover — handled carefully below
  out = out.replace(/⟦\s*(\d+)\s*⟧/g, (_, i) => `{${ph[Number(i)]}}`);
  return out;
}

function transformJson(node, tone) {
  if (typeof node === "string") return fixString(node, tone);
  if (Array.isArray(node)) return node.map((x) => transformJson(x, tone));
  if (node && typeof node === "object") {
    /** @type {Record<string, unknown>} */
    const out = {};
    for (const [k, v] of Object.entries(node)) out[k] = transformJson(v, tone);
    return out;
  }
  return node;
}

function transformJsExportObject(file, tone) {
  // Only safe for JSON.stringify-emitted modules (help/science overlays)
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(/export const ([A-Z0-9_]+) = (\{[\s\S]*\});\s*$/);
  if (!m) {
    // Fallback: value-only phrase fixes with placeholder protection on whole file is unsafe for code.
    // Apply only known safe global replacements on string literals via conservative pass.
    let out = raw;
    out = out
      .replace(/Mathématiques(?:ématiques)+/g, "Mathématiques")
      .replace(/Leo Enfants/g, "Leo Kids")
      .replace(/Enfants Lion/g, "Leo Kids")
      .replace(/feuille de calcul/gi, "fiche d’exercices")
      .replace(/feuilles de calcul/gi, "fiches d’exercices")
      .replace(/(?<![A-Za-zÀ-ÖØ-öø-ÿ])étudiant(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "élève")
      .replace(/(?<![A-Za-zÀ-ÖØ-öø-ÿ])étudiants(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "élèves")
      .replace(/(?<![A-Za-zÀ-ÖØ-öø-ÿ])Étudiant(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "Élève")
      .replace(/(?<![A-Za-zÀ-ÖØ-öø-ÿ])Étudiants(?![A-Za-zÀ-ÖØ-öø-ÿ])/g, "Élèves");
    if (out !== raw) fs.writeFileSync(file, out, "utf8");
    return out !== raw;
  }
  const name = m[1];
  const obj = JSON.parse(m[2]);
  const next = transformJson(obj, tone);
  const body = `/** Auto-generated fr-FR — postfixed. */\nexport const ${name} = ${JSON.stringify(next, null, 2)};\n`;
  // Preserve original header-ish for help index etc. — only rewrite pure export modules
  if (raw.startsWith("import ")) return false;
  fs.writeFileSync(file, body, "utf8");
  return true;
}

function processJsonFile(file, tone) {
  const raw = fs.readFileSync(file, "utf8");
  const obj = JSON.parse(raw);
  const next = transformJson(obj, tone);
  const out = `${JSON.stringify(next, null, 2)}\n`;
  if (out !== raw) {
    fs.writeFileSync(file, out, "utf8");
    return true;
  }
  return false;
}

function processMdFile(file, tone) {
  const raw = fs.readFileSync(file, "utf8");
  const next = fixString(raw, tone);
  if (next !== raw) {
    fs.writeFileSync(file, next, "utf8");
    return true;
  }
  return false;
}

function main() {
  let changed = 0;
  for (const f of walk(path.join(ROOT, "locales/fr-FR"), (n) => n.endsWith(".json"))) {
    const tone = /learning|games|worksheets/.test(path.basename(f))
      ? "child"
      : /school|teacher|reports|auth|emails|legal|platform|copilot|validation/.test(path.basename(f))
        ? "adult"
        : null;
    if (processJsonFile(f, tone)) changed += 1;
  }
  for (const f of walk(path.join(ROOT, "content-packs/fr-FR"), (n) => n.endsWith(".json"))) {
    const tone = /[\\/](learning|games)[\\/]/.test(f)
      ? "child"
      : /[\\/]reports[\\/]/.test(f)
        ? "adult"
        : null;
    if (processJsonFile(f, tone)) changed += 1;
  }
  for (const f of walk(path.join(ROOT, "docs/learning-book/fr-FR"), (n) => n.endsWith(".md"))) {
    if (processMdFile(f, "child")) changed += 1;
  }
  for (const f of [
    path.join(ROOT, "data/science-questions-fr-FR-overlay.js"),
    path.join(ROOT, "utils/learning-content-fr-FR/math.js"),
    path.join(ROOT, "utils/learning-content-fr-FR/geometry.js"),
  ]) {
    if (fs.existsSync(f) && transformJsExportObject(f, "child")) changed += 1;
  }
  for (const f of walk(path.join(ROOT, "data/help-center/fr-FR"), (n) => n.endsWith(".js"))) {
    if (path.basename(f) === "index.js") continue;
    const tone = /students\.js$/.test(f) ? "child" : "adult";
    if (transformJsExportObject(f, tone)) changed += 1;
  }
  console.log("Postfix files changed:", changed);
}

main();
