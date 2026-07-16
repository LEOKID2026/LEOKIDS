import { applyArcadeCoinMove } from "../../arcade/server/arcade-coins.js";
import { requireEducationalGameRules } from "../../rewards/server/economy-config.server.js";
import { difficultyLabelHe } from "../educational-game-registry.js";
import {
  getEducationalPositiveProgress,
  zeroProgressCoinResult,
} from "../../games/server/positive-progress.server.js";

const EDUCATIONAL_COIN_SOURCE_TYPE = "educational_game";

const RECYCLING_FACTORY_MAX_SCORE = Object.freeze({
  easy: 450,
  medium: 700,
  hard: 950,
});

const LEO_SUPERMARKET_MAX_SCORE = Object.freeze({
  easy: 3500,
  medium: 4000,
  hard: 4500,
});

const LEO_LAB_MAX_SCORE = Object.freeze({
  easy: 1200,
  medium: 1300,
  hard: 1400,
});

const LEO_PIZZERIA_MAX_SCORE = Object.freeze({
  easy: 1200,
  medium: 1300,
  hard: 1400,
});

const LEO_CONTINUOUS_MAX_SCORE = Object.freeze({
  easy: 8000,
  medium: 10000,
  hard: 12000,
});

const LEO_NUMBER_PATH_MAX_SCORE = Object.freeze({
  easy: 500,
  medium: 550,
  hard: 600,
});

const LEO_LANGUAGE_TASK_MAX_SCORE = Object.freeze({
  easy: 900,
  medium: 1000,
  hard: 1100,
});

function clampInt(n, min, max) {
  const v = Math.floor(Number(n) || 0);
  return Math.max(min, Math.min(max, v));
}

function clampFloat(n, min, max) {
  const v = Number(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, v));
}

function mapByDifficulty(rulesObj, diff, fallback) {
  if (rulesObj && typeof rulesObj === "object" && rulesObj[diff] != null) {
    return clampInt(rulesObj[diff], 0, 100000);
  }
  return fallback;
}

function calculateRecyclingFactoryCoins(diff, metrics, rules) {
  const progress = getEducationalPositiveProgress("recycling-factory", metrics);
  const zero = zeroProgressCoinResult(progress);
  if (zero) {
    return { ...zero, displayLevelHe: difficultyLabelHe(diff) };
  }

  const maxCoins = clampInt(rules?.maxCoins, 1, 1000000);
  const baseRate = mapByDifficulty(
    rules?.basePerCorrectItem,
    diff,
    diff === "easy" ? 3 : diff === "hard" ? 5 : 4,
  );
  const completeBonus = mapByDifficulty(
    rules?.completeTargetBonus,
    diff,
    diff === "easy" ? 35 : diff === "hard" ? 65 : 50,
  );

  const itemsSorted = progress;
  const accuracy = clampFloat(metrics?.accuracy, 0, 1);
  const bestStreak = clampInt(metrics?.bestStreak, 0, 200);
  const didWin = metrics?.didWin === true;
  const score = clampInt(metrics?.score, 0, 100000);

  let coins = itemsSorted * baseRate;
  const breakdown = [`Correct sorts (${itemsSorted}): ${itemsSorted * baseRate}`];

  if (accuracy >= 0.9) {
    const bonusPct = clampFloat(rules?.accuracyBonus90, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`High accuracy: +${bonus}`);
    }
  } else if (accuracy >= 0.75) {
    const bonusPct = clampFloat(rules?.accuracyBonus75, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`Good accuracy: +${bonus}`);
    }
  }

  if (bestStreak >= 10) {
    const streakBonus = clampInt(rules?.bestStreakBonus10, 0, maxCoins);
    if (streakBonus > 0) {
      coins += streakBonus;
      breakdown.push(`Streak ${bestStreak}: +${streakBonus}`);
    }
  }

  if (didWin && completeBonus > 0) {
    coins += completeBonus;
    breakdown.push(`Goal completed: +${completeBonus}`);
  }

  const highThreshold = clampInt(rules?.highScoreBonusThreshold, 0, 100000);
  const highBonus = clampInt(rules?.highScoreBonus, 0, maxCoins);
  if (didWin && score >= highThreshold && highBonus > 0) {
    coins += highBonus;
    breakdown.push(`High score: +${highBonus}`);
  }

  coins = clampInt(coins, 0, maxCoins);
  return {
    coins,
    breakdownHe: breakdown.join(" · ") || "-",
    displayLevelHe: difficultyLabelHe(diff),
  };
}

