/** @typedef {'easy' | 'medium' | 'hard'} DifficultyId */
/** @typedef {'build' | 'findTrays' | 'findPerTray' | 'findTotal' | 'sameTotal'} BakeryMode */

import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import {
  createMathTask,
  pickBalancedSession,
  randInt,
  shuffledCopy,
} from "../../../lib/educational-games/math-task-schema.js";
import {
  TASKS_PER_SESSION,
  timeLimitForSessionIndex,
} from "../../../lib/educational-games/educational-session-standard.js";

/**
 * @typedef {{
 *   id: string
 *   gameKey: 'leo-bakery'
 *   difficulty: DifficultyId
 *   skillId: string
 *   variant: BakeryMode
 *   operands: Record<string, unknown>
 *   expectedAnswer: { trays: number, perTray: number, total: number }
 *   representationType: string
 *   mode: BakeryMode
 *   trays?: number
 *   perTray?: number
 *   total?: number
 *   itemKey: string
 *   itemEmoji: string
 *   givenArrangement?: { trays: number, perTray: number }
 * }} BakeryTask
 */

export { TASKS_PER_SESSION };

export const DIFFICULTIES = {
  easy: { id: "easy", label: "Easy" },
  medium: { id: "medium", label: "Medium" },
  hard: { id: "hard", label: "Hard" },
};

/** @type {Record<DifficultyId, [number, number, number]>} */
export const BAKERY_TIME_LIMITS_BY_BAND = {
  easy: [45, 40, 35],
  medium: [40, 35, 30],
  hard: [35, 30, 25],
};

const ITEM_TYPES = [
  { itemKey: "item_cookies", itemEmoji: "🍪" },
  { itemKey: "item_cupcakes", itemEmoji: "🧁" },
  { itemKey: "item_rolls", itemEmoji: "🥖" },
  { itemKey: "item_muffins", itemEmoji: "🧁" },
  { itemKey: "item_croissants", itemEmoji: "🥐" },
];

/** @param {BakeryTask} task */
function bakeryItemLabel(task) {
  return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", task.itemKey);
}

/** @param {DifficultyId} difficulty */
function factorRange(difficulty) {
  if (difficulty === "easy") return { min: 2, max: 5, maxTotal: 25 };
  if (difficulty === "medium") return { min: 2, max: 10, maxTotal: 80 };
  return { min: 2, max: 12, maxTotal: 120 };
}

/** @param {DifficultyId} difficulty */
function bakeryQuotas(difficulty) {
  if (difficulty === "easy") {
    return {
      "multiplication.build_groups": 8,
      "multiplication.equal_groups": 6,
      "multiplication.find_product": 6,
    };
  }
  if (difficulty === "medium") {
    return {
      "multiplication.build_groups": 4,
      "multiplication.find_product": 5,
      "multiplication.find_missing_factor": 6,
      "multiplication.equivalent_arrangements": 3,
      "multiplication.inverse_relation": 2,
    };
  }
  return {
    "multiplication.build_groups": 3,
    "multiplication.find_product": 4,
    "multiplication.find_missing_factor": 6,
    "multiplication.equivalent_arrangements": 4,
    "multiplication.inverse_relation": 3,
  };
}

/**
 * @param {number} trays
 * @param {number} perTray
 * @param {number} maxF
 */
function alternateFactors(trays, perTray, maxF) {
  const total = trays * perTray;
  /** @type {{ trays: number, perTray: number }[]} */
  const alts = [];
  for (let t = 2; t <= maxF; t += 1) {
    if (total % t !== 0) continue;
    const p = total / t;
    if (p < 2 || p > maxF) continue;
    if (t === trays && p === perTray) continue;
    alts.push({ trays: t, perTray: p });
  }
  return alts;
}

/**
 * @param {DifficultyId} difficulty
 * @param {BakeryMode} mode
 * @param {number} salt
 */
