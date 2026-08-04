/**
 * Author natural German for all part-13 need lines, merge into residue map, rebuild.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const need = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-13-need.json"), "utf8"));

const STILL =
  /\b(the|and|with|that|which|because|through|their|they|these|those|would|could|should|from|have|been|does|make|help|need|what|when|where|how|why|for|only|more|most|other|than|then|each|every|will|are|were|you|your|we|our|\bis\b|like|has|not|don't|let's|this|here|use|look|try|work out|learn|divide|subtract|take away|means|getting|know|important|example|today|practice|questions|someone|asks|everyday|floor tile|right angles|geometry|number line|quarter turn|half turn|full turn|light|shadow|reflection|transparency|mixture|mixtures|climate|solar|earth|space|scientists|worldwide|impodertant|foder|Work out|Now you|Here we|Imagine|That is|If someone|Hold a|Translation or|Modere|left and right|Content scope|students|quotient|remainder)\b/i;

function deNum(s) {
  return String(s).replace(/(\d),(\d{3})\b/g, "$1.$2").replace(/(\d)\.(\d{1,2})\b/g, "$1,$2");
}

/** Lexical helpers applied only after structural templates — long phrases first. */
function polish(s) {
  let t = s;
  const pairs = [
    ["**Content scope:**", "**Inhaltsumfang:**"],
    ["quotient and remainder", "Quotient und Rest"],
    ["decimal numbers", "Dezimalzahlen"],
    ["decimal point", "Komma"],
    ["number line", "Zahlenstrahl"],
    ["right angles", "rechte Winkel"],
    ["right angle", "rechter Winkel"],
    ["floor tile", "Bodenfliese"],
    ["mirror image", "Spiegelbild"],
    ["quarter turn", "Vierteldrehung"],
    ["half turn", "Halbdrehung"],
    ["full turn", "volle Drehung"],
    ["long division", "schriftliche Division"],
    ["two-digit", "zweistellige"],
    ["one-digit", "einstellige"],
    ["place value", "Stellenwert"],
    ["times table", "Einmaleins"],
    ["equal groups", "gleiche Gruppen"],
    ["fair sharing", "gerechtes Teilen"],
    ["common denominator", "gemeinsamen Nenner"],
    ["greatest common factor", "größten gemeinsamen Teiler"],
    ["Greatest Common Factor", "größten gemeinsamen Teiler"],
    ["missing number", "fehlende Zahl"],
    ["missing factor", "fehlenden Faktor"],
    ["missing divisor", "fehlenden Divisor"],
    ["word problem", "Textaufgabe"],
    ["word problems", "Textaufgaben"],
    ["rectangular prism", "Quader"],
    ["solar system", "Sonnensystem"],
    ["climate change", "Klimawandel"],
    ["carbon footprint", "CO₂-Fußabdruck"],
    ["power plants", "Kraftwerke"],
    ["single-use plastic", "Einwegplastik"],
    ["food web", "Nahrungsnetz"],
    ["food chain", "Nahrungskette"],
    ["Earth's crust", "Erdkruste"],
    ["Earth's surface", "Erdoberfläche"],
    ["Earth's place", "den Platz der Erde"],
    ["in geometry", "in Geometrie"],
    ["in science", "in Naturwissenschaften"],
    ["in math", "in Mathematik"],
    ["students", "Schülerinnen und Schüler"],
    ["teacher", "Lehrkraft"],
    ["shekels", "Euro"],
    ["shekel", "Euro"],
    ["$120", "120 €"],
    ["$170", "170 €"],
  ];
  for (const [a, b] of pairs) t = t.split(a).join(b);
  return t;
}

