/**
 * Scotland (en-SCT) sparse Help overlays for parents —
 * Year → Primary 2–Primary 7 on top of en-GB Help (Maths already inherited).
 * textIncludes/altIncludes match en-GB runtime article text.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "primary learners in Years 1–6",
        text:
          "Leo Kids is a learning space for primary learners in Primary 2 through Primary 7, with practice in maths, geometry, English, and science, plus games and progress reports for parents.",
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "name, year,",
        text:
          "On the parent page you will see all children linked to the account, with name, primary year, and management options.",
      },
    ],
  },
  "add-students": {
    summary: "Create a child profile, choose a primary year, and save.",
    keywords: ["child", "primary year", "add"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "choose a year (1 through 6)",
        text:
          "Enter the child's name and choose a primary year (Primary 2 through Primary 7). After saving, login details for the child will appear.",
      },
      {
        kind: "screenshot",
        altIncludes: "year selection",
        alt: "Add child form with primary year selection",
        caption: "Add child form with primary year selection",
      },
      {
        kind: "list",
        items: [
          "Primary 2 — grade_1",
          "Primary 3 — grade_2",
          "Primary 4 — grade_3",
          "Primary 5 — grade_4",
          "Primary 6 — grade_5",
          "Primary 7 — grade_6",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Change name or primary year, and delete with confirmation.",
  },
};
