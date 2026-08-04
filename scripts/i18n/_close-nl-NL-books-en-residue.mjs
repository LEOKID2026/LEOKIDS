/**
 * Close remaining English instructional residue in nl-NL learning books (non-English subjects)
 * and polish books/ui.json + leftover chrome.
 */
import fs from "node:fs";
import path from "node:path";
import { translateBookLineNl } from "./_nl-NL-book-line.mjs";

function walk(d, a = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, a);
    else if (p.endsWith(".md")) a.push(p);
  }
  return a;
}

const EXACT_LINE = {
  "What are we learning?": "Wat gaan we leren?",
  "Simple explanation": "Eenvoudige uitleg",
  "Try it yourself": "Probeer het zelf",
  "Try it yourself.": "Probeer het zelf.",
  "Let's practice!": "Laten we oefenen!",
  "Let's practice": "Laten we oefenen",
  "On the next page, we'll check the answer and how to get there together.":
    "Op de volgende pagina kijken we samen het antwoord en de weg ernaartoe na.",
  "Wat we learn": "Wat gaan we leren?",
  "Try it uwself": "Probeer het zelf",
  "Put your finger on a number — \"I'm on 4\"": 'Leg je vinger op een getal — "Ik ben op 4"',
  '- Put your finger on a number — "I\'m on 4"': '- Leg je vinger op een getal — "Ik ben op 4"',
};

