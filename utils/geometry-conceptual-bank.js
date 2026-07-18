import { burnDownCopy } from "../lib/learning/burn-down-copy.js";
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
      burnDownCopy("utils__geometry-conceptual-bank", "perimeter"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "square_tiling_for_a_room_tile_side_5_m_to_know_how_many_square_meters_to"),
    "correct": "Area",
    "options": [
      "Area",
      burnDownCopy("utils__geometry-conceptual-bank", "perimeter"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "you_want_a_fence_around_a_rectangular_field_only_the_outer_boundary_what"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "perimeter"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "perimeter"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "planning_project_a_fence_around_a_rectangular_field_outer_edge_only_to_o"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "perimeter"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "perimeter"),
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
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "multiply_length_by_width"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "multiply_length_by_width"),
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
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "multiply_length_by_width"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "multiply_length_by_width"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "two_different_rectangles_with_the_same_perimeter_what_is_true_about_thei"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "the_areas_can_be_different"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "the_areas_can_be_different"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_triangle_two_angles_are_known_50_and_60_what_can_you_conclude_about"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "the_sum_of_the_three_angles_in_a_triangle_is_180"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "the_sum_of_the_three_angles_in_a_triangle_is_180"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "triangle_two_interior_angles_known_before_computing_third"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "the_sum_of_the_three_angles_in_a_triangle_is_180"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "the_sum_of_the_three_angles_in_a_triangle_is_180"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_an_accurate_measurement_a_practical_right_angle_is_close_to"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "two_parallel_lines_are_cut_by_a_transversal_a_pair_of_corresponding_angl"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "equal_in_measure"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "equal_in_measure"),
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
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "equilateral_triangle"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "equilateral_triangle"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "classifying_by_sides_a_triangle_with_three_equal_sides_the_matching_name"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "equilateral_triangle"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "equilateral_triangle"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_parallelogram_each_pair_of_opposite_sides"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "parallel_and_equal_in_length"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "parallel_and_equal_in_length"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_parallelogram_about_pairs_of_opposite_sides_it_is_correct_to_say_th"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "parallel_and_equal_in_length"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "parallel_and_equal_in_length"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "every_square_is_also_a"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "rectangle"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "rectangle"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_terms_of_inclusion_every_square_has_the_properties_of_a"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "rectangle"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "rectangle"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "reflection_across_a_line_of_symmetry_is_most_like"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "reflection_across_a_line_of_symmetry_the_closest_image_is"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "two_congruent_shapes_mean_that"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "same_shape_and_same_size_you_can_place_one_on_the_other"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "same_shape_and_same_size_you_can_place_one_on_the_other"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "two_lines_perpendicular_to_each_other_what_is_true"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "they_meet_at_a_90_angle"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "they_meet_at_a_90_angle"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "two_lines_perpendicular_to_each_other_what_is_a_correct_property_at_the_"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "they_meet_at_a_90_angle"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "they_meet_at_a_90_angle"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "two_parallel_lines_in_the_same_plane_what_is_a_correct_property"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "they_have_no_intersection_point_and_stay_the_same_distance_apart"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "they_have_no_intersection_point_and_stay_the_same_distance_apart"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "two_parallel_lines_in_the_same_plane_about_intersection_between_them_it_"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "they_have_no_intersection_point_and_stay_the_same_distance_apart"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "they_have_no_intersection_point_and_stay_the_same_distance_apart"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "the_symbol_usually_marks"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "parallel_lines"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "parallel_lines"),
      burnDownCopy("utils__geometry-conceptual-bank", "perpendicular_lines"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "what_is_true_about_parallel_lines_in_the_same_plane"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "they_do_not_meet_and_keep_a_constant_distance"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "they_do_not_meet_and_keep_a_constant_distance"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "the_symbol_usually_marks_2"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "perpendicular_lines"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "perpendicular_lines"),
      burnDownCopy("utils__geometry-conceptual-bank", "parallel_lines"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "when_two_lines_are_perpendicular_their_intersection_angle_is"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "the_volume_of_a_box_mainly_expresses"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "how_much_space_is_occupied_inside_the_box_in_three_dimensions"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "how_much_space_is_occupied_inside_the_box_in_three_dimensions"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "when_we_talk_about_the_volume_of_a_closed_box_what_is_the_main_geometric"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "how_much_space_is_occupied_inside_the_box_in_three_dimensions"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "how_much_space_is_occupied_inside_the_box_in_three_dimensions"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "rectangular_box_first_you_want_the_volume_what_is_a_reasonable_calculati"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_circle_the_relationship_between_diameter_and_radius_is"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "the_diameter_is_twice_the_radius"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "the_diameter_is_twice_the_radius"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "how_many_meters_a_bicycle_wheel_travels_in_one_full_circular_path_is_mai"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "the_circumference_of_the_circle"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "the_circumference_of_the_circle"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_right_triangle_the_hypotenuse_is"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "the_side_opposite_the_right_angle"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "the_side_opposite_the_right_angle"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_right_triangle_two_legs_are_known_and_you_want_the_hypotenuse_what_"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "the_pythagorean_theorem_sum_of_squares_of_the_legs_square_of_the_hypoten"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "the_pythagorean_theorem_sum_of_squares_of_the_legs_square_of_the_hypoten"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_3d_solid_of_type_cube_how_many_square_faces_are_there_usually"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "what_is_true_about_a_pyramid_versus_a_prism_with_the_same_base"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "geometric_comparison_pyramid_versus_prism_with_the_same_base_shape_what_"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_tiling_around_every_meeting_point_of_regular_shapes_the_sum_of_angl"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_regular_tiling_of_squares_a_typical_interior_angle_in_each_square_i"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_regular_tiling_of_equilateral_triangles_a_typical_interior_angle_in"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "an_altitude_in_a_triangle_relative_to_a_given_base_is"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_rectangle_the_two_diagonals"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "equal_in_length_and_bisect_each_other"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "equal_in_length_and_bisect_each_other"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "what_is_the_main_difference_between_parallel_lines_and_perpendicular_lin"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "parallel_lines_do_not_meet_perpendicular_lines_meet_at_90"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "parallel_lines_do_not_meet_perpendicular_lines_meet_at_90"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "the_symbol_usually_marks_2"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "perpendicular_lines"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "perpendicular_lines"),
      burnDownCopy("utils__geometry-conceptual-bank", "parallel_lines"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "when_two_lines_are_perpendicular_their_intersection_angle_is"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "the_symbol_usually_marks"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "parallel_lines"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "parallel_lines"),
      burnDownCopy("utils__geometry-conceptual-bank", "perpendicular_lines"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_rectangle_about_the_two_diagonals_it_is_true_that"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "equal_in_length_and_bisect_each_other"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "equal_in_length_and_bisect_each_other"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "how_many_sides_does_a_square_have"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_quadrilateral_with_all_sides_equal_a_square_how_many_sides_are_ther"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_rectangle_all_four_interior_angles_are_right_angles_90_true_or_fals"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "in_a_rectangle_all_four_interior_angles_are_right_angles_90_true_or_fals"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "every_rhombus_is_always_also_a_rectangle_true_or_false"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "claim_every_rhombus_is_necessarily_also_a_rectangle_true_or_false"),
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "the_shape_moved_to_a_new_place_with_no_rotation_and_no_size_change_which"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "translation"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "translation"),
      burnDownCopy("utils__geometry-conceptual-bank", "reflection"),
      burnDownCopy("utils__geometry-conceptual-bank", "rotation"),
      burnDownCopy("utils__geometry-conceptual-bank", "no_movement")
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "the_shape_flips_like_a_mirror_across_a_line_which_move_is_this"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "reflection"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "reflection"),
      burnDownCopy("utils__geometry-conceptual-bank", "translation"),
      burnDownCopy("utils__geometry-conceptual-bank", "rotation"),
      burnDownCopy("utils__geometry-conceptual-bank", "no_movement")
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "the_shape_rotates_about_a_point_without_changing_size_which_move_is_this"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "rotation"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "rotation"),
      burnDownCopy("utils__geometry-conceptual-bank", "translation"),
      burnDownCopy("utils__geometry-conceptual-bank", "reflection"),
      burnDownCopy("utils__geometry-conceptual-bank", "no_movement")
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "the_shape_stayed_in_the_same_place_and_orientation_which_transformation_"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "no_movement"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "no_movement"),
      burnDownCopy("utils__geometry-conceptual-bank", "translation"),
      burnDownCopy("utils__geometry-conceptual-bank", "reflection"),
      burnDownCopy("utils__geometry-conceptual-bank", "rotation")
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "challenge_only_the_orientation_changes_like_a_mirror_across_an_axis_size"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "reflection"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "reflection"),
      burnDownCopy("utils__geometry-conceptual-bank", "translation"),
      burnDownCopy("utils__geometry-conceptual-bank", "rotation"),
      burnDownCopy("utils__geometry-conceptual-bank", "no_movement")
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "challenge_only_the_position_changes_with_no_rotation_and_no_size_change_"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "translation"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "translation"),
      burnDownCopy("utils__geometry-conceptual-bank", "reflection"),
      burnDownCopy("utils__geometry-conceptual-bank", "rotation"),
      burnDownCopy("utils__geometry-conceptual-bank", "no_movement")
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
    "question": burnDownCopy("utils__geometry-conceptual-bank", "challenge_the_shape_rotates_about_a_fixed_center_with_no_size_change_whi"),
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "rotation"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "rotation"),
      burnDownCopy("utils__geometry-conceptual-bank", "translation"),
      burnDownCopy("utils__geometry-conceptual-bank", "reflection"),
      burnDownCopy("utils__geometry-conceptual-bank", "no_movement")
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
      burnDownCopy("utils__geometry-conceptual-bank", "perimeter"),
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
    "correct": burnDownCopy("utils__geometry-conceptual-bank", "the_side_length_is_5_cm_because_20_4_5"),
    "options": [
      burnDownCopy("utils__geometry-conceptual-bank", "the_side_length_is_5_cm_because_20_4_5"),
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
