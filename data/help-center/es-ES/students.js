/**
 * Spain (es-ES) sparse Help overlays for students — school-year grado → curso only.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    title: "Elegir una materia y un curso",
    keywords: ["materia", "curso"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "tu grado",
        text: "Elige una materia de la lista. Las actividades coincidirán con tu curso.",
      },
    ],
  },
};
