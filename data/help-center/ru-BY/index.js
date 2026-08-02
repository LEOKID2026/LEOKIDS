/**
 * Belarus Russian (ru-BY) Help Center sparse overlays on ru-RU base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_RU_BY / ALL_ARTICLES_RU_BY
 * - resolveHelpLocale: treat ru-by as ru-BY (fallback chain ru-BY → ru-RU → en)
 * - getHelpSections / listArticles / getAllArticles branches for ru-BY
 *
 * Section chrome (titles/descriptions) inherits ru-RU SECTIONS_RU_RU unchanged.
 * This layer is for Russian-medium schools/tracks in Belarus — not a Belarusian layer,
 * and not a claim that Russian is the only language of Belarus.
 * Do not wire or create a /by public path from this content layer.
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

export const BY_SECTION_RU_BY = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    PARENT_REPORT_ARTICLES,
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_RU_BY = [
  ...BY_SECTION_RU_BY.parents,
  ...BY_SECTION_RU_BY.students,
  ...BY_SECTION_RU_BY["parent-report"],
  ...BY_SECTION_RU_BY.subjects,
];
