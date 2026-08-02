/**
 * Locale-aware writing word packs.
 * Learning words (`text`) stay English (English-subject / literacy targets).
 * Pack titles and color instructions resolve by content locale with en fallback.
 */

import { ENGLISH_WORD_PACKS } from "./word-packs.en.js";
import { getContentFallbackChain, resolveContentLocale } from "../../lib/content/locale.js";

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

/** Portuguese Portugal pack titles (chrome only). */
const PACK_TITLE_PT_PT = Object.freeze({
  colors: "Cores",
  animals: "Animais",
  family: "Família",
  food: "Alimentos",
  school: "Escola",
  body: "Corpo",
  home: "Casa",
  nature: "Natureza",
  transport: "Transportes",
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

/** EN colorInstruction → pt-PT (colors pack only). */
const COLOR_INSTRUCTION_PT_PT = Object.freeze({
  "Color in red": "Pinta de vermelho",
  "Color in blue": "Pinta de azul",
  "Color in green": "Pinta de verde",
  "Color in yellow": "Pinta de amarelo",
  "Color in orange": "Pinta de laranja",
  "Color in purple": "Pinta de roxo",
  "Color in pink": "Pinta de rosa",
  "Color in black": "Pinta de preto",
});

/** Italian (Italy) pack titles (chrome only). */
const PACK_TITLE_IT_IT = Object.freeze({
  colors: "Colori",
  animals: "Animali",
  family: "Famiglia",
  food: "Alimenti",
  school: "Scuola",
  body: "Corpo",
  home: "Casa",
  nature: "Natura",
  transport: "Trasporti",
  numbers: "Numeri",
  cvc: "Parole CVC",
  sight: "Parole frequenti",
});

/** French (France) pack titles (chrome only). */
const PACK_TITLE_FR_FR = Object.freeze({
  colors: "Couleurs",
  animals: "Animaux",
  family: "Famille",
  food: "Aliments",
  school: "École",
  body: "Corps",
  home: "Maison",
  nature: "Nature",
  transport: "Transports",
  numbers: "Nombres",
  cvc: "Mots CVC",
  sight: "Mots fréquents",
});

/** Dutch (Netherlands) pack titles (chrome only). */
const PACK_TITLE_NL_NL = Object.freeze({
  colors: "Kleuren",
  animals: "Dieren",
  family: "Familie",
  food: "Eten",
  school: "School",
  body: "Lichaam",
  home: "Huis",
  nature: "Natuur",
  transport: "Vervoer",
  numbers: "Getallen",
  cvc: "CVC-woorden",
  sight: "Veelvoorkomende woorden",
});

/** German (Germany) pack titles (chrome only). */
const PACK_TITLE_DE_DE = Object.freeze({
  colors: "Farben",
  animals: "Tiere",
  family: "Familie",
  food: "Lebensmittel",
  school: "Schule",
  body: "Körper",
  home: "Haus",
  nature: "Natur",
  transport: "Verkehrsmittel",
  numbers: "Zahlen",
  cvc: "CVC-Wörter",
  sight: "Häufige Wörter",
});

/** Russian (Russia) pack titles (chrome only). */
const PACK_TITLE_RU_RU = Object.freeze({
  colors: "Цвета",
  animals: "Животные",
  family: "Семья",
  food: "Еда",
  school: "Школа",
  body: "Тело",
  home: "Дом",
  nature: "Природа",
  transport: "Транспорт",
  numbers: "Числа",
  cvc: "Слова CVC",
  sight: "Часто употребляемые слова",
});

/** EN colorInstruction → it-IT (colors pack only). */
const COLOR_INSTRUCTION_IT_IT = Object.freeze({
  "Color in red": "Colora di rosso",
  "Color in blue": "Colora di blu",
  "Color in green": "Colora di verde",
  "Color in yellow": "Colora di giallo",
  "Color in orange": "Colora di arancione",
  "Color in purple": "Colora di viola",
  "Color in pink": "Colora di rosa",
  "Color in black": "Colora di nero",
});

/** EN colorInstruction → fr-FR (colors pack only). */
const COLOR_INSTRUCTION_FR_FR = Object.freeze({
  "Color in red": "Colorie en rouge",
  "Color in blue": "Colorie en bleu",
  "Color in green": "Colorie en vert",
  "Color in yellow": "Colorie en jaune",
  "Color in orange": "Colorie en orange",
  "Color in purple": "Colorie en violet",
  "Color in pink": "Colorie en rose",
  "Color in black": "Colorie en noir",
});

/** EN colorInstruction → nl-NL (colors pack only). */
const COLOR_INSTRUCTION_NL_NL = Object.freeze({
  "Color in red": "Kleur rood",
  "Color in blue": "Kleur blauw",
  "Color in green": "Kleur groen",
  "Color in yellow": "Kleur geel",
  "Color in orange": "Kleur oranje",
  "Color in purple": "Kleur paars",
  "Color in pink": "Kleur roze",
  "Color in black": "Kleur zwart",
});

/** EN colorInstruction → de-DE (colors pack only). */
const COLOR_INSTRUCTION_DE_DE = Object.freeze({
  "Color in red": "Male rot aus",
  "Color in blue": "Male blau aus",
  "Color in green": "Male grün aus",
  "Color in yellow": "Male gelb aus",
  "Color in orange": "Male orange aus",
  "Color in purple": "Male lila aus",
  "Color in pink": "Male rosa aus",
  "Color in black": "Male schwarz aus",
});

/** EN colorInstruction → ru-RU (colors pack only). */
const COLOR_INSTRUCTION_RU_RU = Object.freeze({
  "Color in red": "Раскрась красным",
  "Color in blue": "Раскрась синим",
  "Color in green": "Раскрась зелёным",
  "Color in yellow": "Раскрась жёлтым",
  "Color in orange": "Раскрась оранжевым",
  "Color in purple": "Раскрась фиолетовым",
  "Color in pink": "Раскрась розовым",
  "Color in black": "Раскрась чёрным",
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
 * @param {string} locale
 */
function isPtPt(locale) {
  const tag = String(locale || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  return tag === "pt-pt";
}

/**
 * @param {string} locale
 */
function isItIt(locale) {
  const tag = String(locale || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  return tag === "it-it";
}

/**
 * @param {string} locale
 */
function isFrFr(locale) {
  const tag = String(locale || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  return tag === "fr-fr";
}

/**
 * @param {string} locale
 */
function isNlNl(locale) {
  const tag = String(locale || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  return tag === "nl-nl";
}

/**
 * @param {string} locale
 */
function isDeDe(locale) {
  const tag = String(locale || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  return tag === "de-de";
}

/**
 * @param {string} locale
 */
function isRuRu(locale) {
  const tag = String(locale || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-");
  return tag === "ru-ru";
}

/**
 * @param {string|null|undefined} [contentLocale]
 */
export function resolveWritingWordPacks(contentLocale) {
  const locale = resolveContentLocale({ contentLocale });
  const chain = getContentFallbackChain(locale);
  const useEs = isEs419(locale) || chain.some((loc) => isEs419(loc));
  const usePtPt = chain.includes("pt-PT") || isPtPt(locale);
  const usePtBr = !usePtPt && (chain.includes("pt-BR") || isPtBr(locale));
  const useIt = chain.includes("it-IT") || isItIt(locale);
  const useFr = chain.includes("fr-FR") || isFrFr(locale);
  const useNl = chain.includes("nl-NL") || isNlNl(locale);
  const useDe = chain.includes("de-DE") || isDeDe(locale);
  const useRu = chain.includes("ru-RU") || isRuRu(locale);
  const titles = useRu
    ? PACK_TITLE_RU_RU
    : useDe
      ? PACK_TITLE_DE_DE
      : useIt
        ? PACK_TITLE_IT_IT
        : useFr
          ? PACK_TITLE_FR_FR
          : useNl
            ? PACK_TITLE_NL_NL
            : usePtPt
              ? PACK_TITLE_PT_PT
              : usePtBr
                ? PACK_TITLE_PT_BR
                : useEs
                  ? PACK_TITLE_ES_419
                  : PACK_TITLE_EN;
  const colorMap = useRu
    ? COLOR_INSTRUCTION_RU_RU
    : useDe
      ? COLOR_INSTRUCTION_DE_DE
      : useIt
        ? COLOR_INSTRUCTION_IT_IT
        : useFr
          ? COLOR_INSTRUCTION_FR_FR
          : useNl
            ? COLOR_INSTRUCTION_NL_NL
            : usePtPt
              ? COLOR_INSTRUCTION_PT_PT
              : usePtBr
                ? COLOR_INSTRUCTION_PT_BR
                : useEs
                  ? COLOR_INSTRUCTION_ES_419
                  : null;

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
