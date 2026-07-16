import {
  baseArticle,
  paragraph,
  heading,
  list,
  callout,
  screenshotBlock,
  videoBlock,
  relatedLinks,
} from "../articleHelpers";

const S = "parents";

export const welcomeAndOverview = baseArticle({
  slug: "welcome-and-overview",
  section: S,
  title: "Welcome to the parent guide",
  summary: "What Leo Kids is, what parents can do on the site, and how to get started.",
  keywords: ["parents", "start", "overview"],
  toc: [
    { id: "what-is-leo", title: "What is Leo Kids?" },
    { id: "parent-role", title: "The parent's role" },
  ],
  blocks: [
    heading(2, "what-is-leo", "What is Leo Kids?"),
    paragraph(
      "Leo Kids is a learning space for elementary learners in grades 1–6, with practice in math, geometry, English, and science, plus games and progress reports for parents."
    ),
    screenshotBlock(S, "welcome-and-overview", "overview", "Leo Kids home page with learning and game areas"),
    videoBlock(S, "welcome-and-overview"),
    heading(2, "parent-role", "The parent's role"),
    list([
      "Create a parent account and sign in",
      "Add children and manage login details",
      "View reports and practice recommendations",
    ]),
    relatedLinks([
      { href: "/help/parents/create-parent-account", label: "Create a parent account" },
      { href: "/help/parents/parent-dashboard-tour", label: "Parent dashboard tour" },
    ]),
  ],
});

export const createParentAccount = baseArticle({
  slug: "create-parent-account",
  section: S,
  title: "Create a parent account",
  summary: "How to sign up and enter the parent portal.",
  keywords: ["sign up", "login", "parents"],
  toc: [{ id: "login-page", title: "Login page" }],
  blocks: [
    heading(2, "login-page", "Login page"),
    paragraph("Go to the parent login page and complete sign-up or sign-in with your email and password."),
    screenshotBlock(S, "create-parent-account", "login", "Parent login screen"),
    videoBlock(S, "create-parent-account"),
    callout("tip", "Keep your login details in a safe place — you need them for every sign-in."),
    relatedLinks([{ href: "/parent/login", label: "Go to parent login" }]),
  ],
});

export const parentDashboardTour = baseArticle({
  slug: "parent-dashboard-tour",
  section: S,
  title: "Parent dashboard tour",
  summary: "Children list, adding a new child, and account limits.",
  keywords: ["dashboard", "children", "parents"],
  toc: [
    { id: "children-list", title: "Children list" },
    { id: "limits", title: "Account limits" },
  ],
  blocks: [
    heading(2, "children-list", "Children list"),
    paragraph("On the parent page you will see all children linked to the account, with name, grade, and management options."),
    screenshotBlock(S, "parent-dashboard-tour", "dashboard", "Parent page with children list"),
    videoBlock(S, "parent-dashboard-tour"),
    heading(2, "limits", "Account limits"),
    paragraph("By default, each parent account can include up to three children."),
    callout("info", "If you reach the limit, edit or remove an existing child before adding a new one."),
  ],
});

export const addStudents = baseArticle({
  slug: "add-students",
  section: S,
  title: "Add a child",
  summary: "Create a child profile, choose a grade, and save.",
  keywords: ["child", "grade", "add"],
  toc: [{ id: "add-form", title: "Add form" }],
  blocks: [
    heading(2, "add-form", "Add form"),
    paragraph("Enter the child's name and choose a grade (1 through 6). After saving, login details for the child will appear."),
    videoBlock(S, "add-students"),
    screenshotBlock(S, "add-students", "form", "Add child form with grade selection"),
    list(["Grade 1 — grade_1", "Grade 2 — grade_2", "through Grade 6 — grade_6"], false),
  ],
});

export const studentPinAndCredentials = baseArticle({
  slug: "student-pin-and-credentials",
  section: S,
  title: "PIN and login details for your child",
  summary: "What a PIN is, when it is shown once, and how to reset it.",
  keywords: ["PIN", "password", "child"],
  toc: [
    { id: "what-is-pin", title: "What is a PIN?" },
    { id: "reset", title: "Reset" },
  ],
  blocks: [
    heading(2, "what-is-pin", "What is a PIN?"),
    paragraph("Your child signs in with a username and a 4-digit code. After creation or reset, the code is shown once — save it."),
    screenshotBlock(S, "student-pin-and-credentials", "pin-display", "Message showing a new PIN code"),
    videoBlock(S, "student-pin-and-credentials"),
    heading(2, "reset", "Reset"),
    paragraph("On the parent page you can create a new login code for your child. The old code will stop working."),
    callout("warning", "Do not share the code on social media or in public groups."),
  ],
});

export const editOrDeleteStudent = baseArticle({
  slug: "edit-or-delete-student",
  section: S,
  title: "Edit or delete a child",
  summary: "Change name or grade, and delete with confirmation.",
  keywords: ["edit", "delete", "child"],
  toc: [{ id: "edit", title: "Edit" }, { id: "delete", title: "Delete" }],
  blocks: [
    heading(2, "edit", "Edit"),
    paragraph("Click edit next to the child's name, update details, and save."),
    screenshotBlock(S, "edit-or-delete-student", "edit", "Editing a child's details"),
    videoBlock(S, "edit-or-delete-student"),
    heading(2, "delete", "Delete"),
    paragraph("Deletion requires typing the child's name to confirm — this cannot be undone."),
    callout("warning", "Deleting a child removes their access and associated data from your account."),
  ],
});

