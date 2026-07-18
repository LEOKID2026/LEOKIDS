/**
 * English-only sentences pool for Global worksheets.
 * @module lib/worksheets/worksheet-english-sentences-pool.server
 */

import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
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
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "she_already_finished_the_project"),
      correct: "has",
      options: ["has", "have", "had", "having"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "if_it_rains_tomorrow_we_indoors"),
      correct: "will stay",
      options: ["will stay", "stayed", "staying", "stay"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "they_a_science_fair_last_week"),
      correct: "organized",
      options: ["organized", "organize", "organizing", "organizes"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "please_carefully_before_you_answer"),
      correct: "read",
      options: ["read", "reads", "reading", "reader"],
      patternFamily: "sentence_completion",
      difficulty: "easy",
    },
  ],
  g6: [
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "although_the_problem_was_complex_the_team_a_clear_plan"),
      correct: "created",
      options: ["created", "create", "creating", "creates"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "by_the_time_we_arrived_the_presentation_already_begun"),
      correct: "had",
      options: ["had", "has", "have", "having"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "students_should_evidence_before_they_form_an_opinion"),
      correct: "examine",
      options: ["examine", "examines", "examining", "examined"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "if_we_recycle_more_our_community_cleaner"),
      correct: "becomes",
      options: ["becomes", "become", "becoming", "became"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "she_asked_whether_we_ready_to_present"),
      correct: "were",
      options: ["were", "was", "are", "be"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "technology_can_help_us_learn_we_use_it_wisely"),
      correct: "if",
      options: ["if", "unless", "although", "because"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "the_report_explains_the_experiment_worked"),
      correct: "why",
      options: ["why", "which", "who", "whose"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "we_must_listen_carefully_we_understand_the_instructions"),
      correct: "so that",
      options: ["so that", "even though", "unless", "as if"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "after_reviewing_the_data_they_their_conclusion"),
      correct: "revised",
      options: ["revised", "revise", "revising", "revises"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "honest_feedback_helps_writers_stronger_drafts"),
      correct: "produce",
      options: ["produce", "produces", "producing", "produced"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "communities_grow_stronger_when_people_each_other"),
      correct: "support",
      options: ["support", "supports", "supporting", "supported"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "she_prefers_asking_clear_questions_guessing_the_answer"),
      correct: "rather than",
      options: ["rather than", "because of", "as well", "instead from"],
      patternFamily: "sentence_completion",
      difficulty: "advanced",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "before_publishing_the_article_check_fact_carefully"),
      correct: "every",
      options: ["every", "each of", "any", "some"],
      patternFamily: "sentence_completion",
      difficulty: "medium",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "learning_from_mistakes_is_important_part_of_progress"),
      correct: "an",
      options: ["an", "a", "the", "some"],
      patternFamily: "sentence_completion",
      difficulty: "easy",
    },
    {
      template: globalBurnDownCopy("lib__worksheets__worksheet-english-sentences-pool.server", "exploring_different_cultures_teaches_respect_curiosity"),
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
