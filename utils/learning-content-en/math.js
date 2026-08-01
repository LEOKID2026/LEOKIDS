import { BLANK } from "../math-constants.js";
import { containsHebrew, mapQuestionTextFields } from "../learning-question-content-locale.js";

const WEEKDAYS_EN = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"];

/** Residual HE→EN maps cleared — generators emit English. Keep empty for API stability. */
const OBJECTS_EN = {};
const YES_NO = {};
const PRIME_COMPOSITE = {};
const PARITY = {};
const MATH_PHRASES = [];

function applyMathPhrases(text) {
  let out = String(text ?? "");
  for (const [he, en] of MATH_PHRASES) {
    if (out.includes(he)) out = out.split(he).join(en);
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
export function rebuildMathStemEn(question) {
  const p = question?.params || {};
  const kind = String(p.kind || "");
  const gradeKey = String(question?.gradeKey || p.gradeKey || "g3");

  if (kind === "mul_groups_g1") {
    const objects = OBJECTS_EN[p.objects] || String(p.objects || "items");
    return `There are ${p.groups} groups. Each group has ${p.perGroup} ${objects}. How many ${objects} are there in all?`;
  }
  if (kind === "mul_skip_count_g1") {
    const seq = Array.isArray(p.seq) ? p.seq : [];
    const head = seq.slice(0, -1).join(", ");
    return `Count by ${p.perGroup}s: ${head}, ${BLANK}`;
  }
  if (kind === "ns_number_line" || kind === "ns_number_line_g1") {
    const nums = Array.isArray(p.numbers) ? p.numbers : [];
    const line = nums.map((n) => (n === BLANK || n === "__" ? BLANK : n)).join(" - ");
    return `Fill in the missing number on the number line: ${line}`;
  }
  if (kind === "ns_even_odd" || kind === "ns_parity") {
    return `Is ${p.n ?? p.num} an even number?`;
  }
  if (kind === "frac_half" || kind === "frac_half_reverse") {
    if (kind === "frac_half_reverse" && p.whole != null) {
      return `Half of ${BLANK} is ${p.whole / 2}. What is the whole number?`;
    }
    return `What is half of ${p.whole ?? p.n}?`;
  }
  if (kind === "frac_quarter" || kind === "frac_quarter_reverse") {
    if (kind === "frac_quarter_reverse" && p.whole != null) {
      return `A quarter of ${BLANK} is ${p.whole / 4}. What is the whole number?`;
    }
    return `What is a quarter of ${p.whole ?? p.n}?`;
  }
  if (
    kind === "frac_compare_like_den_g4" |
    kind === "frac_compare_like_den_g3" |
    kind === "frac_compare_same_den"
  ) {
    if (p.n1 != null && p.n2 != null && p.den != null) {
      return `Which fraction is larger — ${p.n1}/${p.den} or ${p.n2}/${p.den}? Write the larger fraction: ${BLANK}`;
    }
  }
  if (
    kind === "frac_same_den_add_g4" |
    kind === "frac_same_den_add" |
    kind === "frac_same_den_sub_g4" |
    kind === "frac_same_den_sub"
  ) {
    if (p.n1 != null && p.n2 != null && p.den != null) {
      const op = p.op === "add" || kind.includes("add") ? "+" : "−";
      return `${p.n1}/${p.den} ${op} ${p.n2}/${p.den} = ${BLANK}`;
    }
  }
  if (kind === "frac_simplify_intro_g4" || kind === "frac_simplify_intro_g3") {
    if (p.num != null && p.den != null) {
      return `Simplify the fraction ${p.num}/${p.den}: ${BLANK}`;
    }
  }
  if (kind === "frac_equivalent_expand" || kind === "frac_equivalent") {
    if (p.num != null && p.den != null && p.factor != null) {
      return `Find an equivalent fraction for ${p.num}/${p.den} (multiply by ${p.factor}): ${BLANK}`;
    }
  }
  if (kind === "wp_simple_add" || kind === "wp_simple_add_g2") {
    if (kind === "wp_simple_add_g2") {
      return `There were ${p.a} children in class and ${p.b} more joined. How many children are there now?`;
    }
    return `Leo has ${p.a} balls and gets ${p.b} more. How many balls does Leo have in all?`;
  }
  if (kind === "wp_simple_sub" || kind === "wp_simple_sub_g2") {
    if (kind === "wp_simple_sub_g2") {
      return `There are ${p.total} apples in a basket. ${p.give} were eaten. How many apples are left?`;
    }
    return `Leo has ${p.total} stickers. He gives ${p.give} to a friend. How many stickers does Leo have left?`;
  }
  if (kind === "wp_pocket_money" || kind === "wp_pocket_money_g2") {
    return `Emma has ${p.money} dollars. She buys a snack for ${p.toy} dollars. How much money is left?`;
  }
  if (kind === "wp_groups_g2") {
    return `Each row has ${p.per} chairs. There are ${p.groups} rows like that. How many chairs are there in all?`;
  }
  if (kind === "wp_groups_g3") {
    return `Each box has ${p.per} pencils. There are ${p.groups} boxes. How many pencils are there in all?`;
  }
  if (kind === "wp_groups_g4") {
    return `Each shelf has ${p.per} books. There are ${p.groups} shelves. How many books are there in all?`;
  }
  if (kind === "wp_groups_late_g6") {
    return `Each container has ${p.per} parts. ${p.groups} containers were delivered. How many parts in all?`;
  }
  if (kind === "wp_groups" || kind === "wp_groups_late") {
    return `Each supply crate has ${p.per} packages. ${p.groups} crates were delivered. How many packages in all?`;
  }
  if (kind === "wp_comparison_more") {
    return `Noa has ${p.big} cards and Yuval has ${p.small} cards. How many more cards does Noa have than Yuval?`;
  }
  if (kind === "wp_part_whole_g4") {
    return `A hall has ${p.whole} seats. ${p.partA} are taken for a show and the rest are empty. How many seats are empty?`;
  }
  if (kind === "wp_part_whole") {
    return `A class has ${p.whole} students. ${p.partA} are in soccer club and the rest are in chess club. How many students are in chess club?`;
  }
  if (kind === "wp_change_stack_g4") {
    return `A warehouse had ${p.start} boxes. ${p.gain} new boxes were added and ${p.loss} were sent to another branch. How many boxes remain?`;
  }
  if (kind === "wp_change_stack") {
    return `A library had ${p.start} books. ${p.gain} new books were added and ${p.loss} were checked out. How many books are in the library now?`;
  }
  if (kind === "wp_time_days") {
    const start = WEEKDAYS_EN[p.startDayIdx] || "Monday";
    const end = WEEKDAYS_EN[p.endDayIdx] || "Friday";
    return `If today is ${start}, how many days until ${end}?`;
  }
  if (kind === "wp_time_date") {
    return `If today is the ${p.today}th of the month, what date will it be in ${p.daysLater} days?`;
  }
  if (kind === "wp_coins") {
    return `Leo has ${p.coins1} one-dollar coins and ${p.coins2} two-dollar coins. How much money does he have in all?`;
  }
  if (kind === "wp_coins_spent") {
    return `Leo has ${p.total} dollars in coins. He buys candy for ${p.spent} dollars. How much money is left?`;
  }
  if (kind === "wp_division_simple") {
    return `There are ${p.total} apples divided into groups of ${p.perGroup} apples each. How many groups are there?`;
  }
  if (kind === "wp_leftover") {
    return `${p.total} students are split into groups of ${p.groupSize}. How many students are left without a full group?`;
  }
  if (kind === "wp_shop_discount") {
    return `A shirt costs ${p.price} dollars with a ${p.discPerc}% discount. How much do you pay after the discount?`;
  }
  if (kind === "wp_unit_cm_to_m") {
    return `How many meters are ${p.cm} centimeters? = ${BLANK}`;
  }
  if (kind === "wp_unit_g_to_kg") {
    return `How many kilograms are ${p.g} grams? = ${BLANK}`;
  }
  if (kind === "wp_distance_time") {
    return `A child walks at a steady speed of ${p.speed} km/h for ${p.hours} hours. How many kilometers will they travel?`;
  }
  if (kind === "wp_time_sum") {
    return `One video clip lasts ${p.l1} minutes and another lasts ${p.l2} minutes. How many minutes do both clips last together?`;
  }
  if (kind === "wp_average" || kind === "wp_average_g6") {
    if (kind === "wp_average_g6") {
      return `A group project got scores ${p.s1}, ${p.s2}, and ${p.s3} on three stages. What is the average score (rounded to a whole number)?`;
    }
    return `Leo scored ${p.s1}, ${p.s2}, and ${p.s3} on three tests. What is his average (rounded to a whole number)?`;
  }
  if (kind === "wp_multi_step" || kind === "wp_multi_step_g6") {
    return `Leo has ${p.money} dollars. He buys ${p.a} pens and ${p.b} pencils, and each item costs ${p.price} dollars. How much money is left after shopping?`;
  }
  if (kind === "operation_choice_word_problem_probe") {
    return `There are ${p.groups} groups with ${p.each} items in each group. Which operation finds the total?`;
  }

  if (kind.startsWith("wp_") || inferSelectedOp(question) === "word_problems") {
    return null;
  }

  return applyMathLevelPresentationEn(
    String(question?.question || question?.exerciseText || ""),
    {
      selectedOp: question?.operation || inferSelectedOp(question),
      params: p,
      mathLevelKey: inferMathLevelKey(question),
      gradeKey,
    }
  );
}

/** English mirror of applyMathLevelPresentation (math-question-generator.js). */
export function applyMathLevelPresentationEn(question, ctx) {
  const q0 = String(question || "");
  if (!q0.trim()) return q0;
  const { selectedOp, params, mathLevelKey, gradeKey } = ctx;
  const kind = String(params?.kind || "");
  if (kind.startsWith("wp_") || selectedOp === "word_problems") return q0;

  if (kind === "ns_complement100") {
    const b = params?.b;
    const c = params?.c != null ? Number(params.c) : 100;
    if (b != null && Number.isFinite(c)) {
      if (mathLevelKey === "easy") {
        return `Make ${c}: what do you add to ${b} to reach ${c}? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Given ${b} + ${BLANK} = ${c}. What is the missing number?`;
      }
      return `Word problem: ${b} is missing a part to reach ${c} — how much to add? = ${BLANK}`;
    }
  }

  if (kind === "ns_complement10") {
    const b = params?.b;
    const c = params?.c != null ? Number(params.c) : 10;
    if (b != null && Number.isFinite(c)) {
      if (mathLevelKey === "easy") {
        return `Up to ${c}: what do you add to ${b} to finish at ${c}? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Missing in the equation: ${b} + ${BLANK} = ${c}`;
      }
      return `Without a column: what addition to ${c} starts with ${b}? = ${BLANK}`;
    }
  }

  if (kind === "scale_find") {
    const ml = params?.mapLength;
    const rl = params?.realLength;
    if (ml != null && rl != null) {
      if (mathLevelKey === "easy") {
        return `On a map, a segment is ${ml} cm long and in real life it is ${rl} cm. Complete the scale as 1:${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Map length ${ml} cm, real length ${rl} cm. What is the scale? Write the number after 1: = ${BLANK}`;
      }
      return `Map ${ml} cm and real ${rl} cm — scale is 1:__. What is the missing number? = ${BLANK}`;
    }
  }

  if (kind === "scale_map_to_real") {
    const ml = params?.mapLength;
    const sc = params?.scale;
    if (ml != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `At scale 1:${sc}, how many real cm equal ${ml} cm on the map? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Scale 1:${sc}. A map measurement of ${ml} cm — what is the real length in cm? = ${BLANK}`;
      }
      return `Scale 1:${sc}, map measure ${ml} cm — find the real length in cm = ${BLANK}`;
    }
  }

  if (kind === "scale_real_to_map") {
    const rl = params?.realLength;
    const sc = params?.scale;
    if (rl != null && sc != null) {
      if (mathLevelKey === "easy") {
        return `At scale 1:${sc}, real length ${rl} cm — how many cm on the map? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return `Real length ${rl} cm, scale 1:${sc}. What is the length on the map? = ${BLANK}`;
      }
      return `Convert real to map: ${rl} cm real at 1:${sc} — how many cm on the page? = ${BLANK}`;
    }
  }

  if (selectedOp === "compare" || kind === "cmp") {
    const raw = params?.exerciseText ? String(params.exerciseText) : "";
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 4;
    if (mathLevelKey === "easy") {
      const opts = [
        `Compare the two numbers and fill in (<, =, >): ${raw}`,
        `Comparison sign between the numbers: ${raw}`,
        `Choose < , = or > — compare: ${raw}`,
        `Compare the values and fill in the sign: ${raw}`];
      return opts[pv].trim();
    }
    if (mathLevelKey === "medium") {
      const opts = [
        `Fill in the correct comparison sign: ${raw}`,
        `Which sign compares the pair? ${raw}`,
        `Match the correct comparison sign: ${raw}`,
        `Fill in the sign between the number expressions: ${raw}`];
      return opts[pv].trim();
    }
    const opts = [
      `Fill in the comparison sign — check before you choose: ${raw}`,
      `Compare carefully and choose a sign: ${raw}`,
      `Compare with care and pick a sign: ${raw}`,
      `Quick check: which sign fits? ${raw}`];
    return opts[pv].trim();
  }

  if (selectedOp === "divisibility" || kind === "divisibility") {
    const num = params?.num;
    const div = params?.divisor;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (num != null && div != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Divisibility: does ${num} divide evenly by ${div}?`
          : `Check: is ${num} a multiple of ${div} (no remainder)?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Divisibility rules — does ${num} divide by ${div}?`
          : `Whole division: ${num} ÷ ${div} — is the result a whole number?`;
      }
      return pv === 0
        ? `Divisibility check: does ${num} divide by ${div}?`
        : `Divisors: does ${div} divide ${num} exactly?`;
    }
  }

  if (selectedOp === "prime_composite" || kind === "prime_composite") {
    const num = params?.num;
    const subKind = String(params?.subKind || "pc_classify");
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (subKind === "pc_factor_count" && num != null) {
      if (mathLevelKey === "easy") return `Prime numbers: how many divisors does ${num} have?`;
      if (mathLevelKey === "medium") {
        return `Count divisors: how many natural divisors does ${num} have (including 1 and itself)?`;
      }
      return `Divisors: how many different divisors does ${num} have?`;
    }
    if (subKind === "pc_smallest_prime" && num != null) {
      if (mathLevelKey === "easy") return `Prime factor: what is the smallest prime factor of ${num}?`;
      if (mathLevelKey === "medium") return `Find the smallest prime factor of ${num}.`;
      return `Factors: what is the smallest prime factor of ${num}?`;
    }
    if (subKind === "pc_divisor_pick" && num != null && params?.divisorCandidate != null) {
      const d = params.divisorCandidate;
      if (mathLevelKey === "easy") return `Divisor check: does ${d} divide ${num} evenly?`;
      if (mathLevelKey === "medium") return `Divisors: does ${num} divide by ${d}?`;
      return `Divisors: does ${d} divide ${num} exactly?`;
    }
    if (num != null) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Prime numbers: is ${num} prime or composite?`
          : `Basic classification: ${num} — prime or composite?`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Classify the number: ${num} — prime or composite?`
          : `Does ${num} have exactly two different natural divisors?`;
      }
      return pv === 0
        ? `Is ${num} prime or composite? Think before you choose.`
        : `Quick proof: can ${num} be split into two factors greater than 1?`;
    }
  }

  if (selectedOp === "powers" && (kind === "power_base" || kind === "power_calc")) {
    if (kind === "power_calc") {
      if (mathLevelKey === "easy") return `Powers: ${q0}`;
      if (mathLevelKey === "medium") return `Evaluate the power — ${q0}`;
      return `Powers: ${q0}`;
    }
    if (kind === "power_base") {
      if (mathLevelKey === "easy") return `Find the base in the power: ${q0}`;
      if (mathLevelKey === "medium") return `Power puzzle — ${q0}`;
      return `Missing base in the power: ${q0}`;
    }
  }

  if (selectedOp === "estimation") {
    if (kind === "est_add") {
      if (mathLevelKey === "easy") return q0.replace(/^Estimate\b/i, "Rounding estimate: estimate");
      return q0;
    }
    if (kind === "est_mul" || kind === "est_quantity") return q0;
  }

  if (
    kind === "frac_half" |
    kind === "frac_half_reverse" |
    kind === "frac_quarter" |
    kind === "frac_quarter_reverse"
  ) {
    if (mathLevelKey === "easy") return `Fractions: ${q0}`;
    if (mathLevelKey === "medium") return `Fraction as part of a whole: ${q0}`;
    return `Fractions: ${q0}`;
  }

  if (kind === "fm_factor") {
    if (mathLevelKey === "easy") return `Factors: ${q0}`;
    if (mathLevelKey === "medium") return `Identify a divisor: ${q0}`;
    return `Divisors and factors: ${q0}`;
  }
  if (kind === "fm_multiple") {
    if (mathLevelKey === "easy") return `Multiples: ${q0}`;
    if (mathLevelKey === "medium") return `Check multiples: ${q0}`;
    return `Multiples: ${q0}`;
  }

  if (selectedOp === "percentages" || selectedOp === "ratio" || selectedOp === "scale") return q0;

  if (kind === "fm_gcd" && params?.a != null && params?.b != null) {
    const { a, b } = params;
    if (mathLevelKey === "easy") {
      return `GCF: what is the greatest common factor of ${a} and ${b}? = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return `Greatest common factor (GCD) of ${a} and ${b} — what is it? = ${BLANK}`;
    }
    return `GCF: think first — GCD(${a}, ${b}) = ${BLANK}`;
  }

  if (kind === "round" && params?.n != null && params?.toWhat != null) {
    const { n, toWhat } = params;
    const pv = Math.abs(Number(params?.presentationVariant) || 0) % 2;
    if (toWhat === 10) {
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Round to tens: what does ${n} round to? = ${BLANK}`
          : `Nearest ten: ${n} → ? = ${BLANK}`;
      }
      if (mathLevelKey === "medium") {
        return pv === 0
          ? `Round ${n} to the nearest ten — result? = ${BLANK}`
          : `Round by tens rule: ${n} = ${BLANK}`;
      }
      return pv === 0
        ? `Round to tens: ${n} → ? = ${BLANK}`
        : `Correct number after rounding ${n} to tens = ${BLANK}`;
    }
    if (mathLevelKey === "easy") {
      return pv === 0
        ? `Round to hundreds: what does ${n} round to? = ${BLANK}`
        : `Nearest hundred: ${n} = ${BLANK}`;
    }
    if (mathLevelKey === "medium") {
      return pv === 0
        ? `Round ${n} to the nearest hundred — result? = ${BLANK}`
        : `Round to hundreds: ${n} → ? = ${BLANK}`;
    }
    return pv === 0
      ? `Round to hundreds: ${n} → ? = ${BLANK}`
      : `Number after rounding ${n} to hundreds = ${BLANK}`;
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
            ? `Add decimals: ${af} + ${bf} = ${BLANK}`
            : `Direct sum: ${af} + ${bf} = ${BLANK}`;
        }
        return `Add decimals: ${af} + ${bf} = ${BLANK}`;
      }
      if (mathLevelKey === "easy") {
        return pv === 0
          ? `Subtract decimals: ${af} − ${bf} = ${BLANK}`
          : `Direct difference: ${af} − ${bf} = ${BLANK}`;
      }
      return `Subtract decimals: ${af} − ${bf} = ${BLANK}`;
    }
  }

  if (selectedOp === "sequences") {
    if (mathLevelKey === "easy") {
      return q0.replace(/^Continue the sequence\b/i, "Continue the number pattern");
    }
    return q0;
  }

  const looksNumericExercise =
    /=\s*__|=\s*\?\?|___|\?\?=/.test(q0) |
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

  const rebuilt = rebuildMathStemEn(question);
  if (rebuilt && !containsHebrew(rebuilt) && (_field === "question" || _field === "exerciseText" || _field === "questionLabel")) {
    return rebuilt;
  }

  const presented = applyMathLevelPresentationEn(text, {
    selectedOp: question?.operation || inferSelectedOp(question),
    params: question?.params || {},
    mathLevelKey: inferMathLevelKey(question),
    gradeKey: question?.gradeKey || "g3",
  });
  if (presented && !containsHebrew(presented)) return presented;

  const phrased = applyMathPhrases(text);
  if (!containsHebrew(phrased)) return phrased;

  const stripped = phrased
    .replace(/(\d+)\s+remainder\s+(\d+)/gu, "$1 remainder $2")
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

