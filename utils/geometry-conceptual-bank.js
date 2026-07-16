import { itemAllowedForGrade } from "./grade-gating.js";
import { mergeDiagnosticContractIntoParams } from "./diagnostic-question-contract.js";
import { sanitizeQuestionForStudentDisplay } from "./student-question-stem-sanitizer.js";
import { attachCanonicalMetadataToMathGeometryQuestion } from "../lib/learning/math-geometry-canonical-metadata.js";
import { repairMcqObviousAnswerContent } from "./mcq-fail-content-repair.js";
import { ensureMcqFourOptions, NORMAL_MCQ_OPTION_COUNT } from "./mcq-four-options.js";

/**
 * Conceptual geometry questions — inference, comparison, classification,
 * area/perimeter confusion, multi-step concept items. Text answers; binary = 2 options.
 */

function shuffleOptions(correct, options) {
  const arr = [...new Set(options.map((s) => String(s).trim()))].filter(Boolean);
  if (!arr.includes(correct)) arr.push(correct);
  const isBinaryTf = arr.every((t) => t === "True" || t === "False");
  if (isBinaryTf) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return { answers: arr, correctAnswer: correct };
  }
  let guard = 0;
  while (arr.length < NORMAL_MCQ_OPTION_COUNT && guard < 40) {
    guard += 1;
    const extra = options.find((x) => {
      const t = String(x).trim();
      return t && t !== correct && !arr.includes(t);
    });
    if (extra) {
      arr.push(String(extra).trim());
      continue;
    }
    if (isBinaryTf) {
      const tfPool =
        correct === "True"
          ? ["False", "Only in special cases", "Depends on the shape"]
          : correct === "False"
            ? ["True", "True in every case", "Always true"]
            : [];
      const next = tfPool.find((t) => t !== correct && !arr.includes(t));
      if (next) {
        arr.push(next);
        continue;
      }
    }
    const synth = ["Another option", "Does not fit", "Usually not", "Not correct here"].find(
      (t) => t !== correct && !arr.includes(t)
    );
    if (synth) arr.push(synth);
    else break;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return { answers: arr.slice(0, NORMAL_MCQ_OPTION_COUNT), correctAnswer: correct };
}

/**
 * Render one conceptual bank row into a lesson question (deterministic wiring).
 * @param {Record<string, unknown>} row
 * @param {{ gradeKey: string, levelKey: string, topic: string }} ctx
 */
export function renderGeometryConceptualRowToQuestion(row, ctx) {
  const { gradeKey, levelKey, topic } = ctx;
  const lv = levelKey || "easy";
  const correct = String(row.correct).trim();
  const qText = String(row.question || "").trim();
  const rowKind = String(row.kind || "").trim();
  const isTrueFalseRow =
    rowKind === "concept_tf" ||
    row.binary === true ||
    (/\bTrue\b/i.test(qText) && /\bFalse\b/i.test(qText));
  let answers;
  const baseParams = {
    kind: rowKind || "conceptual_mcq",
    patternFamily: row.patternFamily,
    subtype: row.subtype,
    conceptTag: row.conceptTag,
    distractorFamily: row.distractorFamily || "conceptual",
    answerMode: isTrueFalseRow ? "binary" : "mcq_text",
  };
  let params = mergeDiagnosticContractIntoParams(baseParams, {
    diagnosticSkillId: row.diagnosticSkillId,
    expectedErrorTags: row.expectedErrorTags,
    probePower: row.probePower,
    suggestedQuestionType: row.suggestedQuestionType,
  });
  if (rowKind === "concept_transform") {
    params.type = correct;
    params.subtype = row.subtype || params.subtype;
  }

  if (isTrueFalseRow) {
    const opts = ["True", "False"];
    const sh = shuffleOptions(correct, opts);
    answers = sh.answers;
    params.optionCount = answers.length;
  } else {
    const sh = shuffleOptions(correct, row.options);
    answers = sh.answers;
    params.optionCount = answers.length;
  }

  const levelFr =
    lv === "easy"
      ? "Concepts (easy)"
      : lv === "medium"
        ? "Concepts (medium)"
        : "Concepts (challenge)";
  const correctIdx = answers.findIndex((a) => String(a).trim() === correct);
  const skipLabelRepair = rowKind === "concept_transform" || isTrueFalseRow;
  const repaired = skipLabelRepair
    ? { answers, correctAnswer: correct }
    : repairMcqObviousAnswerContent(
        {
          question: qText,
          answers,
          correctIndex: correctIdx >= 0 ? correctIdx : 0,
          correctAnswer: correct,
        },
        { subject: "geometry", stem: qText }
      );
  const outAnswers = repaired.answers ?? answers;
  const outCorrect = String(repaired.correctAnswer ?? correct).trim();
  const outIdx = outAnswers.findIndex((a) => String(a).trim() === outCorrect);

  return sanitizeQuestionForStudentDisplay(
    attachCanonicalMetadataToMathGeometryQuestion(
      {
        question: qText,
        correctAnswer: outCorrect,
        answers: outAnswers,
        topic,
        shape: null,
        params: { ...params, conceptualLevelFraming: levelFr },
      },
      {
        subject: "geometry",
        gradeKey,
        levelKey: lv,
        topic,
      }
    )
  );
}

/**
 * @param {{ gradeKey: string, levelKey: string, topic: string }} ctx
 * @returns {null | { question: string, correctAnswer: string, answers: string[], params: object }}
 */
