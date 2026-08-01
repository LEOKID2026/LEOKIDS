export const ENGLISH_GRADE_ORDER = ["g1", "g2", "g3", "g4", "g5", "g6"];

export const ENGLISH_GENERAL_GOALS = [
  "Practice vocabulary, grammar, meaning cues, and sentence building — aligned with common elementary school English topics.",
  "Match practice level (standard / advanced) to each learner by grade, recent successes, and daily challenges.",
  "Strengthen English writing with focused typing drills and a gradual path from short sentences to longer ones.",
];

export const ENGLISH_GRADES = {
  g1: {
    key: "g1",
    name: "Grade 1",
    stage: "Exposure stage",
    topics: ["phonics", "vocabulary", "mixed"],
    wordLists: ["colors", "numbers", "family", "animals", "emotions", "actions", "school"],
    curriculum: {
      summary: "A playful introduction to basic English words using two-way vocabulary cards.",
      focus: [
        "Recognize English words from a meaning cue and the reverse to build early confidence.",
        "Include colors, numbers, and classroom objects in quick visual practice.",
      ],
      skills: [
        "Choose the correct meaning of a word in English or the instruction language.",
        "Spot the correct meaning under time pressure with a focus on attention.",
      ],
      grammar: ["Exposure to I am / You are and basic pronouns inside fixed patterns."],
      vocabulary: [
        "Colors, numbers 0–20, family members, and classroom objects.",
        "Basic animals, early feelings, and simple everyday action verbs.",
      ],
      benchmark: [
        "At least 80% accuracy practicing 20 basic words.",
        "Comfort switching meaning direction (English ↔ instruction language) in learning mode.",
      ],
    },
  },
  g2: {
    key: "g2",
    name: "Grade 2",
    stage: "Foundation stage",
    topics: ["phonics", "vocabulary", "translation", "writing", "mixed"],
    wordLists: [
      "colors",
      "numbers",
      "family",
      "animals",
      "emotions",
      "school",
      "food",
      "actions",
      "house",
    ],
    curriculum: {
      summary: "Move from word recognition to short writing and broader everyday vocabulary.",
      focus: [
        "Practice typing English words from a meaning cue.",
        "Begin translating short sentences with fixed templates.",
      ],
      skills: [
        "Type classic food, clothing, and home-room words without spelling mistakes.",
        "Two-way meaning practice for sentences of 3–4 words.",
      ],
      grammar: [
        "Strengthen to be (am/is/are) and pronouns.",
        "Noun plurals and simple question patterns.",
      ],
      vocabulary: [
        "Food and drink, clothes, community places, and classroom life.",
        "Actions (run, jump, read) and rooms of the house.",
      ],
      benchmark: [
        "Writing accuracy of 75% or higher in writing mode.",
        "10 successful two-way meaning drills in a row each week.",
      ],
    },
  },
  g3: {
    key: "g3",
    name: "Grade 3",
    stage: "Early literacy stage",
    topics: ["vocabulary", "grammar", "translation", "sentences", "writing", "mixed"],
    wordLists: [
      "animals",
      "colors",
      "numbers",
      "family",
      "body",
      "food",
      "school",
      "weather",
      "sports",
      "actions",
      "house",
    ],
    curriculum: {
      summary: "Connect vocabulary, grammar, and meaning cues to start building active sentences.",
      focus: [
        "Translate short sentences with correct punctuation.",
        "Complete sentences using verb agreement and context clues.",
      ],
      skills: [
        "Build Present Simple sentences from familiar templates.",
        "Follow clues (subject, time) to choose the right word.",
      ],
      grammar: [
        "Present Simple in positive, negative, and question forms.",
        "Basic adjectives, articles (a/an/the), and place prepositions (in/on/under).",
      ],
      vocabulary: [
        "Daily routines, school, hobbies, sports, and weather.",
        "Body parts and expanded home rooms.",
      ],
      benchmark: [
        "80% accuracy or higher in grammar or sentence mode.",
        "Write at least 5 short English sentences in extended writing mode.",
      ],
    },
  },
  g4: {
    key: "g4",
    name: "Grade 4",
    stage: "Developing literacy stage",
    topics: ["vocabulary", "grammar", "translation", "sentences", "writing", "mixed"],
    wordLists: [
      "animals",
      "family",
      "body",
      "food",
      "school",
      "weather",
      "sports",
      "travel",
      "community",
      "environment",
      "emotions",
    ],
    curriculum: {
      summary:
        "Strengthen tense awareness (Present Simple / Continuous) and expand topics to community, nature, and travel.",
      focus: [
        "Choose between Present Simple and Present Continuous using time clues.",
        "Practice writing a short paragraph (3–4 sentences) in typing mode.",
      ],
      skills: [
        "Two-way meaning practice for sentences with two actions.",
        "Handle more complex multiple-choice items that mix vocabulary.",
      ],
      grammar: [
        "Present Simple versus Present Continuous.",
        "some/any, much/many, possessive pronouns, and adverbs (slowly/quickly).",
      ],
      vocabulary: [
        "City places, travel, holidays, and community activities.",
        "Expanded feelings, environment, and nature.",
      ],
      benchmark: [
        "At least 85% grammar accuracy in grammar mode.",
        "Complete a daily challenge (20 questions) at least twice a week.",
      ],
    },
  },
  g5: {
    key: "g5",
    name: "Grade 5",
    stage: "Expanded literacy stage",
    topics: ["vocabulary", "grammar", "translation", "sentences", "writing", "mixed"],
    wordLists: [
      "animals",
      "family",
      "food",
      "school",
      "sports",
      "travel",
      "environment",
      "health",
      "technology",
      "emotions",
    ],
    curriculum: {
      summary:
        "Deepen past and advanced present usage while expanding into technology and health topics.",
      focus: [
        "Translate and complete Past Simple and Future (will / going to) sentences.",
        "Practice free writing totaling about 2 short paragraphs.",
      ],
      skills: [
        "Cross-check vocabulary in technology, health, and travel.",
        "Decide quickly among modals can / must / have to in choice questions.",
      ],
      grammar: [
        "Past Simple (regular + common irregulars).",
        "Basic modals, Future (will / going to), and comparatives.",
      ],
      vocabulary: [
        "Trips and transport, health and the human body, technology and the web.",
        "Environment and more advanced feelings.",
      ],
      benchmark: [
        "Keep at least 85% accuracy in mixed mode.",
        "Stop 3 repeating mistakes through focused practice.",
      ],
    },
  },
  g6: {
    key: "g6",
    name: "Grade 6",
    stage: "Advanced stage",
    topics: ["vocabulary", "grammar", "translation", "sentences", "writing", "mixed"],
    wordLists: [
      "animals",
      "travel",
      "environment",
      "health",
      "technology",
      "global_issues",
      "culture",
      "history",
      "community",
      "emotions",
    ],
    curriculum: {
      summary:
        "Bridge toward middle school: complex sentences, mixed tenses, and precise meaning work on global topics.",
      focus: [
        "Choose the right tense (Past Continuous, basic Present Perfect, Future).",
        "Use advanced vocabulary on sustainability, culture, and technology.",
      ],
      skills: [
        "Two-way meaning practice for sentences of 8–10 words.",
        "Write short opinion claims in typing mode with hints.",
      ],
      grammar: [
        "Past Continuous beside Past Simple, and an introduction to Present Perfect.",
        "Conditionals type 0/1 and modals should / might / could.",
      ],
      vocabulary: [
        "Global issues, environment and sustainability, culture and digital identity.",
        "Technology, history, community, and complex feelings.",
      ],
      benchmark: [
        "90% accuracy or higher in grammar or sentence mode across 3 practices in a row.",
      ],
    },
  },
};
