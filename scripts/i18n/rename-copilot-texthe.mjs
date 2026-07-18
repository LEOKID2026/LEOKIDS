/**
 * Rename Copilot block field textHe → answerText (audit/runtime migration).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const TARGET_DIRS = ["utils/parent-copilot", "lib/parent-copilot", "components/parent-copilot"];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) walk(abs, out);
    else if (/\.(js|jsx|mjs)$/.test(name) && !/\.(test|spec)\./.test(name)) out.push(abs);
  }
  return out;
}

/** @param {string} src */
function renameCopilotField(src) {
  return src
    .replace(/\?\.\s*textHe\b/g, "?.answerText")
    .replace(/\.textHe\b/g, ".answerText")
    .replace(/\btextHe\s*:/g, "answerText:")
    .replace(/\btextHe\s*\)/g, "answerText)")
    .replace(/\(\s*textHe\s*,/g, "(answerText,")
    .replace(/\{\s*textHe\s*,/g, "{ answerText,")
    .replace(/,\s*textHe\s*\}/g, ", answerText }")
    .replace(/\btextHe\s*,/g, "answerText,")
    .replace(/\btextHe\s*\}/g, "answerText }");
}

let filesChanged = 0;
for (const rel of TARGET_DIRS) {
  for (const abs of walk(path.join(root, rel))) {
    const before = fs.readFileSync(abs, "utf8");
    if (!/\btextHe\b/.test(before)) continue;
    const after = renameCopilotField(before);
    if (after !== before) {
      fs.writeFileSync(abs, after, "utf8");
      filesChanged += 1;
      console.log("renamed", path.relative(root, abs).replace(/\\/g, "/"));
    }
  }
}
console.log("filesChanged", filesChanged);
