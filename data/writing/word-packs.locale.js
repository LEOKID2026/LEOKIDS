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

/** Neutral LatAm Spanish pack titles (chrome only). */
const PACK_TITLE_ES_419 = Object.freeze({
  colors: "Colores",
  animals: "Animales",
  family: "Familia",
  food: "Comida",
  school: "Escuela",
  body: "Cuerpo",
  home: "Casa",
  nature: "Naturaleza",
  transport: "Transporte",
  numbers: "Números",
  cvc: "Palabras CVC",
  sight: "Palabras de uso frecuente",
});

/** Portuguese Brazil pack titles (chrome only). */
const PACK_TITLE_PT_BR = Object.freeze({
  colors: "Cores",
  animals: "Animais",
  family: "Família",
  food: "Comidas",
  school: "Escola",
  body: "Corpo",
  home: "Casa",
  nature: "Natureza",
  transport: "Transporte",
  numbers: "Números",
  cvc: "Palavras CVC",
  sight: "Palavras frequentes",
});

/** EN colorInstruction → es-419 (colors pack only). */
const COLOR_INSTRUCTION_ES_419 = Object.freeze({
  "Color in red": "Colorea de rojo",
  "Color in blue": "Colorea de azul",
  "Color in green": "Colorea de verde",
  "Color in yellow": "Colorea de amarillo",
  "Color in orange": "Colorea de naranja",
  "Color in purple": "Colorea de morado",
  "Color in pink": "Colorea de rosa",
  "Color in black": "Colorea de negro",
});

/** EN colorInstruction → pt-BR (colors pack only). */
const COLOR_INSTRUCTION_PT_BR = Object.freeze({
  "Color in red": "Pinte de vermelho",
  "Color in blue": "Pinte de azul",
  "Color in green": "Pinte de verde",
  "Color in yellow": "Pinte de amarelo",
  "Color in orange": "Pinte de laranja",
  "Color in purple": "Pinte de roxo",
  "Color in pink": "Pinte de rosa",
  "Color in black": "Pinte de preto",
});

/**
 * @param {string} locale
 */
function isEs419(locale) {
  const tag = String(locale || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  return tag === "es-419" || tag === "es" || tag.startsWith("es-");
}

/**
 * @param {string} locale
 */
function isPtBr(locale) {
  const tag = String(locale || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  return tag === "pt-br";
}

/**
 * @param {string|null|undefined} [contentLocale]
 */
export function resolveWritingWordPacks(contentLocale) {
  const locale = resolveContentLocale({ contentLocale });
  const useEs = isEs419(locale);
  const usePt = isPtBr(locale);
  const titles = usePt ? PACK_TITLE_PT_BR : useEs ? PACK_TITLE_ES_419 : PACK_TITLE_EN;
  const colorMap = usePt ? COLOR_INSTRUCTION_PT_BR : useEs ? COLOR_INSTRUCTION_ES_419 : null;

  /** @type {typeof ENGLISH_WORD_PACKS} */
  const out = {};
  for (const [id, pack] of Object.entries(ENGLISH_WORD_PACKS)) {
    const titleEn = pack.title || pack.titleEn || PACK_TITLE_EN[id] || id;
    const title = titles[id] || titleEn;
    out[id] = {
      ...pack,
      id: pack.id || id,
      title,
      titleEn,
      // Legacy payload field retained for older consumers; Global display locale text.
      titleHe: title,
      words: (pack.words || []).map((w) => {
        const colorEn = w.colorInstruction || w.colorInstructionEn || undefined;
        const colorLocalized =
          colorMap && colorEn && colorMap[colorEn] ? colorMap[colorEn] : colorEn;
        return {
          ...w,
          colorInstruction: colorLocalized,
          colorInstructionEn: colorEn,
          colorInstructionHe: colorLocalized,
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