function calculateLeoSupermarketCoins(diff, metrics, rules) {
  const progress = getEducationalPositiveProgress("leo-supermarket", metrics);
  const zero = zeroProgressCoinResult(progress);
  if (zero) {
    return { ...zero, displayLevelHe: difficultyLabelHe(diff) };
  }

  const maxCoins = clampInt(rules?.maxCoins, 1, 1000000);
  const correct = progress;
  const accuracy = clampFloat(metrics?.accuracy, 0, 1);
  const bestStreak = clampInt(metrics?.bestStreak, 0, 30);

  const correctRate = mapByDifficulty(
    rules?.bonusPerCorrectCustomer,
    diff,
    diff === "easy" ? 7 : diff === "hard" ? 13 : 10,
  );
  const completeBonus = mapByDifficulty(
    rules?.completeAll30Bonus,
    diff,
    diff === "easy" ? 40 : diff === "hard" ? 80 : 60,
  );

  let coins = correct * correctRate;
  const breakdown = [`Correct customers (${correct}): ${correct * correctRate}`];

  if (accuracy >= 0.9) {
    const bonusPct = clampFloat(rules?.accuracyBonus90, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`High accuracy: +${bonus}`);
    }
  } else if (accuracy >= 0.75) {
    const bonusPct = clampFloat(rules?.accuracyBonus75, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`Good accuracy: +${bonus}`);
    }
  }

  if (bestStreak >= 10) {
    const streakBonus = clampInt(rules?.bestStreakBonus10, 0, maxCoins);
    if (streakBonus > 0) {
      coins += streakBonus;
      breakdown.push(`Streak ${bestStreak}: +${streakBonus}`);
    }
  }

  if (metrics?.completedAllCustomers === true && completeBonus > 0) {
    coins += completeBonus;
    breakdown.push(`20 customers: +${completeBonus}`);
  }

  coins = clampInt(coins, 0, maxCoins);
  return {
    coins,
    breakdownHe: breakdown.join(" · ") || "-",
    displayLevelHe: difficultyLabelHe(diff),
  };
}

function calculateLeoLabCoins(diff, metrics, rules) {
  const progress = getEducationalPositiveProgress("leo-lab", metrics);
  const zero = zeroProgressCoinResult(progress);
  if (zero) {
    return { ...zero, displayLevelHe: difficultyLabelHe(diff) };
  }

  const maxCoins = clampInt(rules?.maxCoins, 1, 1000000);
  const successful = progress;
  const accuracy = clampFloat(metrics?.accuracy, 0, 1);
  const bestStreak = clampInt(metrics?.bestStreak, 0, 20);

  const successRate = mapByDifficulty(
    rules?.bonusPerSuccessfulExperiment,
    diff,
    diff === "easy" ? 4 : diff === "hard" ? 8 : 6,
  );
  const completeBonus = mapByDifficulty(
    rules?.completeAll20Bonus,
    diff,
    diff === "easy" ? 35 : diff === "hard" ? 65 : 50,
  );

  let coins = successful * successRate;
  const breakdown = [`Successful experiments (${successful}): ${successful * successRate}`];

  if (accuracy >= 0.9) {
    const bonusPct = clampFloat(rules?.accuracyBonus90, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`High accuracy: +${bonus}`);
    }
  } else if (accuracy >= 0.8) {
    const bonusPct = clampFloat(rules?.accuracyBonus80, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`Good accuracy: +${bonus}`);
    }
  }

  if (bestStreak >= 5) {
    const streakBonus = clampInt(rules?.bestStreakBonus5, 0, maxCoins);
    if (streakBonus > 0) {
      coins += streakBonus;
      breakdown.push(`Streak ${bestStreak}: +${streakBonus}`);
    }
  }

  if (metrics?.completedAllExperiments === true && completeBonus > 0) {
    coins += completeBonus;
    breakdown.push(`20 experiments: +${completeBonus}`);
  }

  coins = clampInt(coins, 0, maxCoins);
  return {
    coins,
    breakdownHe: breakdown.join(" · ") || "-",
    displayLevelHe: difficultyLabelHe(diff),
  };
}

function calculateLeoPizzeriaCoins(diff, metrics, rules) {
  const progress = getEducationalPositiveProgress("leo-pizzeria", metrics);
  const zero = zeroProgressCoinResult(progress);
  if (zero) {
    return { ...zero, displayLevelHe: difficultyLabelHe(diff) };
  }

  const maxCoins = clampInt(rules?.maxCoins, 1, 1000000);
  const successful = progress;
  const accuracy = clampFloat(metrics?.accuracy, 0, 1);
  const bestStreak = clampInt(metrics?.bestStreak, 0, 20);

  const successRate = mapByDifficulty(
    rules?.bonusPerSuccessfulCustomer,
    diff,
    diff === "easy" ? 4 : diff === "hard" ? 8 : 6,
  );
  const completeBonus = mapByDifficulty(
    rules?.completeAll20Bonus,
    diff,
    diff === "easy" ? 35 : diff === "hard" ? 65 : 50,
  );

  let coins = successful * successRate;
  const breakdown = [`Customers served (${successful}): ${successful * successRate}`];

  if (accuracy >= 0.9) {
    const bonusPct = clampFloat(rules?.accuracyBonus90, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`High accuracy: +${bonus}`);
    }
  } else if (accuracy >= 0.8) {
    const bonusPct = clampFloat(rules?.accuracyBonus80, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`Good accuracy: +${bonus}`);
    }
  }

  if (bestStreak >= 5) {
    const streakBonus = clampInt(rules?.bestStreakBonus5, 0, maxCoins);
    if (streakBonus > 0) {
      coins += streakBonus;
      breakdown.push(`Streak ${bestStreak}: +${streakBonus}`);
    }
  }

  if (metrics?.completedAllCustomers === true && completeBonus > 0) {
    coins += completeBonus;
    breakdown.push(`20 customers: +${completeBonus}`);
  }

  coins = clampInt(coins, 0, maxCoins);
  return {
    coins,
    breakdownHe: breakdown.join(" · ") || "-",
    displayLevelHe: difficultyLabelHe(diff),
  };
}

