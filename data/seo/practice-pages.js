/**
 * English SEO content for parent-facing practice landing pages under /practice/*.
 * @typedef {{ q: string, a: string }} SeoFaqItem
 * @typedef {{ title: string, text: string }} GradeSection
 * @typedef {{ title: string, intro?: string, paragraphs?: string[], bullets?: string[], gradeSections?: GradeSection[] }} PracticeSection
 * @typedef {{ href: string, label: string }} PracticeLink
 * @typedef {{ href: string, title: string, blurb?: string, emoji?: string }} PracticeHubCard
 * @typedef {{ title: string, body: string, primary: { href: string, label: string }, secondary?: { href: string, label: string } }} PracticeFooterCta
 * @typedef {{
 *   seoKey: string,
 *   slug: string,
 *   badge?: string,
 *   h1: string,
 *   intro: string,
 *   sections: PracticeSection[],
 *   relatedPracticeLinks?: PracticeLink[],
 *   relatedGuideSlugs: string[],
 *   faq: SeoFaqItem[],
 *   hubCards?: PracticeHubCard[],
 *   footerCta?: PracticeFooterCta,
 * }} PracticePageContent
 */

/** @type {readonly string[]} */
export const PRACTICE_SLUGS = [
  "hub",
  "math",
  "reading",
  "english",
  "geometry",
  "science",
  "games",
  "no-print",
  "parent-reports",
];

/** @type {PracticeHubCard[]} */
export const PRACTICE_HUB_CARDS = [
  {
    href: "/practice/math",
    title: "Math",
    blurb:
      "Addition, subtraction, multiplication, division, fractions, decimals, percentages, ratios, word problems, and more by grade.",
    emoji: "🔢",
  },
  {
    href: "/practice/reading",
    title: "Reading comprehension",
    blurb: "Short texts, word recognition, finding details, understanding meaning, and comprehension questions.",
    emoji: "📚",
  },
  {
    href: "/practice/english",
    title: "English",
    blurb: "Phonics, vocabulary, sentences, grammar, reading, and following instructions in English.",
    emoji: "🌍",
  },
  {
    href: "/practice/geometry",
    title: "Geometry",
    blurb: "Shapes, angles, area, perimeter, solids, symmetry, circles, volume, Pythagoras, and more by grade.",
    emoji: "📐",
  },
  {
    href: "/practice/science",
    title: "Science",
    blurb: "Knowledge and understanding in nature, the human body, materials, environment, energy, and scientific phenomena.",
    emoji: "🔬",
  },
  {
    href: "/practice/games",
    title: "Learning games",
    blurb: "Educational tasks inside games, challenges, and activities in math, English, science, and reading.",
    emoji: "🎮",
  },
  {
    href: "/practice/parent-reports",
    title: "Parent reports",
    blurb: "Track subjects, topics, activity, accuracy, learning time, and what to review next.",
    emoji: "📊",
  },
  {
    href: "/practice/worksheets",
    title: "Worksheets",
    blurb: "Worksheet generator, ready-made sheets, answer keys, and print when helpful.",
    emoji: "📄",
  },
];

/** @type {Record<string, string>} */
const PRACTICE_LINK_LABELS = {
  "/practice": "All practice areas",
  "/practice/math": "Math practice",
  "/practice/reading": "Reading comprehension practice",
  "/practice/english": "English practice",
  "/practice/geometry": "Geometry practice",
  "/practice/science": "Science practice",
  "/practice/games": "Learning games",
  "/practice/no-print": "Digital practice",
  "/practice/worksheets": "Worksheets",
  "/practice/parent-reports": "Parent reports",
};

/** @param {string[]} hrefs @returns {PracticeLink[]} */
function practiceLinks(hrefs) {
  return hrefs.map((href) => ({
    href,
    label: PRACTICE_LINK_LABELS[href] ?? href,
  }));
}

