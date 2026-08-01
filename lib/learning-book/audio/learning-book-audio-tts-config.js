/**
 * Offline TTS generation settings for learning book section audio.
 * Global: English (en-US) voices only.
 */

/** @type {string} Edge TTS prosody rate — ~88% of default at -12% (target 85–90%). */
export const LEARNING_BOOK_AUDIO_TTS_RATE =
  String(process.env.LEARNING_BOOK_AUDIO_TTS_RATE || "-12%").trim() || "-12%";

export const LEARNING_BOOK_AUDIO_TTS_VOICE = "en-US-JennyNeural";
export const LEARNING_BOOK_AUDIO_TTS_LANG = "en-US";

/** English phonics — US child-friendly voice for Latin tokens. */
export const ENGLISH_BOOK_AUDIO_EN_VOICE =
  String(process.env.ENGLISH_BOOK_AUDIO_EN_VOICE || "en-US-JennyNeural").trim() ||
  "en-US-JennyNeural";

/** Narration voice for section framing (Global: same en-US family). */
export const ENGLISH_BOOK_AUDIO_NARRATION_VOICE =
  String(process.env.ENGLISH_BOOK_AUDIO_NARRATION_VOICE || process.env.ENGLISH_BOOK_AUDIO_HE_VOICE || "en-US-JennyNeural").trim() ||
  "en-US-JennyNeural";

/** @deprecated Use ENGLISH_BOOK_AUDIO_NARRATION_VOICE */
export const ENGLISH_BOOK_AUDIO_HE_VOICE = ENGLISH_BOOK_AUDIO_NARRATION_VOICE;

/**
 * @param {string} subject
 * @param {string} grade
 */
export function getLearningBookAudioTtsOptions(subject, grade) {
  const s = String(subject || "").trim().toLowerCase();
  const g = String(grade || "").trim().toLowerCase();
  const rate = LEARNING_BOOK_AUDIO_TTS_RATE;
  const timeout = s === "english" ? 180000 : 120000;

  if (s === "english" && (g === "g1" || g === "g2")) {
    return {
      voice: ENGLISH_BOOK_AUDIO_NARRATION_VOICE,
      lang: "en-US",
      rate,
      pitch: "default",
      volume: "default",
      timeout,
      proxy: process.env.HTTPS_PROXY || process.env.HTTP_PROXY || undefined,
    };
  }

  return {
    voice: LEARNING_BOOK_AUDIO_TTS_VOICE,
    lang: LEARNING_BOOK_AUDIO_TTS_LANG,
    rate,
    pitch: "default",
    volume: "default",
    timeout,
    proxy: process.env.HTTPS_PROXY || process.env.HTTP_PROXY || undefined,
  };
}
