/**
 * Ireland (en-IE) sparse Help overlays for subjects —
 * school-year Grade → First–Sixth Class, Math → Maths.
 * Covers First–Sixth Class only (product's six levels); does not claim full Irish primary ladder coverage.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "grades 1 through 6",
      text:
        "Practice is designed for children in First Class through Sixth Class, matched to class level.",
    },
    {
      kind: "paragraph",
      textIncludes: "Choose a grade and level",
      text:
        "Choose a class and level, answer questions, and get an explanation after each answer.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    title: "Maths guide",
    summary:
      "Maths practice for First–Sixth Class — what children learn and how to practice.",
    keywords: ["Maths", "subject", "practice"],
    ...SUBJECT_SHARED_OVERLAY,
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Addition, subtraction, multiplication, and division",
          "Fractions and decimals (upper classes)",
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
      "Geometry practice for First–Sixth Class — what children learn and how to practice.",
    ...SUBJECT_SHARED_OVERLAY,
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: ["Area and perimeter", "Angles and shapes", "Pythagoras (advanced classes)"],
      },
    ],
  },
  english: {
    summary:
      "English practice for First–Sixth Class — what children learn and how to practice.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Science practice for First–Sixth Class — what children learn and how to practice.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
