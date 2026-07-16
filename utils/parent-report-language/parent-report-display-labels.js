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
  hebrew: "Hebrew",
  science: "Science",
  history: "History",
  moledet: "Homeland Studies",
  geography: "Geography",
  moledet_geography: "Homeland & Geography",
  "moledet-geography": "Homeland & Geography",
};

/** @deprecated Alias — Global uses English labels; keep HE export name for import stability. */
export const PARENT_REPORT_SUBJECT_LABELS_HE = PARENT_REPORT_SUBJECT_LABELS_EN;

/** @type {Record<string, string>} */
export const PARENT_REPORT_MODE_LABELS_EN = {
  learning: "Learning",
  practice: "Practice",
  challenge: "Challenge",
  speed: "Speed",
  marathon: "Extended practice",
  review: "Review",
  drill: "Focused practice",
  graded: "Graded",
  normal: "Regular",
  mistakes: "Mistakes",
  practice_mistakes: "Mistake review",
  quiz: "Quiz",
  homework: "Homework",
  guided_practice: "Practice",
  guided: "Practice",
  live_lesson: "Live lesson",
  discussion: "Discussion",
  worksheet: "Worksheet",
  learning_book: "Learning book",
  diagnostic: "Practice",
  independent: "Independent practice",
  self_practice: "Independent practice",
  parent_assigned_activity: "Personal activity",
  classroom_assigned_activity: "Class activity",
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
  if (input == null) return "Practice";
  if (typeof input === "string") {
    const key = normalizeKey(input);
    if (key === "parent_assigned_activity") return "Personal activity from parent";
    if (key === "self_practice") return "Independent practice";
    if (key === "guided_practice" || key === "guided") return "Practice";
    if (PARENT_REPORT_SOURCE_LABELS_EN[key]) return PARENT_REPORT_SOURCE_LABELS_EN[key];
    return "Practice";
  }
  const row = input && typeof input === "object" ? input : {};
  for (const field of PARENT_ACTIVITY_SOURCE_RESOLVE_ORDER) {
    const resolved = formatParentReportActivitySourceHe(row[field]);
    if (resolved !== "Practice") return resolved;
  }
  const modeKey = normalizeKey(row.modeKey ?? row.mode);
  if (modeKey === "self_practice" || modeKey === "independent") return "Independent practice";
  if (modeKey === "parent_assigned_activity") return "Personal activity from parent";
  return "Practice";
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
  if (clean && clean !== "Topic" && clean !== "Practice") return clean;
  const displayName = String(r.displayName || options.topicLabelHe || "").trim();
  if (displayName && displayName !== "Topic" && displayName !== "Practice") {
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
  if (subjectLabel && gradeLabel && gradeLabel !== "Not available") {
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
 * Parent-assigned activities include topic; self practice stays plain "Practice".
 * @param {Record<string, unknown>|string|null|undefined} input
 * @param {{ subjectId?: string, topicKey?: string, topicLabelHe?: string }} [options]
 */
export function formatParentReportActivityDisplayLabelHe(input, options = {}) {
  if (input == null) return "Practice";
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
      ? titleRaw || "Personal activity from parent"
      : "Personal activity from parent";
    if (topicLabel) return `${base} - ${topicLabel}`;
    return activityLabelWithSubjectGradeFallback(base, row, options.subjectId);
  }

  if (sourceKind === "self_practice") {
    return "Independent practice";
  }

  return formatParentReportActivitySourceHe(row);
}

/** @type {Record<string, string>} */
export const PARENT_REPORT_SOURCE_LABELS_EN = {
  self_practice: "Independent practice",
  parent_assigned_activity: "Personal activity from parent",
  learning_book: "Learning book",
  worksheet: "Worksheet",
  classroom_assigned_activity: "Class activity",
  report: "Report",
  activity: "Activity",
  unknown: "Unknown",
  unavailable: "Not available",
  partial: "Partial",
  available: "Available",
  not_tracked: "Not measured",
  requires_events: "Needs more data",
};

/** @type {Record<string, string>} */
export const PARENT_REPORT_STATUS_LABELS_EN = {
  completed: "Completed",
  active: "Active",
  inactive: "Inactive",
  submitted: "Submitted",
  in_progress: "In progress",
  not_started: "Not started",
  sufficient: "Sufficient",
  insufficient: "Insufficient",
  unavailable: "Not available",
  partial: "Partial",
  empty: "No data",
  unknown: "Unknown",
  not_tracked: "Not measured",
  requires_events: "Needs more data",
  available: "Available",
  true: "Yes",
  false: "No",
};

/** @type {Record<string, string>} — parent practice levels: Regular / Advanced only */
export const PARENT_REPORT_LEVEL_LABELS_EN = {
  regular: "Regular",
  advanced: "Advanced",
  easy: "Regular",
  medium: "Regular",
  mixed: "Regular",
  hard: "Advanced",
  low: "Low",
  high: "High",
  moderate: "Moderate",
  strong: "Strong",
  weak: "Weak",
};

/** @type {Record<string, string>} */
export const PARENT_REPORT_EVIDENCE_LABELS_EN = {
  low: "Limited",
  medium: "Moderate",
  strong: "Good",
  high: "High",
  moderate: "Moderate",
  contradictory: "Inconsistent",
  insufficient: "Insufficient",
  sufficient: "Sufficient",
  unknown: "Unknown",
  partial: "Partial",
  no_data: "No data",
  nodata: "No data",
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
  return mapFromTable(mode, PARENT_REPORT_MODE_LABELS_EN, "Not available");
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
  if (level == null || level === "") return "Not available";
  return mapFromTable(level, PARENT_REPORT_LEVEL_LABELS_EN, "Not available");
}

/** @param {string|null|undefined} grade */
export function formatParentReportGradeHe(grade) {
  const raw = String(grade ?? "").trim();
  if (!raw) return "Not available";
  const n = Number(raw.replace(/[^\d.]/g, ""));
  if (Number.isFinite(n) && n > 0) return String(Math.round(n));
  return mapFromTable(grade, PARENT_REPORT_LEVEL_LABELS_EN, "Not available");
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
