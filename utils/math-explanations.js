import { BLANK } from './math-constants.js';
import { convertMissingNumberEquation, buildVerticalOperation } from './math-animations.js';
import {
  buildComparisonSignWrongAnswerLine,
  getCanonicalComparisonSign,
  isComparisonSignToken,
  shouldUseComparisonSignErrorExplanation,
} from './comparison-sign-mcq.js';
import { mix, M, pureMathLtrDisplay } from '../lib/learning-book/learning-math-line-build.js';
import React from 'react';
import { buildComparisonConclusionRuns } from '../lib/learning-book/learning-math-line-templates.js';
import { learningStepDiv as toSpan } from './learning-math-line-render.js';
import { burnDownCopy } from '../lib/learning/burn-down-copy.js';

const MATH_EXPL_SLUG = "utils__math-explanations";

function meCopy(key) {
  return burnDownCopy(MATH_EXPL_SLUG, key);
}

export function getHint(question, operation, gradeKey) {
  if (!question || !question.params) return "";
  const M = (expr) => `\u2066${expr}\u2069`;

  const p = question.params;

  switch (operation) {
    case "addition":
      if (p.kind === "add_three") {
        return meCopy("hint_addition_add_three").replace("{expr}", M("(a + b) + c"));
      }
      if (p.kind === "add_complement10" || p.kind === "add_complement_round10") {
        return meCopy("hint_addition_complement");
      }
      if (p.kind === "add_missing_first" || p.kind === "add_missing_second") {
        return meCopy("hint_addition_missing")
          .replace("{missing_first}", M("c - b"))
          .replace("{missing_second}", M("c - a"));
      }
      return meCopy("hint_addition_default");
    case "subtraction":
      if (p.kind === "sub_missing_first" || p.kind === "sub_missing_second") {
        return meCopy("hint_subtraction_missing")
          .replace("{missing_first}", M("c + b"))
          .replace("{missing_second}", M("a - c"));
      }
      return meCopy("hint_subtraction_default");
    case "multiplication":
      return meCopy("hint_multiplication")
        .replace("{product}", M("a × b"))
        .replace("{a}", M("a"))
        .replace("{b}", M("b"));
    case "division":
      return meCopy("hint_division");
    case "fractions":
      if (p.kind === "frac_same_den") {
        return meCopy("hint_fractions_same_den");
      }
      return meCopy("hint_fractions_default");
    case "percentages":
      return meCopy("hint_percentages")
        .replace("{hundred}", M("100"))
        .replace("{ten}", M("10%"))
        .replace("{twenty_five}", M("25%"))
        .replace("{fifty}", M("50%"));
    case "sequences":
      return meCopy("hint_sequences");
    case "decimals":
      return meCopy("hint_decimals");
    case "rounding":
      return meCopy("hint_rounding")
        .replace("{low}", M("0–4"))
        .replace("{high}", M("5–9"));
    case "equations":
      return meCopy("hint_equations");
    case "compare":
      return meCopy("hint_compare");
    case "number_sense":
      if (p.kind?.startsWith("ns_place")) {
        return meCopy("hint_number_sense_place")
          .replace("{example}", M("57"))
          .replace("{tens}", M("5"))
          .replace("{ones}", M("7"));
      }
      if (p.kind === "ns_neighbors") {
        return meCopy("hint_number_sense_neighbors").replaceAll("{one}", M("1"));
      }
      if (p.kind === "ns_complement10" || p.kind === "ns_complement100") {
        return meCopy("hint_number_sense_complement");
      }
      if (p.kind === "ns_even_odd") {
        return meCopy("hint_number_sense_even_odd")
          .replace("{even}", M("0,2,4,6,8"))
          .replace("{odd}", M("1,3,5,7,9"));
      }
      return meCopy("hint_number_sense_default");
    case "factors_multiples":
      return meCopy("hint_factors_multiples");
    case "word_problems":
      return meCopy("hint_word_problems");
    case "ratio":
      return meCopy("hint_ratio");
    case "scale":
      return meCopy("hint_scale");
    case "divisibility":
      return meCopy("hint_divisibility");
    case "powers":
      return meCopy("hint_powers");
    case "order_of_operations":
      return meCopy("hint_order_of_operations");
    case "estimation":
      return meCopy("hint_estimation");
    case "zero_one_properties":
      return meCopy("hint_zero_one_properties");
    case "division_with_remainder":
      return meCopy("hint_division_with_remainder");
    default:
      return meCopy("hint_default");
  }
}

// Helper: column-addition explanation with carrying
export function getAdditionStepsColumn(a, b) {
  const sum = a + b;
  const aStr = String(a);
  const bStr = String(b);
  const resultStr = String(sum);
  const maxLen = Math.max(aStr.length, bStr.length, resultStr.length);
  const pad = (s) => s.toString().padStart(maxLen, " ");
  const line1 = pad(aStr);
  const line2 = "+" + pad(bStr).slice(1);  // place +
  const line3 = "-".repeat(maxLen);
  const digitsA = pad(aStr).split("").map((d) => (d === " " ? 0 : Number(d)));
  const digitsB = pad(bStr).split("").map((d) => (d === " " ? 0 : Number(d)));

  const ltr = M;

  // Place-value name (ones/tens/hundreds...)
  const placeName = (idxFromRight) => {
    if (idxFromRight === 0) return "the ones digit";
    if (idxFromRight === 1) return "the tens digit";
    if (idxFromRight === 2) return "the hundreds digit";
    return `place ${idxFromRight + 1} from the right`;
  };

  let carry = 0;
  const steps = [];

  // Step 1 – show the column addition
  steps.push(
    React.createElement(
      "div",
      { key: "col", className: "font-mono text-lg text-center mb-2", dir: "ltr" },
      React.createElement("div", null, line1),
      React.createElement("div", null, line2),
      React.createElement("div", null, line3)
    )
  );

  // Step 2 – add digits right to left
  const len = digitsA.length;
  for (let i = len - 1; i >= 0; i--) {
    const idxFromRight = len - 1 - i;
    const da = digitsA[i];
    const db = digitsB[i];

    // Skip if both digits are 0 and no carry
    if (da === 0 && db === 0 && carry === 0) continue;

    const raw = da + db + carry;
    const digit = raw % 10;
    const nextCarry = Math.floor(raw / 10);
    const place = placeName(idxFromRight);

    // Entire math expression in one LTR block
    const parts = [da, "+", db];
    if (carry > 0) {
      parts.push("+", carry);
    }
    const expr = `${parts.join(" ")} = ${raw}`;

    const carryNote =
      nextCarry > 0
        ? ` and carry ${nextCarry} to the next column.`
        : `. No carry to the next column.`;

    steps.push(
      toSpan(
        mix`In ${place}: ${M(expr)}. Write ${digit}${carryNote}`,
        `step-${i}`
      )
    );

    carry = nextCarry;
  }

  // Final step – summarize
  steps.push(
    toSpan(mix`In the end we get the full number: ${M(String(sum))}.`, "final")
  );

  return steps;
}

