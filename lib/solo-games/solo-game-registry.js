/** Solo Leo games catalog for /student/solo-games/* */

export const SOLO_GAME_KEYS = Object.freeze([
  "catcher",
  "puzzle",
  "memory",
  "flyer",
  "leo-jump",
  "balloons",
  "maze",
  "picture-puzzle",
  "target-tap",
  "sort-shapes",
  "smart-blocks",
  "fruit-slice",
  "leo-miners",
]);

export const SOLO_DIFFICULTY_OPTIONS = Object.freeze([
  { id: "easy", labelHe: "Easy" },
  { id: "medium", labelHe: "Medium" },
  { id: "hard", labelHe: "Hard" },
]);

/** @typedef {"landscape-recommend" | "portrait-recommend" | null} SoloOrientationHint */

/** @typedef {{ howToPlay: string, scoring: string, rewards: string, tip: string }} SoloGameHelpConfig */

/** @type {Record<string, { id: string, route: string, titleHe: string, emoji: string, blurbHe: string, hasDifficultyPicker: boolean, orientationHint: SoloOrientationHint, help: SoloGameHelpConfig }>} */
export const SOLO_GAME_REGISTRY = {
  catcher: {
    id: "catcher",
    route: "/student/solo-games/catcher",
    titleHe: "Catch with Leo",
    emoji: "🎯",
    blurbHe: "Catch coins and stay away from bombs!",
    hasDifficultyPicker: false,
    orientationHint: "landscape-recommend",
    help: {
      howToPlay: "Move Leo left and right to catch coins and diamonds falling from the sky.",
      scoring: "Every coin or diamond caught adds points. Hitting a bomb ends the game.",
      rewards: "The more points you earn, the more coins and diamonds you'll get for your kid world.",
      tip: "Keep your eyes on what's falling and move ahead of time before the item reaches the bottom.",
    },
  },
  flyer: {
    id: "flyer",
    route: "/student/solo-games/flyer",
    titleHe: "Leo in a Plane",
    emoji: "🪂",
    blurbHe: "Hold to fly, collect coins, and avoid obstacles!",
    hasDifficultyPicker: false,
    orientationHint: "landscape-recommend",
    help: {
      howToPlay: "Hold the button or the screen to fly, and release to descend. Collect coins and avoid obstacles.",
      scoring: "Coins and diamonds add points. Hitting an obstacle ends the game.",
      rewards: "The farther you fly and the more points you earn, the more coins and diamonds you'll get.",
      tip: "Don't fly too high - sometimes it's better to pass beneath an obstacle.",
    },
  },
  puzzle: {
    id: "puzzle",
    route: "/student/solo-games/puzzle",
    titleHe: "Leo's Puzzle",
    emoji: "🧩",
    blurbHe: "Merge tiles and rack up points before time runs out!",
    hasDifficultyPicker: true,
    orientationHint: "portrait-recommend",
    help: {
      howToPlay: "Move tiles on the board to merge matching numbers. The bigger the numbers, the higher the score.",
      scoring: "Every merge adds points. The goal is to reach the score target before time runs out.",
      rewards: "Winning based on difficulty level grants coins, and a score bonus adds even more.",
      tip: "Try to keep a corner free so you have room to move tiles.",
    },
  },
  memory: {
    id: "memory",
    route: "/student/solo-games/memory",
    titleHe: "Leo's Memory Game",
    emoji: "🧠",
    blurbHe: "Flip cards and find pairs before the clock runs out!",
    hasDifficultyPicker: true,
    orientationHint: null,
    help: {
      howToPlay: "Tap a card to flip it, and find its matching pair. Every pair you find stays open.",
      scoring: "You start with a high score - the longer you take, the lower it drops. Finding all the pairs before time runs out = a win.",
      rewards: "Winning based on difficulty level grants coins and diamonds. The higher the score, the bigger the reward.",
      tip: "Try to remember where you saw each picture - even if you didn't find its pair right away.",
    },
  },
  "leo-jump": {
    id: "leo-jump",
    route: "/student/solo-games/leo-jump",
    titleHe: "Leo Jumps",
    emoji: "🦘",
    blurbHe: "Jump over obstacles and collect coins!",
    hasDifficultyPicker: false,
    orientationHint: "landscape-recommend",
    help: {
      howToPlay: "Tap to jump. Get past obstacles and collect coins, diamonds, and magnets along the way.",
      scoring: "Coins and diamonds add points. Consecutive jumps over obstacles give a combo bonus. Hitting an obstacle ends the game.",
      rewards: "The farther you run and the more points you earn, the more coins and diamonds you'll get.",
      tip: "Don't jump every time - sometimes it's better to wait a moment and jump at the right time.",
    },
  },
  balloons: {
    id: "balloons",
    route: "/student/solo-games/balloons",
    titleHe: "Balloon Pop",
    emoji: "🎈",
    blurbHe: "Pop balloons before time runs out!",
    hasDifficultyPicker: false,
    orientationHint: null,
    help: {
      howToPlay: "Tap balloons to pop them. You have three lives and one minute. Watch out for bombs!",
      scoring: "Regular, gold, and diamond balloons add points. Clock balloons add time, and heart balloons restore a life. A bomb takes away a life.",
      rewards: "Reaching the pop target or a high final score grants coins and diamonds.",
      tip: "Watch for special balloons - they can help you before time runs out.",
    },
  },
  maze: {
    id: "maze",
    route: "/student/solo-games/maze",
    titleHe: "Leo's Maze",
    emoji: "🌀",
    blurbHe: "Find the exit of the maze before time runs out!",
    hasDifficultyPicker: true,
    orientationHint: "portrait-recommend",
    help: {
      howToPlay: "Move Leo through the maze, collect keys and stars, and find the exit before time runs out.",
      scoring: "Keys, stars, and diamonds add points. Finishing the maze gives a big bonus. If time runs out - the game ends.",
      rewards: "Successfully finishing the maze based on difficulty level grants coins, and a score bonus adds even more.",
      tip: "Collect the keys first - sometimes they unlock a shorter path.",
    },
  },
  "picture-puzzle": {
    id: "picture-puzzle",
    route: "/student/solo-games/picture-puzzle",
    titleHe: "Picture Puzzle",
    emoji: "🖼️",
    blurbHe: "Complete the pieces of Leo's picture!",
    hasDifficultyPicker: true,
    orientationHint: "landscape-recommend",
    help: {
      howToPlay: "Drag the picture pieces to the right place on the board. Complete all the pieces before time runs out.",
      scoring: "The faster you finish and the fewer moves you use, the higher the score. If time runs out before you finish - there's no win.",
      rewards: "Completing the puzzle based on difficulty level grants coins, and a score bonus adds even more.",
      tip: "Start with the corners and edges - it's easier to see where each piece belongs.",
    },
  },
  "target-tap": {
    id: "target-tap",
    route: "/student/solo-games/target-tap",
    titleHe: "Target Tap",
    emoji: "🎯",
    blurbHe: "Tap the targets before they disappear!",
    hasDifficultyPicker: true,
    orientationHint: null,
    help: {
      howToPlay: "Tap the targets that appear on the screen before they disappear. You have three lives.",
      scoring: "Regular targets, stars, and diamonds are worth different points. Missing costs a life. Consecutive hits give a combo bonus.",
      rewards: "Reaching the hit target or a high final score grants coins and diamonds.",
      tip: "Don't rush at everything - sometimes a target with a diamond is worth more.",
    },
  },
  "sort-shapes": {
    id: "sort-shapes",
    route: "/student/solo-games/sort-shapes",
    titleHe: "Sort Shapes",
    emoji: "🔺",
    blurbHe: "Sort shapes and colors into the correct boxes!",
    hasDifficultyPicker: true,
    orientationHint: null,
    help: {
      howToPlay: "Drag each shape to the matching box by shape or color. Finish all the sorting before time runs out.",
      scoring: "Every correct sort adds points. A mistake deducts from the score. If time runs out before you finish - the game ends.",
      rewards: "Finishing successfully based on difficulty level grants coins, and a score bonus adds even more.",
      tip: "First decide which box each shape belongs to - then drag with confidence.",
    },
  },
  "smart-blocks": {
    id: "smart-blocks",
    route: "/student/solo-games/smart-blocks",
    titleHe: "Smart Blocks",
    emoji: "🧱",
    blurbHe: "Place shapes, clear rows and columns, and reach the score target!",
    hasDifficultyPicker: true,
    orientationHint: "landscape-recommend",
    help: {
      howToPlay: "Drag shapes onto the board, rotate them if needed, and place them to fill rows and columns.",
      scoring: "Clearing a row or column adds points. The goal is to reach the score target before the board fills up.",
      rewards: "Winning based on difficulty level grants coins, and a score bonus adds even more.",
      tip: "Try to clear several rows at once - it gives a lot of points.",
    },
  },
  "fruit-slice": {
    id: "fruit-slice",
    route: "/student/solo-games/fruit-slice",
    titleHe: "Fruit Slice",
    emoji: "🍎",
    blurbHe: "Slice fruit, avoid bombs, and reach the score target!",
    hasDifficultyPicker: true,
    orientationHint: null,
    help: {
      howToPlay: "Drag your finger across the screen to slice flying fruit. Avoid bombs - you have three mistakes allowed.",
      scoring: "Every fruit sliced adds points. Slicing several fruits at once gives a combo bonus. Hitting a bomb or missing a fruit costs a mistake.",
      rewards: "Reaching the score target based on difficulty level grants coins and diamonds.",
      tip: "Slice only fruit - if you see a bomb, it's best to skip it.",
    },
  },
  "leo-miners": {
    id: "leo-miners",
    route: "/student/solo-games/leo-miners",
    titleHe: "Leo the Miner",
    emoji: "⛏️",
    blurbHe: "Merge mining dogs, break rocks, and earn points to redeem!",
    hasDifficultyPicker: false,
    orientationHint: "portrait-recommend",
    help: {
      howToPlay:
        "Add mining dogs to the board, drag dogs of the same level to merge them, and break rocks to earn coins and points.",
      scoring: "Every rock broken grants coins. Points accumulate based on the rock's stage - with a daily limit.",
      rewards: "Points can be redeemed for Leo coins and diamonds (once the server is ready).",
      tip: "Upgrade DPS to break rocks faster, and GOLD to earn more coins from each rock.",
    },
  },
};

export const SOLO_GAME_LIST = SOLO_GAME_KEYS.map((key) => SOLO_GAME_REGISTRY[key]);

/**
 * @param {string} gameKey
 */
export function findSoloGame(gameKey) {
  const key = String(gameKey || "").trim().toLowerCase();
  return SOLO_GAME_REGISTRY[key] || null;
}

/**
 * @param {string} gameKey
 */
export function isValidSoloGameKey(gameKey) {
  return SOLO_GAME_KEYS.includes(String(gameKey || "").trim().toLowerCase());
}

/**
 * @param {string} difficulty
 */
export function isValidSoloDifficulty(difficulty) {
  if (!difficulty) return true;
  return SOLO_DIFFICULTY_OPTIONS.some((d) => d.id === difficulty);
}

/**
 * @param {string} difficulty
 */
export function difficultyLabelHe(difficulty) {
  const d = SOLO_DIFFICULTY_OPTIONS.find((x) => x.id === difficulty);
  return d?.labelHe || difficulty || "-";
}
