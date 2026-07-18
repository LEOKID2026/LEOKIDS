/**
 * English UI strings and label helpers for Teacher Portal + Guardian Access.
 * Full English parity with ./teacher-ui.he.js — export names kept compatible
 * (some still suffixed `He` for call-site compatibility) but all values are
 * English. Client-safe — no server secrets.
 */

import teacherEn from "../../locales/en/teacher.json" with { type: "json" };

const T = teacherEn;

/** @type {Record<string, string>} */
const SUBJECT_LABEL_EN = T.subjects;

export const REPORT_SUBJECTS = [...T.reportSubjects];

export const SUBJECT_LABEL_HE = SUBJECT_LABEL_EN;

/** Activity/report subject list for the given grade. */
export function activitySubjectsForGrade(_gradeKey, subjects = REPORT_SUBJECTS) {
  return subjects;
}

const RISK_SIGNAL_EN = T.riskSignals;
const SUPPORT_SUGGESTION_EN = T.supportSuggestions;
const ATTENTION_REASON_EN = T.attentionReasons;
const GUIDANCE_SEVERITY_TIER_EN = T.guidanceSeverityTier;
const CLASS_GUIDANCE_SEVERITY_TIER_EN = T.classGuidanceSeverityTier;
const CLASS_HEALTH_EN = T.classHealth;
const GROUP_TIER_EN = T.groupTier;
const GUARDIAN_ACCESS_STATE_EN = T.guardianAccessState;
const ACTION_TYPE_LABEL_EN = T.actionTypes;
const ASSIGNMENT_TYPE_LABEL_EN = T.assignmentTypes;
const RISK_LEVEL_EN = T.riskLevel;

export const STUDENT_FOCUS_CALM_MESSAGE = T.focus.studentCalmMessage;
export const HUB_STUDENT_FOCUS_CALM_MESSAGE = T.focus.hubStudentCalmMessage;
export const HUB_CLASS_WEAK_TOPICS_CALM_MESSAGE = T.focus.hubClassWeakTopicsCalmMessage;
export const STUDENT_FOCUS_FALLBACK_BANNER = T.focus.studentFallbackBanner;
export const CLASS_WEAK_TOPICS_FALLBACK_BANNER = T.focus.classFallbackBanner;

/**
 * @param {string} template
 * @param {Record<string, string|number|null|undefined>} vars
 */
function fillTemplate(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => {
    const value = vars[key];
    return value == null ? "" : String(value);
  });
}

export function actionTypeLabelHe(code) {
  return ACTION_TYPE_LABEL_EN[code] || null;
}

export function assignmentTypeLabelHe(code) {
  return ASSIGNMENT_TYPE_LABEL_EN[code] || null;
}

/** @param {string|null|undefined} subjectId */
export function subjectLabel(subjectId) {
  const key = String(subjectId || "").trim().toLowerCase();
  return SUBJECT_LABEL_EN[key] || key || T.fallback.unknownSubject;
}
/** @deprecated use subjectLabel */
export const subjectLabelHe = subjectLabel;

const TOPIC_GRADE_SEP = "::grade:";

/**
 * @param {string|null|undefined} topicKey
 */
export function normalizeTopicKeyForLabel(topicKey) {
  if (topicKey == null) return "";
  const k = String(topicKey).trim();
  if (!k) return "";
  const i = k.indexOf(TOPIC_GRADE_SEP);
  return i === -1 ? k : k.slice(0, i);
}

const NON_RECOMMENDABLE_TOPIC_KEYS = new Set(["general", "mixed"]);

/**
 * @param {string|null|undefined} topicKey
 */
export function isTeacherRecommendableTopicKey(topicKey) {
  const base = normalizeTopicKeyForLabel(topicKey);
  if (!base) return false;
  return !NON_RECOMMENDABLE_TOPIC_KEYS.has(base.toLowerCase());
}

/**
 * English fallback topic label — derives a readable label from the topic key
 * (the full curated topic map lives in the teacher-ui.he module).
 * @param {string|null|undefined} _subjectId
 * @param {string|null|undefined} topicKey
 */