// Detailed step-by-step explanation by exercise type and grade
export function getSolutionSteps(question, operation, gradeKey) {
  if (!question || !question.params) return [];
  const p = question.params;
  const ans = question.correctAnswer;
  const isStory = !!question.isStory;
  // Structured math embed (use inside mix`...` templates — not free strings).
  const ltr = M;

  // Prefer params.op when present; otherwise use operation
  const op = p.op || operation;

  // For ordinary two-number addition, use column explanation
  if (op === "add" && typeof p.a === "number" && typeof p.b === "number" && p.kind === "add_two") {
    return getAdditionStepsColumn(p.a, p.b);
  }

  switch (operation) {
    case "addition": {
      if (p.kind === "add_three") {
        const s1 = p.a + p.b;
        return [
          toSpan(mix`1. Write the exercise: ${M(`${p.a} + ${p.b} + ${p.c}`)}.`, "1"),
          toSpan(mix`2. Add the first two: ${M(`${p.a} + ${p.b} = ${s1}`)}.`, "2"),
          toSpan(mix`3. Add the last one: ${M(`${s1} + ${p.c} = ${ans}`)}.`, "3"),
          toSpan(mix`4. The answer: ${ans}.`, "4"),
        ];
      }
      if (p.kind === "add_complement10" || p.kind === "add_complement_round10") {
      return [
          toSpan(
            mix`1. This is a make-ten / completion exercise: find how much is needed to reach ${p.c ?? p.tens}.`,
            "1"
          ),
          toSpan(
            mix`2. Compute: ${M(`${p.c ?? p.tens} - ${p.b ?? p.base} = ${ans}`)}.`,
            "2"
          ),
          toSpan(mix`3. Check that adding the result gives the round number.`, "3"),
        ];
      }
      if (p.kind === "add_missing_first") {
        // __ + b = c
        return [
          toSpan(mix`1. Understand: Find a number that when you add ${p.b} to it, you get ${p.c}.`, "1"),
          toSpan(mix`2. Compute: ${M(`${p.c} - ${p.b} = ${ans}`)}.`, "2"),
          toSpan(mix`3. Check: ${M(`${ans} + ${p.b} = ${p.c}`)}? Yes!`, "3"),
          toSpan(mix`4. The answer: ${ans}.`, "4"),
        ];
      }
      if (p.kind === "add_missing_second") {
        // a + __ = c
        return [
          toSpan(mix`1. Understand: Find a number that when added to ${p.a}, you get ${p.c}.`, "1"),
          toSpan(mix`2. Compute: ${M(`${p.c} - ${p.a} = ${ans}`)}.`, "2"),
          toSpan(mix`3. Check: ${M(`${p.a} + ${ans} = ${p.c}`)}? Yes!`, "3"),
          toSpan(mix`4. The answer: ${ans}.`, "4"),
        ];
      }
      // For ordinary two-number addition, use column explanation
      if (typeof p.a === "number" && typeof p.b === "number") {
        return getAdditionStepsColumn(p.a, p.b);
      }
      const sum = p.a + p.b;
      return [
        toSpan(mix`1. Write the exercise: ${M(`${p.a} + ${p.b}`)}.`, "1"),
        toSpan(mix`2. Add: ${M(`${p.a} + ${p.b} = ${sum}`)}.`, "2"),
        toSpan(mix`3. The result: ${ans}.`, "3"),
      ];
    }

    case "subtraction":
      if (p.kind === "sub_missing_first") {
        // __ - b = c
        return [
          toSpan(mix`1. Understand: Find a number that when you subtract ${p.b} from it, you get ${p.c}.`, "1"),
          toSpan(mix`2. Compute: ${M(`${p.c} + ${p.b} = ${ans}`)}.`, "2"),
          toSpan(mix`3. Check: ${M(`${ans} - ${p.b} = ${p.c}`)}? Yes!`, "3"),
          toSpan(mix`4. The answer: ${ans}.`, "4"),
        ];
      }
      if (p.kind === "sub_missing_second") {
        // a - __ = c
      return [
          toSpan(mix`1. Understand: Find a number that when subtracted from ${p.a}, you get ${p.c}.`, "1"),
          toSpan(mix`2. Compute: ${M(`${p.a} - ${p.c} = ${ans}`)}.`, "2"),
          toSpan(mix`3. Check: ${M(`${p.a} - ${ans} = ${p.c}`)}? Yes!`, "3"),
          toSpan(mix`4. The answer: ${ans}.`, "4"),
        ];
      }
      return [
        toSpan(mix`1. Write the exercise: ${M(`${p.a} - ${p.b}`)}.`, "1"),
        toSpan(mix`2. Check which number is larger and which is smaller (this affects the sign).`, "2"),
        toSpan(mix`3. Compute: ${M(`${p.a} - ${p.b} = ${ans}`)}.`, "3"),
        toSpan(mix`4. Do a quick check: ${M(`${ans} + ${p.b} = ${p.a}`)}?`, "4"),
      ];

    case "multiplication":
      if (typeof p.a === "number" && typeof p.b === "number") {
        const A = p.a;
        const B = p.b;
        const aStr = String(A);
        const bStr = String(B);
        const isSmall = Math.abs(A) < 10 && Math.abs(B) < 10;
        if (isSmall) {
          return [
            toSpan(mix`1. This is single-digit multiplication: ${M(`${A} × ${B}`)}.`, "1"),
            toSpan(mix`2. Compute: ${M(`${A} × ${B} = ${ans}`)}.`, "2"),
            toSpan(mix`3. The answer: ${ans}.`, "3"),
          ];
        }
        return [
          toSpan(mix`1. In long multiplication, multiply ${A} by each digit of ${B} from right to left.`, "1"),
          toSpan(mix`2. Each row is a partial product (sometimes you add a 0 at the end for tens/hundreds).`, "2"),
          toSpan(mix`3. Finally, add all the partial products.`, "3"),
          toSpan(mix`4. The final result: ${M(`${A} × ${B} = ${ans}`)}.`, "4"),
        ];
      }
      return [
        toSpan(mix`1. In long multiplication: digit-by-digit multiply + carries, then add partial products.`, "1"),
        toSpan(mix`2. The answer: ${ans}.`, "2"),
      ];

    case "division":
      return [
        toSpan(
          mix`1. Write: ${M(`${p.dividend} ÷ ${p.divisor}`)} – how many groups of ${p.divisor} fit into ${p.dividend}?`,
          "1"
        ),
        toSpan(
          mix`2. Check: ${M(`${p.divisor} × ${ans} = ${p.dividend}`)}. If yes – that is the correct number.`,
          "2"
        ),
        toSpan(mix`3. So the answer: ${ans}.`, "3"),
      ];

    case "fractions":
      if (p.kind === "frac_same_den") {
        return [
          toSpan(
            mix`1. We have the same denominator (${p.den}). Do not change the denominator – work only with the numerators.`,
            "1"
          ),
          toSpan(
            mix`2. ${p.op === "add" ? "Add" : "Subtract"} the numerators: ${M(
              `${p.n1} ${p.op === "add" ? "+" : "-"} ${p.n2}`)}.`,
            "2"
          ),
          toSpan(mix`3. The numerator result: ${ans.split("/")[0]}.`, "3"),
          toSpan(mix`4. The denominator stays ${p.den} – so the answer: ${ans}.`, "4"),
        ];
      }

      if (p.kind === "frac_diff_den") {
      return [
          toSpan(
            mix`1. The denominators are different (${p.den1} and ${p.den2}). Find a common denominator – here ${p.commonDen}.`,
            "1"
          ),
          toSpan(mix`2. Rewrite each fraction with the common denominator.`, "2"),
          toSpan(mix`3. Once the denominators match – work only with the numerators.`, "3"),
          toSpan(mix`4. That gives us ${ans}.`, "4"),
        ];
      }

      return [
        toSpan(mix`1. Find a common denominator.`, "1"),
        toSpan(mix`2. Rewrite the fractions with that denominator.`, "2"),
        toSpan(mix`3. Add or subtract the numerators.`, "3"),
        toSpan(mix`4. Simplify if possible and get ${ans}.`, "4"),
      ];

    case "percentages":
      if (p.kind === "perc_discount") {
        return [
          toSpan(
            mix`1. Compute the discount amount: ${M(`${p.base} × ${p.p}/100 = ${p.discount}`)}.`,
            "1"
          ),
          toSpan(
            mix`2. Subtract from the price: ${M(`${p.base} - ${p.discount} = ${ans}`)}.`,
            "2"
          ),
        ];
      }
      return [
        toSpan(
          mix`1. ${p.p}% of ${p.base} is ${p.base} times ${p.p}/100.`,
          "1"
        ),
        toSpan(
          mix`2. Compute: ${M(`${p.base} × ${p.p}/100 = ${ans}`)}.`,
          "2"
        ),
      ];

    case "sequences":
      return [
        toSpan(
          mix`1. Look at the difference between two neighboring numbers: for example ${M(
            `${p.seq[1]} - ${p.seq[0]} = ${p.step}`)}.`,
          "1"
        ),
        toSpan(mix`2. That is the constant step of the sequence.`, "2"),
        toSpan(
          mix`3. Use the same step to fill in the blank.`,
          "3"
        ),
      ];

    case "decimals":
      return [
        toSpan(mix`1. Line up the decimal points one under the other.`, "1"),
        toSpan(mix`2. Compute as if they were whole numbers.`, "2"),
        toSpan(
          "3. Put the decimal point back based on how many digits are after the decimal.",
          "3"
        ),
      ];

    case "rounding":
      return [
        toSpan(
          mix`1. Decide whether rounding to tens or hundreds and look at the next digit.`,
          "1"
        ),
        toSpan(
          "2. If the next digit is 0–4 – round down. If 5–9 – round up.",
          "2"
        ),
        toSpan(mix`3. That gives us ${ans}.`, "3"),
      ];

    case "equations": {
      if (p.kind === "eq_add") {
        return [
          toSpan(
            mix`1. Remember: for addition, the inverse operation is subtraction.`,
            "1"
          ),
          toSpan(
            mix`2. Instead of guessing the number in ${BLANK}, compute ${M(`${p.c} - ${p.a}`)} or ${M(`${p.c} - ${p.b}`)}.`,
            "2"
          ),
          toSpan(
            mix`3. You get: ${ans}.`,
            "3"
          ),
        ];
      }

      if (p.kind === "eq_sub") {
      return [
          toSpan(
            mix`1. For subtraction, the inverse operation is addition.`,
            "1"
          ),
          toSpan(
            mix`2. If you have ${M(`${p.a} - ${BLANK} = ${p.c}`)}, compute ${M(`${p.a} - ${p.c}`)}.`,
            "2"
          ),
          toSpan(
            mix`3. The result is ${ans} – check: ${M(`${p.a} - ${ans} = ${p.c}`)}.`,
            "3"
          ),
        ];
      }

      if (p.kind === "eq_mul") {
      return [
          toSpan(
            mix`1. For multiplication, the inverse operation is division.`,
            "1"
          ),
          toSpan(
            mix`2. Compute ${M(`${p.c} ÷ ${p.a}`)} or ${M(`${p.c} ÷ ${p.b}`)} depending on where the blank is.`,
            "2"
          ),
          toSpan(
            mix`3. You get ${ans} and check: ${M(`${p.a} × ${ans} = ${p.c}`)} or ${M(`${ans} × ${p.b} = ${p.c}`)}.`,
            "3"
          ),
        ];
      }

      if (p.kind === "eq_div") {
        return [
          toSpan(
            mix`1. For division, the inverse operation is multiplication.`,
            "1"
          ),
          toSpan(
            mix`2. If ${M(`${BLANK} ÷ ${p.divisor} = ${p.quotient}`)}, multiply ${M(`${p.quotient} × ${p.divisor}`)}.`,
            "2"
          ),
          toSpan(
            mix`3. You get ${ans} and check by dividing again.`,
            "3"
          ),
        ];
      }

      return [];
    }

    case "compare": {
      const sign = getCanonicalComparisonSign(p.a, p.b);
      const steps = [
        toSpan(mix`1. Look at the two numbers: ${M(String(p.a))} and ${M(String(p.b))}.`, "1"),
        toSpan(mix`2. Check which is larger (or if they are equal).`, "2"),
      ];
      if (sign === ">") {
        steps.push(
          toSpan(
            { __learningRuns: buildComparisonConclusionRuns({ left: p.a, right: p.b, relation: "gt" }) },
            "3"
          )
        );
      } else if (sign === "<") {
        steps.push(
          toSpan(
            { __learningRuns: buildComparisonConclusionRuns({ left: p.a, right: p.b, relation: "lt" }) },
            "3"
          )
        );
      } else {
        steps.push(
          toSpan(mix`3. ${M(String(p.a))} = ${M(String(p.b))} - the numbers are equal.`, "3")
        );
      }
      return steps;
    }

    case "number_sense": {
      if (p.kind === "ns_place_tens_units" || p.kind === "ns_place_hundreds") {
        return [
          toSpan(
            mix`1. Break the number into tens/hundreds/ones.`,
            "1"
          ),
          toSpan(
            mix`2. For example ${M(String(p.n))} = ${p.hundreds ?? ""}${p.hundreds != null ? " hundreds," : ""} ${p.tens ?? ""}${p.tens != null ? " tens," : ""} ${p.units ?? ""}${p.units != null ? " ones" : ""}.`,
            "2"
          ),
          toSpan(
            mix`3. Choose the digit based on what was asked.`,
            "3"
          ),
        ];
      }

      if (p.kind === "ns_neighbors") {
        return [
          toSpan(
            mix`1. One after – add 1. One before – subtract 1.`,
            "1"
          ),
          toSpan(
            mix`2. For example, after ${p.n} comes ${p.n + 1}, and before it ${p.n - 1}.`,
            "2"
          ),
        ];
      }

      if (p.kind === "ns_complement10" || p.kind === "ns_complement100") {
        const target = p.c;
        return [
          toSpan(
            mix`1. Find how much is needed from ${p.b} to reach ${target}.`,
            "1"
          ),
          toSpan(
            mix`2. Compute: ${M(`${target} - ${p.b} = ${ans}`)}.`,
            "2"
          ),
        ];
      }

      if (p.kind === "ns_even_odd") {
        return [
          toSpan(
            mix`1. Look at the ones digit of ${p.n}.`,
            "1"
          ),
          toSpan(
            mix`2. If the digit is 0,2,4,6,8 – the number is even. If 1,3,5,7,9 – odd.`,
            "2"
          ),
        ];
      }

      if (p.kind === "ns_counting_forward") {
        return [
          toSpan(mix`1. When counting forward, add 1 to the number shown.`, "1"),
          toSpan(mix`2. ${M(String(p.start))} plus 1 is ${M(String(ans))}.`, "2"),
          toSpan(mix`3. So the next number is ${ans}.`, "3"),
        ];
      }

      if (p.kind === "ns_counting_backward") {
        return [
          toSpan(mix`1. When counting backward, subtract 1 from the number shown.`, "1"),
          toSpan(mix`2. ${M(String(p.start))} minus 1 is ${M(String(ans))}.`, "2"),
          toSpan(mix`3. So the previous number is ${ans}.`, "3"),
        ];
      }

      if (p.kind === "ns_number_line") {
        return [
          toSpan(mix`1. On the number line, numbers go up by 1 each step.`, "1"),
          toSpan(mix`2. Look between ${M(String(p.start))} and ${M(String(p.end))} and find the missing place.`, "2"),
          toSpan(mix`3. The missing number is ${ans}.`, "3"),
        ];
      }

      return [];
    }

    case "factors_multiples": {
      if (p.kind === "fm_factor") {
        return [
          toSpan(
            mix`1. Check which numbers divide ${p.n} with no remainder.`,
            "1"
          ),
          toSpan(
            mix`2. Divide ${p.n} by the possible numbers until we find an exact divisor.`,
            "2"
          ),
        ];
      }
      if (p.kind === "fm_multiple") {
        return [
          toSpan(
            mix`1. Multiples of ${p.base} come from multiplying the number by 1,2,3,...`,
            "1"
          ),
          toSpan(
            mix`2. Check which item in the list matches the form ${p.base} × a whole number.`,
            "2"
          ),
        ];
      }
      if (p.kind === "fm_gcd") {
        return [
          toSpan(
            mix`1. Factor ${p.a} and ${p.b} into factors.`,
            "1"
          ),
          toSpan(
            mix`2. Find common factors and see which is greatest – here ${ans}.`,
            "2"
          ),
        ];
      }
      return [];
    }

    case "prime_composite": {
      const divisors = [];
      if (typeof p.num === "number") {
        for (let i = 1; i <= p.num; i += 1) {
          if (p.num % i === 0) divisors.push(i);
        }
      }
      if (p.subKind === "pc_factor_count") {
        return [
          toSpan(mix`1. Divisors are numbers that divide ${M(String(p.num))} with no remainder.`, "1"),
          toSpan(mix`2. Count all divisors, including 1 and the number itself.`, "2"),
          toSpan(mix`3. That gives ${ans} divisors.`, "3"),
        ];
      }
      if (p.subKind === "pc_smallest_prime") {
        return [
          toSpan(mix`1. Find a prime factor that divides ${M(String(p.num))}.`, "1"),
          toSpan(mix`2. Check from small to large: 2, 3, 5, 7, and so on.`, "2"),
          toSpan(mix`3. The smallest prime factor is ${ans}.`, "3"),
        ];
      }
      if (p.subKind === "pc_divisor_pick") {
        return [
          toSpan(mix`1. Check whether ${M(String(p.divisorCandidate))} divides ${M(String(p.num))} with no remainder.`, "1"),
          toSpan(mix`2. If there is no remainder the answer is yes; if there is a remainder the answer is no.`, "2"),
          toSpan(mix`3. The answer: ${ans}.`, "3"),
        ];
      }
      const divisorsText = divisors.length ? `: ${divisors.join(", ")}` : "";
      return [
        toSpan(mix`1. A prime number is divisible only by 1 and itself.`, "1"),
        toSpan(mix`2. Check the divisors of ${M(String(p.num))}${divisorsText}.`, "2"),
        toSpan(mix`3. So the number is ${ans}.`, "3"),
      ];
    }

    case "word_problems":
      if (p.kind === "wp_simple_add") {
        const sum = p.a + p.b;
        return [
          toSpan(mix`1. Identify that the question asks for a total – an addition.`, "1"),
          toSpan(mix`2. Write the exercise: ${M(`${p.a} + ${p.b}`)}.`, "2"),
          toSpan(mix`3. Compute: ${M(`${p.a} + ${p.b} = ${sum}`)}.`, "3"),
          toSpan(mix`4. The answer: Leo has ${ans} balls.`, "4"),
        ];
      }

      if (p.kind === "wp_simple_sub") {
        return [
          toSpan(mix`1. Identify that the question asks how many are left – a subtraction.`, "1"),
          toSpan(mix`2. Write the exercise: ${M(`${p.total} - ${p.give}`)}.`, "2"),
          toSpan(mix`3. Compute: ${M(`${p.total} - ${p.give} = ${ans}`)}.`, "3"),
          toSpan(mix`4. The answer: Leo has ${ans} stickers left.`, "4"),
        ];
      }

      if (p.kind === "wp_pocket_money") {
        return [
          toSpan(mix`1. Identify that the question asks how much money is left after buying – a subtraction.`, "1"),
          toSpan(mix`2. Write the exercise: ${M(`${p.money} - ${p.toy}`)}.`, "2"),
          toSpan(mix`3. Compute: ${M(`${p.money} - ${p.toy} = ${ans}`)}.`, "3"),
          toSpan(mix`4. The answer: Leo has ${ans} left.`, "4"),
        ];
      }

      if (p.kind === "wp_time_sum") {
        const sum = p.l1 + p.l2;
        return [
          toSpan(mix`1. Identify that the question asks for total time – an addition.`, "1"),
          toSpan(mix`2. Write the exercise: ${M(`${p.l1} + ${p.l2}`)}.`, "2"),
          toSpan(mix`3. Compute: ${M(`${p.l1} + ${p.l2} = ${sum}`)}.`, "3"),
          toSpan(mix`4. The answer: The watching lasted ${ans} minutes.`, "4"),
        ];
      }

      if (p.kind === "wp_average") {
        const sum = p.s1 + p.s2 + p.s3;
        return [
          toSpan(mix`1. An average is found by adding all the scores and dividing by the number of tests.`, "1"),
          toSpan(mix`2. Add the scores: ${M(`${p.s1} + ${p.s2} + ${p.s3} = ${sum}`)}.`, "2"),
          toSpan(mix`3. Divide by 3: ${M(`${sum} ÷ 3 = ${ans}`)}.`, "3"),
          toSpan(mix`4. The answer: The average is ${ans}.`, "4"),
        ];
      }

      if (p.kind === "wp_groups") {
        const prod = p.per * p.groups;
        return [
          toSpan(
            mix`1. Each box has ${p.per} pencils and there are ${p.groups} boxes – this is repeated addition.`,
            "1"
          ),
          toSpan(mix`2. Write a multiplication: ${M(`${p.per} × ${p.groups}`)}.`, "2"),
          toSpan(mix`3. Compute: ${M(`${p.per} × ${p.groups} = ${prod}`)}.`, "3"),
          toSpan(mix`4. The answer: ${ans} pencils.`, "4"),
        ];
      }

      if (p.kind === "wp_leftover") {
        return [
          toSpan(
            mix`1. There are ${p.total} students divided into groups of ${p.groupSize}.`,
            "1"
          ),
          toSpan(
            mix`2. Find how many full groups: ${M(`${p.total} ÷ ${p.groupSize} = ${p.groups}`)}.`,
            "2"
          ),
          toSpan(
            mix`3. Check how many are left: ${M(`${p.total} - (${p.groups} × ${p.groupSize}) = ${p.leftover}`)}.`,
            "3"
          ),
          toSpan(mix`4. So ${ans} students are left without a full group.`, "4"),
        ];
      }

      if (p.kind === "wp_multi_step") {
        return [
          toSpan(
            mix`1. Find how many items are bought in total: ${p.a} + ${p.b} = ${p.totalQty}.`,
            "1"
          ),
          toSpan(
            mix`2. Find the purchase cost: ${M(`${p.price} × ${p.totalQty} = ${p.totalCost}`)}.`,
            "2"
          ),
          toSpan(
            mix`3. Subtract from the amount Leo had: ${M(`${p.money} - ${p.totalCost} = ${ans}`)}.`,
            "3"
          ),
        ];
      }

      if (p.kind === "wp_shop_discount") {
        return [
          toSpan(
            mix`1. Compute the discount: ${M(`${p.price} × ${p.discPerc}/100 = ${p.discount}`)}.`,
            "1"
          ),
          toSpan(
            mix`2. Subtract from the price: ${M(`${p.price} - ${p.discount} = ${ans}`)}.`,
            "2"
          ),
        ];
      }

      if (p.kind === "wp_unit_cm_to_m") {
        return [
          toSpan(
            mix`1. We know that 1 m = 100 cm.`,
            "1"
          ),
          toSpan(
            mix`2. So divide by 100: ${M(`${p.cm} ÷ 100 = ${ans}`)}.`,
            "2"
          ),
        ];
      }

      if (p.kind === "wp_unit_g_to_kg") {
        return [
          toSpan(
            mix`1. We know that 1 kg = 1000 grams.`,
            "1"
          ),
          toSpan(
            mix`2. So divide by 1000: ${M(`${p.g} ÷ 1000 = ${ans}`)}.`,
            "2"
          ),
        ];
      }

      if (p.kind === "wp_distance_time") {
        return [
          toSpan(
            mix`1. Distance formula: distance = speed × time.`,
            "1"
          ),
          toSpan(
            mix`2. Compute: ${M(`${p.speed} × ${p.hours} = ${ans}`)} km.`,
            "2"
          ),
        ];
      }

      return [
        toSpan(mix`1. Identify what is asked – how many altogether? how many left? how many in each group?`, "1"),
        toSpan(mix`2. Write a math exercise that matches the story.`, "2"),
        toSpan(mix`3. Solve the exercise and connect it back to the words.`, "3"),
      ];

    case "ratio": {
      if (p.kind === "ratio_find") {
        return [
          toSpan(mix`1. Find the greatest common divisor (GCD) of ${M(String(p.a))} and ${M(String(p.b))}.`, "1"),
          toSpan(mix`2. Divide both by the GCD: ${M(`${p.a}÷${p.a/p.simplifiedA}`)} and ${M(`${p.b}÷${p.b/p.simplifiedB}`)}.`, "2"),
          toSpan(mix`3. The simplified ratio: ${ans}.`, "3"),
        ];
      }
      if (p.kind === "ratio_first") {
        return [
          toSpan(mix`1. The ratio ${M(`${p.simplifiedA}:${p.simplifiedB}`)} means: first = ${M(String(p.simplifiedA))} parts, second = ${M(String(p.simplifiedB))} parts.`, "1"),
          toSpan(mix`2. The second is ${M(String(p.secondNum))} = ${M(`${p.k} × ${p.simplifiedB}`)}, so k=${M(String(p.k))}.`, "2"),
          toSpan(mix`3. The first: ${M(`${p.k} × ${p.simplifiedA} = ${ans}`)}.`, "3"),
        ];
      }
      if (p.kind === "ratio_second") {
        return [
          toSpan(mix`1. The ratio ${M(`${p.simplifiedA}:${p.simplifiedB}`)} means: first = ${M(String(p.simplifiedA))} parts, second = ${M(String(p.simplifiedB))} parts.`, "1"),
          toSpan(mix`2. The first is ${M(String(p.firstNum))} = ${M(`${p.k} × ${p.simplifiedA}`)}, so k=${M(String(p.k))}.`, "2"),
          toSpan(mix`3. The second: ${M(`${p.k} × ${p.simplifiedB} = ${ans}`)}.`, "3"),
        ];
      }
      return [
        toSpan(mix`1. Identify the two quantities and compute a ratio.`, "1"),
        toSpan(mix`2. Simplify by dividing by the GCD.`, "2"),
        toSpan(mix`3. The answer: ${ans}.`, "3"),
      ];
    }

    case "scale": {
      if (p.kind === "scale_map_to_real") {
        return [
          toSpan(mix`1. Scale 1:${M(String(p.scale))} - every cm on the map = ${M(String(p.scale))} cm in real life.`, "1"),
          toSpan(mix`2. Multiply: ${M(`${p.mapLength} × ${p.scale} = ${ans}`)}.`, "2"),
          toSpan(mix`3. The real-life distance: ${ans} cm.`, "3"),
        ];
      }
      if (p.kind === "scale_find") {
        return [
          toSpan(mix`1. Find what to multiply by to go from the map to real life.`, "1"),
          toSpan(mix`2. Divide: ${M(`${p.realLength} ÷ ${p.mapLength} = ${ans}`)}.`, "2"),
          toSpan(mix`3. The scale: 1:${ans}.`, "3"),
        ];
      }
      return [
        toSpan(mix`1. Scale 1:X - every unit on the map = X units in real life.`, "1"),
        toSpan(mix`2. Real = map × X. Map = real ÷ X.`, "2"),
        toSpan(mix`3. The answer: ${ans}.`, "3"),
      ];
    }

    case "divisibility": {
      return [
        toSpan(mix`1. Check: is ${M(String(p.num))} divisible by ${M(String(p.divisor))} with no remainder?`, "1"),
        toSpan(mix`2. Compute: ${M(`${p.num} ÷ ${p.divisor}`)}.`, "2"),
        toSpan(
          p.isDivisible
            ? mix`3. It comes out whole - ${M(String(p.num))} is divisible by ${M(String(p.divisor))}.`
            : mix`3. It does not come out whole - ${M(String(p.num))} is not divisible by ${M(String(p.divisor))}.`,
          "3"
        ),
      ];
    }

    case "powers": {
      if (p.kind === "power_calc") {
        const factors = Array.from({ length: p.exp }, () => p.base);
        return [
          toSpan(mix`1. Power: ${M(`${p.base}^${p.exp}`)} = ${M(String(p.base))} times itself ${M(String(p.exp))} times.`, "1"),
          toSpan(mix`2. Compute: ${M(factors.join(" × "))} = ${M(String(p.result))}.`, "2"),
          toSpan(mix`3. The answer: ${ans}.`, "3"),
        ];
      }
      if (p.kind === "power_base") {
        return [
          toSpan(mix`1. Find the base: which number to the power of ${M(String(p.exp))} gives ${M(String(p.result))}?`, "1"),
          toSpan(mix`2. Try: ${M(String(p.base))}^${M(String(p.exp))} = ${M(String(p.result))}.`, "2"),
          toSpan(mix`3. The answer: ${ans}.`, "3"),
        ];
      }
      return [
        toSpan(mix`1. A power = repeated multiplication of the base by itself.`, "1"),
        toSpan(mix`2. For example: 3² = 3 × 3 = 9.`, "2"),
        toSpan(mix`3. The answer: ${ans}.`, "3"),
      ];
    }

    case "order_of_operations": {
      if (p.kind === "order_add_mul") {
        const prod = p.b * p.c;
        return [
          toSpan(mix`1. Multiply before add: ${M(`${p.a} + ${p.b} × ${p.c}`)} - multiply first.`, "1"),
          toSpan(mix`2. ${M(`${p.b} × ${p.c} = ${prod}`)}, then ${M(`${p.a} + ${prod} = ${ans}`)}.`, "2"),
          toSpan(mix`3. The answer: ${ans}.`, "3"),
        ];
      }
      if (p.kind === "order_mul_sub") {
        const prod = p.a * p.b;
        return [
          toSpan(mix`1. Multiply before subtract: ${M(`${p.a} × ${p.b} - ${p.c}`)} - multiply first.`, "1"),
          toSpan(mix`2. ${M(`${p.a} × ${p.b} = ${prod}`)}, then ${M(`${prod} - ${p.c} = ${ans}`)}.`, "2"),
          toSpan(mix`3. The answer: ${ans}.`, "3"),
        ];
      }
      if (p.kind === "order_parentheses") {
        const sum = p.a + p.b;
        return [
          toSpan(mix`1. Parentheses first: ${M(`(${p.a} + ${p.b}) × ${p.c}`)} - compute the parentheses first.`, "1"),
          toSpan(mix`2. ${M(`${p.a} + ${p.b} = ${sum}`)}, then ${M(`${sum} × ${p.c} = ${ans}`)}.`, "2"),
          toSpan(mix`3. The answer: ${ans}.`, "3"),
        ];
      }
      return [
        toSpan(mix`1. Order: parentheses → multiply/divide → add/subtract.`, "1"),
        toSpan(mix`2. Compute in the correct order.`, "2"),
        toSpan(mix`3. The answer: ${ans}.`, "3"),
      ];
    }

    case "estimation": {
      if (p.kind === "est_add") {
        const roundA = Math.round(p.a / 10) * 10;
        const roundB = Math.round(p.b / 10) * 10;
        return [
          toSpan(mix`1. Round to tens: ${M(String(p.a))} ≈ ${M(String(roundA))}, ${M(String(p.b))} ≈ ${M(String(roundB))}.`, "1"),
          toSpan(mix`2. Add the estimates: ${M(`${roundA} + ${roundB} = ${roundA + roundB}`)}.`, "2"),
          toSpan(mix`3. The estimate: ${ans}.`, "3"),
        ];
      }
      if (p.kind === "est_mul") {
        const roundA = Math.round(p.a / 10) * 10;
        const roundB = Math.round(p.b / 10) * 10;
        return [
          toSpan(mix`1. Round to tens: ${M(String(p.a))} ≈ ${M(String(roundA))}, ${M(String(p.b))} ≈ ${M(String(roundB))}.`, "1"),
          toSpan(mix`2. Multiply the estimates: ${M(`${roundA} × ${roundB} = ${roundA * roundB}`)}.`, "2"),
          toSpan(mix`3. The estimate: ${ans}.`, "3"),
        ];
      }
      if (p.kind === "est_quantity") {
        const rounded = Math.round(p.quantity / 10) * 10;
        return [
          toSpan(mix`1. Round ${M(String(p.quantity))} to the nearest tens: ${M(String(rounded))}.`, "1"),
          toSpan(mix`2. The estimate: ${ans}.`, "2"),
        ];
      }
      return [
        toSpan(mix`1. Round the numbers to the nearest tens/hundreds.`, "1"),
        toSpan(mix`2. Compute an estimate.`, "2"),
        toSpan(mix`3. The estimate: ${ans}.`, "3"),
      ];
    }

    case "zero_one_properties": {
      if (p.kind === "zero_mul" || p.kind === "zero_mul_eq" || p.kind === "zero_mul_word") {
        return [
          toSpan(mix`1. Property: any number × 0 = 0.`, "1"),
          toSpan(mix`2. ${M(`${p.a} × 0 = 0`)}.`, "2"),
          toSpan(mix`3. The answer: ${ans}.`, "3"),
        ];
      }
      if (p.kind === "zero_add_expr" || p.kind === "zero_add_swap" || p.kind === "zero_sub_line") {
        return [
          toSpan(mix`1. Property: adding/subtracting 0 does not change the number.`, "1"),
          toSpan(mix`2. ${M(`${p.a} + 0 = ${p.a}`)} and ${M(`${p.a} - 0 = ${p.a}`)}.`, "2"),
          toSpan(mix`3. The answer: ${ans}.`, "3"),
        ];
      }
      if (p.kind === "one_mul_identity" || p.kind === "one_mul_comm") {
        return [
          toSpan(mix`1. Property: any number × 1 = the same number.`, "1"),
          toSpan(mix`2. ${M(`${p.a} × 1 = ${p.a}`)}.`, "2"),
          toSpan(mix`3. The answer: ${ans}.`, "3"),
        ];
      }
      return [
        toSpan(mix`1. Number × 0 = 0. Number × 1 = same number. Number ± 0 = same number.`, "1"),
        toSpan(mix`2. The answer: ${ans}.`, "2"),
      ];
    }

    case "division_with_remainder": {
      const remainder = p.remainder ?? 0;
      return [
        toSpan(mix`1. Divide: ${M(`${p.dividend} ÷ ${p.divisor}`)}.`, "1"),
        toSpan(mix`2. How many times does ${M(String(p.divisor))} fit in? ${M(String(p.quotient))} times.`, "2"),
        toSpan(mix`3. Remainder: ${M(`${p.dividend} − (${p.quotient} × ${p.divisor}) = ${remainder}`)}.`, "3"),
        toSpan(mix`4. Check: ${M(`${p.divisor} × ${p.quotient} + ${remainder} = ${p.dividend}`)} ✓`, "4"),
      ];
    }

    default:
      return [];
  }
}

