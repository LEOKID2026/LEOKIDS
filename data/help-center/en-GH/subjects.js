/**
 * Ghana (en-GH) sparse Help overlays for subjects —
 * Grade → Basic 1–6 / basic level; Math → Maths; practise (verb) / practice (noun).
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "grades 1 through 6, matched to grade level",
      text:
        "Practice is designed for children in Basic 1 through Basic 6, matched to basic level.",
    },
    {
      kind: "paragraph",
      textIncludes: "Choose a grade and level",
      text:
        "Choose a basic level and difficulty, answer questions, and get an explanation after each answer.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    title: "Maths guide",
    summary:
      "Maths practice for Basic 1–6 — what children learn and how to practise.",
    keywords: ["Maths", "subject", "practice"],
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Addition, subtraction, multiplication, and division",
          "Fractions and decimals (Upper Primary)",
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
      "Geometry practice for Basic 1–6 — what children learn and how to practise.",
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Area and perimeter",
          "Angles and shapes",
          "Pythagoras (Upper Primary)",
        ],
      },
    ],
  },
  english: {
    summary:
      "English practice for Basic 1–6 — what children learn and how to practise.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Science practice for Basic 1–6 — what children learn and how to practise.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
