/**
 * Russian (ru-RU / Russia) rebuilders for math question stems.
 * English is the authority; params/numbers/operators unchanged.
 * Currency display for Russia: рубль / рубля / рублей (₽).
 * Child-facing stems use ты-imperatives.
 */
import { BLANK } from "../math-constants.js";
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

const WEEKDAYS_RU = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
];

/** Object nouns used in group/count stems (nominative plural for counts). */
const OBJECTS_RU = Object.freeze({
  items: "предметов",
  apples: "яблок",
  balls: "мячей",
  stickers: "наклеек",
  books: "книг",
  pencils: "карандашей",
  chairs: "стульев",
  cards: "карточек",
  boxes: "коробок",
  coins: "монет",
});

const YES_NO = Object.freeze({ Yes: "Да", No: "Нет", yes: "да", no: "нет" });
const PRIME_COMPOSITE = Object.freeze({
  prime: "простое",
  composite: "составное",
  Prime: "Простое",
  Composite: "Составное",
});
const PARITY = Object.freeze({
  even: "чётное",
  odd: "нечётное",
  Even: "Чётное",
  Odd: "Нечётное",
});
const MATH_PHRASES = [];

/**
 * Required terminology (Математика / Russia content layer):
 * сложение, вычитание, умножение, деление, дробь, процент,
 * десятичное число, чётное число, нечётное число, числовая прямая.
 */
export const MATH_TERMS_RU_RU = Object.freeze({
  subject: "Математика",
  addition: "сложение",
  subtraction: "вычитание",
  multiplication: "умножение",
  division: "деление",
  fraction: "дробь",
  percent: "процент",
  decimal: "десятичное число",
  even: "чётное число",
  odd: "нечётное число",
  numberLine: "числовая прямая",
});

/** Russian ruble noun form after a cardinal number. */
export function rubleWord(n) {
  const abs = Math.abs(Math.trunc(Number(n)));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return "рублей";
  if (mod10 === 1) return "рубль";
  if (mod10 >= 2 && mod10 <= 4) return "рубля";
  return "рублей";
}

/** Russian kopeck noun form after a cardinal number. */
export function kopeckWord(n) {
  const abs = Math.abs(Math.trunc(Number(n)));
  const mod100 = abs % 100;
  const mod10 = abs % 10;
  if (mod100 >= 11 && mod100 <= 14) return "копеек";
  if (mod10 === 1) return "копейка";
  if (mod10 >= 2 && mod10 <= 4) return "копейки";
  return "копеек";
}

function moneyAmount(n) {
  return `${n} ${rubleWord(n)}`;
}

function kopeckAmount(n) {
  return `${n} ${kopeckWord(n)}`;
}

function applyMathPhrases(text) {
  let out = String(text ?? "");
  for (const [from, to] of MATH_PHRASES) {
    if (out.includes(from)) out = out.split(from).join(to);
  }
  return out;
}

function inferMathLevelKey(question) {
  const lv = String(question?.params?.difficulty || question?.levelKey || "easy");
  if (lv === "hard" || lv === "medium") return lv;
  return "easy";
}

function inferSelectedOp(question) {
  return String(question?.operation || question?.params?.kind || "").replace(/^wp_/, "word_problems");
}

