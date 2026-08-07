/**
 * Tunisia (ar-TN) sparse Help overlays for subjects —
 * السنة الدراسية + مستوى الصعوبة on top of ar-001 Help.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "في الصفوف من 1 إلى 6",
      text: "تم تصميم الممارسة للأطفال من السنة الأولى إلى السادسة، بما يتناسب مع السنة الدراسية.",
    },
    {
      kind: "paragraph",
      textIncludes: "اختر الدرجة والمستوى",
      text: "اختر السنة ومستوى الصعوبة، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary: "ممارسة الرياضيات للسنوات 1-6 - ما يتعلمه الأطفال وكيفية التدرب عليه.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  geometry: {
    summary: "ممارسة الهندسة للسنوات 1-6 - ما يتعلمه الأطفال وكيفية التدرب عليه.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  english: {
    summary: "ممارسة الإنجليزية للسنوات 1-6 - ما يتعلمه الأطفال وكيفية التدرب عليه.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary: "ممارسة العلوم للسنوات 1-6 - ما يتعلمه الأطفال وكيفية التدرب عليه.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