const PHRASE = [
  ["What is the length of de diagonaal?", "Wat is de lengte van de diagonaal?"],
  ["what is the length of de diagonaal?", "wat is de lengte van de diagonaal?"],
  ["what is de diagonaal?", "wat is de diagonaal?"],
  ["What is the length of the other sides?", "Wat is de lengte van de andere zijden?"],
  ["what is the length of each one?", "wat is de lengte van elke zijde?"],
  ["What is the length of the hypotenuse?", "Wat is de lengte van de hypotenusa?"],
  ["what is the length of the hypotenuse?", "wat is de lengte van de hypotenusa?"],
  ["What is the length of the other leg?", "Wat is de lengte van het andere been?"],
  ["what is the other leg?", "wat is het andere been?"],
  ["What is the third angle?", "Wat is de derde hoek?"],
  ["what is the third angle?", "wat is de derde hoek?"],
  ["What is angle C?", "Wat is hoek C?"],
  ["what is angle C?", "wat is hoek C?"],
  ["What is the volume?", "Wat is het volume?"],
  ["what is the volume?", "wat is het volume?"],
  ["What is the circumference?", "Wat is de omtrek?"],
  ["what is the circumference?", "wat is de omtrek?"],
  ["What is de hoogte?", "Wat is de hoogte?"],
  ["what is de hoogte?", "wat is de hoogte?"],
  ["What is it called?", "Hoe heet het?"],
  ["What is the name of this solid?", "Hoe heet dit lichaam?"],
  ["what is the relationship between them?", "wat is de relatie tussen beide?"],
  ["what is the relationship between", "wat is de relatie tussen"],
  ["what is the base angle of each tile?", "wat is de basishoek van elke tegel?"],
  ["what is the angle of each tile?", "wat is de hoek van elke tegel?"],
  ["what is the sum of all its angles?", "wat is de som van al zijn hoeken?"],
  ["What is the size of each one?", "Hoe groot is elke hoek?"],
  ["Hoeveel rechte hoeken does een vierkant have, and what is the size of each one?", "Hoeveel rechte hoeken heeft een vierkant, en hoe groot is elke hoek?"],
  ["Hoeveel sides does it have, and what is the length of each one?", "Hoeveel zijden heeft het, en wat is de lengte van elke zijde?"],
  ["A shape has a different length and width, 4 rechte hoeken, and equal opposite sides. What is it called?", "Een vorm heeft een verschillende lengte en breedte, 4 rechte hoeken en even lange overstaande zijden. Hoe heet het?"],
  ["There is a shape with 4 equal sides and 4 rechte hoeken. What is it called?", "Er is een vorm met 4 even lange zijden en 4 rechte hoeken. Hoe heet het?"],
  ["A solid has 6 equal square faces. What is it called?", "Een lichaam heeft 6 gelijke vierkante vlakken. Hoe heet het?"],
  ["Two rails of a train track — what is the relationship between them?", "Twee rails van een treinspoor — wat is de relatie tussen beide?"],
  ["A floor tile — 4 equal sides and 4 rechte hoeken. What is it called?", "Een vloertegel — 4 even lange zijden en 4 rechte hoeken. Hoe heet het?"],
  ["For a 3 by 4 rectangle — what is the length of de diagonaal?", "Voor een rechthoek van 3 bij 4 — wat is de lengte van de diagonaal?"],
  ["Rectangle 6 by 8 — what is the length of de diagonaal?", "Rechthoek 6 bij 8 — wat is de lengte van de diagonaal?"],
  ["Rectangle 5 cm × 12 cm — what is the length of de diagonaal?", "Rechthoek 5 cm × 12 cm — wat is de lengte van de diagonaal?"],
  ["A balk has length 3 cm, width 4 cm, and height 5 cm. What is the volume?", "Een balk heeft lengte 3 cm, breedte 4 cm en hoogte 5 cm. Wat is het volume?"],
  ["balk: 2 × 4 × 6 cm — what is the volume?", "balk: 2 × 4 × 6 cm — wat is het volume?"],
  ["In een rechthoek one side is 6 and an adjacent side is 4. What is the length of the other sides?", "In een rechthoek is de ene zijde 6 en een aangrenzende zijde 4. Wat is de lengte van de andere zijden?"],
  ["Een vierkant heeft een zijde van lengte 7. What is the length of the other sides?", "Een vierkant heeft een zijde van lengte 7. Wat is de lengte van de andere zijden?"],
  ["Een vierkant met zijde 4 — Hoeveel sides does it have, and what is the length of each one?", "Een vierkant met zijde 4 — hoeveel zijden heeft het, en wat is de lengte van elke zijde?"],
  ["In een driehoek one angle is 45° and another is 75°. What is the third angle?", "In een driehoek is de ene hoek 45° en een andere 75°. Wat is de derde hoek?"],
  ["In een driehoek: angle 60° and angle 80° — what is the third angle?", "In een driehoek: hoek 60° en hoek 80° — wat is de derde hoek?"],
  ["Vierkant met zijde 6 cm. What is the length of de diagonaal? (expression with √2)", "Vierkant met zijde 6 cm. Wat is de lengte van de diagonaal? (uitdrukking met √2)"],
  ["Vierkant met zijde 5 cm — what is de diagonaal?", "Vierkant met zijde 5 cm — wat is de diagonaal?"],
  ["Vierkant met zijde 5 cm — what is the length of de diagonaal?", "Vierkant met zijde 5 cm — wat is de lengte van de diagonaal?"],
  ["Parallelogram: base 6 cm, area 54 cm² — what is de hoogte?", "Parallellogram: basis 6 cm, oppervlakte 54 cm² — wat is de hoogte?"],
  ["Trapezoid: bases 3 cm and 7 cm, area 30 cm² — what is de hoogte?", "Trapezium: bases 3 cm en 7 cm, oppervlakte 30 cm² — wat is de hoogte?"],
  ["Triangle — base 10 cm, area 30 cm². What is de hoogte?", "Driehoek — basis 10 cm, oppervlakte 30 cm². Wat is de hoogte?"],
  ["Triangle: base 12 cm, area 30 cm² — what is de hoogte?", "Driehoek: basis 12 cm, oppervlakte 30 cm² — wat is de hoogte?"],
  ["In trapezoid ABCD — what is the relationship between AB and CD?", "In trapezium ABCD — wat is de relatie tussen AB en CD?"],
  ["In rectangle ABCD — what is the relationship between AB and BC?", "In rechthoek ABCD — wat is de relatie tussen AB en BC?"],
  ["balk 4 cm × 3 cm × 5 cm. What is the volume?", "balk 4 cm × 3 cm × 5 cm. Wat is het volume?"],
  ["balk 2 cm × 6 cm × 3 cm — what is the volume?", "balk 2 cm × 6 cm × 3 cm — wat is het volume?"],
  ["balk 5 cm × 4 cm × 6 cm. What is the volume?", "balk 5 cm × 4 cm × 6 cm. Wat is het volume?"],
  ["balk 3 cm × 4 cm × 7 cm — what is the volume?", "balk 3 cm × 4 cm × 7 cm — wat is het volume?"],
  ["Tiling with squares — what is the base angle of each tile?", "Betegeling met vierkanten — wat is de basishoek van elke tegel?"],
  ["Tiling with equilateral triangles — what is the angle of each tile?", "Betegeling met gelijkzijdige driehoeken — wat is de hoek van elke tegel?"],
  ["In triangle ABC angle A = 60°, angle B = 70°. What is angle C?", "In driehoek ABC is hoek A = 60°, hoek B = 70°. Wat is hoek C?"],
  ["In triangle ABC: 45° and 95° — what is the third angle?", "In driehoek ABC: 45° en 95° — wat is de derde hoek?"],
  ["In triangle ABC: angle A = 45°, angle B = 95° — what is angle C?", "In driehoek ABC: hoek A = 45°, hoek B = 95° — wat is hoek C?"],
  ["Circle radius 5 cm (π = 3.14) — what is the circumference?", "Cirkel straal 5 cm (π = 3.14) — wat is de omtrek?"],
  ["Circle radius 7 cm (π = 3.14) — what is the circumference?", "Cirkel straal 7 cm (π = 3.14) — wat is de omtrek?"],
  ["Cone: radius 5 cm, height 6 cm (π = 3.14) — what is the volume?", "Kegel: straal 5 cm, hoogte 6 cm (π = 3.14) — wat is het volume?"],
  ["Cone — radius 5 cm, height 6 cm (π = 3.14) — what is the volume?", "Kegel — straal 5 cm, hoogte 6 cm (π = 3.14) — wat is het volume?"],
  ["Cylinder: radius 5 cm, height 8 cm (π = 3.14) — what is the volume?", "Cilinder: straal 5 cm, hoogte 8 cm (π = 3.14) — wat is het volume?"],
  ["Cylinder — radius 5 cm, height 8 cm (π = 3.14) — what is the volume?", "Cilinder — straal 5 cm, hoogte 8 cm (π = 3.14) — wat is het volume?"],
  ["Prism — base 6 cm × 4 cm, height 10 cm. What is the volume?", "Prisma — grondvlak 6 cm × 4 cm, hoogte 10 cm. Wat is het volume?"],
  ["Prism: base 7 cm × 5 cm, height 4 cm — what is the volume?", "Prisma: grondvlak 7 cm × 5 cm, hoogte 4 cm — wat is het volume?"],
  ["Prism — base 7 cm × 5 cm, height 4 cm — what is the volume?", "Prisma — grondvlak 7 cm × 5 cm, hoogte 4 cm — wat is het volume?"],
  ["Prism: base 8 cm, triangle height 6 cm, prism height 7 cm — what is the volume?", "Prisma: basis 8 cm, driehoekhoogte 6 cm, prismahoogte 7 cm — wat is het volume?"],
  ["Prism — base 8 cm, triangle height 6 cm, prism height 7 cm — what is the volume?", "Prisma — basis 8 cm, driehoekhoogte 6 cm, prismahoogte 7 cm — wat is het volume?"],
  ["Pyramid: base 5 cm × 9 cm, height 6 cm — what is the volume?", "Piramide: grondvlak 5 cm × 9 cm, hoogte 6 cm — wat is het volume?"],
  ["Pyramid — base 5 cm × 9 cm, height 6 cm — what is the volume?", "Piramide — grondvlak 5 cm × 9 cm, hoogte 6 cm — wat is het volume?"],
  ["Pyramid: square base 4 cm, height 12 cm — what is the volume?", "Piramide: vierkant grondvlak 4 cm, hoogte 12 cm — wat is het volume?"],
  ["Pyramid — square base 4 cm, height 12 cm — what is the volume?", "Piramide — vierkant grondvlak 4 cm, hoogte 12 cm — wat is het volume?"],
  ["Right triangle — legs 3 cm and 4 cm. What is the length of the hypotenuse?", "Rechthoekige driehoek — benen 3 cm en 4 cm. Wat is de lengte van de hypotenusa?"],
  ["Right triangle: legs 5 cm and 12 cm — what is the length of the hypotenuse?", "Rechthoekige driehoek: benen 5 cm en 12 cm — wat is de lengte van de hypotenusa?"],
  ["Right triangle — hypotenuse 13 cm, leg 12 cm. What is the length of the other leg?", "Rechthoekige driehoek — hypotenusa 13 cm, been 12 cm. Wat is de lengte van het andere been?"],
  ["Right triangle: hypotenuse 10 cm, leg 6 cm — what is the other leg?", "Rechthoekige driehoek: hypotenusa 10 cm, been 6 cm — wat is het andere been?"],
  ["Put your finger on ", "Leg je vinger op "],
  [" on the getallenlijn.", " op de getallenlijn."],
  ["Try de kids world", "Probeer de kinderwereld"],
  ["Unread messages - leerkrachten", "Ongelezen berichten - leerkrachten"],
  ["Unread messages - ouders", "Ongelezen berichten - ouders"],
].sort((a, b) => b[0].length - a[0].length);

