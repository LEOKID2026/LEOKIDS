/**
 * Cross-subject pattern hints (cautious educational language only).
 */

import { burnDownCopy } from "../../lib/learning/burn-down-copy.js";
import { getSubjectAccuracyFromSummary, getSubjectQuestionTotalFromSummary } from "./diagnostic-framework-v1.js";

export const CROSS_SUBJECT_ENGINE_V1 = "1.0.0";

/**
 * @param {Record<string, Record<string, unknown>>} maps
 * @param {Record<string, unknown>} summaryCounts
 */
export function detectCrossSubjectPatternsV1(maps, summaryCounts) {
  /** @type {object[]} */
  const patterns = [];

  const mathQ = getSubjectQuestionTotalFromSummary(summaryCounts, "math");
  const engQ = getSubjectQuestionTotalFromSummary(summaryCounts, "english");
  const sciQ = getSubjectQuestionTotalFromSummary(summaryCounts, "science");
  const geoQ = getSubjectQuestionTotalFromSummary(summaryCounts, "geometry");

  const mathAcc = getSubjectAccuracyFromSummary(summaryCounts, "math");

  const weakWordProblems =
    maps?.math &&
    Object.values(maps.math).some(
      (r) =>
        r &&
        String(r.displayName || "").toLowerCase().includes("word") &&
        Number(r.accuracy) < 65 &&
        Number(r.questions) >= 5
    );


  const sciWeak =
    Number.isFinite(getSubjectAccuracyFromSummary(summaryCounts, "science")) &&
    getSubjectAccuracyFromSummary(summaryCounts, "science") < 68 &&
    sciQ >= 8;


  return {
    version: CROSS_SUBJECT_ENGINE_V1,
    patterns,
    note: burnDownCopy("utils__learning-diagnostics__cross-subject-engine-v1", "patterns_require_evidence_in_multiple_subjects_thin_single_subject_data_")};
}
