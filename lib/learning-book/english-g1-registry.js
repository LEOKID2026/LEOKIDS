/**
 * Grade 1 English Learning Book — internal TOC registry.
 * Content files: docs/learning-book/english/g1/drafts/{pageId}.md
 */

import { createSequencedBookExports } from "./learning-book-sequence.js";
/** @typedef {{ id: string, titleHe: string, pages: string[] }} EnglishG1Batch */

/** @type {EnglishG1Batch[]} */
const ENGLISH_G1_BOOK_BATCHES_RAW = [
  {
    id: "phonics-a",
    title: "Uppercase Letters A–Z and more", titleHe: "Uppercase Letters A–Z and more",
    pages: [
      "letters_upper",
      "letters_lower",
      "letters_match",
      "letter_names",
    ],
  },
  {
    id: "phonics-b",
    title: "Letter Sounds and more", titleHe: "Letter Sounds and more",
    pages: [
      "phonics_sounds",
      "phonics_first_sound",
    ],
  },
  {
    id: "phonics-c",
    title: "Classroom Words and more", titleHe: "Classroom Words and more",
    pages: [
      "classroom_words",
      "first_words_simple",
      "first_words_cvc",
    ],
  },
  {
    id: "phonics-d",
    title: "Picture and Word and more", titleHe: "Picture and Word and more",
    pages: [
      "picture_word_match",
      "listening_classroom",
      "listening_commands",
    ],
  },
  {
    "id": "a",
    "titleHe": "",
    "pages": [
      "vocab_colors",
      "vocab_numbers",
      "vocab_family"
    ]
  },
  {
    "id": "b",
    "titleHe": "",
    "pages": [
      "vocab_animals",
      "vocab_emotions",
      "vocab_actions",
      "vocab_school"
    ]
  },
  {
    "id": "c",
    "titleHe": "",
    "pages": [
      "grammar_be",
      "sentence_base",
      "translation_classroom"
    ]
  }
];


const _ENGLISH_G1_SEQUENCE = createSequencedBookExports("english", "g1", ENGLISH_G1_BOOK_BATCHES_RAW);
export const ENGLISH_G1_PAGE_ORDER = _ENGLISH_G1_SEQUENCE.pageOrder;
export const ENGLISH_G1_BOOK_BATCHES = _ENGLISH_G1_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getEnglishG1PageNeighbors(pageId) {
  return _ENGLISH_G1_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidEnglishG1PageId(pageId) {
  return _ENGLISH_G1_SEQUENCE.isValidPageId(pageId);
}

export const ENGLISH_G1_BOOK_META = Object.freeze({
  subject: "english",
  grade: "g1",
  routeBase: "/student/learning/book/english/g1",
  bookTitle: "English — Grade 1", bookTitleHe: "English — Grade 1",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/english/g1/drafts",
});

