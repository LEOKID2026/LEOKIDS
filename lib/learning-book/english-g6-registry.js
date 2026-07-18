/**
 * Grade 6 English Learning Book — internal TOC registry.
 * Content files: docs/learning-book/english/g6/drafts/{pageId}.md
 */

import { createSequencedBookExports } from "./learning-book-sequence.js";
/** @typedef {{ id: string, titleKey: string, pages: string[] }} EnglishG6Batch */

/** @type {EnglishG6Batch[]} */
const ENGLISH_G6_BOOK_BATCHES_RAW = [
  {
    "id": "a",
    "titleKey": "english.g6.a",
    "pages": [
      "vocab_animals",
      "vocab_community",
      "vocab_emotions",
      "vocab_environment",
      "vocab_health",
      "vocab_technology",
      "vocab_travel"
    ]
  },
  {
    "id": "b",
    "titleKey": "english.g6.b",
    "pages": [
      "vocab_culture",
      "vocab_global_issues",
      "vocab_history"
    ]
  },
  {
    "id": "c",
    "titleKey": "english.g6.c",
    "pages": [
      "grammar_complex_tenses",
      "grammar_conditionals",
      "grammar_modals",
      "grammar_comparatives"
    ]
  },
  {
    "id": "d",
    "titleKey": "english.g6.d",
    "pages": [
      "sentence_advanced"
    ]
  },
  {
    "id": "e",
    "titleKey": "english.g6.e",
    "pages": [
      "translation_technology",
      "translation_global"
    ]
  }
];


const _ENGLISH_G6_SEQUENCE = createSequencedBookExports("english", "g6", ENGLISH_G6_BOOK_BATCHES_RAW);
export const ENGLISH_G6_PAGE_ORDER = _ENGLISH_G6_SEQUENCE.pageOrder;
export const ENGLISH_G6_BOOK_BATCHES = _ENGLISH_G6_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getEnglishG6PageNeighbors(pageId) {
  return _ENGLISH_G6_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidEnglishG6PageId(pageId) {
  return _ENGLISH_G6_SEQUENCE.isValidPageId(pageId);
}

export const ENGLISH_G6_BOOK_META = Object.freeze({
  subject: "english",
  grade: "g6",
  routeBase: "/student/learning/book/english/g6",
  bookTitleKey: "english.g6.bookTitle",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/english/g6/drafts",
});

