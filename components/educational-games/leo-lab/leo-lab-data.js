/** @typedef {'easy' | 'medium' | 'hard'} DifficultyId */

import {
  EASY_EXPERIMENTS,
  MEDIUM_EXPERIMENTS,
  HARD_EXPERIMENTS,
} from "./leo-lab-experiments-clean.js";
import { SHELF_SIZE_BY_DIFFICULTY } from "./leo-lab-shelf-presets.js";

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
 *   shelfItems: string[]
 *   exactMatch?: boolean
 *   resultText: string
 *   fact: string
 *   resultIcon: string
 * }} LabExperiment */

export const EXPERIMENTS_PER_LEVEL = 20;

export const EASY_LEVEL_CONTENT_GUIDELINES = {
  audience: "Grades 1–2",
  minColorExperimentsInEasyPool: 6,
};

const EASY_BANNED_PROMPT_RE =
  /block(?:s|ing)?\s*light|stop(?:s|ping)?\s*light|make\s*a?\s*shadow|let\s*light\s*through|transparent\s*to\s*light|light\s*and\s*shadow|light\s*experiment/i;

export const DIFFICULTIES = {
  easy: {
    id: "easy",
    label: "Easy",
    shelfCount: 8,
    itemHint: "8 items · pick 2",
    maxMistakes: 6,
  },
  medium: {
    id: "medium",
    label: "Medium",
    shelfCount: 10,
    itemHint: "10 items · pick 2–3",
    maxMistakes: 5,
  },
  hard: {
    id: "hard",
    label: "Hard",
    shelfCount: 12,
    itemHint: "12 items · pick 2–4",
    maxMistakes: 4,
  },
};

/** @type {Record<string, LabItem>} */
export const LAB_ITEMS = {
  water: { id: "water", name: "Water", icon: "💧", category: "Liquid" },
  wood: { id: "wood", name: "Wood", icon: "🪵", category: "Solid" },
  nail: { id: "nail", name: "Nail", icon: "🔩", category: "Metal" },
  magnet: { id: "magnet", name: "Magnet", icon: "🧲", category: "Magnet" },
  plant: { id: "plant", name: "Plant", icon: "🌱", category: "Living" },
  mirror: { id: "mirror", name: "Mirror", icon: "🪞", category: "Light" },
  light: { id: "light", name: "Light", icon: "🔦", category: "Light" },
  ice: { id: "ice", name: "Ice", icon: "🧊", category: "Cold" },
  battery: { id: "battery", name: "Battery", icon: "🔋", category: "Electricity" },
  bulb: { id: "bulb", name: "Bulb", icon: "💡", category: "Electricity" },
  wire: { id: "wire", name: "Wire", icon: "🧵", category: "Electricity" },
  sun: { id: "sun", name: "Sun", icon: "☀️", category: "Light" },
  soil: { id: "soil", name: "Soil", icon: "🟫", category: "Nature" },
  bowl: { id: "bowl", name: "Bowl", icon: "🥣", category: "Tool" },
  stone: { id: "stone", name: "Stone", icon: "🪨", category: "Solid" },
  wall: { id: "wall", name: "Wall", icon: "🧱", category: "Solid" },
  switch: { id: "switch", name: "Switch", icon: "🎛️", category: "Electricity" },
  metal_spoon: { id: "metal_spoon", name: "Metal spoon", icon: "🥄", category: "Metal" },
  plastic: { id: "plastic", name: "Plastic", icon: "🧴", category: "Material" },
  paper: { id: "paper", name: "Paper", icon: "📄", category: "Material" },
  can: { id: "can", name: "Can", icon: "🥫", category: "Metal" },
  key: { id: "key", name: "Key", icon: "🔑", category: "Metal" },
  paint_red: { id: "paint_red", name: "Red", icon: "🟥", category: "Color" },
  paint_yellow: { id: "paint_yellow", name: "Yellow", icon: "🟨", category: "Color" },
  paint_blue: { id: "paint_blue", name: "Blue", icon: "🟦", category: "Color" },
  paint_green: { id: "paint_green", name: "Green", icon: "🟩", category: "Color" },
  paint_orange: { id: "paint_orange", name: "Orange", icon: "🟧", category: "Color" },
  paint_purple: { id: "paint_purple", name: "Purple", icon: "🟪", category: "Color" },
  paint_pink: { id: "paint_pink", name: "Pink", icon: "🩷", category: "Color" },
  paint_white: { id: "paint_white", name: "White", icon: "⬜", category: "Color" },
};

