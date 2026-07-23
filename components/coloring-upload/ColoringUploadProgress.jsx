import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";

const PHASE_LABELS = {
  worker_started: ui.coloringUploadPhaseWorkerStarted,
  opencv_loading: ui.coloringUploadPhaseOpenCvLoading,
  opencv_ready: ui.coloringUploadPhaseOpenCvReady,
  segment: ui.coloringUploadPhaseSegment,
  "hf-lineart": ui.coloringUploadPhaseHfLineart,
  "style-transfer": ui.coloringUploadPhaseStyleTransfer,
  "hf-fallback": ui.coloringUploadPhaseHfFallback,
};

/**
 * @param {{ percent: number, phase?: string, busy?: boolean }} props
 */
export default function ColoringUploadProgress({ percent, phase, busy }) {
  const ui = useWorksheetUi();
  const phaseLabel = phase ? PHASE_LABELS[phase] || phase : "";

  return (
    <div className="coloring-upload-progress" aria-live="polite" aria-busy={busy || undefined}>
      <p className="coloring-upload-progress-label">{ui.coloringUploadProcessing}</p>
      {phaseLabel ? (
        <p className="coloring-upload-progress-phase" role="status">
          {phaseLabel}
        </p>
      ) : null}
      <div
        className="coloring-upload-progress-bar"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="coloring-upload-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="coloring-upload-progress-percent">{percent}%</p>
    </div>
  );
}
