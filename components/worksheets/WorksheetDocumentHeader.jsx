/**
 * Printable worksheet document header — centered branding + meta + name/date.
 */

import { useWorksheetUi, WORKSHEET_PRINT_DOC_ATTRS } from "../../hooks/useWorksheetUi.js";

/**
 * @param {{
 *   titleHe?: string,
 *   meta: {
 *     subjectHe: string,
 *     gradeHe: string,
 *     topicHe: string,
 *     levelHe: string,
 *   },
 *   variant?: "worksheet" | "answer-key",
 * }} props
 */
export default function WorksheetDocumentHeader({
  titleHe,
  meta,
  variant = "worksheet",
}) {
  const ui = useWorksheetUi();
  const title = titleHe || ui.documentTitle;
  const showFields = variant === "worksheet";

  return (
    <header className="worksheet-header worksheet-header-centered" {...WORKSHEET_PRINT_DOC_ATTRS}>
      <div className="worksheet-header-top">
        <div className="worksheet-brand-center">
          <img
            src="/images/coin.png"
            alt="LEO KIDS"
            width={56}
            height={56}
            className="worksheet-brand-logo"
          />
          <span className="worksheet-brand-name">LEO KIDS</span>
        </div>
        <h1 className="worksheet-title">{title}</h1>
      </div>
      <p className="worksheet-meta">
        {meta.subjectHe} · {meta.gradeHe} · {meta.topicHe} · {meta.levelHe}
      </p>
      {showFields ? (
        <div className="worksheet-fields worksheet-fields-centered">
          <div className="worksheet-field-row">
            <span className="worksheet-field-label">{ui.nameField}:</span>
            <span className="worksheet-field-line" aria-hidden="true" />
          </div>
          <div className="worksheet-field-row">
            <span className="worksheet-field-label">{ui.dateField}:</span>
            <span className="worksheet-field-line" aria-hidden="true" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
