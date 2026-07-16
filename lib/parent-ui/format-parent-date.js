/**
 * English date formatting for parent-facing report surfaces (Global/US style).
 */

/**
 * @param {string|number|Date|null|undefined} iso
 */
export function formatParentDate(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return "-";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(d);
  } catch {
    return "-";
  }
}

/**
 * @param {string|number|Date|null|undefined} iso
 */
export function formatParentDateTime(iso) {
  if (!iso) return "-";
  try {
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return "-";
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "-";
  }
}
