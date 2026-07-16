import {
  SESSION_FINAL_COUNT,
  SESSION_MID_COUNT,
  SESSION_OPEN_COUNT,
  TASKS_PER_SESSION,
} from "../../../lib/educational-games/educational-session-standard.js";

export { TASKS_PER_SESSION as ITEMS_PER_SESSION };

/** @typedef {'paper'|'plastic'|'glass'|'metal'|'trash'} BinId */
/** @typedef {'easy'|'medium'|'hard'} DifficultyId */

/**
 * @typedef {Object} RecyclingItem
 * @property {string} id
 * @property {string} emoji
 * @property {string} name
 * @property {BinId} bin
 * @property {string} [imageSrc] — optional product image; falls back to emoji
 */

/** @type {Record<BinId, { id: BinId, label: string, emoji: string, accent: string, lid: string, body: string }>} */
export const BINS = {
  paper: {
    id: "paper",
    label: "Paper",
    emoji: "📄",
    accent: "#2563eb",
    lid: "#1d4ed8",
    body: "#3b82f6",
  },
  plastic: {
    id: "plastic",
    label: "Plastic",
    emoji: "🧴",
    accent: "#ca8a04",
    lid: "#a16207",
    body: "#facc15",
  },
  glass: {
    id: "glass",
    label: "Glass",
    emoji: "🫙",
    accent: "#16a34a",
    lid: "#15803d",
    body: "#4ade80",
  },
  metal: {
    id: "metal",
    label: "Metal",
    emoji: "🥫",
    accent: "#64748b",
    lid: "#475569",
    body: "#94a3b8",
  },
  trash: {
    id: "trash",
    label: "Trash",
    emoji: "🗑️",
    accent: "#dc2626",
    lid: "#991b1b",
    body: "#f87171",
  },
};

/** @type {RecyclingItem[]} */
export const ITEMS = [
  {
    id: "newspaper",
    emoji: "📰",
    name: "Newspaper",
    bin: "paper",
    imageSrc: "/images/recycling-items/newspaper.svg",
  },
  {
    id: "page",
    emoji: "📄",
    name: "Paper",
    bin: "paper",
    imageSrc: "/images/recycling-items/paper-page.svg",
  },
  {
    id: "box",
    emoji: "📦",
    name: "Cardboard",
    bin: "paper",
    imageSrc: "/images/recycling-items/cardboard-box.svg",
  },
  { id: "notebook", emoji: "📓", name: "Notebook", bin: "paper" },
  {
    id: "bottle-plastic",
    emoji: "🧴",
    name: "Plastic bottle",
    bin: "plastic",
    imageSrc: "/images/recycling-items/plastic-bottle.svg",
  },
  {
    id: "bag",
    emoji: "🛍️",
    name: "Plastic bag",
    bin: "plastic",
    imageSrc: "/images/recycling-items/plastic-bag.svg",
  },
  { id: "yogurt", emoji: "🥛", name: "Yogurt cup", bin: "plastic" },
  { id: "plastic-box", emoji: "🥡", name: "Plastic container", bin: "plastic" },
  { id: "bottle-glass", emoji: "🍾", name: "Glass bottle", bin: "glass" },
  {
    id: "jar",
    emoji: "🫙",
    name: "Jar",
    bin: "glass",
    imageSrc: "/images/recycling-items/glass-jar.svg",
  },
  { id: "cup", emoji: "🥃", name: "Glass cup", bin: "glass" },
  {
    id: "can",
    emoji: "🥫",
    name: "Soda can",
    bin: "metal",
    imageSrc: "/images/recycling-items/metal-can.svg",
  },
  { id: "tin", emoji: "🍲", name: "Tin can", bin: "metal" },
  { id: "lid", emoji: "⭕", name: "Metal lid", bin: "metal" },
  {
    id: "banana",
    emoji: "🍌",
    name: "Banana peel",
    bin: "trash",
    imageSrc: "/images/recycling-items/banana-peel.svg",
  },
  { id: "tissue", emoji: "🧻", name: "Dirty tissue", bin: "trash" },
  { id: "toy", emoji: "🧸", name: "Broken toy", bin: "trash" },
  { id: "food", emoji: "🍎", name: "Food scraps", bin: "trash" },
];

/** @type {Record<DifficultyId, { id: DifficultyId, label: string, bins: BinId[], itemsTarget: number, maxMistakes: number, beltDurationMs: number, dualChance: number }>} */
export const DIFFICULTIES = {
  easy: {
    id: "easy",
    label: "Easy",
    bins: ["paper", "plastic", "trash"],
    itemsTarget: TASKS_PER_SESSION,
    maxMistakes: 5,
    beltDurationMs: 9000,
    dualChance: 0,
  },
  medium: {
    id: "medium",
    label: "Medium",
    bins: ["paper", "plastic", "glass", "trash"],
    itemsTarget: TASKS_PER_SESSION,
    maxMistakes: 4,
    beltDurationMs: 6500,
    dualChance: 0,
  },
  hard: {
    id: "hard",
    label: "Hard",
    bins: ["paper", "plastic", "glass", "metal", "trash"],
    itemsTarget: TASKS_PER_SESSION,
    maxMistakes: 3,
    beltDurationMs: 4800,
    dualChance: 0.35,
  },
};

