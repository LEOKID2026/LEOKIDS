/**
 * Emit data/english-questions/word-meanings/it-IT.js — full Italian mapping by word ID.
 * Polysemy handled by category context (not label-only mapping).
 *
 * Run: node scripts/i18n/generate-english-word-meanings-it-IT.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WORD_MEANINGS_EN } from "../../data/english-questions/word-meanings/en.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "data/english-questions/word-meanings/it-IT.js");
const CACHE_PATH = path.join(__dirname, "_mt-cache-it-IT-meanings.json");
const OFFLINE = process.env.IT_IT_OFFLINE === "1" || process.argv.includes("--offline");

/**
 * Curated Italian glosses by English word ID (context-checked).
 * Category-specific overrides win over global ID overrides.
 */
const GLOBAL_OVERRIDES = {
  // Polysemy-critical IDs (defaults; category map may refine)
  grade: "voto", // school mark sense by default; school category refines to "classe" where needed
  mark: "voto",
  class: "classe",
  ticket: "biglietto",
  port: "porto",
  bank: "banca",
  watch: "guardare", // verb sense default in actions; house/tech may differ
  light: "luce",
  right: "destra",
  bat: "pipistrello",
  juice: "succo",
  eraser: "gomma",
  classroom: "aula",
  car: "auto",
  bus: "autobus",
  train: "treno",
  plane: "aereo",
  computer: "computer",
  laptop: "portatile",
  headphones: "cuffie",
  phone: "telefono",
  refrigerator: "frigorifero",
  fridge: "frigorifero",
  stove: "fornello",
  field: "campo",
  soccer: "calcio",
  football: "football americano",
  cookie: "biscotto",
  candy: "caramella",
  vacation: "vacanze",
  elevator: "ascensore",
  apartment: "appartamento",
  trash: "spazzatura",
  garbage: "rifiuti",
  movie: "film",
  cell: "cellula",
};

/** Category-scoped overrides for polysemy */
const CATEGORY_OVERRIDES = {
  school: {
    grade: "voto", // mark/score in school context; "classe" is class group
    class: "classe",
    student: "alunno",
    teacher: "insegnante",
    mark: "voto",
  },
  travel: {
    ticket: "biglietto",
    port: "porto",
    watch: "orologio", // travel gear sense rare; keep ticket/port authority
  },
  community: {
    bank: "banca",
    port: "porto",
  },
  actions: {
    watch: "guardare",
    mark: "segnare",
  },
  house: {
    light: "luce",
    watch: "orologio",
  },
  technology: {
    watch: "orologio",
    mouse: "mouse",
  },
  animals: {
    bat: "pipistrello",
    mouse: "topo",
  },
  sports: {
    bat: "mazza",
    right: "destro",
  },
  body: {
    right: "destro",
  },
  health: {
    cold: "raffreddore",
  },
  weather: {
    cold: "freddo",
  },
};

