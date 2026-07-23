/**
 * Real runtime E2E fixtures — load active generator/bank content; NO manual misconceptionTag injection.
 */

import { mcqCellValue } from "../../../utils/mcq-option-cell.js";
import { classifyAnswerEvidence } from "../classifiers/index.js";
import { applyMcqEvidenceTaggingToQuestion } from "../mcq-option-evidence-tagging.js";
import { normalizeExpectedErrorTags, normalizeToCanonicalTag } from "../taxonomy-tag-normalizer.js";
import { mergeDiagnosticContractIntoParams } from "../../../utils/diagnostic-question-contract.js";
import { TAXONOMY_EVIDENCE_RULES } from "../../../utils/diagnostic-engine-v2/taxonomy-evidence-rules.js";
import { TAXONOMY_BY_ID } from "../../../utils/diagnostic-engine-v2/taxonomy-registry.js";
import { primaryProducerForRule } from "../taxonomy-rule-primary-producers.js";
import { PROBE_KIND_BY_TAG } from "../misconception-adaptive-routing.js";
import { SCIENCE_QUESTIONS } from "../../../data/science-questions.js";
import { generateQuestion as generateGeometryQuestion } from "../../../utils/geometry-question-generator.js";
import { generateQuestion as generateEnglishQuestion } from "../../../utils/english-question-generator.js";
import { GEOMETRY_CONCEPTUAL_ITEMS, renderGeometryConceptualRowToQuestion } from "../../../utils/geometry-conceptual-bank.js";
import { GRAMMAR_POOLS, SENTENCE_POOLS } from "../../../data/english-questions/index.js";

/** @typedef {"numeric"|"mcq_bank"|"mcq_generator"|"typed"} RealScenarioKind */

/**
 * @typedef {Object} RealRuntimeScenario
 * @property {string} ruleId
 * @property {string} subject
 * @property {string} sourceFile
 * @property {string} classifier
 * @property {string} expectedTag
 * @property {string|null} probeKind
 * @property {RealScenarioKind} kind
 * @property {() => { question?: Record<string, unknown>, params?: Record<string, unknown>, userAnswer: unknown, selectedOptionIndex?: number|null, expectedAnswer?: unknown, topic?: string }} loadPositive
 * @property {() => { question?: Record<string, unknown>, params?: Record<string, unknown>, userAnswer: unknown, selectedOptionIndex?: number|null, expectedAnswer?: unknown, topic?: string }} loadNegative
 */

/** @param {Record<string, unknown>} question */
function getMcqChoiceCells(question) {
  return (
    question.params?.mcqOptionCells ||
    question.answers ||
    question.options ||
    question.choices ||
    []
  );
}

/** @param {Record<string, unknown>} question @param {string} tag */
function findWrongOptionIndexWithTag(question, tag) {
  const canonical = normalizeToCanonicalTag(tag);
  const choices = getMcqChoiceCells(question);
  let ci = question.correctIndex ?? question.correct ?? null;
  if (ci == null && question.correctAnswer != null) {
    ci = choices.findIndex((c) => mcqCellValue(c) === mcqCellValue(question.correctAnswer));
    if (ci < 0) ci = null;
  }
  for (let i = 0; i < choices.length; i++) {
    if (ci != null && i === ci) continue;
    const cell = choices[i];
    const df = normalizeToCanonicalTag(
      cell?.distractorFamily || cell?.misconceptionTag || null
    );
    if (df === canonical) return i;
  }
  return null;
}

/** @param {Record<string, unknown>} row @param {string} subject */
function enrichBankMcq(row, subject) {
  const options = row.options || row.answers;
  const q = applyMcqEvidenceTaggingToQuestion({
    ...row,
    subjectId: subject,
    subject,
    type: "mcq",
    questionType: "mcq",
    options,
    answers: options,
    correctIndex: row.correctIndex ?? row.correct ?? 0,
    correctAnswer:
      row.correctAnswer ??
      (Array.isArray(options) ? options[row.correctIndex ?? row.correct ?? 0] : null),
    params: { ...(row.params || {}), subjectId: subject },
  });
  return q;
}

