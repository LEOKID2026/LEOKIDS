/**
 * Republic of the Congo (fr-CG) Help Center sparse overlays on fr-FR base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_FR_CG / ALL_ARTICLES_FR_CG
 * - resolveHelpLocale: treat fr-cg as fr-CG (fallback chain fr-CG → fr-FR → en)
 * - getHelpSections / listArticles / getAllArticles branches for fr-CG
 *
 * Section chrome (titles/descriptions) inherits fr-FR SECTIONS_FR_FR unchanged.
 * parent-report articles inherit fr-FR with no local override file (no empty overlays).
 *
 * Public path distinction (wiring later): /cg = Republic of the Congo; /cd = DR Congo.
 */

import { PARENT_ARTICLES } from "../fr-FR/parents.js";
import { STUDENT_ARTICLES } from "../fr-FR/students.js";
import { PARENT_REPORT_ARTICLES } from "../fr-FR/parent-report.js";
import { SUBJECT_ARTICLES } from "../fr-FR/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

export const BY_SECTION_FR_CG = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": PARENT_REPORT_ARTICLES,
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_FR_CG = [
  ...BY_SECTION_FR_CG.parents,
  ...BY_SECTION_FR_CG.students,
  ...BY_SECTION_FR_CG["parent-report"],
  ...BY_SECTION_FR_CG.subjects,
];
