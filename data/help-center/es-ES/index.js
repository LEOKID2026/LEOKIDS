import { BY_SECTION_ES_419, SECTIONS_ES_419 } from "../es-419/index.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

export const SECTIONS_ES_ES = SECTIONS_ES_419;

export const BY_SECTION_ES_ES = {
  parents: mergeHelpArticlesWithOverlays(BY_SECTION_ES_419.parents, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(BY_SECTION_ES_419.students, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": BY_SECTION_ES_419["parent-report"],
  subjects: mergeHelpArticlesWithOverlays(BY_SECTION_ES_419.subjects, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_ES_ES = [
  ...BY_SECTION_ES_ES.parents,
  ...BY_SECTION_ES_ES.students,
  ...BY_SECTION_ES_ES["parent-report"],
  ...BY_SECTION_ES_ES.subjects,
];
