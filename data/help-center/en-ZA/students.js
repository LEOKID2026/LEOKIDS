/**
 * South Africa (en-ZA) sparse Help overlays for students —
 * Student → Learner in learner-facing login/home chrome only.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "student-login": {
    keywords: ["login", "PIN", "learner"],
    blockPatches: [
      {
        kind: "screenshot",
        altIncludes: "Student login screen",
        alt: "Learner login screen",
        caption: "Learner login screen",
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
