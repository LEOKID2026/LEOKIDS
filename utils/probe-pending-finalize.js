import { globalBurnDownCopy } from "../lib/i18n/global-burn-down-copy.js";
/**
 * Subject-specific adjustments to pending probe hints (deterministic; no UI).
 * Keeps probe-map-he shared while routing geometry vs science vs math operation shapes.
 */

/** @param {string} s */
function low(s) {
  return String(s || "").trim().toLowerCase();
}

/**
 * @param {import("./mistake-event.js").MistakeEventV1} normalized
 */
function mathIsFractionContext(normalized) {
  const bucket = low(normalized.bucketKey || normalized.topicOrOperation);
  const pf = low(normalized.patternFamily);
  const kind = low(normalized.kind);
  return (
    bucket === "fractions" || pf.includes("fraction") || kind.startsWith("frac")
  );
}

/**
 * @param {import("./active-diagnostic-runtime/build-pending-probe.js").PendingDiagnosticProbe} pb
 * @param {import("./mistake-event.js").MistakeEventV1} normalized
 * @param {string} subjectId
 */
export function finalizePendingProbeHint(pb, normalized, subjectId) {
  if (!pb || typeof pb !== "object") return pb;
  const sid = String(subjectId || "").trim();
  const next = { ...pb };

  if (sid === "math" && next.dominantTag === "operation_confusion") {
    if (!mathIsFractionContext(normalized)) {
      next.suggestedQuestionType = "operation_choice_word_problem";
      next.reasonHe =
        "Explicitly choose an operation (add/multiply/subtract) in a short word problem before calculating.";
    }
  }

  if (sid === "geometry") {
    const dom = next.dominantTag ? String(next.dominantTag) : "";
    const routeByTag = {
      concept_confusion: {
        type: "geometry_concept_minimal_contrast",
        reasonHe:
          "Distinguish two closely related geometry concepts with a short question from the conceptual bank.",
      },
      geometry_calculation_slip: {
        type: "geometry_formula_choice",
        reasonHe: globalBurnDownCopy("utils__probe-pending-finalize", "choose_the_correct_formula_or_first_step_before_numerical_calculation"),
      },
      calculation_slip: {
        type: "geometry_formula_choice",
        reasonHe: globalBurnDownCopy("utils__probe-pending-finalize", "choose_the_correct_formula_or_first_step_before_numerical_calculation"),
      },
      strategy_error: {
        type: "geometry_identify_shape_property",
        reasonHe: globalBurnDownCopy("utils__probe-pending-finalize", "identify_one_clear_shape_property_or_state_before_calculating"),
      },
      prerequisite_gap: {
        type: "geometry_concept_minimal_contrast",
        reasonHe: globalBurnDownCopy("utils__probe-pending-finalize", "reinforce_a_foundational_concept_before_continuing"),
      },
      instruction_misread: {
        type: "geometry_identify_shape_property",
        reasonHe: "A short identification question after reading the instruction.",
      },
    };
    const row = routeByTag[dom];
    if (row) {
      next.suggestedQuestionType = row.type;
      next.reasonHe = row.reasonHe;
    }
  }

  return next;
}
