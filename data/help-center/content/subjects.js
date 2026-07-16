import {
  baseArticle,
  paragraph,
  heading,
  list,
  callout,
  screenshotBlock,
  videoBlock,
  relatedLinks,
} from "../articleHelpers";

const S = "subjects";

function subjectArticle(slug, title, emoji, topics, masterPath) {
  return baseArticle({
    slug,
    section: S,
    title: `${title} guide`,
    summary: `${title} practice for grades 1–6 — what children learn and how to practice.`,
    keywords: [title, "subject", "practice"],
    toc: [
      { id: "who", title: "Who is it for?" },
      { id: "topics", title: "What do we practice?" },
      { id: "practice", title: "What does practice look like?" },
      { id: "tips", title: "Tips" },
    ],
    blocks: [
      heading(2, "who", "Who is it for?"),
      paragraph("Practice is designed for children in grades 1 through 6, matched to grade level."),
      heading(2, "topics", "What do we practice?"),
      list(topics),
      heading(2, "practice", "What does practice look like?"),
      paragraph("Choose a grade and level, answer questions, and get an explanation after each answer."),
      videoBlock(S, slug),
      screenshotBlock(S, slug, "question", `${title} practice screen`),
      screenshotBlock(S, slug, "explanation", `Explanation for a ${title} question`),
      heading(2, "tips", "Tips"),
      callout("tip", "Practice at a steady pace — a little each day beats a lot on one day."),
      relatedLinks([
        { href: masterPath, label: `Go to ${title} practice` },
        { href: "/learning", label: "Learning hub" },
      ]),
    ],
  });
}

export const math = subjectArticle(
  "math",
  "Math",
  "🧮",
  ["Addition, subtraction, multiplication, and division", "Fractions and decimals (upper grades)", "Word problems"],
  "/learning/math-master"
);

export const geometry = subjectArticle(
  "geometry",
  "Geometry",
  "📐",
  ["Area and perimeter", "Angles and shapes", "Pythagoras (advanced grades)"],
  "/learning/geometry-master"
);

export const english = subjectArticle(
  "english",
  "English",
  "🇬🇧",
  ["Vocabulary", "Grammar and meaning", "Building sentences"],
  "/learning/english-master"
);

export const science = subjectArticle(
  "science",
  "Science",
  "🔬",
  ["The human body and animals", "Plants and materials", "Weather and forces"],
  "/learning/science-master"
);

export const SUBJECT_ARTICLES = [math, geometry, english, science];
