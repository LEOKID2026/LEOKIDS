/**
 * Batch migrate remaining Learning-category scanner findings to per-file content packs.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanRepository } from "./hardcoded-ui-core.mjs";
import { isAllowlistedFinding } from "../../tests/i18n/_hardcoded-ui-allowlist.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const packDir = path.join(root, "content-packs/en/learning/burn-down");

function categorizeFinding(file, text) {
  const f = file.replace(/\\/g, "/");
  if (isAllowlistedFinding(f, 0, text)) return "False positives";
  if (
    /\/dev-student-simulator\/|pages\/learning\/dev\/|pages\/learning\/dev-/.test(f) ||
    /\/mock\//.test(f) ||
    /feature-flag/.test(f)
  ) {
    return "Internal/non-user-facing";
  }
  if (/parent-report|report-generator|report-language|detailed-parent-report/.test(f)) return "Reports";
  if (/learning-book|english-page-skill/.test(f)) return "Books UI";
  if (/diagnostic-|taxonomy-|probe-map|math-animations/.test(f)) return "Learning";
  if (/pages\/learning|learning-/.test(f)) return "Learning";
  return "Other";
}

/** @param {string} rel */
function slugFromFile(rel) {
  return rel
    .replace(/\.(js|jsx|mjs|cjs)$/, "")
    .replace(/[/\\]/g, "__");
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
function importPathToHelper(relFile) {
  const depth = relFile.split(/[/\\]/).length - 1;
  return `${ "../".repeat(depth) || "./" }lib/learning/burn-down-copy.js`.replace(/\/\.\//g, "/");
}

const { findings } = scanRepository();
/** @type {Map<string, typeof findings>} */
const byFile = new Map();
for (const f of findings) {
  if (categorizeFinding(f.file, f.text) !== "Learning") continue;
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
    src = src.replace(new RegExp(`"${escaped}"`, "g"), `burnDownCopy("${slug}", "${key}")`);
  }

  if (Object.keys(copy).length) {
    fs.writeFileSync(path.join(packDir, `${slug}.json`), `${JSON.stringify({ copy }, null, 2)}\n`, "utf8");
    if (!src.includes("burnDownCopy")) {
      const importLine = `import { burnDownCopy } from "${importPathToHelper(relFile)}";\n`;
      const idx = src.search(/^import /m);
      src = idx >= 0 ? src.slice(0, idx) + importLine + src.slice(idx) : importLine + src;
    }
    fs.writeFileSync(abs, src, "utf8");
  }
}

console.log("files", byFile.size, "keys", totalKeys);
