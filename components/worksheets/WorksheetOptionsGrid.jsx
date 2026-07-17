/**
 * MCQ options grid — Latin labels A/B/C/D for Global English product.
 */

import { EnglishLtrBlock } from "./renderers/EnglishLtrBlock.jsx";
import { MathFractionExpression } from "../learning/MathFractionExpression.jsx";
import WorksheetMathLtr from "./WorksheetMathLtr.jsx";
import { isWorksheetNumericOption } from "../../lib/worksheets/worksheet-math-ltr-display.js";
import { hasStackedFractionToken } from "../../utils/math-fraction-expression-parse.js";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

/**
 * @param {{
 *   optionsHe?: string[],
 *   optionsLatin?: boolean[],
 *   englishMode?: boolean,
 *   nikudMode?: boolean,
 *   layout?: "grid" | "stack",
 *   showHeading?: boolean,
 *   mathNumericOptions?: boolean,
 *   optionCaseMode?: "upper" | "lower" | null,
 * }} props
 */
export default function WorksheetOptionsGrid({
  optionsHe = [],
  optionsLatin,
  englishMode = false,
  nikudMode = false,
  layout = "grid",
  showHeading = true,
  mathNumericOptions = false,
  optionCaseMode = null,
}) {
  if (!optionsHe.length) return null;

  const listClass =
    layout === "stack"
      ? "worksheet-options worksheet-options-stack"
      : "worksheet-options worksheet-options-grid";

  return (
    <div className="worksheet-options-section" dir="ltr">
      {showHeading ? <p className="worksheet-options-heading">Options:</p> : null}
      <ol className={listClass}>
        {optionsHe.map((opt, i) => {
          const label = OPTION_LABELS[i] || String(i + 1);
          const optText = String(opt ?? "");
          const useEnglishLtr =
            englishMode && (optionsLatin?.[i] ?? /[A-Za-z]/.test(optText));
          const useFraction = !useEnglishLtr && hasStackedFractionToken(optText);
          const useMathLtr =
            !useEnglishLtr &&
            !useFraction &&
            (mathNumericOptions || isWorksheetNumericOption(optText));
          const caseClass =
            optionCaseMode === "upper"
              ? " worksheet-phonics-option is-upper"
              : optionCaseMode === "lower"
                ? " worksheet-phonics-option is-lower"
                : "";
          const optionTextClass = nikudMode
            ? `worksheet-option-text worksheet-hebrew-nikud${caseClass}`
            : `worksheet-option-text${caseClass}`;

          return (
            <li key={`${i}-${optText}`} className="worksheet-option-cell" dir="ltr">
              <span className="worksheet-option-label" aria-hidden="true">
                {label}.
              </span>
              <span className={optionTextClass}>
                {useEnglishLtr ? (
                  <EnglishLtrBlock>{optText}</EnglishLtrBlock>
                ) : useFraction ? (
                  <MathFractionExpression text={optText} />
                ) : useMathLtr ? (
                  <WorksheetMathLtr>{optText}</WorksheetMathLtr>
                ) : (
                  optText
                )}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
