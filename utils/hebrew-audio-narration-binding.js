/**
 * Static narration binding for question content (first-pass) — deterministic hash of full text.
 * Shared by client (attach) and server (api/hebrew-audio-ensure).
 * Global product: English narration scaffolding (no Hebrew user-facing copy).
 */

import { sha256 } from "js-sha256";

/** @param {string} s @param {number} max */
function clip(s, max) {
  const t = String(s || "")
    .replace(/\s+/g, " ")
    .trim();
  if (t.length <= max) return t;
  return t.slice(0, max).trim();
}

/**
 * Same normalization on client and server before hashing.
 * @param {string} plaintext
 */
export function normalizeNarrationForHash(plaintext) {
  return String(plaintext || "")
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 16 hex chars — file/stream key (ensure + /api/hebrew-audio-stream).
 * @param {string} plaintext
 */
export function narrationContentHash16(plaintext) {
  return sha256(normalizeNarrationForHash(plaintext)).slice(0, 16);
}

/**
 * Full narration text: topic + prompt + question body + options + closing.
 * `gradeKey` remains for callers and is not included in the text.
 * @param {{
 *   gradeKey: string,
 *   topic: string,
 *   task_mode: string,
 *   qText: string,
 *   answers?: string[],
 * }} p
 */
export function buildFirstPassNarrationPlaintext(p) {
  const body = clip(p.qText, 1500);
  const ansLine = Array.isArray(p.answers)
    ? clip(
        p.answers
          .map((a) => String(a).trim())
          .filter(Boolean)
          .join(" · "),
        500
      )
    : "";
  const topicLabel = p.topic === "reading" ? "Reading" : "Reading comprehension";
  const ansPart = ansLine ? ` Options: ${ansLine}.` : "";
  const afterTopic = "Listen to the question and answer based on what you hear.";
  const lead = `${topicLabel}. ${afterTopic} Question: `;
  if (p.task_mode === "oral_comprehension_mcq") {
    return `${lead}${body}.${ansPart} Choose the correct answer based on what you heard.`;
  }
  if (p.task_mode === "phonological_discrimination_he") {
    const phonLead = `${topicLabel}. Listen to the word sound; answer based on what you heard. Question: `;
    return `${phonLead}${body}.${ansPart} Choose the matching option based on what you heard.`;
  }
  return `${lead}${body}.${ansPart} Choose the correct answer.`;
}