/**
 * @param {unknown[]} rows
 * @param {string} tag
 * @param {string} subject
 */
function findBankRowByTag(rows, tag, subject) {
  const canonical = normalizeToCanonicalTag(tag);
  for (const row of rows) {
    const r = /** @type {Record<string, unknown>} */ (row);
    const tags = normalizeExpectedErrorTags(
      /** @type {unknown[]} */ (
        r.params?.expectedErrorTags ||
          r.params?.expectedErrorTypes ||
          r.expectedErrorTags ||
          r.expectedErrorTypes ||
          []
      )
    );
    if (tags.includes(canonical)) {
      return enrichBankMcq(
        {
          ...r,
          options: r.options || r.answers,
          answers: r.answers || r.options,
        },
        subject
      );
    }
    const diagSkill = String(r.params?.diagnosticSkillId || r.diagnosticSkillId || "");
    if (diagSkill && normalizeToCanonicalTag(diagSkill.replace(/^hist_/, "").replace(/_/g, "_")) === canonical) {
      // fall through — enrichment uses diagnosticSkillId heuristics
    }
    const enriched = enrichBankMcq(
      {
        ...r,
        options: r.options || r.answers,
        answers: r.answers || r.options,
      },
      subject
    );
    if (findWrongOptionIndexWithTag(enriched, canonical) != null) return enriched;
  }
  return null;
}

/**
 * @param {(...args: unknown[]) => Record<string, unknown>} generateFn
 * @param {unknown[]} args
 * @param {string} subject
 * @param {string} tag
 */
function findGeneratorMcq(generateFn, args, subject, tag) {
  for (let i = 0; i < 100; i++) {
    const raw = generateFn(...args);
    if (!raw || raw.emptyPool) continue;
    const q = applyMcqEvidenceTaggingToQuestion({
      ...raw,
      subjectId: subject,
      subject,
      type: "mcq",
      questionType: "mcq",
      options: raw.answers || raw.options,
      answers: raw.answers || raw.options,
      correctIndex: raw.correctIndex ?? raw.correct ?? 0,
    });
    const idx = findWrongOptionIndexWithTag(q, tag);
    if (idx != null) return q;
  }
  return null;
}

/** @param {Record<string, unknown>} q @param {number} wrongIdx */
function mcqPositiveFromQuestion(q, wrongIdx) {
  const choices = q.answers || q.options || q.choices;
  return {
    question: q,
    userAnswer: mcqCellValue(choices[wrongIdx]),
    selectedOptionIndex: wrongIdx,
    expectedAnswer: mcqCellValue(choices[q.correctIndex ?? q.correct ?? 0]),
    topic: String(q.topic || q.operation || ""),
  };
}

/** @param {Record<string, unknown>} q @param {string} tag @param {number} [preferIdx] */
function mcqPositiveByTag(q, tag, preferIdx) {
  const idx = findWrongOptionIndexWithTag(q, tag);
  if (idx == null && preferIdx != null) return mcqPositiveFromQuestion(q, preferIdx);
  if (idx == null) throw new Error(`no wrong option tagged ${tag}`);
  return mcqPositiveFromQuestion(q, idx);
}

/** @param {Record<string, unknown>} q @param {string} [avoidTag] */
function mcqNegativeDifferentTag(q, avoidTag) {
  const canonicalAvoid = normalizeToCanonicalTag(avoidTag || "");
  const choices = getMcqChoiceCells(q);
  let ci = q.correctIndex ?? q.correct ?? null;
  if (ci == null && q.correctAnswer != null) {
    ci = choices.findIndex((c) => mcqCellValue(c) === mcqCellValue(q.correctAnswer));
    if (ci < 0) ci = null;
  }
  for (let i = 0; i < choices.length; i++) {
    if (ci != null && i === ci) continue;
    const df = normalizeToCanonicalTag(choices[i]?.distractorFamily || choices[i]?.misconceptionTag);
    if (canonicalAvoid && df === canonicalAvoid) continue;
    if (df && df !== "unknown" && df !== "generic_proximity") {
      return mcqPositiveFromQuestion(q, i);
    }
  }
  for (let i = 0; i < choices.length; i++) {
    if (ci != null && i === ci) continue;
    const df = normalizeToCanonicalTag(choices[i]?.distractorFamily || choices[i]?.misconceptionTag);
    if (!canonicalAvoid || df !== canonicalAvoid) {
      return mcqPositiveFromQuestion(q, i);
    }
  }
  return mcqPositiveFromQuestion(q, ci === 0 ? 1 : 0);
}

