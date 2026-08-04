import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const scopes = JSON.parse(fs.readFileSync(path.join(__dirname, "_de-DE-book-scopes.json"), "utf8"));

/** Full natural German for every content-scope line */
const DE = {
  "**Content scope:** Multiplication as **repeated addition** / **equal groups** only. **In Grade 1 we use small multiplication: groups up to 5, and answers up to 20** (for example 5×4, 4×3). No full times table, no division.":
    "**Inhaltsumfang:** Multiplikation nur als **wiederholte Addition** / **gleiche Gruppen**. **In der 1. Klasse nutzen wir kleine Multiplikation: Gruppen bis 5 und Ergebnisse bis 20** (zum Beispiel 5×4, 4×3). Kein volles Einmaleins, keine Division.",
  "**Content scope:** Addition with **two digits** after the decimal point (hundredths and tenths). Line up decimal points. Regrouping in tenths and hundredths. No three decimal digits.":
    "**Inhaltsumfang:** Addition mit **zwei Stellen** nach dem Komma (Hundertstel und Zehntel). Kommas untereinander ausrichten. Übertrag bei Zehnteln und Hundertsteln. Keine drei Nachkommastellen.",
  "**Content scope:** Word problems about coin values — addition only. Sums up to 30. No change/spending, no multiplication, no division, no buying multiple items.":
    "**Inhaltsumfang:** Textaufgaben zu Münzwerten — nur Addition. Summen bis 30. Kein Wechselgeld/Ausgeben, keine Multiplikation, keine Division, kein Kauf mehrerer Dinge.",
  "**Content scope:** Coins in whole shekels. Total amount — addition or equal groups (multiplication). One step. Up to ~100. No agorot, no multi-step buying.":
    "**Inhaltsumfang:** Münzen in ganzen Euro. Gesamtbetrag — Addition oder gleiche Gruppen (Multiplikation). Ein Schritt. Bis etwa 100. Keine Cent, kein mehrstufiges Einkaufen.",
  "**Content scope:** Division as fair sharing. Connection to multiplication. Small numbers (up to ~20). No remainder, no long division, no formal algorithm.":
    "**Inhaltsumfang:** Division als gerechtes Teilen. Verbindung zur Multiplikation. Kleine Zahlen (bis etwa 20). Kein Rest, keine schriftliche Division, kein formales Verfahren.",
  "**Content scope:** Multiplication as equal groups and times table. Repeated addition as a bridge. Factors up to 10. No detailed division (separate topic).":
    "**Inhaltsumfang:** Multiplikation als gleiche Gruppen und Einmaleins. Wiederholte Addition als Brücke. Faktoren bis 10. Keine ausführliche Division (eigenes Thema).",
  "**Content scope:** Division with no remainder. Division facts and larger numbers (84÷4, 96÷3). Link to multiplication. Remainder → `div_with_remainder`.":
    "**Inhaltsumfang:** Division ohne Rest. Divisionsaufgaben und größere Zahlen (84÷4, 96÷3). Verbindung zur Multiplikation. Rest → `div_with_remainder`.",
  "**Content scope:** Times table 1–12. Strategies: breaking apart, commutative order, multiplying by tens. No vertical multiplication (→ `mul_vertical`).":
    "**Inhaltsumfang:** Einmaleins 1–12. Strategien: Zerlegen, Kommutativgesetz, Multiplizieren mit Zehnern. Keine senkrechte Multiplikation (→ `mul_vertical`).",
  "**Content scope:** **Estimate** (≈) of an addition sum — round to nearest hundreds/tens. No exact calculation required. No rounding to ten-thousands.":
    "**Inhaltsumfang:** **Schätzen** (≈) einer Additionssumme — runden auf Hunderter/Zehner. Keine genaue Berechnung nötig. Kein Runden auf Zehntausender.",
  "**Content scope:** Subtraction in a row / mentally up to 100. Break apart into tens and ones. No vertical subtraction, no borrowing as main topic.":
    "**Inhaltsumfang:** Subtraktion in einer Zeile / im Kopf bis 100. Zerlegen in Zehner und Einer. Keine senkrechte Subtraktion, kein Borgen als Hauptthema.",
  "**Content scope:** Addition up to 10,000. Thousands, hundreds, tens, and ones. Regrouping (carrying). No adding three numbers (→ `add_three`).":
    "**Inhaltsumfang:** Addition bis 10.000. Tausender, Hunderter, Zehner und Einer. Übertrag. Kein Addieren von drei Zahlen (→ `add_three`).",
  "**Content scope:** Addition equation with **__** — numbers up to **1,000**. Reverse subtraction to find the missing number. No variable x.":
    "**Inhaltsumfang:** Additionsgleichung mit **__** — Zahlen bis **1.000**. Umgekehrte Subtraktion, um die fehlende Zahl zu finden. Keine Variable x.",
  "**Content scope:** Horizontal / mental addition up to 100. Breaking into tens and ones. No vertical addition, no carrying as main topic.":
    "**Inhaltsumfang:** Waagerechte / mentale Addition bis 100. Zerlegen in Zehner und Einer. Keine senkrechte Addition, kein Übertrag als Hauptthema.",
  "**Content scope:** Multiplication in word problems — equal groups. One step. Grade 2 factor range. No division, no multi-step questions.":
    "**Inhaltsumfang:** Multiplikation in Textaufgaben — gleiche Gruppen. Ein Schritt. Faktorbereich der 2. Klasse. Keine Division, keine mehrstufigen Fragen.",
  '**Content scope:** Difference between two amounts — **"how many more"**. One step. Numbers up to **1,000**. No multi-step subtraction.':
    '**Inhaltsumfang:** Differenz zwischen zwei Mengen — **"wie viele mehr"**. Ein Schritt. Zahlen bis **1.000**. Keine mehrstufige Subtraktion.',
  "**Content scope:** **Calculate** the value of a power — small base, exponent up to 5. Repeated multiplication. No negative exponents.":
    "**Inhaltsumfang:** **Berechnen** des Wertes einer Potenz — kleine Basis, Exponent bis 5. Wiederholte Multiplikation. Keine negativen Exponenten.",
  "**Content scope:** Sequences with a fixed jump (+ or −). Up to 10,000. Big jumps (10, 50, 100…). No multiplication in the sequence.":
    "**Inhaltsumfang:** Folgen mit festem Sprung (+ oder −). Bis 10.000. Große Sprünge (10, 50, 100…). Keine Multiplikation in der Folge.",
  "**Content scope:** Adding whole tens only. **In Grade 1 we use tens 10, 20, and 30.** Sum up to 30. No ones, no vertical addition.":
    "**Inhaltsumfang:** Nur ganze Zehner addieren. **In der 1. Klasse nutzen wir die Zehner 10, 20 und 30.** Summe bis 30. Keine Einer, keine senkrechte Addition.",
  "**Content scope:** Know the quarter — find the whole. 4 equal parts. Repeated addition or multiplication as support. No variables.":
    "**Inhaltsumfang:** Das Viertel kennen — das Ganze finden. 4 gleiche Teile. Wiederholte Addition oder Multiplikation als Hilfe. Keine Variablen.",
  "**Content scope:** Addition up to 1,000. Break apart into hundreds/tens/ones. Regrouping. No adding three numbers (→ `add_three`).":
    "**Inhaltsumfang:** Addition bis 1.000. Zerlegen in Hunderter/Zehner/Einer. Übertrag. Kein Addieren von drei Zahlen (→ `add_three`).",
  "**Content scope:** Times tables 1–10. Equal groups. Link to repeated addition. No multiplying by tens/hundreds (→ separate pages).":
    "**Inhaltsumfang:** Einmaleins 1–10. Gleiche Gruppen. Verbindung zur wiederholten Addition. Kein Multiplizieren mit Zehnern/Hundertern (→ eigene Seiten).",
  "**Content scope:** **Estimate** a real-life quantity — round to nearest tens/hundreds/thousands. No exact counting. No measuring.":
    "**Inhaltsumfang:** Eine Menge aus dem Alltag **schätzen** — runden auf Zehner/Hunderter/Tausender. Kein genaues Zählen. Kein Messen.",
  "**Content scope:** Addition when the answer is in the range 11–19 (the teens). Sum up to 20. No vertical addition, no carrying.":
    "**Inhaltsumfang:** Addition, wenn das Ergebnis im Bereich 11–19 liegt (Zehnerplus). Summe bis 20. Keine senkrechte Addition, kein Übertrag.",
  "**Content scope:** Quotient and remainder; large numbers (1,247÷8). Remainder check: divisor × quotient + remainder = dividend.":
    "**Inhaltsumfang:** Quotient und Rest; große Zahlen (1.247÷8). Restprüfung: Divisor × Quotient + Rest = Dividend.",
  "**Content scope:** quotient and remainder; large numbers (850÷7). Check equation: dividend = divisor × quotient + remainder.":
    "**Inhaltsumfang:** Quotient und Rest; große Zahlen (850÷7). Prüfgleichung: Dividend = Divisor × Quotient + Rest.",
  "**Content scope:** Vertical multiplication — two-digit number × one digit. Regrouping (carrying). No two two-digit numbers.":
    "**Inhaltsumfang:** Senkrechte Multiplikation — zweistellige Zahl × eine Ziffer. Übertrag. Keine zwei zweistelligen Zahlen.",
  "**Content scope:** Know the half — find the whole. Multiply by 2 / double addition. No variables, no fraction calculation.":
    "**Inhaltsumfang:** Die Hälfte kennen — das Ganze finden. Mit 2 multiplizieren / verdoppeln. Keine Variablen, keine Bruchrechnung.",
  "**Content scope:** **Estimate** (≈) of a **multiplication** answer — round to nearest tens. No exact calculation required.":
    "**Inhaltsumfang:** **Schätzen** (≈) eines **Multiplikations**ergebnisses — runden auf Zehner. Keine genaue Berechnung nötig.",
  "**Content scope:** Vertical subtraction (columns). Trading one ten for 10 ones. No negative results, no heavy hundreds.":
    "**Inhaltsumfang:** Senkrechte Subtraktion (Spalten). Einen Zehner in 10 Einer umtauschen. Keine negativen Ergebnisse, keine schweren Hunderter.",
};

