/**
 * English G1/G2 practice runtime quality guards.
 * Run: node --test tests/learning/lower-grade-practice-runtime-quality.test.mjs
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  countRuntimeEligiblePhonicsItems,
  getRuntimeEligiblePhonicsPool,
} from "../../data/english-questions/index.js";
import { generateQuestion as generateEnglishQuestion } from "../../utils/english-question-generator.js";
import { sanitizeQuestionForStudentDisplay } from "../../utils/student-question-stem-sanitizer.js";
import { resolveStudentQuestionDisplayParts } from "../../utils/student-question-display.js";
import {
  collectChildVisibleSurfaces,
  hasInternalChildFacingLabel,
  hasMcqCopyAnswerLeak,
  hasValidLowerGradePracticeAudio,
  isEnglishPhonicsCopyLeakRow,
  isG1G2RuntimePracticeEligible,
} from "../../utils/lower-grade-practice-runtime-quality.js";

const INTERNAL_FORBIDDEN = [/משפט\s+\d+/u, /בחנה.{0,8}פונולוגית/u];
const BROKEN_SLASH_PROMPT = /\/\s+'\s|קרא\s+\/\s+'/u;

function visibleTextFromQuestion(q) {
  const parts = resolveStudentQuestionDisplayParts({
    question: q.question,
    questionLabel: q.questionLabel,
    exerciseText: q.exerciseText,
  });
  return [parts.leadText, parts.bodyText, q.question, q.exerciseText]
    .filter((s) => typeof s === "string" && s.trim())
    .join("\n");
}

function buildEnglishPhonicsRuntime(gradeKey, pageId, seq = 1) {
  return generateEnglishQuestion(1, "phonics", gradeKey, null, "easy", {
    forceKind: pageId,
    forceSkillId: `english:phonics:${gradeKey}:${pageId}`,
    _runtimeQualityRetry: seq,
  });
}

describe("lower-grade practice runtime quality", () => {
  it("filters English early_word_reading copy-leak rows from runtime pool", () => {
    const counts = countRuntimeEligiblePhonicsItems();
    assert.ok(counts.g1 > 0, "g1 pool should not be empty");
    assert.ok(counts.g2 > 0, "g2 pool should not be empty");
    assert.equal(counts.total, counts.g1 + counts.g2);

    for (const gradeKey of ["g1", "g2"]) {
      const pool = getRuntimeEligiblePhonicsPool(gradeKey);
      for (const row of pool) {
        assert.equal(
          isEnglishPhonicsCopyLeakRow(row),
          false,
          `${row.id} must not copy-leak`
        );
      }
    }
  });

  it("English G1/G2 phonics runtime samples pass quality guards", () => {
    const pagesByGrade = {
      g1: ["letters_upper", "letters_lower", "letters_match", "letter_names"],
      g2: ["letters_review", "letters_order", "sound_letter_match", "phonics_sounds_review"],
    };

    for (const gradeKey of ["g1", "g2"]) {
      let built = 0;
      const positions = new Set();
      for (let i = 0; i < 48; i += 1) {
        const pageId = pagesByGrade[gradeKey][i % pagesByGrade[gradeKey].length];
        if (getRuntimeEligiblePhonicsPool(gradeKey, pageId).length === 0) continue;

        const q = buildEnglishPhonicsRuntime(gradeKey, pageId, i);
        assert.equal(q.topic, "phonics");
        assert.equal(
          isG1G2RuntimePracticeEligible(q, { gradeKey, subject: "english" }),
          true
        );
        assert.equal(hasMcqCopyAnswerLeak(q), false);
        const visible = visibleTextFromQuestion(q);
        for (const re of INTERNAL_FORBIDDEN) {
          assert.equal(re.test(visible), false);
        }
        assert.equal(BROKEN_SLASH_PROMPT.test(visible), false);
        assert.equal(hasValidLowerGradePracticeAudio(q), true);
        assert.ok(q.answers?.length >= 4);
        assert.ok(visible.trim().length > 0, "visual text remains");
        positions.add(q.answers.indexOf(q.correctAnswer));
        built += 1;
      }
      assert.ok(built >= 20, `${gradeKey} built ${built}`);
      assert.ok(positions.size >= 2, `${gradeKey} answer positions vary`);
    }
  });

  it("hasInternalChildFacingLabel catches generator suffixes", () => {
    assert.equal(hasInternalChildFacingLabel("קראו · משפט 21"), true);
    assert.equal(hasInternalChildFacingLabel("האזינו ובחרו לפי ההבחנה הפונולוגית"), true);
    assert.equal(hasInternalChildFacingLabel("האזינו ובחרו את התשובה הנכונה"), false);
  });
});
