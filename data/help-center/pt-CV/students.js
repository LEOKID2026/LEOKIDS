/**
 * Cabo Verde (pt-CV) sparse Help overlays for students —
 * 1.º–6.º ano terminology on top of pt-PT Help.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Escolhe uma matéria e um ano",
    keywords: ["assunto", "ano", "matéria"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "ao seu ano",
        text: "Escolhe um assunto da lista. As atividades corresponderão ao teu ano.",
      },
    ],
  },
};
