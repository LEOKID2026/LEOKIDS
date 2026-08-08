/**
 * Kuwait (ar-KW) Help Center sparse overlays on Arabic Master (ar-001).
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_AR_KW / ALL_ARTICLES_AR_KW / SECTIONS_AR_KW
 * - resolveHelpLocale: treat ar-kw as ar-KW (fallback chain ar-KW → ar-001 → en)
 * - getHelpSections / listArticles / getAllArticles branches for ar-KW
 *
 * Do not wire a country-only /kw path here — shared MAIN agent handles public paths.
 */

import { PARENT_ARTICLES } from "../ar-001/parents.js";
import { STUDENT_ARTICLES } from "../ar-001/students.js";
import { PARENT_REPORT_ARTICLES } from "../ar-001/parent-report.js";
import { SUBJECT_ARTICLES } from "../ar-001/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";
import { PARENT_REPORT_OVERRIDES_BY_SLUG } from "./parent-report.js";

/** Section shell: طالب / ولي الأمر (Kuwait product roles). */
export const SECTIONS_AR_KW = {
  parents: {
    key: "parents",
    title: "دليل لأولياء الأمور",
    description: "سجّل الدخول، وأدر الأطفال والتقارير وأدوات أولياء الأمور.",
    href: "/help/parents",
    emoji: "👨‍👩‍👧",
    hubGradientKey: "parents",
  },
  students: {
    key: "students",
    title: "دليل للطلاب",
    description: "تسجيل الدخول والممارسة والمهام والألعاب - بلغة بسيطة.",
    href: "/help/students",
    emoji: "🎒",
    hubGradientKey: "students",
  },
  "parent-report": {
    key: "parent-report",
    title: "شرح تقرير ولي الأمر",
    description: "كيفية قراءة كل جزء من التقرير – خطوة بخطوة.",
    href: "/help/parent-report",
    emoji: "📊",
    hubGradientKey: "parent-report",
  },
  subjects: {
    key: "subjects",
    title: "أدلة المواد الدراسية",
    description: "ما يجب التدرّب عليه في كل مادة وكيف.",
    href: "/help/subjects",
    emoji: "📚",
    hubGradientKey: "subjects",
  },
};

export const BY_SECTION_AR_KW = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    PARENT_REPORT_ARTICLES,
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_AR_KW = [
  ...BY_SECTION_AR_KW.parents,
  ...BY_SECTION_AR_KW.students,
  ...BY_SECTION_AR_KW["parent-report"],
  ...BY_SECTION_AR_KW.subjects,
];
