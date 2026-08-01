/**
 * Northern Ireland (en-NIR) Help layer — sparse overlays on en-GB Help
 * (which itself overlays English). Chain: en-NIR → en-GB → en.
 * Does not copy en-GB articles into this folder.
 * Shared Help locale wiring still required in data/help-center/index.js (not done here).
 */
import { BY_SECTION_EN_GB, SECTIONS_EN_GB } from "../en-GB/index.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

/** Same section shell as en-GB / English. */
export const SECTIONS_EN_NIR = SECTIONS_EN_GB;

export const BY_SECTION_EN_NIR = {
  parents: mergeHelpArticlesWithOverlays(BY_SECTION_EN_GB.parents, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(BY_SECTION_EN_GB.students, STUDENT_OVERRIDES_BY_SLUG),
  // parent-report: inherit en-GB Maths chrome with no NIR-identical overlay
  "parent-report": BY_SECTION_EN_GB["parent-report"],
  subjects: mergeHelpArticlesWithOverlays(BY_SECTION_EN_GB.subjects, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_EN_NIR = [
  ...BY_SECTION_EN_NIR.parents,
  ...BY_SECTION_EN_NIR.students,
  ...BY_SECTION_EN_NIR["parent-report"],
  ...BY_SECTION_EN_NIR.subjects,
];
