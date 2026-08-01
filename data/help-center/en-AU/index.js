/**
 * Australia (en-AU) Help Center — sparse overlays on English (en) articles.
 * Shared wiring in data/help-center/index.js must resolve en-AU → these exports
 * (resolveHelpLocale, getHelpSections, listArticles). Do not import this from
 * data/help-center/index.js in a way that creates a cycle before wiring lands.
 */
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";
import { PARENT_REPORT_OVERRIDES_BY_SLUG } from "./parent-report.js";
import { PARENT_ARTICLES } from "../content/parents.js";
import { STUDENT_ARTICLES } from "../content/students.js";
import { PARENT_REPORT_ARTICLES } from "../content/parent-report.js";
import { SUBJECT_ARTICLES } from "../content/subjects.js";

/** Same section chrome as English; country overlay does not retitle hub sections. */
export const SECTIONS_EN_AU = {
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

export const BY_SECTION_EN_AU = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    PARENT_REPORT_ARTICLES,
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_EN_AU = [
  ...BY_SECTION_EN_AU.parents,
  ...BY_SECTION_EN_AU.students,
  ...BY_SECTION_EN_AU["parent-report"],
  ...BY_SECTION_EN_AU.subjects,
];
