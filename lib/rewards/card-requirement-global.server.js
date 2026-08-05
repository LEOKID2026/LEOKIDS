/**
 * GLOBAL-only requirement / lock text from semantic rules + locale packs.
 * Never reads description_he / requirement_text_he / any *_he DB fields.
 */

import { subjectLabel, bindPlatformDisplayLocale } from "../platform-ui/display-labels.js";
import { CARD_RULE_TYPE_META } from "./card-rule-types.js";
import { normalizeRuleParams } from "./card-rule-params.js";
import { createRewardUiCopy, rewardUiCopyForLocale } from "./reward-pack-copy.js";
import { resolveContentLocale, getLocaleFallbackChain } from "../i18n/locale-resolution.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";

/**
 * @param {string|null|undefined} contentLocale
 */
function assertGlobalContentLocale(contentLocale) {
  if (contentLocale == null || String(contentLocale).trim() === "") {
    throw new Error("global_card_requirement_missing_content_locale");
  }
  return resolveContentLocale({ contentLocale });
}

/**
 * @param {string} contentLocale
 * @param {string} group
 * @param {string} key
 * @param {Record<string, unknown>} [vars]
 */
function uiAlongChain(contentLocale, group, key, vars) {
  const chain = getLocaleFallbackChain(contentLocale);
  const englishFamily = (id) => id === "en" || String(id).startsWith("en-");
  for (const loc of chain) {
    if (!englishFamily(contentLocale) && englishFamily(loc) && loc !== contentLocale) {
      // Skip English in chain for non-English primary — try next only if nothing else (handled below)
      continue;
    }
    const text = rewardUiCopyForLocale(loc, group, key, vars);
    if (text && text !== key && !String(text).includes(`${group}.`)) {
      return { text, resolvedLocale: resolveLocaleDefinition(loc).id, fallbackSource: loc === contentLocale ? "exact" : "master" };
    }
  }
  // Last resort: English only when primary is English-family
  if (englishFamily(contentLocale)) {
    const text = rewardUiCopyForLocale("en", group, key, vars);
    return { text, resolvedLocale: "en", fallbackSource: contentLocale === "en" ? "exact" : "en-family" };
  }
  // Non-English: use first non-en chain hit already failed — use nearest master before en
  for (const loc of chain) {
    if (loc === "en") continue;
    const text = rewardUiCopyForLocale(loc, group, key, vars);
    if (text && text !== key) {
      return { text, resolvedLocale: resolveLocaleDefinition(loc).id, fallbackSource: "master" };
    }
  }
  throw new Error(`global_requirement_template_missing:${contentLocale}:${group}.${key}`);
}

/**
 * @param {string|null|undefined} topic
 * @param {string} contentLocale
 */
function topicLabel(topic, contentLocale) {
  const k = String(topic || "").trim().toLowerCase();
  if (!k) return "";
  const fromPack = rewardUiCopyForLocale(contentLocale, "topics", k, {});
  return fromPack !== k ? fromPack : k;
}

/**
 * @param {object} rule
 * @param {{ current?: number|null, target?: number|null }|null} [progress]
 * @param {string} contentLocale
 */
