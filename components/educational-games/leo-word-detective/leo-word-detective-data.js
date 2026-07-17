/** @typedef {'easy' | 'medium' | 'hard'} DifficultyId */

/**
 * @typedef {{ id: string, label: string, sub?: string, icon?: string }} DetectiveZone
 * @typedef {{ id: string, label: string }} DetectivePiece
 * @typedef {{
 *   id: string,
 *   level: DifficultyId,
 *   taskType: string,
 *   type: string,
 *   prompt: string,
 *   caseLabel: string,
 *   mission: string,
 *   passage?: string,
 *   emoji?: string,
 *   zones: DetectiveZone[],
 *   pieces: DetectivePiece[],
 *   solution: Record<string, string>,
 *   correctAnswer: string,
 *   feedbackShort: string,
 *   gradeBand: string,
 *   difficultyWeight: number,
 * }} DetectiveTask
 */

import { planLanguageSession } from "../../../lib/educational-games/language-session-planner.js";
import {
  LANGUAGE_MIN_POOL_PER_LEVEL,
  LANGUAGE_SESSION_TASKS,
  shuffleLanguageTasks,
} from "../../../lib/educational-games/language-game-config.js";

const GRADE_BANDS = {
  easy: "Grades 1–2",
  medium: "Grades 3–4",
  hard: "Grades 5–6",
};

const EASY_TYPES = new Set(["letter_drop", "fill_gap", "image_word", "sort_letter"]);
const MEDIUM_TYPES = new Set(["fill_sentence", "sort_plural", "sort_gender", "meaning_word"]);
const HARD_TYPES = new Set(["event_order", "title_stamp", "conclusion", "meaning"]);

const MEANING_WORD_LEXICON = {
  happy: "feeling good",
  tired: "needs rest",
  hungry: "wants to eat",
  brave: "not afraid",
  generous: "gives to others",
  careful: "keeps safe",
  wet: "not dry",
};

const DIFFICULTY_WEIGHT = {
  letter_drop: 15,
  fill_gap: 22,
  image_word: 28,
  sort_letter: 32,
  fill_sentence: 45,
  sort_plural: 50,
  sort_gender: 52,
  word_family: 55,
  meaning_word: 58,
  event_order: 75,
  title_stamp: 80,
  conclusion: 85,
  meaning: 88,
};

const MAX_HARD_PASSAGE_SENTENCES = 3;
const MAX_EASY_MISSION_CHARS = 48;

/** @param {DetectivePiece[]} pieces */
function shufflePieces(pieces) {
  return shuffleLanguageTasks(pieces);
}

/** @param {DetectiveTask} task */
function taskCorrectAnswer(task) {
  return Object.entries(task.solution)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, pieceId]) => task.pieces.find((p) => p.id === pieceId)?.label ?? "")
    .filter(Boolean)
    .join("|");
}

/**
 * @param {DifficultyId} level
 * @param {string} taskType
 * @param {Omit<DetectiveTask, 'level'|'taskType'|'type'|'prompt'|'correctAnswer'|'gradeBand'|'difficultyWeight'> & { mission: string, pieces: DetectivePiece[] }} base
 */
function wrapDetectiveTask(level, taskType, base) {
  const task = {
    ...base,
    level,
    taskType,
    type: taskType,
    prompt: base.mission,
    gradeBand: GRADE_BANDS[level],
    difficultyWeight: DIFFICULTY_WEIGHT[taskType] ?? 50,
    feedbackShort: base.feedbackShort ?? "🔖 Case closed!",
  };
  return { ...task, correctAnswer: taskCorrectAnswer(task) };
}

/** @param {string} passage */
function countSentences(passage) {
  return passage
    .split(/[.!?]\s*/)
    .map((s) => s.trim())
    .filter(Boolean).length;
}

/** @param {{ word: string, emoji: string, letter: string, distractors: string[] }} spec */
function letterDropTask(id, caseLabel, spec) {
  const { word, emoji, letter, distractors } = spec;
  const pieces = shufflePieces([
    { id: "p1", label: letter },
    ...distractors.map((label, i) => ({ id: `d${i}`, label })),
  ]);
  return wrapDetectiveTask("easy", "letter_drop", {
    id,
    caseLabel,
    mission: `Drag the starting letter — ${word}`,
    emoji,
    zones: [{ id: "z1", label: "Starting letter", icon: "🔤" }],
    pieces,
    solution: { z1: "p1" },
    feedbackShort: "Starting letter in place!",
  });
}

