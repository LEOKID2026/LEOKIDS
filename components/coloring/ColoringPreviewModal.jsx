/**
 * In-page modal for coloring worksheet preview + print (no route navigation).
 */
import { useCallback, useEffect } from "react";
import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";
import ColoringScreenPreview from "./ColoringScreenPreview.jsx";
import ColoringPrintDocument from "./ColoringPrintDocument.jsx";

/**
 * @param {{
 *   worksheetPayload: import("../../lib/coloring/coloring-worksheet-types.js").ColoringWorksheetPayload | null,
 *   onClose: () => void,
 *   T: Record<string, string>,
 * }} props
 */
export default function ColoringPreviewModal({ worksheetPayload, onClose, T }) {
  const ui = useWorksheetUi();
  const title = worksheetPayload?.displayNameHe || ui.coloringDocumentTitle;

  useEffect(() => {
    if (!worksheetPayload) return undefined;
    document.body.classList.add("worksheet-print-mode");
    document.body.classList.add("worksheet-coloring-print-mode");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.classList.remove("worksheet-print-mode");
      document.body.classList.remove("worksheet-coloring-print-mode");
      document.body.style.overflow = prevOverflow;
    };
  }, [worksheetPayload]);

  useEffect(() => {
    if (!worksheetPayload) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [worksheetPayload, onClose]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  if (!worksheetPayload) return null;

  return (
    <>
      <div
        className="coloring-preview-modal-backdrop"
        role="presentation"
        onClick={onClose}
      >
        <div
          className="coloring-preview-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="coloring-preview-modal-title"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="coloring-preview-modal-toolbar">
            <h2 id="coloring-preview-modal-title" className={`coloring-preview-modal-title ${T.heading}`}>
              {title}
            </h2>
            <div className="coloring-preview-modal-actions">
              <button
                type="button"
                className="worksheet-action-btn worksheet-action-btn-primary"
                onClick={handlePrint}
              >
                {ui.print}
              </button>
              <button
                type="button"
                className="worksheet-action-btn worksheet-action-btn-ghost"
                onClick={onClose}
              >
                {ui.coloringModalClose}
              </button>
            </div>
          </div>
          <ColoringScreenPreview worksheetPayload={worksheetPayload} />
        </div>
      </div>
      <ColoringPrintDocument worksheetPayload={worksheetPayload} />
    </>
  );
}
