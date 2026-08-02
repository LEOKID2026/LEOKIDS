/**
 * Kyrgyzstan Russian-medium (ru-KG) sparse Help overlays for subjects —
 * keep 1–6 класс grade span; frame Russian-medium schools in Kyrgyzstan.
 * English learning targets stay English (inherited article body).
 * Money examples: сом (KGS) / тыйын — aligned with math display layer.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Что практиковать по математике с 1 по 6 класс в школах с русским языком обучения в Кыргызстане.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "по классу ученика",
        text:
          "Математика охватывает сложение, вычитание, умножение, деление, дроби, проценты и текстовые задачи — по классу (году обучения) ученика в школах с русским языком обучения в Кыргызстане. Локальная валюта для денежных примеров — сом (KGS); разменная единица — тыйын.",
      },
    ],
  },
  geometry: {
    summary:
      "Что практиковать по геометрии с 1 по 6 класс в школах с русским языком обучения в Кыргызстане.",
  },
  english: {
    summary:
      "Что практиковать по английскому языку с 1 по 6 класс в школах с русским языком обучения в Кыргызстане — цели обучения остаются на английском.",
  },
  science: {
    summary:
      "Что практиковать по естественным наукам с 1 по 6 класс в школах с русским языком обучения в Кыргызстане.",
  },
};
