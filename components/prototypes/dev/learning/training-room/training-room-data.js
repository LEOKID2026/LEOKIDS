/** @typedef {'easy' || 'medium' || 'hard'} DifficultyId */

/**
 * @typedef {Object} TrainingTask
 * @property {string} id
 * @property {string} prompt
 * @property {string[]} options
 * @property {number} correctIndex
 * @property {string} [emoji]
 */

/**
 * @typedef {Object} TrainingArea
 * @property {string} id
 * @property {string} title
 * @property {string} subtitle
 * @property {string} emoji
 * @property {Record<DifficultyId, TrainingTask[]>} tasks
 */

/** @type {TrainingArea[]} */
export const TRAINING_AREAS = [
  {
    id: "math",
    title: "Text",
    subtitle: "·",
    emoji: "✖️",
    tasks: {
      easy: [
        { id: "me1", prompt: "2 × 3?", options: ["5", "6", "8"], correctIndex: 1 },
        { id: "me2", prompt: "4 × 2?", options: ["6", "8", "10"], correctIndex: 1 },
        { id: "me3", prompt: "Text", options: ["7", "8", "9"], correctIndex: 1 },
        { id: "me4", prompt: "u: 2, 4, 6, ?", options: ["7", "8", "9"], correctIndex: 1 },
        { id: "me5", prompt: "5 × 1?", options: ["5", "6", "4"], correctIndex: 0 },
        { id: "me6", prompt: "3 × 3?", options: ["6", "9", "12"], correctIndex: 1 },
        { id: "me7", prompt: "Text", options: ["4", "6", "5"], correctIndex: 2 },
        { id: "me8", prompt: "10 ÷ 2?", options: ["4", "5", "6"], correctIndex: 1 },
      ],
      medium: [
        { id: "mm1", prompt: "6 × 4?", options: ["20", "24", "28"], correctIndex: 1 },
        { id: "mm2", prompt: "36 ÷ 6?", options: ["5", "6", "7"], correctIndex: 1 },
        { id: "mm3", prompt: "u: 5, 10, 15, ?", options: ["18", "20", "22"], correctIndex: 1 },
        { id: "mm4", prompt: "7 × 3?", options: ["21", "24", "18"], correctIndex: 0 },
        { id: "mm5", prompt: "Text", options: ["13", "14", "15"], correctIndex: 1 },
        { id: "mm6", prompt: "48 ÷ 8?", options: ["5", "6", "7"], correctIndex: 1 },
        { id: "mm7", prompt: "9 × 2?", options: ["16", "18", "20"], correctIndex: 1 },
        { id: "mm8", prompt: "u: 3, 6, 9, ?", options: ["10", "12", "14"], correctIndex: 1 },
      ],
      hard: [
        { id: "mh1", prompt: "12 × 5?", options: ["50", "60", "70"], correctIndex: 1 },
        { id: "mh2", prompt: "72 ÷ 9?", options: ["7", "8", "9"], correctIndex: 1 },
        { id: "mh3", prompt: "u: 4, 8, 12, ?", options: ["14", "16", "18"], correctIndex: 1 },
        { id: "mh4", prompt: "11 × 3?", options: ["33", "30", "36"], correctIndex: 0 },
        { id: "mh5", prompt: "Text", options: ["22", "24", "25"], correctIndex: 2 },
        { id: "mh6", prompt: "56 ÷ 7?", options: ["7", "8", "9"], correctIndex: 1 },
        { id: "mh7", prompt: "8 × 8?", options: ["56", "64", "72"], correctIndex: 1 },
        { id: "mh8", prompt: "u: 10, 20, 30, ?", options: ["35", "40", "45"], correctIndex: 1 },
      ],
    },
  },
  {
    id: "hebrew",
    title: "Text",
    subtitle: "·",
    emoji: "✏️",
    tasks: {
      easy: [
        { id: "he1", prompt: "Who to correct?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "he2", prompt: "___", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "he3", prompt: "Text", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "he4", prompt: "Who to correct?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "he5", prompt: "___", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "he6", prompt: "«»?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "he7", prompt: "Who to correct?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "he8", prompt: "___", options: ["Text", "Text", "Text"], correctIndex: 0 },
      ],
      medium: [
        { id: "hm1", prompt: "u : / /", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "hm2", prompt: "«»?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "hm3", prompt: "Text", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "hm4", prompt: "___", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "hm5", prompt: "u : / /", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "hm6", prompt: "«»?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "hm7", prompt: "___", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "hm8", prompt: ": « ___ »?", options: ["Text", "Text", "Text"], correctIndex: 1 },
      ],
      hard: [
        { id: "hh1", prompt: ": « »", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "hh2", prompt: "«»? « u »", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "hh3", prompt: ": « ___»?", options: ["Text", "Text", "Text"], correctIndex: 2 },
        { id: "hh4", prompt: "u: / /", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "hh5", prompt: ": « b »", options: ["b", "Text", "Text"], correctIndex: 0 },
        { id: "hh6", prompt: "? «o »", options: ["Text", "b", "Text"], correctIndex: 0 },
        { id: "hh7", prompt: ": «er »", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "hh8", prompt: "«»?", options: ["d", "if", "s"], correctIndex: 0 },
      ],
    },
  },
  {
    id: "english",
    title: "Text",
    subtitle: "·",
    emoji: "🔤",
    tasks: {
      easy: [
        { id: "ee1", prompt: ": 🐱 - u", options: ["cat", "dog", "sun"], correctIndex: 0, emoji: "🐱" },
        { id: "ee2", prompt: "-dog", options: ["d", "g", "o"], correctIndex: 0 },
        { id: "ee3", prompt: "b → ?", options: ["dog", "milk", "book"], correctIndex: 0 },
        { id: "ee4", prompt: ": ☀️", options: ["sun", "red", "bus"], correctIndex: 0, emoji: "☀️" },
        { id: "ee5", prompt: "-cat", options: ["c", "t", "a"], correctIndex: 0 },
        { id: "ee6", prompt: "→ ?", options: ["milk", "book", "chair"], correctIndex: 0 },
        { id: "ee7", prompt: ": 🔴", options: ["red", "green", "blue"], correctIndex: 0, emoji: "🔴" },
        { id: "ee8", prompt: ": c-a-t", options: ["cat", "car", "cap"], correctIndex: 0 },
      ],
      medium: [
        { id: "em1", prompt: ": m-i-l-k", options: ["milk", "mill", "silk"], correctIndex: 0 },
        { id: "em2", prompt: "→ ?", options: ["book", "green", "house"], correctIndex: 0 },
        { id: "em3", prompt: ": book ()", options: ["book", "milk", "chair"], correctIndex: 0 },
        { id: "em4", prompt: ": g-r-e-e-n", options: ["green", "great", "grin"], correctIndex: 0 },
        { id: "em5", prompt: "→ ?", options: ["chair", "table", "apple"], correctIndex: 0 },
        { id: "em6", prompt: ": 🍎", options: ["apple", "water", "school"], correctIndex: 0, emoji: "🍎" },
        { id: "em7", prompt: ": chair", options: ["table", "chair", "book"], correctIndex: 1 },
        { id: "em8", prompt: ": b-o-o-k", options: ["book", "boot", "look"], correctIndex: 0 },
      ],
      hard: [
        { id: "eh1", prompt: "u: I / like / milk", options: ["I like milk", "like I milk", "milk like I"], correctIndex: 0 },
        { id: "eh2", prompt: "I see a ___", options: ["dog", "table", "run"], correctIndex: 0 },
        { id: "eh3", prompt: "🐱 -", options: ["I see a cat", "I like milk", "I run fast"], correctIndex: 0, emoji: "🐱" },
        { id: "eh4", prompt: "u: I / see / a / cat", options: ["I see a cat", "see I a cat", "cat see I a"], correctIndex: 0 },
        { id: "eh5", prompt: "The apple is ___", options: ["red", "swim", "chair"], correctIndex: 0 },
        { id: "eh6", prompt: "📚", options: ["I read a book", "I eat apple", "I see sun"], correctIndex: 0, emoji: "📚" },
        { id: "eh7", prompt: "I ___ a cat", options: ["see", "milk", "chair"], correctIndex: 0 },
        { id: "eh8", prompt: "u: She / likes / red", options: ["She likes red", "likes She red", "red likes She"], correctIndex: 0 },
      ],
    },
  },
  {
    id: "geometry",
    title: "Text",
    subtitle: "· ·",
    emoji: "📐",
    tasks: {
      easy: [
        { id: "ge1", prompt: "u :", options: ["Text", "Text", "Text"], correctIndex: 0, emoji: "⭕" },
        { id: "ge2", prompt: "u :", options: ["Text", "Text", "Text"], correctIndex: 1, emoji: "🔺" },
        { id: "ge3", prompt: "Text", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "ge4", prompt: "u :", options: ["Text", "Text", "Text"], correctIndex: 0, emoji: "▭" },
        { id: "ge5", prompt: "u", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "ge6", prompt: "Text", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "ge7", prompt: "u :", options: ["Text", "Text", "Text"], correctIndex: 1, emoji: "⬜" },
        { id: "ge8", prompt: "Text", options: ["Text", "Text", "Text"], correctIndex: 0 },
      ],
      medium: [
        { id: "gm1", prompt: "Text", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "gm2", prompt: "? ( 2×3 )", options: ["4", "6", "8"], correctIndex: 1 },
        { id: "gm3", prompt: "2×2?", options: ["4", "6", "8"], correctIndex: 2 },
        { id: "gm4", prompt: "Text", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "gm5", prompt: "? (3×3 )", options: ["5", "6", "9"], correctIndex: 0 },
        { id: "gm6", prompt: "Text", options: ["8", "10", "12"], correctIndex: 1 },
        { id: "gm7", prompt: "…", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "gm8", prompt: "? (4×2)", options: ["6", "8", "10"], correctIndex: 1 },
      ],
      hard: [
        { id: "gh1", prompt: "90° - ?", options: [",", "Text", "Text"], correctIndex: 0 },
        { id: "gh2", prompt: "Text", options: ["6", "Text", "Text"], correctIndex: 0 },
        { id: "gh3", prompt: "Text", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "gh4", prompt: "to to to?", options: ["+ 2", "6", "Text"], correctIndex: 0 },
        { id: "gh5", prompt: "? (5×3=12 )", options: ["10", "12", "15"], correctIndex: 1 },
        { id: "gh6", prompt: "180°", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "gh7", prompt: "Text", options: ["6", "2", "Text"], correctIndex: 0 },
        { id: "gh8", prompt: "Text", options: ["8", "9", "10"], correctIndex: 1 },
      ],
    },
  },
  {
    id: "reading",
    title: "Text",
    subtitle: "·",
    emoji: "📖",
    tasks: {
      easy: [
        { id: "re1", prompt: "« » - ?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "re2", prompt: "« » - ?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "re3", prompt: "« » - ?", options: ["Text", "b", "Text"], correctIndex: 0 },
        { id: "re4", prompt: "«u » - ?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "re5", prompt: "« » - ?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "re6", prompt: "« » - ?", options: ["Text", "b", "n"], correctIndex: 0 },
        { id: "re7", prompt: "« » - ?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "re8", prompt: "«b » - ?", options: ["Text", "Text", "Text"], correctIndex: 0 },
      ],
      medium: [
        { id: "rm1", prompt: "« , u » - ?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "rm2", prompt: "« » - ?", options: ["i", "Text", "n"], correctIndex: 0 },
        { id: "rm3", prompt: "«u , u» - ?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "rm4", prompt: ": «ni b »", options: ["ni b", "ni", "ni n"], correctIndex: 0 },
        { id: "rm5", prompt: "«u , u, u» - ?", options: ["u", "Text", "Text"], correctIndex: 0 },
        { id: "rm6", prompt: "« » - ?", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "rm7", prompt: ": «, »", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "rm8", prompt: "« u » - ?", options: ["u", "Text", "Text"], correctIndex: 0 },
      ],
      hard: [
        { id: "rh1", prompt: "« » - ?", options: ["b", "Text", "b"], correctIndex: 0 },
        { id: "rh2", prompt: "«er » - ?", options: ["Text", "n", "l"], correctIndex: 0 },
        { id: "rh3", prompt: "«, b, » - «»?", options: ["Text", "Text", "b"], correctIndex: 0 },
        { id: "rh4", prompt: "«o » - ?", options: ["Text", "b", "Text"], correctIndex: 0 },
        { id: "rh5", prompt: ": « »", options: ["Text", "Text", "Text"], correctIndex: 0 },
        { id: "rh6", prompt: "« , » - ?", options: ["Text", "Text", "g"], correctIndex: 0 },
        { id: "rh7", prompt: "«, » - «»?", options: ["d", "if", "s"], correctIndex: 0 },
        { id: "rh8", prompt: "« » - ?", options: ["Text", "Text", "b"], correctIndex: 0 },
      ],
    },
  },
];

export const TRAINING_TASKS_PER_SESSION = 6;

/** @param {string} areaId @param {DifficultyId} difficulty */
export function pickTrainingTasks(areaId, difficulty) {
  const area = TRAINING_AREAS.find((a) => a.id === areaId) ?? TRAINING_AREAS[0];
  const pool = area.tasks[difficulty] ?? area.tasks.easy;
  return pool.slice(0, TRAINING_TASKS_PER_SESSION);
}

export function trainingFeedback(ok) {
  return ok ? "! u" : "-";
}

export function trainingSummaryMessage(correct, total) {
  const ratio = total > 0 ? correct / total : 0;
  if (ratio >= 0.85) return "-";
  if (ratio >= 0.5) return "-";
  return "-";
}
