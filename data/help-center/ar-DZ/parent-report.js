/**
 * Algeria (ar-DZ) sparse Help overlays for parent-report —
 * أستاذ wording where inherited copy uses معلم for school teacher role.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_REPORT_OVERRIDES_BY_SLUG = {
  "printing-and-pdf": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "مع المعلم",
        text: "يمكن تصدير التقرير إلى ملف PDF أو طباعته، وهو أمر مفيد لعقد اجتماع مع الأستاذ.",
      },
    ],
  },
  "understanding-the-disclaimer": {
    blockPatches: [
      {
        kind: "disclaimerQuote",
        paragraphIncludes: "ولا يحل محل المعلم",
        paragraphs: [
          "يعتمد التقرير على بيانات الممارسة التي تم جمعها على Leo Kids.",
          "يهدف التقرير إلى مساعدة أولياء الأمور على فهم ما يمارسه طفلهم، وأين ظهرت نقاط القوة، وما الذي يجب تعزيزه بعد ذلك.",
          "التقرير ليس تشخيصًا طبيًا أو نفسيًا أو تعليميًا ولا يحل محل الأستاذ أو المستشار أو المقيم أو أي متخصص آخر. إذا كانت لديك مخاوف مستمرة بشأن صعوبة أو فجوات التعلم، فتحدث مع أستاذ أو متخصص مؤهل.",
        ],
      },
    ],
  },
};
