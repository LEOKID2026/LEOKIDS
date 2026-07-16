/**
 * English SEO content for public worksheets landing page at /practice/worksheets.
 * @typedef {{ q: string, a: string }} WorksheetsFaqItem
 * @typedef {{ title: string, intro?: string, paragraphs?: string[], bullets?: string[] }} WorksheetsSection
 * @typedef {{ href: string, label: string }} WorksheetsLink
 * @typedef {{ title: string, body: string, primary: { href: string, label: string }, secondary?: { href: string, label: string } }} WorksheetsFooterCta
 * @typedef {{
 *   seoKey: string,
 *   slug: string,
 *   badge?: string,
 *   h1: string,
 *   intro: string,
 *   sections: WorksheetsSection[],
 *   relatedPracticeLinks?: WorksheetsLink[],
 *   relatedGuideSlugs: string[],
 *   faq: WorksheetsFaqItem[],
 *   footerCta?: WorksheetsFooterCta,
 * }} WorksheetsPageContent
 */

/** @type {Record<string, string>} */
const WORKSHEETS_LINK_LABELS = {
  "/practice": "All practice areas",
  "/practice/math": "Math practice",
  "/practice/reading": "Reading practice",
  "/practice/english": "English practice",
  "/practice/geometry": "Geometry practice",
  "/practice/no-print": "Digital practice",
  "/practice/games": "Learning games",
};

/** @param {string[]} hrefs @returns {WorksheetsLink[]} */
function worksheetsLinks(hrefs) {
  return hrefs.map((href) => ({
    href,
    label: WORKSHEETS_LINK_LABELS[href] ?? href,
  }));
}

/** @type {WorksheetsPageContent} */
export const WORKSHEETS_PAGE_CONTENT = {
  seoKey: "practice-worksheets",
  slug: "worksheets",
  badge: "Worksheets — try without signing up",
  h1: "Printable worksheets for kids — practice, print when helpful, or combine with online learning",
  intro:
    "On this page you can create a demo sheet with 8 exercises or choose from 35 ready worksheets in math, geometry, and English. Preview each sheet, print it, and open an answer key.",
  sections: [
    {
      title: "How do I create a demo sheet?",
      paragraphs: [
        "Pick a subject and grade, then create a short demo with 8 exercises. One topic per subject and grade is open for the demo; other topics show what is available in the full parent portal.",
      ],
    },
    {
      title: "Ready worksheets by grade",
      paragraphs: [
        "Choose from 35 ready sheets, filter by subject, grade, and level, open the sheet, and print when it fits your routine. Each sheet can have a separate answer key.",
      ],
    },
    {
      title: "Practice without printing too",
      paragraphs: [
        "Worksheets are an extra option alongside digital practice and games. Pick what fits the topic, your child, and the time you have.",
      ],
    },
    {
      title: "What does the full parent portal include?",
      paragraphs: [
        "In the full parent portal you can create unlimited worksheets, choose every available topic, and generate fresh sheets again and again. Sheets are rebuilt from the question bank and change between runs.",
      ],
    },
    {
      title: "Answer keys for home checking",
      paragraphs: [
        "You can open a separate answer key after creating a sheet. The demo includes answers for all 8 exercises; ready sheets include answers according to each sheet's structure.",
      ],
    },
  ],
  relatedPracticeLinks: worksheetsLinks([
    "/practice/math",
    "/practice/reading",
    "/practice/english",
    "/practice/geometry",
    "/practice/no-print",
    "/practice/games",
  ]),
  relatedGuideSlugs: [
    "math-practice-at-home",
    "home-practice-routine",
    "no-print-worksheets",
    "learning-games-at-home",
  ],
  faq: [
    {
      q: "Do I need to sign up to try this?",
      a: "No. The demo generator and ready sheets are available without logging in.",
    },
    {
      q: "How many exercises are in the demo sheet?",
      a: "The demo sheet has 8 exercises. Ready sheets keep their full structure.",
    },
    {
      q: "Are answer keys available?",
      a: "Yes. You can open a separate answer key for the demo and for each ready sheet.",
    },
    {
      q: "Do we have to print?",
      a: "No. You can practice online in Leo Kids and use a worksheet when printing helps.",
    },
    {
      q: "Do the sheets change?",
      a: "Sheets created in the generator are rebuilt from the question bank and can differ between runs.",
    },
  ],
  footerCta: {
    title: "Want to create more sheets and unlock every topic?",
    body: "In the full parent portal you can create unlimited worksheets, pick additional topics, and combine sheets with digital practice and progress insights.",
    primary: { href: "/parents", label: "Go to the parent portal" },
    secondary: { href: "/practice", label: "Browse practice areas" },
  },
};

/**
 * @returns {WorksheetsPageContent}
 */
export function getWorksheetsPageContent() {
  return WORKSHEETS_PAGE_CONTENT;
}
