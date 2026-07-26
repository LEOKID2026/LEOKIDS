/**
 * English parent-safe copy for ActionDecisionContractV2 (ADC). Same exports and
 * object shape as the Hebrew source (parent-action-decision-translations-he.js) —
 * only the rendered strings are English. Field names keep the historical "He"
 * suffix for API stability (see HEBREW_SINGULAR_VIOLATION_RE convention in
 * parent-engine-decision-contract-v2.js); the VALUES here are English-only.
 */
const COPY = Object.freeze({
  insufficient_information:
    "There isn't enough practice yet to determine whether reinforcement is needed. A few more practice questions would help.",
  verification_needed:
    "A mistake type has appeared that's worth checking with a few focused questions before changing the practice.",
  strengthening_needed:
    "A difficulty in {{topic}} has come up a few times during independent practice. A short, focused practice session would help.",
  progress_or_mastery:
    "No change to the learning path in {{topic}} was selected.",
});

const LABELS = Object.freeze({
  insufficient_information: "Need more information",
  verification_needed: "Verification check",
  strengthening_needed: "Temporary reinforcement",
  progress_or_mastery: "Continue on path",
});

const STRENGTHENING_ACTIONS = new Set([
  "practice_more",
  "targeted_practice",
  "strengthen_prerequisite",
  "remove_timer",
  "reduce_reading_load",
  "guided_to_independent_transition",
]);

export function parentActionDisplayStateV1(action) {
  if (action === "collect_more_evidence") return "insufficient_information";
  if (action === "give_probe_questions") return "verification_needed";
  if (STRENGTHENING_ACTIONS.has(action)) return "strengthening_needed";
  return "progress_or_mastery";
}

function fillTopic(template, topic) {
  return String(template || "").replace("{{topic}}", topic || "this topic");
}

/**
 * ADC-only: what the system will do next — never replaces DE2 finding text.
 * @param {Record<string, unknown>|null|undefined} contract
 * @param {{ topicLabel?: string }} [opts]
 */
export function buildParentSystemActionLineHe(contract, { topicLabel = "" } = {}) {
  if (!contract || contract.version !== "2.0.0") return "";
  const action = String(contract.action || "").trim();
  const topic =
    String(topicLabel || contract.target?.topic || "").trim() || "this topic";
  const subskill =
    contract.target?.subskill && contract.target?.subskillId
      ? String(contract.target.subskill)
      : null;

  switch (action) {
    case "collect_more_evidence":
      return `The system will show more questions in ${topic} to check whether the pattern repeats.`;
    case "give_probe_questions":
      return subskill
        ? `The system will show check questions in ${topic} that distinguish ${subskill} from other options.`
        : `The system will show check questions in ${topic} that distinguish between the relevant options.`;
    case "practice_more":
      return `The system will show more practice in ${topic} at the same level.`;
    case "targeted_practice":
      return subskill
        ? `The system will show focused practice in ${topic}, with emphasis on ${subskill}.`
        : `The system will show focused practice in ${topic}.`;
    case "strengthen_prerequisite":
      return contract.target?.prerequisiteDetail?.precision === "exact_skill"
        ? `The system will go back to practicing a small foundational skill before ${topic}.`
        : `The system will go back to practicing the basics in ${topic} before continuing further.`;
    case "remove_timer":
      return `The system will briefly remove the time limit in ${topic}, without changing the content.`;
    case "reduce_reading_load":
      return `The system will show shorter, clearer questions in ${topic}, without changing the learning goal.`;
    case "guided_to_independent_transition":
      return `The system will gradually reduce help in ${topic} and move toward independent work.`;
    case "maintain":
      return `The system will continue on the regular path in ${topic}.`;
    case "monitor_before_escalation":
      return `The system will keep monitoring ${topic} before any further change.`;
    case "advance_cautiously":
      return `The system will gradually raise the difficulty level in ${topic}.`;
    default:
      return "";
  }
}

export function buildParentSafeActionDecisionV1(contract, {
  topicLabel = "",
} = {}) {
  if (!contract || contract.version !== "2.0.0") return null;
  const state = parentActionDisplayStateV1(contract.action);
  const topic =
    String(
      topicLabel ||
        contract.target?.topic ||
        "",
    ).trim() || "this topic";
  const subskill =
    contract.target?.subskill && contract.target?.subskillId
      ? String(contract.target.subskill)
      : null;
  const prerequisiteDetail = contract.target?.prerequisiteDetail;
  const hasExactPrerequisite =
    prerequisiteDetail?.precision === "exact_skill" &&
    Boolean(contract.target?.prerequisite);
  const actionLine = buildParentSystemActionLineHe(contract, { topicLabel: topic });
  const actionText =
    actionLine || fillTopic(COPY[state], subskill || topic);
  const temporary = "This is a temporary action and will be re-checked after the next practice.";
  const reevaluation = contract.reevaluation?.afterActivities
    ? `The decision will be re-checked after ${contract.reevaluation.afterActivities} activities, or when new evidence is available from further practice.`
    : "The decision will be re-checked once new evidence is available from further practice.";
  return {
    contractVersion: "parent-action-decision-v1",
    state,
    label: LABELS[state],
    observed: "",
    recurrence: "action_only",
    recommendation: actionText,
    systemActionLineHe: actionLine || actionText,
    temporary,
    reevaluation,
    target: {
      subject: String(contract.target?.subject || ""),
      topic,
      subskill,
      hasExactPrerequisite,
      foundationReviewOnly:
        prerequisiteDetail?.precision === "grade_foundation_area",
    },
  };
}

export function buildExpiredParentActionDecisionV1() {
  return {
    contractVersion: "parent-action-decision-v1",
    state: "insufficient_information",
    label: LABELS.insufficient_information,
    observed: "",
    recurrence: "expired_evidence_window",
    recommendation:
      "The decision from the selected period is no longer active, so it does not change the current learning path.",
    systemActionLineHe:
      "The decision from the selected period is no longer active, so it does not change the current learning path.",
    temporary: "No active adjustment was kept based on old evidence.",
    reevaluation: "A new decision will only be made after recent activity.",
    target: {
      subject: "",
      topic: "",
      subskill: null,
      hasExactPrerequisite: false,
      foundationReviewOnly: false,
    },
  };
}

export const PARENT_ACTION_DECISION_COPY_HE_V1 = COPY;
