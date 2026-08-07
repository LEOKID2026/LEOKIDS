/**
 * Morocco (ar-MA) sparse Help overlays for students —
 * السنة terminology on top of ar-001 Help.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "اختيار المادة والسنة",
    keywords: ["مادة", "سنة"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "ستتناسب الأنشطة مع صفّك",
        text: "اختر مادة من القائمة. ستتناسب الأنشطة مع سنتك الدراسية.",
      },
    ],
  },
};
