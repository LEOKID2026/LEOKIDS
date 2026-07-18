import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
/** @param {string} status */
export function worksheetStatusLabelHe(status) {
  const map = {
    draft: "Draft",
    active: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "active"),
    closed: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "closed"),
    archived: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "archived"),
  };
  return map[String(status || "").toLowerCase()] || status;
}

/** @param {string} mode */
export function worksheetModeLabelHe(mode) {
  const map = {
    pdf_only: "PDF only",
    digital_answers: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "digital_answer_sheet"),
    manual_grading: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "manual_grading"),
  };
  return map[String(mode || "").toLowerCase()] || mode;
}

/** @param {string} gradingStatus */
export function worksheetGradingStatusLabelHe(gradingStatus) {
  const map = {
    not_submitted: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "not_submitted"),
    submitted: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "submitted"),
    pending_review: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "pending_review"),
    partially_checked: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "partially_checked"),
    checked: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "checked"),
    published: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "published"),
  };
  return map[String(gradingStatus || "").toLowerCase()] || gradingStatus;
}

/** @param {string} questionType */
export function worksheetQuestionTypeLabelHe(questionType) {
  const map = {
    multiple_choice: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "multiple_choice"),
    true_false: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "true_false"),
    numeric: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "number"),
    short_answer: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "short_answer"),
    free_text: globalBurnDownCopy("lib__worksheet-activities__worksheet-labels.client", "free_text"),
  };
  return map[String(questionType || "").toLowerCase()] || questionType;
}
