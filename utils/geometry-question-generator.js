// יצירת שאלות גיאומטריה

import { burnDownCopy } from "../lib/learning/burn-down-copy.js";
import { GRADES, PI, getShapesForTopic, TOPICS } from "./geometry-constants.js";
import {
  isPrismVolumeTriangleAllowed,
  isTriangleAreaFormulaGradeAllowed,
} from "./geometry-curriculum-gates.js";
import {
  pickGeometryConceptualQuestion,
  geometryConceptualProbability,
} from "./geometry-conceptual-bank.js";
import { gradeBandForKey } from "./grade-gating.js";
import { enrichGeometryProceduralParams } from "./geometry-diagnostic-metadata-bridge.js";
import { attachCanonicalMetadataToMathGeometryQuestion } from "../lib/learning/math-geometry-canonical-metadata.js";
import { applyMcqEvidenceTaggingToQuestion } from "../lib/learning/mcq-option-evidence-tagging.js";
import { formatTriangleAnglesKnownTwoStem } from "./geometry-activity-question-stem.js";
import { pickValidTriangleSides } from "../lib/worksheets/worksheet-geometry-math-valid.js";
import { sanitizeQuestionForStudentDisplay } from "./student-question-stem-sanitizer.js";
import { localizeLearningQuestion } from "./learning-content-en/index.js";
import { repairMcqObviousAnswerContent } from "./mcq-fail-content-repair.js";

const GEOMETRY_TOPIC_LABEL_EN = Object.freeze({
  shapes_basic: "Basic shapes",
  area: "Area",
  perimeter: "Perimeter",
  volume: "Volume",
  angles: "Angles",
  parallel_perpendicular: "Parallel and perpendicular",
  triangles: "Triangles",
  quadrilaterals: "Quadrilaterals",
  transformations: "Transformations",
  rotation: "Rotation",
  symmetry: "Symmetry",
  diagonal: "Diagonal",
  heights: "Heights",
  tiling: "Tiling",
  circles: "Circles",
  solids: "Solids",
  pythagoras: "Pythagoras",
  mixed: "Mixed",
});

function geometryTopicLabelEn(topicKey) {
  return GEOMETRY_TOPIC_LABEL_EN[topicKey] || String(topicKey || "topic");
}

function shuffleMcqList(answers) {
  const arr = [...answers];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Remove child-facing (1 = …, 2 = …) legends from shapes_basic stems. */
function stripShapesBasicIndexLegend(text) {
  return String(text || "")
    .replace(/\s*\(\s*1\s*=\s*[^)]*\)/gu, "")
    .trim();
}

import {
  GEOMETRY_HEBREW_LABEL_OPTIONS,
  GEOMETRY_INDEX_LABEL_KINDS,
} from "./geometry-activity-answer-ui.js";

/**
 * מסיחים סבירים לפי סוג שאלה - לא לולאת 1..10 אקראית כשהקשר הוא שטח/נפח וכו'.
 */

function geometryIndexLabelAnswers(correctAnswer, optionCount) {
  const opts = Array.from({ length: optionCount }, (_, i) => String(i + 1));
  const correct = String(Math.round(Number(correctAnswer)));
  if (!opts.includes(correct)) return shuffleMcqList(opts);
  return shuffleMcqList(opts);
}

export function buildGeometryMcqAnswers({
  correctAnswer,
  params,
  level,
  round,
  selectedTopic,
  shape,
}) {
  const kind = params?.kind || "";
  const baseKind = kind.replace(/^story_/, "");
  const hebrewOpts = GEOMETRY_HEBREW_LABEL_OPTIONS[baseKind];
  if (hebrewOpts) {
    return shuffleMcqList(hebrewOpts);
  }
  const labelCount = GEOMETRY_INDEX_LABEL_KINDS[baseKind];
  if (labelCount) {
    return geometryIndexLabelAnswers(correctAnswer, labelCount);
  }

  // Solid identification: 4 EN buttons — correct + 3 distractors from the 6 solids
  if (baseKind === "solids") {
    const allSolids = ["Cube", "Cuboid", "Cylinder", "Pyramid", "Cone", "Sphere"];
    const ca4 = String(correctAnswer);
    const others = allSolids.filter((n) => n !== ca4);
    shuffleMcqList(others);
    const choices = [ca4, ...others.slice(0, 3)];
    return shuffleMcqList(choices);
  }

  const ca = Number(correctAnswer);
  const wrong = new Set();
  const r = (n) => round(n);

  const add = (x) => {
    if (x == null || Number.isNaN(Number(x))) return;
    const v = r(Number(x));
    const c = r(ca);
    if (v === c || v <= 0) return;
    if (wrong.size < 3) wrong.add(v);
  };

  const takeFromPool = (pool) => {
    const p = pool.filter((n) => r(n) !== r(ca));
    shuffleMcqList(p);
    for (const n of p) {
      add(n);
      if (wrong.size >= 3) break;
    }
  };

  if (baseKind === "solids_faces") {
    takeFromPool([2, 3, 4, 5, 6, 7, 8]);
  } else if (baseKind === "solids_vertices") {
    takeFromPool([0, 1, 4, 5, 6, 8, 10]);
  } else if (baseKind === "solids_edges") {
    takeFromPool([0, 1, 2, 4, 6, 8, 9, 10, 12]);
  } else if (baseKind === "tiling") {
    takeFromPool([60, 90, 120]);
  } else if (baseKind === "tiling_count") {
    const cnt = Number(correctAnswer);
    add(cnt - 1); add(cnt + 1); add(cnt + (params.floorL ?? 2)); add(cnt - (params.floorW ?? 2));
  } else if (baseKind === "rotation") {
    takeFromPool([90, 180, 270, 360]);
  } else if (baseKind === "triangle_angles") {
    const { angle1, angle2, angle3 } = params;
    add(angle1);
    add(angle2);
    add(r(angle1 + angle2));
    add(90);
    add(180 - angle1);
    add(180 - angle2);
  } else if (baseKind === "pythagoras_hyp" || baseKind === "pythagoras_leg") {
    const { a, b, c } = params;
    add(r(a + b));
    add(r(Math.abs(a - b)));
    add(r((a * a + b * b) ** 0.5 * 0.85));
    if (c) add(r(c + 2));
    if (c) add(r(Math.max(1, c - 3)));
    if (a) add(r(a * a));
    if (b) add(r(b * b));
  } else if (
    baseKind === "square_area" ||
    (selectedTopic === "area" && shape === "square")
  ) {
    const side = params.side;
    if (side != null) {
      add(side * 4);
      add(side + side);
      add(r((side + 1) * (side + 1)));
      add(r((side - 1) * (side - 1)));
      add(2 * side * side);
    }
  } else if (
    baseKind === "rectangle_area" ||
    (selectedTopic === "area" && shape === "rectangle")
  ) {
    const L = params.length;
    const W = params.width;
    if (L != null && W != null) {
      add(L + W);
      add(2 * (L + W));
      add(L * W + L);
      add(r((L + 1) * W));
      add(r(L * (W + 1)));
    }
  } else if (
    baseKind === "triangle_area" ||
    (selectedTopic === "area" && shape === "triangle")
  ) {
    const base = params.base;
    const height = params.height;
    if (base != null && height != null) {
      add(base * height);
      add(base + height);
      add(r((base * height) / 4));
    }
  } else if (
    baseKind === "parallelogram_area" ||
    (selectedTopic === "area" && shape === "parallelogram")
  ) {
    const base = params.base;
    const height = params.height;
    if (base != null && height != null) {
      add(r((base * height) / 2));
      add(base + height);
      add(2 * base + height);
    }
  } else if (
    baseKind === "trapezoid_area" ||
    (selectedTopic === "area" && shape === "trapezoid")
  ) {
    const b1 = params.base1;
    const b2 = params.base2;
    const h = params.height;
    if (b1 != null && b2 != null && h != null) {
      add(r(((b1 + b2) * h)));
      add(r(((b1 + b2) * h) / 4));
      add(b1 * b2);
    }
  } else if (baseKind === "circle_area") {
    const rad = params.radius;
    if (rad != null) {
      add(r(2 * PI * rad));
      add(r(2 * rad));
      add(r(PI * rad * rad * 1.15));
      add(r(PI * (rad + 1) * (rad + 1)));
    }
  } else if (baseKind === "circle_perimeter") {
    const rad = params.radius;
    if (rad != null) {
      add(r(PI * rad * rad));
      add(r(PI * rad));
      add(r(2 * PI * rad * 1.12));
    }
  } else if (baseKind === "square_perimeter" || baseKind.endsWith("square_perimeter")) {
    const side = params.side;
    if (side != null) {
      add(side * side);
      add(3 * side);
      add(2 * side);
    }
  } else if (baseKind === "rectangle_perimeter" || baseKind.endsWith("rectangle_perimeter")) {
    const L = params.length;
    const W = params.width;
    if (L != null && W != null) {
      add(L * W);
      add(L + W);
      add(2 * L + W);
    }
  } else if (baseKind === "triangle_perimeter") {
    const { side1, side2, side3 } = params;
    if (side1 != null && side2 != null && side3 != null) {
      add(side1 + side2);
      add(side2 + side3);
      add(side1 + side3);
    }
  } else if (baseKind === "cube_volume" || baseKind.endsWith("cube_volume")) {
    const side = params.side;
    if (side != null) {
      add(side * side);
      add(6 * side * side);
      add(side * side * side + side);
    }
  } else if (baseKind === "rectangular_prism_volume" || baseKind.endsWith("box_volume") || baseKind.endsWith("rectangular_prism_volume")) {
    const { length: L, width: W, height: H } = params;
    if (L != null && W != null && H != null) {
      add(L * W + H);
      add(L + W + H);
      add(L * W);
      add(r(L * W * H * 0.75));
    }
  } else if (baseKind === "cylinder_volume") {
    const { radius, height } = params;
    if (radius != null && height != null) {
      add(r(PI * radius * radius));
      add(r(PI * radius * height));
      add(r(2 * PI * radius * height));
    }
  } else if (baseKind === "sphere_volume") {
    const { radius } = params;
    if (radius != null) {
      add(r(PI * radius * radius * radius));
      add(r((4 / 3) * PI * radius * radius * radius * 0.7));
    }
  } else if (baseKind === "cone_volume") {
    const { radius, height } = params;
    if (radius != null && height != null) {
      add(r(PI * radius * radius * height));
      add(r((1 / 2) * PI * radius * radius * height));
    }
  } else if (baseKind === "pyramid_volume_square" || baseKind === "pyramid_volume_rectangular") {
    const h = params.height;
    const baseArea = params.baseArea;
    if (baseArea != null && h != null) {
      add(r(baseArea * h));
      add(r((baseArea * h) / 2));
    }
  } else if (baseKind === "prism_volume_triangle" || baseKind === "prism_volume_rectangular") {
    const baseArea = params.baseArea;
    const h = params.height;
    if (baseArea != null && h != null) {
      add(r((baseArea * h) / 2));
      add(baseArea + h);
    }
  } else if (
    baseKind === "heights_triangle" ||
    baseKind === "heights_parallelogram" ||
    baseKind === "heights_trapezoid"
  ) {
    const base = params.base ?? params.base1;
    const area = params.area;
    const b2 = params.base2;
    if (base != null && area != null) {
      add(r(area / base));
      add(r((area * 2) / base + 1));
    }
    if (b2 != null && base != null && area != null) {
      add(r(area / (base + b2)));
    }
  } else if (baseKind === "diagonal_square") {
    const side = params.side;
    if (side != null) {
      add(side * 2);
      add(side * side);
      add(r(side * Math.sqrt(3)));
    }
  } else if (
    baseKind === "diagonal_rectangle" ||
    baseKind === "diagonal_parallelogram"
  ) {
    const { side, width } = params;
    if (side != null && width != null) {
      add(side + width);
      add(Math.abs(side - width));
      add(r(Math.sqrt(side * side + width * width) * 0.85));
    }
  } else if (baseKind === "symmetry") {
    const axes = params.axes;
    if (axes != null) {
      takeFromPool([1, 2, 3, 4, 5, 6].filter((n) => n !== axes));
    }
  }

  let tries = 0;
  while (wrong.size < 3 && tries < 80) {
    tries++;
    const jitter = 1 + Math.floor(Math.random() * Math.max(2, Math.abs(ca) * 0.08));
    const sign = Math.random() < 0.5 ? -1 : 1;
    add(ca + sign * jitter);
  }

  let pad = 1;
  while (wrong.size < 3) {
    add(Math.max(1, ca + pad * 3));
    pad++;
    if (pad > 50) break;
  }

  const wrongArr = Array.from(wrong).slice(0, 3);
  const merged = shuffleMcqList([r(ca), ...wrongArr.map((x) => r(x))]);
  const uniq = [];
  for (const x of merged) {
    if (!uniq.includes(x)) uniq.push(x);
  }
  let bump = 1;
  while (uniq.length < 4) {
    const v = r(ca + bump * (Math.abs(ca) > 50 ? 7 : 3));
    bump++;
    if (v > 0 && !uniq.includes(v)) uniq.push(v);
    if (bump > 100) break;
  }
  return shuffleMcqList(uniq.slice(0, 4));
}

