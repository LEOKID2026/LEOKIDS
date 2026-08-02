/**
 * Liberia (en-LR) sparse Help overlays for parents —
 * Grade 1–6 / primary school students; American English; English-medium framing.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "elementary learners in grades 1–6",
        text:
          "Leo Kids is a learning space for primary school students in Liberia’s English-medium Grades 1–6, with practice in math, geometry, English, and science, plus games and progress reports for parents. Grade 1–2, Grade 3–4, and Grade 5–6 are LEO KIDS practice and display groupings, not Liberia’s official school structure.",
      },
    ],
  },
};
