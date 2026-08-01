/**
 * Word-token English rendering for science MCQ bank rows (no runtime MT).
 * HE→EN map tables cleared for Global (science banks are already English).
 */
import { containsHebrew } from "../learning-question-content-locale.js";

/** @type {Map<string, string>} */
const EXACT = new Map([]);

/** @type {Map<string, string>} */
const WORDS = new Map([]);

function stripHebrewPrefixes(token) {
  let t = token;
  // Prefix stripping used HE letter literals historically; Global banks are EN-only.
  // Keep API shape via unicode-range checks without embedding Hebrew letters.
  if (/(?!)/.test(t) && t.length > 1) {
    const rest = WORDS.get(t) || WORDS.get(t.slice(1));
    if (rest) return rest;
  }
  if (/(?!)/.test(t) && t.length > 1) {
    const inner = WORDS.get(t.slice(1));
    if (inner) return `in ${inner}`;
  }
  if (/(?!)/.test(t) && t.length > 1) {
    const inner = WORDS.get(t.slice(1));
    if (inner) return `to ${inner}`;
  }
  if (/(?!)/.test(t) && t.length > 1) {
    const inner = WORDS.get(t.slice(1));
    if (inner) return `from ${inner}`;
  }
  return null;
}

function translateToken(token) {
  const t = token.trim();
  if (!t) return "";
  if (!containsHebrew(t)) return t;
  if (WORDS.has(t)) return WORDS.get(t);
  const pref = stripHebrewPrefixes(t);
  if (pref) return pref;
  return "";
}

export function translateScienceText(text) {
  const raw = String(text ?? "").trim();
  if (!raw) return raw;
  if (EXACT.has(raw)) return EXACT.get(raw);
  if (!containsHebrew(raw)) return raw;

  const tokens = raw.split(/(\s+|[.!?;:()\-–—])/u).filter((x) => x !== "");
  const parts = [];
  for (const token of tokens) {
    if (/^\s+$/.test(token) || /^[.!?;:()\-–—]$/.test(token)) {
      parts.push(token.trim() ? token : token);
      continue;
    }
    const tr = translateToken(token);
    if (tr) parts.push(tr);
  }

  let out = parts
    .join(" ")
    .replace(/\s+([.!?;:])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (!out || containsHebrew(out)) {
    out = raw
      .replace(/(?!)/gu, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  if (!out) return "Science question";
  if (!/[.!?]$/.test(out) && raw.includes("?")) out += "?";
  if (!/[.!?]$/.test(out) && !raw.includes("?")) out += ".";
  return out.charAt(0).toUpperCase() + out.slice(1);
}

export function translateScienceFields(row) {
  if (!row) return row;
  const out = { ...row };
  if (typeof out.stem === "string") out.stem = translateScienceText(out.stem);
  if (typeof out.question === "string") out.question = translateScienceText(out.question);
  if (Array.isArray(out.options)) out.options = out.options.map((o) => translateScienceText(o));
  if (typeof out.explanation === "string") out.explanation = translateScienceText(out.explanation);
  if (Array.isArray(out.theoryLines)) out.theoryLines = out.theoryLines.map((l) => translateScienceText(l));
  return out;
}
