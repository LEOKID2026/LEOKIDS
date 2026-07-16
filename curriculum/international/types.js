/**
 * @typedef {Object} InternationalSkillEntry
 * @property {string} grade - Canonical grade key (g1–g6).
 * @property {string} subject - math | geometry | english | science
 * @property {string} topic - Topic bucket id aligned with learning apps.
 * @property {string} skill - Stable skill id (snake_case, never translated).
 * @property {string} difficulty - easy | medium | hard
 * @property {string[]} prerequisites - Prior skill ids within the same subject.
 * @property {number} masteryTarget - Target accuracy 0–1 for mastery.
 * @property {string} contentLocale - Content locale for this pack entry (en).
 */

export {};
