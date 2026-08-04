/**
 * Open-answer line for printable math cards.
 */

import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";

export default function WorksheetMathAnswerLine() {
  const ui = useWorksheetUi();
  return (
    <div className="worksheet-math-answer-line" dir="ltr">
      <span className="worksheet-math-answer-line-label">{ui.answerLineLabel}</span>
      <span className="worksheet-math-answer-line-blank" aria-hidden="true" />
    </div>
  );
}
