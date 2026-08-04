/**
 * Full rebuild of science nl-NL overlay from English + cache + curated local engine.
 * No external API. Prefer cache (earlier reviewed MT+post), else curated local translate.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { translateEnToNl } from "./_nl-NL-translate-engine.mjs";
import { DUTCH_NETHERLANDS_GLOSSARY } from "../../lib/i18n/dutch-netherlands-glossary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");
const CACHE_PATH = path.join(__dirname, "_mt-cache-nl-NL.json");

const EXACT = {
  "Which organ do we use to see?": "Welk orgaan gebruiken we om te zien?",
  "Which organ do we mainly use to hear?": "Welk orgaan gebruiken we vooral om te horen?",
  Ears: "Oren",
  Eyes: "Ogen",
  Nose: "Neus",
  Tongue: "Tong",
  "What is a life cycle?": "Wat is een levenscyclus?",
  "What is pollination?": "Wat is bestuiving?",
  "What causes the seasons?": "Wat veroorzaakt de seizoenen?",
  "What is the job of flowers?": "Wat is de taak van bloemen?",
  "What is the job of hormones?": "Wat is de taak van hormonen?",
  "What is an ecosystem?": "Wat is een ecosysteem?",
  "What is a food chain?": "Wat is een voedselketen?",
  "What is photosynthesis?": "Wat is fotosynthese?",
  "What is the water cycle?": "Wat is een waterkringloop?",
  "What is electronic waste?": "Wat is elektronisch afval?",
  True: "Waar",
  False: "Onwaar",
  Yes: "Ja",
  No: "Nee",
};

const POST = [
  [/\bWiskunde\b/g, "Rekenen"],
  [/\bGrade\s*1\b/gi, "Groep 3"],
  [/\bGrade\s*2\b/gi, "Groep 4"],
  [/\bGrade\s*3\b/gi, "Groep 5"],
  [/\bGrade\s*4\b/gi, "Groep 6"],
  [/\bGrade\s*5\b/gi, "Groep 7"],
  [/\bGrade\s*6\b/gi, "Groep 8"],
  [/\bstudent\b/gi, "leerling"],
  [/\bstudents\b/gi, "leerlingen"],
  [/\bteacher\b/gi, "leerkracht"],
  [/\bteachers\b/gi, "leerkrachten"],
  [/\bgoesting\b/gi, "zin"],
  [/\bhesp\b/gi, "ham"],
  [/\bplezant\b/gi, "leuk"],
  [/\bamai[!?.]?\b/gi, ""],
  [/\bgij\b/gi, "jij"],
  [/\bdoe we\b/g, "we"],
  [/\bgebruiken naar\b/g, "gebruiken om te"],
  [/\bnaar zien\b/g, "om te zien"],
  [/\bnaar horen\b/g, "om te horen"],
  [/\bWelke animal\b/g, "Welk dier"],
  [/\banimal\b/g, "dier"],
  [/\bmammal\b/g, "zoogdier"],
  [/\breptiles?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "reptielen" : "reptiel")],
  [/\bmetals?\b/gi, (m) => (m.toLowerCase().endsWith("s") ? "metalen" : "metaal")],
  [/\bplastic\b/gi, "plastic"],
  [/\bphysical veranderen\b/g, "fysische verandering"],
  [/\blayers\b/gi, "lagen"],
  [/\blucht vervuiling\b/g, "luchtvervuiling"],
  [/\bvoedsel keten\b/g, "voedselketen"],
  [/\bstatement over\b/gi, "uitspraak over"],
  [/\bWelke statement\b/g, "Welke uitspraak"],
  [/\bWelke uitspraak over .* is Waar\?/gi, (m) => m.replace(/ is Waar\?/i, " is waar?")],
  [/\bis Waar\?/g, "is waar?"],
  [/\bAarde's\b/g, "van de Aarde"],
  [/​​/g, ""],
];

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function postProcess(s) {
  let out = String(s ?? "");
  for (const [enTerm, entry] of Object.entries(DUTCH_NETHERLANDS_GLOSSARY)) {
    if (!entry?.preferred || enTerm.length < 4) continue;
    out = out.replace(new RegExp(`\\b${escapeRegExp(enTerm)}\\b`, "g"), entry.preferred);
  }
  for (const [re, rep] of POST) out = out.replace(re, rep);
  return out.replace(/\s{2,}/g, " ").replace(/\s+([,.!?])/g, "$1").trim();
}

function looksEnglishHeavy(s) {
  const t = String(s || "");
  // English-only markers (not valid standalone Dutch content words in this context)
  return /\b(which organ|what is the|what does|what do|why do|why does|how do|how does|instead of|because|during|through|about|scientists|measurement|hypothesis|gills|helmet|raincoat|metamorphosis|pollination|hormones|flowers|seasons|cavities|batteries|packaging|observing|goggles|feeder|kidneys|statement about|life cycle|electronic waste|main job|main role|wear a|ride a|record results|safety rules|chemical compound|blood flow|steady supply|several times|active play|hot day|lab log|hard exercise|feel tired|working muscles|breathing system|hard-working|clouds play|amphibians unique|plant disease|used batteries|simple way|safe way)\b/i.test(
    t,
  );
}

function translateOne(en, cache) {
  const s = String(en ?? "");
  if (!s.trim()) return s;
  if (Object.prototype.hasOwnProperty.call(EXACT, s)) return postProcess(EXACT[s]);
  if (cache[s]) {
    let c = postProcess(cache[s]);
    // child-facing
    c = c.replace(/\bU\b/g, "Je").replace(/\bUw\b/g, "Jouw").replace(/\buw\b/g, "jouw");
    if (!looksEnglishHeavy(c)) return c;
  }
  return postProcess(translateEnToNl(s, { childFacing: true }));
}

const cache = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
const enMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
const src = enMod.SCIENCE_EN_OVERLAY;

/** @type {Record<string, any>} */
const out = {};
let fromCache = 0;
let fromLocal = 0;
for (const id of Object.keys(src)) {
  const q = src[id];
  const stem = translateOne(q.stem, cache);
  if (cache[q.stem] && !looksEnglishHeavy(stem)) fromCache++;
  else fromLocal++;
  out[id] = {
    stem,
    options: (q.options || []).map((o) => translateOne(o, cache)),
    explanation: translateOne(q.explanation, cache),
    theoryLines: (q.theoryLines || []).map((t) => translateOne(t, cache)),
  };
}