/** @type {Record<DifficultyId, LabExperiment[]>} */
export const EXPERIMENTS_BY_DIFFICULTY = {
  easy: EASY_EXPERIMENTS,
  medium: MEDIUM_EXPERIMENTS,
  hard: HARD_EXPERIMENTS,
};

const EASY_COLOR_TOPIC_RE =
  /color|mix|orange|green|purple|red|yellow|blue|paint_/i;
const ELECTRICITY_ITEM_IDS = new Set(["battery", "bulb", "wire", "switch"]);

/** @returns {{ easyTotal: number, colorExperimentCount: number, electricityOnEasyCount: number, gaps: string[] }} */
export function auditEasyLevelContent() {
  const easy = EXPERIMENTS_BY_DIFFICULTY.easy;
  const colorExperimentCount = easy.filter(
    (exp) =>
      EASY_COLOR_TOPIC_RE.test(`${exp.title} ${exp.prompt}`) ||
      exp.validItems.some((id) => String(id).startsWith("paint_")),
  ).length;
  const electricityOnEasyCount = easy.filter((exp) =>
    exp.validItems.some((id) => ELECTRICITY_ITEM_IDS.has(id)),
  ).length;
  const gaps = [];
  if (colorExperimentCount < EASY_LEVEL_CONTENT_GUIDELINES.minColorExperimentsInEasyPool) {
    gaps.push(
      `Easy level: missing color experiments (${colorExperimentCount}/${EASY_LEVEL_CONTENT_GUIDELINES.minColorExperimentsInEasyPool}).`,
    );
  }
  if (electricityOnEasyCount > 0) {
    gaps.push(
      `Easy level: ${electricityOnEasyCount} electricity experiment(s) - move to medium/hard or remove.`,
    );
  }
  const abstractLightExperiments = easy.filter((exp) =>
    EASY_BANNED_PROMPT_RE.test(`${exp.title} ${exp.prompt}`),
  );
  if (abstractLightExperiments.length > 0) {
    gaps.push(
      `Easy level: abstract light/shadow experiments: ${abstractLightExperiments.map((e) => e.id).join(", ")}`,
    );
  }
  return {
    easyTotal: easy.length,
    colorExperimentCount,
    electricityOnEasyCount,
    abstractLightExperiments: abstractLightExperiments.map((e) => e.id),
    gaps,
  };
}

export const SCORE = {
  correct: 30,
  firstTry: 10,
  streak3: 15,
  streak5: 30,
};

/** @param {DifficultyId} difficulty @param {number} index 0-based run index */
export function pickCountForRunIndex(difficulty, index) {
  if (difficulty === "easy") return 2;
  if (difficulty === "medium") return index < 13 ? 2 : 3;
  if (index < 3) return 2;
  if (index < 13) return 3;
  return 4;
}

/** @param {LabExperiment} exp */
function experimentRunKey(exp) {
  return `${exp.title.trim()}|${exp.prompt.trim()}`;
}

