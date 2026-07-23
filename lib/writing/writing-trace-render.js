/**
 * Client helpers for writing trace rendering (English global).
 * @module lib/writing/writing-trace-render
 */

import { resolveWritingTraceAssetUrl } from "./writing-trace-asset-resolver.js";
import { isEnglishLetter } from "./writing-constants.js";

/**
 * @param {string} char
 * @param {"print" | "script"} scriptStyle
 * @returns {"en-upper" | "en-lower" | "digits" | null}
 */
export function glyphGroupForChar(char, scriptStyle) {
  const ch = String(char || "");
  if (/^\d$/.test(ch)) return "digits";
  if (/^[A-Z]$/.test(ch)) return "en-upper";
  if (/^[a-z]$/.test(ch)) return "en-lower";
  if (isEnglishLetter(ch)) {
    return ch === ch.toUpperCase() ? "en-upper" : "en-lower";
  }
  return null;
}

/**
 * @param {string} char
 * @param {"print" | "script"} scriptStyle
 * @returns {string | null}
 */
export function fullTraceAssetForChar(char, scriptStyle) {
  try {
    return resolveWritingTraceAssetUrl({
      scriptStyle,
      character: char,
      traceRenderMode: "full_trace",
    });
  } catch {
    return null;
  }
}

/**
 * Split word into trace segments (letter or space).
 * @param {string} text
 * @returns {Array<{ type: "space" | "char", value: string }>}
 */
export function wordTraceSegments(text) {
  /** @type {Array<{ type: "space" | "char", value: string }>} */
  const out = [];
  const chars = [...String(text || "")];
  for (const ch of chars) {
    if (/\s/.test(ch)) {
      out.push({ type: "space", value: ch });
    } else {
      out.push({ type: "char", value: ch });
    }
  }
  return out;
}

/**
 * Base letter for asset lookup.
 * @param {string} cluster
 */
export function baseLetterForAsset(cluster) {
  return String(cluster || "").charAt(0);
}
