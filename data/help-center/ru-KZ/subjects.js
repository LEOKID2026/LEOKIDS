/**
 * Kazakhstan Russian (ru-KZ) sparse Help overlays for subjects —
 * 1–6 классы; Russian-medium framing without claiming national exclusivity.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary: "Что практиковать по математике с 1 по 6 класс (русскоязычное обучение в Казахстане).",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "по классу ученика",
        text:
          "Математика охватывает сложение, вычитание, умножение, деление, дроби, проценты и текстовые задачи — по классу ученика (1–6 классы). Локальная валюта для денежных примеров — тенге (₸, KZT); разменная единица — тиын.",
      },
    ],
  },
  geometry: {
    summary: "Фигуры, периметр, площадь, углы и окружность — 1–6 классы.",
  },
  science: {
    summary: "Естественные науки: тело, животные, растения, материалы, Земля и опыты — 1–6 классы.",
  },
};
