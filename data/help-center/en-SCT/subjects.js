/**
 * Scotland (en-SCT) sparse Help overlays for subjects —
 * Primary 2–Primary 7 on top of en-GB Help (Maths title/screenshots inherited).
 * textIncludes matches en-GB runtime article text.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "Years 1 through 6",
      text:
        "Practice is designed for children in Primary 2 through Primary 7, matched to the child's primary year.",
    },
    {
      kind: "paragraph",
      textIncludes: "Choose a year and level",
      text:
        "Choose a primary year and level, answer questions, and get an explanation after each answer.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Maths practice for Primary 2–7 — what children learn and how to practise.",
    ...SUBJECT_SHARED_OVERLAY,
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Addition, subtraction, multiplication, and division",
          "Fractions and decimals (upper primary years)",
          "Word problems",
        ],
      },
    ],
  },
  geometry: {
    summary:
      "Geometry practice for Primary 2–7 — what children learn and how to practise.",
    ...SUBJECT_SHARED_OVERLAY,
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Area and perimeter",
          "Angles and shapes",
          "Pythagoras (advanced primary years)",
        ],
      },
    ],
  },
  english: {
    summary:
      "English practice for Primary 2–7 — what children learn and how to practise.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Science practice for Primary 2–7 — what children learn and how to practise.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
