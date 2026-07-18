/**
 * Next diagnostic probes / actions (educational).
 */

import { burnDownCopy } from "../../lib/learning/burn-down-copy.js";
import { PROFESSIONAL_FRAMEWORK_V1 } from "./diagnostic-framework-v1.js";

export const PROBE_ENGINE_V1 = "1.0.0";

const PROBE_TYPES = [
  "collect_more_data",
  "targeted_skill",
  "prerequisite_check",
  "difficulty_sweep",
  "misconception_confirmation",
  "cross_subject_check",
  "challenge_advance",
];

/**
 * @param {object} ctx
 * @param {string} [ctx.thinData]
 * @param {string} [ctx.suspectedMisconception]
 * @param {string} [ctx.prerequisiteUncertainty]
 * @param {string} [ctx.targetSubjectId]
 * @param {string} [ctx.targetSkillId]
 * @param {boolean} [ctx.strongMasterySignal]
 */
export function buildProbeRecommendationsV1(ctx = {}) {
  const out = [];
  const t = String(ctx.thinData || "");
  if (t === "true" || ctx.volumeHint === "low") {
    out.push({
      probeReason: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "thin_practice_window_need_more_observations_before_stable_interpretation"),
      targetSubjectId: ctx.targetSubjectId || null,
      targetSkillId: null,
      targetSubskillId: null,
      probeType: "collect_more_data",
      recommendedQuestionTypes: ["mcq", "short_set"],
      numberOfQuestions: 8,
      successCriteria: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "stable_accuracy_over_at_least_two_sessions"),
      failureCriteria: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "continued_random_incorrect_pattern_without_convergence"),
      nextDecisionAfterProbe: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "re_evaluate_mastery_and_misconceptions"),
    });
  }

  if (ctx.suspectedMisconception) {
    out.push({
      probeReason: `Suspected misconception signal: ${ctx.suspectedMisconception}`,
      targetSubjectId: ctx.targetSubjectId || null,
      targetSkillId: ctx.targetSkillId || null,
      targetSubskillId: ctx.targetSubskillId || null,
      probeType: "misconception_confirmation",
      recommendedQuestionTypes: ["mcq"],
      numberOfQuestions: 3,
      successCriteria: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "consistent_correct_responses_on_parallel_items"),
      failureCriteria: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "repeated_same_distractor_selection"),
      nextDecisionAfterProbe: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "escalate_practice_specificity"),
    });
  }

  if (ctx.prerequisiteUncertainty) {
    out.push({
      probeReason: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "prerequisite_strengths_unclear_relative_to_advanced_skill"),
      targetSubjectId: ctx.targetSubjectId || null,
      targetSkillId: ctx.prerequisiteSkillId || null,
      targetSubskillId: null,
      probeType: "prerequisite_check",
      recommendedQuestionTypes: ["mcq"],
      numberOfQuestions: 4,
      successCriteria: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "prerequisite_skill_shows_independent_accuracy"),
      failureCriteria: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "prerequisite_remains_unstable"),
      nextDecisionAfterProbe: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "foundation_review_vs_isolated_advanced_gap"),
    });
  }

  if (ctx.strongMasterySignal) {
    out.push({
      probeReason: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "strong_observed_mastery_with_adequate_volume_optional_challenge_probe_to"),
      targetSubjectId: ctx.strongMasterySubjectId || ctx.targetSubjectId || null,
      targetSkillId: ctx.strongMasterySkillId || ctx.targetSkillId || null,
      targetSubskillId: null,
      probeType: "challenge_advance",
      recommendedQuestionTypes: ["mcq", "multi_step"],
      numberOfQuestions: 3,
      successCriteria: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "maintains_accuracy_on_harder_parallel_items"),
      failureCriteria: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "breakdown_on_increased_complexity"),
      nextDecisionAfterProbe: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "adjust_level_or_add_scaffolded_practice"),
    });
  }

  if (out.length === 0) {
    out.push({
      probeReason: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "default_maintenance_probe_confirm_stability"),
      targetSubjectId: ctx.targetSubjectId || null,
      targetSkillId: ctx.targetSkillId || null,
      targetSubskillId: null,
      probeType: "targeted_skill",
      recommendedQuestionTypes: ["mcq"],
      numberOfQuestions: 2,
      successCriteria: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "meet_or_exceed_recent_accuracy_band"),
      failureCriteria: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "accuracy_drops_materially"),
      nextDecisionAfterProbe: burnDownCopy("utils__learning-diagnostics__probe-engine-v1", "adjust_practice_plan"),
    });
  }

  return {
    version: PROBE_ENGINE_V1,
    probeTypesEnum: PROBE_TYPES,
    recommendationTypeEnum: PROFESSIONAL_FRAMEWORK_V1.recommendationTypeEnum,
    probes: out,
  };
}
