/**
 * Child-facing section titles for the learning book reader (Global English).
 */

/** @type {Record<string, string>} */
const SECTION_TITLE_MAP = {
  "What are we learning?": "What we learn",
  "Simple explanation": "Explanation",
  "Visual / concrete example": "Example",
  "Let's solve together": "Let's solve",
  "Try it yourself": "Try it yourself",
  "Common mistake — watch out!": "Watch out!",
  "Let's practice!": "Let's practice",
};

/**
 * @param {string} rawTitle
 * @returns {string}
 */
export function getSectionDisplayTitle(rawTitle) {
  const title = String(rawTitle || "").trim();
  if (SECTION_TITLE_MAP[title]) return SECTION_TITLE_MAP[title];
  if (/visual/i.test(title)) return "Example";
  if (/watch out/i.test(title)) return "Watch out!";
  return title;
}
