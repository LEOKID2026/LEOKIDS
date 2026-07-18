/**
 * Safe report migration for JSX files — string literals and JSX attributes only (no >text< heuristic).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanSource } from "./hardcoded-ui-core.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const files = process.argv.slice(2);
if (!files.length) {
  console.error("Usage: migrate-report-jsx-safe.mjs <file...>");
  process.exit(1);
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
  return `${ "../".repeat(depth) }lib/reports/report-pack-copy.js`.replace(/\\/g, "/");
}

const packDir = path.join(root, "content-packs/en/reports/burn-down");
const indexPath = path.join(root, "content-packs/en/reports/burn-down-index.json");
/** @type {Record<string, Record<string, string>>} */
const index = fs.existsSync(indexPath)
  ? JSON.parse(fs.readFileSync(indexPath, "utf8"))
  : {};

for (const relFile of files) {
  const abs = path.join(root, relFile);
  let src = fs.readFileSync(abs, "utf8");
  const slug = slugFromFile(relFile);
  /** @type {Record<string, string>} */
  const copy = { ...(index[slug] || {}) };
  /** @type {Record<string, string>} */
  const textToKey = {};

  for (const hit of scanSource(relFile, src)) {
    if (!textToKey[hit.text]) {
      let key = slugKey(hit.text) || `k_${Object.keys(copy).length + 1}`;
      let unique = key;
      let n = 2;
      while (copy[unique] && copy[unique] !== hit.text) unique = `${key}_${n++}`;
      textToKey[hit.text] = unique;
      copy[unique] = hit.text;
    }
  }

  for (const text of Object.keys(textToKey).sort((a, b) => b.length - a.length)) {
    const key = textToKey[text];
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    src = src.replace(new RegExp(`"${escaped}"`, "g"), `reportPackCopy("${slug}", "${key}")`);
    src = src.replace(
      new RegExp(`(\\b(?:title|aria-label|message|placeholder|alt|customRangeLabel|name))="${escaped}"`, "g"),
      `$1={reportPackCopy("${slug}", "${key}")}`
    );
    src = src.replace(new RegExp(`>\\s*${escaped}\\s*<`, "g"), `>{reportPackCopy("${slug}", "${key}")}<`);
  }

  if (Object.keys(copy).length) {
    fs.writeFileSync(path.join(packDir, `${slug}.json`), `${JSON.stringify({ copy }, null, 2)}\n`, "utf8");
    index[slug] = copy;
    if (!src.includes("reportPackCopy")) {
      const importLine = `import { reportPackCopy } from "${importPath(relFile)}";\n`;
      const idx = src.search(/^import /m);
      src = idx >= 0 ? src.slice(0, idx) + importLine + src.slice(idx) : importLine + src;
    }
    fs.writeFileSync(abs, src, "utf8");
    console.log(relFile, "remaining", scanSource(relFile, src).length);
  }
}

fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
