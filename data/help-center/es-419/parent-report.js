import {
  baseArticle,
  paragraph,
  heading,
  list,
  callout,
  screenshotBlock,
  videoBlock,
  disclaimerQuoteBlockEs419,
} from "../articleHelpers.js";

const S = "parent-report";

export const reportOverview = baseArticle({
  slug: "report-overview",
  section: S,
  title: "Resumen del informe para padres",
  summary: "Informe estándar frente a informe detallado: cuándo usar cada uno.",
  keywords: ["informe", "resumen"],
  toc: [
    { id: "short", title: "Informe estándar" },
    { id: "detailed", title: "Informe detallado" },
  ],
  blocks: [
    heading(2, "short", "Informe estándar"),
    paragraph("Muestra una imagen rápida: desempeño, tendencias y recomendaciones principales."),
    videoBlock(S, "report-overview"),
    screenshotBlock(S, "report-overview", "short-report", "Página del informe estándar para padres"),
    heading(2, "detailed", "Informe detallado"),
    paragraph("Incluye el desglose por materia, temas, carta para padres y recomendaciones enfocadas."),
    screenshotBlock(S, "report-overview", "detailed-report", "Página del informe detallado"),
  ],
});

export const summaryCard = baseArticle({
  slug: "summary-card",
  section: S,
  title: "Tarjeta de resumen",
  summary: "La sección superior del informe: el panorama general.",
  keywords: ["resumen", "tarjeta"],
  toc: [{ id: "card", title: "Tarjeta de resumen" }],
  blocks: [
    heading(2, "card", "Tarjeta de resumen"),
    paragraph("Muestra de forma breve el nivel de desempeño, la cantidad de práctica y el mensaje principal sobre qué sigue."),
    screenshotBlock(S, "summary-card", "summary", "Tarjeta de resumen en la parte superior del informe"),
    videoBlock(S, "summary-card"),
  ],
});

export const dataPresence = baseArticle({
  slug: "data-presence",
  section: S,
  title: "¿Hay suficientes datos?",
  summary: "Cuándo un informe tiene suficiente práctica para mostrar conclusiones.",
  keywords: ["datos", "presencia"],
  toc: [{ id: "presence", title: "Presencia de datos" }],
  blocks: [
    heading(2, "presence", "Presencia de datos"),
    paragraph("Si tu hijo o hija practicó poco, el informe dirá que aún no hay suficiente información. Es normal: sigue practicando."),
    callout("info", "Cuanta más práctica haya, más precisas serán las conclusiones del informe."),
    screenshotBlock(S, "data-presence", "low-data", "Mensaje de pocos datos en un informe"),
    videoBlock(S, "data-presence"),
  ],
});

export const trendsAndConfidence = baseArticle({
  slug: "trends-and-confidence",
  section: S,
  title: "Tendencias y nivel de confianza",
  summary: "Cómo leer las etiquetas de tendencia y confianza en el informe.",
  keywords: ["tendencia", "confianza"],
  toc: [{ id: "trends", title: "Tendencias" }],
  blocks: [
    heading(2, "trends", "Tendencias"),
    paragraph("Una tendencia muestra si el desempeño mejora, se mantiene o necesita reforzarse. El nivel de confianza indica qué tan confiables son los datos."),
    screenshotBlock(S, "trends-and-confidence", "trend", "Fila de tendencia en un informe"),
    videoBlock(S, "trends-and-confidence"),
  ],
});

export const strengthsAndImprovements = baseArticle({
  slug: "strengths-and-improvements",
  section: S,
  title: "Fortalezas y áreas por mejorar",
  summary: "Lo que tu hijo o hija hace bien y lo que conviene reforzar.",
  keywords: ["fortalezas", "mejora"],
  toc: [{ id: "blocks", title: "Secciones del informe" }],
  blocks: [
    heading(2, "blocks", "Secciones del informe"),
    list([
      "Fortalezas — temas con buen desempeño",
      "Por mejorar — temas que necesitan más práctica",
    ]),
    screenshotBlock(S, "strengths-and-improvements", "strengths", "Lista de fortalezas y mejoras"),
    videoBlock(S, "strengths-and-improvements"),
  ],
});

export const topicsAndBuckets = baseArticle({
  slug: "topics-and-buckets",
  section: S,
  title: "Temas por materia",
  summary: "Desglose por temas de práctica en cada materia.",
  keywords: ["temas", "materia"],
  toc: [{ id: "topics", title: "Tablas de temas" }],
  blocks: [
    heading(2, "topics", "Tablas de temas"),
    paragraph("Cada materia muestra temas específicos: por ejemplo suma en matemáticas o vocabulario en inglés."),
    screenshotBlock(S, "topics-and-buckets", "topics-table", "Tabla de temas de matemáticas"),
    videoBlock(S, "topics-and-buckets"),
  ],
});

