/**
 * Centralized English display labels for teacher activity report Excel export.
 * Internal keys stay in code/DB — export cells must use these helpers only.
 */

import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
import {
  activityModeLabelHe,
  SUBJECT_ORDER,
  subjectLabelHe,
} from "../platform-ui/hebrew-display-labels.js";
import { resolveClassroomSkillLabelHe } from "../classroom-activities/classroom-skill-labels-he.js";
import { resolveTopicLabelHe } from "./teacher-ui.js";
import { formatGradeLevelHe } from "./teacher-class-grade.js";
import { activityDbDifficultyLabelHe } from "../learning/activity-display-level.js";
import { isScienceSubjectId } from "../learning/display-level.js";

/** Export-only subject overrides (teacher-facing spelling preferences). */
const EXPORT_SUBJECT_LABEL_HE = {
  geometry: "Geometry",
};

/** Export-only activity mode overrides. */
const EXPORT_ACTIVITY_MODE_LABEL_HE = {
  live_lesson: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "live_lesson"),
  guided_practice: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "guided_practice"),
  quiz: "Quiz",
  homework: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "homework"),
  discussion: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "class_discussion"),
};

/** @type {Record<string, string>} — 2-level fallback only (Standard / Advanced) */
const EXPORT_DIFFICULTY_LABEL_HE = {
  easy: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "standard"),
  medium: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "standard"),
  hard: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "advanced"),
  mixed: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "standard"),
  regular: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "standard"),
  advanced: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "advanced"),
};

/**
 * SIM / stub skill keys that map cleanly to topic Hebrew labels.
 * Documented for owner review — used when resolveClassroomSkillLabelHe is too generic.
 * @type {Record<string, string>}
 */
const EXPORT_STUB_SKILL_KEY_HE = {
  angles_skill: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "angles"),
  shapes_skill: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "shapes"),
  area_skill: "Area",
  perimeter_skill: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "perimeter"),
  volume_skill: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "volume"),
  general_skill: globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "general_practice"),
};

const RAW_KEY_RE =
  /^[a-z][a-z0-9_]*$/i;

const ISRAEL_TZ = globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "asia_jerusalem");

/**
 * @param {string|null|undefined} key
 */
export function activityExportSubjectLabelHe(key) {
  if (!key) return "";
  const k = String(key).trim().toLowerCase().replace(/-/g, "_");
  if (EXPORT_SUBJECT_LABEL_HE[k]) return EXPORT_SUBJECT_LABEL_HE[k];
  const fromGlobal = subjectLabelHe(k);
  return fromGlobal === "-" ? "" : fromGlobal;
}

/**
 * @param {string|null|undefined} mode
 */
export function activityExportModeLabelHe(mode) {
  if (!mode) return "";
  const k = String(mode).trim().toLowerCase();
  if (EXPORT_ACTIVITY_MODE_LABEL_HE[k]) return EXPORT_ACTIVITY_MODE_LABEL_HE[k];
  const fromGlobal = activityModeLabelHe(k);
  return fromGlobal === "-" ? "" : fromGlobal;
}

/**
 * @param {string|null|undefined} level DB difficulty_level enum
 * @param {string|null|undefined} [subjectId]
 */
export function activityExportDifficultyLabelHe(level, subjectId) {
  // Prefer local EN maps; ignore HE labels from shared activity-display-level helper.
  if (!level) return "";
  if (isScienceSubjectId(subjectId)) return globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "standard");
  const k = String(level).trim().toLowerCase();
  if (EXPORT_DIFFICULTY_LABEL_HE[k]) return EXPORT_DIFFICULTY_LABEL_HE[k];
  const displayLabel = activityDbDifficultyLabelHe(level, subjectId);
  if (displayLabel && !/[\u0590-\u05FF]/.test(displayLabel)) return displayLabel;
  return "";
}

/**
 * @param {string|null|undefined} subject
 * @param {string|null|undefined} topic
 */
