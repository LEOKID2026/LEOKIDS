/**
 * English display labels for Admin Analytics (`/admin/analytics`).
 * Internal keys stay English — visible UI uses these helpers.
 * Export names keep `He` suffix for call-site compatibility.
 */

import {
  adminGradeLabelHe,
  entitlementStatusLabelHe,
  personaLabelHe,
} from "./admin-ui.js";
import { subjectLabel as platformSubjectLabel } from "../platform-ui/display-labels.js";
import {
  formatParentReportGradeLabel,
  getEnglishTopicName,
  getHebrewTopicName,
  getMoledetGeographyTopicName,
  getOperationName,
  getScienceTopicName,
  getTopicName,
} from "../../utils/math-report-generator.js";
import { englishLabelFromSlug, topicBucketLabel } from "../../utils/diagnostic-labels.js";

/** @type {Record<string, string>} */
export const ANALYTICS_EVENT_LABELS_HE = {
  parent_login: "Parent login",
  teacher_login: "Teacher login",
  teacher_dashboard_opened: "Teacher dashboard opened",
  teacher_report_opened: "Teacher report opened",
  teacher_activity_created: "Teacher activity created",
  teacher_worksheet_created: "Teacher worksheet created",
  parent_dashboard_opened: "Parent dashboard opened",
  child_created: "Child created",
  parent_report_opened: "Parent report opened",
  parent_report_pdf_exported: "Parent report PDF exported",
  personal_activity_created: "Personal activity created",
  personal_activity_results_opened: "Personal activity results opened",
  student_login: "Student login",
  student_home_opened: "Student home opened",
  subject_opened: "Subject opened",
  topic_opened: "Topic opened",
  practice_started: "Practice started",
  question_answered: "Question answered",
  practice_completed: "Practice completed",
  practice_abandoned: "Practice abandoned",
  book_opened: "Book opened",
  book_section_opened: "Book section opened",
  audio_played: "Audio played",
  explanation_opened: "Explanation opened",
  worksheet_opened: "Worksheet opened",
  public_worksheet_page_viewed: "Public worksheet page viewed",
  public_worksheet_generated: "Public worksheet generated",
  personal_activity_started: "Personal activity started",
  personal_activity_completed: "Personal activity completed",
  reward_earned: "Reward earned",
  admin_analytics_opened: "Admin analytics opened",
  analytics_truth_check_run: "Truth check run",
  analytics_event_ingestion_error: "Event ingestion error",
};

/** @type {Record<string, string>} */
export const ANALYTICS_STATUS_LABELS_HE = {
  available: "Available",
  partial: "Partial",
  empty: "No data yet",
  not_enough_data: "Not enough data yet",
  requires_events: "Requires event collection",
  not_tracked: "Not tracked yet",
  unavailable: "Data source unavailable",
};

/** @type {Record<string, string>} */
export const ANALYTICS_ROLE_LABELS_HE = {
  parent: "Parent",
  student: "Student",
  teacher: "Teacher",
  private_teacher: "Private teacher",
  admin: "Admin",
  unknown: "Unknown",
  unlinked: "Unlinked",
};

/** @type {Record<string, string>} */
const ANALYTICS_SUBJECT_LABELS = {
  math: "Math",
  geometry: "Geometry",
  english: "English",

  science: "Science",
  geography: "Geography",
};

/** @type {Record<string, string>} */
const ANALYTICS_FEATURE_LABELS = {
  practice: "Practice",
  learning: "Learning",
  learning_book: "Learning book",
  worksheet: "Worksheet",
  parent_assigned_activity: "Personal activity",
  classroom_assigned_activity: "Classroom activity",
  personal_activity: "Personal activity",
  review: "Review",
  challenge: "Challenge",
  speed: "Speed",
  marathon: "Long practice",
  diagnostic: "Diagnostic",
  guided_practice: "Guided practice",
  quiz: "Quiz",
  homework: "Homework",
  report: "Report",
  book: "Book",
  audio: "Audio",
  explanation: "Explanation",
  reward: "Reward",
};

/** @type {Record<string, string>} */
const ANALYTICS_MODE_SOURCE_LABELS = {
  self_practice: "Self practice",
  parent_assigned_activity: "Personal activity",
  learning_book: "Learning book",
  worksheet: "Worksheet",
  classroom_assigned_activity: "Classroom activity",
  practice: "Practice",
  learning: "Learning",
};

