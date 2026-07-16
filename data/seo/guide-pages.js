/**
 * English SEO content for parent-facing guide articles under /guides/*.
 * @typedef {{ q: string, a: string }} SeoFaqItem
 * @typedef {{ title: string, paragraphs?: string[], bullets?: string[] }} GuideSection
 * @typedef {{
 *   seoKey: string,
 *   slug: string,
 *   displayTitle: string,
 *   badge?: string,
 *   h1: string,
 *   intro: string,
 *   hubCardsHeading?: string,
 *   sections: GuideSection[],
 *   faq: SeoFaqItem[],
 *   relatedPracticePath: string,
 *   practiceCtaLabel: string,
 *   relatedGuideSlugs: string[],
 *   footerCta?: { title: string, body: string, primary: { href: string, label: string }, secondary?: { href: string, label: string } },
 * }} GuidePageContent
 * @typedef {{ href: string, title: string, blurb?: string }} GuideHubCard
 */

/** @type {readonly string[]} */
export const GUIDE_SLUGS = [
  "hub",
  "math-practice-at-home",
  "reading-practice-at-home",
  "no-print-worksheets",
  "learning-games-at-home",
  "parent-progress-tracking",
  "home-practice-routine",
  "math-games-for-kids",
  "reading-comprehension-at-home",
  "english-vocabulary-practice",
  "how-to-follow-child-progress",
];

/** @type {GuideHubCard[]} */
export const GUIDE_HUB_CARDS = [
  {
    href: "/guides/math-practice-at-home",
    title: "Math at home",
    blurb:
      "How to choose a math topic, match practice to grade, and keep a steady routine without turning every session into a test.",
  },
  {
    href: "/guides/reading-practice-at-home",
    title: "Reading at home",
    blurb:
      "How to practice reading aloud, accuracy, pace, and word understanding with short texts and focused questions.",
  },
  {
    href: "/guides/reading-comprehension-at-home",
    title: "Reading comprehension",
    blurb:
      "How to help your child find details, explain answers in their own words, and connect parts of a text.",
  },
  {
    href: "/guides/english-vocabulary-practice",
    title: "English vocabulary",
    blurb:
      "How to practice new words in context, review them through the week, and use them in simple sentences.",
  },
  {
    href: "/guides/learning-games-at-home",
    title: "Learning games at home",
    blurb:
      "How to combine games and digital practice as part of focused work in a chosen subject and topic.",
  },
  {
    href: "/guides/math-games-for-kids",
    title: "Math games",
    blurb:
      "Ideas for mixing addition, subtraction, multiplication, division, and math thinking into short, playful practice.",
  },
  {
    href: "/guides/parent-progress-tracking",
    title: "Tracking progress",
    blurb:
      "How to read reports, understand which topics were practiced, and spot trends over time.",
  },
  {
    href: "/guides/how-to-follow-child-progress",
    title: "Choosing a topic to strengthen",
    blurb:
      "How to pick the next topic based on practice, answers, and difficulty that keeps appearing.",
  },
  {
    href: "/guides/home-practice-routine",
    title: "Home practice routine",
    blurb:
      "How to set a suitable time, choose one task, and end practice on a good note.",
  },
  {
    href: "/guides/no-print-worksheets",
    title: "Practice without printing",
    blurb:
      "How to use digital practice and games, and choose a worksheet only when it fits your need.",
  },
];

