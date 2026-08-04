/**
 * Close remaining book EN lines with full natural German (exact map only).
 * Then merge + rebuild + recollect until unique==0 or dump leftovers.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const ens = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-13-en.json"), "utf8"));

const STILL =
  /\b(the|and|with|that|which|because|through|their|they|these|those|would|could|should|from|have|been|does|make|help|need|what|when|where|how|why|for|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|\bis\b|like|has|not|don't|let's|this|here|use|look|try|work out|learn|divide|subtract|take|away|means|getting|know|important|example|today|practice|questions|someone|asks|everyday|floor|tile|right|angles|geometry|number|line|quarter|turn|half|full|light|shadow|reflection|transparency|mixture|climate|solar|earth|space|scientists|worldwide|Work out|Now you|Here we|Imagine|That is|If someone|Hold|left and right|Content scope|students|quotient|remainder|already|know|solid|faces|edges|vertices|degrees|angle|types|row|small|squares|flipped|swapped|places|tell|apart|better|measure|narrow|opening|medium)\b/i;

function deNum(s) {
  return String(s)
    .replace(/(\d),(\d{3})\b/g, "$1.$2")
    .replace(/(\d)\.(\d{1,2})\b/g, (m, a, b) => (b.length <= 2 && !m.includes(",") ? `${a},${b}` : m));
}

/** @type {Record<string,string>} */
const DE = {
  "Work out: 937 ÷ 7 = ? (quotient and remainder)": "Rechne: 937 ÷ 7 = ? (Quotient und Rest)",
  "Work out: 59 ÷ 7 = ? (quotient and remainder)": "Rechne: 59 ÷ 7 = ? (Quotient und Rest)",
  "Work out: 1,247 ÷ 8 = ? (with remainder)": "Rechne: 1.247 ÷ 8 = ? (mit Rest)",
  "Work out: 65 ÷ 7 = ? (with remainder)": "Rechne: 65 ÷ 7 = ? (mit Rest)",
  "Work out 15,000 + 9,500 + 5,500 = ?": "Rechne 15.000 + 9.500 + 5.500 = ?",
  "Work out 38,450 + 16,275 = ?": "Rechne 38.450 + 16.275 = ?",
  "Work out 50,000 − 12,375 = ?": "Rechne 50.000 − 12.375 = ?",
  "Work out 12.45 + 3.60 = ?": "Rechne 12,45 + 3,60 = ?",
  "Work out 8.70 − 2.35 = ?": "Rechne 8,70 − 2,35 = ?",
  "Work out 2,450 ÷ 35 = ?": "Rechne 2.450 ÷ 35 = ?",
  "Work out 3/8 + 2/8 = ?": "Rechne 3/8 + 2/8 = ?",
  "Work out 25 × 36 = ?": "Rechne 25 × 36 = ?",
  "**Content scope:** Multiples of a number — multiply by 1, 2, 3… Numbers up to ~100. Link to the times table. Factors → `fm_factor`.":
    "**Inhaltsumfang:** Vielfache einer Zahl — multipliziere mit 1, 2, 3… Zahlen bis ~100. Verbindung zum Einmaleins. Teiler → `fm_factor`.",
  "**Content scope:** Climate change — factual, not scary; solar system — requires illustration: Earth in the solar system":
    "**Inhaltsumfang:** Klimawandel — sachlich, nicht beängstigend; Sonnensystem — braucht Abbildung: Erde im Sonnensystem",
  "**Content scope:** Subtraction sentence with **one blank** (missing number). Not below 0. No variables, no algebra.":
    "**Inhaltsumfang:** Subtraktionssatz mit **einer Lücke** (fehlende Zahl). Nicht unter 0. Keine Variablen, keine Algebra.",
  "**Content scope:** One-digit number × tens (10, 20, … 90). No two-digit × two-digit.":
    "**Inhaltsumfang:** Einstellige Zahl × Zehner (10, 20, … 90). Keine zweistellig × zweistellig.",
  "Today we will solve adding times — for example, how long a class and an activity take together, or two parts of a trip.":
    "Heute lösen wir das Addieren von Zeiten — zum Beispiel, wie lange Unterricht und eine Aktivität zusammen dauern oder zwei Teile einer Reise.",
  "Today in science we will learn about interactions between animals — who eats whom, and who competes for resources.":
    "Heute lernen wir in Naturwissenschaften etwas über Wechselwirkungen zwischen Tieren — wer wen frisst und wer um Ressourcen konkurriert.",
  "Today in science we will learn about climate, climate change — in facts — and Earth's place in the solar system.":
    "Heute lernen wir in Naturwissenschaften etwas über Klima und Klimawandel — in Fakten — und den Platz der Erde im Sonnensystem.",
  "Today in science we will learn to run a full investigation — with a journal, graph, and evaluation of results.":
    "Heute lernen wir in Naturwissenschaften, eine vollständige Untersuchung durchzuführen — mit Tagebuch, Diagramm und Auswertung der Ergebnisse.",
  "Today we'll learn multiplication — including two-digit multiplication and breaking-apart strategies.":
    "Heute lernen wir Multiplikation — einschließlich zweistelliger Multiplikation und Zerlegungsstrategien.",
  "Today in geometry we will go deeper into the cube — a solid we already know from earlier grades.":
    "Heute gehen wir in Geometrie tiefer auf den Würfel ein — einen Körper, den wir schon aus früheren Klassen kennen.",
  "Today we will check when a number divides evenly by 2, 5, or 10 — by looking at the ones digit.":
    "Heute prüfen wir, wann eine Zahl glatt durch 2, 5 oder 10 teilbar ist — indem wir auf die Einerziffer schauen.",
  "Today we're going to learn multiplication — here it's both equal groups and the times table.":
    "Heute lernen wir Multiplikation — hier sind es sowohl gleiche Gruppen als auch das Einmaleins.",
  "Today we will strengthen the perimeter of a triangle here — with sides 5, 6, and 7 cm.":
    "Heute festigen wir hier den Umfang eines Dreiecks — mit den Seiten 5, 6 und 7 cm.",
  "Today in science we will learn about weather, climate, and the water cycle on Earth.":
    "Heute lernen wir in Naturwissenschaften etwas über Wetter, Klima und den Wasserkreislauf auf der Erde.",
  "Today we will strengthen division with a remainder — with full multi-step checking.":
    "Heute festigen wir Division mit Rest — mit vollständiger mehrschrittiger Prüfung.",
  "Today we will learn the Pythagorean theorem in geometry — finding the hypotenuse.":
    "Heute lernen wir den Satz des Pythagoras in Geometrie — das Finden der Hypotenuse.",
  "Today we will find number neighbors — ±1 — even when we cross a hundred boundary.":
    "Heute finden wir Zahl-Nachbarn — ±1 — auch wenn wir eine Hundertergrenze überschreiten.",
  "Today we'll learn to divide by a two-digit number — the long division algorithm.":
    "Heute lernen wir, durch eine zweistellige Zahl zu teilen — mit dem Algorithmus der schriftlichen Division.",
  "The heart looks flipped — left and right swapped places.":
    "Das Herz wirkt gespiegelt — links und rechts haben die Plätze getauscht.",
  "Now you can tell translation and reflection apart better in geometry.":
    "Jetzt kannst du Verschiebung und Spiegelung in Geometrie besser unterscheiden.",
  "- The angle of rotation: 90°": "- Der Drehwinkel: 90°",
  "We will learn to count faces, vertices, and edges on a cube.":
    "Wir lernen, Flächen, Eckpunkte und Kanten an einem Würfel zu zählen.",
  "The line where two faces meet — a cube has 12 edges.":
    "Die Linie, an der zwei Flächen zusammentreffen — ein Würfel hat 12 Kanten.",
  "Each row has 6 small squares.": "Jede Reihe hat 6 kleine Quadrate.",
  "We will learn three types:": "Wir lernen drei Arten:",
  "The type of triangle:": "Die Art des Dreiecks:",
  "Today in geometry we will learn about angles in a triangle.":
    "Heute lernen wir in Geometrie etwas über Winkel in einem Dreieck.",
  "We will learn to read degrees and compare:": "Wir lernen, Grad zu lesen und zu vergleichen:",
  "A triangle has 3 vertices → 3 angles.": "Ein Dreieck hat 3 Eckpunkte → 3 Winkel.",
  "We measure an angle in degrees (°):": "Wir messen einen Winkel in Grad (°):",
  "- A small angle — a narrow opening (for example 50°)":
    "- Ein kleiner Winkel — eine schmale Öffnung (zum Beispiel 50°)",
  "- A medium angle — (for example 60°)": "- Ein mittlerer Winkel — (zum Beispiel 60°)",
  "When you add — you put two amounts together.": "Wenn du addierst — fügst du zwei Beträge zusammen.",
  "22 is to the right of 17 on the number line.": "22 steht rechts von 17 auf dem Zahlenstrahl.",
  '- A label: "Forward = right = bigger number"': '- Eine Beschriftung: „Vorwärts = rechts = größere Zahl“',
  "One step to the right → 13 (neighbor after).": "Ein Schritt nach rechts → 13 (Nachbar danach).",
  "In practice you'll find questions: half of…?": "In der Übung findest du Fragen: Hälfte von…?",
  "Quarter = 4 — one part out of 4 equal parts.": "Viertel = 4 — ein Teil von 4 gleichen Teilen.",
  "Quarter = 5 — one part out of 4 equal parts.": "Viertel = 5 — ein Teil von 4 gleichen Teilen.",
  "How many full groups? 6 × 7 = 42 (7 groups).": "Wie viele volle Gruppen? 6 × 7 = 42 (7 Gruppen).",
  "Now you know making 100 for mental addition.": "Jetzt weißt du, wie man 100 fürs Kopfrechnen bildet.",
  "Common denominator → add/subtract numerators": "Gemeinsamer Nenner → Zähler addieren/subtrahieren",
  "Now you know number neighbors up to 100,000.": "Jetzt kennst du Zahl-Nachbarn bis 100.000.",
  "100,000 − 1 = 99,999 — an important example!": "100.000 − 1 = 99.999 — ein wichtiges Beispiel!",
  "Unit conversion is important in measurement.": "Einheitenumrechnung ist wichtig beim Messen.",
  "Pillow — soft. When you press — it sinks in.": "Kissen — weich. Wenn du drückst — gibt es nach.",
  "Is wind energy — renewable or non-renewable?": "Ist Windenergie — erneuerbar oder nicht erneuerbar?",
  "After eating, several systems work together:": "Nach dem Essen arbeiten mehrere Systeme zusammen:",
  "Pot in full light versus pot in a dark room.": "Topf bei vollem Licht gegenüber Topf in einem dunklen Raum.",
  "Today we'll learn the diagonal of a square.": "Heute lernen wir die Diagonale eines Quadrats.",
  "14 is to the right of 9 on the number line.": "14 steht rechts von 9 auf dem Zahlenstrahl.",
  "Each step to the right = one number bigger.": "Jeder Schritt nach rechts = eine Zahl größer.",
  "When one is left alone — the number is odd.": "Wenn eines allein übrig bleibt — ist die Zahl ungerade.",
  "Half of the whole is 6 — what is the whole?": "Die Hälfte des Ganzen ist 6 — was ist das Ganze?",
  "Here you subtract 0, not the number itself.": "Hier subtrahierst du 0, nicht die Zahl selbst.",
  "340 ÷ 12 = 28 full baskets and remainder 4.": "340 ÷ 12 = 28 volle Körbe und Rest 4.",
  "3.25 × 100 = 325 — two places to the right.": "3,25 × 100 = 325 — zwei Stellen nach rechts.",
  "The ice (solid) turned into water (liquid).": "Das Eis (fest) wurde zu Wasser (flüssig).",
  "Cardboard on the table — shadow underneath.": "Karton auf dem Tisch — Schatten darunter.",
  "Multiply by the number of layers (height):": "Multipliziere mit der Anzahl der Schichten (Höhe):",
  "Divide by 2 (triangle = half a rectangle):": "Teile durch 2 (Dreieck = Hälfte eines Rechtecks):",
  "One step to the right → 9 (neighbor after)": "Ein Schritt nach rechts → 9 (Nachbar danach)",
  "Now you know how to find number neighbors.": "Jetzt weißt du, wie du Zahl-Nachbarn findest.",
  '- Put your finger on a number — "I\'m on 4"': "- Lege deinen Finger auf eine Zahl — „Ich bin auf 4“",
  "# Finding the Whole When You Know the Half": "# Das Ganze finden, wenn du die Hälfte kennst",
  "Half of the whole is 6. What is the whole?": "Die Hälfte des Ganzen ist 6. Was ist das Ganze?",
  "Tip: look in the times table — 6 × ? = 480": "Tipp: Schau im Einmaleins nach — 6 × ? = 480",
  "What do you do? Subtract: bigger − smaller": "Was tust du? Subtrahiere: Größeres − Kleineres",
  "185 ÷ 12 = 15 full cartons and remainder 5": "185 ÷ 12 = 15 volle Kartons und Rest 5",
  "? = sum − known number = 400,000 − 150,000": "? = Summe − bekannte Zahl = 400.000 − 150.000",
  "# Multiplication Equation — Missing Number": "# Multiplikationsgleichung — fehlende Zahl",
  "What do we see in the sky on a bright day?": "Was sehen wir am Himmel an einem hellen Tag?",
  "Skeleton and muscles — both work together.": "Skelett und Muskeln — beide arbeiten zusammen.",
  "- Earth — third planet, with water and air": "- Erde — dritter Planet, mit Wasser und Luft",
  "(A parallelogram = 2 pairs; here only 1.)": "(Ein Parallelogramm = 2 Paare; hier nur 1.)",
  "Tiling depends on the angles of the tile.": "Parkettierung hängt von den Winkeln der Fliese ab.",
  "Today we'll learn the area of a triangle.": "Heute lernen wir die Fläche eines Dreiecks.",
  "When you know the hypotenuse and one leg:": "Wenn du die Hypotenuse und eine Kathete kennst:",
  "What do we do? Subtract: bigger − smaller": "Was tun wir? Subtrahiere: Größeres − Kleineres",
  "1 and the number itself — always factors.": "1 und die Zahl selbst — immer Teiler.",
  "Now you know how to divide large numbers.": "Jetzt weißt du, wie du große Zahlen teilst.",
  "The step: +5,000; the next number: 40,000": "Der Schritt: +5.000; die nächste Zahl: 40.000",
  "# Making 100 — Getting Ready for Percents": "# 100 bilden — Vorbereitung auf Prozent",
  "850 ÷ 6 = 141 full boxes and remainder 4.": "850 ÷ 6 = 141 volle Schachteln und Rest 4.",
  "Polluted water — less good water for use.": "Verschmutztes Wasser — weniger gutes Wasser zum Nutzen.",
  "- Vertical fold — left half = right half": "- Senkrechte Faltung — linke Hälfte = rechte Hälfte",
  "- An arrow pointing right above the line": "- Ein Pfeil, der rechts oberhalb der Linie zeigt",
  "3 steps to the right of 2 gets you to 5.": "3 Schritte rechts von 2 bringen dich zu 5.",
  "From Sunday to Thursday — how many days?": "Von Sonntag bis Donnerstag — wie viele Tage?",
  "Is 126 divisible by 2? By 3? By 6? By 9?": "Ist 126 durch 2 teilbar? Durch 3? Durch 6? Durch 9?",
  "8,731 — ones digit 1 → odd (right away!)": "8.731 — Einerziffer 1 → ungerade (sofort!)",
  "Divide the numerator by the denominator!": "Teile den Zähler durch den Nenner!",
  "Today we will learn to divide fractions.": "Heute lernen wir, Brüche zu teilen.",
  "612 ÷ 8 = 76 full trays and remainder 4.": "612 ÷ 8 = 76 volle Tabletts und Rest 4.",
  "730 ÷ 9 = 81 full boxes and remainder 1.": "730 ÷ 9 = 81 volle Schachteln und Rest 1.",
  "When is it important to wash your hands?": "Wann ist es wichtig, sich die Hände zu waschen?",
  "Why is it important to keep water clean?": "Warum ist es wichtig, Wasser sauber zu halten?",
  "Inherited traits (for example fur color)": "Vererbte Merkmale (zum Beispiel Fellfarbe)",
  "In practice you'll find: a quarter of…?": "In der Übung findest du: ein Viertel von…?",
  "The numerator — how many parts we take.": "Der Zähler — wie viele Teile wir nehmen.",
  "÷6: must divide evenly by both 2 and 3.": "÷6: muss durch 2 und durch 3 glatt teilbar sein.",
  "246 — ones digit 6 → even (right away!)": "246 — Einerziffer 6 → gerade (sofort!)",
  "# Number Neighbors — Crossing Thousands": "# Zahl-Nachbarn — Tausenderübergang",
  "Today we will learn to divide decimals.": "Heute lernen wir, Dezimalzahlen zu teilen.",
  "The distance-time formula is important.": "Die Weg-Zeit-Formel ist wichtig.",
  "- Shadow — when a material blocks light": "- Schatten — wenn ein Material Licht blockiert",
  "Every star has a partner → 24 is even.": "Jeder Stern hat einen Partner → 24 ist gerade.",
  "What's inside the parentheses — first!": "Was in den Klammern steht — zuerst!",
  "Look for the difference — not the sum!": "Achte auf die Differenz — nicht auf die Summe!",
  "If they're equal — check the thousands": "Wenn sie gleich sind — prüfe die Tausender",
  "The sun is Earth's main energy source:": "Die Sonne ist die Hauptenergiequelle der Erde:",
  "Use the number line or the alligator!": "Nutze den Zahlenstrahl oder das Krokodil!",
  "Neighbor before = the number minus 1.": "Nachbar davor = die Zahl minus 1.",
  "How many did we take out of how many?": "Wie viele haben wir von wie vielen weggenommen?",
  "Try breaking numbers into easy parts!": "Versuch, Zahlen in einfache Teile zu zerlegen!",
  "# Number Sequences — Finding the Rule": "# Zahlenfolgen — die Regel finden",
  "A cup of water with salt — a mixture.": "Eine Tasse Wasser mit Salz — ein Gemisch.",
  "Right face = left face — third pair.": "Rechte Fläche = linke Fläche — drittes Paar.",
  "You can start at another number too:": "Du kannst auch bei einer anderen Zahl starten:",
  "She walks step by step to the right:": "Sie geht Schritt für Schritt nach rechts:",
  "What do we do? → addition: 5 + 5 + 2": "Was tun wir? → Addition: 5 + 5 + 2",
  "Important: the order doesn't matter!": "Wichtig: Die Reihenfolge spielt keine Rolle!",
  "# Even and Odd — Review and Practice": "# Gerade und ungerade — Wiederholung und Übung",
  "Crossing ten — an important example:": "Zehnerübergang — ein wichtiges Beispiel:",
  "The question asks for a total — add.": "Die Frage verlangt eine Summe — addiere.",
  'Why? 0 means "nothing to take away."': "Warum? 0 bedeutet „nichts wegzunehmen“.",
  "Divide the dividend by the quotient!": "Teile den Dividenden durch den Quotienten!",
  "The roots in the soil take in water.": "Die Wurzeln im Boden nehmen Wasser auf.",
  "# Full Investigation — Documentation": "# Vollständige Untersuchung — Dokumentation",
  "- Left side ∥ right side — parallel": "- Linke Seite ∥ rechte Seite — parallel",
  "- 4 on left ∥ 4 on right — parallel": "- 4 links ∥ 4 rechts — parallel",
  "Only one parallel pair → trapezoid.": "Nur ein paralleles Paar → Trapez.",
  "# Subtraction with a Missing Number": "# Subtraktion mit fehlender Zahl",
  "Neighbor after = the number plus 1.": "Nachbar danach = die Zahl plus 1.",
  "- The digit 6 on the right = 6 ones": "- Die Ziffer 6 rechts = 6 Einer",
  "Place value chart — the number 124:": "Stellenwerttafel — die Zahl 124:",
  "Is 120 divisible by 2? By 5? By 10?": "Ist 120 durch 2 teilbar? Durch 5? Durch 10?",
  'Frame for "how many more" problems:': "Rahmen für „wie viel mehr“-Aufgaben:",
  "Work by place first, then by value!": "Arbeite zuerst nach Stelle, dann nach Wert!",
  "- Top + right — 90°, perpendicular": "- Oben + rechts — 90°, senkrecht",
  "Every quadrilateral has 4 corners.": "Jedes Viereck hat 4 Ecken.",
  "In a right triangle: a² + b² = c².": "In einem rechtwinkligen Dreieck: a² + b² = c².",
  "The blank (__) = a missing number.": "Die Lücke (__) = eine fehlende Zahl.",
  "Place value chart — the number 14:": "Stellenwerttafel — die Zahl 14:",
  "3. What do we do? — add the values": "3. Was tun wir? — die Werte addieren",
  "Before you answer — read out loud:": "Bevor du antwortest — lies laut vor:",
  "If the half is 6 → the whole is 12": "Wenn die Hälfte 6 ist → ist das Ganze 12",
  "The missing number is 27 — not 72!": "Die fehlende Zahl ist 27 — nicht 72!",
  '"More" = difference — not a total!': "„Mehr“ = Differenz — nicht eine Summe!",
  "When there aren't enough — borrow!": "Wenn es nicht reicht — borgen!",
  "# Number Neighbors — Up to 100,000": "# Zahl-Nachbarn — bis 100.000",
  "- Water — to drink and not dry out": "- Wasser — zum Trinken und um nicht auszutrocknen",
  "# Earth — Rocks, Soil, and Seasons": "# Erde — Gesteine, Boden und Jahreszeiten",
  "Every day — height in centimeters.": "Jeden Tag — Höhe in Zentimetern.",
  "Variable — what we change (light).": "Variable — was wir verändern (Licht).",
  "# Number Neighbors — Crossing Ten": "# Zahl-Nachbarn — Zehnerübergang",
  "What do we add to 56 to reach 83?": "Was addieren wir zu 56, um 83 zu erreichen?",
  "When there isn't enough — borrow!": "Wenn es nicht reicht — borgen!",
  "Any number × 1 = the same number.": "Jede Zahl × 1 = dieselbe Zahl.",
  "Any number + 0 = the same number.": "Jede Zahl + 0 = dieselbe Zahl.",
  "Any number − 0 = the same number.": "Jede Zahl − 0 = dieselbe Zahl.",
  "Make sure the denominators match!": "Achte darauf, dass die Nenner übereinstimmen!",
  "# Materials — Everyday Properties": "# Stoffe — Eigenschaften im Alltag",
  "Only the state of matter changed.": "Nur der Aggregatzustand hat sich geändert.",
  "# Earth — Resources and Phenomena": "# Erde — Ressourcen und Erscheinungen",
  "Our triangle: 5 + 6 + 7 = 18 cm.": "Unser Dreieck: 5 + 6 + 7 = 18 cm.",
  "For example (base 10, height 4):": "Zum Beispiel (Grundseite 10, Höhe 4):",
  "Here — add directly or in steps:": "Hier — direkt oder schrittweise addieren:",
  "# Addition with a Missing Number": "# Addition mit fehlender Zahl",
  "Yesterday = the day before today": "Gestern = der Tag vor heute",
  "# Number Neighbors — Up to 1,000": "# Zahl-Nachbarn — bis 1.000",
  "You can use it in big additions.": "Du kannst es bei großen Additionen nutzen.",
  '"More" = difference — not a sum!': "„Mehr“ = Differenz — nicht eine Summe!",
  "# Number Sequences — Large Steps": "# Zahlenfolgen — große Schritte",
  "Work step by step with borrowing": "Arbeite Schritt für Schritt mit Borgen",
  "1,000 g = 1 kg — divide by 1,000": "1.000 g = 1 kg — teile durch 1.000",
  "In the morning the sun came out.": "Am Morgen kam die Sonne heraus.",
  "# The Human Body — Basic Systems": "# Der menschliche Körper — grundlegende Systeme",
  "Divide by the sum of the bases:": "Teile durch die Summe der Grundseiten:",
  "Forward = right = bigger number": "Vorwärts = rechts = größere Zahl",
  "Another step to the right → 10.": "Noch ein Schritt nach rechts → 10.",
  "quarter quarter quarter quarter": "Viertel Viertel Viertel Viertel",
  "For example, in the number 236:": "Zum Beispiel in der Zahl 236:",
  "Look only at the ones digit: 8.": "Schau nur auf die Einerziffer: 8.",
  "If there are none — it's prime.": "Wenn es keine gibt — ist es eine Primzahl.",
  "The next number: 250 + 50 = 300": "Die nächste Zahl: 250 + 50 = 300",
  "330 − 80 = 250 (subtract again)": "330 − 80 = 250 (nochmals subtrahieren)",
  "- Plant — makes food with light": "- Pflanze — erzeugt Nahrung mit Licht",
  "Other conditions stay the same:": "Andere Bedingungen bleiben gleich:",
  "The body — a system of systems:": "Der Körper — ein System aus Systemen:",
  "Hop one step to the right → 9.": "Hüpfe einen Schritt nach rechts → 9.",
  "Hop one step to the right → 3.": "Hüpfe einen Schritt nach rechts → 3.",
  "Another step to the right → 4.": "Noch ein Schritt nach rechts → 4.",
  "Another step to the right → 5.": "Noch ein Schritt nach rechts → 5.",
  "# Number Sequences — Big Jumps": "# Zahlenfolgen — große Sprünge",
  'Why? 0 means "nothing to add."': "Warum? 0 bedeutet „nichts zu addieren“.",
  "Write 2/3 as a decimal number.": "Schreibe 2/3 als Dezimalzahl.",
  "10:5 = 2:1 — divide both by 5.": "10:5 = 2:1 — teile beide durch 5.",
  "Look at the hundreds digit: 4.": "Schau auf die Hunderterziffer: 4.",
  "The species remains butterfly.": "Die Art bleibt Schmetterling.",
  "A full investigation includes:": "Eine vollständige Untersuchung umfasst:",
  "If you know A and B — find C:": "Wenn du A und B kennst — finde C:",
  "Hop one step to the right → 6": "Hüpfe einen Schritt nach rechts → 6",
  "Another step to the right → 7": "Noch ein Schritt nach rechts → 7",
  "Another step to the right → 8": "Noch ein Schritt nach rechts → 8",
  "Hop one step to the right → 5": "Hüpfe einen Schritt nach rechts → 5",
  "Another step to the right → 6": "Noch ein Schritt nach rechts → 6",
  "Divide: 7 ÷ 3 = 2 remainder 1": "Teile: 7 ÷ 3 = 2 Rest 1",
  "Look at the hundreds digit: 3": "Schau auf die Hunderterziffer: 3",
  "Write 2/3 as a decimal number": "Schreibe 2/3 als Dezimalzahl",
  "# Earth — Seasons and the Sky": "# Erde — Jahreszeiten und Himmel",
  "- Leaf — green, absorbs light": "- Blatt — grün, nimmt Licht auf",
  "Divide the area by the base:": "Teile die Fläche durch die Grundseite:",
  "And 3 coins of 1 → 1 + 1 + 1": "Und 3 Münzen zu 1 → 1 + 1 + 1",
  "Look at the digits: 2, 3, 6.": "Schau auf die Ziffern: 2, 3, 6.",
  "3. What do we do? — multiply": "3. Was tun wir? — multiplizieren",
  "The next number: 20 + 5 = 25": "Die nächste Zahl: 20 + 5 = 25",
  "What do we know? Two amounts": "Was wissen wir? Zwei Beträge",
  "2 × 15 = 30 — 15 full pairs.": "2 × 15 = 30 — 15 volle Paare.",
  'It asks "in total" → we add.': "Es fragt „insgesamt“ → wir addieren.",
  "Know the pair 37 + 63 = 100?": "Kennst du das Paar 37 + 63 = 100?",
  "100 cm = 1 m — divide by 100": "100 cm = 1 m — teile durch 100",
  "Every material is different.": "Jeder Stoff ist anders.",
  "Top ⊥ right — perpendicular": "Oben ⊥ rechts — senkrecht",
  "Each mark shows one number.": "Jede Markierung zeigt eine Zahl.",
  "- Add the half twice: 6 + 6": "- Addiere die Hälfte zweimal: 6 + 6",
  "Subtract tens: 60 − 20 = 40": "Subtrahiere Zehner: 60 − 20 = 40",
  "Don't forget the third one!": "Vergiss die dritte nicht!",
  "3 × 6 = 18 — 6 full groups.": "3 × 6 = 18 — 6 volle Gruppen.",
  "Then subtract: 30 − 12 = 18": "Dann subtrahiere: 30 − 12 = 18",
  "Then subtract: 40 − 24 = 16": "Dann subtrahiere: 40 − 24 = 16",
  "5 × 7 = 35 — 7 full groups.": "5 × 7 = 35 — 7 volle Gruppen.",
  "7 × 8 = 56 (8 full groups).": "7 × 8 = 56 (8 volle Gruppen).",
  "We find the missing number.": "Wir finden die fehlende Zahl.",
  "Is the pillow hard or soft?": "Ist das Kissen hart oder weich?",
  "# Plants — What Plants Need": "# Pflanzen — was Pflanzen brauchen",
  "# Earth — Weather and Water": "# Erde — Wetter und Wasser",
  "- Bottom-right corner: 90°": "- Untere rechte Ecke: 90°",
  "Make equal groups and add!": "Bilde gleiche Gruppen und addiere!",
  "1. Subtract tens from tens": "1. Subtrahiere Zehner von Zehnern",
  "2. Subtract ones from ones": "2. Subtrahiere Einer von Einern",
  "3. What do we do? — divide": "3. Was tun wir? — teilen",
  "Each child gets 6 cookies.": "Jedes Kind bekommt 6 Kekse.",
  "Each child gets 4 stickers": "Jedes Kind bekommt 4 Aufkleber",
  "Then multiply: 10 × 3 = 30": "Dann multipliziere: 10 × 3 = 30",
  "5 × 8 = 40 (8 full pages).": "5 × 8 = 40 (8 volle Seiten).",
  "Look at the hundreds digit": "Schau auf die Hunderterziffer",
  "Even a big number × 0 = 0:": "Sogar eine große Zahl × 0 = 0:",
  "Percent = part out of 100.": "Prozent = Teil von 100.",
  "- Work with a teacher only": "- Arbeite nur mit einer Lehrkraft",
  "- Need more stars until 7": "- Brauche mehr Sterne bis 7",
  'You can also say "times".': "Du kannst auch „mal“ sagen.",
  "Then multiply: 9 × 4 = 36": "Dann multipliziere: 9 × 4 = 36",
  "The missing number is 280": "Die fehlende Zahl ist 280",
  "The missing number is 238": "Die fehlende Zahl ist 238",
  "≈ means: about, close to.": "≈ bedeutet: ungefähr, nahe bei.",
  "7 × 9 = 63 (9 full bags).": "7 × 9 = 63 (9 volle Beutel).",
  "Is a pillow hard or soft?": "Ist ein Kissen hart oder weich?",
  "Earth is built in layers.": "Die Erde ist in Schichten aufgebaut.",
  "Only one pair — PQ ∥ SR.": "Nur ein Paar — PQ ∥ SR.",
  "Plug in the known angles": "Setze die bekannten Winkel ein",
  "# A Quarter of the Whole": "# Ein Viertel des Ganzen",
  "Subtract ones: 8 − 4 = 4": "Subtrahiere Einer: 8 − 4 = 4",
  "The missing number is 27": "Die fehlende Zahl ist 27",
  "The missing number is 82": "Die fehlende Zahl ist 82",
  "The missing number is 22": "Die fehlende Zahl ist 22",
  "Work from right to left!": "Arbeite von rechts nach links!",
  "The missing number is 36": "Die fehlende Zahl ist 36",
  "- Sun — light and warmth": "- Sonne — Licht und Wärme",
  "The largest angle = 75°": "Der größte Winkel = 75°",
  "- Top-right corner: 90°": "- Obere rechte Ecke: 90°",
  "(left) (right = bigger)": "(links) (rechts = größer)",
  "Look at the last digit!": "Schau auf die letzte Ziffer!",
  "The missing number is 3": "Die fehlende Zahl ist 3",
  "The missing number is 4": "Die fehlende Zahl ist 4",
  "The denominator stays 9": "Der Nenner bleibt 9",
  "# From Map to Real Life": "# Von der Karte zur Wirklichkeit",
  "# From Real Life to Map": "# Von der Wirklichkeit zur Karte",
  "The plant grows slowly.": "Die Pflanze wächst langsam.",
  "- Solar and wind energy": "- Sonnen- und Windenergie",
  "The key property here:": "Die wichtige Eigenschaft hier:",
  "Each coin has a value.": "Jede Münze hat einen Wert.",
  "The next number is 340": "Die nächste Zahl ist 340",
  "Look at the ones digit": "Schau auf die Einerziffer",
  "Look at the tens digit": "Schau auf die Zehnerziffer",
  "Work column by column!": "Arbeite Spalte für Spalte!",
  "Number of parts: 1+3=4": "Anzahl der Teile: 1+3=4",
  "We write 3:2 (3 to 2).": "Wir schreiben 3:2 (3 zu 2).",
  "Do not add — subtract!": "Nicht addieren — subtrahieren!",
  "You can return to ice.": "Du kannst wieder zu Eis zurückkehren.",
  "The third angle: 60°.": "Der dritte Winkel: 60°.",
  "The third angle = 40°": "Der dritte Winkel = 40°",
  "Then: 230 + 100 = 330": "Dann: 230 + 100 = 330",
  "Line up and subtract!": "Richte aus und subtrahiere!",
  "We take 1 of them → ½": "Wir nehmen 1 davon → ½",
  "We take 1 of them → ⅓": "Wir nehmen 1 davon → ⅓",
  "We take 1 of them → ¼": "Wir nehmen 1 davon → ¼",
  "We colored 3 of them.": "Wir haben 3 davon ausgemalt.",
  "You want to reach 10.": "Du willst 10 erreichen.",
  "Then add: 9 + 15 = 24": "Dann addiere: 9 + 15 = 24",
  "Is 7,905 even or odd?": "Ist 7.905 gerade oder ungerade?",
  "50% of 60 = 30 (half)": "50 % von 60 = 30 (Hälfte)",
  "Look at the thousands": "Schau auf die Tausender",
  "An important process:": "Ein wichtiger Vorgang:",
  '× means "groups of".': "× bedeutet „Gruppen von“.",
  "How do you subtract?": "Wie subtrahierst du?",
  "Then add: 6 + 8 = 14": "Dann addiere: 6 + 8 = 14",
  "Look at the hundreds": "Schau auf die Hunderter",
  "The weather changes:": "Das Wetter ändert sich:",
  "Leaves absorb light.": "Blätter nehmen Licht auf.",
  "- Water — use, waste": "- Wasser — Nutzen, Verschwendung",
  "Safety (important!):": "Sicherheit (wichtig!):",
  "Subtract from 180°:": "Subtrahiere von 180°:",
  "Divide by the base:": "Teile durch die Grundseite:",
  '+ means "and more".': "+ bedeutet „und dazu“.",
  "# Half of the Whole": "# Die Hälfte des Ganzen",
  "- Each child gets 6": "- Jedes Kind bekommt 6",
  "Is 905 even or odd?": "Ist 905 gerade oder ungerade?",
  "We do: 52 − 37 = 15": "Wir rechnen: 52 − 37 = 15",
  "Any number × 0 = 0.": "Jede Zahl × 0 = 0.",
  "The distance: 60 km": "Die Entfernung: 60 km",
  "We use >, <, and =.": "Wir verwenden >, < und =.",
  "Is a hamster alive?": "Ist ein Hamster lebendig?",
  "# Earth and Weather": "# Erde und Wetter",
  "# Number Neighbors": "# Zahl-Nachbarn",
  "- Each group has 4": "- Jede Gruppe hat 4",
  "Is 24 even or odd?": "Ist 24 gerade oder ungerade?",
  "# Number Sequences": "# Zahlenfolgen",
  "The diagonal = 10": "Die Diagonale = 10",
  "Line of symmetry:": "Symmetrieachse:",
  "Is 8 even or odd?": "Ist 8 gerade oder ungerade?",
  "- A straight line": "- Eine Gerade",
  "12 ÷ 3 = 4 means:": "12 ÷ 3 = 4 bedeutet:",
  "18 ÷ 3 = 6 means:": "18 ÷ 3 = 6 bedeutet:",
  "25% = one quarter": "25 % = ein Viertel",
  "The largest = 15.": "Das größte = 15.",
  "We live on Earth.": "Wir leben auf der Erde.",
  "# Our Environment": "# Unsere Umwelt",
  "Location (light).": "Standort (Licht).",
  "You want to test:": "Du willst testen:",
  "The solar system:": "Das Sonnensystem:",
  "Look at the ones": "Schau auf die Einer",
  "Look at the tens": "Schau auf die Zehner",
  "3/4 means 3 ÷ 4.": "3/4 bedeutet 3 ÷ 4.",
  "Amount of light.": "Menge an Licht.",
  "- Right side: 5": "- Rechte Seite: 5",
  "Right = bigger.": "Rechts = größer.",
  "We know: 52, 37": "Wir wissen: 52, 37",
  "What we can do:": "Was wir tun können:",
  "- Each side: 6": "- Jede Seite: 6",
  "Top and right?": "Oben und rechts?",
  "3. Divide by 2": "3. Teile durch 2",
  "How to use it:": "So nutzt du es:",
  "The number 40:": "Die Zahl 40:",
  "What do we do?": "Was tun wir?",
  "¼ — a quarter:": "¼ — ein Viertel:",
  "Know: 125, 89": "Kennst: 125, 89",
  "Divide by 2:": "Teile durch 2:",
  "4 × 6 means:": "4 × 6 bedeutet:",
  "5 × 4 means:": "5 × 4 bedeutet:",
  "We're asked:": "Wir werden gefragt:",
  "Is 21 prime?": "Ist 21 eine Primzahl?",
  "Is it alive?": "Ist es lebendig?",
  "The message:": "Die Botschaft:",
  "half   half": "Hälfte   Hälfte",
  "½ — a half:": "½ — eine Hälfte:",
  "How to add:": "So addierst du:",
  "More pairs:": "Weitere Paare:",
  "Proper use:": "Richtige Nutzung:",
  "What stays?": "Was bleibt?",
  "Asked for:": "Gefragt wird:",
  "Watch out:": "Achtung:",
  "Subtract!": "Subtrahiere!",
  "↑ today": "↑ heute",
  "Light:": "Licht:",
  "Here:": "Hier:",
  "How many full groups? 9 × 6 = 54 (6 full groups).": "Wie viele volle Gruppen? 9 × 6 = 54 (6 volle Gruppen).",
  "Write repeated multiplication — and work it out step by step.":
    "Schreibe die wiederholte Multiplikation — und rechne Schritt für Schritt.",
  "Two identical cups, same number of seeds, same location.":
    "Zwei gleiche Becher, dieselbe Anzahl Samen, derselbe Standort.",
  "Side = a straight line from side to side — length 6.":
    "Seite = eine Gerade von Seite zu Seite — Länge 6.",
  "Steps: multiply left to right — or in small groups.":
    "Schritte: multipliziere von links nach rechts — oder in kleinen Gruppen.",
  "If equal — hundreds": "Wenn gleich — Hunderter",
  "Write repeated multiplication — and work it out step by step.":
    "Schreibe die wiederholte Multiplikation — und rechne Schritt für Schritt.",
};

