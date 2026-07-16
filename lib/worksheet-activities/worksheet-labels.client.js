/** @param {string} status */
export function worksheetStatusLabelHe(status) {
  const map = {
    draft: "Draft",
    active: "Active",
    closed: "Closed",
    archived: "Archived",
  };
  return map[String(status || "").toLowerCase()] || status;
}

/** @param {string} mode */
export function worksheetModeLabelHe(mode) {
  const map = {
    pdf_only: "PDF only",
    digital_answers: "Digital answer sheet",
    manual_grading: "Manual grading",
  };
  return map[String(mode || "").toLowerCase()] || mode;
}

/** @param {string} gradingStatus */
export function worksheetGradingStatusLabelHe(gradingStatus) {
  const map = {
    not_submitted: "Not submitted",
    submitted: "Submitted",
    pending_review: "Pending review",
    partially_checked: "Partially checked",
    checked: "Checked",
    published: "Published",
  };
  return map[String(gradingStatus || "").toLowerCase()] || gradingStatus;
}

/** @param {string} questionType */
export function worksheetQuestionTypeLabelHe(questionType) {
  const map = {
    multiple_choice: "Multiple choice",
    true_false: "True / False",
    numeric: "Number",
    short_answer: "Short answer",
    free_text: "Free text",
  };
  return map[String(questionType || "").toLowerCase()] || questionType;
}
