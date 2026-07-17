/** @typedef {'easy'|'medium'|'hard'} EducationalDifficultyId */

export const EDUCATIONAL_DIFFICULTIES = Object.freeze(["easy", "medium", "hard"]);

/** Global hub catalog — Hebrew-reading games stay out of the live list. */
export const EDUCATIONAL_GAME_KEYS = Object.freeze([
  "recycling-factory",
  "leo-supermarket",
  "leo-lab",
  "leo-gifts",
  "leo-bakery",
  "leo-number-path",
  "leo-pizzeria",
  "leo-word-train",
  "leo-word-detective",
]);

/** Kept for route/validation only — not shown on the Global educational hub. */
export const EDUCATIONAL_GAME_KEYS_ARCHIVED = Object.freeze([]);

/** @type {Record<string, { id: string, gameKey: string, titleHe: string, blurbHe: string, emoji: string, route: string, hubRoute: string, hasDifficultyPicker: boolean }>} */
export const EDUCATIONAL_GAME_REGISTRY = Object.freeze({
  "recycling-factory": {
    id: "recycling-factory",
    gameKey: "recycling-factory",
    titleHe: "Leo's Recycling Factory",
    blurbHe: "Sort trash into the right bins and help protect the environment",
    emoji: "♻️",
    route: "/student/educational-games/recycling-factory",
    hubRoute: "/student/educational-games",
    hasDifficultyPicker: true,
    help: {
      howToPlay:
        "Drag or tap an item from the conveyor belt, then choose the correct bin. Sort enough items before you reach the maximum number of mistakes.",
      scoring:
        "Correct sort +10, fast sort +5, streak of 5 correct +20, streak of 10 +50. A mistake or missed item −5 (score never drops below 0).",
      rewards: "Coins are awarded based on how many items you sorted correctly, accuracy, streaks, and reaching the goal - even if you didn't finish the whole game.",
      tip: "Pay attention to the item type - paper, plastic, glass, metal, or general waste.",
    },
  },
  "leo-supermarket": {
    id: "leo-supermarket",
    gameKey: "leo-supermarket",
    titleHe: "Leo's Grocery Store",
    blurbHe: "A game about money, shopping, and giving change",
    emoji: "🏪",
    route: "/student/educational-games/leo-supermarket",
    hubRoute: "/student/educational-games",
    hasDifficultyPicker: true,
    help: {
      howToPlay:
        "A customer asks for products - pick them from the shelf, work out the change, and choose matching coins. Tap \"Give Change\" when you're ready.",
      scoring:
        "Correct product +10, correct change +25, satisfied customer +30, change right on the first try +10, fast service +5. A mistake or running out of time −5.",
      rewards: "Coins are awarded based on how many customers you served, accuracy, streaks, and difficulty level - even if you didn't serve all 20 customers.",
      tip: "Check the purchase total and how much the customer paid - work out for yourself how much change to give back.",
    },
  },
  "leo-lab": {
    id: "leo-lab",
    gameKey: "leo-lab",
    titleHe: "Leo's Experiment Lab",
    blurbHe: "A game about experiments, materials, and cause and effect",
    emoji: "🔬",
    route: "/student/educational-games/leo-lab",
    hubRoute: "/student/educational-games",
    hasDifficultyPicker: true,
    help: {
      howToPlay:
        "Read the experiment task, choose items from the shelf (drag or tap), place them on the lab table, and tap \"Check Experiment\".",
      scoring:
        "A successful experiment +30, success on the first try +10, streak of 3 correct +15, streak of 5 +30. No points are deducted for mistakes.",
      rewards: "Coins are awarded based on how many experiments you succeeded at, difficulty level, accuracy, streaks, and completing 20 experiments - only if you succeeded at least once.",
      tip: "Think about what's needed to complete the task - don't rely on hints on the item cards.",
    },
  },
  "leo-gifts": {
    id: "leo-gifts",
    gameKey: "leo-gifts",
    titleHe: "Leo's Candy Shop",
    blurbHe: "Equal division, remainders, and quick math",
    emoji: "🍬",
    route: "/student/educational-games/leo-gifts",
    hubRoute: "/student/educational-games",
    hasDifficultyPicker: true,
    help: {
      howToPlay:
        "Divide gifts among the children - choose how many each child gets and how many are left for Leo, then tap \"Check Division\".",
      scoring:
        "Correct answer +30, time bonus up to +20, streak of 5 correct +25. No points are deducted for mistakes.",
      rewards: "Coins are awarded based on how many questions you answered correctly, accuracy, streaks, and difficulty level - even if the game ended due to mistakes.",
      tip: "Check that you've divided everything and that Leo isn't left with too many - you can give each child more.",
    },
  },
  "leo-bakery": {
    id: "leo-bakery",
    gameKey: "leo-bakery",
    titleHe: "Leo's Bakery",
    blurbHe: "Multiplication, equal groups, and trays",
    emoji: "🥐",
    route: "/student/educational-games/leo-bakery",
    hubRoute: "/student/educational-games",
    hasDifficultyPicker: true,
    help: {
      howToPlay:
        "Build trays with an equal amount of baked goods - set the number of trays and the amount per tray, then tap \"Check Order\".",
      scoring:
        "Correct answer +30, time bonus up to +20, streak of 5 correct +25. No points are deducted for mistakes.",
      rewards: "Coins are awarded based on how many orders you prepared correctly, accuracy, streaks, and difficulty level.",
      tip: "Think about how many trays × how many per tray - not just the final result.",
    },
  },
  "leo-number-path": {
    id: "leo-number-path",
    gameKey: "leo-number-path",
    titleHe: "Leo's Number Path",
    blurbHe: "Sequences, odd-even, and multiples",
    emoji: "🔢",
    route: "/student/educational-games/leo-number-path",
    hubRoute: "/student/educational-games",
    hasDifficultyPicker: true,
    help: {
      howToPlay:
        "Choose numbers from the path based on the task - even numbers, multiples, skip-counting, or a sequence - then tap \"Check Path\".",
      scoring:
        "Correct on the first try +30, second try +20, third try +10. After 3 mistakes you move on to the next task.",
      rewards: "Coins are awarded based on how many of the 20 tasks you completed, accuracy, streaks, and finishing the path.",
      tip: "Pay attention to whether order matters - for skip-counting and sequences you need to choose in order.",
    },
  },
  "leo-pizzeria": {
    id: "leo-pizzeria",
    gameKey: "leo-pizzeria",
    titleHe: "Leo's Pizzeria",
    blurbHe: "Learning fractions through making pizzas",
    emoji: "🍕",
    route: "/student/educational-games/leo-pizzeria",
    hubRoute: "/student/educational-games",
    hasDifficultyPicker: true,
    help: {
      howToPlay:
        "Read the order, add toppings to the pizza slices (tap or drag), and tap \"Serve Pizza\".",
      scoring:
        "Correct pizza +30, streak of 3 correct +15, streak of 5 +30. No points are deducted for mistakes.",
      rewards: "Coins are awarded based on how many customers you served, accuracy, streaks, and difficulty level - even if you didn't serve all 20 customers.",
      tip: "Check how many slices each topping covers - half, quarter, and eighth refer to the number of slices, not a position.",
    },
  },
  "leo-word-train": {
    id: "leo-word-train",
    gameKey: "leo-word-train",
    titleHe: "Leo's Word Train",
    blurbHe: "Letters, words, and sentences in English - riding on the train cars",
    emoji: "🚂",
    route: "/student/educational-games/leo-word-train",
    hubRoute: "/student/educational-games",
    hasDifficultyPicker: true,
    help: {
      howToPlay:
        "Choose a card, load it onto an empty car, and tap \"Send the Train\". When the answer is correct - the train departs!",
      scoring:
        "Correct answer +30, time bonus, streak of 3 +15, streak of 5 +30. Timeout −5. A mistake doesn't end the game - it just counts.",
      rewards: "Coins are awarded based on how many of the 20 tasks you completed, accuracy, streaks, and difficulty level.",
      tip: "On easy - just letters. Medium - short words. Hard - short sentences.",
    },
  },
  "leo-word-detective": {
    id: "leo-word-detective",
    gameKey: "leo-word-detective",
    titleHe: "Leo's Word Detective",
    blurbHe: "Drag evidence onto the board and solve reading and vocabulary cases",
    emoji: "🕵️",
    route: "/student/educational-games/leo-word-detective",
    hubRoute: "/student/educational-games",
    hasDifficultyPicker: true,
    availableInGlobal: true,
    help: {
      howToPlay:
        "Drag evidence cards onto the investigation board and tap \"Solve Case\". When the answer is correct - the case is closed!",
      scoring:
        "Correct answer +30, time bonus, streak of 3 +15, streak of 5 +30. Timeout −5. A mistake doesn't end the game - it just counts.",
      rewards: "Coins are awarded based on how many of the 20 cases you solved, accuracy, streaks, and difficulty level.",
      tip: "Read the case task carefully - on hard level there's a short passage on the board.",
    },
  },
});

