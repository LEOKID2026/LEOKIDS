/**
 *    topic-next-step —   .
 *     (merge )     .
 */

import { PARENT_EVIDENCE_VOLUME } from "./parent-report-language/parent-evidence-matrix.js";

export const DEFAULT_TOPIC_NEXT_STEP_CONFIG = {
  /**        —    -topicOverviewRows /   */
  maxTopicRecommendationsPerSubject: 15,

  /**   —   / ;  "  " +   */
  minQuestionsLowConfidence: PARENT_EVIDENCE_VOLUME.PRELIMINARY_MAX,
  /**    /  ( /  ) */
  minQuestionsStepChange: 14,
  minQuestionsAdvanceLevel: 18,
  minQuestionsAdvanceGrade: 22,
  minQuestionsRemediate: 10,

  /** :   1 */
  stabilityVolumeDivisor: 28,
  /**  wrongRatio  mistakePressure */
  stabilityWrongPenaltyCoef: 0.35,
  /**     */
  stabilityMistakePressureMax: 0.45,
  /**   mistakePressure  m/q */
  stabilityMistakeQDivisor: 8,

  /** : 1 - exp(-q/div) */
  confidenceExpDivisor: 20,
  /**  m > q * ratioHigh —   */
  confidenceMistakeRatioHigh: 1.8,
  confidenceMistakeRatioMid: 1,
  confidenceNoiseHigh: 0.75,
  confidenceNoiseMid: 0.88,

  /**   */
  repeatedStruggleAccMax: 52,
  repeatedStruggleMistakesMin: 4,
  repeatedStruggleWrongRatio: 0.42,

  /**   */
  advanceLevelAccMin: 86,
  advanceLevelStabilityMin: 0.52,
  advanceLevelConfidenceMin: 0.48,

  /**   →  (Phase 6) */
  minQuestionsAdvanceToAdvanced: 20,
  advanceToAdvancedAccMin: 75,
  advanceToAdvancedMediumShareMin: 0.6,

  /** ""    —   */
  mistakeDragMistakesMin: 4,
  mistakeDragAccMax: 90,

  /**    remediate */
  remediateAccLo: 54,
  remediateAccHi: 68,

  /**    */
  advanceGradeAccMin: 84,
  advanceGradeStabilityMin: 0.55,
  advanceGradeConfidenceMin: 0.55,

  /**   */
  dropLevelAccMax: 55,
  dropGradeAccMax: 52,

  /**  remediate  */
  remediateBandAccLo: 48,
  remediateBandAccHi: 62,

  /** :      */
  copyMentionMistakesMin: 3,
};
