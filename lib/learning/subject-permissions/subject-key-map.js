/**
 * Maps learning engine subjects / routes to parent permission keys.
 * Global product: math, geometry, english, science only.
 */

/** @type {readonly string[]} */
export const SUBJECT_PERMISSION_KEYS = Object.freeze([
  "math",
  "geometry",
  "english",
  "science",
]);

const PERMISSION_KEY_SET = new Set(SUBJECT_PERMISSION_KEYS);

const DIRECT_MAP = Object.freeze({
  math: "math",
  geometry: "geometry",
  english: "english",
  science: "science",
});

/**
 * @param {string|null|undefined} permissionKey
 */
export function isSubjectPermissionKey(permissionKey) {
  return PERMISSION_KEY_SET.has(String(permissionKey || "").trim());
}

/**
 * Resolve parent permission key from activity/session subject and optional strand.
 * @param {{
 *   subject?: string|null,
 *   visualStrand?: string|null,
 *   permissionSubjectKey?: string|null,
 *   routeSubject?: string|null,
 * }} input
 * @returns {string|null}
 */
export function resolvePermissionSubjectKey(input = {}) {
  const explicit = String(input.permissionSubjectKey || "").trim();
  if (isSubjectPermissionKey(explicit)) return explicit;

  const routeSubject = String(input.routeSubject || "").trim().toLowerCase();
  if (isSubjectPermissionKey(routeSubject)) return routeSubject;

  const subject = String(input.subject || "").trim().toLowerCase();
  return DIRECT_MAP[subject] || null;
}

/**
 * Engine subject key for sessions/API from permission key (inverse for writes).
 * @param {string} permissionKey
 * @param {{ visualStrand?: string|null }} [options]
 */
export function permissionKeyToEngineSubject(permissionKey, options = {}) {
  const key = String(permissionKey || "").trim();
  return DIRECT_MAP[key] || key;
}
