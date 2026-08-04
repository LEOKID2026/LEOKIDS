import fs from "node:fs";
import { translateBookQualityNl, stillEnglishBookLine } from "./_nl-NL-book-quality.mjs";

const lines = fs
  .readFileSync("scripts/i18n/_nl-NL-book-still-en2.txt", "utf8")
  .split(/\n/)
  .filter(Boolean);

/** High-value curated overrides (plus auto quality for the rest). */
const CURATED = {
  "Step 2 — Wat zijn we asked? How much change he got.":
    "Stap 2 — Wat wordt gevraagd? Hoeveel wisselgeld hij kreeg.",
  "Step 2 — What are we asked? How much change he got.":
    "Stap 2 — Wat wordt gevraagd? Hoeveel wisselgeld hij kreeg.",
  "Missing number = total minus the number you already have.":
    "Ontbrekend getal = totaal minus het getal dat je al hebt.",
  "Missing number before the minus — add the result and the number being subtracted.":
    "Ontbrekend getal vóór het minteken — tel het resultaat en het afgetrokken getal op.",
  "In de oefening vind je how much to make 10? And additions using make-10!":
    "In de oefening vind je hoeveel nodig is om 10 te maken? En optellingen met maak-10!",
  "In practice you'll find how much to make 10? And additions using make-10!":
    "In de oefening vind je hoeveel nodig is om 10 te maken? En optellingen met maak-10!",
  "Make 100: how much do you need to add so the sum is 100?":
    "Maak 100: hoeveel moet je optellen zodat de som 100 is?",
  "Find how much is missing to the nearest round ten (for example 37 + 3 = 40)":
    "Zoek hoeveel ontbreekt tot het dichtstbijzijnde ronde tiental (bijvoorbeeld 37 + 3 = 40)",
  "How do you check? Look for factors from 2 and up.":
    "Hoe controleer je? Zoek naar factoren vanaf 2 en hoger.",
  "How do you check? Let op factors from 2 and up.":
    "Hoe controleer je? Let op factoren vanaf 2 en hoger.",
  "Rule: divisor × quotient = dividend — always check with multiplication.":
    "Regel: deler × quotiënt = deeltal — controleer altijd met vermenigvuldigen.",
  'Pairs that make 100 = a base for thinking "how much is missing to reach 100" — also in estimation.':
    'Paren die 100 maken = een basis om te denken "hoeveel ontbreekt om 100 te bereiken" — ook bij schatten.',
  "Estimate: about how much is 52 + 49?": "Schatting: ongeveer hoeveel is 52 + 49?",
  "Earth's tilt and its movement around the sun affect how much light and heat reach different areas in the seasons.":
    "De helling van de Aarde en haar beweging om de zon beïnvloeden hoeveel licht en warmte verschillende gebieden in de seizoenen bereiken.",
  "Check that all the sides are equal!": "Controleer dat alle zijden even lang zijn!",
  "Here we check more carefully:": "Hier controleren we zorgvuldiger:",
  "Here we focus on the name and identification — not on calculations.":
    "Hier richten we ons op de naam en herkenning — niet op berekeningen.",
  "Check sides — width and height are different → not a square.":
    "Controleer zijden — breedte en hoogte verschillen → geen vierkant.",
  "Danny has one coin of 10 shekels and 2 coins of 2 shekels.":
    "Danny heeft één munt van 10 sjekel en 2 munten van 2 sjekel.",
  "Noa paid 15 shekels for a book that cost 8 shekels.":
    "Noa betaalde 15 sjekel voor een boek dat 8 sjekel kostte.",
  "Amir paid 40 shekels for a game that cost 28 shekels.":
    "Amir betaalde 40 sjekel voor een spel dat 28 sjekel kostte.",
  "Put your finger on 7 on the number line.": "Leg je vinger op 7 op de getallenlijn.",
  "Put your finger on 9 on the number line.": "Leg je vinger op 9 op de getallenlijn.",
  "Put your finger on 5 on the number line.": "Leg je vinger op 5 op de getallenlijn.",
  "Put your finger on 8 on the number line.": "Leg je vinger op 8 op de getallenlijn.",
  "Today we're going to learn to count backward on the number line.":
    "Vandaag gaan we achteruit tellen op de getallenlijn leren.",
  "Today we're going to learn to count forward on the number line.":
    "Vandaag gaan we vooruit tellen op de getallenlijn leren.",
  "Counting backward is like walking to the left on the number line.":
    "Achteruit tellen is als naar links lopen op de getallenlijn.",
  "Counting forward is like walking to the right on the number line.":
    "Vooruit tellen is als naar rechts lopen op de getallenlijn.",
  "Now you know how to count backward on the number line.":
    "Nu weet je hoe je achteruit telt op de getallenlijn.",
  "Now you know how to count forward on the number line.":
    "Nu weet je hoe je vooruit telt op de getallenlijn.",
  "On the number line:": "Op de getallenlijn:",
  "On the number line — how many steps from 10 to 7? 3 steps: 9, 8, 7.":
    "Op de getallenlijn — hoeveel stappen van 10 naar 7? 3 stappen: 9, 8, 7.",
  "Check what's missing:": "Controleer wat er ontbreekt:",
  "There are special pairs that always add up to 10:":
    "Er zijn speciale paren die altijd samen 10 maken:",
  "Join groups or hop to the right on the number line!":
    "Voeg groepen samen of spring naar rechts op de getallenlijn!",
  "22 is to the right of 17 on the number line.": "22 ligt rechts van 17 op de getallenlijn.",
  "14 is to the right of 9 on the number line.": "14 ligt rechts van 9 op de getallenlijn.",
  "3 + __ = 7 on the number line:": "3 + __ = 7 op de getallenlijn:",
  "8 + 5 on the number line — the answer is in the teens (13):":
    "8 + 5 op de getallenlijn — het antwoord zit in de tieners (13):",
  "Tip: Imagine a hungry alligator — the open side of the symbol always points to the bigger number!":
    "Tip: Stel je een hongerige alligator voor — de open kant van het teken wijst altijd naar het grotere getal!",
  "Noa has 2 coins of 5 shekels and 3 coins of 1 shekel. How much money does she have altogether?":
    "Noa heeft 2 munten van 5 sjekel en 3 munten van 1 sjekel. Hoeveel geld heeft zij in totaal?",
  "Yaël had 15 shekels. She bought a pen for 6 shekels. How much money does she have left?":
    "Yaël had 15 sjekel. Zij kocht een pen voor 6 sjekel. Hoeveel geld heeft zij over?",
  "Noa paid 50 shekels for a book that cost 35 shekels. How much change did she get?":
    "Noa betaalde 50 sjekel voor een boek dat 35 sjekel kostte. Hoeveel wisselgeld kreeg zij?",
  "What are we asked? → how much money altogether?": "Wat wordt gevraagd? → hoeveel geld in totaal?",
  "2. What are we asked? — how much is left or how much change":
    "2. Wat wordt gevraagd? — hoeveel er over is of hoeveel wisselgeld",
  "- Spent / paid / cost — how much was paid or how much the thing cost":
    "- Uitgegeven / betaald / prijs — hoeveel er is betaald of hoeveel het kostte",
  "In practice you'll find questions: how much is missing to make 10? Use the ten-frame!":
    "In de oefening vind je vragen: hoeveel ontbreekt er om 10 te maken? Gebruik het tientalraam!",
  "In practice you'll find how much is missing to reach 10? Look for the familiar pair!":
    "In de oefening vind je hoeveel ontbreekt om 10 te bereiken? Zoek het bekende paar!",
  "In practice you'll find division that comes out even — always check with multiplication!":
    "In de oefening vind je delingen die precies uitkomen — controleer altijd met vermenigvuldigen!",
  "Check: divisor × quotient = dividend — always check with multiplication.":
    "Controle: deler × quotiënt = deeltal — controleer altijd met vermenigvuldigen.",
};