function translateLine(line) {
  const t = line.trim();
  if (Object.prototype.hasOwnProperty.call(EXACT_LINE, t)) {
    return line.replace(t, EXACT_LINE[t]);
  }
  let out = translateBookLineNl(line);
  for (const [en, nl] of Object.entries(EXACT_LINE)) {
    if (out.includes(en)) out = out.split(en).join(nl);
  }
  for (const [en, nl] of PHRASE) {
    if (out.includes(en)) out = out.split(en).join(nl);
  }
  return out;
}

const BAD =
  /\b(What is|What are|There is|A shape|A solid|Two rails|For a |Rectangle |Circle |Cone|Cylinder|Prism|Pyramid|Right triangle|Tiling |In triangle|In rectangle|In trapezoid|Hoeveel .* does|sides does|the volume|the length|the relationship|the circumference|the hypotenuse|the other leg|the third angle|the sum of|the base angle|Try de |Wat we learn|Try it uwself|Unread messages|Put your finger|I'm on |Try it yourself|On the next page|Simple explanation|Let's practice|Today we |Welcome to|Please )\b/i;

let filesChanged = 0;
let linesChanged = 0;
const remain = [];

for (const f of walk("docs/learning-book/nl-NL")) {
  if (f.includes(`${path.sep}english${path.sep}`)) continue;
  const before = fs.readFileSync(f, "utf8");
  const lines = before.split(/\n/);
  let changed = false;
  for (let i = 0; i < lines.length; i++) {
    if (!BAD.test(lines[i]) && !/\b(angle |legs |hypotenuse |volume\?|circumference\?|Tile|solid\?)\b/i.test(lines[i])) {
      continue;
    }
    // skip metadata / code fences lightly
    if (lines[i].includes("title_english") || lines[i].trim().startsWith("```")) continue;
    const next = translateLine(lines[i]);
    if (next !== lines[i]) {
      lines[i] = next;
      changed = true;
      linesChanged++;
    }
  }
  if (changed) {
    fs.writeFileSync(f, lines.join("\n"));
    filesChanged++;
  }
  for (let i = 0; i < lines.length; i++) {
    if (BAD.test(lines[i]) && !lines[i].includes("title_english")) {
      remain.push(`${f.replace(/\\/g, "/")}:${i + 1} | ${lines[i].trim().slice(0, 140)}`);
    }
  }
}

