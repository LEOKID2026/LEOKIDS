/**
 * Egypt (ar-EG) Help layer — sparse overlays on Arabic Master (ar-001).
 * Chain: ar-EG overlays → ar-001 Help → en.
 * Shared Help locale wiring remains for the main agent.
 */
import { BY_SECTION_AR_001, SECTIONS_AR_001 } from "../ar-001/index.js";
import { mergeHelpArticlesWithOverlays } from "./merge-overlays.js";
import { PARENT_OVERRIDES_BY_SLUG } from "./parents.js";
import { SUBJECT_OVERRIDES_BY_SLUG } from "./subjects.js";

export const SECTIONS_AR_EG = SECTIONS_AR_001;

export const BY_SECTION_AR_EG = {
  parents: mergeHelpArticlesWithOverlays(BY_SECTION_AR_001.parents, PARENT_OVERRIDES_BY_SLUG),
  students: BY_SECTION_AR_001.students,
  "parent-report": BY_SECTION_AR_001["parent-report"],
  subjects: mergeHelpArticlesWithOverlays(BY_SECTION_AR_001.subjects, SUBJECT_OVERRIDES_BY_SLUG),
};

export const ALL_ARTICLES_AR_EG = [
  ...BY_SECTION_AR_EG.parents,
  ...BY_SECTION_AR_EG.students,
  ...BY_SECTION_AR_EG["parent-report"],
  ...BY_SECTION_AR_EG.subjects,
];