const hard = JSON.parse(fs.readFileSync("scripts/i18n/_nl-NL-book-hard-map.json", "utf8"));
let curated = 0;
let auto = 0;
for (const en of lines) {
  if (CURATED[en]) {
    hard[en] = CURATED[en];
    curated++;
    continue;
  }
  if (hard[en] && !stillEnglishBookLine(hard[en])) continue;
  const q = translateBookQualityNl(en);
  // Only overwrite if quality clearly improves English heaviness for short templates
  if (!stillEnglishBookLine(q) || CURATED[en]) {
    hard[en] = q;
    auto++;
  } else if (
    /^(Check |Here |In practice |Today |Put your |How |What |Always |Noa |Danny |Yaël |Amir |On the number|Counting |Join |Tip:|Missing |Make |Find |Rule:|Estimate:|Earth)/i.test(
      en
    )
  ) {
    // force quality+phrase cleanup for instructional openers
    hard[en] = q
      .replace(/\bCheck /g, "Controleer ")
      .replace(/\bHere we /g, "Hier ")
      .replace(/\bIn practice you will find /g, "In de oefening vind je ")
      .replace(/\bIn practice you'll find /g, "In de oefening vind je ")
      .replace(/\bon the number line/g, "op de getallenlijn")
      .replace(/\bshekels\b/g, "sjekel")
      .replace(/\bshekel\b/g, "sjekel")
      .replace(/\balways /g, "altijd ")
      .replace(/\bAlways /g, "Altijd ");
    auto++;
  }
}
Object.assign(hard, CURATED);
fs.writeFileSync("scripts/i18n/_nl-NL-book-hard-map.json", JSON.stringify(hard, null, 2));
console.log({ lines: lines.length, curated, auto, map: Object.keys(hard).length });