/** @type {Record<string, string>} */
const ANALYTICS_OBJECT_TYPE_LABELS = {
  subject: "Subject",
  topic: "Topic",
  book: "Book",
  worksheet: "Worksheet",
  activity: "Activity",
  student: "Student",
  parent: "Parent",
  teacher: "Teacher",
};

/** @type {Record<string, string>} */
const ANALYTICS_TABLE_LABELS = {
  parent_profiles: "Parent profiles",
  account_persona_entitlements: "Persona entitlements",
  teacher_profiles: "Teacher profiles",
  learning_sessions: "Learning sessions",
  learning_sessions_all_time: "Learning sessions (all time)",
  answers: "Answers",
  student_sessions: "Student sessions",
  parent_assigned_activities: "Parent-assigned activities",
  parent_activity_status: "Parent activity status",
  parent_activity_attempts: "Parent activity attempts",
  book_reading_sessions: "Book reading sessions",
  book_page_visits: "Book page visits",
  worksheet_student_status: "Worksheet status",
  coin_transactions: "Coin transactions",
  analytics_events: "Analytics events",
  teacher_classes: "Teacher classes",
  teacher_students: "Linked students",
  student_activities: "Student activities",
  classroom_activities: "Classroom activities",
  worksheet_activities: "Teacher worksheets",
  solo_game_sessions: "Solo game sessions",
  students: "Students",
  auth: "Auth",
};

/** @type {Record<string, string>} */
const ANALYTICS_SOURCE_FRAGMENT = {
  "auth.users": "Auth users",
  "existing db truth": "Existing DB data",
  analytics_events: "Analytics events",
  vercel_web_analytics: "Web traffic (Vercel)",
  aggregateparentreportpayload: "Parent report summary",
};

/** @type {Record<string, string>} */
const ANALYTICS_UNIT_LABELS = {
  minutes: "minutes",
  "%": "%",
};

/** @type {Record<string, string>} */
const ANALYTICS_GRADE_LABELS = {
  all: "All grades",
  unknown: "Unknown",
  grade_1: "Grade 1",
  grade_2: "Grade 2",
  grade_3: "Grade 3",
  grade_4: "Grade 4",
  grade_5: "Grade 5",
  grade_6: "Grade 6",
  g1: "Grade 1",
  g2: "Grade 2",
  g3: "Grade 3",
  g4: "Grade 4",
  g5: "Grade 5",
  g6: "Grade 6",
  "1": "Grade 1",
  "2": "Grade 2",
  "3": "Grade 3",
  "4": "Grade 4",
  "5": "Grade 5",
  "6": "Grade 6",
};

/** @type {Record<string, string>} */
const ANALYTICS_TOPIC_SKILL_OVERRIDES = {
  body: "Human body",
  reading: "Reading",
  matter: "Matter",
  angles: "Angles",
  addition: "Addition",
  subtraction: "Subtraction",
  multiplication: "Multiplication",
  division: "Division",
  vocabulary: "Vocabulary",
  area: "Area",
  perimeter: "Perimeter",
  volume: "Volume",
  fractions: "Fractions",
  mixed: "Mixed",
  unknown: "No topic",
};

/** @type {Record<string, string>} */
const ANALYTICS_COIN_REASON = {
  unknown: "Unknown",
  practice_complete: "Practice completed",
  book_read: "Book read",
  streak_bonus: "Streak bonus",
  daily_bonus: "Daily bonus",
};

const HEBREW_CHAR = /[\u0590-\u05FF]/;
const ASCII_IDENTIFIER = /^[a-z][a-z0-9_:-]*$/i;
const SUBJECT_IDS_FOR_TOPIC = ["math", "geometry", "english", "science"];

export const ADMIN_ANALYTICS_FORBIDDEN_ENGLISH_ENUMS = Object.freeze([
  "body",
  "reading",
  "unknown",
  "multiplication",
  "matter",
  "angles",
  "addition",
  "vocabulary",
  "area",
  "grade_2",
  "grade_3",
  "grade_4",
  "grade_5",
  "practice",
  "learning_book",
  "worksheet",
  "parent_assigned_activity",
  "teacher_dashboard_opened",
  "private_teacher",
  "self_practice",
  "guided_practice",
  "classroom_assigned_activity",

]);

