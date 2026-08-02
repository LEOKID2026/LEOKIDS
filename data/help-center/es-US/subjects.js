/**
 * United States Spanish (es-US) sparse Help overlays for subjects —
 * grados 1 a 6 → 1.er a 6.º grado; escuela primaria framing.
 */

/** @type {import("./merge-overlays.js").HelpArticleOverlay} */
const SUBJECT_SHARED_OVERLAY = {
  blockPatches: [
    {
      kind: "paragraph",
      textIncludes: "grados 1 a 6",
      text:
        "La práctica está diseñada para niños y niñas de 1.er a 6.º grado de escuela primaria, adaptada al nivel del grado.",
    },
  ],
};

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const SUBJECT_OVERRIDES_BY_SLUG = {
  math: {
    summary:
      "Práctica de matemáticas para 1.er a 6.º grado: qué aprenden los niños y cómo practicar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  geometry: {
    summary:
      "Práctica de geometría para 1.er a 6.º grado: qué aprenden los niños y cómo practicar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  english: {
    summary:
      "Práctica de inglés para 1.er a 6.º grado: qué aprenden los niños y cómo practicar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
  science: {
    summary:
      "Práctica de ciencias para 1.er a 6.º grado: qué aprenden los niños y cómo practicar.",
    ...SUBJECT_SHARED_OVERLAY,
  },
};
