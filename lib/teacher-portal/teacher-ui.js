/**
 * English UI strings and label helpers for Teacher Portal + Guardian Access.
 * Full English parity with ./teacher-ui.he.js — export names kept compatible
 * (some still suffixed `He` for call-site compatibility) but all values are
 * English. Client-safe — no server secrets.
 */

export const REPORT_SUBJECTS = ["math", "geometry", "english", "science"];

/** @type {Record<string, string>} */
const SUBJECT_LABEL_EN = {
  math: "Math",
  geometry: "Geometry",
  english: "English",
  hebrew: "Hebrew",
  science: "Science",
  history: "History",
  moledet: "Homeland Studies",
  geography: "Geography",
  moledet_geography: "Homeland & Geography",
  "moledet-geography": "Homeland & Geography",
};

export const SUBJECT_LABEL_HE = SUBJECT_LABEL_EN;

/** Activity/report subject list for the given grade. */
export function activitySubjectsForGrade(_gradeKey, subjects = REPORT_SUBJECTS) {
  return subjects;
}

const RISK_SIGNAL_EN = {
  inactive_recent_days: "Prolonged inactivity",
  no_sessions_in_range: "No practice sessions in this period",
  low_overall_accuracy: "Difficulty with overall performance",
  many_recent_mistakes: "High number of recent mistakes",
  never_active_in_range: "No activity in this period",
  insufficient_answers: "Not enough data to analyze",
};

const SUPPORT_SUGGESTION_EN = {
  review_fundamentals: "Recommended to review subject fundamentals",
  encourage_session_start: "Recommended to encourage starting practice",
};

const ATTENTION_REASON_EN = {
  no_activity_in_range: "Inactive in this period",
  low_accuracy: "Difficulty with performance",
  many_recent_mistakes: "High number of recent mistakes",
  recent_mistakes: "Recurring mistakes",
};

const GUIDANCE_SEVERITY_TIER_EN = {
  critical: "Needs immediate attention",
  needs_reinforcement: "Needs reinforcement",
  monitor: "Worth monitoring",
  on_track: "On track",
};

const CLASS_GUIDANCE_SEVERITY_TIER_EN = {
  critical_class: "Class needs immediate attention",
  class_needs_reinforcement: "Class needs reinforcement",
  class_monitor: "Class needs monitoring and focused practice",
  class_on_track: "Class is on track",
};

const CLASS_HEALTH_EN = {
  no_data: "Not enough data",
  critical_class: "Class needs immediate attention",
  needs_reinforcement: "Class needs reinforcement",
  monitor: "Class needs monitoring and focused practice",
  strong: "Class is on track",
};

export const STUDENT_FOCUS_CALM_MESSAGE = "No urgent topics right now - keep going as usual.";
export const HUB_STUDENT_FOCUS_CALM_MESSAGE = "No focused topics - keep monitoring.";
export const HUB_CLASS_WEAK_TOPICS_CALM_MESSAGE =
  "No significant weak topics detected - keep monitoring.";
export const STUDENT_FOCUS_FALLBACK_BANNER =
  "Difficulty in this subject - diagnostic practice needed to identify the exact topic";
export const CLASS_WEAK_TOPICS_FALLBACK_BANNER =
  "The class shows difficulty in this subject - diagnostic class reinforcement recommended";

const GROUP_TIER_EN = {
  struggling: "Support group",
  on_track: "Reinforcement group",
  advanced: "Advanced group",
};

const GUARDIAN_ACCESS_STATE_EN = {
  active: "Active",
  expired: "Expired",
  revoked: "Revoked",
};

const GENERIC_SUGGESTION_EN = "Keep monitoring progress";

const ACTION_TYPE_LABEL_EN = {
  class_reteach: "Whole-class reteach",
  small_group: "Small group work",
  individual_practice: "Focused individual practice",
  collect_more_data: "Wait for more data",
};

const ASSIGNMENT_TYPE_LABEL_EN = {
  classroom_activity: "Classroom activity",
  worksheet_pdf: "Worksheet",
  focused_practice: "Focused practice",
};

