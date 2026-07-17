/**
 * Wide on-site worksheet preview — visible on screen only.
 */

import WorksheetScreenHeader from "./WorksheetScreenHeader.jsx";
import WorksheetQuestionList from "./WorksheetQuestionList.jsx";
import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";

/**
 * @param {{
 *   worksheetPayload: import("../../lib/worksheets/worksheet-question-types.js").WorksheetPayload,
 * }} props
 */
export default function WorksheetScreenPreview({ worksheetPayload }) {
  const ui = useWorksheetUi();
  const { meta, questions } = worksheetPayload;

  return (
    <div
      className="worksheet-screen-preview"
      aria-label={ui.previewTitle}
      dir="ltr"
      lang="en"
    >
      <WorksheetScreenHeader titleHe={ui.documentTitle} meta={meta} variant="worksheet" />
      <WorksheetQuestionList questions={questions} mode="screen" subjectId={meta.subjectId} />
    </div>
  );
}
