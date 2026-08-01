/**
 * Uruguay (es-UY) sparse meaning overrides for English learning words.
 * Inherit all other glosses from word-meanings/es-419.js via es-UY → es-419 → en.
 * Keys match WORD_LISTS English word IDs; only real Uruguay differences live here.
 *
 * Activation requires shared word-meanings locale chain wiring (not done in this layer).
 */

export const WORD_MEANINGS_ES_UY = {
  travel: {
    bus: "ómnibus",
  },
  community: {
    bus_stop: "parada de ómnibus",
  },
};
