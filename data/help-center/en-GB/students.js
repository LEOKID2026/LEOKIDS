/**
 * England (en-GB) sparse Help overlays for students — school-year Grade→Year only.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Choose a subject and year",
    keywords: ["subject", "year"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "match your grade",
        text: "Choose a subject from the list. Activities will match your year.",
      },
    ],
  },
};
