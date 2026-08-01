/**
 * Australia (en-AU) sparse Help overlays for subjects — Year labels + maths subject name.
 * English educational vocabulary content is not altered.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "grades 1 through 6",
      text:
        "Practice is designed for children in years 1 through 6, matched to year level.",
    },
    {
      kind: "paragraph",
      textIncludes: "Choose a grade and level",
      text:
        "Choose a year and level, answer questions, and get an explanation after each answer.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    title: "Maths guide",
    summary:
      "Maths practice for years 1–6 — what children learn and how to practice.",
    keywords: ["Maths", "subject", "practice"],
    ...SUBJECT_SHARED_OVERLAY,
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Addition, subtraction, multiplication, and division",
          "Fractions and decimals (upper years)",
          "Word problems",
        ],
      },
      {
        kind: "screenshot",
        altIncludes: "Math practice screen",
        alt: "Maths practice screen",
      },
      {
        kind: "screenshot",
        altIncludes: "Explanation for a Math question",
        alt: "Explanation for a Maths question",
      },
    ],
  },
  geometry: {
    summary:
      "Geometry practice for years 1–6 — what children learn and how to practice.",
    ...SUBJECT_SHARED_OVERLAY,
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Area and perimeter",
          "Angles and shapes",
          "Pythagoras (advanced years)",
        ],
      },
    ],
  },
  english: {
    summary:
      "English practice for years 1–6 — what children learn and how to practice.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Science practice for years 1–6 — what children learn and how to practice.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
