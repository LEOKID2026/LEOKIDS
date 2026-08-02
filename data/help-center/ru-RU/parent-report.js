/**
 * Russian (ru-RU) Help articles for parent report — adult-facing Вы.
 * Factual, non-medical tone. Slugs preserved.
 */
import {
  baseArticle,
  paragraph,
  heading,
  list,
  callout,
  videoBlock,
  relatedLinks,
} from "../articleHelpers.js";

const S = "parent-report";

function article(opts) {
  return baseArticle({ ...opts, section: S });
}

export const reportOverview = article({
  slug: "report-overview",
  title: "Обзор отчёта родителя",
  summary: "Как устроен отчёт и с чего начать чтение.",
  keywords: ["report", "overview", "отчёт"],
  toc: [{ id: "overview", title: "Обзор" }],
  blocks: [
    heading(2, "overview", "Обзор"),
    paragraph("Отчёт показывает практику ребёнка за выбранный период: сильные стороны, темы для закрепления и практические рекомендации."),
    callout("info", "Отчёт основан на данных практики на сайте и не является медицинским заключением."),
    videoBlock(S, "report-overview"),
  ],
});

export const summaryCard = article({
  slug: "summary-card",
  title: "Карточка сводки",
  summary: "Что означает верхняя сводка отчёта.",
  keywords: ["summary", "сводка"],
  toc: [{ id: "summary", title: "Сводка" }],
  blocks: [
    heading(2, "summary", "Сводка"),
    paragraph("Карточка сводки даёт краткий взгляд на точность, объём практики и общий тон периода."),
    videoBlock(S, "summary-card"),
  ],
});

export const dataPresence = article({
  slug: "data-presence",
  title: "Достаточно ли данных?",
  summary: "Когда отчёт может дать ясную картину.",
  keywords: ["data", "данные"],
  toc: [{ id: "data", title: "Данные" }],
  blocks: [
    heading(2, "data", "Данные"),
    paragraph("Если практики мало, отчёт предупредит, что картина ещё ранняя. Короткие регулярные сессии помогают получить более надёжные сигналы."),
    videoBlock(S, "data-presence"),
  ],
});

export const trendsAndConfidence = article({
  slug: "trends-and-confidence",
  title: "Тенденции и уровень уверенности",
  summary: "Как читать устойчивость результатов.",
  keywords: ["trends", "confidence"],
  toc: [{ id: "trends", title: "Тенденции" }],
  blocks: [
    heading(2, "trends", "Тенденции"),
    paragraph("Тенденции показывают, держатся ли результаты со временем. Низкая уверенность означает, что нужно ещё немного практики, прежде чем делать вывод."),
    videoBlock(S, "trends-and-confidence"),
  ],
});

export const strengthsAndImprovements = article({
  slug: "strengths-and-improvements",
  title: "Сильные стороны и зоны роста",
  summary: "Как отличить устойчивость от темы для закрепления.",
  keywords: ["strengths", "improve"],
  toc: [{ id: "lists", title: "Списки" }],
  blocks: [
    heading(2, "lists", "Списки"),
    list([
      "Сильные стороны — темы с устойчивой практикой",
      "Зоны роста — темы, где полезна дополнительная практика",
    ]),
    videoBlock(S, "strengths-and-improvements"),
  ],
});

export const topicsAndBuckets = article({
  slug: "topics-and-buckets",
  title: "Темы по предметам",
  summary: "Как темы сгруппированы внутри предметов.",
  keywords: ["topics", "темы"],
  toc: [{ id: "topics", title: "Темы" }],
  blocks: [
    heading(2, "topics", "Темы"),
    paragraph("Темы сгруппированы по предметам: математика, геометрия, английский язык и естественные науки."),
    videoBlock(S, "topics-and-buckets"),
  ],
});

export const subjectsOverview = article({
  slug: "subjects-overview",
  title: "Обзор четырёх предметов",
  summary: "Сравнение предметов на уровне сводки.",
  keywords: ["subjects", "предметы"],
  toc: [{ id: "subjects", title: "Предметы" }],
  blocks: [
    heading(2, "subjects", "Предметы"),
    paragraph("Сводка по предметам помогает увидеть, где практики больше и где стоит уделить внимание на этой неделе."),
    videoBlock(S, "subjects-overview"),
  ],
});

export const recommendations = article({
  slug: "recommendations",
  title: "Рекомендации по практике",
  summary: "Как использовать рекомендации дома.",
  keywords: ["recommendations", "рекомендации"],
  toc: [{ id: "recs", title: "Рекомендации" }],
  blocks: [
    heading(2, "recs", "Рекомендации"),
    paragraph("Рекомендации предлагают короткий следующий шаг: ту же тему, чуть выше сложность или повтор более ранних навыков."),
    videoBlock(S, "recommendations"),
  ],
});

export const challengesSection = article({
  slug: "challenges-section",
  title: "Рекомендуемые задания",
  summary: "Что означают предложенные задания в отчёте.",
  keywords: ["challenges", "задания"],
  toc: [{ id: "challenges", title: "Задания" }],
  blocks: [
    heading(2, "challenges", "Задания"),
    paragraph("Раздел заданий предлагает конкретные темы для короткой практики. Это предложения, а не обязательный план."),
    videoBlock(S, "challenges-section"),
  ],
});

export const detailedReport = article({
  slug: "detailed-report",
  title: "Подробный отчёт",
  summary: "Когда открывать подробный вид.",
  keywords: ["detailed", "подробный"],
  toc: [{ id: "detailed", title: "Подробности" }],
  blocks: [
    heading(2, "detailed", "Подробности"),
    paragraph("Подробный отчёт даёт больше контекста по темам и оговоркам. Начинайте с краткой сводки, затем углубляйтесь при необходимости."),
    videoBlock(S, "detailed-report"),
  ],
});

export const printingAndPdf = article({
  slug: "printing-and-pdf",
  title: "Печать и экспорт в PDF",
  summary: "Как сохранить или распечатать отчёт.",
  keywords: ["print", "PDF", "печать"],
  toc: [{ id: "print", title: "Печать" }],
  blocks: [
    heading(2, "print", "Печать"),
    paragraph("Используйте печать или экспорт в PDF из отчёта, если эта функция доступна в вашем портале."),
    videoBlock(S, "printing-and-pdf"),
  ],
});

export const understandingTheDisclaimer = article({
  slug: "understanding-the-disclaimer",
  title: "Как понимать важное примечание",
  summary: "Почему отчёт формулирует выводы осторожно.",
  keywords: ["disclaimer", "примечание"],
  toc: [{ id: "note", title: "Примечание" }],
  blocks: [
    heading(2, "note", "Примечание"),
    paragraph("Отчёт описывает учебные паттерны по данным практики. Он не ставит личных диагнозов и не сравнивает ребёнка с классом без данных."),
    relatedLinks([{ href: "/help/parents/how-to-read-report", label: "Как начать читать отчёт" }]),
    videoBlock(S, "understanding-the-disclaimer"),
  ],
});

export const PARENT_REPORT_ARTICLES = [
  reportOverview,
  summaryCard,
  dataPresence,
  trendsAndConfidence,
  strengthsAndImprovements,
  topicsAndBuckets,
  subjectsOverview,
  recommendations,
  challengesSection,
  detailedReport,
  printingAndPdf,
  understandingTheDisclaimer,
];
