import learningLocaleEn from "../locales/en/learning.json" with { type: "json" };

const HEBREW_GRADE_LETTER_TO_NUMBER = {
  "\u05d0": 1,
  "\u05d1": 2,
  "\u05d2": 3,
  "\u05d3": 4,
  "\u05d4": 5,
  "\u05d5": 6,
};
export function normalizeGradeLevelToKey(rawGradeLevel) {
  if (rawGradeLevel == null) return "";

  if (typeof rawGradeLevel === "number" && Number.isFinite(rawGradeLevel)) {
    const n = Math.floor(rawGradeLevel);
    if (n >= 1 && n <= 6) return `g${n}`;
    return "";
  }

  const value = String(rawGradeLevel).trim();
  if (!value) return "";

  const lower = value.toLowerCase();

  if (/^g[1-6]$/.test(lower)) {
    return lower;
  }

  if (/^[1-6]$/.test(lower)) {
    return `g${lower}`;
  }

  const gradeMatch = lower.match(/(?:grade|grade_|g|class)[\s_-]*([1-6])/);
  if (gradeMatch) {
    return `g${gradeMatch[1]}`;
  }

  const hebrewMatch = value.match(/\u05db\u05d9\u05ea\u05d4\s*([\u05d0\u05d1\u05d2\u05d3\u05d4\u05d5])/);
  if (hebrewMatch) {
    const gradeNumber = HEBREW_GRADE_LETTER_TO_NUMBER[hebrewMatch[1]];
    if (gradeNumber) {
      return `g${gradeNumber}`;
    }
  }

  const standaloneHebrew = value.match(/^([\u05d0\u05d1\u05d2\u05d3\u05d4\u05d5])['\u05f3"]?$/);
  if (standaloneHebrew) {
    const gradeNumber = HEBREW_GRADE_LETTER_TO_NUMBER[standaloneHebrew[1]];
    if (gradeNumber) {
      return `g${gradeNumber}`;
    }
  }

  return "";
}

/** Canonical g1–g6 → English class label for student-facing UI (display only). */
const GRADE_KEY_TO_HEBREW_LABEL = learningLocaleEn.master.grades;

/**
 * Formats stored grade codes (e.g. grade_3, g3) for English UI. Does not alter DB/API values.
 * @param {string | null | undefined} gradeLevel
 * @returns {string} English label, or trimmed original if unknown, or "" if empty.
 */
export function formatGradeLevelHe(gradeLevel) {
  const raw = String(gradeLevel ?? "").trim();
  if (!raw) return "";

  const canonical = normalizeGradeLevelToKey(raw);
  if (canonical && GRADE_KEY_TO_HEBREW_LABEL[canonical]) {
    return GRADE_KEY_TO_HEBREW_LABEL[canonical];
  }

  const key = raw.toLowerCase();
  if (/^grade_[1-6]$/.test(key) && GRADE_KEY_TO_HEBREW_LABEL[`g${key.slice(-1)}`]) {
    return GRADE_KEY_TO_HEBREW_LABEL[`g${key.slice(-1)}`];
  }
  if (/^g[1-6]$/.test(key) && GRADE_KEY_TO_HEBREW_LABEL[key]) {
    return GRADE_KEY_TO_HEBREW_LABEL[key];
  }

  if (/^[1-6]$/.test(key) && GRADE_KEY_TO_HEBREW_LABEL[`g${key}`]) {
    return GRADE_KEY_TO_HEBREW_LABEL[`g${key}`];
  }

  return raw;
}

export function gradeKeyToNumber(gradeKey) {
  const match = String(gradeKey || "").toLowerCase().match(/^g([1-6])$/);
  return match ? Number(match[1]) : null;
}

export async function fetchStudentDefaults() {
  const response = await fetch("/api/student/me", {
    credentials: "same-origin",
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok || !payload?.student?.id) {
    return null;
  }

  const student = payload.student;
  return {
    fullName: String(student.full_name || "").trim(),
    gradeKey: normalizeGradeLevelToKey(student.grade_level),
  };
}
