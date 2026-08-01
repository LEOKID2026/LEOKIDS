/**
 * Targeted spoken-script pronunciation corrections (niqqud) for learning book TTS.
 * Applied only in spokenScript — never in visible book markdown.
 *
 * Extend LEARNING_BOOK_PRONUNCIATION_ENTRIES after manual listening QA.
 */

/**
 * @typedef {{ id: string, spoken: string, nikud: string }} LearningBookPronunciationEntry
 * @typedef {{ id: string, spoken: string, nikud: string, count: number }} LearningBookPronunciationReplacement
 */

/** @type {readonly LearningBookPronunciationEntry[]} */
export const LEARNING_BOOK_PRONUNCIATION_ENTRIES = Object.freeze([
  { id: "alef_bet_maqaf", spoken: "", nikud: "" },
  { id: "alef_bet_hyphen", spoken: "", nikud: "" },
  { id: "alef_bet_space", spoken: "", nikud: "" },
  { id: "shimu", spoken: "", nikud: "" },
  { id: "shmu", spoken: "", nikud: "" },
  { id: "otiyot", spoken: "", nikud: "" },
  { id: "targilim", spoken: "", nikud: "" },
  { id: "misparim", spoken: "", nikud: "" },
  { id: "mispar", spoken: "", nikud: "" },
  { id: "targil", spoken: "", nikud: "" },
  { id: "chibur", spoken: "", nikud: "" },
  { id: "chisur", spoken: "", nikud: "" },
  { id: "kita", spoken: "", nikud: "" },
  { id: "shalom", spoken: "", nikud: "" },
  { id: "ot", spoken: "", nikud: "" },
  { id: "sefer", spoken: "", nikud: "" },
  { id: "shama", spoken: "", nikud: "" },
  { id: "shaveh", spoken: "", nikud: "" },
  { id: "veod", spoken: "", nikud: "" },
  { id: "pachot", spoken: "", nikud: "" }]);

/** Longest phrases first so shorter entries do not break longer ones (e.g.  inside ). */
const SORTED_ENTRIES = [...LEARNING_BOOK_PRONUNCIATION_ENTRIES].sort(
  (a, b) => b.spoken.length - a.spoken.length
);

/**
 * @param {string} value
 * @returns {string}
 */
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * @param {string} spoken
 * @returns {RegExp}
 */
function buildSpokenRegex(spoken) {
  const escaped = escapeRegex(spoken);
  if (/(?!)/.test(spoken)) {
    return new RegExp(escaped, "gu");
  }
  return new RegExp(`(?<![\-\])${escaped}(?![\-\])`, "gu");
}

/**
 * @param {string} text
 * @returns {{ text: string, pronunciationReplacementsApplied: LearningBookPronunciationReplacement[] }}
 */
export function applyLearningBookPronunciationCorrections(text) {
  let out = String(text || "");
  /** @type {LearningBookPronunciationReplacement[]} */
  const pronunciationReplacementsApplied = [];

  for (const entry of SORTED_ENTRIES) {
    const re = buildSpokenRegex(entry.spoken);
    let count = 0;
    out = out.replace(re, () => {
      count += 1;
      return entry.nikud;
    });
    if (count > 0) {
      pronunciationReplacementsApplied.push({
        id: entry.id,
        spoken: entry.spoken,
        nikud: entry.nikud,
        count,
      });
    }
  }

  return { text: out, pronunciationReplacementsApplied };
}
