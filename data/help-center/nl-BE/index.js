/**
 * Belgium Dutch (nl-BE) Help Center — sparse overlays on Dutch Netherlands (nl-NL) articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_NL_BE / ALL_ARTICLES_NL_BE / SECTIONS_NL_BE
 * - resolveHelpLocale: treat nl-be as nl-BE (fallback chain nl-BE → nl-NL → en)
 * - getHelpSections / listArticles / getAllArticles branches for nl-BE
 *
 * Section chrome inherits nl-NL SECTIONS_NL_NL unchanged.
 */

import { BY_SECTION_NL_NL, SECTIONS_NL_NL } from "../nl-NL/index.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

/** Same section chrome as nl-NL; country overlay does not retitle hub sections. */
export const SECTIONS_NL_BE = SECTIONS_NL_NL;

export const BY_SECTION_NL_BE = {
  parents: mergeHelpArticlesWithOverlays(BY_SECTION_NL_NL.parents, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(BY_SECTION_NL_NL.students, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": BY_SECTION_NL_NL["parent-report"],
  subjects: mergeHelpArticlesWithOverlays(BY_SECTION_NL_NL.subjects, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_NL_BE = [
  ...BY_SECTION_NL_BE.parents,
  ...BY_SECTION_NL_BE.students,
  ...BY_SECTION_NL_BE["parent-report"],
  ...BY_SECTION_NL_BE.subjects,
];
