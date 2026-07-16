/** @typedef {'easy' | 'medium' | 'hard'} DifficultyId */

/** @typedef {{ id: string, emoji: string, name: string }} PizzaTopping */

/**
 * @typedef {{
 *   requirements: Record<string, number>
 *   filledSlices: number
 *   allowEmpty: boolean
 * }} OrderSpec
 */

/**
 * @typedef {{
 *   id: string
 *   customerName: string
 *   customerEmoji: string
 *   greeting: string
 *   ticketLine: string
 *   sliceCount: number
 *   spec: OrderSpec
 *   timeLimitSec: number
 * }} PizzeriaCustomerOrder
 */

export const CUSTOMERS_PER_LEVEL = 20;

/** @type {PizzaTopping[]} */
export const TOPPINGS = [
  { id: "cheese", emoji: "🧀", name: "Cheese" },
  { id: "tomato", emoji: "🍅", name: "Tomato" },
  { id: "olive", emoji: "🫒", name: "Olives" },
  { id: "mushroom", emoji: "🍄", name: "Mushrooms" },
  { id: "pepper", emoji: "🫑", name: "Pepper" },
  { id: "basil", emoji: "🌿", name: "Basil" },
];

export const DIFFICULTIES = {
  easy: {
    id: "easy",
    label: "Easy",
    sliceCount: 4,
    hint: "Whole, half, and quarter on a 4-slice pizza",
    maxMistakes: 5,
    timeLimitsByBand: [45, 40, 35],
  },
  medium: {
    id: "medium",
    label: "Medium",
    sliceCount: 8,
    hint: "Half, quarter, and three quarters on 8 slices",
    maxMistakes: 4,
    timeLimitsByBand: [35, 30, 25],
  },
  hard: {
    id: "hard",
    label: "Hard",
    sliceCount: 8,
    hint: "Eighths, combinations, and completing the whole",
    maxMistakes: 3,
    timeLimitsByBand: [30, 25, 20],
  },
};

export const SCORE = {
  correct: 30,
  streak3: 15,
  streak5: 30,
  fastService: 5,
  timeout: -5,
};

const SUCCESS_MESSAGES = [
  "Great job! The pizza is ready for the customer.",
  "Awesome! You made it exactly as ordered.",
];

const THIRD_RE = /third|1\s*\/\s*3|2\s*\/\s*3|⅓|⅔/iu;

/** @param {Record<string, number>} requirements @param {number} sliceCount @param {boolean} [fullPizza] */
function spec(requirements, sliceCount, fullPizza = false) {
  const sum = Object.values(requirements).reduce((a, b) => a + b, 0);
  return {
    requirements,
    filledSlices: fullPizza ? sliceCount : sum,
    allowEmpty: !fullPizza && sum < sliceCount,
  };
}

/** @param {Omit<PizzeriaCustomerOrder, 'sliceCount'|'spec'> & { spec: OrderSpec, sliceCount?: number }} order */
function easyOrder(order) {
  return { ...order, sliceCount: 4 };
}

/** @param {Omit<PizzeriaCustomerOrder, 'sliceCount'|'spec'> & { spec: OrderSpec, sliceCount?: number }} order */
function eightSliceOrder(order) {
  return { ...order, sliceCount: 8 };
}

