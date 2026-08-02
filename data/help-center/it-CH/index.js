/**
 * Switzerland Italian (it-CH) Help Center sparse overlays on it-IT base articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_IT_CH / ALL_ARTICLES_IT_CH
 * - resolveHelpLocale: treat it-ch as it-CH (fallback chain it-CH → it-IT → en)
 * - getHelpSections / listArticles / getAllArticles branches for it-CH
 *
 * Section chrome (titles/descriptions) inherits it-IT SECTIONS unchanged.
 */

import { PARENT_ARTICLES } from "../it-IT/parents.js";
import { STUDENT_ARTICLES } from "../it-IT/students.js";
import { PARENT_REPORT_ARTICLES } from "../it-IT/parent-report.js";
import { SUBJECT_ARTICLES } from "../it-IT/subjects.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";
import { PARENT_REPORT_OVERRIDES_BY_SLUG } from "./parent-report.js";

export const BY_SECTION_IT_CH = {
  parents: mergeHelpArticlesWithOverlays(PARENT_ARTICLES, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(STUDENT_ARTICLES, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    PARENT_REPORT_ARTICLES,
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(SUBJECT_ARTICLES, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_IT_CH = [
  ...BY_SECTION_IT_CH.parents,
  ...BY_SECTION_IT_CH.students,
  ...BY_SECTION_IT_CH["parent-report"],
  ...BY_SECTION_IT_CH.subjects,
];
