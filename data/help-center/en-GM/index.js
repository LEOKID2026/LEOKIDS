/**
 * The Gambia (en-GM) Help Center sparse overlays on English base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_EN_GM / ALL_ARTICLES_EN_GM
 * - resolveHelpLocale: treat en-gm as en-GM (fallback chain en-GM → en)
 * - getHelpSections / listArticles / getAllArticles branches for en-GM
 *
 * This English layer supports English in The Gambia's formal education system.
 * It does not claim English is the only language used in The Gambia.
 * Do not wire a country-only /gm path here — shared agent handles public paths.
 */

import { PARENT_ARTICLES } from "../content/parents.js";
import { STUDENT_ARTICLES } from "../content/students.js";
import { PARENT_REPORT_ARTICLES } from "../content/parent-report.js";
import { SUBJECT_ARTICLES } from "../content/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";
import { PARENT_REPORT_OVERRIDES_BY_SLUG } from "./parent-report.js";

/** Same section shell as English, with pupil wording on the students hub. */
export const SECTIONS_EN_GM = {
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
    title: "Guide for pupils",
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

export const BY_SECTION_EN_GM = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    PARENT_REPORT_ARTICLES,
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_EN_GM = [
  ...BY_SECTION_EN_GM.parents,
  ...BY_SECTION_EN_GM.students,
  ...BY_SECTION_EN_GM["parent-report"],
  ...BY_SECTION_EN_GM.subjects,
];
