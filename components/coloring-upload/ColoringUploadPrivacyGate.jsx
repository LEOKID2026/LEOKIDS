import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";

/**
 * @param {{ onAccept: () => void }} props
 */
export default function ColoringUploadPrivacyGate({ onAccept }) {
  const ui = useWorksheetUi();
  return (
    <div className="coloring-upload-privacy" role="dialog" aria-labelledby="coloring-upload-privacy-title">
      <h3 id="coloring-upload-privacy-title" className="coloring-upload-privacy-title">
        {ui.coloringUploadPrivacyTitle}
      </h3>
      <p className="coloring-upload-privacy-body">{ui.coloringUploadPrivacyBody}</p>
      <p className="coloring-upload-tech-note">{ui.coloringUploadTechNote}</p>
      <button type="button" className="worksheet-primary-cta" onClick={onAccept}>
        {ui.coloringUploadPrivacyAccept}
      </button>
    </div>
  );
}
