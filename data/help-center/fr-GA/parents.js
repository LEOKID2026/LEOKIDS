/**
 * Gabon French (fr-GA) sparse Help overlays for parents —
 * France CP/CE1/…/CM2/6e → 1re–5e année primaire + 6e (entrée collège);
 * grade wording → année. Inherit all other articles/fields from fr-FR.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "du CP à la 6e",
        text:
          "Leo Kids est un espace d’apprentissage pour les élèves au Gabon, de la 1re à la 5e année primaire et en 6e (entrée au collège), avec des pratiques en mathématiques, en géométrie, en anglais et en sciences, ainsi que des jeux et des rapports de progrès pour les parents.",
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
          "Entrez le nom de l’enfant et choisissez une année (1re à 5e année primaire, ou 6e). Après l’enregistrement, les informations de connexion de l’enfant apparaîtront.",
      },
      {
        kind: "list",
        items: [
          "1re année — grade_1",
          "2e année — grade_2",
          "3e année — grade_3",
          "4e année — grade_4",
          "5e année — grade_5",
          "6e — grade_6",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Changez le nom ou l’année et supprimez-le avec confirmation.",
  },
};