// "Why was I wrong?" – short common-mistake explanation
// Age-appropriate explanation – simpler wording for lower grades (locale via meCopy)
function getAgeAppropriateExplanation(operation, gradeKey, question, correctAnswer) {
  if (shouldUseComparisonSignErrorExplanation(question, operation)) {
    return buildComparisonSignWrongAnswerLine(question);
  }

  const displayCorrectAnswer = Number.isNaN(correctAnswer)
    ? question?.correctAnswer
    : correctAnswer;

  const fill = (key, vars) => {
    let out = meCopy(key);
    for (const [k, v] of Object.entries(vars)) {
      out = out.split(`{${k}}`).join(String(v));
    }
    return out;
  };
  const L = (expr) => `\u2066${expr}\u2069`;

  if (gradeKey === "g1" || gradeKey === "g2") {
    const a = question.a || question.params?.a;
    const b = question.b || question.params?.b;

    switch (operation) {
      case "addition":
        return fill("age_g12_addition", {
          a: L(String(a)),
          b: L(String(b)),
          count_up: L(`${a}... ${a + 1}... ${a + 2}...`),
          answer: L(String(correctAnswer)),
        });
      case "subtraction":
        return fill("age_g12_subtraction", {
          a: L(String(a)),
          b: L(String(b)),
          count_down: L(`${a}... ${a - 1}... ${a - 2}...`),
          answer: L(String(correctAnswer)),
        });
      case "multiplication":
        return fill("age_g12_multiplication", {
          expr: L(`${a} × ${b}`),
          repeated: L(`${a} + ${a} + ${a}`),
          b: L(String(b)),
          count_mult: L(`${a}, ${a * 2}, ${a * 3}...`),
          answer: L(String(correctAnswer)),
        });
      case "division":
        return fill("age_g12_division", {
          expr: L(`${a} ÷ ${b}`),
          a: L(String(a)),
          b: L(String(b)),
          answer: L(String(correctAnswer)),
        });
      default:
        return fill("age_g12_default", {
          answer: L(String(displayCorrectAnswer)),
        });
    }
  }

  if (gradeKey === "g3" || gradeKey === "g4") {
    const a = question.a || question.params?.a;
    const b = question.b || question.params?.b;

    switch (operation) {
      case "addition":
        if (a && b) {
          const tens = Math.floor(b / 10) * 10;
          const ones = b % 10;
          return fill("age_g34_addition_break", {
            sum_eq: L(`${a} + ${b} = ${correctAnswer}`),
            break_eq: L(
              `${a} + ${b} = ${a} + ${tens} + ${ones} = ${a + tens} + ${ones} = ${correctAnswer}`
            ),
          });
        }
        return fill("age_g34_step_default", {
          answer: L(String(displayCorrectAnswer)),
        });
      case "subtraction":
        if (a && b) {
          const tens = Math.floor(b / 10) * 10;
          const ones = b % 10;
          return fill("age_g34_subtraction_break", {
            diff_eq: L(`${a} - ${b} = ${displayCorrectAnswer}`),
            break_eq: L(
              `${a} - ${b} = ${a} - ${tens} - ${ones} = ${a - tens} - ${ones} = ${displayCorrectAnswer}`
            ),
          });
        }
        return fill("age_g34_step_default", {
          answer: L(String(displayCorrectAnswer)),
        });
      default:
        return fill("age_g34_step_default", {
          answer: L(String(displayCorrectAnswer)),
        });
    }
  }

  return null;
}

