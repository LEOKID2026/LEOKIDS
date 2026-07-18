/**
 * Central display labels for school / admin / teacher / student management UI.
 * Internal keys stay English in code — browser-visible text uses these helpers.
 * Global product: English only (no Hebrew fallback).
 */

import platformEn from "../../locales/en/platform.json" with { type: "json" };
import validationEn from "../../locales/en/validation.json" with { type: "json" };

export const SUBJECT_ORDER = [
  "math",
  "geometry",
  "english",
  "hebrew",
  "science",
  "moledet_geography",
  "history",
];

/** @type {Record<string, string>} */
export const SUBJECT_LABEL_HE = platformEn.subjects;

/** @type {Record<string, string>} */
export const ACTIVITY_MODE_LABEL_HE = platformEn.activityModes;

/** @type {Record<string, string>} */
export const ACTIVITY_STATUS_LABEL_HE = platformEn.activityStatuses;

/** @type {Record<string, string>} */
export const STUDENT_ACTIVITY_STATUS_LABEL_HE = platformEn.studentActivityStatuses;

/** @type {Record<string, string>} */
export const ROLE_LABEL_HE = platformEn.roles;

/** @type {Record<string, string>} */
export const AUDIT_ACTION_LABEL_HE = platformEn.auditActions;

/** @type {Record<string, string>} */
export const API_ERROR_LABEL_HE = validationEn.api;

const RAW_KEY_PATTERN =
  /^(math|geometry|hebrew|english|science|moledet_geography|moledet|history|guided_practice|quiz|homework|practice|review|draft|active|paused|closed|archived|submitted|in_progress|not_started|school_admin|teacher|admin)$/i;

function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function unknownDisplayHe() {
  return platformEn.fallback.unknownDisplay;
}

/**
 * @param {string|null|undefined} key
 */
export function subjectLabelHe(key) {
  if (!key) return unknownDisplayHe();
  const k = normalizeKey(key);
  return SUBJECT_LABEL_HE[k] || unknownDisplayHe();
}

/**
 * @param {string|null|undefined} mode
 */
export function activityModeLabelHe(mode) {
  if (!mode) return unknownDisplayHe();
  const k = normalizeKey(mode);
  return ACTIVITY_MODE_LABEL_HE[k] || unknownDisplayHe();
}

/**
 * @param {string|null|undefined} status
 */
export function activityStatusLabelHe(status) {
  if (!status) return unknownDisplayHe();
  const k = normalizeKey(status);
  return ACTIVITY_STATUS_LABEL_HE[k] || unknownDisplayHe();
}

/**
 * @param {string|null|undefined} status
 */
export function studentActivityStatusLabelHe(status) {
  if (!status) return unknownDisplayHe();
  const k = normalizeKey(status);
  return STUDENT_ACTIVITY_STATUS_LABEL_HE[k] || unknownDisplayHe();
}

/**
 * @param {string|null|undefined} role
 */
export function roleLabelHe(role) {
  if (!role) return unknownDisplayHe();
  const k = normalizeKey(role);
  return ROLE_LABEL_HE[k] || unknownDisplayHe();
}

/**
 * @param {string|null|undefined} action
 */
export function auditActionLabelHe(action) {
  if (!action) return unknownDisplayHe();
  const k = normalizeKey(action);
  return AUDIT_ACTION_LABEL_HE[k] || platformEn.fallback.systemAction;
}

/**
 * @param {{ code?: string|null, message?: string|null }|string|null|undefined} error
 * @param {string} [fallback]
 */
export function apiErrorMessageHe(error, fallback = validationEn.apiFallback) {
  if (!error) return fallback;
  if (typeof error === "string") {
    const k = normalizeKey(error);
    return API_ERROR_LABEL_HE[k] || (RAW_KEY_PATTERN.test(k) ? fallback : error);
  }
  const code = normalizeKey(error.code);
  if (code && API_ERROR_LABEL_HE[code]) return API_ERROR_LABEL_HE[code];
  const message = String(error.message || "").trim();
  if (message && !RAW_KEY_PATTERN.test(normalizeKey(message)) && !/^[a-z][a-z0-9_]*$/i.test(message)) {
    return message;
  }
  if (code && API_ERROR_LABEL_HE[code]) return API_ERROR_LABEL_HE[code];
  return fallback;
}

/**
 * @returns {{ value: string, label: string }[]}
 */
export function subjectSelectOptionsHe() {
  return SUBJECT_ORDER.map((value) => ({
    value,
    label: SUBJECT_LABEL_HE[value],
  }));
}

/**
 * @param {string|null|undefined} title
 * @param {string|null|undefined} subject
 */
function escapeRegExp(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Replace raw internal keys embedded anywhere in visible copy. */
function replaceRawKeysInText(text) {
  let out = String(text || "");
  const replacements = [
    ...SUBJECT_ORDER.map((sid) => [sid, SUBJECT_LABEL_HE[sid]]),
    ["moledet-geography", SUBJECT_LABEL_HE.moledet_geography],
    ...Object.entries(ACTIVITY_MODE_LABEL_HE),
    ...Object.entries(ACTIVITY_STATUS_LABEL_HE),
  ];
  for (const [key, heLabel] of replacements) {
    if (!key || !heLabel) continue;
    const pattern = escapeRegExp(key).replace(/_/g, "[_\\s-]+");
    out = out.replace(new RegExp("\\b" + pattern + "\\b", "gi"), heLabel);
    if (out.toLowerCase() === key.toLowerCase()) out = heLabel;
  }
  return out.replace(/\s{2,}/g, " ").trim();
}

export function sanitizeActivityTitleHe(title, subject) {
  const raw = String(title || "").trim();
  const subjHe = subjectLabelHe(subject);
  const activityWord = platformEn.fallback.activity;
  const classActivity = platformEn.fallback.classActivity;
  const activitySuffix = platformEn.fallback.activitySuffix;
  if (!raw) return subjHe !== "-" ? `${subjHe} ${activitySuffix}` : classActivity;
  let out = raw;
  for (const sid of SUBJECT_ORDER) {
    const re = new RegExp("^" + sid.replace("_", "[_ ]") + "\\s*[-:\\u2014]\\s*", "i");
    if (re.test(out)) {
      out = out.replace(re, subjHe !== "-" ? `${subjHe} · ` : "");
      break;
    }
    if (out.toLowerCase() === sid || out.toLowerCase().startsWith(`${sid} `)) {
      out = out.replace(new RegExp(`^${sid}`, "i"), subjHe !== "-" ? subjHe : activityWord);
      break;
    }
  }
  out = replaceRawKeysInText(out);
  if (subjHe !== "-" && !out.includes(subjHe)) {
    out = out.replace(/\s*[-:\u2014]\s*$/u, "").trim();
  }
  return out || (subjHe !== "-" ? `${subjHe} ${activitySuffix}` : classActivity);
}

/** Keys that must never appear as visible UI text when mapped through helpers. */
export const RAW_VISIBLE_KEY_DENYLIST = [
  "math",
  "geometry",
  "hebrew",
  "english",
  "science",
  "history",
  "moledet_geography",
  "guided_practice",
  "quiz",
  "homework",
  "draft",
  "active",
  "paused",
  "closed",
  "archived",
  "submitted",
  "in_progress",
  "not_started",
  "school_admin",
  "teacher",
];
