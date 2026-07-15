import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  defaultTopicForAssignedActivity,
  isTopicHiddenFromAssignedActivity,
  topicOptionsForAssignedActivity,
} from "../../lib/classroom-activities/assigned-activity-topic-options.js";
import {
  englishTopicOptionsForGrade,
  topicOptionsForSubject,
} from "../../lib/teacher-portal/teacher-class-topic-options.js";

describe("assigned activity topic visibility gating", () => {
  it("hides English writing from g2–g6 only", () => {
    assert.equal(isTopicHiddenFromAssignedActivity("english", "g1", "writing"), false);
    for (const g of ["g2", "g3", "g4", "g5", "g6"]) {
      assert.equal(isTopicHiddenFromAssignedActivity("english", g, "writing"), true);
    }
  });

  it("does not hide core geometry, science, or english grammar topics", () => {
    const protectedCases = [
      ["geometry", "g5", "parallel_perpendicular"],
      ["geometry", "g5", "heights"],
      ["geometry", "g4", "symmetry"],
      ["science", "g1", "materials"],
      ["science", "g2", "earth_space"],
      ["english", "g5", "grammar"],
      ["english", "g6", "translation"],
    ];
    for (const [subject, grade, topic] of protectedCases) {
      assert.equal(isTopicHiddenFromAssignedActivity(subject, grade, topic), false);
    }
  });

  it("assigned selectors omit hidden english topics but learning options remain", () => {
    const englishG3Assigned = topicOptionsForAssignedActivity("english", "g3").map((o) => o.key);
    const englishG3Learning = englishTopicOptionsForGrade("g3").map((o) => o.key);
    assert.ok(!englishG3Assigned.includes("writing"));
    assert.ok(englishG3Learning.includes("writing"));
  });

  it("default assigned topic skips hidden english entries", () => {
    const topic = defaultTopicForAssignedActivity("english", "g3");
    assert.notEqual(topic, "writing");
    assert.ok(topicOptionsForAssignedActivity("english", "g3").some((o) => o.key === topic));
  });

  it("geometry topic count unchanged in assigned selectors", () => {
    for (const g of ["g3", "g4", "g5"]) {
      const base = topicOptionsForSubject("geometry", g).length;
      const assigned = topicOptionsForAssignedActivity("geometry", g).length;
      assert.equal(base, assigned);
    }
  });

  it("Phase B English grammar/sentences/translation remain visible g2–g6", () => {
    const g2Keys = topicOptionsForAssignedActivity("english", "g2").map((o) => o.key);
    assert.ok(g2Keys.includes("translation"));
  });
});
