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

const S = "students";

function studentArticle(opts) {
  return baseArticle({ ...opts, section: S, audience: "student" });
}

export const studentLogin = studentArticle({
  slug: "student-login",
  title: "How do I sign in?",
  summary: "Sign in with your username and PIN.",
  keywords: ["login", "PIN"],
  toc: [{ id: "steps", title: "Steps" }],
  blocks: [
    heading(2, "steps", "Steps"),
    list(["Ask your parent for your username and code", "Type them on the login page", "Tap Sign in"], true),
    videoBlock(S, "student-login"),
    screenshotBlock(S, "student-login", "login", "Student login screen"),
  ],
});

export const studentHomeTour = studentArticle({
  slug: "student-home-tour",
  title: "My home page",
  summary: "What you see after signing in: subjects, coins, and avatar.",
  keywords: ["home", "student"],
  toc: [{ id: "home", title: "Home page" }],
  blocks: [
    heading(2, "home", "Home page"),
    paragraph("Here you will see your name, how many coins you have, and which subjects you can open."),
    videoBlock(S, "student-home-tour"),
    screenshotBlock(S, "student-home-tour", "home", "Student home page with subject cards"),
  ],
});

export const chooseSubjectAndGrade = studentArticle({
  slug: "choose-subject-and-grade",
  title: "Choose a subject and grade",
  summary: "How to enter practice in the subject you picked.",
  keywords: ["subject", "grade"],
  toc: [{ id: "learning-hub", title: "Learning hub" }],
  blocks: [
    heading(2, "learning-hub", "Learning hub"),
    paragraph("Choose a subject from the list. Activities will match your grade."),
    videoBlock(S, "choose-subject-and-grade"),
    screenshotBlock(S, "choose-subject-and-grade", "subjects", "Subject list in the learning hub"),
    relatedLinks([{ href: "/learning", label: "Go to learning hub" }]),
  ],
});

export const answeringQuestions = studentArticle({
  slug: "answering-questions",
  title: "How do I answer questions?",
  summary: "Choosing, typing, and selecting answers.",
  keywords: ["questions", "answer"],
  toc: [{ id: "types", title: "Question types" }],
  blocks: [
    heading(2, "types", "Question types"),
    list([
      "Sometimes you choose an answer from a list",
      "Sometimes you type a number or word",
      "After your answer you will see if you were right",
    ]),
    videoBlock(S, "answering-questions"),
    screenshotBlock(S, "answering-questions", "question", "Practice question on screen"),
  ],
});

export const hintsAndExplanations = studentArticle({
  slug: "hints-and-explanations",
  title: "Hints and explanations",
  summary: "What happens after a correct or incorrect answer.",
  keywords: ["explanation", "hint"],
  toc: [{ id: "after", title: "After the answer" }],
  blocks: [
    heading(2, "after", "After the answer"),
    paragraph("If you made a mistake — read the explanation and try again. If you were right — move to the next question!"),
    callout("tip", "Do not rush — reading the explanation helps you understand."),
    videoBlock(S, "hints-and-explanations"),
  ],
});

export const dailyMissions = studentArticle({
  slug: "daily-missions",
  title: "Daily missions",
  summary: "Small tasks that help you move forward every day.",
  keywords: ["daily", "missions"],
  toc: [{ id: "missions", title: "Missions" }],
  blocks: [
    heading(2, "missions", "Missions"),
    paragraph("On your home page you will see daily missions. When you finish them, you earn points and progress."),
    videoBlock(S, "daily-missions"),
    screenshotBlock(S, "daily-missions", "missions", "Daily missions panel"),
  ],
});

export const monthlyPersistence = studentArticle({
  slug: "monthly-persistence",
  title: "Monthly persistence journey",
  summary: "Practice each month and build progress.",
  keywords: ["persistence", "month"],
  toc: [{ id: "persistence", title: "Persistence" }],
  blocks: [
    heading(2, "persistence", "Persistence"),
    paragraph("The more you practice in a month, the further your journey goes. It shows how much you kept going!"),
    screenshotBlock(S, "monthly-persistence", "persistence", "Monthly persistence journey"),
    videoBlock(S, "monthly-persistence"),
  ],
});

export const coinsAndArcade = studentArticle({
  slug: "coins-and-arcade",
  title: "Coins and arcade",
  summary: "How to earn coins and play online games.",
  keywords: ["coins", "arcade"],
  toc: [{ id: "coins", title: "Coins" }],
  blocks: [
    heading(2, "coins", "Coins"),
    paragraph("Practice and earn coins. In the arcade you can play board-style games with friends."),
    videoBlock(S, "coins-and-arcade"),
    screenshotBlock(S, "coins-and-arcade", "arcade", "Arcade page"),
    relatedLinks([{ href: "/student/arcade", label: "Go to arcade" }]),
  ],
});

export const avatarAndProfile = studentArticle({
  slug: "avatar-and-profile",
  title: "Change your avatar",
  summary: "How to choose a character or picture for your profile.",
  keywords: ["avatar", "profile"],
  toc: [{ id: "avatar", title: "Avatar" }],
  blocks: [
    heading(2, "avatar", "Avatar"),
    paragraph("Tap your picture on the home page and choose a new avatar."),
    screenshotBlock(S, "avatar-and-profile", "avatar", "Choosing an avatar"),
    videoBlock(S, "avatar-and-profile"),
  ],
});

export const offlineGames = studentArticle({
  slug: "offline-games",
  title: "Offline games",
  summary: "Games without internet on the same device.",
  keywords: ["offline", "game"],
  toc: [{ id: "offline", title: "Offline" }],
  blocks: [
    heading(2, "offline", "Offline"),
    paragraph("Tic-tac-toe and other games — no network needed."),
    screenshotBlock(S, "offline-games", "offline", "Offline games list"),
    videoBlock(S, "offline-games"),
    relatedLinks([{ href: "/offline", label: "Offline games" }]),
  ],
});

export const tipsForGoodPractice = studentArticle({
  slug: "tips-for-good-practice",
  title: "Tips for good practice",
  summary: "Study time, breaks, and consistency.",
  keywords: ["tips", "practice"],
  toc: [{ id: "tips", title: "Tips" }],
  blocks: [
    heading(2, "tips", "Tips"),
    list([
      "Practice a little every day",
      "Take a break if you are tired",
      "Read explanations when you do not understand",
    ]),
    callout("tip", "Learning is more fun when you are not pressuring yourself!"),
    videoBlock(S, "tips-for-good-practice"),
  ],
});

export const STUDENT_ARTICLES = [
  studentLogin,
  studentHomeTour,
  chooseSubjectAndGrade,
  answeringQuestions,
  hintsAndExplanations,
  dailyMissions,
  monthlyPersistence,
  coinsAndArcade,
  avatarAndProfile,
  offlineGames,
  tipsForGoodPractice,
];
