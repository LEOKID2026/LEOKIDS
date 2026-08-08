/**
 * Kuwait (ar-KW) subject Help — academic grade chrome uses الصف (not درجة);
 * product scope uses word-form grades (not numeric 1–6 bands as academic labels).
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary: "ممارسة الرياضيات للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية التدرب عليه.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "في الصفوف من 1 إلى 6",
        text: "تم تصميم الممارسة للأطفال في الصفوف من الأول إلى السادس، بما يتناسب مع مستوى الصف.",
      },
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
  geometry: {
    summary: "ممارسة الهندسة للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "في الصفوف من 1 إلى 6",
        text: "تم تصميم الممارسة للأطفال في الصفوف من الأول إلى السادس، بما يتناسب مع مستوى الصف.",
      },
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
  english: {
    summary: "ممارسة اللغة الإنجليزية للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "في الصفوف من 1 إلى 6",
        text: "تم تصميم الممارسة للأطفال في الصفوف من الأول إلى السادس، بما يتناسب مع مستوى الصف.",
      },
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
  science: {
    summary: "ممارسة العلوم للصفوف من الأول إلى السادس - ما يتعلمه الأطفال وكيفية ممارسته.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "في الصفوف من 1 إلى 6",
        text: "تم تصميم الممارسة للأطفال في الصفوف من الأول إلى السادس، بما يتناسب مع مستوى الصف.",
      },
      {
        kind: "paragraph",
        textIncludes: "اختر الدرجة والمستوى",
        text: "اختر الصف والمستوى، وأجب عن الأسئلة، واحصل على شرح بعد كل إجابة.",
      },
    ],
  },
};