/** Rebuild word-problem / story stems from params when kind is known. */
export function rebuildMathStemRuRu(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "");
  const gradeKey = String(question?.gradeKey || p.gradeKey || "g3");

  if (kind === "mul_groups_g1") {
    const objects = OBJECTS_RU[p.objects] || String(p.objects || "предметов");
    return `Есть ${p.groups} группы. В каждой группе по ${p.perGroup} ${objects}. Сколько ${objects} всего?`;
  }
  if (kind === "mul_skip_count_g1") {
    const seq = Array.isArray(p.seq) ? p.seq : [];
    const head = seq.slice(0, -1).join(", ");
    return `Считай через ${p.perGroup}: ${head}, ${BLANK}`;
  }
  if (kind === "ns_number_line" || kind === "ns_number_line_g1") {
    const nums = Array.isArray(p.numbers) ? p.numbers : [];
    const line = nums.map((n) => (n === BLANK || n === "__" ? BLANK : n)).join(" - ");
    return `Вставь пропущенное число на числовой прямой: ${line}`;
  }
  if (kind === "ns_even_odd" || kind === "ns_parity") {
    return `${p.n ?? p.num} — чётное число?`;
  }
  if (kind === "frac_half" || kind === "frac_half_reverse") {
    if (kind === "frac_half_reverse" && p.whole != null) {
      return `Половина от ${BLANK} равна ${p.whole / 2}. Какое целое число?`;
    }
    return `Чему равна половина от ${p.whole ?? p.n}?`;
  }
  if (kind === "frac_quarter" || kind === "frac_quarter_reverse") {
    if (kind === "frac_quarter_reverse" && p.whole != null) {
      return `Одна четверть от ${BLANK} равна ${p.whole / 4}. Какое целое число?`;
    }
    return `Чему равна одна четверть от ${p.whole ?? p.n}?`;
  }
  if (
    kind === "frac_compare_like_den_g4" ||
    kind === "frac_compare_like_den_g3" ||
    kind === "frac_compare_same_den"
  ) {
    if (p.n1 != null && p.n2 != null && p.den != null) {
      return `Какая дробь больше — ${p.n1}/${p.den} или ${p.n2}/${p.den}? Напиши большую дробь: ${BLANK}`;
    }
  }
  if (
    kind === "frac_same_den_add_g4" ||
    kind === "frac_same_den_add" ||
    kind === "frac_same_den_sub_g4" ||
    kind === "frac_same_den_sub"
  ) {
    if (p.n1 != null && p.n2 != null && p.den != null) {
      const op = p.op === "add" || kind.includes("add") ? "+" : "−";
      return `${p.n1}/${p.den} ${op} ${p.n2}/${p.den} = ${BLANK}`;
    }
  }
  if (kind === "frac_simplify_intro_g4" || kind === "frac_simplify_intro_g3") {
    if (p.num != null && p.den != null) {
      return `Сократи дробь ${p.num}/${p.den}: ${BLANK}`;
    }
  }
  if (kind === "frac_equivalent_expand" || kind === "frac_equivalent") {
    if (p.num != null && p.den != null && p.factor != null) {
      return `Найди равную дробь для ${p.num}/${p.den} (умножь на ${p.factor}): ${BLANK}`;
    }
  }
  if (kind === "wp_simple_add" || kind === "wp_simple_add_g2") {
    if (kind === "wp_simple_add_g2") {
      return `В классе было ${p.a} детей, и ещё ${p.b} присоединились. Сколько детей теперь?`;
    }
    return `У Лео ${p.a} мячей, и он получает ещё ${p.b}. Сколько мячей у Лео всего?`;
  }
  if (kind === "wp_simple_sub" || kind === "wp_simple_sub_g2") {
    if (kind === "wp_simple_sub_g2") {
      return `В корзине ${p.total} яблок. Съели ${p.give}. Сколько яблок осталось?`;
    }
    return `У Лео ${p.total} наклеек. Он отдаёт ${p.give} другу. Сколько наклеек у Лео осталось?`;
  }
  if (kind === "wp_pocket_money" || kind === "wp_pocket_money_g2") {
    return `У Эммы ${moneyAmount(p.money)}. Она покупает перекус за ${moneyAmount(p.toy)}. Сколько денег осталось?`;
  }
  if (kind === "wp_groups_g2") {
    return `В каждом ряду ${p.per} стульев. Таких рядов ${p.groups}. Сколько стульев всего?`;
  }
  if (kind === "wp_groups_g3") {
    return `В каждой коробке ${p.per} карандашей. Коробок ${p.groups}. Сколько карандашей всего?`;
  }
  if (kind === "wp_groups_g4") {
    return `На каждой полке ${p.per} книг. Полок ${p.groups}. Сколько книг всего?`;
  }
  if (kind === "wp_groups_late_g6") {
    return `В каждом контейнере ${p.per} деталей. Доставили ${p.groups} контейнеров. Сколько деталей всего?`;
  }
  if (kind === "wp_groups" || kind === "wp_groups_late") {
    return `В каждом ящике ${p.per} посылок. Доставили ${p.groups} ящиков. Сколько посылок всего?`;
  }
  if (kind === "wp_comparison_more") {
    return `У Ноа ${p.big} карточек, а у Юваля ${p.small}. На сколько карточек у Ноа больше, чем у Юваля?`;
  }
  if (kind === "wp_part_whole_g4") {
    return `В зале ${p.whole} мест. ${p.partA} заняты на спектакль, остальные свободны. Сколько мест свободны?`;
  }
  if (kind === "wp_part_whole") {
    return `В классе ${p.whole} учеников. ${p.partA} в футбольном кружке, остальные в шахматном. Сколько учеников в шахматном кружке?`;
  }
  if (kind === "wp_change_stack_g4") {
    return `На складе было ${p.start} коробок. Добавили ${p.gain} новых и отправили ${p.loss} в другой филиал. Сколько коробок осталось?`;
  }
  if (kind === "wp_change_stack") {
    return `В библиотеке было ${p.start} книг. Добавили ${p.gain} новых и выдали ${p.loss}. Сколько книг теперь в библиотеке?`;
  }
  if (kind === "wp_time_days") {
    const start = WEEKDAYS_RU[p.startDayIdx] || "понедельник";
    const end = WEEKDAYS_RU[p.endDayIdx] || "пятница";
    return `Если сегодня ${start}, сколько дней до дня «${end}»?`;
  }
  if (kind === "wp_time_date") {
    return `Если сегодня ${p.today}-е число месяца, какое число будет через ${p.daysLater} дней?`;
  }
  if (kind === "wp_coins") {
    return `У Лео ${p.coins1} монет по 1 рублю и ${p.coins2} монет по 2 рубля. Сколько денег у него всего?`;
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
  }
  if (kind === "wp_division_simple") {
    return `Есть ${p.total} яблок, их делят на группы по ${p.perGroup}. Сколько групп получится?`;
  }
  if (kind === "wp_leftover") {
    return `${p.total} учеников делят на группы по ${p.groupSize}. Сколько учеников останется без полной группы?`;
  }
  if (kind === "wp_shop_discount") {
    return `Футболка стоит ${moneyAmount(p.price)} со скидкой ${p.discPerc}%. Сколько нужно заплатить после скидки?`;
  }
  if (kind === "wp_unit_cm_to_m") {
    return `Сколько метров в ${p.cm} сантиметрах? = ${BLANK}`;
  }
  if (kind === "wp_unit_g_to_kg") {
    return `Сколько килограммов в ${p.g} граммах? = ${BLANK}`;
  }
  if (kind === "wp_distance_time") {
    return `Ребёнок идёт со скоростью ${p.speed} км/ч в течение ${p.hours} ч. Сколько километров он пройдёт?`;
  }
  if (kind === "wp_time_sum") {
    return `Один ролик длится ${p.l1} минут, другой — ${p.l2} минут. Сколько минут длятся оба ролика вместе?`;
  }
  if (kind === "wp_average" || kind === "wp_average_g6") {
    if (kind === "wp_average_g6") {
      return `Групповой проект получил оценки ${p.s1}, ${p.s2} и ${p.s3} на трёх этапах. Чему равна средняя оценка (округли до целого)?`;
    }
    return `Лео получил ${p.s1}, ${p.s2} и ${p.s3} за три теста. Чему равна его средняя оценка (округли до целого)?`;
  }
  if (kind === "wp_multi_step" || kind === "wp_multi_step_g6") {
    return `У Лео ${moneyAmount(p.money)}. Он покупает ${p.a} ручек и ${p.b} карандашей, каждый предмет стоит ${moneyAmount(p.price)}. Сколько денег останется после покупок?`;
  }
  if (kind === "operation_choice_word_problem_probe") {
    return `Есть ${p.groups} групп, в каждой по ${p.each} предметов. Какое действие находит общее количество?`;
  }

  if (kind.startsWith("wp_") || inferSelectedOp(question) === "word_problems") {
    return null;
  }

  return applyMathLevelPresentationRuRu(
    String(question?.question || question?.exerciseText || p.exerciseText || ""),
    {
      selectedOp: question?.operation || inferSelectedOp(question),
      params: p,
      mathLevelKey: inferMathLevelKey(question),
      gradeKey,
    }
  );
}

