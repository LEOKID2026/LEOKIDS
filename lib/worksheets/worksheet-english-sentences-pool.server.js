/**
 * English-only sentences pool for Global worksheets.
 * @module lib/worksheets/worksheet-english-sentences-pool.server
 */

import { SENTENCE_POOLS } from "../../data/english-questions/sentence-pools.js";
import { ENGLISH_GRADES } from "../../data/english-curriculum.js";
import { englishPoolItemAllowedWithClassSplit } from "../../utils/grade-gating.js";
import { mergeDiagnosticContractIntoParams } from "../../utils/diagnostic-question-contract.js";

const HEBREW_RE = /[\u0590-\u05FF]/;

const WORKSHEET_SENTENCE_POOL_KEYS = {
  g1: ["base"],
  g2: ["base", "routine"],
  g3: ["routine", "descriptive", "assigned_sentence_mcq"],
  g4: ["descriptive", "narrative", "assigned_sentence_mcq"],
  g5: ["narrative", "advanced", "assigned_sentence_mcq"],
  g6: ["advanced", "assigned_sentence_mcq", "descriptive", "narrative"],
};

/** Supplemental EN templates so thin grades can reach count 20. */
const WORKSHEET_SUPPLEMENTAL_SENTENCES = {
  g5: [
    {
      template: "She ___ already finished the project.",
      correct: "has",
      options: ["has", "have", "had", "having"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: "If it rains tomorrow, we ___ indoors.",
      correct: "will stay",
      options: ["will stay", "stayed", "staying", "stay"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: "They ___ a science fair last week.",
      correct: "organized",
      options: ["organized", "organize", "organizing", "organizes"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: "Please ___ carefully before you answer.",
      correct: "read",
      options: ["read", "reads", "reading", "reader"],
      patternFamily: "sentence_completion",
      difficulty: "easy",
    },
  ],
  g6: [
    {
      template: "Although the problem was complex, the team ___ a clear plan.",
      correct: "created",
      options: ["created", "create", "creating", "creates"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: "By the time we arrived, the presentation ___ already begun.",
      correct: "had",
      options: ["had", "has", "have", "having"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: "Students should ___ evidence before they form an opinion.",
      correct: "examine",
      options: ["examine", "examines", "examining", "examined"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: "If we recycle more, our community ___ cleaner.",
      correct: "becomes",
      options: ["becomes", "become", "becoming", "became"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: "She asked whether we ___ ready to present.",
      correct: "were",
      options: ["were", "was", "are", "be"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: "Technology can help us learn, ___ we use it wisely.",
      correct: "if",
      options: ["if", "unless", "although", "because"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: "The report explains ___ the experiment worked.",
      correct: "why",
      options: ["why", "which", "who", "whose"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: "We must listen carefully ___ we understand the instructions.",
      correct: "so that",
      options: ["so that", "even though", "unless", "as if"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: "After reviewing the data, they ___ their conclusion.",
      correct: "revised",
      options: ["revised", "revise", "revising", "revises"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: "Honest feedback helps writers ___ stronger drafts.",
      correct: "produce",
      options: ["produce", "produces", "producing", "produced"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: "Communities grow stronger when people ___ each other.",
      correct: "support",
      options: ["support", "supports", "supporting", "supported"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: "She prefers asking clear questions ___ guessing the answer.",
      correct: "rather than",
      options: ["rather than", "because of", "as well", "instead from"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: "Before publishing the article, check ___ fact carefully.",
      correct: "every",
      options: ["every", "each of", "any", "some"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: "Learning from mistakes is ___ important part of progress.",
      correct: "an",
      options: ["an", "a", "the", "some"],
      patternFamily: "sentence_completion",
      difficulty: "easy",
    },
    {
      template: "Exploring different cultures teaches respect ___ curiosity.",
      correct: "and",
      options: ["and", "but", "or", "nor"],
      patternFamily: "sentence_completion",
      difficulty: "easy",
    },
    {
      template: "A careful plan makes complex goals easier ___ reach.",
      correct: "to",
      options: ["to", "for", "at", "in"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
  ],
};

/**
 * @param {string} gradeKey
 * @returns {Array<Record<string, unknown>>}
 */
export function listEnglishWorksheetSentencePool(gradeKey) {
  const curriculumKeys = ENGLISH_GRADES[gradeKey]?.topics?.includes("sentences")
    ? WORKSHEET_SENTENCE_POOL_KEYS[gradeKey] || ["routine"]
    : [];
  const allKeys = [
    ...curriculumKeys,
    ...Object.keys(SENTENCE_POOLS).filter((key) => {
      const rows = SENTENCE_POOLS[key] || [];
      return rows.some((item) =>
        englishPoolItemAllowedWithClassSplit("sentence", key, item, gradeKey)
      );
    }),
  ];
  const seen = new Set();
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (const key of allKeys) {
    const rows = SENTENCE_POOLS[key] || [];
    for (const template of rows) {
      if (!englishPoolItemAllowedWithClassSplit("sentence", key, template, gradeKey)) continue;
      const text = `${template.template}|${template.correct}|${template.patternFamily}`;
      if (HEBREW_RE.test(text)) continue;
      if (seen.has(text)) continue;
      seen.add(text);
      out.push({ ...template, poolKey: key });
    }
  }
  for (const template of WORKSHEET_SUPPLEMENTAL_SENTENCES[gradeKey] || []) {
    const text = `${template.template}|${template.correct}|${template.patternFamily}|supp`;
    if (HEBREW_RE.test(text) || seen.has(text)) continue;
    seen.add(text);
    out.push({ ...template, poolKey: "worksheet_supplement" });
  }
  return out;
}

/**
 * @param {Record<string, unknown>} template
 * @param {string} gradeKey
 * @param {string} levelKey
 */
export function englishSentenceItemFromPoolRow(template, gradeKey, levelKey) {
  const question = `Complete the sentence: "${template.template}"`;
  const params = mergeDiagnosticContractIntoParams(
    {
      template: template.template,
      explanation: template.explanation,
      patternFamily: template.patternFamily || "sentence_completion",
      distractorFamily: template.distractorFamily || "same_slot_forms",
      sentenceOptionSet: Array.isArray(template.options) ? template.options : null,
      difficulty: template.difficulty,
      cognitiveLevel: template.cognitiveLevel,
      englishPoolKey: template.poolKey,
      levelKey,
      gradeKey,
    },
    template
  );
  return {
    question,
    correctAnswer: String(template.correct),
    answers: Array.isArray(template.options) ? template.options.map(String) : undefined,
    choices: Array.isArray(template.options) ? template.options.map(String) : undefined,
    answerMode: "choice",
    subject: "english",
    topic: "sentences",
    operation: "sentences",
    gradeLevel: gradeKey,
    params,
  };
}
