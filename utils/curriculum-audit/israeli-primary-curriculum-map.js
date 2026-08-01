/**
 * Israeli elementary curriculum map — stubbed for Global product.
 * Official Israeli curriculum text must not ship in Global product sources.
 * APIs preserved for import compatibility; all topic maps are empty.
 */

/** @typedef {'high' || 'medium' || 'low'} MapConfidence */

/**
 * @typedef {Object} CurriculumTopicDef
 * @property {string} key
 * @property {string} [labelHe]
 * @property {'core' || 'allowed' || 'enrichment' || 'not_yet'} expectedLevel
 * @property {MapConfidence} confidence
 * @property {string} notes
 */

/**
 * @typedef {Object} GradeCurriculumEntry
 * @property {CurriculumTopicDef[]} coreTopics
 * @property {CurriculumTopicDef[]} allowedTopics
 * @property {CurriculumTopicDef[]} enrichmentTopics
 * @property {CurriculumTopicDef[]} notExpectedYet
 * @property {string} sourceNotes
 * @property {MapConfidence} confidence
 */

/** @type {Record<string, Array<{ sourceType: string, title: string, url: string, checkedAt: string, note: string }>>} */
export const CURRICULUM_SOURCE_REF_PRESETS = {
  internal_conservative: [],
  rama_general: [],
  moe_portal: [],
  english_exposure_framework: [],
  geometry_shapes_intro: [],
};

/** Prefix match: exact key or child path (e.g. english.grammar.*) */
export function matchTopicDef(defs, normalizedKey) {
  if (!normalizedKey || !Array.isArray(defs)) return null;
  for (const def of defs) {
    if (!def?.key) continue;
    if (normalizedKey === def.key) return def;
    if (normalizedKey.startsWith(`${def.key}.`)) return def;
  }
  return null;
}

/**
 * @param {string} subjectKey
 * @param {number} gradeNum
 * @param {string} normalizedKey
 * @returns {{ bucket: string, def: CurriculumTopicDef } || null}
 */
export function findTopicPlacement(subjectKey, gradeNum, normalizedKey) {
  const entry = getGradeEntry(subjectKey, gradeNum);
  if (!entry) return null;
  const order = ["notExpectedYet", "enrichmentTopics", "allowedTopics", "coreTopics"];
  for (const bucket of order) {
    const arr = entry[bucket];
    const hit = matchTopicDef(arr, normalizedKey);
    if (hit) return { bucket, def: hit };
  }
  return null;
}

/** Empty subject map — Global does not ship Israeli curriculum strands. */
export const ISRAELI_PRIMARY_CURRICULUM_MAP = {};

export const CURRICULUM_MAP_META = {
  version: 3,
  phase: 3,
  scope: "stubbed — Israeli curriculum text removed from Global product",
  defaultConfidence: "low",
  disclaimer:
    "This map is intentionally empty in Global. Curriculum placement returns null.",
};

const GRADE_KEYS = ["grade_1", "grade_2", "grade_3", "grade_4", "grade_5", "grade_6"];

export function gradeNumToKey(gradeNum) {
  if (gradeNum < 1 || gradeNum > 6) return null;
  return GRADE_KEYS[gradeNum - 1];
}

export function getGradeEntry(subjectKey, gradeNum) {
  const sub = ISRAELI_PRIMARY_CURRICULUM_MAP[subjectKey];
  if (!sub) return null;
  const gk = gradeNumToKey(gradeNum);
  if (!gk) return null;
  const entry = sub[gk];
  return entry && typeof entry === "object" && Array.isArray(entry.coreTopics) ? entry : null;
}

/** Collect every topic key declared anywhere in a subject map (all grades). */
export function collectCatalogKeysForSubject(subjectKey) {
  const sub = ISRAELI_PRIMARY_CURRICULUM_MAP[subjectKey];
  if (!sub) return new Set();
  const keys = new Set();
  for (const gk of GRADE_KEYS) {
    const slot = sub[gk];
    if (!slot || !Array.isArray(slot.coreTopics)) continue;
    for (const bucket of ["coreTopics", "allowedTopics", "enrichmentTopics", "notExpectedYet"]) {
      for (const def of slot[bucket] || []) {
        if (def?.key) keys.add(def.key);
      }
    }
  }
  return keys;
}
