/**
 * Collect remaining English instructional residue in de-DE books (non-english subjects).
 * Keys = EN source lines for residue-map merge.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const DE = path.join(ROOT, "docs/learning-book/de-DE");
const EN = path.join(ROOT, "docs/learning-book/en");

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

/** Strong English markers (case-insensitive). No German function words. */
const EN_MARK =
  /\b(the|and|with|that|which|without|because|through|their|they|these|those|would|could|should|from|have|been|being|does|make|help|need|what|when|where|how|why|for|over|under|after|before|during|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|\bis\b|like|has|not|sides|corners|shape|length|width|equal|imagine|check|called|hold|move|moved|flip|mirror|everywhere|tiles|windows|games|board|sticker|classroom|different|opposite|usually|longer|shorter|everything|flat|page|hand|polygon|triangular|faces|round|base|point|top|shoe|box|rectangular|same|curved|soda|bases|today|look|try|practice|many|much|square|rectangle|triangle|example|between|names|rows|plane|about|important|don't|stop|questions|comes|neighbor|break|find|step|first|coins|total|amount|groups|carrying|shekels|altogether|quarter|turn|half|full|light|shadow|reflection|transparency|mixture|mixtures|climate|solar|earth|space|work|out|long|division|subtract|take|away|means|less|remove|objects|stars|start|land|steps|degrees|focus|getting|know|rotation|calculating|center|arrow|clock|path|formal|introduction|materials|blocks|bounces|surface|water|cup|salt|cardboard|table|three|effects|day|smooth|travels|straight|line|hits|behave|ways|pass|bounce|absorbed|shiny|angle|hit|returns|passes|clear|glass|gases|trap|heat|using|fuels|cutting|forests|contribute|challenge|act|clean|energy|waste|protecting|star|planet|third|hot|cold|rainy|dry|periods|worldwide|scientists|see|warmer|years|average|orbits|axis|think|rain|plants|main|source|everyday|floor|tile|right|angles|someone|asks|geometry|learn|divide|digit|algorithm|skill|solving|problems|estimate|volume|prism|number|subtracting|numbers|materials|this|let's|left|here|impodertant|foder|deploy|treat|draft|content|owner|approved|until|sign|off|link|grade|idea|tens|rounding|nearest|thousand|hundreds|note|experiments|spine|marks|it|use|means|less|remove|put|out|objects|after|land|on|half|turn|full|degrees|in|questions|if|part|path|two-digit|long|division|work|out|mixtures|and|light|climate|change|solar|system|earth|space|clean|energy|less|waste|protecting|forests|hot|cold|rainy|dry|worldwide|scientists|warmer|average|orbits|axis|think|rain|plants|main|source|getting|know|the|square|everyday|floor|tile|right|angles|someone|asks|if|geometry|that|is|this|is|use|number|line)\b/i;

const LOAN =
  /^(addition|subtraktion|multiplikation|division|geometrie|mathematik|radius|diameter|parallel|trapez|volumen|faktor|dezimal|prozent|algorithmus|prisma|zylinder|kegel|kugel|centimeter|meter|kilometer)$/i;

function isInfra(rel, line) {
  if (/(^|\/)README\.md$/i.test(rel)) return true;
  if (/[\u0590-\u05FF]/.test(line)) return true;
  if (
    /registry|Not in scope|practice routing|owner-approved|approval_status|runtime|commit|push|deploy|Hebrew titles|Child-facing|signoff|style guide|spine `maxGrade`|spine `minGrade`/i.test(
      line
    )
  )
    return true;
  if (/^:::/.test(line) || /^```/.test(line) || /^type:\s*\w/.test(line)) return true;
  return false;
}

/** True if DE line still looks English-instructional (not natural German). */
function isBadDe(deLine) {
  const bare = deLine.replace(/`[^`]+`/g, " ");
  if (/^[\d\s+\-−–—×÷=<>().,/π√%°cm²m³:?"']+$/.test(bare)) return false;
  const hits = (bare.match(EN_MARK) || []).filter((w) => !LOAN.test(w));
  if (hits.length === 0) return false;
  // Require at least 1 strong English function word OR 2 content EN words
  // Quotient/Rest are standard German school math terms — not English leakage.
  const cleaned = bare.replace(/\bQuotient\b/g, "").replace(/\bRest\b/g, "");
  const strong =
    /\b(the|and|with|that|which|because|through|their|they|these|those|would|could|should|from|have|been|does|make|help|need|what|when|where|how|why|for|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|\bis\b|like|has|not|don't|let's|this|here|use|look|try|work|out|learn|divide|subtract|take|away|means|getting|know|important|example|today|practice|questions|someone|asks|if|everyday|floor|tile|right|angles|geometry|number|line|quarter|turn|half|full|light|shadow|reflection|transparency|mixture|mixtures|climate|solar|earth|space|scientists|worldwide|impodertant|foder|quotient|remainder)\b/i;
  const strongHits = (cleaned.match(strong) || []).filter((w) => !LOAN.test(w));
  return strongHits.length >= 1;
}

const freq = new Map();
const samples = [];
let files = 0;

for (const f of walk(DE)) {
  const rel = path.relative(DE, f).replace(/\\/g, "/");
  if (rel.startsWith("english/")) continue;
  const deLines = fs.readFileSync(f, "utf8").split(/\r?\n/);
  const enPath = path.join(EN, rel);
  if (!fs.existsSync(enPath)) continue;
  const enLines = fs.readFileSync(enPath, "utf8").split(/\r?\n/);
  let hit = false;
  for (let i = 0; i < deLines.length; i++) {
    const t = deLines[i].trim();
    if (!t) continue;
    if (
      /^\|\s*\*\*(learning_page_id|skill_id|subject|Klasse|age_band|page_type|approval_status|title_english)\*\*/i.test(
        t
      )
    )
      continue;
    const enKey = (enLines[i] || t).trim();
    if (isInfra(rel, enKey) || isInfra(rel, t)) continue;
    if (!isBadDe(t)) continue;
    hit = true;
    freq.set(enKey, (freq.get(enKey) || 0) + 1);
    if (samples.length < 40) samples.push({ rel, en: enKey.slice(0, 100), de: t.slice(0, 100) });
  }
  if (hit) files++;
}

const arr = [...freq.entries()]
  .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
  .map(([en, c]) => ({ en, c }));

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "_de-DE-book-residue-parts");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "part-13-en.json"), JSON.stringify(arr.map((x) => x.en), null, 2));
fs.writeFileSync(path.join(outDir, "part-13-freq.json"), JSON.stringify(arr, null, 2));
fs.writeFileSync(path.join(outDir, "part-13-samples.json"), JSON.stringify(samples, null, 2));
console.log({
  unique: arr.length,
  files,
  chars: arr.reduce((a, x) => a + x.en.length, 0),
  top20: arr.slice(0, 20),
  samples: samples.slice(0, 15),
});
