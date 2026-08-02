/**
 * Kyrgyzstan Russian-medium (ru-KG) sparse Help overlays for students.
 * Grade year stays класс (inherited meaning); no Kyrgyz-as-Russian leakage.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    summary: "Как начать практику по выбранному предмету и классу (году обучения).",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "твоему классу",
        text: "Выбери предмет из списка. Задания будут соответствовать твоему классу (году обучения).",
      },
    ],
  },
};
