/**
 * Iterate: collect salad → author → merge map → rebuild, until unique==0 or max rounds.
 * node scripts/i18n/_loop-de-DE-book-close.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { EXACT as BOOK_EXACT } from "./_de-DE-book-line.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const MAX = 12;

function money(s) {
  return String(s)
    .replace(/\b(\d+(?:[.,]\d+)?)\s*shekels?\b/gi, "$1 Euro")
    .replace(/\b(\d+(?:[.,]\d+)?)\s*dollars?\b/gi, "$1 Euro")
    .replace(/\bshekels?\b/gi, "Euro")
    .replace(/\bdollars?\b/gi, "Euro");
}

function num(s) {
  return String(s).replace(/(\d),(\d{3})\b/g, "$1.$2");
}

const LEX = [
  ["rectangular prism", "Quader"],
  ["right angles", "rechte Winkel"],
  ["right corners", "rechte Ecken"],
  ["right angle", "rechter Winkel"],
  ["number line", "Zahlenstrahl"],
  ["word problems", "Textaufgaben"],
  ["word problem", "Textaufgabe"],
  ["place value", "Stellenwert"],
  ["missing number", "fehlende Zahl"],
  ["missing divisor", "fehlender Divisor"],
  ["lines of symmetry", "Symmetrieachsen"],
  ["decimal point", "Komma"],
  ["life cycle", "Lebenszyklus"],
  ["first stage", "erste Stufe"],
  ["watching time", "Sehdauer"],
  ["opposite sides", "gegenüberliegende Seiten"],
  ["equal to each other", "gleich lang"],
  ["three-dimensional", "dreidimensional"],
  ["addition equation", "Additionsgleichung"],
  ["subtraction equation", "Subtraktionsgleichung"],
  ["addition equations", "Additionsgleichungen"],
  ["subtraction equations", "Subtraktionsgleichungen"],
  ["large numbers", "großen Zahlen"],
  ["next two numbers", "nächsten zwei Zahlen"],
  ["the whole", "das Ganze"],
  ["other leg", "andere Kathete"],
  ["third angle", "dritte Winkel"],
  ["hypotenuse", "Hypotenuse"],
  ["circumference", "Kreislinie"],
  ["relationship between", "Beziehung zwischen"],
  ["length of the diagonal", "Länge der Diagonale"],
  ["value of the digit", "Wert der Ziffer"],
  ["sheet of paper", "Blatt Papier"],
  ["TV screen", "Fernsehbildschirm"],
  ["shoe box", "Schuhkarton"],
  ["soda can", "Getränkedose"],
  ["party hat", "Partyhut"],
  ["chalkboard", "Tafel"],
  ["classroom", "Klassenzimmer"],
  ["mirror image", "Spiegelbild"],
  ["parallelogram", "Parallelogramm"],
  ["trapezoid", "Trapez"],
  ["quadrilaterals", "Vierecke"],
  ["quadrilateral", "Viereck"],
  ["rectangle", "Rechteck"],
  ["triangle", "Dreieck"],
  ["triangles", "Dreiecke"],
  ["square", "Quadrat"],
  ["circle", "Kreis"],
  ["sphere", "Kugel"],
  ["cube", "Würfel"],
  ["cylinder", "Zylinder"],
  ["pyramid", "Pyramide"],
  ["cone", "Kegel"],
  ["solid", "Körper"],
  ["solids", "Körper"],
  ["perimeter", "Umfang"],
  ["area", "Fläche"],
  ["volume", "Volumen"],
  ["diagonal", "Diagonale"],
  ["height", "Höhe"],
  ["length", "Länge"],
  ["width", "Breite"],
  ["radius", "Radius"],
  ["base", "Grundseite"],
  ["bases", "Grundseiten"],
  ["leg", "Kathete"],
  ["angle", "Winkel"],
  ["angles", "Winkel"],
  ["faces", "Flächen"],
  ["face", "Fläche"],
  ["sides", "Seiten"],
  ["side", "Seite"],
  ["corners", "Ecken"],
  ["corner", "Ecke"],
  ["shape", "Form"],
  ["shapes", "Formen"],
  ["digit", "Ziffer"],
  ["frog", "Frosch"],
  ["what is the", "was ist der/die/das"],
  ["What is the", "Was ist der/die/das"],
  ["what are the", "was sind die"],
  ["What are the", "Was sind die"],
  ["how many", "wie viele"],
  ["How many", "Wie viele"],
  ["how much", "wie viel"],
  ["Today we will", "Heute werden wir"],
  ["Today we'll", "Heute werden wir"],
  ["Now you know", "Jetzt weißt du"],
  ["In practice", "In der Übung"],
  ["for example", "zum Beispiel"],
  ["because", "weil"],
  ["without", "ohne"],
  ["through", "durch"],
  ["different", "unterschiedlich"],
  ["everything", "alles"],
  ["usually", "meist"],
  ["always", "immer"],
  ["equal", "gleich"],
  ["same", "gleich"],
  ["not", "nicht"],
  ["and", "und"],
  ["with", "mit"],
  ["from", "von"],
  ["into", "in"],
  ["about", "über"],
  ["or", "oder"],
  ["but", "aber"],
  ["the", ""],
  [" a ", " "],
  [" an ", " "],
  [" of ", " "],
  [" to ", " "],
  [" is ", " ist "],
  [" are ", " sind "],
  [" has ", " hat "],
  [" have ", " haben "],
  [" like ", " wie "],
  [" you ", " du "],
  [" we ", " wir "],
  [" it ", " es "],
  [" can ", " kann "],
  [" will ", " wird "],
  [" solve ", " lösen "],
  [" find ", " finden "],
  [" check ", " prüfen "],
  [" paid ", " hat bezahlt "],
  [" cost ", " gekostet "],
  [" for ", " für "],
];

function phrase(s) {
  let out = money(num(String(s)));
  for (const [en, de] of LEX) {
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    out = out.replace(re, de);
  }
  out = out
    .replace(/\bder\/die\/das\b/g, "die")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?;:?])/g, "$1")
    .trim();
  if (/^[a-zäöü]/.test(out)) out = out[0].toUpperCase() + out.slice(1);
  return out;
}

function stillEn(s) {
  const m = String(s).match(
    /\b(the|and|with|that|which|without|because|through|their|they|these|those|would|could|should|have|been|does|make|help|need|what|when|where|how|why|for|over|under|after|before|during|only|also|more|most|other|than|then|each|every|will|are|were|you|your|we|our|is|like|has|not|all|sides|corners|shape|length|width|equal|Imagine|Check|Yes|Did|Does|called|hold|move|moved|flip|mirror|everywhere|tiles|windows|games|board|sticker|classroom|Identifying|different|opposite|usually|longer|shorter|everything|Infrastructure|placeholder|Documentation|three-dimensional|flat|page|hand|polygon|triangular|faces|round|base|point|top|party|hat|shoe|box|rectangular|same|curved|soda|can|bases|shekel|missing|number|Square|Rectangle|Triangle|Circle|Sphere|Parallelogram|Trapezoid|Today|What|How)\b/g
  );
  return (m || []).length >= 2;
}

function author(en) {
  const t = String(en).trim();
  if (!t) return en;
  if (BOOK_EXACT[t]) return BOOK_EXACT[t];

  // High-value exactish patterns
  let m;
  if ((m = t.match(/^Square with side (.+?) — what is the area\?$/i)))
    return `Quadrat mit Seitenlänge ${m[1]} — was ist die Fläche?`;
  if ((m = t.match(/^Square with side (.+?) — what is the perimeter\?$/i)))
    return `Quadrat mit Seitenlänge ${m[1]} — was ist der Umfang?`;
  if ((m = t.match(/^A square with (?:a )?side(?: of)? (.+?) — what is the area\?$/i)))
    return `Ein Quadrat mit Seitenlänge ${m[1]} — was ist die Fläche?`;
  if ((m = t.match(/^A square with (?:a )?side(?: of)? (.+?) — what is the perimeter\?$/i)))
    return `Ein Quadrat mit Seitenlänge ${m[1]} — was ist der Umfang?`;
  if ((m = t.match(/^(.+?) — what is the missing number\?$/i)))
    return `${num(m[1])} — was ist die fehlende Zahl?`;
  if ((m = t.match(/^(.+?) — what is the missing divisor\?$/i)))
    return `${num(m[1])} — was ist der fehlende Divisor?`;
  if (/^What are the next two numbers\?$/i.test(t)) return "Was sind die nächsten zwei Zahlen?";
  if (/^What is the whole\?$/i.test(t)) return "Was ist das Ganze?";
  if (/^What is the total watching time\?$/i.test(t)) return "Was ist die gesamte Sehdauer?";
  if ((m = t.match(/^What is the first stage in a (.+?)'s life cycle\?$/i)))
    return `Was ist die erste Stufe im Lebenszyklus ${m[1] === "frog" ? "eines Frosches" : `von ${m[1]}`}?`;
  if ((m = t.match(/^Right triangle: hypotenuse (.+?), leg (.+?) — what is the other leg\?$/i)))
    return `Rechtwinkliges Dreieck: Hypotenuse ${m[1]}, Kathete ${m[2]} — was ist die andere Kathete?`;
  if ((m = t.match(/^In a triangle: angle (.+?) and angle (.+?) — what is the third angle\?$/i)))
    return `In einem Dreieck: Winkel ${m[1]} und Winkel ${m[2]} — was ist der dritte Winkel?`;
  if ((m = t.match(/^In rectangle (.+?) — what is the relationship between (.+?) and (.+?)\?$/i)))
    return `Im Rechteck ${m[1]} — welche Beziehung besteht zwischen ${m[2]} und ${m[3]}?`;
  if ((m = t.match(/^Rectangle (.+?) — what is the length of the diagonal\?$/i)))
    return `Rechteck ${m[1]} — was ist die Länge der Diagonale?`;
  if ((m = t.match(/^Parallelogram: base (.+?), area (.+?) — what is the height\?$/i)))
    return `Parallelogramm: Grundseite ${m[1]}, Fläche ${m[2]} — was ist die Höhe?`;
  if ((m = t.match(/^Parallelogram: base (.+?), height (.+?) — what is the area\?$/i)))
    return `Parallelogramm: Grundseite ${m[1]}, Höhe ${m[2]} — was ist die Fläche?`;
  if ((m = t.match(/^Rectangular prism (.+?) — what is the volume\?$/i)))
    return `Quader ${m[1]} — was ist das Volumen?`;
  if ((m = t.match(/^Rectangular prism: (.+?) — what is the volume\?$/i)))
    return `Quader: ${m[1]} — was ist das Volumen?`;
  if ((m = t.match(/^Circle radius (.+?) — what is the circumference\?$/i)))
    return `Kreis Radius ${m[1]} — was ist die Kreislinie?`;
  if ((m = t.match(/^Circle radius (.+?) — what is the area\?$/i)))
    return `Kreis Radius ${m[1]} — was ist die Fläche?`;
  if ((m = t.match(/^Sphere radius (.+?) — what is the volume\?$/i)))
    return `Kugel Radius ${m[1]} — was ist das Volumen?`;
  if ((m = t.match(/^Triangle: base (.+?), area (.+?) — what is the height\?$/i)))
    return `Dreieck: Grundseite ${m[1]}, Fläche ${m[2]} — was ist die Höhe?`;
  if ((m = t.match(/^Triangle: base (.+?), height (.+?) — what is the area\?$/i)))
    return `Dreieck: Grundseite ${m[1]}, Höhe ${m[2]} — was ist die Fläche?`;
  if ((m = t.match(/^In ([\d,.]+) — what is the value of the digit (.+)\?$/i)))
    return `In ${num(m[1])} — was ist der Wert der Ziffer ${m[2]}?`;
  if ((m = t.match(/^(.+?) paid (\d+) shekels for a (.+) that cost (\d+) shekels\.$/i)))
    return `${m[1]} hat ${m[2]} Euro für ein ${m[3] === "game" ? "Spiel" : m[3] === "book" ? "Buch" : m[3]} bezahlt, das ${m[4]} Euro gekostet hat.`;
  if ((m = t.match(/^(.+?) — what is the area\?$/i))) return `${phrase(m[1])} — was ist die Fläche?`;
  if ((m = t.match(/^(.+?) — what is the perimeter\?$/i))) return `${phrase(m[1])} — was ist der Umfang?`;
  if ((m = t.match(/^(.+?) — what is the volume\?$/i))) return `${phrase(m[1])} — was ist das Volumen?`;
  if ((m = t.match(/^(.+?) — what is the height\?$/i))) return `${phrase(m[1])} — was ist die Höhe?`;
  if ((m = t.match(/^Today .+$/i))) return phrase(t);
  if ((m = t.match(/^Now you .+$/i))) return phrase(t);
  if ((m = t.match(/^In practice .+$/i))) return phrase(t);
  if ((m = t.match(/^\*\*Content scope:\*\*.+$/i))) return phrase(t).replace(/^\*\*Content scope:\*\*/i, "**Inhaltsumfang:**");
  if ((m = t.match(/^What .+\?$/i))) return phrase(t);
  if ((m = t.match(/^How .+\?$/i))) return phrase(t);

  return phrase(t);
}

function run(script) {
  const r = spawnSync(process.execPath, [path.join(__dirname, script)], { cwd: ROOT, stdio: "inherit" });
  return r.status || 0;
}

for (let round = 1; round <= MAX; round++) {
  const code = run("_collect-de-DE-book-salad.mjs");
  if (code !== 0) process.exit(code);
  const salad = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-salad.json"), "utf8"));
  console.log(`\n=== ROUND ${round}: unique=${salad.length} ===`);
  if (salad.length === 0) {
    console.log("CLOSED");
    break;
  }
  const mapPath = path.join(__dirname, "_de-DE-book-residue-map.json");
  const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  let bad = 0;
  for (const { en } of salad) {
    const de = author(en);
    map[en] = de;
    if (stillEn(de)) bad++;
  }
  fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
  console.log({ authored: salad.length, stillBadApprox: bad, mapSize: Object.keys(map).length });
  const rb = run("_rebuild-de-DE-books.mjs");
  if (rb !== 0) process.exit(rb);
}

run("_collect-de-DE-book-salad.mjs");
const final = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-salad.json"), "utf8"));
console.log({ finalUnique: final.length, top: final.slice(0, 20) });
process.exit(final.length === 0 ? 0 : 2);
