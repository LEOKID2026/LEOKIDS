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

import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import { planLanguageSession } from "../../../lib/educational-games/language-session-planner.js";
import {
  LANGUAGE_MIN_POOL_PER_LEVEL,
  LANGUAGE_SESSION_TASKS,
  shuffleLanguageTasks,
} from "../../../lib/educational-games/language-game-config.js";

const GRADE_BANDS = {
  easy: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "grades_1_2"),
  medium: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "grades_3_4"),
  hard: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "grades_5_6"),
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
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "starting_letter_in_place"),
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
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "missing_letter_filled_in"),
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
    mission: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "drag_the_word_that_matches_the_picture"),
    emoji,
    zones: [{ id: "z1", label: "Evidence", icon: "📌" }],
    pieces,
    solution: { z1: correctId },
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "word_matches_the_picture"),
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
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "right_word_for_the_folder"),
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
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "word_completes_the_sentence"),
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
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "correct_plural_form"),
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
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "correct_female_form"),
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
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "word_from_the_same_family"),
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
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "meaning_matches"),
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
    mission: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "put_events_in_order_drag_to_the_board"),
    passage,
    zones,
    pieces,
    solution,
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "event_order_is_correct"),
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
    mission: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "drag_a_title_that_fits_the_passage"),
    passage,
    zones: [{ id: "zTitle", label: "Case title", icon: "📋" }],
    pieces,
    solution: { zTitle: correctId },
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "title_fits_the_passage"),
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
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "correct_conclusion_from_the_passage"),
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
    feedbackShort: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "meaning_fits_the_passage"),
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
      sentence: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "the_boy_water"),
      answer: "drinks",
      options: ["drinks", "runs", "blue", "table"],
    },
    {
      taskType: "fill_sentence",
      sentence: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "the_dog_on_the_floor"),
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
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "dan_left_the_house_he_walked_to_the_park_and_played_then_he_came_home_fo"),
      labels: ["Left the house", "Played in the park", "Came home for lunch", "Went to sleep"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "rain_fell_the_kids_played_inside_after_the_rain_a_rainbow_appeared"),
      labels: ["Rain fell", "Played inside", "Rainbow appeared", "Went to the beach"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "mia_woke_up_in_the_morning_she_ate_breakfast_she_packed_her_bag_and_went"),
      labels: ["Woke up", "Ate breakfast", "Went to school", "Went swimming"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "jo_drank_water_he_got_dressed_and_went_out_he_rode_his_bike_to_the_park"),
      labels: ["Drank water", "Went outside", "Rode to the park", "Bought shoes"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "mom_turned_on_the_oven_she_baked_a_cake_everyone_ate_together"),
      labels: ["Turned on oven", "Baked a cake", gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "ate_together"), "Went shopping"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "the_sun_set_stars_came_out_the_children_went_to_bed"),
      labels: ["Sun set", "Stars came out", "Went to bed", "Went hiking"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "noa_opened_a_book_she_read_two_pages_she_closed_it_and_put_it_on_the_she"),
      labels: ["Opened a book", "Read pages", "Put it on shelf", "Drew a picture"],
      answerIds: ["p1", "p2", "p3"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "the_wind_blew_hard_leaves_fell_then_light_rain_came_down"),
      labels: ["Wind blew", "Leaves fell", "Rain came", "Sun came out"],
      answerIds: ["p1", "p2", "p3"],
    },
  ];
  events.forEach((spec, i) => {
    tasks.push(eventOrderTask(`wd-h-eo-${i + 1}`, `Case #${i + 1}`, spec));
  });

  const titles = [
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "mia_loved_to_read_books_every_evening_she_sat_in_a_corner_with_a_new_boo"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "mia_loves_to_read"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "mia_loves_to_read"), "Mia goes to the beach", "Mia buys shoes", "A rainy day"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "jo_learned_to_ride_a_bike_at_first_he_fell_but_he_kept_trying_in_the_end"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "jo_learns_to_ride"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "jo_learns_to_ride"), "Jo buys clothes", "Jo eats lunch", "A forest hike"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "heavy_rain_fell_the_kids_played_board_games_after_the_rain_a_rainbow_app"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "rainy_day_and_games"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "rainy_day_and_games"), "Forest hike", "Shopping trip", "Swimming lesson"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "dan_took_care_of_the_garden_he_watered_flowers_and_pulled_weeds_the_gard"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "dan_in_the_garden"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "dan_in_the_garden"), "Dan at the beach", "Dan at the store", "Dan at school"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "the_family_made_pizza_together_each_person_picked_a_topping_they_ate_hap"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "family_pizza_night"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "family_pizza_night"), "Morning at school", "Mountain hike", "Shopping trip"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "noa_learned_a_new_song_she_practiced_again_and_again_she_sang_in_front_o"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "noa_learns_a_song"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "noa_learns_a_song"), "Noa buys a clock", "Noa dances", "Noa sleeps"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "the_cat_slept_on_the_sofa_it_woke_up_ate_and_went_back_to_sleep_it_was_a"),
      answer: "A day with the cat",
      options: ["A day with the cat", "A day with the dog", "A day at the beach", "A day at the store"],
    },
  ];
  titles.forEach((spec, i) => {
    tasks.push(titleStampTask(`wd-h-ts-${i + 1}`, `Case #${i + 9}`, spec));
  });

  const conclusions = [
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "dan_left_the_house_with_a_bag_he_walked_to_the_park_and_played_with_frie"),
      question: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "why_did_dan_come_home"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "for_lunch"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "for_lunch"), "To sleep", "To buy shoes", "To swim"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "heavy_rain_fell_the_kids_stayed_inside_and_played_board_games"),
      question: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "what_can_we_learn_from_the_passage"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "they_stayed_inside_because_of_rain"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "they_stayed_inside_because_of_rain"), "They swam in the sea", "They flew abroad", "They bought bikes"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "grandma_asked_for_help_at_the_market_noa_went_with_her_and_helped_carry_"),
      question: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "who_helped_grandma"),
      answer: "Noa",
      options: ["Noa", "The dog", "The neighbor", "Nobody"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "jo_fell_off_his_bike_but_kept_practicing_until_he_could_ride_on_his_own"),
      question: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "what_did_we_learn_about_jo"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "he_did_not_give_up"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "he_did_not_give_up"), "He sold his bike", "He stayed home", "He was afraid of water"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "the_teacher_told_a_story_the_children_listened_quietly_at_the_end_everyo"),
      question: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "how_did_the_children_react"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "they_clapped"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "they_clapped"), "They cried", "They went outside", "They fell asleep"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "the_dog_waited_by_the_door_when_dan_came_back_its_tail_wagged_with_joy"),
      question: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "how_did_the_dog_feel"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "happy_to_see_dan"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "happy_to_see_dan"), "Angry", "Tired", "Very hungry"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "mom_made_soup_everyone_sat_at_the_table_they_ate_together_warmly"),
      question: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "what_did_the_family_do"),
      answer: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "ate_together"),
      options: [gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "ate_together"), "Went hiking", "Watched TV", "Played outside"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "the_kids_planted_a_pot_they_watered_it_every_day_after_two_weeks_a_flowe"),
      question: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "what_happened_to_the_pot"),
      answer: "A flower grew",
      options: ["A flower grew", "It broke", "It disappeared", "It dried out"],
    },
  ];
  conclusions.forEach((spec, i) => {
    tasks.push(conclusionTask(`wd-h-co-${i + 1}`, `Case #${i + 16}`, spec));
  });

  const meaningPassages = [
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "jo_learned_to_ride_he_fell_but_kept_practicing_in_the_end_he_rode_on_his"),
      word: "practiced",
      answer: "tried again and again",
      options: ["tried again and again", "slept", "ate", "danced"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "the_girl_smiled_at_everyone_she_helped_a_friend_who_fell_everyone_liked_"),
      word: "kind",
      answer: "helps others",
      options: ["helps others", "cries", "yells", "runs away"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "he_looked_around_carefully_he_waited_before_crossing_the_street"),
      word: "careful",
      answer: "keeps safe",
      options: ["keeps safe", "runs fast", "yells", "sleeps"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "she_did_not_give_up_on_the_puzzle_she_tried_again_and_again_until_it_was"),
      word: "persisted",
      answer: "kept trying",
      options: ["kept trying", "gave up right away", "went to sleep", "ate lunch"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "he_shared_his_candy_with_everyone_he_did_not_keep_it_all_for_himself"),
      word: "shared",
      answer: "gave to others too",
      options: ["gave to others too", "ate it all", "threw it away", "hid it"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "she_listened_quietly_she_did_not_bother_her_friends"),
      word: "respectful",
      answer: "thinks of others",
      options: ["thinks of others", "yells", "runs away", "sleeps"],
    },
    {
      passage: gamePackCopy("components__educational-games__leo-word-detective__leo-word-detective-data", "he_cleaned_his_room_before_going_out_everything_was_in_its_place"),
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
