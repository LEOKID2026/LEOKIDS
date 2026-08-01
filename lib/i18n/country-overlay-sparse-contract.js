/**
 * Sparse-contract helpers for country content-pack overlays (es-XX → es-419).
 *
 * Near-full *copy* is not the same as a dense justified overlay:
 * - copy: high coverage of a base pack while retaining identical / near-identical values
 * - dense justified: high coverage where every override meaningfully differs
 */

/**
 * @param {unknown} obj
 * @param {string} [prefix]
 * @param {Map<string, unknown>} [out]
 * @returns {Map<string, unknown>}
 */
export function collectStringLeaves(obj, prefix = "", out = new Map()) {
  if (typeof obj === "string") {
    out.set(prefix || "(root)", obj);
    return out;
  }
  if (obj == null || typeof obj !== "object" || Array.isArray(obj)) {
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out.set(p, v);
    else if (v && typeof v === "object" && !Array.isArray(v)) collectStringLeaves(v, p, out);
  }
  return out;
}

/**
 * @param {string} a
 * @param {string} b
 */
function levenshtein(a, b) {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  /** @type {number[]} */
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  /** @type {number[]} */
  let cur = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, cur] = [cur, prev];
  }
  return prev[n];
}

/**
 * @param {string} a
 * @param {string} b
 */
export function stringSimilarity(a, b) {
  if (a === b) return 1;
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

/**
 * Resolve the es-419 authority pack path for a country overlay file.
 * Supports semantic burn-down fragments: `{baseSlug}__{fragment}.json`.
 *
 * @param {string} relativePath posix path under content-packs/{locale}/
 * @param {(candidateRel: string) => boolean} baseExists
 * @returns {{ kind: "exact" | "fragment" | "missing", baseRel: string | null, parentSlug: string | null }}
 */
export function resolveAuthorityPackPath(relativePath, baseExists) {
  const rel = String(relativePath || "").replace(/\\/g, "/");
  if (baseExists(rel)) {
    return { kind: "exact", baseRel: rel, parentSlug: null };
  }

  const burnDownMatch = rel.match(
    /^(?<prefix>(?:games|learning|reports|global-burn-down)\/burn-down\/)(?<file>[^/]+)\.json$/
  );
  if (burnDownMatch?.groups) {
    const file = burnDownMatch.groups.file;
    const prefix = burnDownMatch.groups.prefix;
    // Longest existing parent slug prefix before a `__fragment` suffix.
    const parts = file.split("__");
    for (let i = parts.length - 1; i >= 1; i--) {
      const parentSlug = parts.slice(0, i).join("__");
      const candidate = `${prefix}${parentSlug}.json`;
      if (baseExists(candidate)) {
        return { kind: "fragment", baseRel: candidate, parentSlug };
      }
    }
  }

  return { kind: "missing", baseRel: null, parentSlug: null };
}

/**
 * @typedef {{
 *   coverage: number,
 *   identicalCount: number,
 *   nearIdenticalCount: number,
 *   overrideCount: number,
 *   baseCount: number,
 *   isNearFullCopy: boolean,
 *   isDenseJustifiedOverlay: boolean,
 * }} NearFullAssessment
 */

/**
 * Data-driven near-full *copy* detector.
 * High coverage alone is not enough — retained base text is required.
 *
 * @param {Map<string, string>} countryLeaves
 * @param {Map<string, string>} baseLeaves
 * @param {{
 *   minBaseLeaves?: number,
 *   coverageThreshold?: number,
 *   nearIdenticalSimilarity?: number,
 *   identicalFractionThreshold?: number,
 *   retainedFractionThreshold?: number,
 * }} [opts]
 * @returns {NearFullAssessment}
 */
export function assessNearFullCopy(countryLeaves, baseLeaves, opts = {}) {
  const minBaseLeaves = opts.minBaseLeaves ?? 10;
  const coverageThreshold = opts.coverageThreshold ?? 0.9;
  const nearIdenticalSimilarity = opts.nearIdenticalSimilarity ?? 0.95;
  const identicalFractionThreshold = opts.identicalFractionThreshold ?? 0.05;
  const retainedFractionThreshold = opts.retainedFractionThreshold ?? 0.5;

  const overrideCount = countryLeaves.size;
  const baseCount = baseLeaves.size;
  const coverage = baseCount ? overrideCount / baseCount : overrideCount ? Infinity : 0;

  let identicalCount = 0;
  let nearIdenticalCount = 0;
  for (const [key, value] of countryLeaves) {
    if (!baseLeaves.has(key)) continue;
    const baseVal = baseLeaves.get(key);
    if (typeof baseVal !== "string" || typeof value !== "string") continue;
    if (value === baseVal) {
      identicalCount += 1;
      continue;
    }
    if (stringSimilarity(value, baseVal) >= nearIdenticalSimilarity) {
      nearIdenticalCount += 1;
    }
  }

  const identicalFraction = overrideCount ? identicalCount / overrideCount : 0;
  const retainedFraction = overrideCount
    ? (identicalCount + nearIdenticalCount) / overrideCount
    : 0;

  const denseEnough = baseCount >= minBaseLeaves && coverage >= coverageThreshold;
  const looksLikeCopy =
    identicalFraction >= identicalFractionThreshold || retainedFraction >= retainedFractionThreshold;
  const isNearFullCopy = denseEnough && looksLikeCopy;
  const isDenseJustifiedOverlay =
    denseEnough && identicalCount === 0 && nearIdenticalCount === 0 && !isNearFullCopy;

  return {
    coverage,
    identicalCount,
    nearIdenticalCount,
    overrideCount,
    baseCount,
    isNearFullCopy,
    isDenseJustifiedOverlay,
  };
}
