import { reportPackCopy } from "../../lib/reports/report-pack-copy.js";
/**
 * SSOT — English labels for parent report UI (screen + PDF).
 * Internal enum keys stay English internally; these functions map them to
 * short, parent-friendly English display text.
 */

/** @type {Record<string, string>} */
export const PARENT_REPORT_SUBJECT_LABELS_EN = {
  math: "Math",
  geometry: "Geometry",
  english: "English",
  hebrew: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "hebrew"),
  science: "Science",
  history: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "history"),
  moledet: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "homeland_studies"),
  geography: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "geography"),
  moledet_geography: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "homeland_geography"),
  "moledet-geography": reportPackCopy("utils__parent-report-language__parent-report-display-labels", "homeland_geography"),
};

/** @deprecated Alias — Global uses English labels; keep HE export name for import stability. */
export const PARENT_REPORT_SUBJECT_LABELS_HE = PARENT_REPORT_SUBJECT_LABELS_EN;

/** @type {Record<string, string>} */
export const PARENT_REPORT_MODE_LABELS_EN = {
  learning: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "learning"),
  practice: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice"),
  challenge: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "challenge"),
  speed: "Speed",
  marathon: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "extended_practice"),
  review: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "review"),
  drill: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "focused_practice"),
  graded: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "graded"),
  normal: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "regular"),
  mistakes: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "mistakes"),
  practice_mistakes: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "mistake_review"),
  quiz: "Quiz",
  homework: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "homework"),
  guided_practice: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice"),
  guided: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice"),
  live_lesson: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "live_lesson"),
  discussion: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "discussion"),
  worksheet: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "worksheet"),
  learning_book: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "learning_book"),
  diagnostic: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice"),
  independent: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "independent_practice"),
  self_practice: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "independent_practice"),
  parent_assigned_activity: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "personal_activity"),
  classroom_assigned_activity: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "class_activity"),
  unknown: "Unknown",
};

/** @deprecated Alias — Global uses English labels; keep HE export name for import stability. */
export const PARENT_REPORT_MODE_LABELS_HE = PARENT_REPORT_MODE_LABELS_EN;

/** Parent-visible activity source — never show technical mode like guided_practice. */
const PARENT_ACTIVITY_SOURCE_RESOLVE_ORDER = Object.freeze([
  "primaryEvidenceSource",
  "latestActivitySource",
  "evidenceSource",
  "sourceType",
]);

/**
 * Parent-facing source label for a practice row (not mode).
 * @param {Record<string, unknown>|string|null|undefined} input
 */
export function formatParentReportActivitySourceHe(input) {
  if (input == null) return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice");
  if (typeof input === "string") {
    const key = normalizeKey(input);
    if (key === "parent_assigned_activity") return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "personal_activity_from_parent");
    if (key === "self_practice") return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "independent_practice");
    if (key === "guided_practice" || key === "guided") return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice");
    if (PARENT_REPORT_SOURCE_LABELS_EN[key]) return PARENT_REPORT_SOURCE_LABELS_EN[key];
    return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice");
  }
  const row = input && typeof input === "object" ? input : {};
  for (const field of PARENT_ACTIVITY_SOURCE_RESOLVE_ORDER) {
    const resolved = formatParentReportActivitySourceHe(row[field]);
    if (resolved !== reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice")) return resolved;
  }
  const modeKey = normalizeKey(row.modeKey ?? row.mode);
  if (modeKey === "self_practice" || modeKey === "independent") return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "independent_practice");
  if (modeKey === "parent_assigned_activity") return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "personal_activity_from_parent");
  return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice");
}

function resolveActivitySourceKind(row) {
  const r = row && typeof row === "object" ? row : {};
  for (const field of PARENT_ACTIVITY_SOURCE_RESOLVE_ORDER) {
    const key = normalizeKey(r[field]);
    if (key === "parent_assigned_activity") return "parent_assigned_activity";
    if (key === "self_practice") return "self_practice";
  }
  const modeKey = normalizeKey(r.modeKey ?? r.mode);
  if (modeKey === "parent_assigned_activity") return "parent_assigned_activity";
  if (modeKey === "self_practice" || modeKey === "independent") return "self_practice";
  return "practice";
}

