/**
 * Iraq (ar-IQ) sparse Help overlays for subjects —
 * word-form grade bands + fix academic درجة → صف where Master still says درجة.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary: "ممارسة الرياضيات للصفوف الأول–السادس - ما يتعلمه الأطفال وكيفية التدرب عليه.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "في الصفوف من 1 إلى 6",
        text: "تم تصميم الممارسة للأطفال من الصف الأول إلى الصف السادس، بما يتناسب مع الصف الدراسي.",
      },
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
  geometry: {
    summary: "ممارسة الهندسة للصفوف الأول–السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "في الصفوف من 1 إلى 6",
        text: "تم تصميم الممارسة للأطفال من الصف الأول إلى الصف السادس، بما يتناسب مع الصف الدراسي.",
      },
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
  english: {
    summary: "ممارسة اللغة الإنجليزية للصفوف الأول–السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "في الصفوف من 1 إلى 6",
        text: "تم تصميم الممارسة للأطفال من الصف الأول إلى الصف السادس، بما يتناسب مع الصف الدراسي.",
      },
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
  science: {
    summary: "ممارسة العلوم للصفوف الأول–السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "في الصفوف من 1 إلى 6",
        text: "تم تصميم الممارسة للأطفال من الصف الأول إلى الصف السادس، بما يتناسب مع الصف الدراسي.",
      },
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
};
