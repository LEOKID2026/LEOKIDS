import test from "node:test";
import assert from "node:assert/strict";
import { formatGradeLevelHe, normalizeGradeLevelToKey } from "../lib/learning-student-defaults.js";
import { GRADES as MATH_GRADES } from "../utils/math-constants.js";
import { GRADES as GEOMETRY_GRADES } from "../utils/geometry-constants.js";
import { generateActivityQuestionSetClient } from "../lib/classroom-activities/generate-activity-questions-client.js";

test("formatGradeLevelHe g3 returns  ", () => {
  assert.equal(formatGradeLevelHe("g3"), " ");
});

test("formatGradeLevelHe for all g1–g6 returns proper Hebrew letters", () => {
  const expected = {
    g1: " ",
    g2: " ",
    g3: " ",
    g4: " ",
    g5: " ",
    g6: " ",
  };
  for (const [key, label] of Object.entries(expected)) {
    assert.equal(formatGradeLevelHe(key), label);
  }
});

test("formatGradeLevelHe grade_3 returns  ", () => {
  assert.equal(formatGradeLevelHe("grade_3"), " ");
});

test("normalizeGradeLevelToKey maps grade_3 to g3 for topic banks", () => {
  assert.equal(normalizeGradeLevelToKey("grade_3"), "g3");
  assert.ok((MATH_GRADES.g3?.operations || []).length > 0);
  assert.ok((GEOMETRY_GRADES.g3?.topics || []).includes("shapes_basic"));
});

test("normalizeGradeLevelToKey maps bare digit 3 to g3 (DB format)", () => {
  assert.equal(normalizeGradeLevelToKey("3"), "g3");
  assert.equal(normalizeGradeLevelToKey("3"), normalizeGradeLevelToKey("g3"));
});

test("server grade gate accepts g3 body against DB grade_level 3", () => {
  const bodyGradeKey = normalizeGradeLevelToKey("g3");
  const classGradeKey = normalizeGradeLevelToKey("3");
  assert.equal(bodyGradeKey, "g3");
  assert.equal(classGradeKey, "g3");
});

test("generator error messages do not contain raw grade keys", async () => {
  await assert.rejects(
    () =>
      generateActivityQuestionSetClient({
        subject: "geometry",
        gradeLevel: "g1",
        topic: "pythagoras",
        difficulty: "easy",
        count: 5,
      }),
    (err) => {
      assert.match(String(err.message), //);
      assert.doesNotMatch(String(err.message), /\bg[1-6]\b/);
      return true;
    }
  );
});