function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function looksHebrew(text) {
  return HEBREW_CHAR.test(String(text || ""));
}

function humanizeKey(key) {
  return key
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function isMappedTopicResult(key, result) {
  const mapped = String(result || "").trim();
  if (!mapped || mapped === key) return false;
  if (looksHebrew(mapped)) return false;
  return !ASCII_IDENTIFIER.test(mapped) || mapped !== key;
}

function lookupTopicSkill(raw) {
  const key = normalizeKey(raw);
  if (!key) return null;
  if (ANALYTICS_TOPIC_SKILL_OVERRIDES[key]) return ANALYTICS_TOPIC_SKILL_OVERRIDES[key];

  const slug = englishLabelFromSlug(key);
  if (slug && !looksHebrew(slug)) return slug;

  const mappers = [
    getOperationName,
    getTopicName,
    getEnglishTopicName,
    getScienceTopicName,
    getHebrewTopicName,
    getMoledetGeographyTopicName,
  ];
  for (const mapper of mappers) {
    const result = mapper(key);
    if (isMappedTopicResult(key, result)) return result;
  }

  for (const subjectId of SUBJECT_IDS_FOR_TOPIC) {
    const label = topicBucketLabel(subjectId, key);
    if (isMappedTopicResult(key, label)) return label;
  }

  return null;
}

/** @param {string|null|undefined} subjectId */
export function formatAnalyticsSubjectHe(subjectId) {
  const key = normalizeKey(subjectId);
  if (!key || key === "unknown") return "Unknown";
  if (ANALYTICS_SUBJECT_LABELS[key]) return ANALYTICS_SUBJECT_LABELS[key];
  const platform = platformSubjectLabel(key);
  if (platform && platform !== "-") return platform;
  return humanizeKey(key) || "Unknown";
}

/** @param {string|null|undefined} topic */
export function formatAnalyticsTopicHe(topic) {
  const raw = String(topic || "").trim();
  if (!raw) return "No topic";
  if (!looksHebrew(raw) && !ASCII_IDENTIFIER.test(normalizeKey(raw))) return raw;
  const key = normalizeKey(raw);
  if (key === "unknown") return "No topic";
  return lookupTopicSkill(raw) || humanizeKey(key) || "Unknown";
}

/** @param {string|null|undefined} skill */
export function formatAnalyticsSkillHe(skill) {
  return formatAnalyticsTopicHe(skill);
}

/** @param {string|null|undefined} grade */
export function formatAnalyticsGradeHe(grade) {
  const raw = String(grade ?? "").trim();
  if (!raw || normalizeKey(raw) === "unknown") return "Unknown";

  const key = normalizeKey(raw);
  if (ANALYTICS_GRADE_LABELS[key]) return ANALYTICS_GRADE_LABELS[key];

  const gradeMatch = key.match(/^grade_([1-6])$/);
  if (gradeMatch) return ANALYTICS_GRADE_LABELS[`grade_${gradeMatch[1]}`];

  const admin = adminGradeLabelHe(raw);
  if (admin && admin !== raw && admin !== "-") return admin;

  const parentGrade = formatParentReportGradeLabel(raw);
  if (parentGrade && parentGrade !== "N/A") {
    return parentGrade.includes("Grade") ? parentGrade : `Grade ${parentGrade}`;
  }

  return "Unknown";
}

/** @param {string|null|undefined} name */
export function formatAnalyticsCompositeNameHe(name) {
  const raw = String(name || "").trim();
  if (!raw) return "-";
  if (!looksHebrew(raw) && !/\s(?:·|:)\s/.test(raw) && !raw.includes(":")) return raw;

  const parts = raw.split(/\s*(?:·|:)\s*/).filter(Boolean);
  if (parts.length > 1) {
    return parts.map((part) => formatAnalyticsTokenHe(part.trim())).join(" · ");
  }
  return formatAnalyticsTokenHe(raw);
}

/** @param {string|null|undefined} eventName */
export function formatAnalyticsEventNameHe(eventName) {
  const key = normalizeKey(eventName);
  if (!key) return "-";
  if (ANALYTICS_EVENT_LABELS_HE[key]) return ANALYTICS_EVENT_LABELS_HE[key];
  if (key.endsWith("_opened")) {
    const base = key.replace(/_opened$/, "");
    if (ANALYTICS_EVENT_LABELS_HE[`${base}_opened`]) return ANALYTICS_EVENT_LABELS_HE[`${base}_opened`];
  }
  const feature = formatAnalyticsFeatureHe(eventName);
  if (feature !== "Unknown") return feature;
  return humanizeKey(key) || "Unknown";
}

/** @param {string|null|undefined} feature */
export function formatAnalyticsFeatureHe(feature) {
  const key = normalizeKey(feature);
  if (!key || key === "unknown") return "Unknown";
  if (ANALYTICS_FEATURE_LABELS[key]) return ANALYTICS_FEATURE_LABELS[key];
  if (ANALYTICS_EVENT_LABELS_HE[key]) return ANALYTICS_EVENT_LABELS_HE[key];
  if (ANALYTICS_MODE_SOURCE_LABELS[key]) return ANALYTICS_MODE_SOURCE_LABELS[key];
  if (ANALYTICS_OBJECT_TYPE_LABELS[key]) return ANALYTICS_OBJECT_TYPE_LABELS[key];
  const topic = lookupTopicSkill(key);
  if (topic) return topic;
  return humanizeKey(key) || "Unknown";
}

/** @param {string|null|undefined} persona */
export function formatAnalyticsPersonaHe(persona) {
  const key = normalizeKey(persona);
  if (!key || key === "unknown") return "Unknown";
  if (ANALYTICS_ROLE_LABELS_HE[key]) return ANALYTICS_ROLE_LABELS_HE[key];
  const personaLabel = personaLabelHe(key);
  if (personaLabel !== "-") return personaLabel;
  return humanizeKey(key) || "Unknown";
}

/** @param {string|null|undefined} role */
export function formatAnalyticsRoleHe(role) {
  const key = normalizeKey(role);
  if (!key || key === "unknown") return "Unknown";
  return ANALYTICS_ROLE_LABELS_HE[key] || formatAnalyticsPersonaHe(key);
}

/** @param {string|null|undefined} status */
export function formatAnalyticsStatusHe(status) {
  const key = normalizeKey(status);
  if (!key) return "-";
  return ANALYTICS_STATUS_LABELS_HE[key] || humanizeKey(key) || "-";
}

/** @param {string|null|undefined} value */
export function formatAnalyticsFallbackHe(value) {
  const key = normalizeKey(value);
  if (!key || key === "unknown") return "Unknown";
  return humanizeKey(key) || "Unknown";
}

/** @param {string|null|undefined} unit */
export function formatAnalyticsUnitHe(unit) {
  const key = normalizeKey(unit);
  if (!key) return null;
  return ANALYTICS_UNIT_LABELS[key] || unit;
}

/** @param {string|null|undefined} table */
export function formatAnalyticsTableHe(table) {
  const key = normalizeKey(table);
  if (!key) return "-";
  return ANALYTICS_TABLE_LABELS[key] || humanizeKey(key) || table || "-";
}

/** @param {string|null|undefined} reason */
function formatAnalyticsCoinReason(reason) {
  const key = normalizeKey(reason);
  if (!key || key === "unknown") return "Unknown";
  return ANALYTICS_COIN_REASON[key] || humanizeKey(key) || "Unknown";
}

/** @param {string|null|undefined} token */
function formatAnalyticsTokenHe(token) {
  const raw = String(token || "").trim();
  if (!raw) return "-";
  const key = normalizeKey(raw);

  if (looksHebrew(raw)) return formatAnalyticsFallbackHe(raw);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  if (/^[0-9a-f-]{36}$/i.test(raw)) return "Internal ID";

  if (ANALYTICS_EVENT_LABELS_HE[key]) return ANALYTICS_EVENT_LABELS_HE[key];
  if (ANALYTICS_ROLE_LABELS_HE[key]) return ANALYTICS_ROLE_LABELS_HE[key];
  if (ANALYTICS_GRADE_LABELS[key]) return formatAnalyticsGradeHe(raw);
  if (ANALYTICS_STATUS_LABELS_HE[key]) return formatAnalyticsStatusHe(raw);
  if (ANALYTICS_FEATURE_LABELS[key]) return ANALYTICS_FEATURE_LABELS[key];
  if (ANALYTICS_MODE_SOURCE_LABELS[key]) return ANALYTICS_MODE_SOURCE_LABELS[key];
  if (ANALYTICS_OBJECT_TYPE_LABELS[key]) return ANALYTICS_OBJECT_TYPE_LABELS[key];
  if (ANALYTICS_COIN_REASON[key]) return formatAnalyticsCoinReason(key);

  const subject = formatAnalyticsSubjectHe(key);
  if (subject !== "Unknown") return subject;

  const topic = lookupTopicSkill(raw);
  if (topic) return topic;

  const persona = formatAnalyticsPersonaHe(key);
  if (persona !== "Unknown") return persona;

  const entitlement = entitlementStatusLabelHe(key);
  if (entitlement !== "-") return entitlement;

  const grade = formatAnalyticsGradeHe(raw);
  if (grade !== "Unknown") return grade;

  const feature = formatAnalyticsFeatureHe(raw);
  if (feature !== "Unknown") return feature;

  return formatAnalyticsFallbackHe(raw);
}

/** @param {string|null|undefined} label */
export function formatAnalyticsLabelHe(label) {
  const raw = String(label || "").trim();
  if (!raw) return "-";
  return formatAnalyticsCompositeNameHe(raw)
    .replace(/\bAuth\b/gi, "Auth")
    .replace(/\bDB\b/g, "Database")
    .replace(/\bpersona\b/gi, "Persona")
    .replace(/\bPhase 1\b/gi, "Phase 1");
}

/** @param {string|null|undefined} source */
export function formatAnalyticsSourceHe(source) {
  const raw = String(source || "").trim();
  if (!raw) return "-";

  const lower = raw.toLowerCase();
  for (const [fragment, label] of Object.entries(ANALYTICS_SOURCE_FRAGMENT)) {
    if (lower === fragment || lower.startsWith(`${fragment}.`) || lower.startsWith(`${fragment} `)) {
      return label;
    }
  }

  if (lower.startsWith("analytics_events.")) {
    const eventPart = raw.slice("analytics_events.".length).split(/[\s+]/)[0];
    return `Analytics events · ${formatAnalyticsEventNameHe(eventPart)}`;
  }

  if (lower.includes("analytics_events")) {
    return raw
      .split(/\s+/)
      .map((part) => {
        const partLower = part.toLowerCase();
        if (partLower === "analytics_events") return "Analytics events";
        if (partLower.startsWith("analytics_events.")) {
          return `Analytics events · ${formatAnalyticsEventNameHe(part.slice("analytics_events.".length))}`;
        }
        if (ANALYTICS_EVENT_LABELS_HE[normalizeKey(part)]) return formatAnalyticsEventNameHe(part);
        if (partLower === "actor_type=parent") return "Actor: parent";
        if (partLower === "actor_type=student") return "Actor: student";
        if (partLower === "actor_type=teacher") return "Actor: teacher";
        if (partLower.endsWith("_*")) return `${formatAnalyticsEventNameHe(part.slice(0, -2))} (all types)`;
        return formatAnalyticsLabelHe(part.replace(/\./g, " · "));
      })
      .join(" ");
  }

  return raw
    .split("+")
    .map((part) =>
      part
        .trim()
        .split(".")
        .map((segment) => formatAnalyticsTableHe(segment.split(/[=(]/)[0]) || segment)
        .join(" · ")
    )
    .join(" + ");
}

/**
 * @param {string} text
 * @returns {string[]}
 */
export function findAdminAnalyticsEnglishEnumLeaks(text) {
  const lower = String(text || "").toLowerCase();
  const hits = [];
  for (const token of ADMIN_ANALYTICS_FORBIDDEN_ENGLISH_ENUMS) {
    const re = new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(lower)) hits.push(token);
  }
  return hits;
}

const WEB_TRAFFIC_DEVICE_LABELS = {
  mobile: "Mobile",
  desktop: "Desktop",
  tablet: "Tablet",
};

/**
 * @param {string|null|undefined} raw
 * @param {"daily"|"requestPath"|"referrerHostname"|"deviceType"|"browserName"|"country"|"generic"} [dimension]
 */
export function formatWebTrafficLabelHe(raw, dimension = "generic") {
  const value = String(raw ?? "").trim();
  if (!value) return "-";

  if (dimension === "daily") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const day = parsed.getUTCDate();
      const month = parsed.getUTCMonth() + 1;
      const year = parsed.getUTCFullYear();
      return `${month}/${day}/${year}`;
    }
    const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (dateOnly) {
      return `${Number(dateOnly[2])}/${Number(dateOnly[3])}/${dateOnly[1]}`;
    }
    return value;
  }

  if (dimension === "deviceType") {
    const key = value.toLowerCase();
    return WEB_TRAFFIC_DEVICE_LABELS[key] || value;
  }

  if (dimension === "requestPath") {
    const WEB_TRAFFIC_PAGE_LABELS = {
      "/": "Home",
      "/parent/login": "Parent login",
      "/student/login": "Student login",
      "/parent/dashboard": "Parent dashboard",
    };
    return WEB_TRAFFIC_PAGE_LABELS[value] || value;
  }

  return value;
}

