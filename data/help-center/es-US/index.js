/**
 * United States Spanish (es-US) Help Center sparse overlays on es-419 base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_ES_US / ALL_ARTICLES_ES_US
 * - resolveHelpLocale: treat es-us as es-US (fallback chain es-US → es-419 → en)
 * - getHelpSections / listArticles / getAllArticles branches for es-US
 *
 * Section chrome (titles/descriptions) inherits es-419 SECTIONS_ES_419 unchanged.
 */

import { PARENT_ARTICLES } from "../es-419/parents.js";
import { STUDENT_ARTICLES } from "../es-419/students.js";
import { PARENT_REPORT_ARTICLES } from "../es-419/parent-report.js";
import { SUBJECT_ARTICLES } from "../es-419/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";
import { PARENT_REPORT_OVERRIDES_BY_SLUG } from "./parent-report.js";

export const BY_SECTION_ES_US = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    PARENT_REPORT_ARTICLES,
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_ES_US = [
  ...BY_SECTION_ES_US.parents,
  ...BY_SECTION_ES_US.students,
  ...BY_SECTION_ES_US["parent-report"],
  ...BY_SECTION_ES_US.subjects,
];
