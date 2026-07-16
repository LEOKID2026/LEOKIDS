/**
 * Geometry-only: infer display units from question text for trustworthy explanations.
 */

/** @returns {{ area: string | null, length: string | null, volume: string | null }} */
export function inferGeometryResultUnits(question) {
  const q = String(question?.question ?? "");
  const out = { area: null, length: null, volume: null };
  if (!q) return out;

  const hasCm =
    /ס[\u05F4"\u201C\u201D']מ/.test(q) ||
    /בס"מ/.test(q) ||
    /\bcm\b/i.test(q) ||
    /centimeter/i.test(q);
  const hasMeters = /מטר/.test(q) || /\bmeter/i.test(q) || /\bm\b(?!\w)/.test(q);
  const cubic =
    /מעוקב|מעוקבים|מ["״']ק|סמ["״']ק/.test(q) ||
    /בס["״']מ\s*מעוקב/.test(q) ||
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

  if (/מטרים\s*רבועים|מטר\s*רבוע|מ["״']ר|square\s*meters?|\bm\^?2\b/i.test(q)) {
    out.area = "m²";
    out.length = "m";
    return out;
  }

  if (
    hasMeters &&
    /שטח|רבועים|רצפה|גינה|גג|מגרש|area|floor|garden|roof|yard/i.test(q) &&
    !/היקף|גדר|שביל|perimeter|fence|path/i.test(q)
  ) {
    out.area = "m²";
    out.length = "m";
    return out;
  }

  if (
    (/גדר|שביל|היקף.*מטר|כמה מטרים(?!.*רבוע)/.test(q) ||
      /fence|path|perimeter.*meter|how many meters/i.test(q)) &&
    hasMeters
  ) {
    out.length = "meters";
    return out;
  }

  if (hasCm && /נפח|תיבה|קופסה|קובייה|volume|box|cube/i.test(q)) {
    out.volume = "cm³";
    out.length = "cm";
    return out;
  }

  if (hasCm) {
    out.length = "cm";
    if (/שטח|סמ["״']ר|area|cm\^?2/i.test(q)) out.area = "cm²";
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
  const s = u.area || "area units";
  return `The result: ${value} ${s}.`;
}

export function resultPhraseLength(question, value) {
  const u = inferGeometryResultUnits(question);
  const s = u.length || "length units";
  return `The result: ${value} ${s}.`;
}

export function resultPhraseVolume(question, value) {
  const u = inferGeometryResultUnits(question);
  const s = u.volume || "volume units";
  return `The result: ${value} ${s}.`;
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
  const s = u.volume || "volume units";
  return `Rounded result: ${value} ${s}.`;
}
