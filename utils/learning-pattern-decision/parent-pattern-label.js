/**
 * Parent-safe pattern labels - never expose raw engine ids or "unknown" to parents.
 */

import { TAXONOMY_BY_ID } from "../diagnostic-engine-v2/taxonomy-registry.js";
import { RULE_PRIMARY_PRODUCER } from "../../lib/learning/taxonomy-rule-primary-producers.js";
import {
  isTechnicalEnglishPatternKey,
  parentFacingErrorPatternLabel,
  resolveParentFacingPatternLabel} from "./parent-facing-error-pattern.js";

const BLOCKED_LABELS = new Set([
  "unknown",
  "unspecified",
  "unclassified",
  "none",
  "null",
  "undefined"]);

/** Parent-facing Hebrew for taxonomy patternHe values that must not leak English literals. */
const TAXONOMY_PARENT_PATTERN_BY_ID = Object.freeze({
  "E-02": "",
  "E-04": ""});

/** @type {Record<string, string>} literal patternHe / tag → parent Hebrew */
const RAW_PATTERN_LITERAL_PARENT_HE = Object.freeze({
  "past/present": TAXONOMY_PARENT_PATTERN_BY_ID["E-02"],
  "he/she/it": TAXONOMY_PARENT_PATTERN_BY_ID["E-04"]});

/** Legacy patternHe (pre parent-copy fix) → approved parent Hebrew. Unambiguous strings only. */
const LEGACY_PATTERN_HE_TO_PARENT_HE = Object.freeze({
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "  +  ": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "     0  1",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  " ÷2   ": "  -2       ",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": "",
  "": ""});

/**
 * Ambiguous legacy labels — remap only when taxonomy ID or subject is known.
 * Never remap by bare text alone.
 * @type {Record<string, { byId: Record<string, string>, bySubject: Record<string, string> }>}
 */
const AMBIGUOUS_LEGACY_PATTERN_HE = Object.freeze({
  "": Object.freeze({
    byId: Object.freeze({
      "S-08": "",
      "HI-08": ""}),
    bySubject: Object.freeze({
      science: "",
      history: ""})}),
  "": Object.freeze({
    byId: Object.freeze({
      "MG-06": "",
      "HI-03": ""}),
    bySubject: Object.freeze({
      geography: "",
      history: ""})}),
  "": Object.freeze({
    byId: Object.freeze({
      "MG-07": "",
      "HI-05": ""}),
    bySubject: Object.freeze({
      geography: "",
      history: ""})})});

/**
 * @param {string} raw
 * @param {{ taxonomyId?: string|null, subjectId?: string|null }} [ctx]
 * @returns {string|null}
 */
function resolveAmbiguousLegacyPatternHe(raw, ctx = {}) {
  const entry = AMBIGUOUS_LEGACY_PATTERN_HE[raw];
  if (!entry) return null;
  const id = String(ctx.taxonomyId || "").trim();
  if (id && entry.byId[id]) return entry.byId[id];
  const subject = String(ctx.subjectId || "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_");
  if (subject && entry.bySubject[subject]) return entry.bySubject[subject];
  return null;
}

/** @type {Map<string, string>} tag -> taxonomyId */
const TAG_TO_TAXONOMY_ID = (() => {
  /** @type {Map<string, string>} */
  const map = new Map();
  for (const [taxonomyId, producer] of Object.entries(RULE_PRIMARY_PRODUCER)) {
    const tag = String(producer?.tag || "").trim().toLowerCase();
    if (tag) map.set(tag, taxonomyId);
  }
  return map;
})();

/**
 * Labels that must never drive parent-facing repeated-pattern wording.
 * @param {string|null|undefined} label
 */
export function isBlockedParentPatternLabel(label) {
  const raw = String(label || "").trim();
  if (!raw) return false;
  const lower = raw.toLowerCase();
  if (BLOCKED_LABELS.has(lower)) return true;
  if (/^\(unknown\)$/i.test(raw)) return true;
  return false;
}

/**
 * @param {string|null|undefined} label
 * @param {{ taxonomyId?: string|null, subjectId?: string|null }} [ctx]
 */
export function isUsableParentPatternLabel(label, ctx = {}) {
  const resolved = resolveParentPatternLabelForDisplay(label, ctx);
  return !!resolved;
}

/**
 * Resolve any internal tag/key to approved Hebrew for parents.
 * Falls back to taxonomy patternHe when tag maps to a rule.
 * Ambiguous legacy Hebrew remaps only when taxonomyId or subjectId is provided.
 * @param {string|null|undefined} label
 * @param {{ taxonomyId?: string|null, subjectId?: string|null }} [ctx]
 * @returns {string}
 */
export function resolveParentPatternLabelForDisplay(label, ctx = {}) {
  const raw = String(label || "").trim();
  if (!raw || isBlockedParentPatternLabel(raw)) return "";

  if (/[^\s\S]/.test(raw)) {
    const ambiguous = resolveAmbiguousLegacyPatternHe(raw, ctx);
    if (ambiguous) return ambiguous;
    const legacy = LEGACY_PATTERN_HE_TO_PARENT_HE[raw];
    if (legacy) return legacy;
    return raw.replace(/\s+/g, "").trim();
  }

  const literalParent = RAW_PATTERN_LITERAL_PARENT_HE[raw.toLowerCase()];
  if (literalParent) return literalParent;

  const mapped = parentFacingErrorPatternLabel(raw);
  if (mapped) return mapped;

  const tagKey = raw.toLowerCase();
  const taxonomyId = String(ctx.taxonomyId || "").trim() || TAG_TO_TAXONOMY_ID.get(tagKey);
  if (taxonomyId && TAXONOMY_PARENT_PATTERN_BY_ID[taxonomyId]) {
    return TAXONOMY_PARENT_PATTERN_BY_ID[taxonomyId];
  }
  if (taxonomyId && TAXONOMY_BY_ID[taxonomyId]?.patternHe) {
    const patternHe = String(TAXONOMY_BY_ID[taxonomyId].patternHe).trim();
    const parentFromId = TAXONOMY_PARENT_PATTERN_BY_ID[taxonomyId];
    if (parentFromId) return parentFromId;
    if (/[^\s\S]/.test(patternHe)) return patternHe;
    const fromLiteral = RAW_PATTERN_LITERAL_PARENT_HE[patternHe.toLowerCase()];
    if (fromLiteral) return fromLiteral;
  }

  if (isTechnicalEnglishPatternKey(raw)) return "";
  return raw;
}

/**
 * @param {string|null|undefined} label
 * @param {{ taxonomyId?: string|null, subjectId?: string|null }} [ctx]
 * @returns {string}
 */
export function sanitizeParentPatternLabel(label, ctx = {}) {
  return resolveParentPatternLabelForDisplay(label, ctx);
}

export { resolveParentFacingPatternLabel };
