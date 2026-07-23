/**
 * Modal for locked writing catalog cards — public hub CTA.
 */

import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";

/**
 * @param {{
 *   item: Record<string, unknown> | null,
 *   onClose: () => void,
 *   T: Record<string, string>,
 * }} props
 */
export default function WritingLockedModal({ item, onClose, T }) {
  const ui = useWorksheetUi();
  if (!item) return null;

  return (
    <div
      className="worksheet-locked-modal-backdrop"
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        className={`worksheet-locked-modal ${T.panel}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="writing-locked-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="writing-locked-modal-title" className={`worksheet-locked-modal-title ${T.heading}`}>
          {ui.writingLockedTitle}
        </h3>
        <p className={`worksheet-locked-modal-text ${T.muted}`}>
          {ui.writingLockedText}
        </p>
        {item.titleHe ? (
          <p className={`worksheet-locked-modal-item ${T.subheading}`}>{String(item.titleHe)}</p>
        ) : null}
        {item.catalogNumber ? (
          <p className={`text-sm ${T.muted}`}>{String(item.catalogNumber)}</p>
        ) : null}
        <div className="worksheet-locked-modal-actions">
          <button type="button" className={T.primaryBtn} onClick={onClose}>
            {ui.writingLockedClose}
          </button>
        </div>
      </div>
    </div>
  );
}
