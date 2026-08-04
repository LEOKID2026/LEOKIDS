/**
 * Residue from math/geometry/science books only (english/ subject excluded).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { stillEnglishInstructional } from "./_de-DE-book-line.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DE = path.join(ROOT, "docs/learning-book/de-DE");
const EN = path.join(ROOT, "docs/learning-book/en");

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (p.endsWith(".md")) out.push(p);
  }
  return out;
}

// Note: omit bare "was" — it is also German (interrogative/relative).
const EN_FUNC =
  /\b(the|and|with|that|which|without|because|through|into|about|their|they|this|these|those|would|could|should|from|have|been|being|does|make|makes|help|helps|need|needs|what|when|where|how|why|for|over|under|after|before|during|only|also|more|most|other|than|then|each|every|will|are|were|you|your|we|our)\b/gi;

const freq = new Map();
let heavy = 0;
const heavyList = [];

for (const f of walk(DE)) {
  const rel = path.relative(DE, f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  const deMd = fs.readFileSync(f, "utf8");
  const enMd = fs.readFileSync(path.join(EN, rel), "utf8");
  const deLines = deMd.split(/\r?\n/);
  const enLines = enMd.split(/\r?\n/);
  let hits = 0;
  for (let i = 0; i < deLines.length; i++) {
    const t = deLines[i].trim();
    if (!t || !/[A-Za-z]/.test(t)) continue;
    if (/^\|/.test(t) && /learning_page_id|skill_id|subject|Klasse|age_band/.test(t)) continue;
    if (/^[-*]\s*`/.test(t) || /^[-*]\s*docs\//.test(t)) continue;
    const h = (t.match(EN_FUNC) || []).length;
    if (stillEnglishInstructional(t) || h >= 3) {
      hits += h;
      const key = (enLines[i] || t).trim();
      if (key) freq.set(key, (freq.get(key) || 0) + 1);
    }
  }
  if (hits > 12 || /\bGrade\s*[1-6]\b/.test(deMd)) {
    heavy++;
    if (heavyList.length < 20) heavyList.push({ rel, hits });
  }
}

const arr = [...freq.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([en, c]) => ({ en, c }));

fs.writeFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "_de-DE-book-residue-noneng.json"),
  JSON.stringify(arr, null, 2)
);
console.log({
  unique: arr.length,
  heavyNonEngFiles: heavy,
  heavyList,
  chars: arr.reduce((a, x) => a + x.en.length, 0),
  top20: arr.slice(0, 20),
});
