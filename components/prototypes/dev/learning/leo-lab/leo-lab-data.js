/** @typedef {'easy' || 'medium' || 'hard'} DifficultyId */

/** @typedef {{
 *   id: string
 *   name: string
 *   icon: string
 *   category?: string
 *   imageSrc?: string
 * }} LabItem */

/** @typedef {{
 *   id: string
 *   difficulty: DifficultyId
 *   title: string
 *   prompt: string
 *   missionIcon?: string
 *   pickCount: number
 *   validItems: string[]
 *   exactMatch?: boolean
 *   resultText: string
 *   fact: string
 *   resultIcon: string
 * }} LabExperiment */

export const EXPERIMENTS_PER_LEVEL = 8;

export const DIFFICULTIES = {
  easy: {
    id: "easy",
    label: "to",
    shelfCount: 8,
    itemHint: "8 · 2",
  },
  medium: {
    id: "medium",
    label: "Medium",
    shelfCount: 12,
    itemHint: "12 · 2–3",
  },
  hard: {
    id: "hard",
    label: "Option",
    shelfCount: 12,
    itemHint: "12 · 2–4",
  },
};

/** @type {Record<string, LabItem>} */
export const LAB_ITEMS = {
  water: { id: "water", name: "Who", icon: "💧", category: "Text" },
  wood: { id: "wood", name: "Text", icon: "🪵", category: "Text" },
  nail: { id: "nail", name: "Text", icon: "🔩", category: "Text" },
  magnet: { id: "magnet", name: "Text", icon: "🧲", category: "Text" },
  plant: { id: "plant", name: "Text", icon: "🌱", category: "Text" },
  mirror: { id: "mirror", name: "Text", icon: "🪞", category: "Text" },
  light: { id: "light", name: "Text", icon: "🔦", category: "Text" },
  ice: { id: "ice", name: "Text", icon: "🧊", category: "Text" },
  battery: { id: "battery", name: "to to", icon: "🔋", category: "to" },
  bulb: { id: "bulb", name: "Text", icon: "💡", category: "to" },
  wire: { id: "wire", name: "Text", icon: "🧵", category: "to" },
  sun: { id: "sun", name: "sun", icon: "☀️", category: "Text" },
  soil: { id: "soil", name: "Text", icon: "🟫", category: "Text" },
  bowl: { id: "bowl", name: "Text", icon: "🥣", category: "All" },
  stone: { id: "stone", name: "Text", icon: "🪨", category: "Text" },
  wall: { id: "wall", name: "Text", icon: "🧱", category: "Text" },
  switch: { id: "switch", name: "Text", icon: "🎛️", category: "to" },
  metal_spoon: { id: "metal_spoon", name: "Text", icon: "🥄", category: "Text" },
  plastic: { id: "plastic", name: "to", icon: "🧴", category: "Text" },
  paper: { id: "paper", name: "Text", icon: "📄", category: "Text" },
  can: { id: "can", name: "bin", icon: "🥫", category: "Text" },
  key: { id: "key", name: "Key", icon: "🔑", category: "Text" },
};

/** @type {Record<DifficultyId, string[]>} */
export const SHELF_BY_DIFFICULTY = {
  easy: ["magnet", "nail", "metal_spoon", "can", "plant", "water", "sun", "wood"],
  medium: [
    "battery",
    "bulb",
    "wire",
    "magnet",
    "nail",
    "metal_spoon",
    "plant",
    "water",
    "sun",
    "ice",
    "bowl",
    "mirror",
  ],
  hard: [
    "battery",
    "bulb",
    "wire",
    "switch",
    "magnet",
    "nail",
    "metal_spoon",
    "plant",
    "water",
    "sun",
    "soil",
    "stone",
  ],
};

