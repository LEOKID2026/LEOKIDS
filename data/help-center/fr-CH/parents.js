/**
 * Switzerland French (fr-CH) sparse Help overlays for parents —
 * France CP/CE1/…/6e → HarmoS 3P–8P; grade wording → année.
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
          "Leo Kids est un espace d’apprentissage pour les élèves du degré primaire de la 3e année primaire (3P) à la 8e année primaire (8P), avec des pratiques en mathématiques, en géométrie, en anglais et en sciences, ainsi que des jeux et des rapports de progrès pour les parents.",
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
          "Entrez le nom de l’enfant et choisissez une année (3P à 8P). Après l’enregistrement, les informations de connexion de l’enfant apparaîtront.",
      },
      {
        kind: "list",
        items: [
          "3P — grade_1",
          "4P — grade_2",
          "5P — grade_3",
          "6P — grade_4",
          "7P — grade_5",
          "8P — grade_6",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Changez le nom ou l’année et supprimez-le avec confirmation.",
  },
};
