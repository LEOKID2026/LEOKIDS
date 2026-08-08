/**
 * Kuwait (ar-KW) sparse Help overlays for parents —
 * grades 1–5 = المرحلة الابتدائية; grade 6 = بداية المرحلة المتوسطة;
 * طالب; ولي الأمر; الصف word-form.
 * Base authority: ar-001.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "لمتعلمي المرحلة الابتدائية في الصفوف من 1 إلى 6",
        text:
          "Leo Kids عبارة عن مساحة تعليمية للمتعلّمين في الكويت في الصفوف من الأول إلى السادس — المرحلة الابتدائية (الصف الأول–الخامس) وبداية المرحلة المتوسطة (الصف السادس) — مع التدريب على الرياضيات والهندسة واللغة الإنجليزية والعلوم، بالإضافة إلى الألعاب وتقارير التقدم لأولياء الأمور.",
      },
    ],
  },
  "add-students": {
    keywords: ["طفل", "صف", "إضافة"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "واختر الصف (من 1 إلى 6)",
        text:
          "أدخل اسم الطفل واختر الصف (من الصف الأول إلى الصف السادس). بعد الحفظ، ستظهر تفاصيل تسجيل الدخول للطفل.",
      },
      {
        kind: "list",
        items: [
          "الصف الأول — grade_1",
          "الصف الثاني — grade_2",
          "حتى الصف السادس — grade_6",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "تغيير الاسم أو الصف، وحذفها مع التأكيد.",
  },
  "mobile-and-offline": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "تسجيل دخول التلميذ",
        text:
          "الموقع يعمل على الشاشات الصغيرة. يعمل تسجيل دخول الطالب وأولياء الأمور من الهاتف أيضًا.",
      },
    ],
  },
};