export function actionTypeLabelHe(code) {
  return ACTION_TYPE_LABEL_EN[code] || null;
}

export function assignmentTypeLabelHe(code) {
  return ASSIGNMENT_TYPE_LABEL_EN[code] || null;
}

/** @param {string|null|undefined} subjectId */
export function subjectLabel(subjectId) {
  const key = String(subjectId || "").trim().toLowerCase();
  return SUBJECT_LABEL_EN[key] || key || "Unknown";
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
  if (!raw) return "Topic";
  const short = raw.split("::grade:")[0] || raw;
  if (!short || short === "general") return "Topic";
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
  return subj ? `${subj} - ${topic}` : topic;
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
  return `Class ${raw}`;
}

/**
 * @param {string} studentName
 * @param {string|null|undefined} classDisplayLabel
 */
export function formatTeacherAttentionStudentLineHe(studentName, classDisplayLabel) {
  const name = String(studentName || "").trim() || "Student";
  const suffix = formatTeacherClassSuffixHe(classDisplayLabel);
  return suffix ? `${name} · ${suffix}` : name;
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
  return lab ? `${lab} - subject-level difficulty` : "Subject-level difficulty";
}

export function formatStudentSubjectFallbackEvidenceHe(accuracyPct, totalAnswers) {
  return `${formatPercent(accuracyPct)} success out of ${totalAnswers} answers`;
}

export function formatStudentSubjectFallbackActionHe() {
  return "Recommended to start a short diagnostic practice to identify the exact topic";
}

export function formatClassSubjectFallbackHeadlineHe(subjectLabelValue) {
  const lab = String(subjectLabelValue || "").trim();
  return lab ? `${lab} - class-level subject difficulty` : "Class-level subject difficulty";
}

export function formatClassSubjectFallbackActionHe() {
  return "Recommended to start a short diagnostic activity or focused whole-class review";
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
    return lab ? `Recommended to reinforce ${lab} in class` : GENERIC_SUGGESTION_EN;
  }
  if (s.startsWith("focus_practice:")) {
    const sub = s.split(":")[1];
    const lab = subjectLabel(sub);
    return lab ? `Recommended to focus practice on ${lab}` : GENERIC_SUGGESTION_EN;
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
  return GROUP_TIER_EN[tier] || "-";
}

export function formatPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return `${Math.round(n)}%`;
}

/** @param {string|null|undefined} iso */
export function formatDate(iso) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}
/** @deprecated use formatDate */
export const formatDateHe = formatDate;

export function riskLevelHe(level) {
  if (level === "high") return "Needs immediate attention";
  if (level === "moderate") return "Worth monitoring";
  if (level === "low") return "On track";
  return null;
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
  return "Personal activities";
}
/** @deprecated use personalActivitiesSectionTitle */
export const personalActivitiesSectionTitleHe = personalActivitiesSectionTitle;

export function individualActivityBadge() {
  return "Personal";
}
/** @deprecated use individualActivityBadge */
export const individualActivityBadgeHe = individualActivityBadge;

export const DASHBOARD_NO_CLASSES_TITLE = "No active classes";
export const DASHBOARD_NO_CLASSES_HINT =
  "Create a new class below, then add children via \u201cManage class\u201d on the class card.";
export const DASHBOARD_CREATE_CLASS_LABEL = "Class name";
export const DASHBOARD_CREATE_CLASS_BUTTON = "Create class";
export const DASHBOARD_CREATE_CLASS_PLACEHOLDER = "e.g. Class 3 - LEO";

/**
 * @param {{ type?: string, className?: string, studentCount?: number, labelKey?: string }|null|undefined} option
 * @returns {string|null}
 */
export function rosterFilterLabelHe(option) {
  if (!option) return null;
  const count = option.studentCount ?? 0;
  if ((option.type === "class" || option.type === "physical_class") && option.className) {
    return `${option.className} (${count})`;
  }
  if (option.type === "all" || option.labelKey === "teacher.roster.filter.allStudents") {
    return `All children (${count})`;
  }
  if (option.type === "direct" || option.labelKey === "teacher.roster.filter.directStudents") {
    return `Private children (${count})`;
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
