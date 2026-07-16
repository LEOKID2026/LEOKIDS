/**
 * Requirement text + progress labels for child card UI.
 */

import { subjectLabelHe } from "../platform-ui/hebrew-display-labels.js";
import { CARD_RULE_TYPE_META } from "./card-rule-types.js";
import { normalizeRuleParams } from "./card-rule-params.js";

const SUBJECT_TOPIC_LABELS = {
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Multiplication",
  division: "Division",
  vocabulary: "Vocabulary",
};

/** @param {string|null|undefined} topic */
function topicLabelHe(topic) {
  const k = String(topic || "").trim().toLowerCase();
  return SUBJECT_TOPIC_LABELS[k] || topic || "";
}

/**
 * @param {object} rule
 * @param {{ current?: number|null, target?: number|null }|null} [progress]
 */
export function buildRuleRequirementHe(rule, progress = null) {
  if (rule?.requirement_text_he) return String(rule.requirement_text_he).trim();

  const p = normalizeRuleParams(rule);
  const rt = rule?.rule_type;

  if (rt === "total_questions" && p.min_questions != null) {
    return `Answer ${p.min_questions} questions in total`;
  }
  if (rt === "weekly_questions" && p.min_questions != null) {
    return `Answer ${p.min_questions} questions in the last week`;
  }
  if (rt === "subject_questions" && p.min_questions != null) {
    const subj = subjectLabelHe(p.subject);
    return `Answer ${p.min_questions} questions in ${subj !== "-" ? subj : "a subject"}`;
  }
  if (rt === "subject_accuracy" && p.min_questions != null && p.min_accuracy != null) {
    const subj = subjectLabelHe(p.subject);
    const top = topicLabelHe(p.topic);
    const topicPart = top ? ` on ${top}` : "";
    return `Reach ${p.min_accuracy}% accuracy in ${subj}${topicPart} (at least ${p.min_questions} questions)`;
  }
  if (rt === "learning_streak_days" && p.min_streak_days != null) {
    return `Learn for ${p.min_streak_days} days in a row`;
  }
  if (rt === "active_days_streak" && p.min_streak_days != null) {
    return `Be active for ${p.min_streak_days} days in a row`;
  }
  if (rt === "parent_activity_complete" && p.min_completed_activities != null) {
    return `Complete ${p.min_completed_activities} parent activities`;
  }
  if (rt === "monthly_learning_minutes" && p.min_learning_minutes_monthly != null) {
    return `Learn ${p.min_learning_minutes_monthly} minutes this month`;
  }
  if (rt === "event_window") {
    return "Special event card — available during the event window";
  }
  if (rt === "daily_mission_complete") {
    return p.mission_key ? `Complete the mission: ${p.mission_key}` : "Complete a daily mission";
  }
  if (rt === "grade_band_only" && p.grade_band) {
    const bands = { g12: "Grades 1–2", g34: "Grades 3–4", g56: "Grades 5–6" };
    return `Available for ${bands[p.grade_band] || p.grade_band}`;
  }

  const meta = CARD_RULE_TYPE_META[rt];
  return meta?.labelHe ? `Complete the requirement: ${meta.labelHe}` : "Keep learning to unlock this card";
}

/**
 * @param {object} card
 * @param {object[]} [rules]
 * @param {{ current?: number|null, target?: number|null }|null} [primaryProgress]
 */
export function buildCardRequirementHe(card, rules = [], primaryProgress = null) {
  if (card?.requirement_text_he) return String(card.requirement_text_he).trim();
  if (card?.description_he) return String(card.description_he).trim();

  const active = (rules || []).filter((r) => r.is_active !== false);
  if (!active.length) {
    if (card?.can_be_purchased) return "Available in the shop";
    if (card?.can_appear_in_surprise_box) return "Available in a surprise box";
    return "Not available right now";
  }

  const primary = active[0];
  let text = buildRuleRequirementHe(primary, primaryProgress);
  if (primaryProgress?.target != null && primaryProgress?.current != null) {
    const cur = Math.floor(Number(primaryProgress.current) || 0);
    const tgt = Math.floor(Number(primaryProgress.target) || 0);
    if (tgt > 0) {
      text = `${text} (${cur.toLocaleString("en-US")} of ${tgt.toLocaleString("en-US")})`;
    }
  }
  return text;
}

/**
 * @param {{ current?: number|null, target?: number|null }|null} progress
 */
export function formatProgressLineHe(progress) {
  if (!progress || progress.target == null || progress.target <= 0) return null;
  const cur = Math.max(0, Math.floor(Number(progress.current) || 0));
  const tgt = Math.floor(Number(progress.target) || 0);
  return `${cur.toLocaleString("en-US")} of ${tgt.toLocaleString("en-US")}`;
}
