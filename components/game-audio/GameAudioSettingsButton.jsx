import { useState } from "react";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import { useGameAudioOptional } from "../../hooks/useGameAudio.js";
import GameAudioSettingsModal from "./GameAudioSettingsModal.jsx";
import { GAME_AUDIO_SETTINGS_BUTTON_CLASS } from "./game-audio-settings-button-styles.js";

/**
 * Unified game audio control — opens full settings panel via body portal (not dropdown).
 */
export default function GameAudioSettingsButton({ className = "", buttonClassName = "" }) {
  const { t } = useI18n();
  const audio = useGameAudioOptional();
  const [showPanel, setShowPanel] = useState(false);

  if (!audio) return <span className={className} aria-hidden="true" />;

  const masterOn = audio.settings.masterEnabled;
  const btnClass = buttonClassName || GAME_AUDIO_SETTINGS_BUTTON_CLASS;
  const settingsLabel = t("ui.audio.settings");

  return (
    <>
      <div className={className}>
        <button
          type="button"
          onClick={() => setShowPanel(true)}
          className={btnClass}
          aria-label={settingsLabel}
          aria-expanded={showPanel}
          aria-haspopup="dialog"
          title={settingsLabel}
        >
          <span aria-hidden="true">{masterOn ? "🔊" : "🔇"}</span>
        </button>
      </div>
      <GameAudioSettingsModal open={showPanel} onClose={() => setShowPanel(false)} />
    </>
  );
}
