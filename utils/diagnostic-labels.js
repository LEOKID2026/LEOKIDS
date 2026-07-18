/**
 * English-only diagnostic labels for parents — no raw technical identifiers.
 * Display label maps live in content-packs/en/learning/diagnostic-labels.json.
 */

import diagnosticLabelsEn from "../content-packs/en/learning/diagnostic-labels.json" with { type: "json" };

const OPERATION_NAMES_EN = diagnosticLabelsEn.operations;
const GEOMETRY_TOPIC_NAMES_EN = diagnosticLabelsEn.geometryTopics;
const ENGLISH_TOPIC_NAMES_EN = diagnosticLabelsEn.englishTopics;
const SCIENCE_TOPIC_NAMES_EN = diagnosticLabelsEn.scienceTopics;
const LANGUAGE_ARTS_TOPIC_NAMES_EN = diagnosticLabelsEn.languageArtsTopics;
const HOMELAND_GEOGRAPHY_TOPIC_NAMES_EN = diagnosticLabelsEn.homelandGeographyTopics;
const EN_SNIPPET_EN = diagnosticLabelsEn.snippets;

export const GENERIC_WEAKNESS_EN = diagnosticLabelsEn.generics.weakness;
export const GENERIC_POINT_EN = diagnosticLabelsEn.generics.point;
export const GENERIC_REINFORCE_EN = diagnosticLabelsEn.generics.reinforce;
export const PARENT_TOPIC_FALLBACK_EN = diagnosticLabelsEn.generics.parentTopicFallback;

/**
 * @param {string|null|undefined} slug
 */
export function englishLabelFromSlug(slug) {
  if (!slug || typeof slug !== "string") return null;
  const raw = slug.trim().toLowerCase();
  if (!raw) return null;
  if (EN_SNIPPET_EN[raw]) return EN_SNIPPET_EN[raw];
  const parts = raw.split(/[_/:+]+/).filter(Boolean);
  if (parts.length === 0) return null;
  const mapped = parts.map((p) => EN_SNIPPET_EN[p]).filter(Boolean);
  if (mapped.length === 0) return null;
  if (mapped.length >= Math.min(2, parts.length)) return [...new Set(mapped)].join(" · ");
  if (mapped.length === 1 && parts.length <= 4) return mapped[0];
  return null;
}

