/**
 * Wide on-site answer key preview — visible on screen only.
 */

import WorksheetScreenHeader from "./WorksheetScreenHeader.jsx";
import WorksheetAnswerKeyList from "./WorksheetAnswerKeyList.jsx";
import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";

/**
 * @param {{
 *   answerKeyPayload: import("../../lib/worksheets/worksheet-question-types.js").AnswerKeyPayload,
 * }} props
 */
export default function WorksheetAnswerKeyScreenPreview({ answerKeyPayload }) {
  const ui = useWorksheetUi();
  const { meta, answers } = answerKeyPayload;

  return (
    <div className="worksheet-screen-preview" aria-label={ui.answerKeyTitle} dir="ltr" lang="en">
      <WorksheetScreenHeader titleHe={ui.answerKeyTitle} meta={meta} variant="answer-key" />
      <WorksheetAnswerKeyList answers={answers} mode="screen" />
    </div>
  );
}
