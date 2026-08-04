/**
 * Collect hybrid EN/DE lines and pure English instructional lines (non-english subjects).
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

const DE_MARK =
  /[äöüÄÖÜß]|\b(der|die|das|den|dem|des|ein|eine|einer|einem|einen|und|oder|mit|für|wir|du|ist|sind|hat|haben|lernen|Heute|Jetzt|Inhaltsumfang|Übung|Quadrat|Rechteck|Dreieck|Zahlenstrahl|Fläche|Umfang|Körper|Winkel|Seite|Seiten)\b/;
const EN_MARK =
  /\b(the|and|with|that|which|without|because|through|their|they|these|those|would|could|should|from|have|been|being|does|make|help|need|what|when|where|how|why|for|over|under|after|before|during|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|is|like|has|not|all|sides|corners|shape|length|width|equal|Imagine|Check|Yes|Did|Does|called|hold|move|moved|flip|mirror|everywhere|tiles|windows|games|board|sticker|classroom|Identifying|different|opposite|usually|longer|shorter|everything|Infrastructure|placeholder|Documentation|three-dimensional|flat|page|hand|polygon|triangular|faces|round|base|point|top|shoe|box|rectangular|same|curved|soda|bases|Today|Number line|Look for|Try to|In practice|How many|How much|A square|A rectangle|A triangle|Example|Internal|remain|Focus|between|parallel|lines|rotation|names|difference|rows|plane|about the|about a)\b/i;

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
    if (/^[\d\s+\-−–—×÷=<>().,/π√%°cm²m³:?]+$/.test(bare)) continue;
    const hasDe = DE_MARK.test(bare);
    const enHits = bare.match(EN_MARK) || [];
    const hybrid = hasDe && enHits.length >= 1;
    const pureEn = !hasDe && enHits.length >= 2;
    if (!hybrid && !pureEn) continue;
    hit = true;
    const key = (enLines[i] || t).trim();
    freq.set(key, (freq.get(key) || 0) + 1);
  }
  if (hit) files++;
}

const arr = [...freq.entries()]
  .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
  .map(([en, c]) => ({ en, c }));

fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), "_de-DE-book-hybrid.json"), JSON.stringify(arr, null, 2));
console.log({ unique: arr.length, files, chars: arr.reduce((a, x) => a + x.en.length, 0), top30: arr.slice(0, 30) });
