/**
 * Nigeria (en-NG) Help Center sparse overlays on English base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_EN_NG / ALL_ARTICLES_EN_NG
 * - resolveHelpLocale: treat en-ng as en-NG (fallback chain en-NG → en)
 * - getHelpSections / listArticles / getAllArticles branches for en-NG
 *
 * Section chrome (titles/descriptions) inherits English SECTIONS unchanged.
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

export const BY_SECTION_EN_NG = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    PARENT_REPORT_ARTICLES,
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_EN_NG = [
  ...BY_SECTION_EN_NG.parents,
  ...BY_SECTION_EN_NG.students,
  ...BY_SECTION_EN_NG["parent-report"],
  ...BY_SECTION_EN_NG.subjects,
];
