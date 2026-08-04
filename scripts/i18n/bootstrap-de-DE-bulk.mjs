/**
 * Bootstrap remaining de-DE bulk content from English authority.
 * Local curated translation only — no external MT, no API agents.
 *
 * Usage:
 *   node scripts/i18n/bootstrap-de-DE-bulk.mjs --all
 *   node scripts/i18n/bootstrap-de-DE-bulk.mjs --science
 *   node scripts/i18n/bootstrap-de-DE-bulk.mjs --packs
 *   node scripts/i18n/bootstrap-de-DE-bulk.mjs --books
 *   node scripts/i18n/bootstrap-de-DE-bulk.mjs --science --authored-only
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { transformNode, translateEnToDeDe, looksNonTranslate } from "./_de-DE-edu-translate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_de-DE-authored-cache.json");
const AUTHORED_DIR = path.join(__dirname, "_de-DE-science-authored");

const args = new Set(process.argv.slice(2));
const DO_ALL = args.has("--all");
const DO_SCIENCE = DO_ALL || args.has("--science");
const DO_PACKS = DO_ALL || args.has("--packs");
const DO_BOOKS = DO_ALL || args.has("--books");
const AUTHORED_ONLY = args.has("--authored-only");

const DOMAINS = [
  "learning",
  "reports",
  "games",
  "books",
  "rewards",
  "global-burn-down",
  "demo",
];

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), "utf8");
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function walkFiles(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, pred, out);
    else if (pred(ent.name)) out.push(p);
  }
  return out;
}

function loadAuthoredScience() {
  /** @type {Record<string, unknown>} */
  const out = {};
  if (!fs.existsSync(AUTHORED_DIR)) return out;
  for (const f of fs.readdirSync(AUTHORED_DIR).filter((x) => x.endsWith(".json"))) {
    const chunk = JSON.parse(fs.readFileSync(path.join(AUTHORED_DIR, f), "utf8"));
    Object.assign(out, chunk);
  }
  return out;
}

async function generateScience(cache) {
  const mod = await import(
    pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href
  );
  const src = mod.SCIENCE_EN_OVERLAY;
  const authored = loadAuthoredScience();
  /** @type {Record<string, unknown>} */
  const out = {};
  let authoredCount = 0;
  let fallbackCount = 0;

  for (const id of Object.keys(src)) {
    if (authored[id]) {
      out[id] = authored[id];
      authoredCount++;
      continue;
    }
    if (AUTHORED_ONLY) {
      // Keep English temporarily so ID parity exists; flagged in report via fallbackCount
      out[id] = src[id];
      fallbackCount++;
      continue;
    }
    out[id] = transformNode(src[id], { cache });
    fallbackCount++;
  }

  const body = `/** German (Germany) (de-DE) display overlay for science questions. */\nexport const SCIENCE_DE_DE_OVERLAY = ${JSON.stringify(
    out,
    null,
    2,
  )};\n`;
  const outPath = path.join(ROOT, "data/science-questions-de-DE-overlay.js");
  fs.writeFileSync(outPath, body, "utf8");
  console.log(
    `[science] wrote ${Object.keys(out).length} ids (authored=${authoredCount}, transformed=${fallbackCount}) → ${outPath}`,
  );
}

function generatePacks(cache) {
  const srcRoot = path.join(ROOT, "content-packs", "en");
  const outRoot = path.join(ROOT, "content-packs", "de-DE");
  let files = 0;
  for (const d of DOMAINS) {
    const domainFiles = walkFiles(path.join(srcRoot, d), (n) => n.endsWith(".json"));
    for (const file of domainFiles) {
      const rel = path.relative(srcRoot, file);
      const outFile = path.join(outRoot, rel);
      ensureDir(path.dirname(outFile));
      const raw = JSON.parse(fs.readFileSync(file, "utf8"));
      const translated = transformNode(raw, { cache });
      fs.writeFileSync(outFile, `${JSON.stringify(translated, null, 2)}\n`, "utf8");
      files++;
    }
  }
  // Also copy burn-down indexes / any root json under domains already covered
  console.log(`[packs] wrote ${files} files → ${outRoot}`);
}

