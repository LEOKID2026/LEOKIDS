import { enrichGeometryAnimationSteps } from "./geometry-animations.js";
import React from "react";
import { mix, M } from "../lib/learning-book/learning-math-line-build.js";
import { learningStepDiv as toSpan } from "./learning-math-line-render.js";
import {
  resultPhraseArea,
  resultPhraseLength,
  resultPhraseVolume,
  resultPhraseVolumeRounded,
  geometryVolumeSuffix,
  geometryLengthSuffix,
} from "./geometry-units.js";

// Explanation and hint functions for the geometry page

function toNum(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : NaN;
}

/** Hints: strategy without full number crunching and without revealing the answer to MCQ */
export function getHint(question, topic, gradeKey) {
  if (!question || !question.params) return "";
  const M = (expr) => `\u2066${expr}\u2069`;
  const p = question.params;
  const sh = question.shape;

  switch (topic) {
    case "area":
      if (sh === "square") {
        return "square area = side × side. Take the side length from the question and multiply it by itself — that is the area, not the perimeter.";
      }
      if (sh === "rectangle") {
        return "rectangle area = length × width. Make sure you multiply two different dimensions of the same shape, not add (that is more like perimeter).";
      }
      if (sh === "circle") {
        return mix`circle area = ${M("π × radius²")} (here ${M("π ≈ 3.14")}). first square the radius, then multiply by π - do not confuse with ${M("2πr")} which is the perimeter.`;
      }
      if (sh === "triangle") {
        return "triangle area = (base × height to the base) ÷ 2. after multiplying, divide by 2 - Common mistake: forgetting the division.";
      }
      if (sh === "parallelogram") {
        return "parallelogram area = base × the height perpendicular to it (not a diagonal).";
      }
      if (sh === "trapezoid") {
        return "trapezoid area = ((base 1 + base 2) × height) ÷ 2. First add the two parallel bases, times the height, then divide by 2.";
      }
      break;

    case "perimeter":
      if (sh === "square") {
        return "square perimeter = side × 4 (the sum of the four equal sides). If you computed side² - this is an area formula.";
      }
      if (sh === "rectangle") {
        return "rectangle perimeter = (length + width) × 2 - the sum of all sides. Do not multiply length × width; that is area.";
      }
      if (sh === "circle") {
        return mix`circle circumference = ${M("2 × π × radius")}. this is a full turn around — not ${M("πr²")}.`;
      }
      if (sh === "triangle") {
        return "triangle perimeter = the sum of the three sides. No division by 2.";
      }
      break;

    case "volume": {
      if (p.kind === "pyramid_volume_square" || p.kind === "pyramid_volume_rectangular") {
        return "pyramid volume = (1/3) × base area × height. First the base area, then times the height and one third — do not forget the factor 1/3.";
      }
      if (p.kind === "cone_volume") {
        return "cone volume = (1/3) × π × radius² × height — like a pyramid with a round base; again: one third of the cylinder's volume with the same base.";
      }
      if (p.kind === "prism_volume_triangle" || p.kind === "prism_volume_rectangular") {
        return "prism volume = the cross-section area (base) × the prism's height. If the base is a triangle — first compute the triangle's area.";
      }
      if (sh === "cube") {
        return "cube volume = side³ (the same side three times).";
      }
      if (sh === "rectangular_prism") {
        return "box volume = length × width × height — the three dimensions, without a 1/3 factor.";
      }
      if (sh === "cylinder") {
        return "cylinder volume = π × radius² × height. The base circle's area times the cylinder's height.";
      }
      if (sh === "sphere") {
        return "sphere volume = (4/3) × π × radius³ - the radius is raised to the third power, not just squared.";
      }
      break;
    }

    case "angles":
      return mix`in every triangle the sum of interior angles = ${M("180°")}. Add the two given angles, then subtract the result from ${M("180°")}.`;

    case "pythagoras":
      return mix`in a right triangle: ${M("a² + b² = c²")}. Identify the hypotenuse (the side opposite the right angle) and what is asked — a leg or the hypotenuse — then the inverse operation (square root or difference of squares).`;

    case "shapes_basic":
      if (p.kind === "shapes_basic_square" || p.kind === "shapes_basic_rectangle") {
        return "Compare side lengths: when all four are equal — square; when there are two different lengths in pairs — rectangle.";
      }
      if (p.kind === "shapes_basic_properties_square") {
        return "The question asks about the number of equal sides in a square. Think: how many sides does a closed polygon have, and what is special about a square's side lengths?";
      }
      if (p.kind === "shapes_basic_properties_rectangle") {
        return "The question asks how many pairs of equal sides a rectangle has — not how many sides in total.";
      }
      if (p.kind === "shapes_basic_properties_angles") {
        return "A square and a rectangle are quadrilaterals with right interior angles. How many such corners does a four-sided polygon have?";
      }
      return "Focus on the side and angle properties of the square versus the rectangle.";

    case "parallel_perpendicular":
      return mix`parallel: never meet and keep a constant distance. perpendicular: meet at a right angle (${M("90°")}). Which description fits the name in the question?`;

    case "triangles":
      return "Sort by equal side lengths: three equal / two equal / all different — and match to the name in the question.";

    case "quadrilaterals":
      return "Match the name to the rules for sides and angles: are all sides equal? parallel pairs? only one parallel base?";

    case "transformations":
      return "A translation moves the shape without changing its reading orientation; a reflection creates 'a mirror image' about the axis. Which description fits the operation in the question?";

    case "rotation":
      return mix`Rotation is measured in degrees around a point. Think whether it is a quarter, half, or three-quarter full turn (${M("360°")}).`;

    case "symmetry":
      return "An axis of symmetry splits the shape into two mirror halves. Think how many such lines pass through the shape by its type (square / rectangle / equilateral triangle).";

    case "diagonal":
      if (p.kind === "diagonal_square") {
        return mix`In a square the diagonal forms a right triangle with two equal sides — you can ${M("√2 × side")}.`;
      }
      if (p.kind === "diagonal_rectangle" || p.kind === "diagonal_parallelogram") {
        return "The diagonal is the hypotenuse of a right triangle whose legs are the two given sides — use the Pythagorean theorem.";
      }
      return "Think of the diagonal as the hypotenuse of a right triangle built from the two given sides.";

    case "heights":
      if (p.shape === "triangle") {
        return mix`From the triangle area formula, invert for height: height = ${M("(area × 2) ÷ base")}.`;
      }
      if (p.shape === "parallelogram") {
        return mix`in a parallelogram, area = ${M("base × height")}; so the height = ${M("area ÷ base")}.`;
      }
      if (p.shape === "trapezoid") {
        return mix`in a trapezoid first ${M("(base 1 + base 2)")}, then relate it to the area and divide — height = ${M("(area × 2) ÷ (the sum of the bases)")}.`;
      }
      return "Isolate the height from the area formula of the same shape.";

    case "tiling":
      return mix`In tiling around a point, the meeting angles must add up to ${M("360°")}. What is the notable interior angle of the shape in the question?`;

    case "circles":
      return p.askArea
        ? `the question asks for area: ${M("π × radius²")}. the question asks for perimeter: ${M("2 × π × radius")}. Check which word is in the question.`
        : `The question asks for perimeter (linear in the radius): ${M("2πr")}. area uses the radius squared: ${M("πr²")}.`;

    case "solids":
      return "Connect the description (faces, round base, vertex) to the list of solids — not by a single name alone.";

    default:
      return "Try to identify which formula or property fits the question's wording.";
  }
  return "Try to identify which formula or property fits the question's wording.";
}

