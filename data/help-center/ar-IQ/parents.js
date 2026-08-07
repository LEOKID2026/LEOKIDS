/**
 * Iraq (ar-IQ) sparse Help overlays for parents —
 * Iraqi primary grade wording + Arabic-version-for-Iraq framing.
 * textIncludes match ar-001 runtime article text.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "لمتعلمي المرحلة الابتدائية في الصفوف من 1 إلى 6",
        text: "Leo Kids عبارة عن مساحة تعليمية بالعربية لمتعلّمي المرحلة الابتدائية في العراق (الصف الأول إلى الصف السادس الابتدائي ضمن نطاق المنتج)، مع التدريب على الرياضيات والهندسة واللغة الإنجليزية والعلوم، بالإضافة إلى الألعاب وتقارير التقدم لأولياء الأمور.",
      },
    ],
  },
  "add-students": {
    keywords: ["طفل", "صف", "إضافة"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "واختر الصف (من 1 إلى 6)",
        text: "أدخل اسم الطفل واختر الصف (من الصف الأول إلى الصف السادس). بعد الحفظ، ستظهر تفاصيل تسجيل الدخول للطفل.",
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "تغيير الاسم أو الصف، وحذفها مع التأكيد.",
  },
};