// books/ui.json polish
{
  const f = "content-packs/nl-NL/books/ui.json";
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  j.shell.practiceGeometry = "Hierna oefenen we dit meetkunde-onderwerp";
  j.shell.practiceScience = "Hierna oefenen we dit onderwerp natuur en techniek";
  j.shell.practiceEnglish = "Hierna oefenen we dit Engelse onderwerp";
  j.shell.practiceMath = "Hierna oefenen we dit rekenonderwerp";
  j.shell.audioResume = "Hervatten";
  j.shell.audioPlaying = "Afspelen";
  j.sections.map = {
    "What are we learning?": "Wat gaan we leren?",
    "Simple explanation": "Eenvoudige uitleg",
    "Visual / concrete example": "Voorbeeld",
    Example: "Voorbeeld",
    "Let's solve together": "Laten we het samen oplossen",
    "Try it yourself": "Probeer het zelf",
    "Common mistake — watch out!": "Pas op!",
    "Let's check together": "Laten we het samen controleren",
    "Let's practice!": "Laten we oefenen",
  };
  j.diagramLabels = {
    ...j.diagramLabels,
    rightAngle: "Rechte hoek",
    base: "Basis",
    symmetryLine: "Symmetrieas",
  };
  j.diagramAria = {
    triangle_parts: "Driehoek met zijden en hoekpunten",
    triangle_perimeter: "Omtrek van een driehoek",
    triangle_height: "Hoogte in een driehoek",
    right_triangle: "Rechthoekige driehoek",
    quadrilateral_parts: "Vierhoek met zijden en hoekpunten",
    rectangle_sides: "Rechthoek met lengte en breedte",
    rectangle_diagonal: "Rechthoek met een diagonaal",
    square_sides: "Vierkant met zijden",
    square_perimeter: "Omtrek van een vierkant",
    square_diagonal: "Vierkant met een diagonaal",
    square_area_grid: "Oppervlakte van een vierkant - eenheidsvierkanten",
    parallelogram_height: "Hoogte in een parallellogram",
    parallelogram_area: "Oppervlakte van een parallellogram",
    parallelogram_diagonal: "Parallellogram met een diagonaal",
    trapezoid_height: "Hoogte in een trapezium",
    trapezoid_area: "Oppervlakte van een trapezium",
    right_angle: "Rechte hoek",
    angle_basic: "Hoek met twee stralen",
    symmetry_line: "Symmetrieas",
    parallel_lines: "Evenwijdige lijnen",
    circle_radius: "Cirkel met straal",
    circle_perimeter: "Omtrek",
    circle_area: "Oppervlakte van een cirkel",
    cube_basic: "Kubus",
    box_basic: "Rechthoekig prisma",
    content_diagram: "Voorbeeld",
    place_value_chart: "Plaatswaardetabel",
  };
  fs.writeFileSync(f, JSON.stringify(j, null, 2) + "\n");
}