export function generateQuestion(level, topic, gradeKey, mixedOps = null, probeOpts = null) {
  const geoForceKind =
    probeOpts?.forceKind != null ? String(probeOpts.forceKind) : "";
  const forcedTopic =
    probeOpts?.topic != null ? String(probeOpts.topic) : "";

  // בדיקה שהכיתה קיימת
  if (!GRADES[gradeKey]) {
    return {
      question: "Invalid grade. Please choose another grade.",
      correctAnswer: 0,
      options: [0],
      params: { kind: "no_question" },
    };
  }
  
  const isMixed = topic === "mixed";
  const allowedTopics = GRADES[gradeKey].topics || [];
  
  let selectedTopic;
  if (forcedTopic && allowedTopics.includes(forcedTopic)) {
    selectedTopic = forcedTopic;
  } else if (isMixed) {
    let availableTopics;
    if (mixedOps) {
      availableTopics = Object.entries(mixedOps)
        .filter(([t, selected]) => selected && t !== "mixed")
        .map(([t]) => t);
    } else {
      availableTopics = allowedTopics.filter((t) => t !== "mixed");
    }
    if (!availableTopics || availableTopics.length === 0) {
      availableTopics = allowedTopics.filter((t) => t !== "mixed");
    }
    if (!availableTopics || availableTopics.length === 0) {
      return {
        question: "No topics available for this grade. Please choose another grade.",
        correctAnswer: 0,
        options: [0],
        params: { kind: "no_question" },
      };
    }
    selectedTopic =
      availableTopics[Math.floor(Math.random() * availableTopics.length)];
  } else {
    // בדיקה שהנושא קיים עבור הכיתה
    if (!allowedTopics.includes(topic)) {
      // ננסה למצוא נושא חלופי
      const alternativeTopic = allowedTopics.find(t => t !== "mixed");
      if (alternativeTopic) {
        selectedTopic = alternativeTopic;
      } else {
        return {
          question: ` "${geometryTopicLabelEn(topic)}"     .    .`,
          correctAnswer: 0,
          options: [0],
          params: { kind: "no_question" },
        };
      }
    } else {
      selectedTopic = topic;
    }
  }

  const availableShapesRaw = getShapesForTopic(gradeKey, selectedTopic);
  const availableShapes = (availableShapesRaw || []).filter((shape) => {
    if (selectedTopic === "area" && shape === "triangle") {
      return isTriangleAreaFormulaGradeAllowed(gradeKey);
    }
    return true;
  });
  
  // אם אין צורות זמינות, נחזיר שאלה ברירת מחדל
  if (!availableShapes || availableShapes.length === 0) {
    console.warn(`No shapes available for topic ${selectedTopic} in grade ${gradeKey}`);
    return {
      question: "No questions available for the selected topic and grade. Please choose another topic.",
      correctAnswer: 0,
      answers: [0],
      params: { kind: "no_question" },
    };
  }
  
  const geoForce =
    typeof globalThis !== "undefined" ? globalThis.__LIOSH_GEOMETRY_FORCE : null;

  let shape =
    availableShapes.length > 0
      ? availableShapes[Math.floor(Math.random() * availableShapes.length)]
      : null;

  const SHAPE_FOR_KIND = {
    shapes_basic_square: "square",
    shapes_basic_rectangle: "rectangle",
    shapes_basic_properties_square: "square",
    shapes_basic_properties_rectangle: "rectangle",
    shapes_basic_properties_angles: "square",
    square_area: "square",
    square_perimeter: "square",
    triangle_perimeter: "triangle",
    triangle_angles: "triangle",
    parallelogram_area: "parallelogram",
    trapezoid_area: "trapezoid",
    diagonal_square: "square",
    diagonal_rectangle: "rectangle",
    diagonal_parallelogram: "parallelogram",
    rectangular_prism_volume: "rectangular_prism",
    cylinder_volume: "cylinder",
    sphere_volume: "sphere",
    cone_volume: "cone",
    pyramid_volume_square: "pyramid",
    pyramid_volume_rectangular: "pyramid",
    prism_volume_rectangular: "prism",
    prism_volume_triangle: "prism",
    circle_area: "circle",
    circle_perimeter: "circle",
    pythagoras_hyp: "triangle",
    pythagoras_leg: "triangle",
  };
  if (
    geoForceKind &&
    SHAPE_FOR_KIND[geoForceKind] &&
    availableShapes.includes(SHAPE_FOR_KIND[geoForceKind])
  ) {
    shape = SHAPE_FOR_KIND[geoForceKind];
  }

  if (geoForce?.shape && availableShapes.includes(geoForce.shape)) {
    shape = geoForce.shape;
  }

  if (!shape) {
    console.warn(`Failed to select shape from available shapes:`, availableShapes);
    return {
      question: "Error generating question. Please try again.",
      correctAnswer: 0,
      answers: [0],
      params: { kind: "no_question" },
    };
  }

  const levelName = String(level?.name || "").trim().toLowerCase();
  const levelKey =
    levelName === "hard" || levelName === "קשה" || levelName === "אתגר"
      ? "hard"
      : levelName === "medium" || levelName === "בינוני" || levelName === "למידה"
        ? "medium"
        : "easy";

  const skipConceptual =
    typeof globalThis !== "undefined" &&
    globalThis.__LIOSH_SKIP_GEOMETRY_CONCEPTUAL === true;
  const forceConceptual =
    typeof globalThis !== "undefined" &&
    globalThis.__LIOSH_GEOMETRY_FORCE_CONCEPTUAL === true;
  const conceptualP = forceConceptual
    ? 1
    : geometryConceptualProbability(gradeKey, selectedTopic);

  if (
    !skipConceptual &&
    !geoForceKind &&
    selectedTopic !== "mixed" &&
    Math.random() < conceptualP
  ) {
    const conceptual = pickGeometryConceptualQuestion({
      gradeKey,
      levelKey,
      topic: selectedTopic,
    });
    if (conceptual) {
      return localizeLearningQuestion(
        sanitizeQuestionForStudentDisplay(
          attachCanonicalMetadataToMathGeometryQuestion(
            {
              question: conceptual.question,
              correctAnswer: conceptual.correctAnswer,
              answers: conceptual.answers,
              topic: selectedTopic,
              shape,
              params: conceptual.params,
            },
            {
              subject: "geometry",
              gradeKey,
              levelKey,
              topic: selectedTopic,
            }
          )
        ),
        { subject: "geometry", contentLocale: "en" }
      );
    }
  }

  let question;
  let correctAnswer;
  let params = {};

  const roundTo = level.decimals ? 2 : 0;
  const round = (num) =>
    Math.round(num * Math.pow(10, roundTo)) / Math.pow(10, roundTo);

  const formulaBand = gradeBandForKey(gradeKey) || "mid";
  // תרגילי מילים רק ב late (ה׳–ו׳)
  const allowStory = formulaBand === "late";

  switch (selectedTopic) {
    // ===================== AREA =====================
    case "area": {
      switch (shape) {
        case "square": {
          const side = Math.floor(Math.random() * level.maxSide) + 1;
          const useStory =
            allowStory && !geoForceKind && Math.random() < 0.4;

          params = {
            side,
            kind: useStory ? "story_square_area" : "square_area",
            patternFamily: useStory
              ? "area_square_story"
              : `area_square_${formulaBand}_${levelKey}`,
          };
          correctAnswer = round(side * side);

          if (useStory) {
            question = `    ,     ${side} .     ?`;
          } else if (formulaBand === "early") {
            if (levelKey === "easy") {
              question = `Square  sized  ${side}×${side} unit squares. how many unit squares cover its area?`;
            } else if (levelKey === "medium") {
              const earlyW = Math.floor(Math.random() * 10);
              question = [
                `  ${side}. What is the area?`,
                `  ${side}:    ?`,
                `   ${side}. What is the area?`,
                `Square ${side}. What is the area?`,
                `  ${side}. What is the area?`,
                `      ${side}?`,
                `Square ${side} .  .`,
                `    ${side}.`,
                `:  ${side}.  ?`,
              ][earlyW];
            } else {
              const earlyW = Math.floor(Math.random() * 10);
              question = [
                `   ${side}.  ?`,
                `   ${side}. What is the area?`,
                `   ${side}?`,
                `:  ${side}.  ?`,
                `    ${side}?`,
                `Square ${side}×${side}. What is the area?`,
                `  ${side}.  .`,
                `     ${side}?`,
                `  ${side} -  ?`,
                `  ${side}.   .`,
              ][earlyW];
            }
          } else if (formulaBand === "mid") {
            const aw = Math.floor(Math.random() * 8);
            if (levelKey === "easy") {
              question = [
                `   ${side}. What is the area?`,
                `  ${side} -     ?`,
                `  :  ${side}. What is the area?`,
                `Square ${side}×${side}:   ?`,
                `:   ${side}. What is the area?`,
                `   ${side} - What is the area?`,
                `   ${side}.   ?`,
                `      ${side} ?`,
              ][aw];
            } else if (levelKey === "medium") {
              question = [
                `      ${side}?`,
                ` ,  ${side}. Calculate the area of the square.`,
                `  :  ${side}.   ?`,
                `  ${side}×${side}:  .`,
                `    ${side} .`,
                `Square ${side}  -  ?`,
                ` :  ${side}.  ?`,
                ` ${side},  ${side}:   .`,
              ][aw];
            } else {
              question = [
                `   ${side}. What is the area?`,
                `   ${side}. What is the area?`,
                `    -   ${side}, What is the area?`,
                `Square ${side}×${side}. What is the area?`,
                `  ${side}:    .`,
                `Square ${side} .  ?`,
                ` :  ${side}, What is the area?`,
                `Square ${side}  -   .`,
              ][aw];
            }
          } else {
            question = `   ${side}. What is the area?`;
          }
          break;
        }

        case "rectangle": {
          const length = Math.floor(Math.random() * level.maxSide) + 1;
          const width = Math.floor(Math.random() * level.maxSide) + 1;
          const useStory = allowStory && Math.random() < 0.5;

          params = {
            length,
            width,
            kind: useStory ? "story_rectangle_area" : "rectangle_area",
            patternFamily: useStory
              ? "area_rectangle_story"
              : `area_rectangle_${formulaBand}_${levelKey}`,
          };
          correctAnswer = round(length * width);

          if (useStory) {
            question = `       ${length}   ${width} .     ?`;
          } else if (formulaBand === "early") {
            if (levelKey === "easy") {
              question = `Rectangle  sized  ${length}×${width} unit squares. how many unit squares cover its area?`;
            } else if (levelKey === "medium") {
              const earlyRW = Math.floor(Math.random() * 10);
              question = [
                `  ${length}×${width}. What is the area?`,
                `  ${length},  ${width}.  .`,
                `Rectangle ${length}×${width}. What is the area?`,
                `Rectangle ${length}×${width}.  ?`,
                `Rectangle ${length}×${width}. What is the area?`,
                `:  ${length},  ${width}. What is the area?`,
                `  : ${length}×${width}.`,
                `${length}  -${width} .  ?`,
                `  ${length}×${width}?`,
                `Rectangle: ${length}   -${width}  .  ?`,
              ][earlyRW];
            } else {
              const earlyRW = Math.floor(Math.random() * 10);
              question = [
                `Rectangle ${length}×${width}. What is the area?`,
                `  ${length} and width ${width}.  .`,
                `  ${length}×${width}?`,
                `Rectangle: ${length}×${width}.  ?`,
                `What is the area of Rectangle ${length} -${width}?`,
                `Rectangle ${length}×${width} - What is the area?`,
                `Rectangle ${length}×${width}.   .`,
                `  ? ${length}×${width}.`,
                `  ${length} -${width}.  ?`,
                `Calculate the area of the rectangle: ${length} × ${width}.`,
              ][earlyRW];
            }
          } else if (formulaBand === "mid") {
            const rw = Math.floor(Math.random() * 8);
            if (levelKey === "easy") {
              question = [
                `  ${length}   ${width} .   ?`,
                `  ${length}   ${width} .  ?`,
                ` :  = ${length} ,  = ${width} .  ?`,
                `    ${length}  ${width}.`,
                `Rectangle ${length}×${width} -   ?`,
                `Rectangle: ${length}   -${width}  .  ?`,
                ` ?   ${length} -${width} .`,
                `  ${length}  ${width}. What is the area?`,
              ][rw];
            } else if (levelKey === "medium") {
              question = [
                `  ?  ${length} ,  ${width} .`,
                `  ${length}   ${width} .  ?`,
                `  ${length}   ${width} .  ?`,
                `Rectangle ${length}×${width} .  ?`,
                `  ${length} -${width} -   ?`,
                ` ${length},  ${width}:  .`,
                `   ${length}×${width} ?`,
                `Rectangle ${length}×${width}:  ?`,
              ][rw];
            } else {
              question = [
                `  ${length}   ${width} .   ?`,
                `  ${length} and width ${width}. What is the area?`,
                `   -  ${length}×${width} .   ?`,
                `Challenge: Rectangle ${length}×${width} -  .`,
                `Rectangle ${length}×${width}. What is the area?`,
                `  ${length} -${width} -  .`,
                `  ${length} -${width} .  ?`,
                `Rectangle ${length}×${width}. What is the area?`,
              ][rw];
            }
          } else {
            question = ` :  ${length},  ${width}.  ?`;
          }
          break;
        }

        case "triangle": {
          const base = Math.floor(Math.random() * level.maxSide) + 1;
          const height = Math.floor(Math.random() * level.maxSide) + 1;
          const useStory = allowStory && Math.random() < 0.3;

          params = {
            base,
            height,
            kind: useStory ? "story_triangle_area" : "triangle_area",
          };
          correctAnswer = round((base * height) / 2);

          if (useStory) {
            question = `       ${base}   ${height} .     ?`;
          } else if (formulaBand === "early") {
            question = `:  ${base},  ${height}. What is the area?`;
          } else if (formulaBand === "mid") {
            if (levelKey === "easy") {
              question = `  ${base},  ${height}. What is the area?`;
            } else if (levelKey === "medium") {
              question = `      ${base}  ${height}?`;
            } else {
              question = `   -  ${base},  ${height}. What is the area?`;
            }
          } else {
            question = `   ${base}  ${height}. What is the area?`;
          }
          break;
        }

        case "parallelogram": {
          const base = Math.floor(Math.random() * level.maxSide) + 1;
          const height = Math.floor(Math.random() * level.maxSide) + 1;
          params = { base, height, kind: "parallelogram_area" };
          correctAnswer = round(base * height);
          if (formulaBand === "late") {
            question = `    ${base}     ${height} .    .`;
          } else if (levelKey === "easy") {
            question = `    ${base}    ${height} .    .`;
          } else if (levelKey === "medium") {
            question = `      ${base}   ${height} cm?`;
          } else {
            question = `:  ${base}   ${height} .    .`;
          }
          break;
        }

        case "trapezoid": {
          const base1 = Math.floor(Math.random() * level.maxSide) + 1;
          const base2 = Math.floor(Math.random() * level.maxSide) + 1;
          const height = Math.floor(Math.random() * level.maxSide) + 1;
          params = { base1, base2, height, kind: "trapezoid_area" };
          correctAnswer = round(((base1 + base2) * height) / 2);
          question =
            formulaBand === "late"
              ? `:  ${base1} -${base2},  ${height}. What is the area?`
              : `      ${base1} -${base2}  ${height}?`;
          break;
        }

        case "circle": {
          const radius =
            Math.floor(Math.random() * (level.maxSide / 2)) + 1;
          const useStory = allowStory && Math.random() < 0.4;

          params = {
            radius,
            kind: useStory ? "story_circle_area" : "circle_area",
          };
          correctAnswer = round(PI * radius * radius);

          if (useStory) {
            question = `     ${radius} .   ? ( = 3.14)`;
          } else if (formulaBand === "late") {
            question =
              gradeKey === "g6"
                ? `A circle with radius ${radius}. What is the area? (π = 3.14)`
                : `A circle with radius ${radius}: What is the area? (π = 3.14)`;
          } else {
            question = `      ${radius}? (π = 3.14)`;
          }
          break;
        }

        default: {
          const side = Math.floor(Math.random() * level.maxSide) + 1;
          params = { side, kind: "square_area" };
          correctAnswer = round(side * side);
          question =
            formulaBand === "early"
              ? `:  ${side}.  ?`
              : formulaBand === "mid"
                ? `      ${side}?`
                : ` :  ${side}.  ?`;
        }
      }
      break;
    }

    // ===================== PERIMETER =====================
    case "perimeter": {
      switch (shape) {
        case "square": {
          const side = Math.floor(Math.random() * level.maxSide) + 1;
          const useStory = allowStory && Math.random() < 0.4;

          params = { side, kind: useStory ? "story_square_perimeter" : "square_perimeter" };
          correctAnswer = round(side * 4);

          if (useStory) {
            const storyVariants = [
              `       ,     ${side} .      ?`,
              `    ${side} .       ?`,
              `   ${side} .     ?`,
              `    ${side} .    ?`,
            ];
            question = storyVariants[Math.floor(Math.random() * storyVariants.length)];
          } else if (formulaBand === "early") {
            const earlyVariants = [
              `:   ${side}. What is the perimeter?`,
              `  :  ${side}. What is the perimeter?`,
              `Square ${side}    -   ?`,
            ];
            question = earlyVariants[Math.floor(Math.random() * earlyVariants.length)];
          } else if (formulaBand === "mid") {
            const variants = [
              `      ${side} cm?`,
              `   ${side} cm. What is the perimeter?`,
              `  ${side}  -   ?`,
              `The side of the square is ${side} .    .`,
              `      ${side} cm?`,
              ` ${side} :    .`,
              `  ${side}   .  ?`,
              `Square ${side}×${side}:    ?`,
            ];
            question = variants[Math.floor(Math.random() * variants.length)];
          } else {
            const lateVariants = [
              `   ${side}. What is the perimeter?`,
              `  ${side}. What is the perimeter?`,
              `  ${side}:   .`,
            ];
            question = lateVariants[Math.floor(Math.random() * lateVariants.length)];
          }
          break;
        }

        case "rectangle": {
          const length = Math.floor(Math.random() * level.maxSide) + 1;
          const width = Math.floor(Math.random() * level.maxSide) + 1;
          const useStory = allowStory && Math.random() < 0.5;
          const phrasing = Math.floor(Math.random() * 8);

          params = {
            length,
            width,
            kind: useStory ? "story_rectangle_perimeter" : "rectangle_perimeter",
          };
          correctAnswer = round((length + width) * 2);

          if (useStory) {
            const storyVariants = [
              `   .  ${length}   ${width} .       ?`,
              `    ${length}   ${width} .     ?`,
              `    ${length}   ${width} .    ?`,
              `   ${length}   ${width} .    ?`,
            ];
            question = storyVariants[Math.floor(Math.random() * storyVariants.length)];
          } else if (formulaBand === "early") {
            const earlyVariants = [
              `:  ${length} ,  ${width} cm. What is the perimeter?`,
              `   :  ${length} cm and width ${width} cm.`,
              `Rectangle ${length}×${width} :     .`,
            ];
            question = earlyVariants[phrasing % earlyVariants.length];
          } else if (formulaBand === "mid") {
            const variants = [
              `      ${length} cm and width ${width} cm?`,
              `  ${length} cm and width ${width} cm. What is the perimeter?`,
              `  ${length} cm and its width is ${width} cm - What is the perimeter?`,
              `The length of the rectangle is ${length} cm and its width is ${width} .    .`,
              `     ${length}×${width}?`,
              ` ${length} ,  ${width} :    .`,
              `  ${length}  -${width} .    ?`,
              `Rectangle ${length}×${width}:   ?`,
            ];
            question = variants[phrasing];
          } else {
            const lateVariants = [
              `  ${length}   ${width} .   ?`,
              `  ${length} -${width}. What is the perimeter?`,
              `  ${length} -${width}:   .`,
            ];
            question = lateVariants[phrasing % lateVariants.length];
          }
          break;
        }

        case "triangle": {
          const { side1, side2, side3 } = pickValidTriangleSides(level.maxSide);
          params = { side1, side2, side3, kind: "triangle_perimeter" };
          correctAnswer = round(side1 + side2 + side3);
          question =
            formulaBand === "late"
              ? `    ${side1} cm, ${side2}  -${side3} .    .`
              : `    ${side1} cm, ${side2}  -${side3} .    ?`;
          break;
        }

        case "circle": {
          const radius =
            Math.floor(Math.random() * (level.maxSide / 2)) + 1;
          const useStory = allowStory && Math.random() < 0.4;

          params = { radius, kind: useStory ? "story_circle_perimeter" : "circle_perimeter" };
          correctAnswer = round(2 * PI * radius);

          if (useStory) {
            question = `       ${radius} .    ? ( = 3.14)`;
          } else if (formulaBand === "late") {
            question = `A circle with radius ${radius}:    ()? ( = 3.14)`;
          } else {
            question = `      ${radius}? (π = 3.14)`;
          }
          break;
        }

        default: {
          const side = Math.floor(Math.random() * level.maxSide) + 1;
          params = { side, kind: "square_perimeter" };
          correctAnswer = round(side * 4);
          question =
            formulaBand === "early"
              ? `:  ${side}. What is the perimeter?`
              : formulaBand === "mid"
                ? `      ${side}?`
                : ` :  ${side}.  ?`;
        }
      }
      break;
    }

    // ===================== VOLUME =====================
    case "volume": {
      switch (shape) {
        case "cube": {
          const side =
            Math.floor(Math.random() * (level.maxSide / 2)) + 1;
          const useStory = allowStory && Math.random() < 0.4;

          params = { side, kind: useStory ? "story_cube_volume" : "cube_volume" };
          correctAnswer = round(side * side * side);

          if (useStory) {
            question = `   ,    ${side} ".    " ?`;
          } else if (formulaBand === "early") {
            question = `:  ${side}.  ?`;
          } else if (formulaBand === "mid") {
            if (levelKey === "easy") {
              question = `  ${side}.  ?`;
            } else if (levelKey === "medium") {
              question = `      ${side}?`;
            } else {
              question = `   -  ${side}.  ?`;
            }
          } else {
            question = ` :  ${side}.  ?`;
          }
          break;
        }

        case "rectangular_prism": {
          const length =
            Math.floor(Math.random() * (level.maxSide / 2)) + 1;
          const width =
            Math.floor(Math.random() * (level.maxSide / 2)) + 1;
          const height =
            Math.floor(Math.random() * level.maxSide) + 1;
          const useStory =
            allowStory && !geoForceKind && Math.random() < 0.5;

          params = {
            length,
            width,
            height,
            kind: useStory ? "story_box_volume" : "rectangular_prism_volume",
          };
          correctAnswer = round(length * width * height);

          if (useStory) {
            question = `        ${length} ",  ${width} "  ${height} ".    " ?`;
          } else if (formulaBand === "late") {
            if (levelKey === "easy") {
              question = ` ${length}×${width}×${height}.  ?`;
            } else if (levelKey === "medium") {
              question = ` : ${length} × ${width} × ${height}.  ?`;
            } else {
              question = `  -   ${length}×${width}×${height} ( ).  ?`;
            }
          } else if (gradeKey === "g4") {
            if (levelKey === "easy") {
              question = `  ${length},  ${width}  ${height} ".  ?`;
            } else if (levelKey === "medium") {
              question = `   ${length} × ${width} × ${height} ".  ?`;
            } else {
              question = ` ${length}×${width}×${height} ".  ?`;
            }
          } else if (gradeKey === "g5") {
            question = `   ${length}×${width}×${height}:   (" ).`;
          } else {
            question = `      ${length},  ${width}  ${height}?`;
          }
          break;
        }

        case "cylinder": {
          const radius =
            Math.floor(Math.random() * (level.maxSide / 3)) + 1;
          const height =
            Math.floor(Math.random() * level.maxSide) + 1;
          params = { radius, height, kind: "cylinder_volume" };
          correctAnswer = round(PI * radius * radius * height);
          question = `   ${radius}   ${height} .     ( = 3.14).`;
          break;
        }

        case "sphere": {
          const radius =
            Math.floor(Math.random() * (level.maxSide / 3)) + 1;
          params = { radius, kind: "sphere_volume" };
          correctAnswer = round((4 / 3) * PI * radius * radius * radius);
          question = `   ${radius} .     ( = 3.14).`;
          break;
        }

        case "pyramid": {
          // נפח פירמידה = (1/3) × שטח בסיס × גובה
          // נשתמש בפירמידה עם בסיס ריבועי או מלבני
          const baseSide = Math.floor(Math.random() * (level.maxSide / 2)) + 1;
          const height = Math.floor(Math.random() * level.maxSide) + 1;
          const isSquareBase = Math.random() < 0.5;
          
          if (isSquareBase) {
            const baseArea = baseSide * baseSide;
            params = { baseSide, side: baseSide, height, baseArea, kind: "pyramid_volume_square" };
            correctAnswer = round((baseArea * height) / 3);
            question =
              gradeKey === "g6"
                ? `      ${baseSide}     ${height} .    .`
                : `      ${baseSide}   ${height} .   ?`;
          } else {
            const baseWidth = Math.floor(Math.random() * (level.maxSide / 2)) + 1;
            const baseArea = baseSide * baseWidth;
            params = {
              baseSide,
              side: baseSide,
              baseWidth,
              width: baseWidth,
              height,
              baseArea,
              kind: "pyramid_volume_rectangular",
            };
            correctAnswer = round((baseArea * height) / 3);
            question =
              gradeKey === "g6"
                ? `     ${baseSide}   ${baseWidth} ,  ${height} .    .`
                : `  ${baseSide}×${baseWidth}   ${height} .   ?`;
          }
          break;
        }

        case "cone": {
          // נפח חרוט = (1/3) × π × רדיוס² × גובה
          const radius = Math.floor(Math.random() * (level.maxSide / 3)) + 1;
          const height = Math.floor(Math.random() * level.maxSide) + 1;
          params = { radius, height, kind: "cone_volume" };
          correctAnswer = round((PI * radius * radius * height) / 3);
          question = `    ${radius}   ${height} .     ( = 3.14).`;
          break;
        }

        case "prism": {
          // נפח מנסרה = שטח בסיס × גובה
          const height = Math.floor(Math.random() * level.maxSide) + 1;
          const trianglePrismOk = isPrismVolumeTriangleAllowed();
          const baseType =
            trianglePrismOk && Math.random() < 0.5 ? "triangle" : "rectangle";

          if (baseType === "triangle") {
            const base = Math.floor(Math.random() * (level.maxSide / 2)) + 1;
            const baseHeight = Math.floor(Math.random() * (level.maxSide / 2)) + 1;
            const baseArea = (base * baseHeight) / 2;
            params = { base, baseHeight, height, baseArea, kind: "prism_volume_triangle" };
            correctAnswer = round(baseArea * height);
            question = `   :  ${base}   ${baseHeight} ,   ${height} .    .`;
          } else {
            const baseLength = Math.floor(Math.random() * (level.maxSide / 2)) + 1;
            const baseWidth = Math.floor(Math.random() * (level.maxSide / 2)) + 1;
            const baseArea = baseLength * baseWidth;
            params = { baseLength, baseWidth, height, baseArea, kind: "prism_volume_rectangular" };
            correctAnswer = round(baseArea * height);
            question = `    ${baseLength}×${baseWidth} ,   ${height} .    .`;
          }
          break;
        }

        default: {
          const length =
            Math.floor(Math.random() * (level.maxSide / 2)) + 1;
          const width =
            Math.floor(Math.random() * (level.maxSide / 2)) + 1;
          const height =
            Math.floor(Math.random() * level.maxSide) + 1;
          params = {
            length,
            width,
            height,
            kind: "rectangular_prism_volume",
            patternFamily: `prism_volume_${formulaBand}_${levelKey}`,
          };
          correctAnswer = round(length * width * height);
          if (formulaBand === "late") {
            question =
              levelKey === "easy"
                ? `  -  ${length}×${width}×${height}.  ?`
                : levelKey === "medium"
                  ? `  : ${length} × ${width} × ${height}.  ?`
                  : ` :  ${length}×${width}×${height}.  ?`;
          } else if (levelKey === "easy") {
            question = `    ${length}×${width}×${height}?`;
          } else if (levelKey === "medium") {
            question = `      ${length},  ${width}  ${height}?`;
          } else {
            question = `  -  ${length}×${width}×${height}.  ?`;
          }
        }
      }
      break;
    }

    // ===================== ANGLES =====================
    case "angles": {
      const angle1 = Math.floor(Math.random() * 61) + 40;
      const maxAngle2 = 160 - angle1;
      const angle2 = Math.floor(Math.random() * (maxAngle2 - 19)) + 20;
      const angle3 = 180 - angle1 - angle2;

      params = {
        angle1,
        angle2,
        angle3,
        kind: "triangle_angles",
        patternFamily: `triangle_angles_${formulaBand}_${levelKey}`,
      };
      correctAnswer = round(angle3);
      {
        const baseMid = `,    ${angle1}    ${angle2}.   ?`;
        const baseMidB = ` : ${angle1} -${angle2}  .    ?`;
        const baseMidC = ` ${angle1} -${angle2} -     .`;
        const baseLate = `,    (${angle1} -${angle2}).   ?`;
        const tw = Math.floor(Math.random() * 3);
        if (formulaBand === "mid") {
          if (levelKey === "easy") {
            question = [
              baseMid,
              baseMidB,
              baseMidC,
            ][tw];
          } else if (levelKey === "medium") {
            question = [
              baseMid,
              baseMidB,
              baseMidC,
            ][tw];
          } else {
            question = [
              formatTriangleAnglesKnownTwoStem(angle1, angle2),
              ` ${angle1} -${angle2}.    ?`,
              `  : ${angle1} -${angle2}.  ?`,
            ][tw];
          }
        } else if (levelKey === "easy") {
          question = formatTriangleAnglesKnownTwoStem(angle1, angle2);
        } else if (levelKey === "medium") {
          question = baseLate;
        } else {
          question = baseLate;
        }
      }
      break;
    }

    // ===================== PYTHAGORAS =====================
    case "pythagoras": {
      const triples = [
        [3, 4, 5],
        [5, 12, 13],
        [6, 8, 10],
        [8, 15, 17],
      ];
      const [ba, bb, bc] =
        triples[Math.floor(Math.random() * triples.length)];
      const maxK = gradeKey === "g6" ? 3 : 2;
      const k = Math.floor(Math.random() * maxK) + 1;

      const a = ba * k;
      const b = bb * k;
      const c = bc * k;

      // לפעמים שואלים על היתר (כמו קודם), לפעמים על אחד הניצבים
      const askLeg =
        geoForceKind === "pythagoras_leg"
          ? true
          : geoForceKind === "pythagoras_hyp"
            ? false
            : allowStory && Math.random() < 0.4;
      if (!askLeg) {
        params = { a, b, c, which: "hypotenuse", kind: "pythagoras_hyp" };
        correctAnswer = round(c);
        if (levelKey === "easy") {
          question = ` ${a} -${b}.   ?`;
        } else if (levelKey === "medium") {
          question =
            gradeKey === "g6" && Math.random() < 0.5
              ? `  :  ${a} -${b}.    (c)?`
              : `  ,   ${a} -${b}.   ?`;
        } else {
          question = ` ${a} -${b}   .   ?`;
        }
      } else {
        // נשאל על ניצב חסר
        const missing = Math.random() < 0.5 ? "a" : "b";
        if (missing === "a") {
          params = { a, b, c, which: "leg_a", kind: "pythagoras_leg" };
          correctAnswer = round(a);
          question =
            levelKey === "easy"
              ? `  ${c}    ${b}.   ?`
              : levelKey === "medium"
                ? `  ,   ${c}    ${b}.    ?`
                : `  :  ${c}  ${b}.   ?`;
        } else {
          params = { a, b, c, which: "leg_b", kind: "pythagoras_leg" };
          correctAnswer = round(b);
          question =
            levelKey === "easy"
              ? `  ${c}    ${a}.   ?`
              : levelKey === "medium"
                ? `  ,   ${c}    ${a}.    ?`
                : `  :  ${c}  ${a}.   ?`;
        }
      }
      break;
    }

    // ===================== SHAPES BASIC =====================
    case "shapes_basic": {
      // כיתה א' - זיהוי בסיסי, כיתה ד' - תכונות
      if (gradeKey === "g1") {
        // שאלות זיהוי בסיסיות - מה השם של הצורה?
        const side = Math.floor(Math.random() * level.maxSide) + 1;
        const isSquare =
          geoForceKind === "shapes_basic_square" ||
          (geoForceKind !== "shapes_basic_rectangle" && Math.random() < 0.5);
        
        if (isSquare) {
          params = {
            shape: "Square",
            side,
            kind: "shapes_basic_square",
            patternFamily:
              levelKey === "easy"
                ? "shapes_basic_square_g1_easy"
                : levelKey === "medium"
                  ? "shapes_basic_square_g1_medium"
                  : "shapes_basic_square_g1_hard",
          };
          correctAnswer = burnDownCopy("utils__geometry-question-generator", "square");
          const sqW = Math.floor(Math.random() * 3);
          question =
            levelKey === "easy"
              ? [
                  `   - :    ${side}.   ? (1 = , 2 = )`,
                  `Examine a closed shape: four equal sides (${side})  .  ? (1 = , 2 = )`,
                  `Quick identification — quadrilateral with side ${side} on each side. Square or rectangle? (1 = Square, 2 = Rectangle)`,
                ][sqW]
              : levelKey === "medium"
                ? [
                    `   :     ${side}  .  ? (1 = , 2 = )`,
                    `Four sides of length ${side} - Does this describe a square? (1 = Square, 2 = Rectangle)`,
                    `Full side symmetry: all sides ${side}. Which shape? (1 = Square, 2 = Rectangle)`,
                  ][sqW]
                : [
                    `Analyze the description — quadrilateral with four equal sides ${side}  .   ? (1 = , 2 = )`,
                    `Properties: all sides ${side},   .   ? (1 = , 2 = )`,
                    `  :      ? (1 = , 2 = )`,
                  ][sqW];
        } else {
          const width = Math.floor(Math.random() * level.maxSide) + 1;
          params = {
            shape: "Rectangle",
            length: side,
            width,
            kind: "shapes_basic_rectangle",
            patternFamily:
              levelKey === "easy"
                ? "shapes_basic_rect_g1_easy"
                : levelKey === "medium"
                  ? "shapes_basic_rect_g1_medium"
                  : "shapes_basic_rect_g1_hard",
          };
          correctAnswer = burnDownCopy("utils__geometry-question-generator", "rectangle");
          const rectW = Math.floor(Math.random() * 3);
          question =
            levelKey === "easy"
              ? [
                  `   - :  ${side},  ${width}.   ? (1 = , 2 = )`,
                  `Shape with equal opposite pairs: ${side} vs ${side}, ${width} vs ${width}.  ? (1 = , 2 = )`,
                  ` ${side} and width ${width} () -   ? (1 = , 2 = )`,
                ][rectW]
              : levelKey === "medium"
                ? [
                    `   :  ${side} and width ${width} (   ).  ? (1 = , 2 = )`,
                    `True rectangle: sides ${side} -${width} .   ? (1 = , 2 = )`,
                    `Is this a square when the sides are ${side} -${width}? (1 = Square, 2 = Rectangle)`,
                  ][rectW]
                : [
                    `  -           ;  ${side},  ${width}.   ? (1 = , 2 = )`,
                    `Identify by properties: two different side lengths (${side}, ${width}).  ? (1 = , 2 = )`,
                    ` :     ? (1 = , 2 = )`,
                  ][rectW];
        }
      } else if (gradeKey === "g2" || gradeKey === "g3") {
        // כיתה ב'-ג' - זיהוי ותכונות בסיסיות (5 variants each)
        const side = Math.floor(Math.random() * level.maxSide) + 1;
        const width = Math.floor(Math.random() * level.maxSide) + 1;
        const isSquare = Math.random() < 0.5;
        const g23w = Math.floor(Math.random() * 5);
        
        if (isSquare) {
          params = {
            shape: "Square",
            side,
            kind: "shapes_basic_square",
            patternFamily: `shapes_basic_square_${gradeKey}_${levelKey}`,
          };
          correctAnswer = burnDownCopy("utils__geometry-question-generator", "square");
          question =
            levelKey === "easy"
              ? [
                  `Identify: four equal sides (${side}),   .   ? (1=, 2=)`,
                  `:    ${side}   -   ? (1=, 2=)`,
                  ` ?   ${side}, right angles. (1=Square, 2=Rectangle)`,
                  ` : ${side}   -   ? (1=, 2=)`,
                  `:   ${side}, right angles. (1=Square, 2=Rectangle)`,
                ][g23w]
              : levelKey === "medium"
                ? [
                    `:  ${side}  .   ? (1=, 2=)`,
                    `:   ${side} . (1=, 2=)`,
                    `  : ${side}  . (1=, 2=)`,
                    ` ?   ${side}. (1=Square, 2=Rectangle)`,
                    `Check: equal sides ${side}. (1=Square, 2=Rectangle)`,
                  ][g23w]
                : [
                    `:      ${side} and right angles. (1=Square, 2=Rectangle)`,
                    ` :   ${side}. (1=Square, 2=Rectangle)`,
                    `:    ${side}  ? (1=, 2=)`,
                    `:    ${side}. (1=Square, 2=Rectangle)`,
                    `:      ${side}. (1=Square, 2=Rectangle)`,
                  ][g23w];
        } else {
          params = {
            shape: "Rectangle",
            length: side,
            width,
            kind: "shapes_basic_rectangle",
            patternFamily: `shapes_basic_rect_${gradeKey}_${levelKey}`,
          };
          correctAnswer = burnDownCopy("utils__geometry-question-generator", "rectangle");
          question =
            levelKey === "easy"
              ? [
                  `:  ${side},  ${width} ().   ? (1=, 2=)`,
                  `:   ${side} -${width}. (1=Square, 2=Rectangle)`,
                  ` ? ${side} -${width} alternating. (1=Square, 2=Rectangle)`,
                  `   ${side} -${width}. (1=Square, 2=Rectangle)`,
                  `:    ${side} -${width}. (1=Square, 2=Rectangle)`,
                ][g23w]
              : levelKey === "medium"
                ? [
                    `:  ${side},  ${width} (). (1=, 2=)`,
                    `:  ${side} vs ${width}. (1=Square, 2=Rectangle)`,
                    `  : ${side} -${width}. (1=Square, 2=Rectangle)`,
                    ` ? ${side} -${width}. (1=Square, 2=Rectangle)`,
                    `:  ${side} -${width} alternating. (1=Square, 2=Rectangle)`,
                  ][g23w]
                : [
                    `:     ${side} -${width}. (1=Square, 2=Rectangle)`,
                    ` : ${side} -${width} alternating. (1=Square, 2=Rectangle)`,
                    `:  ${side} -${width}  ? (1=, 2=)`,
                    `:    ${side} -${width}. (1=Square, 2=Rectangle)`,
                    `:     ${side} -${width}. (1=Square, 2=Rectangle)`,
                  ][g23w];
        }
      } else {
        // כיתה ד' - תכונות ריבוע ומלבן (expanded to 8 variants)
        const questionType = Math.random();
        const g4w = Math.floor(Math.random() * 8);
        const g4w3 = g4w % 3;
        if (questionType < 0.33) {
          // כמה צלעות שוות יש לריבוע?
          params = { shape: "Square", kind: "shapes_basic_properties_square" };
          correctAnswer = "4";
          question =
            levelKey === "easy"
              ? [
                  `:     ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                  ` -    ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                  `   : (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                  ` :   ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                  `     - ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                  ` :   ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                  `:    ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                  `    ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                ][g4w]
              : levelKey === "medium"
                ? [
                    `    ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    `   -  ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    `     - ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    `  :  ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    `  -   ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    ` :   ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    ` :   ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    `    ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                  ][g4w]
                : [
                    `  -    ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    ` :   ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    `  -    ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    ` :   ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    ` :   ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    ` :  ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    `:   ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    `   ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                  ][g4w];
        } else if (questionType < 0.66) {
          // כמה זוגות של צלעות שוות יש למלבן?
          params = { shape: "Rectangle", kind: "shapes_basic_properties_rectangle" };
          correctAnswer = "2";
          question =
            levelKey === "easy"
              ? [
                  `:     ? (1 = 1, 2 = 2, 3 = 3, 4 = 4)`,
                  `   -   ? (1 = 1, 2 = 2, 3 = 3, 4 = 4)`,
                  `    : (1 = 1, 2 = 2, 3 = 3, 4 = 4)`,
                ][g4w3]
              : levelKey === "medium"
                ? [
                    `      ? (1 = 1, 2 = 2, 3 = 3, 4 = 4)`,
                    `  -    ? (1 = 1, 2 = 2, 3 = 3, 4 = 4)`,
                    `    -  ? (1 = 1, 2 = 2, 3 = 3, 4 = 4)`,
                  ][g4w3]
                : [
                    `  -     ? (1 = 1, 2 = 2, 3 = 3, 4 = 4)`,
                    ` :    ? (1 = 1, 2 = 2, 3 = 3, 4 = 4)`,
                    `  -   : (1 = 1, 2 = 2, 3 = 3, 4 = 4)`,
                  ][g4w3];
        } else {
          // כמה זוויות ישרות יש לריבוע/מלבן?
          const shape = Math.random() < 0.5 ? "Square" : "Rectangle";
          params = { shape, kind: "shapes_basic_properties_angles" };
          correctAnswer = "4";
          question =
            levelKey === "easy"
              ? [
                  `${shape}:    ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                  `  ${shape} - ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                  `  : ${shape}. (1 = 2, 2 = 3, 3 = 4, 4 = No right angles)`,
                ][g4w3]
              : levelKey === "medium"
                ? [
                    `    ${shape}? (1 = 2, 2 = 3, 3 = 4, 4 = No right angles)`,
                    `   ${shape} - ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    `  ${shape}: (1 = 2, 2 = 3, 3 = 4, 4 = No right angles)`,
                  ][g4w3]
                : [
                    ` ${shape} -   ? (1 = 2, 2 = 3, 3 = 4, 4 =   )`,
                    `  ${shape}: (1 = 2, 2 = 3, 3 = 4, 4 = No right angles)`,
                    `  -   ${shape}: (1 = 2, 2 = 3, 3 = 4, 4 = No right angles)`,
                  ][g4w3];
        }
      }
      if (question) question = stripShapesBasicIndexLegend(question);
      break;
    }

    // ===================== PARALLEL PERPENDICULAR =====================
    case "parallel_perpendicular": {
      const types = [burnDownCopy("utils__geometry-question-generator", "parallel"), "Perpendicular"];
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const isParallel = selectedType === burnDownCopy("utils__geometry-question-generator", "parallel");

      params = {
        type: selectedType,
        isParallel,
        kind: "parallel_perpendicular",
        patternFamily: `parallel_perpendicular_${levelKey}`,
        subtype: formulaBand === "mid" ? "mid_band" : "late_band",
      };
      correctAnswer = selectedType;
      if (formulaBand === "mid") {
        question =
          levelKey === "easy"
            ? `   .   ?`
            : levelKey === "medium"
              ? `   :   ?`
              : ` ,      ?`;
      } else {
        question =
          levelKey === "easy"
            ? ` :     ?`
            : levelKey === "medium"
              ? `  :     ?`
              : `  ,      ?`;
      }
      break;
    }

    // ===================== TRIANGLES =====================
    case "triangles": {
      const types = ["Equilateral", "Isosceles", "Scalene"];
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const triW = Math.floor(Math.random() * 10); // 10 stem variants

      params = {
        type: selectedType,
        kind: "triangles",
        patternFamily: `triangles_classify_${levelKey}`,
        subtype: formulaBand === "mid" ? "mid_band" : "late_band",
      };
      correctAnswer = selectedType;
      
      if (formulaBand === "mid") {
        question =
          levelKey === "easy"
            ? [
                `  .      ?`,
                `    ?`,
                `     .`,
                `   ,   ?`,
                `     .`,
                `   ?`,
                `     .`,
                `    .`,
                ` :     ?`,
                `      .`,
              ][triW % 10]
            : levelKey === "medium"
              ? [
                  `      .`,
                  `   ,    ?`,
                  `       .`,
                  `      ?`,
                  `     .`,
                  ` :     ?`,
                  `     .`,
                  `    ?`,
                  ` :    ?`,
                  `     .`,
                ][triW % 10]
              : [
                  ` :      .`,
                  ` :    ?`,
                  `        .`,
                  ` :     ?`,
                  ` :      ?`,
                  `:    ?`,
                  ` :      ?`,
                  ` :      .`,
                  ` :    ?`,
                  `     .`,
                ][triW % 10];
      } else {
        // Late band (G5-G6) - expanded to 16 variants for maximum coverage
        const triLateW = Math.floor(Math.random() * 16);
        question =
          levelKey === "easy"
            ? [
                `   .`,
                `:    ?`,
                `    ?`,
                `    .`,
                ` :    ?`,
                ` :   ?`,
                ` :    ?`,
                `  :    ?`,
                `  :   ?`,
                `:    ?`,
                `  :   ?`,
                `   ?`,
                `     .`,
                `:    .`,
                ` :   ?`,
                `:    ?`,
              ][triLateW]
            : levelKey === "medium"
              ? [
                  ` :     ?`,
                  `     .`,
                  ` :    ?`,
                  ` :    ?`,
                  ` :      ?`,
                  ` :    ?`,
                  `  :    ?`,
                  ` :     .`,
                  `:      ?`,
                  ` :    .`,
                  `:    ?`,
                  ` :   ?`,
                  ` :    ?`,
                  ` :    ?`,
                  ` :   .`,
                  ` :   .`,
                ][triLateW]
              : [
                  ` :    ?`,
                  ` :    ?`,
                  ` :     ?`,
                  ` :      .`,
                  ` :      ?`,
                  ` :    ?`,
                  `:    ?`,
                  ` :    .`,
                  `:   ?`,
                  ` :   .`,
                  `:   ?`,
                  ` :   ?`,
                  ` :    ?`,
                  ` :   ?`,
                  ` :   ?`,
                  ` :   .`,
                ][triLateW];
      }
      break;
    }

    // ===================== QUADRILATERALS =====================
    case "quadrilaterals": {
      const types = [burnDownCopy("utils__geometry-question-generator", "square"), burnDownCopy("utils__geometry-question-generator", "rectangle"), "Parallelogram", "Trapezoid"];
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const quadW = Math.floor(Math.random() * 10); // 10 stem variants
      const pickQuad = (variants) => variants[quadW % variants.length];
      
      params = { 
        type: selectedType, 
        kind: "quadrilaterals",
        patternFamily: `quadrilaterals_${formulaBand}_${levelKey}`,
      };
      correctAnswer = selectedType;
      
      if (formulaBand === "mid") {
        question =
          levelKey === "easy"
            ? pickQuad([
                `  .    ?`,
                `   :   ?`,
                `     .`,
                `   ?`,
                `    .`,
                `:     ?`,
                `    .`,
                `     .`,
                ` :     ?`,
                `      .`,
              ])
            : levelKey === "medium"
              ? pickQuad([
                  `      .`,
                  ` ,    ?`,
                  ` :     .`,
                  `  :   ?`,
                  ` :     ?`,
                  ` :    ?`,
                  ` :     .`,
                  ` :    ?`,
                ])
              : pickQuad([
                  ` :      .`,
                  ` :     ?`,
                  `        .`,
                  ` :     ?`,
                  ` :     ?`,
                  `:    ?`,
                  ` :      ?`,
                  ` :      .`,
                ]);
      } else {
        question =
          levelKey === "easy"
            ? pickQuad([
                ` :    ?`,
                `:     .`,
                `   ?`,
                `:     ?`,
                ` :    ?`,
                ` :   ?`,
                ` :   ?`,
                `  :    ?`,
                ` :     .`,
                `     ?`,
              ])
            : levelKey === "medium"
              ? pickQuad([
                  ` :     ?`,
                  `     .`,
                  ` :    ?`,
                  ` :    ?`,
                  ` :      ?`,
                  ` :    ?`,
                  `  :    ?`,
                  ` :     .`,
                ])
              : pickQuad([
                  ` :    ?`,
                  ` :    ?`,
                  ` :     ?`,
                  ` :      .`,
                  ` :      ?`,
                  ` :    ?`,
                  `:    ?`,
                  ` :    .`,
                ]);
      }
      break;
    }

    // ===================== TRANSFORMATIONS =====================
    case "transformations": {
      const scenarios = [
        {
          answer: burnDownCopy("utils__geometry-question-generator", "translation"),
          subtype: "translation",
          stems: {
            easy: [
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            medium: [
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            hard: [
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          },
        },
        {
          answer: burnDownCopy("utils__geometry-question-generator", "reflection"),
          subtype: "reflection",
          stems: {
            easy: [
              "The shape flips like in a mirror across a line — which move is this?",
              "",
              "The shape flips like in a mirror — which move?",
              "",
              "",
              "",
            ],
            medium: [
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            hard: [
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          },
        },
        {
          answer: burnDownCopy("utils__geometry-question-generator", "rotation"),
          subtype: "rotation",
          stems: {
            easy: [
              "",
              "",
              "",
              "",
              "We rotated a shape around a point — what is the action?",
              "",
            ],
            medium: [
              "",
              "",
              "A turn around a point — what is it called?",
              "",
              "",
              "",
            ],
            hard: [
              "",
              "",
              "A move that keeps distances from the center and changes angles — what is it called?",
              "",
              "",
              "",
            ],
          },
        },
        {
          answer: burnDownCopy("utils__geometry-question-generator", "no_movement"),
          subtype: "identity",
          stems: {
            easy: [
              "",
              "",
              "The shape did not move at all — which transformation?",
              "",
              "The shape stayed exactly the same — which action?",
              "We did nothing to the shape — which type?",
            ],
            medium: [
              "",
              "",
              "",
              "",
              "",
              "",
            ],
            hard: [
              "",
              "",
              "",
              "",
              "",
              "",
            ],
          },
        },
      ];
      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      const stemPool = scenario.stems[levelKey] || scenario.stems.medium;
      correctAnswer = scenario.answer;
      params = {
        kind: "concept_transform",
        type: scenario.answer,
        subtype: scenario.subtype,
        patternFamily: `transform_${formulaBand}_${levelKey}`,
        conceptTag: scenario.subtype,
        distractorFamily: "transform_confusion",
      };
      question = stemPool[Math.floor(Math.random() * stemPool.length)];
      break;
    }

    // ===================== ROTATION =====================
    case "rotation": {
      const angle = [90, 180, 270, 360][Math.floor(Math.random() * 4)];
      const angleLabel =
        angle === 90 ? "" :
        angle === 180 ? "" :
        angle === 270 ? "" : "";
      params = {
        angle,
        kind: "rotation",
        patternFamily: `rotation_${formulaBand}_${levelKey}`,
      };
      correctAnswer = angle;
      const rotW = Math.floor(Math.random() * 8);
      if (levelKey === "easy") {
        question = [
          `${angleLabel} -  ?`,
          `${angleLabel}   ?`,
          `${angleLabel}:    ?`,
          `   ${angleLabel}?`,
          `${angleLabel} -   ?`,
          `  ${angleLabel}.   ?`,
          `  ${angleLabel}.   ?`,
          `${angleLabel}   -   ?`,
        ][rotW];
      } else if (levelKey === "medium") {
        question = [
          `${angleLabel}:     ?`,
          `${angleLabel}    -    ?`,
          `${angleLabel} -   ?`,
          ` ${angleLabel} -  ?`,
          `   ${angleLabel}.   ?`,
          `  ${angleLabel}.   ?`,
          `${angleLabel} -    ?`,
          `   ${angleLabel}?`,
        ][rotW];
      } else {
        question = [
          `${angleLabel} -   ?`,
          `${angleLabel}:    ?`,
          `${angleLabel} -    ?`,
          `  ${angleLabel}.    ?`,
          `${angleLabel} - :  ?`,
          `: ${angleLabel}   ?`,
          `${angleLabel}   -  ?`,
          `${angleLabel}:    ?`,
        ][rotW];
      }
      break;
    }

    // ===================== SYMMETRY =====================
    case "symmetry": {
      const shapes = ["Square", "Rectangle", "Triangle Equilateral"];
      const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
      const axes = selectedShape === "Square" ? 4 : selectedShape === "Rectangle" ? 2 : 3;
      const pickSymStem = (stems) =>
        stems[Math.floor(Math.random() * stems.length)];
      const symW = Math.floor(Math.random() * 8);
      
      params = {
        shape: selectedShape,
        axes,
        kind: "symmetry",
        patternFamily: `symmetry_${formulaBand}_${levelKey}`,
      };
      correctAnswer = axes;
      
      if (formulaBand === "mid") {
        question =
          levelKey === "easy"
            ? [
                `   ( )  ${selectedShape}?`,
                `  :    ${selectedShape}?`,
                `     ${selectedShape}?`,
                ` :   ${selectedShape}?`,
                `  : ${selectedShape} - ?`,
                `    ${selectedShape}?`,
                ` : ${selectedShape} - ?`,
                `    ${selectedShape}?`,
              ][symW]
            : levelKey === "medium"
              ? [
                  ` :     ${selectedShape}?`,
                  `  -    ${selectedShape}?`,
                  `   ()  ${selectedShape}?`,
                  `  : ${selectedShape} -  ?`,
                  ` :    ${selectedShape}?`,
                  `    ${selectedShape}?`,
                  `${selectedShape} -   ?`,
                  `   ${selectedShape}.`,
                ][symW]
              : [
                  `  -      ${selectedShape}?`,
                  `  -     ${selectedShape}?`,
                  `:     ${selectedShape}?`,
                  ` :    ${selectedShape}.`,
                  `:   ${selectedShape} - ?`,
                  ` :    ${selectedShape}?`,
                  ` :   ${selectedShape}.`,
                  `  : ${selectedShape} - ?`,
                ][symW];
      } else if (levelKey === "easy") {
        question = pickSymStem([
          `     ${selectedShape}?`,
          ` : ${selectedShape} -   ?`,
          `:    ${selectedShape}.`,
          `    ${selectedShape}?`,
          `   ${selectedShape}?`,
          `  ${selectedShape} - ?`,
          `:   ${selectedShape}?`,
          `  : ${selectedShape}.`,
          ` : ${selectedShape} -   ?`,
          ` : ${selectedShape} -  ?`,
          `  : ${selectedShape}.`,
          ` : ${selectedShape} -   ?`,
        ]);
      } else if (levelKey === "medium") {
        question = pickSymStem([
          `   ()   ${selectedShape}?`,
          `:    ${selectedShape}.`,
          ` :   ${selectedShape}.`,
          `    ${selectedShape}?`,
          ` : ${selectedShape} -   ?`,
          `    ${selectedShape}?`,
          `  : ${selectedShape}.`,
          ` : ${selectedShape} - ?`,
          ` : ${selectedShape}.`,
          ` : ${selectedShape} -  ?`,
          ` :   ${selectedShape}.`,
          `  : ${selectedShape}.`,
        ]);
      } else {
        question = pickSymStem([
          `  -     ${selectedShape}?`,
          `:    ${selectedShape}.`,
          `:   ${selectedShape}.`,
          ` :   ${selectedShape}?`,
          ` :   ${selectedShape}.`,
          ` :    ${selectedShape}.`,
          `  : ${selectedShape} - ?`,
          ` :   ${selectedShape}.`,
          ` :    ${selectedShape}?`,
          ` :   ${selectedShape}.`,
          `:   ${selectedShape}.`,
          ` :   ${selectedShape}.`,
        ]);
      }
      break;
    }

    // ===================== DIAGONAL =====================
    case "diagonal": {
      // מסלול נוסחתי: משתמשים ב shape שנבחר מ TOPIC_SHAPES (כולל כפייה אל harness)
      const fromTopic =
        shape === "square"
          ? "Square"
          : shape === "rectangle"
            ? "Rectangle"
            : shape === "parallelogram"
              ? "Parallelogram"
              : null;
      const shapeOptions =
        gradeKey === "g5"
          ? ["Square", "Rectangle", "Parallelogram"]
          : ["Square", "Rectangle"];
      const hebShape =
        fromTopic && shapeOptions.includes(fromTopic)
          ? fromTopic
          : shapeOptions[Math.floor(Math.random() * shapeOptions.length)];
      const side = Math.floor(Math.random() * level.maxSide) + 1;
      
      let diagonal;
      if (hebShape === "Square") {
        diagonal = round(side * Math.sqrt(2));
        params = { shape: hebShape, side, diagonal, kind: "diagonal_square" };
        const diagSqW = Math.floor(Math.random() * 3);
        if (formulaBand === "mid") {
          if (levelKey === "easy") {
            question = [
              `The side of the square is ${side} .    .`,
              `  ${side}  -   ;   ?`,
              `  :  ${side} .   ?`,
            ][diagSqW];
          } else if (levelKey === "medium") {
            question = [
              `       ${side} cm?`,
              `The side of the square is ${side} .    .`,
              `   ${side} .   ?`,
            ][diagSqW];
          } else {
            question = [
              `  -   ${side} ,   ?`,
              `The side of the square is ${side} .    .`,
              `   ${side} .   ?`,
            ][diagSqW];
          }
        } else if (levelKey === "hard") {
          question = [
            `  -   ${side} :   ?`,
            `The side of the square is ${side} .    .`,
            `   ${side} .   ?`,
          ][diagSqW];
        } else {
          question = [
            `The side of the square is ${side} .    .`,
            `     ${side} cm?`,
            `   ${side} .   ?`,
          ][diagSqW];
        }
      } else if (hebShape === "Rectangle") {
        const width = Math.floor(Math.random() * level.maxSide) + 1;
        diagonal = round(Math.sqrt(side * side + width * width));
        params = {
          shape: hebShape,
          side,
          width,
          diagonal,
          kind: "diagonal_rectangle",
          patternFamily: `diagonal_rectangle_${levelKey}`,
        };
        const diagW = Math.floor(Math.random() * 3);
        if (formulaBand === "mid") {
          if (levelKey === "easy") {
            question = [
              `Rectangle ${side}×${width}.  ?`,
              `   :  ${side}, ${width} -  d?`,
              `  ${side} -${width}.   ().`,
            ][diagW];
          } else if (levelKey === "medium") {
            question = [
              `       ${side} and width ${width}?`,
              `  ${side}   ${width}  -   ?`,
              `   ${side} -${width} .`,
            ][diagW];
          } else {
            question = [
              `  -  ${side}×${width}.   ?`,
              `Rectangle ${side}×${width}.  d?`,
              `   ${side} -${width}.   ?`,
            ][diagW];
          }
        } else if (formulaBand === "late") {
          if (levelKey === "easy") {
            question = `  :  ${side}  ${width}.    ()?`;
          } else if (levelKey === "medium") {
            question = `   ${side} -${width}.   ?`;
          } else {
            question = `  -  ${side}×${width}:      .`;
          }
        } else if (levelKey === "hard") {
          question = `  -  ${side}×${width}:   ?`;
        } else {
          question = `Rectangle ${side} × ${width}:   ?`;
        }
      } else {
        // מקבילית - כיתה ה'
        const width = Math.floor(Math.random() * level.maxSide) + 1;
        diagonal = round(Math.sqrt(side * side + width * width));
        params = { shape: hebShape, side, width, diagonal, kind: "diagonal_parallelogram" };
        question = `:  ${side} -${width}.    (:  )?`;
      }
      
      correctAnswer = diagonal;
      break;
    }

    // ===================== HEIGHTS =====================
    case "heights": {
      const shapeType = Math.random();
      if (shapeType < 0.33) {
        const base = Math.floor(Math.random() * level.maxSide) + 1;
        const area = Math.floor(Math.random() * level.maxSide * 5) + 10;
        const height = round((area * 2) / base);
        params = { base, area, height, shape: "triangle", kind: "heights_triangle" };
        correctAnswer = height;
        const hTriW = Math.floor(Math.random() * 15);
        question = [
          `   ${base}   ${area} ,   ?`,
          `   ${area}   ${base} .    .`,
          `:  ${base} ,  ${area} .   ?`,
          `    ${base}   ${area} .   ?`,
          `   ${base}   ${area} ,  ?`,
          ` :  ${base} ,  ${area} ".  ?`,
          `:  ${base} ,  ${area} .    .`,
          `  ${area} .  ${base} .    ?`,
          `  ${base}   ${area} .  ?`,
          ` ${base} ,  ${area}  -    .`,
          `  ${area}   ${base} .    .`,
          `  :  ${base} ,  ${area} .  ?`,
          `:  ${base} ,  ${area} .  ?`,
          `   ${base}   ${area} .  ?`,
          ` ${area}   ${base} .    .`,
        ][hTriW];
      } else if (shapeType < 0.66) {
        const base = Math.floor(Math.random() * level.maxSide) + 1;
        const area = Math.floor(Math.random() * level.maxSide * 5) + 10;
        const height = round(area / base);
        params = { base, area, height, shape: "parallelogram", kind: "heights_parallelogram" };
        correctAnswer = height;
        const hParW = Math.floor(Math.random() * 12);
        question = [
          `   ${base}  ${area},  ?`,
          `:  ${base},  ${area}.  .`,
          `  ${area},  ${base}.  ?`,
          `:  ${base},  ${area}.  ?`,
          ` :  ${base},  ${area}.  ?`,
          `   ${base}  ${area}.  ?`,
          ` ${base}  ${area} -   ?`,
          `:  ${base},  ${area}.  ?`,
          ` :  ${base} ,  ${area} ".  ?`,
          `Parallelogram: ${area}  ,  ${base}.  ?`,
          ` :   ${base},  ${area}.`,
          `   ${area}  ${base}.   ?`,
        ][hParW];
      } else {
        const base1 = Math.floor(Math.random() * level.maxSide) + 1;
        const base2 = Math.floor(Math.random() * level.maxSide) + 1;
        const area = Math.floor(Math.random() * level.maxSide * 5) + 10;
        const height = round((area * 2) / (base1 + base2));
        params = { base1, base2, area, height, shape: "trapezoid", kind: "heights_trapezoid" };
        correctAnswer = height;
        const hTrapW = Math.floor(Math.random() * 10);
        question = [
          `   ${base1} -${base2}  ${area},  ?`,
          `:  ${base1} -${base2},  ${area}.  .`,
          `  ${area},  ${base1} -${base2}.  ?`,
          `:  ${base1} -${base2},  ${area}.  ?`,
          `:   ${base1},   ${base2},  ${area}.  ?`,
          `  :  ${base1} -${base2} ,  ${area} ".  ?`,
          `  :  ${area},  ${base1} -${base2}.`,
          `:  ${area},  ${base1} -${base2}.  ?`,
          `:  ${base1} -${base2},  ${area}.  ?`,
          `   ${base1} -${base2}  ${area}.   ?`,
        ][hTrapW];
      }
      break;
    }

    // ===================== TILING =====================
    case "tiling": {
      const tilingSubtype = Math.floor(Math.random() * 3);

      if (tilingSubtype === 0) {
        // שאלת זווית פנימית
        const shapes = ["Square", "Triangle Equilateral", "", "Rectangle"];
        const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];
        const angle =
          selectedShape === "Square" || selectedShape === "Rectangle" ? 90 :
          selectedShape === "Triangle Equilateral" ? 60 : 120;
        params = { shape: selectedShape, angle, kind: "tiling" };
        correctAnswer = angle;
        const tW = Math.floor(Math.random() * 14);
        question = [
          `    ${selectedShape}?`,
          `${selectedShape}   -   ?`,
          `:    ${selectedShape}?`,
          `      ${selectedShape}?`,
          `${selectedShape}  .    ?`,
          ` ${selectedShape}:    ?`,
          `   ${selectedShape},    ?`,
          `${selectedShape}  -    ?`,
          `      ${selectedShape}?`,
          `${selectedShape}  -    ?`,
          ` ${selectedShape} ,    ?`,
          `${selectedShape}    .   ?`,
          `   ${selectedShape}   -  ?`,
          `${selectedShape}:     ?`,
        ][tW];

      } else if (tilingSubtype === 1) {
        // ספירת אריחים לכיסוי שטח
        const tileSide = Math.floor(Math.random() * 4) + 1;   // צלע אריח 1-4
        const floorL = (Math.floor(Math.random() * 4) + 2) * tileSide;
        const floorW = (Math.floor(Math.random() * 4) + 2) * tileSide;
        const tileArea = tileSide * tileSide;
        const floorArea = floorL * floorW;
        const count = Math.round(floorArea / tileArea);
        params = { tileSide, floorL, floorW, tileArea, floorArea, count, kind: "tiling_count" };
        correctAnswer = count;
        const tcW = Math.floor(Math.random() * 16);
        question = [
          `  ${floorL}×${floorW}.     ${tileSide}.   ?`,
          `   ${tileSide}.  ${floorL}×${floorW}.  ?`,
          `  ${tileSide}.    ${floorL}×${floorW}.  ?`,
          `   ${tileSide}    ${floorL}×${floorW}?`,
          `  ${floorL}×${floorW}.    ${tileSide}×${tileSide}.  ?`,
          ` : ${floorL}×${floorW}.  : ${tileArea}.   ?`,
          ` ${floorL}×${floorW} .    ${tileSide}.  ?`,
          `  ${floorArea}    ${tileArea} -  ?`,
          `    ${tileSide}   ${floorL}×${floorW}?`,
          `  ${tileSide}×${tileSide}.     ${floorArea}?`,
          `  ${floorL}×${floorW}.   ${tileSide}×${tileSide}.   ?`,
          ` ${floorL}×${floorW}.   ${tileSide}×${tileSide}. ?`,
          `${floorL}×${floorW} -    ${tileSide}×${tileSide},   ?`,
          `  ${floorArea}   ${tileArea}.  ?`,
          `  ${tileSide}×${tileSide}  ${floorL}×${floorW}. ?`,
          `  ${floorL}×${floorW}.    ${tileSide}.    ?`,
        ][tcW];

      } else {
        // שאלת "איזו צורה יכולה לרצף" — MCQ מושגי
        const canTile = ["Square", "", "Triangle Equilateral"][Math.floor(Math.random() * 3)];
        const cannotTile = ["", "", ""][Math.floor(Math.random() * 3)];
        // שאלות על זווית פנימית שמאפשרת ריצוף
        const tilingShapes = ["Square", "Triangle Equilateral", ""];
        const tiledShape = tilingShapes[Math.floor(Math.random() * tilingShapes.length)];
        const tilingAngle =
          tiledShape === "Square" ? 90 : tiledShape === "Triangle Equilateral" ? 60 : 120;
        params = { shape: tiledShape, angle: tilingAngle, kind: "tiling" };
        correctAnswer = tilingAngle;
        const tcW2 = Math.floor(Math.random() * 16);
        question = [
          `${tiledShape}   .    ?`,
          `  ${tiledShape} -     ?`,
          `${tiledShape}    .    ?`,
          `     ${tiledShape}  ?`,
          `${tiledShape}  .   ?`,
          `  ${tiledShape}:    ?`,
          `${tiledShape}    .    ?`,
          `   ${tiledShape}    -  ?`,
          `${tiledShape}    .    ?`,
          `  ${tiledShape}.    ?`,
          `${tiledShape}    .   ?`,
          `    ${tiledShape}   ?`,
          `  ${tiledShape} -   ?`,
          `${tiledShape}:      ?`,
          `${tiledShape}   -   ?`,
          ` ${tiledShape}:    ?`,
        ][tcW2];
      }
      break;
    }

    // ===================== CIRCLES =====================
    case "circles": {
      const radius = Math.floor(Math.random() * (level.maxSide / 2)) + 1;
      const askArea = Math.random() < 0.5;
      
      if (askArea) {
        params = { radius, kind: "circle_area", askArea: true };
        correctAnswer = round(PI * radius * radius);
        if (gradeKey === "g6") {
          if (levelKey === "easy") {
            question = `A circle with radius ${radius}. What is the area of the disk? (π = 3.14)`;
          } else if (levelKey === "medium") {
            question = `A circle with radius ${radius}. What is the area? (π = 3.14)`;
          } else {
            question = `Area challenge — circle radius ${radius}: calculate the exact area (π = 3.14).`;
          }
        } else if (levelKey === "easy") {
          question = ` :  ${radius}. What is the area? (π = 3.14)`;
        } else if (levelKey === "medium") {
          question = `     ${radius}? (π = 3.14)`;
        } else {
          question = `Circle area — radius ${radius}. What is the area? (π = 3.14)`;
        }
      } else {
        params = { radius, kind: "circle_perimeter", askArea: false };
        correctAnswer = round(2 * PI * radius);
        if (gradeKey === "g6") {
          if (levelKey === "easy") {
            question = `Circle radius ${radius}. What is the perimeter? (π = 3.14)`;
          } else if (levelKey === "medium") {
            question = `Circle: radius ${radius}. What is the circumference? (π = 3.14)`;
          } else {
            question = `Circumference challenge — Circle radius ${radius}. What is the circumference? (π = 3.14)`;
          }
        } else if (levelKey === "hard") {
          question = ` -      ${radius}? (π = 3.14)`;
        } else {
          question = `     ${radius}? (π = 3.14)`;
        }
      }
      break;
    }

    // ===================== SOLIDS =====================
    case "solids": {
      const solidsList = [
        {
          name: "Cube", solidKey: "cube", num: 1, faces: 6, vertices: 8, edges: 12,
          curved: false,
          descs: [
            "6 equal square faces",
            "All faces are equal squares",
            "8 vertices and 6 square faces",
            "All edges are equal",
            "6 equal square faces",
            "Looks like a dice",
          ],
          dailyLife: ["dice", "ice cube", "Rubik's cube"],
        },
        {
          name: "Cuboid", solidKey: "rectangular_prism", num: 2, faces: 6, vertices: 8, edges: 12,
          curved: false,
          descs: [
            "6 rectangular faces",
            "Rectangular bases and rectangular faces",
            "8 vertices and 6 rectangular faces",
            "Length, width, and height can differ",
            "Like a cardboard box",
            "Six faces, not all equal",
          ],
          dailyLife: ["shoe box", "cardboard box", "brick"],
        },
        {
          name: "Cylinder", solidKey: "cylinder", num: 3, faces: 3, vertices: 0, edges: 2,
          curved: true,
          descs: [
            "2 circular bases and a curved side",
            "Circular base and cylindrical surface",
            "Looks like a can",
            "An elongated round shape",
            "Like a food can",
            "Two circles at the ends",
          ],
          dailyLife: ["soda can", "paper roll", "log"],
        },
        {
          name: "Pyramid", solidKey: "pyramid", num: 4, faces: 5, vertices: 5, edges: 8,
          curved: false,
          descs: [
            "Square base and 4 triangular faces",
            "Polygon base and triangular faces",
            "Top vertex and square base",
            "Looks like an Egyptian pyramid",
            "5 faces — a base and 4 triangles",
            "Triangular faces meeting at a point",
          ],
          dailyLife: ["Egyptian pyramid", "tent", "pointed roof"],
        },
        {
          name: "Cone", solidKey: "cone", num: 5, faces: 2, vertices: 1, edges: 1,
          curved: true,
          descs: [
            "Circular base and a sharp tip",
            "Circular base and smooth surface",
            "Like an ice-cream cone",
            "Circular base and pointed top",
            "Looks like a party hat",
            "One vertex and a circular base",
          ],
          dailyLife: ["ice-cream cone", "party hat", "traffic cone"],
        },
        {
          name: "Sphere", solidKey: "sphere", num: 6, faces: 1, vertices: 0, edges: 0,
          curved: true,
          descs: [
            "All points are the same distance from the center",
            "Round in every direction",
            "No corners and no edges",
            "A round surface from every angle",
            "Can roll in any direction",
            "Equal radius from center to every point",
          ],
          dailyLife: ["soccer ball", "apple", "tennis ball"],
        },
      ];

      const sel = solidsList[Math.floor(Math.random() * solidsList.length)];
      const solidSubtype = Math.floor(Math.random() * 5);
      const swDesc = Math.floor(Math.random() * sel.descs.length);
      const swDL = Math.floor(Math.random() * sel.dailyLife.length);

      if (formulaBand === "early" || solidSubtype === 0) {
        // g2 ו-g3: זיהוי שם לפי תיאור
        params = { solid: sel.name, solidShape: sel.solidKey, desc: sel.descs[swDesc], kind: "solids" };
        correctAnswer = sel.name;
        const sW = Math.floor(Math.random() * 8);
        if (formulaBand === "early") {
          question = [
            `: ${sel.descs[swDesc]}.   ?`,
            `  : ${sel.descs[swDesc]}.`,
            `${sel.dailyLife[swDL]} -   ?`,
            `  : ${sel.descs[swDesc]}.`,
            `   - ${sel.descs[swDesc]}.  ?`,
            `${sel.descs[swDesc]} -   ?`,
            `   : ${sel.descs[swDesc]}?`,
            ` : ${sel.descs[swDesc]}.`,
          ][sW];
        } else {
          question = [
            `    ${sel.descs[swDesc]}.  ?`,
            `${sel.descs[swDesc]}.    ?`,
            `  : ${sel.descs[swDesc]}.`,
            `${sel.dailyLife[swDL]}   -  ?`,
            `   ${sel.descs[swDesc]}.  ?`,
            ` : ${sel.descs[swDesc]}.  ?`,
            ` : ${sel.descs[swDesc]}.  ?`,
            ` : ${sel.descs[swDesc]}.  ?`,
          ][sW];
        }
      } else if (solidSubtype === 1 && (formulaBand === "mid" || formulaBand === "late")) {
        // g3-g6: כמה פאות?
        params = { solid: sel.name, solidShape: sel.solidKey, faces: sel.faces, kind: "solids_faces" };
        correctAnswer = sel.faces;
        const sfW = Math.floor(Math.random() * 8);
        question = [
          `   ${sel.name}?`,
          `${sel.name} -  ?`,
          `   ${sel.name}.  ?`,
          `${sel.name} -   ?`,
          `    ${sel.name}?`,
          `${sel.name}:   .`,
          `${sel.name}   ?`,
          `   ${sel.name} ?`,
        ][sfW];
      } else if (solidSubtype === 2 && (formulaBand === "mid" || formulaBand === "late")) {
        // g3-g6: כמה קודקודים?
        params = { solid: sel.name, solidShape: sel.solidKey, vertices: sel.vertices, kind: "solids_vertices" };
        correctAnswer = sel.vertices;
        const svW = Math.floor(Math.random() * 8);
        question = [
          `   ${sel.name}?`,
          `${sel.name} -  ?`,
          `${sel.name}:   ?`,
          `  ${sel.name}.  ?`,
          `  ()  ${sel.name}?`,
          `${sel.name} -   ?`,
          `${sel.name}:   .`,
          `   ${sel.name}?`,
        ][svW];
      } else if (solidSubtype === 3 && (formulaBand === "mid" || formulaBand === "late")) {
        // g3-g6: כמה צלעות?
        params = { solid: sel.name, solidShape: sel.solidKey, edges: sel.edges, kind: "solids_edges" };
        correctAnswer = sel.edges;
        const seW = Math.floor(Math.random() * 6);
        question = [
          `   ${sel.name}?`,
          `${sel.name} -  ?`,
          `${sel.name}:   ?`,
          `  ${sel.name}.  ?`,
          `${sel.name} -     ?`,
          `   ${sel.name}?`,
        ][seW];
      } else {
        // ברירת מחדל: זיהוי שם
        params = { solid: sel.name, solidShape: sel.solidKey, desc: sel.descs[swDesc], kind: "solids" };
        correctAnswer = sel.name;
        question = `    ${sel.descs[swDesc]}.  ?`;
      }
      break;
    }

    // ===================== DEFAULT =====================
    default: {
      const side = Math.floor(Math.random() * level.maxSide) + 1;
      params = { side, kind: "square_area" };
      correctAnswer = round(side * side);
      question =
        formulaBand === "early"
          ? `:  ${side}.  ?`
          : formulaBand === "mid"
            ? `      ${side}?`
            : `   ${side}. What is the area?`;
    }
  }

  // ===== יצירת תשובות (מסיחים הקשריים) =====
  const shuffledAnswers = buildGeometryMcqAnswers({
    correctAnswer,
    params,
    level,
    round,
    selectedTopic,
    shape,
  });

  const baseKindOut = params?.kind?.replace(/^story_/, "") || "";
  const labelMcq =
    Boolean(GEOMETRY_INDEX_LABEL_KINDS[baseKindOut]) ||
    Boolean(GEOMETRY_HEBREW_LABEL_OPTIONS[baseKindOut]);
  const resolvedCorrect = GEOMETRY_INDEX_LABEL_KINDS[baseKindOut]
    ? String(Math.round(Number(correctAnswer)))
    : correctAnswer;

  const correctIdx = shuffledAnswers.findIndex(
    (a) => String(a) === String(resolvedCorrect) || String(a) === String(correctAnswer)
  );
  const skipLabelRepair =
    (baseKindOut === "concept_transform" && Boolean(GEOMETRY_HEBREW_LABEL_OPTIONS.concept_transform)) ||
    baseKindOut === "concept_tf" ||
    params?.answerMode === "binary";
  const repairedBundle = skipLabelRepair
    ? { answers: shuffledAnswers, correctAnswer: resolvedCorrect }
    : repairMcqObviousAnswerContent(
        {
          question,
          answers: shuffledAnswers,
          correctIndex: correctIdx >= 0 ? correctIdx : 0,
          correctAnswer: resolvedCorrect,
        },
        { subject: "geometry", stem: question }
      );
  const repairedAnswers = repairedBundle.answers ?? shuffledAnswers;
  const repairedCorrect =
    repairedBundle.correctAnswer != null ? repairedBundle.correctAnswer : resolvedCorrect;
  const finalCorrectIdx = repairedAnswers.findIndex(
    (a) => String(a) === String(repairedCorrect)
  );

  const enrichedParams = enrichGeometryProceduralParams(params, {
    topic: selectedTopic,
    gradeKey,
    levelKey,
  });

  return localizeLearningQuestion(
    applyMcqEvidenceTaggingToQuestion(
      sanitizeQuestionForStudentDisplay(
        attachCanonicalMetadataToMathGeometryQuestion(
          {
            question,
            correctAnswer: repairedCorrect,
            answers: repairedAnswers,
            options: repairedAnswers,
            correctIndex: finalCorrectIdx >= 0 ? finalCorrectIdx : 0,
            topic: selectedTopic,
            shape,
            params: enrichedParams,
            subjectId: "geometry",
            type: "mcq",
          },
          {
            subject: "geometry",
            gradeKey,
            levelKey,
            topic: selectedTopic,
          }
        )
      )
    ),
    { subject: "geometry", contentLocale: "en" }
  );
}