export function topicLabel(_subjectId, topicKey) {
  const raw = String(topicKey || "").trim();
  if (!raw) return T.fallback.defaultTopic;
  const short = raw.split("::grade:")[0] || raw;
  if (!short || short === "general") return T.fallback.defaultTopic;
  return short
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
/** @deprecated use topicLabel */
export const topicLabelHe = topicLabel;

/**
 * @param {string} subject
 * @param {string|null|undefined} topicKey
 * @returns {string|null}
 */
export function resolveTopicLabelHe(subject, topicKey) {
  if (!isTeacherRecommendableTopicKey(topicKey)) return null;
  return topicLabel(subject, topicKey);
}

/**
 * @param {string} subjectId
 * @param {string|null|undefined} topicKey
 */
export function formatTopicRecommendationLine(subjectId, topicKey) {
  const topic = topicLabel(subjectId, topicKey);
  if (!topic) return null;
  const subj = subjectLabel(subjectId);
  return subj ? fillTemplate(T.fallback.topicRecommendationLine, { subject: subj, topic }) : topic;
}
/** @deprecated use formatTopicRecommendationLine */
export const formatTopicLineHe = formatTopicRecommendationLine;
export const formatTopicRecommendationLineHe = formatTopicRecommendationLine;

/**
 * @param {string|null|undefined} classDisplayLabel
 */
export function formatTeacherClassSuffixHe(classDisplayLabel) {
  const raw = String(classDisplayLabel || "").trim();
  if (!raw) return null;
  if (/^Class(\s|$)/i.test(raw)) return raw;
  return fillTemplate(T.fallback.classSuffix, { label: raw });
}

/**
 * @param {string} studentName
 * @param {string|null|undefined} classDisplayLabel
 */
export function formatTeacherAttentionStudentLineHe(studentName, classDisplayLabel) {
  const name = String(studentName || "").trim() || T.fallback.defaultStudentName;
  const suffix = formatTeacherClassSuffixHe(classDisplayLabel);
  return suffix ? fillTemplate(T.fallback.attentionStudentLine, { name, suffix }) : name;
}

/**
 * Dedupe recommendation rows by subject + topic label + action type.
 * @param {Array<{ subject?: string, topicLabelHe?: string|null, recommendedActionType?: string, code?: string }>} items
 */
export function dedupeTeacherRecommendationItems(items) {
  const byKey = new Map();
  for (const item of items || []) {
    const subject = String(item.subject || "");
    const topicLabelHeValue =
      item.topicLabelHe ||
      item.headlineHe ||
      resolveTopicLabelHe(subject, item.topic) ||
      null;
    if (!topicLabelHeValue) continue;
    const action = String(item.recommendedActionType || item.code || "");
    const key = `${subject}::${topicLabelHeValue}::${action}`;
    if (!byKey.has(key)) byKey.set(key, { ...item, topicLabelHe: topicLabelHeValue });
  }
  return [...byKey.values()];
}

export function guidanceSeverityTierHe(tier) {
  return GUIDANCE_SEVERITY_TIER_EN[tier] || null;
}

export function classGuidanceSeverityTierHe(tier) {
  return CLASS_GUIDANCE_SEVERITY_TIER_EN[tier] || null;
}

export function formatStudentSubjectFallbackHeadlineHe(subjectLabelValue) {
  const lab = String(subjectLabelValue || "").trim();
  return lab
    ? fillTemplate(T.fallback.studentSubjectHeadline, { subject: lab })
    : T.fallback.studentSubjectHeadlineNoSubject;
}

export function formatStudentSubjectFallbackEvidenceHe(accuracyPct, totalAnswers) {
  return fillTemplate(T.fallback.studentSubjectEvidence, {
    percent: formatPercent(accuracyPct),
    totalAnswers,
  });
}

export function formatStudentSubjectFallbackActionHe() {
  return T.fallback.studentSubjectAction;
}

export function formatClassSubjectFallbackHeadlineHe(subjectLabelValue) {
  const lab = String(subjectLabelValue || "").trim();
  return lab
    ? fillTemplate(T.fallback.classSubjectHeadline, { subject: lab })
    : T.fallback.classSubjectHeadlineNoSubject;
}

export function formatClassSubjectFallbackActionHe() {
  return T.fallback.classSubjectAction;
}

/**
 * @param {Record<string, unknown>|null|undefined} guidance
 */
export function hasActionableGuidanceV2(guidance) {
  if (!guidance || guidance.version !== "v2") return false;
  const units = guidance.recommendationUnits || guidance.classRecommendationUnits;
  return Array.isArray(units) && units.length > 0;
}

/**
 * @param {Record<string, unknown>|null|undefined} guidance
 * @param {Record<string, unknown>|null|undefined} [report]
 */
export function canShowStudentCalmFocusMessage(guidance, report) {
  if (hasActionableGuidanceV2(guidance)) return false;
  const tier = guidance?.guidanceSeverityTier;
  if (tier === "critical" || tier === "needs_reinforcement") return false;
  const overall = guidance?.overallStats?.accuracyPct;
  const totalAnswers = guidance?.overallStats?.totalAnswers;
  if (
    Number.isFinite(overall) &&
    overall < 65 &&
    safeNumLocal(totalAnswers) >= 5
  ) {
    return false;
  }
  const subjects = report?.subjects;
  if (subjects && typeof subjects === "object") {
    for (const subj of Object.values(subjects)) {
      if (!subj || typeof subj !== "object") continue;
      const acc = Number(subj.accuracy);
      const ans = Number(subj.answers);
      if (Number.isFinite(acc) && acc < 65 && ans >= 5) return false;
    }
  }
  return true;
}

/**
 * @param {Record<string, unknown>|null|undefined} guidance
 * @param {Record<string, unknown>|null|undefined} [report]
 */
export function canShowClassCalmWeakTopicsMessage(guidance, report) {
  if (hasActionableGuidanceV2(guidance)) return false;
  const tier = guidance?.guidanceSeverityTier || guidance?.cohortStats?.guidanceSeverityTier;
  if (
    tier === "critical_class" ||
    tier === "class_needs_reinforcement" ||
    tier === "class_monitor"
  ) {
    return false;
  }
  const cohort = report?.cohortSummary || {};
  const acc = Number(cohort.accuracy);
  const totalAnswers = Number(cohort.totalAnswers);
  if (Number.isFinite(acc) && acc < 65 && totalAnswers >= 10) return false;
  return true;
}

function safeNumLocal(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

export function riskSignalHe(code) {
  return RISK_SIGNAL_EN[code] || null;
}

export function supportSuggestionHe(code) {
  if (!code) return null;
  const s = String(code);
  if (SUPPORT_SUGGESTION_EN[s]) return SUPPORT_SUGGESTION_EN[s];
  if (s.startsWith("targeted_review:")) {
    const sub = s.split(":")[1];
    const lab = subjectLabel(sub);
    return lab
      ? fillTemplate(SUPPORT_SUGGESTION_EN.targetedReview, { subject: lab })
      : SUPPORT_SUGGESTION_EN.generic;
  }
  if (s.startsWith("focus_practice:")) {
    const sub = s.split(":")[1];
    const lab = subjectLabel(sub);
    return lab
      ? fillTemplate(SUPPORT_SUGGESTION_EN.focusPractice, { subject: lab })
      : SUPPORT_SUGGESTION_EN.generic;
  }
  return null;
}

export function attentionReasonHe(code) {
  return ATTENTION_REASON_EN[code] || null;
}

export function classHealthHe(signal) {
  return CLASS_HEALTH_EN[signal] || null;
}

export function guardianAccessStateHe(state) {
  return GUARDIAN_ACCESS_STATE_EN[state] || state;
}

export function groupTierHe(tier) {
  return GROUP_TIER_EN[tier] || T.fallback.notAvailable;
}

export function formatPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return T.fallback.notAvailable;
  return `${Math.round(n)}%`;
}

/** @param {string|null|undefined} iso */
export function formatDate(iso) {
  if (!iso) return T.fallback.notAvailable;
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return T.fallback.notAvailable;
  }
}
/** @deprecated use formatDate */
export const formatDateHe = formatDate;

