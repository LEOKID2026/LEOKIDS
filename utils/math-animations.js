import {
  coerceComparisonOperands,
  embedComparisonSignInRtlProse,
  formatCompareMathExpression,
  getCanonicalComparisonSign,
} from "./comparison-sign-mcq.js";
import { mix, M, learningStepFields, pureMathLtrDisplay, pureMathLtrBlock, flattenTemplateRuns, unwrapLearningRuns } from "../lib/learning-book/learning-math-line-build.js";

export function buildVerticalOperation(topNumber, bottomNumber, operator = "-") {
  const top = String(topNumber);
  const bottom = String(bottomNumber);
  
  // Special handling for long division — the dividend on the left with a bracket, the divisor on the right
  if (operator === "÷") {
    // In long division the correct display is:
    // ────┐
    // 1320│6
    // The horizontal line meets the corner with the vertical line (┐ above │).
    // the parameters: topNumber = divisor (divisor), bottomNumber = dividend (dividend)

    const divisor = String(topNumber); // the divisor (6)
    const dividend = String(bottomNumber); // the dividend (1320)
    const dividendLen = Math.max(1, dividend.length);

    const line1 = `${"─".repeat(dividendLen)}┐`;
    const line2 = `${dividend}│${divisor}`;

    const raw = `${line1}\n${line2}`;
    // wrap the whole block in a marker LTR so it does not get scrambled inside Hebrew text
    return pureMathLtrDisplay(raw);
  }
  
  // for other operations — the original display
  // Special handling for decimals — align by the decimal point
  const topHasDecimal = top.includes(".");
  const bottomHasDecimal = bottom.includes(".");
  
  if (topHasDecimal || bottomHasDecimal) {
    // align by the decimal point
    const topParts = top.split(".");
    const bottomParts = bottom.split(".");
    const topInt = topParts[0] || "";
    const topDec = topParts[1] || "";
    const bottomInt = bottomParts[0] || "";
    const bottomDec = bottomParts[1] || "";
    
    // length of the whole part and the decimal part
    const maxIntLen = Math.max(topInt.length, bottomInt.length);
    const maxDecLen = Math.max(topDec.length, bottomDec.length);
    
    // Align the whole part (right) and the decimal part (left)
    const topIntPadded = topInt.padStart(maxIntLen, " ");
    const bottomIntPadded = bottomInt.padStart(maxIntLen, " ");
    const topDecPadded = topDec.padEnd(maxDecLen, "0");
    const bottomDecPadded = bottomDec.padEnd(maxDecLen, "0");
    
    const topFormatted = topHasDecimal ? `${topIntPadded}.${topDecPadded}` : topIntPadded;
    const bottomFormatted = bottomHasDecimal ? `${bottomIntPadded}.${bottomDecPadded}` : bottomIntPadded;
    
    const totalWidth = maxIntLen + 1 + maxDecLen + 2; // 1 for the point, 2 for the operator and a space
    
    const line1 = " ".repeat(totalWidth - topFormatted.length) + topFormatted;
    const line2 = operator + " " + " ".repeat(maxIntLen + 1 + maxDecLen - bottomFormatted.length) + bottomFormatted;
    const line3 = "-".repeat(totalWidth);
    
    const raw = `${line1}\n${line2}\n${line3}`;
    return pureMathLtrDisplay(raw);
  }
  
  // for regular operations (without decimals)
  const maxLen = Math.max(top.length, bottom.length);
  const width = maxLen + 2; // 2 for the operator and a space

  const line1 = " ".repeat(width - top.length) + top;
  const line2 = operator + " " + " ".repeat(maxLen - bottom.length) + bottom;
  const line3 = "-".repeat(width);

  const raw = `${line1}\n${line2}\n${line3}`;

  // wrap the whole block in a marker LTR so it does not get scrambled inside Hebrew text
  return pureMathLtrDisplay(raw);
}

// General function that handles fill-in exercises
export function convertMissingNumberEquation(op, kind, params) {
  if (!params || !kind) return null;
  
  const { a, b, c } = params;
  
  // addition: __ + b = c or a + __ = c → subtraction
  if (op === "addition" && (kind === "add_missing_first" || kind === "add_missing_second")) {
    if (kind === "add_missing_first") {
      // __ + b = c  →  c - b = __
      return {
        effectiveOp: "subtraction",
        top: c,
        bottom: b,
        answer: a
      };
    } else {
      // a + __ = c  →  c - a = __
      return {
        effectiveOp: "subtraction",
        top: c,
        bottom: a,
        answer: b
      };
    }
  }
  
  // subtraction: __ - b = c or a - __ = c
  if (op === "subtraction" && (kind === "sub_missing_first" || kind === "sub_missing_second")) {
    if (kind === "sub_missing_first") {
      // __ - b = c  →  c + b = __ (addition)
      return {
        effectiveOp: "addition",
        top: c,
        bottom: b,
        answer: a
      };
    } else {
      // a - __ = c  →  a - c = __ (subtraction)
      return {
        effectiveOp: "subtraction",
        top: a,
        bottom: c,
        answer: b
      };
    }
  }
  
  // multiplication: __ × b = c or a × __ = c → division
  if (op === "multiplication" && (kind === "mul_missing_first" || kind === "mul_missing_second")) {
    if (kind === "mul_missing_first") {
      // __ × b = c  →  c ÷ b = __
      return {
        effectiveOp: "division",
        top: c,
        bottom: b,
        answer: a
      };
    } else {
      // a × __ = c  →  c ÷ a = __
      return {
        effectiveOp: "division",
        top: c,
        bottom: a,
        answer: b
      };
    }
  }
  
  // division: __ ÷ divisor = quotient or dividend ÷ __ = quotient
  if (op === "division" && (kind === "div_missing_dividend" || kind === "div_missing_divisor")) {
    const { dividend, divisor, quotient } = params;
    
    if (kind === "div_missing_dividend") {
      // __ ÷ divisor = quotient  →  quotient × divisor = __ (multiplication)
      return {
        effectiveOp: "multiplication",
        top: quotient,
        bottom: divisor,
        answer: dividend
      };
    } else {
      // dividend ÷ __ = quotient  →  dividend ÷ quotient = __ (division)
      return {
        effectiveOp: "division",
        top: dividend,
        bottom: quotient,
        answer: divisor
      };
    }
  }
  
  return null;
}

// Function that builds animation steps for addition and subtraction
export function buildAdditionOrSubtractionAnimation(a, b, answer, op) {
  const steps = [];
  const aStr = String(a);
  const bStr = String(Math.abs(b));
  const maxLen = Math.max(aStr.length, bStr.length);
  const pa = aStr.padStart(maxLen, "0");
  const pb = bStr.padStart(maxLen, "0");

  const padLeft = (s, w) => String(s).padStart(w, " ");
  const repeat = (ch, n) => Array(Math.max(0, n)).fill(ch).join("");
  const maskAnswerRight = (full, revealDigits) => {
    const s = String(full);
    let out = s.split("");
    let seenDigits = 0;
    for (let i = out.length - 1; i >= 0; i--) {
      const ch = out[i];
      if (/\d/.test(ch)) {
        if (seenDigits < revealDigits) {
          seenDigits++;
        } else {
          out[i] = " ";
        }
      }
    }
    return out.join("");
  };
  const makeVerticalSnapshot = ({ operator, top, bottom, answerFull, revealDigits, carryRow = null }) => {
    const topS = String(top);
    const bottomS = String(bottom);
    const ansS = String(answerFull);
    const maxDigits = Math.max(topS.replace(/\D/g, "").length, bottomS.replace(/\D/g, "").length, ansS.replace(/\D/g, "").length);
    const w = Math.max(maxDigits, ansS.length, topS.length, bottomS.length) + 2;

    const line1 = padLeft(topS, w);
    const line2 = operator + " " + padLeft(bottomS, w - 2);
    const line3 = repeat("-", w);
    const masked = maskAnswerRight(padLeft(ansS, w), revealDigits);
    const lines = [];
    if (carryRow && carryRow.trim()) {
      lines.push(padLeft(carryRow, w));
    }
    lines.push(line1, line2, line3, masked);
    return lines.join("\n");
  };

  if (op === "addition") {
    const answerStr = String(answer);
    const answerLen = answerStr.length;
    const carryMarks = []; // positions in printable width where carry should appear
    
    // Step 1: Line up the digits
    steps.push({
      id: "place-value",
      title: "Line up the digits",
      ...learningStepFields(mix`Write the numbers one above the other so the ones digits line up in the same column.`),
      highlights: ["aAll", "bAll"],
      revealDigits: 0, // nothing revealed yet
      pre: makeVerticalSnapshot({
        operator: "+",
        top: a,
        bottom: Math.abs(b),
        answerFull: answer,
        revealDigits: 0,
        carryRow: "",
      }),
    });

    // digit-by-digit calculation
    let carry = 0;
    let stepIndex = 2;
    let revealedCount = 0; // how many digits are already revealed

    // Setup: drawing width (so we can position carries)
    const topS = String(a);
    const bottomS = String(Math.abs(b));
    const ansS = String(answer);
    const maxDigits = Math.max(topS.length, bottomS.length, ansS.length);
    const w = maxDigits + 2;
    const digitsStart = w - maxLen; // where the digits start (right-aligned)
    const carryRowArr = Array(w).fill(" ");

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

      const highlightKey = i === maxLen - 1 ? "Units" : i === maxLen - 2 ? "Tens" : "Hundreds";
      const columnFromRight = maxLen - 1 - i;

      revealedCount++; // reveal one more digit

      // Update the carry row: the carry moves to the column on the left (i-1)
      if (newCarry) {
        const targetDigitIndex = i - 1;
        const pos = targetDigitIndex >= 0 ? digitsStart + targetDigitIndex : digitsStart - 1;
        if (pos >= 0 && pos < carryRowArr.length) {
          carryRowArr[pos] = "1";
        }
      }

      const carryRowStr = carryRowArr.join("");
      steps.push({
        id: `step-${stepIndex}`,
        title: `the ${placeName}`,
        ...learningStepFields(mix`add the ${placeName}: ${M(`${da} + ${db}${carry ? " + " + carry : ""} = ${sum}`)}. write ${ones} in the ${placeName}${newCarry ? " and carry 1 to the next column" : ""}.`),
        highlights: [
          `aCol${columnFromRight}`,
          `bCol${columnFromRight}`,
          `resultCol${columnFromRight}`,
        ],
        carry: newCarry,
        revealDigits: revealedCount, // how many digits from the right are revealed
        pre: makeVerticalSnapshot({
          operator: "+",
          top: a,
          bottom: Math.abs(b),
          answerFull: answer,
          revealDigits: revealedCount,
          carryRow: carryRowStr,
        }),
      });

      carry = newCarry;
      stepIndex++;
    }

    if (carry) {
      revealedCount++; // if there is carry, there is an extra digit
      steps.push({
        id: "final-carry",
        title: "Extra carry",
        ...learningStepFields(mix`At the end of the addition we have one extra 1 — write it on the left as a new digit in the hundreds/thousands column.`),
        highlights: ["resultAll"],
        revealDigits: revealedCount,
        pre: makeVerticalSnapshot({
          operator: "+",
          top: a,
          bottom: Math.abs(b),
          answerFull: answer,
          revealDigits: revealedCount,
          carryRow: carryRowArr.join(""),
        }),
      });
    }

    // Last step: the final result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the number formed is ${answer}. This is the final answer to the exercise.`),
      highlights: ["resultAll"],
      revealDigits: answerLen, // reveal all the digits
      pre: makeVerticalSnapshot({
        operator: "+",
        top: a,
        bottom: Math.abs(b),
        answerFull: answer,
        revealDigits: answerStr.replace(/\D/g, "").length,
        carryRow: carryRowArr.join(""),
      }),
    });
  } else if (op === "subtraction") {
    const answerStr = String(answer);
    const answerLen = answerStr.length;
    
    // Step 1: Line up the digits
    steps.push({
      id: "place-value",
      title: "Line up the digits",
      ...learningStepFields(mix`Write the numbers one above the other so the ones, tens, etc. line up in the same column.`),
      highlights: ["aAll", "bAll"],
      revealDigits: 0, // nothing revealed yet
      pre: makeVerticalSnapshot({
        operator: "−",
        top: a,
        bottom: Math.abs(b),
        answerFull: answer,
        revealDigits: 0,
      }),
    });

    // digit-by-digit calculation
    let borrow = 0;
    let stepIndex = 2;
    let revealedCount = 0; // how many digits are already revealed

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

      const highlightKey = i === maxLen - 1 ? "Units" : i === maxLen - 2 ? "Tens" : "Hundreds";
      const columnFromRight = maxLen - 1 - i;

      if (da < db) {
        steps.push({
          id: `borrow-${stepIndex}`,
          title: `borrow from the ${placeName}`,
          ...learningStepFields(mix`in the ${placeName} ${da} less than ${db}, so we take "a borrow" from the next column (add 10 to this digit and subtract 1 from the next column).`),
          highlights: [`aCol${columnFromRight}`, `bCol${columnFromRight}`],
          revealDigits: revealedCount, // do not reveal a new digit during the borrow step
          pre: makeVerticalSnapshot({
            operator: "−",
            top: a,
            bottom: Math.abs(b),
            answerFull: answer,
            revealDigits: revealedCount,
          }),
        });
        da += 10;
        borrow = 1;
        stepIndex++;
      } else {
        borrow = 0;
      }

      const diff = da - db;
      revealedCount++; // reveal one more digit
      steps.push({
        id: `step-${stepIndex}`,
        title: `the ${placeName}`,
        ...learningStepFields(mix`now compute in the ${placeName}: ${M(`${da} - ${db} = ${diff}`)} and write ${diff} in this column.`),
        highlights: [
          `aCol${columnFromRight}`,
          `bCol${columnFromRight}`,
          `resultCol${columnFromRight}`,
        ],
        revealDigits: revealedCount, // how many digits from the right are revealed
        pre: makeVerticalSnapshot({
          operator: "−",
          top: a,
          bottom: Math.abs(b),
          answerFull: answer,
          revealDigits: revealedCount,
        }),
      });

      stepIndex++;
    }

    // Last step: the final result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the number we got at the end is ${answer}. This is the subtraction result.`),
      highlights: ["resultAll"],
      revealDigits: answerLen, // reveal all the digits
      pre: makeVerticalSnapshot({
        operator: "−",
        top: a,
        bottom: Math.abs(b),
        answerFull: answer,
        revealDigits: answerStr.replace(/\D/g, "").length,
      }),
    });
  }

  return steps;
}

