/**
 * Northern Ireland (en-NIR) sparse Help overlays for students —
 * school-year Year → primary year only.
 * Merged onto en-GB Help (matchers target post–en-GB copy).
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Choose a subject and primary year",
    keywords: ["subject", "primary year"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "match your year",
        text: "Choose a subject from the list. Activities will match your primary year.",
      },
    ],
  },
};
