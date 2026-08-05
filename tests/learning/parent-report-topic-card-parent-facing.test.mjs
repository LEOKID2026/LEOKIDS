import assert from "node:assert/strict";
import { getTopicName, normalizeReportTopicBucketKey } from "../../utils/math-report-generator.js";
import { explainPatternHe, explainActionHe } from "../../utils/parent-report-language/parent-report-copy-spec.js";
import { sanitizeParentPatternLabel } from "../../utils/learning-pattern-decision/parent-pattern-label.js";
import {
  PARENT_TOPIC_HOME_ACTION_HEADING_HE,
  parentFacingErrorPatternMeaning,
  resolveParentFacingPatternLabel,
} from "../../utils/learning-pattern-decision/parent-facing-error-pattern.js";
import { buildApprovedTopicCopyHe } from "../../lib/parent-ui/parent-report-approved-copy.js";
import { trendV1DisplayLineHe } from "../../utils/parent-report-topic-trend-v1.js";

{
  const label = resolveParentFacingPatternLabel("procedural_error");
  assert.ok(label.includes(" "));
  assert.ok(!/procedural_error/i.test(label));
  assert.equal(sanitizeParentPatternLabel("procedural_error"), label);
  const patternLine = explainPatternHe("procedural_error");
  assert.ok(patternLine.includes(" :"));
  assert.ok(!/procedural_error/i.test(patternLine));
}

{
  const meaning = parentFacingErrorPatternMeaning("procedural_error");
  assert.ok(meaning.includes(" "));
  const copy = buildApprovedTopicCopyHe(
    {
      label: "",
      questions: 12,
      accuracy: 52,
      learningPatternDecision: {
        topicStatus: "difficulty_repeated",
        findingType: "difficulty_pattern",
        practicedQuestions: 12,
        repeatedMistakePatterns: [{ label: "procedural_error", count: 4 }],
        engineDecisionContract: { detectedPattern: "procedural_error" },
      },
    },
    "g5",
  );
  assert.ok(copy.whatItMeans);
  assert.ok(!/procedural_error/i.test(copy.whatItMeans));
  assert.ok(copy.whatItMeans.includes(""));
}

{
  assert.equal(getTopicName("area::grade:g4"), "");
  assert.equal(getTopicName("volume\u0001g5"), "");
  assert.equal(normalizeReportTopicBucketKey("triangles::grade:g3"), "triangles");
  assert.notEqual(getTopicName("triangles::grade:g3"), "");
  assert.notEqual(getTopicName("triangles::grade:g3"), "");
}

{
  const row = {
    rowKey: "geometry_area",
    label: "",
    questions: 20,
    accuracy: 52,
    trendV1: {
      ok: true,
      direction: "stable",
      parentLineHe: "ignored",
    },
  };
  const trendLine = trendV1DisplayLineHe(row.trendV1);
  assert.ok(trendLine.includes(" :   "));
  const copy = buildApprovedTopicCopyHe(row, "g5");
  assert.ok(copy.title === "" || copy.title.includes(""));
  assert.ok(!/^\s*\s*$/u.test(copy.title));
}

{
  const action = explainActionHe("knowledge_gap", "knowledge_gap", "");
  assert.ok(action.startsWith(`${PARENT_TOPIC_HOME_ACTION_HEADING_HE}:`));
  assert.ok(!action.includes(""));
}

console.log("parent-report-topic-card-parent-facing.test.mjs: ok");
