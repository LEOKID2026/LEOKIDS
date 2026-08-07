/**
 * Algeria (ar-DZ) Help layer — sparse overlays on Arabic Master (ar-001).
 * Chain (planned): ar-DZ overlays → ar-001 Help → en.
 * Shared Help locale wiring remains for the main agent.
 */
import { BY_SECTION_AR_001, SECTIONS_AR_001 } from "../ar-001/index.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { PARENT_REPORT_OVERRIDES_BY_SLUG } from "./parent-report.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

export const SECTIONS_AR_DZ = SECTIONS_AR_001;

export const BY_SECTION_AR_DZ = {
  parents: mergeHelpArticlesWithOverlays(BY_SECTION_AR_001.parents, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(BY_SECTION_AR_001.students, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": mergeHelpArticlesWithOverlays(
    BY_SECTION_AR_001["parent-report"],
    PARENT_REPORT_OVERRIDES_BY_SLUG
  ),
  subjects: mergeHelpArticlesWithOverlays(BY_SECTION_AR_001.subjects, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_AR_DZ = [
  ...BY_SECTION_AR_DZ.parents,
  ...BY_SECTION_AR_DZ.students,
  ...BY_SECTION_AR_DZ["parent-report"],
  ...BY_SECTION_AR_DZ.subjects,
];