/** Turns a raw snake_case/kebab-case key into a readable English phrase as a last resort. */
export function humanizeTopicKey(raw) {
  const t = String(raw || "")
    .trim()
    .replace(/[_\-]+/g, " ")
    .replace(/::.*$/, "")
    .trim();
  if (!t) return "";
  return t
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const TOPIC_NAME_PLACEHOLDER_LABELS = new Set(["topic", "this topic", "general", "unknown"]);

/**
 * @param {string} subjectId
 * @param {string|null|undefined} bucketKey
 */
export function topicBucketLabel(subjectId, bucketKey) {
  const k = bucketKey != null ? String(bucketKey) : "";
  if (!k) return null;
  const base = k.indexOf("::") === -1 ? k : k.slice(0, k.indexOf("::"));
  const key = base.trim().toLowerCase();
  let result = null;
  if (subjectId === "math") result = OPERATION_NAMES_EN[key] || (key.startsWith("wp_") ? OPERATION_NAMES_EN.word_problems : null);
  else if (subjectId === "geometry") result = GEOMETRY_TOPIC_NAMES_EN[key];
  else if (subjectId === "english") result = ENGLISH_TOPIC_NAMES_EN[key];
  else if (subjectId === "science") result = SCIENCE_TOPIC_NAMES_EN[key];
  else if (subjectId === "history") result = null;
  else if (subjectId === "hebrew") result = LANGUAGE_ARTS_TOPIC_NAMES_EN[key];
  else if (subjectId === "moledet-geography") result = HOMELAND_GEOGRAPHY_TOPIC_NAMES_EN[key];
  if (result != null) {
    if (TOPIC_NAME_PLACEHOLDER_LABELS.has(String(result).trim().toLowerCase())) return null;
    return result;
  }
  return humanizeTopicKey(base) || null;
}

/**
 * @param {string} subjectId
 * @param {Record<string, unknown>|null|undefined} sampleEv
 */
export function weaknessLabelEn(subjectId, sampleEv) {
  const ev = sampleEv && typeof sampleEv === "object" ? sampleEv : {};
  const pf = String(ev.patternFamily || "").trim();
  const k = String(ev.kind || "").trim();
  const st = String(ev.subtype || "").trim();
  const ct = String(ev.conceptTag || "").trim();
  const topic = ev.topicOrOperation;

  if (subjectId === "geometry") {
    const hay = `${pf} ${k} ${st} ${ct}`.toLowerCase();
    if (hay.includes("perimeter") && hay.includes("area")) return "Recurring mix-up between perimeter and area";
    if (hay.includes("perimeter")) return "Difficulty telling apart and calculating perimeter";
    if (hay.includes("area")) return "In area and area units";
    if (hay.includes("volume") || hay.includes("prism")) return "Difficulty with volume and 3D shapes";
    if (hay.includes("angle")) return "Difficulty with angles and angle relationships";
  }

  if (subjectId === "hebrew") {
    const h = `${pf} ${k} ${st} ${ct}`.toLowerCase();
    if (h.includes("preposition")) return "Difficulty with prepositions and sentence structure";
    if (h.includes("verb") || h.includes("tense")) return "Difficulty with verbs and verb tense";
    if (h.includes("syntax") || h.includes("sequence")) return "Difficulty with logical sequence and phrasing";
    if (h.includes("clarity") || h.includes("rewrite")) return "Difficulty understanding exactly what's asked and phrasing a clear answer";
  }

  if (subjectId === "math") {
    const h = `${pf} ${k} ${st}`.toLowerCase();
    if (h.includes("remainder")) return "Difficulty with remainders and division with remainder";
    if (h.includes("compare")) return "Difficulty comparing quantities or numbers";
    if (h.includes("percent") || h.includes("discount")) return "Difficulty with percentages and discounts";
    if (h.includes("fraction")) return "Difficulty with fractions";
    if (h.includes("decimal")) return "Difficulty with decimals";
  }

  if (subjectId === "english") {
    const h = `${pf} ${k} ${st} ${ct}`.toLowerCase();
    if (h.includes("vocab")) return "Difficulty with vocabulary and word meaning";
    if (h.includes("grammar")) return "Difficulty with grammar and word forms";
    if (h.includes("sentence") || h.includes("completion")) return "Difficulty completing sentences and sentence structure";
    if (h.includes("listening")) return "Difficulty with listening comprehension";
    if (h.includes("spelling")) return "Difficulty with spelling";
    if (h.includes("writing")) return "Difficulty with writing and phrasing in English";
    if (h.includes("reading")) return "Difficulty with reading comprehension";
  }

  if (subjectId === "history") {
    const h = `${pf} ${k} ${st} ${ct}`.toLowerCase();
    if (h.includes("source")) return "Difficulty telling apart primary and secondary sources";
    if (h.includes("timeline") || h.includes("sequence")) return "Difficulty with the order of events on a timeline";
    if (h.includes("cause") || h.includes("effect")) return "Difficulty with cause-and-effect relationships";
    if (h.includes("compare") || h.includes("comparison")) return "Difficulty comparing periods or institutions";
    if (h.includes("figure") || h.includes("role")) return "Difficulty telling apart historical figures and their roles";
  }

  const fromPf = englishLabelFromSlug(pf);
  if (fromPf) return fromPf;
  const fromK = englishLabelFromSlug(k);
  if (fromK) return fromK;
  const fromSt = englishLabelFromSlug(st);
  if (fromSt) return fromSt;

  if (topic) {
    const nice = topicBucketLabel(subjectId, topic);
    if (nice) return `in ${nice}`;
  }

  if (pf) return humanizeTopicKey(pf) || GENERIC_WEAKNESS_EN;

  return GENERIC_WEAKNESS_EN;
}

/**
 * @param {string} subjectId
 * @param {Record<string, unknown>} row
 */
export function sessionRowLabelEn(subjectId, row) {
  if (!row || typeof row !== "object") return "Practice topic";
  const dn = row.displayName != null ? String(row.displayName).trim() : "";
  if (dn) return dn;
  const bk = row.bucketKey != null ? String(row.bucketKey) : "";
  if (bk) {
    const mapped = topicBucketLabel(subjectId, bk);
    if (mapped) return mapped;
  }
  return "Practice topic";
}

/**
 * @param {string|null|undefined} label
 * @returns {string}
 */
export function parentFacingWeaknessPracticePhraseEn(label) {
  const core = String(label || "")
    .trim()
    .replace(/^mistake pattern:\s*/i, "")
    .replace(/^in\s+/i, "")
    .replace(/^this topic\s+/i, "");
  if (!core) return "";
  return `in ${core}`;
}
