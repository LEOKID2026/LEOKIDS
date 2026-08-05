/**
 * Card acquisition rule types — internal keys + Admin Hebrew labels.
 */

/** @type {Record<string, { label: string, grantable: boolean, hasProgress: boolean }>} */
export const CARD_RULE_TYPE_META = {
  total_questions: { label: "Total questions", grantable: true, hasProgress: true },
  weekly_questions: { label: "Questions this week", grantable: true, hasProgress: true },
  subject_questions: { label: "Questions in subject", grantable: true, hasProgress: true },
  subject_accuracy: { label: "Accuracy in subject/topic", grantable: true, hasProgress: true },
  learning_streak_days: { label: "Learning streak (days)", grantable: true, hasProgress: true },
  parent_activity_complete: { label: "Parent activities completed", grantable: true, hasProgress: true },
  monthly_learning_minutes: { label: "Learning minutes this month", grantable: true, hasProgress: true },
  active_days_streak: { label: "Consecutive active days", grantable: true, hasProgress: true },
  grade_band_only: { label: "Grade restriction", grantable: false, hasProgress: false },
  event_window: { label: "Event window (dates)", grantable: true, hasProgress: false },
  daily_mission_complete: { label: "Daily mission completed", grantable: true, hasProgress: true },
  subject_improvement: { label: "Performance improvement (not yet active)", grantable: false, hasProgress: false },
};

/** @returns {{ value: string, label: string, grantable: boolean }[]} */
export function cardRuleTypeOptionsForAdmin() {
  return Object.entries(CARD_RULE_TYPE_META).map(([value, meta]) => ({
    value,
    label: meta.label,
    grantable: meta.grantable,
  }));
}

/** @param {string|null|undefined} ruleType */
export function isGrantableRuleType(ruleType) {
  const k = String(ruleType || "").trim();
  return CARD_RULE_TYPE_META[k]?.grantable === true;
}
