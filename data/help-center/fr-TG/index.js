/**
 * Togo (fr-TG) Help Center sparse overlays on fr-FR base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_FR_TG / ALL_ARTICLES_FR_TG
 * - resolveHelpLocale: treat fr-tg as fr-TG (fallback chain fr-TG → fr-FR → en)
 * - getHelpSections / listArticles / getAllArticles branches for fr-TG
 *
 * French is used in Togo's formal primary education; this layer does not claim
 * French is the only language spoken in the country. Do not wire /tg here.
 */

import { PARENT_ARTICLES } from "../fr-FR/parents.js";
import { STUDENT_ARTICLES } from "../fr-FR/students.js";
import { PARENT_REPORT_ARTICLES } from "../fr-FR/parent-report.js";
import { SUBJECT_ARTICLES } from "../fr-FR/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

export const BY_SECTION_FR_TG = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(PARENT_REPORT_ARTICLES, {}),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_FR_TG = [
  ...BY_SECTION_FR_TG.parents,
  ...BY_SECTION_FR_TG.students,
  ...BY_SECTION_FR_TG["parent-report"],
  ...BY_SECTION_FR_TG.subjects,
];
