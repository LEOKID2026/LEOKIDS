/**
 * Indonesian (id-ID) writing word-pack chrome overlays.
 *
 * Learning targets (`text` / illustrationId / pack ids) stay English SoT
 * (`word-packs.en.js`). This module only localizes:
 * - pack titles (catalog/chrome)
 * - color instructions (colors pack)
 *
 * MAIN must import these maps into `word-packs.locale.js` (do not wire here).
 *
 * @module data/writing/word-packs.id-ID
 */

/** Stable pack ids → Indonesian display titles (instruction/chrome — not learning targets). */
export const PACK_TITLE_ID_ID = Object.freeze({
  colors: "Warna",
  animals: "Hewan",
  family: "Keluarga",
  food: "Makanan",
  school: "Sekolah",
  body: "Tubuh",
  home: "Rumah",
  nature: "Alam",
  transport: "Transportasi",
  numbers: "Angka",
  cvc: "Kata CVC",
  sight: "Kata sering dipakai",
});

/**
 * EN colorInstruction → id-ID (colors pack only).
 * Child-facing short instructions (`kamu` register where a verb addresses the child).
 */
export const COLOR_INSTRUCTION_ID_ID = Object.freeze({
  "Color in red": "Warnai merah",
  "Color in blue": "Warnai biru",
  "Color in green": "Warnai hijau",
  "Color in yellow": "Warnai kuning",
  "Color in orange": "Warnai oranye",
  "Color in purple": "Warnai ungu",
  "Color in pink": "Warnai merah muda",
  "Color in black": "Warnai hitam",
});

/** Pack id list parity helper (matches ENGLISH_WORD_PACK_IDS_ALL). */
export const WRITING_WORD_PACK_IDS_ID_ID = Object.freeze(Object.keys(PACK_TITLE_ID_ID));