const DICT = {
  // animals
  dog: "cane", cat: "gatto", bird: "uccello", fish: "pesce", rabbit: "coniglio",
  horse: "cavallo", cow: "mucca", sheep: "pecora", lion: "leone", dolphin: "delfino",
  tiger: "tigre", bear: "orso", elephant: "elefante", monkey: "scimmia", snake: "serpente",
  turtle: "tartaruga", frog: "rana", butterfly: "farfalla", bee: "ape", spider: "ragno",
  mouse: "topo", pig: "maiale", duck: "anatra", chicken: "gallina", owl: "gufo",
  eagle: "aquila", shark: "squalo", whale: "balena", penguin: "pinguino", zebra: "zebra",
  giraffe: "giraffa", kangaroo: "canguro", fox: "volpe", wolf: "lupo", deer: "cervo",
  squirrel: "scoiattolo", hedgehog: "riccio", bat: "pipistrello",
  // colors
  red: "rosso", blue: "blu", yellow: "giallo", green: "verde", orange: "arancione",
  purple: "viola", pink: "rosa", black: "nero", white: "bianco", brown: "marrone",
  gray: "grigio", silver: "argento", gold: "oro", navy: "blu navy", turquoise: "turchese",
  beige: "beige", maroon: "bordeaux", lime: "lime", cyan: "ciano", magenta: "magenta",
  indigo: "indaco", violet: "violetto", coral: "corallo", salmon: "salmone", tan: "beige scuro",
  olive: "oliva", khaki: "kaki", crimson: "cremisi", lavender: "lavanda", peach: "pesca",
  cream: "crema", ivory: "avorio",
  // numbers
  zero: "zero", one: "uno", two: "due", three: "tre", four: "quattro", five: "cinque",
  six: "sei", seven: "sette", eight: "otto", nine: "nove", ten: "dieci", twenty: "venti",
  eleven: "undici", twelve: "dodici", thirteen: "tredici", fourteen: "quattordici",
  fifteen: "quindici", sixteen: "sedici", seventeen: "diciassette", eighteen: "diciotto",
  nineteen: "diciannove", thirty: "trenta", forty: "quaranta", fifty: "cinquanta",
  sixty: "sessanta", seventy: "settanta", eighty: "ottanta", ninety: "novanta",
  hundred: "cento", thousand: "mille", million: "milione",
  // family
  mother: "madre", father: "padre", brother: "fratello", sister: "sorella",
  grandmother: "nonna", grandfather: "nonno", uncle: "zio", aunt: "zia", cousin: "cugino",
  son: "figlio", daughter: "figlia", baby: "bebè", parents: "genitori", children: "figli",
  twins: "gemelli", nephew: "nipote", niece: "nipote", husband: "marito", wife: "moglie",
  stepmother: "matrigna", stepfather: "patrigno", stepsister: "sorellastra",
  stepbrother: "fratellastro", godmother: "madrina", godfather: "padrino",
  // body
  head: "testa", eye: "occhio", ear: "orecchio", nose: "naso", mouth: "bocca",
  hand: "mano", foot: "piede", leg: "gamba", shoulder: "spalla", hair: "capelli",
  face: "viso", forehead: "fronte", cheek: "guancia", chin: "mento", neck: "collo",
  arm: "braccio", elbow: "gomito", wrist: "polso", finger: "dito", thumb: "pollice",
  nail: "unghia", chest: "petto", back: "schiena", stomach: "stomaco", knee: "ginocchio",
  ankle: "caviglia", toe: "dito del piede", tooth: "dente", tongue: "lingua", lip: "labbro",
  eyebrow: "sopracciglio", eyelash: "ciglio",
  // food
  apple: "mela", bread: "pane", milk: "latte", egg: "uovo", cheese: "formaggio",
  banana: "banana", water: "acqua", cake: "torta", rice: "riso", salad: "insalata",
  orange: "arancia", strawberry: "fragola", grape: "uva", watermelon: "anguria",
  tomato: "pomodoro", cucumber: "cetriolo", carrot: "carota", potato: "patata",
  onion: "cipolla", meat: "carne", soup: "zuppa", pasta: "pasta", pizza: "pizza",
  sandwich: "panino", ice_cream: "gelato", chocolate: "cioccolato", juice: "succo",
  coffee: "caffè", tea: "tè", butter: "burro", honey: "miele", salt: "sale",
  pepper: "pepe", sugar: "zucchero",
  // school
  book: "libro", pen: "penna", pencil: "matita", desk: "banco", chair: "sedia",
  teacher: "insegnante", student: "alunno", classroom: "aula", backpack: "zaino",
  notebook: "quaderno", eraser: "gomma", ruler: "righello", calculator: "calcolatrice",
  dictionary: "dizionario", library: "biblioteca", homework: "compiti", test: "verifica",
  exam: "esame", grade: "voto", lesson: "lezione", subject: "materia", break: "ricreazione",
  bell: "campanella", board: "lavagna", marker: "pennarello", chalk: "gesso",
  scissors: "forbici", glue: "colla", stapler: "spillatrice", paper: "carta", folder: "cartella",
  // weather
  sun: "sole", rain: "pioggia", cloud: "nuvola", wind: "vento", snow: "neve",
  hot: "caldo", cold: "freddo", warm: "tepido", storm: "temporale", sunny: "soleggiato",
  rainy: "piovoso", cloudy: "nuvoloso", windy: "ventoso", snowy: "nevoso", foggy: "nebbioso",
  humid: "umido", dry: "secco", temperature: "temperatura", forecast: "previsioni",
  lightning: "fulmine", thunder: "tuono", rainbow: "arcobaleno", hail: "grandine",
  frost: "gelo", breeze: "brezza", tornado: "tornado", hurricane: "uragano",
  season: "stagione", spring: "primavera", summer: "estate", autumn: "autunno", winter: "inverno",
  // sports
  football: "football americano", basketball: "pallacanestro", tennis: "tennis",
  swimming: "nuoto", running: "corsa", cycling: "ciclismo", yoga: "yoga", hiking: "escursionismo",
  volleyball: "pallavolo", baseball: "baseball", soccer: "calcio", golf: "golf",
  skiing: "sci", skating: "pattinaggio", surfing: "surf", diving: "immersione",
  boxing: "boxe", wrestling: "lotta", gymnastics: "ginnastica", karate: "karate",
  judo: "judo", badminton: "badminton", ping_pong: "ping-pong", chess: "scacchi",
  checkers: "dama", team: "squadra", player: "giocatore", coach: "allenatore",
  referee: "arbitro", score: "punteggio", goal: "gol", ball: "palla", field: "campo",
  stadium: "stadio",
  // travel
  car: "auto", bus: "autobus", train: "treno", plane: "aereo", hotel: "hotel",
  beach: "spiaggia", mountain: "montagna", passport: "passaporto", taxi: "taxi",
  bicycle: "bicicletta", motorcycle: "motocicletta", ship: "nave", boat: "barca",
  helicopter: "elicottero", suitcase: "valigia", ticket: "biglietto", luggage: "bagagli",
  map: "mappa", compass: "bussola", camera: "fotocamera", tourist: "turista",
  trip: "viaggio", vacation: "vacanze", journey: "viaggio", destination: "destinazione",
  airport: "aeroporto", station: "stazione", port: "porto", bridge: "ponte",
  road: "strada", street: "via", city: "città", country: "paese", continent: "continente",
  // emotions
  happy: "felice", sad: "triste", angry: "arrabbiato", excited: "entusiasta",
  tired: "stanco", scared: "spaventato", proud: "orgoglioso", worried: "preoccupato",
  surprised: "sorpreso", confused: "confuso", embarrassed: "imbarazzato",
  disappointed: "deluso", frustrated: "frustrato", calm: "calmo", nervous: "nervoso",
  confident: "sicuro", shy: "timido", brave: "coraggioso", afraid: "impaurito",
  jealous: "geloso", grateful: "grato", lonely: "solo", cheerful: "allegro",
  content: "contento", anxious: "ansioso", relaxed: "rilassato", stressed: "stressato",
  peaceful: "sereno",
  // actions
  run: "correre", jump: "saltare", read: "leggere", write: "scrivere", draw: "disegnare",
  sing: "cantare", dance: "ballare", play: "giocare", walk: "camminare", sit: "sedersi",
  stand: "stare in piedi", sleep: "dormire", eat: "mangiare", drink: "bere", cook: "cucinare",
  clean: "pulire", wash: "lavare", brush: "spazzolare", study: "studiare", learn: "imparare",
  teach: "insegnare", listen: "ascoltare", speak: "parlare", talk: "parlare", ask: "chiedere",
  answer: "rispondere", think: "pensare", remember: "ricordare", forget: "dimenticare",
  understand: "capire", know: "sapere", see: "vedere", look: "guardare", watch: "guardare",
  hear: "sentire", feel: "sentire", touch: "toccare", hold: "tenere", take: "prendere",
  give: "dare", buy: "comprare", sell: "vendere", help: "aiutare", work: "lavorare", rest: "riposare",
  // house
  kitchen: "cucina", bedroom: "camera da letto", living_room: "soggiorno", bathroom: "bagno",
  garden: "giardino", window: "finestra", door: "porta", roof: "tetto", wall: "muro",
  floor: "pavimento", ceiling: "soffitto", stairs: "scale", balcony: "balcone",
  basement: "seminterrato", attic: "soffitta", garage: "garage", yard: "cortile",
  fence: "recinzione", gate: "cancello", lock: "serratura", key: "chiave", light: "luce",
  lamp: "lampada", table: "tavolo", bed: "letto", sofa: "divano", shelf: "mensola",
  closet: "armadio", mirror: "specchio", picture: "quadro", clock: "orologio",
  television: "televisione", computer: "computer", refrigerator: "frigorifero",
  stove: "fornello", oven: "forno", sink: "lavandino", shower: "doccia", bathtub: "vasca",
  toilet: "water", towel: "asciugamano", soap: "sapone", toothbrush: "spazzolino",
  toothpaste: "dentifricio",
  // community
  library: "biblioteca", park: "parco", hospital: "ospedale", police: "polizia",
  museum: "museo", supermarket: "supermercato", post_office: "ufficio postale",
  school: "scuola", church: "chiesa", synagogue: "sinagoga", mosque: "moschea",
  bank: "banca", restaurant: "ristorante", cafe: "caffè", shop: "negozio", market: "mercato",
  pharmacy: "farmacia", fire_station: "caserma dei vigili del fuoco", gas_station: "stazione di servizio",
  bus_stop: "fermata dell'autobus", train_station: "stazione ferroviaria", airport: "aeroporto",
  avenue: "viale", square: "piazza", neighborhood: "quartiere", town: "cittadina", village: "villaggio",
  // technology
  tablet: "tablet", keyboard: "tastiera", screen: "schermo", robot: "robot", internet: "internet",
  laptop: "portatile", printer: "stampante", scanner: "scanner", speaker: "altoparlante",
  microphone: "microfono", headphones: "cuffie", smartphone: "smartphone", app: "app",
  website: "sito web", email: "email", message: "messaggio", video: "video", photo: "foto",
  file: "file", download: "scaricare", upload: "caricare", search: "cercare",
  password: "password", account: "account", software: "software", program: "programma",
  game: "gioco", social_media: "social media", wifi: "wifi", bluetooth: "bluetooth",
  battery: "batteria", charger: "caricabatterie",
  // health
  doctor: "medico", nurse: "infermiere", medicine: "medicina", healthy: "sano", hurt: "fare male",
  exercise: "esercizio", clinic: "clinica", dentist: "dentista", patient: "paziente",
  appointment: "appuntamento", checkup: "controllo", treatment: "cura", surgery: "intervento",
  bandage: "benda", pill: "pillola", injection: "iniezione", vaccine: "vaccino",
  fever: "febbre", cough: "tosse", headache: "mal di testa", stomachache: "mal di stomaco",
  toothache: "mal di denti", flu: "influenza", allergy: "allergia", pain: "dolore",
  sick: "malato", well: "bene", better: "meglio", worse: "peggio", recover: "guarire",
  // environment
  recycle: "riciclare", clean_water: "acqua pulita", tree: "albero", planet: "pianeta",
  save_energy: "risparmiare energia", pollution: "inquinamento", nature: "natura",
  forest: "foresta", ocean: "oceano", sea: "mare", river: "fiume", lake: "lago",
  hill: "collina", valley: "valle", desert: "deserto", island: "isola", sky: "cielo",
  moon: "luna", star: "stella", flower: "fiore", grass: "erba", leaf: "foglia",
  root: "radice", branch: "ramo", animal: "animale", insect: "insetto", protect: "proteggere",
  save: "salvare", waste: "rifiuti", bin: "bidone", dirty: "sporco", fresh: "fresco",
  fresh_air: "aria fresca",
  // culture
  tradition: "tradizione", music: "musica", language: "lingua", holiday: "festa",
  flag: "bandiera", story: "storia", art: "arte", painting: "pittura", drawing: "disegno",
  sculpture: "scultura", theater: "teatro", film: "film", actor: "attore", actress: "attrice",
  director: "regista", song: "canzone", singer: "cantante", musician: "musicista",
  instrument: "strumento", piano: "pianoforte", guitar: "chitarra", violin: "violino",
  drum: "tamburo", writer: "scrittore", poem: "poesia", poetry: "poesia", festival: "festival",
  celebration: "celebrazione", party: "festa", custom: "usanza", religion: "religione",
  faith: "fede", prayer: "preghiera", ceremony: "cerimonia",
  // history
  hero: "eroe", leader: "leader", past: "passato", today: "oggi", future: "futuro",
  memory: "memoria", ancient: "antico", old: "vecchio", new: "nuovo", modern: "moderno",
  century: "secolo", year: "anno", month: "mese", week: "settimana", day: "giorno",
  hour: "ora", minute: "minuto", second: "secondo", time: "tempo", date: "data",
  event: "evento", war: "guerra", peace: "pace", battle: "battaglia", victory: "vittoria",
  defeat: "sconfitta", king: "re", queen: "regina", prince: "principe", princess: "principessa",
  castle: "castello", palace: "palazzo", monument: "monumento", artifact: "reperto",
  discovery: "scoperta", invention: "invenzione", explorer: "esploratore", scientist: "scienziato",
  // global_issues
  climate: "clima", recycle_bin: "cestino per il riciclo", energy: "energia",
  planet_earth: "pianeta Terra", volunteer: "volontario", environment: "ambiente",
  air_pollution: "inquinamento dell'aria", water_pollution: "inquinamento dell'acqua",
  plastic: "plastica", reuse: "riutilizzare", reduce: "ridurre", conserve: "conservare",
  preserve: "preservare", endangered: "in pericolo", extinct: "estinto", species: "specie",
  habitat: "habitat", deforestation: "deforestazione", global_warming: "riscaldamento globale",
  greenhouse_effect: "effetto serra", renewable_energy: "energia rinnovabile",
  solar_energy: "energia solare", wind_energy: "energia eolica", water_energy: "energia idrica",
  clean_energy: "energia pulita", fossil_fuel: "combustibile fossile",
  carbon_footprint: "impronta di carbonio", climate_change: "cambiamento climatico",
  drought: "siccità", flood: "alluvione", earthquake: "terremoto", tsunami: "tsunami",
  disaster: "disastro", emergency: "emergenza", aid: "aiuti", support: "sostegno",
  charity: "beneficenza", donation: "donazione", fundraise: "raccogliere fondi",
  campaign: "campagna", awareness: "consapevolezza", education: "istruzione",
  knowledge: "conoscenza", information: "informazione",
};

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), "utf8");
}

