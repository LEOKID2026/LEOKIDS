import { globalBurnDownCopyForLocale } from "../../lib/i18n/global-burn-down-copy.js";

const DEFAULTS_SLUG = "components__seo__public-seo-wide-defaults";
const CTA_SLUG = "components__seo__PublicSeoParentCta";

/**
 * @param {string|null|undefined} locale
 * @returns {{ title: string, body: string, primary: { href: string, label: string }, secondary?: { href: string, label: string } }}
 */
export function getDefaultPublicSeoFooterCta(locale) {
  return {
    title: globalBurnDownCopyForLocale(locale, DEFAULTS_SLUG, "ready_to_start"),
    body: globalBurnDownCopyForLocale(
      locale,
      DEFAULTS_SLUG,
      "open_a_parent_account_add_your_child_and_let_them_practice_at_a_pace_tha"
    ),
    primary: {
      href: "/parent/login",
      label: globalBurnDownCopyForLocale(locale, CTA_SLUG, "parent_login_sign_up"),
    },
    secondary: {
      href: "/parents",
      label: globalBurnDownCopyForLocale(locale, CTA_SLUG, "explore_the_parent_portal"),
    },
  };
}

/**
 * @param {string|null|undefined} locale
 */
export function getWorksheetsPublicSeoFooterCta(locale) {
  return {
    title: globalBurnDownCopyForLocale(
      locale,
      DEFAULTS_SLUG,
      "want_to_create_more_sheets_and_unlock_every_topic"
    ),
    body: globalBurnDownCopyForLocale(
      locale,
      DEFAULTS_SLUG,
      "in_the_full_parent_portal_you_can_create_unlimited_worksheets_choose_add"
    ),
    primary: {
      href: "/parents",
      label: globalBurnDownCopyForLocale(locale, CTA_SLUG, "explore_the_parent_portal"),
    },
    secondary: {
      href: "/practice",
      label: globalBurnDownCopyForLocale(locale, "components__seo__PublicSeoWideCardGrid", "practice_areas"),
    },
  };
}

/** @deprecated Use getDefaultPublicSeoFooterCta("en") */
export const DEFAULT_PUBLIC_SEO_FOOTER_CTA = getDefaultPublicSeoFooterCta("en");

/** @deprecated Use getWorksheetsPublicSeoFooterCta("en") */
export const WORKSHEETS_PUBLIC_SEO_FOOTER_CTA = getWorksheetsPublicSeoFooterCta("en");
