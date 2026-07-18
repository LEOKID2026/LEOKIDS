/**
 * Stem playback — browser TTS (speechSynthesis) only for Global.
 */

const DEFAULT_SPEECH_LOCALE = "en-US";

/**
 * Load/wake the voices list in browsers (especially Chrome) before the user click — recommended in useEffect.
 * Does not speak audibly: empty speak + cancel, or getVoices after voiceschanged.
 */
export function primeSpeechSynthesisVoices() {
  if (typeof window === "undefined" || !window.speechSynthesis) return () => {};
  const synth = window.speechSynthesis;
  const kick = () => {
    try {
      void synth.getVoices();
    } catch {
      /* ignore */
    }
  };
  kick();
  synth.addEventListener("voiceschanged", kick);
  try {
    const warm = new SpeechSynthesisUtterance("\u00a0");
    warm.volume = 0;
    warm.rate = 10;
    synth.speak(warm);
    synth.cancel();
  } catch {
    /* ignore */
  }
  return () => synth.removeEventListener("voiceschanged", kick);
}

/**
 * @param {SpeechSynthesisVoice[]} voices
 * @param {string} [locale]
 * @returns {SpeechSynthesisVoice | null}
 */
function pickLocaleTtsVoice(voices, locale, hints = []) {
  if (!Array.isArray(voices) || !voices.length) return null;
  const want = String(locale || DEFAULT_SPEECH_LOCALE).toLowerCase();
  const base = want.split("-")[0] || "en";

  const score = (v) => {
    const lang = String(v.lang || "").toLowerCase();
    let s = 0;
    if (lang === want) s += 100;
    else if (lang.startsWith(`${base}-`)) s += 80;
    else if (lang === base) s += 70;
    else if (lang.startsWith(base)) s += 50;
    const name = `${v.name || ""} ${v.voiceURI || ""}`.toLowerCase();
    for (const hint of hints) {
      if (name.includes(String(hint).toLowerCase())) s += 25;
    }
    if (v.default && s > 0) s += 5;
    return s;
  };

  let best = null;
  let bestScore = 0;
  for (const v of voices) {
    const sc = score(v);
    if (sc > bestScore) {
      bestScore = sc;
      best = v;
    }
  }
  return bestScore > 0 ? best : null;
}

export function pickEnglishTtsVoice(voices, locale = DEFAULT_SPEECH_LOCALE) {
  return pickLocaleTtsVoice(voices, locale, [
    "english united states",
    "english (united states)",
    "us english",
    "jenny",
    "guy",
    "aria",
    "samantha",
  ]);
}

/**
 * @param {import("./audio-task-contract.js").AudioStem} stem
 * @param {{ onEnded?: () => void }} [opts]
 */