/** @param {{ fragment: string, letter: string, distractors: string[] }} spec */
function fillGapTask(id, caseLabel, spec) {
  const { fragment, letter, distractors } = spec;
  const pieces = shufflePieces([
    { id: "p1", label: letter },
    ...distractors.map((label, i) => ({ id: `d${i}`, label })),
  ]);
  return wrapDetectiveTask("easy", "fill_gap", {
    id,
    caseLabel,
    mission: `Complete: ${fragment} — drag a letter`,
    zones: [{ id: "z1", label: "Missing letter", icon: "🧩" }],
    pieces,
    solution: { z1: "p1" },
    feedbackShort: "Missing letter filled in!",
  });
}

/** @param {{ emoji: string, answer: string, options: string[] }} spec */
function imageWordTask(id, caseLabel, spec) {
  const { emoji, answer, options } = spec;
  const pieces = shufflePieces(options.map((label, i) => ({ id: `p${i + 1}`, label })));
  const correctId = pieces.find((p) => p.label === answer)?.id ?? "p1";
  return wrapDetectiveTask("easy", "image_word", {
    id,
    caseLabel,
    mission: "Drag the word that matches the picture",
    emoji,
    zones: [{ id: "z1", label: "Evidence", icon: "📌" }],
    pieces,
    solution: { z1: correctId },
    feedbackShort: "Word matches the picture!",
  });
}

/** @param {{ letter: string, answer: string, options: string[] }} spec */
function sortLetterTask(id, caseLabel, spec) {
  const { letter, answer, options } = spec;
  const pieces = shufflePieces(options.map((label, i) => ({ id: `p${i + 1}`, label })));
  const correctId = pieces.find((p) => p.label === answer)?.id ?? "p1";
  return wrapDetectiveTask("easy", "sort_letter", {
    id,
    caseLabel,
    mission: `Drag a word that starts with ${letter}`,
    zones: [{ id: "zL", label: `Starts with ${letter}`, icon: "📁" }],
    pieces,
    solution: { zL: correctId },
    feedbackShort: "Right word for the folder!",
  });
}

/** @param {{ sentence: string, answer: string, options: string[] }} spec */
function fillSentenceTask(id, caseLabel, spec) {
  const { sentence, answer, options } = spec;
  const pieces = shufflePieces(options.map((label, i) => ({ id: `p${i + 1}`, label })));
  const correctId = pieces.find((p) => p.label === answer)?.id ?? "p1";
  return wrapDetectiveTask("medium", "fill_sentence", {
    id,
    caseLabel,
    mission: `Drag the missing word: ${sentence}`,
    zones: [{ id: "z1", label: "Gap in sentence", icon: "📝" }],
    pieces,
    solution: { z1: correctId },
    feedbackShort: "Word completes the sentence!",
  });
}

/** @param {{ base: string, answer: string, options: string[] }} spec */
function sortPluralTask(id, caseLabel, spec) {
  const { base, answer, options } = spec;
  const pieces = shufflePieces(options.map((label, i) => ({ id: `p${i + 1}`, label })));
  const correctId = pieces.find((p) => p.label === answer)?.id ?? "p1";
  return wrapDetectiveTask("medium", "sort_plural", {
    id,
    caseLabel,
    mission: `Drag the plural of "${base}"`,
    zones: [{ id: "zPlural", label: "Plural", icon: "📁" }],
    pieces,
    solution: { zPlural: correctId },
    feedbackShort: "Correct plural form!",
  });
}

/** @param {{ base: string, answer: string, options: string[] }} spec */
function sortGenderTask(id, caseLabel, spec) {
  const { base, answer, options } = spec;
  const pieces = shufflePieces(options.map((label, i) => ({ id: `p${i + 1}`, label })));
  const correctId = pieces.find((p) => p.label === answer)?.id ?? "p1";
  return wrapDetectiveTask("medium", "sort_gender", {
    id,
    caseLabel,
    mission: `Drag the female form of "${base}"`,
    zones: [{ id: "zFem", label: "Female form", icon: "📁" }],
    pieces,
    solution: { zFem: correctId },
    feedbackShort: "Correct female form!",
  });
}

