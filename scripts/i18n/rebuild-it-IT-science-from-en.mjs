/**
 * Rebuild science it-IT overlay from EN authority + cache.
 * Spanish-contaminated rows are rebuilt from EN (offline phrase/word map).
 * Preserves IDs / option order / correctIndex.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { applyItalianAuthorityPostfix, esToIt } from "./offline-es-to-it-IT.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const cache = JSON.parse(
  fs.readFileSync(path.join(__dirname, "_mt-cache-it-IT-science.json"), "utf8"),
);

const ES_SPECIFIC =
  /[áíóúñ¿¡]|\b(cualquier|electricidad|descomponen|germinaron|océano|cuaderno|pantalones|suele|cubrirse|quedarse|relacionan|mareas|navegacion|multiples|destello|encuentran|convierten|envian|permiten que|attraverso él|mejor que|es dificil|afectan|Solo el|Los |Las |El |Qué |Por qué|según|también|tambien|puedes|quieres|hipotesis|suposicion|comprobar|facilmente|metales|caucho|tamano|relacion|registrados|migran|fluye|Fotosintesis|fotosintesis es|El fruto|Los animali|Los aislantes|En el ciclo|En una prova|Es el risultato|Lo que aprendiste|La seguridad en|Las stelle|El cuore|El Sole|Todos possono|La gravedad del Sole|Por qué la|Millones de|La scienza suele|Por qué es importante|ahorrrar|ahorrar|Reutilizar|riciclare materiali reduce|medio ambiente|rellenos|llamamos|medirse|aprendiste|significa|tener cuidado|todo sea|unas 60|fluyendo|se mueve|al lado|mantener limpios|mantiene a todos|sepa migliore|descompone|se hunde|sin dano|pedazos|desaparece|tortugas|amenazan|condiciones|ocurrio|comunidad|llenar|rios|lagos|pueden usar|etapa clave|hierba|sin caer|produces|articu|variable a la vez|conclusion|significan|durante y dopo|se encuentran|de forma natural|entra al|ogni ano|mitad del|cuidadosa|notas sobre|en casa y en)\b/i;

const EN_PHRASE = [
  ["photosynthesis", "fotosintesi"],
  ["Photosynthesis", "Fotosintesi"],
  ["respiration", "respirazione"],
  ["conductor", "conduttore"],
  ["insulator", "isolante"],
  ["electricity", "elettricità"],
  ["thermal", "termico"],
  ["gravity", "gravità"],
  ["orbit", "orbita"],
  ["orbits", "orbite"],
  ["planet", "pianeta"],
  ["planets", "pianeti"],
  ["star", "stella"],
  ["stars", "stelle"],
  ["ocean", "oceano"],
  ["water cycle", "ciclo dell'acqua"],
  ["evaporation", "evaporazione"],
  ["condensation", "condensazione"],
  ["precipitation", "precipitazione"],
  ["hypothesis", "ipotesi"],
  ["experiment", "esperimento"],
  ["observation", "osservazione"],
  ["conclusion", "conclusione"],
  ["variable", "variabile"],
  ["fair test", "prova equa"],
  ["recycle", "riciclare"],
  ["reuse", "riutilizzare"],
  ["pollution", "inquinamento"],
  ["plastic", "plastica"],
  ["habitat", "habitat"],
  ["food chain", "catena alimentare"],
  ["seed", "seme"],
  ["seeds", "semi"],
  ["fruit", "frutto"],
  ["leaf", "foglia"],
  ["leaves", "foglie"],
  ["heart", "cuore"],
  ["blood", "sangue"],
  ["oxygen", "ossigeno"],
  ["carbon dioxide", "anidride carbonica"],
  ["human body", "corpo umano"],
  ["solar system", "sistema solare"],
  ["Earth", "Terra"],
  ["Moon", "Luna"],
  ["Sun", "Sole"],
  ["Which of the following", "Quale delle seguenti"],
  ["Which of these", "Quale di questi"],
  ["What is the main", "Qual è il principale"],
  ["What is a", "Che cos'è un"],
  ["What is an", "Che cos'è un"],
  ["Why is", "Perché è"],
  ["How do", "Come"],
  ["Where is", "Dove si trova"],
  ["True or false", "Vero o falso"],
];

const WORD = {
  the: "",
  a: "un",
  an: "un",
  and: "e",
  or: "o",
  of: "di",
  to: "a",
  in: "in",
  on: "su",
  for: "per",
  with: "con",
  from: "da",
  into: "in",
  that: "che",
  this: "questo",
  these: "questi",
  those: "quei",
  is: "è",
  are: "sono",
  was: "era",
  were: "erano",
  be: "essere",
  have: "avere",
  has: "ha",
  had: "aveva",
  do: "fare",
  does: "fa",
  did: "ha fatto",
  can: "può",
  could: "poteva",
  should: "dovrebbe",
  would: "vorrebbe",
  will: "",
  we: "noi",
  you: "tu",
  they: "loro",
  he: "lui",
  she: "lei",
  it: "esso",
  our: "nostro",
  your: "tuo",
  their: "loro",
  his: "suo",
  her: "sua",
  its: "suo",
  not: "non",
  no: "no",
  yes: "sì",
  when: "quando",
  where: "dove",
  what: "cosa",
  which: "quale",
  who: "chi",
  how: "come",
  why: "perché",
  because: "perché",
  if: "se",
  then: "allora",
  also: "anche",
  only: "solo",
  each: "ogni",
  all: "tutti",
  some: "alcuni",
  many: "molti",
  more: "più",
  less: "meno",
  most: "la maggior parte",
  same: "stesso",
  different: "diverso",
  body: "corpo",
  animal: "animale",
  animals: "animali",
  plant: "pianta",
  plants: "piante",
  water: "acqua",
  air: "aria",
  light: "luce",
  heat: "calore",
  energy: "energia",
  material: "materiale",
  materials: "materiali",
  experiment: "esperimento",
  observe: "osservare",
  explain: "spiegare",
  between: "tra",
  without: "senza",
  about: "su",
  like: "come",
  through: "attraverso",
  during: "durante",
  before: "prima",
  after: "dopo",
  under: "sotto",
  over: "sopra",
  around: "intorno",
  large: "grande",
  small: "piccolo",
  important: "importante",
  main: "principale",
  natural: "naturale",
  safe: "sicuro",
  careful: "attento",
  change: "cambiare",
  measure: "misurare",
  result: "risultato",
  results: "risultati",
  data: "dati",
  test: "prova",
  tests: "prove",
  force: "forza",
  move: "muovere",
  moving: "in movimento",
  helps: "aiuta",
  help: "aiutare",
  protect: "proteggere",
  produce: "produrre",
  uses: "usa",
  use: "usare",
  using: "usando",
  called: "chiamato",
  means: "significa",
  show: "mostrare",
  shows: "mostra",
  includes: "include",
  include: "includere",
  reduce: "ridurre",
  waste: "rifiuti",
  environment: "ambiente",
  sugar: "zucchero",
  soil: "suolo",
  rain: "pioggia",
  cloud: "nuvola",
  clouds: "nuvole",
  sky: "cielo",
  night: "notte",
  day: "giorno",
  temperature: "temperatura",
  hard: "duro",
  soft: "morbido",
  solid: "solido",
  liquid: "liquido",
  gas: "gas",
  true: "vero",
  false: "falso",
  correct: "corretto",
  incorrect: "errato",
  always: "sempre",
  never: "mai",
  sometimes: "a volte",
  usually: "di solito",
  often: "spesso",
  very: "molto",
  too: "troppo",
  also: "anche",
  one: "uno",
  two: "due",
  three: "tre",
};

function matchCase(sample, replacement) {
  if (!sample || !replacement) return replacement;
  if (sample === sample.toUpperCase()) return replacement.toUpperCase();
  if (sample[0] === sample[0].toUpperCase()) {
    return replacement.charAt(0).toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

function enToIt(en) {
  let out = String(en ?? "");
  if (cache[out]) return applyItalianAuthorityPostfix(cache[out]);
  for (const [a, b] of EN_PHRASE) {
    if (out.includes(a)) out = out.split(a).join(b);
  }
  out = out.replace(/\b[A-Za-z']+\b/g, (w) => {
    const low = w.toLowerCase();
    if (WORD[low] != null) {
      const rep = WORD[low];
      if (!rep) return "";
      return matchCase(w, rep);
    }
    return w;
  });
  out = out.replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
  return applyItalianAuthorityPostfix(out);
}

function spanishSweep(s) {
  let out = esToIt(String(s ?? ""));
  const reps = [
    [/^Los /gm, "I "],
    [/^Las /gm, "Le "],
    [/^El /gm, "Il "],
    [/^En /gm, "In "],
    [/^Qué /gm, "Cosa "],
    [/^Por qué /gm, "Perché "],
    [/\bLos /g, "I "],
    [/\bLas /g, "Le "],
    [/\bEl /g, "Il "],
    [/\bQué /g, "Cosa "],
    [/\bPor qué\b/g, "Perché"],
    [/\bpuedes\b/gi, "puoi"],
    [/\bquieres\b/gi, "vuoi"],
    [/\btambien\b/gi, "anche"],
    [/\btambién\b/gi, "anche"],
    [/\bcualquier\b/gi, "qualsiasi"],
    [/\belectricidad\b/gi, "elettricità"],
    [/\bnavegacion\b/gi, "navigazione"],
    [/\bmultiples\b/gi, "molteplici"],
    [/\balimentos\b/gi, "alimenti"],
    [/\bdescomponen\b/gi, "decompongono"],
    [/\bconvierten\b/gi, "convertono"],
    [/\benvian\b/gi, "inviano"],
    [/\bencuentran\b/gi, "trovano"],
    [/\bpermiten que\b/gi, "permettono che"],
    [/\bfacilmente\b/gi, "facilmente"],
    [/\battraverso él\b/gi, "attraverso di esso"],
    [/\battraverso ellos\b/gi, "attraverso di essi"],
    [/\bmigliore que\b/gi, "meglio di"],
    [/\bmejor que\b/gi, "meglio di"],
    [/\bahorrar\b/gi, "risparmiare"],
    [/\breutilizar\b/gi, "riutilizzare"],
    [/\briciclare\b/gi, "riciclare"],
    [/\bmedio ambiente\b/gi, "ambiente"],
    [/\bllamamos\b/gi, "chiamiamo"],
    [/\bmedirse\b/gi, "essere misurato"],
    [/\baprendiste\b/gi, "hai imparato"],
    [/\bsignifica\b/gi, "significa"],
    [/\bsignifican\b/gi, "significano"],
    [/\bconclusion\b/gi, "conclusione"],
    [/\bhipotesis\b/gi, "ipotesi"],
    [/\bsuposicion\b/gi, "supposizione"],
    [/\bcomprobar\b/gi, "verificare"],
    [/\besperimento\b/gi, "esperimento"],
    [/\bvariable\b/gi, "variabile"],
    [/\bprova justa\b/gi, "prova equa"],
    [/\bfotosintesis\b/gi, "fotosintesi"],
    [/\bazucar\b/gi, "zucchero"],
    [/\boceano\b/gi, "oceano"],
    [/\boceáno\b/gi, "oceano"],
    [/\bgravedad\b/gi, "gravità"],
    [/\bmareas\b/gi, "maree"],
    [/\brelacionan\b/gi, "si collegano"],
    [/\bsuelo\b/gi, "suolo"],
    [/\bmantener\b/gi, "mantenere"],
    [/\bse mueve\b/gi, "si muove"],
    [/\bse mueven\b/gi, "si muovono"],
    [/\bse descompone\b/gi, "si decompone"],
    [/\bse hunde\b/gi, "affonda"],
    [/\bsin dano\b/gi, "senza danno"],
    [/\bpedazos\b/gi, "pezzi"],
    [/\bdesaparece\b/gi, "scompare"],
    [/\btortugas\b/gi, "tartarughe"],
    [/\bamenazan\b/gi, "minacciano"],
    [/\bMillones\b/g, "Milioni"],
    [/\bentran al\b/gi, "entrano nell'"],
    [/\bogni ano\b/gi, "ogni anno"],
    [/\bocurrio\b/gi, "è successo"],
    [/\bcuidadosa\b/gi, "attenta"],
    [/\bcomunidad\b/gi, "comunità"],
    [/\bllenando\b/gi, "riempiendo"],
    [/\brios\b/gi, "fiumi"],
    [/\blagos\b/gi, "laghi"],
    [/\betapa\b/gi, "fase"],
    [/\bhierba\b/gi, "erba"],
    [/\bsin caer\b/gi, "senza cadere"],
    [/\bproduces\b/gi, "produci"],
    [/\brellenos sanitarios\b/gi, "discariche"],
    [/\barticu\w*/gi, "articoli"],
    [/\bfluyendo\b/gi, "scorrendo"],
    [/\bunas\b/gi, "circa"],
    [/\bal lado\b/gi, "di lato"],
    [/\blimpios\b/gi, "puliti"],
    [/\bseguros\b/gi, "sicuri"],
    [/\bmantiene a\b/gi, "mantiene"],
    [/\bsepa migliore\b/gi, "sappia meglio"],
    [/\bde forma natural\b/gi, "in modo naturale"],
    [/\ba la vez\b/gi, "alla volta"],
    [/\ba la sombra\b/gi, "all'ombra"],
    [/\bCubrirse\b/g, "Coprirsi"],
    [/\bquedarse\b/gi, "restare"],
    [/\bdigerente\b/gi, "digerente"],
    [/\borganos\b/gi, "organi"],
    [/\bparedes\b/gi, "pareti"],
    [/\bcamisa\b/gi, "camicia"],
    [/\bobservador\b/gi, "osservatore"],
    [/\bsalon\b/gi, "salone"],
    [/\bcuaderno\b/gi, "quaderno"],
    [/\bpantalones\b/gi, "pantaloni"],
    [/\bsuele\b/gi, "di solito"],
    [/\bconveniente\b/gi, "conveniente"],
    [/\balguien\b/gi, "qualcuno"],
    [/\bdecidir\b/gi, "decidere"],
    [/\bsecondo lo\b/gi, "secondo ciò"],
    [/\bderriten\b/gi, "si sciolgono"],
    [/\btemperatura amb\w*/gi, "temperatura ambiente"],
    [/\blo mas similares\b/gi, "il più simili possibile"],
    [/\bsin relacion\b/gi, "senza relazione"],
    [/\bsin relación\b/gi, "senza relazione"],
    [/\bsin circuito\b/gi, "senza circuito"],
    [/\beléctrico\b/gi, "elettrico"],
    [/\breemplaza\b/gi, "sostituisce"],
    [/\bfuente\b/gi, "fonte"],
    [/\bconstante\b/gi, "costante"],
    [/\bgeneralmente\b/gi, "generalmente"],
    [/\bcantidad\b/gi, "quantità"],
    [/\bnumero\b/gi, "numero"],
    [/\bnombre\b/gi, "nome"],
    [/\btipo\b/gi, "tipo"],
    [/\bvalores\b/gi, "valori"],
    [/\bregistrados\b/gi, "registrati"],
    [/\bseed\b/gi, "seme"],
    [/\balrededor de\b/gi, "intorno a"],
    [/\bayudando\b/gi, "aiutando"],
    [/\bllevan\b/gi, "portano"],
    [/\bse comen\b/gi, "mangiano"],
    [/\bprotegerlas\b/gi, "proteggerle"],
    [/\bse desarrolla\b/gi, "si sviluppa"],
    [/\bdescripcion\b/gi, "descrizione"],
    [/\bcorresponde\b/gi, "corrisponde"],
    [/\breducen\b/gi, "riducono"],
    [/\bbloquean\b/gi, "bloccano"],
    [/\bflujo\b/gi, "flusso"],
    [/\bretener\b/gi, "trattenere"],
    [/\bfuera\b/gi, "fuori"],
    [/\bdentro\b/gi, "dentro"],
    [/\bdebe ser\b/gi, "deve essere"],
    [/\blo bastante\b/gi, "abbastanza"],
    [/\bpara que su\b/gi, "perché la sua"],
    [/\bmoldee\b/gi, "lo plasmi"],
    [/\ben forma\b/gi, "in forma"],
    [/\bproceso\b/gi, "processo"],
    [/\bevaporacion\b/gi, "evaporazione"],
    [/\bcondensacion\b/gi, "condensazione"],
    [/\bprecipitacion\b/gi, "precipitazione"],
    [/\blluvia\b/gi, "pioggia"],
    [/\bacqua dulce\b/gi, "acqua dolce"],
    [/\bHielo grueso\b/g, "Ghiaccio spesso"],
    [/\bsobre la\b/gi, "sulla"],
    [/\bQuedarse en\b/g, "Restare in"],
    [/\blugar fijo\b/gi, "luogo fisso"],
    [/\bdurante meses\b/gi, "per mesi"],
    [/\bluz solar\b/gi, "luce solare"],
    [/\bliberar\b/gi, "liberare"],
    [/\bSolo el\b/g, "Solo il"],
    [/\bcolor exterior\b/gi, "colore esterno"],
    [/\bdetermina\b/gi, "determina"],
    [/\bnaturales como\b/gi, "naturali come"],
  ];
  for (const [re, it] of reps) out = out.replace(re, it);
  return applyItalianAuthorityPostfix(out);
}

