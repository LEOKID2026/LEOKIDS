/** Homepage routes — copy lives in `ui.public.homepage.*` via `useHomepageCopy()`. */

/** @deprecated use `useHomepageCopy()` — kept for tooling that still imports this symbol */
export const HOMEPAGE_BRAND_LINE =
  "LEO KIDS — tools for parents, a fun experience for kids, and learning that moves step by step";

/** @deprecated use `useHomepageCopy()` */
export const HOMEPAGE_COPY = {
  hero: {
    badge: "Learn · Play · Progress",
    titleLines: [
      "Tools for parents.",
      "A world kids love.",
      "Learning that moves step by step.",
    ],
    subtitle:
      "LEO KIDS connects practice and games for kids with a system that maps progress and gives parents a clear picture.",
    reinforcement: "Subjects · Topics · Skills · Sub-skills",
    videoTitle: "See it from a parent's view",
    videoDescription: "Meet the tracking, reports, and personal activities.",
    parentCta: "Parent login / sign up",
    kidsCta: "Student login",
    worksheetsCta: "Printable worksheets",
  },
  valueCards: [
    {
      title: "Tools for parents",
      text: "See what your child practiced, where they are improving, and what to reinforce.",
    },
    {
      title: "Experience for kids",
      text: "Practice, games, coins, and progress in a friendly, colorful journey.",
    },
    {
      title: "Progress mapping",
      text: "Tracking by subject, topic, skill, and sub-skill.",
    },
  ],
  parentIntro: {
    label: "For parents",
    title: "See your child clearly — not just a score",
    text: "Get a clear picture of strengths and gaps, then send a focused activity that matches what they need right now.",
  },
  parentVideo: {
    title: "See it from a parent's view",
    description: "Watch a short video about tracking, reports, and parent activities.",
  },
  learningSystem: {
    label: "The system behind learning",
    title: "We map how your child progresses — not just right or wrong",
    textParts: [
      "Every practice session feeds into one picture:",
      "by subject, topic, sub-topic, skill, and sub-skill.",
      "That helps spot wins, repeating mistakes, and what to reinforce — with a clear report and focused next steps.",
    ],
    dimensionTags: "Subject · Topic · Skill · Sub-skill",
    flowSteps: [
      "Child practices",
      "System maps performance",
      "Parent gets a clear view",
      "Choose the next step",
    ],
    capabilities: [
      {
        id: "subject-map",
        title: "Map by subject and topic",
        text: "See progress across math, geometry, English, and science down to the topics practiced.",
      },
      {
        id: "skills",
        title: "Skills and sub-skills",
        text: "The system looks at which skills were needed — not only whether an answer was correct.",
      },
      {
        id: "spot-difficulty",
        title: "Spot focused difficulty",
        text: "Repeating mistakes can point to a specific skill worth reinforcing.",
      },
      {
        id: "over-time",
        title: "Track over time",
        text: "The picture builds from real practice — not a single score.",
      },
      {
        id: "parent-report",
        title: "Clear parent report",
        text: "Plain language: what your child knows, where they are moving, and what to focus on.",
      },
      {
        id: "focused-work",
        title: "Focused follow-up",
        text: "Parents can send a personal activity targeting a topic or skill.",
      },
    ],
  },
  parentBenefits: {
    items: [
      {
        title: "Understand what's happening",
        text: "A broader view than one grade — built from real activity.",
      },
      {
        title: "Know where to focus",
        text: "Reports help pick the next topic to reinforce.",
      },
      {
        title: "Send personal activities",
        text: "Assign focused practice and follow results afterward.",
      },
      {
        title: "See progress over time",
        text: "Practice, games, and activities connect into an updating picture.",
      },
    ],
    highlight:
      "Instead of guessing where it's hard — get organized insight about what to work on.",
    cta: "Go to parent portal",
  },
  kids: {
    label: "For kids",
    title: "Learn the way kids like to",
    text: "Answer questions, move at your own pace, play, collect rewards, and come back for more.",
    videoTitle: "Meet Leo's kids world",
    videoDescription:
      "Watch a short video about practice, games, surprises, and progress in the kids world.",
    benefits: [
      {
        title: "Practice that feels like play",
        text: "Colorful questions and challenges that make practice feel lighter.",
      },
      {
        title: "Your own pace",
        text: "Leo guides you so you can keep trying without pressure.",
      },
      {
        title: "Games and learning together",
        text: "Mix subject practice with fun breaks in one place.",
      },
      {
        title: "Coins, cards, and surprises",
        text: "Progress comes with rewards that encourage coming back.",
      },
    ],
    cta: "Enter the kids world",
  },
  howItWorks: {
    title: "Get started in a few simple steps",
    steps: [
      "Parent opens an account",
      "Add your child and get personal login details",
      "Child starts learning, practicing, and playing",
      "The system maps progress; parents get reports and can send focused activities",
    ],
  },
  finalCta: {
    title: "Want a clearer picture of how your child is doing?",
    text: "Open an account, add your child, and build an organized learning picture from practice, activities, and games.",
    parentCta: "Open parent account",
    kidsCta: "Student login",
  },
  teachers: {
    label: "For private tutors",
    title: "Organized practice and tracking between lessons",
    text: "Send focused activities, see how students perform, and continue from the lesson at home.",
    bullets: ["Manage students", "Send personal activities", "Track completion and progress"],
    cta: "Teacher login / sign up",
  },
};

export const HOMEPAGE_ROUTES = {
  parentLogin: "/parent/login",
  studentLogin: "/student/login",
  teacherLogin: "/teacher/login",
  worksheets: "/practice/worksheets",
};