function translateMarkdown(md, cache, { protectEnglishTargets = false } = {}) {
  const fm = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fm) {
    return md
      .split(/\r?\n/)
      .map((line) => translateLine(line, cache, protectEnglishTargets))
      .join("\n");
  }
  const yaml = fm[1]
    .split(/\r?\n/)
    .map((line) => {
      const m = line.match(/^(\s*[A-Za-z0-9_-]+:\s*)(.*)$/);
      if (!m) return line;
      const [, keyPart, val] = m;
      const key = keyPart.replace(/:$/, "").trim();
      // Preserve structural ids / paths
      if (
        /^(learning_page_id|skill_id|subject|grade|age_band|page_type|approval_status|title_english)$/i.test(
          key,
        )
      ) {
        return line;
      }
      if (!val || looksNonTranslate(val)) return line;
      // quoted values
      const q = val.match(/^"(.*)"$/);
      if (q) {
        return `${keyPart}"${translateEnToDeDe(q[1], { cache, protectEnglishTargets })}"`;
      }
      return `${keyPart}${translateEnToDeDe(val, { cache, protectEnglishTargets })}`;
    })
    .join("\n");

  const body = fm[2]
    .split(/\r?\n/)
    .map((line) => translateLine(line, cache, protectEnglishTargets))
    .join("\n");
  return `---\n${yaml}\n---\n${body}`;
}

function translateLine(line, cache, protectEnglishTargets) {
  const s = String(line);
  if (!s.trim()) return s;
  // Keep markdown tables structure for metadata rows with backticks/ids
  if (/^\|/.test(s) && /`/.test(s)) {
    // Translate only non-backtick cell labels like Field/Value headers
    return s
      .replace(/\bField\b/g, "Feld")
      .replace(/\bValue\b/g, "Wert")
      .replace(/\bMetadata\b/g, "Metadaten")
      .replace(/\bSource references\b/gi, "Quellenverweise")
      .replace(/\bContent scope\b/gi, "Inhaltsumfang");
  }
  if (/^```/.test(s)) return s;
  if (/^\s*[-*]\s*`/.test(s)) return s; // path/ref bullets
  if (/^\s*#{1,6}\s+/.test(s)) {
    const m = s.match(/^(#{1,6}\s+)(.*)$/);
    if (!m) return s;
    return m[1] + translateEnToDeDe(m[2], { cache, protectEnglishTargets });
  }
  // Section titles commonly used in learning books
  const sectionMap = {
    "What are we learning?": "Was lernen wir?",
    "Simple explanation": "Einfache Erklärung",
    "Visual / concrete example": "Anschauliches / konkretes Beispiel",
    "Let's solve together": "Lass uns gemeinsam lösen",
    "Try it yourself": "Probiere es selbst",
    "Common mistake — watch out!": "Häufiger Fehler — Achtung!",
    "Common mistake - watch out!": "Häufiger Fehler — Achtung!",
    Example: "Beispiel",
    Practice: "Übung",
    Remember: "Merke dir",
  };
  for (const [en, de] of Object.entries(sectionMap)) {
    if (s.includes(en)) return s.split(en).join(de);
  }
  if (!/[A-Za-z]/.test(s)) return s;
  return translateEnToDeDe(s, { cache, protectEnglishTargets });
}

function generateBooks(cache) {
  const srcRoot = path.join(ROOT, "docs/learning-book/en");
  const outRoot = path.join(ROOT, "docs/learning-book/de-DE");
  const files = walkFiles(srcRoot, (n) => n.endsWith(".md"));
  let n = 0;
  for (const file of files) {
    const rel = path.relative(srcRoot, file);
    const outFile = path.join(outRoot, rel);
    ensureDir(path.dirname(outFile));
    const md = fs.readFileSync(file, "utf8");
    const protectEnglishTargets = /(^|[\\/])english([\\/]|$)/i.test(rel);
    const out = translateMarkdown(md, cache, { protectEnglishTargets });
    fs.writeFileSync(outFile, out.endsWith("\n") ? out : `${out}\n`, "utf8");
    n++;
  }
  console.log(`[books] wrote ${n} files → ${outRoot}`);
}

async function main() {
  if (!DO_SCIENCE && !DO_PACKS && !DO_BOOKS) {
    console.log("Specify --all, --science, --packs, and/or --books");
    process.exit(1);
  }
  const cache = loadCache();
  if (DO_SCIENCE) await generateScience(cache);
  if (DO_PACKS) generatePacks(cache);
  if (DO_BOOKS) generateBooks(cache);
  saveCache(cache);
  console.log("Done. Cache size:", Object.keys(cache).length);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
