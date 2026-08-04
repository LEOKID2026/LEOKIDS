/**
 * Central display labels for school / admin / teacher / student management UI.
 * Internal keys stay English in code — browser-visible text uses these helpers.
 */

import platformEn from "../../locales/en/platform.json" with { type: "json" };
import validationEn from "../../locales/en/validation.json" with { type: "json" };
import { loadLocaleBundles } from "../i18n/load-messages.js";

export const SUBJECT_ORDER = [
  "math",
  "geometry",
  "english",
  "science",
];

/** @type {string} */
let _platformDisplayLocale = "en";

/** @type {Record<string, string>} */
export let SUBJECT_LABEL_HE = Object.create(null);

/** @type {Record<string, string>} */
export let ACTIVITY_MODE_LABEL_HE = Object.create(null);

/** @type {Record<string, string>} */
export let ACTIVITY_STATUS_LABEL_HE = Object.create(null);

/** @type {Record<string, string>} */
export let STUDENT_ACTIVITY_STATUS_LABEL_HE = Object.create(null);

/** @type {Record<string, string>} */
export let ROLE_LABEL_HE = Object.create(null);

/** @type {Record<string, string>} */
export let AUDIT_ACTION_LABEL_HE = Object.create(null);

/** @type {Record<string, string>} */
export let API_ERROR_LABEL_HE = Object.create(null);

/** @type {typeof platformEn} */
let _platformPack = {
  subjects: Object.create(null),
  activityModes: Object.create(null),
  activityStatuses: Object.create(null),
  studentActivityStatuses: Object.create(null),
  roles: Object.create(null),
  auditActions: Object.create(null),
  fallback: {
    unknownDisplay: "\u00a0",
    activity: "\u00a0",
    classActivity: "\u00a0",
    activitySuffix: "\u00a0",
    systemAction: "\u00a0",
  },
};
/** @type {typeof validationEn} */
let _validationPack = {
  api: Object.create(null),
  apiFallback: "\u00a0",
};

/** Bind platform/validation display labels to interface locale. */
export function bindPlatformDisplayLocale(localeId) {
  _platformDisplayLocale = localeId || "en";
  const bundles = loadLocaleBundles(_platformDisplayLocale);
  const isEn = !_platformDisplayLocale || _platformDisplayLocale === "en";
  const emptyFallback = {
    unknownDisplay: "\u00a0",
    activity: "\u00a0",
    classActivity: "\u00a0",
    activitySuffix: "\u00a0",
    systemAction: "\u00a0",
  };
  _platformPack =
    bundles.platform && typeof bundles.platform === "object"
      ? bundles.platform
      : isEn
        ? platformEn
        : { ...platformEn, subjects: Object.create(null), activityModes: Object.create(null), activityStatuses: Object.create(null), studentActivityStatuses: Object.create(null), roles: Object.create(null), auditActions: Object.create(null), fallback: emptyFallback };
  _validationPack =
    bundles.validation && typeof bundles.validation === "object"
      ? bundles.validation
      : isEn
        ? validationEn
        : { api: Object.create(null), apiFallback: "\u00a0" };
  SUBJECT_LABEL_HE = _platformPack.subjects || (isEn ? platformEn.subjects : Object.create(null));
  ACTIVITY_MODE_LABEL_HE = _platformPack.activityModes || (isEn ? platformEn.activityModes : Object.create(null));
  ACTIVITY_STATUS_LABEL_HE =
    _platformPack.activityStatuses || (isEn ? platformEn.activityStatuses : Object.create(null));
  STUDENT_ACTIVITY_STATUS_LABEL_HE =
    _platformPack.studentActivityStatuses ||
    (isEn ? platformEn.studentActivityStatuses : Object.create(null));
  ROLE_LABEL_HE = _platformPack.roles || (isEn ? platformEn.roles : Object.create(null));
  AUDIT_ACTION_LABEL_HE =
    _platformPack.auditActions || (isEn ? platformEn.auditActions : Object.create(null));
  API_ERROR_LABEL_HE = _validationPack.api || (isEn ? validationEn.api : Object.create(null));
}

const RAW_KEY_PATTERN =
  /^(math|geometry|english|science|guided_practice|quiz|homework|practice|review|draft|active|paused|closed|archived|submitted|in_progress|not_started|school_admin|teacher|admin)$/i;

function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

function unknownDisplayHe() {
  if (_platformDisplayLocale && _platformDisplayLocale !== "en") {
    return _platformPack.fallback?.unknownDisplay || "\u00a0";
  }
  return _platformPack.fallback?.unknownDisplay || platformEn.fallback.unknownDisplay;
}

/**
 * @param {string|null|undefined} key
 */
export function subjectLabel(key) {
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
  return AUDIT_ACTION_LABEL_HE[k] || _platformPack.fallback?.systemAction || unknownDisplayHe();
}

/**
 * @param {{ code?: string|null, message?: string|null }|string|null|undefined} error
 * @param {string} [fallback]
 */
export function apiErrorMessageHe(error, fallback) {
  const resolvedFallback =
    fallback ??
    _validationPack.apiFallback ??
    (_platformDisplayLocale === "en" ? validationEn.apiFallback : "\u00a0");
  if (!error) return resolvedFallback;
  if (typeof error === "string") {
    const k = normalizeKey(error);
    return API_ERROR_LABEL_HE[k] || (RAW_KEY_PATTERN.test(k) ? resolvedFallback : error);
  }
  const code = normalizeKey(error.code);
  if (code && API_ERROR_LABEL_HE[code]) return API_ERROR_LABEL_HE[code];
  const message = String(error.message || "").trim();
  if (message && !RAW_KEY_PATTERN.test(normalizeKey(message)) && !/^[a-z][a-z0-9_]*$/i.test(message)) {
    return message;
  }
  if (code && API_ERROR_LABEL_HE[code]) return API_ERROR_LABEL_HE[code];
  return resolvedFallback;
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
  const subjHe = subjectLabel(subject);
  const activityWord = _platformPack.fallback?.activity || ( _platformDisplayLocale === "en" ? platformEn.fallback.activity : "\u00a0");
  const classActivity = _platformPack.fallback?.classActivity || ( _platformDisplayLocale === "en" ? platformEn.fallback.classActivity : "\u00a0");
  const activitySuffix = _platformPack.fallback?.activitySuffix || ( _platformDisplayLocale === "en" ? platformEn.fallback.activitySuffix : "\u00a0");
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
  "english",
  "science",
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
