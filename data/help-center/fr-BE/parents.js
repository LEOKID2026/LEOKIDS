/**
 * Belgium French (fr-BE) sparse Help overlays for parents —
 * France CP/CE1/…/6e → 1re–6e primaire; grade wording → année.
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
          "Leo Kids est un espace d’apprentissage pour les élèves du primaire de la 1re à la 6e primaire, avec des pratiques en mathématiques, en géométrie, en anglais et en sciences, ainsi que des jeux et des rapports de progrès pour les parents.",
      },
    ],
  },
  "add-students": {
    summary: "Créez un profil d’enfant, choisissez une année et enregistrez.",
    keywords: ["enfant", "année", "ajouter"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "CP à 6e",
        text:
          "Entrez le nom de l’enfant et choisissez une année (1re à 6e primaire). Après l’enregistrement, les informations de connexion de l’enfant apparaîtront.",
      },
      {
        kind: "list",
        items: [
          "1re primaire — grade_1",
          "2e primaire — grade_2",
          "jusqu’à la 6e primaire — grade_6",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Changez le nom ou l’année et supprimez-le avec confirmation.",
  },
};
