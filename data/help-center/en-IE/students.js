/**
 * Ireland (en-IE) sparse Help overlays for students — school-year grade → class only.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Choose a subject and class",
    keywords: ["subject", "class"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "match your grade",
        text: "Choose a subject from the list. Activities will match your class.",
      },
    ],
  },
};