// Fallback for remaining scopes: careful phrase rewrite to full German
function fallbackScope(en) {
  if (DE[en]) return DE[en];
  let s = en.replace(/\*\*Content scope:\*\*/g, "**Inhaltsumfang:**").replace(/Content scope:/g, "Inhaltsumfang:");
  const pairs = [
    ["whole shekels", "ganzen Euro"],
    ["shekels", "Euro"],
    ["agorot", "Cent"],
    ["multi-step buying", "mehrstufiges Einkaufen"],
    ["multi-step subtraction", "mehrstufige Subtraktion"],
    ["multi-step questions", "mehrstufige Fragen"],
    ["multi-step", "mehrstufig"],
    ["equal groups", "gleiche Gruppen"],
    ["repeated addition", "wiederholte Addition"],
    ["times table", "Einmaleins"],
    ["Times tables", "Einmaleins"],
    ["fair sharing", "gerechtes Teilen"],
    ["long division", "schriftliche Division"],
    ["vertical multiplication", "senkrechte Multiplikation"],
    ["vertical addition", "senkrechte Addition"],
    ["vertical subtraction", "senkrechte Subtraktion"],
    ["word problems", "Textaufgaben"],
    ["Word problems", "Textaufgaben"],
    ["missing number", "fehlende Zahl"],
    ["how many more", "wie viele mehr"],
    ["the teens", "Zehnerplus"],
    ["decimal point", "Komma"],
    ["decimal digits", "Nachkommastellen"],
    ["Line up decimal points", "Kommas untereinander ausrichten"],
    ["Regrouping (carrying)", "Übertrag"],
    ["Regrouping", "Übertrag"],
    ["carrying", "Übertrag"],
    ["borrowing", "Borgen"],
    ["Grade 1", "1. Klasse"],
    ["Grade 2", "2. Klasse"],
    ["Grade 3", "3. Klasse"],
    ["Grade 4", "4. Klasse"],
    ["One step", "Ein Schritt"],
    ["one step", "ein Schritt"],
    ["No ", "Keine "],
    ["no ", "keine "],
    ["Up to", "Bis"],
    ["up to", "bis"],
    ["Total amount", "Gesamtbetrag"],
    ["Difference between two amounts", "Differenz zwischen zwei Mengen"],
    ["Numbers", "Zahlen"],
    ["numbers", "Zahlen"],
    ["Large numbers", "Große Zahlen"],
    ["large numbers", "große Zahlen"],
    ["Small numbers", "Kleine Zahlen"],
    ["small numbers", "kleine Zahlen"],
    ["Only", "Nur"],
    ["only", "nur"],
    ["and", "und"],
    ["or", "oder"],
    ["with", "mit"],
    ["for", "für"],
    ["from", "von"],
    ["into", "in"],
    ["about", "über"],
    ["as", "als"],
    ["the", ""],
    ["a ", ""],
    ["an ", ""],
    ["of ", ""],
    ["to ", ""],
    ["in ", "in "],
    ["on ", "auf "],
  ];
  for (const [a, b] of pairs) s = s.split(a).join(b);
  return s.replace(/\s{2,}/g, " ").trim();
}

