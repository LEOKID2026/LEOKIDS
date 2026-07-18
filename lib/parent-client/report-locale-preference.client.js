/** Client flag: parent chose report language explicitly (separate from interface). */
export const PARENT_REPORT_LOCALE_EXPLICIT_KEY = "lk_parent_report_locale_explicit";

/**
 * @returns {boolean}
 */
export function isParentReportLocaleExplicit() {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(PARENT_REPORT_LOCALE_EXPLICIT_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * @param {boolean} explicit
 */
export function setParentReportLocaleExplicit(explicit) {
  if (typeof window === "undefined") return;
  try {
    if (explicit) {
      window.localStorage.setItem(PARENT_REPORT_LOCALE_EXPLICIT_KEY, "1");
    } else {
      window.localStorage.removeItem(PARENT_REPORT_LOCALE_EXPLICIT_KEY);
    }
  } catch {
    /* ignore */
  }
}
