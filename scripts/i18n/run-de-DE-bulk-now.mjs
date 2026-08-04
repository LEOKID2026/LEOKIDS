/**
 * One-shot local bulk generator for remaining de-DE surfaces.
 * No external MT. No API agents.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transformNode } from "./_de-DE-edu-translate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_de-DE-authored-cache.json");
const AUTHORED_DIR = path.join(__dirname, "_de-DE-science-authored");

const DOMAINS = [
  "learning",
  "reports",
  "games",
  "books",
  "rewards",
  "global-burn-down",
  "demo",
];

const SECTION_MAP = {
  "What are we learning?": "Was lernen wir?",
  "Simple explanation": "Einfache Erklärung",
  "Visual / concrete example": "Anschauliches / konkretes Beispiel",
  "Let's solve together": "Lass uns gemeinsam lösen",
  "Try it yourself": "Probiere es selbst",
  "Common mistake — watch out!": "Häufiger Fehler — Achtung!",
  "Common mistake - watch out!": "Häufiger Fehler — Achtung!",
  Metadata: "Metadaten",
  "Source references:": "Quellenverweise:",
  "Content scope:": "Inhaltsumfang:",
  Field: "Feld",
  Value: "Wert",
  Example: "Beispiel",
  Remember: "Merke dir",
};

function walkFiles(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, pred, out);
    else if (pred(ent.name)) out.push(p);
  }
  return out;
}

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
}

function translateBook(md, cache, protectEnglishTargets) {
  let out = md;
  for (const [en, de] of Object.entries(SECTION_MAP)) out = out.split(en).join(de);
  out = out.replace(/\bGrade ([1-6])\b/g, "$1. Klasse");
  out = out.replace(/\bdollars?\b/gi, "Euro");
  out = out.replace(/\bWorksheets\b/g, "Arbeitsblätter");
  out = out.replace(/\bWorksheet\b/g, "Arbeitsblatt");
  out = out.replace(/\bworksheets\b/g, "Arbeitsblätter");
  out = out.replace(/\bworksheet\b/g, "Arbeitsblatt");
  out = out
    .split(/\r?\n/)
    .map((line) => {
      if (!line.trim()) return line;
      if (protectEnglishTargets) {
        const t = line.trim();
        if (/^[a-z]+(?:_[a-z]+)*$/i.test(t) && t.length <= 24) return line;
      }
      const trimmed = line.trim();
      if (cache[trimmed]) {
        const indent = line.match(/^(\s*)/)[1];
        return indent + cache[trimmed];
      }
      return line;
    })
    .join("\n");
  return out.endsWith("\n") ? out : `${out}\n`;
}

function generatePacks(cache) {
  const srcRoot = path.join(ROOT, "content-packs", "en");
  const outRoot = path.join(ROOT, "content-packs", "de-DE");
  let files = 0;
  for (const d of DOMAINS) {
    for (const file of walkFiles(path.join(srcRoot, d), (n) => n.endsWith(".json"))) {
      const rel = path.relative(srcRoot, file);
      const outFile = path.join(outRoot, rel);
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      const raw = JSON.parse(fs.readFileSync(file, "utf8"));
      const translated = transformNode(raw, { cache });
      fs.writeFileSync(outFile, `${JSON.stringify(translated, null, 2)}\n`, "utf8");
      files++;
    }
  }
  console.log(`[packs] ${files}`);
}

function generateBooks(cache) {
  const srcRoot = path.join(ROOT, "docs/learning-book/en");
  const outRoot = path.join(ROOT, "docs/learning-book/de-DE");
  const files = walkFiles(srcRoot, (n) => n.endsWith(".md"));
  for (const file of files) {
    const rel = path.relative(srcRoot, file);
    const outFile = path.join(outRoot, rel);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    const protect = /(^|[\\/])english([\\/]|$)/i.test(rel);
    const md = fs.readFileSync(file, "utf8");
    fs.writeFileSync(outFile, translateBook(md, cache, protect), "utf8");
  }
  console.log(`[books] ${files.length}`);
}

async function generateScience() {
  const mod = await import(
    pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href
  );
  const src = mod.SCIENCE_EN_OVERLAY;
  /** @type {Record<string, unknown>} */
  const authored = {};
  if (fs.existsSync(AUTHORED_DIR)) {
    for (const f of fs.readdirSync(AUTHORED_DIR).filter((x) => x.endsWith(".json"))) {
      Object.assign(authored, JSON.parse(fs.readFileSync(path.join(AUTHORED_DIR, f), "utf8")));
    }
  }
  /** @type {Record<string, unknown>} */
  const out = {};
  let authoredCount = 0;
  let fallbackCount = 0;
  for (const id of Object.keys(src)) {
    if (authored[id]) {
      out[id] = authored[id];
      authoredCount++;
    } else {
      // Keep English authority text until human-authored German is supplied for this ID.
      out[id] = src[id];
      fallbackCount++;
    }
  }
  const body = `/** German (Germany) (de-DE) display overlay for science questions.
 * Fully authored German where present under scripts/i18n/_de-DE-science-authored/.
 * Remaining IDs temporarily keep English authority text for ID/option-order parity
 * until the human finish pass completes (no blind MT).
 */
export const SCIENCE_DE_DE_OVERLAY = ${JSON.stringify(out, null, 2)};
`;
  fs.writeFileSync(path.join(ROOT, "data/science-questions-de-DE-overlay.js"), body, "utf8");
  console.log(`[science] total=${Object.keys(out).length} authored=${authoredCount} en-fallback=${fallbackCount}`);
}

const cache = loadCache();
generatePacks(cache);
generateBooks(cache);
await generateScience();
console.log("done");
