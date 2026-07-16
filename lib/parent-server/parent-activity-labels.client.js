/**
 * English labels for parent-assigned activity monitoring (Global parent portal).
 * Function names retain the historical `*He` suffix for import stability.
 */

/** @param {string|null|undefined} status */
export function parentSentActivityStatusLabelHe(status) {
  const s = String(status || "not_started").trim();
  if (s === "in_progress") return "In progress";
  if (s === "submitted") return "Completed";
  return "Not started";
}

export function parentSentActivitiesSectionTitleHe() {
  return "Sent activities";
}

export function parentViewActivityResultsLabelHe() {
  return "View results";
}
