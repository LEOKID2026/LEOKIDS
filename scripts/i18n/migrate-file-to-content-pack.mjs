/**
 * Generic: move scanner findings in one file to a content pack lookup.
 * Usage: node scripts/i18n/migrate-file-to-content-pack.mjs <relFile> <packRelPath> <exportFnName>
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanSource } from "./hardcoded-ui-core.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const [relFile, packRel, fnName = "learningCopy"] = process.argv.slice(2);
if (!relFile || !packRel) {
  console.error("Usage: migrate-file-to-content-pack.mjs <file> <content-pack-path> [fnName]");
  process.exit(1);
}

const target = path.join(root, relFile);
const packPath = path.join(root, "content-packs/en/learning", packRel);
const helperImport = `import { ${fnName} } from "${relativeImportPath(relFile)}";`;

/** @param {string} fromFile */
function relativeImportPath(fromFile) {
  const dir = path.dirname(fromFile).split(/[/\\]/);
  const up = dir.map(() => "..").join("/");
  const helper = `${up}/lib/learning/generic-learning-copy.js`;
  return helper.replace(/\\/g, "/");
}

/** @param {string} text */
function slugKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 72);
}

let src = fs.readFileSync(target, "utf8");
/** @type {Record<string, string>} */
let copy = {};
if (fs.existsSync(packPath)) {
  copy = JSON.parse(fs.readFileSync(packPath, "utf8")).copy || {};
}

const hits = scanSource(relFile, src);
/** @type {Record<string, string>} */
const textToKey = {};
for (const hit of hits) {
  if (!textToKey[hit.text]) {
    let key = slugKey(hit.text) || `copy_${Object.keys(copy).length + 1}`;
    let unique = key;
    let n = 2;
    while ((copy[unique] || textToKey[Object.keys(textToKey).find((t) => textToKey[t] === unique)]) && copy[unique] !== hit.text) {
      unique = `${key}_${n++}`;
    }
    textToKey[hit.text] = unique;
    copy[unique] = hit.text;
  }
}

for (const text of Object.keys(textToKey).sort((a, b) => b.length - a.length)) {
  const key = textToKey[text];
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  src = src.replace(new RegExp(`"${escaped}"`, "g"), `${fnName}("${key}")`);
}

if (hits.length && !src.includes(fnName)) {
  const idx = src.search(/^import /m);
  const line = `import { ${fnName} } from "${relativeImportPath(relFile).replace("generic-learning-copy.js", `${fnName.replace(/Copy$/, "").replace(/([A-Z])/g, "-$1").toLowerCase()}-copy.js`.replace(/^-/, ""))}";\n`;
  // use generic helper always
  const importLine = `import { ${fnName} } from "${relativeImportPath(relFile)}";\n`;
  if (idx >= 0) src = src.slice(0, idx) + importLine + src.slice(idx);
  else src = importLine + src;
}

fs.mkdirSync(path.dirname(packPath), { recursive: true });
fs.writeFileSync(packPath, `${JSON.stringify({ copy }, null, 2)}\n`, "utf8");
fs.writeFileSync(target, src, "utf8");
const remaining = scanSource(relFile, src).length;
console.log(relFile, "keys", Object.keys(textToKey).length, "remaining", remaining);
