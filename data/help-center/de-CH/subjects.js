/**
 * Switzerland (de-CH) sparse Help overlays for subjects —
 * Primarstufe framing where helpful; Klasse labels kept; adult Sie address.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "1. bis zur 6. Klasse gestaltet",
      text:
        "Die Übungen sind für Primarschulkinder von der 1. bis zur 6. Klasse gestaltet und auf das jeweilige Klassenniveau abgestimmt.",
    },
    {
      kind: "callout",
      textIncludes: "gleichmäßigen Tempo",
      text:
        "Üben Sie in einem gleichmässigen Tempo — ein bisschen jeden Tag ist besser als viel an einem Tag.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Mathematik-Übung für die Primarstufe (1. bis 6. Klasse) — was Kinder lernen und wie geübt wird.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  geometry: {
    summary:
      "Geometrie-Übung für die Primarstufe (1. bis 6. Klasse) — was Kinder lernen und wie geübt wird.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  english: {
    summary:
      "Englisch-Übung für die Primarstufe (1. bis 6. Klasse) — was Kinder lernen und wie geübt wird.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Naturwissenschaften-Übung für die Primarstufe (1. bis 6. Klasse) — was Kinder lernen und wie geübt wird.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
