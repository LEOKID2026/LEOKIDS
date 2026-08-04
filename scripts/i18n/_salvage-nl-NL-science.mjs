/**
 * Salvage remaining mixed EN/NL science stems from English authority (local only).
 * node scripts/i18n/_salvage-nl-NL-science.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { translateEnToNl } from "./_nl-NL-translate-engine.mjs";
import { DUTCH_NETHERLANDS_GLOSSARY } from "../../lib/i18n/dutch-netherlands-glossary.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");

const EXTRA = [
  [/What is a simple way to /gi, "Wat is een eenvoudige manier om "],
  [/What is a safe way to /gi, "Wat is een veilige manier om "],
  [/What is the main (job|role|function) of /gi, "Wat is de belangrijkste taak van "],
  [/What is a life cycle\?/gi, "Wat is een levenscyclus?"],
  [/What is electronic waste\?/gi, "Wat is elektronisch afval?"],
  [/What helps prevent tooth cavities\?/gi, "Wat helpt gaatjes in tanden te voorkomen?"],
  [/What can reduce measurement error\?/gi, "Wat kan meetfouten verminderen?"],
  [/Which animals use gills to get oxygen from water\?/gi, "Welke dieren gebruiken kieuwen om zuurstof uit water te halen?"],
  [/Why are fish well adapted to life in water\?/gi, "Waarom zijn vissen goed aangepast aan het leven in water?"],
  [/Why are many bats active at night instead of during the day\?/gi, "Waarom zijn veel vleermuizen ’s nachts actief in plaats van overdag?"],
  [/What does the nervous system mainly do\?/gi, "Wat doet het zenuwstelsel vooral?"],
  [/Why do scientists use standard units when they measure\?/gi, "Waarom gebruiken wetenschappers standaardeenheden wanneer zij meten?"],
  [/What is the main role of a fruit\?/gi, "Wat is de belangrijkste rol van een vrucht?"],
  [/What do animals do in winter\?/gi, "Wat doen dieren in de winter?"],
  [/Where do plants grow\?/gi, "Waar groeien planten?"],
  [/What do animals do to survive\?/gi, "Wat doen dieren om te overleven?"],
  [/Why is it important to do experiments\?/gi, "Waarom is het belangrijk om experimenten te doen?"],
  [/What do muscles do in the body\?/gi, "Wat doen spieren in het lichaam?"],
  [/What is a simple hypothesis in an investigation\?/gi, "Wat is een eenvoudige hypothese in een onderzoek?"],
  [/reduce packaging waste at school/gi, "verpakkingsafval op school te verminderen"],
  [/handle used batteries at home/gi, "gebruikte batterijen thuis te behandelen"],
  [/life cycle/gi, "levenscyclus"],
  [/electronic waste/gi, "elektronisch afval"],
  [/measurement error/gi, "meetfout"],
  [/tooth cavities/gi, "gaatjes in tanden"],
  [/gills/gi, "kieuwen"],
  [/instead of/gi, "in plaats van"],
  [/at night/gi, "’s nachts"],
  [/during the day/gi, "overdag"],
  [/at home/gi, "thuis"],
  [/at school/gi, "op school"],
  [/in water/gi, "in water"],
  [/in the body/gi, "in het lichaam"],
  [/in winter/gi, "in de winter"],
  [/to survive/gi, "om te overleven"],
  [/to grow/gi, "om te groeien"],
  [/adapted to/gi, "aangepast aan"],
  [/well adapted/gi, "goed aangepast"],
  [/standard units/gi, "standaardeenheden"],
  [/scientists/gi, "wetenschappers"],
  [/hypothesis/gi, "hypothese"],
  [/investigation/gi, "onderzoek"],
  [/muscles/gi, "spieren"],
  [/nervous system/gi, "zenuwstelsel"],
  [/packaging waste/gi, "verpakkingsafval"],
  [/used batteries/gi, "gebruikte batterijen"],
  [/simple way/gi, "eenvoudige manier"],
  [/safe way/gi, "veilige manier"],
  [/main role/gi, "belangrijkste rol"],
  [/main job/gi, "belangrijkste taak"],
  [/plant disease/gi, "plantenziekte"],
  [/most producers/gi, "meeste producenten"],
  [/an area/gi, "een gebied"],
  [/what is likely/gi, "wat is waarschijnlijk"],
  [/If a /g, "Als een "],
  [/If an /g, "Als een "],
  [/\bWhat do\b/g, "Wat doen"],
  [/\bWhat does\b/g, "Wat doet"],
  [/\bWhere do\b/g, "Waar"],
  [/\bWhy do\b/g, "Waarom"],
  [/\bWhy are\b/g, "Waarom zijn"],
  [/\bWhy is\b/g, "Waarom is"],
  [/\bWhich\b/g, "Welke"],
  [/\bWhat is\b/g, "Wat is"],
  [/\bWhat can\b/g, "Wat kan"],
  [/\bWhat helps\b/g, "Wat helpt"],
  [/\banimals\b/g, "dieren"],
  [/\bplants\b/g, "planten"],
  [/\bexperiments\b/g, "experimenten"],
  [/\bimportant\b/g, "belangrijk"],
  [/\bit is\b/g, "het is"],
  [/\bto do\b/g, "om te doen"],
  [/\bto get\b/g, "om te krijgen"],
  [/\bto reduce\b/g, "om te verminderen"],
  [/\bto handle\b/g, "om te behandelen"],
  [/\bto prevent\b/g, "te voorkomen"],
  [/\boxygen from water\b/g, "zuurstof uit water"],
  [/\buse\b/g, "gebruiken"],
  [/\bfruit\b/g, "vrucht"],
  [/\bbats\b/g, "vleermuizen"],
  [/\bactive\b/g, "actief"],
  [/\bmainly\b/g, "vooral"],
  [/\bsimple\b/g, "eenvoudige"],
  [/\bsafe\b/g, "veilige"],
  [/\bway\b/g, "manier"],
  [/\blife\b/g, "leven"],
  [/\bwaste\b/g, "afval"],
  [/\berror\b/g, "fout"],
  [/\bprevent\b/g, "voorkomen"],
  [/\btooth\b/g, "tand"],
  [/\bcavities\b/g, "gaatjes"],
  [/\bdisease\b/g, "ziekte"],
  [/\bkills\b/g, "doodt"],
  [/\blikely\b/g, "waarschijnlijk"],
  [/\barea\b/g, "gebied"],
  [/\bhome\b/g, "thuis"],
  [/\bhandle\b/g, "behandelen"],
  [/\bbatteries\b/g, "batterijen"],
  [/\bpackaging\b/g, "verpakking"],
  [/\bstandard\b/g, "standaard"],
  [/\bunits\b/g, "eenheden"],
  [/\brole\b/g, "rol"],
  [/\bget\b/g, "krijgen"],
  [/\bwell\b/g, "goed"],
  [/\bdoe\b/g, "doen"],
];

const EXTRA_SORTED = [...EXTRA].sort((a, b) => String(b[0]).length - String(a[0]).length);

function salvageString(en) {
  let out = String(en ?? "");
  for (const [re, rep] of EXTRA_SORTED) out = out.replace(re, rep);
  out = translateEnToNl(out, { childFacing: true });
  // glossary
  for (const [enTerm, entry] of Object.entries(DUTCH_NETHERLANDS_GLOSSARY)) {
    if (!entry?.preferred || enTerm.length < 4) continue;
    const re = new RegExp(`\\b${enTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
    out = out.replace(re, entry.preferred);
  }
  out = out
    .replace(/\bWat doen dieren doen\b/g, "Wat doen dieren")
    .replace(/\bWat doen spieren doen\b/g, "Wat doen spieren")
    .replace(/\bWaar planten groeien\b/g, "Waar groeien planten")
    .replace(/\bnaar om te\b/g, "om te")
    .replace(/\s{2,}/g, " ")
    .trim();
  return out;
}

function needsSalvage(text) {
  return /\b(the|and|with|what|which|how|why|see|hear|because|during|through|about|instead|simple|safe|main|life cycle|electronic waste|gills|scientists|standard units|hypothesis|investigation|prevent|cavities|packaging|batteries|adapted|survive|experiments|muscles|bats|active|mainly|disease|kills|likely|measurement error|fruit\?|If a |doe dieren|doe spieren|naar get|naar survive|naar doe)\b/i.test(
    String(text || ""),
  );
}

const enMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
const nlMod = await import(pathToFileURL(OUT).href + `?t=${Date.now()}`);
const en = enMod.SCIENCE_EN_OVERLAY;
const nl = { ...nlMod.SCIENCE_NL_NL_OVERLAY };

let fixed = 0;
for (const id of Object.keys(en)) {
  const src = en[id];
  const cur = nl[id];
  if (!cur) continue;
  const blob = [cur.stem, ...(cur.options || [])].join("\n");
  if (!needsSalvage(blob) && !needsSalvage(cur.explanation || "")) continue;
  nl[id] = {
    stem: salvageString(src.stem),
    options: (src.options || []).map((o) => salvageString(o)),
    explanation: salvageString(src.explanation),
    theoryLines: (src.theoryLines || []).map((t) => salvageString(t)),
  };
  fixed++;
}

fs.writeFileSync(
  OUT,
  `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(nl, null, 2)};\n`,
  "utf8",
);

let remain = 0;
for (const [id, q] of Object.entries(nl)) {
  if (needsSalvage([q.stem, ...(q.options || [])].join("\n"))) remain++;
}
console.log({ fixed, remain, total: Object.keys(nl).length });
console.log("sample", nl.animals_13?.stem, nl.animals_20?.stem, nl.env_22?.stem);