// Absolute authority overrides for critical stems
out.body_2.stem = "Welk orgaan gebruiken we om te zien?";
out.body_2.options = ["Oren", "Ogen", "Neus", "Tong"];
if (out.sci_g3_body_001) out.sci_g3_body_001.stem = "Welk orgaan gebruiken we vooral om te horen?";
if (out.animals_13) out.animals_13.stem = "Wat is een levenscyclus?";
if (out.env_22) out.env_22.stem = "Wat is elektronisch afval?";
if (out.plants_12) out.plants_12.stem = "Wat is de taak van bloemen?";
if (out.plants_13) out.plants_13.stem = "Wat is bestuiving?";
if (out.earth_9) out.earth_9.stem = "Wat veroorzaakt de seizoenen?";
if (out.body_22) out.body_22.stem = "Wat is de taak van hormonen?";
if (out.plants_3) out.plants_3.stem = "Wat is fotosynthese?";
if (out.env_2) out.env_2.stem = "Wat is een ecosysteem?";
if (out.animals_4) out.animals_4.stem = "Wat is een voedselketen?";
if (out.earth_10) out.earth_10.stem = "Wat is de waterkringloop?";

fs.writeFileSync(
  OUT,
  `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(out, null, 2)};\n`,
  "utf8",
);

let heavy = 0;
const samples = [];
for (const [id, q] of Object.entries(out)) {
  if (looksEnglishHeavy(q.stem)) {
    heavy++;
    if (samples.length < 20) samples.push({ id, stem: q.stem });
  }
}
console.log({
  total: Object.keys(out).length,
  fromCachePrefer: fromCache,
  fromLocalPrefer: fromLocal,
  englishHeavyStems: heavy,
  samples,
});
