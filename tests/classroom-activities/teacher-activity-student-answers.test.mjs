import test from "node:test";
import assert from "node:assert/strict";
import { mapTeacherActivityStudentAnswerDetail } from "../../lib/teacher-server/teacher-activities.server.js";

test("mapTeacherActivityStudentAnswerDetail merges attempts with frozen question set", () => {
  const questionSet = [
    {
      question: " Q1?",
      correctAnswer: "",
      choices: ["", ""],
      subject: "science",
    },
    {
      question: " Q2?",
      correctAnswer: "",
      choices: ["", ""],
      subject: "science",
    },
  ];
  const attempts = [
    {
      question_index: 0,
      selected_answer: "",
      correct_answer: "",
      is_correct: true,
      answered_at: "2026-05-25T12:00:00.000Z",
      question_snapshot: { question: " Q1?", choices: ["", ""], subject: "science" },
    },
    {
      question_index: 1,
      selected_answer: "",
      correct_answer: "",
      is_correct: false,
      answered_at: "2026-05-25T12:01:00.000Z",
      question_snapshot: { question: " Q2?", choices: ["", ""], subject: "science" },
    },
  ];

  const rows = mapTeacherActivityStudentAnswerDetail({
    questionSet,
    attempts,
    questionCount: 2,
  });

  assert.equal(rows.length, 2);
  assert.equal(rows[0].question, " Q1?");
  assert.equal(rows[0].selectedAnswer, "");
  assert.equal(rows[0].correctAnswer, "");
  assert.equal(rows[0].isCorrect, true);
  assert.deepEqual(rows[0].choices, ["", ""]);
  assert.equal(rows[1].isCorrect, false);
  assert.equal(rows[1].selectedAnswer, "");
  assert.equal(rows[1].correctAnswer, "");
});

test("mapTeacherActivityStudentAnswerDetail includes unanswered slots from frozen set", () => {
  const questionSet = [{ question: " 1", correctAnswer: "5", subject: "math" }];
  const rows = mapTeacherActivityStudentAnswerDetail({
    questionSet,
    attempts: [],
    questionCount: 1,
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].selectedAnswer, null);
  assert.equal(rows[0].correctAnswer, "5");
  assert.equal(rows[0].isCorrect, null);
});
