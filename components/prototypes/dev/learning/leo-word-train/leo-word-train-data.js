/** @typedef {'easy' || 'medium' || 'hard'} DifficultyId */

/**
 * @typedef {{ id: string, hint?: string, kind: 'fixed'|'slot', content?: string, emoji?: string }} TrainCarriage
 * @typedef {{ id: string, label: string, emoji?: string }} TrainPiece
 * @typedef {{
 *   id: string,
 *   type: string,
 *   stationLabel: string,
 *   missionHe: string,
 *   emoji?: string,
 *   carriages: TrainCarriage[],
 *   pieces: TrainPiece[],
 *   solution: Record<string, string>,
 * }} TrainTask
 */

import { gamePackCopy } from "../../../../../lib/games/game-pack-copy.js";
import { LANGUAGE_PROTOTYPE_TASKS, shuffleTasks } from "../shared/language-prototype-config.js";

/** @param {string[]} labels @param {number} extra */
function letterPieces(labels, extra = 3) {
  const pool = "abcdefghijklmnopqrstuvwxyz".split("");
  const distractors = shuffleTasks(pool.filter((c) => !labels.includes(c))).slice(0, extra);
  return shuffleTasks([...labels, ...distractors]).map((label, i) => ({ id: `p${i}-${label}`, label }));
}

/** @param {string} word @param {number} extra */
function wordPieces(word, extra = 2) {
  const extras = ["run", "milk", "book", "hat", "bag", "red", "blue", "cat", "dog"].filter(
    (w) => w !== word && !word.includes(w),
  );
  return shuffleTasks([word, ...shuffleTasks(extras).slice(0, extra)]).map((label, i) => ({
    id: `w${i}-${label}`,
    label,
  }));
}

/** @param {string} word */
function buildWordTask(id, stationLabel, missionHe, emoji, word) {
  const letters = word.split("");
  return {
    id,
    type: "build_word",
    stationLabel,
    missionHe,
    emoji,
    carriages: letters.map((_, i) => ({ id: `s${i}`, kind: /** @type {'slot'} */ ("slot") })),
    pieces: letterPieces(letters, 4),
    solution: Object.fromEntries(letters.map((ch, i) => [`s${i}`, ch])),
  };
}

/** @param {string} word @param {number[]} blankIdx */
function fillWordTask(id, stationLabel, missionHe, word, blankIdx, emoji) {
  const letters = word.split("");
  return {
    id,
    type: "fill_gaps",
    stationLabel,
    missionHe,
    emoji,
    carriages: letters.map((ch, i) =>
      blankIdx.includes(i)
        ? { id: `s${i}`, kind: /** @type {'slot'} */ ("slot") }
        : { id: `s${i}`, kind: /** @type {'fixed'} */ ("fixed"), content: ch },
    ),
    pieces: letterPieces(
      blankIdx.map((i) => letters[i]),
      4,
    ),
    solution: Object.fromEntries(blankIdx.map((i) => [`s${i}`, letters[i]])),
  };
}

/** @param {string} letter */
function upperToLowerTask(id, stationLabel, letter) {
  const upper = letter.toUpperCase();
  const lower = letter.toLowerCase();
  return {
    id,
    type: "upper_to_lower",
    stationLabel,
    missionHe: `Load the lowercase letter next to ${upper}`,
    carriages: [
      { id: "ref", kind: /** @type {'fixed'} */ ("fixed"), content: upper },
      { id: "slot", kind: /** @type {'slot'} */ ("slot") },
    ],
    pieces: letterPieces([lower], 3),
    solution: { slot: lower },
  };
}

/** @param {string} letter */
function lowerToUpperTask(id, stationLabel, letter) {
  const upper = letter.toUpperCase();
  const lower = letter.toLowerCase();
  return {
    id,
    type: "lower_to_upper",
    stationLabel,
    missionHe: `Load the uppercase letter next to ${lower}`,
    carriages: [
      { id: "ref", kind: /** @type {'fixed'} */ ("fixed"), content: lower },
      { id: "slot", kind: /** @type {'slot'} */ ("slot") },
    ],
    pieces: letterPieces([upper], 3),
    solution: { slot: upper },
  };
}

/** @param {string} word 3-letter word */
function firstLetterTask(id, stationLabel, word) {
  const letter = word[0].toLowerCase();
  return {
    id,
    type: "first_letter",
    stationLabel,
    missionHe: `Which letter starts ${word}?`,
    carriages: [
      { id: "word", kind: /** @type {'fixed'} */ ("fixed"), content: word },
      { id: "slot", kind: /** @type {'slot'} */ ("slot") },
    ],
    pieces: letterPieces([letter], 3),
    solution: { slot: letter },
  };
}