// A detailed step-by-step explanation by topic and grade
export function getSolutionSteps(question, topic, gradeKey) {
  if (!question || !question.params) return [];
  const p = question.params;
  const shape = question.shape;
  const { correctAnswer } = question;

  switch (topic) {
    case "area": {
      if (shape === "square") {
        return [
          toSpan(
            mix`1. Identify: square — all sides the same length. Area = how much space inside (not the perimeter around). Formula: area = side × side.`,
            "1"
          ),
          toSpan(mix`2. substitute: ${M(`area = ${p.side} × ${p.side}`)}.`, "2"),
          toSpan(mix`3. compute: ${M(`${p.side} × ${p.side} = ${correctAnswer}`)}.`, "3"),
          toSpan(mix`4. ${resultPhraseArea(question, correctAnswer)}`, "4"),
        ];
      }
      if (shape === "rectangle") {
        return [
          toSpan(
            mix`1. Identify: a rectangle has two pairs of equal sides. The area depends on the two different dimensions (length and width), not on the sum of sides.`,
            "1"
          ),
          toSpan(mix`2. Formula: rectangle area = length × width.`, "2"),
          toSpan(mix`3. substitute and compute: ${M(`${p.length} × ${p.width} = ${correctAnswer}`)}.`, "3"),
          toSpan(mix`4. ${resultPhraseArea(question, correctAnswer)}`, "4"),
        ];
      }
      if (shape === "triangle") {
        return [
          toSpan(
            mix`1. Identify: the height to the base is a perpendicular segment from the vertex to the base (or its extension). Without a perpendicular height, do not substitute another side.`,
            "1"
          ),
          toSpan(mix`2. Formula: triangle area = (base × height to the base) ÷ 2.`, "2"),
          toSpan(mix`3. substitute: ${M(`(${p.base} × ${p.height}) ÷ 2`)}.`, "3"),
          toSpan(
            mix`4. compute: ${M(`${p.base} × ${p.height} = ${p.base * p.height}`)}, then ${M(`${p.base * p.height} ÷ 2 = ${correctAnswer}`)}.`,
            "4"
          ),
          toSpan(mix`5. ${resultPhraseArea(question, correctAnswer)}`, "5"),
        ];
      }
      if (shape === "parallelogram") {
        return [
          toSpan(
            mix`1. Identify: the height of a parallelogram is the perpendicular distance between the base and the opposite side — not the length of the slanted side.`,
            "1"
          ),
          toSpan(mix`2. Formula: parallelogram area = base × height (perpendicular).`, "2"),
          toSpan(mix`3. substitute: ${M(`${p.base} × ${p.height}`)}.`, "3"),
          toSpan(mix`4. compute: ${M(`${p.base} × ${p.height} = ${correctAnswer}`)}.`, "4"),
          toSpan(mix`5. ${resultPhraseArea(question, correctAnswer)}`, "5"),
        ];
      }
      if (shape === "trapezoid") {
        const sumBases = p.base1 + p.base2;
        return [
          toSpan(
            mix`1. Identify: a trapezoid has two parallel bases; the height is the perpendicular distance between them. First average the bases, times the height, divided by 2.`,
            "1"
          ),
          toSpan(mix`2. Formula: trapezoid area = ((base 1 + base 2) × height) ÷ 2.`, "2"),
          toSpan(mix`3. substitute: ${M(`((${p.base1} + ${p.base2}) × ${p.height}) ÷ 2`)}.`, "3"),
          toSpan(
            mix`4. compute: ${M(`${p.base1} + ${p.base2} = ${sumBases}`)}, then ${M(`(${sumBases} × ${p.height}) ÷ 2 = ${correctAnswer}`)}.`,
            "4"
          ),
          toSpan(mix`5. ${resultPhraseArea(question, correctAnswer)}`, "5"),
        ];
      }
      if (shape === "circle") {
        const r2 = p.radius * p.radius;
        return [
          toSpan(
            mix`1. Identify: the radius goes from the center to the edge. Area uses r² (square), perimeter uses r without squaring — do not confuse them.`,
            "1"
          ),
          toSpan(mix`2. Formula: circle area = π × radius² (here π ≈ 3.14).`, "2"),
          toSpan(mix`3. substitute: ${M(`area = 3.14 × ${p.radius}²`)}.`, "3"),
          toSpan(
            mix`4. compute: ${M(`${p.radius}² = ${r2}`)}, then ${M(`3.14 × ${r2} = ${correctAnswer}`)}.`,
            "4"
          ),
          toSpan(mix`5. ${resultPhraseArea(question, correctAnswer)}`, "5"),
        ];
      }
      break;
    }

    case "perimeter": {
      if (shape === "square") {
        return [
          toSpan(mix`1. Formula: square perimeter = side × 4.`, "1"),
          toSpan(mix`2. substitute: ${M(`${p.side} × 4`)}.`, "2"),
          toSpan(mix`3. compute: ${M(`${p.side} × 4 = ${correctAnswer}`)}.`, "3"),
          toSpan(mix`4. ${resultPhraseLength(question, correctAnswer)}`, "4"),
        ];
      }
      if (shape === "rectangle") {
        const sum = p.length + p.width;
        return [
          toSpan(mix`1. Formula: rectangle perimeter = (length + width) × 2.`, "1"),
          toSpan(mix`2. substitute: ${M(`(${p.length} + ${p.width}) × 2`)}.`, "2"),
          toSpan(
            mix`3. compute: ${M(`${p.length} + ${p.width} = ${sum}`)}, then ${M(`${sum} × 2 = ${correctAnswer}`)}.`,
            "3"
          ),
          toSpan(mix`4. ${resultPhraseLength(question, correctAnswer)}`, "4"),
        ];
      }
      if (shape === "triangle") {
        return [
          toSpan(mix`1. Formula: triangle perimeter = side 1 + side 2 + side 3.`, "1"),
          toSpan(
            mix`2. substitute: ${M(`${p.side1} + ${p.side2} + ${p.side3}`)}.`,
            "2"
          ),
          toSpan(
            mix`3. compute: ${M(`${p.side1} + ${p.side2} + ${p.side3} = ${correctAnswer}`)}.`,
            "3"
          ),
          toSpan(mix`4. ${resultPhraseLength(question, correctAnswer)}`, "4"),
        ];
      }
      if (shape === "circle") {
        return [
          toSpan(mix`1. Formula: circle circumference = 2 × π × radius.`, "1"),
          toSpan(mix`2. substitute: ${M(`2 × 3.14 × ${p.radius}`)}.`, "2"),
          toSpan(
            mix`3. compute: ${M(`2 × 3.14 = 6.28`)}, then ${M(`6.28 × ${p.radius} = ${correctAnswer}`)}.`,
            "3"
          ),
          toSpan(mix`4. ${resultPhraseLength(question, correctAnswer)}`, "4"),
        ];
      }
      break;
    }

    case "volume": {
      if (p.kind === "pyramid_volume_square") {
        const bs = p.baseSide;
        const h = p.height;
        const baseArea = bs * bs;
        const volRaw = (baseArea * h) / 3;
        return [
          toSpan(mix`1. Formula: pyramid volume = (1/3) × base area × height.`, "1"),
          toSpan(mix`2. square base: base area = side × side.`, "2"),
          toSpan(
            mix`3. substitute: ${M(`base area = ${bs} × ${bs} = ${baseArea}`)}, height ${M(String(h))}.`,
            "3"
          ),
          toSpan(
            mix`4. compute: ${M(`(1/3) × ${baseArea} × ${h} = ${volRaw}`)} → rounded per the question: ${M(String(correctAnswer))}.`,
            "4"
          ),
          toSpan(mix`5. ${resultPhraseVolume(question, correctAnswer)}`, "5"),
        ];
      }
      if (p.kind === "pyramid_volume_rectangular") {
        const b1 = p.baseSide;
        const b2 = p.baseWidth;
        const h = p.height;
        const baseArea = b1 * b2;
        const volRaw = (baseArea * h) / 3;
        return [
          toSpan(mix`1. Formula: pyramid volume = (1/3) × base area × height.`, "1"),
          toSpan(mix`2. rectangular base: base area = length × width.`, "2"),
          toSpan(
            mix`3. substitute: ${M(`${b1} × ${b2} = ${baseArea}`)}, height ${M(String(h))}.`,
            "3"
          ),
          toSpan(
            mix`4. compute: ${M(`(1/3) × ${baseArea} × ${h} = ${volRaw}`)} → ${M(String(correctAnswer))}.`,
            "4"
          ),
          toSpan(mix`5. ${resultPhraseVolume(question, correctAnswer)}`, "5"),
        ];
      }
      if (p.kind === "cone_volume") {
        const r = p.radius;
        const h = p.height;
        const r2 = r * r;
        const volRaw = (3.14 * r2 * h) / 3;
        return [
          toSpan(mix`1. Formula: cone volume = (1/3) × π × radius² × height (π ≈ 3.14).`, "1"),
          toSpan(mix`2. substitute: ${M(`(1/3) × 3.14 × ${r}² × ${h}`)}.`, "2"),
          toSpan(
            mix`3. compute: ${M(`${r}² = ${r2}`)}, ${M(`3.14 × ${r2} × ${h} = ${3.14 * r2 * h}`)}, divided by 3 ≈ ${M(String(volRaw))}.`,
            "3"
          ),
          toSpan(mix`4. ${resultPhraseVolumeRounded(question, correctAnswer)}`, "4"),
        ];
      }
      if (p.kind === "prism_volume_triangle") {
        const b = p.base;
        const bh = p.baseHeight;
        const h = p.height;
        const baseArea = (b * bh) / 2;
        const prod = baseArea * h;
        return [
          toSpan(mix`1. Formula: prism volume = base area × the prism's height.`, "1"),
          toSpan(mix`2. triangle base: area = (base × height to the base) ÷ 2.`, "2"),
          toSpan(
            mix`3. base area: ${M(`(${b} × ${bh}) ÷ 2 = ${baseArea}`)}.`,
            "3"
          ),
          toSpan(
            mix`4. volume: ${M(`${baseArea} × ${h} = ${prod}`)} → ${correctAnswer}${geometryVolumeSuffix(question)}.`,
            "4"
          ),
        ];
      }
      if (p.kind === "prism_volume_rectangular") {
        const L = p.baseLength;
        const W = p.baseWidth;
        const h = p.height;
        const baseArea = L * W;
        const prod = baseArea * h;
        return [
          toSpan(mix`1. Formula: prism volume = base area × height.`, "1"),
          toSpan(mix`2. rectangular base: ${M(`${L} × ${W} = ${baseArea}`)}.`, "2"),
          toSpan(mix`3. volume: ${M(`${baseArea} × ${h} = ${prod}`)}.`, "3"),
          toSpan(mix`4. ${resultPhraseVolume(question, correctAnswer)}`, "4"),
        ];
      }
      if (shape === "cube") {
        return [
          toSpan(
            mix`1. Identify: cube — three identical dimensions. Volume = how many 'unit cubes' fit inside; not the area of a face nor the perimeter.`,
            "1"
          ),
          toSpan(mix`2. Formula: cube volume = side × side × side = side³.`, "2"),
          toSpan(mix`3. substitute: ${M(`${p.side}³`)}.`, "3"),
          toSpan(
            mix`4. compute: ${M(`${p.side} × ${p.side} × ${p.side} = ${correctAnswer}`)}.`,
            "4"
          ),
          toSpan(mix`5. ${resultPhraseVolume(question, correctAnswer)}`, "5"),
        ];
      }
      if (shape === "rectangular_prism") {
        const product = p.length * p.width * p.height;
        return [
          toSpan(mix`1. Formula: box volume = length × width × height.`, "1"),
          toSpan(mix`2. substitute: ${M(`${p.length} × ${p.width} × ${p.height}`)}.`, "2"),
          toSpan(mix`3. compute: ${M(`${p.length} × ${p.width} × ${p.height} = ${product}`)}.`, "3"),
          toSpan(mix`4. ${resultPhraseVolume(question, correctAnswer)}`, "4"),
        ];
      }
      if (shape === "cylinder") {
        const r2 = p.radius * p.radius;
        return [
          toSpan(mix`1. Formula: cylinder volume = π × radius² × height.`, "1"),
          toSpan(mix`2. substitute: ${M(`3.14 × ${p.radius}² × ${p.height}`)}.`, "2"),
          toSpan(
            mix`3. compute: ${M(`${p.radius}² = ${r2}`)}, then ${M(`3.14 × ${r2} × ${p.height} = ${correctAnswer}`)}.`,
            "3"
          ),
          toSpan(mix`4. ${resultPhraseVolume(question, correctAnswer)}`, "4"),
        ];
      }
      if (shape === "sphere") {
        const r3 = p.radius * p.radius * p.radius;
        return [
          toSpan(mix`1. Formula: sphere volume = (4/3) × π × radius³.`, "1"),
          toSpan(mix`2. substitute: ${M(`(4/3) × 3.14 × ${p.radius}³`)}.`, "2"),
          toSpan(
            mix`3. compute: ${M(`${p.radius}³ = ${r3}`)}, then ${M(`(4/3) × 3.14 × ${r3} = ${correctAnswer}`)}.`,
            "3"
          ),
          toSpan(mix`4. ${resultPhraseVolume(question, correctAnswer)}`, "4"),
        ];
      }
      break;
    }

    case "angles": {
      const angle1 = p.angle1 || 0;
      const angle2 = p.angle2 || 0;
      const sum = angle1 + angle2;
      return [
        toSpan(
          mix`1. Recall: the sum of the three interior angles of a triangle is always 180° - do not confuse it with a single right angle (90°).`,
          "1"
        ),
        toSpan(
          mix`2. what is stated in the question: ${M(`angle 1 = ${angle1}°`)} and ${M(`angle 2 = ${angle2}°`)} - find the third angle.`,
          "2"
        ),
        toSpan(
          mix`3. compute: ${M(`180° - (${angle1}° + ${angle2}°) = 180° - ${sum}° = ${correctAnswer}°`)}.`,
          "3"
        ),
        toSpan(mix`4. the missing angle is ${correctAnswer}°.`, "4"),
      ];
    }

    case "pythagoras": {
      const a = p.a || 0;
      const b = p.b || 0;
      const c = p.c || 0;
      const kind = p.kind || (p.which ? "pythagoras_leg" : "pythagoras_hyp");

      // Mode 1 — finding the hypotenuse (classic)
      if (kind === "pythagoras_hyp" || !p.which) {
        const a2 = a * a;
        const b2 = b * b;
        const sum = a2 + b2;
        return [
          toSpan(
            mix`1. In a right triangle: the two sides next to the right angle are the legs; the hypotenuse is opposite the right angle and is the longest side. Formula: a² + b² = c².`,
            "1"
          ),
          toSpan(mix`2. substitute the legs: ${M(`${a}² + ${b}² = c²`)}.`, "2"),
          toSpan(mix`3. compute the squares: ${M(`${a}² = ${a2}`)} and ${M(`${b}² = ${b2}`)}.`, "3"),
          toSpan(mix`4. add: ${M(`${a2} + ${b2} = ${sum}`)}.`, "4"),
          toSpan(
            mix`5. take the square root for the hypotenuse: ${M(`c = √${sum} = ${correctAnswer}`)}${geometryLengthSuffix(question)}.`,
            "5"
          ),
        ];
      }

      // Mode 2 — finding the missing leg (more advanced)
      const c2 = c * c;
      const missingLeg = p.which === "leg_a" ? "a" : "b";
      const knownLegValue = p.which === "leg_a" ? b : a;
      const known2 = knownLegValue * knownLegValue;
      const diff = c2 - known2;

      return [
        toSpan(
          mix`1. the same formula a² + b² = c² - When finding a leg, isolate its square: the square of the hypotenuse minus the square of the known leg.`,
          "1"
        ),
        toSpan(
          mix`2. here we look for ${missingLeg}, so ${M(`${missingLeg}² = c² - ${knownLegValue}²`)} (do not add the legs if one side is missing).`,
          "2"
        ),
        toSpan(mix`3. compute the squares: ${M(`${c}² = ${c2}`)} and ${M(`${knownLegValue}² = ${known2}`)}.`, "3"),
        toSpan(mix`4. subtract: ${M(`${c2} - ${known2} = ${diff}`)}.`, "4"),
        toSpan(
          mix`5. missing leg: ${M(`${missingLeg} = √${diff} = ${correctAnswer}`)}${geometryLengthSuffix(question)}.`,
          "5"
        ),
      ];
    }

    case "shapes_basic": {
      if (p.kind === "shapes_basic_square" || p.kind === "shapes_basic_rectangle") {
        const shapeName = p.shape || "square";
        return [
          toSpan(mix`1. Check the side lengths from the data — the shape appears "${shapeName}".`, "1"),
          toSpan(
            shapeName === "square"
              ? "2. In a square the four sides are the same length."
              : "2. A rectangle has two different lengths, each appearing in an opposite pair.",
            "2"
          ),
          toSpan(mix`3. Choose the matching shape name — "${shapeName}".`, "3"),
          toSpan(mix`4. so the correct answer is "${shapeName}".`, "4"),
        ];
      }
      if (p.kind === "shapes_basic_properties_square") {
        return [
          toSpan(mix`1. The question asks how many equal sides a square has — not perimeter or area.`, "1"),
          toSpan(mix`2. In a square all four sides are the same length.`, "2"),
          toSpan(
            mix`3. the number of equal sides is ${correctAnswer} - Choose this answer value among the options.`,
            "3"
          ),
        ];
      }
      if (p.kind === "shapes_basic_properties_rectangle") {
        return [
          toSpan(mix`1. The question asks how many pairs of equal sides a rectangle has.`, "1"),
          toSpan(mix`2. A rectangle has two different lengths; each length appears in exactly one opposite pair.`, "2"),
          toSpan(
            mix`3. exactly two equal pairs are formed — the numeric answer is ${correctAnswer}.`,
            "3"
          ),
        ];
      }
      if (p.kind === "shapes_basic_properties_angles") {
        const shapeName = p.shape || "square";
        return [
          toSpan(mix`1. ${shapeName} a quadrilateral with four interior angles.`, "1"),
          toSpan(mix`2. In a square and a rectangle all four angles are right (90°).`, "2"),
          toSpan(
            mix`3. the number of right angles: ${correctAnswer} - choose this value in the options.`,
            "3"
          ),
        ];
      }
      return [];
    }

    case "parallel_perpendicular": {
      const type = p.type || "parallel";
      const opt = type === "parallel" ? "1 (parallel)" : "2 (perpendicular)";
      return [
        toSpan(mix`1. the name in the question is: "${type}".`, "1"),
        toSpan(
          type === "parallel"
            ? "2. Parallel lines in the same plane do not intersect and keep a constant distance."
            : "2. Perpendicular lines intersect at a right angle (90°).",
          "2"
        ),
        toSpan(
          mix`3. by the answer key in the question: 1 = parallel, 2 = perpendicular.`,
          "3"
        ),
        toSpan(mix`4. match: ${opt}.`, "4"),
      ];
    }

    case "triangles": {
      const type = p.type || "equilateral";
      const idx =
        type === "equilateral" ? 1 : type === "isosceles" ? 2 : 3;
      return [
        toSpan(mix`1. Classify the triangle by equal side lengths — the name in the question: "${type}".`, "1"),
        toSpan(
          type === "equilateral"
            ? "2. In an equilateral triangle all three sides are the same length."
            : type === "isosceles"
            ? "2. In an isosceles triangle exactly two sides are equal."
            : "2. In a scalene triangle all three lengths are different.",
          "2"
        ),
        toSpan(
          mix`3. key in the question: 1 = equilateral, 2 = isosceles, 3 = scalene.`,
          "3"
        ),
        toSpan(mix`4. so the correct option is ${idx}.`, "4"),
      ];
    }

    case "quadrilaterals": {
      const type = p.type || "square";
      const types = ["square", "rectangle", "parallelogram", "trapezoid"];
      const idx = Math.max(1, types.indexOf(type) + 1);
      return [
        toSpan(mix`1. Identify a quadrilateral by its sides and angles — here: "${type}".`, "1"),
        toSpan(
          type === "square"
            ? "2. Square: four equal sides and four right angles."
            : type === "rectangle"
            ? "2. Rectangle: two pairs of equal sides and four right angles."
            : type === "parallelogram"
            ? "2. Parallelogram: each side is parallel to its opposite side (not necessarily right angles at the corners)."
            : "2. Trapezoid: one pair of parallel sides (the bases).",
          "2"
        ),
        toSpan(
          mix`3. key: 1 = square, 2 = rectangle, 3 = parallelogram, 4 = trapezoid.`,
          "3"
        ),
        toSpan(mix`4. the number that matches "${type}" is ${idx}.`, "4"),
      ];
    }

    case "transformations": {
      const type = p.type || "translation";
      const opt = type === "translation" ? "1 (translation)" : "2 (reflection)";
      return [
        toSpan(mix`1. the type of transformation in the question: "${type}".`, "1"),
        toSpan(
          type === "translation"
            ? "2. Translation: every point moves by the same vector — the shape does not flip."
            : "2. reflection: a shape 'flips' relative to a line — like a mirror.",
          "2"
        ),
        toSpan(mix`3. in the key: 1 = translation, 2 = reflection.`, "3"),
        toSpan(mix`4. so we choose ${opt}.`, "4"),
      ];
    }

    case "rotation": {
      const angle = p.angle || 90;
      return [
        toSpan(mix`1. Rotation is measured in degrees around a center point.`, "1"),
        toSpan(mix`2. The question asks for the rotation angle — here ${angle}°.`, "2"),
        toSpan(
          angle === 90
            ? "3. 90° = a quarter of a full turn."
            : angle === 180
            ? "3. 180° = a half turn."
            : "3. 270° = three quarters of a turn.",
          "3"
        ),
        toSpan(mix`4. the answer in degrees: ${angle}.`, "4"),
      ];
    }

    case "symmetry": {
      const shapeName = p.shape || "square";
      const axes = p.axes ?? 4;
      return [
        toSpan(mix`1. Axis of symmetry: a line that splits the shape into two matching halves (like a mirror).`, "1"),
        toSpan(
          shapeName === "square"
            ? "2. In a square: 4 axes — 2 through midpoints of opposite sides and 2 diagonals."
            : shapeName === "rectangle"
            ? "2. In a non-square rectangle: 2 axes through midpoints of opposite sides."
            : "2. In an equilateral triangle: 3 axes — from each vertex to the midpoint of the opposite side.",
          "2"
        ),
        toSpan(mix`3. careful counting by the shape type "${shapeName}".`, "3"),
        toSpan(mix`4. the number of axes of symmetry: ${axes}.`, "4"),
      ];
    }

    case "diagonal": {
      if (p.kind === "diagonal_square") {
        const side = p.side || 1;
        return [
          toSpan(mix`1. A diagonal is a segment connecting two vertices not on the same side.`, "1"),
          toSpan(mix`2. in a square with side ${side}, The diagonal is computed using the Pythagorean theorem.`, "2"),
          toSpan(mix`3. compute: ${M(`diagonal = √(${side}² + ${side}²) = √(${side * side * 2}) = ${correctAnswer}`)}.`, "3"),
        ];
      } else if (p.kind === "diagonal_rectangle") {
        const side = p.side || 1;
        const width = p.width || 1;
        return [
          toSpan(mix`1. A diagonal is a segment connecting two vertices not on the same side.`, "1"),
          toSpan(mix`2. in a rectangle with length ${side} and width ${width}, The diagonal is computed using the Pythagorean theorem.`, "2"),
          toSpan(mix`3. compute: ${M(`diagonal = √(${side}² + ${width}²) = √(${side * side + width * width}) = ${correctAnswer}`)}.`, "3"),
        ];
      } else if (p.kind === "diagonal_parallelogram") {
        const side = p.side || 1;
        const width = p.width || 1;
        return [
          toSpan(mix`1. A diagonal is a segment connecting two vertices not on the same side.`, "1"),
          toSpan(mix`2. in a parallelogram with sides ${side} and ${width}, The diagonal is computed using the Pythagorean theorem.`, "2"),
          toSpan(mix`3. compute: ${M(`diagonal = √(${side}² + ${width}²) = √(${side * side + width * width}) = ${correctAnswer}`)}.`, "3"),
        ];
      }
      return [];
    }

    case "heights": {
      if (p.shape === "triangle") {
        const base = p.base || 1;
        const area = p.area || 1;
        return [
          toSpan(mix`1. The height of a triangle is the distance from the vertex to the base.`, "1"),
          toSpan(mix`2. Formula: area = (base × height) ÷ 2.`, "2"),
          toSpan(mix`3. substitute: ${M(`${area} = (${base} × height) ÷ 2`)}.`, "3"),
          toSpan(mix`4. compute: ${M(`height = (${area} × 2) ÷ ${base} = ${correctAnswer}`)}.`, "4"),
        ];
      } else if (p.shape === "parallelogram") {
        const base = p.base || 1;
        const area = p.area || 1;
        return [
          toSpan(mix`1. The height of a parallelogram is the distance between the two parallel sides.`, "1"),
          toSpan(mix`2. Formula: area = base × height.`, "2"),
          toSpan(mix`3. substitute: ${M(`${area} = ${base} × height`)}.`, "3"),
          toSpan(mix`4. compute: ${M(`height = ${area} ÷ ${base} = ${correctAnswer}`)}.`, "4"),
        ];
      } else if (p.shape === "trapezoid") {
        const base1 = p.base1 || 1;
        const base2 = p.base2 || 1;
        const area = p.area || 1;
        const sumBases = base1 + base2;
        return [
          toSpan(mix`1. The height of a trapezoid is the distance between the two parallel bases.`, "1"),
          toSpan(mix`2. Formula: area = ((base 1 + base 2) × height) ÷ 2.`, "2"),
          toSpan(mix`3. substitute: ${M(`${area} = ((${base1} + ${base2}) × height) ÷ 2`)}.`, "3"),
          toSpan(mix`4. compute: ${M(`${base1} + ${base2} = ${sumBases}`)}, then ${M(`height = (${area} × 2) ÷ ${sumBases} = ${correctAnswer}`)}.`, "4"),
        ];
      }
      return [];
    }

    case "tiling": {
      // tiling_count: how many tiles cover a given area
      if (p.kind === "tiling_count") {
        const tileSide = p.tileSide || 1;
        const floorL = p.floorL || 1;
        const floorW = p.floorW || 1;
        const tileArea = p.tileArea || tileSide * tileSide;
        const floorArea = p.floorArea || floorL * floorW;
        return [
          toSpan(mix`1. the floor area: ${M(`${floorL} × ${floorW} = ${floorArea}`)}.`, "1"),
          toSpan(mix`2. the area of one tile: ${M(`${tileSide} × ${tileSide} = ${tileArea}`)}.`, "2"),
          toSpan(mix`3. number of tiles: ${M(`${floorArea} ÷ ${tileArea} = ${correctAnswer}`)}.`, "3"),
        ];
      }
      const shape = p.shape || "square";
      const angle = p.angle || 90;
      return [
        toSpan(mix`1. In tiling, around each vertex the angle sum must be exactly 360°.`, "1"),
        toSpan(
          shape === "square" || shape === "rectangle"
            ? "2. a square and a rectangle have an interior angle of 90° - 4 × 90° = 360°."
            : shape === "equilateral triangle"
            ? "2. In an equilateral triangle each interior angle is 60° - 6 × 60° = 360°."
            : "2. in a hexagon each interior angle is 120° - 3 × 120° = 360°.",
          "2"
        ),
        toSpan(mix`3. in the shape "${shape}" the interior angle is ${angle}°.`, "3"),
        toSpan(mix`4. so the answer: ${angle}°.`, "4"),
      ];
    }

    case "circles": {
      const radius = p.radius || 1;
      const askArea = p.askArea;
      if (askArea) {
        const r2 = radius * radius;
        return [
          toSpan(mix`1. Formula: circle area = π × radius².`, "1"),
          toSpan(mix`2. substitute: ${M(`area = 3.14 × ${radius}²`)}.`, "2"),
          toSpan(mix`3. compute: ${M(`${radius}² = ${r2}`)}, then ${M(`3.14 × ${r2} = ${correctAnswer}`)}.`, "3"),
        ];
      } else {
        return [
          toSpan(mix`1. Formula: circle circumference = 2 × π × radius.`, "1"),
          toSpan(mix`2. substitute: ${M(`2 × 3.14 × ${radius}`)}.`, "2"),
          toSpan(mix`3. compute: ${M(`2 × 3.14 = 6.28`)}, then ${M(`6.28 × ${radius} = ${correctAnswer}`)}.`, "3"),
        ];
      }
    }

    case "solids": {
      const solid = p.solid || "cube";
      const kind = p.kind || "solids";

      if (kind === "solids_faces") {
        const faces = p.faces ?? correctAnswer;
        return [
          toSpan(mix`1. Question: how many faces does${solid}?`, "1"),
          toSpan(mix`2. Count every flat or curved surface of the solid.`, "2"),
          toSpan(mix`3. to${solid} there is ${faces} faces.`, "3"),
        ];
      }

      if (kind === "solids_vertices") {
        const vertices = p.vertices ?? correctAnswer;
        return [
          toSpan(mix`1. Question: how many vertices does${solid}?`, "1"),
          toSpan(mix`2. vertex = a point where at least two sides meet.`, "2"),
          toSpan(mix`3. to${solid} there is ${vertices} vertices.`, "3"),
        ];
      }

      if (kind === "solids_edges") {
        const edges = p.edges ?? correctAnswer;
        return [
          toSpan(mix`1. Question: how many sides does${solid}?`, "1"),
          toSpan(mix`2. side = an edge where two faces meet.`, "2"),
          toSpan(mix`3. to${solid} there is ${edges} sides.`, "3"),
        ];
      }

      // identify a solid by description (kind: "solids")
      const desc = p.desc || "";
      const key =
        solid === "cube"
          ? "6 identical square faces — key 1."
          : solid === "box"
          ? "6 rectangular faces (not necessarily squares) — key 2."
          : solid === "cylinder"
          ? "2 round bases and a curved surface — key 3."
          : solid === "pyramid"
          ? "A polygon base and triangular faces meeting at a vertex — key 4."
          : solid === "cone"
          ? "a round base and a single vertex — key 5."
          : solid === "sphere"
          ? "All points on the surface are at a constant distance from the center — key 6."
          : "match the description to the solid.";
      return [
        toSpan(mix`1. in the description: "${desc}".`, "1"),
        toSpan(mix`2. identify by features: ${key}`, "2"),
        toSpan(mix`3. the matching solid's name: ${solid}.`, "3"),
      ];
    }

    default:
      return [];
  }

  return [];
}