/** @type {LabExperiment[]} */
export const EASY_EXPERIMENTS = [
  {
    id: "easy-magnet-metals",
    difficulty: "easy",
    title: "Text",
    prompt: "Pick 2 metal objects the magnet will attract",
    missionIcon: "🧲",
    pickCount: 2,
    validItems: ["magnet", "nail", "metal_spoon", "can"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "✨",
  },
  {
    id: "easy-plant-drink",
    difficulty: "easy",
    title: "Text",
    prompt: "Pick 2 things that help the plant",
    missionIcon: "🌱",
    pickCount: 2,
    validItems: ["plant", "water", "sun", "wood"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "💧",
  },
  {
    id: "easy-warm-water",
    difficulty: "easy",
    title: "Text",
    prompt: "Pick 2 things that help the ice melt",
    missionIcon: "🧊",
    pickCount: 2,
    validItems: ["sun", "water", "plant", "wood"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "💦",
  },
  {
    id: "easy-shadow",
    difficulty: "easy",
    title: "to",
    prompt: "Pick 2 objects that make a shadow",
    missionIcon: "🌓",
    pickCount: 2,
    validItems: ["sun", "wood", "magnet", "plant"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "🌑",
  },
  {
    id: "easy-float",
    difficulty: "easy",
    title: "Text",
    prompt: "Pick 2 objects to test in water",
    missionIcon: "💧",
    pickCount: 2,
    validItems: ["water", "wood", "plant", "can"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "🪵",
  },
  {
    id: "easy-sink",
    difficulty: "easy",
    title: "Text",
    prompt: "Pick 2 objects to test in water",
    missionIcon: "💧",
    pickCount: 2,
    validItems: ["water", "nail", "metal_spoon", "can"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "🪨",
  },
  {
    id: "easy-reflect",
    difficulty: "easy",
    title: "Text",
    prompt: "Pick 2 objects related to light",
    missionIcon: "🔦",
    pickCount: 2,
    validItems: ["sun", "water", "magnet", "wood"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "🌟",
  },
  {
    id: "easy-water-fit",
    difficulty: "easy",
    title: "Text",
    prompt: "Pick 2 objects for a water experiment",
    missionIcon: "💧",
    pickCount: 2,
    validItems: ["water", "wood", "plant", "can"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "🧪",
  },
];

/** @type {LabExperiment[]} */
export const MEDIUM_EXPERIMENTS = [
  {
    id: "medium-light-bulb",
    difficulty: "medium",
    title: "Text",
    prompt: "Pick 3 objects that complete a circuit and light the bulb",
    missionIcon: "💡",
    pickCount: 3,
    validItems: ["battery", "bulb", "wire", "magnet", "bowl"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "💡",
  },
  {
    id: "medium-plant-grow",
    difficulty: "medium",
    title: "Text",
    prompt: "Pick 3 things the plant needs",
    missionIcon: "🌱",
    pickCount: 3,
    validItems: ["plant", "water", "sun", "bowl", "ice"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "🌿",
  },
  {
    id: "medium-light-target",
    difficulty: "medium",
    title: "Text",
    prompt: "Pick 3 objects that direct light",
    missionIcon: "🎯",
    pickCount: 3,
    validItems: ["mirror", "sun", "water", "bowl", "ice"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "🪞",
  },
  {
    id: "medium-melt-bowl",
    difficulty: "medium",
    title: "Text",
    prompt: "Pick 3 objects to melt ice",
    missionIcon: "🧊",
    pickCount: 3,
    validItems: ["ice", "bowl", "sun", "water", "plant"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "💦",
  },
  {
    id: "medium-magnet-pick2",
    difficulty: "medium",
    title: "Text",
    prompt: "Pick 2 metals the magnet attracts",
    missionIcon: "🧲",
    pickCount: 2,
    validItems: ["nail", "metal_spoon", "magnet"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "🔩",
  },
  {
    id: "medium-simple-circuit",
    difficulty: "medium",
    title: "Text",
    prompt: "Pick 3 objects for an electric circuit",
    missionIcon: "🔋",
    pickCount: 3,
    validItems: ["battery", "wire", "bulb", "magnet", "mirror"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "⚡",
  },
  {
    id: "medium-clear-shadow",
    difficulty: "medium",
    title: "Text",
    prompt: "Pick objects for experiment 15",
    missionIcon: "🌓",
    pickCount: 3,
    validItems: ["sun", "plant", "bowl", "ice", "water"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "🌑",
  },
  {
    id: "medium-plant-place",
    difficulty: "medium",
    title: "Text",
    prompt: "Pick objects for experiment 16",
    missionIcon: "🌱",
    pickCount: 3,
    validItems: ["plant", "water", "sun", "bowl", "ice"],
    resultText: "Text",
    fact: "Text",
    resultIcon: "🟫",
  },
];

/** @type {LabExperiment[]} */
export const HARD_EXPERIMENTS = [
  {
    id: "hard-bulb-clean",
    difficulty: "hard",
    title: "Text",
    prompt: "Pick objects for experiment 17",
    missionIcon: "💡",
    pickCount: 3,
    validItems: ["battery", "wire", "bulb"],
    exactMatch: true,
    resultText: "Text",
    fact: "Text",
    resultIcon: "💡",
  },
  {
    id: "hard-plant-full",
    difficulty: "hard",
    title: "Text",
    prompt: "Pick objects for experiment 18",
    missionIcon: "🌱",
    pickCount: 4,
    validItems: ["plant", "soil", "water", "sun"],
    exactMatch: true,
    resultText: "Text",
    fact: "Text",
    resultIcon: "🌿",
  },
  {
    id: "hard-light-reflection",
    difficulty: "hard",
    title: "Text",
    prompt: "Pick objects for experiment 19",
    missionIcon: "🪞",
    pickCount: 3,
    validItems: ["sun", "magnet", "nail"],
    exactMatch: true,
    resultText: "Text",
    fact: "Text",
    resultIcon: "🌟",
  },
  {
    id: "hard-magnet-exact2",
    difficulty: "hard",
    title: "Text",
    prompt: "Pick objects for experiment 20",
    missionIcon: "🧲",
    pickCount: 2,
    validItems: ["nail", "metal_spoon"],
    exactMatch: true,
    resultText: "Text",
    fact: "Text",
    resultIcon: "🔩",
  },
  {
    id: "hard-melt-exact",
    difficulty: "hard",
    title: "Text",
    prompt: "Pick objects for experiment 21",
    missionIcon: "🧊",
    pickCount: 3,
    validItems: ["sun", "water", "stone"],
    exactMatch: true,
    resultText: "Text",
    fact: "Text",
    resultIcon: "💦",
  },
  {
    id: "hard-full-circuit",
    difficulty: "hard",
    title: "Text",
    prompt: "Pick objects for experiment 22",
    missionIcon: "⚡",
    pickCount: 4,
    validItems: ["battery", "wire", "bulb", "switch"],
    exactMatch: true,
    resultText: "Text",
    fact: "Text",
    resultIcon: "🎛️",
  },
  {
    id: "hard-shadow-exact",
    difficulty: "hard",
    title: "Text",
    prompt: "Pick objects for experiment 23",
    missionIcon: "🌓",
    pickCount: 3,
    validItems: ["sun", "plant", "stone"],
    exactMatch: true,
    resultText: "Text",
    fact: "Text",
    resultIcon: "🌑",
  },
  {
    id: "hard-water-exact",
    difficulty: "hard",
    title: "Text",
    prompt: "Pick objects for experiment 24",
    missionIcon: "💧",
    pickCount: 3,
    validItems: ["water", "plant", "stone"],
    exactMatch: true,
    resultText: "Text",
    fact: "Text",
    resultIcon: "🪵",
  },
];

/** @type {Record<DifficultyId, LabExperiment[]>} */
export const EXPERIMENTS_BY_DIFFICULTY = {
  easy: EASY_EXPERIMENTS,
  medium: MEDIUM_EXPERIMENTS,
  hard: HARD_EXPERIMENTS,
};

export const SCORE = {
  correct: 30,
  firstTry: 10,
  partial: 5,
  mistake: -5,
};

/**
 * @param {DifficultyId} difficulty
 * @returns {LabExperiment[]}
 */
export function pickExperimentsForRun(difficulty) {
  const list = EXPERIMENTS_BY_DIFFICULTY[difficulty] ?? EASY_EXPERIMENTS;
  return list.slice(0, EXPERIMENTS_PER_LEVEL);
}

/**
 * @param {DifficultyId} difficulty
 * @returns {LabItem[]}
 */
export function shelfItemsForDifficulty(difficulty) {
  const ids = SHELF_BY_DIFFICULTY[difficulty] ?? SHELF_BY_DIFFICULTY.easy;
  return ids.map((id) => LAB_ITEMS[id]).filter(Boolean);
}

/**
 * @param {string[]} selectedIds
 * @param {LabExperiment} experiment
 */
export function validateExperimentSelection(selectedIds, experiment) {
  const pickCount = experiment.pickCount;
  const validSet = new Set(experiment.validItems);
  const selected = [...selectedIds];

  if (selected.length < pickCount) {
    const allValid = selected.every((id) => validSet.has(id));
    if (allValid && selected.length > 0) {
      return { ok: false, reason: "partial" };
    }
    return { ok: false, reason: "missing" };
  }

  if (selected.length > pickCount) {
    return { ok: false, reason: "too_many" };
  }

  const wrong = selected.filter((id) => !validSet.has(id));
  if (wrong.length > 0) {
    return { ok: false, reason: "wrong" };
  }

  if (experiment.exactMatch) {
    const selectedSet = new Set(selected);
    const exactOk =
      experiment.validItems.length === pickCount &&
      experiment.validItems.every((id) => selectedSet.has(id));
    if (!exactOk) {
      return { ok: false, reason: "wrong" };
    }
    return { ok: true, reason: "success" };
  }

  return { ok: true, reason: "success" };
}

/**
 * @param {string} reason
 */
export function feedbackMessageForReason(reason) {
  switch (reason) {
    case "missing":
    case "partial":
      return "!";
    case "wrong":
      return "Text";
    case "too_many":
      return "-";
    default:
      return "!";
  }
}
