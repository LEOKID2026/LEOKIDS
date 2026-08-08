import { deepMergeJson } from "../i18n/deep-merge.js";
import { getClientPublicSeoOverlay } from "../seo/client-public-seo-overlay.js";
import {
  CONTACT_EMAIL,
  LEGACY_POLICY_PAGES,
  LEGAL_CROSS_LINKS,
  LEGAL_CONTACT_PAGE_LINKS,
  LEGAL_FOOTER_LINKS,
  POLICY_LAST_UPDATED_DISPLAY,
  UNIFIED_LEGAL_SECTIONS,
  PARENT_REPORT_DISCLAIMER_TITLE,
  PARENT_REPORT_DISCLAIMER_PARAGRAPHS,
} from "../../data/legal/sitePolicies.js";

/**
 * @param {string|null|undefined} locale
 */
function loadLegalOverlay(locale) {
  return getClientPublicSeoOverlay(locale, "legal", "unified.json");
}

/**
 * @param {string|null|undefined} locale
 */
export function getLegalPolicyBundleForLocale(locale) {
  const overlay = loadLegalOverlay(locale);
  if (!overlay || typeof overlay !== "object") {
    return {
      policyLastUpdatedDisplay: POLICY_LAST_UPDATED_DISPLAY,
      legacyPolicyPages: LEGACY_POLICY_PAGES,
      unifiedLegalSections: UNIFIED_LEGAL_SECTIONS,
      legalCrossLinks: LEGAL_CROSS_LINKS,
      legalContactPageLinks: LEGAL_CONTACT_PAGE_LINKS,
      legalFooterLinks: LEGAL_FOOTER_LINKS,
      parentReportDisclaimerTitle: PARENT_REPORT_DISCLAIMER_TITLE,
      parentReportDisclaimerParagraphs: PARENT_REPORT_DISCLAIMER_PARAGRAPHS,
      contactEmail: CONTACT_EMAIL,
    };
  }
  return {
    policyLastUpdatedDisplay: overlay.policyLastUpdatedDisplay ?? POLICY_LAST_UPDATED_DISPLAY,
    legacyPolicyPages: deepMergeJson(LEGACY_POLICY_PAGES, overlay.legacyPolicyPages ?? {}),
    unifiedLegalSections: overlay.unifiedLegalSections ?? UNIFIED_LEGAL_SECTIONS,
    legalCrossLinks: overlay.legalCrossLinks ?? LEGAL_CROSS_LINKS,
    legalContactPageLinks: overlay.legalContactPageLinks ?? LEGAL_CONTACT_PAGE_LINKS,
    legalFooterLinks: overlay.legalFooterLinks ?? LEGAL_FOOTER_LINKS,
    parentReportDisclaimerTitle: overlay.parentReportDisclaimerTitle ?? PARENT_REPORT_DISCLAIMER_TITLE,
    parentReportDisclaimerParagraphs:
      overlay.parentReportDisclaimerParagraphs ?? PARENT_REPORT_DISCLAIMER_PARAGRAPHS,
    contactEmail: CONTACT_EMAIL,
  };
}
