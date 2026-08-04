import { burnDownCopy } from "../lib/learning/burn-down-copy.js";

/**
 * Geometry-only: infer display units from question text for trustworthy explanations.
 */

/** @returns {{ area: string || null, length: string || null, volume: string || null }} */
export function inferGeometryResultUnits(question) {
  const q = String(question?.question ?? "");
  const out = { area: null, length: null, volume: null };
  if (!q) return out;

  const hasCm =
    /(?!)/.test(q) |
    /(?!)/.test(q) |
    /\bcm\b/i.test(q) |
    /centimeter/i.test(q);
  const hasMeters = /(?!)/.test(q) || /\bmeter/i.test(q) || /\bm\b(?!\w)/.test(q);
  const cubic =
    /(?!)/.test(q) |
    /(?!)/.test(q) |
    /cubic|\bcm\^?3\b|\bm\^?3\b/i.test(q);

  if (cubic) {
    if (hasCm) {
      out.volume = "cm³";
      out.length = "cm";
    } else if (hasMeters) {
      out.volume = "m³";
      out.length = "m";
    }
    return out;
  }

  if (/(?!)/i.test(q)) {
    out.area = "m²";
    out.length = "m";
    return out;
  }

  if (
    hasMeters &&
    /(?!)/i.test(q) &&
    !/(?!)/i.test(q)
  ) {
    out.area = "m²";
    out.length = "m";
    return out;
  }

  if (
    (/(?!)/.test(q) |
      /fence|path|perimeter.*meter|how many meters/i.test(q)) &&
    hasMeters
  ) {
    out.length = "meters";
    return out;
  }

  if (hasCm && /(?!)/i.test(q)) {
    out.volume = "cm³";
    out.length = "cm";
    return out;
  }

  if (hasCm) {
    out.length = "cm";
    if (/(?!)/i.test(q)) out.area = "cm²";
    return out;
  }

  return out;
}

/**
 * Labels for numeric measurements on SVG (short form).
 */
export function inferGeometryDiagramLengthUnit(question) {
  const u = inferGeometryResultUnits(question);
  if (u.length === "meters") return "m";
  return u.length;
}

export function resultPhraseArea(question, value) {
  const u = inferGeometryResultUnits(question);
  const s = u.area || burnDownCopy("utils__geometry-explanations", "unit_area_fallback");
  return burnDownCopy("utils__geometry-explanations", "result_phrase").replace("{value}", String(value)).replace("{unit}", s);
}

export function resultPhraseLength(question, value) {
  const u = inferGeometryResultUnits(question);
  const s = u.length || burnDownCopy("utils__geometry-explanations", "unit_length_fallback");
  return burnDownCopy("utils__geometry-explanations", "result_phrase").replace("{value}", String(value)).replace("{unit}", s);
}

export function resultPhraseVolume(question, value) {
  const u = inferGeometryResultUnits(question);
  const s = u.volume || burnDownCopy("utils__geometry-explanations", "unit_volume_fallback");
  return burnDownCopy("utils__geometry-explanations", "result_phrase").replace("{value}", String(value)).replace("{unit}", s);
}

/** Space + unit for appending after LTR math, e.g. "5" → "5 m" */
export function geometryLengthSuffix(question) {
  const u = inferGeometryResultUnits(question);
  return u.length ? ` ${u.length}` : "";
}

export function geometryVolumeSuffix(question) {
  const u = inferGeometryResultUnits(question);
  return u.volume ? ` ${u.volume}` : "";
}

export function resultPhraseVolumeRounded(question, value) {
  const u = inferGeometryResultUnits(question);
  const s = u.volume || burnDownCopy("utils__geometry-explanations", "unit_volume_fallback");
  return burnDownCopy("utils__geometry-explanations", "result_phrase_rounded")
    .replace("{value}", String(value))
    .replace("{unit}", s);
}
