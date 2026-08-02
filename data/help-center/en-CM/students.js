/**
 * Cameroon Anglophone (en-CM) sparse Help overlays for students —
 * Grade → class; instructional pupil chrome; account login stays Student (en base).
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Choose a subject and class",
    keywords: ["subject", "class"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "your grade",
        text: "Choose a subject from the list. Activities will match your class.",
      },
    ],
  },
  "student-home-tour": {
    keywords: ["home", "pupil"],
    blockPatches: [
      {
        kind: "screenshot",
        altIncludes: "Student home page",
        alt: "Pupil home page with subject cards",
        caption: "Pupil home page with subject cards",
      },
    ],
  },
};