/** @type {PizzeriaCustomerOrder[]} */
const EASY_ORDERS = [
  easyOrder({
    id: "easy-01",
    customerName: "Sam",
    customerEmoji: "👧",
    greeting: "Put cheese on the whole pizza, please!",
    ticketLine: "Cheese 🧀 - on the whole pizza",
    spec: spec({ cheese: 4 }, 4, true),
  }),
  easyOrder({
    id: "easy-02",
    customerName: "Alex",
    customerEmoji: "👦",
    greeting: "Put tomato on half the pizza.",
    ticketLine: "Tomato 🍅 - half (2 of 4)",
    spec: spec({ tomato: 2 }, 4),
  }),
  easyOrder({
    id: "easy-03",
    customerName: "Emma",
    customerEmoji: "👧🏻",
    greeting: "Put olives on a quarter of the pizza.",
    ticketLine: "Olives 🫒 - a quarter (1 of 4)",
    spec: spec({ olive: 1 }, 4),
  }),
  easyOrder({
    id: "easy-04",
    customerName: "Noah",
    customerEmoji: "🧒",
    greeting: "Half the pizza with cheese and half with tomato.",
    ticketLine: "Half 🧀 + Half 🍅",
    spec: spec({ cheese: 2, tomato: 2 }, 4, true),
  }),
  easyOrder({
    id: "easy-05",
    customerName: "Mia",
    customerEmoji: "👧🏽",
    greeting: "A quarter of the pizza with olives and the rest with cheese.",
    ticketLine: "1 Olives 🫒 + 3 Cheese 🧀",
    spec: spec({ olive: 1, cheese: 3 }, 4, true),
  }),
  easyOrder({
    id: "easy-06",
    customerName: "Daniel",
    customerEmoji: "👦🏻",
    greeting: "Put mushrooms on half the pizza.",
    ticketLine: "Mushrooms 🍄 - half (2 of 4)",
    spec: spec({ mushroom: 2 }, 4),
  }),
  easyOrder({
    id: "easy-07",
    customerName: "Lily",
    customerEmoji: "👧",
    greeting: "Put pepper on the whole pizza!",
    ticketLine: "Pepper 🫑 - on the whole pizza",
    spec: spec({ pepper: 4 }, 4, true),
  }),
  easyOrder({
    id: "easy-08",
    customerName: "Josh",
    customerEmoji: "👦",
    greeting: "Put basil on a quarter of the pizza.",
    ticketLine: "Basil 🌿 - a quarter (1 of 4)",
    spec: spec({ basil: 1 }, 4),
  }),
  easyOrder({
    id: "easy-09",
    customerName: "Tara",
    customerEmoji: "👧🏻",
    greeting: "Half the pizza with cheese and half with mushrooms.",
    ticketLine: "Half 🧀 + Half 🍄",
    spec: spec({ cheese: 2, mushroom: 2 }, 4, true),
  }),
  easyOrder({
    id: "easy-10",
    customerName: "Ethan",
    customerEmoji: "🧒",
    greeting: "Put tomato on the whole pizza.",
    ticketLine: "Tomato 🍅 - on the whole pizza",
    spec: spec({ tomato: 4 }, 4, true),
  }),
  easyOrder({
    id: "easy-11",
    customerName: "Hannah",
    customerEmoji: "👧",
    greeting: "A quarter of the pizza with tomato and the rest with cheese.",
    ticketLine: "1 Tomato 🍅 + 3 Cheese 🧀",
    spec: spec({ tomato: 1, cheese: 3 }, 4, true),
  }),
  easyOrder({
    id: "easy-12",
    customerName: "Nick",
    customerEmoji: "👦🏽",
    greeting: "Put cheese on half the pizza.",
    ticketLine: "Cheese 🧀 - half (2 of 4)",
    spec: spec({ cheese: 2 }, 4),
  }),
  easyOrder({
    id: "easy-13",
    customerName: "Ruby",
    customerEmoji: "👧🏻",
    greeting: "Put olives on the whole pizza.",
    ticketLine: "Olives 🫒 - on the whole pizza",
    spec: spec({ olive: 4 }, 4, true),
  }),
  easyOrder({
    id: "easy-14",
    customerName: "Ian",
    customerEmoji: "👦",
    greeting: "Half the pizza with pepper and half with cheese.",
    ticketLine: "Half 🫑 + Half 🧀",
    spec: spec({ pepper: 2, cheese: 2 }, 4, true),
  }),
  easyOrder({
    id: "easy-15",
    customerName: "Liam",
    customerEmoji: "🧑",
    greeting: "Put basil on half the pizza.",
    ticketLine: "Basil 🌿 - half (2 of 4)",
    spec: spec({ basil: 2 }, 4),
  }),
  easyOrder({
    id: "easy-16",
    customerName: "Maya",
    customerEmoji: "👧🏽",
    greeting: "A quarter of the pizza with mushrooms and the rest with cheese.",
    ticketLine: "1 Mushrooms 🍄 + 3 Cheese 🧀",
    spec: spec({ mushroom: 1, cheese: 3 }, 4, true),
  }),
  easyOrder({
    id: "easy-17",
    customerName: "Aaron",
    customerEmoji: "👦🏻",
    greeting: "Put mushrooms on the whole pizza.",
    ticketLine: "Mushrooms 🍄 - on the whole pizza",
    spec: spec({ mushroom: 4 }, 4, true),
  }),
  easyOrder({
    id: "easy-18",
    customerName: "Ava",
    customerEmoji: "👧",
    greeting: "Half the pizza with olives and half with tomato.",
    ticketLine: "Half 🫒 + Half 🍅",
    spec: spec({ olive: 2, tomato: 2 }, 4, true),
  }),
  easyOrder({
    id: "easy-19",
    customerName: "Adam",
    customerEmoji: "🧒",
    greeting: "A quarter of the pizza with pepper and the rest with tomato.",
    ticketLine: "1 Pepper 🫑 + 3 Tomato 🍅",
    spec: spec({ pepper: 1, tomato: 3 }, 4, true),
  }),
  easyOrder({
    id: "easy-20",
    customerName: "Nora",
    customerEmoji: "👧🏻",
    greeting: "A quarter of the pizza with basil and the rest with cheese.",
    ticketLine: "1 Basil 🌿 + 3 Cheese 🧀",
    spec: spec({ basil: 1, cheese: 3 }, 4, true),
  }),
];

