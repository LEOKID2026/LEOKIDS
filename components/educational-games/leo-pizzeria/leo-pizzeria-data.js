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

import { gamePackCopy } from "../../../lib/games/game-pack-copy.js";
import pizzeriaGameplay from "../../../content-packs/en/games/leo-pizzeria/content.json" with { type: "json" };

export const CUSTOMERS_PER_LEVEL = 20;

/** @type {PizzaTopping[]} */
export const TOPPINGS = pizzeriaGameplay.toppings;

export const DIFFICULTIES = {
  easy: {
    id: "easy",
    label: pizzeriaGameplay.difficulties.easy.label,
    sliceCount: 4,
    hint: pizzeriaGameplay.difficulties.easy.hint,
    maxMistakes: 5,
    timeLimitsByBand: [45, 40, 35],
  },
  medium: {
    id: "medium",
    label: pizzeriaGameplay.difficulties.medium.label,
    sliceCount: 8,
    hint: pizzeriaGameplay.difficulties.medium.hint,
    maxMistakes: 4,
    timeLimitsByBand: [35, 30, 25],
  },
  hard: {
    id: "hard",
    label: pizzeriaGameplay.difficulties.hard.label,
    sliceCount: 8,
    hint: pizzeriaGameplay.difficulties.hard.hint,
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

const SUCCESS_MESSAGES = pizzeriaGameplay.successMessages;

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
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_cheese_on_the_whole_pizza_please"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "cheese_on_the_whole_pizza"),
    spec: spec({ cheese: 4 }, 4, true),
  }),
  easyOrder({
    id: "easy-02",
    customerName: "Alex",
    customerEmoji: "👦",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_tomato_on_half_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "tomato_half_2_of_4"),
    spec: spec({ tomato: 2 }, 4),
  }),
  easyOrder({
    id: "easy-03",
    customerName: "Emma",
    customerEmoji: "👧🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_olives_on_a_quarter_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "olives_a_quarter_1_of_4"),
    spec: spec({ olive: 1 }, 4),
  }),
  easyOrder({
    id: "easy-04",
    customerName: "Noah",
    customerEmoji: "🧒",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_the_pizza_with_cheese_and_half_with_tomato"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_half"),
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
    customerName: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "daniel"),
    customerEmoji: "👦🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_mushrooms_on_half_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "mushrooms_half_2_of_4"),
    spec: spec({ mushroom: 2 }, 4),
  }),
  easyOrder({
    id: "easy-07",
    customerName: "Lily",
    customerEmoji: "👧",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_pepper_on_the_whole_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "pepper_on_the_whole_pizza"),
    spec: spec({ pepper: 4 }, 4, true),
  }),
  easyOrder({
    id: "easy-08",
    customerName: "Josh",
    customerEmoji: "👦",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_basil_on_a_quarter_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "basil_a_quarter_1_of_4"),
    spec: spec({ basil: 1 }, 4),
  }),
  easyOrder({
    id: "easy-09",
    customerName: "Tara",
    customerEmoji: "👧🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_the_pizza_with_cheese_and_half_with_mushrooms"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_half_2"),
    spec: spec({ cheese: 2, mushroom: 2 }, 4, true),
  }),
  easyOrder({
    id: "easy-10",
    customerName: "Ethan",
    customerEmoji: "🧒",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_tomato_on_the_whole_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "tomato_on_the_whole_pizza"),
    spec: spec({ tomato: 4 }, 4, true),
  }),
  easyOrder({
    id: "easy-11",
    customerName: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "hannah"),
    customerEmoji: "👧",
    greeting: "A quarter of the pizza with tomato and the rest with cheese.",
    ticketLine: "1 Tomato 🍅 + 3 Cheese 🧀",
    spec: spec({ tomato: 1, cheese: 3 }, 4, true),
  }),
  easyOrder({
    id: "easy-12",
    customerName: "Nick",
    customerEmoji: "👦🏽",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_cheese_on_half_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "cheese_half_2_of_4"),
    spec: spec({ cheese: 2 }, 4),
  }),
  easyOrder({
    id: "easy-13",
    customerName: "Ruby",
    customerEmoji: "👧🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_olives_on_the_whole_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "olives_on_the_whole_pizza"),
    spec: spec({ olive: 4 }, 4, true),
  }),
  easyOrder({
    id: "easy-14",
    customerName: "Ian",
    customerEmoji: "👦",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_the_pizza_with_pepper_and_half_with_cheese"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_half_3"),
    spec: spec({ pepper: 2, cheese: 2 }, 4, true),
  }),
  easyOrder({
    id: "easy-15",
    customerName: "Liam",
    customerEmoji: "🧑",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_basil_on_half_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "basil_half_2_of_4"),
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
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_mushrooms_on_the_whole_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "mushrooms_on_the_whole_pizza"),
    spec: spec({ mushroom: 4 }, 4, true),
  }),
  easyOrder({
    id: "easy-18",
    customerName: "Ava",
    customerEmoji: "👧",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_the_pizza_with_olives_and_half_with_tomato"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_half_4"),
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
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_mushrooms_on_half_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "mushrooms_half_4_of_8"),
    spec: spec({ mushroom: 4 }, 8),
  }),
  eightSliceOrder({
    id: "med-02",
    customerName: "Dan",
    customerEmoji: "👨",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_olives_on_a_quarter_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "olives_a_quarter_2_of_8"),
    spec: spec({ olive: 2 }, 8),
  }),
  eightSliceOrder({
    id: "med-03",
    customerName: "Maya",
    customerEmoji: "👧🏽",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_cheese_on_three_quarters_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "cheese_6_of_8"),
    spec: spec({ cheese: 6 }, 8),
  }),
  eightSliceOrder({
    id: "med-04",
    customerName: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "johnny"),
    customerEmoji: "👦🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_the_pizza_with_cheese_and_half_with_tomato"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_half"),
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
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_pepper_on_half_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "pepper_half_4_of_8"),
    spec: spec({ pepper: 4 }, 8),
  }),
  eightSliceOrder({
    id: "med-07",
    customerName: "Cole",
    customerEmoji: "👨🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_basil_on_a_quarter_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "basil_a_quarter_2_of_8"),
    spec: spec({ basil: 2 }, 8),
  }),
  eightSliceOrder({
    id: "med-08",
    customerName: "Ruby",
    customerEmoji: "👧🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_tomato_on_three_quarters_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "tomato_6_of_8"),
    spec: spec({ tomato: 6 }, 8),
  }),
  eightSliceOrder({
    id: "med-09",
    customerName: "Andy",
    customerEmoji: "👦🏽",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_the_pizza_with_olives_and_half_with_tomato"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_half_4"),
    spec: spec({ olive: 4, tomato: 4 }, 8, true),
  }),
  eightSliceOrder({
    id: "med-10",
    customerName: "Leah",
    customerEmoji: "👧",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_cheese_on_the_whole_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "cheese_on_the_whole_pizza"),
    spec: spec({ cheese: 8 }, 8, true),
  }),
  eightSliceOrder({
    id: "med-11",
    customerName: "Oscar",
    customerEmoji: "👦",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_mushrooms_on_a_quarter_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "mushrooms_a_quarter_2_of_8"),
    spec: spec({ mushroom: 2 }, 8),
  }),
  eightSliceOrder({
    id: "med-12",
    customerName: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "taylor"),
    customerEmoji: "👩",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_olives_on_three_quarters_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "olives_6_of_8"),
    spec: spec({ olive: 6 }, 8),
  }),
  eightSliceOrder({
    id: "med-13",
    customerName: "Ari",
    customerEmoji: "👧🏽",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_the_pizza_with_mushrooms_and_half_with_cheese"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_half_5"),
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
    customerName: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "morgan"),
    customerEmoji: "👧",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_tomato_on_half_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "tomato_half_4_of_8"),
    spec: spec({ tomato: 4 }, 8),
  }),
  eightSliceOrder({
    id: "med-16",
    customerName: "Isaac",
    customerEmoji: "👨",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_the_pizza_with_basil_and_half_with_pepper"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_half_6"),
    spec: spec({ basil: 4, pepper: 4 }, 8, true),
  }),
  eightSliceOrder({
    id: "med-17",
    customerName: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "sophie"),
    customerEmoji: "👧🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_mushrooms_on_three_quarters_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "mushrooms_6_of_8"),
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
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_pepper_on_three_quarters_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "pepper_6_of_8"),
    spec: spec({ pepper: 6 }, 8),
  }),
  eightSliceOrder({
    id: "med-20",
    customerName: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "austin"),
    customerEmoji: "👦🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_the_pizza_with_cheese_and_half_with_basil"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "half_half_7"),
    spec: spec({ cheese: 4, basil: 4 }, 8, true),
  }),
];