export function buildGlobalRuleRequirement(rule, progress, contentLocale) {
  const locale = assertGlobalContentLocale(contentLocale);
  bindPlatformDisplayLocale(locale);
  const p = normalizeRuleParams(rule);
  const rt = String(rule?.rule_type || "").trim();

  /** @type {{ text: string, resolvedLocale: string, fallbackSource: string, templateKey: string, params: object }} */
  let built;

  if (rt === "total_questions" && p.min_questions != null) {
    const r = uiAlongChain(locale, "requirements", "total_questions", { minQuestions: p.min_questions });
    built = { ...r, templateKey: "requirements.total_questions", params: { minQuestions: p.min_questions } };
  } else if (rt === "weekly_questions" && p.min_questions != null) {
    const r = uiAlongChain(locale, "requirements", "weekly_questions", { minQuestions: p.min_questions });
    built = { ...r, templateKey: "requirements.weekly_questions", params: { minQuestions: p.min_questions } };
  } else if (rt === "subject_questions" && p.min_questions != null) {
    const subj = subjectLabel(p.subject);
    if (subj && subj !== "-" && subj.trim()) {
      const r = uiAlongChain(locale, "requirements", "subject_questions", {
        minQuestions: p.min_questions,
        subject: subj,
      });
      built = {
        ...r,
        templateKey: "requirements.subject_questions",
        params: { minQuestions: p.min_questions, subject: p.subject },
      };
    } else {
      const r = uiAlongChain(locale, "requirements", "subject_questions_fallback_subject", {
        minQuestions: p.min_questions,
      });
      built = {
        ...r,
        templateKey: "requirements.subject_questions_fallback_subject",
        params: { minQuestions: p.min_questions, subject: p.subject },
      };
    }
  } else if (rt === "subject_accuracy" && p.min_questions != null && p.min_accuracy != null) {
    const subj = subjectLabel(p.subject);
    const top = topicLabel(p.topic, locale);
    const topicPart = top
      ? uiAlongChain(locale, "requirements", "subject_accuracy_topic_part", { topic: top }).text
      : "";
    const r = uiAlongChain(locale, "requirements", "subject_accuracy", {
      minAccuracy: p.min_accuracy,
      subject: subj,
      topicPart,
      minQuestions: p.min_questions,
    });
    built = {
      ...r,
      templateKey: "requirements.subject_accuracy",
      params: {
        minAccuracy: p.min_accuracy,
        subject: p.subject,
        topic: p.topic,
        minQuestions: p.min_questions,
      },
    };
  } else if (rt === "learning_streak_days" && p.min_streak_days != null) {
    const r = uiAlongChain(locale, "requirements", "learning_streak_days", {
      minStreakDays: p.min_streak_days,
    });
    built = {
      ...r,
      templateKey: "requirements.learning_streak_days",
      params: { minStreakDays: p.min_streak_days },
    };
  } else if (rt === "active_days_streak" && p.min_streak_days != null) {
    const r = uiAlongChain(locale, "requirements", "active_days_streak", {
      minStreakDays: p.min_streak_days,
    });
    built = {
      ...r,
      templateKey: "requirements.active_days_streak",
      params: { minStreakDays: p.min_streak_days },
    };
  } else if (rt === "parent_activity_complete" && p.min_completed_activities != null) {
    const r = uiAlongChain(locale, "requirements", "parent_activity_complete", {
      minCompletedActivities: p.min_completed_activities,
    });
    built = {
      ...r,
      templateKey: "requirements.parent_activity_complete",
      params: { minCompletedActivities: p.min_completed_activities },
    };
  } else if (rt === "monthly_learning_minutes" && p.min_learning_minutes_monthly != null) {
    const r = uiAlongChain(locale, "requirements", "monthly_learning_minutes", {
      minLearningMinutesMonthly: p.min_learning_minutes_monthly,
    });
    built = {
      ...r,
      templateKey: "requirements.monthly_learning_minutes",
      params: { minLearningMinutesMonthly: p.min_learning_minutes_monthly },
    };
  } else if (rt === "event_window") {
    const r = uiAlongChain(locale, "requirements", "event_window", {});
    built = { ...r, templateKey: "requirements.event_window", params: {} };
  } else if (rt === "daily_mission_complete") {
    if (p.mission_key) {
      const r = uiAlongChain(locale, "requirements", "daily_mission_complete", {
        missionKey: p.mission_key,
      });
      built = {
        ...r,
        templateKey: "requirements.daily_mission_complete",
        params: { missionKey: p.mission_key },
      };
    } else {
      const r = uiAlongChain(locale, "requirements", "daily_mission_generic", {});
      built = { ...r, templateKey: "requirements.daily_mission_generic", params: {} };
    }
  } else if (rt === "grade_band_only" && p.grade_band) {
    const gradeBand =
      rewardUiCopyForLocale(locale, "gradeBands", p.grade_band, {}) || p.grade_band;
    const r = uiAlongChain(locale, "requirements", "grade_band_only", { gradeBand });
    built = {
      ...r,
      templateKey: "requirements.grade_band_only",
      params: { gradeBand: p.grade_band },
    };
  } else {
    const meta = CARD_RULE_TYPE_META[rt];
    // Never use meta.label as displayed GLOBAL text — use neutral fallback keys only.
    if (meta) {
      const r = uiAlongChain(locale, "fallback", "keepLearning", {});
      built = { ...r, templateKey: "fallback.keepLearning", params: { ruleType: rt } };
    } else {
      const r = uiAlongChain(locale, "fallback", "keepLearning", {});
      built = { ...r, templateKey: "fallback.keepLearning", params: { ruleType: rt || null } };
    }
  }

  if (progress?.target != null && progress?.current != null) {
    const cur = Math.floor(Number(progress.current) || 0);
    const tgt = Math.floor(Number(progress.target) || 0);
    if (tgt > 0) {
      const prog = uiAlongChain(locale, "fallback", "progressOf", {
        current: cur.toLocaleString(resolveLocaleDefinition(locale).intlLocale || locale),
        target: tgt.toLocaleString(resolveLocaleDefinition(locale).intlLocale || locale),
      });
      built = {
        ...built,
        text: `${built.text} (${prog.text})`,
      };
    }
  }

  return built;
}

