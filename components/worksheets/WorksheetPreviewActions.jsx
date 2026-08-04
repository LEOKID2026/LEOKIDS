/**
 * Action bar for worksheet preview — print, refresh, back, optional answer key.
 */

import Link from "next/link";
import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/**
 * @param {{
 *   includeAnswers: boolean,
 *   onPrint: () => void,
 *   onAnswerKey?: () => void,
 *   answerKeyLoading?: boolean,
 *   onRefresh?: () => void,
 *   refreshLoading?: boolean,
 *   backHref?: string,
 *   onClose?: () => void,
 * }} props
 */
export default function WorksheetPreviewActions({
  includeAnswers,
  onPrint,
  onAnswerKey,
  answerKeyLoading = false,
  onRefresh,
  refreshLoading = false,
  backHref = "/parent/worksheets",
  onClose,
}) {
  const ui = useWorksheetUi();
  const t = useT();
  const pdfLabel = t("worksheets.downloadPdf");
  return (
    <div className="worksheet-preview-actions no-print">
      <button
        type="button"
        onClick={onPrint}
        className="worksheet-action-btn worksheet-action-btn-primary"
      >
        {ui.print}
      </button>

      {onRefresh ? (
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshLoading || answerKeyLoading}
          className="worksheet-action-btn worksheet-action-btn-secondary"
        >
          {refreshLoading ? ui.refreshingQuestions : ui.refreshQuestions}
        </button>
      ) : null}

      {includeAnswers && onAnswerKey ? (
        <button
          type="button"
          onClick={onAnswerKey}
          disabled={answerKeyLoading || refreshLoading}
          className="worksheet-action-btn worksheet-action-btn-secondary"
        >
          {answerKeyLoading ? ui.loading : ui.answerKey}
        </button>
      ) : null}

      <button
        type="button"
        onClick={onPrint}
        className="worksheet-action-btn worksheet-action-btn-ghost"
        data-testid="worksheet-preview-pdf"
        aria-label={pdfLabel}
        title={pdfLabel}
      >
        {pdfLabel}
      </button>

      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="worksheet-action-btn worksheet-action-btn-ghost"
        >
          {ui.coloringModalClose}
        </button>
      ) : (
        <Link href={backHref} className="worksheet-action-btn worksheet-action-btn-ghost">
          {ui.back}
        </Link>
      )}
    </div>
  );
}
