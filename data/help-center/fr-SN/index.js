/**
 * Sénégal (fr-SN) Help Center sparse overlays on fr-FR base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_FR_SN / ALL_ARTICLES_FR_SN
 * - resolveHelpLocale: treat fr-sn as fr-SN (fallback chain fr-SN → fr-FR → en)
 * - getHelpSections / listArticles / getAllArticles branches for fr-SN
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

export const BY_SECTION_FR_SN = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    PARENT_REPORT_ARTICLES,
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_FR_SN = [
  ...BY_SECTION_FR_SN.parents,
  ...BY_SECTION_FR_SN.students,
  ...BY_SECTION_FR_SN["parent-report"],
  ...BY_SECTION_FR_SN.subjects,
];
