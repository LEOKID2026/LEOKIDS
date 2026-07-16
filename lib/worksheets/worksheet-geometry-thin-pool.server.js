/**
 * Supplemental English geometry worksheet pools for thin topics (count 12–20).
 * Worksheets-only — does not modify shared geometry-question-generator.
 * @module lib/worksheets/worksheet-geometry-thin-pool.server
 */

import {
  GEOMETRY_CONCEPTUAL_ITEMS,
  renderGeometryConceptualRowToQuestion,
} from "../../utils/geometry-conceptual-bank.js";
import { itemAllowedForGrade } from "../../utils/grade-gating.js";

const HEBREW_RE = /[\u0590-\u05FF]/;

const PP_MID_STEMS = {
  easy: [
    `Look at the two lines in the diagram. What is the relationship between them?`,
    `Quick check: what is the relationship between the lines in the diagram?`,
    `According to the diagram, how are the two lines related?`,
    `Check the diagram — are the lines parallel or perpendicular?`,
    `What geometric relationship do the lines show?`,
    `Use the diagram to classify the pair of lines.`,
    `Which relationship matches the lines shown?`,
    `Identify the relationship between the two lines.`,
    `Are the lines in the diagram parallel or perpendicular?`,
    `Choose the correct relationship for the lines shown.`,
    `From the diagram, pick the correct line relationship.`,
    `What do the two lines in the diagram form?`,
  ],
  medium: [
    `Classify the lines in the diagram: what is the correct relationship?`,
    `Choose according to the diagram: how are the two lines related?`,
    `Line identification: what relationship does the diagram show?`,
    `Compare the two lines in the diagram — what is their relationship?`,
    `Mark the correct relationship between the lines in the diagram.`,
    `According to the diagram — parallel or perpendicular?`,
    `What is the relationship between the lines shown in the diagram?`,
    `Check the pair of lines: what is the correct relationship?`,
    `Short classification: parallel or perpendicular according to the diagram?`,
    `Complete the classification using the diagram.`,
    `Based on the diagram marks, choose the correct relationship.`,
    `Which statement matches the lines in the diagram?`,
  ],
  hard: [
    `According to the diagram, which relationship holds between the two lines?`,
    `Classify the lines from the diagram: what is the correct relationship?`,
    `Look carefully at the two lines. What relationship do they have?`,
    `Using the marks in the diagram, what geometric relationship is shown?`,
    `Choose from the diagram: how are the two lines related?`,
    `Which pair description matches the diagram — parallel or perpendicular?`,
    `Analyze the lines: what is the correct relationship according to the diagram?`,
    `Complete the classification: parallel or perpendicular?`,
    `Check the marked pair of lines in the diagram: parallel or perpendicular?`,
    `Which relationship is supported by the diagram evidence?`,
    `Decide from the diagram whether the lines are parallel or perpendicular.`,
    `Use the diagram symbols to select the correct relationship.`,
  ],
};

const PP_LATE_STEMS = {
  easy: [
    `Quick identification: what is the relationship between the lines in the diagram?`,
    `Look at the two lines in the diagram. What is the relationship between them?`,
    `According to the diagram: how are the two lines related?`,
    `Check the diagram — parallel or perpendicular?`,
    `What is the relationship between the lines shown?`,
    `Classify the lines using the diagram.`,
    `Which relationship matches the diagram?`,
    `Identify whether the lines are parallel or perpendicular.`,
    `Are the lines in the diagram parallel or perpendicular?`,
    `Choose the correct relationship for the lines shown.`,
    `From the diagram, pick the correct line relationship.`,
    `What do the two lines in the diagram form?`,
  ],
  medium: [
    `Choose according to the diagram: how are the two lines related?`,
    `Classify the lines in the diagram: what is the correct relationship?`,
    `Line identification: what relationship does the diagram show?`,
    `Compare the two lines in the diagram — what is their relationship?`,
    `Mark the correct relationship between the lines in the diagram.`,
    `According to the diagram — parallel or perpendicular?`,
    `What is the relationship between the lines shown in the diagram?`,
    `Check the pair of lines: what is the correct relationship?`,
    `Short classification: parallel or perpendicular according to the diagram?`,
    `Complete the classification using the diagram.`,
    `Based on the diagram marks, choose the correct relationship.`,
    `Which statement matches the lines in the diagram?`,
  ],
  hard: [
    `Using the marks and the diagram, what geometric relationship do the two lines have?`,
    `According to the diagram, which relationship holds between the two lines?`,
    `Choose according to the diagram: how are the two lines related?`,
    `Classify the lines from the diagram: what is the correct relationship?`,
    `Look carefully at the two lines. What relationship do they have?`,
    `Which pair description matches the diagram — parallel or perpendicular?`,
    `Analyze the lines: what is the correct relationship according to the diagram?`,
    `Complete the classification: parallel or perpendicular?`,
    `Check the marked pair of lines in the diagram: parallel or perpendicular?`,
    `Which relationship is supported by the diagram evidence?`,
    `Decide from the diagram whether the lines are parallel or perpendicular.`,
    `Use the diagram symbols to select the correct relationship.`,
  ],
};

