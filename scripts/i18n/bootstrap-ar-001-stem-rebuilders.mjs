/**
 * Bootstrap utils/learning-content-ar-001/{math,geometry}.js from English rebuilders.
 * Protects ${...} placeholders; translates instructional English to ar-001.
 *
 * Run: node scripts/i18n/bootstrap-ar-001-stem-rebuilders.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const OUT_DIR = path.join(ROOT, "utils/learning-content-ar-001");
const CACHE_PATH = path.join(__dirname, "_mt-cache-ar-001-stems.json");

const EXACT = {
  Sunday: "domingo",
  Monday: "segunda-feira",
  Tuesday: "terça-feira",
  Wednesday: "quarta-feira",
  Thursday: "quinta-feira",
  Friday: "sexta-feira",
  Saturday: "sábado",
  Yes: "Sim",
  No: "Não",
  yes: "sim",
  no: "não",
  prime: "primo",
  composite: "composto",
  Prime: "Primo",
  Composite: "Composto",
  even: "par",
  odd: "ímpar",
  Even: "Par",
  Odd: "Ímpar",
  items: "itens",
  apples: "maçãs",
  balls: "bolas",
  stickers: "adesivos",
  books: "livros",
  pencils: "lápis",
  chairs: "cadeiras",
  cards: "cartas",
  boxes: "caixas",
  coins: "moedas",
  "Solve.": "Resolva.",
  Solve: "Resolva",
};

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
  } catch {
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), "utf8");
}

function protectPlaceholders(s) {
  /** @type {string[]} */
  const ph = [];
  const text = String(s).replace(/\$\{([^}]+)\}/g, (_, expr) => {
    ph.push(expr);
    return `⟦${ph.length - 1}⟧`;
  });
  return { text, ph };
}

function restorePlaceholders(s, ph) {
  return String(s).replace(/⟦\s*(\d+)\s*⟧/g, (_, i) => `\${${ph[Number(i)]}}`);
}

async function mt(text) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

async function translateInstruction(en, cache) {
  if (Object.prototype.hasOwnProperty.call(EXACT, en)) return EXACT[en];
  if (!/[A-Za-z]/.test(en)) return en;
  if (cache[en]) return cache[en];
  const { text, ph } = protectPlaceholders(en);
  try {
    let out = await mt(text);
    out = restorePlaceholders(out, ph);
    // BR post-fixes
    out = out
      .replace(/\btelemóvel\b/gi, "celular")
      .replace(/\bautocarro\b/gi, "ônibus")
      .replace(/\bficheiro\b/gi, "arquivo")
      .replace(/\becrã\b/gi, "tela")
      .replace(/\bdólares\b/gi, "dólares")
      .replace(/\bresiduo\b/gi, "resto")
      .replace(/\bresiduo\b/gi, "resto");
    cache[en] = out;
    return out;
  } catch (err) {
    console.warn("MT fail:", en.slice(0, 60), err.message);
    return en;
  }
}

/**
 * Translate string / template literal contents in JS source, leave code intact.
 * @param {string} src
 * @param {Record<string,string>} cache
 */
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
          // keep interpolation expression as-is; translate adjacent text chunks later via whole template
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
      // Translate the whole template content except ${}
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
      // Only translate likely UI/instruction strings
      if (
        inner.length >= 3 &&
        /[A-Za-z]/.test(inner) &&
        !inner.includes("/") &&
        !inner.includes(".") &&
        !/^(math|geometry|easy|medium|hard|g\d|wp_|ns_|frac_|fm_|dec_|est_|pc_|power_|cmp|round|scale_|addition|subtraction|multiplication|division|compare|divisibility|prime_composite|powers|estimation|percentages|ratio|scale|sequences|word_problems)$/.test(
          inner,
        ) &&
        !/^[a-z_]+$/.test(inner) // code identifiers
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
      .replace(/rebuildMathStemEn/g, "rebuildMathStemAr001")
      .replace(/applyMathLevelPresentationEn/g, "applyMathLevelPresentationAr001")
      .replace(/localizeMathQuestionEn/g, "localizeMathQuestionAr001")
      .replace(/OBJECTS_EN/g, "OBJECTS_PT")
      .replace(/WEEKDAYS_EN/g, "WEEKDAYS_PT")
      .replace(/OP_SYMBOL_EN/g, "OP_SYMBOL_PT")
      .replace(/Global English/g, "Modern Standard Arabic (ar-001)")
      .replace(/What is \$\{a\}/g, "Quanto é ${a}");
  } else {
    out = out
      .replace(/rebuildGeometryStemEn/g, "rebuildGeometryStemAr001")
      .replace(/localizeGeometryQuestionEn/g, "localizeGeometryQuestionAr001")
      .replace(/GEOMETRY_EN_LABEL_OPTIONS/g, "GEOMETRY_PT_LABEL_OPTIONS")
      .replace(/GEOMETRY_SOLID_NAMES_EN/g, "GEOMETRY_SOLID_NAMES_PT")
      .replace(/resolveRegisteredContentPack\("en"/g, 'resolveRegisteredContentPack("ar-001"')
      .replace(/"Solve\."/g, '"Resolva."')
      .replace(/Solve\./g, "Resolva.");
  }
  // Header comment
  out =
    `/**\n * Modern Standard Arabic (ar-001) rebuilders for ${subject} question stems.\n` +
    ` * English is the authority; params/numbers/operators unchanged.\n` +
    ` * Generated by scripts/i18n/bootstrap-ar-001-stem-rebuilders.mjs — review instructional copy.\n */\n` +
    out.replace(/^\/\*\*[\s\S]*?\*\/\n/, "");
  return out;
}

async function processFile(relIn, relOut, subject) {
  const srcPath = path.join(ROOT, relIn);
  const outPath = path.join(ROOT, relOut);
  const cache = loadCache();
  console.log("Processing", relIn);
  let src = fs.readFileSync(srcPath, "utf8");
  src = renameExports(src, subject);
  src = await translateJsStrings(src, cache);
  saveCache(cache);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, src, "utf8");
  console.log("Wrote", relOut);
}

async function main() {
  await processFile(
    "utils/learning-content-en/math.js",
    "utils/learning-content-ar-001/math.js",
    "math",
  );
  await processFile(
    "utils/learning-content-en/geometry.js",
    "utils/learning-content-ar-001/geometry.js",
    "geometry",
  );

  const index = `import { localizeMathQuestionAr001 } from "./math.js";
import { localizeGeometryQuestionAr001 } from "./geometry.js";

/**
 * Apply Modern Standard Arabic (ar-001) display layer for subjects with native stem rebuilders.
 * @param {Record<string, unknown>} question
 * @param {string} subject
 */
export function applyAr001DisplayLayer(question, subject) {
  switch (String(subject || "").toLowerCase()) {
    case "math":
      return localizeMathQuestionAr001(question);
    case "geometry":
      return localizeGeometryQuestionAr001(question);
    default:
      return question;
  }
}

export { localizeMathQuestionAr001, localizeGeometryQuestionAr001 };
export { rebuildMathStemAr001 } from "./math.js";
export { rebuildGeometryStemAr001 } from "./geometry.js";
`;
  fs.writeFileSync(path.join(OUT_DIR, "index.js"), index, "utf8");
  console.log("Wrote index.js");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
