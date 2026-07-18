import { burnDownCopy } from "../../lib/learning/burn-down-copy.js";
export const STUDENT_GRADE_REQUIRED_MESSAGE =
  "Please choose a grade before you start practicing. Ask a parent to update your grade.";

export const STUDENT_SUBJECT_LOADING_MESSAGE = burnDownCopy("lib__learning-client__student-subject-practice-gate", "loading");

/** @deprecated use STUDENT_GRADE_REQUIRED_MESSAGE */
export const STUDENT_GRADE_REQUIRED_MESSAGE_HE = STUDENT_GRADE_REQUIRED_MESSAGE;

/** @deprecated use STUDENT_SUBJECT_LOADING_MESSAGE */
export const STUDENT_SUBJECT_LOADING_MESSAGE_HE = STUDENT_SUBJECT_LOADING_MESSAGE;
