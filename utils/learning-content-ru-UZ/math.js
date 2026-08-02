/**
 * Uzbekistan Russian-medium (ru-UZ) Math display — sparse money overlay on ru-RU stems.
 *
 * Currency (authority: CBU / lex.uz УП-870 / ISO 4217 UZS):
 * - сум — Russian masculine count forms: сум / сума / сумов (Грамота.ру)
 * - тийин — 1/100 сума; Russian count forms тийин / тийина / тийинов
 * - code UZS (no special glyph required in child stems)
 *
 * Non-money stems inherit rebuildMathStemRuRu unchanged.
 * Params / answers / correctAnswer / IDs are never rewritten here.
 */
import {
  localizeMathQuestionRuRu,
  rebuildMathStemRuRu,
} from "../learning-content-ru-RU/math.js";

export const CURRENCY_RU_UZ = Object.freeze({
  name: "сум",
  code: "UZS",
  minorName: "тийин",
});

/**
 * Sum noun after a cardinal (Russian masculine count pattern).
 * @param {unknown} n
 */
export function sumWord(n) {
  const abs = Math.abs(Math.trunc(Number(n)));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return "сумов";
  if (mod10 === 1) return "сум";
  if (mod10 >= 2 && mod10 <= 4) return "сума";
  return "сумов";
}

/**
 * Tiyin noun form after a cardinal (Russian masculine count pattern).
 * @param {unknown} n
 */
export function tiyinWord(n) {
  const abs = Math.abs(Math.trunc(Number(n)));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return "тийинов";
  if (mod10 === 1) return "тийин";
  if (mod10 >= 2 && mod10 <= 4) return "тийина";
  return "тийинов";
}

function moneyAmount(n) {
  return `${n} ${sumWord(n)}`;
}

function tiyinAmount(n) {
  return `${n} ${tiyinWord(n)}`;
}

/**
 * Rebuild only Uzbekistan money stems. Returns null for non-money kinds.
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildMoneyStemRuUz(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "");

  if (kind === "wp_pocket_money" || kind === "wp_pocket_money_g2") {
    return `У Эммы ${moneyAmount(p.money)}. Она покупает перекус за ${moneyAmount(p.toy)}. Сколько денег осталось?`;
  }
  if (kind === "wp_coins") {
    return `У Лео ${p.coins1} монет по 1 суму и ${p.coins2} монет по 2 сума. Сколько денег у него всего?`;
  }
  if (kind === "wp_coins_spent") {
    return `У Лео есть ${moneyAmount(p.total)}. Он покупает конфеты за ${moneyAmount(p.spent)}. Сколько денег осталось?`;
  }
  if (kind === "wp_kopecks" || kind === "wp_coins_kopecks") {
    const r = p.rubles ?? p.rub;
    const k = p.kopecks ?? p.kop;
    if (r != null && k != null) {
      return `У Лео ${moneyAmount(r)} и ${tiyinAmount(k)}. Сколько это всего в тийинах?`;
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
export function rebuildMathStemRuUz(question) {
  const money = rebuildMoneyStemRuUz(question);
  if (money != null) return money;
  return rebuildMathStemRuRu(question);
}

/**
 * Localize math question for ru-UZ: ru-RU base + Uzbekistan money stems.
 * @param {Record<string, unknown>} question
 */
export function localizeMathQuestionRuUz(question) {
  if (!question) return question;
  const moneyStem = rebuildMoneyStemRuUz(question);
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