export const howToReadReport = baseArticle({
  slug: "how-to-read-report",
  section: S,
  title: "How do I start reading the report?",
  summary: "A short introduction to the parent report and links to detailed guides.",
  keywords: ["report", "parents", "reading"],
  toc: [{ id: "open-report", title: "Open a report" }],
  blocks: [
    heading(2, "open-report", "Open a report"),
    paragraph("From the parent page, choose a child and click view report. You can switch between the standard and detailed report."),
    videoBlock(S, "how-to-read-report"),
    screenshotBlock(S, "how-to-read-report", "report-link", "Button to open a report from the parent page"),
    relatedLinks([
      { href: "/help/parent-report/report-overview", label: "Report overview" },
      { href: "/help/parent-report/summary-card", label: "Summary card" },
    ]),
  ],
});

export const parentCopilot = baseArticle({
  slug: "parent-copilot",
  section: S,
  title: "Ask about the report (Copilot)",
  summary: "How to ask questions about the report and what the system can answer.",
  keywords: ["Copilot", "questions", "report"],
  toc: [
    { id: "how-to-ask", title: "How to ask" },
    { id: "limits", title: "Limits" },
  ],
  blocks: [
    heading(2, "how-to-ask", "How to ask"),
    paragraph(
      'Inside the report, open "Ask about the report" and type a question in English about performance, topics, or recommendations.'
    ),
    videoBlock(S, "parent-copilot"),
    screenshotBlock(S, "parent-copilot", "copilot-panel", "Ask-about-the-report panel"),
    heading(2, "limits", "Limits"),
    list([
      "Answers are based on practice data on the site",
      "They do not replace professional educational advice",
      "Questions unrelated to the report may receive a general answer",
    ]),
  ],
});

export const monthlyRewards = baseArticle({
  slug: "monthly-rewards",
  section: S,
  title: "Monthly persistence reward",
  summary: "Persistence journey by subject and rewards for parents.",
  keywords: ["reward", "persistence", "monthly"],
  toc: [{ id: "journey", title: "Persistence journey" }],
  blocks: [
    heading(2, "journey", "Persistence journey"),
    paragraph("Your child builds persistence through monthly practice. On the rewards page you can see progress by subject."),
    screenshotBlock(S, "monthly-rewards", "rewards", "Persistence rewards page"),
    videoBlock(S, "monthly-rewards"),
    relatedLinks([{ href: "/parent/rewards", label: "Go to rewards page" }]),
  ],
});

export const installAsApp = baseArticle({
  slug: "install-as-app",
  section: S,
  title: "Install as an app",
  summary: "Add Leo Kids to your phone or tablet home screen.",
  keywords: ["PWA", "install", "app"],
  toc: [{ id: "install", title: "Install" }],
  blocks: [
    heading(2, "install", "Install"),
    paragraph(
      'On the home page or in the browser you may see "Install app" — tap and confirm. Then you can open Leo Kids like an app.'
    ),
    screenshotBlock(S, "install-as-app", "install-prompt", "Install app prompt"),
    videoBlock(S, "install-as-app"),
    callout("tip", "On iPhone: Share → Add to Home Screen."),
  ],
});

export const mobileAndOffline = baseArticle({
  slug: "mobile-and-offline",
  section: S,
  title: "Mobile and offline games",
  summary: "Using the site on a phone and playing without internet.",
  keywords: ["mobile", "offline"],
  toc: [
    { id: "mobile", title: "Using mobile" },
    { id: "offline", title: "Offline" },
  ],
  blocks: [
    heading(2, "mobile", "Using mobile"),
    paragraph("The site works on small screens. Student and parent login works from a phone too."),
    heading(2, "offline", "Offline"),
    paragraph('In the "Offline" area there are games that work on the same device without an internet connection.'),
    screenshotBlock(S, "mobile-and-offline", "offline-hub", "Offline games page"),
    videoBlock(S, "mobile-and-offline"),
    relatedLinks([{ href: "/offline", label: "Offline games" }]),
  ],
});

export const troubleshootingLogin = baseArticle({
  slug: "troubleshooting-login",
  section: S,
  title: "Login troubleshooting",
  summary: "Wrong PIN, locked account, and clearing browser cache.",
  keywords: ["issue", "login", "PIN"],
  toc: [{ id: "common", title: "Common issues" }],
  blocks: [
    heading(2, "common", "Common issues"),
    list([
      "Wrong PIN — ask your parent for a new code",
      "Username not recognized — check spelling",
      "Page will not load — try refresh or clear browser cache",
    ]),
    callout("info", "If the problem continues, contact us through the contact page."),
    videoBlock(S, "troubleshooting-login"),
    relatedLinks([{ href: "/contact", label: "Contact us" }]),
  ],
});

export const privacyAndData = baseArticle({
  slug: "privacy-and-data",
  section: S,
  title: "Privacy and data",
  summary: "What is collected during practice and how to reach us about privacy.",
  keywords: ["privacy", "data"],
  toc: [{ id: "data", title: "Practice data" }],
  blocks: [
    heading(2, "data", "Practice data"),
    paragraph(
      "The system stores practice data to show progress and reports. Do not share children's login codes with others."
    ),
    callout("info", "For privacy questions or requests, see the privacy policy or contact us."),
    videoBlock(S, "privacy-and-data"),
    relatedLinks([
      { href: "/privacy", label: "Privacy policy" },
      { href: "/legal", label: "Terms, privacy, and accessibility" },
      { href: "/contact", label: "Contact us" },
    ]),
  ],
});

export const PARENT_ARTICLES = [
  welcomeAndOverview,
  createParentAccount,
  parentDashboardTour,
  addStudents,
  studentPinAndCredentials,
  editOrDeleteStudent,
  howToReadReport,
  parentCopilot,
  monthlyRewards,
  installAsApp,
  mobileAndOffline,
  troubleshootingLogin,
  privacyAndData,
];
