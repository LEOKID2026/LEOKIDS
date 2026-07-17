/**
 * Learning book page audio — feature flags (enabled by default on global product).
 */

function envEnabled(name, defaultWhenUnset = true) {
  const raw = process.env[name];
  if (raw == null || String(raw).trim() === "") return defaultWhenUnset;
  const v = String(raw).trim().toLowerCase();
  if (v === "0" || v === "false" || v === "no" || v === "off") return false;
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

/**
 * Client-visible gate for the book audio player.
 * @returns {boolean}
 */
export function isLearningBookAudioEnabledClient() {
  return envEnabled("NEXT_PUBLIC_LEARNING_BOOK_AUDIO_ENABLED", true);
}

/**
 * Server/script gate for generation and server-side audio tooling.
 * @returns {boolean}
 */
export function isLearningBookAudioEnabledServer() {
  return envEnabled("LEARNING_BOOK_AUDIO_ENABLED", true);
}
