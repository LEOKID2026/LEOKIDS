/**
 * Côte d’Ivoire (fr-CI) sparse Help overlays for students —
 * fix tu + vous conjugation leaks inherited from fr-FR.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "student-home-tour": {
    summary: "Ce que tu vois après t’être connecté : sujets, pièces et avatar.",
  },
  "choose-subject-and-grade": {
    summary: "Comment entrer en pratique dans le sujet que tu as choisi.",
  },
  "hints-and-explanations": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Si tu avez fait une erreur",
        text:
          "Si tu as fait une erreur, lis l'explication et réessaie. Si tu avais raison, passe à la question suivante !",
      },
    ],
  },
  "monthly-persistence": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Plus tu pratiquez",
        text:
          "Plus tu pratiques en un mois, plus ton voyage avance. Cela montre à quel point tu as continué !",
      },
    ],
  },
  "tips-for-good-practice": {
    blockPatches: [
      {
        kind: "list",
        items: [
          "Entraîne-toi un peu tous les jours",
          "Fais une pause si tu es fatigué",
          "Lis les explications lorsque tu ne comprends pas",
        ],
      },
    ],
  },
};