// Function that builds animation steps for multiplication (with a vertical exercise)
export function buildMultiplicationAnimation(a, b, answer) {
  const steps = [];

  const toInt = (x) => (typeof x === "number" ? x : Number(x));
  const A = Math.abs(toInt(a));
  const B = Math.abs(toInt(b));
  const ansNum = typeof answer === "number" ? answer : Number(answer);
  const answerStr = String(answer);

  // helpers
  const digitsRev = (n) => String(n).split("").reverse().map((d) => Number(d));
  const padLeft = (s, w) => String(s).padStart(w, " ");
  const repeat = (ch, n) => Array(Math.max(0, n)).fill(ch).join("");

  const makeSnapshot = ({ partialRows = [], inProgressRow = null, sumRow = null }) => {
    const aStr = String(A);
    const bStr = String(B);
    // width: result width or max of rows
    const baseWidth = Math.max(
      aStr.length,
      bStr.length + 2,
      String(ansNum || answerStr).length,
      ...partialRows.map((r) => String(r).length),
      inProgressRow ? String(inProgressRow).length : 0
    );
    const w = Math.max(baseWidth, 6);

    const lines = [];
    lines.push(padLeft(aStr, w));
    lines.push("× " + padLeft(bStr, w - 2));
    lines.push(repeat("-", w));
    if (partialRows.length === 0) {
      // show blank area
    } else {
      partialRows.forEach((row) => lines.push(padLeft(row, w)));
    }
    if (inProgressRow) {
      lines.push(padLeft(inProgressRow, w));
    }
    if (sumRow != null) {
      lines.push(repeat("-", w));
      lines.push(padLeft(sumRow, w));
    }
    return lines.join("\n");
  };

  const formatInProgressRow = (digitsSoFarRev, totalDigitsNoCarry, shiftZeros) => {
    const known = digitsSoFarRev.slice().reverse().join("");
    const blanks = repeat(" ", Math.max(0, totalDigitsNoCarry - digitsSoFarRev.length));
    return `${blanks}${known}${repeat("0", shiftZeros)}`;
  };

  // Step 1: arrange in columns
  steps.push({
    id: "place-value",
    title: "Line up the digits",
    ...learningStepFields(mix`Write both numbers one under the other so the ones digits line up in the same column.`),
    highlights: ["aAll", "bAll"],
    revealDigits: 0,
    pre: makeSnapshot({ partialRows: [] }),
  });

  // if this is single-digit×single-digit: still detailed but short
  if (A < 10 && B < 10) {
    steps.push({
      id: "single-digit",
      title: "Single-digit multiplication",
      ...learningStepFields(mix`multiply: ${M(`${A} × ${B} = ${ansNum}`)}.`),
      highlights: ["aAll", "bAll", "resultAll"],
      revealDigits: answerStr.length,
      pre: makeSnapshot({ partialRows: [], sumRow: String(ansNum) }),
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${ansNum}.`),
      highlights: ["resultAll"],
      revealDigits: answerStr.length,
      pre: makeSnapshot({ partialRows: [], sumRow: String(ansNum) }),
    });
    return steps;
  }

  steps.push({
    id: "explain",
    title: "What do we do in long multiplication?",
    ...learningStepFields(mix`First multiply the top number by each digit of the bottom number (right to left). Each row is 'partial product'. then add all the partial products.`),
    highlights: ["aAll", "bAll"],
    revealDigits: 0,
    pre: makeSnapshot({ partialRows: [] }),
  });

  const aDigits = digitsRev(A); // ones first
  const bDigits = digitsRev(B);

  const partials = []; // numbers as strings already shifted
  const rawPartials = []; // numeric partials without shift (for explanation)

  let globalStep = 1;

  for (let j = 0; j < bDigits.length; j++) {
    const bd = bDigits[j];
    let carry = 0;
    const rowDigits = [];

  steps.push({
      id: `row-${j}-start`,
      title: flattenTemplateRuns(
      unwrapLearningRuns(
        mix`row ${M(String(j + 1))}: multiply by ${M(String(bd))}${j === 0 ? " (ones)" : j === 1 ? " (tens)" : " (higher place)"}`
      )
    ),
      ...learningStepFields(mix`multiply ${A} by the digit ${bd} of ${B}. start from the right (ones).`),
      highlights: ["aAll", "bAll"],
      revealDigits: 0,
      pre: makeSnapshot({ partialRows: partials.map((p) => p) }),
    });

    for (let i = 0; i < aDigits.length; i++) {
      const ad = aDigits[i];
      const prod = ad * bd + carry;
      const digit = prod % 10;
      const nextCarry = Math.floor(prod / 10);
      const place =
        i === 0 ? "ones digit" : i === 1 ? "tens digit" : i === 2 ? "hundreds digit" : `digit in place ${i + 1} from the right`;

      rowDigits.push(digit);

      const carryText = carry ? ` + carry ${carry}` : "";
      const inProgressRow = formatInProgressRow(rowDigits, aDigits.length + 1, j);
      steps.push({
        id: `row-${j}-mul-${i}`,
        title: `multiplication ${place}`,
        ...learningStepFields(mix`multiply ${ad} × ${bd}${carryText} = ${prod}. write ${digit} in this place${nextCarry ? ` and carry ${nextCarry} to the next step.` : " (no carry)."
          }`),
        highlights: ["aAll", "bAll"],
        revealDigits: 0,
        pre: makeSnapshot({ partialRows: partials.map((p) => p), inProgressRow }),
      });

      carry = nextCarry;
      globalStep++;
    }

    if (carry) {
      rowDigits.push(carry);
      const inProgressRow = formatInProgressRow(rowDigits, aDigits.length + 1, j);
      steps.push({
        id: `row-${j}-carry-end`,
        title: "Final carry",
        ...learningStepFields(mix`at the end of the row a carry remains ${carry}. write it to the left of the row.`),
        highlights: ["aAll", "bAll"],
        revealDigits: 0,
        pre: makeSnapshot({ partialRows: partials.map((p) => p), inProgressRow }),
      });
    }

    const rowValue = Number(rowDigits.slice().reverse().join("") || "0");
    rawPartials.push(rowValue);

    const shifted = String(rowValue) + repeat("0", j);
    partials.push(shifted);

    steps.push({
      id: `row-${j}-done`,
      title: `partial product ${j + 1}`,
      ...(j === 0 ? learningStepFields(mix`we got a partial product: \${rowValue}.`) : learningStepFields(mix`we got \${rowValue}. because we multiplied by a higher-place digit (×\${repeat("10", j).replace(/10/g, "10") || 10}), add \${j} zeros at the end ⇒ \${shifted}.`)),
      highlights: ["aAll", "bAll"],
      revealDigits: 0,
      pre: makeSnapshot({ partialRows: partials.map((p) => p) }),
    });
  }

  // adding partial products
  steps.push({
    id: "sum-start",
    title: "Add the partial products",
    ...learningStepFields(mix`Now add all the rows we got to reach the final result.`),
    highlights: ["resultAll"],
    revealDigits: 0,
    pre: makeSnapshot({ partialRows: partials.map((p) => p) }),
  });

  // Column addition breakdown (like long addition), based on aligned numbers
  const maxW = Math.max(...partials.map((p) => p.length), String(ansNum || answerStr).length);
  const padded = partials.map((p) => p.padStart(maxW, "0").split("").reverse().map((d) => Number(d)));
  const resDigits = [];
  let carryAdd = 0;
  for (let col = 0; col < maxW; col++) {
    const colSum = padded.reduce((s, row) => s + (row[col] || 0), 0) + carryAdd;
    const digit = colSum % 10;
    const nextCarry = Math.floor(colSum / 10);
    resDigits[col] = digit;

    const place =
      col === 0 ? "ones" : col === 1 ? "tens" : col === 2 ? "hundreds" : `place ${col + 1} from the right`;
    steps.push({
      id: `sum-col-${col}`,
      title: `add in the ${place}`,
      ...learningStepFields(mix`add in the ${place}: the digit sum in the column${carryAdd ? ` + carry ${carryAdd}` : ""} = ${colSum}. write ${digit}${nextCarry ? ` and carry ${nextCarry}.` : "."}`),
      highlights: ["resultAll"],
      revealDigits: 0,
      pre: makeSnapshot({ partialRows: partials.map((p) => p), sumRow: padLeft(String(resDigits.slice().reverse().join("")).replace(/^0+/, "") || "0", maxW) }),
    });

    carryAdd = nextCarry;
  }
  if (carryAdd) {
    resDigits.push(carryAdd);
    steps.push({
      id: "sum-carry-end",
      title: "Final carry in addition",
      ...learningStepFields(mix`a carry remains ${carryAdd} at the end, write it on the left.`),
      highlights: ["resultAll"],
      revealDigits: 0,
      pre: makeSnapshot({ partialRows: partials.map((p) => p), sumRow: String(resDigits.slice().reverse().join("")).replace(/^0+/, "") || "0" }),
    });
  }

  const sumStr = String(resDigits.slice().reverse().join("")).replace(/^0+/, "") || "0";

  steps.push({
    id: "final",
    title: "Final result",
    ...learningStepFields(mix`After adding all the partial products we got: ${M(`${A} × ${B} = ${sumStr}.`)}`),
    highlights: ["resultAll"],
    revealDigits: answerStr.length,
    pre: makeSnapshot({ partialRows: partials.map((p) => p), sumRow: sumStr }),
  });

  // quick check (if there is an expected answer)
  if (!Number.isNaN(ansNum) && sumStr !== String(ansNum)) {
    steps.push({
      id: "note",
      title: "Check",
      ...learningStepFields(mix`Note: the steps produced ${sumStr} but the stored answer for the question is ${ansNum}. If that happens, the question probably uses special parameters (for example signed numbers or a conversion).`),
      highlights: ["resultAll"],
      revealDigits: answerStr.length,
      pre: makeSnapshot({ partialRows: partials.map((p) => p), sumRow: sumStr }),
    });
  }
  
  return steps;
}

// Function that builds animation steps for long division (with a vertical exercise)
export function buildDivisionAnimation(dividend, divisor, quotient) {
  const steps = [];
  const dividendStr = String(dividend);
  const divisorStr = String(divisor);
  const quotientStr = String(quotient);
  const dividendLen = dividendStr.length;
  const repeat = (ch, n) => Array(Math.max(0, n)).fill(ch).join("");

  // building ASCII of long division (LTR) when the dividend is on the left as you had it:
  //    31
  //   ____
  // 94│3
  //  9
  // --
  // 04
  //  3
  // --
  //  1
  // Note: there is a vertical line (│) only on the base row "dividend│divisor" — without extra lines in the other rows.
  // So the quotient and the line sit exactly above the dividend (even when centered), all rows must be the same width:
  // width = length of the dividend + "│" + length of the divisor
  const totalWidth = dividendLen + 1 + divisorStr.length;
  const padToWidth = (s, width = totalWidth) => String(s).padEnd(width, " ");

  const makeWorkLineAt = (position, text) => {
    const t = String(text);
    const line = Array(dividendLen).fill(" ");
    const end = Math.min(position, dividendLen - 1);
    const start = Math.max(0, end - t.length + 1);
    for (let i = 0; i < t.length; i++) {
      const idx = start + i;
      if (idx >= 0 && idx < dividendLen) line[idx] = t[i];
    }
    return padToWidth(line.join(""));
  };

  const quotientLineArr = Array(dividendLen).fill(" ");
  const workLines = [];
  const makePre = (opts = {}) => {
    const remainderSuffix = opts.remainderSuffix || "";
    // if we add "(remainder)" next to the quotient, we widen the layout so all rows stay aligned
    const width = totalWidth + (remainderSuffix ? remainderSuffix.length : 0);
    // quotient above the dividend (only above the dividend area) + remainder in parentheses next to the last digit of the quotient
    const line1 = padToWidth(quotientLineArr.join("") + remainderSuffix, width);
    // the quotient line — same length as the dividend, padded to full width so it does not "shift" when centered
    const line2 = padToWidth(repeat("_", dividendLen), width);
    const line3 = padToWidth(dividendStr + "│" + divisorStr, width);
    const paddedWork = workLines.map((l) => padToWidth(l, width));
    // wrap in LTR markers so it does not get scrambled inside Hebrew text
    return pureMathLtrBlock([line1, line2, line3, ...paddedWork]);
  };
  
  // long-division calculation step by step
  const divisionSteps = [];
  let workingNumber = 0;
  let quotientPos = 0;
  let startPos = 0; // start position of workingNumber
  
  for (let i = 0; i < dividendStr.length; i++) {
    // if workingNumber is 0, this is the start of a new number
    if (workingNumber === 0) {
      startPos = i;
    }
    
    workingNumber = workingNumber * 10 + parseInt(dividendStr[i]);
    
    if (workingNumber >= divisor) {
      const qDigit = Math.floor(workingNumber / divisor);
      const product = qDigit * divisor;
      const remainder = workingNumber - product;
      const wNumLen = String(workingNumber).length;
      
      divisionSteps.push({
        position: i, // position of the last (rightmost) digit
        startPosition: startPos, // position of the first (leftmost) digit
        workingNumber,
        quotientDigit: qDigit,
        product,
        remainder,
        quotientPosition: quotientPos,
        workingNumberLength: wNumLen,
      });
      
      quotientPos++;
      workingNumber = remainder;
      // If there is a remainder, the next position starts from the current position + 1
      startPos = remainder > 0 ? i : i + 1;
    }
  }
  
  // Step 1: Show the question
  steps.push({
    id: "place-value",
    title: "Show the question",
    ...learningStepFields(mix`divide ${dividend} by ${divisor}. Write the dividend and the divisor in long-division form.`),
    highlights: ["aAll", "bAll"],
    revealDigits: 0,
    type: "division",
    dividend,
    divisor,
    quotient,
    pre: makePre(),
  });
  
  // create detailed steps for each stage of the division
  for (let stepIndex = 0; stepIndex < divisionSteps.length; stepIndex++) {
    const step = divisionSteps[stepIndex];
    const { position, workingNumber: wNum, quotientDigit: qDigit, product, remainder, quotientPosition } = step;
    
    // Step: write in the quotient
    quotientLineArr[position] = String(qDigit);
    steps.push({
      id: `step-${stepIndex + 1}-write`,
      title: `step ${stepIndex + 1}: write in the quotient`,
      ...learningStepFields(mix`${divisor} goes into${wNum} exactly ${qDigit} times. Write ${qDigit} in the quotient above the digit ${dividendStr[position]}.`),
      highlights: [`result${quotientPosition}`, `a${position}`],
      revealDigits: quotientPosition + 1,
      type: "division",
      dividend,
      divisor,
      quotient,
      stepIndex,
      quotientDigit: qDigit,
      workingNumber: wNum,
      pre: makePre(),
    });
    
    // Step: multiply and subtract
    // Add working rows: product, line, remainder (aligned under the relevant part of the dividend)
    workLines.push(makeWorkLineAt(position, product));
    workLines.push(makeWorkLineAt(position, repeat("-", String(product).length)));
    workLines.push(makeWorkLineAt(position, remainder));
    steps.push({
      id: `step-${stepIndex + 1}-subtract`,
      title: `step ${stepIndex + 1}: multiply and subtract`,
      ...learningStepFields(mix`multiply: ${qDigit} × ${divisor} = ${product}. subtract: ${wNum} - ${product} = ${remainder}. ${remainder === 0 ? 'No remainder.' : `the remainder is ${remainder}.`}`),
      highlights: [`a${position}`, "bAll", `result${quotientPosition}`, `product${stepIndex}`, `remainder${stepIndex}`],
      revealDigits: quotientPosition + 1,
      type: "division",
      dividend,
      divisor,
      quotient,
      stepIndex,
      product,
      remainder,
      workingNumber: wNum,
      pre: makePre(),
    });
    
    // If this is not the last step, bring down the next digit
    if (stepIndex < divisionSteps.length - 1 && position < dividendStr.length - 1) {
      const nextStep = divisionSteps[stepIndex + 1];
      const nextDigitPos = nextStep.position;
      // working row: the new number to divide (the remainder + the digit we brought down) — show a leading 0 when needed (for example 04)
      const bringDownStr = `${remainder}${dividendStr[nextDigitPos]}`;
      workLines.push(makeWorkLineAt(nextDigitPos, bringDownStr));
      steps.push({
        id: `step-${stepIndex + 1}-bring-down`,
        title: `step ${stepIndex + 1}: Bring down a digit`,
        ...learningStepFields(mix`bring down the next digit (${dividendStr[nextDigitPos]}). the new number to divide is ${bringDownStr}.`),
        highlights: [`a${nextDigitPos}`],
        revealDigits: quotientPosition + 1,
        type: "division",
        dividend,
        divisor,
        quotient,
        stepIndex,
        nextDigit: parseInt(dividendStr[nextDigitPos]),
        newNum: nextStep.workingNumber,
        pre: makePre(),
      });
    }
  }
  
  // Last step: the final result
  const finalRemainder = divisionSteps.length > 0 ? divisionSteps[divisionSteps.length - 1].remainder : 0;
  const remainderSuffix = finalRemainder > 0 ? `(${finalRemainder})` : "";
  steps.push({
    id: "final",
    title: "Final result",
    ...(finalRemainder > 0
        ? learningStepFields(mix`Done! The answer is ${M(`${quotient}${remainderSuffix}`)}.`)
        : learningStepFields(mix`Done! The quotient is ${quotient} with no remainder.`)),
    highlights: ["resultAll"],
    revealDigits: quotientStr.length,
    type: "division",
    dividend,
    divisor,
    quotient,
    remainder: finalRemainder,
    // Add the remainder next to the quotient (next to the last digit), as in the picture
    pre: makePre({ remainderSuffix }),
  });
  
  return steps;
}

// Function that builds animation steps for fractions
export function buildFractionsAnimation(params, answer) {
  const steps = [];
  const gcd = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const t = x % y;
      x = y;
      y = t;
    }
    return x || 1;
  };
  const simplifyFraction = (n, d) => {
    const g = gcd(n, d);
    return { n: n / g, d: d / g, g };
  };
  const toMixed = (n, d) => {
    const whole = Math.floor(n / d);
    const rem = n % d;
    return { whole, rem };
  };
  if (params.kind === "frac_same_den") {
    const { n1, n2, den, op } = params;
    const isAdd = op === "add";
    const rawNum = isAdd ? n1 + n2 : n1 - n2;
    const simplified = simplifyFraction(rawNum, den);
    const canSimplify = simplified.g > 1;
    const improper = simplified.n >= simplified.d;
    const mixed = improper ? toMixed(simplified.n, simplified.d) : null;
    
    // Step 1: Show the fractions
    steps.push({
      id: "show-fractions",
      title: "Show the fractions",
      ...learningStepFields(mix`We have two fractions with the same denominator: ${M(`${n1}/${den} ${isAdd ? "+" : "-"} ${n2}/${den}`)}`),
      highlights: ["fraction1", "fraction2"],
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${n1}/${den} ${isAdd ? "+" : "−"} ${n2}/${den}`,
      ]),
    });
    
    // Step 2: explain the common denominator
    steps.push({
      id: "same-denominator",
      title: "Common denominator",
      ...learningStepFields(mix`we have the same denominator (${den}). Leave the denominator alone — work only with the numerators.`),
      highlights: ["denominator"],
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${n1}/${den} ${isAdd ? "+" : "−"} ${n2}/${den}`,
        `= (${n1} ${isAdd ? "+" : "−"} ${n2}) / ${den}`,
      ]),
    });
    
    // Step 3: add/subtract the numerators
    const resNum = rawNum;
    steps.push({
      id: "calculate-numerators",
      title: "Compute the numerators",
      ...learningStepFields(mix`${isAdd ? "add" : "subtract"} the numerators: ${M(`${n1} ${isAdd ? "+" : "-"} ${n2} = ${resNum}`)}`),
      highlights: ["numerators"],
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${n1}/${den} ${isAdd ? "+" : "−"} ${n2}/${den}`,
        `= (${n1} ${isAdd ? "+" : "−"} ${n2}) / ${den}`,
        `= ${resNum}/${den}`,
      ]),
    });

    // Step 4: simplify (if possible)
    if (canSimplify) {
      steps.push({
        id: "simplify",
        title: "Simplify the fraction",
        ...learningStepFields(mix`we can simplify because both ${resNum} and ${den} are divisible by ${simplified.g}. divide the numerator and denominator by ${simplified.g}.`),
        highlights: ["simplify"],
        type: "fractions",
        params,
        answer,
        pre: pureMathLtrBlock([
          `${resNum}/${den}`,
          `= (${resNum} ÷ ${simplified.g}) / (${den} ÷ ${simplified.g})`,
          `= ${simplified.n}/${simplified.d}`,
        ]),
      });
    }

    // Step 5: mixed number (if this is a fraction greater than 1)
    if (mixed && mixed.rem !== 0) {
      steps.push({
        id: "mixed",
        title: "Convert to a mixed number",
        ...learningStepFields(mix`If the numerator is larger than the denominator, you can write a mixed number: ${M(`${simplified.n} ÷ ${simplified.d} = ${mixed.whole} `)}remainder ${mixed.rem}.`),
        highlights: ["mixed"],
        type: "fractions",
        params,
        answer,
        pre: pureMathLtrBlock([
          `${simplified.n}/${simplified.d}`,
          `= ${mixed.whole} ${mixed.rem}/${simplified.d}`,
        ]),
      });
    }
    
    // last step: the result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the denominator stays ${den} (and if we simplified/converted — use the simplified form). The answer is ${answer}`),
      highlights: ["result"],
      type: "fractions",
      params,
      answer,
    });
  } else if (params.kind === "frac_diff_den" || params.kind === "frac_add_sub") {
    const { n1, den1, n2, den2, commonDen, op } = params;
    const isAdd = op === "add";
    const m1 = commonDen / den1;
    const m2 = commonDen / den2;
    const nn1 = n1 * m1;
    const nn2 = n2 * m2;
    const rawNum = isAdd ? nn1 + nn2 : nn1 - nn2;
    const simplified = simplifyFraction(rawNum, commonDen);
    const canSimplify = simplified.g > 1;
    const improper = simplified.n >= simplified.d;
    const mixed = improper ? toMixed(simplified.n, simplified.d) : null;
    
    // Step 1: Show the fractions
    steps.push({
      id: "show-fractions",
      title: "Show the fractions",
      ...learningStepFields(mix`We have two fractions with different denominators: ${M(`${n1}/${den1} ${isAdd ? "+" : "-"} ${n2}/${den2}`)}`),
      highlights: ["fraction1", "fraction2"],
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${n1}/${den1} ${isAdd ? "+" : "−"} ${n2}/${den2}`,
      ]),
    });
    
    // Step 2: Find a common denominator
    steps.push({
      id: "find-common",
      title: "Find a common denominator",
      ...learningStepFields(mix`find a common denominator — here ${commonDen}`),
      highlights: ["commonDen"],
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        flattenTemplateRuns(
        unwrapLearningRuns(
          mix`a common denominator for ${M(String(den1))} and ${M(String(den2))} is ${M(String(commonDen))}`
        )
      ),
      ]),
    });
    
    // Step 3: Rewrite with a common denominator
    steps.push({
      id: "convert",
      title: "Rewrite with a common denominator",
      ...learningStepFields(mix`to reach the denominator ${commonDen} multiply numerator and denominator by the same number:`),
      highlights: ["convert1", "convert2"],
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${n1}/${den1} = (${n1}×${m1})/(${den1}×${m1}) = ${nn1}/${commonDen}`,
        `${n2}/${den2} = (${n2}×${m2})/(${den2}×${m2}) = ${nn2}/${commonDen}`,
      ]),
    });
    
    // Step 4: add/subtract
    const resNum = rawNum;
    steps.push({
      id: "calculate",
      title: "Calculation",
      ...learningStepFields(mix`Now that the denominators match — work only with the numerators: ${M(`${nn1} ${isAdd ? "+" : "-"} ${nn2} = ${resNum}`)}`),
      highlights: ["calculation"],
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${nn1}/${commonDen} ${isAdd ? "+" : "−"} ${nn2}/${commonDen}`,
        `= (${nn1} ${isAdd ? "+" : "−"} ${nn2}) / ${commonDen}`,
        `= ${resNum}/${commonDen}`,
      ]),
    });

    // Step 5: simplify (if possible)
    if (canSimplify) {
      steps.push({
        id: "simplify",
        title: "Simplify the fraction",
        ...learningStepFields(mix`we can simplify because both ${resNum} and ${commonDen} are divisible by ${simplified.g}.`),
        highlights: ["simplify"],
        type: "fractions",
        params,
        answer,
        pre: pureMathLtrBlock([
          `${resNum}/${commonDen}`,
          `= (${resNum} ÷ ${simplified.g}) / (${commonDen} ÷ ${simplified.g})`,
          `= ${simplified.n}/${simplified.d}`,
        ]),
      });
    }

    // Step 6: mixed number (if needed)
    if (mixed && mixed.rem !== 0) {
      steps.push({
        id: "mixed",
        title: "Convert to a mixed number",
        ...learningStepFields(mix`If the result is a fraction greater than 1, you can write it as a mixed number.`),
        highlights: ["mixed"],
        type: "fractions",
        params,
        answer,
        pre: pureMathLtrBlock([
          `${simplified.n}/${simplified.d}`,
          `= ${mixed.whole} ${mixed.rem}/${simplified.d}`,
        ]),
      });
    }
    
    // last step: the result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}`),
      highlights: ["result"],
      type: "fractions",
      params,
      answer,
    });
  } else if (params.kind === "frac_to_mixed") {
    const { improperNum, den, whole, num } = params;
    steps.push({
      id: "show",
      title: "Show the question",
      ...learningStepFields(mix`convert the fraction ${improperNum}/${den} to a mixed number.`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([`${improperNum}/${den}`]),
    });
    steps.push({
      id: "divide",
      title: "Divide to find the whole",
      ...learningStepFields(mix`divide: ${M(`${improperNum} ÷ ${den} = ${whole} `)}remainder ${num}.`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${improperNum} ÷ ${den} = ${whole} remainder ${num}`,
        `${improperNum}/${den} = ${whole} ${num}/${den}`,
      ]),
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}.`),
      type: "fractions",
      params,
      answer,
    });
  } else if (params.kind === "mixed_to_frac") {
    const { whole, num, den, improperNum } = params;
    steps.push({
      id: "show",
      title: "Show the question",
      ...learningStepFields(mix`convert the mixed number ${whole} ${num}/${den} to a fraction.`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([`${whole} ${num}/${den}`]),
    });
    steps.push({
      id: "rule",
      title: "Conversion rule",
      ...learningStepFields(mix`Multiply the whole number by the denominator and add the numerator: (${whole}×${den}) + ${num}.`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${whole} ${num}/${den}`,
        `= (${whole}×${den} + ${num}) / ${den}`,
      ]),
    });
    steps.push({
      id: "calc",
      title: "compute",
      ...learningStepFields(mix`${whole}×${den} = ${M(`${whole * den}, `)}then ${whole * den} + ${num} = ${M(`${improperNum}.`)}`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `(${whole}×${den} + ${num}) / ${den}`,
        `= (${whole * den} + ${num}) / ${den}`,
        `= ${improperNum}/${den}`,
      ]),
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}.`),
      type: "fractions",
      params,
      answer,
    });
  } else if (params.kind === "frac_expand") {
    const { num, den, factor, expandedNum, expandedDen } = params;
    steps.push({
      id: "show",
      title: "Show the question",
      ...learningStepFields(mix`expand ${num}/${den} by ${factor} (that is, multiply numerator and denominator by the same number).`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([`${num}/${den}`]),
    });
    steps.push({
      id: "multiply",
      title: "Multiply numerator and denominator",
      ...learningStepFields(mix`numerator: ${M(`${num}×${factor} = ${expandedNum}. `)}denominator: ${M(`${den}×${factor} = ${expandedDen}.`)}`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${num}/${den} = (${num}×${factor})/(${den}×${factor})`,
        `= ${expandedNum}/${expandedDen}`,
      ]),
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the equivalent fraction is ${answer}.`),
      type: "fractions",
      params,
      answer,
    });
  } else if (params.kind === "frac_reduce") {
    const { num, den, reducedNum, reducedDen } = params;
    const simp = simplifyFraction(num, den);
    steps.push({
      id: "show",
      title: "Show the question",
      ...learningStepFields(mix`simplify the fraction ${num}/${den}.`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([`${num}/${den}`]),
    });
    steps.push({
      id: "gcd",
      title: "Greatest common divisor",
      ...learningStepFields(mix`find a number that divides both ${num} and also ${den}. here the divisor is ${simp.g}.`),
      type: "fractions",
      params,
      answer,
    });
    steps.push({
      id: "divide",
      title: "Divide numerator and denominator",
      ...learningStepFields(mix`numerator: ${M(`${num}÷${simp.g} = ${reducedNum}. `)}denominator: ${M(`${den}÷${simp.g} = ${reducedDen}.`)}`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${num}/${den}`,
        `= (${num}÷${simp.g})/(${den}÷${simp.g})`,
        `= ${reducedNum}/${reducedDen}`,
      ]),
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the simplified fraction is ${answer}.`),
      type: "fractions",
      params,
      answer,
    });
  } else if (params.kind === "frac_as_division") {
    const { dividend, divisor, num, den } = params;
    steps.push({
      id: "show",
      title: "Fraction as a quotient",
      ...learningStepFields(mix`division can be written as a fraction: ${M(`${dividend} ÷ ${divisor} = ${dividend}/${divisor}`)}.`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([`${dividend} ÷ ${divisor}`, `${dividend}/${divisor}`]),
    });
    const simp = simplifyFraction(dividend, divisor);
    if (simp.g > 1) {
      steps.push({
        id: "simplify",
        title: "Simplify",
        ...learningStepFields(mix`simplify ${dividend}/${divisor} by ${simp.g}.`),
        type: "fractions",
        params,
        answer,
        pre: pureMathLtrBlock([
          `${dividend}/${divisor}`,
          `= (${dividend}÷${simp.g})/(${divisor}÷${simp.g})`,
          `= ${num}/${den}`,
        ]),
      });
    }
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`so the answer is ${answer}.`),
      type: "fractions",
      params,
      answer,
    });
  } else if (params.kind === "frac_multiply") {
    const { n1, den1, n2, den2, finalNum, finalDen } = params;
    const rawNum = n1 * n2;
    const rawDen = den1 * den2;
    const simp = simplifyFraction(rawNum, rawDen);
    steps.push({
      id: "show",
      title: "Show the question",
      ...learningStepFields(mix`Multiplying fractions: multiply numerator by numerator and denominator by denominator.`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([`${n1}/${den1} × ${n2}/${den2}`]),
    });
    steps.push({
      id: "mul",
      title: "Multiply numerators and denominators",
      ...learningStepFields(mix`numerator: ${M(`${n1}×${n2} = ${rawNum}. `)}denominator: ${M(`${den1}×${den2} = ${rawDen}.`)}`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${n1}/${den1} × ${n2}/${den2}`,
        `= (${n1}×${n2}) / (${den1}×${den2})`,
        `= ${rawNum}/${rawDen}`,
      ]),
    });
    if (simp.g > 1) {
      steps.push({
        id: "simplify",
        title: "Simplify",
        ...learningStepFields(mix`simplify by ${simp.g}: ${M(`${rawNum}/${rawDen} = ${finalNum}/${finalDen}.`)}`),
        type: "fractions",
        params,
        answer,
        pre: pureMathLtrBlock([
          `${rawNum}/${rawDen}`,
          `= (${rawNum}÷${simp.g})/(${rawDen}÷${simp.g})`,
          `= ${finalNum}/${finalDen}`,
        ]),
      });
    }
    steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the answer is ${answer}.`), type: "fractions", params, answer });
  } else if (params.kind === "frac_divide") {
    const { n1, den1, n2, den2, finalNum, finalDen } = params;
    const rawNum = n1 * den2;
    const rawDen = den1 * n2;
    const simp = simplifyFraction(rawNum, rawDen);
    steps.push({
      id: "show",
      title: "Show the question",
      ...learningStepFields(mix`Dividing fractions: flip the divisor and multiply.`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([`${n1}/${den1} ÷ ${n2}/${den2}`]),
    });
    steps.push({
      id: "flip",
      title: "Flip and multiply",
      ...learningStepFields(mix`${M(`${n1}/${den1} ÷ ${n2}/${den2} = ${n1}/${den1} × ${den2}/${n2}`)}`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${n1}/${den1} ÷ ${n2}/${den2}`,
        `= ${n1}/${den1} × ${den2}/${n2}`,
      ]),
    });
    steps.push({
      id: "mul",
      title: "Multiply numerators and denominators",
      ...learningStepFields(mix`numerator: ${M(`${n1}×${den2} = ${rawNum}. `)}denominator: ${M(`${den1}×${n2} = ${rawDen}.`)}`),
      type: "fractions",
      params,
      answer,
      pre: pureMathLtrBlock([
        `${n1}/${den1} × ${den2}/${n2}`,
        `= (${n1}×${den2}) / (${den1}×${n2})`,
        `= ${rawNum}/${rawDen}`,
      ]),
    });
    if (simp.g > 1) {
      steps.push({
        id: "simplify",
        title: "Simplify",
        ...learningStepFields(mix`simplify by ${simp.g}: ${M(`${rawNum}/${rawDen} = ${finalNum}/${finalDen}.`)}`),
        type: "fractions",
        params,
        answer,
        pre: pureMathLtrBlock([
          `${rawNum}/${rawDen}`,
          `= (${rawNum}÷${simp.g})/(${rawDen}÷${simp.g})`,
          `= ${finalNum}/${finalDen}`,
        ]),
      });
    }
    steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the answer is ${answer}.`), type: "fractions", params, answer });
  } else if (params.kind === "frac_half") {
    const { whole } = params;
    steps.push({ id: "show", title: "Show the question", ...learningStepFields(mix`What is half of ${whole}?`), type: "fractions", params, answer, pre: pureMathLtrBlock([`1/2 of ${whole}`]) });
    steps.push({ id: "rule", title: "half = divide by 2", ...learningStepFields(mix`half of a number is the number ÷ 2.`), type: "fractions", params, answer });
    const res = whole / 2;
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`${M(`${whole} ÷ 2 = ${res}`)}`), type: "fractions", params, answer });
    steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the answer is ${answer}.`), type: "fractions", params, answer });
  } else if (params.kind === "frac_half_reverse") {
    const { half, whole } = params;
    steps.push({ id: "show", title: "Show the question", ...learningStepFields(mix`half of __ is ${half}. What is the whole number?`), type: "fractions", params, answer });
    steps.push({ id: "rule", title: "Undo a half", ...learningStepFields(mix`if half of the number is ${half}, then the whole number is 2 times that.`), type: "fractions", params, answer });
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`${M(`${half} × 2 = ${whole}`)}`), type: "fractions", params, answer });
    steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the answer is ${answer}.`), type: "fractions", params, answer });
  } else if (params.kind === "frac_quarter") {
    const { whole } = params;
    steps.push({ id: "show", title: "Show the question", ...learningStepFields(mix`What is a quarter of ${whole}?`), type: "fractions", params, answer, pre: pureMathLtrBlock([`1/4 of ${whole}`]) });
    steps.push({ id: "rule", title: "a quarter = divide by 4", ...learningStepFields(mix`a quarter of a number is the number ÷ 4.`), type: "fractions", params, answer });
    const res = whole / 4;
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`${M(`${whole} ÷ 4 = ${res}`)}`), type: "fractions", params, answer });
    steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the answer is ${answer}.`), type: "fractions", params, answer });
  } else if (params.kind === "frac_quarter_reverse") {
    const { quarter, whole } = params;
    steps.push({ id: "show", title: "Show the question", ...learningStepFields(mix`a quarter of __ is ${quarter}. What is the whole number?`), type: "fractions", params, answer });
    steps.push({ id: "rule", title: "Undo a quarter", ...learningStepFields(mix`if a quarter of the number is ${quarter}, then the whole number is 4 times that.`), type: "fractions", params, answer });
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`${M(`${quarter} × 4 = ${whole}`)}`), type: "fractions", params, answer });
    steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the answer is ${answer}.`), type: "fractions", params, answer });
  }
  
  return steps;
}

