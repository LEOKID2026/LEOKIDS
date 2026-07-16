/**
 * A4 print document — hidden on screen, shown only when printing.
 */

import WorksheetDocumentHeader from "./WorksheetDocumentHeader.jsx";
import WorksheetQuestionList from "./WorksheetQuestionList.jsx";
import { useWorksheetUi, WORKSHEET_PRINT_DOC_ATTRS } from "../../hooks/useWorksheetUi.js";

/**
 * @param {{
 *   worksheetPayload: import("../../lib/worksheets/worksheet-question-types.js").WorksheetPayload,
 * }} props
 */
export default function WorksheetPrintDocument({ worksheetPayload }) {
  const ui = useWorksheetUi();
  const { meta, questions } = worksheetPayload;
  const inkClass = meta.inkSave ? " ink-save" : "";

  return (
    <div className="worksheet-print-document">
      <article className={`worksheet-root${inkClass}`} {...WORKSHEET_PRINT_DOC_ATTRS}>
        <WorksheetDocumentHeader
          titleHe={ui.documentTitle}
          meta={meta}
          variant="worksheet"
        />
        <WorksheetQuestionList
          questions={questions}
          mode="print"
          subjectId={meta.subjectId}
        />
      </article>
    </div>
  );
}
