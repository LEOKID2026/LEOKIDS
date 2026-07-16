import { individualActivityBadgeHe } from "../teacher-portal/teacher-ui.js";

/**
 * Badge label for a student-facing activity card by assignment scope.
 * UI-only — does not affect backend routing or semantics.
 *
 * @param {string|null|undefined} scope
 * @returns {string|null}
 */
export function studentActivityScopeBadgeHe(scope) {
  const normalized = String(scope || "class").trim();
  if (normalized === "parent") return "Personal activity";
  if (normalized === "student") return individualActivityBadgeHe();
  return null;
}

/**
 * @param {string|null|undefined} scope
 * @returns {"class"|"student"|"parent"}
 */
export function normalizeStudentActivityScope(scope) {
  const normalized = String(scope || "class").trim();
  if (normalized === "student") return "student";
  if (normalized === "parent") return "parent";
  return "class";
}