/** @type {Record<string, { subject: string, sourceFile: string, classifier: string, kind: RealScenarioKind, numeric?: Record<string, unknown>, bank?: () => Record<string, unknown>|null, generator?: { fn: Function, args: unknown[], topic?: string }, typed?: Record<string, unknown> }>} */
const RULE_LOADERS = {
  "M-01": {
    subject: "math",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: { params: { kind: "place_digit", a: 350 }, userAnswer: 351, expectedAnswer: 350, negativeUserAnswer: 999 },
  },
  "M-02": {
    subject: "math",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: { params: { kind: "add_vertical", a: 47, b: 38 }, userAnswer: 75, expectedAnswer: 85, negativeUserAnswer: 999 },
  },
  "M-03": {
    subject: "math",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: { params: { kind: "mul", a: 5, b: 7 }, userAnswer: 30, expectedAnswer: 35, negativeUserAnswer: 999 },
  },
  "M-04": {
    subject: "math",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: {
      params: { kind: "frac_compare" },
      userAnswer: "2/3",
      expectedAnswer: "1/3",
      negativeUserAnswer: "9/9",
    },
  },
  "M-05": {
    subject: "math",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: {
      params: { kind: "frac_add", n1: 1, den1: 3, n2: 1, den2: 4 },
      userAnswer: "2/7",
      expectedAnswer: "7/12",
      negativeUserAnswer: "2/12",
    },
  },
  "M-06": {
    subject: "math",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: { params: { kind: "dec_round", places: 1 }, userAnswer: 3.2, expectedAnswer: 3.14, negativeUserAnswer: 9.9 },
  },
  "M-07": {
    subject: "math",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: {
      params: { kind: "wp_unit_length", a: 3, factor: 100 },
      userAnswer: 3,
      expectedAnswer: 300,
      negativeUserAnswer: 999,
    },
  },
  "M-08": {
    subject: "math",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: {
      params: { kind: "add_three", a: 33002, b: 34898, c: 9782 },
      userAnswer: 67900,
      expectedAnswer: 101782,
      negativeUserAnswer: 999,
    },
  },
  "M-09": {
    subject: "math",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: {
      params: { kind: "sub_two", a: 33000, b: 34898 },
      userAnswer: 67898,
      expectedAnswer: -1898,
      negativeUserAnswer: 999,
    },
  },
  "M-10": {
    subject: "math",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: {
      params: { kind: "wp_add", a: 12, b: 8 },
      userAnswer: 96,
      expectedAnswer: 20,
      negativeUserAnswer: 999,
    },
  },
  "G-06": {
    subject: "geometry",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: {
      params: { kind: "rect_area", a: 2, b: 3 },
      userAnswer: 10,
      expectedAnswer: 6,
      negativeUserAnswer: 999,
    },
  },
  "G-08": {
    subject: "geometry",
    sourceFile: "lib/learning/classifiers/math-numeric-classifier.js",
    classifier: "math-numeric-classifier",
    kind: "numeric",
    numeric: {
      params: { kind: "tri_area", a: 6, b: 4 },
      userAnswer: 24,
      expectedAnswer: 12,
      negativeUserAnswer: 999,
    },
  },
  "E-07": {
    subject: "english",
    sourceFile: "lib/learning/classifiers/english-typed-classifier.js",
    classifier: "english-typed-classifier",
    kind: "typed",
    typed: {
      params: { patternFamily: "spelling" },
      userAnswer: "helo",
      expectedAnswer: "hello",
      negativeUserAnswer: "xyz",
    },
  },
};