export const FACTS = [
  "Recycled paper can become new paper again.",
  "Plastic bottles can be made into new products.",
  "Glass can be recycled many times.",
  "Metal cans are great for recycling.",
  "Sorting correctly helps protect the environment.",
  "Recycling saves precious natural resources.",
  "Every item in the right place helps the Earth.",
];

/** @param {BinId[]} activeBins */
export function pickRandomItem(activeBins) {
  const allowed = ITEMS.filter((item) => activeBins.includes(item.bin));
  return allowed[Math.floor(Math.random() * allowed.length)];
}

/**
 * Shuffled item queue for one session — each allowed item appears once before repeat.
 * @param {BinId[]} activeBins
 */
export function buildRecyclingItemQueue(activeBins) {
  const allowed = ITEMS.filter((item) => activeBins.includes(item.bin));
  const queue = [...allowed];
  for (let i = queue.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [queue[i], queue[j]] = [queue[j], queue[i]];
  }
  return queue;
}

/** Item difficulty within a level (1 = clearest, 5 = trickiest). */
const ITEM_DIFFICULTY = {
  newspaper: 1,
  page: 1,
  box: 1,
  banana: 1,
  "bottle-plastic": 1,
  bag: 1,
  notebook: 2,
  "bottle-glass": 2,
  jar: 2,
  can: 2,
  yogurt: 3,
  "plastic-box": 3,
  cup: 3,
  tissue: 3,
  tin: 3,
  lid: 4,
  food: 4,
  toy: 5,
};

/** @param {RecyclingItem} item */
function itemDifficultyScore(item) {
  return ITEM_DIFFICULTY[item.id] ?? 3;
}

/**
 * Planned 20-item session: opening (clear) → mid → final (trickier).
 * @param {BinId[]} activeBins
 */
export function buildRecyclingSessionPlan(activeBins) {
  const allowed = ITEMS.filter((item) => activeBins.includes(item.bin));
  const sorted = [...allowed].sort((a, b) => itemDifficultyScore(a) - itemDifficultyScore(b));
  const third = Math.max(1, Math.floor(sorted.length / 3));
  const openingPool = sorted.slice(0, third);
  const midPool = sorted.slice(third, third * 2);
  const finalPool = sorted.slice(third * 2);

  /** @param {RecyclingItem[]} pool @param {number} count */
  function pickFrom(pool, count) {
    /** @type {RecyclingItem[]} */
    const out = [];
    let idx = 0;
    while (out.length < count && pool.length) {
      out.push(pool[idx % pool.length]);
      idx += 1;
    }
    return out;
  }

  return [
    ...pickFrom(openingPool, SESSION_OPEN_COUNT),
    ...pickFrom(midPool, SESSION_MID_COUNT),
    ...pickFrom(finalPool, SESSION_FINAL_COUNT),
  ].slice(0, TASKS_PER_SESSION);
}

/** @param {number} sortedCount @param {DifficultyId} difficulty */
export function allowDualItemsAt(sortedCount, difficulty) {
  const diff = DIFFICULTIES[difficulty];
  if (!diff.dualChance) return false;
  return sortedCount >= SESSION_OPEN_COUNT + SESSION_MID_COUNT;
}

/** @param {RecyclingItem[]} plan @param {number} index */
export function nextPlannedRecyclingItem(plan, index) {
  return plan[index] ?? null;
}

/** @param {RecyclingItem[]} queue @param {Set<string>} usedIds */
export function pickNextRecyclingItem(queue, usedIds) {
  const remaining = queue.filter((item) => !usedIds.has(item.id));
  if (!remaining.length) return null;
  const item = remaining[Math.floor(Math.random() * remaining.length)];
  usedIds.add(item.id);
  return item;
}

/** @param {BinId} binId */
export function pickFactForBin(binId) {
  const binFacts = {
    paper: "Recycled paper can become new paper again.",
    plastic: "Plastic bottles can be made into new products.",
    glass: "Glass can be recycled many times.",
    metal: "Metal cans are great for recycling.",
    trash: "Sorting correctly helps protect the environment.",
  };
  if (Math.random() < 0.65) return binFacts[binId];
  return FACTS[Math.floor(Math.random() * FACTS.length)];
}

export const SCORE = {
  correct: 10,
  fastBonus: 5,
  fastThreshold: 0.35,
  streak5: 20,
  streak10: 50,
  mistake: -5,
  miss: -5,
};

/** @type {Record<DifficultyId, { rampEvery: number, decreaseMs: number, minDurationMs: number }>} */
export const BELT_RAMP = {
  easy: { rampEvery: 0, decreaseMs: 0, minDurationMs: 9000 },
  medium: { rampEvery: 7, decreaseMs: 350, minDurationMs: 4800 },
  hard: { rampEvery: 5, decreaseMs: 450, minDurationMs: 3300 },
};

/** @param {DifficultyId} difficulty @param {number} sortedCount */
export function beltDurationMs(difficulty, sortedCount) {
  const base = DIFFICULTIES[difficulty].beltDurationMs;
  const ramp = BELT_RAMP[difficulty];
  if (!ramp.rampEvery) return base;
  const steps = Math.floor(Math.max(0, sortedCount) / ramp.rampEvery);
  return Math.max(ramp.minDurationMs, base - steps * ramp.decreaseMs);
}