async function mt(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=it&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || [])
    .map((x) => x[0])
    .join("")
    .trim()
    .toLowerCase();
}

function resolveMeaning(cat, id, cache) {
  if (CATEGORY_OVERRIDES[cat]?.[id]) return CATEGORY_OVERRIDES[cat][id];
  if (DICT[id]) return DICT[id];
  if (GLOBAL_OVERRIDES[id]) return GLOBAL_OVERRIDES[id];
  if (cache[`${cat}:${id}`]) return cache[`${cat}:${id}`];
  return null;
}

async function main() {
  const cache = loadCache();
  /** @type {Record<string, Record<string, string>>} */
  const out = {};
  let missing = 0;
  for (const [cat, words] of Object.entries(WORD_MEANINGS_EN)) {
    out[cat] = {};
    for (const id of Object.keys(words)) {
      let meaning = resolveMeaning(cat, id, cache);
      if (!meaning) {
        if (OFFLINE) {
          meaning = id.replace(/_/g, " ");
          missing += 1;
        } else {
          try {
            meaning = await mt(id.replace(/_/g, " "));
            cache[`${cat}:${id}`] = meaning;
          } catch {
            meaning = id.replace(/_/g, " ");
            missing += 1;
          }
          await new Promise((r) => setTimeout(r, 20));
        }
      }
      out[cat][id] = meaning;
    }
  }
  // Ensure en category parity — if EN gained categories, keep them
  saveCache(cache);

  const body =
    `/**\n` +
    ` * Italian (Italy) (it-IT) meanings for English learning words.\n` +
    ` * Keys match WORD_LISTS English word IDs; values are child-friendly Italian glosses.\n` +
    ` * Polysemy resolved by category context (grade/mark/class/ticket/port/bank/watch/light/right/bat).\n` +
    ` * English learning targets are unchanged — these are instruction-locale glosses only.\n` +
    ` */\n\n` +
    `export const WORD_MEANINGS_IT_IT = ${JSON.stringify(out, null, 2)};\n`;
  fs.writeFileSync(OUT, body, "utf8");
  console.log("Wrote", OUT, "categories", Object.keys(out).length, "missing", missing);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
