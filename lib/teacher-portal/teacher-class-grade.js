import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
import { normalizeSubject } from "../learning-supabase/learning-activity.js";
import {
  formatGradeLevelHe as formatGradeLevelHeLegacy,
  normalizeGradeLevelToKey,
} from "../learning-student-defaults.js";

export { normalizeGradeLevelToKey };

/** Canonical g1–g6 → burn-down copy key (resolved at call time, not module import). */
const GRADE_KEY_TO_COPY_KEY = Object.freeze({
  g1: "grade_1",
  g2: "grade_2",
  g3: "grade_3",
  g4: "grade_4",
  g5: "grade_5",
  g6: "grade_6",
});

const TEACHER_CLASS_GRADE_SLUG = "lib__teacher-portal__teacher-class-grade";

/**
 * Locale-aware grade label for teacher portal UI.
 * Resolves via active burn-down locale at call time (bindGlobalBurnDownLocale).
 * @param {string || null || undefined} gradeLevel
 */
export function formatGradeLevelHe(gradeLevel) {
  const raw = String(gradeLevel ?? "").trim();
  if (!raw) return "";
  const canonical = normalizeGradeLevelToKey(raw);
  const copyKey = canonical ? GRADE_KEY_TO_COPY_KEY[canonical] : null;
  if (copyKey) {
    const label = globalBurnDownCopy(TEACHER_CLASS_GRADE_SLUG, copyKey);
    if (typeof label === "string" && label && label !== copyKey) return label;
  }
  const legacy = formatGradeLevelHeLegacy(gradeLevel);
  // Do not surface Hebrew labels from the shared legacy helper on the EN portal.
  if (/(?!)/.test(String(legacy || ""))) return "";
  return legacy || raw;
}

/**
 * Canonical g1–g6 key for activity/discussion flows, or "" when unknown.
 * @param {unknown} raw
 */
export function resolveCanonicalGradeKey(raw) {
  return normalizeGradeLevelToKey(raw);
}

/**
 * School class create authorization: compare normalized grade keys only.
 * @param {unknown} bodyGrade
 * @param {unknown} classGrade
 */
export function classGradeKeysMatch(bodyGrade, classGrade) {
  const bodyKey = normalizeGradeLevelToKey(bodyGrade);
  const classKey = normalizeGradeLevelToKey(classGrade);
  return Boolean(bodyKey && classKey && bodyKey === classKey);
}

/**
 * Normalize class subject_focus to canonical allowlist key when possible.
 * @param {unknown} raw
 */
export function resolveClassSubjectFocus(raw) {
  if (raw == null || String(raw).trim() === "") return null;
  return normalizeSubject(raw) || String(raw).trim().toLowerCase();
}

/**
 * Grade keys match when either side is unrestricted (null/empty), or normalized keys equal.
 * Used for school_teacher_subjects permission rows.
 * @param {unknown} permittedGrade
 * @param {unknown} requestGrade
 */
export function schoolSubjectGradeKeysMatch(permittedGrade, requestGrade) {
  if (permittedGrade == null || String(permittedGrade).trim() === "") return true;
  const requestKey = normalizeGradeLevelToKey(requestGrade);
  if (!requestKey) return true;
  const permittedKey = normalizeGradeLevelToKey(permittedGrade);
  if (!permittedKey) return true;
  return permittedKey === requestKey;
}

/**
 * @param {{ gradeLevel?: string|null, subjectFocus?: string|null, name?: string|null }|null|undefined} cls
 */
export function loadClassActivityContextFromApiClass(cls) {
  const gradeKey = resolveCanonicalGradeKey(cls?.gradeLevel);
  const subjectFocus = cls?.subjectFocus ? resolveClassSubjectFocus(cls.subjectFocus) : null;
  return {
    gradeKey,
    subjectFocus,
    gradeLocked: Boolean(cls?.gradeLevel),
    subjectLocked: Boolean(cls?.subjectFocus),
    className: cls?.name || "",
    loaded: Boolean(cls),
  };
}