/** @param {{ root: string, answer: string, options: string[] }} spec */
function wordFamilyTask(id, caseLabel, spec) {
  const { root, answer, options } = spec;
  const pieces = shufflePieces(options.map((label, i) => ({ id: `p${i + 1}`, label })));
  const correctId = pieces.find((p) => p.label === answer)?.id ?? "p1";
  return wrapDetectiveTask("medium", "word_family", {
    id,
    caseLabel,
    mission: `Drag a word from the "${root}" family`,
    zones: [{ id: "zFam", label: `${root} family`, icon: "🧬" }],
    pieces,
    solution: { zFam: correctId },
    feedbackShort: "Word from the same family!",
  });
}

/** @param {{ word: string, answer: string, options: string[] }} spec */
function meaningWordTask(id, caseLabel, spec) {
  const { word, answer, options } = spec;
  const pieces = shufflePieces(options.map((label, i) => ({ id: `p${i + 1}`, label })));
  const correctId = pieces.find((p) => p.label === answer)?.id ?? "p1";
  return wrapDetectiveTask("medium", "meaning_word", {
    id,
    caseLabel,
    mission: `What does "${word}" mean?`,
    zones: [{ id: "z1", label: "Meaning", icon: "📖" }],
    pieces,
    solution: { z1: correctId },
    feedbackShort: "Meaning matches!",
  });
}

/** @param {{ passage: string, labels: string[], answerIds: string[] }} spec */
function eventOrderTask(id, caseLabel, spec) {
  const { passage, labels, answerIds } = spec;
  const pieces = shufflePieces(labels.map((label, i) => ({ id: `p${i + 1}`, label })));
  const zones = [
    { id: "z0", label: "First", icon: "1️⃣" },
    { id: "z1", label: "Next", icon: "2️⃣" },
    { id: "z2", label: "Last", icon: "3️⃣" },
  ];
  const solution = Object.fromEntries(zones.map((z, i) => [z.id, answerIds[i]]));
  return wrapDetectiveTask("hard", "event_order", {
    id,
    caseLabel,
    mission: "Put events in order — drag to the board",
    passage,
    zones,
    pieces,
    solution,
    feedbackShort: "Event order is correct!",
  });
}

/** @param {{ passage: string, answer: string, options: string[] }} spec */
function titleStampTask(id, caseLabel, spec) {
  const { passage, answer, options } = spec;
  const pieces = shufflePieces(options.map((label, i) => ({ id: `p${i + 1}`, label })));
  const correctId = pieces.find((p) => p.label === answer)?.id ?? "p1";
  return wrapDetectiveTask("hard", "title_stamp", {
    id,
    caseLabel,
    mission: "Drag a title that fits the passage",
    passage,
    zones: [{ id: "zTitle", label: "Case title", icon: "📋" }],
    pieces,
    solution: { zTitle: correctId },
    feedbackShort: "Title fits the passage!",
  });
}

/** @param {{ passage: string, question: string, answer: string, options: string[] }} spec */
function conclusionTask(id, caseLabel, spec) {
  const { passage, question, answer, options } = spec;
  const pieces = shufflePieces(options.map((label, i) => ({ id: `p${i + 1}`, label })));
  const correctId = pieces.find((p) => p.label === answer)?.id ?? "p1";
  return wrapDetectiveTask("hard", "conclusion", {
    id,
    caseLabel,
    mission: question,
    passage,
    zones: [{ id: "z1", label: "Conclusion", icon: "🎯" }],
    pieces,
    solution: { z1: correctId },
    feedbackShort: "Correct conclusion from the passage!",
  });
}

/** @param {{ passage: string, word: string, answer: string, options: string[] }} spec */
function meaningPassageTask(id, caseLabel, spec) {
  const { passage, word, answer, options } = spec;
  const pieces = shufflePieces(options.map((label, i) => ({ id: `p${i + 1}`, label })));
  const correctId = pieces.find((p) => p.label === answer)?.id ?? "p1";
  return wrapDetectiveTask("hard", "meaning", {
    id,
    caseLabel,
    mission: `Meaning of "${word}" from the passage`,
    passage,
    zones: [{ id: "z1", label: "Meaning", icon: "📖" }],
    pieces,
    solution: { z1: correctId },
    feedbackShort: "Meaning fits the passage!",
  });
}