/** @type {PizzeriaCustomerOrder[]} */
const MEDIUM_ORDERS = [
  eightSliceOrder({
    id: "med-01",
    customerName: "Sarah",
    customerEmoji: "👩",
    greeting: "Put mushrooms on half the pizza.",
    ticketLine: "Mushrooms 🍄 - half (4 of 8)",
    spec: spec({ mushroom: 4 }, 8),
  }),
  eightSliceOrder({
    id: "med-02",
    customerName: "Dan",
    customerEmoji: "👨",
    greeting: "Put olives on a quarter of the pizza.",
    ticketLine: "Olives 🫒 - a quarter (2 of 8)",
    spec: spec({ olive: 2 }, 8),
  }),
  eightSliceOrder({
    id: "med-03",
    customerName: "Maya",
    customerEmoji: "👧🏽",
    greeting: "Put cheese on three quarters of the pizza.",
    ticketLine: "Cheese 🧀 - 6 of 8",
    spec: spec({ cheese: 6 }, 8),
  }),
  eightSliceOrder({
    id: "med-04",
    customerName: "Johnny",
    customerEmoji: "👦🏻",
    greeting: "Half the pizza with cheese and half with tomato.",
    ticketLine: "Half 🧀 + Half 🍅",
    spec: spec({ cheese: 4, tomato: 4 }, 8, true),
  }),
  eightSliceOrder({
    id: "med-05",
    customerName: "Ben",
    customerEmoji: "👦",
    greeting: "A quarter of the pizza with olives and three quarters with cheese.",
    ticketLine: "2 Olives 🫒 + 6 Cheese 🧀",
    spec: spec({ olive: 2, cheese: 6 }, 8, true),
  }),
  eightSliceOrder({
    id: "med-06",
    customerName: "Hazel",
    customerEmoji: "👧",
    greeting: "Put pepper on half the pizza.",
    ticketLine: "Pepper 🫑 - half (4 of 8)",
    spec: spec({ pepper: 4 }, 8),
  }),
  eightSliceOrder({
    id: "med-07",
    customerName: "Cole",
    customerEmoji: "👨🏻",
    greeting: "Put basil on a quarter of the pizza.",
    ticketLine: "Basil 🌿 - a quarter (2 of 8)",
    spec: spec({ basil: 2 }, 8),
  }),
  eightSliceOrder({
    id: "med-08",
    customerName: "Ruby",
    customerEmoji: "👧🏻",
    greeting: "Put tomato on three quarters of the pizza.",
    ticketLine: "Tomato 🍅 - 6 of 8",
    spec: spec({ tomato: 6 }, 8),
  }),
  eightSliceOrder({
    id: "med-09",
    customerName: "Andy",
    customerEmoji: "👦🏽",
    greeting: "Half the pizza with olives and half with tomato.",
    ticketLine: "Half 🫒 + Half 🍅",
    spec: spec({ olive: 4, tomato: 4 }, 8, true),
  }),
  eightSliceOrder({
    id: "med-10",
    customerName: "Leah",
    customerEmoji: "👧",
    greeting: "Put cheese on the whole pizza.",
    ticketLine: "Cheese 🧀 - on the whole pizza",
    spec: spec({ cheese: 8 }, 8, true),
  }),
  eightSliceOrder({
    id: "med-11",
    customerName: "Oscar",
    customerEmoji: "👦",
    greeting: "Put mushrooms on a quarter of the pizza.",
    ticketLine: "Mushrooms 🍄 - a quarter (2 of 8)",
    spec: spec({ mushroom: 2 }, 8),
  }),
  eightSliceOrder({
    id: "med-12",
    customerName: "Taylor",
    customerEmoji: "👩",
    greeting: "Put olives on three quarters of the pizza.",
    ticketLine: "Olives 🫒 - 6 of 8",
    spec: spec({ olive: 6 }, 8),
  }),
  eightSliceOrder({
    id: "med-13",
    customerName: "Ari",
    customerEmoji: "👧🏽",
    greeting: "Half the pizza with mushrooms and half with cheese.",
    ticketLine: "Half 🍄 + Half 🧀",
    spec: spec({ mushroom: 4, cheese: 4 }, 8, true),
  }),
  eightSliceOrder({
    id: "med-14",
    customerName: "Joel",
    customerEmoji: "👦🏻",
    greeting: "A quarter of the pizza with pepper and the rest with cheese.",
    ticketLine: "2 Pepper 🫑 + 6 Cheese 🧀",
    spec: spec({ pepper: 2, cheese: 6 }, 8, true),
  }),
  eightSliceOrder({
    id: "med-15",
    customerName: "Morgan",
    customerEmoji: "👧",
    greeting: "Put tomato on half the pizza.",
    ticketLine: "Tomato 🍅 - half (4 of 8)",
    spec: spec({ tomato: 4 }, 8),
  }),
  eightSliceOrder({
    id: "med-16",
    customerName: "Isaac",
    customerEmoji: "👨",
    greeting: "Half the pizza with basil and half with pepper.",
    ticketLine: "Half 🌿 + Half 🫑",
    spec: spec({ basil: 4, pepper: 4 }, 8, true),
  }),
  eightSliceOrder({
    id: "med-17",
    customerName: "Sophie",
    customerEmoji: "👧🏻",
    greeting: "Put mushrooms on three quarters of the pizza.",
    ticketLine: "Mushrooms 🍄 - 6 of 8",
    spec: spec({ mushroom: 6 }, 8),
  }),
  eightSliceOrder({
    id: "med-18",
    customerName: "Ryan",
    customerEmoji: "👦",
    greeting: "A quarter of the pizza with tomato and three quarters with olives.",
    ticketLine: "2 Tomato 🍅 + 6 Olives 🫒",
    spec: spec({ tomato: 2, olive: 6 }, 8, true),
  }),
  eightSliceOrder({
    id: "med-19",
    customerName: "Ivy",
    customerEmoji: "👧🏽",
    greeting: "Put pepper on three quarters of the pizza.",
    ticketLine: "Pepper 🫑 - 6 of 8",
    spec: spec({ pepper: 6 }, 8),
  }),
  eightSliceOrder({
    id: "med-20",
    customerName: "Austin",
    customerEmoji: "👦🏻",
    greeting: "Half the pizza with cheese and half with basil.",
    ticketLine: "Half 🧀 + Half 🌿",
    spec: spec({ cheese: 4, basil: 4 }, 8, true),
  }),
];

