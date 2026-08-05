/**
 * BLOCKER 2 — parent-facing insights/explain paths must use LPD.
 */
import assert from "node:assert/strict";
import {
  buildLearningPatternDecision,
  buildLpdSafeTopicInsightLineHe,
  buildLpdParentInsightLineHe,
  buildLpdSafeTopicExplainSectionsHe,
  findForbiddenParentWords,
  guardParentFacingText,
  lpdParentVisibleFindingFromRow,
  resolveParentExplainRowCopy,
  rowNeedsPracticeFromLpd,
} from "../../utils/learning-pattern-decision/index.js";
import {
  buildParentInsightsFromTopicEngineHe,
  buildTopicEngineInsightLineHe,
} from "../../utils/parent-report-engine-insights.js";

const START = Date.UTC(2026, 3, 1);
const END = Date.UTC(2026, 4, 1);

function lpdRow({ q, c, w, acc, name, bucket = "addition", subjectId = "math", mistakes = [] }) {
  const lpd = buildLearningPatternDecision({
    subjectId,
    topicRowKey: bucket,
    row: { bucketKey: bucket, displayName: name, questions: q, correct: c, wrong: w, accuracy: acc },
    rawMistakes: mistakes,
    startMs: START,
    endMs: END,
  });
  return {
    rowKey: `math_${bucket}`,
    subjectId,
    subjectLabel: "",
    label: name,
    questions: q,
    wrong: w,
    accuracy: acc,
    learningPatternDecision: lpd,
    topicEngineRowSignals: {
      diagnosticType: "knowledge_gap",
      recommendedNextStep: "remediate_same_level",
      doNowHe: "    ",
    },
  };
}

/** A — insight line uses LPD owner copy, not raw engine */
{
  const row = lpdRow({ q: 2, c: 0, w: 2, acc: 0, name: "" });
  const line = buildTopicEngineInsightLineHe(row);
  const finding = lpdParentVisibleFindingFromRow(row);
  const lpdLine = buildLpdSafeTopicInsightLineHe(row);
  assert.equal(line, lpdLine);
  assert.ok(line.includes(""));
  assert.match(line, / : 2/u);
  assert.match(line, /  /u);
  assert.ok(finding.includes(""));
  assert.match(finding, / 2 /u);
  assert.ok(!line.includes(finding), "insight line uses owner LPD copy, not raw parentVisibleFinding");
  assert.ok(!line.includes(" "));
  assert.ok(!line.includes(""));
  assert.equal(findForbiddenParentWords(line).length, 0);
  assert.equal(findForbiddenParentWords(finding).length, 0);
}

/** B — explain row copy guarded + per-topic sections restored */
{
  const row = lpdRow({ q: 2, c: 0, w: 2, acc: 0, name: "" });
  const copy = resolveParentExplainRowCopy(row);
  assert.equal(copy.suppressEngineCopy, true);
  assert.ok(copy.primaryFinding.length > 0);
  assert.equal(findForbiddenParentWords(copy.primaryFinding).length, 0);
  assert.ok(!copy.primaryFinding.includes(" "));
  assert.ok(copy.explainSections);
  assert.match(copy.explainSections.identified, / :/);
  assert.match(copy.explainSections.data, /:/);
  assert.match(copy.explainSections.meaning, /  :/);
  assert.match(copy.explainSections.action, /   :/);
  assert.ok(!copy.explainSections.identified.includes(" "));
}

/** C — short insight ≡ LPD finding text (no engine contradiction) */
{
  const row = lpdRow({ q: 2, c: 0, w: 2, acc: 0, name: "" });
  const insight = buildLpdParentInsightLineHe(row);
  const finding = lpdParentVisibleFindingFromRow(row);
  assert.ok(insight.includes(finding));
  assert.ok(!insight.includes("remediate"));
}

/** D — q=1–2 initial: insight path must not say   (engine bypass blocked) */
{
  const row = lpdRow({ q: 2, c: 0, w: 2, acc: 0, name: "" });
  const line = buildTopicEngineInsightLineHe(row);
  assert.equal(row.learningPatternDecision.findingType, "initial_topic_data");
  assert.ok(!line.includes(" "), line);
  assert.ok(!line.includes("  "), line);
}

