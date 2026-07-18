import { reportPackCopy } from "../lib/reports/report-pack-copy.js";
/**
 * Phase 8 — micro intervention plan for a topic row (based on Phase 7).
 * Pure logic; not React-dependent.
 */

/**
 * @typedef {"very_short"|"short"|"moderate"} InterventionDurationBand
 * @typedef {"light"|"focused"|"targeted"} InterventionIntensity
 * @typedef {"guided_practice"|"independent_practice"|"mixed"|"observation_block"} InterventionFormat
 * @typedef {"low"|"medium"|"high"} InterventionParentEffort
 */

/**
 * @param {object} ctx
 * @param {string} ctx.rootCause
 * @param {string} [ctx.rootCauseLabelHe]
 * @param {string} ctx.conclusionStrength
 * @param {boolean} ctx.shouldAvoidStrongConclusion
 * @param {string} ctx.recommendedInterventionType
 * @param {string} ctx.finalStep
 * @param {number} ctx.q
 * @param {number} ctx.accuracy
 * @param {string} [ctx.dataSufficiencyLevel]
 * @param {string} [ctx.evidenceStrength]
 * @param {string} [ctx.displayName]
 * @param {{ dominantMistakePattern?: string, learningStage?: string, retentionRisk?: string }|null} [ctx.phase9]
 */
