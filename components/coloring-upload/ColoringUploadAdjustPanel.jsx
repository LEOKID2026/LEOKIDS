import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";

/**
 * @param {{
 *   preset: string,
 *   onPresetChange: (p: string) => void,
 *   adjust: Record<string, number>,
 *   onAdjustChange: (patch: Record<string, number>) => void,
 *   onReprocess?: () => void,
 *   reprocessBusy?: boolean,
 * }} props
 */
export default function ColoringUploadAdjustPanel({
  preset,
  onPresetChange,
  adjust,
  onAdjustChange,
  onReprocess,
  reprocessBusy,
}) {
  const ui = useWorksheetUi();
  return (
    <div className="coloring-upload-adjust">
      <fieldset className="coloring-upload-presets">
        <legend>{ui.coloringUploadPresetLegend}</legend>
        {[
          ["simple", ui.coloringUploadPresetSimple],
          ["balanced", ui.coloringUploadPresetBalanced],
          ["detailed", ui.coloringUploadPresetDetailed],
        ].map(([id, label]) => (
          <label key={id} className="coloring-upload-preset-option">
            <input
              type="radio"
              name="coloring-preset"
              value={id}
              checked={preset === id}
              onChange={() => onPresetChange(id)}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <div className="coloring-upload-sliders">
        {[
          ["lineThickness", ui.coloringUploadAdjustThickness, -2, 2],
          ["detailLevel", ui.coloringUploadAdjustDetail, 0, 5],
          ["bgClean", ui.coloringUploadAdjustBg, 0, 3],
          ["brightness", ui.coloringUploadAdjustBrightness, -5, 5],
          ["contrast", ui.coloringUploadAdjustContrast, -5, 5],
        ].map(([key, label, min, max]) => (
          <label key={key} className="coloring-upload-slider-row">
            <span>{label}</span>
            <input
              type="range"
              min={min}
              max={max}
              value={adjust[key] ?? 0}
              onChange={(e) => onAdjustChange({ [key]: Number(e.target.value) })}
            />
          </label>
        ))}
      </div>

      {onReprocess ? (
        <button type="button" className="worksheet-secondary-cta" disabled={reprocessBusy} onClick={onReprocess}>
          {ui.coloringUploadReprocess}
        </button>
      ) : null}
    </div>
  );
}