function calculateLeoContinuousCoins(diff, metrics, rules, progressLabel) {
  const progress = clampInt(metrics?.successfulQuestions, 0, 20);
  const zero = zeroProgressCoinResult(progress);
  if (zero) {
    return { ...zero, displayLevelHe: difficultyLabelHe(diff) };
  }

  const maxCoins = clampInt(rules?.maxCoins, 1, 1000000);
  const accuracy = clampFloat(metrics?.accuracy, 0, 1);
  const bestStreak = clampInt(metrics?.bestStreak, 0, 50);

  const successRate = mapByDifficulty(
    rules?.bonusPerSuccessfulQuestion,
    diff,
    diff === "easy" ? 4 : diff === "hard" ? 8 : 6,
  );
  const milestoneBonus = mapByDifficulty(
    rules?.milestoneBonus25,
    diff,
    diff === "easy" ? 30 : diff === "hard" ? 60 : 45,
  );

  let coins = progress * successRate;
  const breakdown = [`${progressLabel} (${progress}): ${progress * successRate}`];

  if (accuracy >= 0.9) {
    const bonusPct = clampFloat(rules?.accuracyBonus90, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`High accuracy: +${bonus}`);
    }
  } else if (accuracy >= 0.8) {
    const bonusPct = clampFloat(rules?.accuracyBonus80, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`Good accuracy: +${bonus}`);
    }
  }

  if (bestStreak >= 5) {
    const streakBonus = clampInt(rules?.bestStreakBonus5, 0, maxCoins);
    if (streakBonus > 0) {
      coins += streakBonus;
      breakdown.push(`Streak ${bestStreak}: +${streakBonus}`);
    }
  }

  if (progress >= 20 && milestoneBonus > 0) {
    coins += milestoneBonus;
    breakdown.push(`Milestone 20: +${milestoneBonus}`);
  }

  coins = clampInt(coins, 0, maxCoins);
  return {
    coins,
    breakdownHe: breakdown.join(" · ") || "-",
    displayLevelHe: difficultyLabelHe(diff),
  };
}

function calculateLeoGiftsCoins(diff, metrics, rules) {
  return calculateLeoContinuousCoins(diff, metrics, rules, "Correct answers");
}

function calculateLeoBakeryCoins(diff, metrics, rules) {
  return calculateLeoContinuousCoins(diff, metrics, rules, "Correct orders");
}

function calculateLeoNumberPathCoins(diff, metrics, rules) {
  const progress = clampInt(metrics?.successfulTasks, 0, 20);
  const zero = zeroProgressCoinResult(progress);
  if (zero) {
    return { ...zero, displayLevelHe: difficultyLabelHe(diff) };
  }

  const maxCoins = clampInt(rules?.maxCoins, 1, 1000000);
  const accuracy = clampFloat(metrics?.accuracy, 0, 1);
  const bestStreak = clampInt(metrics?.bestStreak, 0, 20);

  const successRate = mapByDifficulty(
    rules?.bonusPerSuccessfulTask,
    diff,
    diff === "easy" ? 8 : diff === "hard" ? 14 : 11,
  );
  const completeBonus = mapByDifficulty(
    rules?.completeAll12Bonus,
    diff,
    diff === "easy" ? 35 : diff === "hard" ? 65 : 50,
  );

  let coins = progress * successRate;
  const breakdown = [`Successful tasks (${progress}): ${progress * successRate}`];

  if (accuracy >= 0.9) {
    const bonusPct = clampFloat(rules?.accuracyBonus90, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`High accuracy: +${bonus}`);
    }
  } else if (accuracy >= 0.8) {
    const bonusPct = clampFloat(rules?.accuracyBonus80, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`Good accuracy: +${bonus}`);
    }
  }

  if (bestStreak >= 5) {
    const streakBonus = clampInt(rules?.bestStreakBonus5, 0, maxCoins);
    if (streakBonus > 0) {
      coins += streakBonus;
      breakdown.push(`Streak ${bestStreak}: +${streakBonus}`);
    }
  }

  if (metrics?.completedAllTasks === true && completeBonus > 0) {
    coins += completeBonus;
    breakdown.push(`20 tasks: +${completeBonus}`);
  }

  coins = clampInt(coins, 0, maxCoins);
  return {
    coins,
    breakdownHe: breakdown.join(" · ") || "-",
    displayLevelHe: difficultyLabelHe(diff),
  };
}

function calculateLeoLanguageTaskCoins(diff, metrics, rules) {
  const progress = clampInt(metrics?.successfulTasks, 0, 20);
  const zero = zeroProgressCoinResult(progress);
  if (zero) {
    return { ...zero, displayLevelHe: difficultyLabelHe(diff) };
  }

  const maxCoins = clampInt(rules?.maxCoins, 1, 1000000);
  const accuracy = clampFloat(metrics?.accuracy, 0, 1);
  const bestStreak = clampInt(metrics?.bestStreak, 0, 20);

  const successRate = mapByDifficulty(
    rules?.bonusPerSuccessfulTask,
    diff,
    diff === "easy" ? 6 : diff === "hard" ? 10 : 8,
  );
  const completeBonus = mapByDifficulty(
    rules?.completeAll20Bonus,
    diff,
    diff === "easy" ? 40 : diff === "hard" ? 70 : 55,
  );

  let coins = progress * successRate;
  const breakdown = [`Successful tasks (${progress}): ${progress * successRate}`];

  if (accuracy >= 0.9) {
    const bonusPct = clampFloat(rules?.accuracyBonus90, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`High accuracy: +${bonus}`);
    }
  } else if (accuracy >= 0.8) {
    const bonusPct = clampFloat(rules?.accuracyBonus80, 0, 1);
    const bonus = Math.floor(coins * bonusPct);
    if (bonus > 0) {
      coins += bonus;
      breakdown.push(`Good accuracy: +${bonus}`);
    }
  }

  if (bestStreak >= 5) {
    const streakBonus = clampInt(rules?.bestStreakBonus5, 0, maxCoins);
    if (streakBonus > 0) {
      coins += streakBonus;
      breakdown.push(`Streak ${bestStreak}: +${streakBonus}`);
    }
  }

  if (metrics?.completedAllTasks === true && completeBonus > 0) {
    coins += completeBonus;
    breakdown.push(`20 tasks: +${completeBonus}`);
  }

  coins = clampInt(coins, 0, maxCoins);
  return {
    coins,
    breakdownHe: breakdown.join(" · ") || "-",
    displayLevelHe: difficultyLabelHe(diff),
  };
}

