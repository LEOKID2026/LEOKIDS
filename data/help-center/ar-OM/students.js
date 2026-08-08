/**
 * Oman (ar-OM) sparse Help overlays for students —
 * طالب terminology (Oman MoE / official digital systems); الصف for academic grade keywords.
 * Physical class group in school systems = الشعبة (not academic الصف).
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "student-login": {
    blockPatches: [
      {
        kind: "screenshot",
        altIncludes: "تسجيل دخول التلميذ",
        alt: "شاشة تسجيل دخول الطالب",
        caption: "شاشة تسجيل دخول الطالب",
      },
    ],
  },
  "student-home-tour": {
    blockPatches: [
      {
        kind: "screenshot",
        altIncludes: "الصفحة الرئيسية للتلميذ",
        alt: "الصفحة الرئيسية للطالب مع بطاقات المواد",
        caption: "الصفحة الرئيسية للطالب مع بطاقات المواد",
      },
    ],
  },
  "choose-subject-and-grade": {
    keywords: ["مادة", "صف"],
  },
};