export function riskLevelHe(level) {
  return RISK_LEVEL_EN[level] || null;
}

/**
 * Prefer canonical tier label; fall back to legacy riskLevel.
 * @param {Record<string, unknown>|null|undefined} guidance
 */
export function studentGuidanceHeadlineHe(guidance) {
  const tier = guidance?.guidanceSeverityTier;
  if (tier) return guidanceSeverityTierHe(tier);
  const tg = guidance?.teacherGuidance || {};
  return riskLevelHe(tg.riskLevel);
}

export function personalActivitiesSectionTitle() {
  return T.activities.personalSectionTitle;
}
/** @deprecated use personalActivitiesSectionTitle */
export const personalActivitiesSectionTitleHe = personalActivitiesSectionTitle;

export function individualActivityBadge() {
  return T.activities.individualBadge;
}
/** @deprecated use individualActivityBadge */
export const individualActivityBadgeHe = individualActivityBadge;

export const DASHBOARD_NO_CLASSES_TITLE = T.dashboard.noClassesTitle;
export const DASHBOARD_NO_CLASSES_HINT = T.dashboard.noClassesHint;
export const DASHBOARD_CREATE_CLASS_LABEL = T.dashboard.createClassLabel;
export const DASHBOARD_CREATE_CLASS_BUTTON = T.dashboard.createClassButton;
export const DASHBOARD_CREATE_CLASS_PLACEHOLDER = T.dashboard.createClassPlaceholder;

/**
 * @param {{ type?: string, className?: string, studentCount?: number, labelKey?: string }|null|undefined} option
 * @returns {string|null}
 */
export function rosterFilterLabelHe(option) {
  if (!option) return null;
  const count = option.studentCount ?? 0;
  if ((option.type === "class" || option.type === "physical_class") && option.className) {
    return fillTemplate(T.roster.filter.class, { className: option.className, count });
  }
  if (option.type === "all" || option.labelKey === "teacher.roster.filter.allStudents") {
    return fillTemplate(T.roster.filter.allStudents, { count });
  }
  if (option.type === "direct" || option.labelKey === "teacher.roster.filter.directStudents") {
    return fillTemplate(T.roster.filter.directStudents, { count });
  }
  return null;
}

export function teacherAuthFetch(token, url, options = {}) {
  const headers = {
    ...(options.headers || {}),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  if (options.body && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  return fetch(url, {
    ...options,
    headers,
    credentials: "same-origin",
    cache: "no-store",
  });
}