export function pickGeometryConceptualQuestion(ctx) {
  const { gradeKey, levelKey, topic } = ctx;
  const g = gradeKey || "g3";
  const lv = levelKey || "easy";
  const candidates = GEOMETRY_CONCEPTUAL_ITEMS.filter((row) => {
    if (!row.topics.includes(topic)) return false;
    if (!itemAllowedForGrade(row, g)) return false;
    if (row.levels && !row.levels.includes(lv)) return false;
    return true;
  });
  if (candidates.length === 0) return null;
  const row = candidates[Math.floor(Math.random() * candidates.length)];
  const rendered = renderGeometryConceptualRowToQuestion(row, {
    gradeKey,
    levelKey,
    topic,
  });
  return {
    question: rendered.question,
    correctAnswer: rendered.correctAnswer,
    answers: rendered.answers,
    params: rendered.params,
  };
}

/** Probability of trying the conceptual bank before a formulaic item */
export function geometryConceptualProbability(gradeKey, topic) {
  const p = {
    g1: { shapes_basic: 0.35, transformations: 0.35, default: 0 },
    g2: { area: 0.45, solids: 0.4, transformations: 0.3, default: 0.25 },
    g3: {
      area: 0.58,
      perimeter: 0.58,
      angles: 0.52,
      triangles: 0.45,
      quadrilaterals: 0.45,
      parallel_perpendicular: 0.4,
      rotation: 0.35,
      default: 0.4,
    },
    g4: {
      area: 0.6,
      perimeter: 0.6,
      volume: 0.45,
      shapes_basic: 0.45,
      symmetry: 0.45,
      diagonal: 0.4,
      default: 0.42,
    },
    g5: {
      area: 0.62,
      perimeter: 0.55,
      volume: 0.48,
      heights: 0.45,
      tiling: 0.5,
      quadrilaterals: 0.45,
      default: 0.45,
    },
    g6: {
      area: 0.55,
      perimeter: 0.55,
      volume: 0.48,
      circles: 0.5,
      angles: 0.48,
      pythagoras: 0.42,
      solids: 0.45,
      default: 0.48,
    },
  };
  const map = p[gradeKey];
  if (!map) return 0;
  return map[topic] ?? map.default ?? 0;
}

