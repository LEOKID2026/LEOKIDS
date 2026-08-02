/**
 * India (en-IN) sparse Help overlays for subjects —
 * Grade → Class 1–6 and Math → Maths. Verb form: practise. Noun form: practice.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "grades 1 through 6, matched to grade level",
      text:
        "Practice is designed for school students in Class 1 through Class 6, matched to class level.",
    },
    {
      kind: "paragraph",
      textIncludes: "Choose a grade and level",
      text:
        "Choose a class and difficulty, answer questions, and get an explanation after each answer.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    title: "Maths guide",
    summary:
      "Maths practice for Classes 1–6 — what children learn and how to practise.",
    keywords: ["Maths", "subject", "practice"],
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Addition, subtraction, multiplication, and division",
          "Fractions and decimals (Classes 5–6 / upper-primary)",
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
      "Geometry practice for Classes 1–6 — what children learn and how to practise.",
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Area and perimeter",
          "Angles and shapes",
          "Pythagoras (Classes 5–6)",
        ],
      },
    ],
  },
  english: {
    summary:
      "English practice for Classes 1–6 — what children learn and how to practise.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Science practice for Classes 1–6 — what children learn and how to practise.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
