/**
 * DR Congo French (fr-CD) Help Center sparse overlays on fr-FR base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_FR_CD / ALL_ARTICLES_FR_CD
 * - resolveHelpLocale: treat fr-cd as fr-CD (fallback chain fr-CD → fr-FR → en)
 * - getHelpSections / listArticles / getAllArticles branches for fr-CD
 *
 * Section chrome (titles/descriptions) inherits fr-FR SECTIONS_FR_FR unchanged.
 */

import { PARENT_ARTICLES } from "../fr-FR/parents.js";
import { STUDENT_ARTICLES } from "../fr-FR/students.js";
import { PARENT_REPORT_ARTICLES } from "../fr-FR/parent-report.js";
import { SUBJECT_ARTICLES } from "../fr-FR/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";
import { PARENT_REPORT_OVERRIDES_BY_SLUG } from "./parent-report.js";

export const BY_SECTION_FR_CD = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    PARENT_REPORT_ARTICLES,
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_FR_CD = [
  ...BY_SECTION_FR_CD.parents,
  ...BY_SECTION_FR_CD.students,
  ...BY_SECTION_FR_CD["parent-report"],
  ...BY_SECTION_FR_CD.subjects,
];
