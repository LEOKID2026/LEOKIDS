/** @typedef {'easy' | 'medium' | 'hard'} DifficultyId */
/** @typedef {'share_equally' | 'make_groups' | 'find_remainder'} GiftsMode */

import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import {
  createMathTask,
  pickBalancedSession,
  randInt,
  shuffledCopy,
} from "../../../lib/educational-games/math-task-schema.js";
import {
  pickSessionFromBands,
  TASKS_PER_SESSION,
  timeLimitForSessionIndex,
} from "../../../lib/educational-games/educational-session-standard.js";

/**
 * @typedef {{
 *   id: string
 *   gameKey: 'leo-gifts'
 *   difficulty: DifficultyId
 *   skillId: string
 *   variant: GiftsMode
 *   operands: { total: number, divisor: number, mode: GiftsMode, itemKey: string, itemEmoji: string }
 *   expectedAnswer: { quotient: number, remainder: number }
 *   representationType: string
 *   total: number
 *   children?: number
 *   groupSize?: number
 *   mode: GiftsMode
 *   itemKey: string
 *   itemEmoji: string
 * }} GiftsTask
 */

export { TASKS_PER_SESSION };

export const DIFFICULTIES = {
  easy: { id: "easy", label: "Easy" },
  medium: { id: "medium", label: "Medium" },
  hard: { id: "hard", label: "Hard" },
};

/** @type {Record<DifficultyId, [number, number, number]>} */
export const GIFTS_TIME_LIMITS_BY_BAND = {
  easy: [45, 40, 35],
  medium: [40, 35, 30],
  hard: [35, 30, 25],
};

const ITEM_TYPES = [
  { itemKey: "item_gifts", itemEmoji: "🎁" },
  { itemKey: "item_candies", itemEmoji: "🍬" },
  { itemKey: "item_stickers", itemEmoji: "⭐" },
  { itemKey: "item_stars", itemEmoji: "🌟" },
  { itemKey: "item_sweets", itemEmoji: "🍭" },
];

const GIFTS_PACK = "components__educational-games__leo-gifts__leo-gifts-data";

/**
 * @param {string} itemKey
 * @param {number} count
 */
export function giftsItemLabelForKey(itemKey, count) {
  const suffix = count === 1 ? "_one" : "_other";
  return gamePackCopy(GIFTS_PACK, `${itemKey}${suffix}`);
}

/** @param {GiftsTask} task */
function giftsItemLabel(task) {
  return giftsItemLabelForKey(task.itemKey, task.total);
}

/** @param {number} count */
export function remainingItemsText(count) {
  if (count === 0) return gamePackCopy(GIFTS_PACK, "remaining_none");
  if (count === 1) return gamePackCopy(GIFTS_PACK, "remaining_one");
  return gamePackCopy(GIFTS_PACK, "remaining_other", { count });
}

/** @param {DifficultyId} difficulty */
function giftsQuotas(difficulty) {
  if (difficulty === "easy") {
    return {
      "division.equal_sharing": 12,
      "division.make_groups": 6,
      "division.remainder": 2,
    };
  }
  if (difficulty === "medium") {
    return {
      "division.equal_sharing": 7,
      "division.make_groups": 7,
      "division.remainder": 6,
    };
  }
  return {
    "division.equal_sharing": 6,
    "division.make_groups": 6,
    "division.remainder": 5,
    "division.relation_to_multiplication": 3,
  };
}

/**
 * @param {DifficultyId} difficulty
 * @param {GiftsMode} mode
 * @param {boolean} allowRemainder
 * @param {number} salt
 * @returns {GiftsTask[]}
 */
