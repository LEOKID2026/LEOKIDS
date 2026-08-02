/**
 * Kenya (en-KE) sparse Help overlays for subjects —
 * Math → Maths. Verb form: practise. Noun form: practice. Grade wording stays Grade 1–6.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    title: "Maths guide",
    summary:
      "Maths practice for grades 1–6 — what children learn and how to practise.",
    keywords: ["Maths", "subject", "practice"],
    blockPatches: [
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
      "Geometry practice for grades 1–6 — what children learn and how to practise.",
  },
  english: {
    summary:
      "English practice for grades 1–6 — what children learn and how to practise.",
  },
  science: {
    summary:
      "Science practice for grades 1–6 — what children learn and how to practise.",
  },
};
