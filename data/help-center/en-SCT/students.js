/**
 * Scotland (en-SCT) sparse Help overlays for students —
 * Year → primary year on top of en-GB Help.
 * textIncludes matches en-GB runtime article text.
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