function calculateLeoWordTrainCoins(diff, metrics, rules) {
  return calculateLeoLanguageTaskCoins(diff, metrics, rules);
}

function calculateLeoWordDetectiveCoins(diff, metrics, rules) {
  return calculateLeoLanguageTaskCoins(diff, metrics, rules);
}

/**
 * @param {Record<string, unknown>} metrics
 * @param {string|null|undefined} difficulty
 * @param {Record<string, unknown>} rules
 */
export function calculateEducationalGameCoins(gameKey, difficulty, metrics, rules) {
  const diff = String(difficulty || metrics?.difficulty || "medium").toLowerCase();
  if (gameKey === "leo-supermarket") {
    return calculateLeoSupermarketCoins(diff, metrics, rules);
  }
  if (gameKey === "leo-lab") {
    return calculateLeoLabCoins(diff, metrics, rules);
  }
  if (gameKey === "leo-pizzeria") {
    return calculateLeoPizzeriaCoins(diff, metrics, rules);
  }
  if (gameKey === "leo-gifts") {
    return calculateLeoGiftsCoins(diff, metrics, rules);
  }
  if (gameKey === "leo-bakery") {
    return calculateLeoBakeryCoins(diff, metrics, rules);
  }
  if (gameKey === "leo-number-path") {
    return calculateLeoNumberPathCoins(diff, metrics, rules);
  }
  if (gameKey === "leo-word-train") {
    return calculateLeoWordTrainCoins(diff, metrics, rules);
  }
  if (gameKey === "leo-word-detective") {
    return calculateLeoWordDetectiveCoins(diff, metrics, rules);
  }
  return calculateRecyclingFactoryCoins(diff, metrics, rules);
}

function validateRecyclingFactoryMetrics(metrics, diff, score) {
  const sortedItems = Number(metrics?.sortedItems);
  const correctItems = Number(metrics?.correctItems);
  const wrongItems = Number(metrics?.wrongItems);
  const missedItems = Number(metrics?.missedItems);
  const mistakes = Number(metrics?.mistakes);
  const bestStreak = Number(metrics?.bestStreak);
  const durationSec = Number(metrics?.durationSec);
  const accuracy = Number(metrics?.accuracy);

  for (const [val, max, label] of [
    [sortedItems, 100, "Items sorted"],
    [correctItems, 100, "Correct items"],
    [wrongItems, 50, "Sort mistakes"],
    [missedItems, 50, "Missed items"],
    [mistakes, 50, "Mistakes"],
    [bestStreak, 100, "Streak"],
    [durationSec, 3600, "Duration"],
  ]) {
    if (!Number.isFinite(val) || val < 0 || val > max) {
      return { ok: false, message: `Invalid ${label}` };
    }
  }

  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 1) {
    return { ok: false, message: "Invalid accuracy" };
  }

  const cap = RECYCLING_FACTORY_MAX_SCORE[diff] || 950;
  if (score > cap) return { ok: false, message: "Score out of range" };
  const expectedSorted = 20;
  if (metrics?.didWin === true && sortedItems < expectedSorted) {
    return { ok: false, message: "Invalid item count" };
  }
  if (correctItems > sortedItems + 2) {
    return { ok: false, message: "Invalid sorting data" };
  }
  if (Math.abs(mistakes - (wrongItems + missedItems)) > 1) {
    return { ok: false, message: "Invalid mistake count" };
  }

  return { ok: true };
}

function validateLeoSupermarketMetrics(metrics, diff, score) {
  const customersTotal = Number(metrics?.customersTotal);
  const customersReached = Number(metrics?.customersReached);
  const customersCompleted = Number(metrics?.customersCompleted);
  const correctCustomers = Number(metrics?.correctCustomers);
  const wrongProducts = Number(metrics?.wrongProducts);
  const wrongChange = Number(metrics?.wrongChange);
  const timeoutMistakes = Number(metrics?.timeoutMistakes);
  const mistakes = Number(metrics?.mistakes);
  const bestStreak = Number(metrics?.bestStreak);
  const durationSec = Number(metrics?.durationSec);
  const accuracy = Number(metrics?.accuracy);

  for (const [val, max, label] of [
    [customersTotal, 20, "Total customers"],
    [customersReached, 20, "Customers reached"],
    [customersCompleted, 20, "Customers completed"],
    [correctCustomers, 20, "Correct customers"],
    [wrongProducts, 20, "Product mistakes"],
    [wrongChange, 20, "Change mistakes"],
    [timeoutMistakes, 20, "Timeouts"],
    [mistakes, 20, "Failures"],
    [bestStreak, 20, "Streak"],
    [durationSec, 3600, "Duration"],
  ]) {
    if (!Number.isFinite(val) || val < 0 || val > max) {
      return { ok: false, message: `Invalid ${label}` };
    }
  }

  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 1) {
    return { ok: false, message: "Invalid accuracy" };
  }

  if (customersTotal !== 20) {
    return { ok: false, message: "Invalid total customers" };
  }
  if (customersReached > customersTotal || customersCompleted > customersTotal) {
    return { ok: false, message: "Invalid customer counts" };
  }
  if (correctCustomers > customersCompleted + 1) {
    return { ok: false, message: "Invalid correct customers" };
  }
  if (Math.abs(mistakes - (wrongProducts + wrongChange + timeoutMistakes)) > 1) {
    return { ok: false, message: "Invalid failure count" };
  }

  const cap = LEO_SUPERMARKET_MAX_SCORE[diff] || 4500;
  if (score > cap) return { ok: false, message: "Score out of range" };

  return { ok: true };
}