/** @returns {DetectiveTask[]} */
function buildEasyDetectiveTasks() {
  /** @type {DetectiveTask[]} */
  const tasks = [];

  const letterDrops = [
    { word: "dog", emoji: "🐕", letter: "d", distractors: ["g", "o", "c"] },
    { word: "cat", emoji: "🐱", letter: "c", distractors: ["a", "t", "b"] },
    { word: "house", emoji: "🏠", letter: "h", distractors: ["o", "u", "s"] },
    { word: "book", emoji: "📚", letter: "b", distractors: ["o", "k", "m"] },
    { word: "tree", emoji: "🌳", letter: "t", distractors: ["r", "e", "n"] },
    { word: "water", emoji: "💧", letter: "w", distractors: ["a", "t", "s"] },
    { word: "sun", emoji: "☀️", letter: "s", distractors: ["u", "n", "r"] },
    { word: "flower", emoji: "🌸", letter: "f", distractors: ["l", "o", "w"] },
  ];
  letterDrops.forEach((spec, i) => {
    tasks.push(letterDropTask(`wd-e-ld-${i + 1}`, `Case #${i + 1}`, spec));
  });

  const fillGaps = [
    { fragment: "ta_le", letter: "b", distractors: ["g", "m", "n"] },
    { fragment: "wi_dow", letter: "n", distractors: ["r", "m", "l"] },
    { fragment: "bo_k", letter: "o", distractors: ["a", "e", "u"] },
    { fragment: "clou_", letter: "d", distractors: ["m", "l", "s"] },
    { fragment: "wate_", letter: "r", distractors: ["l", "s", "n"] },
    { fragment: "chai_", letter: "r", distractors: ["n", "m", "l"] },
    { fragment: "rai_", letter: "n", distractors: ["m", "l", "s"] },
    { fragment: "appl_", letter: "e", distractors: ["a", "i", "o"] },
  ];
  fillGaps.forEach((spec, i) => {
    tasks.push(fillGapTask(`wd-e-fg-${i + 1}`, `Case #${i + 9}`, spec));
  });

  const imageWords = [
    { emoji: "🏠", answer: "house", options: ["house", "chair", "cloud", "car"] },
    { emoji: "🍎", answer: "apple", options: ["apple", "table", "rain", "tree"] },
    { emoji: "✏️", answer: "pencil", options: ["pencil", "ball", "water", "cloud"] },
    { emoji: "🐟", answer: "fish", options: ["fish", "book", "branch", "wind"] },
    { emoji: "🎈", answer: "balloon", options: ["balloon", "table", "cloud", "key"] },
    { emoji: "🚌", answer: "bus", options: ["bus", "bike", "umbrella", "hat"] },
    { emoji: "🌙", answer: "moon", options: ["moon", "sun", "cloud", "star"] },
  ];
  imageWords.forEach((spec, i) => {
    tasks.push(imageWordTask(`wd-e-iw-${i + 1}`, `Case #${i + 17}`, spec));
  });

  const sortLetters = [
    { letter: "M", answer: "moon", options: ["moon", "dog", "king", "book"] },
    { letter: "B", answer: "book", options: ["book", "dog", "water", "cloud"] },
    { letter: "H", answer: "house", options: ["house", "tree", "rain", "sun"] },
    { letter: "C", answer: "chair", options: ["chair", "book", "cloud", "fish"] },
    { letter: "S", answer: "sun", options: ["sun", "cloud", "water", "flower"] },
    { letter: "T", answer: "tree", options: ["tree", "house", "book", "dog"] },
    { letter: "F", answer: "flower", options: ["flower", "water", "chair", "tree"] },
  ];
  sortLetters.forEach((spec, i) => {
    tasks.push(sortLetterTask(`wd-e-sl-${i + 1}`, `Case #${i + 24}`, spec));
  });

  return tasks;
}