/** Export for audit script (`scripts/audit-question-banks.mjs`) */
// Metadata enrichment (safe pass): difficulty, cognitiveLevel, expectedErrorTypes, prerequisiteSkillIds (confidence/taxonomy-gated). See reports/question-metadata-qa/geometry-metadata-apply-report.json.
export const GEOMETRY_CONCEPTUAL_ITEMS = [
  {
    "gradeBand": "mid",
    "topics": [
      "area",
      "perimeter"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_measure_interpret",
    "patternFamily": "perimeter_vs_area",
    "subtype": "choose_measure",
    "conceptTag": "pv_area",
    "distractorFamily": "measure_confusion",
    "diagnosticSkillId": "geo_pv_area_vs_perimeter",
    "expectedErrorTags": [
      "concept_confusion"
    ],
    "suggestedQuestionType": "geometry_concept_minimal_contrast",
    "question": "There is a square with side 5 cm. If we ask 'how much paper is needed to cover the whole face,' which concept are we looking for?",
    "correct": "Area",
    "options": [
      "Area",
      "Perimeter",
      "Volume",
      "Diagonal length only"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "measurement_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "area",
      "perimeter"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_measure_interpret",
    "patternFamily": "perimeter_vs_area",
    "subtype": "choose_measure_floor",
    "conceptTag": "pv_area_late",
    "distractorFamily": "measure_confusion",
    "diagnosticSkillId": "geo_pv_area_vs_perimeter",
    "expectedErrorTags": [
      "concept_confusion"
    ],
    "suggestedQuestionType": "geometry_concept_minimal_contrast",
    "question": "Square tiling for a room: tile side 5 m. To know how many square meters to buy — which concept do we compute?",
    "correct": "Area",
    "options": [
      "Area",
      "Perimeter",
      "Volume",
      "Diagonal length only"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "measurement_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "area",
      "perimeter"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_measure_interpret",
    "patternFamily": "perimeter_vs_area",
    "subtype": "fence",
    "conceptTag": "pv_perimeter",
    "distractorFamily": "measure_confusion",
    "diagnosticSkillId": "geo_pv_area_vs_perimeter",
    "expectedErrorTags": [
      "concept_confusion"
    ],
    "suggestedQuestionType": "geometry_concept_minimal_contrast",
    "question": "You want a fence around a rectangular field (only the outer boundary). What do you usually compute to know how much fencing to buy?",
    "correct": "Perimeter",
    "options": [
      "Perimeter",
      "Area",
      "Volume",
      "Interior angle"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "measurement_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "area",
      "perimeter"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_measure_interpret",
    "patternFamily": "perimeter_vs_area",
    "subtype": "fence_perimeter_project",
    "conceptTag": "pv_perimeter_late",
    "distractorFamily": "measure_confusion",
    "diagnosticSkillId": "geo_pv_area_vs_perimeter",
    "expectedErrorTags": [
      "concept_confusion"
    ],
    "suggestedQuestionType": "geometry_concept_minimal_contrast",
    "question": "Planning project: a fence around a rectangular field (outer edge only). To order fence length — what do you measure?",
    "correct": "Perimeter",
    "options": [
      "Perimeter",
      "Area",
      "Volume",
      "Interior angle"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "measurement_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "area"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_multi_step_plan",
    "patternFamily": "plan_then_compute",
    "subtype": "area_rectangle",
    "conceptTag": "plan_area_rect",
    "distractorFamily": "wrong_formula_family",
    "diagnosticSkillId": "geo_rect_area_plan",
    "expectedErrorTags": [
      "geometry_calculation_slip",
      "concept_confusion"
    ],
    "suggestedQuestionType": "geometry_formula_choice",
    "question": "A rectangle is 8 m long and 3 m wide. What is the correct first step to find the floor area?",
    "correct": "Multiply length by width",
    "options": [
      "Multiply length by width",
      "Add all the sides (like perimeter)",
      "Multiply length by 4",
      "Divide length by 2 only"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "application",
    "expectedErrorTypes": [
      "geometry_calculation_slip",
      "concept_confusion",
      "formula_selection_error"
    ],
    "prerequisiteSkillIds": [
      "geo_pv_area_vs_perimeter"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "area"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_multi_step_plan",
    "patternFamily": "plan_then_compute",
    "subtype": "area_rectangle_site",
    "conceptTag": "plan_area_rect_late",
    "distractorFamily": "wrong_formula_family",
    "diagnosticSkillId": "geo_rect_area_plan",
    "expectedErrorTags": [
      "geometry_calculation_slip",
      "concept_confusion"
    ],
    "suggestedQuestionType": "geometry_formula_choice",
    "question": "A rectangular rug for a large room: length 8 m and width 3 m. Before computing the space area — what is a good first step?",
    "correct": "Multiply length by width",
    "options": [
      "Multiply length by width",
      "Add all the sides (like perimeter)",
      "Multiply length by 4",
      "Divide length by 2 only"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "application",
    "expectedErrorTypes": [
      "geometry_calculation_slip",
      "concept_confusion",
      "formula_selection_error"
    ],
    "prerequisiteSkillIds": [
      "geo_pv_area_vs_perimeter"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "area",
      "perimeter"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_compare_shapes",
    "patternFamily": "shape_comparison",
    "subtype": "same_perimeter",
    "conceptTag": "compare_area",
    "distractorFamily": "comparison_trap",
    "diagnosticSkillId": "geo_rect_area_plan",
    "expectedErrorTags": [
      "compare_area",
      "same_perimeter_area_trap",
      "visual_reasoning_error"
    ],
    "question": "Two different rectangles with the same perimeter. What is true about their areas?",
    "correct": "The areas can be different",
    "options": [
      "The areas can be different",
      "The areas are always equal",
      "The taller rectangle always has larger area regardless of width",
      "The perimeter determines the area uniquely"
    ],
    "difficulty": "advanced",
    "cognitiveLevel": "analysis",
    "expectedErrorTypes": [
      "visual_reasoning_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "angles"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_angle_reason",
    "patternFamily": "triangle_angle_sum",
    "subtype": "inference",
    "conceptTag": "tri_sum_180",
    "distractorFamily": "angle_misconception",
    "question": "In a triangle, two angles are known: 50° and 60°. What can you conclude about the third angle before computing the number yet?",
    "correct": "The sum of the three angles in a triangle is 180°",
    "options": [
      "The sum of the three angles in a triangle is 180°",
      "The third angle is always 90°",
      "The sum of angles in a triangle is 360°",
      "There is not enough information without side lengths"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "angles"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_angle_reason",
    "patternFamily": "triangle_angle_sum",
    "subtype": "inference_reasoning",
    "conceptTag": "tri_sum_180_late",
    "distractorFamily": "angle_misconception",
    "diagnosticSkillId": "geo_angle_measure",
    "expectedErrorTags": [
      "tri_sum_180_late",
      "triangle_angle_sum_error",
      "angle_measure_error"
    ],
    "question": "In a triangle, two interior angles are known (for example 50° and 60°). Before computing the exact number — which geometry principle lets you reason about the third?",
    "correct": "The sum of the three angles in a triangle is 180°",
    "options": [
      "The sum of the three angles in a triangle is 180°",
      "The third angle is always 90°",
      "The sum of angles in a triangle is 360°",
      "There is not enough information without side lengths"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion"
    ],
    "prerequisiteSkillIds": [
      "tri_sum_180"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "angles"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_angle_reason",
    "patternFamily": "right_angle",
    "subtype": "classification",
    "conceptTag": "right_90",
    "distractorFamily": "angle_type",
    "diagnosticSkillId": "geo_angle_right_identify",
    "expectedErrorTags": [
      "concept_confusion"
    ],
    "suggestedQuestionType": "geometry_identify_shape_property",
    "question": "A right angle is about:",
    "correct": "90°",
    "options": [
      "90°",
      "180°",
      "45°",
      "360°"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "angles"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_angle_reason",
    "patternFamily": "right_angle",
    "subtype": "classification_late",
    "conceptTag": "right_90_late",
    "distractorFamily": "angle_type",
    "diagnosticSkillId": "geo_angle_right_identify",
    "expectedErrorTags": [
      "concept_confusion"
    ],
    "suggestedQuestionType": "geometry_identify_shape_property",
    "question": "In an accurate measurement, a practical right angle is close to:",
    "correct": "90°",
    "options": [
      "90°",
      "180°",
      "45°",
      "360°"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "angles"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_angle_reason",
    "patternFamily": "parallel_lines",
    "subtype": "concept_only",
    "conceptTag": "corresponding",
    "distractorFamily": "parallel_confusion",
    "diagnosticSkillId": "geo_angle_measure",
    "expectedErrorTags": [
      "corresponding",
      "parallel_corresponding_angle_error",
      "angle_equality_error"
    ],
    "question": "Two parallel lines are cut by a transversal. A pair of corresponding angles (same relative position) — how are they related?",
    "correct": "Equal in measure",
    "options": [
      "Equal in measure",
      "They always add to 180° with each other",
      "Their sum is always 90°",
      "There is no fixed relationship"
    ],
    "difficulty": "advanced",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "triangles"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_classify",
    "patternFamily": "triangle_by_sides",
    "subtype": "equal_sides",
    "conceptTag": "equilateral",
    "distractorFamily": "class_mislabel",
    "question": "A triangle with all three sides equal — what is it called?",
    "correct": "Equilateral triangle",
    "options": [
      "Equilateral triangle",
      "Isosceles triangle",
      "Always a right triangle",
      "Square"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "triangles"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_classify",
    "patternFamily": "triangle_by_sides",
    "subtype": "equal_sides_review",
    "conceptTag": "equilateral_late",
    "distractorFamily": "class_mislabel",
    "question": "Classifying by sides: a triangle with three equal sides — the matching name is:",
    "correct": "Equilateral triangle",
    "options": [
      "Equilateral triangle",
      "Isosceles triangle",
      "Always a right triangle",
      "Square"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "quadrilaterals"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_classify",
    "patternFamily": "quadrilateral_props",
    "subtype": "parallelogram",
    "conceptTag": "para_parallel",
    "distractorFamily": "shape_family",
    "diagnosticSkillId": "geo_quad_properties",
    "expectedErrorTags": [
      "para_parallel",
      "opposite_sides_parallel_error",
      "shape_property_misread"
    ],
    "question": "In a parallelogram, each pair of opposite sides:",
    "correct": "Parallel and equal in length",
    "options": [
      "Parallel and equal in length",
      "Always perpendicular",
      "Always the same length as the diagonals",
      "Form a right angle at every join"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "quadrilaterals"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_classify",
    "patternFamily": "quadrilateral_props",
    "subtype": "parallelogram_late",
    "conceptTag": "para_parallel_late",
    "distractorFamily": "shape_family",
    "diagnosticSkillId": "geo_quad_properties",
    "expectedErrorTags": [
      "para_parallel_late",
      "opposite_sides_parallel_error",
      "shape_property_misread"
    ],
    "question": "In a parallelogram — about pairs of opposite sides it is correct to say they are:",
    "correct": "Parallel and equal in length",
    "options": [
      "Parallel and equal in length",
      "Always perpendicular",
      "Always the same length as the diagonals",
      "Form a right angle at every join"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "quadrilaterals"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_classify",
    "patternFamily": "hierarchy",
    "subtype": "square_rectangle",
    "conceptTag": "square_special",
    "distractorFamily": "hierarchy_confusion",
    "diagnosticSkillId": "geo_quad_classification",
    "expectedErrorTags": [
      "square_special",
      "hierarchy_inclusion_error",
      "shape_family_mislabel"
    ],
    "question": "Every square is also a:",
    "correct": "Rectangle",
    "options": [
      "Rectangle",
      "Only a trapezoid",
      "Circle",
      "Triangle"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "quadrilaterals"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_classify",
    "patternFamily": "hierarchy",
    "subtype": "square_rectangle_late",
    "conceptTag": "square_special_late",
    "distractorFamily": "hierarchy_confusion",
    "diagnosticSkillId": "geo_quad_classification",
    "expectedErrorTags": [
      "square_special_late",
      "hierarchy_inclusion_error",
      "shape_family_mislabel"
    ],
    "question": "In terms of inclusion: every square has the properties of a:",
    "correct": "Rectangle",
    "options": [
      "Rectangle",
      "Only a trapezoid",
      "Circle",
      "Triangle"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "symmetry"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_symmetry",
    "patternFamily": "reflection",
    "subtype": "meaning",
    "conceptTag": "mirror",
    "distractorFamily": "transform_confusion",
    "diagnosticSkillId": "geo_symmetry_reflection",
    "expectedErrorTags": [
      "mirror",
      "reflection_vs_rotation_confusion",
      "transform_confusion"
    ],
    "question": "Reflection across a line of symmetry is most like:",
    "correct": "A mirror image",
    "options": [
      "A mirror image",
      "Rotation about a center",
      "Translation without rotation",
      "Enlarging the shape"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "symmetry"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_symmetry",
    "patternFamily": "reflection",
    "subtype": "meaning_axis",
    "conceptTag": "mirror_late",
    "distractorFamily": "transform_confusion",
    "diagnosticSkillId": "geo_symmetry_reflection",
    "expectedErrorTags": [
      "mirror_late",
      "reflection_vs_rotation_confusion",
      "transform_confusion"
    ],
    "question": "Reflection across a line of symmetry — the closest image is:",
    "correct": "A mirror image",
    "options": [
      "A mirror image",
      "Rotation about a center",
      "Translation without rotation",
      "Enlarging the shape"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "symmetry",
      "transformations"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_congruence",
    "patternFamily": "congruence",
    "subtype": "same_size_shape",
    "conceptTag": "congruent_def",
    "distractorFamily": "congruence_vs_similar",
    "diagnosticSkillId": "geo_symmetry_reflection",
    "expectedErrorTags": [
      "congruent_def",
      "congruence_vs_similarity_error",
      "transform_confusion"
    ],
    "question": "Two congruent shapes mean that:",
    "correct": "Same shape and same size (you can place one on the other)",
    "options": [
      "Same shape and same size (you can place one on the other)",
      "Only the same area but a different shape",
      "Only the same perimeter",
      "Only equal angles with no regard to sides"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "definition",
    "conceptTag": "perp_meeting",
    "distractorFamily": "line_relation",
    "question": "Two lines perpendicular to each other — what is true?",
    "correct": "They meet at a 90° angle",
    "options": [
      "They meet at a 90° angle",
      "They never meet",
      "They are always the same length",
      "They are always parallel"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "definition_late",
    "conceptTag": "perp_meeting_late",
    "distractorFamily": "line_relation",
    "question": "Two lines perpendicular to each other — what is a correct property at the intersection?",
    "correct": "They meet at a 90° angle",
    "options": [
      "They meet at a 90° angle",
      "They never meet",
      "They are always the same length",
      "They are always parallel"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "parallel_def",
    "conceptTag": "parallel_never_meet",
    "distractorFamily": "line_relation",
    "question": "Two parallel lines in the same plane — what is a correct property?",
    "correct": "They have no intersection point and stay the same distance apart",
    "options": [
      "They have no intersection point and stay the same distance apart",
      "They must meet at one point",
      "They are always perpendicular",
      "They are always equal in length"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "parallel_def_late",
    "conceptTag": "parallel_never_meet_late",
    "distractorFamily": "line_relation",
    "question": "Two parallel lines in the same plane — about intersection between them it is true that:",
    "correct": "They have no intersection point and stay the same distance apart",
    "options": [
      "They have no intersection point and stay the same distance apart",
      "They must meet at one point",
      "They are always perpendicular",
      "They are always equal in length"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "parallel_symbol",
    "conceptTag": "parallel_symbol",
    "distractorFamily": "line_relation",
    "question": "The symbol ∥ usually marks:",
    "correct": "Parallel lines",
    "options": [
      "Parallel lines",
      "Perpendicular lines",
      "Lines equal in length",
      "Lines that cut a 45° angle"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "compare_relation_mid",
    "conceptTag": "parallel_vs_perp_mid",
    "distractorFamily": "line_relation",
    "question": "What is true about parallel lines in the same plane?",
    "correct": "They do not meet and keep a constant distance",
    "options": [
      "They do not meet and keep a constant distance",
      "They always meet at a 90° angle",
      "They must be the same length",
      "They are always perpendicular"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "perp_symbol_mid",
    "conceptTag": "perp_symbol_mid",
    "distractorFamily": "line_relation",
    "question": "The symbol ⊥ usually marks:",
    "correct": "Perpendicular lines",
    "options": [
      "Perpendicular lines",
      "Parallel lines",
      "Lines equal in length",
      "Lines that cannot be compared"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "perp_angle_mid",
    "conceptTag": "perp_angle_mid",
    "distractorFamily": "line_relation",
    "question": "When two lines are perpendicular, their intersection angle is:",
    "correct": "90°",
    "options": [
      "90°",
      "180°",
      "45°",
      "360°"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "volume"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_volume_meaning",
    "patternFamily": "volume_space",
    "subtype": "definition",
    "conceptTag": "volume_3d",
    "distractorFamily": "dimension_confusion",
    "diagnosticSkillId": "geo_volume_unit_reasoning",
    "expectedErrorTags": [
      "volume_3d",
      "dimension_confusion",
      "measurement_error"
    ],
    "question": "The volume of a box mainly expresses:",
    "correct": "How much space is occupied inside the box in three dimensions",
    "options": [
      "How much space is occupied inside the box in three dimensions",
      "Only the length of the longest edge",
      "Only the area of one face",
      "Only the perimeter of the base"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "volume"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_volume_meaning",
    "patternFamily": "volume_space",
    "subtype": "definition_capacity",
    "conceptTag": "volume_3d_late",
    "distractorFamily": "dimension_confusion",
    "diagnosticSkillId": "geo_volume_unit_reasoning",
    "expectedErrorTags": [
      "volume_3d_late",
      "dimension_confusion",
      "measurement_error"
    ],
    "question": "When we talk about the volume of a closed box — what is the main geometric meaning?",
    "correct": "How much space is occupied inside the box in three dimensions",
    "options": [
      "How much space is occupied inside the box in three dimensions",
      "Only the length of the longest edge",
      "Only the area of one face",
      "Only the perimeter of the base"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "volume"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_multi_step_plan",
    "patternFamily": "volume_prism_plan",
    "subtype": "order_ops",
    "conceptTag": "vol_box",
    "distractorFamily": "formula_order",
    "diagnosticSkillId": "geo_volume_prism_formula",
    "expectedErrorTags": [
      "vol_box",
      "formula_selection_error",
      "volume_unit_error"
    ],
    "question": "Rectangular box: first you want the volume. What is a reasonable calculation order?",
    "correct": "length × width × height",
    "options": [
      "length × width × height",
      "length + width + height",
      "(length + width) × 2",
      "length × height only without width"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "application",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "minGrade": 6,
    "maxGrade": 6,
    "topics": [
      "circles"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_circle",
    "patternFamily": "radius_diameter",
    "subtype": "relation",
    "conceptTag": "d_2r",
    "distractorFamily": "circle_terms",
    "question": "In a circle, the relationship between diameter and radius is:",
    "correct": "The diameter is twice the radius",
    "options": [
      "The diameter is twice the radius",
      "The radius is twice the diameter",
      "They are always equal",
      "There is no fixed relationship"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "minGrade": 6,
    "maxGrade": 6,
    "topics": [
      "circles",
      "area",
      "perimeter"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_circle",
    "patternFamily": "circumference_vs_area",
    "subtype": "interpret",
    "conceptTag": "wheel_rotation",
    "distractorFamily": "circle_measure_confusion",
    "diagnosticSkillId": "geo_perimeter_formula",
    "expectedErrorTags": [
      "wheel_rotation",
      "circumference_vs_area_confusion",
      "measurement_error"
    ],
    "question": "How many meters a bicycle wheel travels in one full circular path is mainly related to:",
    "correct": "The circumference of the circle",
    "options": [
      "The circumference of the circle",
      "The area of the circle",
      "The volume of the tire",
      "Radius alone without multiplication"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "measurement_error",
      "concept_confusion"
    ]
  },
  {
    "minGrade": 6,
    "maxGrade": 6,
    "topics": [
      "pythagoras"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_pythagoras",
    "patternFamily": "right_triangle_identify",
    "subtype": "hypotenuse_side",
    "conceptTag": "hyp_opposite_right",
    "distractorFamily": "pythagoras_misconception",
    "question": "In a right triangle, the hypotenuse is:",
    "correct": "The side opposite the right angle",
    "options": [
      "The side opposite the right angle",
      "Always the shortest side",
      "Any side that was not chosen",
      "Always a side next to the right angle"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "minGrade": 6,
    "maxGrade": 6,
    "topics": [
      "pythagoras"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_multi_step_plan",
    "patternFamily": "pythagoras_plan",
    "subtype": "first_step",
    "conceptTag": "when_pyth",
    "distractorFamily": "strategy_error",
    "question": "In a right triangle, two legs are known and you want the hypotenuse. What is the right tool?",
    "correct": "The Pythagorean theorem (sum of squares of the legs = square of the hypotenuse)",
    "options": [
      "The Pythagorean theorem (sum of squares of the legs = square of the hypotenuse)",
      "A straight sum of the three sides",
      "Triangle area (half base times height) only",
      "The perimeter of the triangle only"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "application",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "solids"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_solids",
    "patternFamily": "solid_faces_band_early",
    "subtype": "cube",
    "conceptTag": "cube_faces",
    "distractorFamily": "solid_confusion",
    "question": "A cube usually has how many square faces?",
    "correct": "6",
    "options": [
      "6",
      "4",
      "8",
      "12"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "solids"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_solids",
    "patternFamily": "solid_faces_band_late",
    "subtype": "cube_faces_late",
    "conceptTag": "cube_faces_late",
    "distractorFamily": "solid_confusion",
    "question": "In a 3D solid of type cube — how many square faces are there usually?",
    "correct": "6",
    "options": [
      "6",
      "4",
      "8",
      "12"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "solids"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_solids",
    "patternFamily": "prism_vs_pyramid_band_early",
    "subtype": "compare",
    "conceptTag": "apex",
    "distractorFamily": "solid_confusion",
    "question": "What is true about a pyramid versus a prism with the same base?",
    "correct": "A pyramid has one apex; a prism has two similar parallel bases",
    "options": [
      "A pyramid has one apex; a prism has two similar parallel bases",
      "Both must be round",
      "There is no difference between a pyramid and a prism",
      "A prism always has no faces"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "solids"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_solids",
    "patternFamily": "prism_vs_pyramid_band_late",
    "subtype": "compare_late",
    "conceptTag": "apex_late",
    "distractorFamily": "solid_confusion",
    "question": "Geometric comparison: pyramid versus prism with the same base shape — what is true?",
    "correct": "A pyramid has one apex; a prism has two similar parallel bases",
    "options": [
      "A pyramid has one apex; a prism has two similar parallel bases",
      "Both must be round",
      "There is no difference between a pyramid and a prism",
      "A prism always has no faces"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "tiling"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_tiling",
    "patternFamily": "regular_tiling",
    "subtype": "angles_around_point",
    "conceptTag": "360_at_vertex",
    "distractorFamily": "tiling_angle",
    "question": "In a tiling around every meeting point of regular shapes, the sum of angles around the point is:",
    "correct": "360°",
    "options": [
      "360°",
      "180°",
      "90°",
      "Depends only on the tiling color"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "tiling"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_tiling",
    "patternFamily": "regular_tiling",
    "subtype": "square_tile_angle",
    "conceptTag": "square_tile_90",
    "distractorFamily": "tiling_angle",
    "question": "In a regular tiling of squares, a typical interior angle in each square is:",
    "correct": "90°",
    "options": [
      "90°",
      "60°",
      "120°",
      "180°"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "tiling"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_tiling",
    "patternFamily": "regular_tiling",
    "subtype": "triangle_tile_angle",
    "conceptTag": "triangle_tile_60",
    "distractorFamily": "tiling_angle",
    "question": "In a regular tiling of equilateral triangles, a typical interior angle in each triangle is:",
    "correct": "60°",
    "options": [
      "60°",
      "90°",
      "120°",
      "360°"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "heights"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_height",
    "patternFamily": "height_definition",
    "subtype": "triangle",
    "conceptTag": "perpendicular_to_base",
    "distractorFamily": "height_confusion",
    "question": "An altitude in a triangle (relative to a given base) is:",
    "correct": "A perpendicular segment from the opposite vertex to the base or its extension",
    "options": [
      "A perpendicular segment from the opposite vertex to the base or its extension",
      "Always one of the triangle's sides",
      "The diagonal of the triangle",
      "The average of the three sides"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "diagonal"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_diagonal",
    "patternFamily": "rectangle_diagonal",
    "subtype": "property",
    "conceptTag": "diag_equal_rect",
    "distractorFamily": "diagonal_confusion",
    "question": "In a rectangle, the two diagonals:",
    "correct": "Equal in length and bisect each other",
    "options": [
      "Equal in length and bisect each other",
      "Always perpendicular at 90° to each other at the center only in a general rectangle",
      "Always different in length",
      "Always equal to a side"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "compare_relation",
    "conceptTag": "parallel_vs_perp",
    "distractorFamily": "line_relation",
    "question": "What is the main difference between parallel lines and perpendicular lines?",
    "correct": "Parallel lines do not meet; perpendicular lines meet at 90°",
    "options": [
      "Parallel lines do not meet; perpendicular lines meet at 90°",
      "Parallel lines are always shorter",
      "Perpendicular lines never meet",
      "There is no difference — they are the same"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "easy"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "symbol_recognition",
    "conceptTag": "perp_symbol",
    "distractorFamily": "line_relation",
    "question": "The symbol ⊥ usually marks:",
    "correct": "Perpendicular lines",
    "options": [
      "Perpendicular lines",
      "Parallel lines",
      "Lines equal in length",
      "Lines that cannot be compared"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "perp_def_late",
    "conceptTag": "perp_def_late",
    "distractorFamily": "line_relation",
    "question": "When two lines are perpendicular, their intersection angle is:",
    "correct": "90°",
    "options": [
      "90°",
      "180°",
      "45°",
      "360°"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "parallel_perpendicular"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_lines",
    "patternFamily": "parallel_perpendicular",
    "subtype": "parallel_symbol_late",
    "conceptTag": "parallel_symbol_late",
    "distractorFamily": "line_relation",
    "question": "The symbol ∥ usually marks:",
    "correct": "Parallel lines",
    "options": [
      "Parallel lines",
      "Perpendicular lines",
      "Lines equal in length",
      "Lines that cut a 45° angle"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "diagonal"
    ],
    "levels": [
      "medium",
      "hard"
    ],
    "kind": "concept_diagonal",
    "patternFamily": "rectangle_diagonal",
    "subtype": "property_late",
    "conceptTag": "diag_equal_rect_late",
    "distractorFamily": "diagonal_confusion",
    "question": "In a rectangle — about the two diagonals it is true that:",
    "correct": "Equal in length and bisect each other",
    "options": [
      "Equal in length and bisect each other",
      "Always perpendicular at 90° to each other at the center only in a general rectangle",
      "Always different in length",
      "Always equal to a side"
    ],
    "difficulty": "standard",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "rotation"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_rotation",
    "patternFamily": "quarter_turn",
    "subtype": "degrees",
    "conceptTag": "quarter_90",
    "distractorFamily": "rotation_confusion",
    "question": "A rotation of one-quarter of a full turn about a center is usually called:",
    "correct": "90°",
    "options": [
      "90°",
      "180°",
      "45°",
      "360°"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "shapes_basic"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_shape_id",
    "patternFamily": "polygon_sides",
    "subtype": "square_count",
    "conceptTag": "square_4_equal",
    "distractorFamily": "count_confusion",
    "diagnosticSkillId": "geo_shape_classification",
    "expectedErrorTags": [
      "square_4_equal",
      "polygon_side_count_error",
      "careless_error"
    ],
    "question": "How many sides does a square have?",
    "correct": "4",
    "options": [
      "4",
      "3",
      "5",
      "6"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "shapes_basic"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_shape_id",
    "patternFamily": "polygon_sides",
    "subtype": "square_count_mid",
    "conceptTag": "square_4_equal_mid",
    "distractorFamily": "count_confusion",
    "diagnosticSkillId": "geo_shape_classification",
    "expectedErrorTags": [
      "square_4_equal_mid",
      "polygon_side_count_error",
      "careless_error"
    ],
    "question": "In a quadrilateral with all sides equal (a square) — how many sides are there?",
    "correct": "4",
    "options": [
      "4",
      "3",
      "5",
      "6"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "shapes_basic"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_tf",
    "patternFamily": "binary_property_band_early_rect90",
    "subtype": "rectangle_angles",
    "conceptTag": "rect_all_90",
    "distractorFamily": "polar",
    "diagnosticSkillId": "geo_shape_properties",
    "expectedErrorTags": [
      "rect_all_90",
      "right_angle_property_error",
      "shape_property_misread"
    ],
    "binary": false,
    "question": "In a rectangle, all four interior angles are right angles (90°). True or false?",
    "correct": "True",
    "options": [
      "True",
      "False",
      "Only three right angles",
      "Depends on the size of the rectangle"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "shapes_basic"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_tf",
    "patternFamily": "binary_property_band_mid_rect90",
    "subtype": "rectangle_angles_mid",
    "conceptTag": "rect_all_90_mid",
    "distractorFamily": "polar",
    "diagnosticSkillId": "geo_shape_properties",
    "expectedErrorTags": [
      "rect_all_90_mid",
      "right_angle_property_error",
      "shape_property_misread"
    ],
    "binary": false,
    "question": "In a rectangle, all four interior angles are right angles (90°). True or false?",
    "correct": "True",
    "options": [
      "True",
      "False",
      "Only at one angle",
      "Not in every rectangle"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "mid",
    "topics": [
      "quadrilaterals",
      "triangles"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_tf",
    "patternFamily": "binary_property_band_mid_rhombus_rect",
    "subtype": "rhombus_rectangle",
    "conceptTag": "not_always_both",
    "distractorFamily": "polar",
    "diagnosticSkillId": "geo_quad_classification",
    "expectedErrorTags": [
      "not_always_both",
      "rhombus_rectangle_overgeneralization",
      "shape_family_mislabel"
    ],
    "binary": false,
    "question": "Every rhombus is always also a rectangle. True or false?",
    "correct": "False",
    "options": [
      "False",
      "True",
      "True only when all sides are equal",
      "True for every rhombus"
    ],
    "difficulty": "advanced",
    "cognitiveLevel": "analysis",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "quadrilaterals",
      "triangles"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_tf",
    "patternFamily": "binary_property_band_late_rhombus_rect",
    "subtype": "rhombus_rectangle_late",
    "conceptTag": "not_always_both_late",
    "distractorFamily": "polar",
    "diagnosticSkillId": "geo_quad_classification",
    "expectedErrorTags": [
      "not_always_both_late",
      "rhombus_rectangle_overgeneralization",
      "shape_family_mislabel"
    ],
    "binary": false,
    "question": "Claim: every rhombus is necessarily also a rectangle. True or false?",
    "correct": "False",
    "options": [
      "False",
      "True",
      "True only for a rectangle",
      "Always true"
    ],
    "difficulty": "advanced",
    "cognitiveLevel": "analysis",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "angles",
      "triangles"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_tf",
    "patternFamily": "binary_property_band_late_obtuse_triangle",
    "subtype": "obtuse_count",
    "conceptTag": "one_obtuse_max",
    "distractorFamily": "polar",
    "diagnosticSkillId": "geo_triangle_properties",
    "expectedErrorTags": [
      "one_obtuse_max",
      "obtuse_angle_misconception",
      "triangle_angle_type_error"
    ],
    "binary": false,
    "question": "A triangle can have two obtuse angles (greater than 90°). True or false?",
    "correct": "False",
    "options": [
      "False",
      "True",
      "Always two obtuse angles",
      "Three obtuse angles are possible"
    ],
    "difficulty": "advanced",
    "cognitiveLevel": "analysis",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "transformations"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_transform",
    "patternFamily": "slide_vs_flip",
    "subtype": "translation",
    "conceptTag": "slide",
    "distractorFamily": "transform_confusion",
    "question": "The shape moved to a new place with no rotation and no size change — which move is this?",
    "correct": "Translation",
    "options": [
      "Translation",
      "Reflection",
      "Rotation",
      "No movement"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "transformations"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_transform",
    "patternFamily": "slide_vs_flip",
    "subtype": "reflection",
    "conceptTag": "mirror_flip",
    "distractorFamily": "transform_confusion",
    "question": "The shape flips like a mirror across a line — which move is this?",
    "correct": "Reflection",
    "options": [
      "Reflection",
      "Translation",
      "Rotation",
      "No movement"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "transformations"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_transform",
    "patternFamily": "rotation_intro",
    "subtype": "rotation",
    "conceptTag": "turn",
    "distractorFamily": "transform_confusion",
    "question": "The shape rotates about a point without changing size — which move is this?",
    "correct": "Rotation",
    "options": [
      "Rotation",
      "Translation",
      "Reflection",
      "No movement"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "transformations"
    ],
    "levels": [
      "easy",
      "medium",
      "hard"
    ],
    "kind": "concept_transform",
    "patternFamily": "identity_motion",
    "subtype": "identity",
    "conceptTag": "no_motion",
    "distractorFamily": "transform_confusion",
    "question": "The shape stayed in the same place and orientation — which transformation fits?",
    "correct": "No movement",
    "options": [
      "No movement",
      "Translation",
      "Reflection",
      "Rotation"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "transformations"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_transform",
    "patternFamily": "transform_discriminate",
    "subtype": "reflection_hard",
    "conceptTag": "mirror_axis",
    "distractorFamily": "transform_confusion",
    "question": "Challenge: only the orientation changes like a mirror across an axis, size preserved — which transformation?",
    "correct": "Reflection",
    "options": [
      "Reflection",
      "Translation",
      "Rotation",
      "No movement"
    ],
    "difficulty": "advanced",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "transformations"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_transform",
    "patternFamily": "transform_discriminate",
    "subtype": "translation_hard",
    "conceptTag": "slide_only",
    "distractorFamily": "transform_confusion",
    "question": "Challenge: only the position changes, with no rotation and no size change — which move?",
    "correct": "Translation",
    "options": [
      "Translation",
      "Reflection",
      "Rotation",
      "No movement"
    ],
    "difficulty": "advanced",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "transformations"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_transform",
    "patternFamily": "transform_discriminate",
    "subtype": "rotation_hard",
    "conceptTag": "turn_center",
    "distractorFamily": "transform_confusion",
    "question": "Challenge: the shape rotates about a fixed center with no size change — which transformation?",
    "correct": "Rotation",
    "options": [
      "Rotation",
      "Translation",
      "Reflection",
      "No movement"
    ],
    "difficulty": "advanced",
    "cognitiveLevel": "understanding",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  },
  {
    "gradeBand": "early",
    "topics": [
      "area"
    ],
    "levels": [
      "easy",
      "medium"
    ],
    "kind": "concept_area_intro",
    "patternFamily": "area_as_covering",
    "subtype": "square_units",
    "conceptTag": "unit_squares",
    "distractorFamily": "measure_confusion",
    "question": "When counting 'unit squares' inside a shape, what are you roughly measuring?",
    "correct": "Area",
    "options": [
      "Area",
      "Perimeter",
      "Angle",
      "Length only"
    ],
    "difficulty": "basic",
    "cognitiveLevel": "recall",
    "expectedErrorTypes": [
      "measurement_error",
      "concept_confusion"
    ]
  },
  {
    "gradeBand": "late",
    "topics": [
      "area",
      "perimeter"
    ],
    "levels": [
      "hard"
    ],
    "kind": "concept_partial_info",
    "patternFamily": "infer_missing",
    "subtype": "square_from_perimeter",
    "conceptTag": "perim_to_side",
    "distractorFamily": "algebra_misstep",
    "diagnosticSkillId": "geo_perimeter_formula",
    "expectedErrorTags": [
      "perim_to_side",
      "side_from_perimeter_error",
      "formula_selection_error"
    ],
    "question": "A square has perimeter 20 cm. What is true about the side length?",
    "correct": "The side length is 5 cm because 20 ÷ 4 = 5",
    "options": [
      "The side length is 5 cm because 20 ÷ 4 = 5",
      "The side length is 20 cm",
      "You cannot tell without the area",
      "The side length is 10 cm"
    ],
    "difficulty": "advanced",
    "cognitiveLevel": "analysis",
    "expectedErrorTypes": [
      "concept_confusion",
      "careless_error"
    ]
  }
];
