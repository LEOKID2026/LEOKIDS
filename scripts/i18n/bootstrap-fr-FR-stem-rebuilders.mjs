/**
 * Bootstrap utils/learning-content-fr-FR/{math,geometry}.js from English rebuilders.
 * Run: node scripts/i18n/bootstrap-fr-FR-stem-rebuilders.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  applyGlossaryHints,
  applySurfaceTone,
  loadCache,
  mtTranslate,
  protectPlaceholders,
  restorePlaceholders,
  saveCache,
} from "./_fr-FR-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "utils/learning-content-fr-FR");
const CACHE_PATH = path.join(__dirname, "_mt-cache-fr-FR-stems.json");

const EXACT = {
  Sunday: "dimanche",
  Monday: "lundi",
  Tuesday: "mardi",
  Wednesday: "mercredi",
  Thursday: "jeudi",
  Friday: "vendredi",
  Saturday: "samedi",
  Yes: "Oui",
  No: "Non",
  yes: "oui",
  no: "non",
  prime: "premier",
  composite: "composé",
  Prime: "Premier",
  Composite: "Composé",
  even: "pair",
  odd: "impair",
  Even: "Pair",
  Odd: "Impair",
  items: "objets",
  apples: "pommes",
  balls: "balles",
  stickers: "autocollants",
  books: "livres",
  pencils: "crayons",
  chairs: "chaises",
  cards: "cartes",
  boxes: "boîtes",
  coins: "pièces",
  "Solve.": "Calcule.",
  Solve: "Calcule",
  dollars: "euros",
  dollar: "euro",
};

async function translateInstruction(en, cache) {
  if (Object.prototype.hasOwnProperty.call(EXACT, en)) return EXACT[en];
  if (!/[A-Za-z]/.test(en)) return en;
  if (cache[en]) return applySurfaceTone(applyGlossaryHints(cache[en]), "child");
  const { text, ph } = protectPlaceholders(en.replace(/\$\{/g, "⟦D").replace(/\}/g, "⟧"));
  // protectPlaceholders only handles {name}; restore ${} via custom path
  const custom = protectPlaceholders(en);
  // Actually use ${} protector from bootstrap pattern
  const ph2 = [];
  const text2 = String(en).replace(/\$\{([^}]+)\}/g, (_, expr) => {
    ph2.push(expr);
    return `⟦${ph2.length - 1}⟧`;
  });
  void text;
  void ph;
  void custom;
  try {
    let out = await mtTranslate(text2);
    out = out.replace(/⟦\s*(\d+)\s*⟧/g, (_, i) => `\${${ph2[Number(i)]}}`);
    out = applyGlossaryHints(out)
      .replace(/\bdollars?\b/gi, "euros")
      .replace(/\bdólares?\b/gi, "euros")
      .replace(/\bdollar\b/gi, "euro");
    out = applySurfaceTone(out, "child");
    cache[en] = out;
    return out;
  } catch (err) {
    console.warn("MT fail:", en.slice(0, 60), err.message);
    return en;
  }
}

async function translateJsStrings(src, cache) {
  /** @type {string[]} */
  const parts = [];
  let i = 0;
  while (i < src.length) {
    const ch = src[i];
    if (ch === "`") {
      let j = i + 1;
      let out = "`";
      while (j < src.length) {
        if (src[j] === "\\") {
          out += src[j] + src[j + 1];
          j += 2;
          continue;
        }
        if (src[j] === "`") {
          out += "`";
          j += 1;
          break;
        }
        if (src[j] === "$" && src[j + 1] === "{") {
          let depth = 1;
          let k = j + 2;
          let expr = "${";
          while (k < src.length && depth > 0) {
            if (src[k] === "{") depth += 1;
            else if (src[k] === "}") depth -= 1;
            expr += src[k];
            k += 1;
          }
          out += expr;
          j = k;
          continue;
        }
        out += src[j];
        j += 1;
      }
      const inner = out.slice(1, -1);
      if (/[A-Za-z]/.test(inner) && !inner.includes("import ") && inner.length < 500) {
        const translated = await translateInstruction(inner, cache);
        parts.push(`\`${translated}\``);
      } else {
        parts.push(out);
      }
      i = j;
      continue;
    }
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      let raw = quote;
      while (j < src.length) {
        if (src[j] === "\\") {
          raw += src[j] + src[j + 1];
          j += 2;
          continue;
        }
        raw += src[j];
        if (src[j] === quote) {
          j += 1;
          break;
        }
        j += 1;
      }
      const inner = raw.slice(1, -1);
      if (
        inner.length >= 3 &&
        /[A-Za-z]/.test(inner) &&
        !inner.includes("/") &&
        !inner.includes(".") &&
        !/^(math|geometry|easy|medium|hard|g\d|wp_|ns_|frac_|fm_|dec_|est_|pc_|power_|cmp|round|scale_|addition|subtraction|multiplication|division|compare|divisibility|prime_composite|powers|estimation|percentages|ratio|scale|sequences|word_problems)$/.test(
          inner,
        ) &&
        !/^[a-z_]+$/.test(inner)
      ) {
        const translated = await translateInstruction(inner, cache);
        parts.push(quote + translated.replace(new RegExp(quote, "g"), "\\" + quote) + quote);
      } else {
        parts.push(raw);
      }
      i = j;
      continue;
    }
    parts.push(ch);
    i += 1;
  }
  return parts.join("");
}

