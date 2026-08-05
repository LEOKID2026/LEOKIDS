/** @typedef {'easy' || 'medium' || 'hard'} DifficultyId */

import {
  SESSION_TASK_COUNT,
  MIN_POOL_SIZE,
  pickSessionTasks,
  shuffle,
  randInt,
} from "./task-session.js";

export { SESSION_TASK_COUNT, MIN_POOL_SIZE, pickSessionTasks, shuffle, randInt };

export const DIFFICULTIES = {
  easy: { id: "easy", label: "" },
  medium: { id: "medium", label: "" },
  hard: { id: "hard", label: "" },
};

export const SCORE = {
  correct: 30,
  firstTry: 20,
  streakBonus: 10,
};

/** @deprecated use pickSessionTasks — kept for english prototypes not in current scope */
export function pickTasksForRun(difficulty, pools) {
  const list = pools[difficulty] ?? [];
  return list.slice(0, SESSION_TASK_COUNT);
}

export const TASKS_PER_LEVEL = SESSION_TASK_COUNT;
