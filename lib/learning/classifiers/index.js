/**
 * Answer evidence classification layer — dispatches by subject + question type.
 */

import {
  buildAnswerEvidence,
  CLASSIFIER_VERSION,
  EVIDENCE_TYPES,
  extractCanonicalOperands,
} from "../answer-evidence-contract.js";
import { classifyMathNumericAnswer } from "./math-numeric-classifier.js";
import {
  classifyMcqDistractorAnswer,
  resolveSelectedMcqCell,
} from "./mcq-distractor-classifier.js";
import { classifyEnglishTypedAnswer } from "./english-typed-classifier.js";
import { classifyScienceTypedAnswer } from "./science-typed-classifier.js";
import { classifyEnglishAnswer } from "../fuzzy-tolerance-english.js";
import { classifyScienceAnswer } from "../fuzzy-tolerance-science.js";
import { classifyGeometryAnswer, isGeometryNumericKind } from "../fuzzy-tolerance-geometry.js";
import { detectQuestionTypeFromRecord } from "../question-engine-metadata.js";

/** @param {unknown} v */
function pickStr(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  return s || null;
}

/**
 * Classify one answer attempt into the unified evidence contract.
 *
 * @param {object} ctx
 * @param {string} ctx.subject
 * @param {string|null|undefined} [ctx.topic]
 * @param {Record<string, unknown>|null|undefined} [ctx.question]
 * @param {unknown} [ctx.userAnswer]
 * @param {unknown} [ctx.expectedAnswer]
 * @param {boolean} [ctx.isCorrect]
 * @param {number|null|undefined} [ctx.selectedOptionIndex]
 * @param {Record<string, unknown>|null|undefined} [ctx.params]
 * @param {string|null|undefined} [ctx.questionGenerator]
 * @param {string|null|undefined} [ctx.difficulty]
 * @param {string|null|undefined} [ctx.answerId]
 * @param {string|null|undefined} [ctx.timestamp]
 * @param {Record<string, unknown>|null|undefined} [ctx.questionEngine]
 */
