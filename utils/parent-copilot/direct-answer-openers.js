/**
 * Short parent-facing direct openers (behavior class), prepended before grounded contract text.
 * Must stay bounded and non-meta; specifics follow from contract slots.
 */

/**
 * @param {string} intent
 * @param {object} truthPacket
 */
export function parentDirectOpenerHe(intent, truthPacket) {
  const k = String(intent || "").trim();
  const dl = truthPacket?.derivedLimits || {};
  const exec = String(truthPacket?.scopeType || "") === "executive";
  const recOk = !!dl.recommendationEligible && String(dl.recommendationIntensityCap || "RI0") !== "RI0";
  const fragile = !!dl.cannotConcludeYet || String(dl.confidenceBand || "") === "low" || String(dl.readiness || "") === "insufficient";
  const sfQ = Math.max(0, Number(truthPacket?.surfaceFacts?.questions ?? 0));
  const sfA = Math.max(0, Number(truthPacket?.surfaceFacts?.accuracy ?? 0));
  /** Enough practice in-window to avoid «no basis» framing for action intents (executive rollup). */
  const practiceLooksSubstantial = sfQ >= 90 && sfA >= 50;

  switch (k) {
    case "explain_report":
    case "ask_topic_specific":
    case "ask_subject_specific":
      return exec
        ? "Here is what appears in the report regarding the period:"
        : "Here is what appears in the report regarding this issue:";
    case "what_is_most_important":
      return fragile
        ? "There are some areas that are still unstable - you should start with them:"
        : exec
          ? ""
          : "Here is what you should pay attention to first according to the report:";
    case "what_to_do_today":
    case "what_to_do_this_week":
      if (recOk) {
        if (exec) return "";
        return k === "what_to_do_today"
          ? "Here is what you should do today according to the data:"
          : "Here is the recommended step for the coming week according to the data:";
      }
      if (practiceLooksSubstantial && !fragile) {
        return k === "what_to_do_today"
          ? "There is enough data to choose a small and focused step for today:"
          : "In the coming week you can choose a short and focused practice:";
      }
      if (practiceLooksSubstantial && fragile) {
        return "There is a lot of practice in the report, but some of the wording is still cautious - it's better to take small, measurable steps:";
      }
      return k === "what_to_do_today"
        ? "You should start with a small step and gain more practice:"
        : "You should gain more practice - here is an initial direction:";
    case "why_not_advance":
      return "Stopping a promotion at a level is usually related to a formulation that has not yet been closed in the report - not necessarily a failure.";
    case "what_is_going_well":
      return exec ? "" : "Here is what seems relatively strong in practice, according to the report:";
    case "what_is_still_difficult":
      return "Here is what still requires strengthening and practice, according to the report:";
    case "how_to_tell_child":
      return "One calm sentence about what you see in the report is better, and only then a short meaningful sentence - in simple language.";
    case "question_for_teacher":
      return "A good question for the teacher indicates what appears in the report - short and specific.";
    case "is_intervention_needed":
      return fragile
        ? "The report shows some areas that are not yet fully populated. This is not necessarily a \"serious problem\":"
        : exec
          ? ""
          : "At this stage there is no reason for great concern according to the report. Here is what appears:";
    case "clarify_term":
      return "Staying with the words that appear in the report itself:";
    case "strength_vs_weakness_summary":
      return "Here are the two directions that the report presents - which is stronger and which still requires work:";
    case "off_topic_redirect":
    case "simple_parent_explanation":
      return "";
    default:
      return exec ? "" : "";
  }
}

export default { parentDirectOpenerHe };