function generateBakeryPoolForMode(difficulty, mode, salt = 0) {
  const { min, max, maxTotal } = factorRange(difficulty);
  /** @type {BakeryTask[]} */
  const pool = [];
  const seen = new Set();

  for (let trays = min; trays <= max; trays += 1) {
    for (let perTray = min; perTray <= max; perTray += 1) {
      const total = trays * perTray;
      if (total < 4 || total > maxTotal) continue;
      if (difficulty === "easy" && (trays > 5 || perTray > 5)) continue;

      for (let itemIdx = 0; itemIdx < ITEM_TYPES.length; itemIdx += 1) {
        const item = ITEM_TYPES[(itemIdx + salt) % ITEM_TYPES.length];
        const key = `${mode}-${trays}-${perTray}-${item.itemKey}`;
        if (seen.has(key)) continue;

        if (mode === "sameTotal") {
          const alts = alternateFactors(trays, perTray, max);
          if (!alts.length) continue;
        }

        seen.add(key);

        let skillId = "multiplication.build_groups";
        if (mode === "findTotal") skillId = "multiplication.find_product";
        else if (mode === "findTrays" || mode === "findPerTray") skillId = "multiplication.find_missing_factor";
        else if (mode === "sameTotal") skillId = "multiplication.equivalent_arrangements";
        else if (mode === "build") skillId = "multiplication.build_groups";

        if (difficulty === "hard" && (mode === "findTrays" || mode === "findPerTray") && (pool.length + salt) % 5 === 0) {
          skillId = "multiplication.inverse_relation";
        }

        /** @type {BakeryTask} */
        const task = {
          ...createMathTask({
            id: `b-${difficulty}-${mode}-${pool.length}`,
            gameKey: "leo-bakery",
            difficulty,
            skillId,
            variant: mode,
            operands: { mode, trays, perTray, total, itemKey: item.itemKey },
            expectedAnswer: { trays, perTray, total },
            representationType: difficulty === "easy" ? "visual" : difficulty === "medium" ? "mixed" : "numeric",
          }),
          mode,
          itemKey: item.itemKey,
          itemEmoji: item.itemEmoji,
        };

        if (mode === "build") {
          task.trays = trays;
          task.perTray = perTray;
        } else if (mode === "findTotal") {
          task.trays = trays;
          task.perTray = perTray;
        } else if (mode === "findTrays") {
          task.total = total;
          task.perTray = perTray;
        } else if (mode === "findPerTray") {
          task.total = total;
          task.trays = trays;
        } else if (mode === "sameTotal") {
          task.total = total;
          task.givenArrangement = { trays, perTray };
          const alts = alternateFactors(trays, perTray, max);
          const pick = alts[(pool.length + salt) % alts.length];
          task.expectedAnswer = { trays: pick.trays, perTray: pick.perTray, total };
          task.operands = {
            mode,
            givenTrays: trays,
            givenPerTray: perTray,
            total,
            acceptedArrangements: alts,
            itemKey: item.itemKey,
          };
        }

        pool.push(task);
      }
    }
  }

  return shuffledCopy(pool);
}

/** @param {BakeryTask} task */
export function bakeryTaskKey(task) {
  const e = bakeryExpected(task);
  if (task.mode === "sameTotal") {
    const g = task.givenArrangement;
    return `same-${g?.trays}x${g?.perTray}-${task.itemKey}`;
  }
  return `${task.mode}-${e.trays}-${e.perTray}-${e.total}-${task.itemKey}`;
}

/** @param {BakeryTask} task */
export function bakeryTaskDifficultyScore(task) {
  const e = bakeryExpected(task);
  let score = e.total + e.trays * 2;
  if (task.mode === "findTotal") score += 8;
  if (task.mode === "findTrays" || task.mode === "findPerTray") score += 20;
  if (task.mode === "sameTotal") score += 28;
  return score;
}

