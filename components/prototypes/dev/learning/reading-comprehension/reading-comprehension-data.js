/** @typedef {'easy' || 'medium' || 'hard'} DifficultyId */

/**
 * @typedef {Object} ReadingTask
 * @property {string} id
 * @property {string} passage
 * @property {string} question
 * @property {string[]} options
 * @property {number} correctIndex
 */

/** @type {Record<DifficultyId, ReadingTask[]>} */
export const READING_TASKS = {
  easy: [
    {
      id: "e1",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "e2",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "e3",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "e4",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "e5",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "e6",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "e7",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "e8",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "e9",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "e10",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "e11",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "e12",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
  ],
  medium: [
    {
      id: "m1",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "m2",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "m3",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "m4",
      passage: "Text",
      question: "Choose Title",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "m5",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "m6",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "m7",
      passage: "Text",
      question: "Choose Title",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "m8",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "m9",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "m10",
      passage: "Text",
      question: "Choose Title",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "m11",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "m12",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
  ],
  hard: [
    {
      id: "h1",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "h2",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "h3",
      passage: "Text",
      question: "«» ?",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "h4",
      passage: "Text",
      question: "to?",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "h5",
      passage: "Text",
      question: "Choose Title",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "h6",
      passage: "Text",
      question: "Text",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "h7",
      passage: "Text",
      question: "«»?",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "h8",
      passage: "Text",
      question: "to?",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "h9",
      passage: "Text",
      question: "lives to to to?",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "h10",
      passage: "Text",
      question: "to to?",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "h11",
      passage: "Text",
      question: "«»?",
      options: ["Text", "Text", "Text"],
      correctIndex: 0,
    },
    {
      id: "h12",
      passage: "i . .",
      question: "Choose Title",
      options: ["i", "i", "i"],
      correctIndex: 0,
    },
  ],
};

export function readingFeedback(ok) {
  return ok
    ? "!"
    : ".";
}