function resolveActivityTopicLabelHe(row, options = {}) {
  const r = row && typeof row === "object" ? row : {};
  const clean = String(r.cleanTopicLabelHe || r.rowIdentityV1?.cleanTopicLabelHe || "").trim();
  if (clean && clean !== "Topic" && clean !== reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice")) return clean;
  const displayName = String(r.displayName || options.topicLabelHe || "").trim();
  if (displayName && displayName !== "Topic" && displayName !== reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice")) {
    return displayName;
  }
  const bucket = String(r.bucketKey ?? r.topicKey ?? options.topicKey ?? "").trim();
  if (bucket && !bucket.includes("\u0001")) {
    const short = bucket.split("::grade:")[0] || bucket;
    if (short && short !== "general") return short.replace(/_/g, " ");
  }
  return "";
}

function activityLabelWithSubjectGradeFallback(baseLabel, row, subjectId) {
  const sid = String(subjectId || row?.subject || row?.subjectId || "").trim();
  const subjectLabel = sid ? formatParentReportSubjectHe(sid) : "";
  const gradeLabel = formatParentReportGradeHe(
    row?.contentGradeKey ?? row?.gradeKey ?? row?.contentGradeLevel ?? row?.grade
  );
  if (subjectLabel && gradeLabel && gradeLabel !== reportPackCopy("utils__parent-report-language__parent-report-display-labels", "not_available")) {
    return `${baseLabel} - ${subjectLabel} grade ${gradeLabel}`;
  }
  if (subjectLabel) return `${baseLabel} - ${subjectLabel}`;
  return baseLabel;
}

/**
 * Parent-facing titles must not expose debug/QA strings (Phase9, ISO timestamps, etc.).
 * @param {unknown} title
 */
export function isTechnicalParentActivityTitleHe(title) {
  const t = String(title || "").trim();
  if (!t) return false;
  if (/\[\s*phase\s*\d+/i.test(t)) return true;
  if (/\bphase\s*\d+\b/i.test(t) && /live|dashboard|debug|test|fixture|qa/i.test(t)) return true;
  if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(t)) return true;
  if (/^\d{4}-\d{2}-\d{2}/.test(t) && /\[[^\]]+\]/.test(t)) return true;
  if (/^\[[^\]]{4,}\]/.test(t) && /[a-zA-Z][a-zA-Z0-9_-]{3,}/.test(t)) return true;
  return false;
}

/**
 * Parent-facing combined activity label for table source/mode columns.
 * Parent-assigned activities include topic; self practice stays plain reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice").
 * @param {Record<string, unknown>|string|null|undefined} input
 * @param {{ subjectId?: string, topicKey?: string, topicLabelHe?: string }} [options]
 */
export function formatParentReportActivityDisplayLabelHe(input, options = {}) {
  if (input == null) return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "practice");
  if (typeof input === "string") return formatParentReportActivitySourceHe(input);

  const row = input && typeof input === "object" ? input : {};
  const topicLabel = resolveActivityTopicLabelHe(row, options);
  const sourceKind = resolveActivitySourceKind(row);

  if (sourceKind === "parent_assigned_activity") {
    const titleRaw = String(
      row.parentActivityTitleHe ??
        row.parentActivityTitle ??
        row.activityTitleHe ??
        row.titleHe ??
        row.title ??
        ""
    ).trim();
    const base = !isTechnicalParentActivityTitleHe(titleRaw)
      ? titleRaw || reportPackCopy("utils__parent-report-language__parent-report-display-labels", "personal_activity_from_parent")
      : reportPackCopy("utils__parent-report-language__parent-report-display-labels", "personal_activity_from_parent");
    if (topicLabel) return `${base} - ${topicLabel}`;
    return activityLabelWithSubjectGradeFallback(base, row, options.subjectId);
  }

  if (sourceKind === "self_practice") {
    return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "independent_practice");
  }

  return formatParentReportActivitySourceHe(row);
}

/** @type {Record<string, string>} */
export const PARENT_REPORT_SOURCE_LABELS_EN = {
  self_practice: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "independent_practice"),
  parent_assigned_activity: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "personal_activity_from_parent"),
  learning_book: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "learning_book"),
  worksheet: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "worksheet"),
  classroom_assigned_activity: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "class_activity"),
  report: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "report"),
  activity: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "activity"),
  unknown: "Unknown",
  unavailable: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "not_available"),
  partial: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "partial"),
  available: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "available"),
  not_tracked: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "not_measured"),
  requires_events: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "needs_more_data"),
};

/** @type {Record<string, string>} */
export const PARENT_REPORT_STATUS_LABELS_EN = {
  completed: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "completed"),
  active: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "active"),
  inactive: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "inactive"),
  submitted: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "submitted"),
  in_progress: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "in_progress"),
  not_started: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "not_started"),
  sufficient: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "sufficient"),
  insufficient: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "insufficient"),
  unavailable: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "not_available"),
  partial: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "partial"),
  empty: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "no_data"),
  unknown: "Unknown",
  not_tracked: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "not_measured"),
  requires_events: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "needs_more_data"),
  available: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "available"),
  true: "Yes",
  false: "No",
};

/** @type {Record<string, string>} — parent practice levels: Regular / Advanced only */
export const PARENT_REPORT_LEVEL_LABELS_EN = {
  regular: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "regular"),
  advanced: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "advanced"),
  easy: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "regular"),
  medium: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "regular"),
  mixed: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "regular"),
  hard: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "advanced"),
  low: "Low",
  high: "High",
  moderate: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "moderate"),
  strong: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "strong"),
  weak: "Weak",
};

/** @type {Record<string, string>} */
export const PARENT_REPORT_EVIDENCE_LABELS_EN = {
  low: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "limited"),
  medium: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "moderate"),
  strong: "Good",
  high: "High",
  moderate: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "moderate"),
  contradictory: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "inconsistent"),
  insufficient: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "insufficient"),
  sufficient: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "sufficient"),
  unknown: "Unknown",
  partial: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "partial"),
  no_data: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "no_data"),
  nodata: reportPackCopy("utils__parent-report-language__parent-report-display-labels", "no_data"),
};