/** @param {DifficultyId} difficulty */
export function buildBakerySessionRun(difficulty) {
  const salt = Math.floor(Math.random() * 10000);
  const build = generateBakeryPoolForMode(difficulty, "build", salt);
  const findTotal = generateBakeryPoolForMode(difficulty, "findTotal", salt + 1);
  const findTrays = generateBakeryPoolForMode(difficulty, "findTrays", salt + 2);
  const findPerTray = generateBakeryPoolForMode(difficulty, "findPerTray", salt + 3);
  const sameTotal = generateBakeryPoolForMode(difficulty, "sameTotal", salt + 4);

  /** @type {Record<string, BakeryTask[]>} */
  const pools = {
    "multiplication.build_groups": build,
    "multiplication.equal_groups": build,
    "multiplication.find_product": findTotal,
    "multiplication.find_missing_factor": shuffledCopy([...findTrays, ...findPerTray]),
    "multiplication.equivalent_arrangements": sameTotal,
    "multiplication.inverse_relation": shuffledCopy([...findTrays, ...findPerTray]),
  };

  let run = pickBalancedSession(pools, bakeryQuotas(difficulty), bakeryTaskKey, TASKS_PER_SESSION);

  if (difficulty === "easy") {
    run = [
      ...build.slice(0, 8),
      ...build.slice(8, 14),
      ...findTotal.slice(0, 6),
    ].slice(0, TASKS_PER_SESSION);
  }

  const used = new Set();
  run = run.filter((t) => {
    const k = bakeryTaskKey(t);
    if (used.has(k)) return false;
    used.add(k);
    return true;
  });

  while (run.length < TASKS_PER_SESSION) {
    for (const t of shuffledCopy([...build, ...findTotal, ...findTrays, ...findPerTray, ...sameTotal])) {
      if (run.length >= TASKS_PER_SESSION) break;
      const k = bakeryTaskKey(t);
      if (used.has(k)) continue;
      if (difficulty === "easy" && (t.mode === "findTrays" || t.mode === "findPerTray" || t.mode === "sameTotal")) continue;
      used.add(k);
      run.push(t);
    }
    break;
  }

  const mid = Math.floor(run.length / 2);
  run = [
    ...run.slice(0, mid).sort((a, b) => bakeryTaskDifficultyScore(a) - bakeryTaskDifficultyScore(b)),
    ...run.slice(mid).sort((a, b) => bakeryTaskDifficultyScore(a) - bakeryTaskDifficultyScore(b)),
  ];

  return run.slice(0, TASKS_PER_SESSION).map((task, i) => ({
    ...task,
    id: `b-${difficulty}-run-${i}`,
  }));
}

/** @param {DifficultyId} difficulty @param {number} taskIndex0 */
export function bakeryTimeLimitForTask(difficulty, taskIndex0) {
  const limits = BAKERY_TIME_LIMITS_BY_BAND[difficulty] ?? BAKERY_TIME_LIMITS_BY_BAND.easy;
  return timeLimitForSessionIndex(taskIndex0, limits);
}

/** @param {number} successful @param {number} total @param {number} mistakes @param {number} maxMistakes */
export function isBakeryWin(successful, total, mistakes, maxMistakes) {
  if (mistakes >= maxMistakes) return false;
  return successful >= total;
}

/** @param {BakeryTask} task */
export function bakeryExpected(task) {
  if (task.mode === "sameTotal") {
    return task.expectedAnswer;
  }
  if (task.mode === "build" || task.mode === "findTotal") {
    const trays = task.trays ?? 0;
    const perTray = task.perTray ?? 0;
    return { trays, perTray, total: trays * perTray };
  }
  if (task.mode === "findTrays") {
    const total = task.total ?? 0;
    const perTray = task.perTray ?? 1;
    return { trays: Math.floor(total / perTray), perTray, total };
  }
  if (task.mode === "findPerTray") {
    const trays = task.trays ?? 1;
    const total = task.total ?? 0;
    return { trays, perTray: Math.floor(total / trays), total };
  }
  const trays = task.trays ?? 0;
  const perTray = task.perTray ?? 0;
  return { trays, perTray, total: trays * perTray };
}

/**
 * @param {BakeryTask} task
 * @param {{ trays: number, perTray: number, total: number }} answer
 */
export function validateBakery(task, answer) {
  if (task.mode === "sameTotal") {
    const total = task.total ?? task.expectedAnswer.total;
    const alts = /** @type {{ trays: number, perTray: number }[]} */ (
      task.operands.acceptedArrangements || []
    );
    const given = task.givenArrangement;
    const okTotal = answer.trays * answer.perTray === total && answer.total === total;
    const isAlt = alts.some((a) => a.trays === answer.trays && a.perTray === answer.perTray);
    const sameAsGiven = given && answer.trays === given.trays && answer.perTray === given.perTray;
    const ok = okTotal && isAlt && !sameAsGiven;
    return { ok, expected: task.expectedAnswer };
  }

  const expected = bakeryExpected(task);
  const ok =
    answer.trays === expected.trays &&
    answer.perTray === expected.perTray &&
    answer.total === expected.total;
  return { ok, expected };
}

