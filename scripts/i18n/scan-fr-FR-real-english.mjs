/**
 * Scan fr-FR for real English instructional leakage (not educational targets).
 * Run: node scripts/i18n/scan-fr-FR-real-english.mjs
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

const FR_MARKERS =
  /\b(le|la|les|un|une|des|de|du|et|est|sont|nous|vous|tu|ton|ta|tes|avec|pour|dans|sur|que|qui|pas|plus|aussi|aujourd|apprendre|exercice|nombre|combien|quelle|quel|calcul|ajoute|soustrait|fraction|enfant|élève|classe|fiche|comment|dit|question|maintenant|exemple|ensuite|lorsque|parce|comme|mots|lettre|lettres)\b|[àâäéèêëïîôùûüçœæ]/i;

const EN_MARKERS =
  /\b(the|and|with|your|you|this|that|what|which|where|how|why|when|please|select|choose|click|try|again|continue|look|write|solve|practice|answer|worksheet|loading|grade|student|teacher|parent|create|open|close|save|delete|next|back|start|finish|check|print|preview|today|learning|explanation|example|together|yourself|missing|number|numbers|add|subtract|multiply|divide|fraction|perimeter|area|circle|radius)\b/i;

function isRealEnglishInstruction(line, { isEnglishSubject = false } = {}) {
  const t = String(line || "").trim();
  if (!t || t.length < 12) return false;
  if (t.startsWith("|") || t.startsWith("```") || t.startsWith("- `") || t.startsWith("`")) return false;
  if (/\*\*(learning_page_id|skill_id|subject|grade|title_english)\*\*/.test(t)) return false;
  if (/^#{1,6}\s+/.test(t)) {
    const h = t.replace(/^#{1,6}\s+/, "");
    if (isEnglishSubject && /^(I am|You are|He is|She is|We are|They are)\b/.test(h)) return false;
  }
  if (isEnglishSubject) {
    if (/^(I|You|He|She|It|We|They)\b/.test(t) && t.split(/\s+/).length <= 8) return false;
    if (/^".*"$/.test(t)) return false;
    // Keep pure English example sentences short
    if (/^[A-Z][A-Za-z' ]{0,40}[.!?]?$/.test(t) && t.split(/\s+/).length <= 6) return false;
    // French instruction wrapping a quoted English educational target
    if (/["“«][A-Za-z][^"”»]+["”»]/.test(t) && FR_MARKERS.test(t)) return false;
  }
  // Any line that is mostly French with a quoted English target is not leakage
  if (/["“«][A-Za-z][^"”»]+["”»]/.test(t) && FR_MARKERS.test(t)) return false;
  if (FR_MARKERS.test(t)) return false;
  const enHits = (t.match(new RegExp(EN_MARKERS.source, "gi")) || []).length;
  const words = t.split(/\s+/).filter(Boolean);
  if (enHits >= 3 && words.length >= 5) return true;
  if (/^(Today we|What are we|Simple explanation|Let's |Try it yourself|How many|What is the|Fill in|Choose the|Select the|Click |Write the|Solve\.|Practice with)/i.test(t)) {
    return true;
  }
  // ASCII-only long sentence with many EN markers
  if (/^[A-Za-z0-9 ,.'’"\-?!/:;()]+$/.test(t) && enHits >= 2 && words.length >= 6) return true;
  return false;
}

const findings = [];

// books
for (const f of walk(path.join(ROOT, "docs/learning-book/fr-FR"), (n) => n.endsWith(".md"))) {
  const rel = path.relative(path.join(ROOT, "docs/learning-book/fr-FR"), f).replace(/\\/g, "/");
  const isEnglishSubject = rel.startsWith("english/");
  const lines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  lines.forEach((line, i) => {
    if (isRealEnglishInstruction(line, { isEnglishSubject })) {
      findings.push({ kind: "book", file: rel, line: i + 1, text: line.trim().slice(0, 160) });
    }
  });
}

// locales
for (const f of walk(path.join(ROOT, "locales/fr-FR"), (n) => n.endsWith(".json"))) {
  const obj = JSON.parse(fs.readFileSync(f, "utf8"));
  const scan = (o, p) => {
    if (typeof o === "string") {
      if (isRealEnglishInstruction(o)) findings.push({ kind: "locale", file: path.basename(f), path: p, text: o.slice(0, 160) });
    } else if (Array.isArray(o)) o.forEach((x, i) => scan(x, `${p}[${i}]`));
    else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) scan(v, `${p}.${k}`);
  };
  scan(obj, "");
}

// packs — skip english-page-skills educational targets file body carefully
for (const f of walk(path.join(ROOT, "content-packs/fr-FR"), (n) => n.endsWith(".json"))) {
  const rel = path.relative(path.join(ROOT, "content-packs/fr-FR"), f).replace(/\\/g, "/");
  const isEnglishSkills = /english-page-skills\.json$/i.test(rel);
  const obj = JSON.parse(fs.readFileSync(f, "utf8"));
  const scan = (o, p) => {
    if (typeof o === "string") {
      // English educational skill descriptions/examples stay English
      if (isEnglishSkills) return;
      if (isRealEnglishInstruction(o)) findings.push({ kind: "pack", file: rel, path: p, text: o.slice(0, 160) });
    } else if (Array.isArray(o)) o.forEach((x, i) => scan(x, `${p}[${i}]`));
    else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) scan(v, `${p}.${k}`);
  };
  scan(obj, "");
}

// science stems/explanations/options with multiword EN
const sci = fs.readFileSync(path.join(ROOT, "data/science-questions-fr-FR-overlay.js"), "utf8");
// lightweight: find quoted strings that look English instructional
for (const m of sci.matchAll(/"([^"\n]{20,200})"/g)) {
  if (isRealEnglishInstruction(m[1])) findings.push({ kind: "science", text: m[1].slice(0, 160) });
}

const out = {
  total: findings.length,
  byKind: findings.reduce((a, f) => ((a[f.kind] = (a[f.kind] || 0) + 1), a), {}),
  samples: findings.slice(0, 80),
};
fs.writeFileSync(path.join(__dirname, "_fr-FR-real-english.json"), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