// Function that builds animation steps for decimals (with a vertical exercise)
export function buildDecimalsAnimation(params, answer) {
  const steps = [];
  const { a, b, kind } = params;
  const places = params.places ?? 2;
  const opSymbol = kind === "dec_add" ? "+" : "−";

  const aStr = Number(a).toFixed(places);
  const bStr = Number(b).toFixed(places);
  const answerStr = Number(answer).toFixed(places);

  const stripDot = (s) => s.replace(".", "");
  const intA = parseInt(stripDot(aStr), 10);
  const intB = parseInt(stripDot(bStr), 10);
  const intAnswer = parseInt(stripDot(answerStr), 10);

  const aIntStr = String(intA);
  const bIntStr = String(intB);
  const ansIntStr = String(intAnswer);
  const maxLen = Math.max(aIntStr.length, bIntStr.length, ansIntStr.length);
  const pa = aIntStr.padStart(maxLen, "0");
  const pb = bIntStr.padStart(maxLen, "0");

  const answerDigitsCount = answerStr.replace(/\D/g, "").length;

  
  const padLeft = (s, w) => String(s).padStart(w, " ");
  const maskAnswerRight = (full, revealDigits) => {
    const s = String(full);
    const out = s.split("");
    let seen = 0;
    for (let i = out.length - 1; i >= 0; i--) {
      if (/\d/.test(out[i])) {
        if (seen < revealDigits) {
          seen++;
        } else {
          out[i] = " ";
        }
      }
    }
    return out.join("");
  };

  const makePre = (revealDigits) => {
    const base = buildVerticalOperation(aStr, bStr, opSymbol);
    const baseRaw = String(base).replace(/\u2066|\u2069/g, "");
    const baseLines = baseRaw.split("\n");
    const width = Math.max(
      ...baseLines.map((l) => l.length),
      answerStr.length + 2
    );
    const maskedAns = maskAnswerRight(padLeft(answerStr, width), revealDigits);
    const out = [...baseLines.map((l) => padLeft(l, width)), maskedAns].join("\n");
    return pureMathLtrDisplay(out);
  };

  const placeName = (idxFromRight) => {
    // idxFromRight=0 is the smallest place (for example hundredths when there are 2 digits after the decimal point)
    if (idxFromRight < places) {
      if (places === 1) return "tenths";
      if (places === 2) return idxFromRight === 0 ? "hundredths" : "tenths";
      // general
      return `place ${idxFromRight + 1} after the decimal point`;
    }
    const k = idxFromRight - places; // 0=ones, 1=tens...
    if (k === 0) return "ones";
    if (k === 1) return "tens";
    if (k === 2) return "hundreds";
    return `place ${k + 1} left of the decimal point`;
  };

  // Step 1: line up decimal points
  steps.push({
    id: "place-value",
    title: "Line up the decimal points",
    ...learningStepFields(mix`Write the numbers one above the other so the decimal points line up in the same column.`),
    highlights: ["aAll", "bAll"],
    revealDigits: 0,
    pre: makePre(0),
  });
  
  // Step 2: explain what to do with the decimal point
  const mul = Math.pow(10, places);
  steps.push({
    id: "dot-note",
    title: "What do we do with the decimal point?",
    ...learningStepFields(mix`To make column math easier, imagine shifting the decimal point ${places} places to the right (multiply by ${mul}). Compute with whole numbers, then put the decimal point back ${places} places to the left.`),
    highlights: ["aAll", "bAll"],
    revealDigits: 0,
    pre: makePre(0),
  });

  // Step 3+: digit-by-digit calculation (like addition/subtraction)
  let revealedCount = 0;
  let stepIndex = 3;

  if (kind === "dec_add") {
    let carry = 0;
    for (let i = maxLen - 1; i >= 0; i--) {
      const da = Number(pa[i]);
      const db = Number(pb[i]);
      const sum = da + db + carry;
      const digit = sum % 10;
      const newCarry = sum >= 10 ? 1 : 0;

      const idxFromRight = maxLen - 1 - i;
      const place = placeName(idxFromRight);

      revealedCount++;
  steps.push({
        id: `step-${stepIndex}`,
        title: `the column ${place}`,
        ...learningStepFields(mix`add in the ${place}: ${M(`${da} + ${db}${carry ? " + " + carry : ""} = ${sum}`)}. write ${digit}${newCarry ? " and carry 1 to the next column." : "."}`),
    highlights: ["aAll", "bAll", "resultAll"],
        revealDigits: revealedCount,
        pre: makePre(revealedCount),
      });

      carry = newCarry;
      stepIndex++;
    }

    if (carry) {
      revealedCount++;
      steps.push({
        id: "final-carry",
        title: "Final carry",
        ...learningStepFields(mix`A carry of 1 remains at the end — write it on the left.`),
        highlights: ["resultAll"],
        revealDigits: revealedCount,
        pre: makePre(revealedCount),
      });
    }
  } else {
    // dec_sub
    let borrow = 0;
    for (let i = maxLen - 1; i >= 0; i--) {
      let da = Number(pa[i]);
      const db = Number(pb[i]);
      da -= borrow;

      const idxFromRight = maxLen - 1 - i;
      const place = placeName(idxFromRight);

      if (da < db) {
        steps.push({
          id: `borrow-${stepIndex}`,
          title: `borrow in the ${place}`,
          ...learningStepFields(mix`in the ${place} ${da} less than ${db}, so add 10 to this column and take 1 from the next column (borrow).`),
          highlights: ["aAll", "bAll"],
          revealDigits: revealedCount,
          pre: makePre(revealedCount),
        });
        da += 10;
        borrow = 1;
        stepIndex++;
      } else {
        borrow = 0;
      }

      const diff = da - db;
      revealedCount++;
      steps.push({
        id: `step-${stepIndex}`,
        title: `the column ${place}`,
        ...learningStepFields(mix`subtract in the ${place}: ${M(`${da} − ${db} = ${diff}. `)}write ${diff}.`),
        highlights: ["aAll", "bAll", "resultAll"],
        revealDigits: revealedCount,
        pre: makePre(revealedCount),
      });
      stepIndex++;
    }
  }

  steps.push({
    id: "final",
    title: "Put the decimal point back",
    ...learningStepFields(mix`Remember: put the decimal point back in the same column. The final result is ${answerStr}.`),
    highlights: ["resultAll"],
    revealDigits: answerDigitsCount,
    pre: makePre(answerDigitsCount),
  });
  
  return steps;
}