/** @type {PizzeriaCustomerOrder[]} */
const HARD_ORDERS = [
  eightSliceOrder({
    id: "hard-01",
    customerName: "Leah",
    customerEmoji: "👧🏻",
    greeting: "Put olives on an eighth of the pizza.",
    ticketLine: "Olives 🫒 - an eighth (1 of 8)",
    spec: spec({ olive: 1 }, 8),
  }),
  eightSliceOrder({
    id: "hard-02",
    customerName: "Owen",
    customerEmoji: "👦",
    greeting: "Put mushrooms on five eighths of the pizza.",
    ticketLine: "Mushrooms 🍄 - 5 of 8",
    spec: spec({ mushroom: 5 }, 8),
  }),
  eightSliceOrder({
    id: "hard-03",
    customerName: "Emma",
    customerEmoji: "👧",
    greeting: "Three eighths tomato and five eighths cheese.",
    ticketLine: "3 Tomato 🍅 + 5 Cheese 🧀",
    spec: spec({ tomato: 3, cheese: 5 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-04",
    customerName: "Tyler",
    customerEmoji: "🧑",
    greeting: "A quarter of the pizza with olives, a quarter with mushrooms, and half with cheese.",
    ticketLine: "2 Olives 🫒 + 2 Mushrooms 🍄 + 4 Cheese 🧀",
    spec: spec({ olive: 2, mushroom: 2, cheese: 4 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-05",
    customerName: "Mila",
    customerEmoji: "👧🏽",
    greeting: "Put cheese on all the slices that didn't get tomato. Tomato on three eighths.",
    ticketLine: "3 Tomato 🍅 + 5 Cheese 🧀",
    spec: spec({ tomato: 3, cheese: 5 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-06",
    customerName: "Ryan",
    customerEmoji: "👨🏻",
    greeting: "Put basil on an eighth of the pizza.",
    ticketLine: "Basil 🌿 - an eighth (1 of 8)",
    spec: spec({ basil: 1 }, 8),
  }),
  eightSliceOrder({
    id: "hard-07",
    customerName: "Ella",
    customerEmoji: "👧",
    greeting: "Put cheese on seven eighths of the pizza.",
    ticketLine: "Cheese 🧀 - 7 of 8",
    spec: spec({ cheese: 7 }, 8),
  }),
  eightSliceOrder({
    id: "hard-08",
    customerName: "Jonathan",
    customerEmoji: "👦",
    greeting: "Three eighths pepper and five eighths cheese.",
    ticketLine: "3 Pepper 🫑 + 5 Cheese 🧀",
    spec: spec({ pepper: 3, cheese: 5 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-09",
    customerName: "Daphne",
    customerEmoji: "👩",
    greeting: "Put tomato on two eighths of the pizza.",
    ticketLine: "Tomato 🍅 - 2 of 8",
    spec: spec({ tomato: 2 }, 8),
  }),
  eightSliceOrder({
    id: "hard-10",
    customerName: "Asher",
    customerEmoji: "👦🏻",
    greeting: "An eighth mushrooms and the rest cheese.",
    ticketLine: "1 Mushrooms 🍄 + 7 Cheese 🧀",
    spec: spec({ mushroom: 1, cheese: 7 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-11",
    customerName: "Kara",
    customerEmoji: "👧🏻",
    greeting: "Put olives on six eighths of the pizza.",
    ticketLine: "Olives 🫒 - 6 of 8",
    spec: spec({ olive: 6 }, 8),
  }),
  eightSliceOrder({
    id: "hard-12",
    customerName: "Noah",
    customerEmoji: "🧒",
    greeting: "Two eighths basil and six eighths mushrooms.",
    ticketLine: "2 Basil 🌿 + 6 Mushrooms 🍄",
    spec: spec({ basil: 2, mushroom: 6 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-13",
    customerName: "Sarah",
    customerEmoji: "👧",
    greeting: "Put cheese on five eighths of the pizza.",
    ticketLine: "Cheese 🧀 - 5 of 8",
    spec: spec({ cheese: 5 }, 8),
  }),
  eightSliceOrder({
    id: "hard-14",
    customerName: "Nate",
    customerEmoji: "👦🏽",
    greeting: "An eighth pepper, two eighths tomato, and the rest cheese.",
    ticketLine: "1 Pepper 🫑 + 2 Tomato 🍅 + 5 Cheese 🧀",
    spec: spec({ pepper: 1, tomato: 2, cheese: 5 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-15",
    customerName: "Addie",
    customerEmoji: "👧🏽",
    greeting: "Three eighths olives, two eighths pepper, and the rest cheese.",
    ticketLine: "3 Olives 🫒 + 2 Pepper 🫑 + 3 Cheese 🧀",
    spec: spec({ olive: 3, pepper: 2, cheese: 3 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-16",
    customerName: "Alex",
    customerEmoji: "👦",
    greeting: "Put mushrooms on three eighths of the pizza.",
    ticketLine: "Mushrooms 🍄 - 3 of 8",
    spec: spec({ mushroom: 3 }, 8),
  }),
  eightSliceOrder({
    id: "hard-17",
    customerName: "Maya",
    customerEmoji: "👧🏻",
    greeting: "Put tomato on one eighth of the pizza.",
    ticketLine: "Tomato 🍅 - an eighth (1 of 8)",
    spec: spec({ tomato: 1 }, 8),
  }),
  eightSliceOrder({
    id: "hard-18",
    customerName: "Sam",
    customerEmoji: "👧",
    greeting: "Four eighths basil and four eighths cheese.",
    ticketLine: "4 Basil 🌿 + 4 Cheese 🧀",
    spec: spec({ basil: 4, cheese: 4 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-19",
    customerName: "Ethan",
    customerEmoji: "👦🏻",
    greeting: "Put pepper on five eighths of the pizza.",
    ticketLine: "Pepper 🫑 - 5 of 8",
    spec: spec({ pepper: 5 }, 8),
  }),
  eightSliceOrder({
    id: "hard-20",
    customerName: "Emma",
    customerEmoji: "👧🏻",
    greeting: "Two eighths olives, two eighths mushrooms, and four eighths tomato.",
    ticketLine: "2 Olives 🫒 + 2 Mushrooms 🍄 + 4 Tomato 🍅",
    spec: spec({ olive: 2, mushroom: 2, tomato: 4 }, 8, true),
  }),
];

/** @type {Record<DifficultyId, PizzeriaCustomerOrder[]>} */
export const CUSTOMERS_BY_DIFFICULTY = {
  easy: EASY_ORDERS,
  medium: MEDIUM_ORDERS,
  hard: HARD_ORDERS,
};

/** @param {Record<number, string>} sliceMap */
function countByTopping(sliceMap) {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const toppingId of Object.values(sliceMap)) {
    if (!toppingId) continue;
    counts[toppingId] = (counts[toppingId] || 0) + 1;
  }
  return counts;
}

/** @param {Record<number, string>} sliceMap */
function filledCount(sliceMap) {
  return Object.values(sliceMap).filter(Boolean).length;
}

/** @param {number} n */
function successMessage(n) {
  return SUCCESS_MESSAGES[n % SUCCESS_MESSAGES.length];
}

/**
 * @param {OrderSpec} orderSpec
 * @param {number} sliceCount
 * @param {Record<number, string>} sliceMap
 */
export function validateOrderSpec(orderSpec, sliceCount, sliceMap) {
  const counts = countByTopping(sliceMap);
  const filled = filledCount(sliceMap);
  const { requirements, filledSlices, allowEmpty } = orderSpec;

  for (const toppingId of Object.values(sliceMap)) {
    if (toppingId && requirements[toppingId] == null) {
      return { ok: false, message: "Heads up: there's an extra topping on the pizza." };
    }
  }

  for (const [toppingId, required] of Object.entries(requirements)) {
    const actual = counts[toppingId] || 0;
    if (actual > required) {
      return { ok: false, message: "Heads up: there's an extra topping on the pizza." };
    }
  }

  let missingTotal = 0;
  for (const [toppingId, required] of Object.entries(requirements)) {
    const actual = counts[toppingId] || 0;
    if (actual < required) missingTotal += required - actual;
  }

  if (missingTotal > 0) {
    if (missingTotal === 1) {
      return { ok: false, message: "One more slice is missing from the order." };
    }
    return { ok: false, message: "Almost! Check how many slices each topping got." };
  }

  if (filled > filledSlices) {
    return { ok: false, message: "Heads up: there's an extra topping on the pizza." };
  }

  if (!allowEmpty && filled < sliceCount) {
    const gap = sliceCount - filled;
    if (gap === 1) {
      return { ok: false, message: "One more slice is missing from the order." };
    }
    return { ok: false, message: "Almost! Check how many slices each topping got." };
  }

  if (allowEmpty && filled > filledSlices) {
    return { ok: false, message: "Heads up: there's an extra topping on the pizza." };
  }

  return { ok: true, message: successMessage(filled) };
}

/** @param {PizzeriaCustomerOrder} order @param {Record<number, string>} sliceMap */
export function validateCustomerOrder(order, sliceMap) {
  return validateOrderSpec(order.spec, order.sliceCount, sliceMap);
}

/** @param {DifficultyId} difficultyId @param {number} index 0-based */
export function getCustomerTimeLimit(difficultyId, index) {
  const diff = DIFFICULTIES[difficultyId] ?? DIFFICULTIES.easy;
  const band = index < 5 ? 0 : index < 15 ? 1 : 2;
  return diff.timeLimitsByBand[band];
}

/** Difficulty weight for ordering validation (lower = opening). */
export function pizzeriaOrderDifficultyScore(order) {
  const reqSum = Object.values(order.spec.requirements).reduce((a, b) => a + b, 0);
  const toppingCount = Object.keys(order.spec.requirements).length;
  let score = reqSum + toppingCount * 2;
  if (order.spec.allowEmpty && reqSum < order.sliceCount) score -= 1;
  const text = `${order.greeting} ${order.ticketLine}`;
  if (/didn't get|the rest|\brest\b|three|five|six|seven/i.test(text)) score += 8;
  if (/eighth|5 of|6 of|7 of/i.test(text)) score += 4;
  return score;
}

/** @param {DifficultyId} difficulty */
export function pickCustomersForRun(difficulty) {
  const pool = CUSTOMERS_BY_DIFFICULTY[difficulty] ?? CUSTOMERS_BY_DIFFICULTY.easy;
  return pool.slice(0, CUSTOMERS_PER_LEVEL).map((order, index) => ({
    ...order,
    timeLimitSec: getCustomerTimeLimit(difficulty, index),
  }));
}

/**
 * @param {number} successfulCustomers
 * @param {number} customersTotal
 * @param {number} mistakes
 * @param {number} maxMistakes
 */
export function isPizzeriaWin(successfulCustomers, customersTotal, mistakes, maxMistakes) {
  if (mistakes > maxMistakes) return false;
  return successfulCustomers >= customersTotal;
}

/** @param {string | null} toppingId */
export function toppingById(toppingId) {
  return TOPPINGS.find((t) => t.id === toppingId);
}

/** @param {number} index @param {number} total @param {number} radius @param {number} cx @param {number} cy */
export function wedgePath(index, total, radius, cx, cy) {
  const start = ((index * 360) / total - 90) * (Math.PI / 180);
  const end = (((index + 1) * 360) / total - 90) * (Math.PI / 180);
  const x1 = cx + radius * Math.cos(start);
  const y1 = cy + radius * Math.sin(start);
  const x2 = cx + radius * Math.cos(end);
  const y2 = cy + radius * Math.sin(end);
  const largeArc = 360 / total > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}

/** @param {number} index @param {number} total @param {number} radius @param {number} cx @param {number} cy */
export function wedgeCenter(index, total, radius, cx, cy) {
  const mid = ((index + 0.5) * 360) / total - 90;
  const rad = (mid * Math.PI) / 180;
  const dist = radius * 0.68;
  return { x: cx + dist * Math.cos(rad), y: cy + dist * Math.sin(rad) };
}

/** @returns {{ ok: boolean, issues: string[] }} */
export function auditPizzeriaContent() {
  /** @type {string[]} */
  const issues = [];

  for (const [diff, orders] of Object.entries(CUSTOMERS_BY_DIFFICULTY)) {
    if (orders.length < CUSTOMERS_PER_LEVEL) {
      issues.push(`${diff}: pool has only ${orders.length} orders (need ${CUSTOMERS_PER_LEVEL})`);
    }

    const expectedSlices = DIFFICULTIES[/** @type {DifficultyId} */ (diff)].sliceCount;

    for (const order of orders) {
      const text = `${order.greeting} ${order.ticketLine}`;
      if (THIRD_RE.test(text)) {
        issues.push(`${order.id}: contains forbidden third-fraction wording`);
      }
      if (order.sliceCount !== expectedSlices) {
        issues.push(`${order.id}: sliceCount ${order.sliceCount} != ${expectedSlices}`);
      }

      const reqSum = Object.values(order.spec.requirements).reduce((a, b) => a + b, 0);
      if (reqSum > order.sliceCount) {
        issues.push(`${order.id}: requirements sum ${reqSum} exceeds sliceCount`);
      }
      if (!order.spec.allowEmpty && order.spec.filledSlices !== order.sliceCount) {
        issues.push(`${order.id}: full pizza spec mismatch`);
      }
      if (order.spec.allowEmpty && order.spec.filledSlices !== reqSum) {
        issues.push(`${order.id}: partial pizza filledSlices mismatch`);
      }
    }
  }

  return { ok: issues.length === 0, issues };
}

/** Sample orders for docs/tests — first 5 per level. */
export function sampleOrdersByDifficulty() {
  return {
    easy: EASY_ORDERS.slice(0, 5).map((o) => ({
      greeting: o.greeting,
      requirements: o.spec.requirements,
      sliceCount: o.sliceCount,
    })),
    medium: MEDIUM_ORDERS.slice(0, 5).map((o) => ({
      greeting: o.greeting,
      requirements: o.spec.requirements,
      sliceCount: o.sliceCount,
    })),
    hard: HARD_ORDERS.slice(0, 5).map((o) => ({
      greeting: o.greeting,
      requirements: o.spec.requirements,
      sliceCount: o.sliceCount,
    })),
  };
}
