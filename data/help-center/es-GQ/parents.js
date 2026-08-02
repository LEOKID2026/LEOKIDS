/**
 * Equatorial Guinea Spanish (es-GQ) sparse Help overlays for parents —
 * Grado 1–6 → 1er–6to grado (PRODEGE); Educación Primaria; padres/tutores;
 * country framing + product bands ≠ official cycles.
 * Keep móvil (Equatoguinean/peninsular lexicon). Inherit remaining fields from es-419.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "estudiantes de primaria (grados 1 a 6)",
        text:
          "Leo Kids es un espacio de aprendizaje en español para estudiantes de Educación Primaria en Guinea Ecuatorial (1er a 6to grado), con práctica de matemáticas, geometría, inglés y ciencias, además de juegos e informes de progreso para padres, madres o tutores. Las bandas 1er–2do, 3er–4to y 5to–6to grado organizan la práctica en Leo Kids; los ciclos oficiales de primaria son grados 1–3 y 4–6.",
      },
    ],
  },
  "add-students": {
    summary: "Crear un perfil infantil, elegir un grado (1er a 6to) y guardar.",
    keywords: ["hijo", "grado", "agregar", "1er grado"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "elige un grado (1 a 6)",
        text:
          "Escribe el nombre del niño o niña y elige un grado (1er a 6to grado). Después de guardar, aparecerán los datos de acceso.",
      },
      {
        kind: "list",
        items: [
          "1er grado — grade_1",
          "2do grado — grade_2",
          "hasta 6to grado — grade_6",
        ],
      },
    ],
  },
};
