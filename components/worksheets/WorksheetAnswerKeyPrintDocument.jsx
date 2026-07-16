/**
 * A4 answer key print document — hidden on screen, shown only when printing.
 */

import WorksheetDocumentHeader from "./WorksheetDocumentHeader.jsx";
import WorksheetAnswerKeyList from "./WorksheetAnswerKeyList.jsx";
import { useWorksheetUi, WORKSHEET_PRINT_DOC_ATTRS } from "../../hooks/useWorksheetUi.js";

/**
 * @param {{
 *   answerKeyPayload: import("../../lib/worksheets/worksheet-question-types.js").AnswerKeyPayload,
 * }} props
 */
export default function WorksheetAnswerKeyPrintDocument({ answerKeyPayload }) {
  const ui = useWorksheetUi();
  const { meta, answers } = answerKeyPayload;

  return (
    <div className="worksheet-print-document" aria-hidden="true">
      <article className="worksheet-root answer-key-root" {...WORKSHEET_PRINT_DOC_ATTRS}>
        <WorksheetDocumentHeader
          titleHe={ui.answerKeyTitle}
          meta={meta}
          variant="answer-key"
        />
        <WorksheetAnswerKeyList answers={answers} mode="print" />
      </article>
    </div>
  );
}
