/**
 * Colombia (es-CO) sparse meaning overrides for English learning words.
 * Inherit all other glosses from word-meanings/es-419.js via es-CO → es-419 → en.
 * Keys match WORD_LISTS English word IDs; only real Colombia differences live here.
 *
 * Activation requires shared word-meanings locale chain wiring (not done in this layer).
 */

export const WORD_MEANINGS_ES_CO = {
  colors: {
    brown: "café",
  },
  house: {
    computer: "computador",
  },
  technology: {
    computer: "computador",
    laptop: "computador portátil",
  },
};