export function buildInterventionPlanPhase8(ctx) {
  const rootCause = String(ctx?.rootCause || "mixed_signal");
  const conclusionStrength = String(ctx?.conclusionStrength || "moderate");
  const shouldAvoid = !!ctx?.shouldAvoidStrongConclusion;
  const sparse = (Number(ctx?.q) || 0) < 10 || String(ctx?.evidenceStrength || "") === "low";
  const displayName = String(ctx?.displayName || "the topic").trim();

  let interventionDurationBand /** @type {InterventionDurationBand} */ = "short";
  let interventionIntensity /** @type {InterventionIntensity} */ = "focused";
  let interventionFormat /** @type {InterventionFormat} */ = "mixed";
  let interventionParentEffort /** @type {InterventionParentEffort} */ = "medium";
  let interventionGoal = "stabilize_signal";
  /** @type {string[]} */
  const stepsHe = [];
  let interventionSuccessSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "small_consistency_same_level_with_fewer_repeated_mistakes");
  let interventionStopSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "if_frustration_or_pushback_shows_up_stop_and_shorten_further");
  let doNowHe = "";
  let avoidNowHe = "";

  const capAggressivePlan = shouldAvoid || conclusionStrength === "withheld" || conclusionStrength === "tentative";

  if (rootCause === "insufficient_evidence" || conclusionStrength === "withheld") {
    interventionDurationBand = "very_short";
    interventionIntensity = "light";
    interventionFormat = "observation_block";
    interventionParentEffort = "low";
    interventionGoal = "collect_evidence";
    stepsHe.push(`Watch 2–3 short practice sessions on ${displayName} at the same difficulty — only note whether the child reads the task before answering.`);
    stepsHe.push("Do not change grade or level at home at this stage.");
    interventionSuccessSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "after_2_3_short_sessions_we_can_see_if_the_pattern_repeats_then_tighten_");
    interventionStopSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "if_every_session_turns_into_a_struggle_cut_to_5_7_minutes_and_try_again_");
    doNowHe = reportPackCopy("utils__parent-report-intervention-plan", "short_measurable_practice_same_task_same_level_emphasize_reading_before_");
    avoidNowHe = reportPackCopy("utils__parent-report-intervention-plan", "do_not_draw_deep_conclusions_or_raise_the_level_based_on_a_single_result");
  } else if (rootCause === "speed_pressure") {
    interventionDurationBand = sparse ? "very_short" : "short";
    interventionIntensity = capAggressivePlan ? "light" : "focused";
    interventionFormat = capAggressivePlan ? "observation_block" : "guided_practice";
    interventionParentEffort = capAggressivePlan ? "low" : "medium";
    interventionGoal = "accuracy_over_speed";
    stepsHe.push(`On ${displayName}, choose a calm mode (not a marathon) at the same difficulty — accuracy before the clock.`);
    stepsHe.push("Goal: two matching attempts in a row with a quick check before submitting.");
    interventionSuccessSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "when_accuracy_holds_without_time_pressure_gradually_return_to_a_faster_t");
    interventionStopSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "if_the_child_rushes_again_briefly_return_to_untimed_practice");
    doNowHe = reportPackCopy("utils__parent-report-intervention-plan", "one_short_untimed_practice_with_a_pause_before_submitting");
    avoidNowHe = reportPackCopy("utils__parent-report-intervention-plan", "do_not_turn_a_speed_weakness_into_a_subject_wide_level_drop_and_do_not_p");
  } else if (rootCause === "instruction_friction") {
    interventionDurationBand = "very_short";
    interventionIntensity = "light";
    interventionFormat = "guided_practice";
    interventionParentEffort = "medium";
    interventionGoal = "clarity_first";
    stepsHe.push(`One task on ${displayName}: read the wording together, say in one sentence what is asked, then solve.`);
    stepsHe.push("Only one hint after a short independent try — not a chain of hints.");
    interventionSuccessSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "when_the_child_starts_pausing_alone_before_answering_the_load_is_easing");
    interventionStopSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "if_you_stay_stuck_on_hints_shorten_the_task_and_return_tomorrow");
    doNowHe = reportPackCopy("utils__parent-report-intervention-plan", "short_task_clear_wording_fewer_long_explanations_during_practice");
    avoidNowHe = reportPackCopy("utils__parent-report-intervention-plan", "do_not_over_explain_every_item_when_the_hard_part_is_understanding_the_t");
  } else if (rootCause === "weak_independence") {
    interventionDurationBand = "short";
    interventionIntensity = capAggressivePlan ? "light" : "focused";
    interventionFormat = "mixed";
    interventionParentEffort = capAggressivePlan ? "low" : "medium";
    interventionGoal = "fade_support";
    stepsHe.push(`On ${displayName}: stage A with brief support, stage B an independent try on the same task, then compare at the end.`);
    stepsHe.push("Increase the independent part only a little when a small success repeats twice.");
    interventionSuccessSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "when_the_child_mostly_finishes_stage_b_alone_expand_a_little");
    interventionStopSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "if_independence_drops_and_mistakes_rise_return_to_more_guidance_for_a_we");
    doNowHe = 'Clearly separate "try alone" from "check together at the end".';
    avoidNowHe = reportPackCopy("utils__parent-report-intervention-plan", "do_not_move_to_advanced_before_two_consistent_sessions_with_reasonable_i");
  } else if (rootCause === "knowledge_gap" && !capAggressivePlan) {
    interventionDurationBand = sparse ? "short" : "moderate";
    interventionIntensity = sparse ? "focused" : "targeted";
    interventionFormat = "guided_practice";
    interventionParentEffort = sparse ? "medium" : "high";
    interventionGoal = "core_skill_gap";
    stepsHe.push(`On ${displayName}, pick 2–3 typical mistakes and revisit them at the same level — do not expand topics.`);
    stepsHe.push("Twice a week, 8–12 minutes — enough to consolidate if consistent.");
    interventionSuccessSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "when_that_mistake_type_disappears_across_two_sessions_in_a_row_a_sign_of");
    interventionStopSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "if_there_is_no_improvement_after_two_weeks_of_consistency_pause_and_revi");
    doNowHe = reportPackCopy("utils__parent-report-intervention-plan", "focused_review_of_similar_mistakes_at_the_same_difficulty");
    avoidNowHe = reportPackCopy("utils__parent-report-intervention-plan", "do_not_skip_foundations_or_open_too_many_topics_at_once");
  } else if (rootCause === "careless_execution") {
    interventionDurationBand = "very_short";
    interventionIntensity = "light";
    interventionFormat = "independent_practice";
    interventionParentEffort = "low";
    interventionGoal = "execution_habits";
    stepsHe.push(`On ${displayName}, check before submitting: wording → answer → quick review (10 seconds).`);
    interventionSuccessSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "fewer_familiar_mistakes_same_task_type");
    interventionStopSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "if_mistakes_run_deeper_than_carelessness_shift_to_concept_reinforcement");
    doNowHe = reportPackCopy("utils__parent-report-intervention-plan", "every_task_includes_a_short_check_pause_before_finishing");
    avoidNowHe = reportPackCopy("utils__parent-report-intervention-plan", "do_not_assume_a_deep_knowledge_gap_when_there_is_partial_mastery");
  } else if (rootCause === "mixed_signal" || rootCause === "early_stage_instability") {
    interventionDurationBand = "very_short";
    interventionIntensity = "light";
    interventionFormat = "observation_block";
    interventionParentEffort = "low";
    interventionGoal = "observe_and_stabilize";
    stepsHe.push(`On ${displayName}, keep the same setup and note small wins — do not change many variables.`);
    interventionSuccessSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "when_two_sessions_in_a_row_look_similar_pick_one_direction");
    interventionStopSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "if_the_picture_changes_a_lot_between_sessions_stay_with_short_practice_a");
    doNowHe = reportPackCopy("utils__parent-report-intervention-plan", "continue_at_the_same_level_and_check_accuracy_after_each_session");
    avoidNowHe = reportPackCopy("utils__parent-report-intervention-plan", "do_not_lock_onto_a_single_explanation_when_signals_conflict");
  } else {
    interventionDurationBand = "short";
    interventionIntensity = capAggressivePlan ? "light" : "focused";
    interventionFormat = capAggressivePlan ? "observation_block" : "mixed";
    interventionParentEffort = capAggressivePlan ? "low" : "medium";
    interventionGoal = "balanced_support";
    stepsHe.push(`On ${displayName}, short practice twice a week — one focus per session.`);
    interventionSuccessSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "small_consistent_improvement_in_accuracy_or_fewer_repeated_mistakes");
    interventionStopSignalHe = reportPackCopy("utils__parent-report-intervention-plan", "if_there_is_no_movement_after_two_weeks_update_how_practice_is_run");
    doNowHe = reportPackCopy("utils__parent-report-intervention-plan", "short_steady_practice_around_the_same_level");
    avoidNowHe = reportPackCopy("utils__parent-report-intervention-plan", "do_not_pile_on_big_goals_while_the_picture_is_still_forming");
  }

  if (capAggressivePlan && interventionIntensity === "targeted") {
    interventionIntensity = "focused";
  }
  if (capAggressivePlan && interventionFormat === "guided_practice" && rootCause === "knowledge_gap") {
    interventionFormat = "mixed";
    interventionParentEffort = "medium";
  }

  const p9 = ctx?.phase9 && typeof ctx.phase9 === "object" ? ctx.phase9 : null;
  const mp9 = String(p9?.dominantMistakePattern || "");
  const ls9 = String(p9?.learningStage || "");
  const rr9 = String(p9?.retentionRisk || "");
  if (mp9 === "concept_confusion" && stepsHe.length && !capAggressivePlan) {
    stepsHe.push(`Pattern fit: isolate one key sentence on ${displayName} and revisit it before expanding.`);
  } else if (mp9 === "procedure_break" && stepsHe.length) {
    stepsHe.push("Pattern fit: write one intermediate step at a time — do not jump straight to the final answer.");
  } else if (mp9 === "speed_driven_error") {
    if (doNowHe && !doNowHe.includes("timer") && !doNowHe.includes("untimed"))
      doNowHe = `${doNowHe} No timer at this stage.`.trim();
  } else if (mp9 === "instruction_misread" && stepsHe.length) {
    stepsHe.push("Pattern fit: read the task aloud and say in one word what is asked — then solve.");
  }
  if (ls9 === "fragile_retention" || ls9 === "regression_signal" || rr9 === "high") {
    if (!avoidNowHe.includes("expand") && !avoidNowHe.includes("advance"))
      avoidNowHe = `${avoidNowHe || "Do not overload."} Do not expand level before a short refresh.`.trim();
  }
  if (ls9 === "transfer_emerging" && doNowHe && !doNowHe.includes("independent")) {
    doNowHe = `${doNowHe} A short independent try, then check together, is fine.`.trim();
  }

  const interventionPlan = {
    version: 1,
    rootCause,
    headlineHe: `Micro plan for ${displayName}`,
    stepsHe: [...stepsHe],
    cadenceHe:
      interventionDurationBand === "very_short"
        ? "2–3 short sessions per week (5–8 minutes)"
        : interventionDurationBand === "short"
          ? "2 sessions per week (about 8–12 minutes)"
          : "2–3 sessions per week (up to ~15 minutes)",
  };

  const interventionPlanHe = [interventionPlan.headlineHe, ...stepsHe, interventionPlan.cadenceHe]
    .filter(Boolean)
    .join(" ");

  return {
    interventionPlan,
    interventionPlanHe,
    interventionDurationBand,
    interventionIntensity,
    interventionFormat,
    interventionGoal,
    interventionSuccessSignalHe,
    interventionStopSignalHe,
    interventionParentEffort,
    doNowHe,
    avoidNowHe,
  };
}
