import { globalBurnDownCopy } from "../../lib/i18n/global-burn-down-copy.js";
/** @typedef {{ title: string, body: string, primary: { href: string, label: string }, secondary?: { href: string, label: string } }} PublicSeoFooterCta */

/** @type {PublicSeoFooterCta} */
export const DEFAULT_PUBLIC_SEO_FOOTER_CTA = {
  title: globalBurnDownCopy("components__seo__public-seo-wide-defaults", "ready_to_start"),
  body: globalBurnDownCopy("components__seo__public-seo-wide-defaults", "open_a_parent_account_add_your_child_and_let_them_practice_at_a_pace_tha"),
  primary: { href: "/parent/login", label: "Parent login / sign up" },
  secondary: { href: "/parents", label: "Explore the parent portal" },
};

/** @type {PublicSeoFooterCta} */
export const WORKSHEETS_PUBLIC_SEO_FOOTER_CTA = {
  title: globalBurnDownCopy("components__seo__public-seo-wide-defaults", "want_to_create_more_sheets_and_unlock_every_topic"),
  body: globalBurnDownCopy("components__seo__public-seo-wide-defaults", "in_the_full_parent_portal_you_can_create_unlimited_worksheets_choose_add"),
  primary: { href: "/parents", label: "Full parent portal" },
  secondary: { href: "/practice", label: "All practice areas" },
};
