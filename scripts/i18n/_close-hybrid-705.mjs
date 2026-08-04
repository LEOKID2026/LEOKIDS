/**
 * Close remaining hybrid-student lines with full German (no short-word salad).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

const TOPIC = [
  ["eggs, young animals, and similarity to parents", "Eiern, Jungtieren und der Ähnlichkeit mit den Eltern"],
  ["connections between living things in nature", "Verbindungen zwischen Lebewesen in der Natur"],
  ["observation, comparison, and one variable", "Beobachtung, Vergleich und einer Variable"],
  ["variables, graphs, and presenting results", "Variablen, Diagrammen und dem Präsentieren von Ergebnissen"],
  ["similarity between parents and offspring", "Ähnlichkeit zwischen Eltern und Nachkommen"],
  ["hypothesis, variable, and results table", "Hypothese, Variable und Ergebnistabelle"],
  ["coordination between body systems", "Koordination zwischen Körpersystemen"],
  ["ice, water, and states of matter", "Eis, Wasser und Aggregatzuständen"],
  ["human impact on the environment", "menschlichen Einfluss auf die Umwelt"],
  ["ways to protect the environment", "Möglichkeiten, die Umwelt zu schützen"],
  ["soil types and changes in soil", "Bodenarten und Veränderungen im Boden"],
  ["relationships between animals", "Beziehungen zwischen Tieren"],
  ["research steps and conclusion", "Forschungsschritten und Schlussfolgerung"],
  ["habitat and special features", "Lebensraum und besonderen Merkmalen"],
  ["interaction between animals", "Wechselwirkungen zwischen Tieren"],
];

const PHRASE = [
  ["long division", "schriftliche Division"],
  ["equal groups", "gleiche Gruppen"],
  ["times table", "Einmaleins"],
  ["fair sharing", "gerechtes Teilen"],
  ["rectangular prism", "Quader"],
  ["three-dimensional solid", "dreidimensionaler Körper"],
  ["number line", "Zahlenstrahl"],
  ["word problem", "Textaufgabe"],
  ["word problems", "Textaufgaben"],
  ["natural fibers", "Naturfasern"],
  ["right angles", "rechte Winkel"],
  ["right angle", "rechter Winkel"],
  ["opposite corner", "gegenüberliegende Ecke"],
  ["opposite sides", "gegenüberliegende Seiten"],
  ["decimal point", "Komma"],
  ["improper fraction", "unechter Bruch"],
  ["mixed number", "gemischte Zahl"],
  ["common factor", "gemeinsamer Teiler"],
  ["states of matter", "Aggregatzustände"],
  ["ten-frame", "Zehnerfeld"],
  ["Grade 1", "1. Klasse"],
  ["Grade 2", "2. Klasse"],
  ["Grade 3", "3. Klasse"],
  ["Grade 4", "4. Klasse"],
];

function apply(s, pairs) {
  let out = s;
  for (const [en, de] of pairs.sort((a, b) => b[0].length - a[0].length)) {
    out = out.split(en).join(de);
  }
  return out;
}

function topic(s) {
  const t = String(s).replace(/\.$/, "");
  for (const [en, de] of TOPIC) if (t === en || t.endsWith(en)) return de;
  return apply(t, PHRASE);
}

function author(en) {
  const t = String(en).trim();
  let m;

  if ((m = t.match(/^When you practice, look for questions about (.+)$/i)))
    return `Wenn du übst, achte auf Fragen zu ${topic(m[1])}.`;
  if ((m = t.match(/^In practice you'll find (.+)$/i)))
    return `In der Übung findest du ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^In practice you will find (.+)$/i)))
    return `In der Übung findest du ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Now you know how to (.+)\.$/i)))
    return `Jetzt weißt du, wie du ${apply(m[1], PHRASE)}.`;
  if ((m = t.match(/^Now you know (.+)\.$/i)))
    return `Jetzt weißt du ${apply(m[1], PHRASE)}.`;
  if ((m = t.match(/^Important: (.+)$/i))) return `Wichtig: ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today we'll learn long division — (.+)$/i)))
    return `Heute lernen wir die schriftliche Division — ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today we're going to learn multiplication — (.+)$/i)))
    return `Heute lernen wir Multiplikation — ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today we'll learn to estimate a multiplication answer — (.+)$/i)))
    return `Heute lernen wir, ein Multiplikationsergebnis zu schätzen — ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today we'll check when a number divides evenly by (.+)$/i)))
    return `Heute prüfen wir, wann eine Zahl ohne Rest durch ${m[1].replace(/ or /g, " oder ").replace(/using quick rules/, "mit schnellen Regeln teilbar ist")}`;
  if ((m = t.match(/^Today in geometry we will learn an important rule: (.+)$/i)))
    return `Heute lernen wir in Geometrie eine wichtige Regel: ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today in geometry we will learn the perimeter of a triangle — (.+)$/i)))
    return `Heute lernen wir in Geometrie den Umfang eines Dreiecks — ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today in geometry we will learn about a rectangular prism — (.+)$/i)))
    return `Heute lernen wir in Geometrie etwas über einen Quader — ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today in geometry we will learn (.+)$/i)))
    return `Heute lernen wir in Geometrie ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today we'll learn (.+)$/i))) return `Heute lernen wir ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today we're going to learn (.+)$/i))) return `Heute lernen wir ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today we will learn about (.+)$/i))) return `Heute lernen wir etwas über ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today we will learn (.+)$/i))) return `Heute lernen wir ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today we will strengthen (.+)$/i))) return `Heute festigen wir ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today we'll strengthen (.+)$/i))) return `Heute festigen wir ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^Today we'll classify (.+)$/i))) return `Heute ordnen wir ${apply(m[1], PHRASE)}`;
  if ((m = t.match(/^There are (\d+) (.+) shared equally among (\d+) children\. How many (.+) does each child get\?$/i)))
    return `Es gibt ${m[1]} ${apply(m[2], PHRASE)}, die gleichmäßig auf ${m[3]} Kinder verteilt werden. Wie viele ${apply(m[4], PHRASE)} bekommt jedes Kind?`;
  if ((m = t.match(/^When you fill equal boxes \(or groups\), the answer is the remainder — not the number of boxes!$/i)))
    return "Wenn du gleiche Kisten (oder Gruppen) füllst, ist die Antwort der Rest — nicht die Anzahl der Kisten!";
  if ((m = t.match(/^In a square you can draw a line from one corner to the opposite corner — that is a diagonal\.$/i)))
    return "In einem Quadrat kannst du eine Linie von einer Ecke zur gegenüberliegenden Ecke zeichnen — das ist eine Diagonale.";
  if ((m = t.match(/^Two identical pots, same amount of water and same light; only temperature different \(variable\)\.$/i)))
    return "Zwei gleiche Töpfe, dieselbe Menge Wasser und dasselbe Licht; nur die Temperatur ist unterschiedlich (Variable).";
  if ((m = t.match(/^A wool string is made of natural fibers — also an insulator; electricity does not pass easily\.$/i)))
    return "Ein Wollfaden besteht aus Naturfasern — auch ein Isolator; Strom fließt nicht leicht hindurch.";
  if ((m = t.match(/^Step 3 — Count hops: after Monday: (.+)$/i)))
    return `Schritt 3 — Zähle die Sprünge: nach Montag: ${m[1]
      .replace(/Tuesday/g, "Dienstag")
      .replace(/Wednesday/g, "Mittwoch")
      .replace(/Thursday/g, "Donnerstag")
      .replace(/Friday/g, "Freitag")}`;

  // Generic: long phrases only
  let out = apply(t, PHRASE);
  out = out
    .replace(/\bGrade\s*([1-6])\b/g, "$1. Klasse")
    .replace(/\bshekels?\b/gi, "Euro");
  return out;
}

function stillEn(s) {
  return /\b(the|and|with|that|which|because|through|their|they|these|those|would|could|should|from|have|been|does|make|help|need|what|when|where|how|why|for|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|is|like|has|not|Today|In practice|Look for|Try to|How many|How much|When you|There are|Important|Example|Check|Second way|Everything|Climate|Interactions|Balanced|Natural|Round each|Trial|Horizontal|Reasoning|Divisible|Multiplying|An even|An odd|An improper|A square|A rectangle|A real|A quadrilateral|A wool|Two identical)\b/.test(
    s
  );
}

const ens = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-11-en.json"), "utf8"));
const mapPath = path.join(__dirname, "_de-DE-book-residue-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
const scopesDe = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-scopes-de.json"), "utf8"));
Object.assign(map, scopesDe);

let bad = 0;
const badSamples = [];
const authored = {};
for (const en of ens) {
  const de = author(en);
  authored[en] = de;
  map[en] = de;
  if (stillEn(de)) {
    bad++;
    if (badSamples.length < 50) badSamples.push({ en, de });
  }
}

fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-11-de.json"), JSON.stringify(authored, null, 2));
fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
fs.writeFileSync(path.join(__dirname, "_de-DE-hybrid-bad.json"), JSON.stringify(badSamples, null, 2));
console.log({ total: ens.length, bad, good: ens.length - bad });

let r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], { cwd: ROOT, stdio: "inherit" });
if (r.status) process.exit(r.status);
fs.copyFileSync(
  path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"),
  path.join(ROOT, "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_rectangle.md")
);
r = spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-hybrid-student.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
process.exit(0);