/** @param {string} word 3-letter word @param {number} blankIdx */
function oneMissingLetterTask(id, stationLabel, word, blankIdx) {
  const letters = word.split("");
  if (letters.length !== 3 || blankIdx < 0 || blankIdx > 2) {
    throw new Error(`easy gap word must be 3 letters: ${word}`);
  }
  return {
    id,
    type: "one_gap",
    stationLabel,
    missionHe: "Fill in one missing letter in the carriage",
    carriages: letters.map((ch, i) =>
      i === blankIdx
        ? { id: `s${i}`, kind: /** @type {'slot'} */ ("slot") }
        : { id: `s${i}`, kind: /** @type {'fixed'} */ ("fixed"), content: ch },
    ),
    pieces: letterPieces([letters[blankIdx]], 4),
    solution: { [`s${blankIdx}`]: letters[blankIdx] },
  };
}

/** @type {Record<DifficultyId, TrainTask[]>} */
export const WORD_TRAIN_TASKS = {
  easy: [
    upperToLowerTask("e1", "Station 1", "B"),
    upperToLowerTask("e2", "Station 2", "A"),
    upperToLowerTask("e3", "Station 3", "M"),
    lowerToUpperTask("e4", "Station 4", "b"),
    upperToLowerTask("e5", "Station 5", "T"),
    firstLetterTask("e6", "Station 6", "sun"),
    firstLetterTask("e7", "Station 7", "dog"),
    firstLetterTask("e8", "Station 8", "cat"),
    oneMissingLetterTask("e9", "Station 9", "dog", 1),
    oneMissingLetterTask("e10", "Station 10", "cat", 1),
  ],
  medium: [
    buildWordTask("m1", "Station 1", "Build the word on the carriages", "🥛", "milk"),
    {
      id: "m2",
      type: "dual_phrase",
      stationLabel: "Station 2",
      missionHe: "Load two carriages: red + hat",
      carriages: [
        { id: "c1", kind: "slot", hint: "Color" },
        { id: "c2", kind: "slot", hint: "Object" },
      ],
      pieces: shuffleTasks([
        { id: "r1", label: "red" },
        { id: "h1", label: "hat" },
        { id: "x1", label: "blue" },
        { id: "x2", label: "bag" },
        { id: "x3", label: "book" },
      ]),
      solution: { c1: "red", c2: "hat" },
    },
    {
      id: "m3",
      type: "dual_phrase",
      stationLabel: "Station 3",
      missionHe: "Load two carriages: blue + bag",
      carriages: [
        { id: "c1", kind: "slot", hint: "Color" },
        { id: "c2", kind: "slot", hint: "Object" },
      ],
      pieces: shuffleTasks([
        { id: "pb1", label: "blue" },
        { id: "pb2", label: "bag" },
        { id: "px1", label: "red" },
        { id: "px2", label: "hat" },
        { id: "px3", label: "book" },
      ]),
      solution: { c1: "blue", c2: "bag" },
    },
    buildWordTask("m4", "Station 4", "Build the word school", "🏫", "school"),
    fillWordTask("m5", "Station 5", "Complete shirt — missing letter", "shirt", [2], "👕"),
    buildWordTask("m6", "Station 6", "Build the word book", "📚", "book"),
    buildWordTask("m7", "Station 7", "Build the word green", "🟢", "green"),
    buildWordTask("m8", "Station 8", "Load the word — chair", "🪑", "chair"),
    buildWordTask("m9", "Station 9", "Build the word desk", "📝", "desk"),
    buildWordTask("m10", "Station 10", "Load the word — water", "💧", "water"),
  ],
  hard: [
    {
      id: "h1",
      type: "word_order",
      stationLabel: "Station 1",
      missionHe: "Order the words — I / like / pizza",
      carriages: [
        { id: "w0", kind: "slot", hint: "1" },
        { id: "w1", kind: "slot", hint: "2" },
        { id: "w2", kind: "slot", hint: "3" },
      ],
      pieces: shuffleTasks([
        { id: "a", label: "I" },
        { id: "b", label: "like" },
        { id: "c", label: "pizza" },
        { id: "d", label: "milk" },
      ]),
      solution: { w0: "I", w1: "like", w2: "pizza" },
    },
    {
      id: "h2",
      type: "word_order",
      stationLabel: "Station 2",
      missionHe: "Order the words — The / dog / runs",
      carriages: [
        { id: "w0", kind: "slot", hint: "1" },
        { id: "w1", kind: "slot", hint: "2" },
        { id: "w2", kind: "slot", hint: "3" },
      ],
      pieces: shuffleTasks([
        { id: "a", label: "The" },
        { id: "b", label: "dog" },
        { id: "c", label: "runs" },
        { id: "d", label: "cat" },
      ]),
      solution: { w0: "The", w1: "dog", w2: "runs" },
    },
    {
      id: "h3",
      type: "sentence_gap",
      stationLabel: "Station 3",
      missionHe: "Load the missing word — I drink ___",
      carriages: [
        { id: "p1", kind: "fixed", content: "I" },
        { id: "p2", kind: "fixed", content: "drink" },
        { id: "gap", kind: "slot" },
      ],
      pieces: wordPieces("milk", 3),
      solution: { gap: "milk" },
    },
    {
      id: "h4",
      type: "sentence_gap",
      stationLabel: "Station 4",
      missionHe: "Load the missing word — The cat is ___",
      carriages: [
        { id: "p1", kind: "fixed", content: "The" },
        { id: "p2", kind: "fixed", content: "cat" },
        { id: "p3", kind: "fixed", content: "is" },
        { id: "gap", kind: "slot" },
      ],
      pieces: wordPieces("small", 3),
      solution: { gap: "small" },
    },
    {
      id: "h5",
      type: "word_order",
      stationLabel: "Station 5",
      missionHe: "Order the words — We / go / to / school",
      carriages: [
        { id: "w0", kind: "slot", hint: "1" },
        { id: "w1", kind: "slot", hint: "2" },
        { id: "w2", kind: "slot", hint: "3" },
        { id: "w3", kind: "slot", hint: "4" },
      ],
      pieces: shuffleTasks([
        { id: "a", label: "We" },
        { id: "b", label: "go" },
        { id: "c", label: "to" },
        { id: "d", label: "school" },
        { id: "e", label: "home" },
      ]),
      solution: { w0: "We", w1: "go", w2: "to", w3: "school" },
    },
    {
      id: "h6",
      type: "word_order",
      stationLabel: "Station 6",
      missionHe: "Order the words — She / likes / red",
      carriages: [
        { id: "w0", kind: "slot", hint: "1" },
        { id: "w1", kind: "slot", hint: "2" },
        { id: "w2", kind: "slot", hint: "3" },
      ],
      pieces: shuffleTasks([
        { id: "a", label: "She" },
        { id: "b", label: "likes" },
        { id: "c", label: "red" },
        { id: "d", label: "blue" },
      ]),
      solution: { w0: "She", w1: "likes", w2: "red" },
    },
    {
      id: "h7",
      type: "sentence_gap",
      stationLabel: "Station 7",
      missionHe: "Load the missing word — I ___ a cat",
      carriages: [
        { id: "p1", kind: "fixed", content: "I" },
        { id: "gap", kind: "slot" },
        { id: "p2", kind: "fixed", content: "a" },
        { id: "p3", kind: "fixed", content: "cat" },
      ],
      pieces: wordPieces("see", 3),
      solution: { gap: "see" },
    },
    {
      id: "h8",
      type: "sentence_gap",
      stationLabel: "Station 8",
      missionHe: gamePackCopy("components__prototypes__dev__learning__leo-word-train__leo-word-train-data", "the_apple_is"),
      carriages: [
        { id: "p1", kind: "fixed", content: "The" },
        { id: "p2", kind: "fixed", content: "apple" },
        { id: "p3", kind: "fixed", content: "is" },
        { id: "gap", kind: "slot" },
      ],
      pieces: wordPieces("red", 3),
      solution: { gap: "red" },
    },
    {
      id: "h9",
      type: "word_order",
      stationLabel: "Station 9",
      missionHe: "Order the words — I / read / a / book",
      carriages: [
        { id: "w0", kind: "slot", hint: "1" },
        { id: "w1", kind: "slot", hint: "2" },
        { id: "w2", kind: "slot", hint: "3" },
        { id: "w3", kind: "slot", hint: "4" },
      ],
      pieces: shuffleTasks([
        { id: "a", label: "I" },
        { id: "b", label: "read" },
        { id: "c", label: "a" },
        { id: "d", label: "book" },
        { id: "e", label: "milk" },
      ]),
      solution: { w0: "I", w1: "read", w2: "a", w3: "book" },
    },
    {
      id: "h10",
      type: "sentence_gap",
      stationLabel: "Station 10",
      missionHe: "I am hungry — load the linking word",
      carriages: [
        { id: "p1", kind: "fixed", content: "I" },
        { id: "p2", kind: "fixed", content: "want" },
        { id: "gap", kind: "slot" },
      ],
      pieces: shuffleTasks([
        { id: "a", label: "food" },
        { id: "b", label: "sleep" },
        { id: "c", label: "rain" },
        { id: "d", label: "run" },
      ]),
      solution: { gap: "food" },
    },
  ],
};

/** @param {TrainTask} task @param {Record<string, string>} fills */
export function validateTrainTask(task, fills) {
  for (const [carriageId, expected] of Object.entries(task.solution)) {
    if ((fills[carriageId] ?? "").toLowerCase() !== expected.toLowerCase()) return false;
  }
  const slotIds = task.carriages.filter((c) => c.kind === "slot").map((c) => c.id);
  for (const id of slotIds) {
    if (!fills[id]) return false;
  }
  return true;
}

export function trainFeedback(ok) {
  return ok ? "🚂 The train leaves the station!" : "The carriages shake — check again";
}

/** @param {DifficultyId} difficulty */
export function pickWordTrainTasks(difficulty) {
  const pool = WORD_TRAIN_TASKS[difficulty] ?? WORD_TRAIN_TASKS.easy;
  return shuffleTasks(pool).slice(0, LANGUAGE_PROTOTYPE_TASKS);
}
