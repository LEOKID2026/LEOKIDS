import { useState } from "react";
import dynamic from "next/dynamic";
import { useWorksheetUi } from "../../hooks/useWorksheetUi.js";
import CreateColoringWorksheetTab from "../coloring/CreateColoringWorksheetTab.jsx";
import { cleanupColoringUploadMemory } from "../../lib/coloring-upload/memory-manager.client.js";
import { terminatePipelineWorker } from "../../lib/coloring-upload/pipeline-client.client.js";

const ColoringUploadWizard = dynamic(() => import("./ColoringUploadWizard.jsx"), {
  ssr: false,
  loading: () => <p className="worksheet-muted">{ui.loading}</p>,
});

/**
 * @param {React.ComponentProps<typeof CreateColoringWorksheetTab>} cardsTabProps
 */
export default function ColoringTabShell(cardsTabProps) {
  const ui = useWorksheetUi();
  const [mode, setMode] = useState("cards");
  const T = cardsTabProps.T || {};

  const switchMode = (next) => {
    if (mode === "upload") {
      terminatePipelineWorker();
      cleanupColoringUploadMemory();
    }
    setMode(next);
  };

  const tabActive = T.tabActive || "worksheet-hub-tab--active";
  const tabIdle = T.tabIdle || "";

  return (
    <div className="coloring-tab-shell">
      <div className="worksheet-create-type-toggle coloring-tab-shell-toggle" role="tablist" aria-label="סוג דף צביעה">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "cards"}
          className={`worksheet-hub-tab ${mode === "cards" ? tabActive : tabIdle}`}
          onClick={() => switchMode("cards")}
        >
          {ui.coloringUploadModeCards}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "upload"}
          className={`worksheet-hub-tab ${mode === "upload" ? tabActive : tabIdle}`}
          onClick={() => switchMode("upload")}
        >
          {ui.coloringUploadModeUpload}
          <span className="coloring-upload-badge coloring-upload-badge--inline">
            {ui.coloringUploadBadge}
          </span>
        </button>
      </div>

      {mode === "cards" ? <CreateColoringWorksheetTab {...cardsTabProps} /> : null}
      {mode === "upload" ? (
        <ColoringUploadWizard />
      ) : null}
    </div>
  );
}
