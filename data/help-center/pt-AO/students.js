/**
 * Angola (pt-AO) sparse Help overlays for students —
 * classe terminology on top of pt-PT Help.
 * textIncludes match pt-PT / pt-BR runtime article text.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Escolhe uma matéria e uma classe",
    summary: "Como entrar na prática na disciplina que escolheste.",
    keywords: ["assunto", "classe", "matéria"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "ao seu ano",
        text: "Escolhe um assunto da lista. As atividades corresponderão à tua classe.",
      },
    ],
  },
};
