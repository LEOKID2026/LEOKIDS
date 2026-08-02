/**
 * Rwanda (en-RW) sparse Help overlays for students —
 * Grade → primary year; instructional learner chrome; account login stays Student (en base).
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Choose a subject and primary year",
    keywords: ["subject", "primary year"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "your grade",
        text: "Choose a subject from the list. Activities will match your primary year.",
      },
    ],
  },
  "student-home-tour": {
    keywords: ["home", "learner"],
    blockPatches: [
      {
        kind: "screenshot",
        altIncludes: "Student home page",
        alt: "Learner home page with subject cards",
        caption: "Learner home page with subject cards",
      },
    ],
  },
};