const OP_SYMBOL_EN = Object.freeze({
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
});

/**
 * Build display stem from params/kind only (no Hebrew sentence translation).
 * @param {Record<string, unknown>} question
 */
function resolveMathDisplayStem(question) {
  const rebuilt = rebuildMathStemEn(question);
  if (rebuilt && String(rebuilt).trim() && !containsHebrew(rebuilt)) {
    return { stem: rebuilt, source: "params" };
  }
  const p = question?.params && typeof question.params === "object" ? question.params : {};
  const opRaw = String(question?.operation || p.kind || "").replace(/^wp_/, "");
  const a = p.a ?? question?.a;
  const b = p.b ?? question?.b;
  if (a != null && b != null && OP_SYMBOL_EN[opRaw]) {
    return { stem: `What is ${a} ${OP_SYMBOL_EN[opRaw]} ${b}?`, source: "generic" };
  }
  for (const candidate of [p.exerciseText, question?.exerciseText, question?.question]) {
    if (typeof candidate === "string" && candidate.trim() && !containsHebrew(candidate)) {
      return { stem: String(candidate).trim(), source: "passthrough" };
    }
  }
  return { stem: null, source: "none" };
}

/**
 * Localize math question for Global English display.
 * Display stems come from params/kind templates — not from translating Hebrew prose.
 * Option tokens use closed dictionaries (logical labels), not sentence MT.
 */
