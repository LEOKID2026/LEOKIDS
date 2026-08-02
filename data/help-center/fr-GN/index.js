/**
 * Guinée (fr-GN) Help Center sparse overlays on fr-FR base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_FR_GN / ALL_ARTICLES_FR_GN
 * - resolveHelpLocale: treat fr-gn as fr-GN (fallback chain fr-GN → fr-FR → en)
 * - getHelpSections / listArticles / getAllArticles branches for fr-GN
 *
 * French UI for primary schooling in Guinea. Does not claim French is the only
 * language spoken in the country. Do not wire registry/public paths here.
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

export const BY_SECTION_FR_GN = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_FR_GN = [
  ...BY_SECTION_FR_GN.parents,
  ...BY_SECTION_FR_GN.students,
  ...BY_SECTION_FR_GN["parent-report"],
  ...BY_SECTION_FR_GN.subjects,
];