function polishString(itVal, enVal) {
  const en = String(enVal ?? "");
  if (cache[en]) return applyItalianAuthorityPostfix(cache[en]);

  const current = String(itVal ?? "");
  if (ES_SPECIFIC.test(current) || ES_SPECIFIC.test(spanishSweep(current))) {
    // Rebuild from EN when Spanish contamination is present
    const fromEn = enToIt(en);
    const fromEs = spanishSweep(current || en);
    const score = (s) => ((String(s).match(ES_SPECIFIC) || []).length);
    let best = score(fromEn) <= score(fromEs) ? fromEn : fromEs;
    best = spanishSweep(best);
    // if still Spanish-specific, force EN path
    if (ES_SPECIFIC.test(best)) best = spanishSweep(enToIt(en));
    return best;
  }
  return applyItalianAuthorityPostfix(current || enToIt(en));
}

function transformQuestion(enQ, itQ) {
  /** @type {Record<string, unknown>} */
  const row = {};
  for (const [k, ev] of Object.entries(enQ)) {
    const iv = itQ?.[k];
    if (k === "correctIndex" || k === "correctIndexes" || k === "id") {
      row[k] = ev;
      continue;
    }
    if (typeof ev === "string") row[k] = polishString(iv ?? ev, ev);
    else if (Array.isArray(ev)) {
      row[k] = ev.map((item, i) =>
        typeof item === "string" ? polishString(Array.isArray(iv) ? iv[i] ?? item : item, item) : item,
      );
    } else row[k] = iv ?? ev;
  }
  return row;
}