// Function that builds animation steps for percentages
export function buildPercentagesAnimation(params, answer) {
  const steps = [];
  const { base, p, kind } = params;
  const gcd = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const t = x % y;
      x = y;
      y = t;
    }
    return x || 1;
  };

  const buildPartOfSteps = (baseVal, perc, resultVal, idPrefix) => {
    const local = [];
    const g = gcd(perc, 100);
    const num = perc / g;
    const den = 100 / g;
    local.push({
      id: `${idPrefix}-show`,
      title: "What is asked?",
      ...learningStepFields(mix`compute ${perc}% of ${baseVal}.`),
      type: "percentages",
      params,
      answer,
      pre: pureMathLtrBlock([`${perc}% of ${baseVal}`]),
    });
    local.push({
      id: `${idPrefix}-fraction`,
      title: "Percent as a fraction",
      ...learningStepFields(mix`${perc}% = ${perc}/100. you can simplify: ${M(`${perc}/100 = ${num}/${den}`)}.`),
      type: "percentages",
      params,
      answer,
      pre: pureMathLtrBlock([`${perc}% = ${perc}/100 = ${num}/${den}`]),
    });
    local.push({
      id: `${idPrefix}-formula`,
      title: "Write the exercise",
      ...learningStepFields(mix`part = number × the fraction ⇒ ${M(`${baseVal} × ${num}/${den}`)}.`),
      type: "percentages",
      params,
      answer,
      pre: pureMathLtrBlock([`${baseVal} × ${num}/${den}`]),
    });

    // Prefer dividing first to keep whole numbers (as you asked)
    const divisibleFirst = baseVal % den === 0;
    if (divisibleFirst) {
      const reducedBase = baseVal / den;
      local.push({
        id: `${idPrefix}-divide-first`,
        title: "Divide first (easier)",
        ...learningStepFields(mix`first divide ${baseVal} by ${den}: ${M(`${baseVal} ÷ ${den} = ${reducedBase}`)}.`),
      type: "percentages",
      params,
      answer,
        pre: pureMathLtrBlock([`${baseVal} × ${num}/${den}`, `= (${baseVal} ÷ ${den}) × ${num}`, `= ${reducedBase} × ${num}`]),
      });
      local.push({
        id: `${idPrefix}-multiply`,
        title: "Multiply",
        ...learningStepFields(mix`${M(`${reducedBase} × ${num} = ${resultVal}`)}.`),
        type: "percentages",
        params,
        answer,
      });
    } else {
      local.push({
        id: `${idPrefix}-multiply-first`,
        title: "Multiply, then divide",
        ...learningStepFields(mix`compute: ${M(`${baseVal} × ${num} ÷ ${den} = ${resultVal}`)}.`),
        type: "percentages",
        params,
        answer,
      });
    }

    local.push({
      id: `${idPrefix}-final`,
      title: "Result",
      ...learningStepFields(mix`so ${perc}% of ${baseVal} is ${resultVal}.`),
      type: "percentages",
      params,
      answer,
    });
    return local;
  };

  if (kind === "perc_part_of") {
    const result = Number(answer);
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...learningStepFields(mix`how much is ${p}% of ${base}?`),
      type: "percentages",
      params,
      answer,
    });
    steps.push(...buildPartOfSteps(base, p, result, "part"));
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}.`),
      type: "percentages",
      params,
      answer,
    });
  } else if (kind === "perc_discount") {
    const { discount, finalPrice } = params;
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...learningStepFields(mix`a product costs ${base} and there is a discount of ${p}%. What is the price after the discount?`),
      type: "percentages",
      params,
      answer,
    });
    steps.push({
      id: "idea",
      title: "What do we do?",
      ...learningStepFields(mix`Step 1: compute the discount amount. Step 2: subtract it from the price.`),
      type: "percentages",
      params,
      answer,
    });
    steps.push(...buildPartOfSteps(base, p, discount, "disc"));
    steps.push({
      id: "subtract",
      title: "Price after discount",
      ...learningStepFields(mix`subtract the discount: ${M(`${base} − ${discount} = ${finalPrice}`)}.`),
      type: "percentages",
      params,
      answer,
    });
    // vertical calculation like subtraction
    steps.push(
      ...buildAdditionOrSubtractionAnimation(base, discount, finalPrice, "subtraction").map((s) => ({
        ...s,
        id: `sub-${s.id}`,
        type: "percentages",
        params,
        answer,
      }))
    );
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the price after the discount is ${answer}.`),
      type: "percentages",
      params,
      answer,
    });
  }
  
  return steps;
}

