/**
 * Equatorial Guinea Spanish (es-GQ) sparse Help overlays for students —
 * Inherit es-419; grade chrome (1er–6to grado) and padre/madre o tutor where visible.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const STUDENT_OVERRIDES_BY_SLUG = {
  "choose-subject-and-grade": {
    summary: "Cómo entrar a practicar en la materia que elegiste (1er a 6to grado).",
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "coincidirán con tu grado",
        text: "Elige una materia de la lista. Las actividades coincidirán con tu grado (por ejemplo, 1er grado o 3er grado).",
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
