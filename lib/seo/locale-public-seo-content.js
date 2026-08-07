import { deepMergeJson } from "../i18n/deep-merge.js";
import { globalBurnDownCopyForLocale } from "../i18n/global-burn-down-copy.js";
import { getLocaleFallbackChain } from "../i18n/locale-resolution.js";
import { getClientPublicSeoOverlay } from "./public-seo-ar-001-client-index.js";
import {
  getGuidePageContent as getGuidePageContentEn,
  GUIDE_HUB_CARDS as GUIDE_HUB_CARDS_EN,
  getGuideLink as getGuideLinkEn,
} from "../../data/seo/guide-pages.js";
import {
  getPracticePageContent as getPracticePageContentEn,
  PRACTICE_HUB_CARDS as PRACTICE_HUB_CARDS_EN,
} from "../../data/seo/practice-pages.js";
import { getWorksheetsPageContent as getWorksheetsPageContentEn } from "../../data/seo/worksheets-pages.en.js";
import {
  KIDS_LANDING,
  PARENTS_LANDING,
  TEACHERS_LANDING,
  SCHOOLS_LANDING,
} from "../../data/marketing/landing-pages.js";

/**
 * Walk locale fallback chain and deep-merge client public-seo overlays
 * (e.g. ar-EG → ar-001, ar-SA sparse → ar-001).
 *
 * @param {string|null|undefined} locale
 * @param {...string} segments
 * @returns {unknown}
 */
function loadPublicSeoPack(locale, ...segments) {
  const loc = String(locale || "").trim();
  if (!loc || loc === "en") return null;
  const chain = getLocaleFallbackChain(loc).filter((id) => id && id !== "en");
  /** @type {unknown} */
  let merged = null;
  let found = false;
  for (const id of [...chain].reverse()) {
    const pack = getClientPublicSeoOverlay(id, ...segments);
    if (pack == null) continue;
    found = true;
    merged = deepMergeJson(merged ?? (Array.isArray(pack) ? [] : {}), pack);
  }
  return found ? merged : null;
}

/**
 * @template T
 * @param {T} base
 * @param {unknown} overlay
 * @returns {T}
 */
function mergePublicSeoContent(base, overlay) {
  if (!overlay || typeof overlay !== "object") return base;
  return /** @type {T} */ (deepMergeJson(base, overlay));
}

/**
 * @param {string|null|undefined} locale
 * @param {string} slug
 */
export function getGuidePageContentForLocale(locale, slug) {
  const en = getGuidePageContentEn(slug);
  if (!en) return null;
  const overlay = loadPublicSeoPack(locale, "guides", `${slug}.json`);
  return mergePublicSeoContent(en, overlay);
}

/**
 * @param {string|null|undefined} locale
 * @param {string} slug
 */
export function getGuideLinkForLocale(locale, slug) {
  const page = getGuidePageContentForLocale(locale, slug);
  if (!page) return getGuideLinkEn(slug);
  const href = slug === "hub" ? "/guides" : `/guides/${slug}`;
  return { href, label: page.displayTitle || page.h1 };
}

/**
 * @param {string|null|undefined} locale
 */
export function getGuideHubCardsForLocale(locale) {
  const overlay = loadPublicSeoPack(locale, "guides", "hub-cards.json");
  if (!overlay || !Array.isArray(overlay)) return GUIDE_HUB_CARDS_EN;
  return mergePublicSeoContent(GUIDE_HUB_CARDS_EN, overlay);
}

/**
 * @param {string|null|undefined} locale
 * @param {string} slug
 */
export function getPracticePageContentForLocale(locale, slug) {
  const en = getPracticePageContentEn(slug);
  if (!en) return null;
  const overlay = loadPublicSeoPack(locale, "practice", `${slug}.json`);
  const merged = mergePublicSeoContent(en, overlay);
  if (slug === "hub") {
    const cards = getPracticeHubCardsForLocale(locale);
    return { ...merged, hubCards: cards };
  }
  return merged;
}

/**
 * @param {string|null|undefined} locale
 */
export function getWorksheetsPageContentForLocale(locale) {
  const en = getWorksheetsPageContentEn();
  const overlay = loadPublicSeoPack(locale, "practice", "worksheets.json");
  const merged = mergePublicSeoContent(en, overlay);
  const loc = locale && locale !== "en" ? String(locale) : "";
  if (!loc) return merged;

  const h1 = globalBurnDownCopyForLocale(
    loc,
    "lib__site__public-page-seo",
    "printable_worksheets_for_kids_leo_kids"
  );
  const intro = globalBurnDownCopyForLocale(
    loc,
    "lib__site__public-page-seo",
    "ready_worksheets_a_worksheet_generator_and_answer_keys_for_elementary_pr"
  );
  const hubTitle = globalBurnDownCopyForLocale(
    loc,
    "lib__worksheets__worksheet-ui",
    "printable_worksheets"
  );

  return {
    ...merged,
    h1: h1 && !h1.includes("printable_worksheets") ? h1 : merged.h1,
    intro:
      intro && !intro.includes("ready_worksheets") ? intro : merged.intro,
    badge:
      hubTitle && !hubTitle.includes("printable_worksheets")
        ? hubTitle
        : merged.badge,
  };
}

/**
 * @param {string|null|undefined} locale
 */
export function getPracticeHubCardsForLocale(locale) {
  const overlay = loadPublicSeoPack(locale, "practice", "hub-cards.json");
  if (!overlay || !Array.isArray(overlay)) return PRACTICE_HUB_CARDS_EN;
  return mergePublicSeoContent(PRACTICE_HUB_CARDS_EN, overlay);
}

const MARKETING_BASE = {
  kids: KIDS_LANDING,
  parents: PARENTS_LANDING,
  teachers: TEACHERS_LANDING,
  schools: SCHOOLS_LANDING,
};

/**
 * @param {string|null|undefined} locale
 * @param {"kids"|"parents"|"teachers"|"schools"} audience
 */
export function getMarketingLandingContentForLocale(locale, audience) {
  const base = MARKETING_BASE[audience];
  if (!base) return null;
  const overlay = loadPublicSeoPack(locale, "marketing", `${audience}.json`);
  return mergePublicSeoContent(base, overlay);
}
