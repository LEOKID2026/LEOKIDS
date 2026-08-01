import { PARENT_ARTICLES } from "./content/parents.js";
import { STUDENT_ARTICLES } from "./content/students.js";
import { PARENT_REPORT_ARTICLES } from "./content/parent-report.js";
import { SUBJECT_ARTICLES } from "./content/subjects.js";
import {
  ALL_ARTICLES_ES_419,
  BY_SECTION_ES_419,
  SECTIONS_ES_419,
} from "./es-419/index.js";

export { ALL_ARTICLES_ES_419, SECTIONS_ES_419 };

export const SECTIONS = {
  parents: {
    key: "parents",
    title: "Guide for parents",
    description: "Sign up, manage children, reports, and parent tools.",
    href: "/help/parents",
    emoji: "👨‍👩‍👧",
    hubGradientKey: "parents",
  },
  students: {
    key: "students",
    title: "Guide for students",
    description: "Login, practice, missions, and games — in simple language.",
    href: "/help/students",
    emoji: "🎒",
    hubGradientKey: "students",
  },
  "parent-report": {
    key: "parent-report",
    title: "Parent report explained",
    description: "How to read each part of the report — step by step.",
    href: "/help/parent-report",
    emoji: "📊",
    hubGradientKey: "parent-report",
  },
  subjects: {
    key: "subjects",
    title: "Subject guides",
    description: "What to practice in each subject and how.",
    href: "/help/subjects",
    emoji: "📚",
    hubGradientKey: "subjects",
  },
};

const BY_SECTION = {
  parents: PARENT_ARTICLES,
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: SUBJECT_ARTICLES,
};

export const ALL_ARTICLES = [
  ...PARENT_ARTICLES,
  ...STUDENT_ARTICLES,
  ...PARENT_REPORT_ARTICLES,
  ...SUBJECT_ARTICLES,
];

/**
 * @param {string|null|undefined} [locale]
 */
export function resolveHelpLocale(locale) {
  const id = String(locale || "en").toLowerCase();
  if (id === "es-419") return "es-419";
  return "en";
}

/**
 * @param {string|null|undefined} [locale]
 */
export function getHelpSections(locale) {
  return resolveHelpLocale(locale) === "es-419" ? SECTIONS_ES_419 : SECTIONS;
}

/**
 * @param {string} section
 * @param {string|null|undefined} [locale]
 */
export function listArticles(section, locale) {
  if (resolveHelpLocale(locale) === "es-419") {
    return BY_SECTION_ES_419[section] || [];
  }
  return BY_SECTION[section] || [];
}

/**
 * @param {string} section
 * @param {string} slug
 * @param {string|null|undefined} [locale]
 */
export function getArticle(section, slug, locale) {
  const articles = listArticles(section, locale);
  return articles.find((a) => a.slug === slug) || null;
}

/**
 * Paths are locale-agnostic (same slugs across locales).
 * @param {string} section
 */
export function getPathsForSection(section) {
  return listArticles(section, "en").map((a) => ({
    params: { slug: a.slug },
  }));
}

export function validateArticle(article) {
  const errors = [];
  if (!article?.slug) errors.push("missing slug");
  if (!article?.title) errors.push("missing title");
  if (!article?.summary) errors.push("missing summary");
  if (!article?.section) errors.push("missing section");

  for (const block of article?.blocks || []) {
    if (block.kind === "screenshot") {
      if (!block.alt?.trim()) errors.push(`screenshot missing alt in ${article.slug}`);
      if (!block.path?.trim()) errors.push(`screenshot missing path in ${article.slug}`);
    }
  }
  return errors;
}

export function collectScreenshotPathsFromArticles(articles = ALL_ARTICLES) {
  const paths = new Set();
  for (const article of articles) {
    for (const block of article.blocks || []) {
      if (block.kind !== "screenshot") continue;
      paths.add(block.path);
      if (block.sources?.mobile) paths.add(block.sources.mobile);
      if (block.sources?.tablet) paths.add(block.sources.tablet);
    }
  }
  return [...paths].sort();
}

/** Build-time validation for articles (EN + es-419 parity). */
export function assertAllArticlesValid() {
  const allErrors = [];
  const packs = [
    { locale: "en", articles: ALL_ARTICLES },
    { locale: "es-419", articles: ALL_ARTICLES_ES_419 },
  ];
  for (const pack of packs) {
    for (const article of pack.articles) {
      const errs = validateArticle(article);
      if (errs.length) {
        allErrors.push({
          locale: pack.locale,
          slug: article.slug,
          section: article.section,
          errs,
        });
      }
    }
  }

  const enSlugs = new Set(ALL_ARTICLES.map((a) => `${a.section}/${a.slug}`));
  const esSlugs = new Set(ALL_ARTICLES_ES_419.map((a) => `${a.section}/${a.slug}`));
  for (const key of enSlugs) {
    if (!esSlugs.has(key)) allErrors.push({ locale: "es-419", errs: [`missing slug parity: ${key}`] });
  }
  for (const key of esSlugs) {
    if (!enSlugs.has(key)) allErrors.push({ locale: "es-419", errs: [`extra slug vs en: ${key}`] });
  }

  if (allErrors.length) {
    throw new Error(
      `Help Center article validation failed: ${JSON.stringify(allErrors, null, 2)}`
    );
  }
}

assertAllArticlesValid();
