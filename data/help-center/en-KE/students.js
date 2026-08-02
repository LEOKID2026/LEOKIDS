/**
 * Kenya (en-KE) sparse Help overlays for students —
 * Keep Learner on instructional home guidance; account/login chrome stays Student (en base).
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
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