function generateGiftsPoolForMode(difficulty, mode, allowRemainder, salt = 0) {
  const cfg =
    difficulty === "easy"
      ? { divisorMin: 2, divisorMax: 5, maxTotal: 30, quotMax: 6 }
      : difficulty === "medium"
        ? { divisorMin: 2, divisorMax: 8, maxTotal: 72, quotMax: 10 }
        : { divisorMin: 3, divisorMax: 10, maxTotal: 120, quotMax: 12 };

  /** @type {GiftsTask[]} */
  const pool = [];
  const seen = new Set();

  for (let divisor = cfg.divisorMin; divisor <= cfg.divisorMax; divisor += 1) {
    for (let quot = 1; quot <= cfg.quotMax; quot += 1) {
      const remOptions = allowRemainder ? [0, ...Array.from({ length: divisor - 1 }, (_, i) => i + 1)] : [0];
      for (const rem of remOptions) {
        if (difficulty === "easy" && rem > 0 && pool.filter((t) => t.expectedAnswer.remainder > 0).length >= 8) {
          continue;
        }
        const total = quot * divisor + rem;
        if (total < divisor || total > cfg.maxTotal) continue;
        if (rem >= divisor) continue;

        for (let itemIdx = 0; itemIdx < ITEM_TYPES.length; itemIdx += 1) {
          const item = ITEM_TYPES[(itemIdx + salt) % ITEM_TYPES.length];
          const key = `${mode}-${total}-${divisor}-${item.itemKey}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const skillId =
            mode === "find_remainder" || rem > 0
              ? rem > 0
                ? "division.remainder"
                : mode === "make_groups"
                  ? "division.make_groups"
                  : "division.equal_sharing"
              : mode === "make_groups"
                ? "division.make_groups"
                : "division.equal_sharing";

          const useRelation =
            difficulty === "hard" && rem === 0 && (pool.length + salt) % 7 === 0;

          /** @type {GiftsTask} */
          const task = {
            ...createMathTask({
              id: `g-${difficulty}-${mode}-${pool.length}`,
              gameKey: "leo-gifts",
              difficulty,
              skillId: useRelation ? "division.relation_to_multiplication" : skillId,
              variant: mode,
              operands: {
                total,
                divisor,
                mode,
                itemKey: item.itemKey,
                itemEmoji: item.itemEmoji,
              },
              expectedAnswer: { quotient: quot, remainder: rem },
              representationType: difficulty === "easy" ? "visual" : "mixed",
            }),
            total,
            mode,
            itemKey: item.itemKey,
            itemEmoji: item.itemEmoji,
          };

          if (mode === "share_equally" || mode === "find_remainder") {
            task.children = divisor;
          } else {
            task.groupSize = divisor;
          }

          pool.push(task);
        }
      }
    }
  }

  return shuffledCopy(pool);
}

/** @param {GiftsTask} task */
export function giftsTaskKey(task) {
  return `${task.mode}-${task.total}-${task.operands.divisor}-${task.itemKey}`;
}

/** @param {GiftsTask} task */
export function giftsTaskDifficultyScore(task) {
  const rem = task.expectedAnswer.remainder;
  return task.operands.divisor * 3 + task.total * 0.12 + (rem > 0 ? 10 : 0) + (task.mode === "make_groups" ? 4 : 0);
}

/** @param {DifficultyId} difficulty */
export function buildGiftsSessionRun(difficulty) {
  const salt = Math.floor(Math.random() * 10000);
  const allowRemEarly = difficulty !== "easy";
  const sharePool = generateGiftsPoolForMode(difficulty, "share_equally", allowRemEarly || difficulty === "easy", salt);
  const groupsPool = generateGiftsPoolForMode(difficulty, "make_groups", allowRemEarly, salt + 1);
  const remPool = generateGiftsPoolForMode(
    difficulty,
    difficulty === "hard" ? "find_remainder" : "share_equally",
    true,
    salt + 2,
  ).filter((t) => t.expectedAnswer.remainder > 0);

  /** @type {Record<string, GiftsTask[]>} */
  const pools = {
    "division.equal_sharing": sharePool.filter(
      (t) => t.mode === "share_equally" && t.expectedAnswer.remainder === 0,
    ),
    "division.make_groups": groupsPool.filter((t) => t.expectedAnswer.remainder === 0),
    "division.remainder": [
      ...remPool,
      ...sharePool.filter((t) => t.expectedAnswer.remainder > 0),
      ...groupsPool.filter((t) => t.expectedAnswer.remainder > 0),
    ],
    "division.relation_to_multiplication": sharePool.filter(
      (t) => t.expectedAnswer.remainder === 0 && t.skillId === "division.relation_to_multiplication",
    ),
  };

  const quotas = giftsQuotas(difficulty);
  let run = pickBalancedSession(pools, quotas, giftsTaskKey, TASKS_PER_SESSION);

  if (run.length < TASKS_PER_SESSION) {
    const opening = sharePool.sort((a, b) => giftsTaskDifficultyScore(a) - giftsTaskDifficultyScore(b));
    const mid = shuffledCopy([...sharePool, ...groupsPool]);
    const final = shuffledCopy([...groupsPool, ...remPool, ...sharePool]);
    run = pickSessionFromBands(opening, mid, final, giftsTaskKey, TASKS_PER_SESSION);
  }

  // Easy: force share_equally early, make_groups late
  if (difficulty === "easy") {
    const shares = run.filter((t) => t.mode === "share_equally").slice(0, 12);
    const groups = run.filter((t) => t.mode === "make_groups").slice(0, 6);
    const rem = run.filter((t) => t.expectedAnswer.remainder > 0).slice(0, 2);
    run = [...shares.slice(0, 10), ...groups.slice(0, 4), ...shares.slice(10), ...groups.slice(4), ...rem].slice(
      0,
      TASKS_PER_SESSION,
    );
    while (run.length < TASKS_PER_SESSION && shares.length) {
      run.push(shares[run.length % shares.length]);
    }
  }

  // Gradual difficulty: sort lightly within halves
  const mid = Math.floor(run.length / 2);
  const first = run.slice(0, mid).sort((a, b) => giftsTaskDifficultyScore(a) - giftsTaskDifficultyScore(b));
  const second = run.slice(mid).sort((a, b) => giftsTaskDifficultyScore(a) - giftsTaskDifficultyScore(b));
  run = [...first, ...second];

  const used = new Set();
  run = run.filter((t) => {
    const k = giftsTaskKey(t);
    if (used.has(k)) return false;
    used.add(k);
    return true;
  });

  while (run.length < TASKS_PER_SESSION) {
    const extras = shuffledCopy([
      ...sharePool.filter((t) => t.expectedAnswer.remainder === 0),
      ...groupsPool,
      ...sharePool.filter((t) => t.expectedAnswer.remainder > 0),
    ]);
    for (const t of extras) {
      if (run.length >= TASKS_PER_SESSION) break;
      const k = giftsTaskKey(t);
      if (used.has(k)) continue;
      used.add(k);
      run.push(t);
    }
    break;
  }

  return run.slice(0, TASKS_PER_SESSION).map((task, i) => ({
    ...task,
    id: `g-${difficulty}-run-${i}`,
  }));
}

/** @param {DifficultyId} difficulty @param {number} taskIndex0 */
export function giftsTimeLimitForTask(difficulty, taskIndex0) {
  const limits = GIFTS_TIME_LIMITS_BY_BAND[difficulty] ?? GIFTS_TIME_LIMITS_BY_BAND.easy;
  return timeLimitForSessionIndex(taskIndex0, limits);
}

/** @param {number} successful @param {number} total @param {number} mistakes @param {number} maxMistakes */
export function isGiftsWin(successful, total, mistakes, maxMistakes) {
  if (mistakes >= maxMistakes) return false;
  return successful >= total;
}

/** @param {GiftsTask} task @param {number} quotient @param {number} remainder */
export function validateGiftsDivision(task, quotient, remainder) {
  const divisor = task.operands.divisor;
  const total = task.total;
  if (quotient < 0 || remainder < 0) return { ok: false };
  if (remainder >= divisor) return { ok: false };
  if (quotient * divisor + remainder !== total) return { ok: false };
  const expectedQuot = Math.floor(total / divisor);
  const expectedRem = total % divisor;
  if (quotient !== expectedQuot || remainder !== expectedRem) return { ok: false };
  return { ok: true, expectedPer: expectedQuot, expectedRem };
}

/** @param {GiftsTask} task */
export function giftsPrompt(task) {
  const label = giftsItemLabel(task);
  const { total } = task;
  if (task.mode === "make_groups") {
    const size = task.groupSize ?? task.operands.divisor;
    if (task.expectedAnswer.remainder > 0 || task.skillId === "division.remainder") {
      return gamePackCopy("components__educational-games__leo-gifts__leo-gifts-data", "prompt_make_groups_with_remainder", { total, groupSize: size, itemLabel: label });
    }
    return gamePackCopy("components__educational-games__leo-gifts__leo-gifts-data", "prompt_make_groups", { total, groupSize: size, itemLabel: label });
  }
  const children = task.children ?? task.operands.divisor;
  if (task.expectedAnswer.remainder > 0 || task.mode === "find_remainder") {
    return gamePackCopy("components__educational-games__leo-gifts__leo-gifts-data", "prompt_share_with_remainder", { total, children, itemLabel: label });
  }
  return gamePackCopy("components__educational-games__leo-gifts__leo-gifts-data", "prompt_share_equal", { total, children, itemLabel: label });
}

/** @param {GiftsTask} task */
export function giftsSolutionText(task) {
  const parts = giftsSolutionParts(task);
  return `${parts.text}\n${parts.equation}`;
}

/**
 * @param {GiftsTask} task
 * @returns {{ text: string, equation: string }}
 */
export function giftsSolutionParts(task) {
  const q = task.expectedAnswer.quotient;
  const r = task.expectedAnswer.remainder;
  const d = task.operands.divisor;
  if (task.mode === "make_groups") {
    const size = task.groupSize ?? d;
    if (r > 0) {
      return {
        text: gamePackCopy(GIFTS_PACK, "solution_text_groups_remainder", {
          quotient: q,
          remaining: remainingItemsText(r),
        }),
        equation: `${q} × ${size} + ${r} = ${task.total}`,
      };
    }
    return {
      text: gamePackCopy(GIFTS_PACK, "solution_text_groups", { quotient: q }),
      equation: `${q} × ${size} = ${task.total}`,
    };
  }
  const children = task.children ?? d;
  if (r > 0) {
    return {
      text: gamePackCopy(GIFTS_PACK, "solution_text_share_remainder", {
        quotient: q,
        remaining: remainingItemsText(r),
      }),
      equation: `${children} × ${q} + ${r} = ${task.total}`,
    };
  }
  return {
    text: gamePackCopy(GIFTS_PACK, "solution_text_share", { quotient: q }),
    equation: `${children} × ${q} = ${task.total}`,
  };
}

/**
 * @param {boolean} ok
 * @param {GiftsTask} [task]
 */
export function giftsFeedback(ok, task) {
  if (ok) return gamePackCopy(GIFTS_PACK, "feedback_ok");
  if (task?.mode === "make_groups") {
    return gamePackCopy(GIFTS_PACK, "feedback_almost_groups");
  }
  return gamePackCopy(GIFTS_PACK, "feedback_almost_share");
}

const CHILD_EMOJIS = ["👧", "👦", "🧒", "👧🏻", "👦🏻", "🧑🏻", "👧🏼", "👦🏼", "🧑🏼", "👧", "👦", "🧒"];

/** @param {number} index */
export function childEmojiAt(index) {
  return CHILD_EMOJIS[index % CHILD_EMOJIS.length];
}

/** @param {number} childCount */
export function childrenGridClass(childCount) {
  if (childCount <= 4) return "gridFew";
  if (childCount <= 8) return "gridMedium";
  return "gridMany";
}

/** @param {GiftsTask} task */
export function giftsDivisorLabel(task) {
  return gamePackCopy("components__educational-games__leo-gifts__leo-gifts-data", task.mode === "make_groups" ? "label_bags" : "label_children");
}

/** @param {GiftsTask} task */
export function giftsQuotientLabel(task) {
  return gamePackCopy("components__educational-games__leo-gifts__leo-gifts-data", task.mode === "make_groups" ? "quotient_full_bags" : "quotient_per_child");
}

/** @param {GiftsTask | null | undefined} task @param {boolean} showRemainder */
export function giftsIdleFeedback(task, showRemainder) {
  if (task?.mode === "make_groups") {
    return showRemainder
      ? gamePackCopy(GIFTS_PACK, "idle_make_groups_remainder")
      : gamePackCopy(GIFTS_PACK, "idle_make_groups");
  }
  return showRemainder
    ? gamePackCopy(GIFTS_PACK, "idle_share_remainder")
    : gamePackCopy(GIFTS_PACK, "idle_share_equal");
}

/** Compatibility: old field name */
export function generateGiftsPool(difficulty, opts = {}) {
  return generateGiftsPoolForMode(difficulty, "share_equally", difficulty !== "easy", opts.salt ?? 0);
}
