/**
 * Migrate learning-patterns-analysis hardcoded copy to content pack.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { scanSource } from "./hardcoded-ui-core.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const target = path.join(root, "utils/learning-patterns-analysis.js");
const copyOut = path.join(root, "content-packs/en/learning/learning-patterns-copy.json");
const exampleOut = path.join(root, "content-packs/en/learning/example-pattern-diagnostics-payload.json");

/** @param {string} text */
function slugKey(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 72);
}

let src = fs.readFileSync(target, "utf8");

const exampleMatch = src.match(/export const EXAMPLE_PATTERN_DIAGNOSTICS_PAYLOAD = (\{[\s\S]*?\n\};)/);
if (exampleMatch) {
  const payload = vm.runInNewContext(`(${exampleMatch[1].slice(0, -1)})`, {});
  fs.writeFileSync(exampleOut, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  src = src.replace(
    exampleMatch[0],
    'import examplePatternDiagnosticsPayload from "../content-packs/en/learning/example-pattern-diagnostics-payload.json" with { type: "json" };\n\nexport const EXAMPLE_PATTERN_DIAGNOSTICS_PAYLOAD = examplePatternDiagnosticsPayload;'
  );
}

const hits = scanSource("utils/learning-patterns-analysis.js", src);
/** @type {Record<string, string>} */
const copy = {};
/** @type {Record<string, string>} */
const textToKey = {};

for (const hit of hits) {
  const text = hit.text;
  if (!textToKey[text]) {
    let key = slugKey(text) || `copy_${Object.keys(copy).length + 1}`;
    let unique = key;
    let n = 2;
    while (copy[unique] && copy[unique] !== text) {
      unique = `${key}_${n++}`;
    }
    textToKey[text] = unique;
    copy[unique] = text;
  }
}

const sortedTexts = Object.keys(textToKey).sort((a, b) => b.length - a.length);
for (const text of sortedTexts) {
  const key = textToKey[text];
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  src = src.replace(new RegExp(`"${escaped}"`, "g"), `patternCopy("${key}")`);
}

if (!src.includes("patternCopy")) {
  src = `import { patternCopy } from "../lib/learning/learning-patterns-copy.js";\nimport learningSubjectsEn from "../locales/en/learning.json" with { type: "json" };\n${src}`;
}

src = src.replace(
  /const SUBJECT_LABEL_HE = \{[\s\S]*?\};/,
  `const SUBJECT_LABEL_HE = {
  ...learningSubjectsEn.subjects,
  history: patternCopy("subject_history"),
  hebrew: patternCopy("subject_hebrew"),
  "moledet-geography": patternCopy("subject_moledet_geography"),
  moledet: patternCopy("subject_moledet"),
  geography: patternCopy("subject_geography"),
};`
);

fs.writeFileSync(copyOut, `${JSON.stringify({ copy }, null, 2)}\n`, "utf8");
fs.writeFileSync(target, src, "utf8");
console.log("patterns copy keys", Object.keys(copy).length, "remaining hits", scanSource("x", src).length);
