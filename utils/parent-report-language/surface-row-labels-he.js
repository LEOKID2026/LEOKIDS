import { reportPackCopy } from "../../lib/reports/report-pack-copy.js";
/**
 * Parent-facing row keys for subject insight cards (replace internal/system tone).
 */

export const SUBJECT_PHASE3_ROW_LABEL_HE = {
  /** Was: system-facing "rows" label */
  topicPatternCounts: reportPackCopy("utils__parent-report-language__surface-row-labels-he", "question_snapshot"),
  /** Was: system-facing "warnings" label */
  majorRisks: reportPackCopy("utils__parent-report-language__surface-row-labels-he", "points_to_note"),
};
