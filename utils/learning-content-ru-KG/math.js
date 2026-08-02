/**
 * Kyrgyzstan Russian-medium (ru-KG) Math display — ru-RU stems with local currency.
 * Major unit: сом (KGS). Minor unit: тыйын (1/100).
 * Params / answers / IDs unchanged; only child-facing money wording differs from ru-RU.
 */
import {
  localizeMathQuestionRuRu,
  rebuildMathStemRuRu,
} from "../learning-content-ru-RU/math.js";

export const CURRENCY_RU_KG = Object.freeze({
  name: "сом",
  code: "KGS",
  /** ISO / common Latin symbol used in finance copy; word form preferred in stems. */
  symbol: "с",
  minorName: "тыйын",
});

const MONEY_KINDS = new Set([
  "wp_pocket_money",
  "wp_pocket_money_g2",
  "wp_coins",
  "wp_coins_spent",
  "wp_kopecks",
  "wp_coins_kopecks",
  "wp_shop_discount",
  "wp_multi_step",
  "wp_multi_step_g6",
]);

/** Russian count form for сом after a cardinal (1 сом, 2 сома, 5 сомов). */
export function somWord(n) {
  const abs = Math.abs(Math.trunc(Number(n)));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return "сомов";
  if (mod10 === 1) return "сом";
  if (mod10 >= 2 && mod10 <= 4) return "сома";
  return "сомов";
}

/** Dative singular used in distributive «по 1 …». */
export function somDativeWord(n) {
  const abs = Math.abs(Math.trunc(Number(n)));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod10 === 1 && !(mod100 >= 11 && mod100 <= 14)) return "сому";
  return somWord(n);
}

/** Russian count form for тыйын after a cardinal (1 тыйын, 2 тыйына, 5 тыйынов). */
export function tyiynWord(n) {
  const abs = Math.abs(Math.trunc(Number(n)));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return "тыйынов";
  if (mod10 === 1) return "тыйын";
  if (mod10 >= 2 && mod10 <= 4) return "тыйына";
  return "тыйынов";
}

function moneyAmount(n) {
  return `${n} ${somWord(n)}`;
}

function tyiynAmount(n) {
  return `${n} ${tyiynWord(n)}`;
}

/**
 * Replace Russian Federation currency wording with Kyrgyzstan сом/тыйын.
 * Longer forms first to avoid partial replacements.
 * @param {string} text
 */
export function applyKgCurrencyWording(text) {
  let out = String(text ?? "");
  if (!out) return out;
  out = out.replace(/копейках/g, "тыйынах");
  out = out.replace(/копеек/g, "тыйынов");
  out = out.replace(/копейки/g, "тыйына");
  out = out.replace(/копейка/g, "тыйын");
  out = out.replace(/рублей/g, "сомов");
  out = out.replace(/рубля/g, "сома");
  out = out.replace(/рублю/g, "сому");
  out = out.replace(/рубль/g, "сом");
  out = out.replace(/\u20BD/g, CURRENCY_RU_KG.symbol);
  return out;
}

/**
 * Rebuild money stems with сом/тыйын. Non-money kinds → null (inherit ru-RU).
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildMoneyStemRuKg(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "");
  if (!MONEY_KINDS.has(kind)) return null;

  if (kind === "wp_pocket_money" || kind === "wp_pocket_money_g2") {
    return `У Эммы ${moneyAmount(p.money)}. Она покупает перекус за ${moneyAmount(p.toy)}. Сколько денег осталось?`;
  }
  if (kind === "wp_coins") {
    return `У Лео ${p.coins1} монет по 1 ${somDativeWord(1)} и ${p.coins2} монет по 2 ${somWord(2)}. Сколько денег у него всего?`;
  }
  if (kind === "wp_coins_spent") {
    return `У Лео есть ${moneyAmount(p.total)}. Он покупает конфеты за ${moneyAmount(p.spent)}. Сколько денег осталось?`;
  }
  if (kind === "wp_kopecks" || kind === "wp_coins_kopecks") {
    const r = p.rubles ?? p.rub;
    const k = p.kopecks ?? p.kop;
    if (r != null && k != null) {
      return `У Лео ${moneyAmount(r)} и ${tyiynAmount(k)}. Сколько это всего в тыйынах?`;
    }
    return null;
  }
  if (kind === "wp_shop_discount") {
    return `Футболка стоит ${moneyAmount(p.price)} со скидкой ${p.discPerc}%. Сколько нужно заплатить после скидки?`;
  }
  if (kind === "wp_multi_step" || kind === "wp_multi_step_g6") {
    return `У Лео ${moneyAmount(p.money)}. Он покупает ${p.a} ручек и ${p.b} карандашей, каждый предмет стоит ${moneyAmount(p.price)}. Сколько денег останется после покупок?`;
  }
  return null;
}

/**
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildMathStemRuKg(question) {
  const money = rebuildMoneyStemRuKg(question);
  if (money != null) return money;
  const base = rebuildMathStemRuRu(question);
  if (base == null) return null;
  return applyKgCurrencyWording(base);
}

/**
 * @param {unknown} value
 * @returns {unknown}
 */
function transformLocalizedValue(value) {
  if (typeof value === "string") return applyKgCurrencyWording(value);
  if (Array.isArray(value)) return value.map((item) => transformLocalizedValue(item));
  return value;
}

/**
 * Localize math question for ru-KG: ru-RU layer + сом/тыйын on display text only.
 * @param {Record<string, unknown>} question
 */
export function localizeMathQuestionRuKg(question) {
  if (!question) return question;
  const paramsSnapshot = question.params;
  const idSnapshot = question.id;
  const correctAnswerSnapshot = question.correctAnswer;
  const correctIndexSnapshot = question.correctIndex;
  const answersSnapshot = Array.isArray(question.answers) ? [...question.answers] : question.answers;

  const moneyStem = rebuildMoneyStemRuKg(question);
  const localized = localizeMathQuestionRuRu(question);
  const out = { ...localized };

  if (moneyStem) {
    out.question = moneyStem;
    out.exerciseText = moneyStem;
    if (out.questionLabel != null) out.questionLabel = moneyStem;
  } else {
    out.question = transformLocalizedValue(out.question);
    out.exerciseText = transformLocalizedValue(out.exerciseText);
    out.questionLabel = transformLocalizedValue(out.questionLabel);
  }

  // Preserve identity / math payload — currency layer must not mutate them.
  out.params = paramsSnapshot;
  out.id = idSnapshot;
  out.correctAnswer = correctAnswerSnapshot;
  out.correctIndex = correctIndexSnapshot;
  out.answers = answersSnapshot;
  return out;
}
