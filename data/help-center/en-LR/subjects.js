/**
 * Liberia (en-LR) sparse Help overlays for subjects —
 * Grade 1–6 bands; Math (American); practice as verb and noun.
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
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Math practice for Grade 1–6 — what children learn and how to practice.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  geometry: {
    summary:
      "Geometry practice for Grade 1–6 — what children learn and how to practice.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  english: {
    summary:
      "English practice for Grade 1–6 — what children learn and how to practice.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Science practice for Grade 1–6 — what children learn and how to practice.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