function buildLeoSupermarketFinishPresentation(metrics) {
  const correct = clampInt(metrics?.correctCustomers, 0, 20);
  return {
    subtitleHe: `Nice work! You served ${correct} customers and helped Leo at the grocery store`,
    statsLines: [
      { label: "Customers reached", value: String(clampInt(metrics?.customersReached, 0, 20)) },
      { label: "Customers completed", value: String(clampInt(metrics?.customersCompleted, 0, 20)) },
      { label: "Correct customers", value: String(correct) },
      { label: "Accuracy", value: `${Math.round(clampFloat(metrics?.accuracy, 0, 1) * 100)}%` },
      { label: "Failures", value: String(clampInt(metrics?.mistakes, 0, 20)) },
      { label: "Best streak", value: String(clampInt(metrics?.bestStreak, 0, 20)) },
    ],
  };
}

function buildLeoLabFinishPresentation(metrics) {
  const successful = clampInt(metrics?.successfulExperiments, 0, 20);
  return {
    subtitleHe: `Nice work! You completed ${successful} experiments in Leo's lab`,
    statsLines: [
      { label: "Experiments reached", value: String(clampInt(metrics?.experimentsReached, 0, 20)) },
      { label: "Successful experiments", value: String(successful) },
      { label: "Mistakes", value: String(clampInt(metrics?.mistakes, 0, 20)) },
      { label: "Accuracy", value: `${Math.round(clampFloat(metrics?.accuracy, 0, 1) * 100)}%` },
      { label: "Best streak", value: String(clampInt(metrics?.bestStreak, 0, 20)) },
    ],
  };
}

function buildLeoPizzeriaFinishPresentation(metrics) {
  const successful = clampInt(metrics?.successfulCustomers, 0, 20);
  return {
    subtitleHe: `Nice work! You made ${successful} correct pizzas at Leo's pizzeria`,
    statsLines: [
      { label: "Customers reached", value: String(clampInt(metrics?.customersReached, 0, 20)) },
      { label: "Pizzas served correctly", value: String(successful) },
      { label: "Mistakes", value: String(clampInt(metrics?.mistakes, 0, 20)) },
      { label: "Accuracy", value: `${Math.round(clampFloat(metrics?.accuracy, 0, 1) * 100)}%` },
      { label: "Best streak", value: String(clampInt(metrics?.bestStreak, 0, 20)) },
    ],
  };
}

function validateLeoLabMetrics(metrics, diff, score) {
  const experimentsTotal = Number(metrics?.experimentsTotal);
  const experimentsReached = Number(metrics?.experimentsReached);
  const successfulExperiments = Number(metrics?.successfulExperiments);
  const failedAttempts = Number(metrics?.failedAttempts);
  const mistakes = Number(metrics?.mistakes);
  const firstTrySuccesses = Number(metrics?.firstTrySuccesses);
  const bestStreak = Number(metrics?.bestStreak);
  const durationSec = Number(metrics?.durationSec);
  const accuracy = Number(metrics?.accuracy);

  for (const [val, max, label] of [
    [experimentsTotal, 20, "Total experiments"],
    [experimentsReached, 20, "Experiments reached"],
    [successfulExperiments, 20, "Successful experiments"],
    [failedAttempts, 30, "Failed attempts"],
    [mistakes, 20, "Mistakes"],
    [firstTrySuccesses, 20, "First-try successes"],
    [bestStreak, 20, "Streak"],
    [durationSec, 3600, "Duration"],
  ]) {
    if (!Number.isFinite(val) || val < 0 || val > max) {
      return { ok: false, message: `Invalid ${label}` };
    }
  }

  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 1) {
    return { ok: false, message: "Invalid accuracy" };
  }

  if (experimentsTotal !== 20) {
    return { ok: false, message: "Invalid total experiments" };
  }
  if (experimentsReached > experimentsTotal || successfulExperiments > experimentsTotal) {
    return { ok: false, message: "Invalid experiment counts" };
  }
  if (successfulExperiments > experimentsReached + 1) {
    return { ok: false, message: "Invalid successful experiments" };
  }
  if (Math.abs(mistakes - failedAttempts) > 1) {
    return { ok: false, message: "Invalid mistake count" };
  }
  if (firstTrySuccesses > successfulExperiments + 1) {
    return { ok: false, message: "Invalid first-try successes" };
  }

  const cap = LEO_LAB_MAX_SCORE[diff] || 1400;
  if (score > cap) return { ok: false, message: "Score out of range" };

  return { ok: true };
}