// chrome leftovers in locales/packs
const CHROME = [
  ["Unread messages - leerkrachten", "Ongelezen berichten - leerkrachten"],
  ["Unread messages - ouders", "Ongelezen berichten - ouders"],
  ["Try de kids world", "Probeer de kinderwereld"],
  ["Enter de kids world", "Ga naar de kinderwereld"],
  ["Leerkracht login / sign up", "Inloggen of registreren als leerkracht"],
  ["Een cijfer hoger gaan:", "Een groep hoger gaan:"],
  ["dit cijfer te selecteren", "deze groep te selecteren"],
  ["het cijfer wijzigt", "de groep wijzigt"],
];
for (const f of [
  ...walk("locales/nl-NL").filter(() => false),
  "locales/nl-NL/ui.json",
  "locales/nl-NL/school.json",
  "content-packs/nl-NL/demo/ui.json",
  "content-packs/nl-NL/learning/burn-down-index.json",
  "content-packs/nl-NL/learning/burn-down/utils__topic-next-step-engine.json",
  "content-packs/nl-NL/global-burn-down/burn-down-index.json",
  "content-packs/nl-NL/global-burn-down/lib__learning__subject-permissions__subject-access.server.json",
]) {
  if (!fs.existsSync(f)) continue;
  let t = fs.readFileSync(f, "utf8");
  const before = t;
  for (const [a, b] of CHROME) t = t.split(a).join(b);
  if (t !== before) fs.writeFileSync(f, t);
}

fs.writeFileSync(
  "scripts/i18n/_nl-NL-book-remain.json",
  JSON.stringify({ filesChanged, linesChanged, remain: remain.length, sample: remain.slice(0, 80) }, null, 2)
);
console.log({ filesChanged, linesChanged, remain: remain.length });
console.log(remain.slice(0, 40).join("\n"));
