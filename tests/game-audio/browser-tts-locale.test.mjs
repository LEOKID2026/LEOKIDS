/**
 * Browser TTS defaults for Global voice playback.
 * Run: node --test tests/game-audio/browser-tts-locale.test.mjs
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { GAME_AUDIO_MANIFEST_BY_ID } from "../../lib/game-audio/game-audio-manifest.js";

test("voice assets use browser TTS only", () => {
  for (const assetId of ["voice-edu-instruction", "voice-edu-feedback", "voice-game-help", "voice-question-english-phonics"]) {
    const entry = GAME_AUDIO_MANIFEST_BY_ID[assetId];
    assert.ok(entry, assetId);
    assert.equal(entry.voiceEngine, "browser-tts");
    assert.equal(entry.path, null);
  }
  assert.equal(GAME_AUDIO_MANIFEST_BY_ID["voice-question-hebrew"], undefined);
});

test("game audio manager has no hebrew stream ensure import", async () => {
  const src = await import("node:fs/promises").then((fs) =>
    fs.readFile("lib/game-audio/game-audio-manager.js", "utf8"),
  );
  assert.doesNotMatch(src, /hebrew-audio-ensure|hebrewGenStreamUrl|pickHebrewTtsVoice|sanitizeHebrewSpeechText/);
});
