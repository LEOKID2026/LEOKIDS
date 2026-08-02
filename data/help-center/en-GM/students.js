/**
 * The Gambia (en-GM) sparse Help overlays for students —
 * Grade chrome; instructional pupil wording; account login stays Student (en base).
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Choose a subject and grade",
    keywords: ["subject", "grade"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "your grade",
        text: "Choose a subject from the list. Activities will match your grade.",
      },
    ],
  },
  "student-home-overview": {
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
