/**
 * Guinée (fr-GN) sparse Help overlays for parents —
 * France CP/CE1/…/6e → CP1/CP2/CE1/CE2/CM1/CM2 (MENA/MEPU-A / GPE ESP / IFADEM).
 * French UI layer for primary schooling — does not claim French is the only language spoken.
 * Inherit all other articles/fields from fr-FR.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "du CP à la 6e",
        text:
          "Leo Kids est un espace d'apprentissage pour les élèves du primaire en Guinée, du CP1 au CM2, avec des pratiques en mathématiques, en géométrie, en anglais et en sciences, ainsi que des jeux et des rapports de progrès pour les parents.",
      },
    ],
  },
  "add-students": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "CP à 6e",
        text:
          "Entrez le nom de l'enfant et choisissez un niveau (CP1 à CM2). Après l'enregistrement, les informations de connexion de l'enfant apparaîtront.",
      },
      {
        kind: "list",
        items: [
          "CP1 — grade_1",
          "CP2 — grade_2",
          "jusqu'au CM2 — grade_6",
        ],
      },
    ],
  },
};
