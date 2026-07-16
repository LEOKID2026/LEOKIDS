/** Stable badge IDs stored in progress; display labels come from locales. */

export const LEARNING_BADGE = {
  STREAK_10: "streak_10",
  STREAK_25: "streak_25",
  STREAK_50: "streak_50",
  STREAK_100_MATH: "streak_100_math",
  STREAK_100_SCIENCE: "streak_100_science",
  SCORE_1000: "score_1000",
  SCORE_5000: "score_5000",
  CORRECT_100: "correct_100",
  CORRECT_500: "correct_500",
};

/** @type {Record<string, string[]>} Legacy stored badge strings (HE + EN) for matching only — display comes from locales. */
export const BADGE_LEGACY_ALIASES = {
  [LEARNING_BADGE.STREAK_10]: ["🔥 רצף חם", "🔥 Hot Streak", "🔥 Hot streak"],
  [LEARNING_BADGE.STREAK_25]: ["⚡ מהיר כברק", "⚡ Lightning Fast", "⚡ Lightning fast"],
  [LEARNING_BADGE.STREAK_50]: ["🌟 אלוף", "🌟 מאסטר", "🌟 Master", "🌟 אלוף מדעים", "🌟 מאסטר מדעים", "🌟 Science champion", "🌟 Champion"],
  [LEARNING_BADGE.STREAK_100_MATH]: ["👑 מלך החשבון", "👑 Math King"],
  [LEARNING_BADGE.STREAK_100_SCIENCE]: ["👑 מלך המדעים", "👑 Science King"],
  [LEARNING_BADGE.SCORE_1000]: ["💎 אלף נקודות", "💎 1,000 points"],
  [LEARNING_BADGE.SCORE_5000]: ["🎯 חמשת אלפים", "🎯 5,000 points"],
  [LEARNING_BADGE.CORRECT_100]: ["⭐ מאה תשובות נכונות", "⭐ 100 correct answers"],
  [LEARNING_BADGE.CORRECT_500]: ["🌟 חמש מאות תשובות", "🌟 500 correct answers"],
};

export function opKingBadgeId(op) {
  return `op_king:${op}`;
}

export function opGeniusBadgeId(op) {
  return `op_genius:${op}`;
}

export function topicExpertBadgeId(topic) {
  return `topic_expert:${topic}`;
}

export function topicGeniusBadgeId(topic) {
  return `topic_genius:${topic}`;
}

/**
 * @param {string[]} badges
 * @param {string} id — canonical ID or legacy stored string
 */
export function hasLearningBadge(badges, id) {
  if (!Array.isArray(badges) || !id) return false;
  if (badges.includes(id)) return true;
  const aliases = BADGE_LEGACY_ALIASES[id];
  if (aliases?.some((a) => badges.includes(a))) return true;
  if (id.startsWith("op_king:") || id.startsWith("op_genius:")) {
    return badges.some(
      (b) =>
        b === id ||
        b.startsWith("🧮 מלך") ||
        b.startsWith("🏆 גאון ה") ||
        parseLegacyBadgeCanonicalId(b) === id
    );
  }
  if (id.startsWith("topic_expert:") || id.startsWith("topic_genius:")) {
    return badges.some(
      (b) =>
        b === id ||
        b.startsWith("🔬 מומחה") ||
        b.startsWith("🏆 גאון ") ||
        parseLegacyBadgeCanonicalId(b) === id
    );
  }
  return false;
}

/**
 * @param {string[]} badges
 * @param {string} id
 * @param {string[]} [extraLegacy]
 */
export function hasLearningBadgeWithLegacy(badges, id, extraLegacy = []) {
  if (hasLearningBadge(badges, id)) return true;
  return extraLegacy.some((legacy) => badges.includes(legacy));
}

/** @returns {string|null} */
export function parseLegacyBadgeCanonicalId(stored) {
  if (!stored || typeof stored !== "string") return null;
  for (const [canonical, aliases] of Object.entries(BADGE_LEGACY_ALIASES)) {
    if (aliases.includes(stored)) return canonical;
  }
  const opKing = stored.match(/^🧮 מלך ה(.+)$/);
  if (opKing) return `op_king:${opKing[1]}`;
  const opGenius = stored.match(/^🏆 גאון ה(.+)$/);
  if (opGenius) return `op_genius:${opGenius[1]}`;
  const topicExpert = stored.match(/^🔬 מומחה (.+)$/);
  if (topicExpert) return `topic_expert_legacy:${topicExpert[1]}`;
  const topicGenius = stored.match(/^🏆 גאון (.+)$/);
  if (topicGenius) return `topic_genius_legacy:${topicGenius[1]}`;
  return null;
}
