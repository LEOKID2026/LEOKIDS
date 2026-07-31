/**
 * Locale-aware writing word packs.
 * Learning words (`text`) stay English (English-subject / literacy targets).
 * Pack titles and color instructions resolve by content locale with en fallback.
 */

import { ENGLISH_WORD_PACKS } from "./word-packs.en.js";
import { resolveContentLocale } from "../../lib/content/locale.js";

/** Stable pack ids → English display titles (instruction/chrome — not learning targets). */
const PACK_TITLE_EN = Object.freeze({
  colors: "Colors",
  animals: "Animals",
  family: "Family",
  food: "Food",
  school: "School",
  body: "Body",
  home: "Home",
  nature: "Nature",
  transport: "Transport",
  numbers: "Numbers",
  cvc: "CVC words",
  sight: "Sight words",
});

const COLOR_INSTRUCTION_EN = Object.freeze({
  "צבעו באדום": "Color in red",
  "צבעו בכחול": "Color in blue",
  "צבעו בירוק": "Color in green",
  "צבעו בצהוב": "Color in yellow",
  "צבעו בכתום": "Color in orange",
  "צבעו בסגול": "Color in purple",
  "צבעו בוורוד": "Color in pink",
  "צבעו בשחור": "Color in black",
});

/**
 * @param {string|null|undefined} [contentLocale]
 */
export function resolveWritingWordPacks(contentLocale) {
  const locale = resolveContentLocale({ contentLocale });
  // Only en packs ship today; unknown locales fall back to en display metadata.
  void locale;

  /** @type {typeof ENGLISH_WORD_PACKS} */
  const out = {};
  for (const [id, pack] of Object.entries(ENGLISH_WORD_PACKS)) {
    const titleEn = pack.titleEn || PACK_TITLE_EN[id] || id;
    out[id] = {
      ...pack,
      id: pack.id || id,
      titleEn,
      // Legacy field name retained for payload shape; Global display uses English.
      titleHe: titleEn,
      words: (pack.words || []).map((w) => {
        const colorEn =
          w.colorInstructionEn ||
          (w.colorInstructionHe ? COLOR_INSTRUCTION_EN[w.colorInstructionHe] : null) ||
          w.colorInstructionHe ||
          undefined;
        return {
          ...w,
          colorInstructionEn: colorEn,
          colorInstructionHe: colorEn,
        };
      }),
    };
  }
  return out;
}

/**
 * @param {string|null|undefined} [contentLocale]
 * @param {string} packId
 */
export function resolveWritingWordPack(contentLocale, packId) {
  const packs = resolveWritingWordPacks(contentLocale);
  return packs[packId] || null;
}
