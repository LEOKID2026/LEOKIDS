/**
 * Rewrite English question pools for Global:
 * - translation pools: he → meaning.{en, "es-419"}; MCQ Hebrew → EN/ES
 * - grammar/sentence: Hebrew explanations → EN (+ explanationByLocale)
 * - word-lists: Hebrew glosses → English word IDs
 *
 * Run: node scripts/i18n/rewrite-english-question-pools-global.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const CACHE_PATH = path.join(__dirname, "_mt-cache-english-pools-global.json");
const HE_RE = /[\u0590-\u05FF]/;

/** Manual EN glosses for short/formulaic Hebrew explanations (child-friendly). */
const EXPLANATION_HE_TO_EN = {
  " I  -am.": "With I we use am.",
  "You → Do .": "With You we use Do in questions.",
  "    What.": "Ask about a name with What.",
  "   → Where.": "Ask about a place with Where.",
  "    What.": "Ask about a thing with What.",
  "  /  How.": "Ask about feelings or health with How.",
  "    When.": "Ask about time with When.",
  "  /  What.": "Ask about a choice or opinion with What.",
  "  /  When.": "Ask about a time of day with When.",
  "    Who.": "Ask about a person with Who.",
  "  /  How.": "Ask about how or by what means with How.",
  "    What + noun.": "Ask about a feature with What + noun.",
  "    Why.": "Ask about a reason with Why.",
  "    How old.": "Ask about age with How old.",
  "     When.": "Ask about a start time with When.",
  "    Where.": "Ask about a location with Where.",
  "    What.": "Ask about an activity with What.",
  "    How many.": "Ask about a countable amount with How many.",
  "    How much.": "Ask about an uncountable amount with How much.",
  "     What.": "Ask about a school subject with What.",
  "    What.": "Ask about a choice with What.",
  "    Where.": "Ask about a place with Where.",
  "    How.": "Ask about how with How.",
  "    '.": "A common place phrase for grade 3.",
  " → ‎-er‎.": "Comparatives often end with -er.",
  "   .": "Adjectives describe nouns.",
  " .": "This phrase describes a place.",
  "  → under.": "Place phrase → under.",
  " → heavier.": "Comparative → heavier.",
  " → beautiful.": "Adjective → beautiful.",
  " → bigger.": "Comparative → bigger.",
  "  → in.": "Place phrase → in.",
  " → good.": "Adjective → good.",
  " → taller.": "Comparative → taller.",
  "  → on.": "Place phrase → on.",
  " → loud.": "Adjective → loud.",
  "She + ‎-es‎  .": "She takes -es in the present tense.",
  "Tom (he) → goes  ‎-es.": "Tom (he) → goes with -es.",
  "He → goes  ‎-es.": "He → goes with -es.",
  "My father (he) → cooks  ‎-s.": "My father (he) → cooks with -s.",
  "My aunt (she) → cooks  ‎-s.": "My aunt (she) → cooks with -s.",
  "He → cleans  ‎-s.": "He → cleans with -s.",
  "She → rides  ‎-s.": "She → rides with -s.",
  " .": "A completed action in the past.",
  "essential that +  ( ).": "After essential that, use the base verb (subjunctive style).",
  "  Seldom  → did.": "Inversion after Seldom in the past → did.",
};

