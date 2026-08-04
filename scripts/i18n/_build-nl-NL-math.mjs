/**
 * Build utils/learning-content-nl-NL/math.js from English authority templates.
 * Run: node scripts/i18n/_build-nl-NL-math.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const SRC = path.join(ROOT, "utils/learning-content-en/math.js");
const OUT = path.join(ROOT, "utils/learning-content-nl-NL/math.js");

let s = fs.readFileSync(SRC, "utf8");

s = s
  .replace(/rebuildMathStemEn/g, "rebuildMathStemNlNl")
  .replace(/applyMathLevelPresentationEn/g, "applyMathLevelPresentationNlNl")
  .replace(/localizeMathQuestionEn/g, "localizeMathQuestionNlNl")
  .replace(/WEEKDAYS_EN/g, "WEEKDAYS_NL")
  .replace(/OBJECTS_EN/g, "OBJECTS_NL")
  .replace(/OP_SYMBOL_EN/g, "OP_SYMBOL_NL")
  .replace(/English mirror/g, "Dutch (Netherlands) mirror")
  .replace(/Localize math question for English/g, "Localize math question for Dutch (Netherlands) (nl-NL)")
  .replace(/for English \(en\) display/g, "for Dutch (Netherlands) (nl-NL) display");

s = s.replace(
  /const WEEKDAYS_NL = \[[\s\S]*?\];/,
  `const WEEKDAYS_NL = [
  "zondag",
  "maandag",
  "dinsdag",
  "woensdag",
  "donderdag",
  "vrijdag",
  "zaterdag"];`,
);

s = s.replace(
  /const OBJECTS_NL = \{\};/,
  `const OBJECTS_NL = Object.freeze({
  items: "dingen",
  apples: "appels",
  balls: "ballen",
  stickers: "stickers",
  books: "boeken",
  pencils: "potloden",
  chairs: "stoelen",
  cards: "kaarten",
  boxes: "dozen",
  coins: "munten",
});`,
);

s = s.replace(
  /const YES_NO = \{\};/,
  `const YES_NO = Object.freeze({ Yes: "Ja", No: "Nee", yes: "ja", no: "nee" });`,
);
s = s.replace(
  /const PRIME_COMPOSITE = \{\};/,
  `const PRIME_COMPOSITE = Object.freeze({ prime: "priem", composite: "samengesteld", Prime: "Priem", Composite: "Samengesteld" });`,
);
s = s.replace(
  /const PARITY = \{\};/,
  `const PARITY = Object.freeze({ even: "even", odd: "oneven", Even: "Even", Odd: "Oneven" });`,
);

/** @type {Array<[string, string]>} */
const PAIRS = [
  [
    "There are ${p.groups} groups. Each group has ${p.perGroup} ${objects}. How many ${objects} are there in all?",
    "Er zijn ${p.groups} groepen. Elke groep heeft ${p.perGroup} ${objects}. Hoeveel ${objects} zijn er in totaal?",
  ],
  ["Count by ${p.perGroup}s: ${head}, ${BLANK}", "Tel met sprongen van ${p.perGroup}: ${head}, ${BLANK}"],
  [
    "Fill in the missing number on the number line: ${line}",
    "Vul het ontbrekende getal in op de getallenlijn: ${line}",
  ],
  ["Is ${p.n ?? p.num} an even number?", "Is ${p.n ?? p.num} een even getal?"],
  [
    "Half of ${BLANK} is ${p.whole / 2}. What is the whole number?",
    "De helft van ${BLANK} is ${p.whole / 2}. Wat is het hele getal?",
  ],
  ["What is half of ${p.whole ?? p.n}?", "Wat is de helft van ${p.whole ?? p.n}?"],
  [
    "A quarter of ${BLANK} is ${p.whole / 4}. What is the whole number?",
    "Een kwart van ${BLANK} is ${p.whole / 4}. Wat is het hele getal?",
  ],
  ["What is a quarter of ${p.whole ?? p.n}?", "Wat is een kwart van ${p.whole ?? p.n}?"],
  [
    "Which fraction is larger — ${p.n1}/${p.den} or ${p.n2}/${p.den}? Write the larger fraction: ${BLANK}",
    "Welke breuk is groter — ${p.n1}/${p.den} of ${p.n2}/${p.den}? Schrijf de grotere breuk: ${BLANK}",
  ],
  ["Simplify the fraction ${p.num}/${p.den}: ${BLANK}", "Vereenvoudig de breuk ${p.num}/${p.den}: ${BLANK}"],
  [
    "Find an equivalent fraction for ${p.num}/${p.den} (multiply by ${p.factor}): ${BLANK}",
    "Zoek een gelijkwaardige breuk voor ${p.num}/${p.den} (vermenigvuldig met ${p.factor}): ${BLANK}",
  ],
  [
    "There were ${p.a} children in class and ${p.b} more joined. How many children are there now?",
    "Er waren ${p.a} kinderen in de klas en er kwamen ${p.b} bij. Hoeveel kinderen zijn er nu?",
  ],
  [
    "Leo has ${p.a} balls and gets ${p.b} more. How many balls does Leo have in all?",
    "Leo heeft ${p.a} ballen en krijgt er ${p.b} bij. Hoeveel ballen heeft Leo in totaal?",
  ],
  [
    "There are ${p.total} apples in a basket. ${p.give} were eaten. How many apples are left?",
    "Er liggen ${p.total} appels in een mand. Er zijn er ${p.give} opgegeten. Hoeveel appels zijn er over?",
  ],
  [
    "Leo has ${p.total} stickers. He gives ${p.give} to a friend. How many stickers does Leo have left?",
    "Leo heeft ${p.total} stickers. Hij geeft er ${p.give} aan een vriend. Hoeveel stickers heeft Leo nog?",
  ],
  [
    "Emma has ${p.money} dollars. She buys a snack for ${p.toy} dollars. How much money is left?",
    "Emma heeft ${p.money} euro. Zij koopt een tussendoortje voor ${p.toy} euro. Hoeveel geld blijft er over?",
  ],
  [
    "Each row has ${p.per} chairs. There are ${p.groups} rows like that. How many chairs are there in all?",
    "Elke rij heeft ${p.per} stoelen. Er zijn ${p.groups} van zulke rijen. Hoeveel stoelen zijn er in totaal?",
  ],
  [
    "Each box has ${p.per} pencils. There are ${p.groups} boxes. How many pencils are there in all?",
    "Elke doos bevat ${p.per} potloden. Er zijn ${p.groups} dozen. Hoeveel potloden zijn er in totaal?",
  ],
  [
    "Each shelf has ${p.per} books. There are ${p.groups} shelves. How many books are there in all?",
    "Elke plank heeft ${p.per} boeken. Er zijn ${p.groups} planken. Hoeveel boeken zijn er in totaal?",
  ],
  [
    "Each container has ${p.per} parts. ${p.groups} containers were delivered. How many parts in all?",
    "Elke container bevat ${p.per} onderdelen. Er zijn ${p.groups} containers geleverd. Hoeveel onderdelen in totaal?",
  ],
  [
    "Each supply crate has ${p.per} packages. ${p.groups} crates were delivered. How many packages in all?",
    "Elke voorraadkist bevat ${p.per} pakketten. Er zijn ${p.groups} kisten geleverd. Hoeveel pakketten in totaal?",
  ],
  [
    "Noa has ${p.big} cards and Yuval has ${p.small} cards. How many more cards does Noa have than Yuval?",
    "Noa heeft ${p.big} kaarten en Yuval heeft ${p.small} kaarten. Hoeveel kaarten heeft Noa meer dan Yuval?",
  ],
  [
    "A hall has ${p.whole} seats. ${p.partA} are taken for a show and the rest are empty. How many seats are empty?",
    "Een zaal heeft ${p.whole} stoelen. ${p.partA} zijn bezet voor een voorstelling en de rest is leeg. Hoeveel stoelen zijn leeg?",
  ],
  [
    "A class has ${p.whole} students. ${p.partA} are in soccer club and the rest are in chess club. How many students are in chess club?",
    "Een klas heeft ${p.whole} leerlingen. ${p.partA} zitten bij de voetbalclub en de rest bij de schaakclub. Hoeveel leerlingen zitten bij de schaakclub?",
  ],
  [
    "A warehouse had ${p.start} boxes. ${p.gain} new boxes were added and ${p.loss} were sent to another branch. How many boxes remain?",
    "Een magazijn had ${p.start} dozen. Er zijn ${p.gain} nieuwe dozen bijgekomen en ${p.loss} zijn naar een ander filiaal gestuurd. Hoeveel dozen blijven er over?",
  ],
  [
    "A library had ${p.start} books. ${p.gain} new books were added and ${p.loss} were checked out. How many books are in the library now?",
    "Een bibliotheek had ${p.start} boeken. Er zijn ${p.gain} nieuwe boeken bijgekomen en ${p.loss} zijn uitgeleend. Hoeveel boeken heeft de bibliotheek nu?",
  ],
  ["If today is ${start}, how many days until ${end}?", "Als het vandaag ${start} is, hoeveel dagen tot ${end}?"],
  [
    "If today is the ${p.today}th of the month, what date will it be in ${p.daysLater} days?",
    "Als het vandaag de ${p.today}e van de maand is, welke datum is het over ${p.daysLater} dagen?",
  ],
  [
    "Leo has ${p.coins1} one-dollar coins and ${p.coins2} two-dollar coins. How much money does he have in all?",
    "Leo heeft ${p.coins1} munten van 1 euro en ${p.coins2} munten van 2 euro. Hoeveel geld heeft hij in totaal?",
  ],
  [
    "Leo has ${p.total} dollars in coins. He buys candy for ${p.spent} dollars. How much money is left?",
    "Leo heeft € ${p.total} in munten. Hij koopt snoep voor € ${p.spent}. Hoeveel geld blijft er over?",
  ],
  [
    "There are ${p.total} apples divided into groups of ${p.perGroup} apples each. How many groups are there?",
    "Er zijn ${p.total} appels verdeeld in groepen van ${p.perGroup} appels. Hoeveel groepen zijn er?",
  ],
  [
    "${p.total} students are split into groups of ${p.groupSize}. How many students are left without a full group?",
    "${p.total} leerlingen worden verdeeld in groepen van ${p.groupSize}. Hoeveel leerlingen blijven over zonder een volle groep?",
  ],
  [
    "A shirt costs ${p.price} dollars with a ${p.discPerc}% discount. How much do you pay after the discount?",
    "Een shirt kost € ${p.price} met ${p.discPerc}% korting. Hoeveel betaal je na de korting?",
  ],
  ["How many meters are ${p.cm} centimeters? = ${BLANK}", "Hoeveel meter is ${p.cm} centimeter? = ${BLANK}"],
  ["How many kilograms are ${p.g} grams? = ${BLANK}", "Hoeveel kilogram is ${p.g} gram? = ${BLANK}"],
  [
    "A child walks at a steady speed of ${p.speed} km/h for ${p.hours} hours. How many kilometers will they travel?",
    "Een kind loopt met een constante snelheid van ${p.speed} km/u gedurende ${p.hours} uur. Hoeveel kilometer legt het af?",
  ],
  [
    "One video clip lasts ${p.l1} minutes and another lasts ${p.l2} minutes. How many minutes do both clips last together?",
    "Een videoclip duurt ${p.l1} minuten en een andere duurt ${p.l2} minuten. Hoeveel minuten duren beide clips samen?",
  ],
  [
    "A group project got scores ${p.s1}, ${p.s2}, and ${p.s3} on three stages. What is the average score (rounded to a whole number)?",
    "Een groepsproject scoorde ${p.s1}, ${p.s2} en ${p.s3} in drie onderdelen. Wat is de gemiddelde score (afgerond op een heel getal)?",
  ],
  [
    "Leo scored ${p.s1}, ${p.s2}, and ${p.s3} on three tests. What is his average (rounded to a whole number)?",
    "Leo scoorde ${p.s1}, ${p.s2} en ${p.s3} op drie toetsen. Wat is zijn gemiddelde (afgerond op een heel getal)?",
  ],
  [
    "Leo has ${p.money} dollars. He buys ${p.a} pens and ${p.b} pencils, and each item costs ${p.price} dollars. How much money is left after shopping?",
    "Leo heeft € ${p.money}. Hij koopt ${p.a} pennen en ${p.b} potloden, en elk artikel kost € ${p.price}. Hoeveel geld blijft er over na het winkelen?",
  ],
  [
    "There are ${p.groups} groups with ${p.each} items in each group. Which operation finds the total?",
    "Er zijn ${p.groups} groepen met ${p.each} dingen in elke groep. Welke bewerking geeft het totaal?",
  ],
  ['|| "Monday"', '|| "maandag"'],
  ['|| "Friday"', '|| "vrijdag"'],
  ["How much is ${a}", "Hoeveel is ${a}"],
  ['return "Solve.";', 'return "Reken uit.";'],
  ['resolvedStem = "Solve.";', 'resolvedStem = "Reken uit.";'],
  ["Make ${c}: what do you add to ${b} to reach ${c}? = ${BLANK}", "Maak ${c}: wat tel je op bij ${b} om op ${c} te komen? = ${BLANK}"],
  ["Given ${b} + ${BLANK} = ${c}. What is the missing number?", "Gegeven ${b} + ${BLANK} = ${c}. Wat is het ontbrekende getal?"],
  [
    "Word problem: ${b} is missing a part to reach ${c} — how much to add? = ${BLANK}",
    "Verhaalsom: bij ${b} ontbreekt een deel om op ${c} te komen — hoeveel moet je optellen? = ${BLANK}",
  ],
  ["Up to ${c}: what do you add to ${b} to finish at ${c}? = ${BLANK}", "Tot ${c}: wat tel je op bij ${b} om op ${c} te eindigen? = ${BLANK}"],
  ["Missing in the equation: ${b} + ${BLANK} = ${c}", "Ontbreekt in de som: ${b} + ${BLANK} = ${c}"],
  ["Without a column: what addition to ${c} starts with ${b}? = ${BLANK}", "Zonder kolom: welke optelling tot ${c} begint met ${b}? = ${BLANK}"],
  ["Continue the sequence", "Ga verder met het patroon"],
];

