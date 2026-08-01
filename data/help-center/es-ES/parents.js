/**
 * Spain (es-ES) sparse Help overlays for parents — school-year grado → curso/Primaria only.
 * Inherit all other articles/fields from es-419.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "grados 1 a 6",
        text:
          "Leo Kids es un espacio de aprendizaje para estudiantes de primaria (1.º a 6.º de Primaria), con práctica de matemáticas, geometría, inglés y ciencias, además de juegos e informes de progreso para padres.",
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "nombre, grado",
        text:
          "En la página de padres verás a todos los niños y niñas vinculados a la cuenta, con nombre, curso y opciones de gestión.",
      },
    ],
  },
  "add-students": {
    summary: "Crear un perfil infantil, elegir un curso y guardar.",
    keywords: ["hijo", "curso", "agregar"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "elige un grado (1 a 6)",
        text:
          "Escribe el nombre del niño o niña y elige un curso (1.º–6.º de Primaria). Después de guardar, aparecerán los datos de acceso.",
      },
      {
        kind: "screenshot",
        altIncludes: "selección de grado",
        alt: "Formulario para agregar un hijo o hija con selección de curso",
        caption: "Formulario para agregar un hijo o hija con selección de curso",
      },
      {
        kind: "list",
        items: [
          "1.º de Primaria — grade_1",
          "2.º de Primaria — grade_2",
          "3.º de Primaria — grade_3",
          "4.º de Primaria — grade_4",
          "5.º de Primaria — grade_5",
          "6.º de Primaria — grade_6",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Cambiar nombre o curso, y eliminar con confirmación.",
  },
};