/** @param {string} ruleId @param {string} tag */
function buildMcqBankLoader(ruleId, tag, subject, sourceFile, rows, extraFilter) {
  RULE_LOADERS[ruleId] = {
    subject,
    sourceFile,
    classifier: "mcq-distractor-classifier",
    kind: "mcq_bank",
    bank: () => {
      if (extraFilter) return extraFilter();
      return findBankRowByTag(rows, tag, subject);
    },
  };
}

buildMcqBankLoader("S-01", "concept_confusion", "science", "data/science-questions.js", SCIENCE_QUESTIONS);
buildMcqBankLoader("S-02", "variable_control_error", "science", "data/science-questions.js", SCIENCE_QUESTIONS);
buildMcqBankLoader("S-03", "body_system_confusion", "science", "data/science-questions.js", SCIENCE_QUESTIONS);
buildMcqBankLoader("S-04", "material_property_error", "science", "data/science-questions.js", SCIENCE_QUESTIONS, () => {
  const row = SCIENCE_QUESTIONS.find((r) => r.topic === "materials");
  if (!row) return null;
  return enrichBankMcq({ ...row, options: row.options, params: { ...row.params, kind: "materials" } }, "science");
});
buildMcqBankLoader("S-05", "physical_chemical_confusion", "science", "data/science-questions.js", SCIENCE_QUESTIONS, () => {
  const row = SCIENCE_QUESTIONS.find((r) => r.topic === "matter" || r.topic === "states_of_matter");
  if (!row) return null;
  return enrichBankMcq({ ...row, options: row.options, params: { ...row.params, kind: row.topic } }, "science");
});
buildMcqBankLoader("S-06", "planet_confusion", "science", "data/science-questions.js", SCIENCE_QUESTIONS, () => {
  const row = SCIENCE_QUESTIONS.find((r) => r.topic === "earth_space");
  if (!row) return null;
  return enrichBankMcq({ ...row, options: row.options, params: { ...row.params, kind: "earth_space" } }, "science");
});
buildMcqBankLoader("S-07", "ecosystem_confusion", "science", "data/science-questions.js", SCIENCE_QUESTIONS);
buildMcqBankLoader("S-08", "animal_classification_error", "science", "data/science-questions.js", SCIENCE_QUESTIONS);

/** Generator-backed MCQ rules */
const GENERATOR_MCQ = [
  ["G-01", "geometry", "shape_property_confusion", generateGeometryQuestion, [{ max: 10 }, "shapes", "g4"]],
  ["G-02", "geometry", "angle_range_error", generateGeometryQuestion, [{ max: 10 }, "angles", "g5"]],
  ["G-03", "geometry", "area_formula_error", generateGeometryQuestion, [{ max: 10 }, "area", "g5"]],
  ["G-04", "geometry", "transformation_error", generateGeometryQuestion, [{ max: 10 }, "rotation", "g5"]],
  ["G-05", "geometry", "volume_formula_error", generateGeometryQuestion, [{ max: 10 }, "volume", "g5"]],
  ["G-07", "geometry", "symmetry_error", generateGeometryQuestion, [{ max: 10 }, "symmetry", "g4"]],
  ["E-01", "english", "vocabulary_meaning_error", generateEnglishQuestion, [{ max: 5 }, "vocabulary", "g3"]],
  ["E-02", "english", "grammar_error", generateEnglishQuestion, [{ max: 5 }, "grammar", "g3"]],
  ["E-03", "english", "translation_error", generateEnglishQuestion, [{ max: 5 }, "translation", "g3"]],
  ["E-04", "english", "preposition_error", generateEnglishQuestion, [{ max: 5 }, "prepositions", "g4"]],
  ["E-05", "english", "phrasal_verb_error", generateEnglishQuestion, [{ max: 5 }, "phrasal_verbs", "g5"]],
  ["E-06", "english", "sentence_structure_error", generateEnglishQuestion, [{ max: 5 }, "sentences", "g4"]],
  ["E-08", "english", "listening_comprehension_error", generateEnglishQuestion, [{ max: 5 }, "phonics", "g1"]],
];

