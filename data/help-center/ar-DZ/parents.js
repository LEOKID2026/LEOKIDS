/**
 * Algeria (ar-DZ) sparse Help overlays for parents —
 * سنة / ابتدائي–متوسط terminology on top of ar-001 Help.
 * textIncludes match ar-001 runtime article text.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "لمتعلمي المرحلة الابتدائية في الصفوف من 1 إلى 6",
        text: "Leo Kids عبارة عن مساحة تعليمية بالعربية لمتعلّمي المرحلة الابتدائية في الجزائر (السنوات 1–5 ابتدائي والسنة 1 متوسط ضمن نطاق المنتج)، مع التدريب على الرياضيات والهندسة واللغة الإنجليزية والعلوم، بالإضافة إلى الألعاب وتقارير التقدم لأولياء الأمور.",
      },
    ],
  },
  "add-students": {
    summary: "قم بإنشاء ملف تعريف للطفل، واختر السنة، ثم احفظه.",
    keywords: ["طفل", "سنة", "إضافة"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "واختر الصف (من 1 إلى 6)",
        text: "أدخل اسم الطفل واختر السنة (من السنة 1 ابتدائي إلى السنة 1 متوسط). بعد الحفظ، ستظهر تفاصيل تسجيل الدخول للطفل.",
      },
      {
        kind: "screenshot",
        altIncludes: "اختيار الصف",
        alt: "إضافة نموذج الطفل مع اختيار السنة",
        caption: "إضافة نموذج الطفل مع اختيار السنة",
      },
      {
        kind: "list",
        items: [
          "السنة 1 ابتدائي — Grade_1",
          "السنة 2 ابتدائي — Grade_2",
          "حتى السنة 1 متوسط — Grade_6",
        ],
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "مع الاسم والصف وخيارات الإدارة",
        text: "في الصفحة الرئيسية، سترى جميع الأطفال المرتبطين بالحساب، مع الاسم والسنة وخيارات الإدارة.",
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "تغيير الاسم أو السنة، وحذفها مع التأكيد.",
    keywords: ["تعديل", "حذف", "سنة"],
  },
};