export const subjectsOverview = baseArticle({
  slug: "subjects-overview",
  section: S,
  title: "Resumen de las cuatro materias",
  summary: "Un gráfico o tabla que compara las materias.",
  keywords: ["materias", "gráfico"],
  toc: [{ id: "chart", title: "Gráfico de materias" }],
  blocks: [
    heading(2, "chart", "Gráfico de materias"),
    paragraph("Te permite ver de un vistazo dónde tu hijo o hija es fuerte y dónde hay espacio para crecer en matemáticas, geometría, inglés y ciencias."),
    screenshotBlock(S, "subjects-overview", "six-subjects", "Gráfico general de materias"),
    videoBlock(S, "subjects-overview"),
  ],
});

export const recommendations = baseArticle({
  slug: "recommendations",
  section: S,
  title: "Recomendaciones de práctica",
  summary: "Qué recomienda el sistema practicar a continuación.",
  keywords: ["recomendaciones"],
  toc: [{ id: "rec", title: "Recomendaciones" }],
  blocks: [
    heading(2, "rec", "Recomendaciones"),
    paragraph("Las recomendaciones se basan en errores repetidos y en temas que aún no se practicaron lo suficiente."),
    screenshotBlock(S, "recommendations", "recommendations", "Área de recomendaciones en un informe"),
    videoBlock(S, "recommendations"),
  ],
});

export const challengesSection = baseArticle({
  slug: "challenges-section",
  section: S,
  title: "Desafíos recomendados",
  summary: "Desafíos elegidos para una práctica más profunda.",
  keywords: ["desafíos"],
  toc: [{ id: "challenges", title: "Desafíos" }],
  blocks: [
    heading(2, "challenges", "Desafíos"),
    paragraph("Los desafíos ofrecen práctica enfocada en temas que necesitan reforzarse."),
    screenshotBlock(S, "challenges-section", "challenges", "Área de desafíos en un informe"),
    videoBlock(S, "challenges-section"),
  ],
});

export const detailedReport = baseArticle({
  slug: "detailed-report",
  section: S,
  title: "Informe detallado",
  summary: "Resumen ejecutivo, carta para padres y desglose por materia.",
  keywords: ["detallado", "carta"],
  toc: [
    { id: "exec", title: "Resumen ejecutivo" },
    { id: "letter", title: "Carta para padres" },
  ],
  blocks: [
    heading(2, "exec", "Resumen ejecutivo"),
    paragraph("Apertura general del informe detallado con el mensaje central."),
    heading(2, "letter", "Carta para padres"),
    paragraph("Cada materia incluye una explicación escrita para padres: qué sabe tu hijo o hija y qué reforzar."),
    screenshotBlock(S, "detailed-report", "letter", "Carta para padres de una materia"),
    videoBlock(S, "detailed-report"),
  ],
});

export const printingAndPdf = baseArticle({
  slug: "printing-and-pdf",
  section: S,
  title: "Imprimir y exportar PDF",
  summary: "Cómo guardar o imprimir el informe.",
  keywords: ["imprimir", "PDF"],
  toc: [{ id: "export", title: "Exportar" }],
  blocks: [
    heading(2, "export", "Exportar"),
    paragraph("El informe se puede exportar a PDF o imprimir: útil para una reunión con un docente."),
    screenshotBlock(S, "printing-and-pdf", "pdf", "Botón para exportar PDF"),
    videoBlock(S, "printing-and-pdf"),
    callout("tip", "Antes de imprimir, revisa la vista previa para asegurarte de que todo quepa en la página."),
  ],
});

export const understandingTheDisclaimer = baseArticle({
  slug: "understanding-the-disclaimer",
  section: S,
  title: "Entender el aviso importante",
  summary: "Qué significa el aviso al final del informe: texto completo.",
  keywords: ["aviso", "legal"],
  toc: [{ id: "disclaimer", title: "Aviso importante" }],
  blocks: [
    heading(2, "disclaimer", "Aviso importante"),
    paragraph("Cada informe incluye un aviso que explica que el informe es una herramienta de apoyo, no un diagnóstico profesional. Texto completo:"),
    disclaimerQuoteBlockEs419(),
    screenshotBlock(
      S,
      "understanding-the-disclaimer",
      "disclaimer",
      "Cuadro de aviso importante en un informe para padres"
    ),
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
