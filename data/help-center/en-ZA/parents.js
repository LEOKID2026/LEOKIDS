/**
 * South Africa (en-ZA) sparse Help overlays for parents —
 * elementary → primary school; Math → Maths. Grade labels stay Grade 1–6.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "elementary learners in grades 1–6",
        text:
          "Leo Kids is a learning space for primary school learners in grades 1–6, with practice in maths, geometry, English, and science, plus games and progress reports for parents.",
      },
    ],
  },
};
