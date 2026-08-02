/**
 * Kazakhstan Russian (ru-KZ) sparse Help overlays for parents —
 * Russian-medium framing in Kazakhstan; класс = school year (1–6 классы).
 * Does not claim to replace Kazakh-medium education or represent all schools.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "для учеников начальной школы с 1 по 6 класс",
        text:
          "Leo Kids — учебное пространство для учеников с русским языком обучения в Казахстане (1–6 классы): практика по математике, геометрии, английскому языку и естественным наукам, а также игры и отчёты о прогрессе для родителей. Это слой только для русскоязычного обучения; казахский язык обучения остаётся отдельным.",
      },
    ],
  },
  "add-students": {
    summary: "Как добавить ребёнка и выбрать класс (год обучения).",
    keywords: ["add", "child", "ребёнок", "класс"],
    blockPatches: [
      {
        kind: "list",
        items: [
          "Откройте раздел управления детьми",
          "Введите имя ребёнка и класс (год обучения: 1 класс — 6 класс)",
          "Сохраните — система создаст данные для входа ученика",
        ],
      },
    ],
  },
};
