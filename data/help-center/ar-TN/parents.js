/**
 * Tunisia (ar-TN) sparse Help overlays for parents —
 * السنة / التعليم الابتدائي / النسخة العربية لتونس on top of ar-001 Help.
 * textIncludes match ar-001 runtime article text.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "في الصفوف من 1 إلى 6",
        text: "Leo Kids عبارة عن مساحة تعليمية لمتعلّمي التعليم الابتدائي بتونس (السنة الأولى إلى السادسة من المرحلة الابتدائية)، مع التدريب على الرياضيات والهندسة واللغة الإنجليزية والعلوم، بالإضافة إلى الألعاب وتقارير التقدم لأولياء الأمور. هذه النسخة العربية لتونس وليست تمثيلًا حصريًا لكل اللغات المستخدمة في البلاد.",
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "مع الاسم والصف وخيارات",
        text: "في الصفحة الرئيسية، سترى جميع الأطفال المرتبطين بالحساب، مع الاسم والسنة وخيارات الإدارة.",
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
        text: "أدخل اسم الطفل واختر السنة (من الأولى إلى السادسة). بعد الحفظ، ستظهر تفاصيل تسجيل الدخول للطفل.",
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
          "السنة الأولى — Grade_1",
          "السنة الثانية — Grade_2",
          "حتى السنة السادسة — Grade_6",
        ],
      },
    ],
  },
};
