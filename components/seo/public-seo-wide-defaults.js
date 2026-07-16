/** @typedef {{ title: string, body: string, primary: { href: string, label: string }, secondary?: { href: string, label: string } }} PublicSeoFooterCta */

/** @type {PublicSeoFooterCta} */
export const DEFAULT_PUBLIC_SEO_FOOTER_CTA = {
  title: "Ready to start?",
  body: "Open a parent account, add your child, and let them practice at a pace that works for you.",
  primary: { href: "/parent/login", label: "Parent login / sign up" },
  secondary: { href: "/parents", label: "Explore the parent portal" },
};

/** @type {PublicSeoFooterCta} */
export const WORKSHEETS_PUBLIC_SEO_FOOTER_CTA = {
  title: "Want to create more sheets and unlock every topic?",
  body: "In the full parent portal you can create unlimited worksheets, choose additional topics, and combine sheets with digital practice and progress tracking.",
  primary: { href: "/parents", label: "Full parent portal" },
  secondary: { href: "/practice", label: "All practice areas" },
};
