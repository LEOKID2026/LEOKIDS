/**
 * Suriname Dutch (nl-SR) Help Center — sparse overlays on Dutch Netherlands (nl-NL) articles.
 *
 * Shared wiring still required in data/help-center/index.js:
 * - import BY_SECTION_NL_SR / ALL_ARTICLES_NL_SR / SECTIONS_NL_SR
 * - resolveHelpLocale: treat nl-sr as nl-SR (fallback chain nl-SR → nl-NL → en)
 * - getHelpSections / listArticles / getAllArticles branches for nl-SR
 *
 * Section chrome inherits nl-NL SECTIONS_NL_NL unchanged.
 */

import { BY_SECTION_NL_NL, SECTIONS_NL_NL } from "../nl-NL/index.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

/** Same section chrome as nl-NL; country overlay does not retitle hub sections. */
export const SECTIONS_NL_SR = SECTIONS_NL_NL;

export const BY_SECTION_NL_SR = {
  parents: mergeHelpArticlesWithOverlays(BY_SECTION_NL_NL.parents, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(BY_SECTION_NL_NL.students, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": BY_SECTION_NL_NL["parent-report"],
  subjects: mergeHelpArticlesWithOverlays(BY_SECTION_NL_NL.subjects, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_NL_SR = [
  ...BY_SECTION_NL_SR.parents,
  ...BY_SECTION_NL_SR.students,
  ...BY_SECTION_NL_SR["parent-report"],
  ...BY_SECTION_NL_SR.subjects,
];