export function getErrorExplanation(question, operation, wrongAnswer, gradeKey, opts = {}) {
  if (!question) return "";
  if (shouldUseComparisonSignErrorExplanation(question, operation)) {
    return buildComparisonSignWrongAnswerLine(question);
  }
  const userAnsNum = Number(wrongAnswer);
  const correctAnswerRaw = question.correctAnswer;
  if (isComparisonSignToken(correctAnswerRaw)) {
    return buildComparisonSignWrongAnswerLine(question);
  }
  const correctNum =
    typeof correctAnswerRaw === "string" && correctAnswerRaw.includes("/")
      ? Number(
          correctAnswerRaw.split("/")[0] /
            (correctAnswerRaw.split("/")[1] || 1)
        )
      : Number(correctAnswerRaw);

  if (opts.mode === "learning") {
    const ageAppropriate = getAgeAppropriateExplanation(
      operation,
      gradeKey,
      question,
      correctNum
    );
    if (ageAppropriate) {
      return ageAppropriate;
    }
  }

  switch (operation) {
    case "addition":
      if (!Number.isNaN(userAnsNum) && userAnsNum < correctNum) {
        return meCopy("error_addition_too_low");
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum > correctNum) {
        return meCopy("error_addition_too_high");
      }
      return meCopy("error_addition_default");
    case "subtraction":
      return meCopy("error_subtraction");
    case "multiplication":
      return meCopy("error_multiplication");
    case "division":
      return meCopy("error_division");
    case "fractions":
      return meCopy("error_fractions");
    case "percentages": {
      const [before, after = ""] = meCopy("error_percentages").split("{example}");
      return mix`${before}${M("25% = 1/4")}${after}`;
    }
    case "sequences":
      return meCopy("error_sequences");
    case "decimals":
      return meCopy("error_decimals");
    case "rounding": {
      const [beforeLow, rest = ""] = meCopy("error_rounding").split("{low}");
      const [mid, afterHigh = ""] = rest.split("{high}");
      return mix`${beforeLow}${M("0–4")}${mid}${M("5–9")}${afterHigh}`;
    }
    case "equations":
      return meCopy("error_equations");
    case "compare":
      return meCopy("error_compare");
    case "number_sense":
      return meCopy("error_number_sense");
    case "factors_multiples":
      return meCopy("error_factors_multiples");
    case "word_problems":
      return meCopy("error_word_problems");
    default:
      return "";
  }
}