const mapPath = path.join(__dirname, "_de-DE-book-residue-map.json");
const map = JSON.parse(fs.readFileSync(mapPath, "utf8"));
let n = 0;
for (const en of scopes) {
  map[en] = DE[en] || fallbackScope(en);
  n++;
}

// Extra high-traffic lines still English
Object.assign(map, {
  "Trapezoid: bases 3 cm and 7 cm, area 30 cm² — what is the height?":
    "Trapez: Grundseiten 3 cm und 7 cm, Fläche 30 cm² — was ist die Höhe?",
  "Trapezoid: bases 4 cm and 8 cm, height 6 cm — what is the area?":
    "Trapez: Grundseiten 4 cm und 8 cm, Höhe 6 cm — was ist die Fläche?",
  "When there are several coins of the same value, you can figure out how much money there is altogether — with addition or equal groups.":
    "Wenn es mehrere Münzen mit demselben Wert gibt, kannst du herausfinden, wie viel Geld insgesamt da ist — mit Addition oder gleichen Gruppen.",
  "The question: plan an investigation — which sponge absorbs more water? What do you write in the journal and how do you build a graph?":
    "Die Aufgabe: Plane eine Untersuchung — welcher Schwamm nimmt mehr Wasser auf? Was schreibst du ins Heft und wie baust du ein Diagramm?",
  "Today in science we will learn about basic chemistry — changes in materials, density — and safety in all work with materials.":
    "Heute lernen wir in Naturwissenschaften Grundlagen der Chemie — Veränderungen von Materialien, Dichte — und Sicherheit bei jeder Arbeit mit Materialien.",
  "Today we will learn order of operations — when there is addition and multiplication in the same problem, multiply first!":
    "Heute lernen wir die Reihenfolge der Rechenoperationen — wenn Addition und Multiplikation in derselben Aufgabe vorkommen, multipliziere zuerst!",
  "There are 61 students.": "Es gibt 61 Schülerinnen und Schüler.",
});

fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
console.log({ scopesAuthored: n, withFull: Object.keys(DE).length, mapSize: Object.keys(map).length });

const r = spawnSync(process.execPath, [path.join(__dirname, "_rebuild-de-DE-books.mjs")], { cwd: ROOT, stdio: "inherit" });
if (r.status) process.exit(r.status);
if (fs.existsSync(path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"))) {
  fs.copyFileSync(
    path.join(__dirname, "_golden-shapes_basic_rectangle.de.md"),
    path.join(ROOT, "docs/learning-book/de-DE/geometry/g1/drafts/shapes_basic_rectangle.md")
  );
}
spawnSync(process.execPath, [path.join(__dirname, "_collect-de-DE-book-hybrid-student.mjs")], { cwd: ROOT, stdio: "inherit" });
