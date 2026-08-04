import { enrichGeometryAnimationSteps } from "./geometry-animations.js";
import React from "react";
import { mix, M } from "../lib/learning-book/learning-math-line-build.js";
import { burnDownCopy } from "../lib/learning/burn-down-copy.js";

const GEO_EXPL_SLUG = "utils__geometry-explanations";
function geCopy(key) {
  return burnDownCopy(GEO_EXPL_SLUG, key);
}
function geMix(key, exprs) {
  let s = String(geCopy(key) || "");
  (exprs || []).forEach((expr, i) => {
    s = s.split("{m" + i + "}").join("\u2066" + expr + "\u2069");
  });
  return s;
}
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
        return geCopy("square_area_side_side_take_the_side_length_from_the_question_107be396");
      }
      if (sh === "rectangle") {
        return geCopy("rectangle_area_length_width_make_sure_you_multiply_two_diffe_7c12edba");
      }
      if (sh === "circle") {
        return geMix("circle_area_m_here_m_first_square_the_radius_then_multiply_b_a246cbe7", [["π × r²"], "π ≈ 3.14", "2πr"]);
      }
      if (sh === "triangle") {
        return geCopy("triangle_area_base_height_to_the_base_2_after_multiplying_di_1a0c5ecf");
      }
      if (sh === "parallelogram") {
        return geCopy("parallelogram_area_base_the_height_perpendicular_to_it_not_a_e433d8d4");
      }
      if (sh === "trapezoid") {
        return geCopy("trapezoid_area_base_1_base_2_height_2_first_add_the_two_para_3f1fc035");
      }
      break;

    case "perimeter":
      if (sh === "square") {
        return geCopy("square_perimeter_side_4_the_sum_of_the_four_equal_sides_if_y_83a75e3d");
      }
      if (sh === "rectangle") {
        return geCopy("rectangle_perimeter_length_width_2_the_sum_of_all_sides_do_n_d9acdc00");
      }
      if (sh === "circle") {
        return geMix("circle_circumference_m_this_is_a_full_turn_around_not_m_5eeb8490", ["2 × π × radius", "πr²"]);
      }
      if (sh === "triangle") {
        return geCopy("triangle_perimeter_the_sum_of_the_three_sides_no_division_by_aceb6ba8");
      }
      break;

    case "volume": {
      if (p.kind === "pyramid_volume_square" || p.kind === "pyramid_volume_rectangular") {
        return geCopy("pyramid_volume_1_3_base_area_height_first_the_base_area_then_2be9b93e");
      }
      if (p.kind === "cone_volume") {
        return geCopy("cone_volume_1_3_radius_height_like_a_pyramid_with_a_round_ba_4942db86");
      }
      if (p.kind === "prism_volume_triangle" || p.kind === "prism_volume_rectangular") {
        return geCopy("prism_volume_the_cross_section_area_base_the_prism_s_height__2f8ea8eb");
      }
      if (sh === "cube") {
        return geCopy("cube_volume_side_the_same_side_three_times_10353979");
      }
      if (sh === "rectangular_prism") {
        return geCopy("box_volume_length_width_height_the_three_dimensions_without__79d02b64");
      }
      if (sh === "cylinder") {
        return geCopy("cylinder_volume_radius_height_the_base_circle_s_area_times_t_7bbc42bf");
      }
      if (sh === "sphere") {
        return geCopy("sphere_volume_4_3_radius_the_radius_is_raised_to_the_third_p_aae3298b");
      }
      break;
    }

    case "angles":
      return geMix("in_every_triangle_the_sum_of_interior_angles_m_add_the_two_g_be4161eb", ["180°", "180°"]);

    case "pythagoras":
      return geMix("in_a_right_triangle_m_identify_the_hypotenuse_the_side_oppos_55259c3f", ["a² + b² = c²"]);

    case "shapes_basic":
      if (p.kind === "shapes_basic_square" || p.kind === "shapes_basic_rectangle") {
        return geCopy("compare_side_lengths_when_all_four_are_equal_square_when_the_40dcded9");
      }
      if (p.kind === "shapes_basic_properties_square") {
        return geCopy("the_question_asks_about_the_number_of_equal_sides_in_a_squar_a85c8c15");
      }
      if (p.kind === "shapes_basic_properties_rectangle") {
        return geCopy("the_question_asks_how_many_pairs_of_equal_sides_a_rectangle__e6163f0c");
      }
      if (p.kind === "shapes_basic_properties_angles") {
        return geCopy("a_square_and_a_rectangle_are_quadrilaterals_with_right_inter_a4d48497");
      }
      return geCopy("focus_on_the_side_and_angle_properties_of_the_square_versus__31878960");

    case "parallel_perpendicular":
      return geMix("parallel_never_meet_and_keep_a_constant_distance_perpendicul_06f845b2", ["90°"]);

    case "triangles":
      return geCopy("sort_by_equal_side_lengths_three_equal_two_equal_all_differe_08a7b940");

    case "quadrilaterals":
      return geCopy("match_the_name_to_the_rules_for_sides_and_angles_are_all_sid_9fa119de");

    case "transformations":
      return geCopy("a_translation_moves_the_shape_without_changing_its_reading_o_cf9fd8a2");

    case "rotation":
      return geMix("rotation_is_measured_in_degrees_around_a_point_think_whether_f25a3afe", ["360°"]);

    case "symmetry":
      return geCopy("an_axis_of_symmetry_splits_the_shape_into_two_mirror_halves__33412745");

    case "diagonal":
      if (p.kind === "diagonal_square") {
        return geMix("in_a_square_the_diagonal_forms_a_right_triangle_with_two_equ_b0dc72b3", [["√2 × s"]]);
      }
      if (p.kind === "diagonal_rectangle" || p.kind === "diagonal_parallelogram") {
        return geCopy("the_diagonal_is_the_hypotenuse_of_a_right_triangle_whose_leg_0c7334e2");
      }
      return geCopy("think_of_the_diagonal_as_the_hypotenuse_of_a_right_triangle__03f8248d");

    case "heights":
      if (p.shape === "triangle") {
        return geMix("from_the_triangle_area_formula_invert_for_height_height_m_e3c60950", [["(A × 2) ÷ b"]]);
      }
      if (p.shape === "parallelogram") {
        return geMix("in_a_parallelogram_area_m_so_the_height_m_6c9216d2", [["b × h", "A ÷ b"]]);
      }
      if (p.shape === "trapezoid") {
        return geMix("in_a_trapezoid_first_m_then_relate_it_to_the_area_and_divide_8dae2d02", [["(b1 + b2)", "(A × 2) ÷ (b1 + b2)"]]);
      }
      return geCopy("isolate_the_height_from_the_area_formula_of_the_same_shape_2c7e036b");

    case "tiling":
      return geMix("in_tiling_around_a_point_the_meeting_angles_must_add_up_to_m_063fc0e2", ["360°"]);

    case "circles":
      return p.askArea
        ? `the question asks for area: ${M(["π × r²"])}. the question asks for perimeter: ${M("2 × π × radius")}. Check which word is in the question.`
        : `The question asks for perimeter (linear in the radius): ${M("2πr")}. area uses the radius squared: ${M("πr²")}.`;

    case "solids":
      return geCopy("connect_the_description_faces_round_base_vertex_to_the_list__eb1cc96d");

    default:
      return geCopy("try_to_identify_which_formula_or_property_fits_the_question__9270af78");
  }
  return geCopy("try_to_identify_which_formula_or_property_fits_the_question__9270af78");
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
          toSpan(geCopy("sol_1_identify_square_all_sides_the_same_length_area_how_much_sp_b3333972"), "1"),
          toSpan(geMix("sol_2_substitute_m0_25b1c5f6", [`area = ${p.side} × ${p.side}`]), "2"),
          toSpan(geMix("sol_3_compute_m0_7117104d", [`${p.side} × ${p.side} = ${correctAnswer}`]), "3"),
          toSpan(resultPhraseArea(question, correctAnswer), "4"),
        ];
      }
      if (shape === "rectangle") {
        return [
          toSpan(geCopy("sol_1_identify_a_rectangle_has_two_pairs_of_equal_sides_the_area_fb06eee4"), "1"),
          toSpan(geCopy("sol_2_formula_rectangle_area_length_width_6f1b39cf"), "2"),
          toSpan(geMix("sol_3_substitute_and_compute_m0_135d9f5c", [`${p.length} × ${p.width} = ${correctAnswer}`]), "3"),
          toSpan(resultPhraseArea(question, correctAnswer), "4"),
        ];
      }
      if (shape === "triangle") {
        return [
          toSpan(geCopy("sol_1_identify_the_height_to_the_base_is_a_perpendicular_segment_4872de1b"), "1"),
          toSpan(geCopy("sol_2_formula_triangle_area_base_height_to_the_base_2_015bb42a"), "2"),
          toSpan(geMix("sol_3_substitute_m0_4e91153c", [`(${p.base} × ${p.height}) ÷ 2`]), "3"),
          toSpan(geMix("sol_step_compute_then_m0_m1", [`${p.base} × ${p.height} = ${p.base * p.height}`, `${p.base * p.height} ÷ 2 = ${correctAnswer}`]), "4"),
          toSpan(resultPhraseArea(question, correctAnswer), "5"),
        ];
      }
      if (shape === "parallelogram") {
        return [
          toSpan(geCopy("sol_1_identify_the_height_of_a_parallelogram_is_the_perpendicula_a12f1744"), "1"),
          toSpan(geCopy("sol_2_formula_parallelogram_area_base_height_perpendicular_8c27ad4b"), "2"),
          toSpan(geMix("sol_3_substitute_m0_4e91153c", [`${p.base} × ${p.height}`]), "3"),
          toSpan(geMix("sol_4_compute_m0_e1532936", [`${p.base} × ${p.height} = ${correctAnswer}`]), "4"),
          toSpan(resultPhraseArea(question, correctAnswer), "5"),
        ];
      }
      if (shape === "trapezoid") {
        const sumBases = p.base1 + p.base2;
        return [
          toSpan(geCopy("sol_1_identify_a_trapezoid_has_two_parallel_bases_the_height_is__e574ad5a"), "1"),
          toSpan(geCopy("sol_2_formula_trapezoid_area_base_1_base_2_height_2_644c8814"), "2"),
          toSpan(geMix("sol_3_substitute_m0_4e91153c", [`((${p.base1} + ${p.base2}) × ${p.height}) ÷ 2`]), "3"),
          toSpan(geMix("sol_step_compute_then_m0_m1", [`${p.base1} + ${p.base2} = ${sumBases}`, `(${sumBases} × ${p.height}) ÷ 2 = ${correctAnswer}`]), "4"),
          toSpan(resultPhraseArea(question, correctAnswer), "5"),
        ];
      }
      if (shape === "circle") {
        const r2 = p.radius * p.radius;
        return [
          toSpan(geCopy("sol_1_identify_the_radius_goes_from_the_center_to_the_edge_area__f56cefda"), "1"),
          toSpan(geCopy("sol_2_formula_circle_area_radius_here_3_14_006a59dc"), "2"),
          toSpan(geMix("sol_3_substitute_m0_4e91153c", [`area = 3.14 × ${p.radius}²`]), "3"),
          toSpan(geMix("sol_step_compute_then_m0_m1", [`${p.radius}² = ${r2}`, `3.14 × ${r2} = ${correctAnswer}`]), "4"),
          toSpan(resultPhraseArea(question, correctAnswer), "5"),
        ];
      }
      break;
    }

    case "perimeter": {
      if (shape === "square") {
        return [
          toSpan(geCopy("sol_1_formula_square_perimeter_side_4_6b38bda8"), "1"),
          toSpan(geMix("sol_2_substitute_m0_25b1c5f6", [`${p.side} × 4`]), "2"),
          toSpan(geMix("sol_3_compute_m0_7117104d", [`${p.side} × 4 = ${correctAnswer}`]), "3"),
          toSpan(resultPhraseLength(question, correctAnswer), "4"),
        ];
      }
      if (shape === "rectangle") {
        const sum = p.length + p.width;
        return [
          toSpan(geCopy("sol_1_formula_rectangle_perimeter_length_width_2_0461f663"), "1"),
          toSpan(geMix("sol_2_substitute_m0_25b1c5f6", [`(${p.length} + ${p.width}) × 2`]), "2"),
          toSpan(geMix("sol_step_compute_then_m0_m1", [`${p.length} + ${p.width} = ${sum}`, `${sum} × 2 = ${correctAnswer}`]), "3"),
          toSpan(resultPhraseLength(question, correctAnswer), "4"),
        ];
      }
      if (shape === "triangle") {
        return [
          toSpan(geCopy("sol_1_formula_triangle_perimeter_side_1_side_2_side_3_71ad3bd7"), "1"),
          toSpan(geMix("sol_2_substitute_m0_25b1c5f6", [`${p.side1} + ${p.side2} + ${p.side3}`]), "2"),
          toSpan(geMix("sol_3_compute_m0_7117104d", [`${p.side1} + ${p.side2} + ${p.side3} = ${correctAnswer}`]), "3"),
          toSpan(resultPhraseLength(question, correctAnswer), "4"),
        ];
      }
      if (shape === "circle") {
        return [
          toSpan(geCopy("sol_1_formula_circle_circumference_2_radius_86c6d60f"), "1"),
          toSpan(geMix("sol_2_substitute_m0_25b1c5f6", [`2 × 3.14 × ${p.radius}`]), "2"),
          toSpan(geMix("sol_step_compute_then_m0_m1", [`2 × 3.14 = 6.28`, `6.28 × ${p.radius} = ${correctAnswer}`]), "3"),
          toSpan(resultPhraseLength(question, correctAnswer), "4"),
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
          toSpan(geCopy("sol_1_formula_pyramid_volume_1_3_base_area_height_2d011c6f"), "1"),
          toSpan(geCopy("sol_2_square_base_base_area_side_side_540df4c9"), "2"),
          toSpan(geMix("sol_step_substitute_height_m0_m1", [`base area = ${bs} × ${bs} = ${baseArea}`, String(h)]), "3"),
          toSpan(
            geMix("sol_step_compute_rounded_m0_m1", [
              `(1/3) × ${baseArea} × ${h} = ${volRaw}`,
              String(correctAnswer),
            ]),
            "4"
          ),
          toSpan(resultPhraseVolume(question, correctAnswer), "5"),
        ];
      }
      if (p.kind === "pyramid_volume_rectangular") {
        const b1 = p.baseSide;
        const b2 = p.baseWidth;
        const h = p.height;
        const baseArea = b1 * b2;
        const volRaw = (baseArea * h) / 3;
        return [
          toSpan(geCopy("sol_1_formula_pyramid_volume_1_3_base_area_height_2d011c6f"), "1"),
          toSpan(geCopy("sol_2_rectangular_base_base_area_length_width_4cb18ac3"), "2"),
          toSpan(geMix("sol_step_substitute_height_m0_m1", [`${b1} × ${b2} = ${baseArea}`, String(h)]), "3"),
          toSpan(
            geMix("sol_step_compute_rounded_m0_m1", [
              `(1/3) × ${baseArea} × ${h} = ${volRaw}`,
              String(correctAnswer),
            ]),
            "4"
          ),
          toSpan(resultPhraseVolume(question, correctAnswer), "5"),
        ];
      }
      if (p.kind === "cone_volume") {
        const r = p.radius;
        const h = p.height;
        const r2 = r * r;
        const volRaw = (3.14 * r2 * h) / 3;
        return [
          toSpan(geCopy("sol_1_formula_cone_volume_1_3_radius_height_3_14_2d90d146"), "1"),
          toSpan(geMix("sol_2_substitute_m0_25b1c5f6", [`(1/3) × 3.14 × ${r}² × ${h}`]), "2"),
          toSpan(
            geMix("sol_step_compute_then_m0_m1", [
              `${r}² = ${r2}`,
              `3.14 × ${r2} × ${h} = ${3.14 * r2 * h}`,
            ]) +
              " " +
              geMix("sol_step_divide_by_3_approx_m0", [String(volRaw)]),
            "3"
          ),
          toSpan(resultPhraseVolumeRounded(question, correctAnswer), "4"),
        ];
      }
      if (p.kind === "prism_volume_triangle") {
        const b = p.base;
        const bh = p.baseHeight;
        const h = p.height;
        const baseArea = (b * bh) / 2;
        const prod = baseArea * h;
        return [
          toSpan(geCopy("sol_1_formula_prism_volume_base_area_the_prism_s_height_b604a955"), "1"),
          toSpan(geCopy("sol_2_triangle_base_area_base_height_to_the_base_2_ed4b64f8"), "2"),
          toSpan(geMix("sol_3_base_area_m0_d94946a0", [`(${b} × ${bh}) ÷ 2 = ${baseArea}`]), "3"),
          toSpan(
            geMix("sol_step_volume_m0", [`${baseArea} × ${h} = ${prod}`]) +
              " → " +
              String(correctAnswer) +
              geometryVolumeSuffix(question),
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
          toSpan(geCopy("sol_1_formula_prism_volume_base_area_height_7cfa36dd"), "1"),
          toSpan(geMix("sol_2_rectangular_base_m0_d3ad2c15", [`${L} × ${W} = ${baseArea}`]), "2"),
          toSpan(geMix("sol_3_volume_m0_b3cb38cd", [`${baseArea} × ${h} = ${prod}`]), "3"),
          toSpan(resultPhraseVolume(question, correctAnswer), "4"),
        ];
      }
      if (shape === "cube") {
        return [
          toSpan(geCopy("sol_1_identify_cube_three_identical_dimensions_volume_how_many_u_40a4f1bf"), "1"),
          toSpan(geCopy("sol_2_formula_cube_volume_side_side_side_side_377a28d7"), "2"),
          toSpan(geMix("sol_3_substitute_m0_4e91153c", [`${p.side}³`]), "3"),
          toSpan(geMix("sol_4_compute_m0_e1532936", [`${p.side} × ${p.side} × ${p.side} = ${correctAnswer}`]), "4"),
          toSpan(resultPhraseVolume(question, correctAnswer), "5"),
        ];
      }
      if (shape === "rectangular_prism") {
        const product = p.length * p.width * p.height;
        return [
          toSpan(geCopy("sol_1_formula_box_volume_length_width_height_a31e644e"), "1"),
          toSpan(geMix("sol_2_substitute_m0_25b1c5f6", [`${p.length} × ${p.width} × ${p.height}`]), "2"),
          toSpan(geMix("sol_3_compute_m0_7117104d", [`${p.length} × ${p.width} × ${p.height} = ${product}`]), "3"),
          toSpan(resultPhraseVolume(question, correctAnswer), "4"),
        ];
      }
      if (shape === "cylinder") {
        const r2 = p.radius * p.radius;
        return [
          toSpan(geCopy("sol_1_formula_cylinder_volume_radius_height_4d4dc95c"), "1"),
          toSpan(geMix("sol_2_substitute_m0_25b1c5f6", [`3.14 × ${p.radius}² × ${p.height}`]), "2"),
          toSpan(geMix("sol_step_compute_m0", [`${p.radius}² = ${r2}`, `3.14 × ${r2} × ${p.height} = ${correctAnswer}`]), "3"),
          toSpan(resultPhraseVolume(question, correctAnswer), "4"),
        ];
      }
      if (shape === "sphere") {
        const r3 = p.radius * p.radius * p.radius;
        return [
          toSpan(geCopy("sol_1_formula_sphere_volume_4_3_radius_4630024f"), "1"),
          toSpan(geMix("sol_2_substitute_m0_25b1c5f6", [`(4/3) × 3.14 × ${p.radius}³`]), "2"),
          toSpan(geMix("sol_step_compute_then_m0_m1", [`${p.radius}³ = ${r3}`, `(4/3) × 3.14 × ${r3} = ${correctAnswer}`]), "3"),
          toSpan(resultPhraseVolume(question, correctAnswer), "4"),
        ];
      }
      break;
    }

    case "angles": {
      const angle1 = p.angle1 || 0;
      const angle2 = p.angle2 || 0;
      const sum = angle1 + angle2;
      return [
        toSpan(geCopy("sol_1_recall_the_sum_of_the_three_interior_angles_of_a_triangle__50dae0bb"), "1"),
        toSpan(
          geMix("sol_step_two_angles_find_third_m0_m1", [
            `angle 1 = ${angle1}°`,
            `angle 2 = ${angle2}°`,
          ]),
          "2"
        ),
        toSpan(geMix("sol_3_compute_m0_7117104d", [`180° - (${angle1}° + ${angle2}°) = 180° - ${sum}° = ${correctAnswer}°`]), "3"),
        toSpan(geMix("sol_step_missing_angle_m0", [String(correctAnswer)]), "4"),
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
          toSpan(geCopy("sol_1_in_a_right_triangle_the_two_sides_next_to_the_right_angle__cdc681b6"), "1"),
          toSpan(geMix("sol_2_substitute_the_legs_m0_1c06b2f5", [`${a}² + ${b}² = c²`]), "2"),
          toSpan(geMix("sol_step_squares_m0_m1", [`${a}² = ${a2}`, `${b}² = ${b2}`]), "3"),
          toSpan(geMix("sol_4_add_m0_50dcfbfc", [`${a2} + ${b2} = ${sum}`]), "4"),
          toSpan(
            geMix("sol_step_sqrt_hyp_m0", [`c = √${sum} = ${correctAnswer}`]) +
              geometryLengthSuffix(question),
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
        toSpan(geCopy("sol_1_the_same_formula_a_b_c_when_finding_a_leg_isolate_its_squa_6633504c"), "1"),
        toSpan(
          geMix("sol_step_look_for_leg_m0_m1", [
            String(missingLeg),
            `${missingLeg}² = c² - ${knownLegValue}²`,
          ]) +
            " " +
            geCopy("sol_step_do_not_add_legs_when_missing"),
          "2"
        ),
        toSpan(geMix("sol_step_squares_m0_m1", [`${c}² = ${c2}`, `${knownLegValue}² = ${known2}`]), "3"),
        toSpan(geMix("sol_4_subtract_m0_50ffdc5a", [`${c2} - ${known2} = ${diff}`]), "4"),
        toSpan(
          geMix("sol_step_missing_leg_m0", [`${missingLeg} = √${diff} = ${correctAnswer}`]) +
            geometryLengthSuffix(question),
          "5"
        ),
      ];
    }

    case "shapes_basic": {
      if (p.kind === "shapes_basic_square" || p.kind === "shapes_basic_rectangle") {
        const shapeName = p.shape || "square";
        return [
          toSpan(geMix("sol_step_shape_appears_m0", [String(shapeName)]), "1"),
          toSpan(
            shapeName === "square"
              ? "2. In a square the four sides are the same length."
              : "2. A rectangle has two different lengths, each appearing in an opposite pair.",
            "2"
          ),
          toSpan(geMix("sol_step_choose_shape_m0", [String(shapeName)]), "3"),
          toSpan(geMix("sol_step_answer_is_m0", [String(shapeName)]), "4"),
        ];
      }
      if (p.kind === "shapes_basic_properties_square") {
        return [
          toSpan(geCopy("sol_1_the_question_asks_how_many_equal_sides_a_square_has_not_pe_8ab5e703"), "1"),
          toSpan(geCopy("sol_2_in_a_square_all_four_sides_are_the_same_length_30b3ee70"), "2"),
          toSpan(geMix("sol_step_equal_sides_m0", [String(correctAnswer)]), "3"),
        ];
      }
      if (p.kind === "shapes_basic_properties_rectangle") {
        return [
          toSpan(geCopy("sol_1_the_question_asks_how_many_pairs_of_equal_sides_a_rectangl_ccd0403b"), "1"),
          toSpan(geCopy("sol_2_a_rectangle_has_two_different_lengths_each_length_appears__bbe0a387"), "2"),
          toSpan(geMix("sol_step_two_pairs_m0", [String(correctAnswer)]), "3"),
        ];
      }
      if (p.kind === "shapes_basic_properties_angles") {
        const shapeName = p.shape || "square";
        return [
          toSpan(geMix("sol_step_quad_angles_m0", [String(shapeName)]), "1"),
          toSpan(geCopy("sol_2_in_a_square_and_a_rectangle_all_four_angles_are_right_90_c8184174"), "2"),
          toSpan(geMix("sol_step_right_angles_m0", [String(correctAnswer)]), "3"),
        ];
      }
      return [];
    }

    case "parallel_perpendicular": {
      const type = p.type || "parallel";
      const opt = type === "parallel" ? "1 (parallel)" : "2 (perpendicular)";
      return [
        toSpan(geMix("sol_step_name_in_q_m0", [String(type)]), "1"),
        toSpan(
          type === "parallel"
            ? "2. Parallel lines in the same plane do not intersect and keep a constant distance."
            : "2. Perpendicular lines intersect at a right angle (90°).",
          "2"
        ),
        toSpan(geCopy("sol_3_by_the_answer_key_in_the_question_1_parallel_2_perpendicul_000cd8fd"), "3"),
        toSpan(geMix("sol_step_match_m0", [String(opt)]), "4"),
      ];
    }

    case "triangles": {
      const type = p.type || "equilateral";
      const idx =
        type === "equilateral" ? 1 : type === "isosceles" ? 2 : 3;
      return [
        toSpan(geMix("sol_step_classify_tri_m0", [String(type)]), "1"),
        toSpan(
          type === "equilateral"
            ? "2. In an equilateral triangle all three sides are the same length."
            : type === "isosceles"
            ? "2. In an isosceles triangle exactly two sides are equal."
            : "2. In a scalene triangle all three lengths are different.",
          "2"
        ),
        toSpan(geCopy("sol_3_key_in_the_question_1_equilateral_2_isosceles_3_scalene_20fc6d66"), "3"),
        toSpan(geMix("sol_step_option_m0", [String(idx)]), "4"),
      ];
    }

    case "quadrilaterals": {
      const type = p.type || "square";
      const types = ["square", "rectangle", "parallelogram", "trapezoid"];
      const idx = Math.max(1, types.indexOf(type) + 1);
      return [
        toSpan(geMix("sol_step_identify_quad_m0", [String(type)]), "1"),
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
        toSpan(geCopy("sol_3_key_1_square_2_rectangle_3_parallelogram_4_trapezoid_f03280f1"), "3"),
        toSpan(geMix("sol_step_number_matches_m0_m1", [String(type), String(idx)]), "4"),
      ];
    }

    case "transformations": {
      const type = p.type || "translation";
      const opt = type === "translation" ? "1 (translation)" : "2 (reflection)";
      return [
        toSpan(geMix("sol_step_transform_type_m0", [String(type)]), "1"),
        toSpan(
          type === "translation"
            ? "2. Translation: every point moves by the same vector — the shape does not flip."
            : "2. reflection: a shape 'flips' relative to a line — like a mirror.",
          "2"
        ),
        toSpan(geCopy("sol_3_in_the_key_1_translation_2_reflection_c067c809"), "3"),
        toSpan(geMix("sol_step_choose_opt_m0", [String(opt)]), "4"),
      ];
    }

    case "rotation": {
      const angle = p.angle || 90;
      return [
        toSpan(geCopy("sol_1_rotation_is_measured_in_degrees_around_a_center_point_4556d770"), "1"),
        toSpan(geMix("sol_step_rotation_angle_m0", [String(angle)]), "2"),
        toSpan(
          angle === 90
            ? "3. 90° = a quarter of a full turn."
            : angle === 180
            ? "3. 180° = a half turn."
            : "3. 270° = three quarters of a turn.",
          "3"
        ),
        toSpan(geMix("sol_step_answer_degrees_m0", [String(angle)]), "4"),
      ];
    }

    case "symmetry": {
      const shapeName = p.shape || "square";
      const axes = p.axes ?? 4;
      return [
        toSpan(geCopy("sol_1_axis_of_symmetry_a_line_that_splits_the_shape_into_two_mat_ca1f22ee"), "1"),
        toSpan(
          shapeName === "square"
            ? "2. In a square: 4 axes — 2 through midpoints of opposite sides and 2 diagonals."
            : shapeName === "rectangle"
            ? "2. In a non-square rectangle: 2 axes through midpoints of opposite sides."
            : "2. In an equilateral triangle: 3 axes — from each vertex to the midpoint of the opposite side.",
          "2"
        ),
        toSpan(geMix("sol_step_count_axes_m0", [String(shapeName)]), "3"),
        toSpan(geMix("sol_step_axes_count_m0", [String(axes)]), "4"),
      ];
    }

    case "diagonal": {
      if (p.kind === "diagonal_square") {
        const side = p.side || 1;
        return [
          toSpan(geCopy("sol_1_a_diagonal_is_a_segment_connecting_two_vertices_not_on_the_1d26c39d"), "1"),
          toSpan(geMix("sol_step_diag_square_m0", [String(side)]), "2"),
          toSpan(geMix("sol_3_compute_m0_7117104d", [`diagonal = √(${side}² + ${side}²) = √(${side * side * 2}) = ${correctAnswer}`]), "3"),
        ];
      } else if (p.kind === "diagonal_rectangle") {
        const side = p.side || 1;
        const width = p.width || 1;
        return [
          toSpan(geCopy("sol_1_a_diagonal_is_a_segment_connecting_two_vertices_not_on_the_1d26c39d"), "1"),
          toSpan(geMix("sol_step_diag_rect_m0_m1", [String(side), String(width)]), "2"),
          toSpan(geMix("sol_3_compute_m0_7117104d", [`diagonal = √(${side}² + ${width}²) = √(${side * side + width * width}) = ${correctAnswer}`]), "3"),
        ];
      } else if (p.kind === "diagonal_parallelogram") {
        const side = p.side || 1;
        const width = p.width || 1;
        return [
          toSpan(geCopy("sol_1_a_diagonal_is_a_segment_connecting_two_vertices_not_on_the_1d26c39d"), "1"),
          toSpan(geMix("sol_step_diag_para_m0_m1", [String(side), String(width)]), "2"),
          toSpan(geMix("sol_3_compute_m0_7117104d", [`diagonal = √(${side}² + ${width}²) = √(${side * side + width * width}) = ${correctAnswer}`]), "3"),
        ];
      }
      return [];
    }

    case "heights": {
      if (p.shape === "triangle") {
        const base = p.base || 1;
        const area = p.area || 1;
        return [
          toSpan(geCopy("sol_1_the_height_of_a_triangle_is_the_distance_from_the_vertex_t_6c8a0dd5"), "1"),
          toSpan(geCopy("sol_2_formula_area_base_height_2_991aec10"), "2"),
          toSpan(geMix("sol_3_substitute_m0_4e91153c", [`${area} = (${base} × height) ÷ 2`]), "3"),
          toSpan(geMix("sol_4_compute_m0_e1532936", [`height = (${area} × 2) ÷ ${base} = ${correctAnswer}`]), "4"),
        ];
      } else if (p.shape === "parallelogram") {
        const base = p.base || 1;
        const area = p.area || 1;
        return [
          toSpan(geCopy("sol_1_the_height_of_a_parallelogram_is_the_distance_between_the__6cd159b7"), "1"),
          toSpan(geCopy("sol_2_formula_area_base_height_5e73cb55"), "2"),
          toSpan(geMix("sol_3_substitute_m0_4e91153c", [`${area} = ${base} × height`]), "3"),
          toSpan(geMix("sol_4_compute_m0_e1532936", [`height = ${area} ÷ ${base} = ${correctAnswer}`]), "4"),
        ];
      } else if (p.shape === "trapezoid") {
        const base1 = p.base1 || 1;
        const base2 = p.base2 || 1;
        const area = p.area || 1;
        const sumBases = base1 + base2;
        return [
          toSpan(geCopy("sol_1_the_height_of_a_trapezoid_is_the_distance_between_the_two__cf692a64"), "1"),
          toSpan(geCopy("sol_2_formula_area_base_1_base_2_height_2_b91a92b6"), "2"),
          toSpan(geMix("sol_3_substitute_m0_4e91153c", [`${area} = ((${base1} + ${base2}) × height) ÷ 2`]), "3"),
          toSpan(geMix("sol_step_compute_then_m0_m1", [`${base1} + ${base2} = ${sumBases}`, `height = (${area} × 2) ÷ ${sumBases} = ${correctAnswer}`]), "4"),
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
          toSpan(geMix("sol_1_the_floor_area_m0_96cafeca", [`${floorL} × ${floorW} = ${floorArea}`]), "1"),
          toSpan(geMix("sol_2_the_area_of_one_tile_m0_5888fcd0", [`${tileSide} × ${tileSide} = ${tileArea}`]), "2"),
          toSpan(geMix("sol_3_number_of_tiles_m0_c7658d85", [`${floorArea} ÷ ${tileArea} = ${correctAnswer}`]), "3"),
        ];
      }
      const shape = p.shape || "square";
      const angle = p.angle || 90;
      return [
        toSpan(geCopy("sol_1_in_tiling_around_each_vertex_the_angle_sum_must_be_exactly_939e53e0"), "1"),
        toSpan(
          shape === "square" || shape === "rectangle"
            ? "2. a square and a rectangle have an interior angle of 90° - 4 × 90° = 360°."
            : shape === "equilateral triangle"
            ? "2. In an equilateral triangle each interior angle is 60° - 6 × 60° = 360°."
            : "2. in a hexagon each interior angle is 120° - 3 × 120° = 360°.",
          "2"
        ),
        toSpan(geMix("sol_step_interior_angle_m0_m1", [String(shape), String(angle)]), "3"),
        toSpan(geMix("sol_step_so_answer_angle_m0", [String(angle)]), "4"),
      ];
    }

    case "circles": {
      const radius = p.radius || 1;
      const askArea = p.askArea;
      if (askArea) {
        const r2 = radius * radius;
        return [
          toSpan(geCopy("sol_1_formula_circle_area_radius_fc83fc64"), "1"),
          toSpan(geMix("sol_2_substitute_m0_25b1c5f6", [`area = 3.14 × ${radius}²`]), "2"),
          toSpan(geMix("sol_step_compute_then_m0_m1", [`${radius}² = ${r2}`, `3.14 × ${r2} = ${correctAnswer}`]), "3"),
        ];
      } else {
        return [
          toSpan(geCopy("sol_1_formula_circle_circumference_2_radius_86c6d60f"), "1"),
          toSpan(geMix("sol_2_substitute_m0_25b1c5f6", [`2 × 3.14 × ${radius}`]), "2"),
          toSpan(geMix("sol_step_compute_then_m0_m1", [`2 × 3.14 = 6.28`, `6.28 × ${radius} = ${correctAnswer}`]), "3"),
        ];
      }
    }

    case "solids": {
      const solid = p.solid || "cube";
      const kind = p.kind || "solids";

      if (kind === "solids_faces") {
        const faces = p.faces ?? correctAnswer;
        return [
          toSpan(geMix("sol_step_faces_q_m0", [String(solid)]), "1"),
          toSpan(geCopy("sol_2_count_every_flat_or_curved_surface_of_the_solid_f14bd757"), "2"),
          toSpan(geMix("sol_step_faces_a_m0_m1", [String(solid), String(faces)]), "3"),
        ];
      }

      if (kind === "solids_vertices") {
        const vertices = p.vertices ?? correctAnswer;
        return [
          toSpan(geMix("sol_step_vertices_q_m0", [String(solid)]), "1"),
          toSpan(geCopy("sol_2_vertex_a_point_where_at_least_two_sides_meet_a6bc3e37"), "2"),
          toSpan(geMix("sol_step_vertices_a_m0_m1", [String(solid), String(vertices)]), "3"),
        ];
      }

      if (kind === "solids_edges") {
        const edges = p.edges ?? correctAnswer;
        return [
          toSpan(geMix("sol_step_edges_q_m0", [String(solid)]), "1"),
          toSpan(geCopy("sol_2_side_an_edge_where_two_faces_meet_889af395"), "2"),
          toSpan(geMix("sol_step_edges_a_m0_m1", [String(solid), String(edges)]), "3"),
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
        toSpan(geMix("sol_step_desc_m0", [String(desc)]), "1"),
        toSpan(geMix("sol_step_identify_features_m0", [String(key)]), "2"),
        toSpan(geMix("sol_step_solid_name_m0", [String(solid)]), "3"),
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
        return geMix("it_looks_like_you_computed_perimeter_mside_instead_of_area_m_e7f92ece", [["4 ×", "s × s"]]);
      }
      if (sh === "rectangle" && L > 0 && W > 0 && userAnsNum === 2 * (L + W)) {
        return geMix("it_looks_like_you_computed_perimeter_instead_of_area_multipl_24d50e0b", [["ℓ × w"]]);
      }
      if (sh === "triangle" && base > 0 && ht > 0 && userAnsNum === base * ht) {
        return geMix("it_looks_like_you_multiplied_m_but_you_forgot_to_divide_by_m_adae85ca", [["b × h", "2"]]);
      }
      if (sh === "parallelogram" && base > 0 && ht > 0 && userAnsNum === (base * ht) / 2) {
        return geMix("in_a_parallelogram_the_base_area_is_m_with_no_division_by_m__1ee0b7d5", [["b × h", "2"]]);
      }
      if (sh === "circle" && r > 0 && !Number.isNaN(userAnsNum)) {
        const circ = Math.round(2 * 3.14 * r);
        if (userAnsNum === circ) {
          return geMix("it_looks_like_you_computed_perimeter_m_instead_of_area_m_dcc4b734", [["2πr", "π × r²"]]);
        }
        if (userAnsNum === Math.round(3.14 * r)) {
          return geMix("area_needs_the_radius_squared_m_not_only_m_59979c2e", ["πr²", "π × r"]);
        }
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum < correctNum) {
        return geCopy("result_too_small_maybe_you_missed_a_multiplication_divided_t_06cfcc7d");
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum > correctNum) {
        return geCopy("result_too_large_maybe_you_forgot_to_divide_by_2_for_a_trian_01e1d554");
      }
      return geMix("check_that_this_is_an_area_formula_not_perimeter_square_m_re_452fc879", ["side²", "length×width", "(base×height)/2", "πr²"]);
    }

    case "perimeter": {
      const side = toNum(p.side);
      const L = toNum(p.length);
      const W = toNum(p.width);
      const r = toNum(p.radius);
      if (sh === "square" && side > 0 && userAnsNum === side * side) {
        return geMix("it_looks_like_you_computed_area_m_instead_of_perimeter_mside_f21fa21a", [["s²", "4 ×"]]);
      }
      if (sh === "rectangle" && L > 0 && W > 0 && userAnsNum === L * W) {
        return geMix("it_looks_like_you_computed_area_m_instead_of_perimeter_m_d5c7e4ca", [["ℓ × w"], "the sum of the sides × 2"]);
      }
      if (sh === "circle" && r > 0) {
        const ar = Math.round(3.14 * r * r);
        if (userAnsNum === ar) {
          return geMix("it_looks_like_you_computed_the_circle_s_area_instead_of_its__35c79608", ["2πr"]);
        }
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum < correctNum) {
        return geCopy("perimeter_too_small_maybe_you_forgot_to_multiply_by_2_for_a__854a0652");
      }
      return geMix("perimeter_the_sum_of_all_sides_or_m_in_a_circle_not_a_produc_ad249dee", ["2πr"]);
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
        return geCopy("it_looks_like_you_forgot_the_factor_in_a_pyramid_or_cone_the_11d52b9a");
      }
      if (k === "prism_volume_triangle" || k === "prism_volume_rectangular") {
        const baseA = toNum(p.baseArea);
        const h = toNum(p.height);
        if (baseA > 0 && h > 0 && userAnsNum === Math.round(baseA + h)) {
          return geMix("prism_volume_m_not_a_sum_of_areas_height_cfde0d69", [["A_base × h"]]);
        }
      }
      if (sh === "cube" && toNum(p.side) > 0 && userAnsNum === toNum(p.side) * toNum(p.side)) {
        return geMix("it_looks_like_you_computed_m_a_face_s_area_instead_of_m_for__990466ec", [["s²", "s³"]]);
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum < correctNum) {
        return geCopy("volume_too_small_maybe_you_missed_one_dimension_in_the_produ_aee1d54b");
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum > correctNum) {
        return geCopy("volume_too_large_maybe_you_forgot_for_a_pyramid_cone_or_mult_c1951ddc");
      }
      return geMix("volume_of_a_box_prism_three_dimensions_multiplied_pyramid_co_888b939b", [["(⅓)×A_base×h", "π"]]);
    }

    case "angles": {
      const a1 = toNum(p.angle1);
      const a2 = toNum(p.angle2);
      if (!Number.isNaN(userAnsNum) && !Number.isNaN(a1) && !Number.isNaN(a2)) {
        if (userAnsNum === a1 + a2) {
          return geMix("you_added_the_two_angles_you_need_to_subtract_the_sum_from_m_4b73ce3d", ["180°"]);
        }
        if (userAnsNum === 180 - Math.abs(a1 - a2)) {
          return geMix("check_the_third_angle_is_m_minus_the_sum_of_the_two_given_an_aa615642", ["180°"]);
        }
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum > correctNum) {
        return geMix("result_too_large_maybe_you_added_instead_of_subtracting_from_613a4905", ["180°"]);
      }
      return geMix("in_a_triangle_the_sum_of_angles_m_the_missing_angle_m_145ccaf6", ["180°", ["180° − (∠1 + ∠2)"]]);
    }

    case "pythagoras": {
      const a = toNum(p.a);
      const b = toNum(p.b);
      const c = toNum(p.c);
      if (!Number.isNaN(userAnsNum) && userAnsNum === a + b && p.kind !== "pythagoras_leg") {
        return geMix("do_not_add_the_legs_to_get_the_hypotenuse_you_need_m_then_a__4127ef4f", ["a² + b²"]);
      }
      if (p.kind === "pythagoras_leg" && !Number.isNaN(userAnsNum) && userAnsNum === c) {
        return geMix("the_missing_leg_is_asked_usually_m_not_the_length_of_the_hyp_d11594fe", ["√(c² − leg²)"]);
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum < correctNum) {
        return geCopy("answer_too_small_maybe_you_forgot_the_square_root_after_summ_145ee36f");
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum > correctNum) {
        return geMix("answer_too_large_maybe_you_squared_instead_of_taking_a_root__73491007", ["a+b", "√(a²+b²)"]);
      }
      return geMix("right_triangle_m_the_hypotenuse_is_opposite_the_right_angle__93fe67e7", ["a² + b² = c²"]);
    }

    case "shapes_basic": {
      if (p.kind === "shapes_basic_square" || p.kind === "shapes_basic_rectangle") {
        const userAns = String(wrongAnswer ?? "").trim();
        if (userAns === "rectangle" && p.shape === "square") {
          return geCopy("all_four_sides_of_a_square_are_equal_not_a_rectangle_with_tw_e8e5f6c7");
        }
        if (userAns === "square" && p.shape === "rectangle") {
          return geCopy("a_rectangle_is_determined_by_two_different_side_lengths_two__bd8ab4e7");
        }
        return geCopy("compare_all_the_sides_four_equal_square_two_different_length_5085a017");
      }
      if (p.kind === "shapes_basic_properties_square") {
        return geCopy("the_question_asks_how_many_equal_sides_a_square_has_four_do__d5a76064");
      }
      if (p.kind === "shapes_basic_properties_rectangle") {
        return geCopy("the_question_asks_how_many_pairs_of_equal_sides_a_rectangle__246d3745");
      }
      if (p.kind === "shapes_basic_properties_angles") {
        return geCopy("a_square_and_a_rectangle_have_four_right_angles_not_two_or_t_bbfe4048");
      }
      return geCopy("we_distinguished_side_properties_from_angles_and_a_square_fr_ddc4fb58");
    }

    case "parallel_perpendicular": {
      if (p.isParallel === true && userAnsNum === 2) {
        return geCopy("the_question_is_about_parallel_lines_lines_that_never_meet_2_35c42d69");
      }
      if (p.isParallel === false && userAnsNum === 1) {
        return geCopy("the_question_is_about_perpendicular_lines_meeting_at_a_right_a178a3ba");
      }
      return geMix("parallel_never_meet_in_the_same_plane_perpendicular_meet_at__8137a3fe", ["90°"]);
    }

    case "triangles":
      return geMix("the_number_in_the_question_must_match_the_family_name_m_9517c16c", [["1 متساوي الأضلاع، 2 متساوي الساقين، 3 مختلف الأضلاع"]]);

    case "quadrilaterals":
      return geCopy("check_pairs_of_parallel_sides_and_angles_square_rectangle_fo_22476f37");

    case "transformations":
      if (!Number.isNaN(userAnsNum) && userAnsNum === 2 && p.isTranslation) {
        return geCopy("translation_is_option_1_in_the_question_not_reflection_92a80b25");
      }
      if (!Number.isNaN(userAnsNum) && userAnsNum === 1 && p.isTranslation === false) {
        return geCopy("reflection_is_option_2_not_translation_b9eaa4e4");
      }
      return geCopy("a_translation_keeps_the_shape_s_orientation_a_reflection_cre_94a47af1");

    case "rotation":
      if (!Number.isNaN(userAnsNum) && [90, 180, 270].includes(userAnsNum) && userAnsNum !== correctNum) {
        return geMix("check_whether_a_quarter_turn_is_needed_m_half_m_or_three_qua_9006445b", ["90°", "180°", "270°"]);
      }
      return geCopy("rotation_is_measured_in_full_degrees_around_a_point_match_th_81a0204c");

    case "symmetry": {
      const ax = toNum(p.axes);
      if (!Number.isNaN(userAnsNum) && !Number.isNaN(ax) && userAnsNum === ax + 1) {
        return geCopy("maybe_you_counted_one_axis_twice_count_only_true_axes_of_sym_64d7a15e");
      }
      return geMix("square_m_rectangle_not_a_square_m_equilateral_triangle_m_by__2d48ef6c", ["4", "2", "3"]);
    }

    case "diagonal":
      if (p.kind === "diagonal_square") {
        const s = toNum(p.side);
        if (s > 0 && userAnsNum === 2 * s) {
          return geMix("maybe_you_multiplied_a_side_by_m_for_a_square_s_diagonal_use_42ec16f2", ["2", ["√2 × s"]]);
        }
        if (s > 0 && userAnsNum === s * s) {
          return geMix("the_diagonal_is_not_the_side_s_area_try_m_or_m_34204fdf", [["√(s²+s²)", "s×√2"]]);
        }
        return geMix("a_square_s_diagonal_m_a_right_triangle_with_two_equal_legs_3bbe3d35", [["s × √2"]]);
      }
      if (p.kind === "diagonal_rectangle" || p.kind === "diagonal_parallelogram") {
        return geMix("use_the_pythagorean_theorem_with_the_two_legs_from_the_quest_60dce70a", [["√(ℓ² + w²)"]]);
      }
      return geCopy("the_diagonal_as_the_hypotenuse_of_a_right_triangle_built_fro_03c148df");

    case "heights": {
      if (p.shape === "triangle") {
        const ba = toNum(p.base);
        const ar = toNum(p.area);
        if (ba > 0 && ar > 0 && userAnsNum === Math.round(ar / ba)) {
          return geCopy("maybe_you_divided_area_by_the_base_without_first_multiplying_9437389b");
        }
        return geMix("a_triangle_s_height_m_58810569", [["(A × 2) ÷ b"]]);
      }
      if (p.shape === "parallelogram") {
        const ba = toNum(p.base);
        const ar = toNum(p.area);
        if (ba > 0 && ar > 0 && userAnsNum === Math.round((ar * 2) / ba)) {
          return geMix("a_parallelogram_has_no_division_by_m_in_area_height_m_6b1f736a", ["2", ["A ÷ b"]]);
        }
        return geMix("a_parallelogram_s_height_m_39f28f0b", [["A ÷ b"]]);
      }
      if (p.shape === "trapezoid") {
        return geCopy("in_a_trapezoid_you_must_first_add_the_two_bases_in_the_area__ecd5ea35");
      }
      return geCopy("isolate_the_height_by_inverting_the_area_formula_of_the_same_e187e576");
    }

    case "tiling": {
      if (!Number.isNaN(userAnsNum) && userAnsNum === 360) {
        return geMix("m_is_the_sum_around_a_point_not_the_base_angle_of_the_tiling_1e594db5", ["360°"]);
      }
      return geMix("the_tiling_angle_is_the_interior_angle_of_the_tile_shape_squ_fd1cbb6e", ["90°", "60°", "120°"]);
    }

    case "circles": {
      if (p.askArea) {
        const r = toNum(p.radius);
        const circ = Math.round(2 * 3.14 * r);
        if (userAnsNum === circ) {
          return geMix("area_is_given_but_you_computed_like_a_perimeter_use_m_993bec85", [["π × r²"]]);
        }
        return geMix("area_m_if_you_got_too_small_maybe_you_forgot_to_square_the_m_dd2d34b9", ["πr²", "r"]);
      }
      const r = toNum(p.radius);
      const ar = Math.round(3.14 * r * r);
      if (userAnsNum === ar) {
        return geMix("perimeter_is_given_but_you_computed_like_an_area_use_m_bc46366e", ["2πr"]);
      }
      return geMix("distinction_m_do_not_confuse_the_formulas_072be2e4", [["A ∝ r², P ∝ r"]]);
    }

    case "solids":
      return geCopy("match_the_description_of_the_faces_and_base_in_the_question__a0374a54");

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
      lines.push(geCopy("theory_area_measures_how_much_space_a_shape_takes_up_on_a_surfa_2b46625f"));
      if (gradeKey === "g2" || gradeKey === "g3") {
        lines.push(geCopy("theory_square_area_side_side_d90063d1"));
        lines.push(geCopy("theory_rectangle_area_length_width_8d05431b"));
      } else if (gradeKey === "g4") {
        lines.push(geCopy("theory_square_area_side_side_d90063d1"));
        lines.push(geCopy("theory_rectangle_area_length_width_8d05431b"));
        lines.push(geCopy("theory_triangle_area_base_height_2_ee5147b9"));
      } else if (gradeKey === "g5") {
        lines.push(geCopy("theory_square_area_side_side_d90063d1"));
        lines.push(geCopy("theory_rectangle_area_length_width_8d05431b"));
        lines.push(geCopy("theory_triangle_area_base_height_2_ee5147b9"));
        lines.push(geCopy("theory_parallelogram_area_base_height_f30cc04f"));
        lines.push(geCopy("theory_trapezoid_area_base_1_base_2_height_2_b44fb576"));
      } else {
        // g6
        lines.push(geCopy("theory_square_area_side_e4408f44"));
        lines.push(geCopy("theory_rectangle_area_length_width_8d05431b"));
        lines.push(geCopy("theory_triangle_area_base_height_2_ee5147b9"));
        lines.push(geCopy("theory_parallelogram_area_base_height_f30cc04f"));
        lines.push(geCopy("theory_trapezoid_area_base_1_base_2_height_2_b44fb576"));
        lines.push(geCopy("theory_circle_area_radius_22da219d"));
      }
      break;
    }

    case "perimeter": {
      lines.push(geCopy("theory_perimeter_measures_the_length_of_the_path_around_the_sha_b10f4aa3"));
      lines.push(geCopy("theory_always_add_all_the_sides_35f51c8f"));
      if (gradeKey === "g2" || gradeKey === "g3") {
        lines.push(geCopy("theory_square_perimeter_side_4_5b04b4ea"));
        lines.push(geCopy("theory_rectangle_perimeter_length_width_2_d0f75414"));
      } else {
        lines.push(geCopy("theory_for_every_shape_perimeter_the_sum_of_all_side_lengths_c6474a6d"));
        if (gradeKey === "g4" || gradeKey === "g5" || gradeKey === "g6") {
          lines.push(geCopy("theory_circle_circumference_2_radius_659c2e16"));
        }
      }
      break;
    }

    case "volume": {
      lines.push(geCopy("theory_volume_measures_how_much_space_a_solid_takes_up_three_di_103201f0"));
      if (gradeKey === "g5") {
        lines.push(geCopy("theory_cube_volume_side_4339f036"));
        lines.push(geCopy("theory_box_rectangular_volume_length_width_height_dc4cdf78"));
      } else {
        // g6
        lines.push(geCopy("theory_cube_volume_side_4339f036"));
        lines.push(geCopy("theory_box_volume_length_width_height_e648d020"));
        lines.push(geCopy("theory_cylinder_volume_radius_height_a859a17a"));
        lines.push(geCopy("theory_sphere_volume_4_3_radius_4c5822f6"));
      }
      break;
    }

    case "angles": {
      lines.push(geCopy("theory_in_every_triangle_the_sum_of_the_interior_angles_is_180_2e79d636"));
      lines.push(geCopy("theory_if_two_angles_are_known_find_the_third_using_180_minus_t_8ac26451"));
      break;
    }

    case "pythagoras": {
      lines.push(geCopy("theory_in_a_right_triangle_a_b_c_c_is_the_hypotenuse_991e6079"));
      lines.push(geCopy("theory_if_both_legs_are_known_find_the_hypotenuse_c_a_b_b880cf27"));
      lines.push(geCopy("theory_if_the_hypotenuse_and_one_leg_are_known_find_the_missing_c896c771"));
      break;
    }

    case "shapes_basic": {
      if (gradeKey === "g1") {
        lines.push(geCopy("theory_square_4_equal_sides_4_right_angles_3acc400e"));
        lines.push(geCopy("theory_rectangle_2_pairs_of_equal_sides_4_right_angles_563633d2"));
      } else {
        // Grade 4' - properties
        lines.push(geCopy("theory_square_4_equal_sides_4_right_angles_90_134b0b06"));
        lines.push(geCopy("theory_rectangle_2_pairs_of_equal_sides_4_right_angles_90_0852c039"));
        lines.push(geCopy("theory_square_all_4_sides_are_equal_in_length_0d9ce054"));
        lines.push(geCopy("theory_rectangle_it_has_2_pairs_of_equal_sides_one_long_pair_an_4d67b802"));
      }
      break;
    }

    case "parallel_perpendicular": {
      lines.push(geCopy("theory_parallel_lines_never_meet_5cd93e14"));
      lines.push(geCopy("theory_perpendicular_lines_form_a_right_angle_90_53e3a62d"));
      break;
    }

    case "triangles": {
      lines.push(geCopy("theory_equilateral_triangle_all_3_sides_are_equal_e304fd61"));
      lines.push(geCopy("theory_isosceles_triangle_2_equal_sides_10024900"));
      lines.push(geCopy("theory_scalene_triangle_all_sides_are_different_cacd039e"));
      break;
    }

    case "quadrilaterals": {
      lines.push(geCopy("theory_square_4_equal_sides_4_right_angles_3acc400e"));
      lines.push(geCopy("theory_rectangle_2_pairs_of_equal_sides_4_right_angles_563633d2"));
      lines.push(geCopy("theory_parallelogram_2_pairs_of_parallel_sides_1f85e384"));
      lines.push(geCopy("theory_trapezoid_one_pair_of_parallel_sides_70de947d"));
      break;
    }

    case "transformations": {
      lines.push(geCopy("theory_translation_copies_the_shape_in_the_same_direction_and_d_9e61939b"));
      lines.push(geCopy("theory_reflection_flips_the_shape_about_a_line_axis_922c58b8"));
      break;
    }

    case "rotation": {
      lines.push(geCopy("theory_rotation_moves_the_shape_around_a_point_3c96620b"));
      lines.push(geCopy("theory_a_90_degree_rotation_a_quarter_turn_180_a_half_turn_360__df879996"));
      break;
    }

    case "symmetry": {
      lines.push(geCopy("theory_symmetry_a_shape_that_has_an_axis_of_symmetry_e9e76e3e"));
      lines.push(geCopy("theory_square_4_axes_of_symmetry_rectangle_2_axes_of_symmetry_3e19e093"));
      break;
    }

    case "diagonal": {
      lines.push(geCopy("theory_diagonal_a_segment_connecting_two_vertices_not_on_the_sa_45c41a9b"));
      lines.push(geCopy("theory_square_diagonal_side_2_a3b41260"));
      lines.push(geCopy("theory_rectangle_diagonal_length_width_c051f46e"));
      lines.push(geCopy("theory_parallelogram_diagonal_side_1_side_2_4c4ab997"));
      break;
    }

    case "heights": {
      lines.push(geCopy("theory_height_the_distance_from_the_vertex_to_the_base_in_a_tri_952ce15b"));
      lines.push(geCopy("theory_triangle_area_base_height_2_so_the_height_area_2_base_dbd74805"));
      lines.push(geCopy("theory_parallelogram_area_base_height_so_the_height_area_base_78c61817"));
      lines.push(geCopy("theory_trapezoid_area_base_1_base_2_height_2_so_the_height_area_73d47104"));
      break;
    }

    case "tiling": {
      lines.push(geCopy("theory_tiling_covering_a_surface_with_no_gaps_47f35f70"));
      lines.push(geCopy("theory_square_90_degree_angle_equilateral_triangle_60_degree_an_97079d4c"));
      break;
    }

    case "circles": {
      lines.push(geCopy("theory_circle_all_points_at_an_equal_distance_from_the_center_f80ad1aa"));
      lines.push(geCopy("theory_circle_area_radius_c79d8faf"));
      lines.push(geCopy("theory_circle_circumference_2_radius_60e756d9"));
      break;
    }

    case "solids": {
      lines.push(geCopy("theory_cube_6_equal_square_faces_7064c2a8"));
      lines.push(geCopy("theory_rectangular_prism_6_rectangular_faces_4a65c9ad"));
      lines.push(geCopy("theory_cylinder_2_round_bases_28703847"));
      lines.push(geCopy("theory_sphere_all_points_at_an_equal_distance_from_the_center_5a53e8b8"));
      break;
    }

    default: {
      lines.push(geCopy("theory_it_is_important_to_remember_the_formula_that_fits_the_to_9b25499e"));
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
      { className: "list-disc ps-4 text-[11px] space-y-0.5 text-start" },
      lines.map((line, idx) => React.createElement("li", { key: idx }, line))
    )
  );
}

