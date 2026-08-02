/**
 * Austria (de-AT) sparse Help overlays for subjects — Klasse → Schulstufe only.
 * Adult address (Sie) preserved from de-DE parent-facing subject guides.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "1. bis zur 6. Klasse",
      text:
        "Die Übungen sind für Kinder von der 1. bis zur 6. Schulstufe gestaltet und auf das jeweilige Schulstufenniveau abgestimmt.",
    },
    {
      kind: "paragraph",
      textIncludes: "Wählen Sie eine Klasse und ein Niveau",
      text:
        "Wählen Sie eine Schulstufe und ein Niveau, beantworten Sie Fragen und erhalten Sie nach jeder Antwort eine Erklärung.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Mathematik-Übung für die 1. bis 6. Schulstufe — was Kinder lernen und wie geübt wird.",
    ...SUBJECT_SHARED_OVERLAY,
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Addition, Subtraktion, Multiplikation und Division",
          "Brüche und Dezimalzahlen (höhere Schulstufen)",
          "Textaufgaben",
        ],
      },
    ],
  },
  geometry: {
    summary:
      "Geometrie-Übung für die 1. bis 6. Schulstufe — was Kinder lernen und wie geübt wird.",
    ...SUBJECT_SHARED_OVERLAY,
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Fläche und Umfang",
          "Winkel und Formen",
          "Satz des Pythagoras (fortgeschrittene Schulstufen)",
        ],
      },
    ],
  },
  english: {
    summary:
      "Englisch-Übung für die 1. bis 6. Schulstufe — was Kinder lernen und wie geübt wird.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Naturwissenschaften-Übung für die 1. bis 6. Schulstufe — was Kinder lernen und wie geübt wird.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