/** E — q3_4 factual: no repeated wording in insights */
{
  const row = lpdRow({ q: 3, c: 1, w: 2, acc: 33, name: "" });
  row.learningPatternDecision = buildLearningPatternDecision({
    subjectId: "math",
    topicRowKey: "addition",
    row: { bucketKey: "addition", displayName: "", questions: 3, correct: 1, wrong: 2, accuracy: 33 },
    rawMistakes: [
      { bucketKey: "addition", mode: "practice", isCorrect: false, patternFamily: "pf:same", timestamp: START },
      { bucketKey: "addition", mode: "practice", isCorrect: false, patternFamily: "pf:same", timestamp: START + 1 },
    ],
    startMs: START,
    endMs: END,
  });
  const line = buildTopicEngineInsightLineHe(row);
  assert.ok(!line.includes(" "), line);
  assert.ok(line.includes(" ") || line.includes("") || line.length > 0);
}

/** F — not_practiced: no insight for q=0 topic */
{
  const report = {
    mathOperations: {
      unused: {
        questions: 0,
        correct: 0,
        wrong: 0,
        accuracy: 0,
        displayName: " ",
        learningPatternDecision: buildLearningPatternDecision({
          subjectId: "math",
          topicRowKey: "unused",
          row: { bucketKey: "unused", displayName: " ", questions: 0, correct: 0, wrong: 0, accuracy: 0 },
          rawMistakes: [],
          startMs: START,
          endMs: END,
        }),
      },
    },
  };
  const insights = buildParentInsightsFromTopicEngineHe(report);
  assert.ok(!insights.some((l) => l.includes(" ")));
}

/** guardParentFacingText strips forbidden */
{
  assert.equal(guardParentFacingText(" "), "");
  assert.ok(guardParentFacingText("   2 .").length > 0);
}

/** rowNeedsPracticeFromLpd false at q=1–2 */
{
  const row = lpdRow({ q: 2, c: 0, w: 2, acc: 0, name: "" });
  assert.equal(rowNeedsPracticeFromLpd(row), false);
}

/** G — q>=5 detailed per-topic sections (LPD-safe) */
{
  const mistakes = Array.from({ length: 8 }, (_, i) => ({
    bucketKey: "addition",
    mode: "practice",
    isCorrect: false,
    patternFamily: "pf:same",
    timestamp: START + i * 86_400_000,
  }));
  const row = lpdRow({ q: 12, c: 2, w: 10, acc: 17, name: "", mistakes });
  const sections = buildLpdSafeTopicExplainSectionsHe(row);
  assert.ok(sections);
  assert.match(sections.identified, / :/);
  assert.match(sections.data, /:/);
  assert.match(sections.meaning, /  :/);
  assert.match(sections.action, /   :/);
  assert.match(sections.identified, /|| /u);
  assert.equal(findForbiddenParentWords(JSON.stringify(sections)).length, 0);
  assert.ok(!JSON.stringify(sections).includes(" "));
}

/** H — q=3-4 factual only: no repeated-pattern line, no home action unless allowed */
{
  const row = lpdRow({ q: 3, c: 1, w: 2, acc: 33, name: "" });
  row.learningPatternDecision = buildLearningPatternDecision({
    subjectId: "geometry",
    topicRowKey: "area",
    row: { bucketKey: "area", displayName: "", questions: 3, correct: 1, wrong: 2, accuracy: 33 },
    rawMistakes: [
      { bucketKey: "area", mode: "practice", isCorrect: false, patternFamily: "pf:a", timestamp: START },
      { bucketKey: "area", mode: "practice", isCorrect: false, patternFamily: "pf:b", timestamp: START + 1 },
    ],
    startMs: START,
    endMs: END,
  });
  const sections = buildLpdSafeTopicExplainSectionsHe(row);
  assert.ok(sections);
  assert.equal(sections.pattern, "");
  assert.ok(!sections.identified.includes(" "));
}

/** I — live chart row shape (rowKey only): must still render all section labels */
{
  const row = {
    rowKey: "geometry_area\u0001g4",
    label: " -  ",
    questions: 12,
    accuracy: 45,
    wrong: 6,
    correct: 6,
  };
  const sections = buildLpdSafeTopicExplainSectionsHe(row);
  assert.ok(sections, "chart row should produce LPD sections from rowKey prefix");
  assert.match(sections.identified, / :/);
  assert.match(sections.data, /:/);
  assert.match(sections.meaning, /  :/);
  assert.match(sections.action, /   :/);
  assert.equal(findForbiddenParentWords(JSON.stringify(sections)).length, 0);
  assert.ok(!JSON.stringify(sections).includes(" "));
}

console.log("parent-report-insights-lpd.test.mjs - all passed");
