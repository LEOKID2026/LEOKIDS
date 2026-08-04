/**
 * Offline residual EN pack strings + Spanish science polish.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { esToIt, applyItalianAuthorityPostfix } from "./offline-es-to-it-IT.mjs";

const ROOT = process.cwd();

const EXACT = new Map([
  ["Too many breaks - try again in a moment", "Troppe pause — riprova tra un momento"],
  ["Choose a different arrangement with the same total.", "Scegli una disposizione diversa con lo stesso totale."],
  [
    "Share {total} {itemLabel} equally among {children} children. How many does each child get?",
    "Dividi {total} {itemLabel} in parti uguali tra {children} bambini. Quanti ne riceve ciascun bambino?",
  ],
  [
    "Share {total} {itemLabel} equally among {children} children. How many does each child get, and how many are left?",
    "Dividi {total} {itemLabel} in parti uguali tra {children} bambini. Quanti ne riceve ciascun bambino e quanti ne restano?",
  ],
  [
    "There are {total} {itemLabel}. Put {groupSize} in each bag. How many full bags can you make?",
    "Ci sono {total} {itemLabel}. Metti {groupSize} in ogni sacchetto. Quanti sacchetti pieni puoi fare?",
  ],
  [
    "There are {total} {itemLabel}. Put {groupSize} in each bag. How many full bags can you make, and how many are left?",
    "Ci sono {total} {itemLabel}. Metti {groupSize} in ogni sacchetto. Quanti sacchetti pieni puoi fare e quanti ne restano?",
  ],
  ["Check how many full bags you can make.", "Controlla quanti sacchetti pieni puoi fare."],
  ["Choose how many full bags you can make", "Scegli quanti sacchetti pieni puoi fare"],
  ["Choose how many each child gets and how many are left", "Scegli quanti ne riceve ciascun bambino e quanti ne restano"],
  ["Choose how many each child gets", "Scegli quanti ne riceve ciascun bambino"],
  ["Choose how many slices are marked.", "Scegli quante fette sono segnate."],
  ["We couldn't load the game. You can try again.", "Non siamo riusciti a caricare il gioco. Puoi riprovare."],
  [
    "In the full parent portal you can create unlimited worksheets, choose additional topics, and combine sheets with digital practice and progress tracking.",
    "Nel portale completo per i genitori puoi creare schede didattiche illimitate, scegliere argomenti aggiuntivi e combinare schede con esercitazione digitale e monitoraggio del progresso.",
  ],
  ["Too many attempts - please try again in a few minutes.", "Troppi tentativi — riprova tra qualche minuto."],
  [
    "Deleting the child failed - please try again or contact support.",
    "Eliminazione del bambino non riuscita — riprova o contatta l'assistenza.",
  ],
  ["Ready worksheet", "Scheda didattica pronta"],
  ["Create worksheet", "Crea scheda didattica"],
  ["Something went wrong. Please try again.", "Qualcosa è andato storto. Riprova."],
  [
    "Choose a subject, grade, topic and level - then create a worksheet ready to print.",
    "Scegli materia, classe, argomento e livello — poi crea una scheda didattica pronta da stampare.",
  ],
  [
    "Anteprima data is not available. Go back to the worksheets page and choose a worksheet again.",
    "I dati di anteprima non sono disponibili. Torna alla pagina delle schede didattiche e scegli di nuovo una scheda.",
  ],
  ["Too many attempts. Please try again later.", "Troppi tentativi. Riprova più tardi."],
  ["Choose a comparison form in a short sentence.", "Scegli una forma di confronto in una frase breve."],
]);

const PHRASE = [
  [/\bPlease try again\b/g, "Riprova"],
  [/\bplease try again\b/g, "riprova"],
  [/\btry again\b/gi, "riprova"],
  [/\bworksheets\b/gi, "schede didattiche"],
  [/\bworksheet\b/gi, "scheda didattica"],
  [/\bChoose a\b/g, "Scegli un"],
  [/\bHow many\b/g, "Quanti"],
  [/\bhow many\b/g, "quanti"],
  [/\bYour child\b/g, "Tuo figlio"],
  [/\bParent report\b/g, "Report per i genitori"],
  [/\bSelect a\b/g, "Seleziona un"],
  [/\bFill in the\b/g, "Completa"],
  [/\bWrite the\b/g, "Scrivi"],
  [/\bContinue to\b/g, "Continua a"],
  [/\bWhat is the\b/g, "Qual è"],
  [/\bClick here\b/g, "Clicca qui"],
  [/\bAnswer key\b/g, "Soluzioni"],
  [/\bAll grades\b/g, "Tutte le classi"],
  [/\bChoose grade\b/g, "Scegli la classe"],
  [/\bToo many breaks\b/gi, "Troppe pause"],
  [/\bin a moment\b/gi, "tra un momento"],
  [/\bToo many attempts\b/gi, "Troppi tentativi"],
  [/\bin a few minutes\b/gi, "tra qualche minuto"],
  [/\bSomething went wrong\b/g, "Qualcosa è andato storto"],
  [/\bGo back to the\b/g, "Torna alla"],
  [/\bcontact support\b/gi, "contatta l'assistenza"],
];

function looksEnglish(s) {
  const en = (
    s.match(
      /\b(the|and|with|that|this|from|into|about|because|which|when|what|how|please|choose|try|again|worksheet|children|among|equally|bags|slices|failed|contact|support|available|create|unlimited|topics|combine|digital|practice|progress|tracking|arrangement|total|share|marked|load|game|moment|breaks|attempts|minutes|later|subject|grade|topic|level|print|ready|deleting|child)\b/gi,
    ) || []
  ).length;
  return en >= 3 || /\b(Please|try again|worksheet|How many|Choose a)\b/i.test(s);
}

function fixPackStr(s) {
  if (EXACT.has(s)) return EXACT.get(s);
  let out = s;
  if (looksEnglish(out)) {
    for (const [re, it] of PHRASE) out = out.replace(re, it);
  }
  return applyItalianAuthorityPostfix(out);
}

function mapPack(node) {
  if (typeof node === "string") return fixPackStr(node);
  if (Array.isArray(node)) return node.map(mapPack);
  if (node && typeof node === "object") {
    /** @type {Record<string, unknown>} */
    const o = {};
    for (const [k, v] of Object.entries(node)) o[k] = mapPack(v);
    return o;
  }
  return node;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".json")) out.push(p);
  }
  return out;
}

