/**
 * Author German for content-scope + title lines; merge; rebuild; student-hybrid check.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

function scopeDe(en) {
  let s = String(en);
  const pairs = [
    ["**Content scope:**", "**Inhaltsumfang:**"],
    ["Content scope:", "Inhaltsumfang:"],
    ["repeated addition", "wiederholte Addition"],
    ["equal groups", "gleiche Gruppen"],
    ["times table", "Einmaleins"],
    ["Times table", "Einmaleins"],
    ["Times tables", "Einmaleins"],
    ["word problems", "Textaufgaben"],
    ["Word problems", "Textaufgaben"],
    ["fair sharing", "gerechtes Teilen"],
    ["long division", "schriftliche Division"],
    ["vertical multiplication", "senkrechte Multiplikation"],
    ["Vertical multiplication", "Senkrechte Multiplikation"],
    ["vertical addition", "senkrechte Addition"],
    ["vertical subtraction", "senkrechte Subtraktion"],
    ["Vertical subtraction", "Senkrechte Subtraktion"],
    ["decimal point", "Komma"],
    ["decimal digits", "Nachkommastellen"],
    ["decimal digit", "Nachkommastelle"],
    ["hundredths and tenths", "Hundertstel und Zehntel"],
    ["Line up decimal points", "Kommas untereinander ausrichten"],
    ["Regrouping (carrying)", "Übertrag"],
    ["Regrouping", "Übertrag"],
    ["carrying", "Übertrag"],
    ["borrowing", "Borgen"],
    ["missing number", "fehlende Zahl"],
    ["how many more", "wie viele mehr"],
    ["the teens", "Zehnerplus"],
    ["whole shekels", "ganzen Euro"],
    ["shekels", "Euro"],
    ["agorot", "Cent"],
    ["multi-step", "mehrstufig"],
    ["One step", "Ein Schritt"],
    ["one step", "ein Schritt"],
    ["No negatives", "Keine negativen Zahlen"],
    ["no negatives", "keine negativen Zahlen"],
    ["No negative", "Kein negativ"],
    ["negative numbers", "negative Zahlen"],
    ["negative exponents", "negative Exponenten"],
    ["Grade 1", "1. Klasse"],
    ["Grade 2", "2. Klasse"],
    ["Grade 3", "3. Klasse"],
    ["Grade 4", "4. Klasse"],
    ["Grade 5", "5. Klasse"],
    ["Grade 6", "6. Klasse"],
    ["Multiplication", "Multiplikation"],
    ["multiplication", "Multiplikation"],
    ["Addition", "Addition"],
    ["addition", "Addition"],
    ["Subtraction", "Subtraktion"],
    ["subtraction", "Subtraktion"],
    ["Division", "Division"],
    ["division", "Division"],
    ["Estimate", "Schätzen"],
    ["estimate", "schätzen"],
    ["Calculate", "Berechnen"],
    ["calculate", "berechnen"],
    ["Sequences", "Folgen"],
    ["sequences", "Folgen"],
    ["Remainder", "Rest"],
    ["remainder", "Rest"],
    ["Quotient", "Quotient"],
    ["quotient", "Quotient"],
    ["divisor", "Divisor"],
    ["dividend", "Dividend"],
    ["Factors", "Faktoren"],
    ["factors", "Faktoren"],
    ["factor range", "Faktorbereich"],
    ["Place value", "Stellenwert"],
    ["place value", "Stellenwert"],
    ["Number line", "Zahlenstrahl"],
    ["number line", "Zahlenstrahl"],
    ["Days of the week", "Wochentage"],
    ["hours:minutes", "Stunden:Minuten"],
    ["Hours and minutes", "Stunden und Minuten"],
    ["rectangular prism", "Quader"],
    ["cube", "Würfel"],
    ["cylinder", "Zylinder"],
    ["sphere", "Kugel"],
    ["parallelogram", "Parallelogramm"],
    ["trapezoid", "Trapez"],
    ["trapezoids", "Trapeze"],
    ["quadrilaterals", "Vierecke"],
    ["Square", "Quadrat"],
    ["square", "Quadrat"],
    ["rectangle", "Rechteck"],
    ["Parallel lines", "Parallele Geraden"],
    ["parallel sides", "parallele Seiten"],
    ["right angle", "rechter Winkel"],
    ["Line of symmetry", "Symmetrieachse"],
    ["Common denominator", "Gemeinsamer Nenner"],
    ["numerators", "Zähler"],
    ["Rounding", "Runden"],
    ["rounding", "Runden"],
    ["discount", "Rabatt"],
    ["final price", "Endpreis"],
    ["reciprocal", "Kehrwert"],
    ["Dangerous materials", "Gefährliche Materialien"],
    ["dangerous materials", "gefährliche Materialien"],
    ["Observation", "Beobachtung"],
    ["comparison", "Vergleich"],
    ["one variable", "eine Variable"],
    ["Skeleton/muscles", "Skelett/Muskeln"],
    ["nervous system", "Nervensystem"],
    ["message network", "Nachrichtennetz"],
    ["requires illustration", "erfordert Abbildung"],
    ["Divisibility tests", "Teilbarkeitsregeln"],
    ["Divisibility", "Teilbarkeit"],
    ["divisibility rules", "Teilbarkeitsregeln"],
    ["even and odd", "gerade und ungerade"],
    ["identity property", "Identitätseigenschaft"],
    ["zero property", "Nullregel"],
    ["Trading one ten for 10 ones", "Einen Zehner in 10 Einer umtauschen"],
    ["Breaking into tens and ones", "Zerlegen in Zehner und Einer"],
    ["Break apart into", "Zerlegen in"],
    ["breaking apart", "Zerlegen"],
    ["commutative order", "Kommutativgesetz"],
    ["multiplying by tens", "Multiplizieren mit Zehnern"],
    ["No full times table", "Kein volles Einmaleins"],
    ["No exact calculation required", "Keine genaue Berechnung nötig"],
    ["No exact counting", "Kein genaues Zählen"],
    ["No measuring", "Kein Messen"],
    ["No variables", "Keine Variablen"],
    ["no variables", "keine Variablen"],
    ["No algebra", "Keine Algebra"],
    ["No parentheses", "Keine Klammern"],
    ["Short problems", "Kurze Aufgaben"],
    ["large numbers", "große Zahlen"],
    ["Large numbers", "Große Zahlen"],
    ["small numbers", "kleine Zahlen"],
    ["Small numbers", "Kleine Zahlen"],
    ["medium-sized numbers", "mittelgroße Zahlen"],
    ["Only", "Nur"],
    ["only", "nur"],
    ["No ", "Keine "],
    ["no ", "keine "],
  ];
  for (const [enP, deP] of pairs) s = s.split(enP).join(deP);
  return s;
}

function titleDe(en) {
  let s = String(en);
  const map = {
    "Multiplication — Strategies and Large Numbers": "Multiplikation — Strategien und große Zahlen",
    "Unit Conversion — Centimeters and Meters": "Einheiten umrechnen — Zentimeter und Meter",
    "Hundreds, Tens, and Ones — Up to 1,000": "Hunderter, Zehner und Einer — bis 1.000",
    "Unit Conversion — Grams and Kilograms": "Einheiten umrechnen — Gramm und Kilogramm",
    "Addition Equation — Missing Number": "Additionsgleichung — fehlende Zahl",
    "Word Problems — Days of the Week": "Textaufgaben — Wochentage",
    "Distance, Time, and Speed": "Weg, Zeit und Geschwindigkeit",
    "Word Problems — How Many Days Between Days": "Textaufgaben — Wie viele Tage dazwischen",
    "Parallel and Perpendicular Lines": "Parallele und senkrechte Geraden",
    "Division — Equal Sharing": "Division — gleichmäßiges Teilen",
    "Adding Three Numbers": "Drei Zahlen addieren",
    "Division with a Remainder": "Division mit Rest",
    "Greatest Common Factor (GCF)": "Größter gemeinsamer Teiler (ggT)",
    "Multiples of a Number": "Vielfache einer Zahl",
    "Factors of a Number": "Teiler einer Zahl",
    "Word Problems — How Many More?": "Textaufgaben — Wie viele mehr?",
  };
  for (const [enT, deT] of Object.entries(map)) {
    if (s.includes(enT)) s = s.split(enT).join(deT);
  }
  s = s
    .replace(/\bGrade\s*([1-6])\b/g, "$1. Klasse")
    .replace(/`\[DRAFT — not owner-approved\]`/g, "`[ENTWURF — nicht freigegeben]`");
  return s;
}

const scopes = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-scopes.json"), "utf8"));
const titles = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-titles.json"), "utf8"));
const mapPath = path.join(__dirname, "_de-DE-book-residue-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));

for (const en of scopes) map[en] = scopeDe(en);
for (const en of titles) map[en] = titleDe(en);

// High-value short lines from hybrid-student top
Object.assign(map, {
  "Example with pencils:": "Beispiel mit Stiften:",
  "Important:": "Wichtig:",
  "Important: add all three numbers — don't stop after two!":
    "Wichtig: addiere alle drei Zahlen — hör nicht nach zwei auf!",
  "We will learn about rotation at a more advanced stage.":
    "Wir lernen Drehung in einer fortgeschritteneren Stufe.",
  "In practice you'll find questions: what comes before?":
    "In der Übung findest du Fragen: Was kommt davor?",
  "Now you know how to estimate a multiplication answer.":
    "Jetzt weißt du, wie du ein Multiplikationsergebnis schätzt.",
  "In practice you'll find questions: even or odd?":
    "In der Übung findest du Fragen: gerade oder ungerade?",
  "Two video clips last 45 minutes and 35 minutes.":
    "Zwei Videoclips dauern 45 Minuten und 35 Minuten.",
  "Now you know how to estimate an addition sum.":
    "Jetzt weißt du, wie du eine Additionssumme schätzt.",
  "Continue the sequence: 1,000, 1,100, 1,200, ?":
    "Setze die Folge fort: 1.000, 1.100, 1.200, ?",
  "From Monday to Friday — how many days pass?":
    "Von Montag bis Freitag — wie viele Tage vergehen?",
  "If it's 5, 6, 7, 8, or 9 — round up (add 1)":
    "Wenn es 5, 6, 7, 8 oder 9 ist — aufrunden (1 addieren)",
  "In practice you'll find rounding questions.":
    "In der Übung findest du Rundungsfragen.",
  "Parallelogram — 2 pairs of parallel sides.":
    "Parallelogramm — 2 Paare paralleler Seiten.",
  "Check: 30 + 70 = 100, and 7 + 3 = 10 → 100":
    "Prüfe: 30 + 70 = 100, und 7 + 3 = 10 → 100",
  "Where does an empty plastic bottle belong?":
    "Wohin gehört eine leere Plastikflasche?",
  "How much money in total — we need to add.":
    "Wie viel Geld insgesamt — wir müssen addieren.",
  "3. What do we do? — count hops on the row":
    "3. Was tun wir? — zähle die Sprünge in der Reihe",
  "Before you calculate — read out loud:":
    "Bevor du rechnest — lies laut vor:",
  "Repeated addition: 6 + 6 + 6 + 6 = 24":
    "Wiederholte Addition: 6 + 6 + 6 + 6 = 24",
  "38,750 to the nearest ten-thousand:":
    "38.750 auf die nächste Zehntausenderstelle:",
  "Expand 3/4 to have denominator 20.":
    "Erweitere 3/4 auf den Nenner 20.",
  "Does 35 divide by 2? By 5? By 10?":
    "Ist 35 durch 2 teilbar? Durch 5? Durch 10?",
  "Write the first 5 multiples of 9.":
    "Schreibe die ersten 5 Vielfachen von 9.",
  "Tens: 9 (after borrowing) − 5 = 4":
    "Zehner: 9 (nach dem Borgen) − 5 = 4",
  "neighbor before   neighbor after":
    "Nachbar davor   Nachbar danach",
  "There are 3 coins of 10 shekels.":
    "Es gibt 3 Münzen zu 10 Euro.",
  "What's the total watching time?":
    "Was ist die gesamte Sehdauer?",
  "Is 8,800 a reasonable estimate?":
    "Ist 8.800 eine vernünftige Schätzung?",
  "What will happen to its leaves?":
    "Was wird mit seinen Blättern passieren?",
  "185 eggs, 12 in each carton.":
    "185 Eier, 12 in jedem Karton.",
  "Find all the factors of 36.":
    "Finde alle Teiler von 36.",
  "Find all the factors of 48.":
    "Finde alle Teiler von 48.",
  "1. Start with ones (right)":
    "1. Beginne mit den Einern (rechts)",
  "Find the GCF of 24 and 36.":
    "Finde den ggT von 24 und 36.",
  "Check with multiplication!":
    "Prüfe mit Multiplikation!",
  "Find the GCF of 40 and 60.":
    "Finde den ggT von 40 und 60.",
  "Add the two known angles:":
    "Addiere die zwei bekannten Winkel:",
  "Number line from 0 to 10:":
    "Zahlenstrahl von 0 bis 10:",
  "Add the first two sides:":
    "Addiere die ersten zwei Seiten:",
  "Break each number apart:":
    "Zerlege jede Zahl:",
  "Multiply the area by 2:":
    "Multipliziere die Fläche mit 2:",
  "Count backward from 9.":
    "Zähle rückwärts von 9.",
  "Each bag has 3 apples.":
    "Jeder Beutel hat 3 Äpfel.",
  "There are 61 students.":
    "Es gibt 61 Schülerinnen und Schüler.",
  "Count forward from 8.":
    "Zähle vorwärts von 8.",
  "Is 3,578 even or odd?":
    "Ist 3.578 gerade oder ungerade?",
  "Find the step first!":
    "Finde zuerst die Schrittweite!",
  "Neighbor before = −1":
    "Nachbar davor = −1",
  "A square on a page:":
    "Ein Quadrat auf einer Seite:",
  "How do you find it?":
    "Wie findest du es?",
  "Neighbor after = +1":
    "Nachbar danach = +1",
  "Steps for rounding:":
    "Schritte zum Runden:",
  "Hop just one step!":
    "Springe nur einen Schritt!",
  "Is 46 even or odd?":
    "Ist 46 gerade oder ungerade?",
  "Is 48 even or odd?":
    "Ist 48 gerade oder ungerade?",
  "What does 5³ mean?":
    "Was bedeutet 5³?",
  "What did we learn?":
    "Was haben wir gelernt?",
  "Is 9 even or odd?":
    "Ist 9 gerade oder ungerade?",
  "- Ones under ones":
    "- Einer unter Einern",
  "- Tens under tens":
    "- Zehner unter Zehnern",
  "There are 6 bags.":
    "Es gibt 6 Beutel.",
  "Count the hops!":
    "Zähle die Sprünge!",
  "What happens?":
    "Was passiert?",
  "Is 37 prime?":
    "Ist 37 eine Primzahl?",
  "(with √2)":
    "(mit √2)",
  "The sun":
    "Die Sonne",
  "Area = side × side.":
    "Fläche = Seite × Seite.",
  "Now you know how to estimate an addition sum.":
    "Jetzt weißt du, wie du eine Additionssumme schätzt.",
});

fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
console.log({ scopes: scopes.length, titles: titles.length, mapSize: Object.keys(map).length });

let r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], { cwd: ROOT, stdio: "inherit" });
if (r.status) process.exit(r.status);
if (fs.existsSync(path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"))) {
  fs.copyFileSync(
    path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"),
    path.join(ROOT, "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_rectangle.md")
  );
}
r = spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-hybrid-student.mjs")], {
  cwd: ROOT,
  stdio: "inherit",
});
process.exit(r.status || 0);
