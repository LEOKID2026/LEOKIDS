/**
 * Open-answer line for printable math cards.
 */

export default function WorksheetMathAnswerLine() {
  return (
    <div className="worksheet-math-answer-line" dir="ltr">
      <span className="worksheet-math-answer-line-label">Answer:</span>
      <span className="worksheet-math-answer-line-blank" aria-hidden="true" />
    </div>
  );
}