/** Topics that always use supplemental worksheet pools. */
export const WORKSHEET_GEOMETRY_THIN_POOL_TOPICS = new Set([
  "parallel_perpendicular",
  "circles",
  "quadrilaterals",
  "triangles",
  "transformations",
  "symmetry",
]);

/**
 * @param {string} gradeKey
 * @param {string} topicKey
 */
export function geometryWorksheetUsesThinPool(gradeKey, topicKey) {
  if (WORKSHEET_GEOMETRY_THIN_POOL_TOPICS.has(topicKey)) return true;
  return topicKey === "shapes_basic" && gradeKey === "g4";
}

/**
 * @param {string} gradeKey
 * @returns {"mid"|"late"}
 */
function formulaBand(gradeKey) {
  const n = parseInt(String(gradeKey).replace(/\D/g, ""), 10) || 3;
  return n <= 4 ? "mid" : "late";
}

/**
 * @param {string} gradeKey
 * @param {string} topicKey
 * @param {string} levelKey easy|medium|hard
 */
export function listGeometryConceptualWorksheetPool(gradeKey, topicKey, levelKey) {
  const lv = String(levelKey || "medium").toLowerCase();
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (const row of GEOMETRY_CONCEPTUAL_ITEMS) {
    if (!row.topics?.includes(topicKey)) continue;
    if (!itemAllowedForGrade(row, gradeKey)) continue;
    if (row.levels && !row.levels.includes(lv)) continue;
    const rendered = renderGeometryConceptualRowToQuestion(row, {
      gradeKey,
      levelKey: lv,
      topic: topicKey,
    });
    const question = String(rendered.question || "");
    const answer = String(rendered.correctAnswer || "");
    const answers = Array.isArray(rendered.answers) ? rendered.answers.map(String) : undefined;
    if (HEBREW_RE.test(`${question}\n${answer}\n${(answers || []).join("\n")}`)) continue;
    out.push({
      question,
      correctAnswer: answer,
      answers,
      topic: topicKey,
      params: { ...rendered.params, worksheetPoolSource: "conceptual", poolRowId: row.subtype },
    });
  }
  return out;
}

/**
 * @param {string} gradeKey
 * @param {string} levelKey
 */
export function listParallelPerpendicularDiagramPool(gradeKey, levelKey) {
  const lv = String(levelKey || "medium").toLowerCase();
  const band = formulaBand(gradeKey);
  const stemBank = band === "mid" ? PP_MID_STEMS : PP_LATE_STEMS;
  const stems = stemBank[lv] || stemBank.medium || stemBank.easy;
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (let variant = 0; variant < stems.length; variant += 1) {
    for (const isParallel of [true, false]) {
      const selectedType = isParallel ? "Parallel" : "Perpendicular";
      out.push({
        question: stems[variant],
        correctAnswer: selectedType,
        answers: ["Parallel", "Perpendicular"],
        topic: "parallel_perpendicular",
        params: {
          type: selectedType,
          isParallel,
          kind: "parallel_perpendicular",
          patternFamily: `parallel_perpendicular_${lv}`,
          subtype: band === "mid" ? "mid_band" : "late_band",
          diagramVariant: variant,
          worksheetPoolSource: "diagram_catalog",
        },
      });
    }
  }
  return out;
}

/**
 * @param {string} gradeKey
 * @param {string} levelKey
 */
