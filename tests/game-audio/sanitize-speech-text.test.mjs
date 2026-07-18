import { test } from "node:test";
import assert from "node:assert/strict";
import { sanitizeSpeechText } from "../../lib/game-audio/sanitize-speech-text.js";

test("sanitizeSpeechText strips emoji and normalizes punctuation", () => {
  assert.equal(sanitizeSpeechText("Build the word: water 🌊"), "Build the word: water");
  assert.equal(sanitizeSpeechText("3 cookies · 2 per tray"), "3 cookies, 2 per tray");
  assert.equal(sanitizeSpeechText("Sort each item into the right bin - keep the environment clean!"), "Sort each item into the right bin - keep the environment clean!");
});
