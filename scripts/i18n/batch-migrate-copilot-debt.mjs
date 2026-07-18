/**
 * Batch migrate Copilot owner debt to locales/en/copilot.json + explanationCode blocks.
 *
 * Usage: node scripts/i18n/batch-migrate-copilot-debt.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { classifyGlobalDebtOwner } from "./global-debt-inventory.mjs";
import { classifyFindingKind } from "./finding-classification.mjs";
import { scanRepository, scanSource } from "./hardcoded-ui-core.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const copilotLocalePath = path.join(root, "locales/en/copilot.json");
const helperImport = "lib/parent-copilot/copilot-static-message.js";
const helperFn = "copilotStaticMessage";

/** @param {string} rel */
function slugFromFile(rel) {
  return rel
    .replace(/\.(js|jsx|mjs|cjs)$/, "")
    .replace(/^utils__parent-copilot__/, "")
    .replace(/^lib__parent-copilot__/, "")
    .replace(/[/\\]/g, "_")
    .slice(0, 48);
}

/** @param {string} text */
function slugKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

/** @param {string} relFile */
function importPath(relFile) {
  const depth = relFile.split(/[/\\]/).length - 1;
  return `${ "../".repeat(depth) || "./" }${helperImport}`.replace(/\/\.\//g, "/");
}

/** @type {Record<string, unknown>} */
let copilotLocale = JSON.parse(fs.readFileSync(copilotLocalePath, "utf8"));
if (!copilotLocale.answers || typeof copilotLocale.answers !== "object") {
  copilotLocale.answers = {};
}

const { findings } = scanRepository();
/** @type {Map<string, typeof findings>} */
const byFile = new Map();

for (const f of findings) {
  const kind = classifyFindingKind(f.file, f.text, f.line);
  const { owner, countsAsDebt } = classifyGlobalDebtOwner(f.file, f.text, f.line, kind);
  if (!countsAsDebt || owner !== "waveFCopilot") continue;
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}

/** @type {Record<string, string>} */
const allKeys = {};
let totalKeys = 0;

for (const [relFile, hits] of byFile.entries()) {
  const abs = path.join(root, relFile);
  if (!fs.existsSync(abs)) continue;
  let src = fs.readFileSync(abs, "utf8");
  const fileSlug = slugFromFile(slugFromFile(relFile));
  /** @type {Record<string, string>} */
  const textToCode = {};

  for (const hit of hits) {
    if (textToCode[hit.text]) continue;
    let key = slugKey(hit.text) || `msg_${Object.keys(allKeys).length + 1}`;
    let code = `copilot.answers.${fileSlug}.${key}`;
    let n = 2;
    while (allKeys[code] && allKeys[code] !== hit.text) {
      code = `copilot.answers.${fileSlug}.${key}_${n++}`;
    }
    textToCode[hit.text] = code;
    allKeys[code] = hit.text;
    totalKeys += 1;
  }

  for (const text of Object.keys(textToCode).sort((a, b) => b.length - a.length)) {
    const code = textToCode[text];
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const msgCall = `${helperFn}("${code}")`;
    src = src.replace(new RegExp(`textHe:\\s*"${escaped}"`, "g"), `explanationCode: "${code}"`);
    src = src.replace(new RegExp(`textHe:\\s*'${escaped}'`, "g"), `explanationCode: "${code}"`);
    src = src.replace(new RegExp(`"${escaped}"`, "g"), msgCall);
    src = src.replace(new RegExp(`'${escaped}'`, "g"), msgCall);
  }

  if (Object.keys(textToCode).length) {
    const importRe = new RegExp(`import\\s+\\{[^}]*\\b${helperFn}\\b`);
    if (!importRe.test(src)) {
      const importLine = `import { ${helperFn} } from "${importPath(relFile)}";\n`;
      const idx = src.search(/^import /m);
      src = idx >= 0 ? src.slice(0, idx) + importLine + src.slice(idx) : importLine + src;
    }
    fs.writeFileSync(abs, src, "utf8");
    const remaining = scanSource(relFile, src).filter((h) => {
      const kind = classifyFindingKind(relFile, h.text, h.line);
      const { owner, countsAsDebt } = classifyGlobalDebtOwner(relFile, h.text, h.line, kind);
      return countsAsDebt && owner === "waveFCopilot";
    }).length;
    console.log(relFile, Object.keys(textToCode).length, "remaining", remaining);
  }
}

/** @param {Record<string, unknown>} tree @param {string} dotted @param {string} value */
function setNested(tree, dotted, value) {
  const parts = dotted.replace(/^copilot\./, "").split(".");
  let node = tree;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (!node[p] || typeof node[p] !== "object") node[p] = {};
    node = /** @type {Record<string, unknown>} */ (node[p]);
  }
  node[parts[parts.length - 1]] = value;
}

for (const [code, text] of Object.entries(allKeys)) {
  setNested(copilotLocale, code, text);
}

fs.writeFileSync(copilotLocalePath, `${JSON.stringify(copilotLocale, null, 2)}\n`, "utf8");
console.log("copilot keys", totalKeys, "files", byFile.size);