function validateLeoPizzeriaMetrics(metrics, diff, score) {
  const customersTotal = Number(metrics?.customersTotal);
  const customersReached = Number(metrics?.customersReached);
  const successfulCustomers = Number(metrics?.successfulCustomers);
  const failedAttempts = Number(metrics?.failedAttempts);
  const mistakes = Number(metrics?.mistakes);
  const bestStreak = Number(metrics?.bestStreak);
  const durationSec = Number(metrics?.durationSec);
  const accuracy = Number(metrics?.accuracy);

  for (const [val, max, label] of [
    [customersTotal, 20, "Total customers"],
    [customersReached, 20, "Customers reached"],
    [successfulCustomers, 20, "Customers served"],
    [failedAttempts, 30, "Failed attempts"],
    [mistakes, 20, "Mistakes"],
    [bestStreak, 20, "Streak"],
    [durationSec, 3600, "Duration"],
  ]) {
    if (!Number.isFinite(val) || val < 0 || val > max) {
      return { ok: false, message: `Invalid ${label}` };
    }
  }

  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 1) {
    return { ok: false, message: "Invalid accuracy" };
  }

  if (customersTotal !== 20) {
    return { ok: false, message: "Invalid total customers" };
  }
  if (customersReached > customersTotal || successfulCustomers > customersTotal) {
    return { ok: false, message: "Invalid customer counts" };
  }
  if (successfulCustomers > customersReached + 1) {
    return { ok: false, message: "Invalid customers served" };
  }
  if (Math.abs(mistakes - failedAttempts) > 1) {
    return { ok: false, message: "Invalid mistake count" };
  }

  const cap = LEO_PIZZERIA_MAX_SCORE[diff] || 1400;
  if (score > cap) return { ok: false, message: "Score out of range" };

  return { ok: true };
}

function validateLeoContinuousMetrics(metrics, diff, score, maxQuestions) {
  const successfulQuestions = Number(metrics?.successfulQuestions);
  const questionsReached = Number(metrics?.questionsReached);
  const failedAttempts = Number(metrics?.failedAttempts);
  const mistakes = Number(metrics?.mistakes);
  const bestStreak = Number(metrics?.bestStreak);
  const highestStage = Number(metrics?.highestStage);
  const durationSec = Number(metrics?.durationSec);
  const accuracy = Number(metrics?.accuracy);

  for (const [val, max, label] of [
    [successfulQuestions, maxQuestions, "Correct answers"],
    [questionsReached, maxQuestions, "Questions reached"],
    [failedAttempts, maxQuestions, "Failed attempts"],
    [mistakes, 10, "Mistakes"],
    [bestStreak, maxQuestions, "Streak"],
    [highestStage, 50, "Stage"],
    [durationSec, 3600, "Duration"],
  ]) {
    if (!Number.isFinite(val) || val < 0 || val > max) {
      return { ok: false, message: `Invalid ${label}` };
    }
  }

  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 1) {
    return { ok: false, message: "Invalid accuracy" };
  }

  if (successfulQuestions > questionsReached + 1) {
    return { ok: false, message: "Invalid question counts" };
  }

  const cap = LEO_CONTINUOUS_MAX_SCORE[diff] || 12000;
  if (score > cap) return { ok: false, message: "Score out of range" };

  return { ok: true };
}

function validateLeoGiftsMetrics(metrics, diff, score) {
  return validateLeoContinuousMetrics(metrics, diff, score, 200);
}

function validateLeoBakeryMetrics(metrics, diff, score) {
  return validateLeoContinuousMetrics(metrics, diff, score, 200);
}

function buildLeoContinuousFinishPresentation(metrics, emoji, noun) {
  const successful = clampInt(metrics?.successfulQuestions, 0, 200);
  return {
    subtitleHe: `Nice work! You solved ${successful} ${noun} ${emoji}`,
    statsLines: [
      { label: "Questions reached", value: String(clampInt(metrics?.questionsReached, 0, 200)) },
      { label: "Correct answers", value: String(successful) },
      { label: "Mistakes", value: String(clampInt(metrics?.mistakes, 0, 10)) },
      { label: "Highest stage", value: String(clampInt(metrics?.highestStage, 1, 50)) },
      { label: "Accuracy", value: `${Math.round(clampFloat(metrics?.accuracy, 0, 1) * 100)}%` },
      { label: "Best streak", value: String(clampInt(metrics?.bestStreak, 0, 200)) },
    ],
  };
}

function buildLeoGiftsFinishPresentation(metrics) {
  return buildLeoContinuousFinishPresentation(metrics, "🎁", "division questions");
}

function buildLeoBakeryFinishPresentation(metrics) {
  return buildLeoContinuousFinishPresentation(metrics, "🥐", "orders");
}

function buildLeoNumberPathFinishPresentation(metrics) {
  const successful = clampInt(metrics?.successfulTasks, 0, 20);
  return {
    subtitleHe: `Nice work! You completed ${successful} tasks on the Number Path`,
    statsLines: [
      { label: "Tasks reached", value: String(clampInt(metrics?.tasksReached, 0, 20)) },
      { label: "Successful tasks", value: String(successful) },
      { label: "Mistakes", value: String(clampInt(metrics?.mistakes, 0, 36)) },
      { label: "Accuracy", value: `${Math.round(clampFloat(metrics?.accuracy, 0, 1) * 100)}%` },
      { label: "Best streak", value: String(clampInt(metrics?.bestStreak, 0, 20)) },
    ],
  };
}

