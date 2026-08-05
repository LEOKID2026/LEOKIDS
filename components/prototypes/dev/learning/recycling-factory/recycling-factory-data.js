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
    label: "General waste",
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
    name: "Paper sheet",
    bin: "paper",
    imageSrc: "/images/recycling-items/paper-page.svg",
  },
  {
    id: "box",
    emoji: "📦",
    name: "Cardboard box",
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
  { id: "plastic-box", emoji: "📦", name: "Plastic box", bin: "plastic" },
  { id: "bottle-glass", emoji: "🍾", name: "Glass bottle", bin: "glass" },
  {
    id: "jar",
    emoji: "🫙",
    name: "Glass jar",
    bin: "glass",
    imageSrc: "/images/recycling-items/glass-jar.svg",
  },
  { id: "cup", emoji: "🥃", name: "Glass cup", bin: "glass" },
  {
    id: "can",
    emoji: "🥫",
    name: "Metal can",
    bin: "metal",
    imageSrc: "/images/recycling-items/metal-can.svg",
  },
  { id: "tin", emoji: "🥫", name: "Tin can", bin: "metal" },
  { id: "lid", emoji: "⭕", name: "Metal lid", bin: "metal" },
  {
    id: "banana",
    emoji: "🍌",
    name: "Banana peel",
    bin: "trash",
    imageSrc: "/images/recycling-items/banana-peel.svg",
  },
  { id: "tissue", emoji: "🧻", name: "Used tissue", bin: "trash" },
  { id: "toy", emoji: "🧸", name: "Broken toy", bin: "trash" },
  { id: "food", emoji: "🍎", name: "Food scraps", bin: "trash" },
];

/** @type {Record<DifficultyId, { id: DifficultyId, label: string, bins: BinId[], itemsTarget: number, maxMistakes: number, beltDurationMs: number, dualChance: number }>} */
export const DIFFICULTIES = {
  easy: {
    id: "easy",
    label: "Easy",
    bins: ["paper", "plastic", "trash"],
    itemsTarget: 20,
    maxMistakes: 5,
    beltDurationMs: 9000,
    dualChance: 0,
  },
  medium: {
    id: "medium",
    label: "Medium",
    bins: ["paper", "plastic", "glass", "trash"],
    itemsTarget: 30,
    maxMistakes: 4,
    beltDurationMs: 6500,
    dualChance: 0,
  },
  hard: {
    id: "hard",
    label: "Hard",
    bins: ["paper", "plastic", "glass", "metal", "trash"],
    itemsTarget: 40,
    maxMistakes: 3,
    beltDurationMs: 4800,
    dualChance: 0.35,
  },
};

export const FACTS = [
  "Recycled paper can become new paper again.",
  "Plastic bottles can be turned into new products.",
  "Glass can be recycled many times.",
  "Metal cans are great for recycling.",
  "Sorting correctly helps protect the environment.",
  "Recycling saves valuable natural resources.",
  "Every item in the right bin helps the Earth.",
];

/** @param {BinId[]} activeBins */
export function pickRandomItem(activeBins) {
  const allowed = ITEMS.filter((item) => activeBins.includes(item.bin));
  return allowed[Math.floor(Math.random() * allowed.length)];
}

/** @param {BinId} binId */
export function pickFactForBin(binId) {
  const binFacts = {
    paper: "Recycled paper can become new paper again.",
    plastic: "Plastic bottles can be turned into new products.",
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
