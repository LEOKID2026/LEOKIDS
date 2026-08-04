/**
 * Fix corrupted geMix lines left by over-greedy regex replacements.
 */
import fs from "node:fs";

const p = "utils/geometry-explanations.js";
let src = fs.readFileSync(p, "utf8");

const fixes = [
  // pyramid square compute rounded
  [
    /toSpan\(geMix\("sol_step_compute_then_m0_m1", \[`\(1\/3\) × \$\{baseArea\} × \$\{h\} = \$\{volRaw\}`\}\) → rounded per the question: \$\{M\(String\(correctAnswer\)\)\}\.`,\s*"4"\s*\)/g,
    'toSpan(geMix("sol_step_compute_rounded_m0_m1", [`(1/3) × ${baseArea} × ${h} = ${volRaw}`, String(correctAnswer)]), "4")',
  ],
  // pyramid rectangular
  [
    /toSpan\(geMix\("sol_step_compute_m0", \[`\(1\/3\) × \$\{baseArea\} × \$\{h\} = \$\{volRaw\}`\}\) → \$\{M\(String\(correctAnswer\)\)\],\s*"4"\s*\)/g,
    'toSpan(geMix("sol_step_compute_rounded_m0_m1", [`(1/3) × ${baseArea} × ${h} = ${volRaw}`, String(correctAnswer)]), "4")',
  ],
  // cone
  [
    /toSpan\(geMix\("sol_step_compute_m0", \[`\$\{r\}² = \$\{r2\}`\}\)\, \$\{M\(`3\.14 × \$\{r2\} × \$\{h\} = \$\{3\.14 \* r2 \* h\}`\)\}\, divided by 3 ≈ \$\{M\(String\(volRaw\)\)\],\s*"3"\s*\)/g,
    'toSpan(geMix("sol_step_compute_then_m0_m1", [`${r}² = ${r2}`, `3.14 × ${r2} × ${h} = ${3.14 * r2 * h}`]) + " " + geMix("sol_step_divide_by_3_approx_m0", [String(volRaw)]), "3")',
  ],
  // prism triangle volume
  [
    /toSpan\(geMix\("sol_step_volume_m0", \[`\$\{baseArea\} × \$\{h\} = \$\{prod\}`\}\) → \$\{correctAnswer\}\$\{geometryVolumeSuffix\(question\)\],\s*"4"\s*\)/g,
    'toSpan(geMix("sol_step_volume_m0", [`${baseArea} × ${h} = ${prod}`]) + " → " + String(correctAnswer) + geometryVolumeSuffix(question), "4")',
  ],
  // angles stated
  [
    /toSpan\(\s*geMix\("sol_step_stated_m0", \[`angle 1 = \$\{angle1\}°`\}\) and \$\{M\(`angle 2 = \$\{angle2\}°`\)\} - find the third angle\.`,\s*"2"\s*\)/g,
    'toSpan(geMix("sol_step_two_angles_find_third_m0_m1", [`angle 1 = ${angle1}°`, `angle 2 = ${angle2}°`]), "2")',
  ],
];

for (const [re, to] of fixes) {
  const before = src;
  src = src.replace(re, to);
  if (src === before) console.log("NO MATCH", String(re).slice(0, 80));
  else console.log("fixed one pattern");
}

fs.writeFileSync(p, src);

// Report remaining broken-looking lines
const lines = src.split("\n");
for (let i = 0; i < lines.length; i++) {
  const L = lines[i];
  if (/geMix\([^;]*`\}\)/.test(L) || /toSpan\(mix`/.test(L) || / → rounded|divided by 3|find the third/.test(L)) {
    console.log((i + 1) + ":", L.trim().slice(0, 160));
  }
}

try {
  await import(new URL("../utils/geometry-explanations.js", import.meta.url).href + "?t=" + Date.now());
  console.log("PARSE OK");
} catch (e) {
  console.log("PARSE FAIL", e.message);
}