// "Why was I wrong?" – Common mistakes by topic / shape / parameters
export function getErrorExplanation(question, topic, wrongAnswer, gradeKey) {
  if (!question) return "";
  const userAnsNum = Number(wrongAnswer);
  const correctNum = Number(question.correctAnswer);
  const sh = question.shape;
  const p = question.params || {};

  switch (topic) {
    case "area": {
      const side = toNum(p.side);
      const L = toNum(p.length);
      const W = toNum(p.width);
      const base = toNum(p.base);
      const ht = toNum(p.height);
      const r = toNum(p.radius);
      if (sh === "square" && side > 0 && userAnsNum === 4 * side) {
        return mix`It looks like you computed perimeter (${M("4 ×")}side) instead of area (${M("side × side")}).`;
      }
      if (sh === "rectangle" && L > 0 && W > 0 && userAnsNum === 2 * (L + W)) {
        return mix`It looks like you computed perimeter instead of area — multiply ${M("length × width")}, not a double sum.`;
      }
      if (sh === "triangle" && base > 0 && ht > 0 && userAnsNum === base * ht) {
        return mix`It looks like you multiplied ${M("base × height")} but you forgot to divide by ${M("2")} (the triangle area formula).`;
      }
      if (sh === "parallelogram" && base > 0 && ht > 0 && userAnsNum === (base * ht) / 2) {
        return mix`in a parallelogram the base area is ${M("base × height")} - with no division by ${M("2")} (this applies to a triangle).`;
      }
      if (sh === "circle" && r > 0 && !Number.isNaN(userAnsNum)) {
        const circ = Math.round(2 * 3.14 * r);
        if (userAnsNum === circ) {
          return mix`It looks like you computed perimeter (${M("2πr")}) instead of area (${M("π × radius²")}).`;
        }
        if (userAnsNum === Math.round(3.14 * r)) {
          return mix`area needs the radius squared (${M("πr²")}), not only ${M("π × r")}.`;
        }
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum < correctNum) {
        return "Result too small: maybe you missed a multiplication, divided too much, or used the perimeter formula.";
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum > correctNum) {
        return "Result too large: maybe you forgot to divide by 2 for a triangle/trapezoid, or multiplied twice instead of once.";
      }
      return mix`Check that this is an area formula (not perimeter): square ${M("side²")}, rectangle ${M("length×width")}, triangle ${M("(base×height)/2")}, circle ${M("πr²")}.`;
    }

    case "perimeter": {
      const side = toNum(p.side);
      const L = toNum(p.length);
      const W = toNum(p.width);
      const r = toNum(p.radius);
      if (sh === "square" && side > 0 && userAnsNum === side * side) {
        return mix`It looks like you computed area (${M("side²")}) instead of perimeter (${M("4 ×")}side).`;
      }
      if (sh === "rectangle" && L > 0 && W > 0 && userAnsNum === L * W) {
        return mix`It looks like you computed area (${M("length × width")}) instead of perimeter (${M("the sum of the sides × 2")}).`;
      }
      if (sh === "circle" && r > 0) {
        const ar = Math.round(3.14 * r * r);
        if (userAnsNum === ar) {
          return mix`It looks like you computed the circle's area instead of its perimeter (${M("2πr")}).`;
        }
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum < correctNum) {
        return "Perimeter too small: maybe you forgot to multiply by 2 for a rectangle or by 4 for a square, or missed a side in the sum.";
      }
      return mix`perimeter = the sum of all sides (or ${M("2πr")} in a circle) — not a product like area.`;
    }

    case "volume": {
      const k = p.kind || "";
      if (
        (k === "pyramid_volume_square" || k === "pyramid_volume_rectangular" || k === "cone_volume") &&
        !Number.isNaN(userAnsNum) &&
        !Number.isNaN(correctNum) &&
        correctNum > 0 &&
        Math.abs(userAnsNum - 3 * correctNum) <= 1
      ) {
        return "It looks like you forgot the factor ⅓ In a pyramid or cone — the volume is one third of the volume \"the page\" with the same base and height.";
      }
      if (k === "prism_volume_triangle" || k === "prism_volume_rectangular") {
        const baseA = toNum(p.baseArea);
        const h = toNum(p.height);
        if (baseA > 0 && h > 0 && userAnsNum === Math.round(baseA + h)) {
          return mix`prism volume = ${M("base area × height")}, not a sum of areas + height.`;
        }
      }
      if (sh === "cube" && toNum(p.side) > 0 && userAnsNum === toNum(p.side) * toNum(p.side)) {
        return mix`It looks like you computed ${M("side²")} (a face's area) instead of ${M("side³")} for volume.`;
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum < correctNum) {
        return "Volume too small: maybe you missed one dimension in the product, or applied ⅓ when it was not needed (box/prism).";
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum > correctNum) {
        return "Volume too large: maybe you forgot ⅓ for a pyramid/cone, or multiplied a dimension twice unnecessarily.";
      }
      return mix`Volume of a box/prism: three dimensions multiplied. Pyramid/cone: ${M("(⅓)×base area×height")} (and with ${M("π")} in a cone).`;
    }

    case "angles": {
      const a1 = toNum(p.angle1);
      const a2 = toNum(p.angle2);
      if (!Number.isNaN(userAnsNum) && !Number.isNaN(a1) && !Number.isNaN(a2)) {
        if (userAnsNum === a1 + a2) {
          return mix`you added the two angles — you need to subtract the sum from ${M("180°")}.`;
        }
        if (userAnsNum === 180 - Math.abs(a1 - a2)) {
          return mix`Check: the third angle is ${M("180°")} minus the sum of the two given angles.`;
        }
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum > correctNum) {
        return mix`Result too large: maybe you added instead of subtracting from ${M("180°")}.`;
      }
      return mix`in a triangle the sum of angles = ${M("180°")}. the missing angle = ${M("180° − (angle 1 + angle 2)")}.`;
    }

    case "pythagoras": {
      const a = toNum(p.a);
      const b = toNum(p.b);
      const c = toNum(p.c);
      if (!Number.isNaN(userAnsNum) && userAnsNum === a + b && p.kind !== "pythagoras_leg") {
        return mix`do not add the legs to get the hypotenuse — you need ${M("a² + b²")} then a square root.`;
      }
      if (p.kind === "pythagoras_leg" && !Number.isNaN(userAnsNum) && userAnsNum === c) {
        return mix`the missing leg is asked — usually ${M("√(c² − leg²)")}, not the length of the hypotenuse itself.`;
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum < correctNum) {
        return "Answer too small: maybe you forgot the square root after summing the squares, or forgot to square.";
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum > correctNum) {
        return mix`Answer too large: maybe you squared instead of taking a root, or added ${M("a+b")} instead of ${M("√(a²+b²)")}.`;
      }
      return mix`right triangle: ${M("a² + b² = c²")}. the hypotenuse is opposite the right angle, the legs are adjacent.`;
    }

    case "shapes_basic": {
      if (p.kind === "shapes_basic_square" || p.kind === "shapes_basic_rectangle") {
        const userAns = String(wrongAnswer ?? "").trim();
        if (userAns === "rectangle" && p.shape === "square") {
          return "All four sides of a square are equal — not a rectangle with two different lengths.";
        }
        if (userAns === "square" && p.shape === "rectangle") {
          return "A rectangle is determined by two different side lengths (two pairs) — not a square.";
        }
        return "Compare all the sides: four equal ⇒ square; two different lengths in pairs ⇒ rectangle.";
      }
      if (p.kind === "shapes_basic_properties_square") {
        return "The question asks how many equal sides — a square has four. Do not mix it up with the number of pairs or angles.";
      }
      if (p.kind === "shapes_basic_properties_rectangle") {
        return "The question asks how many pairs of equal sides — a rectangle has two pairs (long/short), not four separate sides.";
      }
      if (p.kind === "shapes_basic_properties_angles") {
        return "A square and a rectangle have four right angles — not two or three.";
      }
      return "We distinguished side properties from angles, and a square from a rectangle.";
    }

    case "parallel_perpendicular": {
      if (p.isParallel === true && userAnsNum === 2) {
        return "The question is about parallel lines — lines that never meet; 2 here marks perpendicular.";
      }
      if (p.isParallel === false && userAnsNum === 1) {
        return "The question is about perpendicular lines — meeting at a right angle; 1 here marks parallel.";
      }
      return mix`parallel: never meet in the same plane. perpendicular: meet at ${M("90°")}.`;
    }

    case "triangles":
      return mix`The number in the question must match the family name: ${M("1 equilateral (all equal), 2 isosceles (two equal), 3 scalene")}.`;

    case "quadrilaterals":
      return "Check pairs of parallel sides and angles: square/rectangle — four right angles; parallelogram — two pairs of parallel sides; trapezoid — one pair of parallel bases.";

    case "transformations":
      if (!Number.isNaN(userAnsNum) && userAnsNum === 2 && p.isTranslation) {
        return "Translation is option 1 in the question — not reflection.";
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum === 1 && p.isTranslation === false) {
        return "Reflection is option 2 — not translation.";
      }
      return "A translation keeps the shape's orientation; a reflection creates a mirror image.";

    case "rotation":
      if (!Number.isNaN(userAnsNum) && [90, 180, 270].includes(userAnsNum) && userAnsNum !== correctNum) {
        return mix`Check whether a quarter turn is needed (${M("90°")}), half (${M("180°")}) or three quarters (${M("270°")}).`;
      }
      return "Rotation is measured in full degrees around a point — match the question's wording.";

    case "symmetry": {
      const ax = toNum(p.axes);
      if (!Number.isNaN(userAnsNum) && !Number.isNaN(ax) && userAnsNum === ax + 1) {
        return "maybe you counted one axis twice — count only true axes of symmetry for the shape.";
      }
      return mix`square ${M("4")}, rectangle (not a square) ${M("2")}, equilateral triangle ${M("3")} - by the form of the question.`;
    }

    case "diagonal":
      if (p.kind === "diagonal_square") {
        const s = toNum(p.side);
        if (s > 0 && userAnsNum === 2 * s) {
          return mix`maybe you multiplied a side by ${M("2")} - for a square's diagonal use ${M("√2 × side")}.`;
        }
        if (s > 0 && userAnsNum === s * s) {
          return mix`the diagonal is not the side's area — try ${M("√(side²+side²)")} or ${M("side×√2")}.`;
        }
        return mix`a square's diagonal: ${M("side × √2")} (a right triangle with two equal legs).`;
      }
      if (p.kind === "diagonal_rectangle" || p.kind === "diagonal_parallelogram") {
        return mix`Use the Pythagorean theorem with the two legs from the question — ${M("√(length² + width²)")}.`;
      }
      return "the diagonal as the hypotenuse of a right triangle built from the sides.";

    case "heights": {
      if (p.shape === "triangle") {
        const ba = toNum(p.base);
        const ar = toNum(p.area);
        if (ba > 0 && ar > 0 && userAnsNum === Math.round(ar / ba)) {
          return "maybe you divided area by the base without first multiplying the area by 2 (the triangle formula).";
        }
        return mix`a triangle's height: ${M("(area × 2) ÷ base")}.`;
      }
      if (p.shape === "parallelogram") {
        const ba = toNum(p.base);
        const ar = toNum(p.area);
        if (ba > 0 && ar > 0 && userAnsNum === Math.round((ar * 2) / ba)) {
          return mix`a parallelogram has no division by ${M("2")} in area — height = ${M("area ÷ base")}.`;
        }
        return mix`a parallelogram's height: ${M("area ÷ base")}.`;
      }
      if (p.shape === "trapezoid") {
        return "In a trapezoid you must first add the two bases in the area before isolating the height.";
      }
      return "Isolate the height by inverting the area formula of the same shape.";
    }

    case "tiling": {
      if (!Number.isNaN(userAnsNum) && userAnsNum === 360) {
        return mix`${M("360°")} is the sum around a point — not the base angle of the tiling shape.`;
      }
      return mix`The tiling angle is the interior angle of the tile shape (square ${M("90°")}, equilateral triangle ${M("60°")}, hexagon ${M("120°")}).`;
    }

    case "circles": {
      if (p.askArea) {
        const r = toNum(p.radius);
        const circ = Math.round(2 * 3.14 * r);
        if (userAnsNum === circ) {
          return mix`Area is given but you computed like a perimeter — use ${M("π × radius²")}.`;
        }
        return mix`area: ${M("πr²")}. If you got too small — maybe you forgot to square the ${M("r")} in a square.`;
      }
      const r = toNum(p.radius);
      const ar = Math.round(3.14 * r * r);
      if (userAnsNum === ar) {
        return mix`Perimeter is given but you computed like an area — use ${M("2πr")}.`;
      }
      return mix`distinction: ${M("area ∝ r², perimeter ∝ r")} - Do not confuse the formulas.`;
    }

    case "solids":
      return "Match the description of the faces and base in the question to a solid in the list — cube (6 identical squares), rectangular prism (rectangles), cylinder (2 circles), pyramid (base+triangles), cone (circle+vertex), sphere.";

    default:
      return "";
  }
}

