import test from "node:test";
import assert from "node:assert/strict";
import {
  maskStudentFullName,
  teacherStudentDisplayName,
} from "../lib/teacher-server/teacher-students.server.js";

test("teacherStudentDisplayName returns full first and last name", () => {
  assert.equal(teacherStudentDisplayName("       "), " ");
});

test("maskStudentFullName still abbreviates for guardian-style surfaces", () => {
  assert.equal(maskStudentFullName(" "), " .");
});

test("teacherStudentDisplayName preserves multi-part names", () => {
  assert.equal(teacherStudentDisplayName("  "), "  ");
});
