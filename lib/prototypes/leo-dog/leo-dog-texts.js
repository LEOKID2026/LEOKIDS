/** @typedef {import('./leo-dog-state.js').LeoDogMood} LeoDogMood */

/** @type {Record<LeoDogMood, string[]>} */
const MOOD_LINES = {
  happy: [
    "the! to See.",
    "to to with!",
    "! to All time.",
  ],
  superHappy: [
    "to! the to!",
    "! to the!",
    "to in each - to wind Great!",
  ],
  hungry: ["to There are to All.", "to to Hint - to?", "to."],
  dirty: ["to needed to.", "There are to All to - to!", "to to clean."],
  tired: ["to - to.", "to... to Short?", "- time to."],
  missing: ["to to.", "to -!", "! to All time."],
  veryDirtyAndMissing: [
    "to to - needed to!",
    "to!.",
    "to to with to All - to!",
  ],
};

export const ACTION_LINES = {
  feed: "to All!",
  bathProgress: "to to...",
  bathAfter: "to clean!",
  play: "to!",
  pet: "to!",
  restStart: "to...",
  sleeping: "... to There are.",
  wake: "to There are to!",
  touchHead: "... to!",
  touchNose: "'! !",
  touchBelly: "!  !",
  touchPaw: "!  !",
  touchBody: "to.",
};

/** @param {LeoDogMood} mood */
export function pickMoodLine(mood) {
  const lines = MOOD_LINES[mood] ?? MOOD_LINES.happy;
  return lines[Math.floor(Math.random() * lines.length)];
}
