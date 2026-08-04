/**
 * Collect remaining English instructional lines from non-english de-DE books
 * (and chrome-only from english subject books).
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

const EN_FUNC =
  /\b(the|and|with|that|which|without|because|through|into|about|their|they|this|these|those|would|could|should|from|have|been|being|does|make|makes|help|helps|need|needs|what|when|where|how|why|for|over|under|after|before|during|against|around|only|also|more|most|other|than|then|each|every|will|are|was|were|you|your|we|our|it|its)\b/gi;

const freq = new Map();
let heavyFiles = 0;
const heavyList = [];

for (const f of walk(DE)) {
  const rel = path.relative(DE, f).replace(/\\/g, "/");
  const englishSubject = rel.startsWith("english/");
  const deMd = fs.readFileSync(f, "utf8");
  const enPath = path.join(EN, rel);
  const enMd = fs.existsSync(enPath) ? fs.readFileSync(enPath, "utf8") : "";
  const enLines = enMd.split(/\r?\n/);
  const deLines = deMd.split(/\r?\n/);

  let fileHits = 0;
  for (let i = 0; i < deLines.length; i++) {
    const de = deLines[i];
    const en = enLines[i] || "";
    const t = de.trim();
    if (!t) continue;
    if (/^[-*|`#=\s]+$/.test(t)) continue;
    if (/^\|\s*[-:| ]+\s*\|?\s*$/.test(t)) continue;
    if (/^\|/.test(t) && /\*\*(learning_page_id|skill_id|subject|Klasse|grade|age_band)/i.test(t)) continue;
    if (/^[-*]\s*`/.test(t) || /^[-*]\s*docs\//.test(t)) continue;
    if (/^[\d\s+\-−–—×÷=<>().,/?…π√%°]+$/.test(t)) continue;

    if (englishSubject) {
      // Only flag chrome that still looks English
      if (!stillEnglishInstructional(t) && !/^(## |Metadata|Field|Value|Source|Content|Try to|On the next|Today we|What are we learning|Simple explanation|Common mistake)/i.test(t)) {
        continue;
      }
    }

    const hits = (t.match(EN_FUNC) || []).length;
    const instructional = stillEnglishInstructional(t) || hits >= 3;
    if (!instructional) continue;
    // skip if mostly German already (has äöüß or many German function words)
    const deMarkers = (t.match(/\b(der|die|das|und|oder|mit|von|für|auf|ein|eine|ist|sind|wir|du|nicht|auch|wenn|dann|heute|lernen|Übung|Fläche|Umfang|Quadrat|Rechteck|Klasse)\b/gi) || []).length;
    if (deMarkers >= 3 && hits <= 2 && !stillEnglishInstructional(t)) continue;

    fileHits += hits;
    const key = en.trim() || t;
    freq.set(key, (freq.get(key) || 0) + 1);
  }
  if (fileHits > 12 || /\bGrade\s*[1-6]\b/.test(deMd)) {
    heavyFiles++;
    if (heavyList.length < 15) heavyList.push({ rel, fileHits });
  }
}

const arr = [...freq.entries()]
  .sort((a, b) => b[1] - a[1])
  .map(([en, c]) => ({ en, c }));

fs.writeFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "_de-DE-book-residue-real.json"),
  JSON.stringify(arr, null, 2)
);
console.log({ uniqueResidue: arr.length, heavyFiles, heavyList, top: arr.slice(0, 25) });