function renameExports(src, subject) {
  let out = src;
  if (subject === "math") {
    out = out
      .replace(/rebuildMathStemEn/g, "rebuildMathStemFrFr")
      .replace(/applyMathLevelPresentationEn/g, "applyMathLevelPresentationFrFr")
      .replace(/localizeMathQuestionEn/g, "localizeMathQuestionFrFr")
      .replace(/OBJECTS_EN/g, "OBJECTS_FR")
      .replace(/WEEKDAYS_EN/g, "WEEKDAYS_FR")
      .replace(/OP_SYMBOL_EN/g, "OP_SYMBOL_FR")
      .replace(/Global English/g, "French France (fr-FR)")
      .replace(/What is \$\{a\}/g, "Combien font ${a}");
  } else {
    out = out
      .replace(/rebuildGeometryStemEn/g, "rebuildGeometryStemFrFr")
      .replace(/localizeGeometryQuestionEn/g, "localizeGeometryQuestionFrFr")
      .replace(/GEOMETRY_EN_LABEL_OPTIONS/g, "GEOMETRY_FR_LABEL_OPTIONS")
      .replace(/GEOMETRY_SOLID_NAMES_EN/g, "GEOMETRY_SOLID_NAMES_FR")
      .replace(/resolveRegisteredContentPack\("en"/g, 'resolveRegisteredContentPack("en"')
      .replace(/"Solve\."/g, '"Calcule."')
      .replace(/Solve\./g, "Calcule.");
  }
  out =
    `/**\n * French France (fr-FR) rebuilders for ${subject} question stems.\n` +
    ` * English is the authority; params/numbers/operators unchanged.\n` +
    ` * Generated by scripts/i18n/bootstrap-fr-FR-stem-rebuilders.mjs — review instructional copy.\n */\n` +
    out.replace(/^\/\*\*[\s\S]*?\*\/\n/, "");
  return out;
}

async function processFile(relIn, relOut, subject) {
  const srcPath = path.join(ROOT, relIn);
  const outPath = path.join(ROOT, relOut);
  const cache = loadCache(CACHE_PATH);
  console.log("Processing", relIn);
  let src = fs.readFileSync(srcPath, "utf8");
  src = renameExports(src, subject);
  src = await translateJsStrings(src, cache);
  saveCache(CACHE_PATH, cache);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, src, "utf8");
  console.log("Wrote", relOut);
}

async function main() {
  void restorePlaceholders;
  await processFile(
    "utils/learning-content-en/math.js",
    "utils/learning-content-fr-FR/math.js",
    "math",
  );
  await processFile(
    "utils/learning-content-en/geometry.js",
    "utils/learning-content-fr-FR/geometry.js",
    "geometry",
  );

  const index = `import { localizeMathQuestionFrFr } from "./math.js";
import { localizeGeometryQuestionFrFr } from "./geometry.js";

/**
 * Apply French France (fr-FR) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyFrFrDisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionFrFr(question);
    case "geometry":
      return localizeGeometryQuestionFrFr(question);
    default:
      return question;
  }
}

export { localizeMathQuestionFrFr, localizeGeometryQuestionFrFr };
export { rebuildMathStemFrFr } from "./math.js";
export { rebuildGeometryStemFrFr } from "./geometry.js";
`;
  fs.writeFileSync(path.join(OUT_DIR, "index.js"), index, "utf8");
  console.log("Wrote index.js");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
