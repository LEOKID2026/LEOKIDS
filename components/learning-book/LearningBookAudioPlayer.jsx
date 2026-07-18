import { useCallback, useEffect, useMemo, useState } from "react";
import { isLearningBookAudioEnabledClient } from "../../lib/learning-book/audio/learning-book-audio-feature-flags";
import { prepareGlobalBookSectionSpeechText } from "../../lib/learning-book/audio/prepare-global-book-speech-text";
import { useBookGradeTheme } from "./BookGradeThemeContext";
import { useBookUiCopy } from "../../lib/learning-book/book-locale-context.jsx";
import { useGameAudioOptional } from "../../hooks/useGameAudio.js";
import { primeSpeechSynthesisVoices } from "../../utils/audio-playback-core.js";

/**
 * Section-level browser TTS player for learning books.
 *
 * @param {{
 *   subject: string,
 *   grade: string,
 *   pageId: string,
 *   sectionNumber: number,
 *   sectionIndex?: number,
 *   pageData?: { sections?: { number: number, title?: string, body: string }[] },
 * }} props
 */
export default function LearningBookAudioPlayer({
  subject,
  grade,
  pageId,
  sectionNumber,
  sectionIndex = 0,
  pageData = null,
}) {
  const { classes: theme } = useBookGradeTheme();
  const copy = useBookUiCopy();
  const audio = useGameAudioOptional();
  const enabled = isLearningBookAudioEnabledClient();
  const spokenText = useMemo(
    () => (pageData ? prepareGlobalBookSectionSpeechText(pageData, sectionNumber) : ""),
    [pageData, sectionNumber],
  );

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => primeSpeechSynthesisVoices(), []);

  useEffect(() => {
    setStatus("idle");
    setErrorMsg("");
    audio?.stopVoice?.();
  }, [spokenText, pageId, sectionNumber, audio]);

  const handlePlayPause = useCallback(async () => {
    if (!spokenText || status === "loading") return;

    if (status === "playing") {
      audio?.stopVoice?.();
      setStatus("idle");
      setErrorMsg("");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      if (audio) {
        await audio.playVoice("voice-edu-instruction", {
          text: spokenText,
          locale: "en-US",
          engine: "browser-tts",
        });
      } else if (typeof window !== "undefined" && window.speechSynthesis) {
        await new Promise((resolve, reject) => {
          const synth = window.speechSynthesis;
          const u = new SpeechSynthesisUtterance(spokenText);
          u.lang = "en-US";
          u.onend = () => resolve();
          u.onerror = (ev) => reject(new Error(ev.error || "tts_error"));
          synth.speak(u);
        });
      }
      setStatus("idle");
    } catch {
      setStatus("error");
      setErrorMsg(copy("shell", "audioError"));
    }
  }, [spokenText, status, audio, copy]);

  if (!enabled || !spokenText) return null;

  const isPlaying = status === "playing";
  const isLoading = status === "loading";
  const hasError = status === "error";

  const buttonLabel = isLoading
    ? copy("shell", "audioLoading")
    : isPlaying
      ? copy("shell", "audioStop")
      : copy("shell", "audioListen");

  return (
    <div className="mb-4 flex flex-col items-center gap-2" dir="ltr">
      <button
        type="button"
        onClick={() => void handlePlayPause()}
        disabled={isLoading}
        className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-bold shadow-sm transition disabled:cursor-wait disabled:opacity-100 ${theme.audioPlayerButton}`}
        aria-label={buttonLabel}
        title={buttonLabel}
      >
        <span aria-hidden="true">{isPlaying ? "⏸" : "🔊"}</span>
        <span>{buttonLabel}</span>
      </button>
      {hasError && errorMsg ? (
        <p className="text-center text-xs text-[color:var(--book-text-muted)]" role="status" aria-live="polite">
          {errorMsg}
        </p>
      ) : null}
      <span className="sr-only" aria-live="polite">
        {isLoading ? copy("shell", "audioLoading") : isPlaying ? copy("shell", "audioPlaying") : ""}
      </span>
    </div>
  );
}
