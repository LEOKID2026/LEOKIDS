/**
 * GLOBAL locale-aware card-copy resolver.
 * No Hebrew / Israel compatibility path. Content comes from packs + templates only.
 */

import { resolveRewardCardDisplay } from "./reward-card-locale-catalog.js";
import { resolveRewardCardEntry, rewardUiCopyForLocale } from "./reward-pack-copy.js";
import { formatRarityLabel, formatCardTypeLabel } from "./rewards-ui.js";
import { resolveContentLocale, getLocaleFallbackChain } from "../i18n/locale-resolution.js";
import { resolveLocaleDefinition } from "../i18n/locale-registry.js";
import { isIsraelOnlyRewardCardKey } from "./global-card-scope.js";
import {
  buildGlobalCardRequirement,
  formatGlobalProgressLine,
} from "./card-requirement-global.server.js";

/**
 * @param {string|null|undefined} contentLocale
 */
function requireContentLocale(contentLocale) {
  if (contentLocale == null || String(contentLocale).trim() === "") {
    throw new Error("global_card_copy_missing_content_locale");
  }
  return resolveContentLocale({ contentLocale });
}

/**
 * @param {string} seriesSlug
 * @param {string} contentLocale
 */
function seriesTitleFromSlug(seriesSlug, contentLocale) {
  const key = String(seriesSlug || "").trim();
  if (!key) return "";
  const fromPack = rewardUiCopyForLocale(contentLocale, "series", key, {});
  if (fromPack && fromPack !== key) return fromPack;
  return key
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Resolve catalog title/description along fallback chain without Hebrew DB fields.
 * @param {string} cardKey
 * @param {string} contentLocale
 */
function resolveCatalogFields(cardKey, contentLocale) {
  const chain = getLocaleFallbackChain(contentLocale);
  const englishFamily = (id) => id === "en" || String(id).startsWith("en-");
  for (const loc of chain) {
    if (!englishFamily(contentLocale) && englishFamily(loc) && loc !== contentLocale) {
      continue;
    }
    const entry =
      resolveRewardCardDisplay(loc, cardKey) || resolveRewardCardEntry(cardKey, loc);
    const name = String(entry?.title || entry?.name || "").trim();
    const description = String(entry?.description || "").trim();
    if (name && description) {
      return {
        name,
        description,
        resolvedLocale: resolveLocaleDefinition(loc).id,
        fallbackSource: loc === contentLocale ? "exact" : "master",
      };
    }
  }
  if (englishFamily(contentLocale)) {
    const entry =
      resolveRewardCardDisplay("en", cardKey) || resolveRewardCardEntry(cardKey, "en");
    const name = String(entry?.title || entry?.name || "").trim();
    const description = String(entry?.description || "").trim();
    if (name) {
      return {
        name,
        description: description || `Earn this card: ${name}`,
        resolvedLocale: "en",
        fallbackSource: contentLocale === "en" ? "exact" : "en-family",
      };
    }
  }
  for (const loc of chain) {
    if (loc === "en") continue;
    const entry =
      resolveRewardCardDisplay(loc, cardKey) || resolveRewardCardEntry(cardKey, loc);
    const name = String(entry?.title || entry?.name || "").trim();
    const description = String(entry?.description || "").trim();
    if (name) {
      return {
        name,
        description: description || name,
        resolvedLocale: resolveLocaleDefinition(loc).id,
        fallbackSource: "master",
      };
    }
  }
  const safeName = rewardUiCopyForLocale(contentLocale, "fallback", "rewardCard") || "Reward card";
  const description =
    rewardUiCopyForLocale(contentLocale, "fallback", "collectName", { name: safeName }) ||
    `Collect ${safeName}!`;
  return {
    name: safeName,
    description,
    resolvedLocale: resolveLocaleDefinition(contentLocale).id,
    fallbackSource: "fallback-template",
  };
}

/**
 * GLOBAL entrypoint — packs + semantic templates only.
 *
 * @param {{
 *   productContext?: "global",
 *   contentLocale: string,
 *   card: object,
 *   series?: object|null,
 *   rules?: object[],
 *   primaryProgress?: { current?: number|null, target?: number|null }|null,
 *   includeRequirement?: boolean,
 * }} args
 */
export function resolveGlobalCardCopy(args) {
  if (args?.productContext != null && args.productContext !== "global") {
    throw new Error("resolveGlobalCardCopy_requires_global_context");
  }
  const contentLocale = requireContentLocale(args.contentLocale);
  const card = args.card || {};
  const cardKey = String(card.card_key || card.cardKey || "").trim();

  if (isIsraelOnlyRewardCardKey(cardKey)) {
    throw new Error(`israel_only_card_in_global_resolver:${cardKey}`);
  }

  const catalog = resolveCatalogFields(cardKey, contentLocale);
  const seriesObj =
    args.series && typeof args.series === "object"
      ? args.series
      : card.reward_card_series || null;
  const seriesSlug = String(seriesObj?.slug || "").trim();

  /** @type {ReturnType<typeof buildGlobalCardRequirement>|null} */
  let requirement = null;
  if (args.includeRequirement !== false) {
    requirement = buildGlobalCardRequirement(
      card,
      args.rules || [],
      args.primaryProgress || null,
      contentLocale
    );
  }

  const progressText =
    args.includeRequirement === false
      ? null
      : formatGlobalProgressLine(args.primaryProgress || null, contentLocale);

  return {
    name: catalog.name,
    description: catalog.description,
    seriesName: seriesSlug ? seriesTitleFromSlug(seriesSlug, contentLocale) : "",
    rarityLabel: formatRarityLabel(card.rarity, contentLocale),
    cardTypeLabel: formatCardTypeLabel(card.card_type || card.cardType, contentLocale),
    requirementText: requirement?.requirementText ?? "",
    lockMessage: requirement?.lockMessage ?? "",
    progressText: progressText || "",
    templateKey: requirement?.templateKey ?? null,
    templateParams: requirement?.templateParams ?? null,
    ruleType: requirement?.ruleType ?? null,
    contentLocale,
    resolvedLocale: requirement?.resolvedLocale || catalog.resolvedLocale,
    fallbackSource: requirement?.fallbackSource || catalog.fallbackSource,
    productContext: /** @type {const} */ ("global"),
  };
}
