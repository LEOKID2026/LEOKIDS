/**
 * International curriculum registry — packs keyed by subject and grade (g1–g6).
 * Skill IDs are stable English snake_case keys (not translated labels).
 */

import mathG1 from "./math/g1.json";
import mathG2 from "./math/g2.json";
import mathG3 from "./math/g3.json";
import mathG4 from "./math/g4.json";
import mathG5 from "./math/g5.json";
import mathG6 from "./math/g6.json";

import geometryG1 from "./geometry/g1.json";
import geometryG2 from "./geometry/g2.json";
import geometryG3 from "./geometry/g3.json";
import geometryG4 from "./geometry/g4.json";
import geometryG5 from "./geometry/g5.json";
import geometryG6 from "./geometry/g6.json";

import englishG1 from "./english/g1.json";
import englishG2 from "./english/g2.json";
import englishG3 from "./english/g3.json";
import englishG4 from "./english/g4.json";
import englishG5 from "./english/g5.json";
import englishG6 from "./english/g6.json";

import scienceG1 from "./science/g1.json";
import scienceG2 from "./science/g2.json";
import scienceG3 from "./science/g3.json";
import scienceG4 from "./science/g4.json";
import scienceG5 from "./science/g5.json";
import scienceG6 from "./science/g6.json";

export const INTERNATIONAL_SUBJECTS = Object.freeze(["math", "geometry", "english", "science"]);
export const INTERNATIONAL_GRADES = Object.freeze(["g1", "g2", "g3", "g4", "g5", "g6"]);

/** @type {Record<string, Record<string, import("./types.js").InternationalSkillEntry[]>>} */
const PACKS = Object.freeze({
  math: Object.freeze({
    g1: mathG1,
    g2: mathG2,
    g3: mathG3,
    g4: mathG4,
    g5: mathG5,
    g6: mathG6,
  }),
  geometry: Object.freeze({
    g1: geometryG1,
    g2: geometryG2,
    g3: geometryG3,
    g4: geometryG4,
    g5: geometryG5,
    g6: geometryG6,
  }),
  english: Object.freeze({
    g1: englishG1,
    g2: englishG2,
    g3: englishG3,
    g4: englishG4,
    g5: englishG5,
    g6: englishG6,
  }),
  science: Object.freeze({
    g1: scienceG1,
    g2: scienceG2,
    g3: scienceG3,
    g4: scienceG4,
    g5: scienceG5,
    g6: scienceG6,
  }),
});

/**
 * @typedef {import("./types.js").InternationalSkillEntry} InternationalSkillEntry
 */

/**
 * @returns {typeof PACKS}
 */
export function listInternationalPacks() {
  return PACKS;
}

/**
 * @param {string} subject
 * @param {string} grade
 * @returns {InternationalSkillEntry[]|null}
 */
export function getInternationalPack(subject, grade) {
  const sub = String(subject || "").trim().toLowerCase();
  const gr = String(grade || "").trim().toLowerCase();
  const pack = PACKS[sub]?.[gr];
  return Array.isArray(pack) ? pack : null;
}

/**
 * @param {string} [subject]
 * @param {string} [grade]
 * @returns {InternationalSkillEntry[]}
 */
export function listInternationalSkills(subject, grade) {
  if (subject && grade) {
    return getInternationalPack(subject, grade) || [];
  }
  const out = [];
  for (const sub of INTERNATIONAL_SUBJECTS) {
    for (const gr of INTERNATIONAL_GRADES) {
      out.push(...(getInternationalPack(sub, gr) || []));
    }
  }
  return out;
}

/**
 * Catalog summary for UI / admin: subject → grades → skill count.
 */
export function summarizeInternationalCatalog() {
  /** @type {Record<string, Record<string, number>>} */
  const summary = {};
  for (const sub of INTERNATIONAL_SUBJECTS) {
    summary[sub] = {};
    for (const gr of INTERNATIONAL_GRADES) {
      summary[sub][gr] = (getInternationalPack(sub, gr) || []).length;
    }
  }
  return summary;
}