export function activityExportTopicLabelHe(subject, topic) {
  if (!topic) return "";
  const t = String(topic).trim();
  if (!t) return "";
  if (/[\u0590-\u05FF]/.test(t) && !RAW_KEY_RE.test(t)) {
    // Do not pass through Hebrew topic strings on the EN export surface.
    return "";
  }
  const label = resolveTopicLabelHe(subject, t);
  if (label) return label;
  // Topic keys like angles/shapes for geometry when taxonomy lookup misses
  const fallback = resolveTopicLabelHe(subject || "geometry", t.replace(/_skill$/i, ""));
  return fallback || "";
}

/**
 * @param {string|null|undefined} skillKey
 * @param {{ subject?: string|null, topic?: string|null, gradeLevel?: string|number|null }} [ctx]
 */
export function activityExportSkillLabelHe(skillKey, ctx = {}) {
  const key = String(skillKey || "").trim();
  if (!key) return "";

  if (EXPORT_STUB_SKILL_KEY_HE[key]) return EXPORT_STUB_SKILL_KEY_HE[key];

  const classroomLabel = resolveClassroomSkillLabelHe(key, {
    subject: String(ctx.subject || ""),
    gradeLevel: ctx.gradeLevel ?? null,
  });

  const subjectFallbacks = [
    "Geometry skill",
    "Math skill",
    "English skill",
    "Hebrew skill",
    "Science skill",
    "Homeland & Geography skill",
    "Practice skill",
    globalBurnDownCopy("lib__teacher-portal__teacher-activity-report-export-labels", "general_practice"),
  ];
  const isGeneric =
    !classroomLabel ||
    subjectFallbacks.includes(classroomLabel) ||
    /[\u0590-\u05FF]/.test(classroomLabel) ||
    RAW_KEY_RE.test(classroomLabel);

  if (!isGeneric) return classroomLabel;

  // Strip _skill suffix and resolve as topic label
  const topicFromKey = key.replace(/_skill$/i, "");
  const fromTopic = activityExportTopicLabelHe(ctx.subject, topicFromKey);
  if (fromTopic) return fromTopic;

  if (ctx.topic) {
    const fromCtxTopic = activityExportTopicLabelHe(ctx.subject, ctx.topic);
    if (fromCtxTopic) return fromCtxTopic;
  }

  // Never return Hebrew labels from the shared HE skill map on the EN export surface.
  if (classroomLabel && classroomLabel !== key && !/[\u0590-\u05FF]/.test(classroomLabel)) {
    return classroomLabel;
  }
  return "";
}

function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Format YYYY-MM-DD or ISO timestamp to DD/MM/YYYY (export date-only).
 * @param {string|null|undefined} iso
 */
export function formatActivityExportDateOnlyHe(iso) {
  if (!iso) return "";
  const s = String(iso).trim();
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  const fromDateTime = formatActivityExportDateTimeHe(s);
  return fromDateTime ? fromDateTime.split(" ")[0] : "";
}

/**
 * Replace raw English/internal keys in export titles with Hebrew export labels.
 * @param {string} text
 * @param {string|null|undefined} subject
 */
function replaceExportRawKeysInTitle(text, subject) {
  let out = String(text || "");
  /** @type {Map<string, string>} */
  const replacements = new Map();

  for (const sid of SUBJECT_ORDER) {
    const label = activityExportSubjectLabelHe(sid);
    if (label) replacements.set(sid, label);
  }
  for (const [key, label] of Object.entries(EXPORT_ACTIVITY_MODE_LABEL_HE)) {
    if (label) replacements.set(key, label);
  }

  for (const [key, heLabel] of replacements) {
    if (!key || !heLabel) continue;
    const pattern = escapeRegExp(key).replace(/_/g, "[_\\s-]+");
    out = out.replace(new RegExp("\\b" + pattern + "\\b", "gi"), heLabel);
  }

  if (subject) {
    const subjHe = activityExportSubjectLabelHe(subject);
    if (subjHe) {
      const pattern = escapeRegExp(String(subject)).replace(/_/g, "[_\\s-]+");
      out = out.replace(new RegExp("\\b" + pattern + "\\b", "gi"), subjHe);
    }
  }

  return out.replace(/\s{2,}/g, " ").trim();
}

