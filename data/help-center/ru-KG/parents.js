/**
 * Kyrgyzstan Russian-medium (ru-KG) sparse Help overlays for parents —
 * country framing for Russian-medium schools; grade year = класс;
 * inherit student/teacher/parent/worksheet terminology from ru-RU.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "начальной школы с 1 по 6 класс",
        text:
          "Leo Kids — учебное пространство для учеников начальной школы (1–6 классы) в школах и классах с русским языком обучения в Кыргызстане: практика по математике, геометрии, английскому языку и естественным наукам, а также игры и отчёты о прогрессе для родителей. Слой рассчитан на русскоязычное обучение и не описывает все школы страны.",
      },
    ],
  },
  "add-students": {
    summary: "Создайте профиль ребёнка, выберите класс (год обучения) и сохраните.",
    keywords: ["ребёнок", "класс", "добавить"],
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
  "edit-or-delete-student": {
    summary: "Измените имя или класс (год обучения) и удалите профиль с подтверждением.",
  },
};