export function classifyAnswerEvidence(ctx) {
  const subject = pickStr(ctx.subject) || "unknown";
  const question = ctx.question && typeof ctx.question === "object" ? ctx.question : {};
  const params =
    ctx.params && typeof ctx.params === "object"
      ? ctx.params
      : question.params && typeof question.params === "object"
        ? question.params
        : {};
  const kind = pickStr(params.kind) || pickStr(question.kind);
  const questionType =
    pickStr(ctx.questionEngine?.questionType) || detectQuestionTypeFromRecord(question);
  const userAnswer = ctx.userAnswer;
  const expectedAnswer =
    ctx.expectedAnswer ?? question.correctAnswer ?? ctx.questionEngine?.correctAnswer?.value;

  /** @type {string[]} */
  const candidates = [];
  /** @type {{ tag: string, evidenceType: string, details: object, confidence: number }|null} */
  let hit = null;

  if (ctx.isCorrect !== true) {
    if (questionType === "mcq") {
      const cell = resolveSelectedMcqCell(question, userAnswer, ctx.selectedOptionIndex);
      hit = classifyMcqDistractorAnswer(cell, userAnswer, expectedAnswer);

      // Geometry MCQ: value-based fuzzy-tolerance TEPs when the cell has no family tag.
      if (!hit && subject === "geometry" && kind && isGeometryNumericKind(kind)) {
        const geo = classifyGeometryAnswer({ kind, ...params, userAnswer, expectedAnswer });
        if (geo) {
          hit = {
            tag: geo.tag,
            evidenceType: geo.evidenceType || EVIDENCE_TYPES.DIRECT_EVIDENCE,
            details: geo.details,
            confidence: geo.confidence ?? 0.85,
            ruleId: geo.ruleId,
          };
        }
      }

      // English / Science MCQ: exact fuzzy-tolerance TEPs when the cell is untagged.
      if (!hit && subject === "english") {
        const en = classifyEnglishAnswer({
          kind,
          ...params,
          answers: question.answers || question.options || params.answers || params.options,
          userAnswer,
          expectedAnswer,
        });
        if (en) {
          hit = {
            tag: en.tag,
            evidenceType: en.evidenceType || EVIDENCE_TYPES.DIRECT_EVIDENCE,
            details: en.details,
            confidence: en.confidence ?? 0.85,
            ruleId: en.ruleId,
          };
        }
      }
      if (!hit && subject === "science") {
        const sci = classifyScienceAnswer({
          kind,
          topic: ctx.topic ?? pickStr(question.topic),
          ...params,
          answers: question.answers || question.options || params.answers || params.options,
          userAnswer,
          expectedAnswer,
        });
        if (sci) {
          hit = {
            tag: sci.tag,
            evidenceType: sci.evidenceType || EVIDENCE_TYPES.DIRECT_EVIDENCE,
            details: sci.details,
            confidence: sci.confidence ?? 0.85,
            ruleId: sci.ruleId,
          };
        }
      }
    }

    if (
      !hit &&
      (subject === "math" || subject === "geometry") &&
      (questionType === "numeric" || questionType === "unknown" || questionType === "open")
    ) {
      hit = classifyMathNumericAnswer(userAnswer, expectedAnswer, params, kind);
    }

    if (
      !hit &&
      subject === "english" &&
      (questionType === "open" || questionType === "typed" || questionType === "unknown")
    ) {
      hit = classifyEnglishTypedAnswer(userAnswer, expectedAnswer, params);
    }

    if (
      !hit &&
      subject === "science" &&
      (questionType === "open" || questionType === "typed" || questionType === "unknown")
    ) {
      const sciTyped = classifyScienceTypedAnswer(userAnswer, expectedAnswer, {
        ...params,
        topic: ctx.topic ?? pickStr(question.topic),
      });
      if (sciTyped) {
        hit = {
          tag: sciTyped.tag,
          evidenceType: sciTyped.evidenceType || EVIDENCE_TYPES.DIRECT_EVIDENCE,
          details: sciTyped.details,
          confidence: sciTyped.confidence ?? 0.85,
          ruleId: sciTyped.ruleId,
        };
      }
    }

    if (!hit && pickStr(ctx.questionEngine?.misconceptionTag)) {
      const tag = pickStr(ctx.questionEngine.misconceptionTag);
      if (tag && tag !== "unknown" && tag !== "generic_proximity") {
        hit = {
          tag,
          evidenceType:
            questionType === "mcq" ? EVIDENCE_TYPES.DISTRACTOR_EVIDENCE : EVIDENCE_TYPES.DIRECT_EVIDENCE,
          details: { source: "questionEngine" },
          confidence: 0.8,
        };
      }
    }

    if (!hit && Array.isArray(params.expectedErrorTags)) {
      for (const t of params.expectedErrorTags) {
        const tag = pickStr(t);
        if (tag) candidates.push(tag);
      }
    }
  }

  const detected = hit?.tag ?? null;
  const evidenceType = hit?.evidenceType ?? EVIDENCE_TYPES.UNKNOWN;

  return buildAnswerEvidence({
    subject,
    topic: ctx.topic ?? pickStr(question.topic) ?? pickStr(question.operation),
    subtopic: pickStr(params.subtype) || pickStr(question.subtopic),
    skillId:
      pickStr(ctx.questionEngine?.skillId) ||
      pickStr(params.diagnosticSkillId) ||
      pickStr(question.diagnosticSkillId),
    questionType,
    questionGenerator: ctx.questionGenerator,
    questionVersion: pickStr(question.version),
    canonicalOperands: extractCanonicalOperands(params, kind),
    expectedAnswer,
    userAnswer,
    selectedOptionIndex: ctx.selectedOptionIndex,
    isCorrect: ctx.isCorrect === true,
    difficulty: ctx.difficulty ?? pickStr(ctx.questionEngine?.difficulty),
    misconceptionCandidates: candidates,
    detectedMisconception: detected,
    evidenceType,
    evidenceDetails: hit?.details ?? {},
    confidence: hit?.confidence ?? 0,
    probeRequired: !ctx.isCorrect && !detected && questionType !== "mcq",
    timestamp: ctx.timestamp,
    answerId: ctx.answerId,
    classifierVersion: CLASSIFIER_VERSION,
  });
}

export { classifyMathNumericAnswer } from "./math-numeric-classifier.js";
export { classifyMcqDistractorAnswer } from "./mcq-distractor-classifier.js";
export { classifyEnglishTypedAnswer } from "./english-typed-classifier.js";