const missing = [];
for (const [en, nl] of PAIRS) {
  if (!s.includes(en)) missing.push(en.slice(0, 60));
  else s = s.split(en).join(nl);
}

// Presentation / level wrappers — targeted Dutch educational phrasing
const PRESENTATION = [
  [
    "On a map, a segment is ${ml} cm long and in real life it is ${rl} cm. Complete the scale as 1:${BLANK}",
    "Op een kaart is een lijnstuk ${ml} cm lang en in het echt ${rl} cm. Vul de schaal in als 1:${BLANK}",
  ],
  [
    "Map length ${ml} cm, real length ${rl} cm. What is the scale? Write the number after 1: = ${BLANK}",
    "Kaartlengte ${ml} cm, echte lengte ${rl} cm. Wat is de schaal? Schrijf het getal na 1: = ${BLANK}",
  ],
  [
    "Map ${ml} cm and real ${rl} cm — the scale is 1:__. What is the missing number? = ${BLANK}",
    "Kaart ${ml} cm en echt ${rl} cm — de schaal is 1:__. Wat is het ontbrekende getal? = ${BLANK}",
  ],
  [
    "At scale 1:${sc}, how many real cm equal ${ml} cm on the map? = ${BLANK}",
    "Op schaal 1:${sc}, hoeveel echte cm zijn gelijk aan ${ml} cm op de kaart? = ${BLANK}",
  ],
  [
    "Scale 1:${sc}. A map measure of ${ml} cm — what is the real length in cm? = ${BLANK}",
    "Schaal 1:${sc}. Een kaartmaat van ${ml} cm — wat is de echte lengte in cm? = ${BLANK}",
  ],
  [
    "Scale 1:${sc}, map measure ${ml} cm — find the real length in cm = ${BLANK}",
    "Schaal 1:${sc}, kaartmaat ${ml} cm — zoek de echte lengte in cm = ${BLANK}",
  ],
  [
    "At scale 1:${sc}, real length ${rl} cm — how many cm on the map? = ${BLANK}",
    "Op schaal 1:${sc}, echte lengte ${rl} cm — hoeveel cm op de kaart? = ${BLANK}",
  ],
  [
    "Real length ${rl} cm, scale 1:${sc}. What is the length on the map? = ${BLANK}",
    "Echte lengte ${rl} cm, schaal 1:${sc}. Wat is de lengte op de kaart? = ${BLANK}",
  ],
  [
    "Convert real to map: ${rl} cm real at 1:${sc} — how many cm on the page? = ${BLANK}",
    "Zet echt om naar kaart: ${rl} cm echt bij 1:${sc} — hoeveel cm op de pagina? = ${BLANK}",
  ],
  ["Compare the two numbers and fill in (<, =, >):", "Vergelijk de twee getallen en vul in (<, =, >):"],
  ["Comparison sign between the numbers:", "Vergelijkingsteken tussen de getallen:"],
  ["Choose < , = or > — compare:", "Kies < , = of > — vergelijk:"],
  ["Compare the values and fill in the sign:", "Vergelijk de waarden en vul het teken in:"],
  ["Fill in the correct comparison sign:", "Vul het juiste vergelijkingsteken in:"],
  ["Which sign compares the pair?", "Welk teken vergelijkt het paar?"],
  ["Match the correct comparison sign:", "Kies het juiste vergelijkingsteken:"],
  ["Fill in the sign between the number expressions:", "Vul het teken tussen de getallen in:"],
  ["Fill in the comparison sign — check before choosing:", "Vul het vergelijkingsteken in — controleer eerst:"],
  ["Compare carefully and choose a sign:", "Vergelijk zorgvuldig en kies een teken:"],
  ["Quick check: which sign fits?", "Snelle check: welk teken past?"],
  ["Divisibility:", "Deelbaarheid:"],
  ["does ${num} divide evenly by ${div}?", "is ${num} deelbaar door ${div}?"],
  ["Check: ${num} is a multiple of ${div} (no remainder)?", "Controleer: is ${num} een veelvoud van ${div} (zonder rest)?"],
  ["Divisibility rules —", "Deelbaarheidsregels —"],
  ["Integer division:", "Gehele deling:"],
  ["Divisibility check:", "Deelbaarheidscontrole:"],
  ["Divisors:", "Delers:"],
  ["Prime numbers:", "Priemgetallen:"],
  ["how many divisors does ${num} have?", "hoeveel delers heeft ${num}?"],
  ["Count divisors:", "Tel de delers:"],
  ["Prime factor:", "Priemfactor:"],
  ["what is the smallest prime factor of ${num}?", "wat is de kleinste priemfactor van ${num}?"],
  ["Find the smallest prime factor of ${num}.", "Zoek de kleinste priemfactor van ${num}."],
  ["Factors:", "Factoren:"],
  ["Divisor check:", "Delercontrole:"],
  ["Classify the number:", "Classificeer het getal:"],
  ["— prime or composite?", "— priem of samengesteld?"],
  ["Basic classification:", "Basisclassificatie:"],
  ["has exactly two different natural divisors?", "heeft precies twee verschillende natuurlijke delers?"],
  ["Think before you choose.", "Denk na voordat je kiest."],
  ["Quick proof:", "Snelle controle:"],
  ["Powers:", "Machten:"],
  ["Evaluate the power —", "Bereken de macht —"],
  ["Find the base in the power:", "Zoek het grondtal in de macht:"],
  ["Power puzzle —", "Machtenpuzzel —"],
  ["Missing base in the power:", "Ontbrekend grondtal in de macht:"],
  ["Rounding estimate: estimate", "Schatting door afronden: schat"],
  ["Fractions:", "Breuken:"],
  ["Fraction as part of a whole:", "Breuk als deel van een geheel:"],
  ["Identify a divisor:", "Zoek een deler:"],
  ["Divisors and factors:", "Delers en factoren:"],
  ["Multiples:", "Veelvouden:"],
  ["Check multiples:", "Controleer veelvouden:"],
  ["GCF: what is the greatest common factor of", "GGD: wat is de grootste gemene deler van"],
  ["Greatest common factor (GCD) of", "Grootste gemene deler (GGD) van"],
  ["— what is it?", "— wat is die?"],
  ["GCD: think first - GCD(", "GGD: denk eerst na — GGD("],
  ["Round to tens:", "Afronden op tientallen:"],
  ["where does ${n} round?", "waar rondt ${n} naartoe?"],
  ["Nearest ten:", "Dichtstbijzijnde tien:"],
  ["Round ${n} to the nearest ten - result?", "Rond ${n} af op het dichtstbijzijnde tiental — resultaat?"],
  ["Rounding rule for tens:", "Afrondingsregel voor tientallen:"],
  ["Correct number after rounding ${n} to tens", "Juiste getal na afronden van ${n} op tientallen"],
  ["Round to hundreds:", "Afronden op honderdtallen:"],
  ["Nearest hundred:", "Dichtstbijzijnde honderd:"],
  ["Round ${n} to the nearest hundred - result?", "Rond ${n} af op het dichtstbijzijnde honderdtal — resultaat?"],
  ["Number after rounding ${n} to hundreds", "Getal na afronden van ${n} op honderdtallen"],
  ["Add decimals:", "Tel decimalen op:"],
  ["Direct sum:", "Directe som:"],
  ["Subtract decimals:", "Trek decimalen af:"],
  ["Direct difference:", "Direct verschil:"],
  ["Compare carefully and pick a sign:", "Vergelijk zorgvuldig en kies een teken:"],
];

