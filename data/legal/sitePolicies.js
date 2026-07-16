/**
 * English legal / policy page content — owner-editable site copy only.
 * Unified `/legal` page + legacy route metadata (scroll targets).
 */

/** @typedef {{ href: string; label: string }} PolicyLink */
/** @typedef {{ id: string; title: string; paragraphs?: string[]; bullets?: string[]; links?: PolicyLink[] }} PolicySection */

export const CONTACT_EMAIL = "leokid2026@gmail.com";

/** ISO date — bump when content materially changes. */
export const POLICY_LAST_UPDATED = "2026-07-05";

/** Human-readable date on policy pages. */
export const POLICY_LAST_UPDATED_DISPLAY = "July 5, 2026";

export const TERMS_VERSION = "2026-07-05";
export const PRIVACY_VERSION = "2026-07-05";

export const DELETION_SLA_BUSINESS_DAYS = 7;
export const NORMAL_PARENT_CHILD_LIMIT = 3;

/** Authoritative in-product report disclaimer — keep synced with help center quote. */
export const PARENT_REPORT_DISCLAIMER_TITLE = "Important note";

export const PARENT_REPORT_DISCLAIMER_PARAGRAPHS = [
  "This report is based on the practice data collected on the Leo Kids site.",
  "It is meant to be a helpful learning tool for parents, to help you understand what your child practiced, where strengths showed up, and where continued practice may help.",
  "This report is not a medical diagnosis, a psychological diagnosis, or an educational diagnosis, and it does not replace a teacher, counselor, evaluator, or other professional. If you have concerns about an ongoing learning difficulty, a learning gap, or need further evaluation, please reach out to a teacher or an appropriate professional.",
];

/** @deprecated use PARENT_REPORT_DISCLAIMER_TITLE */
export const PARENT_REPORT_DISCLAIMER_TITLE_HE = PARENT_REPORT_DISCLAIMER_TITLE;
/** @deprecated use PARENT_REPORT_DISCLAIMER_PARAGRAPHS */
export const PARENT_REPORT_DISCLAIMER_PARAGRAPHS_HE = PARENT_REPORT_DISCLAIMER_PARAGRAPHS;

/** Compact site chrome footer — single legal hub link only. */
export const LEGAL_FOOTER_LINKS = [
  { href: "/legal", label: "Terms, privacy & accessibility" },
];

/** Policy hub links on /contact and cross-links at bottom of policy pages. */
export const LEGAL_CONTACT_PAGE_LINKS = [
  { href: "/legal", label: "Terms, privacy & accessibility" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms of use" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/ai-disclosure", label: "AI disclosure" },
  { href: "/data-deletion", label: "Data deletion" },
  { href: "/security", label: "Security" },
];

export const LEGAL_CROSS_LINKS = LEGAL_CONTACT_PAGE_LINKS;

