/**
 * Final parent-facing text normalization for English (Global) surfaces — pedagogy-only
 * clean-up: strips jargon, taxonomy codes, and any technical tokens that leaked into a
 * sentence. Does not change engine logic; display-only.
 * English sibling of parent-facing-normalize-he.js.
 */

import { humanizeTopicKey, PARENT_TOPIC_FALLBACK_EN } from "../diagnostic-labels.js";

/**
 * Replace internal executive-summary trend labels with parent-facing English.
 * @param {string|null|undefined} raw
 * @returns {string}
 */
export function normalizeExecutiveTrendLine(raw) {
  let s = String(raw ?? "").trim();
  if (!s) return "";
  if (/^first\s+trend\s+line/i.test(s)) return "First direction seen in practice";
  if (/^trend\s+line/i.test(s)) return "First direction this period";
  if (/^second\s+trend\s+line/i.test(s)) return "Another direction worth watching";
  return s;
}

/**
 * @param {unknown[]} lines
 * @returns {string[]}
 */
export function normalizeExecutiveTrendLines(lines) {
  return (Array.isArray(lines) ? lines : [])
    .map((line) => normalizeExecutiveTrendLine(String(line || "")))
    .filter(Boolean);
}

const BEHAVIOR_SNAKE_TOKENS = [
  "fragile_success_cluster",
  "stable_mastery",
  "fragile_success",
  "instruction_friction",
  "speed_pressure",
  "knowledge_gap",
  "careless_pattern",
  "undetermined",
  "mixed_low_signal",
  "none_sparse",
  "none_observed",
];

/**
 * @param {string|null|undefined} raw
 * @returns {string}
 */
export function normalizeParentFacingHe(raw) {
  let s = String(raw ?? "").trim();
  if (!s) return "";

  // Remove any leftover internal engine ids.
  for (const id of BEHAVIOR_SNAKE_TOKENS) {
    s = s.replace(new RegExp(`\\b${id}\\b`, "gi"), "");
  }

  // Taxonomy codes (M-02, H-10, MG-03 ...).
  s = s.replace(/\b(?:MG|[A-Z])-\d{2,}\b/g, "");

  // Any remaining raw snake_case identifier -> humanized words.
  s = s.replace(/\b[a-z]+(?:_[a-z0-9]+){1,}\b/g, (m) => {
    const rewritten = humanizeTopicKey(m);
    return rewritten && rewritten !== PARENT_TOPIC_FALLBACK_EN ? rewritten : m.replace(/_/g, " ");
  });

  s = s.replace(/::+/g, ":");
  s = s.replace(/\.{2,}/g, ".");
  s = s.replace(/([!?])\1+/g, "$1");
  s = s.replace(/\s*([:])\s*:/g, "$1");
  s = s.replace(/\s{2,}/g, " ").replace(/\s+([.,;:!?])/g, "$1").trim();
  return s;
}

/** Back-compat alias used by call sites migrated from the Hebrew module. */
export const normalizeParentFacing = normalizeParentFacingHe;

/**
 * Second pass over a subject letter object — catches text left after the first pass.
 * @param {Record<string, unknown>|null|undefined} letter
 */
export function normalizeSubjectParentLetterHe(letter) {
  if (!letter || typeof letter !== "object") return letter;
  const out = { ...letter };
  const keys = ["opening", "diagnosisHe", "homeAction", "closing", "goingWell", "fragile", "middle", "reliabilityNoteHe"];
  for (const k of keys) {
    if (typeof out[k] === "string" && out[k]) out[k] = normalizeParentFacingHe(out[k]);
  }
  return out;
}

/**
 * Pass over a topic recommendation object — every string field whose name ends in "He".
 * @param {Record<string, unknown>} rec
 * @returns {Record<string, unknown>}
 */
export function glossTopicRecommendationHeFields(rec) {
  if (!rec || typeof rec !== "object") return rec;
  const out = { ...rec };
  for (const [k, v] of Object.entries(out)) {
    if (!/He$/.test(k)) continue;
    if (typeof v === "string" && v) {
      out[k] = normalizeParentFacingHe(v);
    } else if (Array.isArray(v)) {
      out[k] = v.map((item) => (typeof item === "string" ? normalizeParentFacingHe(item) : item));
    }
  }
  return out;
}