async function main() {
  const enMod = await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href);
  const itPath = path.join(ROOT, "data/science-questions-it-IT-overlay.js");
  let current = {};
  if (fs.existsSync(itPath)) {
    current = (await import(pathToFileURL(itPath).href + `?t=${Date.now()}`)).SCIENCE_IT_IT_OVERLAY;
  }
  const en = enMod.SCIENCE_EN_OVERLAY;
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const id of Object.keys(en)) out[id] = transformQuestion(en[id], current[id]);

  let mismatch = 0;
  for (const id of Object.keys(en)) {
    if (en[id].correctIndex !== out[id].correctIndex) mismatch += 1;
    if ((en[id].options || []).length !== (out[id].options || []).length) mismatch += 1;
  }

  // second pass until ES_SPECIFIC stabilizes
  for (let pass = 0; pass < 3; pass += 1) {
    let changed = 0;
    for (const id of Object.keys(en)) {
      const row = out[id];
      const next = transformQuestion(en[id], row);
      if (JSON.stringify(next) !== JSON.stringify(row)) {
        out[id] = next;
        changed += 1;
      }
    }
    if (!changed) break;
  }

  const blob = JSON.stringify(out);
  const esLeft = (blob.match(ES_SPECIFIC) || []).length;
  const soloEl = (blob.match(/Solo el /g) || []).length;
  const los = (blob.match(/"Los /g) || []).length;

  fs.writeFileSync(
    itPath,
    "/** Italian (Italy) science overlay — rebuilt offline from EN authority. */\n" +
      `export const SCIENCE_IT_IT_OVERLAY = ${JSON.stringify(out, null, 2)};\n`,
    "utf8",
  );
  console.log({ ids: Object.keys(out).length, mismatch, esLeft, soloEl, los });
}

main();
