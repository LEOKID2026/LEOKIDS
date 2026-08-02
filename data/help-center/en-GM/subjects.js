/**
 * The Gambia (en-GM) sparse Help overlays for subjects —
 * Lower Basic Grade 1–6; Math → Maths; practise (verb) / practice (noun).
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "grades 1 through 6, matched to grade level",
      text:
        "Practice is designed for children in Grade 1 through Grade 6, matched to grade level.",
    },
    {
      kind: "paragraph",
      textIncludes: "Choose a grade and level",
      text:
        "Choose a grade and difficulty, answer questions, and get an explanation after each answer.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    title: "Maths guide",
    summary:
      "Maths practice for Grade 1–6 — what children learn and how to practise.",
    keywords: ["Maths", "subject", "practice"],
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Addition, subtraction, multiplication, and division",
          "Fractions and decimals (Grade 5–6)",
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
      "Geometry practice for Grade 1–6 — what children learn and how to practise.",
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Area and perimeter",
          "Angles and shapes",
          "Pythagoras (Grade 5–6)",
        ],
      },
    ],
  },
  english: {
    summary:
      "English practice for Grade 1–6 — what children learn and how to practise.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Science practice for Grade 1–6 — what children learn and how to practise.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
