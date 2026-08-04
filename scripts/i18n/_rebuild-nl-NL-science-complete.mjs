/**
 * Rebuild science nl-NL overlay from EN for linguistically bad IDs; keep clean records.
 * Local only. Does not change IDs / answers / correctIndex / params.
 *
 * node scripts/i18n/_rebuild-nl-NL-science-complete.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { translateEduNl, looksEnglishHeavy } from "./_nl-NL-edu-translate.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");
const BAD_IDS = JSON.parse(fs.readFileSync(path.join(__dirname, "_qa-science-deep.json"), "utf8")).badIds;

const EXTRA_EXACT = {
  "Camouflage helps animals survive.": "Camouflage helpt dieren te overleven.",
  "This change is called melting.": "Deze verandering heet smelten.",
  "This change is called freezing.": "Deze verandering heet bevriezen.",
  "We see it because it reflects sunlight.": "We zien hem omdat hij zonlicht weerkaatst.",
  "A control group is left unchanged so you can compare and see what really caused the result.":
    "Een controlegroep blijft onveranderd, zodat je kunt vergelijken en zien wat het resultaat echt veroorzaakte.",
  "It helps you understand what caused the outcome.": "Het helpt je te begrijpen wat de uitkomst veroorzaakte.",
  "What do animals do to survive?": "Wat doen dieren om te overleven?",
  "Experiments help us learn about the world, test ideas, understand how things work, and discover new things.":
    "Experimenten helpen ons de wereld te leren kennen, ideeën te testen, te begrijpen hoe dingen werken en nieuwe dingen te ontdekken.",
  "To learn about the world, test ideas, and understand how things work":
    "Om over de wereld te leren, ideeën te testen en te begrijpen hoe dingen werken",
  "Growth is a natural process.": "Groei is een natuurlijk proces.",
  "Clouds are made of tiny water droplets or ice crystals. When they get heavy, rain can fall.":
    "Wolken bestaan uit hele kleine waterdruppels of ijskristallen. Als ze zwaar worden, kan regen vallen.",
  "Metal cookware often heats food quickly because metal conducts heat well.":
    "Metalen pannen verwarmen voedsel vaak snel omdat metaal warmte goed geleidt.",
  "Batteries need special recycling or disposal because they can contain harmful materials.":
    "Batterijen hebben speciale recycling of afvoer nodig omdat ze schadelijke stoffen kunnen bevatten.",
  "Time stamps keep records organized. You can see growth, weather links, or which trial came first.":
    "Tijdstempels houden aantekeningen geordend. Je kunt groei, weerverbanden of welke proef eerst kwam zien.",
  "Detailed logs let you and others understand what was done and found. They support honest analysis and replication.":
    "Gedetailleerde logboeken laten jou en anderen begrijpen wat er gedaan en gevonden is. Ze ondersteunen eerlijke analyse en herhaling.",
  "Water helps your body stay hydrated so cells and organs can do their jobs.":
    "Water helpt je lichaam voldoende vocht te houden, zodat cellen en organen hun werk kunnen doen.",
  "Plants grow toward light because they need it to carry out photosynthesis and make food. This behavior is called phototropism.":
    "Planten groeien naar het licht omdat ze dat nodig hebben voor fotosynthese en om voedsel te maken. Dit gedrag heet fototropisme.",
  "When habitats stay healthy, animals can find what they need to survive and reproduce.":
    "Als leefgebieden gezond blijven, kunnen dieren vinden wat ze nodig hebben om te overleven en zich voort te planten.",
  "Leaves fall because trees become animals.": "Bladeren vallen omdat bomen dieren worden.",
  "What color will our eyes become": "Welke kleur worden onze ogen",
  "Proves every hypothesis true automatically": "Bewijst elke hypothese automatisch als waar",
  "Details about what you actually see, hear, or measure":
    "Details over wat je echt ziet, hoort of meet",
  "Bladeren fall because trees become dieren.": "Bladeren vallen omdat bomen dieren worden.",
};

function translateField(en) {
  const s = String(en ?? "");
  if (!s.trim()) return s;
  if (EXTRA_EXACT[s]) return EXTRA_EXACT[s];
  return translateEduNl(s, { childFacing: true });
}

function isRecordBad(nl) {
  if (!nl) return true;
  const fields = [nl.stem, nl.prompt, nl.question, nl.explanation, nl.hint, ...(nl.options || []), ...(nl.theoryLines || [])];
  return fields.some((f) => looksEnglishHeavy(f) || /\b(Weent|eeenr|geleidens|materiaalen|weerkaatsens)\b/.test(String(f || "")));
}

const enMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href + `?t=${Date.now()}`);
const nlMod = await import(pathToFileURL(OUT).href + `?t=${Date.now()}`);
const EN = enMod.SCIENCE_EN_OVERLAY;
const overlay = structuredClone(nlMod.SCIENCE_NL_NL_OVERLAY);

const badSet = new Set(BAD_IDS);
let rebuilt = 0;
let kept = 0;

for (const id of Object.keys(EN)) {
  const e = EN[id];
  const n = overlay[id];
  const force = badSet.has(id) || isRecordBad(n);
  if (!force) {
    kept++;
    continue;
  }
  const next = {
    stem: translateField(e.stem ?? e.prompt ?? e.question ?? ""),
    options: (e.options || []).map((o) => translateField(o)),
    explanation: translateField(e.explanation || ""),
  };
  if (Array.isArray(e.theoryLines)) next.theoryLines = e.theoryLines.map((t) => translateField(t));
  // Preserve any non-text keys already on nl (should be none for display overlay)
  overlay[id] = next;
  rebuilt++;
}

// Hard curated fixes that must be perfect
const HARD = {
  body_2: {
    stem: "Welk orgaan gebruiken we om te zien?",
    options: ["Oren", "Ogen", "Neus", "Tong"],
    explanation: "Ogen nemen licht op, zodat de hersenen een beeld kunnen vormen van wat er om ons heen is.",
    theoryLines: [
      "De vijf belangrijkste zintuigen zijn zien, horen, ruiken, proeven en aanraken.",
      "De ogen sturen signalen via de oogzenuw naar de hersenen.",
    ],
  },
};

for (const [id, q] of Object.entries(HARD)) {
  if (overlay[id]) overlay[id] = { ...overlay[id], ...q };
}

fs.writeFileSync(
  OUT,
  `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(overlay, null, 2)};\n`,
  "utf8",
);

// Re-scan
let remain = 0;
const samples = [];
for (const id of Object.keys(EN)) {
  if (isRecordBad(overlay[id])) {
    remain++;
    if (samples.length < 25) {
      samples.push({ id, stem: overlay[id]?.stem, expl: String(overlay[id]?.explanation || "").slice(0, 100) });
    }
  }
}

console.log(JSON.stringify({ rebuilt, kept, total: Object.keys(EN).length, remain, samples }, null, 2));
