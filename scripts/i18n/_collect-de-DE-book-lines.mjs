/**
 * Collect unique instructional EN lines from learning-book/en for de-DE authoring.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EN = path.join(ROOT, "docs/learning-book/en");

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (p.endsWith(".md")) out.push(p);
  }
  return out;
}

function skipLine(t, englishSubject) {
  if (!t) return true;
  if (/^[-*|`#=\s]+$/.test(t)) return true;
  if (/^\|\s*[-:| ]+\s*\|?\s*$/.test(t)) return true;
  if (
    /^\|/.test(t) &&
    /\*\*(learning_page_id|skill_id|subject|grade|age_band|page_type|approval_status|title_english)\*\*/i.test(t)
  ) {
    return true;
  }
  if (/^[-*]\s*`/.test(t) || /^[-*]\s*docs\//.test(t) || /^[-*]\s*data\//.test(t)) return true;
  if (/^[\d\s+\-−–—×÷=<>().,/?…π√%°]+$/.test(t)) return true;
  if (!/[A-Za-z]/.test(t)) return true;
  if (englishSubject) {
    if (
      /^[A-Za-z][A-Za-z' -]{0,24}$/.test(t) &&
      !/^(What|Today|Try|Now|On the|Let's|Simple|Common|Visual|Metadata|Source|Content|Field|Value|Remember|Practice|Example|Unit|Steps|How|Why|When|Which|The teens|Useful)/i.test(
        t
      )
    ) {
      return true;
    }
  }
  return false;
}

const freq = new Map();
let total = 0;
for (const f of walk(EN)) {
  const rel = path.relative(EN, f).replace(/\\/g, "/");
  const englishSubject = rel.startsWith("english/");
  const md = fs.readFileSync(f, "utf8");
  for (const line of md.split(/\r?\n/)) {
    const t = line.trim();
    if (skipLine(t, englishSubject)) continue;
    total++;
    freq.set(t, (freq.get(t) || 0) + 1);
  }
}

const arr = [...freq.entries()]
  .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  .map(([en, c]) => ({ en, c }));

const outPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "_de-DE-book-en-lines.json");
fs.writeFileSync(outPath, JSON.stringify(arr, null, 2));
console.log({
  unique: arr.length,
  totalLines: total,
  ge2: arr.filter((x) => x.c >= 2).length,
  ge5: arr.filter((x) => x.c >= 5).length,
  outPath,
});
