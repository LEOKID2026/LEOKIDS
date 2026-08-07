/**
 * Jordan (ar-JO) sparse Help overlays for parents —
 * الصف الأول الأساسي…السادس الأساسي (MoE / Ajyal formal); طالب; ولي الأمر inherited.
 * Product scope is six grades only — does not claim التعليم الأساسي ends at grade 6.
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
          "Leo Kids عبارة عن مساحة تعليمية لمتعلمي الصف الأول الأساسي إلى الصف السادس الأساسي في الأردن، مع التدريب على الرياضيات والهندسة واللغة الإنجليزية والعلوم، بالإضافة إلى الألعاب وتقارير التقدم لأولياء الأمور.",
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
          "الصف الأول الأساسي — grade_1",
          "الصف الثاني الأساسي — grade_2",
          "الصف الثالث الأساسي — grade_3",
          "الصف الرابع الأساسي — grade_4",
          "الصف الخامس الأساسي — grade_5",
          "الصف السادس الأساسي — grade_6",
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
