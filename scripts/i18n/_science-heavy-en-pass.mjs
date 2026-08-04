/**
 * Rebuild any science NL field that still looks English-heavy from EN authority.
 * Uses remain-map + extra curated + phrase translator (no short-word salad).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");

const MAP = {
  ...JSON.parse(fs.readFileSync(path.join(__dirname, "_science-nl-NL-remain-map.json"), "utf8")),
  "Bright colors help attract bees and other pollinators.":
    "Felle kleuren helpen bijen en andere bestuivers aan te trekken.",
  "Water keeps plant cells firm and supports photosynthesis. Without it, leaves droop and life processes slow or stop.":
    "Water houdt plantencellen stevig en ondersteunt fotosynthese. Zonder water hangen bladeren slap en vertragen of stoppen levensprocessen.",
  "Flowers contain reproductive parts. After pollination and fertilization, seeds (often inside fruits) can form.":
    "Bloemen bevatten voortplantingsdelen. Na bestuiving en bevruchting kunnen zaden ontstaan (vaak in vruchten).",
  "Excretory organs manage wastes.": "Uitscheidingsorganen verwerken afvalstoffen.",
  "Attract bees for pollination": "Bijen aantrekken voor bestuiving",
  "Most reptiles are ectothermic, so they rely on sunlight and warm surroundings to manage body temperature.":
    "De meeste reptielen zijn ectotherm, dus ze gebruiken zonlicht en een warme omgeving om hun lichaamstemperatuur te regelen.",
  "Many overlapping feeding relationships in an ecosystem":
    "Veel overlappende voedselrelaties in een ecosysteem",
  "Water supports many body processes and helps you stay healthy.":
    "Water ondersteunt veel lichaamsprocessen en helpt je gezond te blijven.",
  "Lifestyle choices affect health.": "Keuzes in je leefstijl beïnvloeden je gezondheid.",
  "Use a proper solar filter or a supervised projection or shade method":
    "Gebruik een goed zonnefilter of een begeleide projectie- of schaduwmethode",
  "Use a regular telescope with no filter": "Gebruik een gewone telescoop zonder filter",
  "Heavy stone shoes": "Zware stenen schoenen",
  "Pollination helps plants reproduce.": "Bestuiving helpt planten zich voort te planten.",
  "Night can make finding food safer or easier for them.":
    "De nacht kan voedsel zoeken voor hen veiliger of makkelijker maken.",
  "Blood is a transport system. It delivers what cells need and carries away wastes.":
    "Bloed is een transportsysteem. Het brengt wat cellen nodig hebben en voert afvalstoffen af.",
  "Pollination supports seed and fruit production.": "Bestuiving ondersteunt de productie van zaden en vruchten.",
  "They filter wastes from the blood like kidneys.": "Ze filteren afvalstoffen uit het bloed, zoals nieren.",
  "Each heartbeat pushes blood into vessels. Circulation delivers oxygen and nutrients and removes wastes.":
    "Elke hartslag duwt bloed de vaten in. De bloedsomloop brengt zuurstof en voedingsstoffen en voert afvalstoffen af.",
  "Removing wastes and extra water from the blood": "Afvalstoffen en extra water uit het bloed verwijderen",
  "Desert specialists manage heat and limited water. Camels are classic examples of such adaptations.":
    "Woestijnspecialisten gaan om met hitte en weinig water. Kamelen zijn klassieke voorbeelden van zulke aanpassingen.",
  "Filtering wastes from blood": "Afvalstoffen uit het bloed filteren",
  "Produce urine for the kidneys": "Urine maken voor de nieren",
  "Kidneys clean the blood by removing wastes and extra water, which leave the body as urine.":
    "Nieren zuiveren het bloed door afvalstoffen en extra water te verwijderen, die het lichaam als urine verlaten.",
  "Cells use oxygen in processes that release energy from nutrients so the body can work and stay alive.":
    "Cellen gebruiken zuurstof in processen die energie uit voedingsstoffen vrijmaken, zodat het lichaam kan werken en in leven blijft.",
  "Pollination is important for many fruits and seeds.": "Bestuiving is belangrijk voor veel vruchten en zaden.",
  "Biodiversity means many kinds of living things. Together they support food webs and healthier habitats.":
    "Biodiversiteit betekent veel soorten levende wezens. Samen ondersteunen ze voedselwebben en gezondere leefgebieden.",
  "Joints filter waste out of your blood as it flows through them":
    "Gewrichten filteren afval uit je bloed terwijl het erdoor stroomt",
  "Pollination is needed for many plants to make seeds.":
    "Bestuiving is nodig zodat veel planten zaden kunnen maken.",
  "Kidneys clean the blood by removing wastes that leave the body as urine.":
    "Nieren zuiveren het bloed door afvalstoffen te verwijderen die het lichaam als urine verlaten.",
  "They filter wastes from the blood": "Ze filteren afvalstoffen uit het bloed",
  "It connects bones together and allows the skeleton to move.":
    "Het verbindt botten met elkaar en laat het skelet bewegen.",
  "Your body completely runs out of oxygen and shuts down all processes":
    "Je lichaam raakt helemaal zonder zuurstof en stopt alle processen",
  "Rest is part of a healthy lifestyle.": "Rust hoort bij een gezonde leefstijl.",
  "Rest turns muscles into stone": "Rust verandert spieren in steen",
  "Exercise is part of a healthy lifestyle.": "Bewegen hoort bij een gezonde leefstijl.",
};

const HEAVY =
  /\b(the|and|with|from|that|this|these|those|what|which|because|survive|called|provides|seeking|helps?|make|finding|Blood is|It delivers|carries away|Night can|Use a|Heavy stone|Pollination help|Pollination support|Pollination is|They filter|Each heartbeat|Removing wastes|Desert specialists|Filtering wastes|Produce urine|Kidneys clean|Cells use|Biodiversity means|Joints filter|It connects|Your body completely|Rest is part|Rest turns|Lifestyle choices|Water supports|Bright colors|Water keeps|Flowers contain|Excretory|Attract bees|Most reptiles|Many overlapping|Working |breathing|breathe|people|place with|house built|useful for|windows|feathers|manage |processes|nutrients|wastes|blood like|into vessels|Circulation|limited water|classic examples|such adaptations|for the kidneys|leave the body|release energy|kinds of living|food webs|healthier habitats|as it flows|allows the|shuts down|healthy lifestyle|turns muscles|no filter|solar filter|supervised|shade method|reproduce\.|fruit production|seed and fruit)\b/i;

const PHRASES = [
  ["Pollination helps plants reproduce.", "Bestuiving helpt planten zich voort te planten."],
  ["Pollination supports seed and fruit production.", "Bestuiving ondersteunt de productie van zaden en vruchten."],
  ["Pollination is important for many fruits and seeds.", "Bestuiving is belangrijk voor veel vruchten en zaden."],
  ["Pollination is needed for many plants to make seeds.", "Bestuiving is nodig zodat veel planten zaden kunnen maken."],
  ["healthy lifestyle", "gezonde leefstijl"],
  ["body processes", "lichaamsprocessen"],
  ["life processes", "levensprocessen"],
  ["blood vessels", "bloedvaten"],
  ["food webs", "voedselwebben"],
  ["living things", "levende wezens"],
  ["extra water", "extra water"],
  ["carbon dioxide", "koolstofdioxide"],
  ["photosynthesis", "fotosynthese"],
  ["pollination", "bestuiving"],
  ["fertilization", "bevruchting"],
  ["biodiversity", "biodiversiteit"],
  ["habitats", "leefgebieden"],
  ["habitat", "leefgebied"],
  ["kidneys", "nieren"],
  ["Kidneys", "Nieren"],
  ["muscles", "spieren"],
  ["skeleton", "skelet"],
  ["bones", "botten"],
  ["joints", "gewrichten"],
  ["Joints", "Gewrichten"],
  ["wastes", "afvalstoffen"],
  ["waste", "afval"],
  ["nutrients", "voedingsstoffen"],
  ["oxygen", "zuurstof"],
  ["blood", "bloed"],
  ["filter", "filter"],
  ["Filtering", "Filteren van"],
  ["Removing", "Verwijderen van"],
  ["together", "samen"],
  ["through them", "door hen"],
  ["your", "je"],
  ["you", "je"],
  ["they", "ze"],
  ["They", "Ze"],
  ["It ", "Het "],
  [" from ", " uit "],
  [" into ", " in "],
  [" and ", " en "],
  [" or ", " of "],
  [" for ", " voor "],
  [" with ", " met "],
  [" without ", " zonder "],
  [" the ", " de "],
  [" a ", " een "],
  [" an ", " een "],
  [" of ", " van "],
  [" to ", " om te "],
  [" as ", " als "],
  [" by ", " door "],
];

function translate(en) {
  const s = String(en ?? "");
  if (!s.trim()) return s;
  if (s in MAP) return MAP[s];
  let out = s;
  for (const [a, b] of PHRASES) out = out.split(a).join(b);
  return out
    .replace(/\bom te om te\b/g, "om te")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function heavy(s) {
  return HEAVY.test(String(s || ""));
}

const { SCIENCE_EN_OVERLAY: EN } = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
const { SCIENCE_NL_NL_OVERLAY: NL } = await import(pathToFileURL(OUT).href + "?t=" + Date.now());

let patched = 0;
const out = structuredClone(NL);
const still = [];

for (const id of Object.keys(EN)) {
  const en = EN[id];
  const nl = out[id];
  if (!nl) continue;

  const apply = (enVal, get, set) => {
    const cur = String(get() ?? "");
    if (!heavy(cur) && cur !== String(enVal ?? "")) return;
    if (!heavy(cur) && !(String(enVal ?? "") in MAP)) return;
    if (heavy(cur) || String(enVal ?? "") in MAP) {
      const next = translate(enVal);
      if (next && next !== cur) {
        set(next);
        patched++;
      }
      if (heavy(String(get() ?? ""))) still.push({ id, cur: String(get()).slice(0, 100), en: String(enVal).slice(0, 100) });
    }
  };

  apply(en.stem, () => nl.stem, (v) => { nl.stem = v; });
  apply(en.explanation, () => nl.explanation, (v) => { nl.explanation = v; });
  (en.options || []).forEach((o, i) => apply(o, () => nl.options[i], (v) => { nl.options[i] = v; }));
  (en.theoryLines || []).forEach((t, i) => apply(t, () => nl.theoryLines[i], (v) => { nl.theoryLines[i] = v; }));
}

fs.writeFileSync(
  OUT,
  `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(out, null, 2)};\n`,
  "utf8"
);
fs.writeFileSync(path.join(__dirname, "_science-heavy-still.json"), JSON.stringify({ patched, stillCount: still.length, still: still.slice(0, 80) }, null, 2));
console.log({ patched, stillCount: still.length, sample: still.slice(0, 15) });