/** Russian mirror of applyMathLevelPresentation. */
export function applyMathLevelPresentationRuRu(question, ctx) {
  const q0 = String(question || "");
  if (!q0.trim()) return q0;
  const { selectedOp, params, mathLevelKey } = ctx;
  const kind = String(params?.kind || "");
  if (kind.startsWith("wp_") || selectedOp === "word_problems") return q0;

  if (kind === "ns_complement100") {
    const b = params?.b;
    const c = params?.c != null ? Number(params.c) : 100;
    if (b != null && Number.isFinite(c)) {
      if (mathLevelKey === "easy") {
        return `Составь ${c}: что нужно прибавить к ${b}, чтобы получить ${c}? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Дано: ${b} + ${BLANK} = ${c}. Какое число пропущено?`;
      }
      return `Задача: к ${b} не хватает части, чтобы получить ${c} — сколько прибавить? = ${BLANK}`;
    }
  }

  if (kind === "ns_complement10") {
    const b = params?.b;
    const c = params?.c != null ? Number(params.c) : 10;
    if (b != null && Number.isFinite(c)) {
      if (mathLevelKey === "easy") {
        return `До ${c}: что прибавить к ${b}, чтобы получилось ${c}? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Пропущенное в уравнении: ${b} + ${BLANK} = ${c}`;
      }
      return `Без столбика: какое слагаемое к ${b} даёт ${c}? = ${BLANK}`;
    }
  }

  if (kind === "scale_find") {
    const ml = params?.mapLength;
    const rl = params?.realLength;
    if (ml != null && rl != null) {
      if (mathLevelKey === "easy") {
        return `На карте отрезок ${ml} см, а в действительности ${rl} см. Дополни масштаб как 1:${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Длина на карте ${ml} см, реальная длина ${rl} см. Какой масштаб? Напиши число после 1: = ${BLANK}`;
      }
      return `Карта ${ml} см и реальность ${rl} см — масштаб 1:__. Какое число пропущено? = ${BLANK}`;
    }
  }

  if (kind === "scale_map_to_real") {
    const ml = params?.mapLength;
    const sc = params?.scale;
    if (ml != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `При масштабе 1:${sc} сколько реальных см соответствуют ${ml} см на карте? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Масштаб 1:${sc}. Измерение на карте ${ml} см — какова реальная длина в см? = ${BLANK}`;
      }
      return `Масштаб 1:${sc}, на карте ${ml} см — найди реальную длину в см = ${BLANK}`;
    }
  }

  if (kind === "scale_real_to_map") {
    const rl = params?.realLength;
    const sc = params?.scale;
    if (rl != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `При масштабе 1:${sc} реальная длина ${rl} см — сколько см на карте? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Реальная длина ${rl} см, масштаб 1:${sc}. Какова длина на карте? = ${BLANK}`;
      }
      return `Переведи реальность в карту: ${rl} см при 1:${sc} — сколько см на странице? = ${BLANK}`;
    }
  }

  if (selectedOp === "compare" || kind === "cmp") {
    const raw = params?.exerciseText ? String(params.exerciseText) : "";
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 4;
    if (mathLevelKey === "easy") {
      const opts = [
        `Сравни два числа и вставь знак (<, =, >): ${raw}`,
        `Знак сравнения между числами: ${raw}`,
        `Выбери < , = или > — сравни: ${raw}`,
        `Сравни значения и вставь знак: ${raw}`,
      ];
      return opts[pv].trim();
    }
    if (mathLevelKey === "medium") {
      const opts = [
        `Вставь правильный знак сравнения: ${raw}`,
        `Какой знак сравнивает пару? ${raw}`,
        `Подбери верный знак сравнения: ${raw}`,
        `Вставь знак между числовыми выражениями: ${raw}`,
      ];
      return opts[pv].trim();
    }
    const opts = [
      `Вставь знак сравнения — проверь перед выбором: ${raw}`,
      `Сравни внимательно и выбери знак: ${raw}`,
      `Сравни осторожно и выбери знак: ${raw}`,
      `Быстрая проверка: какой знак подходит? ${raw}`,
    ];
    return opts[pv].trim();
  }

  if (selectedOp === "divisibility" || kind === "divisibility") {
    const num = params?.num;
    const div = params?.divisor;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (num != null && div != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Делимость: делится ли ${num} на ${div} без остатка?`
          : `Проверь: является ли ${num} кратным ${div} (без остатка)?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Признаки делимости — делится ли ${num} на ${div}?`
          : `Целочисленное деление: ${num} ÷ ${div} — результат целое число?`;
      }
      return pv === 0
        ? `Проверка делимости: делится ли ${num} на ${div}?`
        : `Делители: делит ли ${div} число ${num} нацело?`;
    }
  }

  if (selectedOp === "prime_composite" || kind === "prime_composite") {
    const num = params?.num;
    const subKind = String(params?.subKind || "pc_classify");
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (subKind === "pc_factor_count" && num != null) {
      if (mathLevelKey === "easy") return `Простые числа: сколько делителей у ${num}?`;
      if (mathLevelKey === "medium") {
        return `Посчитай делители: сколько натуральных делителей у ${num} (включая 1 и само число)?`;
      }
      return `Делители: сколько различных делителей у ${num}?`;
    }
    if (subKind === "pc_smallest_prime" && num != null) {
      if (mathLevelKey === "easy") return `Простой множитель: каков наименьший простой множитель числа ${num}?`;
      if (mathLevelKey === "medium") return `Найди наименьший простой множитель числа ${num}.`;
      return `Множители: каков наименьший простой множитель числа ${num}?`;
    }
    if (subKind === "pc_divisor_pick" && num != null && params?.divisorCandidate != null) {
      const d = params.divisorCandidate;
      if (mathLevelKey === "easy") return `Проверка делителя: делит ли ${d} число ${num} нацело?`;
      if (mathLevelKey === "medium") return `Делители: делится ли ${num} на ${d}?`;
      return `Делители: делит ли ${d} число ${num} нацело?`;
    }
    if (num != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Простые числа: ${num} — простое или составное?`
          : `Базовая классификация: ${num} — простое или составное?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Классифицируй число: ${num} — простое или составное?`
          : `Есть ли у ${num} ровно два различных натуральных делителя?`;
      }
      return pv === 0
        ? `${num} — простое или составное? Подумай, прежде чем выбрать.`
        : `Быстрая проверка: можно ли представить ${num} как произведение двух множителей больше 1?`;
    }
  }

  if (selectedOp === "powers" && (kind === "power_base" || kind === "power_calc")) {
    if (kind === "power_calc") {
      if (mathLevelKey === "easy") return `Степени: ${q0}`;
      if (mathLevelKey === "medium") return `Вычисли степень — ${q0}`;
      return `Степени: ${q0}`;
    }
    if (kind === "power_base") {
      if (mathLevelKey === "easy") return `Найди основание степени: ${q0}`;
      if (mathLevelKey === "medium") return `Задача на степень — ${q0}`;
      return `Пропущенное основание степени: ${q0}`;
    }
  }

  if (selectedOp === "estimation") {
    if (kind === "est_add") {
      if (mathLevelKey === "easy") return q0.replace(/^Estimate\b/i, "Оценка с округлением: оцени");
      return q0;
    }
    if (kind === "est_mul" || kind === "est_quantity") return q0;
  }

  if (
    kind === "frac_half" ||
    kind === "frac_half_reverse" ||
    kind === "frac_quarter" ||
    kind === "frac_quarter_reverse"
  ) {
    if (mathLevelKey === "easy") return `Дроби: ${q0}`;
    if (mathLevelKey === "medium") return `Дробь как часть целого: ${q0}`;
    return `Дроби: ${q0}`;
  }

  if (kind === "fm_factor") {
    if (mathLevelKey === "easy") return `Множители: ${q0}`;
    if (mathLevelKey === "medium") return `Определи делитель: ${q0}`;
    return `Делители и множители: ${q0}`;
  }
  if (kind === "fm_multiple") {
    if (mathLevelKey === "easy") return `Кратные: ${q0}`;
    if (mathLevelKey === "medium") return `Проверь кратность: ${q0}`;
    return `Кратные: ${q0}`;
  }

  if (selectedOp === "percentages" || selectedOp === "ratio" || selectedOp === "scale") return q0;

  if (kind === "fm_gcd" && params?.a != null && params?.b != null) {
    const { a, b } = params;
    if (mathLevelKey === "easy") {
      return `НОД: каков наибольший общий делитель чисел ${a} и ${b}? = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return `Наибольший общий делитель (НОД) чисел ${a} и ${b} — чему он равен? = ${BLANK}`;
    }
    return `НОД: сначала подумай — НОД(${a}, ${b}) = ${BLANK}`;
  }

  if (kind === "round" && params?.n != null && params?.toWhat != null) {
    const { n, toWhat } = params;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (toWhat === 10) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Округление до десятков: до какого числа округляется ${n}? = ${BLANK}`
          : `Ближайший десяток: ${n} → ? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Округли ${n} до ближайшего десятка — результат? = ${BLANK}`
          : `Правило округления до десятков: ${n} = ${BLANK}`;
      }
      return pv === 0
        ? `Округление до десятков: ${n} → ? = ${BLANK}`
        : `Число после округления ${n} до десятков = ${BLANK}`;
    }
    if (mathLevelKey === "easy") {
      return pv === 0
        ? `Округление до сотен: до какого числа округляется ${n}? = ${BLANK}`
        : `Ближайшая сотня: ${n} = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return pv === 0
        ? `Округли ${n} до ближайшей сотни — результат? = ${BLANK}`
        : `Округление до сотен: ${n} → ? = ${BLANK}`;
    }
    return pv === 0
      ? `Округление до сотен: ${n} → ? = ${BLANK}`
      : `Число после округления ${n} до сотен = ${BLANK}`;
  }

  if (kind === "dec_add" || kind === "dec_sub") {
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    const a = params?.a;
    const b = params?.b;
    const pl = params?.places ?? 1;
    if (a != null && b != null) {
      const af = Number(a).toFixed(pl);
      const bf = Number(b).toFixed(pl);
      if (kind === "dec_add") {
        if (mathLevelKey === "easy") {
          return pv === 0
            ? `Сложи десятичные числа: ${af} + ${bf} = ${BLANK}`
            : `Прямая сумма: ${af} + ${bf} = ${BLANK}`;
        }
        return `Сложи десятичные числа: ${af} + ${bf} = ${BLANK}`;
      }
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Вычти десятичные числа: ${af} − ${bf} = ${BLANK}`
          : `Прямая разность: ${af} − ${bf} = ${BLANK}`;
      }
      return `Вычти десятичные числа: ${af} − ${bf} = ${BLANK}`;
    }
  }

  if (selectedOp === "sequences") {
    if (mathLevelKey === "easy") {
      return q0.replace(/^Continue the sequence\b/i, "Продолжи числовую последовательность");
    }
    return q0;
  }

  const looksNumericExercise =
    /=\s*__|=\s*\?\?|___|\?\?=/.test(q0) ||
    (/^\d/.test(q0.trim()) && /[+\-×÷]/.test(q0));

  if (looksNumericExercise) return q0;
  if (/^Exercise\b/i.test(q0)) return q0;

  if (containsHebrew(q0) && params?.exerciseText && !containsHebrew(String(params.exerciseText))) {
    return String(params.exerciseText);
  }

  return q0;
}