/** @type {PizzeriaCustomerOrder[]} */
const HARD_ORDERS = [
  eightSliceOrder({
    id: "hard-01",
    customerName: "Leah",
    customerEmoji: "👧🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_olives_on_an_eighth_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "olives_an_eighth_1_of_8"),
    spec: spec({ olive: 1 }, 8),
  }),
  eightSliceOrder({
    id: "hard-02",
    customerName: "Owen",
    customerEmoji: "👦",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_mushrooms_on_five_eighths_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "mushrooms_5_of_8"),
    spec: spec({ mushroom: 5 }, 8),
  }),
  eightSliceOrder({
    id: "hard-03",
    customerName: "Emma",
    customerEmoji: "👧",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "three_eighths_tomato_and_five_eighths_cheese"),
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
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_basil_on_an_eighth_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "basil_an_eighth_1_of_8"),
    spec: spec({ basil: 1 }, 8),
  }),
  eightSliceOrder({
    id: "hard-07",
    customerName: "Ella",
    customerEmoji: "👧",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_cheese_on_seven_eighths_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "cheese_7_of_8"),
    spec: spec({ cheese: 7 }, 8),
  }),
  eightSliceOrder({
    id: "hard-08",
    customerName: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "jonathan"),
    customerEmoji: "👦",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "three_eighths_pepper_and_five_eighths_cheese"),
    ticketLine: "3 Pepper 🫑 + 5 Cheese 🧀",
    spec: spec({ pepper: 3, cheese: 5 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-09",
    customerName: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "daphne"),
    customerEmoji: "👩",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_tomato_on_two_eighths_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "tomato_2_of_8"),
    spec: spec({ tomato: 2 }, 8),
  }),
  eightSliceOrder({
    id: "hard-10",
    customerName: "Asher",
    customerEmoji: "👦🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "an_eighth_mushrooms_and_the_rest_cheese"),
    ticketLine: "1 Mushrooms 🍄 + 7 Cheese 🧀",
    spec: spec({ mushroom: 1, cheese: 7 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-11",
    customerName: "Kara",
    customerEmoji: "👧🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_olives_on_six_eighths_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "olives_6_of_8"),
    spec: spec({ olive: 6 }, 8),
  }),
  eightSliceOrder({
    id: "hard-12",
    customerName: "Noah",
    customerEmoji: "🧒",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "two_eighths_basil_and_six_eighths_mushrooms"),
    ticketLine: "2 Basil 🌿 + 6 Mushrooms 🍄",
    spec: spec({ basil: 2, mushroom: 6 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-13",
    customerName: "Sarah",
    customerEmoji: "👧",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_cheese_on_five_eighths_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "cheese_5_of_8"),
    spec: spec({ cheese: 5 }, 8),
  }),
  eightSliceOrder({
    id: "hard-14",
    customerName: "Nate",
    customerEmoji: "👦🏽",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "an_eighth_pepper_two_eighths_tomato_and_the_rest_cheese"),
    ticketLine: "1 Pepper 🫑 + 2 Tomato 🍅 + 5 Cheese 🧀",
    spec: spec({ pepper: 1, tomato: 2, cheese: 5 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-15",
    customerName: "Addie",
    customerEmoji: "👧🏽",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "three_eighths_olives_two_eighths_pepper_and_the_rest_cheese"),
    ticketLine: "3 Olives 🫒 + 2 Pepper 🫑 + 3 Cheese 🧀",
    spec: spec({ olive: 3, pepper: 2, cheese: 3 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-16",
    customerName: "Alex",
    customerEmoji: "👦",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_mushrooms_on_three_eighths_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "mushrooms_3_of_8"),
    spec: spec({ mushroom: 3 }, 8),
  }),
  eightSliceOrder({
    id: "hard-17",
    customerName: "Maya",
    customerEmoji: "👧🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_tomato_on_one_eighth_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "tomato_an_eighth_1_of_8"),
    spec: spec({ tomato: 1 }, 8),
  }),
  eightSliceOrder({
    id: "hard-18",
    customerName: "Sam",
    customerEmoji: "👧",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "four_eighths_basil_and_four_eighths_cheese"),
    ticketLine: "4 Basil 🌿 + 4 Cheese 🧀",
    spec: spec({ basil: 4, cheese: 4 }, 8, true),
  }),
  eightSliceOrder({
    id: "hard-19",
    customerName: "Ethan",
    customerEmoji: "👦🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "put_pepper_on_five_eighths_of_the_pizza"),
    ticketLine: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "pepper_5_of_8"),
    spec: spec({ pepper: 5 }, 8),
  }),
  eightSliceOrder({
    id: "hard-20",
    customerName: "Emma",
    customerEmoji: "👧🏻",
    greeting: gamePackCopy("components__educational-games__leo-pizzeria__leo-pizzeria-data", "two_eighths_olives_two_eighths_mushrooms_and_four_eighths_tomato"),
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
