/**
 * Batch migrate Reports-category scanner findings to content packs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanRepository, scanSource } from "./hardcoded-ui-core.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packDir = path.join(root, "content-packs/en/reports/burn-down");
const indexPath = path.join(root, "content-packs/en/reports/burn-down-index.json");

function isReportFile(file) {
  const f = file.replace(/\\/g, "/");
  return /parent-report|report-generator|report-language|detailed-parent-report|parent-report-ui-explain/.test(f);
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
    out = out.replace(new RegExp(`>\\s*${escaped}\\s*<`, "g"), `>{reportPackCopy("${slug}", "${key}")}<`);
  }
  return out;
}

const { findings } = scanRepository();
/** @type {Map<string, typeof findings>} */
const byFile = new Map();
for (const f of findings) {
  if (!isReportFile(f.file)) continue;
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}

fs.mkdirSync(packDir, { recursive: true });

/** @type {Record<string, Record<string, string>>} */
const index = {};
let totalKeys = 0;

for (const [relFile, hits] of byFile.entries()) {
  const abs = path.join(root, relFile);
  if (!fs.existsSync(abs)) continue;
  let src = fs.readFileSync(abs, "utf8");
  const slug = slugFromFile(relFile);
  /** @type {Record<string, string>} */
  const copy = {};
  /** @type {Record<string, string>} */
  const textToKey = {};

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
    src = src.replace(new RegExp(`"${escaped}"`, "g"), `reportPackCopy("${slug}", "${key}")`);
  }

  if (/\.jsx$/.test(relFile)) {
    src = jsxTextReplacements(src, slug, copy, textToKey);
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
    const remaining = scanSource(relFile, src).filter((h) => isReportFile(relFile)).length;
    console.log(relFile, Object.keys(copy).length, "remaining", remaining);
  }
}

fs.writeFileSync(indexPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
console.log("total keys", totalKeys, "files", Object.keys(index).length);
