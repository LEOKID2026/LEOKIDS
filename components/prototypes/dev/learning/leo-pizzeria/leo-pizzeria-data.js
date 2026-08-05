/** @typedef {'easy' || 'medium' || 'hard'} DifficultyId */

/** @typedef {{ id: string, emoji: string, name: string }} PizzaTopping */

/**
 * @typedef {{
 *   id: string
 *   customerName: string
 *   customerEmoji: string
 *   greeting: string
 *   ticketLine: string
 *   sliceCount: number
 *   validate: (sliceMap: Record<number, string>) => { ok: boolean, message: string }
 * }} PizzeriaCustomerOrder
 */

export const PROTOTYPE_CUSTOMER_COUNT = 4;

/** @type {PizzaTopping[]} */
export const TOPPINGS = [
  { id: "cheese", emoji: "🧀", name: "to to" },
  { id: "tomato", emoji: "🍅", name: "to" },
  { id: "olive", emoji: "🫒", name: "to" },
  { id: "mushroom", emoji: "🍄", name: "Who" },
  { id: "pepper", emoji: "🫑", name: "to" },
  { id: "basil", emoji: "🌿", name: "to" },
];

export const DIFFICULTY_HINTS = {
  easy: "- to, to Pizza -4 to",
  medium: "-, to to 8 to",
  hard: "- Who to ()",
};

/** @param {Record<number, string>} sliceMap @param {string} toppingId */
function countTopping(sliceMap, toppingId) {
  return Object.values(sliceMap).filter((t) => t === toppingId).length;
}

/** @param {Record<number, string>} sliceMap */
function filledCount(sliceMap) {
  return Object.values(sliceMap).filter(Boolean).length;
}

/** @param {number} sliceCount @param {string} toppingId @param {number} count */
function exactly(sliceMap, sliceCount, toppingId, count) {
  const n = countTopping(sliceMap, toppingId);
  if (n === count) {
    return { ok: true, message: "!    😊🍕" };
  }
  return {
    ok: false,
    message: `   -  ${count}   ${toppingLabel(toppingId)} ( ${n})`,
  };
}

/** @param {string} id */
function toppingLabel(id) {
  return TOPPINGS.find((t) => t.id === id)?.name ?? id;
}

/** @type {Record<DifficultyId, PizzeriaCustomerOrder[]>} */
export const CUSTOMERS_BY_DIFFICULTY = {
  easy: [
    {
      id: "easy-gal",
      customerName: "to",
      customerEmoji: "👧",
      greeting: "to! Pizza with to All to?",
      ticketLine: " 🧀 -   ",
      sliceCount: 4,
      validate: (m) => exactly(m, 4, "cheese", 4),
    },
    {
      id: "easy-ori",
      customerName: "Who",
      customerEmoji: "👦",
      greeting: "to Pizza,!",
      ticketLine: " 🫒 -   (2  4)",
      sliceCount: 4,
      validate: (m) => exactly(m, 4, "olive", 2),
    },
    {
      id: "easy-noa",
      customerName: "to",
      customerEmoji: "👧🏻",
      greeting: "- the!",
      ticketLine: " 🧀 +  🍅",
      sliceCount: 4,
      validate: (m) => {
        const c = countTopping(m, "cheese");
        const t = countTopping(m, "tomato");
        if (c === 2 && t === 2 && filledCount(m) === 4) {
          return { ok: true, message: "!     🍕" };
        }
        return { ok: false, message: "needed 2 to -2 to" };
      },
    },
    {
      id: "easy-amit",
      customerName: "to",
      customerEmoji: "🧒",
      greeting: "to All Pizza -!",
      ticketLine: " 🍅 -   ",
      sliceCount: 4,
      validate: (m) => exactly(m, 4, "tomato", 4),
    },
  ],
  medium: [
    {
      id: "med-sara",
      customerName: "to",
      customerEmoji: "👩",
      greeting: "to! to to to Pizza,.",
      ticketLine: " 🫑 -  (4  8)",
      sliceCount: 8,
      validate: (m) => exactly(m, 8, "pepper", 4),
    },
    {
      id: "med-dan",
      customerName: "to",
      customerEmoji: "👨",
      greeting: "Pizza with?",
      ticketLine: " 🍄 -  (2  8)",
      sliceCount: 8,
      validate: (m) => exactly(m, 8, "mushroom", 2),
    },
    {
      id: "med-maya",
      customerName: "to",
      customerEmoji: "👧🏽",
      greeting: "to to - Almost All!",
      ticketLine: " 🧀 - 6  8 ",
      sliceCount: 8,
      validate: (m) => exactly(m, 8, "cheese", 6),
    },
    {
      id: "med-yoni",
      customerName: "to",
      customerEmoji: "👦🏻",
      greeting: "- to Who!",
      ticketLine: " 🫒 +  🍅",
      sliceCount: 8,
      validate: (m) => {
        const o = countTopping(m, "olive");
        const t = countTopping(m, "tomato");
        if (o === 4 && t === 4 && filledCount(m) === 8) {
          return { ok: true, message: "  ! 🎉" };
        }
        return { ok: false, message: "needed 4 to -4 to" };
      },
    },
  ],
  hard: [
    {
      id: "hard-lia",
      customerName: "",
      customerEmoji: "👧🏻",
      greeting: "Who with to - Small!",
      ticketLine: " 🌿 -  (1  8)",
      sliceCount: 8,
      validate: (m) => exactly(m, 8, "basil", 1),
    },
    {
      id: "hard-ido",
      customerName: "",
      customerEmoji: "👦",
      greeting: "to There are Who - to!",
      ticketLine: " 🧀 - 5  8 ",
      sliceCount: 8,
      validate: (m) => exactly(m, 8, "cheese", 5),
    },
    {
      id: "hard-tal",
      customerName: "",
      customerEmoji: "🧑",
      greeting: "to to - Almost to!",
      ticketLine: "2  🍄 + 4  🍅",
      sliceCount: 8,
      validate: (m) => {
        const mu = countTopping(m, "mushroom");
        const to = countTopping(m, "tomato");
        if (mu === 2 && to === 4 && filledCount(m) === 6) {
          return { ok: true, message: " !   🍕" };
        }
        return { ok: false, message: "needed 2 to -4 to" };
      },
    },
    {
      id: "hard-ron",
      customerName: "",
      customerEmoji: "👨🏻",
      greeting: "to to - Almost to!",
      ticketLine: " 🫒 - 6  8 ",
      sliceCount: 8,
      validate: (m) => exactly(m, 8, "olive", 6),
    },
  ],
};

/** @param {DifficultyId} difficulty */
export function demoCustomersForDifficulty(difficulty) {
  return (CUSTOMERS_BY_DIFFICULTY[difficulty] ?? CUSTOMERS_BY_DIFFICULTY.easy).slice(
    0,
    PROTOTYPE_CUSTOMER_COUNT,
  );
}

/** @param {string || null} toppingId */
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

/** @param {PizzeriaCustomerOrder} order @param {Record<number, string>} sliceMap */
export function validateCustomerOrder(order, sliceMap) {
  return order.validate(sliceMap);
}

export function serveOkMessage() {
  return " !    🎉";
}

export function serveBadMessage() {
  return "not - Buy Try again";
}
