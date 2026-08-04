/**
 * Rebuild science nl-NL from MT cache (mostly good) + curated fixes for residual EN.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/science-questions-nl-NL-overlay.js");
const CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, "_mt-cache-nl-NL.json"), "utf8"));

const EN_BAD =
  /\b(the|and|with|from|what|which|because|survive|called|finding|provides|jobs?|food|behavior|flowers|hormones|job|Sleep|seeking|Digest|cookware|heats|analysis|measure|pulse|daytime|true|false|special|harmful|actually|automatically|growth|toward|light|cells|organs|hypothesis|observe|observation|measurement|replication|honest|quickly|well|underwater|tipping|soak|hydrated|drinking|warmth|flight|adapted|forward|turning|upright|trait|Feathers|Crack|Filter|Spin|Absorb|substances|pumps|stores|urine|replaces|breathe|breathing|working|feeling|muscles|stone|resting|steer|balance|moving|steady|pathway|useful|structures?|matches|environment|ways|living|flying|steering|keeping|feeding|handle|foods|shapes|suit|nectar|meat|probing|mud|Comparing|species|shows|adaptation|patterns?|busy|chemical|factory|processes|manage|toxins|wastes|overlapping|lifestyle|supports|People|Thirst|signal|fluid|parts|swim|stay|abdomen|together|opening|data|comes|Units|matter|conditions|usually|never|changes|Metal|often|directly|reproduction|main|nervous|system|solution|salt|dissolves|homogeneous|mixture|greenhouse|gases|methane|trap|planet|lays|eggs|chicken|mammals|give|birth|live|young|material|hard|strong|Stone|People|building|heavy|work|correctly|describes|fixed|shape|Unlike|liquids|solids|flow|pour|hold|change|day|hot|cold|rain|human|kidneys|filter|remove|extra|make|urine|leaves|body|difference|warm-blooded|cold-blooded|regulate|own|temperature|pollination|transfer|pollen|insects|wind|helps|plants|make|seeds|heated|very|high|boiling|point|becomes|vapor|gas|process|conductor|lets|heat|electricity|pass|easily|Metals|conductors|insulator|carry|prevent|shocks|seasons|tilted|axis|travels|around|course|year|hemisphere|tilts|describe|condition|outdoors|whether|rainy|sunny|recycling|turns|used|materials|plastic|paper|glass|new|products|instead|throwing|away|adaptation|trait|behavior|live|well|chemical|change|forms|Burning|paper|makes|ash|gases|eyes|most|people|two|distance|depth|perception)\b/i;

const CURATED = {
  Gas: "Gas",
  "What is the job of flowers?": "Wat is de taak van bloemen?",
  "What is the job of hormones?": "Wat is de taak van hormonen?",
  "Camouflage helps animals survive.": "Camouflage helpt dieren te overleven.",
  "Animals survive by finding food and water, staying in safe places, reproducing, and avoiding predators.":
    "Dieren overleven door voedsel en water te zoeken, op veilige plekken te blijven, zich voort te planten en roofdieren te vermijden.",
  "Sleep all day without seeking food": "De hele dag slapen zonder voedsel te zoeken",
  "An opening with no data analysis": "Een opening zonder gegevensanalyse",
  "It provides food, shelter, and conditions for growth and reproduction":
    "Het biedt voedsel, schuilplaats en omstandigheden voor groei en voortplanting",
  "Units of measure matter.": "Meeteenheden doen ertoe.",
  "A conclusion comes after analysis.": "Een conclusie komt na analyse.",
  "Digest food directly": "Voedsel rechtstreeks verteren",
  "What is a careful hypothesis about animal behavior in winter?":
    "Wat is een zorgvuldige hypothese over diergedrag in de winter?",
  "Behavior usually never changes": "Gedrag verandert meestal nooit",
  "Winter conditions can change animal behavior.": "Winteromstandigheden kunnen diergedrag veranderen.",
  "Metal cookware often heats food quickly because metal conducts heat well.":
    "Metalen pannen verwarmen voedsel vaak snel omdat metaal warmte goed geleidt.",
  "Different species use different winter strategies, such as migrating, resting more, or storing food.":
    "Verschillende soorten gebruiken verschillende winterstrategieën, zoals migreren, meer rusten of voedsel opslaan.",
  "What causes daytime on Earth?": "Wat veroorzaakt overdag op Aarde?",
  "What causes daytime?": "Wat veroorzaakt overdag?",
  "What is true about many lizards?": "Wat klopt over veel hagedissen?",
  "Which explanation best links pulse to body activity?":
    "Welke uitleg verbindt de pols het best met lichaamsactiviteit?",
  "If your pulse is faster, what is usually true?": "Als je pols sneller is, wat klopt dan meestal?",
  "What do animals do to survive?": "Wat doen dieren om te overleven?",
  "This change is called melting.": "Deze verandering heet smelten.",
  "This change is called freezing.": "Deze verandering heet bevriezen.",
  "We see it because it reflects sunlight.": "We zien hem omdat hij zonlicht weerkaatst.",
  "Growth is a natural process.": "Groei is een natuurlijk proces.",
  "Clouds are made of tiny water droplets or ice crystals. When they get heavy, rain can fall.":
    "Wolken bestaan uit hele kleine waterdruppels of ijskristallen. Als ze zwaar worden, kan regen vallen.",
  "Batteries need special recycling or disposal because they can contain harmful materials.":
    "Batterijen hebben speciale recycling of afvoer nodig omdat ze schadelijke stoffen kunnen bevatten.",
  "Water helps your body stay hydrated so cells and organs can do their jobs.":
    "Water helpt je lichaam voldoende vocht te houden, zodat cellen en organen hun werk kunnen doen.",
  "Plants grow toward light because they need it to carry out photosynthesis and make food. This behavior is called phototropism.":
    "Planten groeien naar het licht omdat ze dat nodig hebben voor fotosynthese en om voedsel te maken. Dit gedrag heet fototropisme.",
  "When habitats stay healthy, animals can find what they need to survive and reproduce.":
    "Als leefgebieden gezond blijven, kunnen dieren vinden wat ze nodig hebben om te overleven en zich voort te planten.",
  "Leaves fall because trees become animals.": "Bladeren vallen omdat bomen dieren worden.",
  "What is the main job of the nervous system?": "Wat is de belangrijkste taak van het zenuwstelsel?",
  "A solution of salt and water is an example of which kind of mixture?":
    "Een oplossing van zout en water is een voorbeeld van welk soort mengsel?",
  "Which statement about greenhouse gases is true?": "Welke zin over broeikasgassen is waar?",
  "Which animal lays eggs?": "Welk dier legt eieren?",
  "Which material is hard and strong?": "Welk materiaal is hard en sterk?",
  "Which statement correctly describes a solid material?": "Welke zin beschrijft een vast materiaal correct?",
  "How does weather change?": "Hoe verandert het weer?",
  "What is the job of the kidneys in the human body?": "Wat is de taak van de nieren in het menselijk lichaam?",
  "What is the main difference between warm-blooded and cold-blooded animals?":
    "Wat is het belangrijkste verschil tussen warmbloedige en koudbloedige dieren?",
  "What is a habitat?": "Wat is een leefgebied?",
  "What is pollination?": "Wat is bestuiving?",
  "What happens when water is heated to a very high temperature?":
    "Wat gebeurt er wanneer water tot een zeer hoge temperatuur wordt verwarmd?",
  "What is a conductor?": "Wat is een geleider?",
  "What is an insulator?": "Wat is een isolator?",
  "What causes the seasons?": "Wat veroorzaakt de seizoenen?",
  "What does weather describe?": "Wat beschrijft het weer?",
  "What is recycling?": "Wat is recycling?",
  "What is an adaptation?": "Wat is een aanpassing?",
  "What is a chemical change?": "Wat is een chemische verandering?",
  "How many eyes do most people have?": "Hoeveel ogen hebben de meeste mensen?",
};

// Load more curated from batch EXACT if present
const batchPath = path.join(__dirname, "_fix-nl-NL-science-batch.mjs");
const batchSrc = fs.readFileSync(batchPath, "utf8");
const exactMatch = batchSrc.match(/const EXACT = \{([\s\S]*?)\n\};/);
if (exactMatch) {
  try {
    // eslint-disable-next-line no-new-func
    const obj = Function(`return {${exactMatch[1]}}`)();
    Object.assign(CURATED, obj);
  } catch {
    /* ignore parse issues */
  }
}