/** @returns {DetectiveTask[]} */
function buildMediumDetectiveTasks() {
  /** @type {DetectiveTask[]} */
  const tasks = [];

  const fillSentences = [
    { sentence: "The girl ___ a book", answer: "reads", options: ["reads", "runs", "blue", "table"] },
    { sentence: "It rained — I took an ___", answer: "umbrella", options: ["umbrella", "ice cream", "ball", "book"] },
    { sentence: "It was cold — I wore a ___", answer: "coat", options: ["coat", "swimsuit", "sun hat", "sandals"] },
    { sentence: "Mom ___ dinner", answer: "cooks", options: ["cooks", "runs", "blue", "rain"] },
    { sentence: "The dog ___ in the yard", answer: "runs", options: ["runs", "green", "table", "book"] },
    { sentence: "The sun ___ outside", answer: "shines", options: ["shines", "drinks", "blue", "cloud"] },
  ];
  fillSentences.forEach((spec, i) => {
    tasks.push(fillSentenceTask(`wd-m-fs-${i + 1}`, `Case #${i + 1}`, spec));
  });

  const plurals = [
    { base: "child", answer: "children", options: ["children", "childs", "childes", "child"] },
    { base: "book", answer: "books", options: ["books", "bookes", "bookies", "book"] },
    { base: "dog", answer: "dogs", options: ["dogs", "doges", "dogies", "dog"] },
    { base: "flower", answer: "flowers", options: ["flowers", "flower", "floweries", "flowes"] },
    { base: "chair", answer: "chairs", options: ["chairs", "chair", "chaires", "chares"] },
    { base: "tree", answer: "trees", options: ["trees", "tree", "treees", "tres"] },
  ];
  plurals.forEach((spec, i) => {
    tasks.push(sortPluralTask(`wd-m-sp-${i + 1}`, `Case #${i + 7}`, spec));
  });

  const genders = [
    { base: "lion", answer: "lioness", options: ["lioness", "lions", "lionet", "lion"] },
    { base: "actor", answer: "actress", options: ["actress", "actors", "acted", "actor"] },
    { base: "hero", answer: "heroine", options: ["heroine", "heroes", "heroic", "hero"] },
    { base: "prince", answer: "princess", options: ["princess", "princes", "princely", "prince"] },
    { base: "tiger", answer: "tigress", options: ["tigress", "tigers", "tiger", "tigresses"] },
    { base: "waiter", answer: "waitress", options: ["waitress", "waiters", "waited", "waiter"] },
  ];
  genders.forEach((spec, i) => {
    tasks.push(sortGenderTask(`wd-m-sg-${i + 1}`, `Case #${i + 13}`, spec));
  });

  const mediumReplacements = [
    {
      taskType: "fill_sentence",
      sentence: "The boy ___ water",
      answer: "drinks",
      options: ["drinks", "runs", "blue", "table"],
    },
    {
      taskType: "fill_sentence",
      sentence: "The dog ___ on the floor",
      answer: "sleeps",
      options: ["sleeps", "runs", "green", "table"],
    },
    {
      taskType: "sort_plural",
      base: "apple",
      answer: "apples",
      options: ["apples", "apple", "applie", "applis"],
    },
    {
      taskType: "sort_plural",
      base: "box",
      answer: "boxes",
      options: ["boxes", "box", "boxs", "boxies"],
    },
    {
      taskType: "sort_gender",
      base: "host",
      answer: "hostess",
      options: ["hostess", "hosts", "hosted", "hosting"],
    },
    {
      taskType: "meaning_word",
      word: "wet",
      answer: "not dry",
      options: ["not dry", "very dry", "very hot", "too cold"],
    },
  ];
  mediumReplacements.forEach((entry, i) => {
    const id = `wd-m-wf-${i + 1}`;
    const caseLabel = `Case #${i + 19}`;
    const { taskType, ...spec } = entry;
    if (taskType === "fill_sentence") tasks.push(fillSentenceTask(id, caseLabel, spec));
    else if (taskType === "sort_plural") tasks.push(sortPluralTask(id, caseLabel, spec));
    else if (taskType === "sort_gender") tasks.push(sortGenderTask(id, caseLabel, spec));
    else if (taskType === "meaning_word") tasks.push(meaningWordTask(id, caseLabel, spec));
  });

  const meanings = [
    { word: "happy", answer: "feeling good", options: ["feeling good", "sleepy", "eating", "running"] },
    { word: "tired", answer: "needs rest", options: ["needs rest", "hungry", "happy", "jumping"] },
    { word: "hungry", answer: "wants to eat", options: ["wants to eat", "wants to sleep", "wants to dance", "wants to play"] },
    { word: "brave", answer: "not afraid", options: ["not afraid", "scared", "sleepy", "eating"] },
    { word: "generous", answer: "gives to others", options: ["gives to others", "takes everything", "crying", "laughing"] },
    { word: "careful", answer: "keeps safe", options: ["keeps safe", "falls down", "runs fast", "yells"] },
  ];
  meanings.forEach((spec, i) => {
    tasks.push(meaningWordTask(`wd-m-mw-${i + 1}`, `Case #${i + 25}`, spec));
  });

  return tasks;
}

