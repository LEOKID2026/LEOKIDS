/**
 * Student card collection queries and card catalog helpers.
 */

import { resolveCardPrice, getDuplicateSellbackPercent, computeCardSellbackCoins } from "./reward-settings.server.js";
import { getStudentCoinBalance } from "./reward-coins.server.js";
import { resolveGlobalCardCopy } from "../card-copy-resolver.js";
import { filterIsraelOnlyRewardCards, isGlobalScopedRewardCard } from "../global-card-scope.js";
import { mapRewardCardImageFields } from "../reward-card-image-urls.js";
import { sortShopCardsByDisplayPrice } from "../shop-card-sort.js";
import {
  loadRulesGroupedByCardId,
  cardPassesGradeBands,
  cardRulesAllMatchFromCache,
  buildStudentRuleProgressCache,
} from "./card-acquisition-engine.server.js";
import { getGradeBand } from "../../learning-supabase/mission-progress.server.js";
import { isLegacySeedCardExcludedFromStudentWorld } from "./student-card-visibility.server.js";
import { rewardUiCopyForLocale } from "../reward-pack-copy.js";

function isCardActiveNow(card, now = new Date()) {
  if (!card.is_active) return false;
  if (card.starts_at && new Date(card.starts_at) > now) return false;
  if (card.ends_at && new Date(card.ends_at) < now) return false;
  return true;
}

/**
 * @param {object} card
 * @param {object|null|undefined} series
 * @param {string} contentLocale
 */
function mapCardForChild(card, series, contentLocale) {
  if (!contentLocale) throw new Error("mapCardForChild_missing_content_locale");
  const seriesObj =
    series && typeof series === "object"
      ? series
      : card?.reward_card_series || null;
  const display = resolveGlobalCardCopy({
    productContext: "global",
    contentLocale,
    card,
    series: seriesObj,
    includeRequirement: false,
  });
  return {
    id: card.id,
    cardKey: card.card_key,
    name: display.name,
    description: display.description,
    seriesName: display.seriesName,
    ...mapRewardCardImageFields(card),
    rarity: card.rarity,
    rarityLabel: display.rarityLabel,
    cardType: card.card_type,
    cardTypeLabel: display.cardTypeLabel,
    subject: card.subject,
    topic: card.topic,
    visibilityMode: card.visibility_mode || "visible_locked",
    contentLocale: display.contentLocale,
    resolvedLocale: display.resolvedLocale,
    fallbackSource: display.fallbackSource,
  };
}

/**
 * @param {object} card
 * @param {object[]} rules
 * @param {object} ctx
 * @param {Awaited<ReturnType<typeof buildStudentRuleProgressCache>>} progressCache
 * @param {string} contentLocale
 */
function buildCardLockMetaFromCache(card, rules, ctx, progressCache, contentLocale) {
  if (!contentLocale) throw new Error("buildCardLockMetaFromCache_missing_content_locale");
  const { matches, primaryProgress, anyProgress } = cardRulesAllMatchFromCache(
    rules,
    ctx,
    progressCache
  );
  const copy = resolveGlobalCardCopy({
    productContext: "global",
    contentLocale,
    card,
    rules,
    primaryProgress,
    includeRequirement: true,
  });
  return {
    requirementText: copy.requirementText,
    lockMessage: copy.lockMessage,
    progressText: copy.progressText || "",
    progressCurrent: primaryProgress?.current ?? null,
    progressTarget: primaryProgress?.target ?? null,
    isEligible: matches,
    hasRuleProgress: anyProgress,
    primaryProgress,
    contentLocale: copy.contentLocale,
    resolvedLocale: copy.resolvedLocale,
    fallbackSource: copy.fallbackSource,
    templateKey: copy.templateKey,
    ruleType: copy.ruleType,
  };
}

/**
 * @param {object} card
 * @param {boolean} isOwned
 * @param {boolean} gradeOk
 * @param {{ hasRuleProgress?: boolean, isEligible?: boolean }} meta
 */
