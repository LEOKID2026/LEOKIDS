import {
  baseArticle,
  paragraph,
  heading,
  list,
  callout,
  screenshotBlock,
  videoBlock,
  relatedLinks,
} from "../articleHelpers.js";

const S = "subjects";

function subjectArticle(slug, title, topics, masterPath) {
  return baseArticle({
    slug,
    section: S,
    title: `Guía de ${title}`,
    summary: `Práctica de ${title} para grados 1 a 6: qué aprenden los niños y cómo practicar.`,
    keywords: [title, "materia", "práctica"],
    toc: [
      { id: "who", title: "¿Para quién es?" },
      { id: "topics", title: "¿Qué practicamos?" },
      { id: "practice", title: "¿Cómo es la práctica?" },
      { id: "tips", title: "Consejos" },
    ],
    blocks: [
      heading(2, "who", "¿Para quién es?"),
      paragraph("La práctica está diseñada para niños y niñas de grados 1 a 6, adaptada al nivel del grado."),
      heading(2, "topics", "¿Qué practicamos?"),
      list(topics),
      heading(2, "practice", "¿Cómo es la práctica?"),
      paragraph("Elige un grado y un nivel, responde preguntas y recibe una explicación después de cada respuesta."),
      videoBlock(S, slug),
      screenshotBlock(S, slug, "question", `Pantalla de práctica de ${title}`),
      screenshotBlock(S, slug, "explanation", `Explicación de una pregunta de ${title}`),
      heading(2, "tips", "Consejos"),
      callout("tip", "Practica a un ritmo constante: un poco cada día es mejor que mucho en un solo día."),
      relatedLinks([
        { href: masterPath, label: `Ir a la práctica de ${title}` },
        { href: "/learning", label: "Centro de aprendizaje" },
      ]),
    ],
  });
}

export const math = subjectArticle(
  "math",
  "matemáticas",
  [
    "Suma, resta, multiplicación y división",
    "Fracciones y decimales (grados superiores)",
    "Problemas verbales",
  ],
  "/learning/math-master"
);

export const geometry = subjectArticle(
  "geometry",
  "geometría",
  ["Área y perímetro", "Ángulos y figuras", "Pitágoras (grados avanzados)"],
  "/learning/geometry-master"
);

export const english = subjectArticle(
  "english",
  "inglés",
  ["Vocabulario", "Gramática y significado", "Construcción de oraciones"],
  "/learning/english-master"
);

export const science = subjectArticle(
  "science",
  "ciencias",
  ["El cuerpo humano y los animales", "Plantas y materiales", "Clima y fuerzas"],
  "/learning/science-master"
);

export const SUBJECT_ARTICLES = [math, geometry, english, science];
