/**
 * Uzbekistan Russian-medium (ru-UZ) sparse Help overlays for subjects.
 * Money examples use сум / тийин (UZS); English learning targets stay English.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "по классу ученика",
        text:
          "Математика охватывает сложение, вычитание, умножение, деление, дроби, проценты и текстовые задачи — по классу ученика (1–6 классы). Локальная валюта для денежных примеров — сум (UZS); разменная единица — тийин.",
      },
    ],
  },
};