/** Fisher–Yates shuffle */
function shuffleExperiments(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * @param {DifficultyId} difficulty
 * @returns {LabExperiment[]}
 */
export function pickExperimentsForRun(difficulty) {
  const pool = EXPERIMENTS_BY_DIFFICULTY[difficulty] ?? EASY_EXPERIMENTS;

  /** @type {Record<number, LabExperiment[]>} */
  const byPick = {};
  for (const exp of pool) {
    if (!byPick[exp.pickCount]) byPick[exp.pickCount] = [];
    byPick[exp.pickCount].push(exp);
  }
  for (const pickCount of Object.keys(byPick)) {
    byPick[Number(pickCount)] = shuffleExperiments(byPick[Number(pickCount)]);
  }

  const usedIds = new Set();
  const usedKeys = new Set();
  /** @type {LabExperiment[]} */
  const run = [];
  /** @type {Record<number, number>} */
  const bucketIdx = {};

  for (let i = 0; i < EXPERIMENTS_PER_LEVEL; i += 1) {
    const neededPick = pickCountForRunIndex(difficulty, i);
    const bucket = byPick[neededPick] ?? [];
    if (bucketIdx[neededPick] == null) bucketIdx[neededPick] = 0;

    let exp = null;
    while (bucketIdx[neededPick] < bucket.length) {
      const candidate = bucket[bucketIdx[neededPick]];
      bucketIdx[neededPick] += 1;
      if (usedIds.has(candidate.id) || usedKeys.has(experimentRunKey(candidate))) continue;
      exp = candidate;
      break;
    }

    if (!exp) break;

    usedIds.add(exp.id);
    usedKeys.add(experimentRunKey(exp));
    run.push({ ...exp });
  }

  return run;
}

/** @returns {Record<DifficultyId, { total: number, uniqueTitles: number, uniquePrompts: number, byPickCount: Record<number, number> }>} */
export function experimentPoolStats() {
  /** @type {Record<string, { total: number, uniqueTitles: number, uniquePrompts: number, byPickCount: Record<number, number> }>} */
  const stats = {};
  for (const [diff, list] of Object.entries(EXPERIMENTS_BY_DIFFICULTY)) {
    /** @type {Record<number, number>} */
    const byPickCount = {};
    for (const exp of list) {
      byPickCount[exp.pickCount] = (byPickCount[exp.pickCount] || 0) + 1;
    }
    stats[diff] = {
      total: list.length,
      uniqueTitles: new Set(list.map((e) => e.title.trim())).size,
      uniquePrompts: new Set(list.map((e) => e.prompt.trim())).size,
      byPickCount,
    };
  }
  return stats;
}

/**
 * @param {number} successfulExperiments
 * @param {number} experimentsTotal
 * @param {number} mistakes
 * @param {number} maxMistakes
 */
export function isLabWin(successfulExperiments, experimentsTotal, mistakes, maxMistakes) {
  if (mistakes > maxMistakes) return false;
  return successfulExperiments >= experimentsTotal;
}

/**
 * @param {LabExperiment} experiment
 * @returns {LabItem[]}
 */
export function shelfItemsForExperiment(experiment) {
  if (!experiment?.shelfItems?.length) return [];
  return experiment.shelfItems.map((id) => LAB_ITEMS[id]).filter(Boolean);
}

/**
 * @param {DifficultyId} difficulty
 * @returns {number}
 */
export function shelfCountForDifficulty(difficulty) {
  return SHELF_SIZE_BY_DIFFICULTY[difficulty] ?? DIFFICULTIES.easy.shelfCount;
}

/**
 * @deprecated Use shelfItemsForExperiment(currentExperiment)
 * @param {DifficultyId} difficulty
 * @returns {LabItem[]}
 */
export function shelfItemsForDifficulty(difficulty) {
  const pool = EXPERIMENTS_BY_DIFFICULTY[difficulty] ?? [];
  const first = pool[0];
  return first ? shelfItemsForExperiment(first) : [];
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
export function feedbackMessageForReason(reason, pickCount) {
  switch (reason) {
    case "missing":
      return `Pick ${pickCount} items for the experiment`;
    case "partial":
      return `Pick ${pickCount} items for the experiment`;
    case "wrong":
      return "Almost! Something in your selection doesn't fit";
    case "too_many":
      return `Pick ${pickCount} items for the experiment`;
    default:
      return "Try picking items that match the mission";
  }
}

/** @param {boolean} firstTry */
export function successFeedbackMessage(firstTry) {
  return firstTry ? "Nice! You picked the right items" : "Awesome! The experiment worked";
}
