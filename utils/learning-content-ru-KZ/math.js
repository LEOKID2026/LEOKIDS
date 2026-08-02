/**
 * Kazakhstan Russian (ru-KZ) Math display — sparse money overlay on ru-RU stems.
 *
 * Currency (authority: National Bank of Kazakhstan / ISO 4217 KZT):
 * - тенге — indeclinable in Russian (1 тенге, 2 тенге, 5 тенге, 21 тенге)
 * - тиын — 1/100 тенге; Russian count forms тиын / тиына / тиынов
 * - symbol ₸, code KZT
 *
 * Non-money stems inherit rebuildMathStemRuRu unchanged.
 * Params / answers / correctAnswer / IDs are never rewritten here.
 */
import {
  localizeMathQuestionRuRu,
  rebuildMathStemRuRu,
} from "../learning-content-ru-RU/math.js";

export const CURRENCY_RU_KZ = Object.freeze({
  name: "тенге",
  symbol: "₸",
  code: "KZT",
  minorName: "тиын",
});

/**
 * Tenge noun after a cardinal — indeclinable in Russian.
 * @param {unknown} _n
 */
export function tengeWord(_n) {
  return "тенге";
}

/**
 * Tiyn noun form after a cardinal (Russian masculine count pattern).
 * @param {unknown} n
 */
export function tiynWord(n) {
  const abs = Math.abs(Math.trunc(Number(n)));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return "тиынов";
  if (mod10 === 1) return "тиын";
  if (mod10 >= 2 && mod10 <= 4) return "тиына";
  return "тиынов";
}

function moneyAmount(n) {
  return `${n} ${tengeWord(n)}`;
}

function tiynAmount(n) {
  return `${n} ${tiynWord(n)}`;
}

/**
 * Rebuild only Kazakhstan money stems. Returns null for non-money kinds.
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildMoneyStemRuKz(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "");

  if (kind === "wp_pocket_money" || kind === "wp_pocket_money_g2") {
    return `У Эммы ${moneyAmount(p.money)}. Она покупает перекус за ${moneyAmount(p.toy)}. Сколько денег осталось?`;
  }
  if (kind === "wp_coins") {
    return `У Лео ${p.coins1} монет по 1 тенге и ${p.coins2} монет по 2 тенге. Сколько денег у него всего?`;
  }
  if (kind === "wp_coins_spent") {
    return `У Лео есть ${moneyAmount(p.total)}. Он покупает конфеты за ${moneyAmount(p.spent)}. Сколько денег осталось?`;
  }
  if (kind === "wp_kopecks" || kind === "wp_coins_kopecks") {
    const r = p.rubles ?? p.rub;
    const k = p.kopecks ?? p.kop;
    if (r != null && k != null) {
      return `У Лео ${moneyAmount(r)} и ${tiynAmount(k)}. Сколько это всего в тиынах?`;
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
export function rebuildMathStemRuKz(question) {
  const money = rebuildMoneyStemRuKz(question);
  if (money != null) return money;
  return rebuildMathStemRuRu(question);
}

/**
 * Localize math question for ru-KZ: ru-RU base + Kazakhstan money stems.
 * @param {Record<string, unknown>} question
 */
export function localizeMathQuestionRuKz(question) {
  if (!question) return question;
  const moneyStem = rebuildMoneyStemRuKz(question);
  const localized = localizeMathQuestionRuRu(question);
  if (!moneyStem) return localized;

  /** @type {Record<string, unknown>} */
  const out = { ...localized };
  out.question = moneyStem;
  out.exerciseText = moneyStem;
  if (
    typeof out.questionLabel === "string" &&
    (!out.questionLabel.trim() || /рубл|копеек|копейк|\u20BD/.test(out.questionLabel))
  ) {
    out.questionLabel = moneyStem;
  }
  out.displayStemSource = "params";
  return out;
}
