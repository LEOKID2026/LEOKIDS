/** @typedef {{
 *   pageTitle: string,
 *   metaDescription?: string,
 *   badge: string,
 *   installLabel?: string,
 *   hero: {
 *     title: string,
 *     subtitle: string,
 *     primaryCta: { label: string, href?: string, scrollTo?: string, action?: string },
 *     secondaryCta?: { label: string, href?: string, scrollTo?: string, action?: string },
 *   },
 *   benefits: {
 *     title?: string,
 *     items: { title: string, text: string, emoji?: string }[],
 *   },
 *   infoSections?: {
 *     title: string,
 *     intro?: string,
 *     steps?: string[],
 *     bullets?: string[],
 *     body?: string,
 *   }[],
 *   closing: {
 *     title: string,
 *     text: string,
 *     primaryCta: { label: string, href?: string, action?: string },
 *     secondaryCta?: { label: string, href?: string, action?: string },
 *   },
 * }} MarketingPageContent */

/** @type {MarketingPageContent} */
export const KIDS_LANDING = {
  pageTitle: "Learn and play with Leo · LEO KIDS",
  metaDescription:
    "Practice math, geometry, English, and science — with games, coins, cards, and surprises along the way.",
  badge: "Kids · Games · Progress",
  installLabel: "Install the kids app",
  hero: {
    title: "Learn, play, and progress with Leo",
    subtitle:
      "Practice math, geometry, English, and science — with games, coins, cards, and surprises along the way.",
    primaryCta: { label: "Enter Leo's kids world", href: "/student/login" },
    secondaryCta: { label: "Ask a parent to join", action: "parentInvite" },
  },
  benefits: {
    items: [
      {
        title: "Solve questions and move forward",
        text: "Pick a subject, answer questions, and advance step by step.",
        emoji: "🎯",
      },
      {
        title: "Collect coins and cards",
        text: "Progress can unlock rewards, surprises, and new items.",
        emoji: "🪙",
      },
      {
        title: "Play and learn",
        text: "Not only practice — educational games that feel like real play.",
        emoji: "🎮",
      },
      {
        title: "Leo guides you",
        text: "Learn at your pace, try again, and improve without pressure.",
        emoji: "🦁",
      },
      {
        title: "Personal activities",
        text: "A parent can send a focused activity matched to what you should practice.",
        emoji: "📬",
      },
      {
        title: "Progress every day",
        text: "Log in, practice a little, earn wins, and keep going.",
        emoji: "⭐",
      },
    ],
  },
  infoSections: [
    {
      title: "How do you start?",
      steps: [
        "A parent creates an account.",
        "They add you as a child.",
        "You get a personal login code.",
        "Log in, learn, play, and progress.",
      ],
    },
  ],
  closing: {
    title: "Ready to start with Leo?",
    text: "Ask a parent to open an account, get your login code, and start learning in a fun way.",
    primaryCta: { label: "Ask a parent to join", action: "parentInvite" },
    secondaryCta: { label: "I already have a login code", href: "/student/login" },
  },
};

/** @type {MarketingPageContent} */
export const PARENTS_LANDING = {
  pageTitle: "Parent portal · LEO KIDS",
  metaDescription:
    "Leo Kids helps children practice in an engaging way while parents get a clear picture of progress.",
  badge: "Parents · Tracking · Clarity",
  installLabel: "Install the parent app",
  hero: {
    title: "Your child learns with joy — you see what's really happening",
    subtitle:
      "Leo Kids helps children practice in an engaging way while you get a clear picture of progress, strengths, and topics that need reinforcement.",
    primaryCta: { label: "Parent login / sign up", href: "/parent/login" },
    secondaryCta: { label: "What do you get?", scrollTo: "benefits" },
  },
  benefits: {
    items: [
      {
        title: "See what your child actually knows",
        text: "Instead of guessing, get a view by subject, topic, and real activity.",
      },
      {
        title: "Spot what to reinforce",
        text: "Highlights strengths alongside topics worth revisiting.",
      },
      {
        title: "Send personal activities",
        text: "Assign focused practice and see whether it was done and how it went.",
      },
      {
        title: "Give kids a reason to practice",
        text: "Coins, cards, surprises, and games make practice something kids want to return to.",
      },
      {
        title: "Practice at home without chaos",
        text: "Your child can practice when it fits, and you can follow along without hovering.",
      },
      {
        title: "Less friction around homework time",
        text: "When practice feels more like play, it's easier to start and stick with it.",
      },
    ],
  },
  infoSections: [
    {
      title: "What do you get after signing up?",
      intro: "After opening a parent account you can:",
      bullets: [
        "Add a child to the system.",
        "Get login details for your child.",
        "View progress reports.",
        "Check progress by subject and topic.",
        "See strong topics and topics that need reinforcement.",
        "Send a personal activity to your child.",
        "Follow completion and results.",
        "Let your child learn through rewards and games.",
      ],
    },
    {
      title: "Who is it for?",
      body: "Parents who want to understand where their child stands, help them move forward, and make home practice clearer and more engaging.",
    },
  ],
  closing: {
    title: "Your child gets a learning experience. You get clarity and calm.",
    text: "Open a parent account, add a child, and start seeing learning in a more organized way.",
    primaryCta: { label: "Open parent account", href: "/parent/login" },
  },
};

/** @type {MarketingPageContent} */
export const TEACHERS_LANDING = {
  pageTitle: "Private tutor portal · LEO KIDS",
  metaDescription:
    "Manage students, send focused practice, track progress, and arrive at the next lesson with a clearer picture.",
  badge: "Tutors · Tracking · Practice",
  installLabel: "Install the teacher app",
  hero: {
    title: "A smart workspace for private tutors",
    subtitle:
      "Manage students, send focused practice, track progress, and arrive at the next lesson with a clearer picture.",
    primaryCta: { label: "Teacher login / sign up", href: "/teacher/login" },
    secondaryCta: { label: "What can you do in the system?", scrollTo: "benefits" },
  },
  benefits: {
    items: [
      {
        title: "Organized student tracking",
        text: "Each student gets a clearer progress view by activity, subject, and topic.",
      },
      {
        title: "Less guesswork before a lesson",
        text: "See where a student succeeded, struggled, and what to reinforce next.",
      },
      {
        title: "Send personal activities",
        text: "Instead of generic homework, assign focused practice and track completion.",
      },
      {
        title: "More value for parents",
        text: "Parents see work that is structured, measurable, and clear.",
      },
      {
        title: "A tool between lessons",
        text: "Students can keep practicing after a session while you see what happened.",
      },
      {
        title: "Built for one-to-one tutoring",
        text: "Designed for students, practice, tracking, and progress — without needing a school setup.",
      },
    ],
  },
  infoSections: [
    {
      title: "What does a tutor get?",
      intro: "After registering you can:",
      bullets: [
        "Enter the teacher area.",
        "Manage students.",
        "View student reports.",
        "See progress and topics that need reinforcement.",
        "Send personal activities.",
        "Track completion and results.",
        "Use the system as a lesson and home-practice aid.",
      ],
    },
    {
      title: "Why it works for private tutors",
      body: "It saves time, adds structure, and shows parents professional, clear work. Instead of arriving with only a feeling, you arrive with data.",
    },
  ],
  closing: {
    title: "More structure. More tracking. More value per student.",
    text: "Leo Kids gives private tutors an easier way to support students, send practice, and track progress.",
    primaryCta: { label: "Open teacher account", href: "/teacher/login" },
  },
};