/** @type {PolicySection[]} */
export const UNIFIED_LEGAL_SECTIONS = [
  {
    id: "intro",
    title: "1. Who we are and the purpose of the service",
    paragraphs: [
      "Leo Kids is a learning and games website for children, including a children's area, a parents' area, a private-tutor area, and internal management tools.",
      "The site lets children practice school subjects, answer questions, progress through topics, collect coins and cards, and enjoy a gamified learning experience.",
      "For parents, the site allows opening an account, adding a child, tracking learning activity, viewing reports, creating personal activities for a child, and getting a learning snapshot based on the child's practice on the site.",
      "For private tutors, the site may allow creating activities and tracking students, according to the permissions granted to them in the system.",
    ],
  },
  {
    id: "terms-general",
    title: "2. General terms of use",
    paragraphs: [
      "Use of the site is intended for learning, practice, play, reinforcement, and enrichment purposes.",
      "The site may not be used to harm other users, attempt to access accounts that are not yours, bypass permissions, harm the site's functioning, copy content, engage in unauthorized commercial use, or any use inconsistent with the service's purpose.",
      "Users are responsible for keeping their login details secure and not sharing them with others.",
      "The site may restrict, block, or remove access in the event of misuse, an attempt to harm the system, breach of these terms, suspected unauthorized access, or use inconsistent with the service's purpose.",
    ],
  },
  {
    id: "children",
    title: "3. Use by children",
    paragraphs: [
      "The children's area is intended for learning and play.",
      "A child can sign in to an account created for them by a parent, or use guest mode if that option is available.",
      "The site is not intended for children to publish public content, engage in open chat with other children, or share personal information with other users.",
      "The parent is responsible for managing the child's account, monitoring use of the site, and ensuring the use is appropriate for the child.",
    ],
  },
  {
    id: "parents",
    title: "4. Use by parents",
    paragraphs: [
      "A parent can create an account, add a child, view practice data, see reports, create personal activities, and manage some of the child's settings.",
      "Continuing to use the site, creating an account, or signing in constitutes acceptance of the terms and privacy policy on this page.",
      "There is no requirement to check a terms checkbox during sign-in or registration, so as not to burden the process. Instead, short text with links to the terms and privacy policy is shown.",
      "Parents are asked to read the terms and privacy policy before using the site, and especially before opening an account for a child.",
    ],
  },
  {
    id: "private-teachers",
    title: "5. Use by private tutors",
    paragraphs: [
      "A private tutor may use the site only in accordance with the permissions granted to them in the system.",
      "A tutor may view only the information, students, activities, or reports that the system allows them to see.",
      "A tutor may not attempt to access information about parents, children, or students who are not associated with them.",
      "Any use of the site by a tutor is for learning purposes only, and does not replace the tutor's professional responsibility toward the student and parent.",
    ],
  },
  {
    id: "accounts",
    title: "6. Accounts and registration",
    paragraphs: [
      "Opening an account on the site may be done using email and password, or by signing in with Google, depending on the options available on the site.",
      "When opening an account or signing in, the site may store details required to operate the account, such as email address, user ID, name as provided during sign-in, and technical sign-in data.",
      "The user is responsible for providing accurate and up-to-date information, keeping their login details confidential, and notifying us if they suspect unauthorized use.",
    ],
  },
  {
    id: "google-oauth",
    title: "7. Signing in with Google",
    paragraphs: [
      "The site allows parents to sign in using Google.",
      "When using Google sign-in, the site may receive basic details from Google required for sign-in and account identification, such as email address, account ID, and name as provided during sign-in.",
      "The site does not receive permission to read your Gmail inbox, Drive files, Calendar, or other Google services, unless explicitly stated otherwise on Google's permissions screen.",
      "Use of Google sign-in is also subject to Google's own policies and terms.",
    ],
  },
  {
    id: "guest-mode",
    title: "8. Guest mode for children",
    paragraphs: [
      "The site may allow a child to sign in using guest mode, without creating a full child account.",
      "In guest mode, the system creates an 8-digit Leo Number for the guest, to allow continued use on the same device and linking with a parent.",
      "Continued guest use on the same device may rely on cookies, localStorage, or another local storage mechanism.",
      "If local storage is cleared, the system may create a new guest and may not be able to restore the previous guest.",
      "If the option is available, a parent can link a guest to a registered child using the guest number.",
      "When linking a guest to a registered child, only coins and cards accumulated by the guest are transferred to the registered child, according to the system's rules.",
      "Learning data, answers, reports, learning progress, or practice history of a guest is not transferred to the registered child, unless explicitly stated otherwise in the system.",
      "After a guest is linked, the guest may be marked as used and the same guest number may not be usable again.",
    ],
  },
  {
    id: "learning-reports",
    title: "9. Practice, questions, activities, and reports",
    paragraphs: [
      "The site presents children with questions, practice, activities, and learning games by subject, grade, topic, and practice level.",
      "The site may store answers, response times, results, topics practiced, practice level, activities performed, and other information required to operate the learning engine and reports.",
      "Parents can receive reports based on the child's practice data on the site.",
      "The reports are meant to help parents understand what the child practiced, where strengths showed up, where continued practice may help, and what the next learning step might be.",
      "The reports are based solely on information collected on the site, and do not necessarily reflect all of the child's abilities, difficulties, or progress outside the site.",
    ],
  },
  {
    id: "disclaimer",
    title: "10. Important note about reports and recommendations",
    paragraphs: [
      "The reports, recommendations, insights, and summaries on the site are learning aids only.",
      "They are not a medical diagnosis, a psychological diagnosis, an educational diagnosis, a professional assessment, and do not replace a teacher, counselor, evaluator, or other professional.",
      "If you have concerns about an ongoing learning difficulty, a learning gap, or an emotional, behavioral, medical, or other condition, we recommend contacting a teacher, school counselor, evaluator, or appropriate professional.",
    ],
  },
  {
    id: "rewards",
    title: "11. Coins, cards, shop, and rewards",
    paragraphs: [
      "The site may include coins, cards, a surprise box, an internal shop, prizes, and gamified rewards.",
      "These features are intended to support play, encouragement, persistence, and enjoyment of learning.",
      "Coins, cards, and prizes on the site are not real money, have no monetary value outside the site, cannot be converted to cash, and cannot be redeemed for a cash payout.",
      "The site may change the rules for coins, cards, the shop, rewards, and prizes from time to time for operational reasons, game balance, misuse prevention, bug fixes, or to improve the experience.",
      "In the event of a malfunction, misuse, technical exploit, or unusual activity, the site may correct balances, remove prizes, restore a prior state, or restrict use, as needed.",
    ],
  },
  {
    id: "data-collected",
    title: "12. What information we store",
    paragraphs: ["The site may store information required to operate the service, including:"],
    bullets: [
      "Parent account details, such as email, user ID, and sign-in data.",
      "Details of a child added by the parent, such as display name, grade, internal ID, and usage data.",
      "Practice data, answers, results, activity timestamps, topics practiced, and progress.",
      "Personal activities created by a parent or tutor.",
      "Reports, summaries, and learning insights.",
      "Coins, cards, shop, and reward data.",
      "Guest mode data, to the extent guest mode is used.",
      "Technical data required for security, operations, sign-in, fault prevention, and service improvement.",
    ],
    paragraphsAfterBullets: [
      "The site does not ask children to provide personal information that is not required to operate the service.",
    ],
  },
  {
    id: "purposes",
    title: "13. How we use the information",
    paragraphs: ["The information is used to:"],
    bullets: [
      "Operate the parent's and child's account.",
      "Present practice and questions.",
      "Save progress and results.",
      "Generate reports for the parent.",
      "Create personal activities.",
      "Operate guest mode and link a guest to a registered child.",
      "Manage coins, cards, and rewards.",
      "Improve the service's stability and security.",
      "Detect faults, prevent misuse, and maintain system integrity.",
      "Power AI features, where available, for learning summaries and insights.",
    ],
  },
  {
    id: "children-data",
    title: "14. Information about children",
    paragraphs: [
      "Information about a child is shown to the parent associated with that child, and to other authorized parties only according to the system's permissions.",
      "The site is not intended for public disclosure of information about children.",
      "Children are not meant to see other children's information.",
      "Parents are not meant to see information about children who are not associated with them.",
      "Tutors are not meant to see information about students who are not associated with them or for whom they have not been granted permission.",
      "Information about children is not used to build a personal advertising profile.",
      "Practice data, achievements, mistakes, reports, subjects, grade, or in-game activity are not shared with advertising providers for the purpose of ad targeting to a child.",
      "Ads on children's pages are shown only in pre-approved, reserved placements, such as a bottom area of the page, and never within a question body, answer options, action buttons, or active gameplay.",
    ],
  },
  {
    id: "learning-analytics",
    title: "15. Use of information for learning and reports",
    paragraphs: [
      "Practice data is used to show the parent a learning snapshot.",
      "The system may analyze answers, response times, topics practiced, success and difficulty patterns, and progress over time.",
      "This analysis is meant to help choose appropriate follow-up practice, highlight strengths, identify areas that could use reinforcement, and give the parent a clear explanation.",
      "The system does not make professional diagnoses and does not replace human judgment.",
    ],
  },
  {
    id: "ai",
    title: "16. Use of artificial intelligence",
    paragraphs: [
      "The site may use artificial intelligence to help generate summaries, explanations, insights, or answers for parents based on report and practice data.",
      "The use of AI is intended to make learning information more accessible and clear.",
      "Content generated or phrased with the help of AI does not constitute a diagnosis, professional advice, medical advice, psychological advice, educational advice, or a professional decision.",
      "The system may run checks, filtering, or safety rules before presenting AI-generated content.",
      "Sensitive personal information that is not required for use of the site should not be entered into the system.",
    ],
  },
  {
    id: "limitations",
    title: "17. System limitations",
    paragraphs: [
      "The site is a learning and practice tool.",
      "The site is not a school, not a diagnostic body, not a medical service, not a psychological service, and not a substitute for professional advice.",
      "Results on the site may be affected by various factors, such as the child's concentration at that moment, understanding of instructions, available time, tiredness, inconsistent use, or a small amount of practice.",
      "Reports and recommendations should therefore be treated as an aid only, and not as a final conclusion about a child's abilities.",
    ],
  },
  {
    id: "cookies-storage",
    title: "18. Cookies, local storage, and PWA",
    paragraphs: [
      "The site may use cookies, localStorage, sessionStorage, cache, or other local storage mechanisms for sign-in, saving usage state, continuing activity, guest mode, PWA installation, site operation, and improving the user experience.",
      "In PWA apps or offline mode, some of the files required to run the site may be stored on the device.",
      "Information stored on a device may remain there until manually deleted, the browser is cleared, the app is removed, or device settings are changed.",
      "If the same device is used by several children or several accounts, we recommend signing out after use and making sure the correct account is signed in.",
      "Deleting cookies or localStorage may sign you out of the account, lose guest mode state, or create a new guest.",
      "When ads are shown on the site, ad providers may use cookies or similar means for ad display, measurement, security, and legal compliance.",
      "In regions where applicable law or ad providers require it, an option to manage advertising and cookie preferences will be shown.",
    ],
  },
  {
    id: "security",
    title: "19. Data security",
    paragraphs: [
      "The site implements measures intended to protect user information, restrict access according to permissions, and prevent unauthorized access.",
      "Access to personal information should be limited to authorized users, such as a parent for their own child, a tutor for a student associated with them, or an authorized system administrator.",
      "That said, no system is completely protected from every malfunction, intrusion attempt, or security incident.",
      "If you suspect unauthorized use, a malfunction, or a data exposure, you can contact:",
    ],
    links: [{ href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL }],
  },
  {
    id: "processors",
    title: "20. Sharing information with providers",
    paragraphs: [
      "The site may use infrastructure, hosting, sign-in, security, operations, or AI providers to operate the service.",
      "Information may be transferred to these providers only to the extent required to operate the site, store data, sign in, secure the service, operate it, provide support, analyze faults, or power service features.",
      "The site does not sell children's personal information to advertisers.",
      "The site is not intended for targeted advertising to children.",
      "The site uses external advertising services, including Google's advertising system, to display ads in predefined placements.",
      "Ads are not part of the learning content, are not a personal recommendation from Leo Kids, and are not a task the child is required to complete.",
      "On children's pages, the site does not use a child's personal information or learning data to target ads.",
      "On parent pages, ads or sponsorships are not tailored based on a child's personal report or learning data.",
    ],
  },
  {
    id: "retention-deletion",
    title: "21. Data retention and deletion",
    paragraphs: [
      "Information is retained as long as it is required to operate the service, manage the account, display reports, save progress, ensure security, keep records of actions, or comply with legal requirements.",
      "A parent can delete a child through the existing mechanism on the site, if that option is available in the dashboard.",
      "Deleting a child may delete the child's details, sign-in data, sessions, answers, reports, coins, cards, and related information, in accordance with the existing deletion mechanism.",
      "Requests to delete information, or privacy-related inquiries, can be sent to:",
    ],
    links: [{ href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL }],
    paragraphsAfterLinks: [
      `Deletion requests will be handled within ${DELETION_SLA_BUSINESS_DAYS} business days, to the extent feasible and in accordance with the technical and legal situation.`,
      "Certain information may be retained for an additional period in backups, logs, security records, action records, or where retention is legally required.",
    ],
  },
  {
    id: "your-rights",
    title: "22. User rights and privacy inquiries",
    paragraphs: [
      "You can contact us regarding privacy matters, correcting information, deleting information, information inquiries, or questions about the use of information.",
      "Inquiries can be sent to:",
    ],
    links: [{ href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL }],
    paragraphsAfterLinks: [
      "To protect user privacy, we may ask for details that let us verify that the requester is the account holder or an authorized parent before taking action on the information.",
    ],
  },
  {
    id: "accessibility",
    title: "23. Accessibility",
    paragraphs: [
      "Leo Kids strives to make the site convenient and clear to use for all users, including users with disabilities.",
      "The site works to improve accessibility in accordance with commonly accepted web accessibility principles.",
      "Some parts of the site, especially interactive areas, games, practice activities, or PWA components, may not yet be fully accessible.",
      "If you encounter an accessibility difficulty, an inaccessible page, unclear text, an inaccessible button, a problem using the keyboard, a screen reader, or a mobile device — we welcome you to contact us so we can look into it and fix it.",
      "Accessibility inquiries can be sent to:",
    ],
    links: [{ href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL }],
    paragraphsAfterLinks: ["When contacting us, it helps to mention:"],
    bullets: [
      "Which page you encountered the problem on.",
      "Which device and browser you used.",
      "What the problem was.",
      "How we can reach you back.",
    ],
  },
  {
    id: "ip",
    title: "24. Intellectual property",
    paragraphs: [
      "All rights in the site, including design, text, questions, games, code, structure, logo, images, reports, and content, belong to Leo Kids or to those who have granted permission to use them, unless stated otherwise.",
      "You may not copy, distribute, publish, sell, reproduce, publicly display, reverse engineer, or use the site's content for commercial purposes without prior written permission.",
      "Use of the site is granted to users for personal, learning, and family purposes only, in accordance with these terms.",
    ],
  },
  {
    id: "liability",
    title: "25. Limitation of liability",
    paragraphs: [
      "The service is provided as-is, and may change, be updated, temporarily stop working, or include faults.",
      "Leo Kids makes efforts to present accurate, clear, and useful information, but does not guarantee that the site will be free of errors, always available, suitable for every child, or will deliver a specific learning outcome.",
      "Use of the site and its reports is at the responsibility of the user and parent.",
      "The site should not be relied upon as a substitute for the judgment of a parent, teacher, or professional.",
    ],
  },
  {
    id: "institutional",
    title: "26. Institutional or school use",
    paragraphs: [
      "If, in the future, the site is used by schools, educational institutions, classes, or institutional settings, additional terms or a separate policy may apply.",
      "As long as such use has not been explicitly enabled, this page primarily addresses use by children, parents, and private tutors.",
    ],
  },
  {
    id: "contact",
    title: "27. Contact us",
    paragraphs: [
      "For questions, requests, reports, privacy matters, data deletion, accessibility, or data security, you can contact us:",
    ],
    links: [
      { href: `mailto:${CONTACT_EMAIL}`, label: CONTACT_EMAIL },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    id: "updates",
    title: "28. Updates to these terms",
    paragraphs: [
      "Leo Kids may update these terms, the privacy policy, the accessibility statement, the AI explanation, or other parts of this page from time to time.",
      "When a material update is made, the update date at the top of the page will change.",
      "Continued use of the site after the terms are updated constitutes acceptance of the updated version.",
    ],
  },
];

/**
 * @type {Record<string, { route: string; pageTitle: string; metaDescription: string; intro?: string; scrollToSectionId?: string }>}
 */
export const LEGACY_POLICY_PAGES = {
  legal: {
    route: "/legal",
    pageTitle: "Terms, privacy, accessibility & AI use",
    metaDescription:
      "Terms of use, privacy policy, accessibility statement, AI use, security, and data deletion - Leo Kids.",
    intro:
      "This page brings together, in one place, the terms of use, privacy policy, accessibility statement, explanation of AI use, data security, and data deletion for the Leo Kids site.",
  },
  privacy: {
    route: "/privacy",
    pageTitle: "Privacy policy",
    metaDescription: "Leo Kids privacy policy - personal information, children, cookies, and rights.",
    scrollToSectionId: "data-collected",
  },
  terms: {
    route: "/terms",
    pageTitle: "Terms of use",
    metaDescription: "Leo Kids terms of use - accounts, practice, reports, and permitted use.",
    scrollToSectionId: "terms-general",
  },
  accessibility: {
    route: "/accessibility",
    pageTitle: "Accessibility statement",
    metaDescription: "Leo Kids accessibility statement - improving accessibility and reporting issues.",
    scrollToSectionId: "accessibility",
  },
  aiDisclosure: {
    route: "/ai-disclosure",
    pageTitle: "AI use disclosure",
    metaDescription: "Disclosure of AI use at Leo Kids - Copilot, limitations, and data use.",
    scrollToSectionId: "ai",
  },
  dataDeletion: {
    route: "/data-deletion",
    pageTitle: "Data deletion",
    metaDescription: "Leo Kids data deletion - deleting a child, requests, and SLA.",
    scrollToSectionId: "retention-deletion",
  },
  security: {
    route: "/security",
    pageTitle: "Data security",
    metaDescription: "Leo Kids data security - protecting data and reporting issues.",
    scrollToSectionId: "security",
  },
};

/** @deprecated use LEGACY_POLICY_PAGES — kept for imports that expect SITE_POLICIES */
export const SITE_POLICIES = LEGACY_POLICY_PAGES;

export default LEGACY_POLICY_PAGES;
