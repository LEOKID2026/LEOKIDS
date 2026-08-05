/**
 * Screen-only worksheet info card — wide preview header, not print layout.
 */

import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";

/**
 * @param {{
 *   title?: string,
 *   meta: {
 *     subject: string,
 *     grade: string,
 *     topic: string,
 *     level: string,
 *   },
 *   variant?: "worksheet" || "answer-key",
 * }} props
 */
export default function WorksheetScreenHeader({
  title,
  meta,
  variant = "worksheet",
}) {
  const ui = useWorksheetUi();
  const resolvedTitle = title || ui.documentTitle;
  const showFields = variant === "worksheet";

  return (
    <header className="worksheet-screen-info-card">
      <div className="worksheet-screen-brand" dir="ltr" lang="en">
        <span className="worksheet-screen-brand-name">LEO KIDS</span>
        <img
          src="/images/coin.png"
          alt=""
          width={64}
          height={64}
          className="worksheet-screen-brand-logo"
        />
      </div>
      <h1 className="worksheet-screen-title">{resolvedTitle}</h1>
      <p className="worksheet-screen-meta">
        {meta.subject} · {meta.grade} · {meta.topic} · {meta.level}
      </p>
      {showFields ? (
        <div className="worksheet-screen-fields">
          <div className="worksheet-screen-field-row">
            <span className="worksheet-screen-field-label">{ui.nameField}:</span>
            <span className="worksheet-screen-field-line" aria-hidden="true" />
          </div>
          <div className="worksheet-screen-field-row">
            <span className="worksheet-screen-field-label">{ui.dateField}:</span>
            <span className="worksheet-screen-field-line" aria-hidden="true" />
          </div>
        </div>
      ) : null}
    </header>
  );
}