function isShortAnswerField(field) {
  return field === "answers" || field === "options" || field === "acceptedAnswers";
}

function localizeMathField(_field, value, question) {
  const text = String(value ?? "");
  if (!containsHebrew(text)) return text;

  if (YES_NO[text.trim()]) return YES_NO[text.trim()];
  if (PRIME_COMPOSITE[text.trim()]) return PRIME_COMPOSITE[text.trim()];
  if (PARITY[text.trim()]) return PARITY[text.trim()];

  const rebuilt = rebuildMathStemRuRu(question);
  if (
    rebuilt &&
    !containsHebrew(rebuilt) &&
    (_field === "question" || _field === "exerciseText" || _field === "questionLabel")
  ) {
    return rebuilt;
  }

  const presented = applyMathLevelPresentationRuRu(text, {
    selectedOp: question?.operation || inferSelectedOp(question),
    params: question?.params || {},
    mathLevelKey: inferMathLevelKey(question),
    gradeKey: question?.gradeKey || "g3",
  });
  if (presented && !containsHebrew(presented)) return presented;

  const phrased = applyMathPhrases(text);
  if (!containsHebrew(phrased)) return phrased;

  const stripped = phrased
    .replace(/(\d+)\s+remainder\s+(\d+)/gu, "$1 остаток $2")
    .replace(/(?!)/gu, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return stripped || text;
}

function isNearlyEmptyStem(text) {
  const t = String(text ?? "")
    .replace(/[_\s.:=?\-−–—,/|]+/g, "")
    .trim();
  return t.length < 2;
}

const OP_SYMBOL_RU = Object.freeze({
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
});

function resolveMathDisplayStem(question) {
  const rebuilt = rebuildMathStemRuRu(question);
  if (rebuilt && String(rebuilt).trim() && !containsHebrew(rebuilt)) {
    return { stem: rebuilt, source: "params" };
  }
  const p = question?.params && typeof question.params === "object" ? question.params : {};
  const opRaw = String(question?.operation || p.kind || "").replace(/^wp_/, "");
  const a = p.a ?? question?.a;
  const b = p.b ?? question?.b;
  if (a != null && b != null && OP_SYMBOL_RU[opRaw]) {
    return { stem: `Вычисли: ${a} ${OP_SYMBOL_RU[opRaw]} ${b}?`, source: "generic" };
  }
  for (const candidate of [p.exerciseText, question?.exerciseText, question?.question]) {
    if (typeof candidate === "string" && candidate.trim() && !containsHebrew(candidate)) {
      return { stem: String(candidate).trim(), source: "passthrough" };
    }
  }
  return { stem: null, source: "none" };
}

/**
 * Localize math question for Russian (ru-RU) display.
 */
export function localizeMathQuestionRuRu(question) {
  if (!question) return question;

  const base = { ...question };
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const { stem, source } = resolveMathDisplayStem({ ...question, ...base, params: question.params });
  const resolvedStem = stem || "Реши.";

  const out = mapQuestionTextFields({ ...base }, (field, value) => {
    if (field === "question" || field === "exerciseText" || field === "questionLabel") {
      if (!value || containsHebrew(value) || isNearlyEmptyStem(value)) return resolvedStem;
      return value;
    }
    if (isShortAnswerField(field)) {
      const text = String(value ?? "");
      if (!containsHebrew(text)) return text;
      if (YES_NO[text.trim()]) return YES_NO[text.trim()];
      if (PRIME_COMPOSITE[text.trim()]) return PRIME_COMPOSITE[text.trim()];
      if (PARITY[text.trim()]) return PARITY[text.trim()];
      if (OBJECTS_RU[text.trim()]) return OBJECTS_RU[text.trim()];
      const digitsOnly = text.replace(/(?!)/gu, "").trim();
      return digitsOnly || text;
    }
    if (!containsHebrew(String(value ?? ""))) return value;
    return value;
  });

  out.question = resolvedStem;
  if (!out.exerciseText || containsHebrew(String(out.exerciseText)) || isNearlyEmptyStem(out.exerciseText)) {
    out.exerciseText = resolvedStem;
  }
  out.displayStemSource = source;

  if (typeof out.correctAnswer === "string") {
    const ca = out.correctAnswer.trim();
    if (YES_NO[ca]) out.correctAnswer = YES_NO[ca];
    else if (PRIME_COMPOSITE[ca]) out.correctAnswer = PRIME_COMPOSITE[ca];
    else if (PARITY[ca]) out.correctAnswer = PARITY[ca];
    else if (containsHebrew(ca)) {
      out.correctAnswer = ca.replace(/(?!)/gu, "").trim() || ca;
    }
  }
  if (Array.isArray(out.answers)) {
    out.answers = out.answers.map((a) =>
      typeof a === "string" ? localizeMathField("answers", a, out) : a
    );
  }
  return out;
}