/** Hand-authored Global MCQ replacements (was Hebrew meaning options). */
const TRANSLATION_MCQ_REPLACEMENTS = {
  translation_mcq_g2_matrix: {
    question: 'Choose the correct meaning: "She has a red bag"',
    options: [
      "Ella tiene un bolso rojo",
      "Ella tiene un bolso azul",
      "Ella ve un bolso verde",
      "Ella olvida el bolso",
    ],
    correct: "Ella tiene un bolso rojo",
    explanation: "She has = ella tiene; red bag = bolso rojo.",
    explanationByLocale: {
      en: "She has = ella tiene; red bag = bolso rojo.",
      "es-419": "She has = ella tiene; red bag = bolso rojo.",
    },
    meaning: {
      en: "She has a red bag",
      "es-419": "Ella tiene un bolso rojo",
    },
  },
  translation_mcq_g3_matrix: {
    question: 'Choose the correct meaning: "We eat lunch at school every day"',
    options: [
      "Comemos el almuerzo en la escuela todos los días",
      "Olvidamos el almuerzo en la escuela",
      "Compramos el almuerzo solo los fines de semana",
      "Nunca comemos en la escuela",
    ],
    correct: "Comemos el almuerzo en la escuela todos los días",
    explanation: "A present routine — every day shows frequency.",
    explanationByLocale: {
      en: "A present routine — every day shows frequency.",
      "es-419": "Es una rutina en presente: every day indica frecuencia.",
    },
    meaning: {
      en: "We eat lunch at school every day",
      "es-419": "Comemos el almuerzo en la escuela todos los días",
    },
  },
  translation_mcq_g4_matrix: {
    question: 'Choose the correct meaning: "Turn off the light when you leave the room"',
    options: [
      "Apaguen la luz cuando salgan de la habitación",
      "Prendan la luz cuando entren a la habitación",
      "Dejen la luz encendida siempre",
      "Cierren la ventana cuando salgan de la habitación",
    ],
    correct: "Apaguen la luz cuando salgan de la habitación",
    explanation: "An instruction — turn off the light when leaving the room.",
    explanationByLocale: {
      en: "An instruction — turn off the light when leaving the room.",
      "es-419": "Es una instrucción: apagar la luz al salir de la habitación.",
    },
    meaning: {
      en: "Turn off the light when you leave the room",
      "es-419": "Apaguen la luz cuando salgan de la habitación",
    },
  },
  translation_mcq_g5_matrix: {
    question: 'Choose the correct meaning: "The teacher explained the new topic slowly"',
    options: [
      "La maestra explicó el tema nuevo despacio",
      "La maestra olvidó el tema nuevo",
      "La maestra corrió rápido sin explicar",
      "Los estudiantes le explicaron el tema a la maestra",
    ],
    correct: "La maestra explicó el tema nuevo despacio",
    explanation: "explained = explicó; slowly = despacio.",
    explanationByLocale: {
      en: "explained = explicó; slowly = despacio.",
      "es-419": "explained = explicó; slowly = despacio.",
    },
    meaning: {
      en: "The teacher explained the new topic slowly",
      "es-419": "La maestra explicó el tema nuevo despacio",
    },
  },
  translation_mcq_g6_matrix: {
    question: 'Choose the correct meaning: "Clean energy can help protect our planet"',
    options: [
      "La energía limpia puede ayudar a proteger nuestro planeta",
      "La energía limpia siempre daña el planeta",
      "El planeta no necesita protección",
      "No podemos proteger el medio ambiente en el futuro",
    ],
    correct: "La energía limpia puede ayudar a proteger nuestro planeta",
    explanation: "clean energy = energía limpia; protect our planet = proteger nuestro planeta.",
    explanationByLocale: {
      en: "clean energy = energía limpia; protect our planet = proteger nuestro planeta.",
      "es-419": "clean energy = energía limpia; protect our planet = proteger nuestro planeta.",
    },
    meaning: {
      en: "Clean energy can help protect our planet",
      "es-419": "La energía limpia puede ayudar a proteger nuestro planeta",
    },
  },
};

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return { enEs: {}, heEn: {} };
  try {
    const raw = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
    return {
      enEs: raw.enEs || {},
      heEn: raw.heEn || {},
    };
  } catch {
    return { enEs: {}, heEn: {} };
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0), "utf8");
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function mtTranslate(text, sl, tl) {
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
    encodeURIComponent(sl) +
    "&tl=" +
    encodeURIComponent(tl) +
    "&dt=t&q=" +
    encodeURIComponent(text);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MT HTTP ${res.status}`);
  const json = await res.json();
  return (json[0] || []).map((x) => x[0]).join("");
}

async function translateEnToEs(text, cache) {
  const key = String(text || "");
  if (!key.trim()) return key;
  if (cache.enEs[key]) return cache.enEs[key];
  let out = await mtTranslate(key, "en", "es");
  out = out
    .replace(/\bvosotros\b/gi, "ustedes")
    .replace(/\bvosotras\b/gi, "ustedes")
    .replace(/\btenéis\b/gi, "tienen")
    .replace(/\bhacéis\b/gi, "hacen");
  cache.enEs[key] = out;
  await sleep(35);
  return out;
}

function heuristicHeToEn(he) {
  let s = String(he || "");
  if (!HE_RE.test(s)) return s;
  if (EXPLANATION_HE_TO_EN[s]) return EXPLANATION_HE_TO_EN[s];
  s = s
    .replace(/ /g, "in the present tense")
    .replace(//g, "in questions")
    .replace(/  /g, "Ask about ")
    .replace(/  /g, "Ask about ")
    .replace(/ /g, "with ")
    .replace(/ /g, "with ")
    .replace(/ -/g, "we use ")
    .replace(/ /g, "Place description")
    .replace(//g, "Comparative")
    .replace(//g, "Adjective")
    .replace(/   \.?/g, "Adjectives describe nouns.")
    .replace(/  '\.?/g, "common for grade 3.")
    .replace(/\u200e/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return s;
}

async function translateHeToEn(text, cache) {
  const key = String(text || "");
  if (!key) return "";
  if (!HE_RE.test(key)) return key;
  if (EXPLANATION_HE_TO_EN[key]) return EXPLANATION_HE_TO_EN[key];
  if (cache.heEn[key]) return cache.heEn[key];

  const heur = heuristicHeToEn(key);
  if (!HE_RE.test(heur)) {
    cache.heEn[key] = heur;
    return heur;
  }

  let out;
  try {
    out = await mtTranslate(key, "he", "en");
    await sleep(35);
  } catch {
    out =
      heur.replace(HE_RE, "").replace(/\s+/g, " ").trim() ||
      "Check the grammar pattern.";
  }
  out = String(out || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!out || HE_RE.test(out)) {
    out = "Check the grammar pattern in the sentence.";
  }
  cache.heEn[key] = out;
  return out;
}

function stringifyExport(exportName, data) {
  return `export const ${exportName} = ${JSON.stringify(data, null, 2)};\n`;
}

async function transformTranslationRow(row, cache) {
  if (row.subtype === "simulator_translation_mcq" || (row.question && !row.en)) {
    const fam = String(row.patternFamily || "");
    const hand = TRANSLATION_MCQ_REPLACEMENTS[fam];
    if (hand) {
      return {
        minGrade: row.minGrade,
        maxGrade: row.maxGrade,
        patternFamily: row.patternFamily,
        question: hand.question,
        options: hand.options,
        correct: hand.correct,
        explanation: hand.explanation,
        explanationByLocale: hand.explanationByLocale,
        meaning: hand.meaning,
        difficulty: row.difficulty,
        cognitiveLevel: row.cognitiveLevel,
        expectedErrorTypes: row.expectedErrorTypes,
        skillId: row.skillId,
        subtype: row.subtype,
      };
    }
    // Fallback: strip Hebrew via MT
    const q = await translateHeToEn(row.question || "", cache);
    const options = [];
    for (const opt of row.options || []) {
      options.push(await translateHeToEn(opt, cache));
    }
    const correct = await translateHeToEn(row.correct || "", cache);
    const explanation = await translateHeToEn(row.explanation || "", cache);
    return {
      ...row,
      question: q.startsWith("What") || q.startsWith("Choose")
        ? q
        : `Choose the correct meaning of the English sentence.`,
      options,
      correct,
      explanation,
      explanationByLocale: {
        en: explanation,
        "es-419": await translateEnToEs(explanation, cache),
      },
    };
  }

  const { he, ...rest } = row;
  const en = String(rest.en || "");
  const meaningEs = await translateEnToEs(en, cache);
  void he;
  return {
    ...rest,
    meaning: {
      en,
      "es-419": meaningEs,
    },
  };
}

/**
 * Deep-clone pool map and optionally drop rows whose patternFamily is in excludeSet.
 * @param {Record<string, object[]>} src
 * @param {Set<string>|null} excludeFamilies
 */
function clonePoolMap(src, excludeFamilies = null) {
  /** @type {Record<string, object[]>} */
  const out = {};
  for (const [bucket, list] of Object.entries(src || {})) {
    const rows = [];
    for (const row of list || []) {
      if (excludeFamilies && excludeFamilies.has(String(row.patternFamily || ""))) {
        continue;
      }
      rows.push(structuredClone(row));
    }
    if (rows.length) out[bucket] = rows;
  }
  return out;
}

function collectPatternFamilies(poolMap) {
  const set = new Set();
  for (const list of Object.values(poolMap || {})) {
    for (const row of list || []) {
      if (row?.patternFamily) set.add(String(row.patternFamily));
    }
  }
  return set;
}

async function rewriteTranslationFile({
  poolMap,
  exportName,
  outRel,
  headerLines,
  footerLines,
  cache,
}) {
  let rows = 0;
  /** @type {Record<string, object[]>} */
  const out = {};
  for (const [bucket, list] of Object.entries(poolMap)) {
    out[bucket] = [];
    for (const row of list) {
      rows += 1;
      out[bucket].push(await transformTranslationRow(row, cache));
    }
  }

  const body =
    headerLines.join("\n") +
    "\n\n" +
    stringifyExport(exportName, out) +
    (footerLines.length ? "\n" + footerLines.join("\n") + "\n" : "");
  fs.writeFileSync(path.join(ROOT, outRel), body, "utf8");
  return rows;
}

async function rewriteExplanationPools({
  poolMap,
  exportName,
  outRel,
  headerLines,
  footerLines,
  cache,
}) {
  let rows = 0;
  let heExpl = 0;
  /** @type {Record<string, object[]>} */
  const out = {};
  for (const [bucket, list] of Object.entries(poolMap)) {
    out[bucket] = [];
    for (const row of list) {
      rows += 1;
      const next = structuredClone(row);
      const rawExpl = typeof next.explanation === "string" ? next.explanation : "";
      let enExpl = rawExpl;
      if (HE_RE.test(rawExpl)) {
        heExpl += 1;
        enExpl = await translateHeToEn(rawExpl, cache);
      }
      next.explanation = enExpl;
      const esExpl = await translateEnToEs(enExpl, cache);
      next.explanationByLocale = {
        en: enExpl,
        "es-419": esExpl,
      };
      out[bucket].push(next);
    }
  }

  const body =
    headerLines.join("\n") +
    "\n\n" +
    stringifyExport(exportName, out) +
    (footerLines.length ? "\n" + footerLines.join("\n") + "\n" : "");
  fs.writeFileSync(path.join(ROOT, outRel), body, "utf8");
  return { rows, heExpl };
}

async function rewriteWordLists() {
  const filePath = path.join(ROOT, "data/english-questions/word-lists.js");
  const mod = await import(pathToFileURL(filePath).href + `?t=${Date.now()}`);
  const src = mod.WORD_LISTS;

  /** @type {Record<string, Record<string, string>>} */
  const out = {};
  let entries = 0;
  for (const [listKey, list] of Object.entries(src)) {
    out[listKey] = {};
    for (const enWord of Object.keys(list)) {
      out[listKey][enWord] = enWord;
      entries += 1;
    }
  }
  const header = [
    "/**",
    " * English word ID catalog for learning pools.",
    " * Values are English (same as keys). Locale meanings live in word-meanings/*.",
    " */",
  ];
  fs.writeFileSync(
    filePath,
    header.join("\n") + "\n\n" + stringifyExport("WORD_LISTS", out),
    "utf8"
  );
  return entries;
}

async function main() {
  const cache = loadCache();
  const stamp = `?t=${Date.now()}`;

  const phaseBMod = await import(
    pathToFileURL(path.join(ROOT, "data/english-questions/translation-pools-phase-b.js")).href +
      stamp
  );
  const trMod = await import(
    pathToFileURL(path.join(ROOT, "data/english-questions/translation-pools.js")).href + stamp
  );
  const phaseBFamilies = collectPatternFamilies(phaseBMod.TRANSLATION_POOLS_PHASE_B);
  const baseTranslation = clonePoolMap(trMod.TRANSLATION_POOLS, phaseBFamilies);

  console.log("Rewriting translation-pools-phase-b.js …");
  const trBRows = await rewriteTranslationFile({
    poolMap: clonePoolMap(phaseBMod.TRANSLATION_POOLS_PHASE_B),
    exportName: "TRANSLATION_POOLS_PHASE_B",
    outRel: "data/english-questions/translation-pools-phase-b.js",
    headerLines: [
      "// Phase B English TRANSLATION_POOLS_PHASE_B — assigned-activity MCQ expansion (do not merge into base pools until wired).",
    ],
    footerLines: [],
    cache,
  });
  console.log("  rows:", trBRows);

  console.log("Rewriting translation-pools.js …");
  const trRows = await rewriteTranslationFile({
    poolMap: baseTranslation,
    exportName: "TRANSLATION_POOLS",
    outRel: "data/english-questions/translation-pools.js",
    headerLines: [
      "// Metadata enrichment (safe pass): difficulty, cognitiveLevel, expectedErrorTypes, skillId (when no diagnostic), subtype (pool bucket when taxonomy-valid), prerequisiteSkillIds (gated). See reports/question-metadata-qa/english-metadata-apply-report.json.",
      'import { TRANSLATION_POOLS_PHASE_B } from "./translation-pools-phase-b.js";',
    ],
    footerLines: [
      "for (const [poolKey, rows] of Object.entries(TRANSLATION_POOLS_PHASE_B)) {",
      "  if (!TRANSLATION_POOLS[poolKey]) TRANSLATION_POOLS[poolKey] = [];",
      "  TRANSLATION_POOLS[poolKey].push(...rows);",
      "}",
    ],
    cache,
  });
  console.log("  rows:", trRows);

  const grammarPhaseB = await import(
    pathToFileURL(path.join(ROOT, "data/english-questions/grammar-pools-phase-b.js")).href + stamp
  );
  const grammarMod = await import(
    pathToFileURL(path.join(ROOT, "data/english-questions/grammar-pools.js")).href + stamp
  );
  const grammarExclude = collectPatternFamilies(grammarPhaseB.GRAMMAR_POOLS_PHASE_B);
  const baseGrammar = clonePoolMap(grammarMod.GRAMMAR_POOLS, grammarExclude);

  console.log("Rewriting grammar-pools.js …");
  const g = await rewriteExplanationPools({
    poolMap: baseGrammar,
    exportName: "GRAMMAR_POOLS",
    outRel: "data/english-questions/grammar-pools.js",
    headerLines: [
      "// Metadata enrichment (safe pass): difficulty, cognitiveLevel, expectedErrorTypes, skillId (when no diagnostic), subtype (pool bucket when taxonomy-valid), prerequisiteSkillIds (gated). See reports/question-metadata-qa/english-metadata-apply-report.json.",
      'import { enrichEnglishGrammarPools } from "../../utils/english-grammar-diagnostic-metadata-enrich.js";',
      'import { GRAMMAR_POOLS_PHASE_B } from "./grammar-pools-phase-b.js";',
    ],
    footerLines: [
      "for (const [poolKey, rows] of Object.entries(GRAMMAR_POOLS_PHASE_B)) {",
      "  if (!GRAMMAR_POOLS[poolKey]) GRAMMAR_POOLS[poolKey] = [];",
      "  GRAMMAR_POOLS[poolKey].push(...rows);",
      "}",
      "",
      "enrichEnglishGrammarPools(GRAMMAR_POOLS);",
    ],
    cache,
  });
  console.log("  rows:", g.rows, "hebrewExplConverted:", g.heExpl);

  const sentencePhaseB = await import(
    pathToFileURL(path.join(ROOT, "data/english-questions/sentence-pools-phase-b.js")).href + stamp
  );
  const sentenceMod = await import(
    pathToFileURL(path.join(ROOT, "data/english-questions/sentence-pools.js")).href + stamp
  );
  const sentenceExclude = collectPatternFamilies(sentencePhaseB.SENTENCE_POOLS_PHASE_B);
  const baseSentence = clonePoolMap(sentenceMod.SENTENCE_POOLS, sentenceExclude);

  console.log("Rewriting sentence-pools.js …");
  const s = await rewriteExplanationPools({
    poolMap: baseSentence,
    exportName: "SENTENCE_POOLS",
    outRel: "data/english-questions/sentence-pools.js",
    headerLines: [
      "// Metadata enrichment (safe pass): difficulty, cognitiveLevel, expectedErrorTypes, skillId (when no diagnostic), subtype (pool bucket when taxonomy-valid), prerequisiteSkillIds (gated). See reports/question-metadata-qa/english-metadata-apply-report.json.",
      'import { SENTENCE_POOLS_PHASE_B } from "./sentence-pools-phase-b.js";',
    ],
    footerLines: [
      "for (const [poolKey, rows] of Object.entries(SENTENCE_POOLS_PHASE_B)) {",
      "  if (!SENTENCE_POOLS[poolKey]) SENTENCE_POOLS[poolKey] = [];",
      "  SENTENCE_POOLS[poolKey].push(...rows);",
      "}",
    ],
    cache,
  });
  console.log("  rows:", s.rows, "hebrewExplConverted:", s.heExpl);

  console.log("Rewriting word-lists.js …");
  const words = await rewriteWordLists();
  console.log("  entries:", words);

  saveCache(cache);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
