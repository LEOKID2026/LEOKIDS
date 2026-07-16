import {
  baseArticle,
  paragraph,
  heading,
  list,
  callout,
  screenshotBlock,
  videoBlock,
  relatedLinks,
  disclaimerQuoteBlock,
} from "../articleHelpers";

const S = "parent-report";

export const reportOverview = baseArticle({
  slug: "report-overview",
  section: S,
  title: "Parent report overview",
  summary: "Standard report vs detailed report — when to use each.",
  keywords: ["report", "overview"],
  toc: [
    { id: "short", title: "Standard report" },
    { id: "detailed", title: "Detailed report" },
  ],
  blocks: [
    heading(2, "short", "Standard report"),
    paragraph("Shows a quick picture: performance, trends, and main recommendations."),
    videoBlock(S, "report-overview"),
    screenshotBlock(S, "report-overview", "short-report", "Standard parent report page"),
    heading(2, "detailed", "Detailed report"),
    paragraph("Includes breakdown by subject, topics, parent letter, and focused recommendations."),
    screenshotBlock(S, "report-overview", "detailed-report", "Detailed report page"),
  ],
});

export const summaryCard = baseArticle({
  slug: "summary-card",
  section: S,
  title: "Summary card",
  summary: "The top section of the report — overall picture.",
  keywords: ["summary", "card"],
  toc: [{ id: "card", title: "Summary card" }],
  blocks: [
    heading(2, "card", "Summary card"),
    paragraph("Briefly shows performance level, amount of practice, and the main message for what comes next."),
    screenshotBlock(S, "summary-card", "summary", "Summary card at the top of the report"),
    videoBlock(S, "summary-card"),
  ],
});

export const dataPresence = baseArticle({
  slug: "data-presence",
  section: S,
  title: "Enough data?",
  summary: "When a report has enough practice to show conclusions.",
  keywords: ["data", "presence"],
  toc: [{ id: "presence", title: "Data presence" }],
  blocks: [
    heading(2, "presence", "Data presence"),
    paragraph("If your child practiced only a little, the report will say there is not enough information yet. That is normal — keep practicing."),
    callout("info", "The more practice there is, the more accurate the report insights become."),
    screenshotBlock(S, "data-presence", "low-data", "Low-data message in a report"),
    videoBlock(S, "data-presence"),
  ],
});

export const trendsAndConfidence = baseArticle({
  slug: "trends-and-confidence",
  section: S,
  title: "Trends and confidence level",
  summary: "How to read trend and confidence labels in the report.",
  keywords: ["trend", "confidence"],
  toc: [{ id: "trends", title: "Trends" }],
  blocks: [
    heading(2, "trends", "Trends"),
    paragraph("A trend shows whether performance is improving, steady, or needs strengthening. Confidence level explains how reliable the data is."),
    screenshotBlock(S, "trends-and-confidence", "trend", "Trend row in a report"),
    videoBlock(S, "trends-and-confidence"),
  ],
});

export const strengthsAndImprovements = baseArticle({
  slug: "strengths-and-improvements",
  section: S,
  title: "Strengths and areas to improve",
  summary: "What your child does well and what to strengthen.",
  keywords: ["strengths", "improvement"],
  toc: [{ id: "blocks", title: "Report sections" }],
  blocks: [
    heading(2, "blocks", "Report sections"),
    list([
      "Strengths — topics where performance is strong",
      "To improve — topics that need more practice",
    ]),
    screenshotBlock(S, "strengths-and-improvements", "strengths", "Strengths and improvements list"),
    videoBlock(S, "strengths-and-improvements"),
  ],
});

export const topicsAndBuckets = baseArticle({
  slug: "topics-and-buckets",
  section: S,
  title: "Topics by subject",
  summary: "Breakdown by practice topics in each subject.",
  keywords: ["topics", "subject"],
  toc: [{ id: "topics", title: "Topic tables" }],
  blocks: [
    heading(2, "topics", "Topic tables"),
    paragraph("Each subject shows specific topics — for example addition in math or vocabulary in English."),
    screenshotBlock(S, "topics-and-buckets", "topics-table", "Math topics table"),
    videoBlock(S, "topics-and-buckets"),
  ],
});

