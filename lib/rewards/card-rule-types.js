/**
 * Card acquisition rule types — internal keys + Admin Hebrew labels.
 */

/** @type {Record<string, { labelHe: string, grantable: boolean, hasProgress: boolean }>} */
export const CARD_RULE_TYPE_META = {
  total_questions: { labelHe: "Total questions", grantable: true, hasProgress: true },
  weekly_questions: { labelHe: "Questions this week", grantable: true, hasProgress: true },
  subject_questions: { labelHe: "Questions in subject", grantable: true, hasProgress: true },
  subject_accuracy: { labelHe: "Accuracy in subject/topic", grantable: true, hasProgress: true },
  learning_streak_days: { labelHe: "Learning streak (days)", grantable: true, hasProgress: true },
  parent_activity_complete: { labelHe: "Parent activities completed", grantable: true, hasProgress: true },
  monthly_learning_minutes: { labelHe: "Learning minutes this month", grantable: true, hasProgress: true },
  active_days_streak: { labelHe: "Consecutive active days", grantable: true, hasProgress: true },
  grade_band_only: { labelHe: "Grade restriction", grantable: false, hasProgress: false },
  event_window: { labelHe: "Event window (dates)", grantable: true, hasProgress: false },
  daily_mission_complete: { labelHe: "Daily mission completed", grantable: true, hasProgress: true },
  subject_improvement: { labelHe: "Performance improvement (not yet active)", grantable: false, hasProgress: false },
};

/** @returns {{ value: string, labelHe: string, grantable: boolean }[]} */
export function cardRuleTypeOptionsForAdmin() {
  return Object.entries(CARD_RULE_TYPE_META).map(([value, meta]) => ({
    value,
    labelHe: meta.labelHe,
    grantable: meta.grantable,
  }));
}

/** @param {string|null|undefined} ruleType */
export function isGrantableRuleType(ruleType) {
  const k = String(ruleType || "").trim();
  return CARD_RULE_TYPE_META[k]?.grantable === true;
}
