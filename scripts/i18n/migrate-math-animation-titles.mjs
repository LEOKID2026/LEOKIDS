/**
 * Extract static math animation titles to content pack and rewrite math-animations.js.
 * Run: node scripts/i18n/migrate-math-animation-titles.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const targetFile = path.join(root, "utils/math-animations.js");
const outJson = path.join(root, "content-packs/en/learning/math-animation-titles.json");

/** @param {string} text */
function slugKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);
}

const src = fs.readFileSync(targetFile, "utf8");
const lines = src.split(/\r?\n/);

/** @type {Record<string, string>} */
const titles = {};
/** @type {Record<string, string>} */
const textToKey = {};

let changed = 0;
const outLines = lines.map((line) => {
  const staticMatch = line.match(/^(\s*title:\s*)"([^"]+)",\s*$/);
  if (staticMatch) {
    const [, indent, text] = staticMatch;
    let key = textToKey[text];
    if (!key) {
      key = slugKey(text) || `title_${Object.keys(titles).length + 1}`;
      let unique = key;
      let n = 2;
      while (titles[unique] && titles[unique] !== text) {
        unique = `${key}_${n++}`;
      }
      key = unique;
      textToKey[text] = key;
      titles[key] = text;
    }
    changed += 1;
    return `${indent}title: animTitle("${key}"),`;
  }

  const tplMatch = line.match(/^(\s*title:\s*)`([^`]*)\$\{([^}]+)\}([^`]*)`,\s*$/);
  if (tplMatch) {
    const [, indent, before, expr, after] = tplMatch;
    const template = `${before}{var}${after}`;
    let key = textToKey[template];
    if (!key) {
      key = slugKey(template.replace("{var}", "var")) || `tpl_${Object.keys(titles).length + 1}`;
      let unique = key;
      let n = 2;
      while (titles[unique] && titles[unique] !== template) {
        unique = `${key}_${n++}`;
      }
      key = unique;
      textToKey[template] = key;
      titles[key] = template.replace("{var}", `{${expr.trim()}}`).replace(/\$\{([^}]+)\}/g, (_, name) => `{${name.trim()}}`);
    }
    const varName = expr.trim();
    return `${indent}title: animTitle("${key}", { ${varName}: ${varName} }),`;
  }

  return line;
});

if (!src.includes("animTitle")) {
  const importLine =
    'import { animTitle } from "../lib/learning/math-animation-copy.js";';
  const firstImport = outLines.findIndex((l) => l.startsWith("import "));
  if (firstImport >= 0) {
    outLines.splice(firstImport, 0, importLine);
  } else {
    outLines.unshift(importLine);
  }
}

fs.writeFileSync(outJson, `${JSON.stringify({ titles }, null, 2)}\n`, "utf8");
fs.writeFileSync(targetFile, outLines.join("\n"), "utf8");
console.log(`math-animation-titles: ${Object.keys(titles).length} keys, ${changed} static lines rewritten`);