export const subjectsOverview = baseArticle({
  slug: "subjects-overview",
  section: S,
  title: "Overview of the four subjects",
  summary: "A chart or table comparing subjects.",
  keywords: ["subjects", "chart"],
  toc: [{ id: "chart", title: "Subjects chart" }],
  blocks: [
    heading(2, "chart", "Subjects chart"),
    paragraph("Lets you see at a glance where your child is strong and where there is room to grow across math, geometry, English, and science."),
    screenshotBlock(S, "subjects-overview", "six-subjects", "Subjects overview chart"),
    videoBlock(S, "subjects-overview"),
  ],
});

export const recommendations = baseArticle({
  slug: "recommendations",
  section: S,
  title: "Practice recommendations",
  summary: "What the system recommends to practice next.",
  keywords: ["recommendations"],
  toc: [{ id: "rec", title: "Recommendations" }],
  blocks: [
    heading(2, "rec", "Recommendations"),
    paragraph("Recommendations are based on repeating mistakes and topics not yet practiced enough."),
    screenshotBlock(S, "recommendations", "recommendations", "Recommendations area in a report"),
    videoBlock(S, "recommendations"),
  ],
});

export const challengesSection = baseArticle({
  slug: "challenges-section",
  section: S,
  title: "Recommended challenges",
  summary: "Challenges chosen for deeper practice.",
  keywords: ["challenges"],
  toc: [{ id: "challenges", title: "Challenges" }],
  blocks: [
    heading(2, "challenges", "Challenges"),
    paragraph("Challenges offer focused practice on topics that need strengthening."),
    screenshotBlock(S, "challenges-section", "challenges", "Challenges area in a report"),
    videoBlock(S, "challenges-section"),
  ],
});

export const detailedReport = baseArticle({
  slug: "detailed-report",
  section: S,
  title: "Detailed report",
  summary: "Executive summary, parent letter, and breakdown by subject.",
  keywords: ["detailed", "letter"],
  toc: [
    { id: "exec", title: "Executive summary" },
    { id: "letter", title: "Parent letter" },
  ],
  blocks: [
    heading(2, "exec", "Executive summary"),
    paragraph("General opening to the detailed report with the central message."),
    heading(2, "letter", "Parent letter"),
    paragraph("Each subject includes a written explanation for parents — what your child knows and what to strengthen."),
    screenshotBlock(S, "detailed-report", "letter", "Parent letter for one subject"),
    videoBlock(S, "detailed-report"),
  ],
});

export const printingAndPdf = baseArticle({
  slug: "printing-and-pdf",
  section: S,
  title: "Print and PDF export",
  summary: "How to save or print the report.",
  keywords: ["print", "PDF"],
  toc: [{ id: "export", title: "Export" }],
  blocks: [
    heading(2, "export", "Export"),
    paragraph("The report can be exported to PDF or printed — useful for a meeting with a teacher."),
    screenshotBlock(S, "printing-and-pdf", "pdf", "Export PDF button"),
    videoBlock(S, "printing-and-pdf"),
    callout("tip", "Before printing, check the preview to make sure everything fits on the page."),
  ],
});

export const understandingTheDisclaimer = baseArticle({
  slug: "understanding-the-disclaimer",
  section: S,
  title: "Understanding the important notice",
  summary: "What the notice at the bottom of the report means — full text.",
  keywords: ["disclaimer", "legal"],
  toc: [{ id: "disclaimer", title: "Important notice" }],
  blocks: [
    heading(2, "disclaimer", "Important notice"),
    paragraph("Every report includes a notice explaining that the report is a support tool, not a professional diagnosis. Full text:"),
    disclaimerQuoteBlock(),
    screenshotBlock(
      S,
      "understanding-the-disclaimer",
      "disclaimer",
      "Important notice box in a parent report"
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