// Build detailed step-by-step explanation for the current question
function pushMixStep(steps, line) {
  steps.push(toSpan(line, String(steps.length)));
}

export function buildStepExplanation(question) {
  if (!question) return null;

  const p = question.params || {};

  const op = question.operation;
  const a = p.a ?? question.a;
  const b = p.b ?? question.b;
  const answer =
    question.correctAnswer !== undefined
      ? question.correctAnswer
      : question.answer;

  let exercise = "";
  let vertical = "";
  const steps = [];

  // Explain using an "effective" operation – e.g.:
  // 53 + (-3) → effective op: subtraction 53 - 3
  let effectiveOp = op;
  let aEff = a;
  let bEff = b;

  // If adding a negative second number – convert to ordinary subtraction
  if (op === "addition" && typeof b === "number" && b < 0) {
    effectiveOp = "subtraction";
    bEff = Math.abs(b);

    pushMixStep(steps,
      mix`0. Notice that the addition exercise ${M(`${a} + (${b})`)} is really like subtraction: ${M(`${a} - ${Math.abs(b)}`)}.`
    );
  }

  // Missing-number exercises – use the shared converter
  const missingConversion = convertMissingNumberEquation(op, p.kind, p);
  if (missingConversion) {
    effectiveOp = missingConversion.effectiveOp;
    aEff = missingConversion.top;
    bEff = missingConversion.bottom;
  }

  // Missing-number addition – rewrite as subtraction (detailed explanation)
  if (
    op === "addition" &&
    (p.kind === "add_missing_first" || p.kind === "add_missing_second")
  ) {
    const c = p.c; // final result
    let leftNum, rightNum;

    if (p.kind === "add_missing_first") {
      // __ + b = c  →  c - b = __
      leftNum = c;
      rightNum = p.b;
      exercise = pureMathLtrDisplay(`${BLANK} + ${p.b} = ${c}`);
    } else {
      // a + __ = c  →  c - a = __
      leftNum = c;
      rightNum = p.a;
      exercise = pureMathLtrDisplay(`${p.a} + ${BLANK} = ${c}`);
    }

    const missing = answer;
    vertical = buildVerticalOperation(leftNum, rightNum, "-");

    pushMixStep(steps,
      mix`1. Rewrite the exercise as subtraction: instead of ${exercise} write ${M(`${c} - ${rightNum} = ${BLANK}`)}.`
    );
    pushMixStep(steps,
      mix`2. Write the numbers one under the other in columns: tens above tens and ones above ones.`);

    // Digit-by-digit calculation
    const topStr = String(leftNum);
    const bottomStr = String(rightNum);
    const maxLen = Math.max(topStr.length, bottomStr.length);
    const topPadded = topStr.padStart(maxLen, "0");
    const bottomPadded = bottomStr.padStart(maxLen, "0");

    let borrow = 0;
    let stepIndex = 3;
    const resultDigits = [];

    for (let i = maxLen - 1; i >= 0; i--) {
      let topDigit = Number(topPadded[i]);
      const bottomDigit = Number(bottomPadded[i]);
      topDigit -= borrow;

      const placeName =
        i === maxLen - 1
          ? "ones"
          : i === maxLen - 2
          ? "tens"
          : "hundreds";

      if (topDigit < bottomDigit) {
        pushMixStep(steps,
          mix`${stepIndex}. In the ${placeName} column ${topDigit} is less than ${bottomDigit}, so borrow from the next column (add 10 to this digit and subtract 1 from the next column).`
        );
        topDigit += 10;
        borrow = 1;
        stepIndex++;
      } else {
        borrow = 0;
      }

      const diff = topDigit - bottomDigit;
      resultDigits.unshift(diff);
      pushMixStep(steps,
        mix`${stepIndex}. Now compute in the ${placeName} column: ${M(`${topDigit} - ${bottomDigit} = ${diff}`)} and write ${diff} in this column.`
      );
      stepIndex++;
    }

    pushMixStep(steps,
      mix`5. The number you get is ${missing}. That is the missing number in the exercise: ${
        p.kind === "add_missing_first"
          ? pureMathLtrDisplay(`${missing} + ${p.b} = ${c}`)
          : pureMathLtrDisplay(`${p.a} + ${missing} = ${c}`)
      }.`
    );

    return {
      exercise,
      vertical,
      steps,
    };
  }

  // Missing-number multiplication – rewrite as division (detailed explanation)
  if (
    op === "multiplication" &&
    (p.kind === "mul_missing_first" || p.kind === "mul_missing_second")
  ) {
    const c = p.c; // final result
    let leftNum, rightNum;

    if (p.kind === "mul_missing_first") {
      // __ × b = c  →  c ÷ b = __
      leftNum = c;
      rightNum = p.b;
      exercise = pureMathLtrDisplay(`${BLANK} × ${p.b} = ${c}`);
    } else {
      // a × __ = c  →  c ÷ a = __
      leftNum = c;
      rightNum = p.a;
      exercise = pureMathLtrDisplay(`${p.a} × ${BLANK} = ${c}`);
    }

    const missing = answer;
    vertical = buildVerticalOperation(leftNum, rightNum, "÷");

    pushMixStep(steps,
      mix`1. Rewrite the exercise as division: instead of ${exercise} write ${M(`${c} ÷ ${rightNum} = ${BLANK}`)}.`
    );
    pushMixStep(steps,
      mix`2. Division is the inverse of multiplication: how many times does ${rightNum} fit into ${c}?`
    );
    
    if (typeof answer === "number") {
      pushMixStep(steps,
        mix`3. Check: ${M(`${rightNum} × ${answer} = ${rightNum * answer}`)}. That gives us ${rightNum * answer}, which is exactly ${c}.`
      );
      pushMixStep(steps,
        mix`4. So the missing number is ${missing}. That is the missing number in the exercise: ${
          p.kind === "mul_missing_first"
            ? pureMathLtrDisplay(`${missing} × ${p.b} = ${c}`)
            : pureMathLtrDisplay(`${p.a} × ${missing} = ${c}`)
        }.`
      );
    }

    return {
      exercise,
      vertical,
      steps,
    };
  }

  // Missing-number division (detailed explanation)
  if (
    op === "division" &&
    (p.kind === "div_missing_dividend" || p.kind === "div_missing_divisor")
  ) {
    const { dividend, divisor, quotient } = p;
    let leftNum, rightNum, opSymbol;

    if (p.kind === "div_missing_dividend") {
      // __ ÷ divisor = quotient  →  quotient × divisor = __ (multiply)
      leftNum = quotient;
      rightNum = divisor;
      opSymbol = "×";
      exercise = pureMathLtrDisplay(`${BLANK} ÷ ${divisor} = ${quotient}`);
      pushMixStep(steps,
        mix`1. Rewrite the exercise as multiplication: instead of ${exercise} write ${M(`${quotient} × ${divisor} = ${BLANK}`)}.`
      );
    } else {
      // dividend ÷ __ = quotient  →  dividend ÷ quotient = __ (divide)
      leftNum = dividend;
      rightNum = quotient;
      opSymbol = "÷";
      exercise = pureMathLtrDisplay(`${dividend} ÷ ${BLANK} = ${quotient}`);
      pushMixStep(steps,
        mix`1. Rewrite the exercise as division: instead of ${exercise} write ${M(`${dividend} ÷ ${quotient} = ${BLANK}`)}.`
      );
    }

    const missing = answer;
    vertical = buildVerticalOperation(leftNum, rightNum, opSymbol);

    if (p.kind === "div_missing_dividend") {
      pushMixStep(steps,
        mix`2. Multiplication is repeated addition: ${M(`${quotient} × ${divisor} = ${Array(quotient).fill(divisor).join(" + ")} = ${dividend}`)}.`
      );
      pushMixStep(steps,
        mix`3. So the missing number is ${missing}. That is the missing number in the exercise: ${M(`${missing} ÷ ${divisor} = ${quotient}`)}.`
      );
    } else {
      pushMixStep(steps,
        mix`2. Division is the inverse of multiplication: how many times does ${quotient} fit into ${dividend}?`
      );
      if (typeof answer === "number") {
        pushMixStep(steps,
          mix`3. Check: ${M(`${quotient} × ${answer} = ${quotient * answer}`)}. That gives us ${quotient * answer}, which is exactly ${dividend}.`
        );
        pushMixStep(steps,
          mix`4. So the missing number is ${missing}. That is the missing number in the exercise: ${M(`${dividend} ÷ ${missing} = ${quotient}`)}.`
        );
      }
    }

    return {
      exercise,
      vertical,
      steps,
    };
  }

  // Basic exercise display (horizontal) – math only
  if (aEff != null && bEff != null && typeof aEff === "number" && typeof bEff === "number") {
    let symbol = "";
    if (effectiveOp === "addition") symbol = "+";
    else if (effectiveOp === "subtraction") symbol = "−";
    else if (effectiveOp === "multiplication") symbol = "×";
    else if (effectiveOp === "division") symbol = "÷";

    exercise = pureMathLtrDisplay(`${aEff} ${symbol} ${bEff} = ${BLANK}`);
  } else {
    const raw = question.params?.exerciseText || question.question || "";
    exercise = raw ? pureMathLtrDisplay(raw) : "";
  }

  // Explanation types by operation

  // Addition
  if (effectiveOp === "addition" && typeof aEff === "number" && typeof bEff === "number") {
    vertical = buildVerticalOperation(aEff, bEff, "+");
    const aStr = String(aEff);
    const bStr = String(bEff);
    const maxLen = Math.max(aStr.length, bStr.length);
    const pa = aStr.padStart(maxLen, "0");
    const pb = bStr.padStart(maxLen, "0");

    pushMixStep(steps,
      mix`1. Write the numbers one above the other so the ones digits are in the same column: ${M(`${aEff}\n+ ${bEff}`)}.`
    );

    let carry = 0;
    let stepIndex = 2;

    for (let i = maxLen - 1; i >= 0; i--) {
      const da = Number(pa[i]);
      const db = Number(pb[i]);
      const sum = da + db + carry;
      const ones = sum % 10;
      const newCarry = sum >= 10 ? 1 : 0;

      const placeName =
        i === maxLen - 1
          ? "ones"
          : i === maxLen - 2
          ? "tens"
          : "hundreds";

      pushMixStep(steps, mix`${stepIndex}. Add the ${placeName} digits: ${M(`${da} + ${db}${carry ? " + " + carry : ""} = ${sum}`)}. Write ${ones} in the ${placeName} column${newCarry ? ` and carry 1 to the next column.` : ""}`);

      carry = newCarry;
      stepIndex++;
    }

    if (carry) {
      pushMixStep(steps,
        mix`${stepIndex}. At the end of the addition there is 1 left over; write it on the left as a new hundreds/thousands digit.`
      );
      stepIndex++;
    }

    if (typeof answer === "number") {
      pushMixStep(steps,
        mix`${stepIndex}. The final number is ${answer}. That is the final answer to the exercise.`
      );
    }

    return {
      exercise,
      vertical,
      steps,
    };
  }

  // Subtraction
  if (effectiveOp === "subtraction" && typeof aEff === "number" && typeof bEff === "number") {
    vertical = buildVerticalOperation(aEff, bEff, "-");
    const aStr = String(aEff);
    const bStr = String(bEff);
    const maxLen = Math.max(aStr.length, bStr.length);
    const pa = aStr.padStart(maxLen, "0");
    const pb = bStr.padStart(maxLen, "0");

    pushMixStep(steps,
      mix`1. Write the numbers one above the other so the ones, tens, etc. are in the same column: ${M(`${aEff}\n- ${bEff}`)}.`
    );

    let borrow = 0;
    let stepIndex = 2;

    for (let i = maxLen - 1; i >= 0; i--) {
      let da = Number(pa[i]);
      const db = Number(pb[i]);
      da -= borrow;

      const placeName =
        i === maxLen - 1
          ? "ones"
          : i === maxLen - 2
          ? "tens"
          : "hundreds";

      if (da < db) {
        pushMixStep(steps,
          mix`${stepIndex}. In the ${placeName} column ${da} is less than ${db}, so borrow from the next column (add 10 to this digit and subtract 1 from the next column).`
        );
        da += 10;
        borrow = 1;
      } else {
        borrow = 0;
      }

      const diff = da - db;
      stepIndex++;

      pushMixStep(steps,
        mix`${stepIndex}. Now compute in the ${placeName} column: ${M(`${da} - ${db} = ${diff}`)} and write ${diff} in this column.`
      );
      stepIndex++;
    }

    if (typeof answer === "number") {
      pushMixStep(steps,
        mix`${stepIndex}. The number we got at the end is ${answer}. That is the result of the subtraction.`
      );
    }

    return {
      exercise,
      vertical,
      steps,
    };
  }

  // Multiplication
  if (
    effectiveOp === "multiplication" &&
    typeof aEff === "number" &&
    typeof bEff === "number"
  ) {
    vertical = pureMathLtrDisplay(`${aEff}\n× ${bEff}`);

    pushMixStep(steps,
      mix`1. Understand that multiplication is repeated addition: for example 3 × 4 is like 4 + 4 + 4.`);
    pushMixStep(steps,
      mix`2. In our case we compute: ${M(`${aEff} × ${bEff}`)}. You can think of it as ${aEff} times the number ${bEff} or ${bEff} times the number ${aEff}.`
    );

    if (aEff <= 12 && bEff <= 12) {
      const smaller = Math.min(aEff, bEff);
      const bigger = Math.max(aEff, bEff);
      pushMixStep(steps,
        mix`3. For example: ${M(`${smaller} × ${bigger} = ${Array(smaller)
            .fill(bigger)
            .join(" + ")} = ${answer}`)}.`
      );
    } else if (typeof answer === "number") {
      pushMixStep(steps,
        mix`3. Use a multiplication table or factoring to reach the result ${answer}.`
      );
    }

    if (typeof answer === "number") {
      pushMixStep(steps, mix`4. So ${M(`${aEff} × ${bEff} = ${answer}`)}.`);
    }

    return {
      exercise,
      vertical,
      steps,
    };
  }

  // Long division – step by step like addition and subtraction
  if (effectiveOp === "division" && typeof aEff === "number" && typeof bEff === "number") {
    // Use question params for division (dividend, divisor, quotient)
    const dividend = p.dividend || aEff;
    const divisor = p.divisor || bEff;
    const quotient = p.quotient || answer;
    
    vertical = buildVerticalOperation(divisor, dividend, "÷");
    
    const dividendStr = String(dividend);
    const divisorNum = divisor;
    
    pushMixStep(steps,
      mix`1. Write the dividend (${dividend}) and the divisor (${divisor}) in long-division form.`
    );
    
    // Perform long division step by step
    let workingNumber = 0;
    let stepIndex = 2;
    let quotientDigits = [];
    let divisionSteps = [];
    
    for (let i = 0; i < dividendStr.length; i++) {
      workingNumber = workingNumber * 10 + parseInt(dividendStr[i]);
      
      if (workingNumber >= divisorNum) {
        const qDigit = Math.floor(workingNumber / divisorNum);
        const product = qDigit * divisorNum;
        const remainder = workingNumber - product;
        
        quotientDigits.push(qDigit);
        divisionSteps.push({
          position: i,
          workingNumber,
          quotientDigit: qDigit,
          product,
          remainder,
        });
        
        workingNumber = remainder;
      }
    }
    
    // Build detailed steps
    for (let idx = 0; idx < divisionSteps.length; idx++) {
      const step = divisionSteps[idx];
      const { position, workingNumber: wNum, quotientDigit: qDigit, product, remainder } = step;
      
      // Step: write quotient digit
      pushMixStep(steps,
        mix`${stepIndex}. ${divisorNum} fit into ${wNum} exactly ${qDigit} times. Write ${qDigit} in the quotient above the digit ${dividendStr[position]}.`
      );
      stepIndex++;
      
      // Step: multiply and subtract
      pushMixStep(steps,
        mix`${stepIndex}. Multiply: ${M(`${qDigit} × ${divisorNum} = ${product}`)}. Subtract: ${M(`${wNum} - ${product} = ${remainder}`)}. ${remainder === 0 ? 'No remainder.' : `The remainder is ${remainder}.`}`
      );
      stepIndex++;
      
      // If not the last step, bring down the next digit
      if (idx < divisionSteps.length - 1 && position < dividendStr.length - 1) {
        const nextPos = divisionSteps[idx + 1].position;
        const nextDigit = parseInt(dividendStr[nextPos]);
        pushMixStep(steps,
          mix`${stepIndex}. Bring down the next digit (${nextDigit}). The new number to divide is ${remainder * 10 + nextDigit}.`
        );
        stepIndex++;
      }
    }
    
    // Final step
    const finalRemainder = divisionSteps.length > 0 ? divisionSteps[divisionSteps.length - 1].remainder : 0;
    if (typeof quotient === "number") {
      if (finalRemainder > 0) {
        pushMixStep(steps,
          mix`${stepIndex}. Done! The quotient is ${quotient} and the remainder is ${finalRemainder}.`
        );
      } else {
        pushMixStep(steps,
          mix`${stepIndex}. Done! The quotient is ${quotient} with no remainder.`
        );
      }
    }

    return {
      exercise,
      vertical,
      steps,
    };
  }

  // Word problem – general explanation
  if (op === "word_problems") {
    pushMixStep(steps, mix`1. Read the word problem slowly and mark the important information.`);
    pushMixStep(steps,
      mix`2. Decide whether to add, subtract, multiply, or divide based on the story (did the amount grow, shrink, repeat, or get shared?).`);
    pushMixStep(steps,
      mix`3. Write a number sentence that matches the story, solve it, then answer in a full sentence.`);
    if (typeof answer === "number") {
      pushMixStep(steps, mix`4. The calculation gives us ${answer}, so that is the answer to the question.`);
    }

    return {
      exercise,
      vertical,
      steps,
    };
  }

  // Everything else (fractions, percentages, etc.) – general explanation
  pushMixStep(steps,
    mix`1. Check which kind of operation this is (add, subtract, multiply, or divide) and arrange the numbers clearly on the page.`);
  pushMixStep(steps, mix`2. Solve step by step without skipping, and mark each step along the way.`);
  if (typeof answer === "number") {
    pushMixStep(steps, mix`3. In the end we get the result ${answer}.`);
  }

  return {
    exercise,
    vertical,
    steps,
  };
}
