import { LEGAL_CONTACT_PAGE_LINKS } from "../../data/legal/sitePolicies.js";

/** Contact-page legal nav: href → locales/{locale}/legal.json key */
export const CONTACT_LEGAL_LINK_I18N_KEYS = Object.freeze({
  "/legal": "legal.contactLegalHubLink",
  "/privacy": "legal.privacyLink",
  "/terms": "legal.termsTitle",
  "/accessibility": "legal.accessibilityLink",
  "/ai-disclosure": "legal.aiDisclosureLink",
  "/data-deletion": "legal.dataDeletionLink",
  "/security": "legal.securityTitle",
});

/**
 * @param {string} href
 * @param {(key: string) => string} t
 * @param {string} [fallbackLabel]
 */
export function resolveContactLegalLinkLabel(href, t, fallbackLabel = "") {
  const key = CONTACT_LEGAL_LINK_I18N_KEYS[href];
  if (!key) return fallbackLabel;
  const translated = t(key);
  if (!translated || translated === key) return fallbackLabel;
  return translated;
}

/** @returns {{ href: string, labelKey: string }[]} */
export function getContactLegalPageLinks() {
  return LEGAL_CONTACT_PAGE_LINKS.map((link) => ({
    href: link.href,
    labelKey: CONTACT_LEGAL_LINK_I18N_KEYS[link.href] || null,
    fallbackLabel: link.label,
  }));
}
