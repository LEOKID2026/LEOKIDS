import { useEffect, useState } from "react";
import { useI18n } from "../../lib/i18n/I18nProvider.jsx";
import { useGameAudioOptional } from "../../hooks/useGameAudio.js";
import { getMastersBgmAssetId } from "../../lib/game-audio/game-bgm-map.js";
import {
  loadLearningMasterMusicEnabled,
  saveLearningMasterMusicEnabled,
} from "../../lib/game-audio/learning-master-music-settings.js";

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 py-1.5 text-sm">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-emerald-400"
      />
    </label>
  );
}

function VolumeRow({ label, value, onChange }) {
  return (
    <label className="block py-1.5 text-sm">
      <span className="mb-1 block">{label}</span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-400"
      />
    </label>
  );
}

/**
 * Full settings panel for in-game fullscreen overlays.
 */
export default function GameAudioSettingsPanel({ onClose, className = "", musicScope = "global" }) {
  const { direction, locale, t } = useI18n();
  const audio = useGameAudioOptional();
  const [open, setOpen] = useState(true);
  const isLearningMasterScope = musicScope === "learning-master";
  const [learningMasterMusicEnabled, setLearningMasterMusicEnabled] = useState(false);

  useEffect(() => {
    if (isLearningMasterScope) {
      setLearningMasterMusicEnabled(loadLearningMasterMusicEnabled());
    }
  }, [isLearningMasterScope, open]);

  if (!audio) return null;

  const s = audio.settings;
  const close = () => {
    setOpen(false);
    onClose?.();
  };

  if (!open) return null;

  return (
    <div
      className={`rounded-xl border border-white/15 bg-gray-900/95 p-4 text-white shadow-xl backdrop-blur ${className}`}
      dir={direction}
      lang={locale}
      role="dialog"
      aria-label={t("ui.audio.settings")}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold">{t("ui.audio.settings")}</h3>
        <button
          type="button"
          onClick={close}
          className="rounded-lg px-2 py-1 text-sm text-white/70 hover:bg-white/10"
          aria-label={t("ui.audio.close")}
        >
          ✕
        </button>
      </div>

      <ToggleRow
        label={t("ui.audio.allAudio")}
        checked={s.masterEnabled}
        onChange={(v) => audio.updateSettings({ masterEnabled: v })}
      />
      <ToggleRow
        label={t("ui.audio.effects")}
        checked={s.sfxEnabled}
        onChange={(v) => audio.updateSettings({ sfxEnabled: v })}
      />
      <ToggleRow
        label={t("ui.audio.music")}
        checked={isLearningMasterScope ? learningMasterMusicEnabled : s.musicEnabled}
        onChange={(v) => {
          if (isLearningMasterScope) {
            saveLearningMasterMusicEnabled(v);
            setLearningMasterMusicEnabled(v);
            if (v) {
              audio.playMusic(getMastersBgmAssetId(), { learningMasterScoped: true });
            } else {
              audio.stopMusic();
            }
            return;
          }
          audio.updateSettings({ musicEnabled: v });
          if (!v) audio.stopMusic();
        }}
      />
      <ToggleRow
        label={t("ui.audio.speech")}
        checked={s.voiceEnabled}
        onChange={(v) => {
          audio.updateSettings({ voiceEnabled: v });
          if (!v) audio.stopVoice();
        }}
      />

      <VolumeRow
        label={t("ui.audio.effectsVolume")}
        value={s.sfxVolume}
        onChange={(v) => audio.updateSettings({ sfxVolume: v })}
      />
      <VolumeRow
        label={t("ui.audio.musicVolume")}
        value={s.musicVolume}
        onChange={(v) => audio.updateSettings({ musicVolume: v })}
      />
      <VolumeRow
        label={t("ui.audio.speechVolume")}
        value={s.voiceVolume}
        onChange={(v) => audio.updateSettings({ voiceVolume: v })}
      />

      <ToggleRow
        label={t("ui.audio.autoPlayInstructions")}
        checked={s.autoPlayInstructions}
        onChange={(v) => audio.updateSettings({ autoPlayInstructions: v })}
      />
      <ToggleRow
        label={t("ui.audio.autoPlayQuestions")}
        checked={s.autoPlayQuestions}
        onChange={(v) => audio.updateSettings({ autoPlayQuestions: v })}
      />

      <button
        type="button"
        className="mt-3 w-full rounded-lg border border-white/20 py-2 text-sm hover:bg-white/10"
        onClick={() => {
          audio.resetSettings();
          if (isLearningMasterScope) {
            saveLearningMasterMusicEnabled(false);
            setLearningMasterMusicEnabled(false);
            audio.stopMusic();
          }
        }}
      >
        {t("ui.audio.resetDefaults")}
      </button>
    </div>
  );
}
