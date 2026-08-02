/**
 * Cameroun francophone (fr-CM) sparse Help overlays for students —
 * classe→niveau (année scolaire); fix tu + vous conjugation leaks inherited from fr-FR.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "student-home-tour": {
    summary: "Ce que tu vois après t’être connecté : sujets, pièces et avatar.",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "Ici, tu verrez",
        text:
          "Ici, tu verras ton nom, combien de pièces tu possèdes et quels sujets tu peux ouvrir.",
      },
    ],
  },
  "choose-subject-and-grade": {
    title: "Choisis une matière et un niveau",
    summary: "Comment entrer en pratique dans le sujet que tu as choisi.",
    keywords: ["sujet", "niveau"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "ta classe",
        text: "Choisis un sujet dans la liste. Les activités correspondront à ton niveau.",
      },
    ],
  },
  "answering-questions": {
    blockPatches: [
      {
        kind: "list",
        items: [
          "Parfois, tu choisis une réponse dans une liste",
          "Parfois, tu tapes un chiffre ou un mot",
          "Après ta réponse, tu verras si tu avais raison",
        ],
      },
    ],
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
  "daily-missions": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "tu verrez les missions",
        text:
          "Sur ta page d’accueil, tu verras les missions quotidiennes. Lorsque tu les termines, tu gagnes des points et tu progresses.",
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
  "coins-and-arcade": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "gagnez des pièces",
        text:
          "Entraîne-toi et gagne des pièces. Dans la salle d’arcade, tu peux jouer à des jeux de société avec des amis.",
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