export function localizeMathQuestionEn(question) {
  if (!question) return question;

  const base = { ...question };
  // Drop authored Hebrew stems so params are the sole stem authority.
  if (typeof base.question === "string" && containsHebrew(base.question)) base.question = "";
  if (typeof base.exerciseText === "string" && containsHebrew(base.exerciseText)) base.exerciseText = "";
  if (typeof base.questionLabel === "string" && containsHebrew(base.questionLabel)) base.questionLabel = "";

  const { stem, source } = resolveMathDisplayStem({ ...question, ...base, params: question.params });
  const resolvedStem = stem || "Solve.";

  const out = mapQuestionTextFields({ ...base }, (field, value, q) => {
    if (field === "question" || field === "exerciseText" || field === "questionLabel") {
      if (!value || containsHebrew(value) || isNearlyEmptyStem(value)) return resolvedStem;
      return value;
    }
    // Answers/options: closed token maps only (no full-sentence HE→EN).
    if (isShortAnswerField(field)) {
      const text = String(value ?? "");
      if (!containsHebrew(text)) return text;
      if (YES_NO[text.trim()]) return YES_NO[text.trim()];
      if (PRIME_COMPOSITE[text.trim()]) return PRIME_COMPOSITE[text.trim()];
      if (PARITY[text.trim()]) return PARITY[text.trim()];
      if (OBJECTS_EN[text.trim()]) return OBJECTS_EN[text.trim()];
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
