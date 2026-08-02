/**
 * Bénin (fr-BJ) Help Center sparse overlays on fr-FR base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_FR_BJ / ALL_ARTICLES_FR_BJ
 * - resolveHelpLocale: treat fr-bj as fr-BJ (fallback chain fr-BJ → fr-FR → en)
 * - getHelpSections / listArticles / getAllArticles branches for fr-BJ
 *
 * Section chrome (titles/descriptions) inherits fr-FR SECTIONS_FR_FR unchanged.
 * parent-report articles inherit fr-FR with no local override file (no empty overlays).
 */

import { PARENT_ARTICLES } from "../fr-FR/parents.js";
import { STUDENT_ARTICLES } from "../fr-FR/students.js";
import { PARENT_REPORT_ARTICLES } from "../fr-FR/parent-report.js";
import { SUBJECT_ARTICLES } from "../fr-FR/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

export const BY_SECTION_FR_BJ = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_FR_BJ = [
  ...BY_SECTION_FR_BJ.parents,
  ...BY_SECTION_FR_BJ.students,
  ...BY_SECTION_FR_BJ["parent-report"],
  ...BY_SECTION_FR_BJ.subjects,
];
