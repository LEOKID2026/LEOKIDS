/**
 * Uzbekistan Russian-medium (ru-UZ) Help Center sparse overlays on ru-RU base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_RU_UZ / ALL_ARTICLES_RU_UZ
 * - resolveHelpLocale: treat ru-uz as ru-UZ (fallback chain ru-UZ → ru-RU → en)
 * - getHelpSections / listArticles / getAllArticles branches for ru-UZ
 *
 * Section chrome (titles/descriptions) inherits ru-RU SECTIONS_RU_RU unchanged.
 * This layer is for Russian-medium schools/tracks in Uzbekistan — not a national Uzbek layer.
 */

import { PARENT_ARTICLES } from "../ru-RU/parents.js";
import { STUDENT_ARTICLES } from "../ru-RU/students.js";
import { PARENT_REPORT_ARTICLES } from "../ru-RU/parent-report.js";
import { SUBJECT_ARTICLES } from "../ru-RU/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";
import { PARENT_REPORT_OVERRIDES_BY_SLUG } from "./parent-report.js";

export const BY_SECTION_RU_UZ = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    PARENT_REPORT_ARTICLES,
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_RU_UZ = [
  ...BY_SECTION_RU_UZ.parents,
  ...BY_SECTION_RU_UZ.students,
  ...BY_SECTION_RU_UZ["parent-report"],
  ...BY_SECTION_RU_UZ.subjects,
];
