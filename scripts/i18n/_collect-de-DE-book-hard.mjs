/**
 * Hard residue: stillEnglishInstructional OR common EN leftovers in non-english books.
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

const HARD =
  /\b(the|and|with|that|which|without|because|through|their|they|these|those|would|could|should|from|have|been|being|does|make|makes|help|helps|need|needs|what|when|where|how|why|for|over|under|after|before|during|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|is|like|has|not|all|sides|corners|shape|shapes|length|width|equal|Imagine|Check|Yes|Did|Does|called|hold|move|moved|flip|mirror|everywhere|tiles|windows|games|board|sticker|classroom|Identifying|different|opposite|usually|longer|shorter|everything|Infrastructure|placeholder|Documentation|draft|markdown|three-dimensional|flat|page|hand|polygon|triangular|faces|round|base|point|top|shoe|box|rectangular|same|curved|soda|bases|Today|Now you|In practice|Number line|Look for|Try to|On the next|Simple explanation|Common mistake|What are we|How many|How much|A square|A rectangle|A triangle|Example:|Internal IDs|remain|Focus:|Content scope)\b/;

const freq = new Map();
let files = 0;

for (const f of walk(DE)) {
  const rel = path.relative(DE, f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  const deLines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  const enLines = fs.readFileSync(path.join(EN, rel), "utf8").split(/\r?\n/);
  let hit = false;
  for (let i = 0; i < deLines.length; i++) {
    const t = deLines[i].trim();
    if (!t) continue;
    if (/^\|\s*\*\*(learning_page_id|skill_id|subject|Klasse|age_band|page_type|approval_status)\*\*/i.test(t))
      continue;
    const bare = t.replace(/`[^`]+`/g, " ");
    if (!(stillEnglishInstructional(bare) || HARD.test(bare))) continue;
    // require at least one clear English function word besides German-only noise
    const m = bare.match(
      /\b(the|and|with|that|which|is|are|has|have|like|not|all|sides|corners|shape|length|width|equal|Imagine|Check|Yes|Did|Does|called|hold|move|moved|flip|mirror|everywhere|tiles|windows|games|board|sticker|classroom|Identifying|different|opposite|usually|longer|shorter|everything|Infrastructure|placeholder|Documentation|three-dimensional|flat|page|hand|polygon|triangular|faces|round|base|point|top|shoe|box|rectangular|same|curved|soda|bases|your|you|we|our|they|their|this|these|those|because|without|through|would|could|should|what|when|where|how|why|Today|Number|Look|Try|Focus|Internal|remain|Example|rows|row|plane|names|difference|between|parallel|lines|rotation|square|rectangle|triangle|circle)\b/gi
    );
    if (!m || m.length < 1) continue;
    // skip pure German lines that only hit via stillEnglish false friends
    if (!/[A-Za-z]{3,}/.test(bare.replace(/[äöüÄÖÜß]/g, ""))) continue;
    hit = true;
    const key = (enLines[i] || t).trim();
    freq.set(key, (freq.get(key) || 0) + 1);
  }
  if (hit) files++;
}

const arr = [...freq.entries()]
  .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
  .map(([en, c]) => ({ en, c }));

fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "_de-DE-book-hard.json"), JSON.stringify(arr, null, 2));
console.log({ unique: arr.length, files, chars: arr.reduce((a, x) => a + x.en.length, 0), top25: arr.slice(0, 25) });