/**
 * @param {object} card — DB card row (may contain *_he; must be ignored)
 * @param {object[]} [rules]
 * @param {{ current?: number|null, target?: number|null }|null} [primaryProgress]
 * @param {string} contentLocale
 */
export function buildGlobalCardRequirement(card, rules = [], primaryProgress = null, contentLocale) {
  const locale = assertGlobalContentLocale(contentLocale);
  // Hard guard: never touch Hebrew DB fields even if present on `card`.
  void card?.id;

  const active = (rules || []).filter((r) => r.is_active !== false);
  if (!active.length) {
    if (card?.can_be_purchased) {
      const r = uiAlongChain(locale, "fallback", "availableInShop", {});
      return {
        requirementText: r.text,
        lockMessage: r.text,
        templateKey: "fallback.availableInShop",
        templateParams: {},
        ruleType: null,
        contentLocale: locale,
        resolvedLocale: r.resolvedLocale,
        fallbackSource: r.fallbackSource,
      };
    }
    if (card?.can_appear_in_surprise_box) {
      const r = uiAlongChain(locale, "fallback", "availableInSurpriseBox", {});
      return {
        requirementText: r.text,
        lockMessage: r.text,
        templateKey: "fallback.availableInSurpriseBox",
        templateParams: {},
        ruleType: null,
        contentLocale: locale,
        resolvedLocale: r.resolvedLocale,
        fallbackSource: r.fallbackSource,
      };
    }
    const r = uiAlongChain(locale, "fallback", "notAvailableNow", {});
    return {
      requirementText: r.text,
      lockMessage: r.text,
      templateKey: "fallback.notAvailableNow",
      templateParams: {},
      ruleType: null,
      contentLocale: locale,
      resolvedLocale: r.resolvedLocale,
      fallbackSource: r.fallbackSource,
    };
  }

  const primary = active[0];
  const built = buildGlobalRuleRequirement(primary, primaryProgress, locale);
  if (!built.text || !String(built.text).trim()) {
    throw new Error(`global_requirement_empty:${card?.card_key || card?.id || "unknown"}`);
  }
  return {
    requirementText: built.text,
    lockMessage: built.text,
    templateKey: built.templateKey,
    templateParams: built.params,
    ruleType: String(primary.rule_type || "").trim() || null,
    contentLocale: locale,
    resolvedLocale: built.resolvedLocale,
    fallbackSource: built.fallbackSource,
  };
}

/**
 * @param {{ current?: number|null, target?: number|null }|null} progress
 * @param {string} contentLocale
 */
export function formatGlobalProgressLine(progress, contentLocale) {
  if (!progress || progress.target == null || progress.target <= 0) return null;
  const locale = assertGlobalContentLocale(contentLocale);
  const cur = Math.max(0, Math.floor(Number(progress.current) || 0));
  const tgt = Math.floor(Number(progress.target) || 0);
  const r = uiAlongChain(locale, "fallback", "progressOf", {
    current: cur.toLocaleString(resolveLocaleDefinition(locale).intlLocale || locale),
    target: tgt.toLocaleString(resolveLocaleDefinition(locale).intlLocale || locale),
  });
  return r.text;
}