for (const [en, nl] of PRESENTATION) {
  if (s.includes(en)) s = s.split(en).join(nl);
}

s =
  `/**
 * Dutch (Netherlands) (nl-NL) rebuilders for math question stems.
 * English is the authority; params/numbers/operators unchanged.
 */
` + s.replace(/^\/\*\*[\s\S]*?\*\/\s*/m, "");

// Fix generic stem if present
s = s.replace(/`How much is \$\{a\} \$\{OP_SYMBOL_NL\[opRaw\]\} \$\{b\}\?`/g, "`Hoeveel is ${a} ${OP_SYMBOL_NL[opRaw]} ${b}?`");
s = s.replace(/`What is \$\{a\} \$\{OP_SYMBOL_NL\[opRaw\]\} \$\{b\}\?`/g, "`Hoeveel is ${a} ${OP_SYMBOL_NL[opRaw]} ${b}?`");
s = s.replace(/stem: `What is \$\{a\}/g, "stem: `Hoeveel is ${a}");
s = s.replace(/stem: `How much is \$\{a\}/g, "stem: `Hoeveel is ${a}");

// Fallbacks seen in en file
s = s.replace(/return \{ stem: `\$\{a\}/g, "return { stem: `${a}");
if (s.includes('stem: `What is ${a}')) {
  s = s.replace(/stem: `What is \$\{a\} \$\{OP_SYMBOL_NL\[opRaw\]\} \$\{b\}\?`/g, "stem: `Hoeveel is ${a} ${OP_SYMBOL_NL[opRaw]} ${b}?`");
}

fs.writeFileSync(OUT, s, "utf8");
console.log("Wrote", OUT);
console.log("Missing pair prefixes:", missing.length);
if (missing.length) console.log(missing.slice(0, 20));
const leftover = [...s.matchAll(/`(There |How many |What is |Which |Each |A class |A hall |If today |Fill in |Count by |Is \$\{|Find an |Simplify |Leo has |Emma has )/g)];
console.log("Leftover EN-looking stem starts:", leftover.length);
