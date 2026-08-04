/**
 * Collect hybrid EN/DE salad lines from non-english learning books.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

// NOTE: never include bare "hat" (German verb) or "also" (German adverb).
const STRONG =
  /\b(the|and|with|that|which|without|because|through|their|they|these|those|would|could|should|have|been|being|does|make|makes|help|helps|need|needs|what|when|where|how|why|for|over|under|after|before|during|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|is|like|has|not|all|sides|corners|shape|shapes|length|width|equal|Imagine|Check|Yes|Did|Does|called|hold|move|moved|flip|mirror|image|everywhere|tiles|windows|games|right|board|sticker|classroom|chalkboard|measurements|Identifying|different|opposite|pairs|usually|longer|shorter|everything|Internal|remain|infrastructure|placeholder|Documentation|draft|markdown|three-dimensional|flat|page|hand|polygon|triangular|faces|round|base|point|top|shoe|box|rectangular|same|curved|soda|bases|shekel|shekels|paid|spent|cost|change|left|altogether|stickers|points|cards|books|savings)\b/i;

const freq = new Map();
let fileHits = 0;
const heavy = [];

for (const f of walk(DE)) {
  const rel = path.relative(DE, f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  // Skip pure infra READMEs? No — translate chrome too for closure.
  const deLines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  const enLines = fs.readFileSync(path.join(EN, rel), "utf8").split(/\r?\n/);
  let hits = 0;
  for (let i = 0; i < deLines.length; i++) {
    const t = deLines[i].trim();
    if (!t) continue;
    if (/^\|\s*\*\*(learning_page_id|skill_id|subject|Klasse|age_band|page_type|approval_status)\*\*/i.test(t))
      continue;
    if (/^[-*]\s*`[a-z0-9_./:-]+`/.test(t) && !STRONG.test(t.replace(/`[^`]+`/g, ""))) continue;
    const bare = t.replace(/`[^`]+`/g, " ");
    if (!STRONG.test(bare)) continue;
    // German-only lines with accidental hits (also) — require 2+ strong tokens or classic EN verbs
    const m = bare.match(
      /\b(the|and|with|that|which|is|are|has|have|like|not|all|sides|corners|shape|length|width|equal|Imagine|Check|Yes|Did|Does|called|hold|move|moved|flip|mirror|everywhere|tiles|windows|games|board|sticker|classroom|Identifying|different|opposite|usually|longer|shorter|everything|Infrastructure|placeholder|Documentation|three-dimensional|flat|page|hand|polygon|triangular|faces|round|base|point|top|shoe|box|rectangular|same|curved|soda|bases|your|you|we|our|they|their|this|these|those|because|without|through|would|could|should|what|when|where|how|why|shekel|shekels|paid|spent|cost|change|left|altogether|stickers|points|cards|books|savings)\b/gi
    );
    if (!m || m.length < 2) continue;
    hits++;
    const key = (enLines[i] || t).trim();
    freq.set(key, (freq.get(key) || 0) + 1);
  }
  if (hits > 0) {
    fileHits++;
    if (heavy.length < 40) heavy.push({ rel, hits });
  }
}

const arr = [...freq.entries()]
  .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
  .map(([en, c]) => ({ en, c }));

fs.writeFileSync(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "_de-DE-book-salad.json"),
  JSON.stringify(arr, null, 2)
);
console.log({
  unique: arr.length,
  filesWithHits: fileHits,
  heavy: heavy.slice(0, 25),
  chars: arr.reduce((a, x) => a + x.en.length, 0),
  top30: arr.slice(0, 30),
});