function polishScienceString(s) {
  let out = String(s);
  if (
    !/[áíóúñ¿¡]/.test(out) &&
    !/\b(puedes|quieres|también|tambien|hoja|estudiante|práctica|respuesta|transparente|deja|pasar|modo|blandos|doblan|facilidad|mientras|duros|intensidad|llama|distinguir|blando|mediciones|misma|seguro|correcta|difieren|medir|hipótesis|hipotesis|suposicion|suposición|comprobar|gotitas|ventanas|frias|frías|vapor|hierve|objeto|descubrir|materiale transparente|Es lo que)\b/i.test(
      out,
    )
  ) {
    return out;
  }
  out = esToIt(out);
  const reps = [
    [/\bpuedes\b/gi, "puoi"],
    [/\bquieres\b/gi, "vuoi"],
    [/\btambién\b/gi, "anche"],
    [/\btambien\b/gi, "anche"],
    [/\bde modo que\b/gi, "in modo che"],
    [/\bcomo el\b/gi, "come il"],
    [/\bcomo la\b/gi, "come la"],
    [/\bblandos\b/gi, "morbidi"],
    [/\bdoblan\b/gi, "si piegano"],
    [/\bfacilidad\b/gi, "facilità"],
    [/\bmientras\b/gi, "mentre"],
    [/\bduros\b/gi, "duri"],
    [/\baislar\b/gi, "isolare"],
    [/\bintensidad\b/gi, "intensità"],
    [/\bllama\b/gi, "fiamma"],
    [/\bcambio\b/gi, "cambia"],
    [/\bdistinguir\b/gi, "distinguere"],
    [/\bblando\b/gi, "morbido"],
    [/\bmediciones\b/gi, "misurazioni"],
    [/\bmisma\b/gi, "stessa"],
    [/\bseguro\b/gi, "sicuro"],
    [/\bcorrecta\b/gi, "corretta"],
    [/\bdifieren\b/gi, "differiscono"],
    [/\bsalir mal\b/gi, "andare storto"],
    [/\bmedir\b/gi, "misurare"],
    [/\bhip[oó]tesis\b/gi, "ipotesi"],
    [/\bsuposici[oó]n\b/gi, "supposizione"],
    [/\bcomprobar\b/gi, "verificare"],
    [/\bgotitas\b/gi, "goccioline"],
    [/\bventanas\b/gi, "finestre"],
    [/\bfri[ae]s\b/gi, "fredde"],
    [/\bvapor\b/gi, "vapore"],
    [/\bhierve\b/gi, "bolle"],
    [/\btransparente\b/gi, "trasparente"],
    [/\bdeja pasar\b/gi, "lascia passare"],
    [/\battraverso [eé]l\b/gi, "attraverso di esso"],
    [/\bel vetro\b/gi, "il vetro"],
    [/\bel acqua\b/gi, "l'acqua"],
    [/\bEs lo que\b/g, "È ciò che"],
    [/\bdescubrir\b/gi, "scoprire"],
    [/\bun objeto\b/gi, "un oggetto"],
    [/\bde uno\b/gi, "da uno"],
    [/\bcon mas\b/gi, "con più"],
    [/\bpropriedades\b/gi, "proprietà"],
    [/\bsentir\b/gi, "sentire"],
    [/\bquando el\b/gi, "quando l'"],
    [/\bquando la\b/gi, "quando la"],
    [/\bse convierte en\b/gi, "si trasforma in"],
    [/\bUna ipotesi\b/g, "Un'ipotesi"],
    [/\bes una\b/gi, "è una"],
    [/\bNo puedes\b/g, "Non puoi"],
    [/\bCome puedes\b/g, "Come puoi"],
    [/\bPuedes\b/g, "Puoi"],
    [/\bfirma que\b/gi, "conferma che"],
    [/\bel risultato\b/gi, "il risultato"],
    [/\bes confiable\b/gi, "è affidabile"],
    [/\bSi ambas\b/g, "Se entrambe le"],
    [/\bdan la stessa\b/gi, "danno la stessa"],
    [/\bestar mas\b/gi, "essere più"],
    [/\bSi difieren\b/g, "Se differiscono"],
    [/\bsabes que algo pudo\b/gi, "sai che qualcosa potrebbe"],
    [/\by puedes\b/gi, "e puoi"],
    [/\bde nuovo\b/gi, "di nuovo"],
    [/\blos materiali\b/gi, "i materiali"],
    [/\bse doblan\b/gi, "si piegano"],
    [/\bcon mas facilidad\b/gi, "più facilmente"],
    [/\bmentre que los\b/gi, "mentre i"],
    [/\bUn materiale trasparente lascia passare la luce\b/g, "Un materiale trasparente lascia passare la luce"],
  ];
  for (const [re, it] of reps) out = out.replace(re, it);
  return applyItalianAuthorityPostfix(out);
}

