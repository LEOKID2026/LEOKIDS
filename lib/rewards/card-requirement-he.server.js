/**
 * Requirement text + progress labels for child card UI (locale-aware, code-driven).
 */

import { subjectLabelHe } from "../platform-ui/hebrew-display-labels.js";
import { CARD_RULE_TYPE_META } from "./card-rule-types.js";
import { normalizeRuleParams } from "./card-rule-params.js";
import { createRewardUiCopy, rewardUiCopyForLocale } from "./reward-pack-copy.js";

/**
 * @param {string|null|undefined} contentLocale
 */
function copy(contentLocale) {
  return createRewardUiCopy(contentLocale);
}

/**
 * @param {string|null|undefined} topic
 * @param {string|null|undefined} contentLocale
 */
function topicLabel(topic, contentLocale) {
  const k = String(topic || "").trim().toLowerCase();
  if (!k) return "";
  const fromPack = rewardUiCopyForLocale(contentLocale, "topics", k, {});
  return fromPack !== k ? fromPack : k;
}

/**
 * Build requirement display from rule_type code + normalized params.
 * @param {object} rule
 * @param {{ current?: number|null, target?: number|null }|null} [progress]
 * @param {string|null|undefined} [contentLocale]
 */
export function buildRuleRequirementHe(rule, progress = null, contentLocale = "en") {
  if (rule?.requirement_text_he) return String(rule.requirement_text_he).trim();

  const ui = copy(contentLocale);
  const p = normalizeRuleParams(rule);
  const rt = String(rule?.rule_type || "").trim();

  if (rt === "total_questions" && p.min_questions != null) {
    return ui("requirements", "total_questions", { minQuestions: p.min_questions });
  }
  if (rt === "weekly_questions" && p.min_questions != null) {
    return ui("requirements", "weekly_questions", { minQuestions: p.min_questions });
  }
  if (rt === "subject_questions" && p.min_questions != null) {
    const subj = subjectLabelHe(p.subject);
    if (subj && subj !== "-") {
      return ui("requirements", "subject_questions", { minQuestions: p.min_questions, subject: subj });
    }
    return ui("requirements", "subject_questions_fallback_subject", { minQuestions: p.min_questions });
  }
  if (rt === "subject_accuracy" && p.min_questions != null && p.min_accuracy != null) {
    const subj = subjectLabelHe(p.subject);
    const top = topicLabel(p.topic, contentLocale);
    const topicPart = top ? ui("requirements", "subject_accuracy_topic_part", { topic: top }) : "";
    return ui("requirements", "subject_accuracy", {
      minAccuracy: p.min_accuracy,
      subject: subj,
      topicPart,
      minQuestions: p.min_questions,
    });
  }
  if (rt === "learning_streak_days" && p.min_streak_days != null) {
    return ui("requirements", "learning_streak_days", { minStreakDays: p.min_streak_days });
  }
  if (rt === "active_days_streak" && p.min_streak_days != null) {
    return ui("requirements", "active_days_streak", { minStreakDays: p.min_streak_days });
  }
  if (rt === "parent_activity_complete" && p.min_completed_activities != null) {
    return ui("requirements", "parent_activity_complete", {
      minCompletedActivities: p.min_completed_activities,
    });
  }
  if (rt === "monthly_learning_minutes" && p.min_learning_minutes_monthly != null) {
    return ui("requirements", "monthly_learning_minutes", {
      minLearningMinutesMonthly: p.min_learning_minutes_monthly,
    });
  }
  if (rt === "event_window") {
    return ui("requirements", "event_window");
  }
  if (rt === "daily_mission_complete") {
    return p.mission_key
      ? ui("requirements", "daily_mission_complete", { missionKey: p.mission_key })
      : ui("requirements", "daily_mission_generic");
  }
  if (rt === "grade_band_only" && p.grade_band) {
    const gradeBand =
      rewardUiCopyForLocale(contentLocale, "gradeBands", p.grade_band, {}) || p.grade_band;
    return ui("requirements", "grade_band_only", { gradeBand });
  }

  const meta = CARD_RULE_TYPE_META[rt];
  if (meta?.labelHe) {
    return ui("fallback", "completeRequirement", { label: meta.labelHe });
  }
  return ui("fallback", "keepLearning");
}

/**
 * @param {object} card
 * @param {object[]} [rules]
 * @param {{ current?: number|null, target?: number|null }|null} [primaryProgress]
 * @param {string|null|undefined} [contentLocale]
 */
export function buildCardRequirementHe(card, rules = [], primaryProgress = null, contentLocale = "en") {
  if (card?.requirement_text_he) return String(card.requirement_text_he).trim();
  if (card?.description_he) return String(card.description_he).trim();

  const ui = copy(contentLocale);
  const active = (rules || []).filter((r) => r.is_active !== false);
  if (!active.length) {
    if (card?.can_be_purchased) return ui("fallback", "availableInShop");
    if (card?.can_appear_in_surprise_box) return ui("fallback", "availableInSurpriseBox");
    return ui("fallback", "notAvailableNow");
  }

  const primary = active[0];
  let text = buildRuleRequirementHe(primary, primaryProgress, contentLocale);
  if (primaryProgress?.target != null && primaryProgress?.current != null) {
    const cur = Math.floor(Number(primaryProgress.current) || 0);
    const tgt = Math.floor(Number(primaryProgress.target) || 0);
    if (tgt > 0) {
      text = `${text} (${ui("fallback", "progressOf", { current: cur.toLocaleString("en-US"), target: tgt.toLocaleString("en-US") })})`;
    }
  }
  return text;
}

/**
 * @param {{ current?: number|null, target?: number|null }|null} progress
 * @param {string|null|undefined} [contentLocale]
 */
export function formatProgressLineHe(progress, contentLocale = "en") {
  if (!progress || progress.target == null || progress.target <= 0) return null;
  const cur = Math.max(0, Math.floor(Number(progress.current) || 0));
  const tgt = Math.floor(Number(progress.target) || 0);
  return createRewardUiCopy(contentLocale)("fallback", "progressOf", {
    current: cur.toLocaleString("en-US"),
    target: tgt.toLocaleString("en-US"),
  });
}