// Pattern fill for anything still missing
function author(en) {
  if (DE[en] && !STILL.test(DE[en])) return DE[en];
  let m;
  if ((m = en.match(/^Work out:\s*(.+)$/i))) return `Rechne: ${deNum(m[1]).replace(/quotient and remainder/i, "Quotient und Rest").replace(/with remainder/i, "mit Rest")}`;
  if ((m = en.match(/^Work out\s+(.+)$/i))) return `Rechne ${deNum(m[1])}`;
  if ((m = en.match(/^The missing number is (\d+)$/i))) return `Die fehlende Zahl ist ${m[1]}`;
  if ((m = en.match(/^The missing number is (\d+)\.$/i))) return `Die fehlende Zahl ist ${m[1]}.`;
  if ((m = en.match(/^# (.+)$/))) {
    const title = m[1]
      .replace(/Number Neighbors/g, "Zahl-Nachbarn")
      .replace(/Number Sequences/g, "Zahlenfolgen")
      .replace(/Earth and Weather/g, "Erde und Wetter")
      .replace(/Our Environment/g, "Unsere Umwelt")
      .replace(/Half of the Whole/g, "Die Hälfte des Ganzen")
      .replace(/A Quarter of the Whole/g, "Ein Viertel des Ganzen")
      .replace(/From Map to Real Life/g, "Von der Karte zur Wirklichkeit")
      .replace(/From Real Life to Map/g, "Von der Wirklichkeit zur Karte")
      .replace(/Plants — What Plants Need/g, "Pflanzen — was Pflanzen brauchen")
      .replace(/Earth — Weather and Water/g, "Erde — Wetter und Wasser")
      .replace(/Earth — Seasons and the Sky/g, "Erde — Jahreszeiten und Himmel")
      .replace(/Materials — Everyday Properties/g, "Stoffe — Eigenschaften im Alltag")
      .replace(/Earth — Resources and Phenomena/g, "Erde — Ressourcen und Erscheinungen")
      .replace(/The Human Body — Basic Systems/g, "Der menschliche Körper — grundlegende Systeme")
      .replace(/Addition with a Missing Number/g, "Addition mit fehlender Zahl")
      .replace(/Subtraction with a Missing Number/g, "Subtraktion mit fehlender Zahl")
      .replace(/Multiplication Equation — Missing Number/g, "Multiplikationsgleichung — fehlende Zahl")
      .replace(/Full Investigation — Documentation/g, "Vollständige Untersuchung — Dokumentation")
      .replace(/Even and Odd — Review and Practice/g, "Gerade und ungerade — Wiederholung und Übung")
      .replace(/Making 100 — Getting Ready for Percents/g, "100 bilden — Vorbereitung auf Prozent")
      .replace(/Finding the Whole When You Know the Half/g, "Das Ganze finden, wenn du die Hälfte kennst")
      .replace(/Earth — Rocks, Soil, and Seasons/g, "Erde — Gesteine, Boden und Jahreszeiten")
      .replace(/Crossing Thousands/g, "Tausenderübergang")
      .replace(/Crossing Ten/g, "Zehnerübergang")
      .replace(/Up to 100,000/g, "bis 100.000")
      .replace(/Up to 1,000/g, "bis 1.000")
      .replace(/Large Steps/g, "große Schritte")
      .replace(/Big Jumps/g, "große Sprünge")
      .replace(/Finding the Rule/g, "die Regel finden");
    if (!STILL.test(title)) return `# ${title}`;
  }
  return DE[en] || en;
}

const out = {};
const bad = [];
for (const en of ens) {
  const de = author(en);
  out[en] = de;
  if (!de || de === en || STILL.test(de)) bad.push({ en, de });
}
fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-13-de-map.json"), JSON.stringify(out, null, 2));
fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-13-bad.json"), JSON.stringify(bad, null, 2));
console.log({ total: ens.length, bad: bad.length, good: ens.length - bad.length, sampleBad: bad.slice(0, 25) });

const map = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-map.json"), "utf8"));
const scopes = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-scopes-de.json"), "utf8"));
Object.assign(map, scopes);
for (const [en, de] of Object.entries(out)) {
  if (de && de !== en && !STILL.test(de)) map[en] = de;
}
fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-map.json"), JSON.stringify(map, null, 2));

let r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], { cwd: ROOT, stdio: "inherit" });
if (r.status) process.exit(r.status);
fs.copyFileSync(
  path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"),
  path.join(ROOT, "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_rectangle.md")
);
spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-bad.mjs")], { cwd: ROOT, stdio: "inherit" });
spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-hybrid-student.mjs")], { cwd: ROOT, stdio: "inherit" });