/**
 * Teacher-facing activity title for enriched Excel export only.
 * Strips SIM markers, ISO dates, internal class suffixes, and English keys.
 *
 * @param {string|null|undefined} title
 * @param {string|null|undefined} subject
 * @param {{ closedAt?: string|null, showSimulation?: boolean }} [options]
 */
export function activityExportTitleHe(title, subject, options = {}) {
  const { closedAt, showSimulation = false } = options;
  const raw = String(title || "").trim();
  const subjHe = activityExportSubjectLabelHe(subject);

  if (!raw) {
    return subjHe ? `${subjHe} activity` : "Class activity";
  }

  let out = raw;
  let exportDate = "";

  const simDateMatch = out.match(/\bSIM\s*:?\s*(\d{4}-\d{2}-\d{2})\b/i);
  if (simDateMatch) {
    exportDate = formatActivityExportDateOnlyHe(simDateMatch[1]);
    out = out.replace(/\s*SIM\s*:?\s*\d{4}-\d{2}-\d{2}\s*/gi, " ");
  } else {
    const bareDate = out.match(/\b(\d{4}-\d{2}-\d{2})\b/);
    if (bareDate) {
      exportDate = formatActivityExportDateOnlyHe(bareDate[1]);
      out = out.replace(/\s*\b\d{4}-\d{2}-\d{2}\b\s*/g, " ");
    }
  }

  out = out.replace(/\bSIM\b/gi, " ").trim();
  out = out.replace(/\s*(?:Class|Grade)\s*\d+\s*$/i, "").trim();
  out = replaceExportRawKeysInTitle(out, subject);

  const subjectKey = String(subject || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  if (subjectKey && subjHe) {
    const re = new RegExp(
      "^" + escapeRegExp(subjectKey).replace(/_/g, "[_ ]") + "\\s*[-:\\u2014]\\s*",
      "i"
    );
    if (re.test(out)) {
      out = out.replace(re, `${subjHe} · `);
    }
  }

  out = out
    .replace(/\s*[–·-]\s*[–-]\s*/g, " - ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*[–-]\s*$/u, "")
    .trim();

  if (!exportDate && closedAt) {
    exportDate = formatActivityExportDateOnlyHe(String(closedAt));
  }

  const simSegment = showSimulation ? " - simulation" : "";
  if (exportDate && !out.includes(exportDate)) {
    out = `${out}${simSegment} - ${exportDate}`;
  } else if (showSimulation && !out.includes("Simulation")) {
    out = `${out}${simSegment}`;
  }

  return out || (subjHe ? `${subjHe} activity` : "Class activity");
}

/**
 * @param {string|null|undefined} gradeLevel
 */
export function activityExportGradeLevelHe(gradeLevel) {
  return formatGradeLevelHe(gradeLevel) || "";
}

/**
 * Format ISO timestamp for teacher-facing Excel (Asia/Jerusalem).
 * Output: DD/MM/YYYY HH:mm
 * @param {string|null|undefined} iso
 */
export function formatActivityExportDateTimeHe(iso) {
  if (!iso) return "";
  const d = new Date(String(iso));
  if (Number.isNaN(d.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ISRAEL_TZ,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  /** @type {Record<string, string>} */
  const map = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }

  if (!map.day || !map.month || !map.year) return "";
  return `${map.day}/${map.month}/${map.year} ${map.hour}:${map.minute}`;
}

/**
 * True when a string looks like a raw internal English key that must not appear in export.
 * @param {unknown} value
 */
export function looksLikeRawExportKey(value) {
  const s = String(value ?? "").trim();
  if (!s) return false;
  if (/[\u0590-\u05FF]/.test(s)) return false;
  return RAW_KEY_RE.test(s);
}