function polishScience(node, key = "") {
  if (typeof node === "string") {
    if (["id", "skillId", "topicId", "locale"].includes(key)) return node;
    return polishScienceString(node);
  }
  if (Array.isArray(node)) return node.map((x) => polishScience(x, key));
  if (node && typeof node === "object") {
    /** @type {Record<string, unknown>} */
    const o = {};
    for (const [k, v] of Object.entries(node)) {
      if (k === "correctIndex" || k === "correctIndexes") o[k] = v;
      else o[k] = polishScience(v, k);
    }
    return o;
  }
  return node;
}

function mainPacks() {
  let n = 0;
  for (const f of walk(path.join(ROOT, "content-packs/it-IT"))) {
    const obj = JSON.parse(fs.readFileSync(f, "utf8"));
    const out = mapPack(obj);
    if (JSON.stringify(obj) !== JSON.stringify(out)) {
      fs.writeFileSync(f, JSON.stringify(out, null, 2) + "\n", "utf8");
      n += 1;
    }
  }
  console.log("pack files updated", n);
}

async function mainScience() {
  const sciPath = path.join(ROOT, "data/science-questions-it-IT-overlay.js");
  const mod = await import(pathToFileURL(sciPath).href + `?t=${Date.now()}`);
  const exportName =
    Object.keys(mod).find((k) => k.includes("SCIENCE") && k.includes("IT")) ||
    Object.keys(mod).find((k) => k.includes("OVERLAY")) ||
    "SCIENCE_IT_IT_OVERLAY";
  const overlay = mod[exportName];
  if (!overlay) throw new Error("science overlay export missing: " + Object.keys(mod));
  const polished = polishScience(overlay);
  const blob = JSON.stringify(polished);
  console.log({
    leftPuedes: (blob.match(/\bpuedes\b/gi) || []).length,
    leftEsMark: (blob.match(/\b(también|estudiante|hoja de|práctica|inténtalo|quieres)\b/gi) || []).length,
    ids: Object.keys(polished).length,
  });
  const body =
    "/** Auto-polished it-IT science overlay (offline). Do not edit by hand unless needed. */\n" +
    `export const ${exportName} = ${JSON.stringify(polished, null, 2)};\n`;
  fs.writeFileSync(sciPath, body, "utf8");
  console.log("science rewritten", exportName);
}

mainPacks();
await mainScience();
