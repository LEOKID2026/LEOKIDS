/**
 * Belarus Russian (ru-BY) sparse Help overlays for parents.
 * Scope: русскоязычные школы / tracks — not a claim that Russian covers all Belarus,
 * and not a Belarusian-language layer.
 * Grade labels 1–6 класс inherit from ru-RU wording where unchanged.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "начальной школы с 1 по 6 класс",
        text:
          "Leo Kids — учебное пространство для учеников русскоязычных школ Беларуси (1–6 классы): практика по математике, геометрии, английскому языку и естественным наукам, а также игры и отчёты о прогрессе для родителей.",
      },
    ],
  },
  "add-students": {
    blockPatches: [
      {
        kind: "list",
        items: [
          "Откройте раздел управления детьми",
          "Введите имя ребёнка и класс (год обучения: 1–6 класс)",
          "Сохраните — система создаст данные для входа ученика",
        ],
      },
    ],
  },
};
