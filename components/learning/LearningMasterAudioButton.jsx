import { useState } from "react";
import { useGameAudioOptional } from "../../hooks/useGameAudio.js";
import GameAudioSettingsModal from "../game-audio/GameAudioSettingsModal.jsx";
import { useT } from "../../lib/i18n/I18nProvider.jsx";

/**
 * Learning master audio control — same placement/styling as before, opens full settings modal.
 */
export default function LearningMasterAudioButton({ audioOn, buttonClassOn, buttonClassOff }) {
  const audio = useGameAudioOptional();
  const [showPanel, setShowPanel] = useState(false);
  const t = useT();

  if (!audio) return null;

  const masterOn = audio.settings.masterEnabled;
  const btnClass = `${audioOn && masterOn ? buttonClassOn : buttonClassOff} !shadow-md ring-2 ring-white/80`;

  return (
    <>
      <button
        type="button"
        onClick={() => setShowPanel(true)}
        className={btnClass}
        aria-label={t("ui.audio.settings")}
        aria-expanded={showPanel}
        aria-haspopup="dialog"
        title={t("ui.audio.settings")}
      >
        {masterOn ? "🔊" : "🔇"}
      </button>
      <GameAudioSettingsModal
        open={showPanel}
        onClose={() => setShowPanel(false)}
        musicScope="learning-master"
      />
    </>
  );
}
