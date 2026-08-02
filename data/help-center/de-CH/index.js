/**
 * Switzerland (de-CH) Help Center — sparse overlays on German Germany (de-DE) articles.
 * Shared wiring in data/help-center/index.js must resolve de-CH → these exports
 * (resolveHelpLocale, getHelpSections, listArticles). Do not import this from
 * data/help-center/index.js in a way that creates a cycle before wiring lands.
 */
import { BY_SECTION_DE_DE, SECTIONS_DE_DE } from "../de-DE/index.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

/** Same section chrome as de-DE; country overlay does not retitle hub sections. */
export const SECTIONS_DE_CH = SECTIONS_DE_DE;

export const BY_SECTION_DE_CH = {
  parents: mergeHelpArticlesWithOverlays(BY_SECTION_DE_DE.parents, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(BY_SECTION_DE_DE.students, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": BY_SECTION_DE_DE["parent-report"],
  subjects: mergeHelpArticlesWithOverlays(BY_SECTION_DE_DE.subjects, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_DE_CH = [
  ...BY_SECTION_DE_CH.parents,
  ...BY_SECTION_DE_CH.students,
  ...BY_SECTION_DE_CH["parent-report"],
  ...BY_SECTION_DE_CH.subjects,
];