function translate(en) {
  const s = String(en ?? "");
  if (!s.trim()) return s;
  if (Object.prototype.hasOwnProperty.call(CURATED, s)) return CURATED[s];
  const cached = CACHE[s];
  if (cached != null && !EN_BAD.test(cached) && cached !== s) return cached;
  if (cached != null && !EN_BAD.test(cached)) return cached; // allow Gas==Gas
  // light fallback for short leftovers
  let out = cached != null ? cached : s;
  const light = [
    [/\bsurvive\b/gi, "overleven"],
    [/\bjob\b/gi, "taak"],
    [/\bjobs\b/gi, "taken"],
    [/\bflowers\b/gi, "bloemen"],
    [/\bhormones\b/gi, "hormonen"],
    [/\bfood\b/gi, "voedsel"],
    [/\bbehavior\b/gi, "gedrag"],
    [/\bmain\b/gi, "belangrijkste"],
    [/\bnervous system\b/gi, "zenuwstelsel"],
    [/\blays eggs\b/gi, "legt eieren"],
    [/\bhard and strong\b/gi, "hard en sterk"],
    [/\bcorrectly describes\b/gi, "juist beschrijft"],
    [/\bhuman body\b/gi, "menselijk lichaam"],
    [/\bwarm-blooded\b/gi, "warmbloedig"],
    [/\bcold-blooded\b/gi, "koudbloedig"],
    [/\bpollination\b/gi, "bestuiving"],
    [/\bconductor\b/gi, "geleider"],
    [/\binsulator\b/gi, "isolator"],
    [/\bseasons\b/gi, "seizoenen"],
    [/\brecycling\b/gi, "recycling"],
    [/\badaptation\b/gi, "aanpassing"],
    [/\bchemical change\b/gi, "chemische verandering"],
    [/\bpeople\b/gi, "mensen"],
    [/\beyes\b/gi, "ogen"],
  ];
  for (const [re, rep] of light) out = out.replace(re, rep);
  return out;
}

const enMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href + `?t=${Date.now()}`);
const EN = enMod.SCIENCE_EN_OVERLAY;
const overlay = {};

let badFields = 0;
for (const [id, e] of Object.entries(EN)) {
  const next = {
    stem: translate(e.stem ?? e.prompt ?? e.question ?? ""),
    options: (e.options || []).map((o) => translate(o)),
    explanation: translate(e.explanation || ""),
  };
  if (Array.isArray(e.theoryLines)) next.theoryLines = e.theoryLines.map((t) => translate(t));
  overlay[id] = next;
  for (const f of [next.stem, next.explanation, ...next.options, ...(next.theoryLines || [])]) {
    if (EN_BAD.test(f) && f !== "Gas") badFields++;
  }
}

// curated hard records
overlay.body_2 = {
  stem: "Welk orgaan gebruiken we om te zien?",
  options: ["Oren", "Ogen", "Neus", "Tong"],
  explanation: "Ogen nemen licht op, zodat de hersenen een beeld kunnen vormen van wat er om ons heen is.",
  theoryLines: [
    "De vijf belangrijkste zintuigen zijn zien, horen, ruiken, proeven en aanraken.",
    "De ogen sturen signalen via de oogzenuw naar de hersenen.",
  ],
};

const LAST9 = {
  sci_pb1_g4_body_easy_01: {
    stem: "Welke zin beschrijft het spijsverteringsstelsel op een eenvoudig niveau het best?",
    options: [
      "Het breekt voedsel in kleinere delen en neemt stoffen op in het lichaam",
      "Het maakt meestal zuurstof rechtstreeks uit voedsel",
      "Het wisselt alleen van taak met de longen om rood bloed te maken",
      "Het werkt alleen tijdens snelle beenbeweging",
    ],
    explanation: "Spijsvertering breekt voedsel af en helpt het lichaam voedingsstoffen op te nemen.",
    theoryLines: ["Voedsel gaat door een spijsverteringsweg.", "Opname verplaatst nuttige stoffen naar het bloed."],
  },
  sci_p0_g1_plants_medium_02: {
    stem: "Wat doen plantenwortels meestal?",
    options: [
      "Water en voedingsstoffen opnemen en de plant stevig houden",
      "Flapperen als vleugels zodat de plant kan vliegen",
      "Harde muziek maken voor bijen",
      "Zonlicht in ijs veranderen",
    ],
    explanation: "Wortels groeien in de grond. Zij nemen water en voedingsstoffen op en houden de plant stevig, zodat die niet omvalt.",
    theoryLines: ["Verschillende plantdelen hebben verschillende taken.", "Stevige wortels ondersteunen hoge planten."],
  },
  sci_p0_g2_animals_hard_05: {
    stem: "Waarbij helpen vinnen een vis?",
    options: [
      "Zwemmen, sturen en evenwicht houden in water",
      "Op het land lopen zoals een paard",
      "Stuifmeel maken voor bloemen",
      "Bloed pompen zonder hart",
    ],
    explanation: "Verschillende vinnen hebben taken zoals vooruit bewegen, draaien en rechtop blijven. Samen helpen zij de vis goed onder water te bewegen.",
    theoryLines: ["Lichaamsbouw past bij de omgeving.", "Waterdieren hebben manieren nodig om door water te bewegen."],
  },
  sci_p0_g3_animals_easy_05: {
    stem: "Welke bedekking hebben vogels die helpt bij vliegen en warmte?",
    options: ["Veren", "Alleen natte vissenschubben", "Dikke boomschors", "Plastic schelpen"],
    explanation: "Veren zijn een belangrijk kenmerk van vogels. Zij helpen bij vliegen, sturen en warm blijven.",
    theoryLines: ["Vogels zijn de enige levende dieren met veren.", "Verschillende veren hebben verschillende taken."],
  },
  sci_p1_g4_animals_easy_06: {
    stem: "Waarvoor is een vogel met een dikke, sterke snavel het meest waarschijnlijk aangepast?",
    options: [
      "Harde zaden of noten kraken",
      "Oceaanplankton filteren met kieuwen",
      "Spinnenzijde spinnen voor webben",
      "Water alleen via wortels opnemen",
    ],
    explanation: "De vorm van de snavel past bij het eten. Dikke snavels kunnen hard voedsel aan; andere vormen passen bij nectar, vlees of zoeken in modder.",
    theoryLines: ["Bouw en functie horen bij elkaar.", "Soorten vergelijken laat aanpassingspatronen zien."],
  },
  sci_p1_g5_body_medium_03: {
    stem: "Wat is één belangrijke taak van de lever?",
    options: [
      "Helpen voedingsstoffen te verwerken en veel schadelijke stoffen uit het bloed te zuiveren.",
      "Bij elke ademteug lucht in de longen pompen.",
      "Urine bewaren die door de huid wordt gemaakt.",
      "De noodzaak van een spijsverteringsstelsel vervangen.",
    ],
    explanation: "De lever is een drukke chemische fabriek. Zij verwerkt voedingsstoffen en helpt gifstoffen en afvalstoffen in het bloed te beheren.",
    theoryLines: ["Orgaansystemen delen overlappingende taken.", "Een gezonde levensstijl ondersteunt de werking van de lever."],
  },
  sci_vol_g1_body_medium_02: {
    stem: "Waarom is water drinken belangrijk voor je lichaam?",
    options: [
      "Het helpt je lichaam te werken en je goed te voelen",
      "Het vervangt de noodzaak om te ademen",
      "Het zet spieren om in steen",
      "Het zorgt dat je nooit meer rust",
    ],
    explanation: "Water helpt je lichaam voldoende vocht te houden, zodat cellen en organen hun werk kunnen doen.",
    theoryLines: ["Mensen hebben elke dag water nodig.", "Dorst is een signaal dat je lichaam vocht nodig heeft."],
  },
  sci_vol_g3_animals_hard_02: {
    stem: "Waarom zijn vinnen belangrijk voor vissen?",
    options: [
      "Zij helpen vissen zwemmen, sturen en evenwicht houden",
      "Zij veranderen water in droog land",
      "Zij laten vissen ademen door veren",
      "Zij zorgen dat vissen nooit meer bewegen",
    ],
    explanation: "Vinnen zijn lichaamsdelen die vissen helpen bewegen door water en stabiel te blijven.",
    theoryLines: ["Verschillende vinnen hebben verschillende taken bij het zwemmen.", "Vislichamen zijn aangepast aan het leven in water."],
  },
  sci_g3_body_023: {
    stem: "Wat is één taak van de lever?",
    options: [
      "Helpen stoffen in het bloed te verwerken",
      "Lucht in de oren pompen",
      "Ongebruikt zonlicht bewaren",
      "Het skelet vervangen",
    ],
    explanation: "De lever heeft veel taken, waaronder het verwerken van voedingsstoffen en het zuiveren van bepaalde stoffen uit het bloed.",
    theoryLines: ["De lever is een groot orgaan in de buik.", "Lichaamsorganen werken samen om je gezond te houden."],
  },
};
Object.assign(overlay, LAST9);

// Update cache for curated
for (const [en, nl] of Object.entries(CURATED)) CACHE[en] = nl;
fs.writeFileSync(path.join(__dirname, "_mt-cache-nl-NL.json"), JSON.stringify(CACHE));

fs.writeFileSync(
  OUT,
  `/** Dutch (Netherlands) display overlay for science questions. */\nexport const SCIENCE_NL_NL_OVERLAY = ${JSON.stringify(overlay, null, 2)};\n`,
  "utf8",
);

// recount residual
let remainIds = 0;
const samples = [];
for (const [id, n] of Object.entries(overlay)) {
  const fields = [n.stem, n.explanation, ...(n.options || []), ...(n.theoryLines || [])];
  if (fields.some((f) => EN_BAD.test(f) && f !== "Gas")) {
    remainIds++;
    if (samples.length < 15) samples.push({ id, stem: n.stem, bad: fields.find((f) => EN_BAD.test(f) && f !== "Gas")?.slice(0, 100) });
  }
}
console.log(JSON.stringify({ total: Object.keys(overlay).length, badFields, remainIds, samples }, null, 2));