export const EDUCATIONAL_HUB = Object.freeze({
  route: "/student/educational-games",
  titleHe: "Leo's Educational Games",
  blurbHe: "Enrichment games, critical thinking, and general knowledge",
  emoji: "📚",
});

/** @param {string} gameKey */
export function isValidEducationalGameKey(gameKey) {
  const key = String(gameKey || "").trim().toLowerCase();
  return EDUCATIONAL_GAME_KEYS.includes(key) || EDUCATIONAL_GAME_KEYS_ARCHIVED.includes(key);
}

/** Keys shown on the student educational hub (Global). */
export function listEducationalHubGames() {
  return EDUCATIONAL_GAME_KEYS.map((k) => EDUCATIONAL_GAME_REGISTRY[k]).filter(Boolean);
}

/** @param {string} difficulty */
export function isValidEducationalDifficulty(difficulty) {
  return EDUCATIONAL_DIFFICULTIES.includes(String(difficulty || "").trim().toLowerCase());
}

/** @param {string} gameKey */
export function findEducationalGame(gameKey) {
  return EDUCATIONAL_GAME_REGISTRY[String(gameKey || "").trim().toLowerCase()] || null;
}

/** Recommended grade bands — hint only, never blocks selection. */
export const EDUCATIONAL_DIFFICULTY_GRADE_HINT =
  "Easy: Grades 1–2 · Medium: Grades 3–4 · Hard: Grades 5–6";

/** @param {EducationalDifficultyId} difficulty */
export function difficultyLabelHe(difficulty) {
  if (difficulty === "easy") return "Easy";
  if (difficulty === "hard") return "Hard";
  return "Medium";
}

export const EDUCATIONAL_GAME_LIST = EDUCATIONAL_GAME_KEYS.map((k) => EDUCATIONAL_GAME_REGISTRY[k]);
