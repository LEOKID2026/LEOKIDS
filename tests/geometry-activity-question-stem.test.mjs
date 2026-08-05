import test from "node:test";
import assert from "node:assert/strict";
import { stripQuestionSetForStudent } from "../lib/classroom-activities/classroom-activities-shared.server.js";
import {
  GEOMETRY_ELEMENTARY_FORBIDDEN_STEM_RE,
  formatTriangleAnglesKnownTwoStem,
  geometryElementaryStemHasForbiddenTerms,
  sanitizeGeometryActivityQuestionStem,
} from "../utils/geometry-activity-question-stem.js";
import { generateActivityQuestionSetClient } from "../lib/classroom-activities/generate-activity-questions-client.js";

const FROZEN_TRIANGLE_STEM =
  "   -      57°+67° -    .";

test("sanitizeGeometryActivityQuestionStem rewrites algebra-of-angles prefix", () => {
  const out = sanitizeGeometryActivityQuestionStem(FROZEN_TRIANGLE_STEM, {
    kind: "triangle_angles",
    topic: "angles",
  });
  assert.ok(!/algebra/i.test(out));
  assert.equal(out, formatTriangleAnglesKnownTwoStem(57, 67));
});

test("sanitizeGeometryActivityQuestionStem rewrites equation-style triangle prompt", () => {
  const out = sanitizeGeometryActivityQuestionStem(
    "Angle equation: 57° + 67° + ? = 180° - find the missing angle?",
    { kind: "triangle_angles", topic: "angles" }
  );
  assert.ok(!/equation/i.test(out));
  assert.equal(out, formatTriangleAnglesKnownTwoStem(57, 67));
});

test("stripQuestionSetForStudent sanitizes stored geometry triangle stems", () => {
  const [item] = stripQuestionSetForStudent(
    [
      {
        question: FROZEN_TRIANGLE_STEM,
        correctAnswer: "56",
        choices: ["56", "57", "67", "123"],
        subject: "geometry",
        topic: "angles",
        params: { kind: "triangle_angles", angle1: 57, angle2: 67, angle3: 56 },
      },
    ],
    "guided_practice"
  );
  assert.ok(item?.question);
  assert.ok(!geometryElementaryStemHasForbiddenTerms(item.question));
  assert.equal(item.question, formatTriangleAnglesKnownTwoStem(57, 67));
});

test("newly generated geometry angles items use elementary wording", async () => {
  const qs = await generateActivityQuestionSetClient({
    subject: "geometry",
    gradeLevel: "g4",
    topic: "angles",
    difficulty: "medium",
    count: 8,
  });
  assert.ok(qs.length >= 5);
  const triangleItems = qs.filter((item) => item.params?.kind === "triangle_angles");
  assert.ok(triangleItems.length >= 1, "expected at least one triangle_angles item");
  for (const item of qs) {
    assert.ok(item.question);
    assert.ok(
      !geometryElementaryStemHasForbiddenTerms(item.question),
      `forbidden term in: ${item.question}`
    );
  }
  for (const item of triangleItems) {
    assert.match(
      item.question,
      /||| | | 180°| || | /,
      `unexpected stem shape: ${item.question}`
    );
  }
});

test("forbidden-term regex documents blocked elementary geometry jargon", () => {
  assert.match("  ", GEOMETRY_ELEMENTARY_FORBIDDEN_STEM_RE);
  assert.match(" ", GEOMETRY_ELEMENTARY_FORBIDDEN_STEM_RE);
  assert.doesNotMatch("  ", GEOMETRY_ELEMENTARY_FORBIDDEN_STEM_RE);
});
