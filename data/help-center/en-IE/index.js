/**
 * Ireland (en-IE) sparse Help Center pack — overlays on English base articles.
 * Activation requires shared wiring in data/help-center/index.js
 * (resolveHelpLocale + exports + assertAllArticlesValid). Not wired here.
 */
import { PARENT_ARTICLES } from "../content/parents.js";
import { STUDENT_ARTICLES } from "../content/students.js";
import { PARENT_REPORT_ARTICLES } from "../content/parent-report.js";
import { SUBJECT_ARTICLES } from "../content/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

/** Same section shell as English — no Ireland-specific section titles required. */
export const SECTIONS_EN_IE = {
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

export const BY_SECTION_EN_IE = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_EN_IE = [
  ...BY_SECTION_EN_IE.parents,
  ...BY_SECTION_EN_IE.students,
  ...BY_SECTION_EN_IE["parent-report"],
  ...BY_SECTION_EN_IE.subjects,
];
