/**
 * Belarus Russian (ru-BY) Math display — sparse money overlay on ru-RU stems.
 *
 * Currency (authority: National Bank of the Republic of Belarus / ISO 4217 BYN):
 * - белорусский рубль — child stems use official Latin symbol «Br» (never RF ₽ / bare «руб.»)
 * - symbol Br, code BYN
 * - копейка — 1/100; Russian count forms копейка / копейки / копеек
 *   (read as Belarusian subunit because the major unit is always Br)
 *
 * Non-money stems inherit rebuildMathStemRuRu unchanged.
 * Params / answers / correctAnswer / IDs are never rewritten here.
 */
import {
  localizeMathQuestionRuRu,
  rebuildMathStemRuRu,
} from "../learning-content-ru-RU/math.js";

export const CURRENCY_RU_BY = Object.freeze({
  name: "белорусский рубль",
  /** Child-facing major unit — NBRB Latin symbol; indeclinable. */
  shortName: "Br",
  symbol: "Br",
  code: "BYN",
  minorName: "копейка",
});

/**
 * Child-facing major-unit label after a cardinal — always «Br» (indeclinable).
 * @param {unknown} _n
 */
export function bynRubleWord(_n) {
  return CURRENCY_RU_BY.symbol;
}

/**
 * Full Russian noun phrase for белорусский рубль after a cardinal
 * (authority / grammar reference; child stems use Br).
 * @param {unknown} n
 */
export function bynRubleFullPhrase(n) {
  const abs = Math.abs(Math.trunc(Number(n)));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return "белорусских рублей";
  if (mod10 === 1) return "белорусский рубль";
  if (mod10 >= 2 && mod10 <= 4) return "белорусских рубля";
  return "белорусских рублей";
}

/**
 * Belarusian kopeck noun after a cardinal.
 * @param {unknown} n
 */
export function bynKopeckWord(n) {
  const abs = Math.abs(Math.trunc(Number(n)));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return "копеек";
  if (mod10 === 1) return "копейка";
  if (mod10 >= 2 && mod10 <= 4) return "копейки";
  return "копеек";
}

/** Child-facing major-unit amount: NBRB «Br» (BYN), never ₽ / руб. */
function moneyAmount(n) {
  return `${n} ${CURRENCY_RU_BY.symbol}`;
}

function kopeckAmount(n) {
  return `${n} ${bynKopeckWord(n)}`;
}

/**
 * Rebuild only Belarus money stems. Returns null for non-money kinds.
 * @param {Record<string, unknown>} question
 * @returns {string|null}
 */
export function rebuildMoneyStemRuBy(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "");

  if (kind === "wp_pocket_money" || kind === "wp_pocket_money_g2") {
    return `У Эммы ${moneyAmount(p.money)}. Она покупает перекус за ${moneyAmount(p.toy)}. Сколько денег осталось?`;
  }
  if (kind === "wp_coins") {
    return `У Лео ${p.coins1} монет по 1 Br и ${p.coins2} монет по 2 Br. Сколько денег у него всего?`;
  }
  if (kind === "wp_coins_spent") {
    return `У Лео есть ${moneyAmount(p.total)}. Он покупает конфеты за ${moneyAmount(p.spent)}. Сколько денег осталось?`;
  }
  if (kind === "wp_kopecks" || kind === "wp_coins_kopecks") {
    const r = p.rubles ?? p.rub;
    const k = p.kopecks ?? p.kop;
    if (r != null && k != null) {
      return `У Лео ${moneyAmount(r)} и ${kopeckAmount(k)}. Сколько это всего в копейках?`;
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
export function rebuildMathStemRuBy(question) {
  const money = rebuildMoneyStemRuBy(question);
  if (money != null) return money;
  return rebuildMathStemRuRu(question);
}

/**
 * Strip Russian Federation currency symbol if it leaked into display text.
 * @param {unknown} value
 * @returns {unknown}
 */
function stripRfRubleSymbol(value) {
  if (typeof value !== "string") return value;
  return value.replace(/\u20BD/g, CURRENCY_RU_BY.symbol);
}

/**
 * Localize math question for ru-BY: ru-RU base + Belarus money stems.
 * @param {Record<string, unknown>} question
 */
export function localizeMathQuestionRuBy(question) {
  if (!question) return question;

  const paramsSnapshot = question.params;
  const idSnapshot = question.id;
  const correctAnswerSnapshot = question.correctAnswer;
  const correctIndexSnapshot = question.correctIndex;
  const answersSnapshot = Array.isArray(question.answers) ? [...question.answers] : question.answers;
  const diagnosticSnapshot = question.diagnostic;
  const tagsSnapshot = question.tags;
  const questionKindSnapshot = question.questionKind;

  const moneyStem = rebuildMoneyStemRuBy(question);
  const localized = localizeMathQuestionRuRu(question);

  /** @type {Record<string, unknown>} */
  const out = { ...localized };

  if (moneyStem) {
    out.question = moneyStem;
    out.exerciseText = moneyStem;
    if (
      typeof out.questionLabel === "string" &&
      (!out.questionLabel.trim() || /рубл|руб\.|копеек|копейк|\u20BD/.test(out.questionLabel))
    ) {
      out.questionLabel = moneyStem;
    }
    out.displayStemSource = "params";
  } else {
    out.question = stripRfRubleSymbol(out.question);
    out.exerciseText = stripRfRubleSymbol(out.exerciseText);
    out.questionLabel = stripRfRubleSymbol(out.questionLabel);
  }

  // Preserve identity / math payload — currency layer must not mutate them.
  out.params = paramsSnapshot;
  out.id = idSnapshot;
  out.correctAnswer = correctAnswerSnapshot;
  out.correctIndex = correctIndexSnapshot;
  out.answers = answersSnapshot;
  if (diagnosticSnapshot !== undefined) out.diagnostic = diagnosticSnapshot;
  if (tagsSnapshot !== undefined) out.tags = tagsSnapshot;
  if (questionKindSnapshot !== undefined) out.questionKind = questionKindSnapshot;

  return out;
}
