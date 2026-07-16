/**
 * English-only translation worksheet pool for Global.
 * Avoids Hebrew glosses from shared TRANSLATION_POOLS on printable worksheets.
 * @module lib/worksheets/worksheet-english-translation-pool.server
 */

import { TRANSLATION_POOLS } from "../../data/english-questions/translation-pools.js";
import { ENGLISH_GRADES } from "../../data/english-curriculum.js";
import { mergeDiagnosticContractIntoParams } from "../../utils/diagnostic-question-contract.js";

const HEBREW_RE = /[\u0590-\u05FF]/;

const WORKSHEET_TRANSLATION_POOL_KEYS = {
  g1: ["classroom"],
  g2: ["classroom", "routines", "phase_b_routines"],
  g3: ["routines", "hobbies", "phase_b_routines", "phase_b_hobbies"],
  g4: ["hobbies", "community", "phase_b_hobbies", "phase_b_community"],
  g5: ["community", "technology", "phase_b_community", "phase_b_technology"],
  g6: ["technology", "global", "global_advanced", "phase_b_technology"],
};

/** Supplemental EN-only paraphrase rows for thin grades (count 20). */
const WORKSHEET_SUPPLEMENTAL_TRANSLATION = {
  g2: [
    "I pack my bag before school",
    "We wash our hands before lunch",
    "She reads a short story every night",
    "They play soccer after class",
    "My friend helps me with homework",
    "We walk to the library together",
    "I water the plants on Sunday",
    "He opens the window in the morning",
  ],
  g3: [
    "I practice the piano after dinner",
    "We collect stamps from different countries",
    "She joins the science club on Wednesdays",
    "They build a model plane at home",
    "I write new words in my notebook",
    "We visit the museum on rainy days",
    "He shares his markers with the class",
    "My sister teaches me a new game",
  ],
  g4: [
    "Our neighborhood organizes a clean-up day",
    "I volunteer at the community garden",
    "They design a poster for the fair",
    "We interview a local firefighter",
    "She maps the safest bike route to school",
    "I compare prices before I buy supplies",
    "The class prepares a welcome kit for new students",
    "We discuss ways to reduce food waste",
  ],
  g5: [
    "Scientists track air quality in the city",
    "I explain how a simple circuit works",
    "We evaluate sources before trusting a claim",
    "She designs an app that reminds students to read",
    "They present a plan to save classroom energy",
    "I summarize the article in my own words",
    "Our team tests which material is strongest",
    "We debate whether homework should be shorter",
  ],
};

/**
 * @param {string} gradeKey
 * @returns {number}
 */
function gradeNum(gradeKey) {
  const n = parseInt(String(gradeKey || "").replace(/\D/g, ""), 10);
  return n >= 1 && n <= 6 ? n : 3;
}

/**
 * @param {string} gradeKey
 * @returns {Array<{ en: string, poolKey: string, patternFamily?: string }>}
 */
export function listEnglishWorksheetTranslationPool(gradeKey) {
  if (!ENGLISH_GRADES[gradeKey]?.topics?.includes("translation")) return [];
  const g = gradeNum(gradeKey);
  const keys = WORKSHEET_TRANSLATION_POOL_KEYS[gradeKey] || ["routines"];
  const seen = new Set();
  /** @type {Array<{ en: string, poolKey: string, patternFamily?: string }>} */
  const out = [];

  for (const key of keys) {
    const rows = TRANSLATION_POOLS[key] || [];
    for (const row of rows) {
      const en = String(row?.en || "").trim();
      if (!en || HEBREW_RE.test(en)) continue;
      const minG = row.minGrade != null ? Number(row.minGrade) : 1;
      const maxG = row.maxGrade != null ? Number(row.maxGrade) : 6;
      if (g < minG || g > maxG) continue;
      if (seen.has(en)) continue;
      seen.add(en);
      out.push({
        en,
        poolKey: key,
        patternFamily: row.patternFamily || "translation_en_rewrite",
      });
    }
  }

  for (const en of WORKSHEET_SUPPLEMENTAL_TRANSLATION[gradeKey] || []) {
    if (!en || HEBREW_RE.test(en) || seen.has(en)) continue;
    seen.add(en);
    out.push({
      en,
      poolKey: "worksheet_supplement",
      patternFamily: "translation_en_rewrite",
    });
  }

  return out;
}

/**
 * Build printable EN-only translation item (rewrite / produce English).
 * @param {{ en: string, poolKey?: string, patternFamily?: string }} row
 * @param {string} gradeKey
 * @param {string} levelKey
 */
export function englishTranslationItemFromPoolRow(row, gradeKey, levelKey) {
  const en = String(row.en || "").trim();
  const distractors = buildEnglishDistractors(en, gradeKey);
  const answers = shuffleStable([en, ...distractors], `${en}|${gradeKey}`);
  const params = mergeDiagnosticContractIntoParams(
    {
      sentence: en,
      direction: "en_rewrite",
      patternFamily: row.patternFamily || "translation_en_rewrite",
      englishPoolKey: row.poolKey,
      levelKey,
      gradeKey,
      answerMode: "choice",
    },
    row
  );
  return {
    question: "Choose the correct English sentence.",
    correctAnswer: en,
    answers,
    choices: answers,
    answerMode: "choice",
    subject: "english",
    topic: "translation",
    operation: "translation",
    gradeLevel: gradeKey,
    params,
  };
}

/**
 * @param {string} en
 * @param {string} gradeKey
 * @returns {string[]}
 */
function buildEnglishDistractors(en, gradeKey) {
  const pool = listEnglishWorksheetTranslationPool(gradeKey)
    .map((r) => r.en)
    .filter((s) => s && s !== en);
  /** @type {string[]} */
  const out = [];
  for (const s of pool) {
    if (out.length >= 3) break;
    if (!out.includes(s)) out.push(s);
  }
  const words = en.split(/\s+/);
  if (out.length < 3 && words.length >= 3) {
    const swapped = [words[1], words[0], ...words.slice(2)].join(" ");
    if (swapped !== en && !out.includes(swapped)) out.push(swapped);
  }
  if (out.length < 3) {
    const dropped = words.slice(0, Math.max(1, words.length - 1)).join(" ");
    if (dropped && dropped !== en && !out.includes(dropped)) out.push(dropped);
  }
  let n = 1;
  while (out.length < 3) {
    const synth = `${en} too`;
    const variant = n === 1 ? synth : `${words.slice().reverse().join(" ")}`;
    if (variant !== en && !out.includes(variant)) out.push(variant);
    n += 1;
    if (n > 5) break;
  }
  return out.slice(0, 3);
}

/**
 * Deterministic shuffle for worksheet stability.
 * @param {string[]} items
 * @param {string} salt
 */
function shuffleStable(items, salt) {
  const arr = items.slice();
  let h = 2166136261;
  for (let i = 0; i < salt.length; i += 1) {
    h ^= salt.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  for (let i = arr.length - 1; i > 0; i -= 1) {
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    const j = Math.abs(h) % (i + 1);
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}
