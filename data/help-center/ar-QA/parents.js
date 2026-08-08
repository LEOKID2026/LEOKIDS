/**
 * Qatar (ar-QA) sparse Help overlays for parents —
 * الصف الأول الابتدائي…السادس الابتدائي (formal); طالب; ولي الأمر.
 * Product grades 1–6 sit inside المرحلة الابتدائية.
 * المرحلة التأسيسية refers to early learning (mainly grade1+grade2) — never claim grades 1–6 = التأسيسية.
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
          "Leo Kids عبارة عن مساحة تعليمية لمتعلمي المرحلة الابتدائية في قطر — من الصف الأول الابتدائي إلى الصف السادس الابتدائي — مع التدريب على الرياضيات والهندسة واللغة الإنجليزية والعلوم، بالإضافة إلى الألعاب وتقارير التقدم لأولياء الأمور.",
      },
    ],
  },
  "add-students": {
    keywords: ["طفل", "صف", "إضافة", "طالب"],
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
          "الصف الأول الابتدائي — grade_1",
          "الصف الثاني الابتدائي — grade_2",
          "الصف الثالث الابتدائي — grade_3",
          "الصف الرابع الابتدائي — grade_4",
          "الصف الخامس الابتدائي — grade_5",
          "الصف السادس الابتدائي — grade_6",
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
