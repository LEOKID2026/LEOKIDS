/**
 * Spain (es-ES) sparse Help overlays for subjects — school-year grado → curso/Primaria only.
 * Angle/degree usos of "grados" are not present in these guides; only school-year wording is patched.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "grados 1 a 6",
      text:
        "La práctica está diseñada para niños y niñas de 1.º a 6.º de Primaria, adaptada al nivel del curso.",
    },
    {
      kind: "paragraph",
      textIncludes: "Elige un grado",
      text:
        "Elige un curso y un nivel, responde preguntas y recibe una explicación después de cada respuesta.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Práctica de matemáticas para 1.º a 6.º de Primaria: qué aprenden los niños y cómo practicar.",
    ...SUBJECT_SHARED_OVERLAY,
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: [
          "Suma, resta, multiplicación y división",
          "Fracciones y decimales (cursos superiores)",
          "Problemas verbales",
        ],
      },
    ],
  },
  geometry: {
    summary:
      "Práctica de geometría para 1.º a 6.º de Primaria: qué aprenden los niños y cómo practicar.",
    ...SUBJECT_SHARED_OVERLAY,
    blockPatches: [
      ...SUBJECT_SHARED_OVERLAY.blockPatches,
      {
        kind: "list",
        items: ["Área y perímetro", "Ángulos y figuras", "Pitágoras (cursos avanzados)"],
      },
    ],
  },
  english: {
    summary:
      "Práctica de inglés para 1.º a 6.º de Primaria: qué aprenden los niños y cómo practicar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Práctica de ciencias para 1.º a 6.º de Primaria: qué aprenden los niños y cómo practicar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
