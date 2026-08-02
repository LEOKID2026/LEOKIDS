/**
 * Cameroun (fr-CM) Help Center sparse overlays on fr-FR base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_FR_CM / ALL_ARTICLES_FR_CM
 * - resolveHelpLocale: treat fr-cm as fr-CM (fallback chain fr-CM → fr-FR → en)
 * - getHelpSections / listArticles / getAllArticles branches for fr-CM
 *
 * This Francophone layer does not represent the Anglophone subsystem or all
 * languages used in Cameroon. Do not wire a generic /cm public path here.
 */

import { PARENT_ARTICLES } from "../fr-FR/parents.js";
import { STUDENT_ARTICLES } from "../fr-FR/students.js";
import { PARENT_REPORT_ARTICLES } from "../fr-FR/parent-report.js";
import { SUBJECT_ARTICLES } from "../fr-FR/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

export const BY_SECTION_FR_CM = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(PARENT_REPORT_ARTICLES, {}),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_FR_CM = [
  ...BY_SECTION_FR_CM.parents,
  ...BY_SECTION_FR_CM.students,
  ...BY_SECTION_FR_CM["parent-report"],
  ...BY_SECTION_FR_CM.subjects,
];