function cardVisibleToStudent(card, isOwned, gradeOk, meta) {
  if (isOwned) return true;
  if (!gradeOk) return false;
  if (card.visibility_mode === "hidden_until_eligible") {
    return meta.hasRuleProgress === true || meta.isEligible === true;
  }
  return true;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 */
export async function fetchActiveCardsWithSeries(supabase) {
  const { data: cards, error } = await supabase
    .from("reward_cards")
    .select("*, reward_card_series(slug)")
    .eq("is_active", true);
  if (error) throw new Error(error.message);
  return filterIsraelOnlyRewardCards(
    (cards || []).filter(
      (c) => isCardActiveNow(c) && !isLegacySeedCardExcludedFromStudentWorld(c)
    )
  );
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 * @param {string} contentLocale
 */
export async function getStudentCollection(supabase, studentId, contentLocale) {
  if (!contentLocale) throw new Error("getStudentCollection_missing_content_locale");
  const { data: owned, error } = await supabase
    .from("student_reward_cards")
    .select("*, reward_cards(*, reward_card_series(slug))")
    .eq("student_id", studentId)
    .eq("owned", true);
  if (error) throw new Error(error.message);

  return (owned || [])
    .filter(
      (row) =>
        !isLegacySeedCardExcludedFromStudentWorld(row.reward_cards) &&
        isGlobalScopedRewardCard(row.reward_cards)
    )
    .map((row) => {
      const card = row.reward_cards;
      const isAchievement = card?.card_type === "achievement";
      return {
        ...mapCardForChild(card, card?.reward_card_series, contentLocale),
        duplicateCount: isAchievement ? 0 : row.duplicate_count,
        canConvert: false,
        firstReceivedAt: row.first_received_at,
        lastReceivedAt: row.last_received_at,
      };
    });
}

/** Catalog / locked tab: non-event cards first, event cards last. */
function sortCatalogCardsForDisplay(cards) {
  const rest = [];
  const events = [];
  for (const card of cards) {
    if (card.cardType === "event") events.push(card);
    else rest.push(card);
  }
  events.sort((a, b) => (a.name || "").localeCompare(b.name || "", "en"));
  return [...rest, ...events];
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 */
async function loadStudentGradeBand(supabase, studentId) {
  const { data: studentRow } = await supabase
    .from("students")
    .select("grade_level")
    .eq("id", studentId)
    .maybeSingle();
  return getGradeBand(studentRow?.grade_level);
}

/**
 * @param {object[]} allCards
 * @param {Set<string>} ownedIds
 * @param {Map<string, object[]>} rulesByCard
 * @param {{ gradeBand: string, monthlyMinutes: number }} ctx
 * @param {Awaited<ReturnType<typeof buildStudentRuleProgressCache>>} progressCache
 * @param {string} contentLocale
 */
function buildLockMetaByCardId(allCards, ownedIds, rulesByCard, ctx, progressCache, contentLocale) {
  /** @type {Map<string, ReturnType<typeof buildCardLockMetaFromCache>>} */
  const lockMetaByCardId = new Map();
  for (const card of allCards) {
    if (ownedIds.has(card.id)) continue;
    lockMetaByCardId.set(
      card.id,
      buildCardLockMetaFromCache(
        card,
        rulesByCard.get(card.id) || [],
        ctx,
        progressCache,
        contentLocale
      )
    );
  }
  return lockMetaByCardId;
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 * @param {object[]} allCards
 * @param {Map<string, object[]>} rulesByCard
 * @param {Set<string>} ownedIds
 * @param {string} studentGradeBand
 * @param {string} contentLocale
 */
async function loadLockMetaContext(
  supabase,
  studentId,
  allCards,
  rulesByCard,
  ownedIds,
  studentGradeBand,
  contentLocale
) {
  const ctx = { gradeBand: studentGradeBand, monthlyMinutes: 0 };
  const progressCache = await buildStudentRuleProgressCache(
    supabase,
    studentId,
    rulesByCard,
    ctx
  );
  const lockMetaByCardId = buildLockMetaByCardId(
    allCards,
    ownedIds,
    rulesByCard,
    ctx,
    progressCache,
    contentLocale
  );
  const getLockMeta = (card) =>
    ownedIds.has(card.id) ? null : lockMetaByCardId.get(card.id) ?? null;
  return { ctx, progressCache, getLockMeta };
}

/**
 * Lightweight counts + coin balance for cards page shell.
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 */
export async function getStudentCardsSummary(supabase, studentId) {
  const studentGradeBand = await loadStudentGradeBand(supabase, studentId);
  const [coinBalance, ownedRows, shopCardsRes, seriesRows] = await Promise.all([
    getStudentCoinBalance(supabase, studentId),
    supabase
      .from("student_reward_cards")
      .select("card_id, owned, reward_cards(card_key, card_type, image_url, reward_card_series(slug))")
      .eq("student_id", studentId),
    supabase
      .from("reward_cards")
      .select(
        "id, card_key, card_type, can_be_purchased, grade_bands, starts_at, ends_at, is_active, image_url, reward_card_series(slug)"
      )
      .eq("is_active", true),
    supabase.from("reward_card_series").select("id, slug").eq("is_active", true),
  ]);

  if (ownedRows.error) throw new Error(ownedRows.error.message);
  if (shopCardsRes.error) throw new Error(shopCardsRes.error.message);
  if (seriesRows.error) throw new Error(seriesRows.error.message);

  const ownedIds = new Set(
    (ownedRows.data || [])
      .filter(
        (r) => r.owned && !isLegacySeedCardExcludedFromStudentWorld(r.reward_cards)
      )
      .map((r) => r.card_id)
  );

  let shopCount = 0;
  for (const card of (shopCardsRes.data || []).filter((c) => isCardActiveNow(c))) {
    if (isLegacySeedCardExcludedFromStudentWorld(card)) continue;
    if (!isGlobalScopedRewardCard(card)) continue;
    if (!card.can_be_purchased || card.card_type !== "shop") continue;
    if (!cardPassesGradeBands(card, studentGradeBand)) continue;
    shopCount += 1;
  }

  const seriesCount = (seriesRows.data || []).filter(
    (series) => !isLegacySeedCardExcludedFromStudentWorld({ reward_card_series: series })
  ).length;

  return {
    coinBalance,
    counts: {
      collection: ownedIds.size,
      shop: shopCount,
      series: seriesCount,
    },
  };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 * @param {string} contentLocale
 */
export async function getStudentCardsShopView(supabase, studentId, contentLocale) {
  if (!contentLocale) throw new Error("getStudentCardsShopView_missing_content_locale");
  const studentGradeBand = await loadStudentGradeBand(supabase, studentId);
  const [allCards, ownedRows, sellbackPercent, coinBalance] = await Promise.all([
    fetchActiveCardsWithSeries(supabase),
    supabase.from("student_reward_cards").select("*").eq("student_id", studentId),
    getDuplicateSellbackPercent(supabase),
    getStudentCoinBalance(supabase, studentId),
  ]);

  if (ownedRows.error) throw new Error(ownedRows.error.message);

  const ownedMap = new Map((ownedRows.data || []).map((r) => [r.card_id, r]));
  const ownedIds = new Set((ownedRows.data || []).filter((r) => r.owned).map((r) => r.card_id));

  const shop = [];
  for (const card of allCards) {
    if (!card.can_be_purchased || card.card_type !== "shop") continue;
    if (!cardPassesGradeBands(card, studentGradeBand)) continue;
    if (!isCardActiveNow(card)) continue;

    const isOwned = ownedIds.has(card.id);
    const ownedRow = ownedMap.get(card.id);
    const duplicateCount = isOwned ? Math.max(0, Math.floor(Number(ownedRow?.duplicate_count) || 0)) : 0;
    const price = await resolveCardPrice(supabase, card);
    const sellbackCoins = computeCardSellbackCoins(price, sellbackPercent);
    const missing = isOwned ? 0 : Math.max(0, price - coinBalance);
    shop.push({
      ...mapCardForChild(card, card.reward_card_series, contentLocale),
      priceCoins: price,
      sellbackCoins,
      sellbackPercent,
      duplicateCount,
      canSellDuplicate: duplicateCount >= 1 && sellbackCoins > 0,
      canAfford: !isOwned && coinBalance >= price,
      missingCoins: missing,
      alreadyOwned: isOwned,
    });
  }

  return { shop: sortShopCardsByDisplayPrice(shop) };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 * @param {string} contentLocale
 */
export async function getStudentCardsCollectionView(supabase, studentId, contentLocale) {
  return { collection: await getStudentCollection(supabase, studentId, contentLocale) };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 * @param {string} contentLocale
 */
export async function getStudentCardsCatalogView(supabase, studentId, contentLocale) {
  if (!contentLocale) throw new Error("getStudentCardsCatalogView_missing_content_locale");
  const studentGradeBand = await loadStudentGradeBand(supabase, studentId);
  const [allCards, ownedRows, rulesByCard] = await Promise.all([
    fetchActiveCardsWithSeries(supabase),
    supabase.from("student_reward_cards").select("*").eq("student_id", studentId),
    loadRulesGroupedByCardId(supabase),
  ]);

  if (ownedRows.error) throw new Error(ownedRows.error.message);

  const ownedMap = new Map((ownedRows.data || []).map((r) => [r.card_id, r]));
  const ownedIds = new Set((ownedRows.data || []).filter((r) => r.owned).map((r) => r.card_id));
  const { getLockMeta } = await loadLockMetaContext(
    supabase,
    studentId,
    allCards,
    rulesByCard,
    ownedIds,
    studentGradeBand,
    contentLocale
  );

  const catalog = sortCatalogCardsForDisplay(
    allCards
      .map((card) => {
        const mapped = mapCardForChild(card, card.reward_card_series, contentLocale);
        const ownedRow = ownedMap.get(card.id);
        const isOwned = ownedIds.has(card.id);
        const gradeOk = cardPassesGradeBands(card, studentGradeBand);
        const lockMeta = getLockMeta(card);

        if (!cardVisibleToStudent(card, isOwned, gradeOk, lockMeta || {})) {
          return null;
        }

        if (isOwned && ownedRow) {
          const isAchievement = card.card_type === "achievement";
          return {
            ...mapped,
            isOwned: true,
            duplicateCount: isAchievement ? 0 : ownedRow.duplicate_count,
            canConvert: false,
          };
        }

        return {
          ...mapped,
          isOwned: false,
          lockMessage: lockMeta?.lockMessage || "",
          requirementText: lockMeta?.requirementText || "",
          progressText: lockMeta?.progressText || null,
          progressCurrent: lockMeta?.progressCurrent ?? null,
          progressTarget: lockMeta?.progressTarget ?? null,
          resolvedLocale: lockMeta?.resolvedLocale || mapped.resolvedLocale,
          fallbackSource: lockMeta?.fallbackSource || mapped.fallbackSource,
        };
      })
      .filter(Boolean)
  );

  return { catalog };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 * @param {string} contentLocale
 */
export async function getStudentCardsSeriesView(supabase, studentId, contentLocale) {
  if (!contentLocale) throw new Error("getStudentCardsSeriesView_missing_content_locale");
  const studentGradeBand = await loadStudentGradeBand(supabase, studentId);
  const [allCards, ownedRows, seriesRows, rulesByCard] = await Promise.all([
    fetchActiveCardsWithSeries(supabase),
    supabase.from("student_reward_cards").select("*").eq("student_id", studentId),
    supabase.from("reward_card_series").select("*").eq("is_active", true).order("display_order"),
    loadRulesGroupedByCardId(supabase),
  ]);

  if (ownedRows.error) throw new Error(ownedRows.error.message);
  if (seriesRows.error) throw new Error(seriesRows.error.message);

  const ownedIds = new Set((ownedRows.data || []).filter((r) => r.owned).map((r) => r.card_id));
  const { getLockMeta } = await loadLockMetaContext(
    supabase,
    studentId,
    allCards,
    rulesByCard,
    ownedIds,
    studentGradeBand,
    contentLocale
  );

  const seriesProgress = [];
  for (const series of seriesRows.data || []) {
    if (isLegacySeedCardExcludedFromStudentWorld({ reward_card_series: series })) continue;
    const inSeries = allCards
      .filter((c) => c.series_id === series.id)
      .sort((a, b) => (a.card_key || "").localeCompare(b.card_key || "", "en"));
    const seriesShell = resolveGlobalCardCopy({
      productContext: "global",
      contentLocale,
      card: { card_key: series.slug, rarity: "regular", card_type: "achievement" },
      series,
      includeRequirement: false,
    });
    const seriesName = seriesShell.seriesName || seriesShell.name;
    const cards = [];
    for (const card of inSeries) {
      const owned = ownedIds.has(card.id);
      const gradeOk = cardPassesGradeBands(card, studentGradeBand);
      const lockMeta = getLockMeta(card);
      if (!cardVisibleToStudent(card, owned, gradeOk, lockMeta || {})) continue;

      const mapped = mapCardForChild(card, series, contentLocale);
      cards.push({
        cardId: card.id,
        cardKey: card.card_key,
        id: card.id,
        name: mapped.name,
        imageUrl: mapped.imageUrl,
        imageThumbUrl: mapped.imageThumbUrl,
        imageDisplayUrl: mapped.imageDisplayUrl,
        imageDownloadUrl: mapped.imageDownloadUrl,
        imageVariantsReady: mapped.imageVariantsReady,
        rarity: mapped.rarity,
        rarityLabel: mapped.rarityLabel,
        seriesName: mapped.seriesName,
        owned,
        isLocked: !owned,
        requirementText: lockMeta?.requirementText || null,
        lockMessage: lockMeta?.lockMessage || null,
        progressText: lockMeta?.progressText || null,
        contentLocale: mapped.contentLocale,
        resolvedLocale: lockMeta?.resolvedLocale || mapped.resolvedLocale,
        fallbackSource: lockMeta?.fallbackSource || mapped.fallbackSource,
      });
    }
    const ownedInSeries = cards.filter((c) => c.owned).length;
    seriesProgress.push({
      seriesId: series.id,
      name: seriesName,
      ownedCount: ownedInSeries,
      totalCount: cards.length,
      cards,
    });
  }

  return { seriesProgress };
}

/**
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {string} studentId
 * @param {string} contentLocale
 */
export async function getStudentCardsView(supabase, studentId, contentLocale) {
  if (!contentLocale) throw new Error("getStudentCardsView_missing_content_locale");
  const [summary, collectionView, shopView, catalogView, seriesView] = await Promise.all([
    getStudentCardsSummary(supabase, studentId),
    getStudentCardsCollectionView(supabase, studentId, contentLocale),
    getStudentCardsShopView(supabase, studentId, contentLocale),
    getStudentCardsCatalogView(supabase, studentId, contentLocale),
    getStudentCardsSeriesView(supabase, studentId, contentLocale),
  ]);

  const studentGradeBand = await loadStudentGradeBand(supabase, studentId);
  const [allCards, ownedRows, rulesByCard] = await Promise.all([
    fetchActiveCardsWithSeries(supabase),
    supabase.from("student_reward_cards").select("*").eq("student_id", studentId),
    loadRulesGroupedByCardId(supabase),
  ]);
  if (ownedRows.error) throw new Error(ownedRows.error.message);

  const ownedMap = new Map((ownedRows.data || []).map((r) => [r.card_id, r]));
  const ownedIds = new Set((ownedRows.data || []).filter((r) => r.owned).map((r) => r.card_id));
  const { getLockMeta } = await loadLockMetaContext(
    supabase,
    studentId,
    allCards,
    rulesByCard,
    ownedIds,
    studentGradeBand,
    contentLocale
  );

  const locked = [];
  for (const card of allCards) {
    const mapped = mapCardForChild(card, card.reward_card_series, contentLocale);
    const ownedRow = ownedMap.get(card.id);
    const isOwned = ownedIds.has(card.id);
    const rules = rulesByCard.get(card.id) || [];
    const gradeOk = cardPassesGradeBands(card, studentGradeBand);
    const lockMeta = getLockMeta(card);

    if (!cardVisibleToStudent(card, isOwned, gradeOk, lockMeta || {})) continue;

    if (isOwned && ownedRow) continue;

    if (card.card_type === "achievement" || rules.length > 0) {
      locked.push({
        ...mapped,
        lockMessage:
          lockMeta?.lockMessage || rewardUiCopyForLocale(contentLocale, "fallback", "keepLearning"),
        requirementText: lockMeta?.requirementText || mapped.description,
        progressText: lockMeta?.progressText || null,
        progressCurrent: lockMeta?.progressCurrent ?? null,
        progressTarget: lockMeta?.progressTarget ?? null,
      });
    } else if (card.can_be_purchased && card.card_type !== "achievement") {
      locked.push({
        ...mapped,
        lockMessage:
          lockMeta?.lockMessage ||
          (card.card_type === "event"
            ? rewardUiCopyForLocale(contentLocale, "fallback", "notAvailableNow")
            : rewardUiCopyForLocale(contentLocale, "fallback", "availableInShop")),
        requirementText: lockMeta?.requirementText || null,
        progressText: lockMeta?.progressText || null,
      });
    } else if (!isOwned) {
      locked.push({
        ...mapped,
        lockMessage:
          lockMeta?.lockMessage || rewardUiCopyForLocale(contentLocale, "fallback", "notAvailableNow"),
        requirementText: lockMeta?.requirementText || null,
        progressText: lockMeta?.progressText || null,
      });
    }
  }

  return {
    collection: collectionView.collection,
    catalog: catalogView.catalog,
    locked: sortCatalogCardsForDisplay(locked),
    shop: shopView.shop,
    seriesProgress: seriesView.seriesProgress,
    coinBalance: summary.coinBalance,
    counts: summary.counts,
  };
}

/**
 * Grant a card to student (owned or duplicate).
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 */
export async function grantCardToStudent(supabase, studentId, cardId, { transactionType, metadata } = {}) {
  const { data: card } = await supabase.from("reward_cards").select("*").eq("id", cardId).maybeSingle();
  if (!card) return { ok: false, code: "card_not_found" };

  const isAchievement = card.card_type === "achievement";
  const now = new Date().toISOString();

  const { data: existing } = await supabase
    .from("student_reward_cards")
    .select("*")
    .eq("student_id", studentId)
    .eq("card_id", cardId)
    .maybeSingle();

  if (isAchievement && existing?.owned) {
    return { ok: true, duplicate: false, alreadyOwned: true, card };
  }

  let wasDuplicate = false;
  if (existing?.owned) {
    if (isAchievement) {
      return { ok: true, duplicate: false, alreadyOwned: true, card };
    }
    wasDuplicate = true;
    const { error } = await supabase
      .from("student_reward_cards")
      .update({
        duplicate_count: (existing.duplicate_count || 0) + 1,
        last_received_at: now,
      })
      .eq("id", existing.id);
    if (error) return { ok: false, code: "update_failed", message: error.message };
  } else if (existing) {
    const { error } = await supabase
      .from("student_reward_cards")
      .update({ owned: true, last_received_at: now, first_received_at: existing.first_received_at || now })
      .eq("id", existing.id);
    if (error) return { ok: false, code: "update_failed", message: error.message };
  } else {
    const { error } = await supabase.from("student_reward_cards").insert({
      student_id: studentId,
      card_id: cardId,
      owned: true,
      duplicate_count: 0,
      first_received_at: now,
      last_received_at: now,
    });
    if (error) return { ok: false, code: "insert_failed", message: error.message };
  }

  const { data: afterRow } = await supabase
    .from("student_reward_cards")
    .select("duplicate_count")
    .eq("student_id", studentId)
    .eq("card_id", cardId)
    .maybeSingle();

  return {
    ok: true,
    duplicate: wasDuplicate,
    duplicateCount: afterRow?.duplicate_count ?? 0,
    card,
    transactionType: transactionType || "surprise_box_reward",
    metadata,
  };
}

function pickDemoCollectionCards(allCards, studentGradeBand, count = 2) {
  return allCards
    .filter((card) => cardPassesGradeBands(card, studentGradeBand))
    .sort((a, b) => String(a.card_key || "").localeCompare(String(b.card_key || ""), "en"))
    .slice(0, count);
}

function mapDemoCollectionEntries(cards, contentLocale) {
  return cards.map((card) => ({
    ...mapCardForChild(card, card.reward_card_series, contentLocale),
    duplicateCount: 0,
    canConvert: false,
    firstReceivedAt: null,
    lastReceivedAt: null,
  }));
}

function loadDemoLockMetaContext(allCards, rulesByCard, ownedIds, studentGradeBand, contentLocale) {
  const ctx = { gradeBand: studentGradeBand, monthlyMinutes: 0 };
  const progressCache = { queryCount: 0 };
  const lockMetaByCardId = buildLockMetaByCardId(
    allCards,
    ownedIds,
    rulesByCard,
    ctx,
    progressCache,
    contentLocale
  );
  const getLockMeta = (card) =>
    ownedIds.has(card.id) ? null : lockMetaByCardId.get(card.id) ?? null;
  return { getLockMeta };
}

/** Demo read-only shop catalog — cardKey SSOT via mapCardForChild / content packs. */
export async function getDemoCardsShopView(
  supabase,
  gradeLevel,
  coinBalance = 150,
  contentLocale
) {
  if (!contentLocale) throw new Error("getDemoCardsShopView_missing_content_locale");
  const studentGradeBand = getGradeBand(gradeLevel);
  const [allCards, sellbackPercent] = await Promise.all([
    fetchActiveCardsWithSeries(supabase),
    getDuplicateSellbackPercent(supabase),
  ]);

  const shop = [];
  for (const card of allCards) {
    if (!card.can_be_purchased || card.card_type !== "shop") continue;
    if (!cardPassesGradeBands(card, studentGradeBand)) continue;
    if (!isCardActiveNow(card)) continue;

    const price = await resolveCardPrice(supabase, card);
    const sellbackCoins = computeCardSellbackCoins(price, sellbackPercent);
    const missing = Math.max(0, price - coinBalance);
    shop.push({
      ...mapCardForChild(card, card.reward_card_series, contentLocale),
      priceCoins: price,
      sellbackCoins,
      sellbackPercent,
      duplicateCount: 0,
      canSellDuplicate: false,
      canAfford: coinBalance >= price,
      missingCoins: missing,
      alreadyOwned: false,
    });
  }

  return { shop: sortShopCardsByDisplayPrice(shop) };
}

/** Demo collection — two real active cards for the selected grade (read-only). */
export async function getDemoCardsCollectionView(supabase, gradeLevel, contentLocale) {
  if (!contentLocale) throw new Error("getDemoCardsCollectionView_missing_content_locale");
  const studentGradeBand = getGradeBand(gradeLevel);
  const allCards = await fetchActiveCardsWithSeries(supabase);
  const picks = pickDemoCollectionCards(allCards, studentGradeBand);
  return { collection: mapDemoCollectionEntries(picks, contentLocale) };
}

/** Demo catalog — all real active cards visible for grade (read-only). */
export async function getDemoCardsCatalogView(supabase, gradeLevel, contentLocale) {
  if (!contentLocale) throw new Error("getDemoCardsCatalogView_missing_content_locale");
  const studentGradeBand = getGradeBand(gradeLevel);
  const [allCards, rulesByCard] = await Promise.all([
    fetchActiveCardsWithSeries(supabase),
    loadRulesGroupedByCardId(supabase),
  ]);
  const demoOwned = pickDemoCollectionCards(allCards, studentGradeBand);
  const ownedIds = new Set(demoOwned.map((card) => card.id));
  const { getLockMeta } = loadDemoLockMetaContext(
    allCards,
    rulesByCard,
    ownedIds,
    studentGradeBand,
    contentLocale
  );

  const catalog = sortCatalogCardsForDisplay(
    allCards
      .map((card) => {
        const mapped = mapCardForChild(card, card.reward_card_series, contentLocale);
        const isOwned = ownedIds.has(card.id);
        const gradeOk = cardPassesGradeBands(card, studentGradeBand);
        const lockMeta = getLockMeta(card);

        if (!cardVisibleToStudent(card, isOwned, gradeOk, lockMeta || {})) {
          return null;
        }

        if (isOwned) {
          const isAchievement = card.card_type === "achievement";
          return {
            ...mapped,
            duplicateCount: isAchievement ? 0 : 1,
            canConvert: false,
            firstReceivedAt: null,
            lastReceivedAt: null,
          };
        }

        return {
          ...mapped,
          requirementText: lockMeta?.requirementText || "",
          lockMessage: lockMeta?.lockMessage || "",
          progressText: lockMeta?.progressText || "",
          progressCurrent: lockMeta?.progressCurrent ?? null,
          progressTarget: lockMeta?.progressTarget ?? null,
          isEligible: lockMeta?.isEligible === true,
          hasRuleProgress: lockMeta?.hasRuleProgress === true,
          resolvedLocale: lockMeta?.resolvedLocale || mapped.resolvedLocale,
          fallbackSource: lockMeta?.fallbackSource || mapped.fallbackSource,
        };
      })
      .filter(Boolean),
  );

  return { catalog };
}

/** Demo series — all real active series for grade (read-only). */
export async function getDemoCardsSeriesView(supabase, gradeLevel, contentLocale) {
  if (!contentLocale) throw new Error("getDemoCardsSeriesView_missing_content_locale");
  const studentGradeBand = getGradeBand(gradeLevel);
  const [allCards, seriesRows, rulesByCard] = await Promise.all([
    fetchActiveCardsWithSeries(supabase),
    supabase.from("reward_card_series").select("*").eq("is_active", true).order("display_order"),
    loadRulesGroupedByCardId(supabase),
  ]);

  if (seriesRows.error) throw new Error(seriesRows.error.message);

  const demoOwned = pickDemoCollectionCards(allCards, studentGradeBand);
  const ownedIds = new Set(demoOwned.map((card) => card.id));
  const { getLockMeta } = loadDemoLockMetaContext(
    allCards,
    rulesByCard,
    ownedIds,
    studentGradeBand,
    contentLocale
  );

  const seriesProgress = [];
  for (const series of seriesRows.data || []) {
    if (isLegacySeedCardExcludedFromStudentWorld({ reward_card_series: series })) continue;
    const inSeries = allCards
      .filter((c) => c.series_id === series.id)
      .sort((a, b) => String(a.card_key || "").localeCompare(String(b.card_key || ""), "en"));
    const cards = [];
    for (const card of inSeries) {
      const owned = ownedIds.has(card.id);
      const gradeOk = cardPassesGradeBands(card, studentGradeBand);
      const lockMeta = getLockMeta(card);
      if (!cardVisibleToStudent(card, owned, gradeOk, lockMeta || {})) continue;

      const mapped = mapCardForChild(card, series, contentLocale);
      cards.push({
        cardId: card.id,
        cardKey: card.card_key,
        id: card.id,
        name: mapped.name,
        imageUrl: mapped.imageUrl,
        imageThumbUrl: mapped.imageThumbUrl,
        imageDisplayUrl: mapped.imageDisplayUrl,
        imageDownloadUrl: mapped.imageDownloadUrl,
        imageVariantsReady: mapped.imageVariantsReady,
        rarity: mapped.rarity,
        owned,
      });
    }
    if (cards.length === 0) continue;
    const seriesMapped = mapCardForChild(
      { card_key: series.slug, rarity: "regular", card_type: "achievement" },
      series,
      contentLocale
    );
    seriesProgress.push({
      seriesId: series.id,
      seriesSlug: series.slug,
      name: seriesMapped.seriesName || series.slug,
      totalCount: cards.length,
      ownedCount: cards.filter((c) => c.owned).length,
      cards,
    });
  }

  return { seriesProgress };
}

export { isCardActiveNow, mapCardForChild };