export function createStemPlaybackController(stem, opts = {}) {
  let replayCount = 0;

  function stopTts() {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        /* ignore */
      }
    }
  }

  function stopAll() {
    stopTts();
  }

  /**
   * @param {string} code
   * @param {string} message
   */
  function ttsErr(code, message) {
    const e = new Error(message);
    e.name = "AudioTtsError";
    /** @type {any} */ (e).code = code;
    return e;
  }

  /**
   * @param {{ locale?: string, text: string }} segment
   * @returns {Promise<void>}
   */
  function playTtsSegment(segment) {
    const text = String(segment?.text || "").trim();
    if (!text) return Promise.resolve();

    if (typeof window === "undefined" || !window.speechSynthesis) {
      return Promise.reject(
        ttsErr(
          "speech_synthesis_unavailable",
          "This browser does not support speech synthesis. Try another browser or device.",
        ),
      );
    }

    const locale = String(segment.locale || stem.locale || DEFAULT_SPEECH_LOCALE);
    const synth = window.speechSynthesis;

    return new Promise((resolve, reject) => {
      let settled = false;
      const doneOk = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      const doneErr = (code, message) => {
        if (settled) return;
        settled = true;
        reject(ttsErr(code, message));
      };

      const u = new SpeechSynthesisUtterance(text);
      u.lang = locale;
      u.rate = 0.9;
      u.volume = 1;
      u.pitch = 1;

      const voices = (() => {
        try {
          return synth.getVoices() || [];
        } catch {
          return [];
        }
      })();
      const picked = pickEnglishTtsVoice(voices, locale);
      if (picked) u.voice = picked;

      u.onend = () => doneOk();
      u.onerror = (ev) => {
        const code = ev.error || "unknown";
        doneErr(String(code), `TTS error: ${code}`);
      };

      try {
        synth.speak(u);
      } catch (err) {
        doneErr("speak_throw", err instanceof Error ? err.message : "Failed to start speech playback.");
      }
    });
  }

  /**
   * @param {{ locale?: string, text: string }[]} segments
   * @returns {Promise<void>}
   */
  async function playTtsSegments(segments) {
    for (const segment of segments) {
      await playTtsSegment(segment);
    }
    opts.onEnded?.();
  }

  function play() {
    stopAll();
    const segments = Array.isArray(stem.tts_segments) ? stem.tts_segments : null;
    if (stem.playback_kind === "tts" && segments && segments.length > 0) {
      return playTtsSegments(segments).catch((err) => {
        opts.onEnded?.();
        return Promise.reject(err);
      });
    }

    const text = stem.tts_text != null ? String(stem.tts_text).trim() : "";
    if (stem.playback_kind !== "tts" || !text) {
      return Promise.reject(
        ttsErr("tts_not_configured", "No text available for playback (TTS). Try refreshing the question."),
      );
    }

    if (typeof window === "undefined" || !window.speechSynthesis) {
      return Promise.reject(
        ttsErr(
          "speech_synthesis_unavailable",
          "This browser does not support speech synthesis. Try another browser or device.",
        ),
      );
    }

    const synth = window.speechSynthesis;
    const locale = stem.locale || DEFAULT_SPEECH_LOCALE;

    return new Promise((resolve, reject) => {
      let settled = false;
      let watchdogGeneration = 0;

      const voicesNow = () => {
        try {
          return synth.getVoices() || [];
        } catch {
          return [];
        }
      };

      const initialVoiceCount = voicesNow().length;

      const doneOk = () => {
        if (settled) return;
        settled = true;
        opts.onEnded?.();
        resolve();
      };
      const doneErr = (code, message) => {
        if (settled) return;
        settled = true;
        opts.onEnded?.();
        reject(ttsErr(code, message));
      };

      const runSpeak = () => {
        if (settled) return;
        const u = new SpeechSynthesisUtterance(text);
        u.lang = locale;
        u.rate = 0.9;
        u.volume = 1;
        u.pitch = 1;

        const voices = voicesNow();
        const picked = pickEnglishTtsVoice(voices, locale);
        if (picked) u.voice = picked;

        u.onend = () => doneOk();
        u.onerror = (ev) => {
          const code = ev.error || "unknown";
          const human =
            code === "not-allowed"
              ? "Playback was blocked (permissions / browser policy)."
              : code === "synthesis-failed"
                ? "Speech failed. Try again or check that a matching voice language pack is installed."
                : code === "canceled"
                  ? "Playback was canceled."
                  : `TTS error: ${code}`;
          doneErr(String(code), human);
        };

        try {
          synth.speak(u);
        } catch (err) {
          doneErr("speak_throw", err instanceof Error ? err.message : "Failed to start speech playback.");
          return;
        }

        const gen = ++watchdogGeneration;
        const watchdogMs = initialVoiceCount === 0 && voicesNow().length === 0 ? 5200 : 2800;
        window.setTimeout(() => {
          if (settled || gen !== watchdogGeneration) return;
          if (!synth.speaking && !synth.pending) {
            doneErr(
              "tts_no_activity",
              "No playback was detected. Make sure a matching language voice pack is installed, then try again.",
            );
          }
        }, watchdogMs);
      };

      runSpeak();
    });
  }

  function bumpReplay() {
    replayCount += 1;
    return replayCount;
  }

  function getReplayCount() {
    return replayCount;
  }

  function dispose() {
    stopAll();
  }

  return { play, bumpReplay, getReplayCount, dispose, stopAll };
}
