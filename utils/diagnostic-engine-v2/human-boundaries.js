/**
 *    — stage1 §16:    .
 */
const FORBIDDEN_SUBSTRINGS = [
  "",
  "ADHD",
  "ADD",
  "",
  "",
  "",
  "",
  "",
  "",
  "dyslexia",
  "learning disability",
  "autism",
  "attention disorder",
  "you are smart",
  "you are not smart",
  "clinical test"];

/**
 * @param {string} text
 * @returns {{ safe: string, stripped: boolean, matched?: string }}
 */
export function sanitizePedagogicLine(text) {
  const t = String(text || "").trim();
  if (!t) return { safe: "", stripped: false };
  for (const f of FORBIDDEN_SUBSTRINGS) {
    if (t.includes(f)) return { safe: "", stripped: true, matched: f };
  }
  return { safe: t, stripped: false };
}
