/**
 * Kazakhstan Russian (ru-KZ) sparse Help overlays for students —
 * класс as school year; inherit ты register from ru-RU.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    summary: "Как начать практику по выбранному предмету и классу.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "твоему классу",
        text: "Выбери предмет из списка. Задания будут соответствовать твоему классу (году обучения).",
      },
    ],
  },
};