// Function that builds animation steps for sequences
export function buildSequencesAnimation(params, answer) {
  const steps = [];
  const { seq, step, posOfBlank } = params;
  // Step 1: Show the sequence
  const display = seq.map((v, idx) => (idx === posOfBlank ? "__" : v)).join(", ");
  steps.push({
    id: "show-sequence",
    title: "Show the sequence",
    ...learningStepFields(mix`the sequence is: ${M(`${display}`)}`),
    highlights: ["sequence"],
    type: "sequences",
    params,
    answer,
  });
  
  // Step 2: find the difference (check a few pairs to confirm it is constant)
  const firstDiff = seq[1] - seq[0];
  steps.push({
    id: "find-difference",
    title: "Find the difference",
    ...learningStepFields(mix`Look at the difference between two neighboring numbers: ${M(`${seq[1]} - ${seq[0]} = ${firstDiff}`)}`),
    highlights: ["difference"],
    type: "sequences",
    params,
    answer,
  });
  if (seq.length >= 3) {
    const secondDiff = seq[2] - seq[1];
    steps.push({
      id: "confirm",
      title: "Confirm it is constant",
      ...learningStepFields(mix`check again: ${M(`${seq[2]} - ${seq[1]} = ${secondDiff}`)}. it is the same difference ⇒ the step is constant.`),
      highlights: ["difference"],
      type: "sequences",
      params,
      answer,
    });
  }
  
  // Step 3: explain the constant step
  steps.push({
    id: "explain-step",
    title: "The constant step",
    ...learningStepFields(mix`This is the constant step of the sequence: ${M(`${step > 0 ? "add" : "subtract"} ${Math.abs(step)} `)}each step`),
    highlights: ["step"],
    type: "sequences",
    params,
    answer,
  });
  
  // Step 4: Find the missing number
  const beforeBlank = posOfBlank > 0 ? seq[posOfBlank - 1] : null;
  const afterBlank = posOfBlank < seq.length - 1 ? seq[posOfBlank + 1] : null;
  
  if (beforeBlank !== null) {
    const opKind = step >= 0 ? "addition" : "subtraction";
    const amt = Math.abs(step);
    const res = beforeBlank + step;
    steps.push({
      id: "calculate",
      title: "Find the missing number",
      ...learningStepFields(mix`the number after ${beforeBlank} is obtained by ${step >= 0 ? "adding" : "subtracting"} ${amt}: ${M(`${beforeBlank} ${step >= 0 ? "+" : "−"} ${amt} = ${res}`)}`),
      highlights: ["calculation"],
      type: "sequences",
      params,
      answer,
    });
    // vertical steps like in addition/subtraction
    steps.push(
      ...buildAdditionOrSubtractionAnimation(beforeBlank, amt, res, opKind).map((s) => ({
        ...s,
        id: `math-${s.id}`,
        type: "sequences",
        params,
        answer,
      }))
    );
  } else if (afterBlank !== null) {
    const opKind = step >= 0 ? "subtraction" : "addition";
    const amt = Math.abs(step);
    const res = afterBlank - step;
    steps.push({
      id: "calculate",
      title: "Find the missing number",
      ...learningStepFields(mix`the number before ${afterBlank} is obtained by ${step >= 0 ? "subtracting" : "adding"} ${amt}: ${M(`${afterBlank} ${step >= 0 ? "−" : "+"} ${amt} = ${res}`)}`),
      highlights: ["calculation"],
      type: "sequences",
      params,
      answer,
    });
    steps.push(
      ...buildAdditionOrSubtractionAnimation(afterBlank, amt, res, opKind).map((s) => ({
        ...s,
        id: `math-${s.id}`,
        type: "sequences",
        params,
        answer,
      }))
    );
  }
  
  // Step 5: The result
  steps.push({
    id: "final",
    title: "Final result",
    ...learningStepFields(mix`the missing number is ${answer}`),
    highlights: ["result"],
    type: "sequences",
    params,
    answer,
  });
  
  return steps;
}