/** @param {BakeryTask} task */
export function bakeryPrompt(task) {
  const label = bakeryItemLabel(task);
  if (task.mode === "build") return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", "prompt_build", { trays: task.trays, perTray: task.perTray, itemLabel: label });
  if (task.mode === "findTrays") return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", "prompt_find_trays", { total: task.total, perTray: task.perTray, itemLabel: label });
  if (task.mode === "findPerTray") return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", "prompt_find_per_tray", { total: task.total, trays: task.trays, itemLabel: label });
  if (task.mode === "findTotal") return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", "prompt_find_total", { trays: task.trays, perTray: task.perTray, itemLabel: label });
  if (task.mode === "sameTotal") {
    const g = task.givenArrangement;
    return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", "prompt_same_total", { givenTrays: g?.trays, givenPerTray: g?.perTray, total: task.total });
  }
  return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", "prompt_build_fallback", { itemLabel: label });
}

/** @param {BakeryTask} task */
export function bakeryControlHint(task) {
  const key =
    {
      build: "control_build",
      findTotal: "control_find_total",
      findTrays: "control_find_trays",
      findPerTray: "control_find_per_tray",
      sameTotal: "control_same_total",
    }[task.mode] || "control_build";
  return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", key);
}

/**
 * @param {BakeryTask} task
 * @returns {{ text: string, equation: string }}
 */
export function bakerySolutionParts(task) {
  const e = bakeryExpected(task);
  const pack = "components__educational-games__leo-bakery__leo-bakery-data";
  if (task.mode === "sameTotal") {
    return {
      text: gamePackCopy(pack, "solution_text_same_total", { trays: e.trays, perTray: e.perTray }),
      equation: `${e.trays} × ${e.perTray} = ${e.total}`,
    };
  }
  if (task.mode === "findTrays") {
    return {
      text: gamePackCopy(pack, "solution_text_find_trays", { trays: e.trays }),
      equation: `${e.trays} × ${e.perTray} = ${e.total}`,
    };
  }
  if (task.mode === "findPerTray") {
    return {
      text: gamePackCopy(pack, "solution_text_find_per_tray", { perTray: e.perTray }),
      equation: `${e.trays} × ${e.perTray} = ${e.total}`,
    };
  }
  return {
    text: gamePackCopy(pack, "solution_text_default"),
    equation: `${e.trays} × ${e.perTray} = ${e.total}`,
  };
}

/** @param {BakeryTask} task */
export function bakerySolutionText(task) {
  const parts = bakerySolutionParts(task);
  return `${parts.text}\n${parts.equation}`;
}

/** @param {boolean} ok */
export function bakeryFeedback(ok) {
  return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", ok ? "feedback_ok" : "feedback_almost");
}

/** @param {number} count @param {string} emoji @param {string} [representationType] */
export function trayItemDisplay(count, emoji, representationType = "visual") {
  if (representationType === "numeric" || count > 6) {
    return { type: "multiply", text: `${emoji} × ${count}` };
  }
  if (count <= 4) return { type: "icons", text: emoji.repeat(count) };
  return { type: "multiply", text: `${emoji} × ${count}` };
}

/** @param {BakeryTask} task */
export function bakeryInfoBar(task) {
  const label = bakeryItemLabel(task);
  if (task.mode === "findTrays") return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", "info_find_trays", { total: task.total, perTray: task.perTray, itemLabel: label });
  if (task.mode === "findPerTray") return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", "info_find_per_tray", { total: task.total, trays: task.trays, itemLabel: label });
  if (task.mode === "findTotal") return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", "info_find_total", { trays: task.trays, perTray: task.perTray, itemLabel: label });
  if (task.mode === "sameTotal") {
    const g = task.givenArrangement;
    return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", "info_same_total_given", { givenTrays: g?.trays, givenPerTray: g?.perTray, total: task.total });
  }
  return gamePackCopy("components__educational-games__leo-bakery__leo-bakery-data", "info_find_total", { trays: task.trays, perTray: task.perTray, itemLabel: label });
}

export function generateBakeryPool(difficulty, opts = {}) {
  return generateBakeryPoolForMode(difficulty, "build", opts.salt ?? 0);
}
