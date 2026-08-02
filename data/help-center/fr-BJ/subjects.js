/**
 * Bénin (fr-BJ) sparse Help overlays for subjects —
 * CP/6e and generic « niveaux 1 à 6 » → CI–CM2 (enseignement primaire).
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "du CP à la 6e",
      text:
        "La pratique est conçue pour les enfants du CI au CM2, en fonction du niveau scolaire.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Pratique des mathématiques du CI au CM2 : ce que les enfants apprennent et comment pratiquer.",
    blockPatches: [...SUBJECT_SHARED_OVERLAY.blockPatches],
  },
  geometry: {
    summary:
      "Pratique de la géométrie du CI au CM2 : ce que les enfants apprennent et comment pratiquer.",
    blockPatches: [...SUBJECT_SHARED_OVERLAY.blockPatches],
  },
  english: {
    summary:
      "Pratique de l'anglais du CI au CM2 : ce que les enfants apprennent et comment pratiquer.",
    blockPatches: [...SUBJECT_SHARED_OVERLAY.blockPatches],
  },
  science: {
    summary:
      "Pratique scientifique du CI au CM2 : ce que les enfants apprennent et comment mettre en pratique.",
    blockPatches: [...SUBJECT_SHARED_OVERLAY.blockPatches],
  },
};
