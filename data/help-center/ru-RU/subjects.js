/**
 * Russian (ru-RU) Help subject guides — adult-facing Вы / neutral.
 */
import {
  baseArticle,
  paragraph,
  heading,
  list,
  videoBlock,
  relatedLinks,
} from "../articleHelpers.js";

const S = "subjects";

export const math = baseArticle({
  slug: "math",
  section: S,
  title: "Гид по математике",
  summary: "Что практиковать по математике с 1 по 6 класс.",
  keywords: ["math", "математика"],
  toc: [{ id: "practice", title: "Практика" }],
  blocks: [
    heading(2, "practice", "Практика"),
    paragraph("Математика охватывает сложение, вычитание, умножение, деление, дроби, проценты и текстовые задачи — по классу ученика."),
    list(["Выберите класс", "Выберите тему", "Практикуйте короткими сессиями"]),
    videoBlock(S, "math"),
    relatedLinks([{ href: "/learning", label: "Открыть учебный центр" }]),
  ],
});

export const geometry = baseArticle({
  slug: "geometry",
  section: S,
  title: "Гид по геометрии",
  summary: "Фигуры, периметр, площадь, углы и окружность.",
  keywords: ["geometry", "геометрия"],
  toc: [{ id: "practice", title: "Практика" }],
  blocks: [
    heading(2, "practice", "Практика"),
    paragraph("Геометрия помогает узнавать фигуры, считать периметр и площадь, различать круг и окружность."),
    videoBlock(S, "geometry"),
  ],
});

export const english = baseArticle({
  slug: "english",
  section: S,
  title: "Гид по английскому языку",
  summary: "Словарь, грамматика и предложения — цели обучения остаются на английском.",
  keywords: ["english", "английский"],
  toc: [{ id: "practice", title: "Практика" }],
  blocks: [
    heading(2, "practice", "Практика"),
    paragraph("В английском языке слова и ответы для обучения остаются на английском. Интерфейс и подсказки значений могут быть на русском."),
    videoBlock(S, "english"),
  ],
});

export const science = baseArticle({
  slug: "science",
  section: S,
  title: "Гид по естественным наукам",
  summary: "Тело, животные, растения, материалы, Земля и опыты.",
  keywords: ["science", "естественные науки"],
  toc: [{ id: "practice", title: "Практика" }],
  blocks: [
    heading(2, "practice", "Практика"),
    paragraph("Естественные науки включают темы о теле человека, животных, растениях, материалах, Земле и простых опытах."),
    videoBlock(S, "science"),
  ],
});

export const SUBJECT_ARTICLES = [math, geometry, english, science];