for (const [ruleId, subject, tag, fn, args] of GENERATOR_MCQ) {
  if (!RULE_LOADERS[ruleId]?.bank) {
    RULE_LOADERS[ruleId] = {
      subject,
      sourceFile: `utils/${subject === "geometry" ? "geometry" : "english"}-question-generator.js`,
      classifier: "mcq-distractor-classifier",
      kind: "mcq_generator",
      generator: { fn, args, tag },
      bank: () => findGeneratorMcq(fn, args, subject, tag),
    };
  }
}

/** Explicit real-bank overrides for rules where generator sampling is unstable. */
Object.assign(RULE_LOADERS, {
  "G-04": {
    subject: "geometry",
    sourceFile: "utils/geometry-conceptual-bank.js",
    classifier: "mcq-distractor-classifier",
    kind: "mcq_bank",
    bank: () => {
      const row = GEOMETRY_CONCEPTUAL_ITEMS.find(
        (r) => r.kind === "concept_transform" && r.distractorFamily === "transform_confusion"
      );
      if (!row) return null;
      const q = renderGeometryConceptualRowToQuestion(row, {
        gradeKey: "g2",
        levelKey: "easy",
        topic: "transformations",
      });
      const answers = q.answers || q.options || [];
      const correctIndex = answers.findIndex(
        (a) => mcqCellValue(a) === mcqCellValue(q.correctAnswer ?? row.correct)
      );
      const baseParams = { ...(q.params || {}) };
      delete baseParams.distractorFamily;
      return applyMcqEvidenceTaggingToQuestion({
        ...q,
        subjectId: "geometry",
        type: "mcq",
        options: answers,
        answers,
        correctIndex: correctIndex >= 0 ? correctIndex : 0,
        correctAnswer: q.correctAnswer ?? row.correct,
        params: {
          ...baseParams,
          kind: "transformations",
          expectedErrorTags: ["transformation_error", "symmetry_error", "shape_property_confusion"],
        },
      });
    },
  },
  "E-02": {
    subject: "english",
    sourceFile: "data/english-questions/grammar-pools.js",
    classifier: "mcq-distractor-classifier",
    kind: "mcq_bank",
    bank: () => {
      const pool = GRAMMAR_POOLS?.be_basic || Object.values(GRAMMAR_POOLS || {})[0];
      const row = Array.isArray(pool) ? pool[0] : null;
      if (!row) return null;
      const answers = row.options || row.answers;
      const correctIndex = answers.findIndex((a) => String(a) === String(row.correct));
      return enrichBankMcq(
        {
          question: row.question,
          answers,
          correctIndex: correctIndex >= 0 ? correctIndex : 0,
          correctAnswer: row.correct,
          topic: "grammar",
          params: {
            kind: "grammar",
            patternFamily: row.patternFamily,
            expectedErrorTags: ["grammar_error", "grammar_pattern_error", "tense_error"],
          },
        },
        "english"
      );
    },
  },
  "E-06": {
    subject: "english",
    sourceFile: "data/english-questions/sentence-pools.js",
    classifier: "mcq-distractor-classifier",
    kind: "mcq_bank",
    bank: () => {
      const poolKey = Object.keys(SENTENCE_POOLS || {})[0];
      const row = poolKey ? SENTENCE_POOLS[poolKey]?.[0] : null;
      if (!row) return null;
      const answers = row.options || row.answers;
      const correctIndex = answers.findIndex((a) => String(a) === String(row.correct));
      return enrichBankMcq(
        {
          question: row.question,
          answers,
          correctIndex: correctIndex >= 0 ? correctIndex : 0,
          correctAnswer: row.correct,
          topic: "sentences",
          params: { kind: "sentences", expectedErrorTags: ["sentence_structure_error", "grammar_error"] },
        },
        "english"
      );
    },
  },
  "S-05": {
    subject: "science",
    sourceFile: "data/science-questions.js",
    classifier: "mcq-distractor-classifier",
    kind: "mcq_bank",
    bank: () => {
      const row = SCIENCE_QUESTIONS.find((r) => r.id === "materials_1" || r.topic === "materials");
      if (!row) return null;
      return enrichBankMcq(
        { ...row, options: row.options, params: { ...row.params, kind: "states_of_matter" } },
        "science"
      );
    },
  },
  "S-08": {
    subject: "science",
    sourceFile: "data/science-questions.js",
    classifier: "mcq-distractor-classifier",
    kind: "mcq_bank",
    bank: () => {
      const row = SCIENCE_QUESTIONS.find((r) =>
        String(r.params?.patternFamily || "").includes("animals_classification")
      );
      if (!row) return null;
      return enrichBankMcq(
        { ...row, options: row.options, params: { ...row.params, kind: "animals" } },
        "science"
      );
    },
  },
});