/** Date-range presets for the analytics filter bar. */
export const ANALYTICS_DATE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
  { value: "currentMonth", label: "This month" },
  { value: "custom", label: "Custom range" },
];

/** Grade filter options (canonical grade_* keys). */
export const ANALYTICS_GRADE_FILTER_OPTIONS = [
  { value: "all", label: "All grades" },
  { value: "grade_1", label: "Grade 1" },
  { value: "grade_2", label: "Grade 2" },
  { value: "grade_3", label: "Grade 3" },
  { value: "grade_4", label: "Grade 4" },
  { value: "grade_5", label: "Grade 5" },
  { value: "grade_6", label: "Grade 6" },
];

/** Subject filter options. */
export const ANALYTICS_SUBJECT_FILTER_OPTIONS = [
  { value: "all", label: "All subjects" },
  { value: "math", label: "Math" },
  { value: "geometry", label: "Geometry" },
  { value: "hebrew", label: "Hebrew" },
  { value: "english", label: "English" },
  { value: "science", label: "Science" },

];

/** Child activity status filter options. */
export const ANALYTICS_CHILD_STATUS_OPTIONS = [
  { value: "all", label: "All children" },
  { value: "active", label: "Active children" },
  { value: "inactive", label: "Inactive children" },
];

/** Main analytics dashboard tabs. */
export const ANALYTICS_MAIN_TAB_OPTIONS = [
  { id: "overview", label: "Overview" },
  { id: "webTraffic", label: "Web traffic" },
  { id: "accounts", label: "Accounts" },
  { id: "parents", label: "Parents" },
  { id: "children", label: "Children" },
  { id: "learning", label: "Learning" },
  { id: "reports", label: "Reports" },
  { id: "parentActivities", label: "Personal activities" },
  { id: "teachers", label: "Private teachers" },
  { id: "books", label: "Books & audio" },
  { id: "rewards", label: "Rewards" },
  { id: "funnels", label: "Usage funnels" },
  { id: "retention", label: "Retention" },
  { id: "abandonment", label: "Abandonment" },
  { id: "features", label: "Feature usage" },
  { id: "quality", label: "Truth checks" },
];

export const formatAdminAnalyticsSubjectHe = formatAnalyticsSubjectHe;
export const formatAdminAnalyticsTopicHe = formatAnalyticsTopicHe;
export const formatAdminAnalyticsSkillHe = formatAnalyticsSkillHe;
export const formatAdminAnalyticsGradeHe = formatAnalyticsGradeHe;
export const formatAdminAnalyticsCompositeNameHe = formatAnalyticsCompositeNameHe;
export const formatAdminAnalyticsEventNameHe = formatAnalyticsEventNameHe;
export const formatAdminAnalyticsFeatureHe = formatAnalyticsFeatureHe;
export const formatAdminAnalyticsPersonaHe = formatAnalyticsPersonaHe;
export const formatAdminAnalyticsStatusHe = formatAnalyticsStatusHe;
export const formatAdminAnalyticsFallbackHe = formatAnalyticsFallbackHe;
