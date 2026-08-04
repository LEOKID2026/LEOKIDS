import { pathToFileURL } from "node:url";
import fs from "node:fs";

const it = (await import(pathToFileURL(process.cwd() + "/data/science-questions-it-IT-overlay.js").href + `?t=${Date.now()}`))
  .SCIENCE_IT_IT_OVERLAY;

/** Spanish-specific (avoid shared IT/ES lexicon like del/con/solo/energia). */
const ES =
  /[áíóúñ¿¡]|\b(cualquier|electricidad|descomponen|germinaron|océano|oceano|cuaderno|pantalones|suele|cubrirse|quedarse|relacionan|mareas|gravedad|suelo|mantener|decidir|conveniente|alguien|prueba justa|musculo del|digerente include|paredes|observa el|sin circuito|eléctrico|azucar|reemplaza|camisa del|observador|salon|Solo el|Los materiales|Los aislantes|Las mareas|Por qué es|según lo|de las semillas|de la ciudad|de la Luna|de un parque|de una ciudad|de los edificios|de los pantalones|de alguien|a la sombra|del brazo|del cielo|del acqua|del esperimento|del observador|del salon|sin relacion|sin relación|sin circuito|generalmente reemplaza|fuente de energia|nombre del|cantidad de|numero de|tipo de suolo|valores registrados|destello|migran|multiples|navegacion|encuentran|convierten|envian|permiten que|attraverso él|mejor que|es dificil|sacar una|conclusion firme|afectan|fija la temperatura|gases de effetto|solo afectan|color exterior determina|color determina|color indica|color del|color de los|color de la|color sin|siempre se derriten|sempre se derriten|temperatura amb|lo mas similares|lo más similares|Cambiar luce|Decidir el risultato|secondo lo conveniente|Una prova justa|suele cambiar|Cubrirse y|quedarse a|El sistema digerente|include organos|como el s|solo el color de las|El nombre del alunno|que observa|sin relación con la stagione|cantidad de nubes|probar la co|azucar rapido|Mucho café|finestre del salon)\b/i;

let hits = 0;
const samples = [];
function walk(n, path = "") {
  if (typeof n === "string") {
    if (ES.test(n)) {
      hits += 1;
      if (samples.length < 40) samples.push([path, n.slice(0, 160)]);
    }
  } else if (Array.isArray(n)) n.forEach((x, i) => walk(x, `${path}[${i}]`));
  else if (n && typeof n === "object") {
    for (const [k, v] of Object.entries(n)) {
      if (k === "correctIndex" || k === "correctIndexes" || k === "id") continue;
      walk(v, path ? `${path}.${k}` : k);
    }
  }
}
walk(it);
console.log({ spanishSpecific: hits });
samples.forEach((s) => console.log(s[0], "::", s[1]));

// also write raw file grep for "Solo el"
const raw = fs.readFileSync("data/science-questions-it-IT-overlay.js", "utf8");
const soloEl = (raw.match(/Solo el /g) || []).length;
const los = (raw.match(/"Los /g) || []).length;
const las = (raw.match(/"Las /g) || []).length;
const que = (raw.match(/ Qué /g) || []).length;
console.log({ soloEl, losQuotes: los, lasQuotes: las, queSpaced: que });
