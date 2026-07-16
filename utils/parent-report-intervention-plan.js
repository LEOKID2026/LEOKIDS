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
  let interventionSuccessSignalHe = "Small consistency: same level with fewer repeated mistakes.";
  let interventionStopSignalHe = "If frustration or pushback shows up — stop and shorten further.";
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
    interventionSuccessSignalHe = "After 2–3 short sessions we can see if the pattern repeats — then tighten the focus.";
    interventionStopSignalHe = "If every session turns into a struggle — cut to 5–7 minutes and try again tomorrow.";
    doNowHe = "Short, measurable practice: same task, same level, emphasize reading before answering.";
    avoidNowHe = "Do not draw deep conclusions or raise the level based on a single result.";
  } else if (rootCause === "speed_pressure") {
    interventionDurationBand = sparse ? "very_short" : "short";
    interventionIntensity = capAggressivePlan ? "light" : "focused";
    interventionFormat = capAggressivePlan ? "observation_block" : "guided_practice";
    interventionParentEffort = capAggressivePlan ? "low" : "medium";
    interventionGoal = "accuracy_over_speed";
    stepsHe.push(`On ${displayName}, choose a calm mode (not a marathon) at the same difficulty — accuracy before the clock.`);
    stepsHe.push("Goal: two matching attempts in a row with a quick check before submitting.");
    interventionSuccessSignalHe = "When accuracy holds without time pressure — gradually return to a faster track.";
    interventionStopSignalHe = "If the child rushes again — briefly return to untimed practice.";
    doNowHe = "One short untimed practice, with a pause before submitting.";
    avoidNowHe = "Do not turn a speed weakness into a subject-wide level drop, and do not push for records.";
  } else if (rootCause === "instruction_friction") {
    interventionDurationBand = "very_short";
    interventionIntensity = "light";
    interventionFormat = "guided_practice";
    interventionParentEffort = "medium";
    interventionGoal = "clarity_first";
    stepsHe.push(`One task on ${displayName}: read the wording together, say in one sentence what is asked, then solve.`);
    stepsHe.push("Only one hint after a short independent try — not a chain of hints.");
    interventionSuccessSignalHe = "When the child starts pausing alone before answering — the load is easing.";
    interventionStopSignalHe = "If you stay stuck on hints — shorten the task and return tomorrow.";
    doNowHe = "Short task, clear wording, fewer long explanations during practice.";
    avoidNowHe = "Do not over-explain every item when the hard part is understanding the task.";
  } else if (rootCause === "weak_independence") {
    interventionDurationBand = "short";
    interventionIntensity = capAggressivePlan ? "light" : "focused";
    interventionFormat = "mixed";
    interventionParentEffort = capAggressivePlan ? "low" : "medium";
    interventionGoal = "fade_support";
    stepsHe.push(`On ${displayName}: stage A with brief support, stage B an independent try on the same task, then compare at the end.`);
    stepsHe.push("Increase the independent part only a little when a small success repeats twice.");
    interventionSuccessSignalHe = "When the child mostly finishes stage B alone — expand a little.";
    interventionStopSignalHe = "If independence drops and mistakes rise — return to more guidance for a week.";
    doNowHe = 'Clearly separate "try alone" from "check together at the end".';
    avoidNowHe = "Do not move to advanced before two consistent sessions with reasonable independence.";
  } else if (rootCause === "knowledge_gap" && !capAggressivePlan) {
    interventionDurationBand = sparse ? "short" : "moderate";
    interventionIntensity = sparse ? "focused" : "targeted";
    interventionFormat = "guided_practice";
    interventionParentEffort = sparse ? "medium" : "high";
    interventionGoal = "core_skill_gap";
    stepsHe.push(`On ${displayName}, pick 2–3 typical mistakes and revisit them at the same level — do not expand topics.`);
    stepsHe.push("Twice a week, 8–12 minutes — enough to consolidate if consistent.");
    interventionSuccessSignalHe = "When that mistake type disappears across two sessions in a row — a sign of stabilization.";
    interventionStopSignalHe = "If there is no improvement after two weeks of consistency — pause and review level or wording.";
    doNowHe = "Focused review of similar mistakes at the same difficulty.";
    avoidNowHe = "Do not skip foundations or open too many topics at once.";
  } else if (rootCause === "careless_execution") {
    interventionDurationBand = "very_short";
    interventionIntensity = "light";
    interventionFormat = "independent_practice";
    interventionParentEffort = "low";
    interventionGoal = "execution_habits";
    stepsHe.push(`On ${displayName}, check before submitting: wording → answer → quick review (10 seconds).`);
    interventionSuccessSignalHe = 'Fewer "familiar" mistakes on the same task type.';
    interventionStopSignalHe = "If mistakes run deeper than carelessness — shift to concept reinforcement.";
    doNowHe = "Every task includes a short check pause before finishing.";
    avoidNowHe = "Do not assume a deep knowledge gap when there is partial mastery.";
  } else if (rootCause === "mixed_signal" || rootCause === "early_stage_instability") {
    interventionDurationBand = "very_short";
    interventionIntensity = "light";
    interventionFormat = "observation_block";
    interventionParentEffort = "low";
    interventionGoal = "observe_and_stabilize";
    stepsHe.push(`On ${displayName}, keep the same setup and note small wins — do not change many variables.`);
    interventionSuccessSignalHe = "When two sessions in a row look similar — pick one direction.";
    interventionStopSignalHe = "If the picture changes a lot between sessions — stay with short practice and watch, without a big change.";
    doNowHe = "Continue at the same level and check accuracy after each session.";
    avoidNowHe = "Do not lock onto a single explanation when signals conflict.";
  } else {
    interventionDurationBand = "short";
    interventionIntensity = capAggressivePlan ? "light" : "focused";
    interventionFormat = capAggressivePlan ? "observation_block" : "mixed";
    interventionParentEffort = capAggressivePlan ? "low" : "medium";
    interventionGoal = "balanced_support";
    stepsHe.push(`On ${displayName}, short practice twice a week — one focus per session.`);
    interventionSuccessSignalHe = "Small, consistent improvement in accuracy or fewer repeated mistakes.";
    interventionStopSignalHe = "If there is no movement after two weeks — update how practice is run.";
    doNowHe = "Short, steady practice around the same level.";
    avoidNowHe = "Do not pile on big goals while the picture is still forming.";
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