export function listCirclesWorksheetPool(gradeKey, levelKey) {
  const lv = String(levelKey || "medium").toLowerCase();
  const maxR = gradeKey === "g6" ? 24 : 16;
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (let radius = 1; radius <= maxR; radius += 1) {
    for (const askArea of [true, false]) {
      const kind = askArea ? "circle_area" : "circle_perimeter";
      const correctAnswer = askArea
        ? Math.round(3.14 * radius * radius)
        : Math.round(2 * 3.14 * radius);
      const question = askArea
        ? gradeKey === "g6"
          ? lv === "easy"
            ? `A circle has radius ${radius}. What is the area of the disk? (π = 3.14)`
            : lv === "medium"
              ? `A circle has radius ${radius}. What is the area? (π = 3.14)`
              : `Area challenge — circle radius ${radius}: calculate the exact area (π = 3.14).`
          : `What is the area of a circle with radius ${radius}? (π = 3.14)`
        : gradeKey === "g6"
          ? lv === "easy"
            ? `A circle has radius ${radius}. What is the circumference? (π = 3.14)`
            : `Circle: radius ${radius}. What is the circumference? (π = 3.14)`
          : `What is the circumference of a circle with radius ${radius}? (π = 3.14)`;
      out.push({
        question,
        correctAnswer: String(correctAnswer),
        topic: "circles",
        params: {
          radius,
          kind,
          askArea,
          patternFamily: `circles_${gradeKey}_${lv}`,
          worksheetPoolSource: "circles_catalog",
          diagramVariant: radius,
        },
      });
    }
  }
  return out;
}

/**
 * @param {string} gradeKey
 * @param {string} levelKey
 */
export function listShapesBasicWorksheetPool(gradeKey, levelKey) {
  if (gradeKey !== "g4") return [];
  const lv = String(levelKey || "medium").toLowerCase();
  const shapes = ["Square", "Rectangle", "Triangle", "Parallelogram"];
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (let i = 0; i < shapes.length; i += 1) {
    const shape = shapes[i];
    for (let v = 0; v < 6; v += 1) {
      const side = 3 + ((i + v) % 8);
      out.push({
        question: [
          `Angles in a ${shape} — how many are right angles? (1 = 2, 2 = 3, 3 = 4, 4 = none)`,
          `Analyze the angles in a ${shape}: (1 = 2, 2 = 3, 3 = 4, 4 = none)`,
          `Short challenge — right angles in a ${shape}: (1 = 2, 2 = 3, 3 = 4, 4 = none)`,
          `Angle property of a ${shape}: (1 = 2, 2 = 3, 3 = 4, 4 = none)`,
          `How many right angles does a ${shape} have? (1 = 2, 2 = 3, 3 = 4, 4 = none)`,
          `Identify angles in a ${shape} with side ${side}: (1 = 2, 2 = 3, 3 = 4, 4 = none)`,
        ][v % 6],
        correctAnswer: shape === "Square" || shape === "Rectangle" ? "4" : "2",
        answers: ["2", "3", "4", "none"],
        topic: "shapes_basic",
        params: {
          shape,
          side,
          kind: "shapes_basic_properties_angles",
          patternFamily: `shapes_basic_angles_${gradeKey}_${lv}`,
          worksheetPoolSource: "shapes_catalog",
          diagramVariant: i * 6 + v,
        },
      });
    }
  }
  return out;
}

/**
 * @param {string[]} stems
 * @param {string[]} types
 * @param {string} topic
 * @param {string} kind
 * @param {string} levelKey
 */
function listClassifyDiagramPool(stems, types, topic, kind, levelKey) {
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (let variant = 0; variant < stems.length; variant += 1) {
    for (let ti = 0; ti < types.length; ti += 1) {
      const selectedType = types[ti];
      out.push({
        question: stems[variant],
        correctAnswer: selectedType,
        answers: types.slice(),
        topic,
        shape: selectedType,
        params: {
          type: selectedType,
          shape: selectedType,
          kind,
          patternFamily: `${kind}_${levelKey}`,
          subtype: `${kind}_diagram`,
          diagramVariant: variant * 10 + ti,
          worksheetPoolSource: "diagram_catalog",
        },
      });
    }
  }
  return out;
}

/**
 * @param {string} levelKey
 */
function listQuadrilateralsWorksheetPool(levelKey) {
  const lv = String(levelKey || "medium").toLowerCase();
  const stems = [
    `Look at the quadrilateral in the diagram. What type is it?`,
    `Identify the quadrilateral shown in the diagram.`,
    `Choose the correct name for the quadrilateral in the diagram.`,
    `According to the diagram, which quadrilateral is shown?`,
    `Classify the quadrilateral using the diagram.`,
    `Which quadrilateral matches the shape in the diagram?`,
    `Use the diagram to name the quadrilateral.`,
    `What type of quadrilateral appears in the diagram?`,
    `Pick the best name for the quadrilateral shown.`,
    `Based on the diagram, select the quadrilateral type.`,
  ];
  return listClassifyDiagramPool(
    stems,
    ["Square", "Rectangle", "Parallelogram", "Trapezoid"],
    "quadrilaterals",
    "quadrilaterals",
    lv
  );
}

/**
 * @param {string} levelKey
 */
