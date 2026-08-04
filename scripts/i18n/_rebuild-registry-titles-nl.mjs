import fs from "node:fs";

const MAP = {
  "Uppercase Letters A–Z and more": "Hoofdletters A–Z en meer",
  "Letter Sounds and more": "Letterklanken en meer",
  "Classroom Words and more": "Klassikale woorden en meer",
  "Picture and Word and more": "Plaatje en woord en meer",
  "Review: Letters and Names and more": "Herhaling: letters en namen en meer",
  "Getting to Know the Square and more": "Kennismaken met het vierkant en meer",
  "Translation and Reflection — Introduction": "Translatie en spiegeling — introductie",
  "Three-Dimensional Solids — Names and Introduction": "Driedimensionale lichamen — namen en introductie",
  "Area of a Square": "Oppervlakte van een vierkant",
  "Translation and Reflection — More Practice": "Translatie en spiegeling — meer oefenen",
  "Types of Triangles and more": "Soorten driehoeken en meer",
  "Parallel and Perpendicular Lines": "Evenwijdige en loodrechte lijnen",
  "Area of a Square and more": "Oppervlakte van een vierkant en meer",
  "Angles in a Triangle": "Hoeken in een driehoek",
  "Rotation in the Plane and more": "Rotatie in het vlak en meer",
  "Properties of a Square and more": "Eigenschappen van een vierkant en meer",
  "Quadrilaterals and more": "Vierhoeken en meer",
  "Perimeter of a Square and more": "Omtrek van een vierkant en meer",
  "Diagonal of a Square and more": "Diagonaal van een vierkant en meer",
  "Solids and more": "Lichamen en meer",
  "Parallel and Perpendicular Lines and more": "Evenwijdige en loodrechte lijnen en meer",
  "Height of a Triangle and more": "Hoogte van een driehoek en meer",
  "Three-Dimensional Solids and more": "Driedimensionale lichamen en meer",
  "Tiling a Plane": "Betegelen van een vlak",
  "Circumference of a Circle and more": "Omtrek van een cirkel en meer",
  "Pythagorean Theorem and more": "Stelling van Pythagoras en meer",
  "Volume of a Prism and more": "Inhoud van een prisma en meer",
  "Volume of a Pyramid and more": "Inhoud van een piramide en meer",
  "Volume of a Cylinder and more": "Inhoud van een cilinder en meer",
  "Counting Forward on the Number Line and more": "Vooruit tellen op de getallenlijn en meer",
  "Tens and Ones and more": "Tientallen en eenheden en meer",
  "Adding Two Numbers and more": "Twee getallen optellen en meer",
  "Word Problems and more": "Verhaalsommen en meer",
  "Hundreds, Tens, and Ones and more": "Honderdtallen, tientallen en eenheden en meer",
  "When Does a Number Divide by 2, 5, and 10? and more": "Wanneer is een getal deelbaar door 2, 5 en 10? en meer",
  "Fractions — What Are They and How Do We Compare?": "Breuken — wat zijn ze en hoe vergelijken we ze?",
  "Addition Equation and more": "Optelvergelijking en meer",
  "Word Problem and more": "Verhaalsom en meer",
  "Place Value and more": "Plaatswaarde en meer",
  "Adding with 0 and more": "Optellen met 0 en meer",
  "Division and more": "Delen en meer",
  "Adding Decimal Numbers and more": "Decimale getallen optellen en meer",
  "Adding Decimals and more": "Decimalen optellen en meer",
  "Powers and more": "Machten en meer",
  "Simplifying Fractions and more": "Breuken vereenvoudigen en meer",
  "Factors of a Number and more": "Delers van een getal en meer",
  "Percent of a Quantity and more": "Percentage van een hoeveelheid en meer",
  "A Fraction as Division and more": "Een breuk als delen en meer",
  "Ratios and more": "Verhoudingen en meer",
  "The Human Body and more": "Het menselijk lichaam en meer",
  "Materials and more": "Materialen en meer",
  "Observation and Investigation": "Waarnemen en onderzoeken",
  "A Short Scientific Experiment": "Een kort wetenschappelijk experiment",
  "Planning an Experiment": "Een experiment plannen",
  "Full Investigation — Documentation": "Volledig onderzoek — documentatie",
  "Science Project": "Natuur-en-techniekproject",
  "Coming soon": "Binnenkort",
};

const en = JSON.parse(fs.readFileSync("content-packs/en/books/registry-titles.json", "utf8"));

function mapBookTitle(v) {
  return String(v)
    .replace(/^English — Grade 1$/, "Engels — Groep 3")
    .replace(/^English — Grade 2$/, "Engels — Groep 4")
    .replace(/^English — Grade 3$/, "Engels — Groep 5")
    .replace(/^English — Grade 4$/, "Engels — Groep 6")
    .replace(/^English — Grade 5$/, "Engels — Groep 7")
    .replace(/^English — Grade 6$/, "Engels — Groep 8")
    .replace(/^Geometry — Grade 1$/, "Meetkunde — Groep 3")
    .replace(/^Geometry — Grade 2$/, "Meetkunde — Groep 4")
    .replace(/^Geometry — Grade 3$/, "Meetkunde — Groep 5")
    .replace(/^Geometry — Grade 4$/, "Meetkunde — Groep 6")
    .replace(/^Geometry — Grade 5$/, "Meetkunde — Groep 7")
    .replace(/^Geometry — Grade 6$/, "Meetkunde — Groep 8")
    .replace(/^Math — Grade 1$/, "Rekenen — Groep 3")
    .replace(/^Math — Grade 2$/, "Rekenen — Groep 4")
    .replace(/^Math — Grade 3$/, "Rekenen — Groep 5")
    .replace(/^Math — Grade 4$/, "Rekenen — Groep 6")
    .replace(/^Math — Grade 5$/, "Rekenen — Groep 7")
    .replace(/^Math — Grade 6$/, "Rekenen — Groep 8")
    .replace(/^Science — Grade 1$/, "Natuur en techniek — Groep 3")
    .replace(/^Science — Grade 2$/, "Natuur en techniek — Groep 4")
    .replace(/^Science — Grade 3$/, "Natuur en techniek — Groep 5")
    .replace(/^Science — Grade 4$/, "Natuur en techniek — Groep 6")
    .replace(/^Science — Grade 5$/, "Natuur en techniek — Groep 7")
    .replace(/^Science — Grade 6$/, "Natuur en techniek — Groep 8");
}

function convert(node) {
  if (!node || typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map(convert);
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === "title" && typeof v === "string") {
      if (!(v in MAP)) throw new Error("Missing title map: " + v);
      out[k] = MAP[v];
    } else if (k === "bookTitle" && typeof v === "string") {
      out[k] = mapBookTitle(v);
    } else if (v && typeof v === "object") out[k] = convert(v);
    else out[k] = v;
  }
  return out;
}

const nl = convert(en);
fs.writeFileSync("content-packs/nl-NL/books/registry-titles.json", JSON.stringify(nl, null, 2) + "\n");
console.log({ titles: Object.keys(MAP).length, ok: true });
