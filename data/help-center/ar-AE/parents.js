/**
 * United Arab Emirates (ar-AE) sparse Help overlays for parents —
 * التعليم الأساسي؛ الحلقة الأولى (1–4) وجزء من الحلقة الثانية (5–6)؛ طالب؛ ولي الأمر.
 * Base authority: ar-001. Multilingual country: Arabic version for UAE (not Arabic-only claim).
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "لمتعلمي المرحلة الابتدائية في الصفوف من 1 إلى 6",
        text:
          "Leo Kids عبارة عن مساحة تعليمية لمتعلمي التعليم الأساسي في دولة الإمارات العربية المتحدة (الصف الأول إلى الصف السادس). يغطي المنتج الحلقة الأولى (الصف الأول–الرابع) وجزءًا من الحلقة الثانية (الصف الخامس–السادس؛ الحلقة الثانية تمتد رسميًا حتى الصف الثامن)، مع التدريب على الرياضيات والهندسة واللغة الإنجليزية والعلوم، بالإضافة إلى الألعاب وتقارير التقدم لأولياء الأمور.",
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