/** @type {Record<string, GuidePageContent>} */
export const GUIDE_PAGES = {
  hub: {
    seoKey: "guides-hub",
    slug: "hub",
    displayTitle: "Guides for parents",
    badge: "Guides for parents",
    h1: "Practical guides for home practice and learning",
    intro:
      "Short, practical guides to help you choose a topic, build a home routine, understand progress, and combine digital practice, learning games, and worksheets when they fit.",
    hubCardsHeading: "Choose a guide by goal",
    sections: [
      {
        title: "How to use these guides",
        paragraphs: [
          "Pick the guide that matches your goal right now. You can start with practice in one subject, build a home routine, understand a progress report, or choose a topic to strengthen. You do not need to do everything at once.",
        ],
      },
    ],
    faq: [
      {
        q: "How do I choose the right guide?",
        a: "Choose by your current goal: practice in a subject, building a home routine, understanding a report, or picking a topic to strengthen. Start with one guide and move to others later.",
      },
      {
        q: "Can I go from a guide straight to practice?",
        a: "Yes. Guides link to practice areas, learning games, parent reports, and worksheets based on the topic.",
      },
      {
        q: "Should I use several guides at once?",
        a: "You can, but it is better to start with one clear goal. After you see what works for your child, add another practice path or guide.",
      },
      {
        q: "Where can I see my child's progress?",
        a: "In the parent portal you can see completed activities, subjects and topics practiced, answers, and patterns over time.",
      },
    ],
    relatedPracticePath: "/practice",
    practiceCtaLabel: "All practice areas",
    relatedGuideSlugs: [],
    footerCta: {
      title: "Choose a guide and take one step",
      body: "You do not need to change the whole learning routine in one day. Pick one goal, try it for a few days, and see what works for your child.",
      primary: { href: "/practice", label: "Practice by subject" },
      secondary: { href: "/parent/login", label: "Parent login" },
    },
  },

  "math-practice-at-home": {
    seoKey: "guides-math-practice-at-home",
    slug: "math-practice-at-home",
    displayTitle: "Math at home",
    badge: "Guide to math at home",
    h1: "Math practice at home — how to start well",
    intro:
      "Home math practice works best when you choose a clear topic, match question level to grade, and stop before practice becomes overload. The goal is a steady rhythm that lets your child understand, try, and improve.",
    sections: [
      {
        title: "Start with one topic",
        paragraphs: [
          "Choose a topic being taught now or one where your child needs more review. Addition, subtraction, multiplication, division, fractions, decimals, percentages, and word problems use different kinds of thinking, so practice each topic separately before mixed practice.",
        ],
        bullets: [
          "Choose grade and topic.",
          "Start with a few questions at the regular level.",
          "Check whether difficulty comes from calculation, understanding the prompt, or order of operations.",
          "Return to the same topic on another day before switching.",
        ],
      },
      {
        title: "How to respond to a mistake",
        paragraphs: [
          "Instead of giving the answer immediately, ask your child to explain what they tried. Go through the values together, mark the right operation, and solve one step at a time. When the same mistake repeats, choose more practice from the same family of questions.",
        ],
      },
      {
        title: "When to move to the next topic",
        paragraphs: [
          "Move on when your child answers most questions steadily and can explain their approach. Perfection is not required—understanding, consistency, and handling slightly different wording matter more.",
        ],
      },
      {
        title: "How to use Leo Kids",
        paragraphs: [
          "Choose your child's grade, open math, and pick one topic. After practice, check the report for correct answers, where reinforcement is needed, and what to practice next.",
        ],
      },
    ],
    faq: [
      {
        q: "How long should we practice?",
        a: "Length depends on age, topic, and focus. It is better to finish focused, good practice than to continue when your child is tired.",
      },
      {
        q: "Should we practice several topics together?",
        a: "Not at first. When one topic needs strengthening, start there and move to mixed practice only after a stable base.",
      },
      {
        q: "What if my child is guessing?",
        a: "Ask them to explain their approach, point to the values, and choose the operation before answering.",
      },
    ],
    relatedPracticePath: "/practice/math",
    practiceCtaLabel: "Math practice",
    relatedGuideSlugs: ["math-games-for-kids", "home-practice-routine", "parent-progress-tracking"],
    footerCta: {
      title: "Start with one math topic",
      body: "Choose grade, topic, and level, and let your child progress through questions matched to your practice choice.",
      primary: { href: "/practice/math", label: "Math practice" },
      secondary: { href: "/parent/login", label: "Parent login" },
    },
  },

  "no-print-worksheets": {
    seoKey: "guides-no-print-worksheets",
    slug: "no-print-worksheets",
    displayTitle: "Practice without printing",
    badge: "Home practice",
    h1: "Home practice without printing",
    intro:
      "You can practice at home directly from a computer, tablet, or phone. Digital practice and learning games let you start immediately, get new questions, and switch topics without preparing pages in advance. When paper helps, use Leo Kids worksheets.",
    sections: [
      {
        title: "When is digital practice a good fit?",
        paragraphs: [
          "Digital practice fits when you want a quick start, immediate feedback, playful learning, or more independent practice for your child.",
        ],
        bullets: [
          "Quick entry by grade and subject.",
          "Questions that change between sessions.",
          "Learning games across topics.",
          "Saved activity for tracking and reports.",
          "No printer or prep required.",
        ],
      },
      {
        title: "When is a worksheet a good fit?",
        paragraphs: [
          "A worksheet can help when your child prefers writing on paper, when you want screen-free time, when practicing structured writing and calculation, or when you want a sheet to reuse.",
        ],
      },
      {
        title: "You can combine both",
        paragraphs: [
          "You do not have to choose one path only. Start digitally, print a sheet for a topic that needs repetition, then return to a game or more online practice.",
        ],
      },
      {
        title: "How to start",
        paragraphs: [
          "Choose a subject and topic. For digital practice, go to the practice pages. For a worksheet, use the generator or pick from ready-made sheets.",
        ],
      },
    ],
    faq: [
      {
        q: "Do I have to print to use Leo Kids?",
        a: "No. You can use digital practice and games without printing.",
      },
      {
        q: "Are worksheets available too?",
        a: "Yes. Try the generator and choose from ready-made sheets with answer keys.",
      },
      {
        q: "Can we mix online practice and paper?",
        a: "Yes. Pick what fits the topic, your child, and the time you have.",
      },
    ],
    relatedPracticePath: "/practice",
    practiceCtaLabel: "Online practice",
    relatedGuideSlugs: ["home-practice-routine", "math-practice-at-home", "parent-progress-tracking"],
    footerCta: {
      title: "Choose the practice path that fits",
      body: "Start online or go to worksheets. Both options are available when you need them.",
      primary: { href: "/practice", label: "Online practice" },
      secondary: { href: "/practice/worksheets", label: "Worksheets" },
    },
  },

  "reading-practice-at-home": {
    seoKey: "guides-reading-practice-at-home",
    slug: "reading-practice-at-home",
    displayTitle: "Reading at home",
    badge: "Guide to reading at home",
    h1: "Reading practice at home — accuracy, pace, and understanding",
    intro:
      "Home reading practice does not have to be long. A short text at the right level can help your child read more accurately, recognize words faster, and understand the main idea.",
    sections: [
      {
        title: "Choose a text that fits your child",
        paragraphs: [
          "A good text is one your child can read for most of it, but still includes a few words that need attention. A text that is too easy does not create practice; one that is too hard can turn reading into a struggle.",
        ],
      },
      {
        title: "What to focus on while reading",
        bullets: [
          "Reading words accurately.",
          "Pausing at punctuation.",
          "Returning to a word read incorrectly.",
          "Understanding new words from the sentence.",
          "Briefly explaining what happened in the text.",
        ],
      },
      {
        title: "How to correct without stopping every sentence",
        paragraphs: [
          "You do not have to fix every mistake immediately. When a mistake changes meaning, pause and return to the word. When your child self-corrects, let them continue. At the end, choose two or three words to read again.",
        ],
      },
      {
        title: "How to use practice on the site",
        paragraphs: [
          "On the reading page, choose a grade and start suitable practice. Questions help check word understanding, details from the text, and overall comprehension.",
        ],
      },
    ],
    faq: [
      {
        q: "Should we read the same text again?",
        a: "Yes. Rereading can improve accuracy and pace, as long as your child understands the text and is not only memorizing it.",
      },
      {
        q: "What about a hard word?",
        a: "Break it into parts, read it in the sentence, and explain its meaning briefly.",
      },
      {
        q: "Should we time reading?",
        a: "Not as a regular habit. Accuracy and understanding matter more than speed.",
      },
    ],
    relatedPracticePath: "/practice/reading",
    practiceCtaLabel: "Reading practice",
    relatedGuideSlugs: [
      "reading-comprehension-at-home",
      "home-practice-routine",
      "how-to-follow-child-progress",
    ],
    footerCta: {
      title: "Choose a short text and start reading",
      body: "Focused reading and comprehension practice can fit easily into a home routine.",
      primary: { href: "/practice/reading", label: "Reading practice" },
      secondary: { href: "/parent/login", label: "Parent login" },
    },
  },

  "reading-comprehension-at-home": {
    seoKey: "guides-reading-comprehension-at-home",
    slug: "reading-comprehension-at-home",
    displayTitle: "Reading comprehension",
    badge: "Guide to reading comprehension",
    h1: "Reading comprehension at home — working with text and questions",
    intro:
      "Comprehension is more than accurate reading. Your child needs to find details, understand connections, draw conclusions, and explain answers using the text.",
    sections: [
      {
        title: "Start with the main idea",
        paragraphs: [
          "After reading, ask your child to say in one sentence what the text is about. If that is hard, return to the title, the first sentence, and the last sentence and find the central topic together.",
        ],
      },
      {
        title: "Question types worth practicing",
        bullets: [
          "Finding an explicit detail in the text.",
          "Identifying character, place, or time.",
          "Explaining cause and effect.",
          "Understanding a word from context.",
          "Drawing a conclusion not stated directly.",
          "Answering fully in the child's own words.",
        ],
      },
      {
        title: "Look for evidence in the text",
        paragraphs: [
          "When your child answers, ask them to show which sentence helped. That teaches them to support answers instead of relying on memory or guessing.",
        ],
      },
      {
        title: "What if the answer is partial?",
        paragraphs: [
          "Separate understanding the question from wording the answer. Highlight the question word, find the matching part of the text, then try a complete answer.",
        ],
      },
    ],
    faq: [
      {
        q: "Should we read the questions before the text?",
        a: "You can skim them briefly, but it is important to read the text fully—not only hunt for question words.",
      },
      {
        q: "How many questions should we do?",
        a: "A small number of different question types, with a full explanation of the approach, is better than many rushed answers.",
      },
      {
        q: "What is the difference between reading and comprehension?",
        a: "Reading focuses on recognizing words and reading accurately. Comprehension focuses on meaning, connections, and conclusions from the text.",
      },
    ],
    relatedPracticePath: "/practice/reading",
    practiceCtaLabel: "Reading comprehension practice",
    relatedGuideSlugs: [
      "reading-practice-at-home",
      "home-practice-routine",
      "how-to-follow-child-progress",
    ],
    footerCta: {
      title: "Read, find, and explain",
      body: "Choose a suitable text and practice one or two question types each time.",
      primary: { href: "/practice/reading", label: "Reading comprehension practice" },
      secondary: { href: "/parent/login", label: "Parent login" },
    },
  },

  "english-vocabulary-practice": {
    seoKey: "guides-english-vocabulary-practice",
    slug: "english-vocabulary-practice",
    displayTitle: "English vocabulary",
    badge: "Guide to English at home",
    h1: "English vocabulary practice at home",
    intro:
      "To remember a new English word, seeing it once is not enough. Read it, hear it, understand its meaning, and use it in several contexts.",
    sections: [
      {
        title: "Practice a small group of words",
        paragraphs: [
          "Choose a small set of words from the same topic, such as family, home, food, colors, or school. A clear group helps your child connect words and remember them.",
        ],
      },
      {
        title: "Four ways to work with each word",
        bullets: [
          "Read the word in English.",
          "Say what it means.",
          "Recognize the word in a sentence.",
          "Create a new short sentence.",
          "Return to the word on another day.",
        ],
      },
      {
        title: "Do not practice translation only",
        paragraphs: [
          "Translation is an important step, but the goal is for your child to recognize the word in a sentence. Ask what fits the word, what its opposite is, or when it is used.",
        ],
      },
      {
        title: "How to use Leo Kids",
        paragraphs: [
          "Choose a grade, open English, and pick vocabulary or a suitable topic. You can return for more practice and meet words in a different order.",
        ],
      },
    ],
    faq: [
      {
        q: "How many new words should we practice?",
        a: "Start with a small group you can review several times during the week.",
      },
      {
        q: "Do we have to write every word?",
        a: "Writing can help, but reading, saying, and using the word in a sentence matter too.",
      },
      {
        q: "What if a word is forgotten again?",
        a: "Bring it back into the practice group and use it in another context.",
      },
    ],
    relatedPracticePath: "/practice/english",
    practiceCtaLabel: "English practice",
    relatedGuideSlugs: ["learning-games-at-home", "home-practice-routine", "parent-progress-tracking"],
    footerCta: {
      title: "Choose a word group and start practicing",
      body: "Reading, meaning, and use in sentences help turn a new word into a familiar one.",
      primary: { href: "/practice/english", label: "English practice" },
      secondary: { href: "/parent/login", label: "Parent login" },
    },
  },

  "learning-games-at-home": {
    seoKey: "guides-learning-games-at-home",
    slug: "learning-games-at-home",
    displayTitle: "Learning games at home",
    badge: "Guide to learning games",
    h1: "How to combine learning games at home",
    intro:
      "Learning games can turn review into something your child wants to finish. For a game to support learning, choose one that fits the subject, topic, and level.",
    sections: [
      {
        title: "Choose a game by goal",
        paragraphs: [
          "Before starting, decide what you want to practice. You can pick a game for calculation, reading, vocabulary, science, or thinking. When the goal is clear, it is easier to see whether the game really helps.",
        ],
      },
      {
        title: "What to do during the game",
        bullets: [
          "Let your child try on their own.",
          "Pause only when the same difficulty repeats.",
          "Ask them to explain a choice or answer.",
          "Notice whether they act from understanding or guessing.",
          "Stop when the goal is reached.",
        ],
      },
      {
        title: "Combine games with more practice",
        paragraphs: [
          "After the game, move to a few questions on the same topic, or return to the game another day. The mix helps your child meet the same idea in a different form.",
        ],
      },
      {
        title: "How to use games on the site",
        paragraphs: [
          "Choose a game that fits the subject and level. Games combine educational tasks, challenges, coins, and progress inside the activity.",
        ],
      },
    ],
    faq: [
      {
        q: "Can a game replace all practice?",
        a: "A game is one way to practice. For some topics, combine questions, reading, writing, or a worksheet too.",
      },
      {
        q: "How do I know a game fits?",
        a: "Your child should understand the task and handle a reasonable challenge without guessing most answers.",
      },
      {
        q: "What if my child focuses only on rewards?",
        a: "Pause sometimes and ask what they learned or how they solved a task.",
      },
    ],
    relatedPracticePath: "/practice/games",
    practiceCtaLabel: "Learning games",
    relatedGuideSlugs: ["math-games-for-kids", "home-practice-routine", "parent-progress-tracking"],
    footerCta: {
      title: "Choose a game that fits your goal",
      body: "A good game combines fun with clear practice of a topic your child can understand and progress in.",
      primary: { href: "/practice/games", label: "Learning games" },
      secondary: { href: "/student/login", label: "Student login" },
    },
  },

  "math-games-for-kids": {
    seoKey: "guides-math-games-for-kids",
    slug: "math-games-for-kids",
    displayTitle: "Math games",
    badge: "Guide to math games",
    h1: "Math games for kids — practice through challenge",
    intro:
      "Math games let children practice operations, numbers, and thinking inside a clear task. Choose a game that fits a topic your child knows and a skill you want to strengthen.",
    sections: [
      {
        title: "Which topics can games practice?",
        bullets: [
          "Addition and subtraction.",
          "Multiplication and division.",
          "Order of operations.",
          "Fractions and decimals.",
          "Comparing quantities.",
          "Problem solving.",
          "Spatial and geometric thinking.",
        ],
      },
      {
        title: "Keep the math goal clear",
        paragraphs: [
          "Even when a game has characters, coins, or levels, ask your child how they reached an answer. Explaining helps distinguish understanding from guessing.",
        ],
      },
      {
        title: "Match the challenge level",
        paragraphs: [
          "A game that is too easy does not create new learning; one that is too hard can cause frustration. Choose a level where your child succeeds on most tasks but still has to think.",
        ],
      },
      {
        title: "After the game",
        paragraphs: [
          "Choose a few questions on the same topic and check whether your child uses the same approach outside the game. That turns the game into part of broader practice.",
        ],
      },
    ],
    faq: [
      {
        q: "Which game fits my child?",
        a: "Choose by grade, the topic your child is learning, and a difficulty level where they can work independently.",
      },
      {
        q: "Should we play the same game again?",
        a: "Yes, especially when the game shows changing tasks and helps improve accuracy and pace.",
      },
      {
        q: "What if my child is guessing?",
        a: "Ask them to pause and explain the operation or relationship between the numbers.",
      },
    ],
    relatedPracticePath: "/practice/games",
    practiceCtaLabel: "Math games",
    relatedGuideSlugs: ["math-practice-at-home", "learning-games-at-home", "home-practice-routine"],
    footerCta: {
      title: "Practice math through games",
      body: "Choose a familiar topic, match the level, and ask your child to explain their approach alongside the game.",
      primary: { href: "/practice/games", label: "Math games" },
      secondary: { href: "/practice/math", label: "Math practice" },
    },
  },

  "parent-progress-tracking": {
    seoKey: "guides-parent-progress-tracking",
    slug: "parent-progress-tracking",
    displayTitle: "Tracking progress",
    badge: "Guide to parent reports",
    h1: "How to read your child's progress reports",
    intro:
      "A progress report helps you see what your child practiced, where they succeed, and where difficulty repeats. The goal is not one score—it is a broader picture over time.",
    sections: [
      {
        title: "What to check in a report",
        bullets: [
          "Which subjects and topics were practiced.",
          "How many activities were completed.",
          "Which question types had mistakes.",
          "Whether performance improved between sessions.",
          "Which topics still need review.",
          "How much time was spent learning.",
        ],
      },
      {
        title: "Do not rely on one session",
        paragraphs: [
          "One practice result can be affected by tiredness, lack of focus, or first exposure to a topic. Check whether the same pattern repeats across several activities.",
        ],
      },
      {
        title: "Separate temporary difficulty from a steady pattern",
        paragraphs: [
          "One mistake does not require an immediate plan change. When the same mistake repeats on the same question type, choose focused practice and check again after a few days.",
        ],
      },
      {
        title: "What to do after reading a report",
        paragraphs: [
          "Choose one action: review a topic, move to a better-matched level, add practice, or have a short conversation about how your child solved questions.",
        ],
      },
    ],
    faq: [
      {
        q: "Does a low score mean my child does not know the topic?",
        a: "Not necessarily. Look at mistake types and results across several practice sessions.",
      },
      {
        q: "How often should I check reports?",
        a: "After several activities or about once a week, depending on how often you use the site.",
      },
      {
        q: "What matters more—time or accuracy?",
        a: "Both provide information, but understanding the approach and mistake types matters more than one number alone.",
      },
    ],
    relatedPracticePath: "/practice/parent-reports",
    practiceCtaLabel: "About parent reports",
    relatedGuideSlugs: [
      "how-to-follow-child-progress",
      "home-practice-routine",
      "math-practice-at-home",
    ],
    footerCta: {
      title: "Use the report to understand what happened in practice",
      body: "Review topics, spot patterns, and choose one next action.",
      primary: { href: "/practice/parent-reports", label: "About parent reports" },
      secondary: { href: "/parent/login", label: "Parent login" },
    },
  },

  "home-practice-routine": {
    seoKey: "guides-home-practice-routine",
    slug: "home-practice-routine",
    displayTitle: "Home practice routine",
    badge: "Guide to home practice",
    h1: "How to build a home practice routine that fits",
    intro:
      "A good home routine does not have to look the same every day. It should be clear, doable, and include tasks that fit your time, focus, and the topic your child needs.",
    sections: [
      {
        title: "Set a steady starting point",
        paragraphs: [
          "Choose a time when your child is relatively free and not too tired. Fixed days can help, but leave flexibility on busy days or when your child needs a break.",
        ],
      },
      {
        title: "Choose one goal per session",
        bullets: [
          "One math topic.",
          "One reading text.",
          "One vocabulary group in English.",
          "One learning game.",
          "One worksheet.",
          "A quick check of a topic practiced earlier.",
        ],
      },
      {
        title: "End clearly",
        paragraphs: [
          "Your child should know in advance what needs to be finished. When the task is done, stop. A clear ending builds success and willingness to return.",
        ],
      },
      {
        title: "Adjust the routine as progress changes",
        paragraphs: [
          "If a topic feels stable, move to the next one. If difficulty repeats, change the practice type or choose a better-matched level.",
        ],
      },
    ],
    faq: [
      {
        q: "Do we have to practice every day?",
        a: "No. A steady routine that fits your family matters more than a plan you cannot keep.",
      },
      {
        q: "What about a busy day?",
        a: "Choose a shorter task or postpone practice without turning the routine into punishment.",
      },
      {
        q: "Should my child choose?",
        a: "You can let them choose between two tasks that fit the goal you set.",
      },
    ],
    relatedPracticePath: "/practice",
    practiceCtaLabel: "All practice areas",
    relatedGuideSlugs: ["math-practice-at-home", "reading-practice-at-home", "parent-progress-tracking"],
    footerCta: {
      title: "Build a routine you can keep",
      body: "Choose a suitable time, one goal, and a clear ending for each session.",
      primary: { href: "/practice", label: "All practice areas" },
      secondary: { href: "/parent/login", label: "Parent login" },
    },
  },

  "how-to-follow-child-progress": {
    seoKey: "guides-how-to-follow-child-progress",
    slug: "how-to-follow-child-progress",
    displayTitle: "Choosing a topic to strengthen",
    badge: "Guide to choosing a topic",
    h1: "How to choose the next topic to strengthen",
    intro:
      "Choosing a topic to strengthen starts with spotting a pattern. Look for difficulty that repeats across several questions or sessions—not a single mistake. Then choose focused practice and check again.",
    sections: [
      {
        title: "Three sources of information",
        bullets: [
          "Progress reports and completed practice.",
          "Question types where mistakes repeat.",
          "Your child's explanation of how they tried to solve.",
        ],
      },
      {
        title: "Define the topic precisely",
        paragraphs: [
          "Instead of a broad area like math or reading, name a focused topic: vertical addition, long multiplication, following instructions, finding details in a text, or vocabulary in a specific theme.",
        ],
      },
      {
        title: "Choose suitable practice",
        paragraphs: [
          "Start at a level where your child can succeed on most questions. If it is too hard, return to a more basic step. If it is too easy, move to a harder level or question type.",
        ],
      },
      {
        title: "Check whether something changed",
        paragraphs: [
          "After several practice sessions, return to the same question type and check whether your child answers more steadily and can explain their approach.",
        ],
      },
    ],
    faq: [
      {
        q: "Should I always pick the topic with the lowest score?",
        a: "Not necessarily. Also look at how many questions were answered, what kind of difficulty appeared, and whether it repeated in later practice.",
      },
      {
        q: "How many topics should we strengthen at once?",
        a: "Start with one topic or two closely related ones so practice stays clear.",
      },
      {
        q: "When do we move to another topic?",
        a: "When your child shows steadier understanding and can handle questions worded differently.",
      },
    ],
    relatedPracticePath: "/practice/parent-reports",
    practiceCtaLabel: "Track progress",
    relatedGuideSlugs: ["parent-progress-tracking", "home-practice-routine", "math-practice-at-home"],
    footerCta: {
      title: "Spot a pattern and choose a focused topic",
      body: "Use reports, answers, and your child's explanation to choose the next step.",
      primary: { href: "/practice/parent-reports", label: "Track progress" },
      secondary: { href: "/parent/login", label: "Parent login" },
    },
  },
};

/**
 * @param {string} slug
 * @returns {GuidePageContent | null}
 */
export function getGuidePageContent(slug) {
  return GUIDE_PAGES[slug] ?? null;
}

/**
 * @param {string} slug
 * @returns {{ href: string, label: string } | null}
 */
export function getGuideLink(slug) {
  const page = GUIDE_PAGES[slug];
  if (!page) return null;
  const href = slug === "hub" ? "/guides" : `/guides/${slug}`;
  return { href, label: page.displayTitle };
}
