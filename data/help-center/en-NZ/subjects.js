/**
 * New Zealand (en-NZ) sparse Help overlays for subjects —
 * school-year Grade → Year and Math → Maths only.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "grades 1 through 6, matched to grade level",
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
      {
        kind: "relatedLinks",
        items: [
          { href: "/learning/math-master", label: "Go to Maths practice" },
          { href: "/learning", label: "Learning hub" },
        ],
      },
    ],
  },
  geometry: {
    summary:
      "Geometry practice for years 1–6 — what children learn and how to practice.",
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: ["Area and perimeter", "Angles and shapes", "Pythagoras (advanced years)"],
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
