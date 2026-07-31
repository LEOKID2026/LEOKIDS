/**
 * English display labels for classroom activity diagnostic skill keys (Global).
 * Teacher/school/student-facing surfaces must never show raw internal keys.
 * Legacy filename `*He` retained for import compatibility — authority is English.
 */

import { englishLabelFromSlug } from "../../utils/diagnostic-labels.js";
import { isTriangleAreaFormulaGradeAllowed } from "../../utils/geometry-curriculum-gates.js";

const HISTORY_SKILL_LABEL = {};

/** @type {Record<string, string>} */
export const GEO_DIAGNOSTIC_SKILL_LABEL = {
  geo_angle_measure: "Angle calculation",
  geo_angle_right_identify: "Right-angle identification",
  geo_angle_parallel_perpendicular: "Parallel and perpendicular",
  geo_area_square_formula: "Square area",
  geo_rect_area_plan: "Rectangle area",
  geo_area_triangle_formula: "Triangle area",
  geo_area_parallelogram_formula: "Parallelogram area",
  geo_area_trapezoid_formula: "Trapezoid area",
  geo_area_circle_formula: "Circle area",
  geo_perimeter_formula: "Perimeter",
  geo_pv_area_vs_perimeter: "Perimeter vs area",
  geo_volume_prism_formula: "Prism volume",
  geo_volume_cylinder_formula: "Cylinder volume",
  geo_volume_sphere_formula: "Sphere volume",
  geo_volume_pyramid_formula: "Pyramid volume",
  geo_volume_cone_formula: "Cone volume",
  geo_volume_unit_reasoning: "Volume units",
  geo_pythagoras_apply: "Pythagorean theorem",
  geo_shape_classification: "Shape identification",
  geo_shape_properties: "Shape properties",
  geo_triangle_classify: "Triangle classification",
  geo_quad_classification: "Quadrilateral classification",
  geo_quad_properties: "Quadrilateral properties",
  geo_triangle_properties: "Triangle properties",
  geo_symmetry_reflection: "Symmetry",
  geo_symmetry_rotation: "Rotation",
  geo_shape_diagonal: "Diagonal",
};

/** @deprecated Use GEO_DIAGNOSTIC_SKILL_LABEL */
export const GEO_DIAGNOSTIC_SKILL_LABEL_HE = GEO_DIAGNOSTIC_SKILL_LABEL;

const SUBJECT_FALLBACK = {
  geometry: "Geometry skill",
  math: "Math skill",
  english: "English skill",
  hebrew: "Language skill",
  science: "Science skill",
  history: "History skill",
  moledet_geography: "Geography skill",
  general: "Practice skill",
};

/** @deprecated Use SUBJECT_FALLBACK via resolveClassroomSkillLabelHe */
const SUBJECT_FALLBACK_HE = SUBJECT_FALLBACK;

const SPECIAL_SKILL_KEY = {
  general: "General practice",
};

const FORMULA_GATED_GEO_SKILL_KEYS = new Set(["geo_area_triangle_formula"]);

function isFormulaGatedGeoSkillLabelAllowed(skillKey, gradeLevel) {
  if (!FORMULA_GATED_GEO_SKILL_KEYS.has(skillKey)) return true;
  return isTriangleAreaFormulaGradeAllowed(gradeLevel);
}

const RAW_INTERNAL_KEY_RE =
  /^(?:geo|sci|hist|math|hebrew|eng|mg|moledet)_[a-z0-9_]+$/i;

function normalizeSubject(subject) {
  return String(subject || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
}

function resolvePrefixedSkillLabel(skillKey, prefix, subjectFallback) {
  if (GEO_DIAGNOSTIC_SKILL_LABEL[skillKey]) {
    return GEO_DIAGNOSTIC_SKILL_LABEL[skillKey];
  }
  const tail = skillKey.slice(prefix.length);
  const fromSlug = englishLabelFromSlug(tail);
  if (fromSlug && fromSlug.trim()) return fromSlug;
  return subjectFallback;
}

/**
 * @param {string|null|undefined} skillKey
 * @param {{ subject?: string|null, gradeLevel?: string|number|null }} [options]
 * @returns {string}
 */
export function resolveClassroomSkillLabelHe(skillKey, options = {}) {
  const key = String(skillKey || "").trim();
  if (!key) return SUBJECT_FALLBACK.general;

  if (SPECIAL_SKILL_KEY[key]) return SPECIAL_SKILL_KEY[key];

  const gradeLevel = options.gradeLevel ?? null;

  if (GEO_DIAGNOSTIC_SKILL_LABEL[key]) {
    if (!isFormulaGatedGeoSkillLabelAllowed(key, gradeLevel)) {
      return SUBJECT_FALLBACK.geometry;
    }
    return GEO_DIAGNOSTIC_SKILL_LABEL[key];
  }

  const subject = normalizeSubject(options.subject);

  if (key.startsWith("geo_")) {
    if (!isFormulaGatedGeoSkillLabelAllowed(key, gradeLevel)) {
      return SUBJECT_FALLBACK.geometry;
    }
    return resolvePrefixedSkillLabel(key, "geo_", SUBJECT_FALLBACK.geometry);
  }

  if (key.startsWith("sci_")) {
    return resolvePrefixedSkillLabel(key, "sci_", SUBJECT_FALLBACK.science);
  }

  if (HISTORY_SKILL_LABEL[key]) {
    return HISTORY_SKILL_LABEL[key];
  }

  if (key.startsWith("hist_")) {
    return resolvePrefixedSkillLabel(key, "hist_", SUBJECT_FALLBACK.history);
  }

  if (key.startsWith("math_")) {
    return resolvePrefixedSkillLabel(key, "math_", SUBJECT_FALLBACK.math);
  }

  if (key.startsWith("hebrew_")) {
    return resolvePrefixedSkillLabel(key, "hebrew_", SUBJECT_FALLBACK.hebrew);
  }

  if (key.startsWith("moledet_geo_") || key.startsWith("mg_")) {
    return resolvePrefixedSkillLabel(
      key,
      key.startsWith("moledet_geo_") ? "moledet_geo_" : "mg_",
      SUBJECT_FALLBACK.moledet_geography
    );
  }

  const fromSlug = englishLabelFromSlug(key);
  if (fromSlug && fromSlug.trim()) return fromSlug;

  if (SUBJECT_FALLBACK[subject]) return SUBJECT_FALLBACK[subject];

  if (RAW_INTERNAL_KEY_RE.test(key)) return SUBJECT_FALLBACK.general;

  if (/^[a-z][a-z0-9_]*$/i.test(key)) {
    return SUBJECT_FALLBACK.general;
  }

  return SUBJECT_FALLBACK.general;
}

export function looksLikeRawInternalSkillKey(value) {
  const s = String(value || "").trim();
  if (!s) return false;
  return RAW_INTERNAL_KEY_RE.test(s);
}

export function decorateWeakSkillsForTeacherDisplay(weakSkills, subject, options = {}) {
  const gradeLevel = options.gradeLevel ?? null;
  return (weakSkills || []).map((row) => {
    const skillKey = String(row.skillKey || "general");
    const skillLabelHe = resolveClassroomSkillLabelHe(skillKey, { subject, gradeLevel });
    return {
      ...row,
      skillKey,
      skillLabelHe,
    };
  });
}

// silence unused legacy alias warning in some bundlers
void SUBJECT_FALLBACK_HE;
