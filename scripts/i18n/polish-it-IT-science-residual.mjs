/**
 * Final residual Spanish / EN-mash polish for science overlay.
 * Offline only. Preserves correctIndex and option order.
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { applyItalianAuthorityPostfix, esToIt } from "./offline-es-to-it-IT.mjs";

const ROOT = process.cwd();
const cache = JSON.parse(
  fs.readFileSync(path.join(ROOT, "scripts/i18n/_mt-cache-it-IT-science.json"), "utf8"),
);

const BAD =
  /[áíóúñ¿¡]|\b(descripcion|corresponde|eléctrico|térmico|debe ser|lo bastante|para que su|gravedad|moldee|Muchos|manantiales|dependen|rutas|subterranea|planificacion|hidrologica|cortar|recarga|cambiar|presion|calidad|siempre|mejora|instante|sin mas|pruebas|Controlar|excepto|se prova|esencial|sacar|conclusion|confiable|Reemplaza|por completo|necesidad|hipotesis|rara vez|basta|cientifica|solida|Todo lo que|no estas|probando|se mantiene|igual|cantidad|tiempo|mezcla|aisla|independiente|revision|pares|esperimenti|campo|Prevenir|erosion|protegge|calidad|vientos|fuertes|sin effetto|Acqua —|através|rivers|gradually|wear|carry|away|rock|powerful|forces|carve|valleys|washes|cliffs|condition|supports|birth|strengthening|tropical|storm|Latent|fuel|systems|sea-surface|links|regional|risk|densidad|masa|contenida|volumen|determinado|disuelve|sin importar|temperatura|En general|mayor|solido|disolverse|caliente|fria|moves among|land|atmosphere|serious problem|makes|taste|better|fish|naturally|breaks|down|clean|sinks|harmlessly|floor|reaches|smaller|pieces|fully|disappears|Sea turtles|seabirds|mistake|food|Millions|tons|enter|every|year|threatening|marine|life|worldwide|greenhouse|gases|affect|nearby|sets)\b/i;

const FIX = [
  [/\bdescripcion\b/gi, "descrizione"],
  [/\bcorresponde\b/gi, "corrisponde"],
  [/\beléctrico\b/gi, "elettrico"],
  [/\btérmico\b/gi, "termico"],
  [/\bdebe ser\b/gi, "deve essere"],
  [/\blo bastante grande\b/gi, "abbastanza grande"],
  [/\bpara que su\b/gi, "affinché la sua"],
  [/\bgravedad\b/gi, "gravità"],
  [/\bmoldee\b/gi, "lo plasmi"],
  [/\ben forma\b/gi, "in forma"],
  [/\bcirca redonda\b/gi, "quasi rotonda"],
  [/\bMuchos\b/g, "Molti"],
  [/\bmanantiales\b/gi, "sorgenti"],
  [/\bdependen\b/gi, "dipendono"],
  [/\brutas\b/gi, "percorsi"],
  [/\bsubterranea\b/gi, "sotterranea"],
  [/\bplanificacion\b/gi, "pianificazione"],
  [/\bhidrologica\b/gi, "idrologica"],
  [/\bcortar\b/gi, "interrompere"],
  [/\brecarga\b/gi, "ricarica"],
  [/\bpresion\b/gi, "pressione"],
  [/\bcalidad\b/gi, "qualità"],
  [/\bsiempre\b/gi, "sempre"],
  [/\bmejora\b/gi, "migliora"],
  [/\bal instante\b/gi, "all'istante"],
  [/\bsin mas\b/gi, "senza altre"],
  [/\bpruebas\b/gi, "prove"],
  [/\bControlar\b/g, "Controllare"],
  [/\bexcepto\b/gi, "eccetto"],
  [/\bse prova\b/gi, "si prova"],
  [/\besencial\b/gi, "essenziale"],
  [/\bsacar una conclusion\b/gi, "trarre una conclusione"],
  [/\bconclusion\b/gi, "conclusione"],
  [/\bconfiable\b/gi, "affidabile"],
  [/\bReemplaza\b/g, "Sostituisce"],
  [/\breemplaza\b/gi, "sostituisce"],
  [/\bpor completo\b/gi, "completamente"],
  [/\bla necesidad\b/gi, "la necessità"],
  [/\bhipotesis\b/gi, "ipotesi"],
  [/\brara vez\b/gi, "raramente"],
  [/\bbasta\b/gi, "basta"],
  [/\bcientifica\b/gi, "scientifica"],
  [/\bsolida\b/gi, "solida"],
  [/\bTodo lo que\b/g, "Tutto ciò che"],
  [/\bno estas\b/gi, "non stai"],
  [/\bprobando\b/gi, "provando"],
  [/\bse mantiene igual\b/gi, "resta uguale"],
  [/\bcantidad\b/gi, "quantità"],
  [/\btiempo de mezcla\b/gi, "tempo di mescolamento"],
  [/\baisla\b/gi, "isola"],
  [/\bindependiente\b/gi, "indipendente"],
  [/\brevision por pares\b/gi, "revisione tra pari"],
  [/\besperimenti de campo\b/gi, "esperimenti sul campo"],
  [/\bPrevenir\b/g, "Prevenire"],
  [/\berosion\b/gi, "erosione"],
  [/\bvientos fuertes\b/gi, "venti forti"],
  [/\bsin effetto de\b/gi, "senza effetto della"],
  [/\bmoves among\b/gi, "si muove tra"],
  [/\bland\b/gi, "terra"],
  [/\batmosphere\b/gi, "atmosfera"],
  [/\bserious problem\b/gi, "problema grave"],
  [/\bmakes\b/gi, "fa"],
  [/\btaste better\b/gi, "avere un sapore migliore"],
  [/\bfish\b/gi, "pesci"],
  [/\bnaturally breaks\b/gi, "decompone naturalmente"],
  [/\bbreaks\b/gi, "si spezza"],
  [/\bdown in\b/gi, "in"],
  [/\bclean\b/gi, "pulita"],
  [/\bsinks\b/gi, "affonda"],
  [/\bharmlessly\b/gi, "senza danni"],
  [/\bfloor\b/gi, "fondo"],
  [/\breaches\b/gi, "raggiunge"],
  [/\bsmaller\b/gi, "più piccoli"],
  [/\bpieces\b/gi, "pezzi"],
  [/\bfully disappears\b/gi, "scompare del tutto"],
  [/\bSea turtles\b/g, "Le tartarughe marine"],
  [/\bseabirds\b/gi, "uccelli marini"],
  [/\bmistake\b/gi, "scambiano"],
  [/\bfood\b/gi, "cibo"],
  [/\bMillions\b/g, "Milioni"],
  [/\btons\b/gi, "tonnellate"],
  [/\benter\b/gi, "entrano nell'"],
  [/\bevery year\b/gi, "ogni anno"],
  [/\bthreatening\b/gi, "minacciando"],
  [/\bmarine life\b/gi, "la vita marina"],
  [/\bworldwide\b/gi, "in tutto il mondo"],
  [/\bgreenhouse gases\b/gi, "gas serra"],
  [/\baffect\b/gi, "influenzano"],
  [/\bnearby\b/gi, "vicino"],
  [/\bsets\b/gi, "stabilisce"],
  [/\bdensidad\b/gi, "densità"],
  [/\bmasa\b/gi, "massa"],
  [/\bcontenida\b/gi, "contenuta"],
  [/\bvolumen\b/gi, "volume"],
  [/\bdeterminado\b/gi, "determinato"],
  [/\bdisuelve\b/gi, "si dissolve"],
  [/\bsin importar\b/gi, "indipendentemente da"],
  [/\bEn general\b/g, "In generale"],
  [/\bmayor cantidad\b/gi, "maggiore quantità"],
  [/\bsolido\b/gi, "solido"],
  [/\bdisolverse\b/gi, "dissolversi"],
  [/\bcaliente\b/gi, "calda"],
  [/\bfria\b/gi, "fredda"],
  [/\bthrough rivers\b/gi, "attraverso fiumi"],
  [/\brivers\b/gi, "fiumi"],
  [/\bgradually\b/gi, "gradualmente"],
  [/\bwear down\b/gi, "consumano"],
  [/\bcarry away\b/gi, "portano via"],
  [/\brock\b/gi, "roccia"],
  [/\bpowerful\b/gi, "potenti"],
  [/\bforces\b/gi, "forze"],
  [/\bcarve\b/gi, "scavano"],
  [/\bvalleys\b/gi, "valli"],
  [/\bwashes\b/gi, "lava"],
  [/\bcliffs\b/gi, "scogliere"],
  [/\bcondition\b/gi, "condizione"],
  [/\bsupports\b/gi, "favorisce"],
  [/\bbirth\b/gi, "la formazione"],
  [/\bstrengthening\b/gi, "il rafforzamento"],
  [/\btropical storm\b/gi, "tempesta tropicale"],
  [/\bLatent\b/g, "Il calore latente"],
  [/\bfuel\b/gi, "carburante"],
  [/\bsystems\b/gi, "sistemi"],
  [/\bsea-surface\b/gi, "superficie del mare"],
  [/\blinks\b/gi, "si collega"],
  [/\bregional risk\b/gi, "rischio regionale"],
  [/\bprocess in quale\b/gi, "il processo in cui"],
  [/\bIn ciclo\b/g, "Nel ciclo"],
  [/\bPerché è plastica inquinamento\b/g, "Perché l'inquinamento da plastica"],
  [/\bun problema grave\b/gi, "un problema grave"],
  [/\bPlastic\b/g, "La plastica"],
  [/\boceano acqua\b/gi, "l'acqua dell'oceano"],
  [/\bper fish\b/gi, "per i pesci"],
  [/\boceano naturally\b/gi, "l'oceano naturalmente"],
  [/\bin clean, sicuro acqua\b/gi, "in acqua pulita e sicura"],
  [/\ba oceano fondo\b/gi, "sul fondo dell'oceano"],
  [/\bche reaches oceano\b/gi, "che raggiunge l'oceano"],
  [/\bin più piccoli e più piccoli pezzi\b/gi, "in pezzi sempre più piccoli"],
  [/\bbut mai\b/gi, "ma non"],
  [/\be seabirds\b/gi, "e gli uccelli marini"],
  [/\bspesso scambiano plastica per cibo\b/gi, "spesso scambiano la plastica per cibo"],
  [/\bMilioni di tonnellate di plastica entrano nell' oceano ogni anno\b/gi, "Milioni di tonnellate di plastica entrano nell'oceano ogni anno"],
  [/\bminacciando la vita marina in tutto il mondo\b/gi, "minacciando la vita marina in tutto il mondo"],
];

function polish(s, en) {
  if (cache[en]) return applyItalianAuthorityPostfix(cache[en]);
  let out = String(s ?? "");
  if (!BAD.test(out)) return applyItalianAuthorityPostfix(out);
  out = esToIt(out);
  for (const [re, it] of FIX) out = out.replace(re, it);
  out = out
    .replace(/\bamong\b/gi, "tra")
    .replace(/\bserious\b/gi, "grave")
    .replace(/\bproblem\b/gi, "problema")
    .replace(/\bbetter\b/gi, "migliore")
    .replace(/\bnaturally\b/gi, "naturalmente")
    .replace(/\bclean\b/gi, "pulita")
    .replace(/\bevery\b/gi, "ogni")
    .replace(/\byear\b/gi, "anno")
    .replace(/\bworldwide\b/gi, "in tutto il mondo")
    .replace(/\bnearby\b/gi, "vicino")
    .replace(/\bgases\b/gi, "gas")
    .replace(/\baffect\b/gi, "influenzano")
    .replace(/\bsets\b/gi, "stabilisce")
    .replace(/\bmoves\b/gi, "si muove")
    .replace(/\bland\b/gi, "terra")
    .replace(/\batmosphere\b/gi, "atmosfera")
    .replace(/\brivers\b/gi, "fiumi")
    .replace(/\bthrough\b/gi, "attraverso")
    .replace(/\bcause\b/gi, "causa")
    .replace(/\bdaily\b/gi, "quotidiane")
    .replace(/\btides\b/gi, "maree")
    .replace(/\bnear\b/gi, "vicino a")
    .replace(/\bcoast\b/gi, "costa")
    .replace(/\bwarm\b/gi, "caldo")
    .replace(/\bbecause\b/gi, "perché")
    .replace(/\bsalt\b/gi, "sale")
    .replace(/\babsorbs\b/gi, "assorbe")
    .replace(/\bradiation\b/gi, "radiazione")
    .replace(/\bbefore\b/gi, "prima che")
    .replace(/\breaches\b/gi, "raggiunga")
    .replace(/\bstrong\b/gi, "forte")
    .replace(/\bat school level\b/gi, "a livello scolastico")
    .replace(/\bda un\b/gi, "da un")
    .replace(/\bso\b/gi, "quindi")
    .replace(/\blinks a\b/gi, "si collega al")
    .replace(/\b\s{2,}/g, " ")
    .trim();
  return applyItalianAuthorityPostfix(out);
}

function map(enN, itN) {
  if (typeof enN === "string") return polish(itN ?? enN, enN);
  if (Array.isArray(enN)) return enN.map((x, i) => map(x, Array.isArray(itN) ? itN[i] : null));
  if (enN && typeof enN === "object") {
    /** @type {Record<string, unknown>} */
    const o = {};
    for (const [k, v] of Object.entries(enN)) {
      if (k === "correctIndex" || k === "correctIndexes" || k === "id") o[k] = v;
      else o[k] = map(v, itN?.[k]);
    }
    return o;
  }
  return enN;
}

async function main() {
  const en = (await import(pathToFileURL(path.join(ROOT, "data/science-questions-en-overlay.js")).href))
    .SCIENCE_EN_OVERLAY;
  const itPath = path.join(ROOT, "data/science-questions-it-IT-overlay.js");
  let it = (await import(pathToFileURL(itPath).href + `?t=${Date.now()}`)).SCIENCE_IT_IT_OVERLAY;
  for (let pass = 0; pass < 4; pass += 1) {
    it = map(en, it);
  }
  const blob = JSON.stringify(it);
  const left = (blob.match(BAD) || []).length;
  fs.writeFileSync(
    itPath,
    "/** Italian (Italy) science overlay — residual polish (offline). */\n" +
      `export const SCIENCE_IT_IT_OVERLAY = ${JSON.stringify(it, null, 2)};\n`,
    "utf8",
  );
  console.log({ ids: Object.keys(it).length, badLeft: left });
}

main();
