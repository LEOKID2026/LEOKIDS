/**
 * Liberia (en-LR) Help Center sparse overlays on English base articles.
 *
 * students and parent-report inherit en articles directly (no local override files).
 * parents / subjects carry sparse Liberia overrides only.
 */

import { PARENT_ARTICLES } from "../content/parents.js";
import { STUDENT_ARTICLES } from "../content/students.js";
import { PARENT_REPORT_ARTICLES } from "../content/parent-report.js";
import { SUBJECT_ARTICLES } from "../content/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

/** Same section shell as English — student remains the default educational term. */
export const SECTIONS_EN_LR = {
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

export const BY_SECTION_EN_LR = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: STUDENT_ARTICLES,
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_EN_LR = [
  ...BY_SECTION_EN_LR.parents,
  ...BY_SECTION_EN_LR.students,
  ...BY_SECTION_EN_LR["parent-report"],
  ...BY_SECTION_EN_LR.subjects,
];
