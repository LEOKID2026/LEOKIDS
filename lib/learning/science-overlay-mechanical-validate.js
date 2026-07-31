/**
 * Mechanical validation of science EN overlay vs source bank.
 * Not pedagogical review — structural/localization contract only.
 */

import { SCIENCE_QUESTIONS } from "../../data/science-questions.js";
import { SCIENCE_EN_OVERLAY } from "../../data/science-questions-en-overlay.js";
import { containsHebrew } from "../../utils/learning-question-content-locale.js";

const REQUIRED_DISPLAY = ["stem", "options", "explanation"];

/**
 * @param {unknown} v
 */
function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

/**
 * @param {Record<string, unknown>|null|undefined} overlay
 * @param {string} field
 */
function fieldLooksLikeFallback(overlay, field) {
  if (!overlay || typeof overlay !== "object") return true;
  const meta = overlay._meta || overlay.meta;
  if (meta && typeof meta === "object") {
    if (meta.fallback === true || meta[field + "Fallback"] === true) return true;
  }
  if (overlay.fallback === true) return true;
  const v = overlay[field];
  if (typeof v === "string" && /^\[?(TODO|FALLBACK|MISSING|TBD)\]?/i.test(v.trim())) return true;
  return false;
}

/**
 * @param {{ rows?: unknown[], overlay?: Record<string, unknown> }} [opts]
 */
export function validateScienceEnOverlayMechanical(opts = {}) {
  const rows = Array.isArray(opts.rows) ? opts.rows : SCIENCE_QUESTIONS;
  const overlayMap =
    opts.overlay && typeof opts.overlay === "object" ? opts.overlay : SCIENCE_EN_OVERLAY;

  /** @type {string[]} */
  const issues = [];
  const seenIds = new Set();
  let checked = 0;
  let hebrewInDisplay = 0;
  let emptyRequired = 0;
  let optionMismatch = 0;
  let correctIndexMismatch = 0;
  let duplicateIds = 0;
  let missingIds = 0;
  let typeErrors = 0;
  let fallbackHidingRequired = 0;

  for (const row of rows) {
    const id = String(row?.id || "").trim();
    if (!id) {
      missingIds += 1;
      issues.push("missing_id");
      continue;
    }
    if (seenIds.has(id)) {
      duplicateIds += 1;
      issues.push(`duplicate_id:${id}`);
    }
    seenIds.add(id);

    const ov = overlayMap[id];
    if (!ov || typeof ov !== "object") {
      emptyRequired += 1;
      issues.push(`missing_overlay:${id}`);
      continue;
    }
    checked += 1;

    for (const field of REQUIRED_DISPLAY) {
      if (field === "options") {
        if (!Array.isArray(ov.options) || ov.options.length === 0) {
          emptyRequired += 1;
          issues.push(`empty_options:${id}`);
        } else if (ov.options.some((x) => !isNonEmptyString(x))) {
          emptyRequired += 1;
          issues.push(`blank_option:${id}`);
        } else if (ov.options.some((x) => containsHebrew(String(x)))) {
          hebrewInDisplay += 1;
          issues.push(`hebrew_options:${id}`);
        }
      } else if (!isNonEmptyString(ov[field])) {
        emptyRequired += 1;
        issues.push(`empty_${field}:${id}`);
      } else if (containsHebrew(String(ov[field]))) {
        hebrewInDisplay += 1;
        issues.push(`hebrew_${field}:${id}`);
      } else if (typeof ov[field] !== "string") {
        typeErrors += 1;
        issues.push(`type_${field}:${id}`);
      }

      if (fieldLooksLikeFallback(ov, field) && !isNonEmptyString(ov[field])) {
        fallbackHidingRequired += 1;
        issues.push(`fallback_hides_${field}:${id}`);
      }
    }

    // theoryLines: if present must be string[] without Hebrew
    if (ov.theoryLines != null) {
      if (!Array.isArray(ov.theoryLines)) {
        typeErrors += 1;
        issues.push(`type_theoryLines:${id}`);
      } else if (ov.theoryLines.some((x) => containsHebrew(String(x || "")))) {
        hebrewInDisplay += 1;
        issues.push(`hebrew_theoryLines:${id}`);
      }
    }

    // hint/feedback optional
    for (const opt of ["hint", "feedback"]) {
      if (ov[opt] != null && ov[opt] !== "") {
        if (typeof ov[opt] !== "string") {
          typeErrors += 1;
          issues.push(`type_${opt}:${id}`);
        } else if (containsHebrew(ov[opt])) {
          hebrewInDisplay += 1;
          issues.push(`hebrew_${opt}:${id}`);
        }
      }
    }

    const srcOpts = Array.isArray(row.options) ? row.options : [];
    if (Array.isArray(ov.options) && srcOpts.length > 0 && ov.options.length !== srcOpts.length) {
      optionMismatch += 1;
      issues.push(`option_count:${id}:${srcOpts.length}->${ov.options.length}`);
    }

    const srcCorrect =
      typeof row.correctIndex === "number"
        ? row.correctIndex
        : typeof row.correct === "number"
          ? row.correct
          : null;
    const ovCorrect =
      typeof ov.correctIndex === "number"
        ? ov.correctIndex
        : typeof row.correctIndex === "number"
          ? row.correctIndex
          : null;
    // Overlay may omit correctIndex — then source index must remain valid against overlay options
    if (Array.isArray(ov.options) && ov.options.length > 0) {
      const idx = ovCorrect != null ? ovCorrect : srcCorrect;
      if (idx == null || idx < 0 || idx >= ov.options.length) {
        correctIndexMismatch += 1;
        issues.push(`correct_index:${id}`);
      } else if (srcCorrect != null && ovCorrect != null && srcCorrect !== ovCorrect) {
        correctIndexMismatch += 1;
        issues.push(`correct_index_changed:${id}`);
      }
    }
  }

  const ok =
    missingIds === 0 &&
    duplicateIds === 0 &&
    hebrewInDisplay === 0 &&
    emptyRequired === 0 &&
    optionMismatch === 0 &&
    correctIndexMismatch === 0 &&
    typeErrors === 0 &&
    fallbackHidingRequired === 0 &&
    checked === rows.length;

  return {
    totalQuestions: rows.length,
    checked,
    uniqueIds: seenIds.size,
    missingIds,
    duplicateIds,
    hebrewInDisplay,
    emptyRequired,
    optionMismatch,
    correctIndexMismatch,
    typeErrors,
    fallbackHidingRequired,
    ok,
    issueSample: issues.slice(0, 40),
    issueCount: issues.length,
  };
}
