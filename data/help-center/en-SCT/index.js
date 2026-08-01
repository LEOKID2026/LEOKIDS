/**
 * Scotland (en-SCT) Help layer — sparse overlays on en-GB Help (which overlays en).
 * Chain: en-SCT overlays → en-GB Help → en Help.
 * Shared Help locale wiring remains in data/help-center/index.js.
 */
import { BY_SECTION_EN_GB, SECTIONS_EN_GB } from "../en-GB/index.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

export const SECTIONS_EN_SCT = SECTIONS_EN_GB;

export const BY_SECTION_EN_SCT = {
  parents: mergeHelpArticlesWithOverlays(BY_SECTION_EN_GB.parents, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(BY_SECTION_EN_GB.students, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": BY_SECTION_EN_GB["parent-report"],
  subjects: mergeHelpArticlesWithOverlays(BY_SECTION_EN_GB.subjects, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_EN_SCT = [
  ...BY_SECTION_EN_SCT.parents,
  ...BY_SECTION_EN_SCT.students,
  ...BY_SECTION_EN_SCT["parent-report"],
  ...BY_SECTION_EN_SCT.subjects,
];