function listTrianglesWorksheetPool(levelKey) {
  const lv = String(levelKey || "medium").toLowerCase();
  const stems = [
    `Look at the triangle in the diagram. What type is it?`,
    `Identify the triangle shown in the diagram.`,
    `Choose the correct name for the triangle in the diagram.`,
    `According to the diagram, which triangle is shown?`,
    `Classify the triangle using the diagram.`,
    `Which triangle matches the shape in the diagram?`,
    `Use the diagram to name the triangle.`,
    `What type of triangle appears in the diagram?`,
    `Pick the best name for the triangle shown.`,
    `Based on the diagram, select the triangle type.`,
  ];
  return listClassifyDiagramPool(
    stems,
    ["Equilateral", "Isosceles", "Scalene"],
    "triangles",
    "triangles",
    lv
  );
}

/**
 * @param {string} levelKey
 */
function listTransformationsWorksheetPool(levelKey) {
  const lv = String(levelKey || "medium").toLowerCase();
  const stems = [
    `Look at the diagram. Which transformation is shown?`,
    `Identify the transformation in the diagram.`,
    `Choose the correct transformation for the diagram.`,
    `According to the diagram, which move was used?`,
    `Classify the transformation shown.`,
    `Which transformation matches the diagram?`,
    `Use the diagram to name the transformation.`,
    `What transformation appears in the diagram?`,
    `Pick the best name for the transformation shown.`,
    `Based on the diagram, select the transformation.`,
  ];
  return listClassifyDiagramPool(
    stems,
    ["Translation", "Rotation", "Reflection"],
    "transformations",
    "transformations",
    lv
  );
}

/**
 * @param {string} levelKey
 */
function listSymmetryWorksheetPool(levelKey) {
  const lv = String(levelKey || "medium").toLowerCase();
  const stems = [
    `Look at the shape in the diagram. How many lines of symmetry does it have?`,
    `Count the lines of symmetry shown in the diagram.`,
    `According to the diagram, how many symmetry lines are there?`,
    `Choose the number of lines of symmetry for the shape.`,
    `How many lines of symmetry does the diagram show?`,
    `Identify the number of symmetry lines in the diagram.`,
    `Use the diagram to count the lines of symmetry.`,
    `What is the number of lines of symmetry for the shape shown?`,
    `Select the correct count of symmetry lines.`,
    `Based on the diagram, how many symmetry lines are present?`,
  ];
  const answers = ["0", "1", "2", "4"];
  /** @type {Array<Record<string, unknown>>} */
  const out = [];
  for (let variant = 0; variant < stems.length; variant += 1) {
    for (let ai = 0; ai < answers.length; ai += 1) {
      out.push({
        question: stems[variant],
        correctAnswer: answers[ai],
        answers: answers.slice(),
        topic: "symmetry",
        params: {
          type: answers[ai],
          axes: Number(answers[ai]),
          kind: "symmetry",
          patternFamily: `symmetry_${lv}`,
          subtype: "symmetry_diagram",
          diagramVariant: variant * 10 + ai,
          worksheetPoolSource: "diagram_catalog",
        },
      });
    }
  }
  return out;
}

/**
 * @param {string} gradeKey
 * @param {string} topicKey
 * @param {string} levelKey
 */
export function listGeometryWorksheetThinPool(gradeKey, topicKey, levelKey) {
  const topic = String(topicKey || "").trim();
  const lv = String(levelKey || "medium").toLowerCase();
  /** @type {Array<Record<string, unknown>>} */
  let pool = listGeometryConceptualWorksheetPool(gradeKey, topic, lv);
  if (topic === "parallel_perpendicular") {
    pool = pool.concat(listParallelPerpendicularDiagramPool(gradeKey, lv));
  } else if (topic === "circles") {
    pool = pool.concat(listCirclesWorksheetPool(gradeKey, lv));
  } else if (topic === "shapes_basic") {
    pool = pool.concat(listShapesBasicWorksheetPool(gradeKey, lv));
  } else if (topic === "quadrilaterals") {
    pool = pool.concat(listQuadrilateralsWorksheetPool(lv));
  } else if (topic === "triangles") {
    pool = pool.concat(listTrianglesWorksheetPool(lv));
  } else if (topic === "transformations") {
    pool = pool.concat(listTransformationsWorksheetPool(lv));
  } else if (topic === "symmetry") {
    pool = pool.concat(listSymmetryWorksheetPool(lv));
  }
  const seen = new Set();
  return pool.filter((row) => {
    const fp = `${row.question}|${row.correctAnswer}|${row.params?.subtype}|${row.params?.diagramVariant}|${row.params?.poolRowId}`;
    if (HEBREW_RE.test(fp) || seen.has(fp)) return false;
    seen.add(fp);
    return true;
  });
}
