/**
 * Rebuild content-packs/es-419/books/registry-titles.json from cleaned EN source
 * with Neutral LatAm Spanish titles (not MT).
 */
import fs from "fs";
import path from "path";

const root = process.cwd();
const enPath = path.join(root, "content-packs/en/books/registry-titles.json");
const outPath = path.join(root, "content-packs/es-419/books/registry-titles.json");

const en = JSON.parse(fs.readFileSync(enPath, "utf8"));

/** Phrase-level glossary for batch/book titles */
const PHRASES = [
  [/Coming soon/gi, "Próximamente"],
  [/Word Problems?/gi, "Problemas verbales"],
  [/Word Problem/gi, "Problema verbal"],
  [/Counting Forward on the Number Line/gi, "Contar hacia adelante en la recta numérica"],
  [/Tens and Ones/gi, "Decenas y unidades"],
  [/Hundreds, Tens, and Ones/gi, "Centenas, decenas y unidades"],
  [/Adding Two Numbers/gi, "Sumar dos números"],
  [/Adding with 0/gi, "Sumar con 0"],
  [/Adding Decimals/gi, "Sumar decimales"],
  [/Adding Decimal Numbers/gi, "Sumar números decimales"],
  [/When Does a Number Divide by 2, 5, and 10\?/gi, "¿Cuándo se divide un número entre 2, 5 y 10?"],
  [/Fractions — What Are They and How Do We Compare\?/gi, "Fracciones — ¿qué son y cómo las comparamos?"],
  [/Addition Equation/gi, "Ecuación de suma"],
  [/Place Value/gi, "Valor posicional"],
  [/Division/gi, "División"],
  [/Powers/gi, "Potencias"],
  [/Simplifying Fractions/gi, "Simplificar fracciones"],
  [/Factors of a Number/gi, "Factores de un número"],
  [/Percent of a Quantity/gi, "Porcentaje de una cantidad"],
  [/A Fraction as Division/gi, "Una fracción como división"],
  [/Ratios/gi, "Razones"],
  [/Getting to Know the Square/gi, "Conociendo el cuadrado"],
  [/Translation and Reflection — Introduction/gi, "Traslación y reflexión — introducción"],
  [/Translation and Reflection — More Practice/gi, "Traslación y reflexión — más práctica"],
  [/Three-Dimensional Solids — Names and Introduction/gi, "Sólidos tridimensionales — nombres e introducción"],
  [/Three-Dimensional Solids/gi, "Sólidos tridimensionales"],
  [/Area of a Square/gi, "Área de un cuadrado"],
  [/Types of Triangles/gi, "Tipos de triángulos"],
  [/Parallel and Perpendicular Lines/gi, "Rectas paralelas y perpendiculares"],
  [/Angles in a Triangle/gi, "Ángulos en un triángulo"],
  [/Rotation in the Plane/gi, "Rotación en el plano"],
  [/Properties of a Square/gi, "Propiedades de un cuadrado"],
  [/Quadrilaterals/gi, "Cuadriláteros"],
  [/Perimeter of a Square/gi, "Perímetro de un cuadrado"],
  [/Diagonal of a Square/gi, "Diagonal de un cuadrado"],
  [/Solids/gi, "Sólidos"],
  [/Height of a Triangle/gi, "Altura de un triángulo"],
  [/Tiling a Plane/gi, "Embaldosar un plano"],
  [/Circumference of a Circle/gi, "Circunferencia de un círculo"],
  [/Pythagorean Theorem/gi, "Teorema de Pitágoras"],
  [/Volume of a Prism/gi, "Volumen de un prisma"],
  [/Volume of a Pyramid/gi, "Volumen de una pirámide"],
  [/Volume of a Cylinder/gi, "Volumen de un cilindro"],
  [/The Human Body/gi, "El cuerpo humano"],
  [/Materials/gi, "Materiales"],
  [/Observation and Investigation/gi, "Observación e investigación"],
  [/A Short Scientific Experiment/gi, "Un experimento científico corto"],
  [/Planning an Experiment/gi, "Planificar un experimento"],
  [/Full Investigation — Documentation/gi, "Investigación completa — documentación"],
  [/Science Project/gi, "Proyecto de ciencias"],
  [/Uppercase Letters A–Z/gi, "Letras mayúsculas A–Z"],
  [/Letter Sounds/gi, "Sonidos de las letras"],
  [/Classroom Words/gi, "Palabras del aula"],
  [/Picture and Word/gi, "Imagen y palabra"],
  [/Review: Letters and Names/gi, "Repaso: letras y nombres"],
  [/English — Grade (\d)/gi, "Inglés — Grado $1"],
  [/Geometry — Grade (\d)/gi, "Geometría — Grado $1"],
  [/Math — Grade (\d)/gi, "Matemáticas — Grado $1"],
  [/Science — Grade (\d)/gi, "Ciencias — Grado $1"],
  [/ and more/gi, " y más"],
];

function translateTitle(enTitle) {
  let t = String(enTitle);
  for (const [re, rep] of PHRASES) t = t.replace(re, rep);
  return t;
}

function walk(node) {
  if (!node || typeof node !== "object") return node;
  if (Array.isArray(node)) return node.map(walk);
  /** @type {Record<string, unknown>} */
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (typeof v === "string" && (k === "title" || k === "bookTitle")) {
      out[k] = translateTitle(v);
    } else if (v && typeof v === "object") {
      out[k] = walk(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

const es = walk(en);
fs.writeFileSync(outPath, JSON.stringify(es, null, 2) + "\n");
console.log(JSON.stringify({ wrote: path.relative(root, outPath) }, null, 2));