function buildLeoLanguageTaskFinishPresentation(metrics, emoji, titleHe) {
  const successful = clampInt(metrics?.successfulTasks, 0, 20);
  return {
    subtitleHe: `${emoji} Nice work! You completed ${successful} tasks in ${titleHe}`,
    statsLines: [
      { label: "Tasks reached", value: String(clampInt(metrics?.tasksReached, 0, 20)) },
      { label: "Successful tasks", value: String(successful) },
      { label: "Mistakes", value: String(clampInt(metrics?.mistakes, 0, 20)) },
      { label: "Accuracy", value: `${Math.round(clampFloat(metrics?.accuracy, 0, 1) * 100)}%` },
      { label: "Best streak", value: String(clampInt(metrics?.bestStreak, 0, 20)) },
    ],
  };
}

function buildLeoWordTrainFinishPresentation(metrics) {
  return buildLeoLanguageTaskFinishPresentation(metrics, "🚂", "Word Train");
}

function buildLeoWordDetectiveFinishPresentation(metrics) {
  return buildLeoLanguageTaskFinishPresentation(metrics, "🕵️", "Word Detective");
}

function validateLeoNumberPathMetrics(metrics, diff, score) {
  const tasksTotal = Number(metrics?.tasksTotal);
  const tasksReached = Number(metrics?.tasksReached);
  const successfulTasks = Number(metrics?.successfulTasks);
  const failedAttempts = Number(metrics?.failedAttempts);
  const mistakes = Number(metrics?.mistakes);
  const bestStreak = Number(metrics?.bestStreak);
  const durationSec = Number(metrics?.durationSec);
  const accuracy = Number(metrics?.accuracy);

  for (const [val, max, label] of [
    [tasksTotal, 20, "Total tasks"],
    [tasksReached, 20, "Tasks reached"],
    [successfulTasks, 20, "Successful tasks"],
    [failedAttempts, 60, "Failed attempts"],
    [mistakes, 36, "Mistakes"],
    [bestStreak, 20, "Streak"],
    [durationSec, 3600, "Duration"],
  ]) {
    if (!Number.isFinite(val) || val < 0 || val > max) {
      return { ok: false, message: `Invalid ${label}` };
    }
  }

  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 1) {
    return { ok: false, message: "Invalid accuracy" };
  }

  if (tasksTotal !== 20) {
    return { ok: false, message: "Invalid total tasks" };
  }
  if (tasksReached > tasksTotal || successfulTasks > tasksTotal) {
    return { ok: false, message: "Invalid task counts" };
  }

  const cap = LEO_NUMBER_PATH_MAX_SCORE[diff] || 600;
  if (score > cap) return { ok: false, message: "Score out of range" };

  return { ok: true };
}

function validateLeoLanguageTaskMetrics(metrics, diff, score) {
  const tasksTotal = Number(metrics?.tasksTotal);
  const tasksReached = Number(metrics?.tasksReached);
  const successfulTasks = Number(metrics?.successfulTasks);
  const failedAttempts = Number(metrics?.failedAttempts);
  const mistakes = Number(metrics?.mistakes);
  const bestStreak = Number(metrics?.bestStreak);
  const durationSec = Number(metrics?.durationSec);
  const accuracy = Number(metrics?.accuracy);

  for (const [val, max, label] of [
    [tasksTotal, 20, "Total tasks"],
    [tasksReached, 20, "Tasks reached"],
    [successfulTasks, 20, "Successful tasks"],
    [failedAttempts, 60, "Failed attempts"],
    [mistakes, 20, "Mistakes"],
    [bestStreak, 20, "Streak"],
    [durationSec, 3600, "Duration"],
  ]) {
    if (!Number.isFinite(val) || val < 0 || val > max) {
      return { ok: false, message: `Invalid ${label}` };
    }
  }

  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 1) {
    return { ok: false, message: "Invalid accuracy" };
  }

  if (tasksTotal !== 20) {
    return { ok: false, message: "Invalid total tasks" };
  }
  if (tasksReached > tasksTotal || successfulTasks > tasksTotal) {
    return { ok: false, message: "Invalid task counts" };
  }

  const cap = LEO_LANGUAGE_TASK_MAX_SCORE[diff] || 1100;
  if (score > cap) return { ok: false, message: "Score out of range" };

  return { ok: true };
}

function validateLeoWordTrainMetrics(metrics, diff, score) {
  return validateLeoLanguageTaskMetrics(metrics, diff, score);
}

function validateLeoWordDetectiveMetrics(metrics, diff, score) {
  return validateLeoLanguageTaskMetrics(metrics, diff, score);
}

/**
 * @param {Record<string, unknown>} metrics
 * @param {string} gameKey
 * @param {string|null|undefined} difficulty
 */
