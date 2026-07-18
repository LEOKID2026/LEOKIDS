/**
 * Grade 4 English Learning Book — internal TOC registry.
 * Content files: docs/learning-book/english/g4/drafts/{pageId}.md
 */

import { createSequencedBookExports } from "./learning-book-sequence.js";
/** @typedef {{ id: string, titleKey: string, pages: string[] }} EnglishG4Batch */

/** @type {EnglishG4Batch[]} */
const ENGLISH_G4_BOOK_BATCHES_RAW = [
  {
    "id": "a",
    "titleKey": "english.g4.a",
    "pages": [
      "vocab_animals",
      "vocab_body",
      "vocab_emotions",
      "vocab_family",
      "vocab_food",
      "vocab_school",
      "vocab_sports",
      "vocab_weather"
    ]
  },
  {
    "id": "b",
    "titleKey": "english.g4.b",
    "pages": [
      "vocab_community",
      "vocab_environment",
      "vocab_travel"
    ]
  },
  {
    "id": "c",
    "titleKey": "english.g4.c",
    "pages": [
      "grammar_present_simple",
      "grammar_simple_continuous",
      "grammar_quantifiers"
    ]
  },
  {
    "id": "d",
    "titleKey": "english.g4.d",
    "pages": [
      "sentence_descriptive",
      "sentence_routine",
      "sentence_narrative"
    ]
  },
  {
    "id": "e",
    "titleKey": "english.g4.e",
    "pages": [
      "translation_hobbies",
      "translation_community"
    ]
  }
];


const _ENGLISH_G4_SEQUENCE = createSequencedBookExports("english", "g4", ENGLISH_G4_BOOK_BATCHES_RAW);
export const ENGLISH_G4_PAGE_ORDER = _ENGLISH_G4_SEQUENCE.pageOrder;
export const ENGLISH_G4_BOOK_BATCHES = _ENGLISH_G4_SEQUENCE.batches;

/**
 * @param {string} pageId
 * @returns {{ prev: string | null, next: string | null, index: number }}
 */
export function getEnglishG4PageNeighbors(pageId) {
  return _ENGLISH_G4_SEQUENCE.getPageNeighbors(pageId);
}

export function isValidEnglishG4PageId(pageId) {
  return _ENGLISH_G4_SEQUENCE.isValidPageId(pageId);
}

export const ENGLISH_G4_BOOK_META = Object.freeze({
  subject: "english",
  grade: "g4",
  routeBase: "/student/learning/book/english/g4",
  bookTitleKey: "english.g4.bookTitle",
  gradeShortLabel: "Grade",
  draftsDir: "docs/learning-book/english/g4/drafts",
});

