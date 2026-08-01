/**
 * New Zealand (en-NZ) sparse Help overlays for parents —
 * school-year Grade → Year, maths, primary learners only.
 * Inherit all other articles/fields from English content/.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "elementary learners in grades 1–6",
        text:
          "Leo Kids is a learning space for primary learners in years 1–6, with practice in maths, geometry, English, and science, plus games and progress reports for parents.",
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "name, grade,",
        text:
          "On the parent page you will see all children linked to the account, with name, year, and management options.",
      },
    ],
  },
  "add-students": {
    summary: "Create a child profile, choose a year, and save.",
    keywords: ["child", "year", "add"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "choose a grade (1 through 6)",
        text:
          "Enter the child's name and choose a year (1 through 6). After saving, login details for the child will appear.",
      },
      {
        kind: "screenshot",
        altIncludes: "grade selection",
        alt: "Add child form with year selection",
        caption: "Add child form with year selection",
      },
      {
        kind: "list",
        items: ["Year 1 — grade_1", "Year 2 — grade_2", "through Year 6 — grade_6"],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Change name or year, and delete with confirmation.",
  },
};
