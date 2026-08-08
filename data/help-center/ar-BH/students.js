/**
 * Bahrain (ar-BH) sparse Help overlays for students —
 * طالب terminology (Bahrain MoE); الصف for academic grade keywords.
 * Physical class group in school systems = الصف الدراسي (not academic الصف alone when both appear).
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
