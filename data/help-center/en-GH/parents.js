/**
 * Ghana (en-GH) sparse Help overlays for parents —
 * Grade → Basic 1–6 / basic level; Lower/Upper Primary; Maths; learners.
 */

/** @type {Record<string, import("./merge-overlays.js").HelpArticleOverlay>} */
export const PARENT_OVERRIDES_BY_SLUG = {
  "welcome-and-overview": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "elementary learners in grades 1–6",
        text:
          "Leo Kids is a learning space for primary school learners in Basic 1–6 (Lower Primary Basic 1–3 and Upper Primary Basic 4–6), with practice in maths, geometry, English, and science, plus games and progress reports for parents.",
      },
    ],
  },
  "parent-dashboard-tour": {
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "name, grade,",
        text:
          "On the parent page you will see all children linked to the account, with name, basic level, and management options.",
      },
    ],
  },
  "add-students": {
    summary: "Create a child profile, choose a basic level, and save.",
    keywords: ["child", "basic level", "add"],
    blockPatches: [
      {
        kind: "paragraph",
        textIncludes: "choose a grade (1 through 6)",
        text:
          "Enter the child's name and choose a basic level (Basic 1 through Basic 6). After saving, login details for the child will appear.",
      },
      {
        kind: "screenshot",
        altIncludes: "grade selection",
        alt: "Add child form with basic level selection",
        caption: "Add child form with basic level selection",
      },
      {
        kind: "list",
        items: [
          "Basic 1 — grade_1",
          "Basic 2 — grade_2",
          "through Basic 6 — grade_6",
        ],
      },
    ],
  },
  "edit-or-delete-student": {
    summary: "Change name or basic level, and delete with confirmation.",
  },
};
