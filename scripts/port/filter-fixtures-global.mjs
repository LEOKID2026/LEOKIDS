import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const path = fileURLToPath(new URL("../../lib/learning/fixtures/taxonomy-real-runtime-fixtures.js", import.meta.url));
let src = readFileSync(path, "utf8");

const lines = src.split(/\r?\n/);
const dropImportSubstrings = [
  "moledet-geography-diagnostic-metadata-bridge",
  "history-questions/g6-generated",
  "geography-questions/g5",
  "hebrew-question-generator",
  "hebrew-rich-question-bank",
];
const filteredLines = lines.filter(
  (line) => !dropImportSubstrings.some((s) => line.includes("import") && line.includes(s))
);
src = filteredLines.join("\n");

src = src.replace(/\n  "H-0[0-9]": \{[\s\S]*?\n  \},/g, "");
src = src.replace(/\n\/\*\* Build moledet bank MCQ[\s\S]*?\n\}\n\n/, "\n");
src = src.replace(/^buildMcqBankLoader\("(?:HI|MG|H)-[^"]+"[\s\S]*?\);\n/gm, "");
src = src.replace(/\n  \["H-[^"]+",[^\]]+\],/g, "");
src = src.replace(/\n  "(?:MG|HI)-[^"]+": \{[\s\S]*?\n  \},/g, "");

writeFileSync(path, src);
console.log("fixtures cleaned");