/** @param {string} ruleId */
function expectedTagForRule(ruleId) {
  const rule = TAXONOMY_EVIDENCE_RULES[ruleId];
  const primary = primaryProducerForRule(ruleId);
  return normalizeToCanonicalTag(primary?.tag || rule?.requiredTags?.[0] || "") || "";
}

/** @returns {RealRuntimeScenario[]} */
export function buildRealRuntimeScenarios() {
  return Object.keys(TAXONOMY_EVIDENCE_RULES).map((ruleId) => {
    const loader = RULE_LOADERS[ruleId];
    const expectedTag = expectedTagForRule(ruleId);
    const probeKind = PROBE_KIND_BY_TAG[expectedTag] || primaryProducerForRule(ruleId)?.probeKind || null;

    if (!loader) {
      throw new Error(`missing real runtime loader for ${ruleId}`);
    }

    if (loader.kind === "numeric" || loader.kind === "typed") {
      const cfg = loader.numeric || loader.typed;
      return {
        ruleId,
        subject: loader.subject,
        sourceFile: loader.sourceFile,
        classifier: loader.classifier,
        expectedTag,
        probeKind,
        kind: loader.kind,
        loadPositive: () => ({
          params: cfg.params,
          userAnswer: cfg.userAnswer,
          expectedAnswer: cfg.expectedAnswer,
          topic: String(cfg.params?.kind || ""),
        }),
        loadNegative: () => ({
          params: cfg.params,
          userAnswer: cfg.negativeUserAnswer,
          expectedAnswer: cfg.expectedAnswer,
          topic: String(cfg.params?.kind || ""),
        }),
      };
    }

    return {
      ruleId,
      subject: loader.subject,
      sourceFile: loader.sourceFile,
      classifier: loader.classifier,
      expectedTag,
      probeKind,
      kind: loader.kind,
      loadPositive: () => {
        const q = loader.bank?.();
        if (!q) throw new Error(`${ruleId}: no bank/generator question for ${expectedTag}`);
        return mcqPositiveByTag(q, expectedTag);
      },
      loadNegative: () => {
        const q = loader.bank?.();
        if (!q) throw new Error(`${ruleId}: no bank question for negative`);
        return mcqNegativeDifferentTag(q, expectedTag);
      },
    };
  });
}

/** @param {RealRuntimeScenario} scenario */
export function classifyRealRuntimeScenario(scenario, positive = true) {
  const payload = positive ? scenario.loadPositive() : scenario.loadNegative();
  const questionType =
    scenario.kind === "mcq_bank" || scenario.kind === "mcq_generator" ? "mcq" : scenario.kind === "typed" ? "open" : "numeric";

  return classifyAnswerEvidence({
    subject: scenario.subject,
    topic: payload.topic,
    question: payload.question || { questionType, params: payload.params },
    params: payload.params || payload.question?.params,
    userAnswer: payload.userAnswer,
    expectedAnswer: payload.expectedAnswer,
    selectedOptionIndex: payload.selectedOptionIndex ?? null,
    isCorrect: false,
  });
}

export const REAL_RUNTIME_SCENARIOS = buildRealRuntimeScenarios();