/**
 * steps to UI of the explanation player (like math animationSteps): each item = one step with a title and content.
 */
export function buildGeometryAnimationSteps(question, topic, gradeKey) {
  const slides = getSolutionSteps(question, topic, gradeKey);
  if (!Array.isArray(slides) || slides.length === 0) return [];
  return enrichGeometryAnimationSteps(question, topic, gradeKey, slides);
}

// A short theory summary by topic and grade — shown before the question in mode Learning
export function getTheorySummary(question, topic, gradeKey) {
  if (!question) return null;

  const lines = [];

  switch (topic) {
    case "area": {
      lines.push("Area measures how much space a shape takes up on a surface.");
      if (gradeKey === "g2" || gradeKey === "g3") {
        lines.push("square: area = side × side.");
        lines.push("rectangle: area = length × width.");
      } else if (gradeKey === "g4") {
        lines.push("square: area = side × side.");
        lines.push("rectangle: area = length × width.");
        lines.push("triangle: area = (base × height) ÷ 2.");
      } else if (gradeKey === "g5") {
        lines.push("square: area = side × side.");
        lines.push("rectangle: area = length × width.");
        lines.push("triangle: area = (base × height) ÷ 2.");
        lines.push("parallelogram: area = base × height.");
        lines.push("trapezoid: area = ((base 1 + base 2) × height) ÷ 2.");
      } else {
        // g6
        lines.push("square: area = side².");
        lines.push("rectangle: area = length × width.");
        lines.push("triangle: area = (base × height) ÷ 2.");
        lines.push("parallelogram: area = base × height.");
        lines.push("trapezoid: area = ((base 1 + base 2) × height) ÷ 2.");
        lines.push("circle: area = π × radius².");
      }
      break;
    }

    case "perimeter": {
      lines.push("Perimeter measures the length of the path around the shape.");
      lines.push("always add all the sides.");
      if (gradeKey === "g2" || gradeKey === "g3") {
        lines.push("square: perimeter = side × 4.");
        lines.push("rectangle: perimeter = (length + width) × 2.");
      } else {
        lines.push("for every shape: perimeter = the sum of all side lengths.");
        if (gradeKey === "g4" || gradeKey === "g5" || gradeKey === "g6") {
          lines.push("circle: circumference = 2 × π × radius.");
        }
      }
      break;
    }

    case "volume": {
      lines.push("Volume measures how much space a solid takes up (three-dimensional).");
      if (gradeKey === "g5") {
        lines.push("cube: volume = side³.");
        lines.push("box (rectangular): volume = length × width × height.");
      } else {
        // g6
        lines.push("cube: volume = side³.");
        lines.push("box: volume = length × width × height.");
        lines.push("cylinder: volume = π × radius² × height.");
        lines.push("sphere: volume = (4/3) × π × radius³.");
      }
      break;
    }

    case "angles": {
      lines.push("In every triangle: the sum of the interior angles is 180°.");
      lines.push("If two angles are known — find the third using 180° minus their sum.");
      break;
    }

    case "pythagoras": {
      lines.push("in a right triangle: a² + b² = c² (c is the hypotenuse).");
      lines.push("If both legs are known — find the hypotenuse: c = √(a² + b²).");
      lines.push("If the hypotenuse and one leg are known — find the missing leg: √(c² - leg²).");
      break;
    }

    case "shapes_basic": {
      if (gradeKey === "g1") {
        lines.push("Square: 4 equal sides, 4 right angles.");
        lines.push("Rectangle: 2 pairs of equal sides, 4 right angles.");
      } else {
        // Grade 4' - properties
        lines.push("Square: 4 equal sides, 4 right angles (90°).");
        lines.push("Rectangle: 2 pairs of equal sides, 4 right angles (90°).");
        lines.push("Square: all 4 sides are equal in length.");
        lines.push("Rectangle: it has 2 pairs of equal sides (one long pair and one short pair).");
      }
      break;
    }

    case "parallel_perpendicular": {
      lines.push("Parallel lines: never meet.");
      lines.push("Perpendicular lines: form a right angle (90°).");
      break;
    }

    case "triangles": {
      lines.push("Equilateral triangle: all 3 sides are equal.");
      lines.push("Isosceles triangle: 2 equal sides.");
      lines.push("Scalene triangle: all sides are different.");
      break;
    }

    case "quadrilaterals": {
      lines.push("Square: 4 equal sides, 4 right angles.");
      lines.push("Rectangle: 2 pairs of equal sides, 4 right angles.");
      lines.push("Parallelogram: 2 pairs of parallel sides.");
      lines.push("Trapezoid: one pair of parallel sides.");
      break;
    }

    case "transformations": {
      lines.push("Translation: copies the shape in the same direction and distance.");
      lines.push("Reflection: flips the shape about a line (axis).");
      break;
    }

    case "rotation": {
      lines.push("Rotation: moves the shape around a point.");
      lines.push("a 90-degree rotation° = a quarter turn, 180° = a half turn, 360° = a full turn.");
      break;
    }

    case "symmetry": {
      lines.push("Symmetry: a shape that has an axis of symmetry.");
      lines.push("Square: 4 axes of symmetry, rectangle: 2 axes of symmetry.");
      break;
    }

    case "diagonal": {
      lines.push("Diagonal: a segment connecting two vertices not on the same side.");
      lines.push("square: diagonal = side × √2.");
      lines.push("rectangle: diagonal = √(length² + width²).");
      lines.push("parallelogram: diagonal = √(side 1² + side 2²).");
      break;
    }

    case "heights": {
      lines.push("height: the distance from the vertex to the base (in a triangle) or the distance between parallel sides (in a parallelogram/trapezoid).");
      lines.push("triangle: area = (base × height) ÷ 2, so the height = (area × 2) ÷ base.");
      lines.push("parallelogram: area = base × height, so the height = area ÷ base.");
      lines.push("trapezoid: area = ((base 1 + base 2) × height) ÷ 2, so the height = (area × 2) ÷ (base 1 + base 2).");
      break;
    }

    case "tiling": {
      lines.push("Tiling: covering a surface with no gaps.");
      lines.push("square: 90-degree angle°, Equilateral triangle: 60-degree angle°.");
      break;
    }

    case "circles": {
      lines.push("Circle: all points at an equal distance from the center.");
      lines.push("circle area = π × radius².");
      lines.push("circle circumference = 2 × π × radius.");
      break;
    }

    case "solids": {
      lines.push("Cube: 6 equal square faces.");
      lines.push("Rectangular prism: 6 rectangular faces.");
      lines.push("Cylinder: 2 round bases.");
      lines.push("Sphere: all points at an equal distance from the center.");
      break;
    }

    default: {
      lines.push("It is important to remember the formula that fits the topic and shape.");
    }
  }

  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "font-bold mb-1 text-[11px]" },
      "📘 What is important to remember?"
    ),
    React.createElement(
      "ul",
      { className: "list-disc pr-4 text-[11px] space-y-0.5 text-right" },
      lines.map((line, idx) => React.createElement("li", { key: idx }, line))
    )
  );
}

