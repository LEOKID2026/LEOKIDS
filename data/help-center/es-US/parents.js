/**
 * United States Spanish (es-US) sparse Help overlays for parents —
 * Grado 1–6 → 1.er–6.º grado; móvil → celular; escuela primaria;
 * padre/madre → padre, madre o tutor where natural.
 * Inherit all other articles/fields from es-419.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "estudiantes de primaria (grados 1 a 6)",
        text:
          "Leo Kids es un espacio de aprendizaje para estudiantes de escuela primaria (1.er a 6.º grado), con práctica de matemáticas, geometría, inglés y ciencias, además de juegos e informes de progreso para padres, madres o tutores.",
      },
    ],
  },
  "add-students": {
    summary: "Crear un perfil infantil, elegir un grado (1.er a 6.º) y guardar.",
    keywords: ["hijo", "grado", "agregar", "1.er grado"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "elige un grado (1 a 6)",
        text:
          "Escribe el nombre del niño o niña y elige un grado (1.er a 6.º grado). Después de guardar, aparecerán los datos de acceso.",
      },
      {
        kind: "list",
        items: [
          "1.er grado — grade_1",
          "2.º grado — grade_2",
          "hasta 6.º grado — grade_6",
        ],
      },
    ],
  },
  "mobile-and-offline": {
    title: "Celular y juegos sin conexión",
    summary: "Usar el sitio en el celular y jugar sin internet.",
    keywords: ["celular", "sin conexión"],
    toc: [
      { id: "mobile", title: "Uso en el celular" },
      { id: "offline", title: "Sin conexión" },
    ],
    blockPatches: [
      {
        id: "mobile",
        text: "Uso en el celular",
      },
      {
        kind: "paragraph",
        textIncludes: "desde el teléfono",
        text:
          "El sitio funciona en pantallas pequeñas. El inicio de sesión de estudiantes y de padres, madres o tutores también funciona desde el celular.",
      },
    ],
  },
};