/** @returns {DetectiveTask[]} */
function buildHardDetectiveTasks() {
  /** @type {DetectiveTask[]} */
  const tasks = [];

  const events = [
    {
      passage: "Dan left the house. He walked to the park and played. Then he came home for lunch.",
      labels: ["Left the house", "Played in the park", "Came home for lunch", "Went to sleep"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: "Rain fell. The kids played inside. After the rain, a rainbow appeared.",
      labels: ["Rain fell", "Played inside", "Rainbow appeared", "Went to the beach"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: "Mia woke up in the morning. She ate breakfast. She packed her bag and went to school.",
      labels: ["Woke up", "Ate breakfast", "Went to school", "Went swimming"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: "Jo drank water. He got dressed and went out. He rode his bike to the park.",
      labels: ["Drank water", "Went outside", "Rode to the park", "Bought shoes"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: "Mom turned on the oven. She baked a cake. Everyone ate together.",
      labels: ["Turned on oven", "Baked a cake", "Ate together", "Went shopping"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: "The sun set. Stars came out. The children went to bed.",
      labels: ["Sun set", "Stars came out", "Went to bed", "Went hiking"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: "Noa opened a book. She read two pages. She closed it and put it on the shelf.",
      labels: ["Opened a book", "Read pages", "Put it on shelf", "Drew a picture"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: "The wind blew hard. Leaves fell. Then light rain came down.",
      labels: ["Wind blew", "Leaves fell", "Rain came", "Sun came out"],
      answerIds: ["p1", "p2", "p3"],
    },
  ];
  events.forEach((spec, i) => {
    tasks.push(eventOrderTask(`wd-h-eo-${i + 1}`, `Case #${i + 1}`, spec));
  });

  const titles = [
    {
      passage: "Mia loved to read books. Every evening she sat in a corner with a new book.",
      answer: "Mia loves to read",
      options: ["Mia loves to read", "Mia goes to the beach", "Mia buys shoes", "A rainy day"],
    },
    {
      passage: "Jo learned to ride a bike. At first he fell, but he kept trying. In the end he rode alone.",
      answer: "Jo learns to ride",
      options: ["Jo learns to ride", "Jo buys clothes", "Jo eats lunch", "A forest hike"],
    },
    {
      passage: "Heavy rain fell. The kids played board games. After the rain, a rainbow appeared.",
      answer: "Rainy day and games",
      options: ["Rainy day and games", "Forest hike", "Shopping trip", "Swimming lesson"],
    },
    {
      passage: "Dan took care of the garden. He watered flowers and pulled weeds. The garden looked beautiful.",
      answer: "Dan in the garden",
      options: ["Dan in the garden", "Dan at the beach", "Dan at the store", "Dan at school"],
    },
    {
      passage: "The family made pizza together. Each person picked a topping. They ate happily together.",
      answer: "Family pizza night",
      options: ["Family pizza night", "Morning at school", "Mountain hike", "Shopping trip"],
    },
    {
      passage: "Noa learned a new song. She practiced again and again. She sang in front of the class.",
      answer: "Noa learns a song",
      options: ["Noa learns a song", "Noa buys a clock", "Noa dances", "Noa sleeps"],
    },
    {
      passage: "The cat slept on the sofa. It woke up, ate, and went back to sleep. It was a quiet day.",
      answer: "A day with the cat",
      options: ["A day with the cat", "A day with the dog", "A day at the beach", "A day at the store"],
    },
  ];
  titles.forEach((spec, i) => {
    tasks.push(titleStampTask(`wd-h-ts-${i + 1}`, `Case #${i + 9}`, spec));
  });

  const conclusions = [
    {
      passage: "Dan left the house with a bag. He walked to the park and played with friends. Then he came home for lunch.",
      question: "Why did Dan come home?",
      answer: "For lunch",
      options: ["For lunch", "To sleep", "To buy shoes", "To swim"],
    },
    {
      passage: "Heavy rain fell. The kids stayed inside and played board games.",
      question: "What can we learn from the passage?",
      answer: "They stayed inside because of rain",
      options: ["They stayed inside because of rain", "They swam in the sea", "They flew abroad", "They bought bikes"],
    },
    {
      passage: "Grandma asked for help at the market. Noa went with her and helped carry bags.",
      question: "Who helped Grandma?",
      answer: "Noa",
      options: ["Noa", "The dog", "The neighbor", "Nobody"],
    },
    {
      passage: "Jo fell off his bike but kept practicing until he could ride on his own.",
      question: "What did we learn about Jo?",
      answer: "He did not give up",
      options: ["He did not give up", "He sold his bike", "He stayed home", "He was afraid of water"],
    },
    {
      passage: "The teacher told a story. The children listened quietly. At the end everyone clapped.",
      question: "How did the children react?",
      answer: "They clapped",
      options: ["They clapped", "They cried", "They went outside", "They fell asleep"],
    },
    {
      passage: "The dog waited by the door. When Dan came back, its tail wagged with joy.",
      question: "How did the dog feel?",
      answer: "Happy to see Dan",
      options: ["Happy to see Dan", "Angry", "Tired", "Very hungry"],
    },
    {
      passage: "Mom made soup. Everyone sat at the table. They ate together warmly.",
      question: "What did the family do?",
      answer: "Ate together",
      options: ["Ate together", "Went hiking", "Watched TV", "Played outside"],
    },
    {
      passage: "The kids planted a pot. They watered it every day. After two weeks a flower grew.",
      question: "What happened to the pot?",
      answer: "A flower grew",
      options: ["A flower grew", "It broke", "It disappeared", "It dried out"],
    },
  ];
  conclusions.forEach((spec, i) => {
    tasks.push(conclusionTask(`wd-h-co-${i + 1}`, `Case #${i + 16}`, spec));
  });

  const meaningPassages = [
    {
      passage: "Jo learned to ride. He fell, but kept practicing. In the end he rode on his own.",
      word: "practiced",
      answer: "tried again and again",
      options: ["tried again and again", "slept", "ate", "danced"],
    },
    {
      passage: "The girl smiled at everyone. She helped a friend who fell. Everyone liked her.",
      word: "kind",
      answer: "helps others",
      options: ["helps others", "cries", "yells", "runs away"],
    },
    {
      passage: "He looked around carefully. He waited before crossing the street.",
      word: "careful",
      answer: "keeps safe",
      options: ["keeps safe", "runs fast", "yells", "sleeps"],
    },
    {
      passage: "She did not give up on the puzzle. She tried again and again until it was solved.",
      word: "persisted",
      answer: "kept trying",
      options: ["kept trying", "gave up right away", "went to sleep", "ate lunch"],
    },
    {
      passage: "He shared his candy with everyone. He did not keep it all for himself.",
      word: "shared",
      answer: "gave to others too",
      options: ["gave to others too", "ate it all", "threw it away", "hid it"],
    },
    {
      passage: "She listened quietly. She did not bother her friends.",
      word: "respectful",
      answer: "thinks of others",
      options: ["thinks of others", "yells", "runs away", "sleeps"],
    },
    {
      passage: "He cleaned his room before going out. Everything was in its place.",
      word: "tidy",
      answer: "keeps things in place",
      options: ["keeps things in place", "throws things around", "sleeps", "eats"],
    },
  ];
  meaningPassages.forEach((spec, i) => {
    tasks.push(meaningPassageTask(`wd-h-me-${i + 1}`, `Case #${i + 24}`, spec));
  });

  return tasks;
}

/** @type {Record<DifficultyId, DetectiveTask[]>} */
export const WORD_DETECTIVE_TASKS = {
  easy: buildEasyDetectiveTasks(),
  medium: buildMediumDetectiveTasks(),
  hard: buildHardDetectiveTasks(),
};

/** @param {DetectiveTask} task @param {Record<string, string>} zoneFills zoneId -> pieceId */
export function validateDetectiveTask(task, zoneFills) {
  for (const [zoneId, pieceId] of Object.entries(task.solution)) {
    if (zoneFills[zoneId] !== pieceId) return false;
  }
  return Object.keys(task.solution).every((z) => zoneFills[z]);
}

/** @param {boolean} ok */
export function detectiveFeedback(ok) {
  return ok ? "🔖 Case closed!" : "That evidence does not fit — try again";
}

/** @param {DifficultyId} difficulty */
export function pickWordDetectiveSession(difficulty) {
  const pool = WORD_DETECTIVE_TASKS[difficulty] ?? WORD_DETECTIVE_TASKS.easy;
  return planLanguageSession(pool, LANGUAGE_SESSION_TASKS);
}

/** @param {DetectiveTask[]} tasks */
function countByType(tasks) {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const task of tasks) {
    counts[task.taskType] = (counts[task.taskType] ?? 0) + 1;
  }
  return counts;
}

/** @returns {{ totals: Record<DifficultyId, number>, byType: Record<DifficultyId, Record<string, number>>, gaps: string[] }} */
export function auditWordDetectiveContent() {
  /** @type {string[]} */
  const gaps = [];
  /** @type {Record<DifficultyId, number>} */
  const totals = { easy: 0, medium: 0, hard: 0 };
  /** @type {Record<DifficultyId, Record<string, number>>} */
  const byType = { easy: {}, medium: {}, hard: {} };
  /** @type {Set<string>} */
  const seenIds = new Set();

  for (const level of /** @type {DifficultyId[]} */ (["easy", "medium", "hard"])) {
    const tasks = WORD_DETECTIVE_TASKS[level];
    totals[level] = tasks.length;
    byType[level] = countByType(tasks);

    if (tasks.length < LANGUAGE_MIN_POOL_PER_LEVEL) {
      gaps.push(`${level} level: ${tasks.length}/${LANGUAGE_MIN_POOL_PER_LEVEL} tasks`);
    }

    for (const task of tasks) {
      if (seenIds.has(task.id)) gaps.push(`${task.id}: duplicate id`);
      seenIds.add(task.id);

      if (task.level !== level) gaps.push(`${task.id}: level mismatch`);
      if (task.taskType !== task.type) gaps.push(`${task.id}: taskType/type mismatch`);
      if (task.prompt !== task.mission) gaps.push(`${task.id}: prompt/mission mismatch`);
      if (task.gradeBand !== GRADE_BANDS[level]) gaps.push(`${task.id}: wrong gradeBand`);
      if (!task.correctAnswer) gaps.push(`${task.id}: missing correctAnswer`);
      if (!task.feedbackShort) gaps.push(`${task.id}: missing feedbackShort`);

      const type = task.taskType;
      if (level === "easy") {
        if (!EASY_TYPES.has(type)) gaps.push(`${task.id}: type ${type} not allowed on easy`);
        if (task.passage) gaps.push(`${task.id}: passage not allowed on easy`);
        if (type === "fill_sentence") gaps.push(`${task.id}: fill_sentence not allowed on easy`);
        if (task.mission.length > MAX_EASY_MISSION_CHARS) {
          gaps.push(`${task.id}: mission too long for easy`);
        }
      }
      if (level === "medium") {
        if (!MEDIUM_TYPES.has(type)) gaps.push(`${task.id}: type ${type} not allowed on medium`);
        if (type === "word_family") gaps.push(`${task.id}: word_family not allowed on medium`);
        if (task.passage) gaps.push(`${task.id}: passage not allowed on medium`);
        if (type === "meaning_word") {
          const match = task.mission.match(/What does "(.+?)" mean\?/);
          if (match) {
            const word = match[1];
            const lexiconAnswer = MEANING_WORD_LEXICON[word];
            if (lexiconAnswer === undefined) {
              gaps.push(`${task.id}: "${word}" missing from MEANING_WORD_LEXICON`);
            } else if (task.correctAnswer !== lexiconAnswer) {
              gaps.push(`${task.id}: meaning of "${word}" (${task.correctAnswer}) does not match lexicon (${lexiconAnswer})`);
            }
          }
        }
      }
      if (level === "hard") {
        if (!HARD_TYPES.has(type)) gaps.push(`${task.id}: type ${type} not allowed on hard`);
        if (!task.passage) gaps.push(`${task.id}: missing passage on hard`);
        if (task.passage && countSentences(task.passage) > MAX_HARD_PASSAGE_SENTENCES) {
          gaps.push(`${task.id}: passage too long (${countSentences(task.passage)} sentences)`);
        }
      }
    }
  }

  return { totals, byType, gaps };
}