function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function mapFromTable(value, table, fallback = "-") {
  const key = normalizeKey(value);
  if (!key) return fallback;
  if (table[key]) return table[key];
  if (key.includes(":")) {
    return key
      .split(":")
      .map((part) => mapFromTable(part, table, part.replace(/_/g, " ")))
      .join(" · ");
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(key)) return key;
  return fallback;
}

/** @param {string|null|undefined} subjectId */
export function formatParentReportSubjectHe(subjectId) {
  const key = normalizeKey(subjectId);
  if (!key || key === "unknown") return "Unknown";
  if (PARENT_REPORT_SUBJECT_LABELS_EN[key]) return PARENT_REPORT_SUBJECT_LABELS_EN[key];
  return "Unknown";
}

/** @param {string|null|undefined} topic */
export function formatParentReportTopicHe(topic) {
  const raw = String(topic || "").trim();
  if (!raw) return "Topic";
  return mapFromTable(raw, PARENT_REPORT_MODE_LABELS_EN, raw.replace(/_/g, " "));
}

/** @param {string|null|undefined} mode */
export function formatParentReportModeHe(mode) {
  return mapFromTable(mode, PARENT_REPORT_MODE_LABELS_EN, reportPackCopy("utils__parent-report-language__parent-report-display-labels", "not_available"));
}

/** @param {string|null|undefined} source */
export function formatParentReportSourceHe(source) {
  return mapFromTable(source, PARENT_REPORT_SOURCE_LABELS_EN, "Unknown");
}

/** @param {string|null|undefined} status */
export function formatParentReportStatusHe(status) {
  return mapFromTable(status, PARENT_REPORT_STATUS_LABELS_EN, "-");
}

/**
 * @param {string|null|undefined} level
 * @param {string|null|undefined} [subjectId]
 */
export function formatParentReportLevelHe(level, subjectId) {
  if (level == null || level === "") return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "not_available");
  return mapFromTable(level, PARENT_REPORT_LEVEL_LABELS_EN, reportPackCopy("utils__parent-report-language__parent-report-display-labels", "not_available"));
}

/** @param {string|null|undefined} grade */
export function formatParentReportGradeHe(grade) {
  const raw = String(grade ?? "").trim();
  if (!raw) return reportPackCopy("utils__parent-report-language__parent-report-display-labels", "not_available");
  const n = Number(raw.replace(/[^\d.]/g, ""));
  if (Number.isFinite(n) && n > 0) return String(Math.round(n));
  return mapFromTable(grade, PARENT_REPORT_LEVEL_LABELS_EN, reportPackCopy("utils__parent-report-language__parent-report-display-labels", "not_available"));
}

/** @param {string|null|undefined} evidence */
export function formatParentReportEvidenceHe(evidence) {
  return mapFromTable(evidence, PARENT_REPORT_EVIDENCE_LABELS_EN, "-");
}

/** @param {string|null|undefined} label */
export function formatParentReportLabelHe(label) {
  const raw = String(label || "").trim();
  if (!raw) return "-";

  const key = normalizeKey(raw);
  if (PARENT_REPORT_SUBJECT_LABELS_EN[key]) return PARENT_REPORT_SUBJECT_LABELS_EN[key];
  if (PARENT_REPORT_MODE_LABELS_EN[key]) return PARENT_REPORT_MODE_LABELS_EN[key];
  if (PARENT_REPORT_SOURCE_LABELS_EN[key]) return PARENT_REPORT_SOURCE_LABELS_EN[key];
  if (PARENT_REPORT_STATUS_LABELS_EN[key]) return PARENT_REPORT_STATUS_LABELS_EN[key];
  if (PARENT_REPORT_LEVEL_LABELS_EN[key]) return PARENT_REPORT_LEVEL_LABELS_EN[key];
  if (PARENT_REPORT_EVIDENCE_LABELS_EN[key]) return PARENT_REPORT_EVIDENCE_LABELS_EN[key];

  if (raw.includes(" · ")) {
    return raw
      .split(" · ")
      .map((part) => formatParentReportLabelHe(part.trim()))
      .join(" · ");
  }

  return raw.replace(/_/g, " ");
}

/** English enum tokens that must never appear verbatim in parent-visible report copy. */
export const PARENT_REPORT_FORBIDDEN_ENGLISH_ENUMS = Object.freeze([
  "self_practice",
  "parent_assigned_activity",
  "learning_book",
  "guided_practice",
  "classroom_assigned_activity",
  "practice_mistakes",
  "requires_events",
  "not_tracked",
  "diagnosticenginev2",
  "unknown_scope",
  "registered_grade_primary",
  "enrichment_stretch",
  "prerequisite_foundation",
]);

/**
 * @param {string} text
 * @returns {string[]}
 */
export function findParentReportEnglishEnumLeaks(text) {
  const lower = String(text || "").toLowerCase();
  const hits = [];
  for (const token of PARENT_REPORT_FORBIDDEN_ENGLISH_ENUMS) {
    const re = new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (re.test(lower)) hits.push(token);
  }
  return hits;
}