function author(en) {
  let t = en;
  let m;

  if ((m = t.match(/^Work out:\s*(.+)$/i))) return `Rechne: ${deNum(m[1])}`;
  if ((m = t.match(/^The missing number is (\d+)\.$/i))) return `Die fehlende Zahl ist ${m[1]}.`;
  if ((m = t.match(/^What is a quarter of (\d+)\?$/i))) return `Was ist ein Viertel von ${m[1]}?`;
  if ((m = t.match(/^What is half of (\d+)\?$/i))) return `Was ist die Hälfte von ${m[1]}?`;
  if ((m = t.match(/^A quarter of (\d+) = (\d+)$/i))) return `Ein Viertel von ${m[1]} = ${m[2]}`;
  if ((m = t.match(/^Half of (\d+) = (\d+)$/i))) return `Die Hälfte von ${m[1]} = ${m[2]}`;
  if ((m = t.match(/^A quarter of the whole is (\d+)\.$/i))) return `Ein Viertel des Ganzen ist ${m[1]}.`;
  if ((m = t.match(/^Half of the whole is (\d+)\.$/i))) return `Die Hälfte des Ganzen ist ${m[1]}.`;
  if (/^A quarter = one part out of four equal parts\.$/i.test(t))
    return "Ein Viertel = ein Teil von vier gleichen Teilen.";
  if (/^Half = one part out of two equal parts\.$/i.test(t))
    return "Eine Hälfte = ein Teil von zwei gleichen Teilen.";
  if (/^≈ means about, close to\.$/i.test(t)) return "≈ bedeutet ungefähr, nahe bei.";
  if (/^Translation or reflection\?$/i.test(t)) return "Verschiebung oder Spiegelung?";
  if (/^Reflection:$/i.test(t)) return "Spiegelung:";
  if (/^Reflection$/i.test(t)) return "Spiegelung";
  if (/^Divide!$/i.test(t)) return "Teile!";
  if (/^If equal — tens$/i.test(t)) return "Wenn gleich — Zehner";
  if (/^If equal — ones$/i.test(t)) return "Wenn gleich — Einer";
  if (/^- A straight line with marked dots$/i.test(t)) return "- Eine Gerade mit markierten Punkten";
  if (/^How many degrees are in a half turn\?$/i.test(t)) return "Wie viele Grad hat eine Halbdrehung?";
  if (/^How many students won't be in a full group\?$/i.test(t))
    return "Wie viele Schülerinnen und Schüler sind nicht in einer vollen Gruppe?";

  if ((m = t.match(/^Now you know how to (.+)$/i))) {
    let rest = m[1]
      .replace(/subtract decimal numbers\./i, "Dezimalzahlen subtrahierst.")
      .replace(/subtract vertically — trading one ten for 10 ones\./i, "senkrecht subtrahierst — einen Zehner in 10 Einer umtauschen.")
      .replace(/break a number up to 10,000 into thousands, hundreds, tens, and ones\./i, "eine Zahl bis 10.000 in Tausender, Hunderter, Zehner und Einer zerlegst.")
      .replace(/break a number up to 1,000 into hundreds, tens, and ones\./i, "eine Zahl bis 1.000 in Hunderter, Zehner und Einer zerlegst.")
      .replace(/break a number into hundreds, tens, and ones\./i, "eine Zahl in Hunderter, Zehner und Einer zerlegst.")
      .replace(/break apart a number up to 100,000 by place value\./i, "eine Zahl bis 100.000 nach Stellenwert zerlegst.")
      .replace(/solve subtraction equations with a missing number up to 1,000\./i, "Subtraktionsgleichungen mit fehlender Zahl bis 1.000 löst.")
      .replace(/solve addition equations with a missing number up to 1,000\./i, "Additionsgleichungen mit fehlender Zahl bis 1.000 löst.")
      .replace(/solve a subtraction equation with a missing number\./i, "eine Subtraktionsgleichung mit fehlender Zahl löst.")
      .replace(/solve an addition equation with a missing number\./i, "eine Additionsgleichung mit fehlender Zahl löst.")
      .replace(/find the area of a square — with a grid or by multiplying!/i, "die Fläche eines Quadrats findest — mit einem Gitter oder durch Multiplizieren!")
      .replace(/subtract two numbers\./i, "zwei Zahlen subtrahierst.")
      .replace(/divide by two-digit number\./i, "durch eine zweistellige Zahl teilst.")
      .replace(/find the perimeter of a square — first count 4 sides!/i, "den Umfang eines Quadrats findest — zähle zuerst 4 Seiten!");
    return `Jetzt weißt du, wie du ${rest}`;
  }
  if ((m = t.match(/^Now you know about (.+)$/i))) return `Jetzt kennst du ${polish(m[1])}`;
  if ((m = t.match(/^Now you know the (.+)$/i))) return `Jetzt kennst du ${polish(m[1])}`;
  if ((m = t.match(/^Now you know (.+)$/i))) return `Jetzt weißt du ${polish(m[1])}`;
  if ((m = t.match(/^Now you can (.+)$/i))) return `Jetzt kannst du ${polish(m[1])}`;

  if ((m = t.match(/^Today we'll learn to (.+)$/i)) || (m = t.match(/^Today we will learn to (.+)$/i))) {
    return `Heute lernen wir, ${polish(m[1])
      .replace(/estimate an addition answer — not calculate exactly, but get close\./i, "ein Additionsergebnis zu schätzen — nicht genau zu berechnen, sondern nah heranzukommen.")
      .replace(/estimate an addition answer — not exact, but about right\./i, "ein Additionsergebnis zu schätzen — nicht genau, sondern ungefähr richtig.")
      .replace(/estimate a multiplication answer — about right, not exact\./i, "ein Multiplikationsergebnis zu schätzen — ungefähr richtig, nicht genau.")
      .replace(/find the Greatest Common Factor \(GCF\) of two numbers\./i, "den größten gemeinsamen Teiler (ggT) zweier Zahlen zu finden.")
      .replace(/find the greatest common factor \(GCF\) of two numbers\./i, "den größten gemeinsamen Teiler (ggT) zweier Zahlen zu finden.")
      .replace(/add and subtract fractions with a common denominator\./i, "Brüche mit gemeinsamem Nenner zu addieren und zu subtrahieren.")
      .replace(/find a percent of a quantity — for example 25% of 80\./i, "einen Prozentsatz einer Menge zu finden — zum Beispiel 25 % von 80.")
      .replace(/calculate the value of a power — for example 2⁵\./i, "den Wert einer Potenz zu berechnen — zum Beispiel 2⁵.")
      .replace(/convert weight units — grams and kilograms\./i, "Gewichtseinheiten umzurechnen — Gramm und Kilogramm.")
      .replace(/solve a multiplication equation — find the missing factor\./i, "eine Multiplikationsgleichung zu lösen — den fehlenden Faktor zu finden.")
      .replace(/solve a division equation — find the missing divisor\./i, "eine Divisionsgleichung zu lösen — den fehlenden Divisor zu finden.")
      .replace(/solve a subtraction equation with a blank — __\./i, "eine Subtraktionsgleichung mit Lücke — __ zu lösen.")
      .replace(/solve an addition equation with a blank — __\./i, "eine Additionsgleichung mit Lücke — __ zu lösen.")
      .replace(/subtract a large number from a large number — up to 100,000\./i, "eine große Zahl von einer großen Zahl zu subtrahieren — bis 100.000.")
      .replace(/divide by a two-digit number — the long division algorithm\./i, "durch eine zweistellige Zahl zu teilen — mit dem Algorithmus der schriftlichen Division.")
      .replace(/round a number to the nearest ten, hundred, or thousand\./i, "eine Zahl auf den nächsten Zehner, Hunderter oder Tausender zu runden.")
      .replace(/subtract decimal numbers — for example 5\.7 − 2\.2\./i, "Dezimalzahlen zu subtrahieren — zum Beispiel 5,7 − 2,2.")
      .replace(/multiply by hundreds — for example 5 × 200\./i, "mit Hundertern zu multiplizieren — zum Beispiel 5 × 200.")
      .replace(/find the price after a percent discount\./i, "den Preis nach einem Prozent-Rabatt zu finden.")}`;
  }

  if ((m = t.match(/^Today we're going to learn to (.+)$/i))) {
    return `Heute lernen wir, ${polish(m[1])
      .replace(/subtract two numbers up to 100 — in a row, in your head, or in writing\./i, "zwei Zahlen bis 100 zu subtrahieren — in einer Reihe, im Kopf oder schriftlich.")}`;
  }
  if ((m = t.match(/^Today we're going to learn (.+)$/i))) {
    return `Heute lernen wir ${polish(m[1])
      .replace(/multiplication — here it's both equal groups and the times table\./i, "Multiplikation — hier sind es sowohl gleiche Gruppen als auch das Einmaleins.")
      .replace(/what a quarter is — a quarter of the whole\./i, ", was ein Viertel ist — ein Viertel des Ganzen.")
      .replace(/when a number divides by 2, 5, and 10\./i, ", wann eine Zahl durch 2, 5 und 10 teilbar ist.")
      .replace(/what a number line is\./i, ", was ein Zahlenstrahl ist.")
      .replace(/to subtract two numbers\./i, ", zwei Zahlen zu subtrahieren.")}`;
  }
  if ((m = t.match(/^Today we'll learn (.+)$/i)) || (m = t.match(/^Today we will learn (.+)$/i))) {
    return `Heute lernen wir ${polish(m[1])
      .replace(/multiplication — including two-digit multiplication and breaking-apart strategies\./i, "Multiplikation — einschließlich zweistelliger Multiplikation und Zerlegungsstrategien.")
      .replace(/the area of a trapezoid — for example a garden plot shaped like a trapezoid\./i, "die Fläche eines Trapezes — zum Beispiel ein gartenähnliches Trapezgrundstück.")
      .replace(/vertical multiplication — a two-digit number times one digit\./i, "die senkrechte Multiplikation — eine zweistellige Zahl mal eine einstellige.")
      .replace(/the area of a square with full units — 7 cm → 49 cm²\./i, "die Fläche eines Quadrats mit vollen Einheiten — 7 cm → 49 cm².")
      .replace(/a strategy for mental addition using making 100\./i, "eine Strategie für kopfrechnen Addition mit Bilden von 100.")
      .replace(/the Pythagorean theorem in geometry — finding the hypotenuse\./i, "den Satz des Pythagoras in Geometrie — das Finden der Hypotenuse.")
      .replace(/volume of a prism — triangular base\./i, "das Volumen eines Prismas — mit dreieckiger Grundfläche.")}`;
  }
  if ((m = t.match(/^Today we will strengthen (.+)$/i)) || (m = t.match(/^Today we'll strengthen (.+)$/i))) {
    return `Heute festigen wir ${polish(m[1])}`;
  }
  if ((m = t.match(/^Today we will find (.+)$/i)) || (m = t.match(/^Today we'll find (.+)$/i))) {
    return `Heute finden wir ${polish(m[1])}`;
  }
  if ((m = t.match(/^Today we will check (.+)$/i))) return `Heute prüfen wir ${polish(m[1])}`;
  if ((m = t.match(/^Today we will solve (.+)$/i))) return `Heute lösen wir ${polish(m[1])}`;
  if ((m = t.match(/^Today in geometry we will (.+)$/i))) return `Heute ${polish(m[1]).replace(/^go deeper into/, "gehen wir in Geometrie tiefer ein auf").replace(/^learn/, "lernen wir in Geometrie")}`;
  if ((m = t.match(/^Today in science we will (.+)$/i))) {
    return `Heute ${polish(m[1])
      .replace(/^learn about/, "lernen wir in Naturwissenschaften etwas über")
      .replace(/^learn to/, "lernen wir in Naturwissenschaften,")
      .replace(/^learn /, "lernen wir in Naturwissenschaften ")}`;
  }

  if (t.startsWith("**Content scope:**")) {
    return polish(t)
      .replace(/Half as a visual part\. Half = one part out of two equal parts\. No advanced fraction calculation, no numerator\/denominator\./i, "Hälfte als anschaulicher Teil. Hälfte = ein Teil von zwei gleichen Teilen. Keine fortgeschrittene Bruchrechnung, kein Zähler/Nenner.")
      .replace(/A quarter as a visual part\. A quarter = one part out of four equal parts\. No thirds\/eighths, no fraction calculation\./i, "Viertel als anschaulicher Teil. Viertel = ein Teil von vier gleichen Teilen. Keine Drittel/Achtel, keine Bruchrechnung.")
      .replace(/Multiples of a number — multiply by 1, 2, 3… Numbers up to ~100\. Link to the times table\. Factors → `fm_factor`\./i, "Vielfache einer Zahl — multipliziere mit 1, 2, 3… Zahlen bis ~100. Verbindung zum Einmaleins. Teiler → `fm_factor`.")
      .replace(/Climate change — factual, not scary; solar system — requires illustration: Earth in the solar system/i, "Klimawandel — sachlich, nicht beängstigend; Sonnensystem — braucht Abbildung: Erde im Sonnensystem")
      .replace(/Subtraction sentence with \*\*one blank\*\* \(missing number\)\. Not below 0\. No variables, no algebra\./i, "Subtraktionssatz mit **einer Lücke** (fehlende Zahl). Nicht unter 0. Keine Variablen, keine Algebra.")
      .replace(/Mixtures\/solutions; shadow, reflection, transparency — requires illustration: path of light/i, "Gemische/Lösungen; Schatten, Spiegelung, Durchsichtigkeit — braucht Abbildung: Lichtweg")
      .replace(/Layers of Earth; earthquakes\/volcano — awareness — requires illustration: layers of Earth/i, "Schichten der Erde; Erdbeben/Vulkan — Bewusstsein — braucht Abbildung: Erdschichten")
      .replace(/Seasons; the sun as a source of light and heat — no complex scientific mechanisms/i, "Jahreszeiten; die Sonne als Quelle von Licht und Wärme — keine komplexen wissenschaftlichen Mechanismen")
      .replace(/One-digit number × tens \(10, 20, … 90\)\. No two-digit × two-digit\./i, "Einstellige Zahl × Zehner (10, 20, … 90). Keine zweistellig × zweistellig.")
      .replace(/Subtracting 0 from a number\. A number minus 0\. No negatives\./i, "0 von einer Zahl subtrahieren. Eine Zahl minus 0. Keine negativen Zahlen.")
      .replace(/Multiply numerator and denominator by the same number/i, "Zähler und Nenner mit derselben Zahl multiplizieren")
      .replace(/Quarter turn 90°; introduction; no formal center/i, "Vierteldrehung 90°; Einführung; kein formales Zentrum")
      .replace(/Long division algorithm; two-digit divisor/i, "Algorithmus der schriftlichen Division; zweistelliger Divisor")
      .replace(/Half as a visual part\./i, "Hälfte als anschaulicher Teil.");
  }

  // Curated full lines (high-frequency / awkward patterns)
  const CURATED = {
    "Everyday examples:": "Alltagsbeispiele:",
    "Imagine a square floor tile:": "Stell dir eine quadratische Bodenfliese vor:",
    "That is a square.": "Das ist ein Quadrat.",
    "If someone asks:": "Wenn jemand fragt:",
    "4 right angles — also like a square.": "4 rechte Winkel — auch wie bei einem Quadrat.",
    "Now you know the square in geometry.": "Jetzt kennst du das Quadrat in Geometrie.",
    "Here we will learn translation and reflection.": "Hier lernen wir Verschiebung und Spiegelung.",
    "- Hold a mirror next to it — you see a reflection (mirror image)":
      "- Halte einen Spiegel daneben — du siehst eine Spiegelung (Spiegelbild)",
    "- Hold a mirror next to the arrow — the arrow looks flipped → reflection":
      "- Halte einen Spiegel neben den Pfeil — der Pfeil wirkt gespiegelt → Spiegelung",
    "Here we check more carefully:": "Hier prüfen wir sorgfältiger:",
    "A shape like a mirror image — left and right swap places.":
      "Eine Form wie ein Spiegelbild — links und rechts tauschen die Plätze.",
    "If yes — it is usually a translation.": "Wenn ja — ist es meist eine Verschiebung.",
    "# Translation and Reflection — More Practice": "# Verschiebung und Spiegelung — Mehr Übung",
    "# The Number Line": "# Der Zahlenstrahl",
    "# Subtracting Two Numbers": "# Zwei Zahlen subtrahieren",
    "# Division by Two-Digit Number": "# Division durch eine zweistellige Zahl",
    "# Materials — Mixtures and Light": "# Stoffe — Gemische und Licht",
    "# Earth — Climate and Space": "# Erde — Klima und Weltraum",
    "# Volume of a Prism — Triangular Base": "# Volumen eines Prismas — dreieckige Grundfläche",
    "# Word Problems — How Many More?": "# Textaufgaben — Wie viel mehr?",
    "Numbers line is a line with marks on it.": "Ein Zahlenstrahl ist eine Linie mit Markierungen darauf.",
    "A number line is a line with marks on it.": "Ein Zahlenstrahl ist eine Linie mit Markierungen darauf.",
    "Use the number line!": "Nutze den Zahlenstrahl!",
    "Use Zahlenstrahl!": "Nutze den Zahlenstrahl!",
    "Let's find how many are left:": "Lass uns herausfinden, wie viele übrig sind:",
    "− means \"less\", \"take away\", or \"remove\".": "− bedeutet „weniger“, „wegnehmen“ oder „entfernen“.",
    "There were 8 stickers.": "Es gab 8 Aufkleber.",
    "3 stickers were taken.": "3 Aufkleber wurden weggenommen.",
    "Put out 9 objects (like stars).": "Lege 9 Gegenstände aus (wie Sterne).",
    "After 3 steps you land on 7.": "Nach 3 Schritten landest du auf 7.",
    "Start at 10.": "Starte bei 10.",
    "This is an important skill for solving problems.": "Das ist eine wichtige Fähigkeit zum Lösen von Aufgaben.",
    "Today we will learn divide by a two-digit number — the long division algorithm.":
      "Heute lernen wir, durch eine zweistellige Zahl zu teilen — mit dem Algorithmus der schriftlichen Division.",
    "Today we're going to learn to subtract two numbers.": "Heute lernen wir, zwei Zahlen zu subtrahieren.",
    "Subtraction is when you take part of a group — or hop backward on the number line.":
      "Subtraktion ist, wenn du einen Teil einer Gruppe wegimmst — oder auf dem Zahlenstrahl rückwärts hüpfst.",
    "This is a challenge we can act on — clean energy, less waste, protecting forests.":
      "Das ist eine Herausforderung, bei der wir handeln können — saubere Energie, weniger Abfall, Wälder schützen.",
    "Light travels in a straight line.": "Licht breitet sich geradlinig aus.",
    "That is reflection.": "Das ist Spiegelung.",
    "That is transparency.": "Das ist Durchsichtigkeit.",
    "Mirror — returns light (reflection). Clear glass — passes light (transparency).":
      "Spiegel — gibt Licht zurück (Spiegelung). Klares Glas — lässt Licht hindurch (Durchsichtigkeit).",
    "A mirror — smooth shiny surface; light bounces off at an equal angle to the angle it hit.":
      "Ein Spiegel — glatte glänzende Oberfläche; Licht wird unter dem gleichen Winkel reflektiert, unter dem es auftrifft.",
    "Here we focus on getting to know rotation — not on calculating the center of rotation.":
      "Hier geht es darum, Drehung kennenzulernen — nicht darum, den Drehpunkt zu berechnen.",
    "A quarter turn = 90° — one quarter of a full path (360°).":
      "Eine Vierteldrehung = 90° — ein Viertel eines vollen Umlaufs (360°).",
    "A quarter turn = one quarter of 360°.": "Eine Vierteldrehung = ein Viertel von 360°.",
    "We rotated a shape a quarter turn. How many degrees did we rotate?":
      "Wir haben eine Form um eine Vierteldrehung gedreht. Um wie viele Grad haben wir gedreht?",
    "Now you know a quarter turn in geometry.": "Jetzt kennst du die Vierteldrehung in Geometrie.",
    "How many degrees are in a half turn?": "Wie viele Grad hat eine Halbdrehung?",
    "A full turn = 360°.": "Eine volle Drehung = 360°.",
    "A half turn =": "Eine Halbdrehung =",
    "A half turn = 180°": "Eine Halbdrehung = 180°",
    "Imagine an arrow on a clock:": "Stell dir einen Pfeil auf einer Uhr vor:",
    "Rounding to nearest thousand — look at hundreds digit.":
      "Runden auf den nächsten Tausender — schau auf die Hunderterziffer.",
    "Look at tens digit: 4 (4 < 5 → round down).":
      "Schau auf die Zehnerziffer: 4 (4 < 5 → abrunden).",
    "Link Grade 3: 7 + 3 = 10 → 67 + 33 = 100 (same idea with tens).":
      "Verbindung 3. Klasse: 7 + 3 = 10 → 67 + 33 = 100 (dieselbe Idee mit Zehnern).",
    "In Israel — hot dry summer, rainy winter — local climate.":
      "In Israel — heißer trockener Sommer, regnerischer Winter — lokales Klima.",
    "Worldwide — scientists see warmer years on average.":
      "Weltweit — Wissenschaftlerinnen und Wissenschaftler sehen im Durchschnitt wärmere Jahre.",
    "Earth orbits the sun — one year; one day — rotation on its axis.":
      "Die Erde kreist um die Sonne — ein Jahr; ein Tag — Drehung um die eigene Achse.",
    "Gases in air trap heat": "Gase in der Luft halten Wärme zurück",
    "Using fuels and cutting forests — contribute this":
      "Nutzung von Brennstoffen und Abholzung von Wäldern — tragen dazu bei",
    "Hot or cold days, rainy or dry periods.": "Heiße oder kalte Tage, regnerische oder trockene Perioden.",
    "sun — star at center": "Sonne — Stern in der Mitte",
    "Earth — third planet, with water and air": "Erde — dritter Planet, mit Wasser und Luft",
    "Cup water with salt — mixture.": "Tasse Wasser mit Salz — Gemisch.",
    "A sun window — light passes through (transparent).":
      "Ein sonniges Fenster — Licht geht hindurch (durchsichtig).",
    "Cardboard on table — shadow underneath.": "Karton auf dem Tisch — Schatten darunter.",
    "Three different light effects — on the same day.": "Drei verschiedene Lichteffekte — am selben Tag.",
    "Shadow — when material blocks light": "Schatten — wenn Material Licht blockiert",
    "Reflection — light bounces off surface (mirror, water)":
      "Spiegelung — Licht wird an einer Oberfläche reflektiert (Spiegel, Wasser)",
    "When it hits a surface — it can behave in three ways:":
      "Wenn es auf eine Oberfläche trifft — kann es sich auf drei Arten verhalten:",
    "Pass through, bounce back, or be absorbed.": "Hindurchgehen, zurückprallen oder absorbiert werden.",
    "Mirror is smooth.": "Der Spiegel ist glatt.",
    "Hold a mirror in front of you in the sun.": "Halte einen Spiegel vor dich in der Sonne.",
    "Think:": "Denk nach:",
    "(rain — water for plants)": "(Regen — Wasser für Pflanzen)",
    "An earthquake — a sudden movement of rocks or plates in Earth's crust, releasing energy and causing shaking felt on the surface.":
      "Ein Erdbeben — eine plötzliche Bewegung von Gestein oder Platten in der Erdkruste, die Energie freisetzt und Erschütterungen an der Oberfläche verursacht.",
    "Example: grass is eaten by a rabbit, and a rabbit can be eaten by a tiger. If one link is missing — the web is harmed.":
      "Beispiel: Gras wird von einem Kaninchen gefressen, und ein Kaninchen kann von einem Tiger gefressen werden. Fehlt ein Glied — wird das Netz geschädigt.",
    "Soil — a layer on Earth's surface; contains particles, broken-down material, and water — plants grow in it.":
      "Boden — eine Schicht auf der Erdoberfläche; enthält Teilchen, zersetztes Material und Wasser — Pflanzen wachsen darin.",
    "Homework practice lasts 22 minutes, and then a thinking game lasts 16 minutes. How many minutes together?":
      "Hausaufgabenübungen dauern 22 Minuten, und danach dauert ein Denkspiel 16 Minuten. Wie viele Minuten zusammen?",
    "Less rain means less grass; less grass means fewer rabbits; and fewer rabbits means less food for tigers.":
      "Weniger Regen bedeutet weniger Gras; weniger Gras bedeutet weniger Kaninchen; und weniger Kaninchen bedeutet weniger Nahrung für Tiger.",
    "Turning off a light when leaving a room — less electricity, fewer emissions from power plants.":
      "Licht ausschalten beim Verlassen eines Raums — weniger Strom, weniger Emissionen von Kraftwerken.",
    "A living thing grows, responds to its surroundings, and needs the right conditions to live.":
      "Ein Lebewesen wächst, reagiert auf seine Umgebung und braucht die richtigen Bedingungen zum Leben.",
    "Three examples: turn off lights, save water, recycle. Each reduces part of the footprint.":
      "Drei Beispiele: Licht ausschalten, Wasser sparen, recyceln. Jedes verringert einen Teil des Fußabdrucks.",
    "If the environment changes, an animal needs suitable adaptations or a different place.":
      "Wenn sich die Umgebung ändert, braucht ein Tier passende Anpassungen oder einen anderen Ort.",
    "Step 2 — meaning: 8 = how many full boxes; 7 = how many apples are left (remainder).":
      "Schritt 2 — Bedeutung: 8 = wie viele volle Kartons; 7 = wie viele Äpfel übrig sind (Rest).",
    "Read the question: there are two parts, and it asks how many together or in total.":
      "Lies die Frage: Es gibt zwei Teile, und gefragt wird, wie viele zusammen oder insgesamt.",
    "After a meal — digestion breaks down food; blood carries it; the brain feels full.":
      "Nach einer Mahlzeit — die Verdauung zerlegt Nahrung; das Blut transportiert sie; das Gehirn spürt Sättigung.",
    "Volume = how much space is inside the solid — calculate: length × width × height.":
      "Volumen = wie viel Raum im Inneren des Körpers ist — berechne: Länge × Breite × Höhe.",
    "Saving water at home — tap, shower, fixing leaks. The resource protected — water.":
      "Wasser zu Hause sparen — Hahn, Dusche, Lecks reparieren. Die geschützte Ressource — Wasser.",
    "an angle, a height, a right angle (like in a rectangle), or another given value.":
      "einen Winkel, eine Höhe, einen rechten Winkel (wie in einem Rechteck) oder einen anderen gegebenen Wert.",
    "In a rectangle — there are right angles; we learn the diagonal separately there.":
      "In einem Rechteck — es gibt rechte Winkel; die Diagonale lernen wir dort getrennt.",
    "Here we write time as hours:minutes (for example 1:25 = 1 hour and 25 minutes).":
      "Hier schreiben wir Zeit als Stunden:Minuten (zum Beispiel 1:25 = 1 Stunde und 25 Minuten).",
    "Kingfisher — predator; small fish — prey. Competition — for food (small fish).":
      "Eisvogel — Räuber; kleine Fische — Beute. Konkurrenz — um Nahrung (kleine Fische).",
    "Check angles — there are 4 right angles → fits a rectangle and also a square.":
      "Winkel prüfen — es gibt 4 rechte Winkel → passt zu Rechteck und auch zu Quadrat.",
    "Imagine unit cubes: one layer = a grid of cubes; 5 layers = the full volume.":
      "Stell dir Einheitswürfel vor: eine Schicht = ein Gitter aus Würfeln; 5 Schichten = das volle Volumen.",
    "In practice, look for questions about garbage bins and keeping nature clean.":
      "In der Übung suche Fragen zu Mülleimern und dem Sauberhalten der Natur.",
    "Hypothesis — plant by a window will grow taller; variable — light location.":
      "Hypothese — eine Pflanze am Fenster wächst höher; Variable — Lichtstandort.",
    "Turning off a light in an empty room — less electricity, fewer emissions.":
      "Licht in einem leeren Raum ausschalten — weniger Strom, weniger Emissionen.",
    "Diagonal of a rectangle = a line from one corner to the opposite corner.":
      "Diagonale eines Rechtecks = eine Linie von einer Ecke zur gegenüberliegenden Ecke.",
    "1 is a special number in multiplication — it doesn't change the answer.":
      "1 ist eine besondere Zahl bei der Multiplikation — sie ändert das Ergebnis nicht.",
    "We will connect plant parts, growing conditions, and the role of light.":
      "Wir verbinden Pflanzenteile, Wachstumsbedingungen und die Rolle des Lichts.",
    "Turn off the tap while brushing teeth, take shorter showers, fix leaks.":
      "Dreh den Hahn zu beim Zähneputzen, nimm kürzere Duschen, repariere Lecks.",
    "Skeleton, muscles, and nerves work together and allow precise movement.":
      "Skelett, Muskeln und Nerven arbeiten zusammen und ermöglichen präzise Bewegung.",
    "Here we compare to the side length — no square root formula required.":
      "Hier vergleichen wir mit der Seitenlänge — keine Quadratwurzel-Formel nötig.",
    "Link to factors: if 5 is a factor of 20 — then 20 is a multiple of 5.":
      "Verbindung zu Teilern: Wenn 5 ein Teiler von 20 ist — dann ist 20 ein Vielfaches von 5.",
    "±1 even when crossing a thousand — for example 1,999 → 2,000 → 2,001.":
      "±1 auch beim Überschreiten eines Tausenders — zum Beispiel 1.999 → 2.000 → 2.001.",
    "In a four-digit number there are thousands, hundreds, tens, and ones.":
      "In einer vierstelligen Zahl gibt es Tausender, Hunderter, Zehner und Einer.",
    "Here we add parts of the day — clubs, trips, breaks — in h:mm format.":
      "Hier addieren wir Teile des Tages — AGs, Ausflüge, Pausen — im Format h:mm.",
    "If people throw trash in a stream — the water is harmed, fish suffer.":
      "Wenn Menschen Müll in einen Bach werfen — wird das Wasser geschädigt, Fische leiden.",
    '- Count how many steps to the right — "2 steps from 4 gets you to 6"':
      "- Zähle, wie viele Schritte nach rechts — „2 Schritte von 4 bringen dich zu 6“",
    "An angle is formed at a vertex — two rays (sides) come out from it.":
      "Ein Winkel entsteht an einem Eckpunkt — zwei Strahlen (Seiten) gehen von ihm aus.",
    'Not just "180° minus addition" — but: x + angle 1 + angle 2 = 180°.':
      "Nicht nur „180° minus Addition“ — sondern: x + Winkel 1 + Winkel 2 = 180°.",
    "Find today's day, and count forward or backward on the row of days!":
      "Finde den heutigen Tag und zähle vorwärts oder rückwärts in der Tagesreihe!",
    "Half = one part out of two equal parts — so the whole = two halves.":
      "Hälfte = ein Teil von zwei gleichen Teilen — also ist das Ganze = zwei Hälften.",
    "Music lesson 1:25 + practice 0:45. What is the total activity time?":
      "Musikstunde 1:25 + Übung 0:45. Wie lange ist die gesamte Aktivitätszeit?",
    "If the water is polluted — fewer algae, fewer fish, less diversity.":
      "Wenn das Wasser verschmutzt ist — weniger Algen, weniger Fische, weniger Vielfalt.",
    "3.25 × 10 = 32.5 — the decimal point moves one place to the right.":
      "3,25 × 10 = 32,5 — das Komma wandert eine Stelle nach rechts.",
    "When you practice, look for questions about shadow and reflection.":
      "Wenn du übst, suche Fragen zu Schatten und Spiegelung.",
    "What reduces carbon footprint — walking or driving alone in a car?":
      "Was verringert den CO₂-Fußabdruck — zu Fuß gehen oder allein Auto fahren?",
    "Counting forward is like walking to the right on the number line.":
      "Vorwärtszählen ist wie nach rechts gehen auf dem Zahlenstrahl.",
    "0 is a special number — it doesn't change the answer in addition.":
      "0 ist eine besondere Zahl — sie ändert das Ergebnis bei der Addition nicht.",
    "Identify two quantities — look for the difference, not the total!":
      "Erkenne zwei Mengen — achte auf die Differenz, nicht auf die Summe!",
    "During activity — muscles work, breathing speeds up, pulse rises.":
      "Bei Aktivität — Muskeln arbeiten, Atmung wird schneller, Puls steigt.",
    "We will see an example from life: train tracks — parallel lines.":
      "Wir sehen ein Beispiel aus dem Leben: Bahngleise — parallele Geraden.",
    "The left digit (2) counts tens, the right digit (9) counts ones.":
      "Die linke Ziffer (2) zählt Zehner, die rechte Ziffer (9) zählt Einer.",
    "3. What do we do? — count forward or backward on the row of days":
      "3. Was tun wir? — vorwärts oder rückwärts in der Tagesreihe zählen",
    "A multiple = the result of multiplying the number by 1, 2, 3, 4…":
      "Ein Vielfaches = das Ergebnis der Multiplikation der Zahl mit 1, 2, 3, 4…",
    "In practice, look for questions about hard, soft, hot, and cold.":
      "In der Übung suche Fragen zu hart, weich, heiß und kalt.",
    "Equal sharing here — bigger numbers, same multiplication check.":
      "Gerechtes Teilen hier — größere Zahlen, dieselbe Multiplikationsprüfung.",
    "Step B — add: if it's a total — add the two lengths in minutes.":
      "Schritt B — addieren: wenn es eine Summe ist — addiere die beiden Zeiten in Minuten.",
    "1. Minutes separately — if ≥ 60, carry an hour (65 min → 1:05).":
      "1. Minuten getrennt — wenn ≥ 60, übertrage eine Stunde (65 min → 1:05).",
    "Recycle, save energy, less single-use plastic, protect forests.":
      "Recyceln, Energie sparen, weniger Einwegplastik, Wälder schützen.",
    "Controlled conditions — what stays the same (plant type, light)":
      "Kontrollierte Bedingungen — was gleich bleibt (Pflanzenart, Licht)",
    "How many more points does Noah have?": "Wie viele Punkte mehr hat Noah?",
    "What is the total watching time?": "Wie lang ist die gesamte Fernsehzeit?",
    "How much more does Danny have?": "Wie viel mehr hat Danny?",
    "The number stays the same!": "Die Zahl bleibt gleich!",
    "Look for the remainder!": "Achte auf den Rest!",
    "Example with pencils:": "Beispiel mit Stiften:",
    "Safe experiments only — with a teacher, no dangerous materials, no electrical devices.":
      "Nur sichere Versuche — mit einer Lehrkraft, keine gefährlichen Stoffe, keine elektrischen Geräte.",
    "Square with side 9 cm — what is the area?": "Quadrat mit Seitenlänge 9 cm — wie groß ist die Fläche?",
    "6 + ? = 10 — what is the missing number?": "6 + ? = 10 — was ist die fehlende Zahl?",
    "What are the next two numbers?": "Was sind die nächsten zwei Zahlen?",
    "What is the whole?": "Was ist das Ganze?",
    "64 + ? = 100 — what is the missing number?": "64 + ? = 100 — was ist die fehlende Zahl?",
    "7 + ? = 10 — what is the missing number?": "7 + ? = 10 — was ist die fehlende Zahl?",
    "In practice you will find questions about rotation — check if it is a quarter (90°) or another part of the path!":
      "In der Übung findest du Fragen zur Drehung — prüfe, ob es eine Vierteldrehung (90°) oder ein anderer Teil des Weges ist!",
    "In practice you'll find larger numbers too. What are the factors? — look for multiplication pairs!":
      "In der Übung findest du auch größere Zahlen. Was sind die Teiler? — suche Multiplikationspaare!",
    "In practice you will find multiplication equations — divide the result by the known factor!":
      "In der Übung findest du Multiplikationsgleichungen — teile das Ergebnis durch den bekannten Faktor!",
    "In practice you'll find how much is missing to reach 10? Look for the familiar pair!":
      "In der Übung findest du: Wie viel fehlt bis 10? Suche das bekannte Paar!",
    "In practice you will find questions about digits in hundred thousands and ten thousands.":
      "In der Übung findest du Fragen zu Ziffern in Hunderttausendern und Zehntausendern.",
    "In practice you'll find what are the factors? — look for multiplication pairs!":
      "In der Übung findest du: Was sind die Teiler? — suche Multiplikationspaare!",
    "In practice you will find two known angles — add them and subtract from 180°!":
      "In der Übung findest du zwei bekannte Winkel — addiere sie und subtrahiere von 180°!",
    "In practice you will find division equations — figure out what is missing!":
      "In der Übung findest du Divisionsgleichungen — finde heraus, was fehlt!",
    "In practice you will find a missing part — divide by the sum of the ratio!":
      "In der Übung findest du einen fehlenden Teil — teile durch die Summe des Verhältnisses!",
    "In practice you will find a 3 by 4 rectangle — look for the diagonal 5!":
      "In der Übung findest du ein 3-mal-4-Rechteck — suche die Diagonale 5!",
    "In practice you'll find questions about adding times. Add the minutes!":
      "In der Übung findest du Fragen zum Addieren von Zeiten. Addiere die Minuten!",
    "In practice you'll find what is the GCF? — look for common factors!":
      "In der Übung findest du: Was ist der ggT? — suche gemeinsame Teiler!",
    "In practice you'll find is it divisible? — look at the ones digit!":
      "In der Übung findest du: Ist sie teilbar? — schau auf die Einerziffer!",
    "In practice you'll find prime or composite? — look for factors!":
      "In der Übung findest du: Primzahl oder zusammengesetzt? — suche Teiler!",
    "We will identify a square, rectangle, parallelogram, and trapezoid — from a short description.":
      "Wir erkennen Quadrat, Rechteck, Parallelogramm und Trapez — anhand einer kurzen Beschreibung.",
    "We will identify hundred thousands, ten thousands, thousands, hundreds, tens, and ones.":
      "Wir erkennen Hunderttausender, Zehntausender, Tausender, Hunderter, Zehner und Einer.",
    "In a five-digit number there are ten-thousands, thousands, hundreds, tens, and ones.":
      "In einer fünfstelligen Zahl gibt es Zehntausender, Tausender, Hunderter, Zehner und Einer.",
    "Today in geometry we will go deeper into the cube — a solid we already know from earlier grades.":
      "Heute gehen wir in Geometrie tiefer auf den Würfel ein — einen Körper, den wir schon aus früheren Klassen kennen.",
    "Today we will check when a number divides evenly by 2, 5, or 10 — by looking at the ones digit.":
      "Heute prüfen wir, wann eine Zahl glatt durch 2, 5 oder 10 teilbar ist — indem wir auf die Einerziffer schauen.",
    "Today we will strengthen the perimeter of a triangle here — with sides 5, 6, and 7 cm.":
      "Heute festigen wir hier den Umfang eines Dreiecks — mit den Seiten 5, 6 und 7 cm.",
    "Today we will strengthen division with a remainder — with full multi-step checking.":
      "Heute festigen wir Division mit Rest — mit vollständiger mehrschrittiger Prüfung.",
    "Today we will find number neighbors — ±1 — even when we cross a hundred boundary.":
      "Heute finden wir Zahl-Nachbarn — ±1 — auch wenn wir eine Hundertergrenze überschreiten.",
    "Today in science we will learn about interactions between animals — who eats whom, and who competes for resources.":
      "Heute lernen wir in Naturwissenschaften etwas über Wechselwirkungen zwischen Tieren — wer wen frisst und wer um Ressourcen konkurriert.",
    "Today in science we will learn about climate, climate change — in facts — and Earth's place in the solar system.":
      "Heute lernen wir in Naturwissenschaften etwas über Klima, Klimawandel — in Fakten — und den Platz der Erde im Sonnensystem.",
    "Today in science we will learn to run a full investigation — with a journal, graph, and evaluation of results.":
      "Heute lernen wir in Naturwissenschaften, eine vollständige Untersuchung durchzuführen — mit Tagebuch, Diagramm und Auswertung der Ergebnisse.",
    "Today in science we will learn about weather, climate, and the water cycle on Earth.":
      "Heute lernen wir in Naturwissenschaften etwas über Wetter, Klima und den Wasserkreislauf auf der Erde.",
    "Today we will solve adding times — for example, how long a class and an activity take together, or two parts of a trip.":
      "Heute lösen wir das Addieren von Zeiten — zum Beispiel, wie lange Unterricht und eine Aktivität zusammen dauern oder zwei Teile einer Reise.",
    "Now you know the formula 4 × side for the perimeter of a square!":
      "Jetzt kennst du die Formel 4 × Seite für den Umfang eines Quadrats!",
    "Now you know number neighbors up to 10,000, including crossing thousands.":
      "Jetzt kennst du Zahl-Nachbarn bis 10.000, einschließlich dem Überschreiten von Tausendern.",
    "Now you know number neighbors up to 1,000, including hundred boundaries.":
      "Jetzt kennst du Zahl-Nachbarn bis 1.000, einschließlich Hundertergrenzen.",
    "Now you can identify angles in a triangle and compare them in geometry.":
      "Jetzt kannst du Winkel in einem Dreieck erkennen und sie in Geometrie vergleichen.",
    "Now you can tell translation and reflection apart better in geometry.":
      "Jetzt kannst du Verschiebung und Spiegelung in Geometrie besser unterscheiden.",
    "Now you can identify the faces of a rectangular prism in geometry.":
      "Jetzt kannst du die Flächen eines Quaders in Geometrie erkennen.",
    "Now you know about climate, climate change, and the solar system in science.":
      "Jetzt kennst du Klima, Klimawandel und das Sonnensystem in Naturwissenschaften.",
  };

  if (CURATED[en]) return CURATED[en];

  // Fallback: long-phrase polish of remaining English (last resort — still needs STILL check)
  let out = polish(t);
  out = out
    .replace(/^Today we'll /i, "Heute werden wir ")
    .replace(/^Today we will /i, "Heute werden wir ")
    .replace(/^In practice you'll find /i, "In der Übung findest du ")
    .replace(/^In practice you will find /i, "In der Übung findest du ")
    .replace(/^In practice, /i, "In der Übung ")
    .replace(/^Here we /i, "Hier ")
    .replace(/^Imagine /i, "Stell dir vor ")
    .replace(/^That is /i, "Das ist ")
    .replace(/^This is /i, "Das ist ")
    .replace(/^If /i, "Wenn ")
    .replace(/^When you /i, "Wenn du ")
    .replace(/^Look for /i, "Achte auf ")
    .replace(/^Look at /i, "Schau dir an ")
    .replace(/^Hold /i, "Halte ")
    .replace(/^Example:/i, "Beispiel:")
    .replace(/^Important:/i, "Wichtig:")
    .replace(/How many /gi, "Wie viele ")
    .replace(/How much /gi, "Wie viel ")
    .replace(/What is /gi, "Was ist ")
    .replace(/What are /gi, "Was sind ")
    .replace(/the /g, "die/der/das ")
    .replace(/ and /g, " und ")
    .replace(/ with /g, " mit ")
    .replace(/ from /g, " von ")
    .replace(/ for /g, " für ")
    .replace(/ to /g, " zu ")
    .replace(/ of /g, " von ")
    .replace(/ in /g, " in ")
    .replace(/ on /g, " auf ")
    .replace(/ or /g, " oder ")
    .replace(/\ba\b/g, "ein")
    .replace(/\ban\b/g, "ein");

  // The crude fallback above creates garbage — reject it
  if (STILL.test(out) || /die\/der\/das/.test(out)) {
    // Better structured fallback without word salad
    out = t
      .replace(/\bGrade\s*([1-6])\b/g, "$1. Klasse")
      .replace(/\$(\d+)/g, "$1 €")
      .replace(/\bshekels?\b/gi, "Euro");
    // Mark for curated second pass — return a careful sentence rebuild for common leftovers
    out = rebuildSentence(t);
  }
  return out;
}

function rebuildSentence(en) {
  // Minimal safe transforms that don't create salad
  let t = en;
  t = t.replace(/\bGrade\s*([1-6])\b/g, "$1. Klasse");
  t = t.replace(/\$(\d+)/g, "$1 €");
  t = t.replace(/\bshekels?\b/gi, "Euro");
  t = t.replace(/(\d),(\d{3})\b/g, "$1.$2");
  // If still mostly English, wrap as explicit German rewrite using known templates
  const dict = [
    [/^Check:/i, "Prüfung:"],
    [/^Step (\d+)/i, "Schritt $1"],
    [/^Example with /i, "Beispiel mit "],
    [/^For example:/i, "Zum Beispiel:"],
    [/^Yes —/i, "Ja —"],
    [/^No —/i, "Nein —"],
    [/^Why\?/i, "Warum?"],
    [/^Important rule:/i, "Wichtige Regel:"],
    [/^Important:/i, "Wichtig:"],
    [/^Tip /i, "Tipp "],
    [/^First /i, "Zuerst "],
    [/^Second /i, "Zweitens "],
    [/^Third /i, "Drittens "],
  ];
  for (const [re, rep] of dict) t = t.replace(re, rep);

  // Final known replacements for leftover common English words in otherwise short labels
  const wordMap = {
    "light": "Licht",
    "shadow": "Schatten",
    "reflection": "Spiegelung",
    "transparency": "Durchsichtigkeit",
    "mixture": "Gemisch",
    "mixtures": "Gemische",
    "climate": "Klima",
    "space": "Weltraum",
    "earth": "Erde",
    "solar": "Sonnen-",
    "rotation": "Drehung",
    "translation": "Verschiebung",
    "practice": "Übung",
    "questions": "Fragen",
    "answer": "Antwort",
    "missing": "fehlend",
    "number": "Zahl",
    "numbers": "Zahlen",
    "equal": "gleich",
    "parts": "Teile",
    "part": "Teil",
    "whole": "Ganze",
    "side": "Seite",
    "sides": "Seiten",
    "angle": "Winkel",
    "angles": "Winkel",
    "height": "Höhe",
    "area": "Fläche",
    "perimeter": "Umfang",
    "volume": "Volumen",
    "factor": "Teiler",
    "factors": "Teiler",
    "multiple": "Vielfaches",
    "multiples": "Vielfache",
    "remainder": "Rest",
    "quotient": "Quotient",
    "divisor": "Divisor",
    "dividend": "Dividend",
    "grid": "Gitter",
    "layer": "Schicht",
    "layers": "Schichten",
    "face": "Fläche",
    "faces": "Flächen",
    "edge": "Kante",
    "edges": "Kanten",
    "vertex": "Eckpunkt",
    "vertices": "Eckpunkte",
    "base": "Grundfläche",
    "bases": "Grundflächen",
    "prism": "Prisma",
    "cube": "Würfel",
    "sphere": "Kugel",
    "cone": "Kegel",
    "cylinder": "Zylinder",
    "pyramid": "Pyramide",
    "trapezoid": "Trapez",
    "parallelogram": "Parallelogramm",
    "diagonal": "Diagonale",
    "diagonals": "Diagonalen",
    "symmetry": "Symmetrie",
    "parallel": "parallel",
    "perpendicular": "senkrecht",
    "multiply": "multiplizieren",
    "multiplying": "Multiplizieren",
    "divide": "teilen",
    "add": "addieren",
    "subtract": "subtrahieren",
    "estimate": "schätzen",
    "round": "runden",
    "rounding": "Runden",
    "nearest": "nächsten",
    "thousand": "Tausender",
    "hundred": "Hunderter",
    "hundreds": "Hunderter",
    "tens": "Zehner",
    "ones": "Einer",
    "digit": "Ziffer",
    "digits": "Ziffern",
    "decimal": "Dezimal",
    "fraction": "Bruch",
    "fractions": "Brüche",
    "percent": "Prozent",
    "discount": "Rabatt",
    "price": "Preis",
    "money": "Geld",
    "coins": "Münzen",
    "bag": "Beutel",
    "bags": "Beutel",
    "box": "Schachtel",
    "boxes": "Schachteln",
    "group": "Gruppe",
    "groups": "Gruppen",
    "row": "Reihe",
    "rows": "Reihen",
    "plant": "Pflanze",
    "plants": "Pflanzen",
    "animal": "Tier",
    "animals": "Tiere",
    "water": "Wasser",
    "soil": "Boden",
    "air": "Luft",
    "heat": "Wärme",
    "energy": "Energie",
    "waste": "Abfall",
    "forest": "Wald",
    "forests": "Wälder",
    "sun": "Sonne",
    "moon": "Mond",
    "planet": "Planet",
    "planets": "Planeten",
    "star": "Stern",
    "day": "Tag",
    "days": "Tage",
    "year": "Jahr",
    "years": "Jahre",
    "weather": "Wetter",
    "rain": "Regen",
    "food": "Nahrung",
    "predator": "Räuber",
    "prey": "Beute",
    "competition": "Konkurrenz",
    "adaptation": "Anpassung",
    "adaptations": "Anpassungen",
    "environment": "Umgebung",
    "surface": "Oberfläche",
    "mirror": "Spiegel",
    "glass": "Glas",
    "window": "Fenster",
    "room": "Raum",
    "teacher": "Lehrkraft",
    "class": "Klasse",
    "school": "Schule",
    "home": "Zuhause",
    "together": "zusammen",
    "total": "insgesamt",
    "difference": "Differenz",
    "same": "gleich",
    "different": "verschieden",
    "left": "übrig",
    "right": "rechts",
    "forward": "vorwärts",
    "backward": "rückwärts",
    "first": "zuerst",
    "then": "dann",
    "also": "auch",
    "only": "nur",
    "each": "jede",
    "every": "jede",
    "all": "alle",
    "both": "beide",
    "into": "in",
    "onto": "auf",
    "about": "über",
    "after": "nach",
    "before": "vor",
    "between": "zwischen",
    "without": "ohne",
    "because": "weil",
    "through": "durch",
    "during": "während",
    "against": "gegen",
    "around": "um",
    "under": "unter",
    "over": "über",
  };

  // Don't do blind word replace on full sentences — only if curated/pattern missed
  // Keep EN temporarily but flag; second file will list them
  return t;
}

const out = {};
const bad = [];
for (const en of need) {
  const de = author(en);
  out[en] = de;
  if (!de || de === en || STILL.test(de)) bad.push({ en, de });
}

fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-13-de-map.json"), JSON.stringify(out, null, 2));
fs.writeFileSync(path.join(__dirname, "_de-DE-book-residue-parts/part-13-bad.json"), JSON.stringify(bad, null, 2));
console.log({ total: need.length, bad: bad.length, good: need.length - bad.length });

// Merge good ones into residue map
const map = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-residue-map.json"), "utf8"));
const scopes = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-scopes-de.json"), "utf8"));
Object.assign(map, scopes);
for (const [en, de] of Object.entries(out)) {
  if (!STILL.test(de) && de !== en) map[en] = de;
}
// Always merge curated/good; for bad keep previous if better else leave for next pass
for (const { en, de } of bad) {
  // still merge if German-ish (has umlauts / common DE words) and fewer EN markers than EN source
  const deHits = (de.match(STILL) || []).length;
  const enHits = (en.match(STILL) || []).length;
  if (deHits < enHits && /[äöüÄÖÜß]|\b(der|die|das|und|oder|mit|für|wir|du|ist|Heute|Jetzt|Übung|Quadrat|Rechteck)\b/.test(de)) {
    map[en] = de;
  }
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
