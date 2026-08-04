/**
 * Local-only science overlay polish for residual English tokens / grammar glitches.
 * node scripts/i18n/_polish-nl-NL-science.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");

const MAP = [
  [/\bsee\b/g, "zien"],
  [/\bSee\b/g, "Zien"],
  [/\bhear\b/g, "horen"],
  [/\bHear\b/g, "Horen"],
  [/\bsmell\b/g, "ruiken"],
  [/\btaste\b/g, "proeven"],
  [/\btouch\b/g, "aanraken"],
  [/\bbecause\b/g, "omdat"],
  [/\bBecause\b/g, "Omdat"],
  [/\bduring\b/g, "tijdens"],
  [/\bDuring\b/g, "Tijdens"],
  [/\bthrough\b/g, "door"],
  [/\bThrough\b/g, "Door"],
  [/\babout\b/g, "over"],
  [/\bAbout\b/g, "Over"],
  [/\bbefore\b/g, "vóór"],
  [/\bafter\b/g, "na"],
  [/\bbetween\b/g, "tussen"],
  [/\bwhich\b/g, "welke"],
  [/\bWhich\b/g, "Welke"],
  [/\bwhat\b/g, "wat"],
  [/\bWhat\b/g, "Wat"],
  [/\bwhen\b/g, "wanneer"],
  [/\bwhere\b/g, "waar"],
  [/\bwhy\b/g, "waarom"],
  [/\bhow\b/g, "hoe"],
  [/\bthe\b/g, "de"],
  [/\bThe\b/g, "De"],
  [/\band\b/g, "en"],
  [/\bwith\b/g, "met"],
  [/\bfrom\b/g, "van"],
  [/\binto\b/g, "in"],
  [/\busing\b/g, "met"],
  [/\bused to\b/g, "gebruikt om te"],
  [/\bused\b/g, "gebruikt"],
  [/\bcalled\b/g, "heet"],
  [/\bknown as\b/g, "bekend als"],
  [/\bin order to\b/g, "om te"],
  [/\bso that\b/g, "zodat"],
  [/\binstead of\b/g, "in plaats van"],
  [/\bfor example\b/g, "bijvoorbeeld"],
  [/\bFor example\b/g, "Bijvoorbeeld"],
  [/\bsuch as\b/g, "zoals"],
  [/\bas well as\b/g, "evenals"],
  [/\bno longer\b/g, "niet meer"],
  [/\ba lot of\b/g, "veel"],
  [/\beach other\b/g, "elkaar"],
  [/\bdoe we\b/g, "we"],
  [/\bdo we\b/g, "we"],
  [/\bgebruiken naar\b/g, "gebruiken om te"],
  [/\bgebruiken we naar\b/g, "gebruiken we om te"],
  [/\bwe gebruiken naar\b/g, "we gebruiken om te"],
  [/\bWelk orgaan doe we gebruiken naar zien\?/g, "Welk orgaan gebruiken we om te zien?"],
  [/\bWelk orgaan gebruiken we naar zien\?/g, "Welk orgaan gebruiken we om te zien?"],
  [/\bWelk orgaan we gebruiken om te zien\?/g, "Welk orgaan gebruiken we om te zien?"],
  [/\bWelk orgaan we gebruiken naar zien\?/g, "Welk orgaan gebruiken we om te zien?"],
];

function polish(s) {
  let out = String(s);
  for (const [re, rep] of MAP) out = out.replace(re, rep);
  out = out
    .replace(/Welk orgaan.*zien\?/i, "Welk orgaan gebruiken we om te zien?")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
  return out;
}

function walk(v) {
  if (typeof v === "string") return polish(v);
  if (Array.isArray(v)) return v.map(walk);
  if (v && typeof v === "object") {
    /** @type {Record<string, unknown>} */
    const o = {};
    for (const [k, x] of Object.entries(v)) o[k] = walk(x);
    return o;
  }
  return v;
}

const mod = await import(pathToFileURL(OUT).href + `?t=${Date.now()}`);
let overlay = walk(mod.SCIENCE_NL_NL_OVERLAY);
if (overlay.body_2) overlay.body_2.stem = "Welk orgaan gebruiken we om te zien?";

fs.writeFileSync(
  OUT,
  `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(overlay, null, 2)};\n`,
  "utf8",
);

let hits = 0;
/** @type {Array<{id:string,stem:string,m:string[]}>} */
const samples = [];
for (const [id, q] of Object.entries(overlay)) {
  const blob = [q.stem, ...(q.options || []), q.explanation, ...(q.theoryLines || [])].join("\n");
  const m = blob.match(
    /\b(the|and|with|what|which|how|why|see|hear|because|during|through|about|before|after|between|using|called|instead)\b/gi,
  );
  if (m) {
    hits++;
    if (samples.length < 12) samples.push({ id, stem: q.stem, m: [...new Set(m)] });
  }
}
console.log("remaining hard EN hits", hits);
console.log(samples);
console.log("body_2", overlay.body_2.stem);