export function validateEducationalGameMetrics(metrics, gameKey, difficulty) {
  const score = Number(metrics?.score);
  if (!Number.isFinite(score) || score < 0 || score > 100000) {
    return { ok: false, message: "Invalid score" };
  }

  const diff = String(difficulty || metrics?.difficulty || "").toLowerCase();
  if (!["easy", "medium", "hard"].includes(diff)) {
    return { ok: false, message: "Invalid difficulty" };
  }

  if (gameKey === "leo-supermarket") {
    return validateLeoSupermarketMetrics(metrics, diff, score);
  }
  if (gameKey === "leo-lab") {
    return validateLeoLabMetrics(metrics, diff, score);
  }
  if (gameKey === "leo-pizzeria") {
    return validateLeoPizzeriaMetrics(metrics, diff, score);
  }
  if (gameKey === "leo-gifts") {
    return validateLeoGiftsMetrics(metrics, diff, score);
  }
  if (gameKey === "leo-bakery") {
    return validateLeoBakeryMetrics(metrics, diff, score);
  }
  if (gameKey === "leo-number-path") {
    return validateLeoNumberPathMetrics(metrics, diff, score);
  }
  if (gameKey === "leo-word-train") {
    return validateLeoWordTrainMetrics(metrics, diff, score);
  }
  if (gameKey === "leo-word-detective") {
    return validateLeoWordDetectiveMetrics(metrics, diff, score);
  }
  if (gameKey === "recycling-factory") {
    return validateRecyclingFactoryMetrics(metrics, diff, score);
  }

  return { ok: false, message: "Unsupported game" };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {object} params
 */
export async function finalizeEducationalGameSession(supabase, params) {
  const { session, studentId, metrics, finishedAt = new Date().toISOString() } = params;
  const gameKey = session.game_key;
  const difficulty = session.difficulty || metrics?.difficulty || null;

  const metricCheck = validateEducationalGameMetrics(metrics, gameKey, difficulty);
  if (!metricCheck.ok) {
    return { ok: false, code: "invalid_metrics", message: metricCheck.message };
  }

  const rules = await requireEducationalGameRules(supabase, gameKey);
  const payout = calculateEducationalGameCoins(gameKey, difficulty, metrics, rules);
  const leoPresentation =
    gameKey === "leo-supermarket"
      ? buildLeoSupermarketFinishPresentation(metrics)
      : gameKey === "leo-lab"
        ? buildLeoLabFinishPresentation(metrics)
        : gameKey === "leo-pizzeria"
          ? buildLeoPizzeriaFinishPresentation(metrics)
          : gameKey === "leo-gifts"
          ? buildLeoGiftsFinishPresentation(metrics)
          : gameKey === "leo-bakery"
            ? buildLeoBakeryFinishPresentation(metrics)
            : gameKey === "leo-number-path"
              ? buildLeoNumberPathFinishPresentation(metrics)
              : gameKey === "leo-word-train"
                ? buildLeoWordTrainFinishPresentation(metrics)
                : gameKey === "leo-word-detective"
                  ? buildLeoWordDetectiveFinishPresentation(metrics)
                  : null;

  let balanceAfter = null;
  let duplicate = false;

  if (payout.coins > 0) {
    const coinResult = await applyArcadeCoinMove(supabase, {
      studentId,
      direction: "earn",
      amount: payout.coins,
      idempotencyKey: `educational_game_${session.id}`,
      sourceType: EDUCATIONAL_COIN_SOURCE_TYPE,
      sourceId: session.id,
      metadata: {
        gameKey,
        category: "educational",
        difficulty,
        metrics,
        breakdownHe: payout.breakdownHe,
      },
      reason: `educational_game_${gameKey}`,
    });

    if (!coinResult.ok) {
      return {
        ok: false,
        code: coinResult.code || "coin_failed",
        message: coinResult.message || "Unable to award coins",
      };
    }
    balanceAfter = coinResult.balanceAfter ?? null;
    duplicate = coinResult.duplicate === true;
  } else {
    const { data: balRow } = await supabase
      .from("student_coin_balances")
      .select("balance")
      .eq("student_id", studentId)
      .maybeSingle();
    balanceAfter = balRow?.balance ?? 0;
  }

  const resultJson = {
    didWin: metrics?.didWin === true,
    score: metrics?.score ?? 0,
    coinsAwarded: payout.coins,
    breakdownHe: payout.breakdownHe,
    displayLevelHe: payout.displayLevelHe,
    balanceAfter,
    duplicate,
    accuracy: metrics?.accuracy ?? 0,
    correctItems: metrics?.correctItems ?? metrics?.correctCustomers ?? metrics?.successfulExperiments ?? 0,
    mistakes: metrics?.mistakes ?? 0,
    bestStreak: metrics?.bestStreak ?? 0,
    subtitleHe: leoPresentation?.subtitleHe,
    statsLines: leoPresentation?.statsLines,
  };

  const { error: updateError } = await supabase
    .from("educational_game_sessions")
    .update({
      status: "completed",
      finished_at: finishedAt,
      metrics_json: metrics,
      coins_awarded: payout.coins,
      result_json: resultJson,
      updated_at: finishedAt,
    })
    .eq("id", session.id)
    .eq("student_id", studentId)
    .eq("status", "active");

  if (updateError) {
    return { ok: false, code: "db_error", message: updateError.message || "Unable to save result" };
  }

  return {
    ok: true,
    didWin: resultJson.didWin,
    score: resultJson.score,
    coinsAwarded: payout.coins,
    breakdownHe: payout.breakdownHe,
    displayLevelHe: payout.displayLevelHe,
    balanceAfter,
    duplicate,
    accuracy: Math.round((metrics?.accuracy ?? 0) * 100),
    correctItems: resultJson.correctItems,
    mistakes: metrics?.mistakes ?? 0,
    bestStreak: metrics?.bestStreak ?? 0,
    subtitleHe: leoPresentation?.subtitleHe,
    statsLines: leoPresentation?.statsLines,
  };
}
