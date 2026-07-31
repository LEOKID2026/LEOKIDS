/**
 * Science question localization contract + coverage metrics.
 * Does not translate — measures overlay/field readiness for future locales.
 */

import { SCIENCE_QUESTIONS } from "../../data/science-questions.js";
import { SCIENCE_EN_OVERLAY } from "../../data/science-questions-en-overlay.js";
import { containsHebrew } from "../../utils/learning-question-content-locale.js";

/** Text fields that must be localizable for a science question. */
export const SCIENCE_LOCALIZABLE_FIELDS = Object.freeze([
  "stem",
  "options",
  "explanation",
  "theoryLines",
  "hint",
  "feedback",
]);

/** Fields required in the EN overlay for every question that has source text. */
export const SCIENCE_OVERLAY_REQUIRED_WHEN_PRESENT = Object.freeze([
  "stem",
  "options",
  "explanation",
]);

/**
 * @param {Record<string, unknown>} row
 * @param {string} field
 */
function fieldHasSourceText(row, field) {
  if (field === "options" || field === "theoryLines") {
    return Array.isArray(row[field]) && row[field].some((x) => String(x || "").trim());
  }
  return typeof row[field] === "string" && String(row[field]).trim().length > 0;
}

/**
 * @param {Record<string, unknown>|null|undefined} overlay
 * @param {string} field
 */
function overlayCoversField(overlay, field) {
  if (!overlay) return false;
  if (field === "options" || field === "theoryLines") {
    return Array.isArray(overlay[field]) && overlay[field].length > 0;
  }
  if (field === "hint" || field === "feedback") {
    // Optional until authored — covered if present in overlay OR absent in source
    return true;
  }
  return typeof overlay[field] === "string" && String(overlay[field]).trim().length > 0;
}

/**
 * Exact coverage report for the science bank localization contract.
 */
export function computeScienceLocalizationCoverage(rows = SCIENCE_QUESTIONS, overlay = SCIENCE_EN_OVERLAY) {
  const list = Array.isArray(rows) ? rows : [];
  const total = list.length;

  let withStableId = 0;
  let missingId = 0;
  let overlayHit = 0;
  let overlayMiss = 0;

  /** @type {Record<string, { sourcePresent: number, overlayCovered: number, hebrewRemainingInOverlay: number }>} */
  const fields = {};
  for (const f of SCIENCE_LOCALIZABLE_FIELDS) {
    fields[f] = { sourcePresent: 0, overlayCovered: 0, hebrewRemainingInOverlay: 0 };
  }

  /** @type {string[]} */
  const missingOverlayIds = [];
  /** @type {string[]} */
  const incompleteOverlayIds = [];

  for (const row of list) {
    const id = String(row?.id || "").trim();
    if (id) withStableId += 1;
    else {
      missingId += 1;
      continue;
    }

    const ov = overlay?.[id] || null;
    if (ov) overlayHit += 1;
    else {
      overlayMiss += 1;
      missingOverlayIds.push(id);
    }

    let incomplete = false;
    for (const field of SCIENCE_LOCALIZABLE_FIELDS) {
      const present = fieldHasSourceText(row, field);
      if (present) fields[field].sourcePresent += 1;

      if (field === "hint" || field === "feedback") {
        // Optional fields: count overlay if authored there
        if (ov && fieldHasSourceText(ov, field)) {
          fields[field].overlayCovered += 1;
        } else if (!present) {
          // Vacuously covered when neither source nor need
          fields[field].overlayCovered += 1;
        }
        continue;
      }

      if (!present) {
        // No source text → no localization debt for this field
        fields[field].overlayCovered += 1;
        continue;
      }

      if (overlayCoversField(ov, field)) {
        fields[field].overlayCovered += 1;
        const raw =
          field === "options" || field === "theoryLines"
            ? (ov[field] || []).join(" ")
            : String(ov[field] || "");
        if (containsHebrew(raw)) {
          fields[field].hebrewRemainingInOverlay += 1;
          incomplete = true;
        }
      } else {
        incomplete = true;
      }
    }
    if (ov && incomplete) incompleteOverlayIds.push(id);
  }

  /** @type {Record<string, { sourcePresent: number, overlayCovered: number, coveragePct: number, hebrewRemainingInOverlay: number }>} */
  const fieldReport = {};
  for (const [k, v] of Object.entries(fields)) {
    const denom = total || 1;
    fieldReport[k] = {
      ...v,
      coveragePct: Math.round((v.overlayCovered / denom) * 10000) / 100,
    };
  }

  const requiredOk =
    withStableId === total &&
    overlayHit === total &&
    fieldReport.stem.overlayCovered === total &&
    fieldReport.options.overlayCovered === total &&
    fieldReport.explanation.overlayCovered === total &&
    fieldReport.stem.hebrewRemainingInOverlay === 0 &&
    fieldReport.options.hebrewRemainingInOverlay === 0 &&
    fieldReport.explanation.hebrewRemainingInOverlay === 0;

  return {
    totalQuestions: total,
    withStableId,
    missingId,
    overlayHit,
    overlayMiss,
    overlayCoveragePct: total ? Math.round((overlayHit / total) * 10000) / 100 : 0,
    fields: fieldReport,
    theoryLinesSourceCount: fieldReport.theoryLines.sourcePresent,
    hintSourceCount: fieldReport.hint.sourcePresent,
    feedbackSourceCount: fieldReport.feedback.sourcePresent,
    missingOverlayIdsSample: missingOverlayIds.slice(0, 20),
    incompleteOverlayIdsSample: incompleteOverlayIds.slice(0, 20),
    incompleteOverlayCount: incompleteOverlayIds.length,
    contractComplete: requiredOk,
  };
}
