/**
 * Cabo Verde (pt-CV) Help layer — sparse overlays on pt-PT Help
 * (which overlays pt-BR).
 * Chain: pt-CV overlays → pt-PT Help → pt-BR Help.
 * Shared Help locale wiring remains for the main agent.
 */
import { BY_SECTION_PT_PT, SECTIONS_PT_PT } from "../pt-PT/index.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { STUDENT_OVERRIDES_BY_SLUG } from "./students.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

export const SECTIONS_PT_CV = SECTIONS_PT_PT;

export const BY_SECTION_PT_CV = {
  parents: mergeHelpArticlesWithOverlays(BY_SECTION_PT_PT.parents, PARENT_OVERRIDES_BY_SLUG),
  students: mergeHelpArticlesWithOverlays(BY_SECTION_PT_PT.students, STUDENT_OVERRIDES_BY_SLUG),
  "parent-report": BY_SECTION_PT_PT["parent-report"],
  subjects: mergeHelpArticlesWithOverlays(BY_SECTION_PT_PT.subjects, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_PT_CV = [
  ...BY_SECTION_PT_CV.parents,
  ...BY_SECTION_PT_CV.students,
  ...BY_SECTION_PT_CV["parent-report"],
  ...BY_SECTION_PT_CV.subjects,
];
