/**
 * Batch migrate game-category scanner findings to content packs.
 *
 * Usage:
 *   node scripts/i18n/batch-migrate-games-burn-down.mjs
 *   node scripts/i18n/batch-migrate-games-burn-down.mjs --category "Educational games"
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanRepository, scanSource } from "./hardcoded-ui-core.mjs";
import { isAllowlistedFinding } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packDir = path.join(root, "content-packs/en/games/burn-down");
const indexPath = path.join(root, "content-packs/en/games/burn-down-index.json");

const GAME_CATEGORIES = new Set([
  "Educational games",
  "Solo games",
  "Arcade games",
  "Offline games",
]);

const categoryArgIdx = process.argv.indexOf("--category");
const categoryFilter =
  categoryArgIdx >= 0 ? process.argv[categoryArgIdx + 1] : null;

if (categoryFilter && !GAME_CATEGORIES.has(categoryFilter)) {
  console.error(`Unknown category: ${categoryFilter}`);
  console.error(`Expected one of: ${[...GAME_CATEGORIES].join(", ")}`);
  process.exit(1);
}

/**
 * @param {string} file
 * @param {string} text
 */
function categorizeFinding(file, text) {
  const f = file.replace(/\\/g, "/");

  if (isAllowlistedFinding(f, 0, text)) return "False positives";

  if (/educational-games|leo-lab|leo-pizzeria|leo-word/.test(f)) return "Educational games";
  if (/solo-games|solo-game/.test(f)) return "Solo games";
  if (/arcade|word-games\/engines/.test(f)) return "Arcade games";
  if (/\/offline\/|offline-games/.test(f)) return "Offline games";

  return "Other";
}

/** @param {string} rel */
function slugFromFile(rel) {
  return rel.replace(/\.(js|jsx|mjs|cjs)$/, "").replace(/[/\\]/g, "__");
}

/** @param {string} text */
function slugKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 72);
}

/** @param {string} relFile */
function importPath(relFile) {
  const depth = relFile.split(/[/\\]/).length - 1;
  return `${ "../".repeat(depth) }lib/games/game-pack-copy.js`.replace(/\\/g, "/");
}

/** @param {string} src */
function jsxTextReplacements(src, slug, copy, textToKey) {
  let out = src;
  const jsxRe = />\s*([A-Za-z][^<{]{2,}?)\s*</g;
  const matches = [];
  let m;
  while ((m = jsxRe.exec(src))) {
    const text = m[1].trim();
    if (text.length < 4 || text.includes("{")) continue;
    matches.push(text);
  }
  for (const text of [...new Set(matches)].sort((a, b) => b.length - a.length)) {
    if (!textToKey[text]) {
      let key = slugKey(text) || `jsx_${Object.keys(copy).length + 1}`;
      let unique = key;
      let n = 2;
      while (copy[unique] && copy[unique] !== text) unique = `${key}_${n++}`;
      textToKey[text] = unique;
      copy[unique] = text;
    }
    const key = textToKey[text];
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`>\\s*${escaped}\\s*<`, "g"), `>{gamePackCopy("${slug}", "${key}")}<`);
  }
  return out;
}

/** @type {Record<string, Record<string, string>>} */
let index = {};
if (fs.existsSync(indexPath)) {
  index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
}

const { findings } = scanRepository();
/** @type {Map<string, typeof findings>} */
const byFile = new Map();
for (const f of findings) {
  const cat = categorizeFinding(f.file, f.text);
  if (!GAME_CATEGORIES.has(cat)) continue;
  if (categoryFilter && cat !== categoryFilter) continue;
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}

fs.mkdirSync(packDir, { recursive: true });

let totalKeys = 0;

for (const [relFile, hits] of byFile.entries()) {
  const abs = path.join(root, relFile);
  if (!fs.existsSync(abs)) continue;
  let src = fs.readFileSync(abs, "utf8");
  const slug = slugFromFile(relFile);
  /** @type {Record<string, string>} */
  const copy = { ...(index[slug] || {}) };
  /** @type {Record<string, string>} */
  const textToKey = {};
  for (const [key, val] of Object.entries(copy)) {
    textToKey[val] = key;
  }

  for (const hit of hits) {
    if (!textToKey[hit.text]) {
      let key = slugKey(hit.text) || `k_${Object.keys(copy).length + 1}`;
      let unique = key;
      let n = 2;
      while (copy[unique] && copy[unique] !== hit.text) unique = `${key}_${n++}`;
      textToKey[hit.text] = unique;
      copy[unique] = hit.text;
      totalKeys += 1;
    }
  }

  for (const text of Object.keys(textToKey).sort((a, b) => b.length - a.length)) {
    const key = textToKey[text];
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    src = src.replace(new RegExp(`"${escaped}"`, "g"), `gamePackCopy("${slug}", "${key}")`);
  }

  // JSX `>text<` replacement breaks arrow handlers and comparisons — string literals only.
  void jsxTextReplacements;

  if (Object.keys(copy).length) {
    fs.writeFileSync(path.join(packDir, `${slug}.json`), `${JSON.stringify({ copy }, null, 2)}\n`, "utf8");
    index[slug] = copy;
    if (!/import\s+\{[^}]*\bgamePackCopy\b/.test(src)) {
      const importLine = `import { gamePackCopy } from "${importPath(relFile)}";\n`;
      const idx = src.search(/^import /m);
      src = idx >= 0 ? src.slice(0, idx) + importLine + src.slice(idx) : importLine + src;
    }
    fs.writeFileSync(abs, src, "utf8");
    const remaining = scanSource(relFile, src).filter(
      (h) => GAME_CATEGORIES.has(categorizeFinding(relFile, h.text))
    ).length;
    console.log(relFile, Object.keys(copy).length, "remaining", remaining);
  }
}

fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
console.log(
  "total keys",
  totalKeys,
  "files",
  Object.keys(index).length,
  categoryFilter ? `category=${categoryFilter}` : "all game categories"
);
