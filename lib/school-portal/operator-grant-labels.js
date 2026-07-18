import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
/** English labels for school operator grants — visible UI only. */

/** @type {Record<string, string>} */
export const OPERATOR_GRANT_LABELS_HE = {
  studentAccessAdmin: globalBurnDownCopy("lib__school-portal__operator-grant-labels", "manage_child_and_parent_access"),
  studentDataViewer: globalBurnDownCopy("lib__school-portal__operator-grant-labels", "view_reports_and_child_details"),
};

/** @param {"studentAccessAdmin"|"studentDataViewer"|string} key */
export function operatorGrantLabel(key) {
  if (key === "studentAccessAdmin") return OPERATOR_GRANT_LABELS_HE.studentAccessAdmin;
  if (key === "studentDataViewer") return OPERATOR_GRANT_LABELS_HE.studentDataViewer;
  return OPERATOR_GRANT_LABELS_HE[key] || "";
}