// Function that builds animation steps for equations
export function buildEquationsAnimation(params, answer) {
  const steps = [];
  const { kind, form, a, b, c, exerciseText } = params;
  const pushMathSteps = (mathSteps, prefixId) => {
    if (!Array.isArray(mathSteps)) return;
    mathSteps.forEach((s, idx) => {
      steps.push({
        ...s,
        id: `${prefixId}-${s.id || idx}`,
        type: "equations",
        params,
        answer,
      });
    });
  };
  
  // Step 1: Show the equation
  steps.push({
    id: "show-equation",
    title: "Show the equation",
    ...learningStepFields(mix`the equation is: ${M(`${exerciseText}`)}`),
    type: "equations",
    params,
    answer,
  });
  
  // Grade 1 - simple equations
  if (kind === "eq_add_simple") {
    steps.push({
      id: "idea",
      title: "How do we solve it?",
      ...learningStepFields(mix`if ${M(`${a} + __ = ${c}`)} then the missing number is ${M(`${c} − ${a}`)}.`),
      type: "equations",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(c, a, Number(answer), "subtraction"), "math");
  } else if (kind === "eq_sub_simple") {
    steps.push({
      id: "idea",
      title: "How do we solve it?",
      ...learningStepFields(mix`if ${M(`${a} − __ = ${c}`)} then the missing number is ${M(`${a} − ${c}`)}.`),
      type: "equations",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(a, c, Number(answer), "subtraction"), "math");
  } else if (kind === "eq_add") {
    steps.push({
      id: "inverse",
      title: "Inverse operation",
      ...learningStepFields(mix`In addition, the inverse operation is subtraction.`),
      type: "equations",
      params,
      answer,
    });
    const missing = Number(answer);
    const subA = form === "a_plus_x" ? c : c;
    const subB = form === "a_plus_x" ? a : b;
    steps.push({
      id: "calc",
      title: "Find the missing number",
      ...learningStepFields(mix`compute: ${M(`${subA} − ${subB} = ${missing}`)}.`),
      type: "equations",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(subA, subB, missing, "subtraction"), "math");
  } else if (kind === "eq_sub") {
    steps.push({
      id: "inverse",
      title: "Inverse operation",
      ...learningStepFields(mix`In subtraction — sometimes we use subtraction and sometimes addition, depending on where the blank is.`),
      type: "equations",
      params,
      answer,
    });
    const missing = Number(answer);
    if (form === "a_minus_x") {
    steps.push({
        id: "calc",
        title: "Find the missing number",
        ...learningStepFields(mix`if ${M(`${a} − __ = ${c}`)} then ${M(`${a} − ${c} = ${missing}`)}.`),
      type: "equations",
      params,
      answer,
    });
      pushMathSteps(buildAdditionOrSubtractionAnimation(a, c, missing, "subtraction"), "math");
    } else {
      steps.push({
        id: "calc",
        title: "Find the missing number",
        ...learningStepFields(mix`if ${M(`__ − ${b} = ${c}`)} then ${M(`${c} + ${b} = ${missing}`)}.`),
        type: "equations",
        params,
        answer,
      });
      pushMathSteps(buildAdditionOrSubtractionAnimation(c, b, missing, "addition"), "math");
    }
  } else if (kind === "eq_mul") {
    steps.push({
      id: "inverse",
      title: "Inverse operation",
      ...learningStepFields(mix`In multiplication, the inverse operation is division.`),
      type: "equations",
      params,
      answer,
    });
    const missing = Number(answer);
    const known = form === "a_times_x" ? a : b;
    steps.push({
      id: "calc",
      title: "Find the missing number",
      ...learningStepFields(mix`compute: ${M(`${c} ÷ ${known} = ${missing}`)}.`),
      type: "equations",
      params,
      answer,
    });
    pushMathSteps(buildDivisionAnimation(c, known, missing), "math");
  } else if (kind === "eq_div") {
    const { dividend, divisor, quotient } = params;
    steps.push({
      id: "inverse",
      title: "Idea",
      ...learningStepFields(mix`In division we use multiplication/division to find the missing number.`),
      type: "equations",
      params,
      answer,
    });
    const missing = Number(answer);
    if (form === "a_div_x") {
      // dividend ÷ __ = quotient  => __ = dividend ÷ quotient
    steps.push({
        id: "calc",
        title: "Find the missing divisor",
        ...learningStepFields(mix`if ${M(`${dividend} ÷ __ = ${quotient}`)} then ${M(`${dividend} ÷ ${quotient} = ${missing}`)}.`),
      type: "equations",
      params,
      answer,
    });
      pushMathSteps(buildDivisionAnimation(dividend, quotient, missing), "math");
    } else {
      // __ ÷ divisor = quotient => __ = quotient × divisor
      steps.push({
        id: "calc",
        title: "Find the missing dividend",
        ...learningStepFields(mix`if ${M(`__ ÷ ${divisor} = ${quotient}`)} then ${M(`${quotient} × ${divisor} = ${missing}`)}.`),
        type: "equations",
        params,
        answer,
      });
      pushMathSteps(buildMultiplicationAnimation(quotient, divisor, missing), "math");
    }
  }

  steps.push({
    id: "final",
    title: "Final result",
    ...learningStepFields(mix`the answer is ${answer}.`),
    type: "equations",
    params,
    answer,
  });
  
  return steps;
}

// Function that builds animation steps for comparison
export function buildCompareAnimation(params, _answerIgnored) {
  const steps = [];
  const { a: numA, b: numB } = coerceComparisonOperands(params?.a, params?.b);
  const sign = getCanonicalComparisonSign(numA, numB);
  if (!sign || numA == null || numB == null) {
    return steps;
  }

  const aLabel = String(numA);
  const bLabel = String(numB);
  const signInProse = embedComparisonSignInRtlProse(sign);

  steps.push({
    id: "show-question",
    title: "Show the question",
    ...learningStepFields(mix`fill in the sign: ${M(`${aLabel} `)}__ ${bLabel}`),
    highlights: ["question"],
    type: "compare",
    params,
    answer: sign,
  });
  
  // Step 2: explain the comparison
  steps.push({
    id: "explain",
    title: "How do we compare?",
    ...learningStepFields(mix`Look at the two numbers: ${M(`${aLabel} `)}and ${bLabel}.`),
    highlights: ["explanation"],
    type: "compare",
    params,
    answer: sign,
  });
  
  // Step 3: The calculation
  const mathExpr = formatCompareMathExpression(numA, numB, sign);
  let comparison = "";
  if (sign === "<") {
    comparison = `${mathExpr} because ${numA} less than ${numB}.`;
  } else if (sign === ">") {
    comparison = `${mathExpr} because ${numA} greater than ${numB}.`;
  } else {
    comparison = `${mathExpr} because the numbers are equal.`;
  }

  steps.push({
    id: "calculate",
    title: "The calculation",
    ...learningStepFields(mix`${comparison} so we choose the sign ${signInProse}.`),
    highlights: ["calculation"],
    type: "compare",
    params,
    answer: sign,
  });
  
  // Step 4: The result
  steps.push({
    id: "final",
    title: "Final result",
    ...learningStepFields(mix`the correct sign is ${signInProse}`),
    highlights: ["result"],
    type: "compare",
    params,
    answer: sign,
  });
  
  return steps;
}

// Function that builds animation steps for number sense
export function buildNumberSenseAnimation(params, answer) {
  const steps = [];
  const { kind } = params;
  if (kind === "ns_neighbors") {
    const { n, dir } = params;
    
    // Step 1: Show the question
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...(dir === "after"
        ? learningStepFields(mix`What number comes after ${n}?`)
        : learningStepFields(mix`What number comes before ${n}?`)),
      highlights: ["question"],
      type: "number_sense",
      params,
      answer,
    });
    
    // Step 2: explanation
    steps.push({
      id: "explain",
      title: "How do we find a neighbor?",
      ...learningStepFields(dir === "after" ? mix`one after — add 1: ${n} + 1 = ${answer}` : mix`one before — subtract 1: ${n} - 1 = ${answer}`),
      highlights: ["explanation"],
      type: "number_sense",
      params,
      answer,
    });
    
    // Step 3: The result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}`),
      highlights: ["result"],
      type: "number_sense",
      params,
      answer,
    });
  } else if (kind === "ns_place_tens_units" || kind === "ns_place_hundreds") {
    const { n, askTens, tens, units, hundreds } = params;
    
    // Step 1: Show the question
    let questionText = "";
    if (kind === "ns_place_tens_units") {
      questionText = askTens 
        ? `What is the tens digit in ${n}?`
        : `What is the ones digit in ${n}?`;
    } else {
      const partType = params.partType;
      const label = partType === "hundreds" ? "the hundreds" : partType === "tens" ? "the tens" : "the ones";
      questionText = `What is the digit ${label} in ${n}?`;
    }
    
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...learningStepFields(mix`${questionText}`),
      highlights: ["question"],
      type: "number_sense",
      params,
      answer,
    });
    
    // Step 2: Break apart the number
    if (kind === "ns_place_tens_units") {
      steps.push({
        id: "breakdown",
        title: "Break apart the number",
        ...learningStepFields(mix`${M(`${tens * 10} + ${units} = ${n}`)} (${tens} tens + ${units} ones)`),
        highlights: ["breakdown"],
        type: "number_sense",
        params,
        answer,
      });
    } else {
      steps.push({
        id: "breakdown",
        title: "Break apart the number",
        ...learningStepFields(mix`${M(`${hundreds * 100} + ${tens * 10} + ${units} = ${n}`)} (${hundreds} hundreds + ${tens} tens + ${units} ones)`),
        highlights: ["breakdown"],
        type: "number_sense",
        params,
        answer,
      });
    }
    
    // Step 3: The result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}`),
      highlights: ["result"],
      type: "number_sense",
      params,
      answer,
    });
  } else if (kind === "ns_complement10" || kind === "ns_complement100") {
    const { b, c } = params;
    const target = c;
    
    // Step 1: Show the question
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...learningStepFields(mix`__ + ${b} = ${M(`${target}`)}`),
      highlights: ["question"],
      type: "number_sense",
      params,
      answer,
    });
    
    // Step 2: explanation
    steps.push({
      id: "explain",
      title: "Complete / make a ten",
      ...learningStepFields(mix`find how much is missing from ${b} to reach${target}`),
      highlights: ["explanation"],
      type: "number_sense",
      params,
      answer,
    });
    
    // Step 3: The calculation
    steps.push({
      id: "calculate",
      title: "The calculation",
      ...learningStepFields(mix`compute: ${M(`${target} - ${b} = ${answer}`)}`),
      highlights: ["calculation"],
      type: "number_sense",
      params,
      answer,
    });
    
    // Step 4: The result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}`),
      highlights: ["result"],
      type: "number_sense",
      params,
      answer,
    });
  } else if (kind === "ns_even_odd") {
    const { n, isEven } = params;
    
    // Step 1: Show the question
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...learningStepFields(mix`Is the number ${n} is it even or odd?`),
      highlights: ["question"],
      type: "number_sense",
      params,
      answer,
    });
    
    // Step 2: explanation
    steps.push({
      id: "explain",
      title: "How do we check?",
      ...learningStepFields(mix`Look at the ones digit of ${n}. If the digit is 0,2,4,6,8 — the number is even. If 1,3,5,7,9 — it is odd.`),
      highlights: ["explanation"],
      type: "number_sense",
      params,
      answer,
    });
    
    // Step 3: The result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the number ${n} is ${answer}`),
      highlights: ["result"],
      type: "number_sense",
      params,
      answer,
    });
  } else if (kind === "ns_counting_forward") {
    const { start, next } = params;
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...learningStepFields(mix`What is the next number after ${start}?`),
      type: "number_sense",
      params,
      answer,
    });
    steps.push({
      id: "rule",
      title: "Rule",
      ...learningStepFields(mix`To find the next number — add 1.`),
      type: "number_sense",
      params,
      answer,
    });
    steps.push({
      id: "calc",
      title: "compute",
      ...learningStepFields(mix`${M(`${start} + 1 = ${next}`)}.`),
      type: "number_sense",
      params,
      answer,
      pre: pureMathLtrBlock([`${start} + 1 = ${next}`]),
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}.`),
      type: "number_sense",
      params,
      answer,
    });
  } else if (kind === "ns_counting_backward") {
    const { start, prev } = params;
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...learningStepFields(mix`What number comes before ${start}?`),
      type: "number_sense",
      params,
      answer,
    });
    steps.push({
      id: "rule",
      title: "Rule",
      ...learningStepFields(mix`To find the previous number — subtract 1.`),
      type: "number_sense",
      params,
      answer,
    });
    steps.push({
      id: "calc",
      title: "compute",
      ...learningStepFields(mix`${M(`${start} − 1 = ${prev}`)}.`),
      type: "number_sense",
      params,
      answer,
      pre: pureMathLtrBlock([`${start} − 1 = ${prev}`]),
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}.`),
      type: "number_sense",
      params,
      answer,
    });
  } else if (kind === "ns_number_line") {
    const { start, end, missing, numbers } = params;
    const arr = Array.isArray(numbers) ? numbers : [];
    const display = arr.map((v) => (v === missing ? "__" : String(v))).join("  ");
    const step = arr.length >= 2 ? arr[1] - arr[0] : 1;
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...learningStepFields(mix`What is the missing number on the number line?`),
      type: "number_sense",
      params,
      answer,
      pre: pureMathLtrBlock([display]),
    });
    steps.push({
      id: "range",
      title: "Range and constant jump",
      ...learningStepFields(mix`the line from ${start} up to ${end}. the difference between neighboring points is ${step}.`),
      type: "number_sense",
      params,
      answer,
    });
    // find the value before the missing place if possible
    const idx = arr.findIndex((v) => v === missing);
    const prevVal = idx > 0 ? arr[idx - 1] : null;
    if (prevVal != null) {
      steps.push({
        id: "calc",
        title: "Find the missing number",
        ...learningStepFields(mix`add one jump: ${M(`${prevVal} + ${step} = ${missing}`)}.`),
        type: "number_sense",
        params,
        answer,
        pre: pureMathLtrBlock([`${prevVal} + ${step} = ${missing}`]),
      });
    }
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}.`),
      type: "number_sense",
      params,
      answer,
    });
  }
  
  return steps;
}

// Function that builds animation steps for factors/multiples
export function buildFactorsMultiplesAnimation(params, answer) {
  const steps = [];
  const { kind } = params;
  
  if (kind === "fm_factor") {
    const { n, correct } = params;
    
    // Step 1: Show the question
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...learningStepFields(mix`Which of the following numbers is a divisor (factor) of ${n}?`),
      highlights: ["question"],
      type: "factors_multiples",
      params,
      answer,
    });
    
    // Step 2: explanation
    steps.push({
      id: "explain",
      title: "What is a factor?",
      ...learningStepFields(mix`A factor is a number that divides another number with no remainder. Check which numbers divide ${n} with no remainder.`),
      highlights: ["explanation"],
      type: "factors_multiples",
      params,
      answer,
    });
    
    // Step 3: Check
    steps.push({
      id: "check",
      title: "Check",
      ...learningStepFields(mix`divide ${n} by ${correct}: ${M(`${n} ÷ ${correct} = ${n / correct}. `)}that is a whole number, so ${correct} is a factor of ${n}`),
      highlights: ["check"],
      type: "factors_multiples",
      params,
      answer,
    });
    
    // Step 4: The result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}`),
      highlights: ["result"],
      type: "factors_multiples",
      params,
      answer,
    });
  } else if (kind === "fm_multiple") {
    const { base, correct } = params;
    
    // Step 1: Show the question
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...learningStepFields(mix`Which of the following numbers is a multiple of ${base}?`),
      highlights: ["question"],
      type: "factors_multiples",
      params,
      answer,
    });
    
    // Step 2: explanation
    steps.push({
      id: "explain",
      title: "What is a multiple?",
      ...learningStepFields(mix`A multiple is what you get when multiplying the number by a whole number. Multiples of ${base} are: ${M(`${base} × 1, ${base} × 2, ${base} × 3, ...`)}`),
      highlights: ["explanation"],
      type: "factors_multiples",
      params,
      answer,
    });
    
    // Step 3: Check
    steps.push({
      id: "check",
      title: "Check",
      ...learningStepFields(mix`check: ${M(`${correct} ÷ ${base} = ${correct / base}. `)}that is a whole number, so ${correct} is a multiple of ${base}`),
      highlights: ["check"],
      type: "factors_multiples",
      params,
      answer,
    });
    
    // Step 4: The result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}`),
      highlights: ["result"],
      type: "factors_multiples",
      params,
      answer,
    });
  } else if (kind === "fm_gcd") {
    const { a, b, gcd } = params;
    
    // Step 1: Show the question
    steps.push({
      id: "show-question",
      title: "Show the question",
      ...learningStepFields(mix`What is the greatest common factor of ${a} and ${b}?`),
      highlights: ["question"],
      type: "factors_multiples",
      params,
      answer,
    });
    
    // Step 2: explanation
    steps.push({
      id: "explain",
      title: "What is GCF?",
      ...learningStepFields(mix`The greatest common factor (GCF) is the largest number that divides both numbers with no remainder.`),
      highlights: ["explanation"],
      type: "factors_multiples",
      params,
      answer,
    });
    
    // Step 3: Calculation
    steps.push({
      id: "calculate",
      title: "Calculation",
      ...learningStepFields(mix`factor ${a} and ${b} into factors and see which is largest — here ${gcd}`),
      highlights: ["calculation"],
      type: "factors_multiples",
      params,
      answer,
    });
    
    // Step 4: The result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}`),
      highlights: ["result"],
      type: "factors_multiples",
      params,
      answer,
    });
  }
  
  return steps;
}

