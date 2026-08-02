/**
 * United States Spanish (es-US) sparse Help overlays for students —
 * Inherit es-419; light grade chrome where visible to kids.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    summary: "Cómo entrar a practicar en la materia que elegiste (1.er a 6.º grado).",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "coincidirán con tu grado",
        text: "Elige una materia de la lista. Las actividades coincidirán con tu grado (por ejemplo, 1.er grado o 3.er grado).",
      },
    ],
  },
  "student-login": {
    blockPatches: [
      {
        kind: "list",
        items: [
          "Pide a tu padre, madre o tutor tu nombre de usuario y tu código",
          "Escríbelos en la página de inicio de sesión",
          "Toca Iniciar sesión",
        ],
      },
    ],
  },
};