/** @type {Record<string, PracticePageContent>} */
const PRACTICE_PAGES = {
  hub: {
    seoKey: "practice-hub",
    slug: "hub",
    badge: "Practice areas",
    h1: "Elementary practice by subject and grade",
    intro:
      "Choose a subject and explore the topics available in Leo Kids. Each page explains activity types, core topics, and how to get started.",
    sections: [
      {
        title: "How do I start?",
        paragraphs: [
          "Pick the subject that fits your goal. On each page you can see available topics, choose a grade, and continue to practice, games, reports, or worksheets.",
        ],
      },
    ],
    relatedGuideSlugs: ["home-practice-routine", "parent-progress-tracking", "no-print-worksheets"],
    faq: [
      {
        q: "Which grades is practice designed for?",
        a: "Practice is designed for grades 1–6, with each subject showing topics suited to the grade you select.",
      },
      {
        q: "Do I have to print?",
        a: "No. You can practice online, play learning games, or use a worksheet when that fits your routine.",
      },
      {
        q: "How do I choose a topic?",
        a: "Pick what is being taught now, a topic your child wants to review, or use parent reports to decide what to practice next.",
      },
    ],
    footerCta: {
      title: "Choose a subject and start practicing",
      body: "Each area shows topics and activities suited to the practice you choose.",
      primary: { href: "/parent/login", label: "Open parent account" },
      secondary: { href: "/student/login", label: "Student login" },
    },
  },

  math: {
    seoKey: "practice-math",
    slug: "math",
    badge: "Math for grades 1–6",
    h1: "Math practice by grade and topic",
    intro:
      "In Leo Kids, children can practice math by grade, topic, and difficulty. Questions vary between sessions and support calculation, understanding, and problem solving.",
    sections: [
      {
        title: "Core math topics",
        bullets: [
          "Addition and subtraction.",
          "Multiplication and division.",
          "Horizontal and vertical operations.",
          "Fractions and decimals.",
          "Percentages, ratios, and scale.",
          "Word problems.",
          "Order of operations.",
          "Mixed practice.",
        ],
      },
      {
        title: "How do I start?",
        paragraphs: [
          "Choose a grade, open the math topic you want, and start at the regular level. After a few questions, check whether the level fits and continue with more practice.",
        ],
      },
      {
        title: "How do I choose a topic?",
        paragraphs: [
          "Pick a topic being taught now, one where mistakes appeared, or a skill your child wants to strengthen. When a topic feels stable, move to mixed practice.",
        ],
      },
      {
        title: "By grade",
        gradeSections: [
          {
            title: "Grades 1–2",
            text: "Numbers, counting, basic addition and subtraction, comparing quantities, and short exercises.",
          },
          {
            title: "Grades 3–4",
            text: "Strengthening operations, multiplication and division, word problems, and practice that builds understanding—not just speed.",
          },
          {
            title: "Grades 5–6",
            text: "Fractions, percentages, decimals, more complex problems, and topics that require step-by-step thinking.",
          },
        ],
      },
    ],
    relatedPracticeLinks: practiceLinks([
      "/practice/games",
      "/practice/no-print",
      "/practice/parent-reports",
      "/practice/geometry",
    ]),
    relatedGuideSlugs: ["math-practice-at-home", "math-games-for-kids", "home-practice-routine"],
    faq: [
      {
        q: "Do questions change between sessions?",
        a: "Yes. Activities are drawn from a question bank and can vary between practice runs.",
      },
      {
        q: "Are there different levels?",
        a: "Yes. Topics offer regular and advanced levels based on content and grade.",
      },
      {
        q: "Can I print exercises?",
        a: "Yes. On the worksheets page you can create a sheet or choose a ready-made one with answers.",
      },
    ],
    footerCta: {
      title: "Choose a math topic",
      body: "Start with focused practice and continue based on your child's progress.",
      primary: { href: "/parent/login", label: "Open parent account" },
      secondary: { href: "/practice/worksheets", label: "Math worksheets" },
    },
  },

  reading: {
    seoKey: "practice-reading",
    slug: "reading",
    badge: "Reading comprehension",
    h1: "Reading comprehension practice for elementary learners",
    intro:
      "On the reading page, children practice word recognition, accurate reading, sentence understanding, finding details, and drawing conclusions from grade-appropriate texts.",
    sections: [
      {
        title: "Core skills",
        bullets: [
          "Reading words and sentences.",
          "Understanding meaning from context.",
          "Finding details in a text.",
          "Identifying the main idea.",
          "Cause and effect.",
          "Drawing conclusions.",
          "Answering in complete sentences.",
        ],
      },
      {
        title: "How do I start?",
        paragraphs: [
          "Choose a grade and start with a text where your child can read most of the words. After reading, move to the questions and ask your child to explain how they found each answer.",
        ],
      },
      {
        title: "What if there is difficulty?",
        paragraphs: [
          "If the challenge is reading the words, return to short, focused reading. If the challenge is understanding the question, highlight the question word and find the matching part of the text.",
        ],
      },
      {
        title: "By grade",
        gradeSections: [
          {
            title: "Grades 1–2",
            text: "Early reading, short words and sentences, basic understanding, and simple questions.",
          },
          {
            title: "Grades 3–4",
            text: "Short texts, comprehension questions, finding information, and brief written answers.",
          },
          {
            title: "Grades 5–6",
            text: "Longer texts, drawing conclusions, more detailed answers, and stronger comprehension accuracy.",
          },
        ],
      },
    ],
    relatedPracticeLinks: practiceLinks([
      "/practice/parent-reports",
      "/practice/no-print",
      "/practice/english",
    ]),
    relatedGuideSlugs: [
      "reading-practice-at-home",
      "reading-comprehension-at-home",
      "home-practice-routine",
    ],
    faq: [
      {
        q: "Is this Hebrew language reading?",
        a: "No. This page focuses on English reading comprehension—short texts and questions that build understanding and fluency.",
      },
      {
        q: "Are texts matched to grade?",
        a: "Yes. Practice is selected by grade and activity difficulty.",
      },
      {
        q: "How do I know if my child understood?",
        a: "Ask them to explain the main idea and point to the part of the text that helped them answer.",
      },
    ],
    footerCta: {
      title: "Choose a text and start reading",
      body: "Practice accurate reading, comprehension, and explaining answers from the text.",
      primary: { href: "/parent/login", label: "Open parent account" },
      secondary: { href: "/guides/reading-practice-at-home", label: "Reading at home guide" },
    },
  },

  english: {
    seoKey: "practice-english",
    slug: "english",
    badge: "English for grades 1–6",
    h1: "English practice by grade and topic",
    intro:
      "English practice includes phonics, vocabulary, sentences, grammar, reading, and following instructions. Choose a grade and topic and work on one skill per activity.",
    sections: [
      {
        title: "Core English topics",
        bullets: [
          "Letters and sounds.",
          "Reading words.",
          "Vocabulary.",
          "Matching words to meaning.",
          "Completing sentences.",
          "Basic grammar.",
          "Reading and following instructions.",
          "Writing by grade.",
        ],
      },
      {
        title: "How do I choose a topic?",
        paragraphs: [
          "In younger grades, start with letters, sounds, and basic words. Later, focus on vocabulary, sentences, grammar, and reading.",
        ],
      },
      {
        title: "How do I reinforce a new word?",
        paragraphs: [
          "Read the word, understand its meaning, recognize it in a sentence, and use it in another context.",
        ],
      },
      {
        title: "By grade",
        gradeSections: [
          {
            title: "Grades 1–2",
            text: "First exposure to words, sounds, letters, and short sentences.",
          },
          {
            title: "Grades 3–4",
            text: "Expanding vocabulary, understanding sentences, short reading, and basic structure practice.",
          },
          {
            title: "Grades 5–6",
            text: "Short texts, simple writing, more advanced grammar, and context-based understanding.",
          },
        ],
      },
    ],
    relatedPracticeLinks: practiceLinks([
      "/practice/games",
      "/practice/parent-reports",
      "/practice/no-print",
      "/practice/reading",
    ]),
    relatedGuideSlugs: ["english-vocabulary-practice", "learning-games-at-home", "home-practice-routine"],
    faq: [
      {
        q: "Is there phonics practice?",
        a: "Yes. Phonics activities are available for younger grades.",
      },
      {
        q: "Can we practice vocabulary?",
        a: "Yes. Choose activities for words, meaning, and use in sentences.",
      },
      {
        q: "Are there English worksheets?",
        a: "Yes. The worksheets page includes ready-made sheets and a generator to try.",
      },
    ],
    footerCta: {
      title: "Choose an English topic",
      body: "Start with words and sounds, then move to sentences, grammar, and reading.",
      primary: { href: "/parent/login", label: "Open parent account" },
      secondary: { href: "/practice/worksheets", label: "English worksheets" },
    },
  },

  geometry: {
    seoKey: "practice-geometry",
    slug: "geometry",
    badge: "Geometry for grades 1–6",
    h1: "Geometry practice by grade and topic",
    intro:
      "Geometry practice covers shapes, lines, angles, perimeter, area, solids, symmetry, circles, volume, and Pythagoras. Questions combine identification, calculation, and diagrams by topic.",
    sections: [
      {
        title: "Core geometry topics",
        bullets: [
          "Plane shapes.",
          "Triangles and quadrilaterals.",
          "Parallel and perpendicular lines.",
          "Angles.",
          "Perimeter and area.",
          "Diagonals and heights.",
          "Symmetry and transformations.",
          "Solids and volume.",
          "Circles.",
          "Pythagoras.",
        ],
      },
      {
        title: "How do I start?",
        paragraphs: [
          "Choose a grade and topic. For identification questions, look at labels on the diagram. For calculation questions, write the given values and choose the right operation or formula.",
        ],
      },
      {
        title: "How do I use the diagram?",
        paragraphs: [
          "The diagram shows the shape, measurements, and labels needed to solve the problem. Read the question too—do not rely only on how the shape looks.",
        ],
      },
      {
        title: "By grade",
        gradeSections: [
          {
            title: "Grades 1–2",
            text: "Identifying shapes, telling shapes apart, lines, and basic properties.",
          },
          {
            title: "Grades 3–4",
            text: "Measurement, perimeter, angles, and properties of familiar shapes.",
          },
          {
            title: "Grades 5–6",
            text: "Area, relationships between shapes, more advanced topics, and step-by-step reasoning.",
          },
        ],
      },
    ],
    relatedPracticeLinks: practiceLinks([
      "/practice/math",
      "/practice/games",
      "/practice/parent-reports",
    ]),
    relatedGuideSlugs: ["math-practice-at-home", "home-practice-routine", "math-games-for-kids"],
    faq: [
      {
        q: "Do questions include diagrams?",
        a: "Yes. Suitable questions include shape and solid diagrams with measurements and labels.",
      },
      {
        q: "Can we practice area and perimeter?",
        a: "Yes. Topics include area, perimeter, measurements, and grade-appropriate calculations.",
      },
      {
        q: "Are there geometry worksheets?",
        a: "Yes. Ready-made sheets and a generator are available on the worksheets page.",
      },
    ],
    footerCta: {
      title: "Choose a geometry topic",
      body: "Practice identification, drawing, and calculation with topic-matched questions.",
      primary: { href: "/parent/login", label: "Open parent account" },
      secondary: { href: "/practice/worksheets", label: "Geometry worksheets" },
    },
  },

  science: {
    seoKey: "practice-science",
    slug: "science",
    badge: "Science for elementary learners",
    h1: "Science practice by topic",
    intro:
      "Science practice in Leo Kids helps children review concepts, understand processes, and apply knowledge in questions. Activities combine facts, comparison, cause and effect, and understanding phenomena.",
    sections: [
      {
        title: "Core science topics",
        bullets: [
          "Animals and plants.",
          "The human body and health.",
          "Materials and properties.",
          "Water, air, and environment.",
          "Energy and forces.",
          "Earth and space.",
          "Natural processes and phenomena.",
          "Protecting the environment.",
        ],
      },
      {
        title: "How do we practice science?",
        paragraphs: [
          "Choose a topic, read each question, and look for the concept or process it is based on. When there are several options, eliminate answers that do not fit the facts in the question.",
        ],
      },
      {
        title: "More than memorizing facts",
        paragraphs: [
          "Ask your child to explain why an answer is correct, what causes a process, and how the result changes when a condition changes.",
        ],
      },
      {
        title: "By grade",
        gradeSections: [
          {
            title: "Grades 1–2",
            text: "Introduction to animals, plants, the human body, and the nearby environment.",
          },
          {
            title: "Grades 3–4",
            text: "Deeper understanding of materials, natural processes, living systems, and environmental phenomena.",
          },
          {
            title: "Grades 5–6",
            text: "More advanced topics such as earth and space, environment, experiments, and structured scientific thinking.",
          },
        ],
      },
    ],
    relatedPracticeLinks: practiceLinks([
      "/practice/games",
      "/practice/parent-reports",
      "/practice/no-print",
    ]),
    relatedGuideSlugs: ["home-practice-routine", "learning-games-at-home", "parent-progress-tracking"],
    faq: [
      {
        q: "Does practice include comprehension questions?",
        a: "Yes. Alongside facts and concepts, there are questions that ask children to explain relationships and processes.",
      },
      {
        q: "How do I choose a topic?",
        a: "Pick what is being taught now or a topic your child wants to review.",
      },
      {
        q: "Do activities change?",
        a: "Yes. Different practice runs can show different questions from the topic bank.",
      },
    ],
    footerCta: {
      title: "Choose a science topic",
      body: "Review concepts and use them to explain processes and phenomena.",
      primary: { href: "/parent/login", label: "Open parent account" },
      secondary: { href: "/practice", label: "All practice areas" },
    },
  },

  games: {
    seoKey: "practice-games",
    slug: "games",
    badge: "Learning games",
    h1: "Learning games for kids by subject and level",
    intro:
      "Leo Kids learning games combine tasks in math, English, science, and reading comprehension inside playful activities. Each game has a clear goal, questions, and challenges matched to the chosen level.",
    sections: [
      {
        title: "What can children practice in games?",
        bullets: [
          "Operations and numbers.",
          "Reading and vocabulary.",
          "English.",
          "Science and environment.",
          "Thinking and memory.",
          "Problem solving.",
          "Accuracy and pace.",
          "Decisions based on information.",
        ],
      },
      {
        title: "How do I choose a game?",
        paragraphs: [
          "Pick by the subject and topic your child wants to practice. Start at a level where they understand the task and can progress without guessing most answers.",
        ],
      },
      {
        title: "What after the game?",
        paragraphs: [
          "Ask what the main challenge was, which question was hard, and what strategy helped them succeed.",
        ],
      },
      {
        title: "By grade",
        gradeSections: [
          {
            title: "Grades 1–2",
            text: "Games with short instructions and tasks for identification, matching, calculation, reading, and vocabulary at a young-learner level.",
          },
          {
            title: "Grades 3–4",
            text: "Games that combine multiplication, division, text understanding, vocabulary, science, task solving, and multi-step progress.",
          },
          {
            title: "Grades 5–6",
            text: "Games with harder challenges, problem solving, accuracy, decision making, and subject-based knowledge.",
          },
        ],
      },
    ],
    relatedPracticeLinks: practiceLinks([
      "/practice/math",
      "/practice/english",
      "/practice/parent-reports",
    ]),
    relatedGuideSlugs: ["learning-games-at-home", "math-games-for-kids", "home-practice-routine"],
    faq: [
      {
        q: "Do games include educational questions?",
        a: "Yes. Games combine questions and tasks as part of the activity.",
      },
      {
        q: "Are there different levels?",
        a: "Yes. Games adjust task types and challenge level for different age groups and levels.",
      },
      {
        q: "Can children play as guests?",
        a: "Access options depend on system settings and the game selected.",
      },
    ],
    footerCta: {
      title: "Choose a game and start a learning challenge",
      body: "Match the game to subject and level and let your child progress through tasks and questions.",
      primary: { href: "/practice/games", label: "Learning games" },
      secondary: { href: "/student/login", label: "Student login" },
    },
  },

  "no-print": {
    seoKey: "practice-no-print",
    slug: "no-print",
    badge: "Digital practice",
    h1: "Digital practice for kids — no printing required",
    intro:
      "Start practice directly on the site, choose a subject and topic, and get questions and activities without preparing pages in advance. Digital games and practice are available by grade and subject.",
    sections: [
      {
        title: "What can you do online?",
        bullets: [
          "Practice questions by subject and topic.",
          "Play learning games.",
          "Review a topic several times.",
          "Get changing activities and questions.",
          "Save activity for reports and tracking.",
          "Switch between subjects as needed.",
        ],
      },
      {
        title: "Start without prep",
        paragraphs: [
          "Choose a subject, grade, and topic and begin. No need to download a file or prepare materials first.",
        ],
      },
      {
        title: "Print when it helps",
        paragraphs: [
          "When you want to work on paper, go to the worksheets page, use the generator, or choose from ready-made sheets.",
        ],
      },
      {
        title: "By grade",
        gradeSections: [
          {
            title: "Grades 1–2",
            text: "Short activities in math, reading, language, and learning games open directly on the site with clear instructions for young learners.",
          },
          {
            title: "Grades 3–4",
            text: "Choose a subject and topic, practice changing questions, mix in learning games, and return for more activity as needed.",
          },
          {
            title: "Grades 5–6",
            text: "Digital practice supports focused topics, harder questions, problem solving, reading, language, and additional subjects.",
          },
        ],
      },
    ],
    relatedPracticeLinks: practiceLinks([
      "/practice/math",
      "/practice/english",
      "/practice/worksheets",
      "/practice/parent-reports",
    ]),
    relatedGuideSlugs: ["no-print-worksheets", "math-practice-at-home", "home-practice-routine"],
    faq: [
      {
        q: "Do I need a printer?",
        a: "No. Digital practice and games work directly on the site.",
      },
      {
        q: "Is there also a printable option?",
        a: "Yes. On the worksheets page you can create a sheet, preview it, and print when helpful.",
      },
      {
        q: "Is activity saved?",
        a: "In the parent portal you can track activities, subjects, and topics practiced.",
      },
    ],
    footerCta: {
      title: "Start practicing on the site",
      body: "Choose a subject and topic, or go to worksheets when paper practice fits better.",
      primary: { href: "/practice", label: "All practice areas" },
      secondary: { href: "/practice/worksheets", label: "Worksheets" },
    },
  },

  "parent-reports": {
    seoKey: "practice-parent-reports",
    slug: "parent-reports",
    badge: "Reports for parents",
    h1: "Parent progress reports — see what your child practiced",
    intro:
      "Parent reports summarize activities your child completed, subjects and topics practiced, answers, and progress over time.",
    sections: [
      {
        title: "What can you see in reports?",
        bullets: [
          "Subjects and topics practiced.",
          "Number of activities and questions.",
          "Correct answers and mistakes.",
          "Question types where difficulty appeared.",
          "Learning time.",
          "Trends across several practice sessions.",
          "Topics worth reviewing or strengthening.",
        ],
      },
      {
        title: "Standard and detailed reports",
        paragraphs: [
          "The standard report gives a quick picture of activity. The detailed report lets you go deeper into topics, questions, and patterns that repeat across practice.",
        ],
      },
      {
        title: "How to use the information",
        paragraphs: [
          "After reading a report, choose one next step: review a topic, add practice, change level, or move to the next topic.",
        ],
      },
      {
        title: "By grade",
        gradeSections: [
          {
            title: "General",
            text: "Reports are based on your child's actual activity on the site.",
          },
          {
            title: "By subject",
            text: "Reports can reflect practiced areas such as math, English, geometry, and science—based on activity and available content.",
          },
        ],
      },
    ],
    relatedPracticeLinks: practiceLinks([
      "/practice",
      "/practice/math",
      "/practice/reading",
      "/practice/english",
    ]),
    relatedGuideSlugs: [
      "parent-progress-tracking",
      "how-to-follow-child-progress",
      "home-practice-routine",
    ],
    faq: [
      {
        q: "Does a report show only a score?",
        a: "No. Reports include topics, activity, answers, and patterns over time.",
      },
      {
        q: "When should I check a report?",
        a: "After several activities or when you want to choose a new topic to practice.",
      },
      {
        q: "Can I see topics to strengthen?",
        a: "Reports can help identify topics where difficulty repeats and choose suitable practice.",
      },
    ],
    footerCta: {
      title: "Turn activity into useful information",
      body: "See what your child practiced, spot patterns, and choose the next step.",
      primary: { href: "/parent/login", label: "Parent login" },
      secondary: { href: "/guides/parent-progress-tracking", label: "Guide to reading reports" },
    },
  },
};

/**
 * @param {string} slug
 * @returns {PracticePageContent | null}
 */
export function getPracticePageContent(slug) {
  const page = PRACTICE_PAGES[slug];
  if (!page) return null;
  if (slug === "hub") {
    return { ...page, hubCards: PRACTICE_HUB_CARDS };
  }
  return page;
}