// Function that builds animation steps for word problems
export function buildWordProblemsAnimation(params, answer) {
  const steps = [];
  const { kind } = params;

  const pushMathSteps = (mathSteps, prefixId) => {
    if (!Array.isArray(mathSteps)) return;
    mathSteps.forEach((s, idx) => {
      steps.push({
        ...s,
        id: `${prefixId}-${s.id || idx}`,
        // so the general model knows this is still "a word problem"
        type: s.type || "word_problems",
        params,
        answer,
      });
    });
  };
  
  if (kind === "wp_simple_add") {
    const { a, b } = params;
    const sum = a + b;
    
    // Step 1: Read the story
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`Leo has ${a} balls and gets ${b} balls. How many balls does Leo have in total?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    
    // Step 2: Identify the operation
    steps.push({
      id: "identify-operation",
      title: "Identify the operation",
      ...learningStepFields(mix`Recognize the question asks for a total — that is addition.`),
      highlights: ["operation"],
      type: "word_problems",
      params,
      answer,
    });
    
    // Step 3: Write the exercise
    steps.push({
      id: "write-equation",
      title: "Write the exercise",
      ...learningStepFields(mix`Write the exercise: ${M(`${a} + ${b}`)}`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    
    // the calculation steps in detail (like addition)
    pushMathSteps(buildAdditionOrSubtractionAnimation(a, b, sum, "addition"), "math");
    
    // Step 5: The result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`Answer: Leo has ${answer} balls.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_simple_sub") {
    const { total, give } = params;
    const left = total - give;
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`Leo has ${total} stickers. He gives a friend ${give} stickers. How many stickers does Leo have left?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "identify-operation",
      title: "Identify the operation",
      ...learningStepFields(mix`give away / take away → subtraction.`),
      highlights: ["operation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "write-equation",
      title: "Write the exercise",
      ...learningStepFields(mix`Write the exercise: ${M(`${total} − ${give}`)}`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(total, give, left, "subtraction"), "math");
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`Leo has left ${answer} stickers.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_pocket_money") {
    const { money, toy } = params;
    const left = money - toy;
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`Leo has ${money} in pocket money. He buys a game for${toy}. How much money does he have left?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "identify-operation",
      title: "Identify the operation",
      ...learningStepFields(mix`buying spends money → subtraction.`),
      highlights: ["operation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "write-equation",
      title: "Write the exercise",
      ...learningStepFields(mix`Write the exercise: ${M(`${money} − ${toy}`)}`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(money, toy, left, "subtraction"), "math");
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`Leo will have left ${answer}.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_time_days") {
    const { days } = params;
    steps.push({
      id: "read-story",
      title: "Read the question",
      ...learningStepFields(mix`A question about days of the week: how many days until a certain day?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "method",
      title: "How do we solve it?",
      ...learningStepFields(mix`Count day by day forward on the calendar. Each move to the next day is +1.`),
      highlights: ["explanation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "count",
      title: "Count the days",
      ...learningStepFields(mix`we counted ${days} days until the requested day.`),
      highlights: ["calculation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer} days.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_time_date") {
    const { today, daysLater } = params;
    const res = today + daysLater;
    steps.push({
      id: "read-story",
      title: "Read the question",
      ...learningStepFields(mix`if today is the${today} of the month, what date will it be in ${daysLater} days?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "equation",
      title: "Write the exercise",
      ...learningStepFields(mix`future date = today's date + number of days ⇒ ${M(`${today} + ${daysLater}`)}.`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(today, daysLater, res, "addition"), "math");
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the date will be the${answer} of the month.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_groups") {
    const { per, groups } = params;
    const prod = per * groups;
    
    // Step 1: Read the story
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`each box has ${per} pencils. There are ${groups} such boxes. How many pencils are there in total?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    
    // Step 2: Identify the operation
    steps.push({
      id: "identify-operation",
      title: "Identify the operation",
      ...learningStepFields(mix`each box has ${per} pencils and there are ${groups} boxes — this is repeated addition, that is multiplication.`),
      highlights: ["operation"],
      type: "word_problems",
      params,
      answer,
    });
    
    // Step 3: Write the exercise
    steps.push({
      id: "write-equation",
      title: "Write the exercise",
      ...learningStepFields(mix`Write a multiplication: ${M(`${per} × ${groups}`)}`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    
    // the calculation steps in detail (like multiplication)
    pushMathSteps(buildMultiplicationAnimation(per, groups, prod), "math");
    
    // Step 5: The result
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`Answer: ${M(`${answer} `)}pencils.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_division_simple") {
    const { total, perGroup, groups } = params;
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`there is ${total} apples. Split them into groups of ${perGroup} apples in each group. How many groups are there?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "identify-operation",
      title: "Identify the operation",
      ...learningStepFields(mix`split into equal groups → division.`),
      highlights: ["operation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "write-equation",
      title: "Write the exercise",
      ...learningStepFields(mix`write the exercise: ${M(`${total} ÷ ${perGroup}`)}`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    // the calculation steps in detail (like long division)
    pushMathSteps(buildDivisionAnimation(total, perGroup, groups), "math");
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`there is ${answer} groups.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_leftover") {
    const { total, groupSize, groups, leftover } = params;
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`there is ${total} students split into groups of ${groupSize} students in each group. How many students will be left without a full group?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "identify-operation",
      title: "Identify the operation",
      ...learningStepFields(mix`This is division with a remainder: the remainder is what is left without a full group.`),
      highlights: ["operation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "write-equation",
      title: "Write the exercise",
      ...learningStepFields(mix`write the exercise: ${M(`${total} ÷ ${groupSize}`)} and find the remainder.`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildDivisionAnimation(total, groupSize, groups), "math");
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the remainder is ${leftover}, so ${answer} students will be left without a full group.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_coins") {
    const { coins1, coins2, value1, value2 } = params;
    const sum = value1 + value2;
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`Leo has ${coins1} shekel coins and ${coins2} $2 coins. How much money does he have in total?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "find-values",
      title: "Compute each part",
      ...learningStepFields(mix`coin values: ${M(`${coins1}×1=${value1}`)} and ${M(`${coins2}×2=${value2}`)}.`),
      highlights: ["calculation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(value1, value2, sum, "addition"), "math");
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`in total Leo has ${answer}.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_coins_spent") {
    const { total, spent } = params;
    const left = total - spent;
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`Leo has ${total}. he buys a candy for ${spent}. How much money does he have left?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "identify-operation",
      title: "Identify the operation",
      ...learningStepFields(mix`If you buy something — subtract from the amount, that is subtraction.`),
      highlights: ["operation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(total, spent, left, "subtraction"), "math");
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`Leo has left ${answer}.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_shop_discount") {
    const { price, discPerc, discount, finalPrice } = params;
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`a shirt costs ${price} and it has a discount of ${discPerc}%. How much will you pay after the discount?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "find-discount",
      title: "Compute the discount amount",
      ...learningStepFields(mix`compute ${discPerc}% of ${price}: ${M(`${price} × ${discPerc} ÷ 100 = ${discount}`)}.`),
      highlights: ["calculation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "write-equation",
      title: "Compute the price after discount",
      ...learningStepFields(mix`subtract the discount from the price: ${M(`${price} − ${discount} = ${finalPrice}`)}.`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(price, discount, finalPrice, "subtraction"), "math");
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`after the discount you pay ${answer}.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_distance_time") {
    const { speed, hours, distance } = params;
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`A child walks at a steady speed of ${speed} km per hour for ${hours} hours. How many kilometers will he travel?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "equation",
      title: "Write the exercise",
      ...learningStepFields(mix`distance = speed × time ⇒ ${M(`${speed} × ${hours}`)}.`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildMultiplicationAnimation(speed, hours, distance), "math");
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`he will travel ${answer} km.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_time_sum") {
    const { l1, l2 } = params;
    const sum = l1 + l2;
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`the first video lasts ${l1} minutes and another clip lasts ${l2} minutes. How many minutes of watching altogether?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "equation",
      title: "Write the exercise",
      ...learningStepFields(mix`together means addition: ${M(`${l1} + ${l2}`)}.`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(l1, l2, sum, "addition"), "math");
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`together that is ${answer} minutes.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_unit_cm_to_m") {
    const { cm, meters } = params;
    steps.push({
      id: "read-story",
      title: "Read the question",
      ...learningStepFields(mix`how many meters is ${cm} centimeters?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "rule",
      title: "Conversion rule",
      ...learningStepFields(mix`1 meter = 100 cm. to convert from cm to meters, divide by 100.`),
      highlights: ["explanation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "calc",
      title: "compute",
      ...learningStepFields(mix`${M(`${cm} ÷ 100 = ${meters}`)}`),
      highlights: ["calculation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer} meters.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_unit_g_to_kg") {
    const { g, kg } = params;
    steps.push({
      id: "read-story",
      title: "Read the question",
      ...learningStepFields(mix`how many kilograms is ${g} grams?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "rule",
      title: "Conversion rule",
      ...learningStepFields(mix`1 kg = 1000 grams. To convert grams to kg divide by 1000.`),
      highlights: ["explanation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "calc",
      title: "compute",
      ...learningStepFields(mix`${M(`${g} ÷ 1000 = ${kg}`)}`),
      highlights: ["calculation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer} kilograms.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_average") {
    const { s1, s2, s3 } = params;
    const sum = s1 + s2 + s3;
    const exact = sum / 3;
    const rounded = Number(answer);
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`Leo's scores are ${s1}, ${s2} and ${s3}. What is the average (rounded to a whole number)?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "step1",
      title: "Step 1: add the scores",
      ...learningStepFields(mix`compute the sum: ${M(`${s1} + ${s2} + ${s3} = ${sum}`)}.`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "step2",
      title: "Step 2: divide by the number of scores",
      ...learningStepFields(mix`average = sum ÷ 3 ⇒ ${M(`${sum} ÷ 3 = ${exact}`)}.`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "step3",
      title: "Step 3: Round",
      ...learningStepFields(mix`round to a whole number: ${M(`${exact} ≈ ${rounded}`)}.`),
      highlights: ["calculation"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the rounded average is ${answer}.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else if (kind === "wp_multi_step") {
    const { a, b, price, totalQty, totalCost, money } = params;
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`Leo has ${money}. he buys ${a} pens and${b} pencils, and each item costs ${price}. How much money will he have left after shopping?`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    steps.push({
      id: "step1",
      title: "Step 1: How many items are bought?",
      ...learningStepFields(mix`add the amounts: ${M(`${a} + ${b} = ${totalQty}`)} items.`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(a, b, totalQty, "addition"), "math1");
    steps.push({
      id: "step2",
      title: "Step 2: What is the total cost?",
      ...learningStepFields(mix`times the price per item: ${M(`${totalQty} × ${price} = ${totalCost}`)}.`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildMultiplicationAnimation(totalQty, price, totalCost), "math2");
    steps.push({
      id: "step3",
      title: "Step 3: How much money is left?",
      ...learningStepFields(mix`subtract from the money you have: ${M(`${money} − ${totalCost} = ${answer}`)}.`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    pushMathSteps(buildAdditionOrSubtractionAnimation(money, totalCost, Number(answer), "subtraction"), "math3");
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`Leo will have left ${answer}.`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  } else {
    // general word problems (fallback)
    steps.push({
      id: "read-story",
      title: "Read the story",
      ...learningStepFields(mix`Read the story carefully and identify the numbers and the required operation.`),
      highlights: ["story"],
      type: "word_problems",
      params,
      answer,
    });
    
    steps.push({
      id: "identify-operation",
      title: "Identify the operation",
      ...learningStepFields(mix`Identify what is asked — how many altogether? how many are left? how many in each group?`),
      highlights: ["operation"],
      type: "word_problems",
      params,
      answer,
    });
    
    steps.push({
      id: "write-equation",
      title: "Write the exercise",
      ...learningStepFields(mix`Write a math exercise that matches the story.`),
      highlights: ["equation"],
      type: "word_problems",
      params,
      answer,
    });
    
    steps.push({
      id: "calculate",
      title: "The calculation",
      ...learningStepFields(mix`Solve the exercise.`),
      highlights: ["calculation"],
      type: "word_problems",
      params,
      answer,
    });
    
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`the answer is ${answer}`),
      highlights: ["result"],
      type: "word_problems",
      params,
      answer,
    });
  }
  
  return steps;
}

// ===== More topics: detailed animations (like addition/multiplication) =====

export function buildRoundingAnimation(params, answer) {
  const steps = [];
  const { n, toWhat } = params;
  const targetLabel = toWhat === "tens" ? "tens" : "hundreds";
  const digitToCheck = toWhat === "tens" ? Math.floor((n % 10) / 1) : Math.floor((n % 100) / 10);
  const checkLabel = toWhat === "tens" ? "ones digit" : "tens digit";

  steps.push({
    id: "show",
    title: "What are we rounding?",
    ...learningStepFields(mix`round ${n} to ${targetLabel}.`),
    type: "rounding",
    params,
    answer,
  });
  steps.push({
    id: "find-digit",
    title: "Which digit decides?",
    ...learningStepFields(mix`to round to ${targetLabel} look at ${checkLabel}. here it is ${digitToCheck}.`),
    type: "rounding",
    params,
    answer,
  });
  steps.push({
    id: "rule",
    title: "Rounding rule",
    ...learningStepFields(mix`If the deciding digit is 0–4, round down. If 5–9, round up.`),
    type: "rounding",
    params,
    answer,
  });
  const rounded = Number(answer);
  steps.push({
    id: "calc",
    title: "compute",
    ...learningStepFields(mix`${digitToCheck >= 5 ? "round up" : "round down"} ⇒ ${M(`${n} ≈ ${rounded}`)}.`),
    type: "rounding",
    params,
    answer,
  });
  steps.push({
    id: "final",
    title: "Final result",
    ...learningStepFields(mix`the answer is ${answer}.`),
    type: "rounding",
    params,
    answer,
  });
  return steps;
}

export function buildDivisibilityAnimation(params, answer) {
  const steps = [];
  const { num, divisor } = params;
  steps.push({
    id: "show",
    title: "Show the question",
    ...learningStepFields(mix`is ${num} divisible by ${divisor}?`),
    type: "divisibility",
    params,
    answer,
  });

  const lastDigit = num % 10;
  const sumDigits = String(num)
    .split("")
    .reduce((s, d) => s + Number(d), 0);

  if (divisor === 2) {
    steps.push({
      id: "rule",
      title: "Divisibility rule for 2",
      ...learningStepFields(mix`a number is divisible by 2 if the ones digit is even (0,2,4,6,8).`),
      type: "divisibility",
      params,
      answer,
    });
    steps.push({
      id: "check",
      title: "Check",
      ...learningStepFields(mix`the ones digit is ${lastDigit}. so ${M(`${answer === "Yes" ? "Yes" : "No"}.`)}`),
      type: "divisibility",
      params,
      answer,
    });
  } else if (divisor === 5) {
    steps.push({
      id: "rule",
      title: "Divisibility rule for 5",
      ...learningStepFields(mix`a number is divisible by 5 if the ones digit is 0 or 5.`),
      type: "divisibility",
      params,
      answer,
    });
    steps.push({
      id: "check",
      title: "Check",
      ...learningStepFields(mix`the ones digit is ${lastDigit}. so ${M(`${answer === "Yes" ? "Yes" : "No"}.`)}`),
      type: "divisibility",
      params,
      answer,
    });
  } else if (divisor === 10) {
    steps.push({
      id: "rule",
      title: "Divisibility rule for 10",
      ...learningStepFields(mix`a number is divisible by 10 if the ones digit is 0.`),
      type: "divisibility",
      params,
      answer,
    });
    steps.push({
      id: "check",
      title: "Check",
      ...learningStepFields(mix`the ones digit is ${lastDigit}. so ${M(`${answer === "Yes" ? "Yes" : "No"}.`)}`),
      type: "divisibility",
      params,
      answer,
    });
  } else if (divisor === 3 || divisor === 9) {
    steps.push({
      id: "rule",
      title: `divisibility rule for ${divisor}`,
      ...learningStepFields(mix`a number is divisible by ${divisor} if the sum of its digits is divisible by ${divisor}.`),
      type: "divisibility",
      params,
      answer,
    });
    steps.push({
      id: "sum",
      title: "Sum of digits",
      ...learningStepFields(mix`digit sum: ${M(`${String(num).split("").join(" + ")} = ${sumDigits}`)}.`),
      type: "divisibility",
      params,
      answer,
    });
    steps.push({
      id: "check",
      title: "Check",
      ...learningStepFields(mix`${sumDigits} ${M(`${sumDigits % divisor === 0 ? "divisible" : "not divisible"} `)}by ${divisor} ⇒ Answer: ${M(`${answer}.`)}`),
      type: "divisibility",
      params,
      answer,
    });
  } else if (divisor === 6) {
    steps.push({
      id: "rule",
      title: "Divisibility rule for 6",
      ...learningStepFields(mix`a number is divisible by 6 if it is divisible by both 2 and 3.`),
      type: "divisibility",
      params,
      answer,
    });
    steps.push({
      id: "check2",
      title: "Check divisibility by 2",
      ...learningStepFields(mix`the ones digit is ${lastDigit} ⇒ ${M(`${lastDigit % 2 === 0 ? "divisible by 2" : "not divisible by 2"}.`)}`),
      type: "divisibility",
      params,
      answer,
    });
    steps.push({
      id: "check3",
      title: "Check divisibility by 3",
      ...learningStepFields(mix`the digit sum is ${sumDigits} ⇒ ${M(`${sumDigits % 3 === 0 ? "divisible by 3" : "not divisible by 3"}.`)}`),
      type: "divisibility",
      params,
      answer,
    });
    steps.push({
      id: "final",
      title: "Conclusion",
      ...learningStepFields(mix`only if both conditions are true ⇒ divisible by 6. Answer: ${M(`${answer}.`)}`),
      type: "divisibility",
      params,
      answer,
    });
  } else {
    // fallback: check with division (still explaining)
    const q = Math.floor(num / divisor);
    const r = num % divisor;
    steps.push({
      id: "fallback",
      title: "Check with division",
      ...learningStepFields(mix`check with division: ${M(`${num} = ${divisor}×${q} + ${r}`)}. if the remainder is 0, it is divisible.`),
      type: "divisibility",
      params,
      answer,
    });
  }

  steps.push({
    id: "final-answer",
    title: "Final result",
    ...learningStepFields(mix`the answer is ${answer}.`),
    type: "divisibility",
    params,
    answer,
  });
  return steps;
}

export function buildPrimeCompositeAnimation(params, answer) {
  const steps = [];
  const { num, isPrime } = params;
  steps.push({
    id: "show",
    title: "What is the question asking?",
    ...learningStepFields(mix`is ${num} is it prime or composite?`),
    type: "prime_composite",
    params,
    answer,
  });
  steps.push({
    id: "define",
    title: "Definition",
    ...learningStepFields(mix`A prime number is divisible only by 1 and itself. A composite number is also divisible by another number.`),
    type: "prime_composite",
    params,
    answer,
  });
  steps.push({
    id: "check-small",
    title: "What are we checking?",
    ...learningStepFields(mix`it is enough to check divisors up to u221A${num} (because if there is a large divisor, there is also a small one).`),
    type: "prime_composite",
    params,
    answer,
  });

  if (num === 2) {
    steps.push({
      id: "two",
      title: "Special case",
      ...learningStepFields(mix`2 is a prime number.`),
      type: "prime_composite",
      params,
      answer,
    });
  } else {
    let found = null;
    const limit = Math.floor(Math.sqrt(num));
    let explainedTries = 0;
    for (let d = 2; d <= limit; d++) {
      if (num % d === 0) {
        found = d;
        break;
      }
      if (explainedTries < 6) {
        steps.push({
          id: `try-${d}`,
          title: `check division by ${d}`,
          ...learningStepFields(mix`${M(`${num} ÷ ${d}`)} is not a whole number ⇒ continue.`),
          type: "prime_composite",
          params,
          answer,
        });
        explainedTries++;
      }
    }
    if (found != null) {
      steps.push({
        id: "found",
        title: "We found a divisor",
        ...learningStepFields(mix`${M(`${num} ÷ ${found} = ${num / found}`)} (whole number) ⇒ ${num} composite.`),
        type: "prime_composite",
        params,
        answer,
      });
    } else {
      steps.push({
        id: "none",
        title: "No divisors found",
        ...learningStepFields(mix`no divisor found up to u221A${num} ⇒ ${num} prime.`),
        type: "prime_composite",
        params,
        answer,
      });
    }
  }

  steps.push({
    id: "final",
    title: "Final result",
    ...learningStepFields(mix`the answer is ${answer}.`),
    type: "prime_composite",
    params,
    answer,
  });
  return steps;
}

export function buildPowersAnimation(params, answer) {
  const steps = [];
  const { kind, base, exp, result } = params;
  steps.push({
    id: "show",
    title: "What is a power?",
    ...learningStepFields(mix`a power is repeated multiplication: ${M(`${base}^${exp} = ${base} × ${base} × ...`)} (${exp} times).`),
    type: "powers",
    params,
    answer,
  });

  if (kind === "power_calc") {
    steps.push({
      id: "expand",
      title: "expand the power",
      ...learningStepFields(mix`write as repeated multiplication: ${M(`${base}^${exp} = ${Array(exp).fill(base).join(" × ")}`)}.`),
      type: "powers",
      params,
      answer,
    });

    let acc = base;
    for (let i = 2; i <= exp; i++) {
      const next = acc * base;
      steps.push({
        id: `mul-${i}`,
        title: `multiply number ${i}`,
        ...learningStepFields(mix`compute: ${M(`${acc} × ${base} = ${next}`)}.`),
        type: "powers",
        params,
        answer,
      });
      acc = next;
    }

    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`so ${M(`${base}^${exp} = ${result}`)}.`),
      type: "powers",
      params,
      answer,
    });
  } else if (kind === "power_base") {
    steps.push({
      id: "goal",
      title: "What are we looking for?",
      ...learningStepFields(mix`find the base so that ${M(`(base)^${exp} = ${result}`)}.`),
      type: "powers",
      params,
      answer,
    });
    steps.push({
      id: "trial",
      title: "Check options",
      ...learningStepFields(mix`check small numbers: for example 2^${exp}, 3^${exp}, 4^${exp}... until you get ${result}.`),
      type: "powers",
      params,
      answer,
    });
    steps.push({
      id: "final",
      title: "Final result",
      ...learningStepFields(mix`we found that ${M(`${answer}^${exp} = ${result}`)}, so the base is ${answer}.`),
      type: "powers",
      params,
      answer,
    });
  }
  return steps;
}

export function buildRatioAnimation(params, answer) {
  const steps = [];
  const { kind } = params;
  const gcd = (a, b) => {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const t = x % y;
      x = y;
      y = t;
    }
    return x || 1;
  };

  if (kind === "ratio_find") {
    const { a, b, simplifiedA, simplifiedB } = params;
    const g = gcd(a, b);
    steps.push({ id: "show", title: "Show the question", ...learningStepFields(mix`What is the ratio of ${a} to ${b}?`), type: "ratio", params, answer });
    steps.push({ id: "gcd", title: "Simplify the ratio", ...learningStepFields(mix`Divide both numbers by the same common divisor. Here the divisor is ${g}.`), type: "ratio", params, answer });
    steps.push({ id: "calc", title: "Calculation", ...learningStepFields(mix`${M(`${a} ÷ ${g} = ${simplifiedA}`)} and ${M(`${b} ÷ ${g} = ${simplifiedB}`)}.`), type: "ratio", params, answer });
    steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`so the simplified ratio is ${simplifiedA}:${M(`${simplifiedB}.`)}`), type: "ratio", params, answer });
  } else if (kind === "ratio_first") {
    const { firstNum, secondNum, simplifiedA, simplifiedB } = params;
    steps.push({ id: "show", title: "Show the question", ...learningStepFields(mix`the ratio is ${simplifiedA}:${M(`${simplifiedB}. `)}the second number is ${secondNum}. What is the first number?`), type: "ratio", params, answer });
    steps.push({ id: "scale", title: "Find the coefficient", ...learningStepFields(mix`if ${simplifiedB} correspond to${secondNum}, then the scale factor is ${M(`${secondNum} ÷ ${simplifiedB}`)}.`), type: "ratio", params, answer });
    const k = secondNum / simplifiedB;
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`the first number: ${M(`${simplifiedA} × ${k} = ${firstNum}`)}.`), type: "ratio", params, answer });
    steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the answer is ${answer}.`), type: "ratio", params, answer });
  } else if (kind === "ratio_second") {
    const { firstNum, secondNum, simplifiedA, simplifiedB } = params;
    steps.push({ id: "show", title: "Show the question", ...learningStepFields(mix`the ratio is ${simplifiedA}:${M(`${simplifiedB}. `)}the first number is ${firstNum}. What is the second number?`), type: "ratio", params, answer });
    steps.push({ id: "scale", title: "Find the coefficient", ...learningStepFields(mix`if ${simplifiedA} correspond to${firstNum}, then the scale factor is ${M(`${firstNum} ÷ ${simplifiedA}`)}.`), type: "ratio", params, answer });
    const k = firstNum / simplifiedA;
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`the second number: ${M(`${simplifiedB} × ${k} = ${secondNum}`)}.`), type: "ratio", params, answer });
    steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the answer is ${answer}.`), type: "ratio", params, answer });
  }
  return steps;
}

export function buildOrderOfOperationsAnimation(params, answer) {
  const steps = [];
  const { kind, a, b, c } = params;
  steps.push({
    id: "rule",
    title: "Order of operations",
    ...learningStepFields(mix`order of operations: parentheses → multiplication/division → addition/subtraction.`),
    type: "order_of_operations",
    params,
    answer,
  });

  if (kind === "order_parentheses") {
    steps.push({ id: "show", title: "The exercise", ...learningStepFields(mix`${M(`${a} × (${b} + ${c})`)}`), type: "order_of_operations", params, answer });
    const inside = b + c;
    steps.push({ id: "par", title: "Parentheses first", ...learningStepFields(mix`${M(`${b} + ${c} = ${inside}`)}`), type: "order_of_operations", params, answer });
    const res = a * inside;
    steps.push({ id: "mul", title: "Then multiplication", ...learningStepFields(mix`${M(`${a} × ${inside} = ${res}`)}`), type: "order_of_operations", params, answer });
  } else if (kind === "order_add_mul") {
    steps.push({ id: "show", title: "The exercise", ...learningStepFields(mix`${M(`${a} + ${b} × ${c}`)}`), type: "order_of_operations", params, answer });
    const mul = b * c;
    steps.push({ id: "mul", title: "Multiply first", ...learningStepFields(mix`${M(`${b} × ${c} = ${mul}`)}`), type: "order_of_operations", params, answer });
    const res = a + mul;
    steps.push({ id: "add", title: "Then addition", ...learningStepFields(mix`${M(`${a} + ${mul} = ${res}`)}`), type: "order_of_operations", params, answer });
  } else if (kind === "order_mul_sub") {
    steps.push({ id: "show", title: "The exercise", ...learningStepFields(mix`${M(`${a} × ${b} − ${c}`)}`), type: "order_of_operations", params, answer });
    const mul = a * b;
    steps.push({ id: "mul", title: "Multiply first", ...learningStepFields(mix`${M(`${a} × ${b} = ${mul}`)}`), type: "order_of_operations", params, answer });
    const res = mul - c;
    steps.push({ id: "sub", title: "Then subtraction", ...learningStepFields(mix`${M(`${mul} − ${c} = ${res}`)}`), type: "order_of_operations", params, answer });
  }

  steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the answer is ${answer}.`), type: "order_of_operations", params, answer });
  return steps;
}

export function buildZeroOnePropertiesAnimation(params, answer) {
  const steps = [];
  const { kind, a } = params;
  const expr =
    kind === "zero_mul"
      ? `${a} × 0`
      : kind === "zero_add"
        ? `${a} + 0`
        : kind === "zero_sub"
          ? `${a} − 0`
          : `${a} × 1`;
  steps.push({
    id: "show",
    title: "Show the question",
    ...learningStepFields(mix`compute: ${M(`${pureMathLtrDisplay(expr)}`)}`),
    type: "zero_one_properties",
    params,
    answer,
  });

  if (kind === "zero_mul") {
    steps.push({ id: "rule", title: "Rule: multiply by 0", ...learningStepFields(mix`Any number times 0 equals 0.`), type: "zero_one_properties", params, answer });
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`${M(`${a} × 0 = 0`)}`), type: "zero_one_properties", params, answer });
  } else if (kind === "zero_add") {
    steps.push({ id: "rule", title: "Rule: add 0", ...learningStepFields(mix`Adding 0 does not change the number.`), type: "zero_one_properties", params, answer });
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`${M(`${a} + 0 = ${a}`)}`), type: "zero_one_properties", params, answer });
  } else if (kind === "zero_sub") {
    steps.push({ id: "rule", title: "Rule: subtract 0", ...learningStepFields(mix`Subtracting 0 does not change the number.`), type: "zero_one_properties", params, answer });
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`${M(`${a} − 0 = ${a}`)}`), type: "zero_one_properties", params, answer });
  } else if (kind === "one_mul") {
    steps.push({ id: "rule", title: "Rule: multiply by 1", ...learningStepFields(mix`Any number times 1 equals itself.`), type: "zero_one_properties", params, answer });
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`${M(`${a} × 1 = ${a}`)}`), type: "zero_one_properties", params, answer });
  }
  steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the answer is ${answer}.`), type: "zero_one_properties", params, answer });
  return steps;
}

export function buildEstimationAnimation(params, answer) {
  const steps = [];
  const { kind } = params;
  steps.push({ id: "show", title: "What is an estimate?", ...learningStepFields(mix`An estimate is a nearby (not exact) answer, so you can compute quickly.`), type: "estimation", params, answer });

  if (kind === "est_add") {
    const { a, b, exact, estimate } = params;
    steps.push({ id: "round", title: "Round", ...learningStepFields(mix`Round the result to the nearest tens.`), type: "estimation", params, answer });
    steps.push({ id: "calc", title: "Exact calculation", ...learningStepFields(mix`${M(`${a} + ${b} = ${exact}`)}`), type: "estimation", params, answer });
    steps.push({ id: "est", title: "Estimate", ...learningStepFields(mix`round: ${M(`${exact} ≈ ${estimate}`)}`), type: "estimation", params, answer });
  } else if (kind === "est_mul") {
    const { a, b, exact, estimate } = params;
    steps.push({ id: "round", title: "Round", ...learningStepFields(mix`Round the result to the nearest hundreds.`), type: "estimation", params, answer });
    steps.push({ id: "calc", title: "Exact calculation", ...learningStepFields(mix`${M(`${a} × ${b} = ${exact}`)}`), type: "estimation", params, answer });
    steps.push({ id: "est", title: "Estimate", ...learningStepFields(mix`round: ${M(`${exact} ≈ ${estimate}`)}`), type: "estimation", params, answer });
  } else if (kind === "est_quantity") {
    const { quantity, estimate } = params;
    steps.push({ id: "round", title: "Round to tens", ...learningStepFields(mix`${M(`${quantity} ≈ ${estimate}`)}`), type: "estimation", params, answer });
  }

  steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the estimate is ${answer}.`), type: "estimation", params, answer });
  return steps;
}

export function buildScaleAnimation(params, answer) {
  const steps = [];
  const { kind } = params;
  steps.push({ id: "show", title: "scale", ...learningStepFields(mix`at scale 1:${M(`${params.scale || "?"} `)}– each 1 cm on the map represents ${params.scale || "?"} cm in reality.`), type: "scale", params, answer });

  if (kind === "scale_map_to_real") {
    const { mapLength, scale, realLength } = params;
    steps.push({ id: "eq", title: "Write the exercise", ...learningStepFields(mix`reality = map × scale`), type: "scale", params, answer });
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`${M(`${mapLength} × ${scale} = ${realLength}`)}`), type: "scale", params, answer });
  } else if (kind === "scale_real_to_map") {
    const { realLength, scale, mapLength } = params;
    steps.push({ id: "eq", title: "Write the exercise", ...learningStepFields(mix`map = reality ÷ scale`), type: "scale", params, answer });
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`${M(`${realLength} ÷ ${scale} = ${mapLength}`)}`), type: "scale", params, answer });
  } else if (kind === "scale_find") {
    const { mapLength, realLength, scale } = params;
    steps.push({ id: "eq", title: "Write the exercise", ...learningStepFields(mix`scale = reality ÷ map`), type: "scale", params, answer });
    steps.push({ id: "calc", title: "compute", ...learningStepFields(mix`${M(`${realLength} ÷ ${mapLength} = ${scale}`)}`), type: "scale", params, answer });
    steps.push({ id: "format", title: "write in the form 1:X", ...learningStepFields(mix`so the scale is 1:${M(`${scale}.`)}`), type: "scale", params, answer });
  }

  steps.push({ id: "final", title: "Final result", ...learningStepFields(mix`the answer is ${answer}.`), type: "scale", params, answer });
  return steps;
}

// General function that builds an animation by topic
export function buildAnimationForOperation(question, operation, gradeKey) {
  if (!question || !question.params) return null;
  
  const params = question.params;
  const answer = question.correctAnswer !== undefined 
    ? question.correctAnswer 
    : question.answer;
  
  switch (operation) {
    case "multiplication":
      if (params.a && params.b) {
        return buildMultiplicationAnimation(params.a, params.b, answer);
      }
      break;
      
    case "division":
    case "division_with_remainder":
      // some exercises have no params.quotient (is simply the answer). We still want an animation.
      if (params.dividend != null && params.divisor != null) {
        const q =
          params.quotient != null
            ? params.quotient
            : (typeof answer === "number" ? answer : null);
        if (q != null) {
          return buildDivisionAnimation(params.dividend, params.divisor, q);
        }
      }
      break;
      
    case "decimals":
      if (params.a && params.b) {
        return buildDecimalsAnimation(params, answer);
      }
      break;
      
    case "fractions":
      return buildFractionsAnimation(params, answer);
      
    case "percentages":
      return buildPercentagesAnimation(params, answer);
      
    case "sequences":
      return buildSequencesAnimation(params, answer);
      
    case "equations":
      return buildEquationsAnimation(params, answer);
      
    case "compare":
      return buildCompareAnimation(params, null);
      
    case "number_sense":
      return buildNumberSenseAnimation(params, answer);
      
    case "factors_multiples":
      return buildFactorsMultiplesAnimation(params, answer);
      
    case "word_problems":
      return buildWordProblemsAnimation(params, answer);

    case "rounding":
      return buildRoundingAnimation(params, answer);

    case "divisibility":
      return buildDivisibilityAnimation(params, answer);

    case "prime_composite":
      return buildPrimeCompositeAnimation(params, answer);

    case "powers":
      return buildPowersAnimation(params, answer);

    case "ratio":
      return buildRatioAnimation(params, answer);

    case "order_of_operations":
      return buildOrderOfOperationsAnimation(params, answer);

    case "zero_one_properties":
      return buildZeroOnePropertiesAnimation(params, answer);

    case "estimation":
      return buildEstimationAnimation(params, answer);

    case "scale":
      return buildScaleAnimation(params, answer);
      
    default:
      return null;
  }
  
  return null;
}

