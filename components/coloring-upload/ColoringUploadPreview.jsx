import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";



/**

 * @param {{

 *   previewUrl: string,

 *   quotaRemaining: number | null,

 *   quotaLimit: number,

 *   fallbackNotice?: boolean,

 *   onPrint: () => void,

 *   onDownload: () => void,

 *   onRestart: () => void,

 *   busy?: boolean,

 * }} props

 */

export default function ColoringUploadPreview({

  previewUrl,

  quotaRemaining,

  quotaLimit,

  fallbackNotice,

  onPrint,

  onDownload,

  onRestart,

  busy,

}) {
  const ui = useWorksheetUi();

  return (

    <div className="coloring-upload-preview">

      <div className="coloring-upload-preview-frame">

        <img src={previewUrl} alt={ui.coloringUploadPreviewAlt} draggable={false} />

      </div>



      {fallbackNotice ? (

        <p className="coloring-upload-warning" role="status">

          {ui.coloringUploadFallbackNotice}

        </p>

      ) : null}



      {quotaRemaining != null ? (

        <p className="coloring-upload-quota" role="status">

          {ui.coloringUploadQuotaRemaining(quotaRemaining, quotaLimit)}

        </p>

      ) : null}



      <div className="coloring-upload-preview-actions">
        <button
          type="button"
          className="coloring-upload-btn coloring-upload-btn--print"
          disabled={busy}
          onClick={onPrint}
        >
          {ui.coloringUploadPrint}
        </button>

        <button
          type="button"
          className="coloring-upload-btn coloring-upload-btn--download"
          disabled={busy}
          onClick={onDownload}
        >
          {ui.coloringUploadDownload}
        </button>

        <button
          type="button"
          className="coloring-upload-btn coloring-upload-btn--restart"
          disabled={busy}
          onClick={onRestart}
        >
          {ui.coloringUploadRestart}
        </button>
      </div>

    </div>

  );

}

