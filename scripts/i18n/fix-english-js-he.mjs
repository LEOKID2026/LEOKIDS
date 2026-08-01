/**
 * Strip HE lookup maps / wordHe / sentenceHe from learning-content-en/english.js
 */
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { fileURLToPath } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const p = path.join(ROOT, "utils/learning-content-en/english.js");
let t = fs.readFileSync(p, "utf8");

t = t.replace(/const EXPLANATION_EN = \{[\s\S]*?\n\};\r?\n\r?\n/, "const EXPLANATION_EN = {};\n\n");
t = t.replace(/const PHONICS_LABELS = \{[\s\S]*?\n\};\r?\n\r?\n/, "const PHONICS_LABELS = {};\n\n");
t = t.replace(/const POOL_FALLBACK_EN = \{[\s\S]*?\n\};\r?\n\r?\n/, "const POOL_FALLBACK_EN = {};\n\n");

t = t.replace(
  /function translateEnglishPhrase\(text\) \{[\s\S]*?\n\}\r?\n/,
  `function translateEnglishPhrase(text) {
  return String(text ?? "").trim();
}
`
);

t = t.replace(
  /\n    if \(p\.wordHe != null\) \{\r?\n      delete p\.wordHe;\r?\n    \}\r?\n    if \(p\.sentenceHe != null\) \{\r?\n      if \(!p\.localizedSentence && p\.sentenceEn\) \{\r?\n        p\.localizedSentence = String\(p\.sentenceEn\);\r?\n      \} else if \(!p\.localizedSentence && p\.localizedMeaning\) \{\r?\n        p\.localizedSentence = p\.localizedMeaning;\r?\n      \}\r?\n      delete p\.sentenceHe;\r?\n    \}\r?\n/,
  "\n"
);

fs.writeFileSync(p, t, "utf8");
const check = spawnSync(process.execPath, ["--check", p], { encoding: "utf8" });
console.log(
  JSON.stringify(
    {
      ok: check.status === 0,
      err: (check.stderr || "").slice(0, 400),
      wordHe: /\bwordHe\b/.test(t),
      sentenceHe: /\bsentenceHe\b/.test(t),
      u05: /\\u05/.test(t),
    },
    null,
    2
  )
);
if (check.status !== 0) process.exit(1);
